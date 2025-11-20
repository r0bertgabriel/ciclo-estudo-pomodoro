/**
 * Módulo de sincronização entre abas/janelas
 * Mantém o estado do timer sincronizado em todas as abas abertas
 */

class TabSync {
    constructor(timer) {
        this.timer = timer;
        this.SYNC_KEY = 'pomodoro_timer_state';
        this.isMaster = false;
        this.syncInterval = null;
        
        this.init();
    }

    init() {
        // Detectar se é a primeira aba (master)
        this.checkMasterTab();
        
        // Escutar mudanças no localStorage (de outras abas)
        window.addEventListener('storage', (e) => this.handleStorageChange(e));
        
        // Escutar eventos do timer local
        this.setupTimerListeners();
        
        // Carregar estado salvo ao abrir
        this.loadState();
        
        // Sincronizar periodicamente (apenas master)
        if (this.isMaster) {
            this.syncInterval = setInterval(() => this.saveState(), 1000);
        }
        
        // Limpar ao fechar
        window.addEventListener('beforeunload', () => this.cleanup());
        
        console.log('🔄 TabSync iniciado - Master:', this.isMaster);
    }

    checkMasterTab() {
        // Verificar se já existe uma aba master
        const lastUpdate = localStorage.getItem('pomodoro_master_heartbeat');
        const now = Date.now();
        
        // Se não existe ou está desatualizado (>3s), esta aba vira master
        if (!lastUpdate || (now - parseInt(lastUpdate)) > 3000) {
            this.isMaster = true;
            this.heartbeat();
            
            console.log('👑 TabSync: Esta aba é MASTER - controlará o timer');
            
            // Manter heartbeat
            setInterval(() => this.heartbeat(), 1000);
        } else {
            console.log('📺 TabSync: Esta aba é SECUNDÁRIA - apenas exibirá');
        }
    }

    heartbeat() {
        if (this.isMaster) {
            localStorage.setItem('pomodoro_master_heartbeat', Date.now().toString());
        }
    }

    setupTimerListeners() {
        // Apenas a aba master salva o estado
        if (!this.isMaster) return;
        
        const originalStart = this.timer.start.bind(this.timer);
        const originalPause = this.timer.pause.bind(this.timer);
        const originalResume = this.timer.resume.bind(this.timer);
        const originalReset = this.timer.reset.bind(this.timer);
        const originalSwitchMode = this.timer.switchMode.bind(this.timer);
        
        // Interceptar métodos para salvar estado
        this.timer.start = (...args) => {
            originalStart(...args);
            this.saveState();
        };
        
        this.timer.pause = () => {
            originalPause();
            this.saveState();
        };
        
        this.timer.resume = () => {
            originalResume();
            this.saveState();
        };
        
        this.timer.reset = () => {
            originalReset();
            this.saveState();
        };
        
        this.timer.switchMode = (...args) => {
            originalSwitchMode(...args);
            this.saveState();
        };
    }

    saveState() {
        if (!this.isMaster) return;
        
        const state = {
            isRunning: this.timer.isRunning,
            isPaused: this.timer.isPaused,
            currentMode: this.timer.currentMode,
            timeLeft: this.timer.timeLeft,
            totalTime: this.timer.totalTime,
            sessionCount: this.timer.sessionCount,
            completedPomodoros: this.timer.completedPomodoros,
            timestamp: Date.now()
        };
        
        // Salvar no localStorage para outras abas locais
        localStorage.setItem(this.SYNC_KEY, JSON.stringify(state));
        
        // Enviar para o servidor para sincronização com visualizadores remotos
        this.syncToServer(state);
    }
    
    async syncToServer(state) {
        try {
            // Importar dinamicamente para evitar erro se config não estiver carregado
            const { API_BASE_URL } = await import('./config.js');
            
            console.log('📤 TabSync: Enviando estado para servidor:', {
                timeLeft: state.timeLeft,
                isRunning: state.isRunning,
                isPaused: state.isPaused,
                currentMode: state.currentMode
            });
            
            const response = await fetch(`${API_BASE_URL}/api/timer/state`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state)
            });
            
            if (response.ok) {
                console.log('✅ TabSync: Estado enviado com sucesso');
            } else {
                console.warn('⚠️ TabSync: Erro ao enviar estado:', response.status);
            }
        } catch (error) {
            console.error('❌ TabSync: Erro ao sincronizar com servidor:', error);
        }
    }

    loadState() {
        const savedState = localStorage.getItem(this.SYNC_KEY);
        if (!savedState) return;
        
        try {
            const state = JSON.parse(savedState);
            
            // Verificar se o estado não está muito antigo (>5 min)
            if (Date.now() - state.timestamp > 300000) {
                console.log('⚠️ Estado muito antigo, ignorando');
                return;
            }
            
            this.applyState(state);
        } catch (e) {
            console.error('❌ Erro ao carregar estado:', e);
        }
    }

    handleStorageChange(e) {
        // Ignorar mudanças de outras chaves
        if (e.key !== this.SYNC_KEY) return;
        
        // Ignorar se esta aba é master (ela já tem o estado)
        if (this.isMaster) return;
        
        // Aplicar o novo estado
        if (e.newValue) {
            try {
                const state = JSON.parse(e.newValue);
                this.applyState(state);
                console.log('🔄 Estado sincronizado de outra aba');
            } catch (err) {
                console.error('❌ Erro ao sincronizar estado:', err);
            }
        }
    }

    applyState(state) {
        // Parar o timer local se estiver rodando (apenas master roda)
        if (this.timer.timerInterval && !this.isMaster) {
            clearInterval(this.timer.timerInterval);
            this.timer.timerInterval = null;
        }
        
        // Atualizar timer com o estado recebido
        this.timer.isRunning = state.isRunning;
        this.timer.isPaused = state.isPaused;
        this.timer.currentMode = state.currentMode;
        this.timer.timeLeft = state.timeLeft;
        this.timer.totalTime = state.totalTime;
        this.timer.sessionCount = state.sessionCount;
        this.timer.completedPomodoros = state.completedPomodoros;
        
        // Forçar atualização completa da UI
        this.updateUI();
        
        // Se está rodando e esta aba não é master, apenas mostrar
        // A aba master continua rodando o timer
        if (state.isRunning && !state.isPaused && !this.isMaster) {
            // Não iniciar o interval aqui, apenas exibir o estado
            // O estado será atualizado via storage events
        }
    }
    
    updateUI() {
        // Emitir eventos para atualizar a UI
        this.timer.emit('tick', {
            timeLeft: this.timer.timeLeft,
            totalTime: this.timer.totalTime,
            progress: ((this.timer.totalTime - this.timer.timeLeft) / this.timer.totalTime) * 100
        });
        
        // Atualizar botões e estado visual
        if (this.timer.isRunning && !this.timer.isPaused) {
            this.timer.emit('start', { mode: this.timer.currentMode });
        } else if (this.timer.isPaused) {
            this.timer.emit('pause');
        } else {
            this.timer.emit('stop');
        }
    }

    cleanup() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        // Se era master, limpar heartbeat
        if (this.isMaster) {
            localStorage.removeItem('pomodoro_master_heartbeat');
        }
    }
}

export default TabSync;
