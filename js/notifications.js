/**
 * Gerenciamento de Notificações e Sons
 */

import { SOUND_FREQUENCIES } from './config.js';

export class NotificationManager {
    constructor() {
        this.hasPermission = false;
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
     * @param {string} icon - Ícone da notificação
     */
    show(title, body, icon = '🍅') {
        if (!this.hasPermission || !('Notification' in window)) {
            return;
        }

        try {
            new Notification(title, {
                body,
                icon,
                tag: 'pomodoro',
                requireInteraction: false
            });
        } catch (error) {
            console.error('Erro ao mostrar notificação:', error);
        }
    }

    /**
     * Toca som de alarme
     * @param {string} soundType - Tipo de som
     */
    playSound(soundType) {
        if (soundType === 'none') return;

        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            const frequencies = SOUND_FREQUENCIES[soundType] || SOUND_FREQUENCIES.bell;
            
            frequencies.forEach((freq, index) => {
                setTimeout(() => {
                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    
                    if (index === 0) {
                        oscillator.start(audioContext.currentTime);
                    }
                    if (index === frequencies.length - 1) {
                        oscillator.stop(audioContext.currentTime + 0.5);
                    }
                }, index * 300);
            });
        } catch (error) {
            console.error('Erro ao tocar som:', error);
        }
    }
}
