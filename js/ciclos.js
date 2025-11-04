/**
 * Página de Gerenciamento de Ciclos
 */

import { StudyCycle } from './study-cycle.js';

class CyclesApp {
    constructor() {
        this.studyCycle = new StudyCycle();
        this.init();
    }

    async init() {
        this.setupEvents();
        await this.loadCycleSelector();
        this.renderSubjectsList();
        this.updateCycleStats();
    }

    setupEvents() {
        // Seletor de ciclo ativo
        const cycleSelect = document.getElementById('cycleSelect');
        cycleSelect?.addEventListener('change', (e) => {
            this.studyCycle.setActiveCycle(e.target.value);
            this.renderSubjectsList();
            this.updateCycleStats();
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

    async loadCycleSelector() {
        const select = document.getElementById('cycleSelect');
        if (!select) return;
        
        // Aguardar carregamento dos ciclos
        await this.studyCycle.loadCycles();
        
        const cycles = this.studyCycle.cycles;
        const activeCycleId = this.studyCycle.activeCycleId;
        
        if (cycles.length === 0) {
            select.innerHTML = '<option value="">Nenhum ciclo criado</option>';
            return;
        }
        
        select.innerHTML = cycles.map(cycle => 
            `<option value="${cycle.id}" ${cycle.id === activeCycleId ? 'selected' : ''}>
                ${this.escapeHtml(cycle.name)}
            </option>`
        ).join('');
    }

    openCycleFormModal(isEdit = false) {
        const modal = document.getElementById('cycleFormModal');
        const title = document.getElementById('cycleFormModalTitle');
        const nameInput = document.getElementById('cycleName');
        
        if (!modal) return;
        
        if (isEdit) {
            const cycle = this.studyCycle.getActiveCycle();
            if (!cycle) {
                alert('Nenhum ciclo ativo para editar');
                return;
            }
            
            title.textContent = 'Editar Ciclo';
            nameInput.value = cycle.name;
            
            // Marcar dias de estudo
            const checkboxes = document.querySelectorAll('input[name="studyDays"]');
            checkboxes.forEach(cb => {
                cb.checked = cycle.studyDays.includes(cb.value);
            });
            
            modal.dataset.editMode = 'true';
            modal.dataset.editId = cycle.id;
        } else {
            title.textContent = 'Criar Novo Ciclo';
            nameInput.value = '';
            
            // Resetar para padrão (seg-sex)
            const checkboxes = document.querySelectorAll('input[name="studyDays"]');
            checkboxes.forEach(cb => {
                cb.checked = ['mon', 'tue', 'wed', 'thu', 'fri'].includes(cb.value);
            });
            
            delete modal.dataset.editMode;
            delete modal.dataset.editId;
        }
        
        modal.showModal();
    }

    closeCycleFormModal() {
        const modal = document.getElementById('cycleFormModal');
        modal?.close();
    }

    async saveCycleForm() {
        const modal = document.getElementById('cycleFormModal');
        const nameInput = document.getElementById('cycleName');
        const name = nameInput.value.trim();
        
        if (!name) {
            alert('Por favor, digite o nome do ciclo');
            return;
        }
        
        const studyDays = Array.from(document.querySelectorAll('input[name="studyDays"]:checked'))
            .map(cb => cb.value);
        
        if (studyDays.length === 0) {
            alert('Selecione pelo menos um dia de estudo');
            return;
        }
        
        if (modal.dataset.editMode === 'true') {
            // Editar ciclo existente
            const cycleId = modal.dataset.editId;
            const cycle = this.studyCycle.cycles.find(c => c.id === cycleId);
            
            if (cycle) {
                cycle.name = name;
                cycle.studyDays = studyDays;
                await this.studyCycle.saveCycles();
                alert('✅ Ciclo atualizado com sucesso!');
            }
        } else {
            // Criar novo ciclo
            await this.studyCycle.createCycle({ name, studyDays });
            alert('✅ Ciclo criado com sucesso!');
        }
        
        this.closeCycleFormModal();
        await this.loadCycleSelector();
        this.renderSubjectsList();
        this.updateCycleStats();
    }

    async deleteCycle() {
        const cycle = this.studyCycle.getActiveCycle();
        if (!cycle) {
            alert('Nenhum ciclo ativo para deletar');
            return;
        }
        
        if (!confirm(`Tem certeza que deseja deletar o ciclo "${cycle.name}"?\n\nTodas as disciplinas e progresso serão perdidos!`)) {
            return;
        }
        
        await this.studyCycle.deleteCycle(cycle.id);
        alert('✅ Ciclo deletado com sucesso!');
        
        await this.loadCycleSelector();
        this.renderSubjectsList();
        this.updateCycleStats();
    }

    async addSubject() {
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
            await this.studyCycle.editSubject(editingId, {
                name,
                weeklyHours,
                color: colorInput.value,
                priority: parseInt(prioritySelect.value)
            });
            alert('✅ Disciplina atualizada com sucesso!');
            
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
            alert('✅ Disciplina adicionada com sucesso!');
        }
        
        // Limpar form
        nameInput.value = '';
        weeklyHoursInput.value = '2';
        colorInput.value = '#3498db';
        prioritySelect.value = '3';
        
        // Atualizar displays
        this.renderSubjectsList();
        this.updateCycleStats();
    }

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
        
        if (minutes === null) return;
        
        const minutesToAdd = parseInt(minutes);
        if (isNaN(minutesToAdd)) {
            alert('Valor inválido! Digite apenas números.');
            return;
        }
        
        if (minutesToAdd === 0) return;
        
        const newTotal = stats.currentWeekMinutes + minutesToAdd;
        
        if (newTotal < 0) {
            alert('Não é possível ter tempo negativo!');
            return;
        }
        
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
    }

    async removeSubject(subjectId) {
        const cycle = this.studyCycle.getActiveCycle();
        if (!cycle) return;
        
        const subject = cycle.subjects.find(s => s.id === subjectId);
        if (!subject) return;
        
        if (!confirm(`Tem certeza que deseja remover a disciplina "${subject.name}"?`)) {
            return;
        }
        
        await this.studyCycle.removeSubject(subjectId);
        this.renderSubjectsList();
        this.updateCycleStats();
    }

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
                        <button class="icon-btn small" onclick="window.cyclesApp.editSubject('${subject.id}')" title="Editar disciplina">
                            ✏️
                        </button>
                        <button class="icon-btn small" onclick="window.cyclesApp.adjustSubjectTime('${subject.id}')" title="Ajustar tempo manualmente">
                            ⏱️
                        </button>
                        <button class="icon-btn small danger" onclick="window.cyclesApp.removeSubject('${subject.id}')" title="Remover">
                            ✕
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateCycleStats() {
        const container = document.getElementById('cycleStats');
        if (!container) return;
        
        const cycle = this.studyCycle.getActiveCycle();
        if (!cycle || cycle.subjects.length === 0) {
            container.innerHTML = '<p class="cycle-empty">Nenhuma estatística disponível.</p>';
            return;
        }
        
        container.innerHTML = cycle.subjects.map(subject => {
            const stats = this.studyCycle.getSubjectStats(subject.id);
            const studiedHours = Math.floor(stats.currentWeekMinutes / 60);
            const studiedMins = stats.currentWeekMinutes % 60;
            const remainingHours = Math.floor(Math.max(0, stats.remainingMinutes) / 60);
            const remainingMins = Math.max(0, stats.remainingMinutes) % 60;
            
            return `
                <div class="cycle-stat-card">
                    <div class="cycle-stat-header" style="border-bottom-color: ${subject.color}">
                        <div class="cycle-stat-name">${this.escapeHtml(subject.name)}</div>
                    </div>
                    <div class="cycle-stat-body">
                        <div class="cycle-stat-item">
                            <span class="label">Meta Semanal:</span>
                            <span class="value">${stats.weeklyHours}h</span>
                        </div>
                        <div class="cycle-stat-item">
                            <span class="label">Estudado:</span>
                            <span class="value">${studiedHours}h ${studiedMins}m</span>
                        </div>
                        <div class="cycle-stat-item">
                            <span class="label">Restante:</span>
                            <span class="value">${remainingHours}h ${remainingMins}m</span>
                        </div>
                        <div class="cycle-stat-item">
                            <span class="label">Progresso:</span>
                            <span class="value">${stats.weeklyProgress.toFixed(1)}%</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    exportCycle() {
        const json = this.studyCycle.exportCycle();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ciclo-estudos-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

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
                    alert('✅ Ciclo importado com sucesso!');
                    this.loadCycleSelector();
                    this.renderSubjectsList();
                    this.updateCycleStats();
                } else {
                    alert('❌ Erro ao importar ciclo. Verifique o arquivo.');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar app quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.cyclesApp = new CyclesApp();
    });
} else {
    window.cyclesApp = new CyclesApp();
}
