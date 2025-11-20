/**
 * Módulo de animações de status e funcionalidades de streaming
 */

import { API_BASE_URL } from './config.js';

class StreamingFeatures {
    constructor() {
        this.counters = {
            today: 0,
            sessions: 0,
            streak: 0
        };
        this.sessionHistory = [];
        this.init();
    }

    init() {
        this.renderCounters();
        this.renderHistorySidebar();
        this.renderProgressBar();
        this.setupEventListeners();
        this.loadData();
    }

    renderCounters() {
        // Contadores removidos - funcionalidade desabilitada
    }

    renderHistorySidebar() {
        const sidebar = document.createElement('div');
        sidebar.className = 'session-history';
        sidebar.id = 'session-history';
        sidebar.innerHTML = `
            <div class="history-header">
                <h3 class="history-title">📚 Histórico</h3>
            </div>
            <div id="history-list"></div>
        `;
        document.body.appendChild(sidebar);

        const toggle = document.createElement('button');
        toggle.className = 'session-history-toggle';
        toggle.id = 'history-toggle';
        toggle.textContent = 'Histórico';
        toggle.onclick = () => sidebar.classList.toggle('active');
        document.body.appendChild(toggle);
    }

    renderProgressBar() {
        const existing = document.querySelector('.progress-section');
        if (existing) {
            const bigBar = document.createElement('div');
            bigBar.className = 'big-progress-bar';
            bigBar.innerHTML = `
                <div class="progress-header">
                    <span class="progress-title">Progresso Diário</span>
                    <span class="progress-stats" id="daily-progress-text">0 / 4 Pomodoros</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill-animated" id="daily-progress-fill" style="width: 0%"></div>
                </div>
            `;
            existing.parentElement.insertBefore(bigBar, existing);
        }
    }

    setupEventListeners() {
        // Escutar eventos de mudança de modo
        document.addEventListener('modeChanged', (e) => {
            this.animateModeChange(e.detail.mode);
        });

        // Escutar eventos de sessão completa
        document.addEventListener('sessionComplete', (e) => {
            this.handleSessionComplete(e.detail);
        });

        // Eventos de timer tick desabilitados - contadores removidos
        // document.addEventListener('timerTick', () => {
        //     this.updateCounters();
        // });
    }

    animateModeChange(mode) {
        const timerCard = document.querySelector('.timer-card');
        if (timerCard) {
            timerCard.classList.add('status-change');
            setTimeout(() => timerCard.classList.remove('status-change'), 800);
        }

        const display = document.querySelector('.timer-display');
        if (display) {
            display.classList.add('mode-transition');
            setTimeout(() => display.classList.remove('mode-transition'), 500);
        }
    }

    handleSessionComplete(data) {
        // Animação de completar
        const timerCard = document.querySelector('.timer-card');
        if (timerCard) {
            timerCard.classList.add('session-complete');
            setTimeout(() => timerCard.classList.remove('session-complete'), 1800);
        }

        // Confetes
        this.createConfetti();

        // Adicionar ao histórico
        this.addToHistory({
            time: new Date().toLocaleString('pt-BR'),
            subject: data.subject || 'Sem matéria',
            duration: data.duration || 25,
            type: data.type || 'work'
        });

        // Atualizar contadores - desabilitado
        // this.updateCounters();

        // Mostrar relatório se for fim de ciclo
        if (data.cycleComplete) {
            setTimeout(() => this.showReport(data), 2000);
        }
    }

    createConfetti() {
        const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.animationDelay = Math.random() * 0.5 + 's';
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 50);
        }
    }

    addToHistory(session) {
        this.sessionHistory.unshift(session);
        if (this.sessionHistory.length > 20) {
            this.sessionHistory.pop();
        }
        
        this.updateHistoryDisplay();
        this.saveToStorage();
    }

    updateHistoryDisplay() {
        const list = document.getElementById('history-list');
        if (!list) return;

        list.innerHTML = this.sessionHistory.map(session => `
            <div class="session-item session-entry">
                <div class="session-time">${session.time}</div>
                <div class="session-subject">${session.subject}</div>
                <div class="session-duration">${session.duration} minutos</div>
            </div>
        `).join('');
    }

    async updateCounters() {
        // Contadores desabilitados - funcionalidade removida
        // Apenas atualizar dados para o histórico se necessário
        try {
            const response = await fetch(`${API_BASE_URL}/api/stats/today`);
            if (response.ok) {
                const data = await response.json();
                // Atualizar barra de progresso
                this.updateDailyProgress(data.sessions_completed || 0);
            }
        } catch (error) {
            // Silenciar erro - contadores não estão mais no DOM
        }
    }

    updateDailyProgress(sessions) {
        const goal = 4; // Meta de 4 pomodoros por dia
        const percentage = Math.min((sessions / goal) * 100, 100);
        
        const fill = document.getElementById('daily-progress-fill');
        const text = document.getElementById('daily-progress-text');
        
        if (fill) fill.style.width = percentage + '%';
        if (text) text.textContent = `${sessions} / ${goal} Pomodoros`;
    }

    showReport(data) {
        const modal = document.createElement('div');
        modal.className = 'report-modal active';
        modal.innerHTML = `
            <div class="report-card">
                <div class="report-header">
                    <div class="report-emoji">🎉</div>
                    <h2 class="report-title">Ciclo Completo!</h2>
                    <p class="report-subtitle">Parabéns pelo seu progresso</p>
                </div>
                <div class="report-stats">
                    <div class="report-stat">
                        <div class="report-stat-value">${data.totalTime || 0}</div>
                        <div class="report-stat-label">Minutos</div>
                    </div>
                    <div class="report-stat">
                        <div class="report-stat-value">${data.sessions || 0}</div>
                        <div class="report-stat-label">Sessões</div>
                    </div>
                    <div class="report-stat">
                        <div class="report-stat-value">${data.subject || 'N/A'}</div>
                        <div class="report-stat-label">Matéria</div>
                    </div>
                    <div class="report-stat">
                        <div class="report-stat-value">${data.streak || 0}</div>
                        <div class="report-stat-label">Sequência</div>
                    </div>
                </div>
                <div class="report-actions">
                    <button class="report-btn secondary" onclick="this.closest('.report-modal').remove()">
                        Fechar
                    </button>
                    <button class="report-btn primary" onclick="streamingFeatures.exportReport(this)">
                        💾 Salvar Imagem
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    async exportReport(button) {
        try {
            const card = button.closest('.report-card');
            
            // Usar html2canvas se disponível
            if (window.html2canvas) {
                const canvas = await html2canvas(card);
                const link = document.createElement('a');
                link.download = `pomodoro-report-${Date.now()}.png`;
                link.href = canvas.toDataURL();
                link.click();
            } else {
                alert('Biblioteca html2canvas não carregada. Adicione no HTML.');
            }
        } catch (error) {
            console.error('Erro ao exportar relatório:', error);
        }
    }

    async loadData() {
        // Carregar do localStorage
        const saved = localStorage.getItem('streaming-features-data');
        if (saved) {
            const data = JSON.parse(saved);
            this.sessionHistory = data.history || [];
            this.updateHistoryDisplay();
        }
        
        // Contadores desabilitados - não carregar do backend
        // await this.updateCounters();
    }

    saveToStorage() {
        localStorage.setItem('streaming-features-data', JSON.stringify({
            history: this.sessionHistory
        }));
    }
}

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.streamingFeatures = new StreamingFeatures();
    });
} else {
    window.streamingFeatures = new StreamingFeatures();
}

export default StreamingFeatures;
