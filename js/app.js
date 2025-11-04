/**
 * Aplicação Principal Pomodoro Timer
 * Arquitetura modular com ES6+ e padrões modernos
 */

import { TIMER_MODES } from './config.js';
import { NotificationManager } from './notifications.js';
import { StorageManager } from './storage.js';
import { StudyCycle } from './study-cycle.js';
import { Timer } from './timer.js';
import { UIManager } from './ui.js';

class PomodoroApp {
    constructor() {
        try {
            // Inicializar componentes
            this.timer = new Timer();
            this.ui = new UIManager();
            this.storage = StorageManager;
            this.notifications = new NotificationManager();
            this.studyCycle = new StudyCycle();
            
            // Estado da aplicação
            this.settings = this.storage.loadSettings();
            this.stats = this.storage.loadStats();
            
            // Estado do ciclo de estudos
            this.selectedSubjectId = null;
            
            // Inicializar aplicação
            this.init();
        } catch (error) {
            console.error('❌ Erro ao inicializar aplicação:', error);
            alert('Erro ao carregar a aplicação. Por favor, recarregue a página.');
            throw error;
        }
    }

    /**
     * Inicializa a aplicação
     */
    init() {
        try {
            this.setupTimerEvents();
            this.setupUIEvents();
            this.setupCycleEvents();
            this.ui.setupSettingsInputs();
            this.loadInitialState();
            this.requestNotifications();
            
            // Atualizar display do ciclo após carregamento
            setTimeout(() => {
                this.updateCycleDisplay();
            }, 100);
            
            console.log('🍅 Pomodoro Timer iniciado com sucesso!');
        } catch (error) {
            console.error('❌ Erro durante inicialização:', error);
        }
    }

    /**
     * Configura eventos do timer
     */
    setupTimerEvents() {
        this.timer.on('start', () => {
            this.ui.updateStartButton('pause');
            this.ui.startQuoteRotation(this.timer.currentMode);
        });

        this.timer.on('pause', () => {
            this.ui.updateStartButton('resume');
            this.ui.stopQuoteRotation();
        });

        this.timer.on('stop', () => {
            this.ui.updateStartButton('start');
            this.ui.stopQuoteRotation();
        });

        this.timer.on('reset', ({ timeLeft, totalTime }) => {
            this.ui.updateTimeDisplay(timeLeft);
            this.ui.updateProgress(0);
            this.ui.updateTitle(Timer.formatTime(timeLeft), this.timer.currentMode);
            this.ui.resetProgress();
        });

        this.timer.on('tick', (data) => {
            this.ui.updateTimeDisplay(data.timeLeft);
            this.ui.updateProgress(data.progress);
            this.ui.updateTitle(Timer.formatTime(data.timeLeft), this.timer.currentMode);
            
            // Final countdown
            if (data.isFinalCountdown) {
                this.ui.activateFinalCountdown();
            } else {
                this.ui.deactivateFinalCountdown();
            }
            
            // Final stretch (últimos 3 minutos no modo foco)
            if (this.timer.currentMode === TIMER_MODES.FOCUS && data.isFinalStretch) {
                if (!this.ui.inFinalStretch) {
                    this.ui.inFinalStretch = true;
                    this.ui.showMotivationalQuote(this.timer.currentMode, 'almostDone');
                }
            }
        });

        this.timer.on('complete', (data) => {
            this.handleTimerCompletion(data);
        });

        this.timer.on('modeChange', ({ mode }) => {
            this.ui.updateTheme(mode);
            this.timer.reset(this.getTimeForMode(mode));
            this.ui.updateTimeDisplay(this.timer.timeLeft);
            this.ui.showDefaultMessage(mode);
            this.updateSessionDisplay();
            this.toggleSubjectSelector();
        });
    }

    /**
     * Configura eventos da UI
     */
    setupUIEvents() {
        // Botão Iniciar/Pausar
        this.ui.elements.startBtn.addEventListener('click', () => {
            this.toggleTimer();
        });

        // Botão Resetar
        this.ui.elements.resetBtn.addEventListener('click', () => {
            this.resetTimer();
        });

        // Botões de modo
        this.ui.elements.modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchMode(btn.dataset.mode);
            });
        });

        // Modal de configurações
        this.ui.elements.settingsBtn.addEventListener('click', () => {
            this.openSettings();
        });

        this.ui.elements.closeModal.addEventListener('click', () => {
            this.ui.closeSettings();
        });

        // Fechar modal ao clicar fora
        this.ui.elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.ui.elements.settingsModal) {
                this.ui.closeSettings();
            }
        });

        // Salvar configurações
        this.ui.elements.settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings();
        });

        // Resetar estatísticas
        this.ui.elements.resetStats.addEventListener('click', () => {
            this.resetStats();
        });

        // Subject selector
        const subjectSelect = document.getElementById('subjectSelect');
        if (subjectSelect) {
            subjectSelect.addEventListener('change', (e) => {
                this.handleSubjectSelection(e.target.value);
            });
        }

        // Atalho de teclado (Espaço)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isModalOpen()) {
                e.preventDefault();
                this.toggleTimer();
            }
        });

        // Prevenir fechamento acidental com timer ativo
        window.addEventListener('beforeunload', (e) => {
            if (this.timer.isRunning) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    /**
     * Carrega estado inicial
     */
    loadInitialState() {
        // Carregar configurações na UI
        this.ui.loadSettings(this.settings);
        
        // Carregar tema
        this.ui.updateTheme(this.timer.currentMode);
        
        // Carregar tempo inicial
        const initialTime = this.getTimeForMode(this.timer.currentMode);
        this.timer.reset(initialTime);
        this.ui.updateTimeDisplay(this.timer.timeLeft);
        
        // Carregar disciplinas no seletor
        this.updateSubjectSelector();
        
        // Mostrar/esconder seletor baseado no modo
        this.toggleSubjectSelector();
        
        // Carregar mensagem inicial
        this.ui.showDefaultMessage(this.timer.currentMode);
        
        // Carregar estatísticas
        this.ui.updateStats(this.stats);
        
        // Atualizar display de sessões
        this.updateSessionDisplay();
    }

    /**
     * Alterna timer (iniciar/pausar)
     */
    toggleTimer() {
        if (this.timer.isRunning) {
            this.timer.pause();
        } else {
            // Verificar se está no modo foco e precisa de disciplina selecionada
            if (this.timer.currentMode === TIMER_MODES.FOCUS) {
                if (!this.selectedSubjectId) {
                    alert('Por favor, selecione uma disciplina antes de iniciar o estudo!');
                    return;
                }
                
                // Verificar se a disciplina ainda tem tempo disponível
                if (!this.studyCycle.hasTimeAvailable(this.selectedSubjectId)) {
                    alert('Esta disciplina já atingiu o limite de horas semanais!');
                    return;
                }
            }
            
            const time = this.getTimeForMode(this.timer.currentMode);
            this.timer.start(time);
        }
    }

    /**
     * Reseta o timer
     */
    resetTimer() {
        if (this.timer.isRunning && !confirm('O timer está rodando. Deseja reiniciar?')) {
            return;
        }
        
        const time = this.getTimeForMode(this.timer.currentMode);
        this.timer.reset(time);
        this.ui.showDefaultMessage(this.timer.currentMode);
    }

    /**
     * Muda modo do timer
     */
    switchMode(mode) {
        if (this.timer.isRunning && !confirm('O timer está rodando. Deseja mudar de modo?')) {
            return;
        }
        
        this.timer.setMode(mode);
    }

    /**
     * Trata conclusão do timer
     */
    handleTimerCompletion(data) {
        // Animação de conclusão
        this.ui.activateCompletionAnimation();
        
        // Mostrar mensagem de conclusão
        this.ui.showCompletionMessage(data.mode);
        
        // Tocar som
        if (this.settings.notifications) {
            this.notifications.playSound(this.settings.alarmSound);
        }
        
        // Mostrar notificação
        if (this.settings.notifications) {
            this.showCompletionNotification(data.mode);
        }
        
        // Atualizar estatísticas
        if (data.mode === TIMER_MODES.FOCUS) {
            this.stats.completedSessions++;
            this.stats.totalMinutes += this.settings.focusTime;
            this.storage.saveStats(this.stats);
            this.ui.updateStats(this.stats);
            
            // Registrar sessão no ciclo de estudos
            if (this.selectedSubjectId) {
                const success = this.studyCycle.recordSession(
                    this.selectedSubjectId, 
                    this.settings.focusTime
                );
                
                if (success) {
                    // Atualizar informações da disciplina
                    this.updateSubjectInfo(this.selectedSubjectId);
                    this.updateSubjectSelector();
                    this.updateCycleDisplay();
                    this.updateCycleStats();
                }
                
                // Limpar seleção para forçar nova escolha
                this.selectedSubjectId = null;
                const select = document.getElementById('subjectSelect');
                if (select) select.value = '';
                this.updateSubjectInfo(null);
            }
        }
        
        // Determinar próximo modo
        const nextMode = this.getNextMode(data.mode, data.completedPomodoros);
        
        // Auto-start
        const shouldAutoStart = this.shouldAutoStart(data.mode);
        
        if (shouldAutoStart) {
            setTimeout(() => {
                this.timer.setMode(nextMode);
                const time = this.getTimeForMode(nextMode);
                this.timer.start(time);
            }, 2000);
        } else {
            this.timer.setMode(nextMode);
        }
        
        // Atualizar display de sessões
        this.updateSessionDisplay();
    }

    /**
     * Determina próximo modo
     */
    getNextMode(currentMode, completedPomodoros) {
        if (currentMode === TIMER_MODES.FOCUS) {
            const isLongBreak = completedPomodoros % this.settings.sessionsBeforeLongBreak === 0;
            return isLongBreak ? TIMER_MODES.LONG_BREAK : TIMER_MODES.SHORT_BREAK;
        }
        return TIMER_MODES.FOCUS;
    }

    /**
     * Verifica se deve auto-iniciar
     */
    shouldAutoStart(currentMode) {
        if (currentMode === TIMER_MODES.FOCUS) {
            return this.settings.autoStartBreaks;
        }
        return this.settings.autoStartPomodoros;
    }

    /**
     * Retorna tempo para o modo
     */
    getTimeForMode(mode) {
        const timeMap = {
            [TIMER_MODES.FOCUS]: this.settings.focusTime,
            [TIMER_MODES.SHORT_BREAK]: this.settings.shortBreakTime,
            [TIMER_MODES.LONG_BREAK]: this.settings.longBreakTime
        };
        return timeMap[mode];
    }

    /**
     * Atualiza display de sessões
     */
    updateSessionDisplay() {
        const currentInCycle = ((this.timer.completedPomodoros) % this.settings.sessionsBeforeLongBreak) + 1;
        this.ui.updateSessionCount(currentInCycle, this.settings.sessionsBeforeLongBreak);
    }

    /**
     * Mostra notificação de conclusão
     */
    showCompletionNotification(mode) {
        const notifications = {
            [TIMER_MODES.FOCUS]: {
                title: '🎉 Pomodoro Concluído!',
                body: 'Ótimo trabalho! Hora de fazer uma pausa.'
            },
            [TIMER_MODES.SHORT_BREAK]: {
                title: '☕ Pausa Concluída!',
                body: 'Pausa finalizada! Pronto para o próximo pomodoro?'
            },
            [TIMER_MODES.LONG_BREAK]: {
                title: '🌟 Pausa Longa Concluída!',
                body: 'Ótimo descanso! Vamos começar um novo ciclo?'
            }
        };

        const { title, body } = notifications[mode];
        this.notifications.show(title, body);
    }

    /**
     * Solicita permissão para notificações
     */
    async requestNotifications() {
        if (this.settings.notifications) {
            await this.notifications.requestPermission();
        }
    }

    /**
     * Abre configurações
     */
    openSettings() {
        this.ui.loadSettings(this.settings);
        this.ui.openSettings();
    }

    /**
     * Salva configurações
     */
    saveSettings() {
        this.settings = this.ui.collectSettings();
        this.storage.saveSettings(this.settings);
        
        // Atualizar timer se não estiver rodando
        if (!this.timer.isRunning) {
            const time = this.getTimeForMode(this.timer.currentMode);
            this.timer.reset(time);
        }
        
        // Atualizar display de sessões
        this.updateSessionDisplay();
        
        this.ui.closeSettings();
    }

    /**
     * Reseta estatísticas
     */
    resetStats() {
        if (!confirm('Tem certeza que deseja limpar todas as estatísticas?')) {
            return;
        }
        
        this.storage.clearStats();
        this.stats = this.storage.loadStats();
        this.ui.updateStats(this.stats);
    }

    /**
     * Verifica se modal está aberto
     */
    isModalOpen() {
        return this.ui.elements.settingsModal.hasAttribute('open') || 
               this.ui.elements.settingsModal.classList.contains('active');
    }

    /**
     * Configura eventos do ciclo de estudos
     */
    setupCycleEvents() {
        // Botão abrir modal ciclo
        const cycleBtn = document.getElementById('cycleBtn');
        const cycleModal = document.getElementById('cycleModal');
        const closeCycleModal = document.getElementById('closeCycleModal');
        
        cycleBtn?.addEventListener('click', () => {
            this.openCycleModal();
        });
        
        closeCycleModal?.addEventListener('click', () => {
            this.closeCycleModal();
        });
        
        cycleModal?.addEventListener('click', (e) => {
            if (e.target === cycleModal) {
                this.closeCycleModal();
            }
        });

        // Seletor de ciclo ativo
        const cycleSelect = document.getElementById('cycleSelect');
        cycleSelect?.addEventListener('change', (e) => {
            this.studyCycle.setActiveCycle(e.target.value);
            this.updateSubjectSelector();
            this.renderSubjectsList();
            this.updateCycleStats();
            this.updateCycleDisplay();
        });

        // Botões de gerenciamento de ciclo
        document.getElementById('newCycleBtn')?.addEventListener('click', () => {
            this.openCycleFormModal();
        });

        document.getElementById('editCycleBtn')?.addEventListener('click', () => {
            this.openCycleFormModal(true);
        });

        document.getElementById('deleteCycleBtn')?.addEventListener('click', () => {
            this.deleteCycle();
        });

        // Modal de formulário de ciclo
        const cycleFormModal = document.getElementById('cycleFormModal');
        const closeCycleFormModal = document.getElementById('closeCycleFormModal');
        const cancelCycleForm = document.getElementById('cancelCycleForm');

        closeCycleFormModal?.addEventListener('click', () => {
            this.closeCycleFormModal();
        });

        cancelCycleForm?.addEventListener('click', () => {
            this.closeCycleFormModal();
        });

        // Submissão do formulário de ciclo
        const cycleForm = document.getElementById('cycleForm');
        cycleForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCycleForm();
        });
        
        // Form adicionar disciplina
        const addSubjectForm = document.getElementById('addSubjectForm');
        addSubjectForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSubject();
        });
        
        // Exportar ciclo
        document.getElementById('exportCycle')?.addEventListener('click', () => {
            this.exportCycle();
        });
        
        // Importar ciclo
        document.getElementById('importCycle')?.addEventListener('click', () => {
            this.importCycle();
        });
    }

    /**
     * Abre modal do ciclo
     */
    openCycleModal() {
        const cycleModal = document.getElementById('cycleModal');
        cycleModal?.showModal?.() || cycleModal?.setAttribute('open', '');
        cycleModal?.classList.add('active');
        
        this.loadCycleSelector();
        this.renderSubjectsList();
        this.updateCycleStats();
    }

    /**
     * Fecha modal do ciclo
     */
    closeCycleModal() {
        const cycleModal = document.getElementById('cycleModal');
        cycleModal?.close?.() || cycleModal?.removeAttribute('open');
        cycleModal?.classList.remove('active');
    }

    /**
     * Carrega o seletor de ciclos
     */
    loadCycleSelector() {
        const select = document.getElementById('cycleSelect');
        if (!select) return;

        const cycles = this.studyCycle.getAllCycles();
        select.innerHTML = '';

        cycles.forEach(cycle => {
            const option = document.createElement('option');
            option.value = cycle.id;
            option.textContent = cycle.name;
            if (cycle.active) option.selected = true;
            select.appendChild(option);
        });
    }

    /**
     * Abre modal de formulário de ciclo
     */
    openCycleFormModal(isEdit = false) {
        const modal = document.getElementById('cycleFormModal');
        const title = document.getElementById('cycleFormTitle');
        const form = document.getElementById('cycleForm');

        if (isEdit) {
            const cycle = this.studyCycle.getActiveCycle();
            if (!cycle) return;

            title.textContent = 'Editar Ciclo';
            document.getElementById('cycleName').value = cycle.name;

            // Marcar dias da semana
            const checkboxes = document.querySelectorAll('input[name="studyDays"]');
            checkboxes.forEach(cb => {
                cb.checked = cycle.studyDays.includes(cb.value);
            });

            form.dataset.editing = cycle.id;
        } else {
            title.textContent = 'Novo Ciclo';
            form.reset();
            delete form.dataset.editing;
        }

        modal?.showModal?.() || modal?.setAttribute('open', '');
        modal?.classList.add('active');
    }

    /**
     * Fecha modal de formulário de ciclo
     */
    closeCycleFormModal() {
        const modal = document.getElementById('cycleFormModal');
        modal?.close?.() || modal?.removeAttribute('open');
        modal?.classList.remove('active');
    }

    /**
     * Salva formulário de ciclo
     */
    saveCycleForm() {
        const form = document.getElementById('cycleForm');
        const name = document.getElementById('cycleName').value.trim();
        
        if (!name) {
            alert('Por favor, digite um nome para o ciclo');
            return;
        }

        // Coletar dias selecionados
        const studyDays = Array.from(document.querySelectorAll('input[name="studyDays"]:checked'))
            .map(cb => cb.value);

        if (studyDays.length === 0) {
            alert('Por favor, selecione pelo menos um dia da semana');
            return;
        }

        if (form.dataset.editing) {
            // Editar ciclo existente
            this.studyCycle.editCycle(form.dataset.editing, { name, studyDays });
        } else {
            // Criar novo ciclo
            this.studyCycle.createCycle({ name, studyDays });
        }

        this.closeCycleFormModal();
        this.loadCycleSelector();
        this.updateSubjectSelector();
        this.updateCycleDisplay();
    }

    /**
     * Deleta o ciclo ativo
     */
    deleteCycle() {
        const cycle = this.studyCycle.getActiveCycle();
        if (!cycle) return;

        if (!confirm(`Tem certeza que deseja deletar o ciclo "${cycle.name}"?`)) {
            return;
        }

        const success = this.studyCycle.removeCycle(cycle.id);
        if (success) {
            this.loadCycleSelector();
            this.renderSubjectsList();
            this.updateCycleStats();
            this.updateSubjectSelector();
            this.updateCycleDisplay();
        } else {
            alert('Não é possível deletar o último ciclo!');
        }
    }

    /**
     * Adiciona nova disciplina
     */
    addSubject() {
        const nameInput = document.getElementById('subjectName');
        const weeklyHoursInput = document.getElementById('subjectWeeklyHours');
        const colorInput = document.getElementById('subjectColor');
        const prioritySelect = document.getElementById('subjectPriority');
        const submitBtn = document.querySelector('#addSubjectForm button[type="submit"]');
        
        const name = nameInput.value.trim();
        const weeklyHours = parseInt(weeklyHoursInput.value);
        
        if (!name) {
            alert('Por favor, digite o nome da disciplina');
            return;
        }
        
        if (!weeklyHours || weeklyHours < 1) {
            alert('Por favor, defina as horas semanais (mínimo 1 hora)');
            return;
        }
        
        // Verificar se está editando
        const editingId = submitBtn?.dataset.editingId;
        
        if (editingId) {
            // Modo edição
            const cycle = this.studyCycle.getActiveCycle();
            if (cycle) {
                const subject = cycle.subjects.find(s => s.id === editingId);
                if (subject) {
                    subject.name = name;
                    subject.weeklyHours = weeklyHours;
                    subject.color = colorInput.value;
                    subject.priority = parseInt(prioritySelect.value);
                    this.studyCycle.saveCycles();
                    alert('✅ Disciplina atualizada com sucesso!');
                }
            }
            
            // Resetar botão
            submitBtn.textContent = '➕ Adicionar Disciplina';
            delete submitBtn.dataset.editingId;
        } else {
            // Modo adicionar
            this.studyCycle.addSubject({
                name,
                weeklyHours,
                color: colorInput.value,
                priority: parseInt(prioritySelect.value)
            });
        }
        
        // Limpar form
        nameInput.value = '';
        weeklyHoursInput.value = '2';
        colorInput.value = '#3498db';
        prioritySelect.value = '3';
        
        // Atualizar displays
        this.renderSubjectsList();
        this.updateCycleDisplay();
        this.updateCycleStats();
        this.updateSubjectSelector();
    }

    /**
     * Renderiza lista de disciplinas
     */
    renderSubjectsList() {
        const container = document.getElementById('subjectsList');
        if (!container) return;
        
        const cycle = this.studyCycle.getActiveCycle();
        if (!cycle || cycle.subjects.length === 0) {
            container.innerHTML = '<p class="cycle-empty">Nenhuma disciplina adicionada ainda.</p>';
            return;
        }
        
        container.innerHTML = cycle.subjects.map(subject => {
            const stats = this.studyCycle.getSubjectStats(subject.id);
            const progressPercent = stats.weeklyProgress.toFixed(1);
            const studiedHours = Math.floor(stats.currentWeekMinutes / 60);
            const studiedMins = stats.currentWeekMinutes % 60;
            
            return `
                <div class="subject-item" data-id="${subject.id}">
                    <div class="subject-color" style="background: ${subject.color}"></div>
                    <div class="subject-info">
                        <div class="subject-name">${this.escapeHtml(subject.name)}</div>
                        <div class="subject-meta">
                            <span>Prioridade: ${subject.priority}</span>
                            <span>🎯 ${stats.weeklyHours}h/semana</span>
                            <span>📚 ${studiedHours}h ${studiedMins}m esta semana (${progressPercent}%)</span>
                        </div>
                        <div class="subject-progress-week">
                            <div class="progress-bar-mini">
                                <div class="progress-fill-mini" style="width: ${progressPercent}%; background: ${subject.color}"></div>
                            </div>
                        </div>
                    </div>
                    <div class="subject-actions">
                        <button class="icon-btn small" onclick="window.pomodoroApp.editSubject('${subject.id}')" title="Editar disciplina">
                            ✏️
                        </button>
                        <button class="icon-btn small" onclick="window.pomodoroApp.adjustSubjectTime('${subject.id}')" title="Ajustar tempo manualmente">
                            ⏱️
                        </button>
                        <button class="icon-btn small" onclick="window.pomodoroApp.jumpToSubject('${subject.id}')" title="Ir para esta disciplina">
                            ➜
                        </button>
                        <button class="icon-btn small danger" onclick="window.pomodoroApp.removeSubject('${subject.id}')" title="Remover">
                            ✕
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Atualiza display do ciclo (disciplina atual)
     */
    updateCycleDisplay() {
        const cycle = this.studyCycle.getActiveCycle();
        const container = document.getElementById('currentSubject');
        const section = document.getElementById('cycleSection');
        
        if (!container || !section) {
            console.warn('Elementos do ciclo não encontrados no DOM');
            return;
        }
        
        if (!cycle || cycle.subjects.length === 0) {
            if (container) container.innerHTML = '<span class="cycle-empty">Nenhum ciclo configurado</span>';
            if (section) section.style.display = 'none';
            return;
        }
        
        section.style.display = 'block';
        
        // Mostrar informações do ciclo ativo
        const totalSubjects = cycle.subjects.length;
        const totalWeeklyHours = cycle.subjects.reduce((sum, s) => sum + s.weeklyHours, 0);
        const studiedThisWeek = cycle.subjects.reduce((sum, s) => sum + s.currentWeekMinutes, 0);
        const weeklyProgress = totalWeeklyHours > 0 
            ? Math.round((studiedThisWeek / (totalWeeklyHours * 60)) * 100) 
            : 0;
        
        container.innerHTML = `
            <div class="cycle-subject-card">
                <div class="cycle-subject-name">
                    📚 ${this.escapeHtml(cycle.name)}
                </div>
                <div class="cycle-subject-stats">
                    <span>${totalSubjects} disciplinas</span>
                    <span>🎯 Meta: ${totalWeeklyHours}h/semana</span>
                    <span>📊 Progresso: ${weeklyProgress}%</span>
                </div>
            </div>
        `;
    }
    
    /**
     * Escapa HTML para prevenir XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Atualiza estatísticas do ciclo
     */
    updateCycleStats() {
        const container = document.getElementById('cycleStats');
        if (!container) return;
        
        const allStats = this.studyCycle.getAllStats();
        
        if (allStats.length === 0) {
            container.innerHTML = '<p class="cycle-empty">Nenhuma estatística disponível.</p>';
            return;
        }
        
        container.innerHTML = allStats.map(stats => {
            const weekHours = Math.floor(stats.currentWeekMinutes / 60);
            const weekMins = stats.currentWeekMinutes % 60;
            const remainingHours = Math.floor(stats.remainingMinutes / 60);
            const remainingMins = stats.remainingMinutes % 60;
            const progressColor = stats.weeklyProgress >= 100 ? '#27ae60' : stats.color;
            
            return `
            <div class="cycle-stat-card">
                <div class="cycle-stat-header" style="background: ${stats.color}20">
                    <span class="cycle-stat-name">${this.escapeHtml(stats.name)}</span>
                </div>
                <div class="cycle-stat-body">
                    <div class="cycle-stat-item">
                        <span class="cycle-stat-label">Meta Semanal</span>
                        <span class="cycle-stat-value">${stats.weeklyHours}h</span>
                    </div>
                    <div class="cycle-stat-item">
                        <span class="cycle-stat-label">Estudado esta semana</span>
                        <span class="cycle-stat-value">${weekHours}h ${weekMins}m</span>
                    </div>
                    <div class="cycle-stat-item">
                        <span class="cycle-stat-label">Progresso</span>
                        <span class="cycle-stat-value" style="color: ${progressColor}">${stats.weeklyProgress.toFixed(1)}%</span>
                    </div>
                    <div class="cycle-stat-item">
                        <span class="cycle-stat-label">Restante</span>
                        <span class="cycle-stat-value">${remainingHours}h ${remainingMins}m</span>
                    </div>
                    <div class="cycle-stat-item">
                        <span class="cycle-stat-label">Total Acumulado</span>
                        <span class="cycle-stat-value">${stats.totalHours}h ${stats.totalMinutes % 60}m</span>
                    </div>
                    ${stats.lastStudied ? `
                        <div class="cycle-stat-item">
                            <span class="cycle-stat-label">Última sessão</span>
                            <span class="cycle-stat-value">${this.formatLastStudied(stats.lastStudied)}</span>
                        </div>
                    ` : ''}
                    <div class="progress-bar-mini" style="margin-top: var(--spacing-sm)">
                        <div class="progress-fill-mini" style="width: ${Math.min(100, stats.weeklyProgress)}%; background: ${progressColor}"></div>
                    </div>
                </div>
            </div>
        `}).join('');
    }

    /**
     * Formata data de último estudo
     */
    formatLastStudied(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffDays === 0) {
            if (diffHours === 0) return 'Agora';
            return `${diffHours}h atrás`;
        }
        if (diffDays === 1) return 'Ontem';
        return `${diffDays} dias atrás`;
    }

    /**
     * Remove disciplina
     */
    removeSubject(subjectId) {
        if (!confirm('Tem certeza que deseja remover esta disciplina?')) {
            return;
        }
        
        this.studyCycle.removeSubject(subjectId);
        this.renderSubjectsList();
        this.updateCycleDisplay();
        this.updateCycleStats();
        this.updateSubjectSelector();
    }

    /**
     * Edita uma disciplina existente
     */
    editSubject(subjectId) {
        const cycle = this.studyCycle.getActiveCycle();
        if (!cycle) return;
        
        const subject = cycle.subjects.find(s => s.id === subjectId);
        if (!subject) return;
        
        // Preencher o formulário com os dados atuais
        const nameInput = document.getElementById('subjectName');
        const hoursInput = document.getElementById('subjectWeeklyHours');
        const colorInput = document.getElementById('subjectColor');
        const prioritySelect = document.getElementById('subjectPriority');
        
        if (nameInput) nameInput.value = subject.name;
        if (hoursInput) hoursInput.value = subject.weeklyHours;
        if (colorInput) colorInput.value = subject.color;
        if (prioritySelect) prioritySelect.value = subject.priority;
        
        // Mudar texto do botão
        const submitBtn = document.querySelector('#addSubjectForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = '💾 Salvar Alterações';
            submitBtn.dataset.editingId = subjectId;
        }
        
        // Scroll para o formulário
        document.getElementById('addSubjectForm')?.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Pula para uma disciplina específica
     */
    jumpToSubject(subjectId) {
        this.studyCycle.jumpToSubject(subjectId);
        this.renderSubjectsList();
        this.updateCycleDisplay();
        this.updateSubjectSelector();
        this.closeCycleModal();
    }

    /**
     * Ajusta tempo manualmente para uma disciplina
     */
    adjustSubjectTime(subjectId) {
        const cycle = this.studyCycle.getActiveCycle();
        if (!cycle) return;
        
        const subject = cycle.subjects.find(s => s.id === subjectId);
        if (!subject) return;
        
        const stats = this.studyCycle.getSubjectStats(subjectId);
        const currentHours = Math.floor(stats.currentWeekMinutes / 60);
        const currentMins = stats.currentWeekMinutes % 60;
        
        const minutes = prompt(
            `Ajustar tempo de estudo para: ${subject.name}\n\n` +
            `Tempo atual esta semana: ${currentHours}h ${currentMins}m\n\n` +
            `Digite os MINUTOS que você estudou fora da aplicação (positivo para adicionar, negativo para remover):`,
            '0'
        );
        
        if (minutes === null) return; // Cancelado
        
        const minutesToAdd = parseInt(minutes);
        if (isNaN(minutesToAdd)) {
            alert('Valor inválido! Digite apenas números.');
            return;
        }
        
        if (minutesToAdd === 0) return;
        
        // Adicionar ou remover tempo
        const newTotal = stats.currentWeekMinutes + minutesToAdd;
        
        if (newTotal < 0) {
            alert('Não é possível ter tempo negativo!');
            return;
        }
        
        // Atualizar diretamente
        subject.currentWeekMinutes = newTotal;
        this.studyCycle.saveCycles();
        
        const action = minutesToAdd > 0 ? 'adicionados' : 'removidos';
        const absMinutes = Math.abs(minutesToAdd);
        const hours = Math.floor(absMinutes / 60);
        const mins = absMinutes % 60;
        const timeStr = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
        
        alert(`✅ ${timeStr} ${action} com sucesso!\n\nNovo total: ${Math.floor(newTotal / 60)}h ${newTotal % 60}m`);
        
        this.renderSubjectsList();
        this.updateCycleStats();
        this.updateSubjectSelector();
    }

    /**
     * Exporta ciclo para arquivo JSON
     */
    exportCycle() {
        const json = this.studyCycle.exportCycle();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pomodoro-cycle-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Importa ciclo de arquivo JSON
     */
    importCycle() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const success = this.studyCycle.importCycle(event.target.result);
                if (success) {
                    alert('Ciclo importado com sucesso!');
                    this.renderSubjectsList();
                    this.updateCycleDisplay();
                    this.updateCycleStats();
                } else {
                    alert('Erro ao importar ciclo. Verifique o arquivo.');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    /**
     * Atualiza o seletor de disciplinas
     */
    updateSubjectSelector() {
        const select = document.getElementById('subjectSelect');
        if (!select) return;

        const cycle = this.studyCycle.getActiveCycle();
        if (!cycle) {
            select.innerHTML = '<option value="">-- Nenhum ciclo ativo --</option>';
            return;
        }

        // Limpar opções
        select.innerHTML = '<option value="">-- Escolha uma disciplina --</option>';

        // Adicionar disciplinas
        cycle.subjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject.id;
            option.textContent = subject.name;
            
            // Desabilitar se já atingiu limite semanal
            if (!this.studyCycle.hasTimeAvailable(subject.id)) {
                option.textContent += ' (Limite atingido)';
                option.disabled = true;
            }
            
            select.appendChild(option);
        });

        // Restaurar seleção anterior se ainda válida
        if (this.selectedSubjectId) {
            select.value = this.selectedSubjectId;
            this.updateSubjectInfo(this.selectedSubjectId);
        }
    }

    /**
     * Manipula seleção de disciplina
     */
    handleSubjectSelection(subjectId) {
        this.selectedSubjectId = subjectId || null;
        this.updateSubjectInfo(subjectId);
    }

    /**
     * Atualiza informações da disciplina selecionada
     */
    updateSubjectInfo(subjectId) {
        const infoDiv = document.getElementById('subjectInfo');
        if (!infoDiv) return;

        if (!subjectId) {
            infoDiv.style.display = 'none';
            return;
        }

        const stats = this.studyCycle.getSubjectStats(subjectId);
        if (!stats) {
            infoDiv.style.display = 'none';
            return;
        }

        infoDiv.style.display = 'block';

        // Determinar estado visual baseado no progresso
        const progressPercentage = stats.weeklyProgress;
        const infoDisplay = infoDiv.querySelector('.subject-info-display');
        const progressFill = document.getElementById('subjectProgressFill');

        // Remover classes anteriores
        if (infoDisplay) {
            infoDisplay.classList.remove('warning', 'limit-reached');
        }
        if (progressFill) {
            progressFill.classList.remove('warning', 'limit-reached');
        }

        // Aplicar classes baseadas no progresso
        if (progressPercentage >= 100) {
            if (infoDisplay) infoDisplay.classList.add('limit-reached');
            if (progressFill) progressFill.classList.add('limit-reached');
        } else if (progressPercentage >= 80) {
            if (infoDisplay) infoDisplay.classList.add('warning');
            if (progressFill) progressFill.classList.add('warning');
        }

        // Atualizar barra de progresso
        if (progressFill) {
            progressFill.style.width = `${Math.min(progressPercentage, 100)}%`;
        }

        // Atualizar informações de tempo
        const timeStudied = document.getElementById('timeStudied');
        const timeGoal = document.getElementById('timeGoal');
        const timeRemaining = document.getElementById('timeRemaining');

        if (timeStudied) {
            const hours = Math.floor(stats.currentWeekMinutes / 60);
            const minutes = stats.currentWeekMinutes % 60;
            timeStudied.textContent = minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
        }

        if (timeGoal) {
            timeGoal.textContent = `${stats.weeklyHours}h`;
        }

        if (timeRemaining) {
            const remainingHours = Math.floor(Math.max(0, stats.remainingMinutes) / 60);
            const remainingMins = Math.max(0, stats.remainingMinutes) % 60;
            
            if (stats.remainingMinutes <= 0) {
                timeRemaining.textContent = '⚠️ Limite atingido!';
                timeRemaining.style.color = '#f44336';
                timeRemaining.style.fontWeight = '700';
            } else if (progressPercentage >= 80) {
                timeRemaining.textContent = `⚠️ ${remainingHours}h ${remainingMins}m restantes`;
                timeRemaining.style.color = '#ff9800';
                timeRemaining.style.fontWeight = '700';
            } else {
                timeRemaining.textContent = `${remainingHours}h ${remainingMins}m restantes`;
                timeRemaining.style.color = '';
                timeRemaining.style.fontWeight = '';
            }
        }
    }

    /**
     * Mostra/esconde o seletor de disciplinas baseado no modo
     */
    toggleSubjectSelector() {
        const selector = document.getElementById('subjectSelector');
        if (!selector) return;

        // Mostrar apenas no modo foco
        if (this.timer.currentMode === TIMER_MODES.FOCUS) {
            selector.style.display = 'flex';
        } else {
            selector.style.display = 'none';
        }
    }
}

// Inicializar aplicação quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        try {
            window.pomodoroApp = new PomodoroApp();
        } catch (error) {
            console.error('❌ Erro ao criar aplicação:', error);
        }
    });
} else {
    try {
        window.pomodoroApp = new PomodoroApp();
    } catch (error) {
        console.error('❌ Erro ao criar aplicação:', error);
    }
}

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
        console.log('Service Worker registration failed:', err);
    });
}
