/**
 * Gerenciamento do Timer
 */

import { TIMER_MODES } from './config.js';

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
        if (this.timeLeft === 0) {
            this.timeLeft = minutes * 60;
            this.totalTime = this.timeLeft;
        }

        this.isRunning = true;
        this.isPaused = false;
        
        this.emit('start', { mode: this.currentMode });

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
    }

    /**
     * Para o timer
     */
    stop() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.timerInterval);
        this.emit('stop');
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
    }

    /**
     * Muda o modo do timer
     * @param {string} mode - Novo modo
     */
    setMode(mode) {
        this.currentMode = mode;
        this.emit('modeChange', { mode });
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
