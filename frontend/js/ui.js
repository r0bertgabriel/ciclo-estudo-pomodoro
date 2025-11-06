/**
 * Gerenciamento da Interface do Usuário
 */

import { COMPLETION_MESSAGES, DEFAULT_MESSAGES, MOTIVATIONAL_QUOTES, THEME_COLORS, TIMER_MODES } from './config.js';
import { Timer } from './timer.js';

export class UIManager {
    constructor() {
        this.elements = this.cacheElements();
        this.currentQuotePhase = 'start';
        this.quoteInterval = null;
        this.inFinalStretch = false;
    }

    /**
     * Cache de elementos DOM
     */
    cacheElements() {
        return {
            // Timer display
            timeDisplay: document.getElementById('timeDisplay'),
            sessionCount: document.getElementById('sessionCount'),
            motivationQuote: document.getElementById('motivationQuote'),
            progressFill: document.getElementById('progressFill'),
            timerDisplay: document.querySelector('.timer-display'),
            progressBar: document.querySelector('.progress-bar'),
            
            // Controls
            startBtn: document.getElementById('startBtn'),
            resetBtn: document.getElementById('resetBtn'),
            modeBtns: document.querySelectorAll('.mode-btn'),
            
            // Stats
            completedSessions: document.getElementById('completedSessions'),
            totalTime: document.getElementById('totalTime'),
            
            // Modal
            settingsBtn: document.getElementById('settingsBtn'),
            settingsModal: document.getElementById('settingsModal'),
            closeModal: document.getElementById('closeModal'),
            settingsForm: document.getElementById('settingsForm'),
            saveSettings: document.getElementById('saveSettings'),
            resetStats: document.getElementById('resetStats'),
            
            // Settings inputs
            focusTime: document.getElementById('focusTime'),
            focusValue: document.getElementById('focusValue'),
            shortBreakTime: document.getElementById('shortBreakTime'),
            shortBreakValue: document.getElementById('shortBreakValue'),
            longBreakTime: document.getElementById('longBreakTime'),
            longBreakValue: document.getElementById('longBreakValue'),
            sessionsBeforeLongBreak: document.getElementById('sessionsBeforeLongBreak'),
            sessionsValue: document.getElementById('sessionsValue'),
            autoStartBreaks: document.getElementById('autoStartBreaks'),
            autoStartPomodoros: document.getElementById('autoStartPomodoros'),
            notifications: document.getElementById('notifications'),
            alarmSound: document.getElementById('alarmSound')
        };
    }

    /**
     * Atualiza display do tempo
     * @param {number} seconds - Tempo em segundos
     */
    updateTimeDisplay(seconds) {
        const time = Timer.formatTime(seconds);
        const duration = Timer.formatDuration(seconds);
        
        this.elements.timeDisplay.textContent = time;
        this.elements.timeDisplay.setAttribute('datetime', duration);
    }

    /**
     * Atualiza progresso visual
     * @param {number} progress - Porcentagem de progresso (0-100)
     */
    updateProgress(progress) {
        // Atualizar barra de progresso
        this.elements.progressFill.style.width = `${progress}%`;
        this.elements.progressBar.setAttribute('aria-valuenow', Math.round(progress));
    }

    /**
     * Atualiza contador de sessões
     * @param {number} current - Sessão atual
     * @param {number} total - Total de sessões
     */
    updateSessionCount(current, total) {
        this.elements.sessionCount.textContent = `Sessão ${current} de ${total}`;
    }

    /**
     * Atualiza título da página
     * @param {string} time - Tempo formatado
     * @param {string} mode - Modo atual
     */
    updateTitle(time, mode) {
        const emoji = mode === TIMER_MODES.FOCUS ? '🍅' : '☕';
        document.title = `${emoji} ${time} - Pomodoro`;
    }

    /**
     * Atualiza botão de controle
     * @param {string} state - Estado do botão ('start', 'pause', 'resume')
     */
    updateStartButton(state) {
        const texts = {
            start: 'Iniciar',
            pause: 'Pausar',
            resume: 'Retomar'
        };
        
        this.elements.startBtn.querySelector('span').textContent = texts[state] || texts.start;
    }

    /**
     * Atualiza tema visual baseado no modo
     * @param {string} mode - Modo atual
     */
    updateTheme(mode) {
        // Converter camelCase para kebab-case para o CSS
        const cssMode = mode.replace(/([A-Z])/g, '-$1').toLowerCase();
        
        // Atualizar classes do body
        document.body.className = `${cssMode}-mode`;
        
        // Atualizar botões de modo
        this.elements.modeBtns.forEach(btn => {
            const isActive = btn.dataset.mode === mode;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive);
        });
        
        // Atualizar meta theme-color
        const colors = THEME_COLORS[mode];
        document.querySelector('meta[name="theme-color"]').setAttribute('content', colors.primary);
    }

    /**
     * Mostra frase motivacional
     * @param {string} mode - Modo atual
     * @param {string} phase - Fase ('start', 'running', 'almostDone')
     */
    showMotivationalQuote(mode, phase = 'running') {
        const quotes = MOTIVATIONAL_QUOTES[mode]?.[phase];
        if (!quotes || quotes.length === 0) return;

        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        
        this.elements.motivationQuote.style.opacity = '0';
        setTimeout(() => {
            this.elements.motivationQuote.textContent = randomQuote;
            this.elements.motivationQuote.style.opacity = '1';
        }, 300);
    }

    /**
     * Mostra mensagem padrão
     * @param {string} mode - Modo atual
     */
    showDefaultMessage(mode) {
        this.elements.motivationQuote.textContent = DEFAULT_MESSAGES[mode];
    }

    /**
     * Mostra mensagem de conclusão
     * @param {string} mode - Modo atual
     */
    showCompletionMessage(mode) {
        this.elements.motivationQuote.textContent = COMPLETION_MESSAGES[mode];
    }

    /**
     * Inicia rotação de frases motivacionais
     * @param {string} mode - Modo atual
     */
    startQuoteRotation(mode) {
        this.inFinalStretch = false;
        this.showMotivationalQuote(mode, 'start');
        
        this.quoteInterval = setInterval(() => {
            if (!this.inFinalStretch) {
                this.showMotivationalQuote(mode, 'running');
            }
        }, 30000); // A cada 30 segundos
    }

    /**
     * Para rotação de frases
     */
    stopQuoteRotation() {
        if (this.quoteInterval) {
            clearInterval(this.quoteInterval);
            this.quoteInterval = null;
        }
    }

    /**
     * Ativa estado de contagem regressiva final
     */
    activateFinalCountdown() {
        this.elements.timerDisplay.classList.add('final-countdown');
        this.elements.timeDisplay.classList.add('pulse-animation');
    }

    /**
     * Desativa estado de contagem regressiva final
     */
    deactivateFinalCountdown() {
        this.elements.timerDisplay.classList.remove('final-countdown');
        this.elements.timeDisplay.classList.remove('pulse-animation');
    }

    /**
     * Ativa animação de conclusão
     */
    activateCompletionAnimation() {
        this.elements.timerDisplay.classList.add('completed');
        setTimeout(() => {
            this.elements.timerDisplay.classList.remove('completed');
        }, 2000);
    }

    /**
     * Reseta progresso visual
     */
    resetProgress() {
        this.updateProgress(0);
        this.deactivateFinalCountdown();
    }

    /**
     * Atualiza estatísticas
     * @param {Object} stats - Estatísticas
     */
    updateStats(stats) {
        this.elements.completedSessions.textContent = stats.completedSessions;
        
        const hours = Math.floor(stats.totalMinutes / 60);
        const minutes = stats.totalMinutes % 60;
        this.elements.totalTime.textContent = `${hours}h ${minutes}m`;
    }

    /**
     * Abre modal de configurações
     */
    openSettings() {
        this.elements.settingsModal.showModal?.() || this.elements.settingsModal.setAttribute('open', '');
        this.elements.settingsModal.classList.add('active');
    }

    /**
     * Fecha modal de configurações
     */
    closeSettings() {
        this.elements.settingsModal.close?.() || this.elements.settingsModal.removeAttribute('open');
        this.elements.settingsModal.classList.remove('active');
    }

    /**
     * Carrega configurações na UI
     * @param {Object} settings - Configurações
     */
    loadSettings(settings) {
        this.elements.focusTime.value = settings.focusTime;
        this.elements.focusValue.textContent = settings.focusTime;
        
        this.elements.shortBreakTime.value = settings.shortBreakTime;
        this.elements.shortBreakValue.textContent = settings.shortBreakTime;
        
        this.elements.longBreakTime.value = settings.longBreakTime;
        this.elements.longBreakValue.textContent = settings.longBreakTime;
        
        this.elements.sessionsBeforeLongBreak.value = settings.sessionsBeforeLongBreak;
        this.elements.sessionsValue.textContent = settings.sessionsBeforeLongBreak;
        
        this.elements.autoStartBreaks.checked = settings.autoStartBreaks;
        this.elements.autoStartPomodoros.checked = settings.autoStartPomodoros;
        this.elements.notifications.checked = settings.notifications;
        this.elements.alarmSound.value = settings.alarmSound;
    }

    /**
     * Coleta configurações da UI
     * @returns {Object} Configurações
     */
    collectSettings() {
        return {
            focusTime: parseInt(this.elements.focusTime.value),
            shortBreakTime: parseInt(this.elements.shortBreakTime.value),
            longBreakTime: parseInt(this.elements.longBreakTime.value),
            sessionsBeforeLongBreak: parseInt(this.elements.sessionsBeforeLongBreak.value),
            autoStartBreaks: this.elements.autoStartBreaks.checked,
            autoStartPomodoros: this.elements.autoStartPomodoros.checked,
            notifications: this.elements.notifications.checked,
            alarmSound: this.elements.alarmSound.value
        };
    }

    /**
     * Configura listeners para inputs de configurações
     */
    setupSettingsInputs() {
        const rangeInputs = [
            { input: this.elements.focusTime, output: this.elements.focusValue },
            { input: this.elements.shortBreakTime, output: this.elements.shortBreakValue },
            { input: this.elements.longBreakTime, output: this.elements.longBreakValue },
            { input: this.elements.sessionsBeforeLongBreak, output: this.elements.sessionsValue }
        ];

        rangeInputs.forEach(({ input, output }) => {
            input.addEventListener('input', () => {
                output.textContent = input.value;
            });
        });
    }
}
