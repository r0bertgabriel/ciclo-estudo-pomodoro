/**
 * Gerenciamento de Notificações e Sons
 * Sistema de áudio totalmente offline usando Web Audio API
 */

import { SOUND_PROFILES } from './config.js';

export class NotificationManager {
    constructor() {
        this.hasPermission = false;
        this.audioContext = null;
        this.checkPermission();
    }

    /**
     * Verifica permissão de notificações
     */
    checkPermission() {
        if ('Notification' in window) {
            this.hasPermission = Notification.permission === 'granted';
        }
    }

    /**
     * Solicita permissão para notificações
     */
    async requestPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            const permission = await Notification.requestPermission();
            this.hasPermission = permission === 'granted';
            return this.hasPermission;
        }
        return this.hasPermission;
    }

    /**
     * Mostra notificação
     * @param {string} title - Título da notificação
     * @param {string} body - Corpo da notificação
     * @param {Object} options - Opções adicionais
     */
    show(title, body, options = {}) {
        if (!this.hasPermission || !('Notification' in window)) {
            return;
        }

        try {
            new Notification(title, {
                body,
                icon: options.icon || '🍅',
                tag: 'pomodoro',
                requireInteraction: options.requireInteraction || false,
                silent: true // Vamos controlar o som manualmente
            });
        } catch (error) {
            console.error('Erro ao mostrar notificação:', error);
        }
    }

    /**
     * Inicializa ou retorna o contexto de áudio
     */
    getAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioContext;
    }

    /**
     * Toca som de alarme (totalmente offline - Web Audio API)
     * @param {string} soundType - Tipo de som
     */
    playSound(soundType) {
        if (soundType === 'none') return;

        try {
            const profile = SOUND_PROFILES[soundType];
            
            if (!profile) {
                console.warn(`Som "${soundType}" não encontrado, usando bell`);
                this.playSound('bell');
                return;
            }

            this.playSoundProfile(profile);
        } catch (error) {
            console.error('Erro ao tocar som:', error);
        }
    }

    /**
     * Toca um perfil de som completo
     * @param {Object} profile - Perfil de som com notas
     */
    playSoundProfile(profile) {
        const audioContext = this.getAudioContext();
        let currentTime = audioContext.currentTime;

        profile.notes.forEach((note, index) => {
            this.playNote(
                note.freq,
                note.duration,
                note.type,
                note.volume,
                currentTime
            );
            currentTime += note.duration + 0.05; // Pequeno espaço entre notas
        });
    }

    /**
     * Toca uma nota individual
     * @param {number} frequency - Frequência da nota em Hz
     * @param {number} duration - Duração em segundos
     * @param {string} type - Tipo de onda (sine, square, sawtooth, triangle)
     * @param {number} volume - Volume (0-1)
     * @param {number} startTime - Tempo de início
     */
    playNote(frequency, duration, type = 'sine', volume = 0.3, startTime = 0) {
        const audioContext = this.getAudioContext();
        
        // Criar oscilador
        const oscillator = audioContext.createOscillator();
        oscillator.frequency.value = frequency;
        oscillator.type = type;

        // Criar nó de ganho (volume)
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01); // Attack
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration); // Decay/Release

        // Criar filtro para suavizar o som
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        filter.Q.value = 1;

        // Conectar os nós
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Iniciar e parar
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }

    /**
     * Toca um som de sucesso especial (para metas concluídas)
     */
    playSuccessSound() {
        this.playSound('celebration');
    }

    /**
     * Toca um som sutil (para pausas)
     */
    playBreakSound() {
        this.playSound('calm');
    }

    /**
     * Toca preview de um som
     * @param {string} soundType - Tipo de som para preview
     */
    previewSound(soundType) {
        this.playSound(soundType);
    }
}
