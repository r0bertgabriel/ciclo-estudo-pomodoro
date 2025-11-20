/**
 * Módulo de sincronização para visualizadores (modo read-only via ngrok)
 * Sincroniza o estado do timer em tempo real com o servidor
 */

import { API_BASE_URL } from './config.js';

class ViewerSync {
    constructor(timer, isReadOnly) {
        this.timer = timer;
        this.isReadOnly = isReadOnly;
        this.syncInterval = null;
        this.lastSync = 0;
        this.SYNC_FREQUENCY = 500; // Sincronizar a cada 500ms para tempo real
        
        if (this.isReadOnly) {
            this.init();
        }
    }

    init() {
        console.log('👁️ ViewerSync: Iniciando modo visualização em tempo real');
        
        // Fazer primeira sincronização imediatamente
        this.syncFromServer();
        
        // Continuar sincronizando
        this.syncInterval = setInterval(() => {
            this.syncFromServer();
        }, this.SYNC_FREQUENCY);
        
        // Limpar ao sair
        window.addEventListener('beforeunload', () => this.cleanup());
    }

    async syncFromServer() {
        try {
            console.log('🔍 ViewerSync: Buscando estado do servidor...', API_BASE_URL);
            const response = await fetch(`${API_BASE_URL}/api/timer/state`);
            
            if (response.ok) {
                const state = await response.json();
                
                console.log('🔄 ViewerSync: Estado recebido do servidor:', {
                    timeLeft: state.timeLeft,
                    isRunning: state.isRunning,
                    isPaused: state.isPaused,
                    currentMode: state.currentMode
                });
                
                // Apenas aplicar se houver mudança
                if (this.hasStateChanged(state)) {
                    console.log('✅ ViewerSync: Aplicando mudanças no estado');
                    this.applyState(state);
                    this.lastSync = Date.now();
                } else {
                    console.log('ℹ️ ViewerSync: Estado inalterado');
                }
            } else {
                console.warn('⚠️ ViewerSync: Resposta não OK:', response.status);
            }
        } catch (error) {
            console.error('❌ ViewerSync: Erro ao sincronizar:', error);
        }
    }

    hasStateChanged(state) {
        // Verificar se o estado mudou
        return (
            this.timer.timeLeft !== state.timeLeft ||
            this.timer.isRunning !== state.isRunning ||
            this.timer.isPaused !== state.isPaused ||
            this.timer.currentMode !== state.currentMode
        );
    }

    applyState(state) {
        // Parar o timer local (apenas exibir)
        if (this.timer.timerInterval) {
            clearInterval(this.timer.timerInterval);
            this.timer.timerInterval = null;
        }
        
        // Atualizar estado do timer
        this.timer.timeLeft = state.timeLeft || 0;
        this.timer.totalTime = state.totalTime || 0;
        this.timer.isRunning = state.isRunning || false;
        this.timer.isPaused = state.isPaused || false;
        this.timer.currentMode = state.currentMode || 'focus';
        this.timer.sessionCount = state.sessionCount || 1;
        this.timer.completedPomodoros = state.completedPomodoros || 0;
        
        // Atualizar UI
        this.updateUI(state);
        
        console.log('🔄 ViewerSync: Estado sincronizado -', {
            timeLeft: this.timer.timeLeft,
            mode: this.timer.currentMode,
            running: this.timer.isRunning
        });
    }

    updateUI(state) {
        // Atualizar display de tempo
        this.timer.emit('tick', {
            timeLeft: state.timeLeft,
            totalTime: state.totalTime,
            progress: ((state.totalTime - state.timeLeft) / state.totalTime) * 100
        });
        
        // Atualizar modo visual
        if (state.isRunning && !state.isPaused) {
            this.timer.emit('start', { mode: state.currentMode });
        } else if (state.isPaused) {
            this.timer.emit('pause');
        } else {
            this.timer.emit('stop');
        }
        
        // Atualizar modo (focus/break/longBreak)
        document.dispatchEvent(new CustomEvent('modeChanged', {
            detail: { mode: state.currentMode }
        }));
    }

    cleanup() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            console.log('👁️ ViewerSync: Sincronização encerrada');
        }
    }
}

export default ViewerSync;
