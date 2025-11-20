/**
 * Gerenciamento do Timer
 */

import { API_BASE_URL, TIMER_MODES } from './config.js';

export class Timer {
    constructor() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentMode = TIMER_MODES.FOCUS;
        this.timeLeft = 0;
        this.totalTime = 0;
        this.sessionCount = 1;
        this.completedPomodoros = 0;
        this.timerInterval = null;
        this.callbacks = {};
        this.isReadOnly = false; // Será definido externamente
        this.syncCounter = 0; // Contador para sincronizar a cada N ticks
    }
    
    /**
     * Sincroniza estado com o servidor (apenas se não for read-only)
     */
    async syncToServer() {
        console.log('🌐 Timer.syncToServer EXECUTANDO! isReadOnly:', this.isReadOnly);
        
        if (this.isReadOnly) {
            console.log('⏭️ Timer.syncToServer: Ignorando (modo read-only)');
            return;
        }
        
        console.log('✅ Timer.syncToServer: Modo controlador confirmado, continuando...');
        
        try {
            const state = {
                timeLeft: this.timeLeft,
                totalTime: this.totalTime,
                isRunning: this.isRunning,
                isPaused: this.isPaused,
                currentMode: this.currentMode,
                sessionCount: this.sessionCount,
                completedPomodoros: this.completedPomodoros,
                timestamp: Date.now()
            };
            
            console.log('📤 Timer.syncToServer: Enviando estado:', {
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
                console.log('✅ Timer.syncToServer: Estado enviado com sucesso');
            } else {
                console.warn('⚠️ Timer.syncToServer: Erro na resposta:', response.status);
            }
        } catch (error) {
            console.error('❌ Timer.syncToServer: Erro ao enviar:', error);
        }
    }

    /**
     * Registra callback para evento
     * @param {string} event - Nome do evento
     * @param {Function} callback - Função callback
     */
    on(event, callback) {
        this.callbacks[event] = callback;
    }

    /**
     * Dispara evento
     * @param {string} event - Nome do evento
     * @param {any} data - Dados do evento
     */
    emit(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event](data);
        }
    }

    /**
     * Inicia o timer
     * @param {number} minutes - Tempo em minutos
     */
    start(minutes) {
        console.log('🚀 Timer.start() chamado! isReadOnly:', this.isReadOnly, 'minutes:', minutes);
        if (this.timeLeft === 0) {
            this.timeLeft = minutes * 60;
            this.totalTime = this.timeLeft;
        }

        this.isRunning = true;
        this.isPaused = false;
        
        this.emit('start', { mode: this.currentMode });
        console.log('🔄 Timer.start: Prestes a chamar syncToServer...');
        this.syncToServer(); // Sincronizar ao iniciar
        console.log('✅ Timer.start: syncToServer foi chamado');

        this.timerInterval = setInterval(() => {
            this.tick();
        }, 1000);
    }

    /**
     * Pausa o timer
     */
    pause() {
        this.isRunning = false;
        this.isPaused = true;
        clearInterval(this.timerInterval);
        this.emit('pause');
        this.syncToServer(); // Sincronizar ao pausar
    }

    /**
     * Para o timer
     */
    stop() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.timerInterval);
        this.emit('stop');
        this.syncToServer(); // Sincronizar ao parar
    }

    /**
     * Reseta o timer
     * @param {number} minutes - Tempo em minutos
     */
    reset(minutes) {
        this.stop();
        this.timeLeft = minutes * 60;
        this.totalTime = this.timeLeft;
        this.emit('reset', { timeLeft: this.timeLeft, totalTime: this.totalTime });
        this.syncToServer(); // Sincronizar ao resetar
    }

    /**
     * Tick do timer
     */
    tick() {
        this.timeLeft--;
        
        const progress = ((this.totalTime - this.timeLeft) / this.totalTime) * 100;
        
        this.emit('tick', {
            timeLeft: this.timeLeft,
            totalTime: this.totalTime,
            progress,
            isFinalCountdown: this.timeLeft <= 10 && this.timeLeft > 0,
            isFinalStretch: this.timeLeft <= 180 && this.timeLeft > 10
        });
        
        // Sincronizar com servidor a cada 2 segundos
        this.syncCounter++;
        if (this.syncCounter >= 2) {
            this.syncCounter = 0;
            this.syncToServer();
        }
        
        // Disparar evento customizado para streaming features
        document.dispatchEvent(new CustomEvent('timerTick'));

        if (this.timeLeft <= 0) {
            this.complete();
        }
    }

    /**
     * Completa a sessão
     */
    complete() {
        this.stop();
        
        if (this.currentMode === TIMER_MODES.FOCUS) {
            this.completedPomodoros++;
        }

        this.emit('complete', {
            mode: this.currentMode,
            completedPomodoros: this.completedPomodoros
        });
        
        // Disparar evento customizado para streaming features
        document.dispatchEvent(new CustomEvent('sessionComplete', {
            detail: {
                type: this.currentMode,
                completedPomodoros: this.completedPomodoros,
                cycleComplete: this.completedPomodoros % 4 === 0
            }
        }));
    }

    /**
     * Muda o modo do timer
     * @param {string} mode - Novo modo
     */
    setMode(mode) {
        this.currentMode = mode;
        this.emit('modeChange', { mode });
        
        // Disparar evento customizado para streaming features
        document.dispatchEvent(new CustomEvent('modeChanged', {
            detail: { mode }
        }));
    }

    /**
     * Formata tempo em MM:SS
     * @param {number} seconds - Segundos
     * @returns {string} Tempo formatado
     */
    static formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    /**
     * Formata tempo para duração ISO 8601
     * @param {number} seconds - Segundos
     * @returns {string} Duração formatada
     */
    static formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        return `PT${minutes}M`;
    }

    /**
     * Retorna estado atual
     */
    getState() {
        return {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            currentMode: this.currentMode,
            timeLeft: this.timeLeft,
            totalTime: this.totalTime,
            sessionCount: this.sessionCount,
            completedPomodoros: this.completedPomodoros
        };
    }
}
