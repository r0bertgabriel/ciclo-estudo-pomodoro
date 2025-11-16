/**
 * Gerenciamento de Metas de Estudo
 */

import { API_BASE_URL } from './config.js';
import { StorageManager } from './storage.js';
import { StudyCycle } from './study-cycle.js';

class GoalsApp {
    constructor() {
        this.studyCycle = new StudyCycle();
        this.goals = [];
        this.subjects = [];
        this.init();
    }

    async init() {
        await this.studyCycle.loadCycles();
        await this.loadSubjects();
        await this.loadGoals();
        await this.loadSummary();
        this.setupEvents();
        this.renderGoals();
    }

    setupEvents() {
        document.getElementById('newGoalBtn')?.addEventListener('click', () => {
            this.openGoalModal();
        });

        document.getElementById('cancelGoalBtn')?.addEventListener('click', () => {
            this.closeGoalModal();
        });

        document.getElementById('goalForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveGoal();
        });

        // Atualizar datas automaticamente ao mudar o tipo
        document.getElementById('goalType')?.addEventListener('change', (e) => {
            this.updateDateRange(e.target.value);
        });
    }

    async loadSubjects() {
        const cycle = this.studyCycle.getActiveCycle();
        if (cycle) {
            this.subjects = cycle.subjects;
            this.populateSubjectSelect();
        }
    }

    populateSubjectSelect() {
        const select = document.getElementById('subjectId');
        if (!select) return;

        const options = this.subjects.map(subject => 
            `<option value="${subject.id}">${this.escapeHtml(subject.name)}</option>`
        ).join('');

        select.innerHTML = '<option value="">Todas as disciplinas</option>' + options;
    }

    async loadGoals() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/goals`);
            if (response.ok) {
                this.goals = await response.json();
            } else {
                // Fallback para localStorage
                this.goals = StorageManager.load('pomodoro_goals') || [];
            }
        } catch (error) {
            console.warn('Erro ao carregar metas, usando localStorage:', error);
            this.goals = StorageManager.load('pomodoro_goals') || [];
        }
    }

    async loadSummary() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/goals/summary`);
            if (response.ok) {
                const summary = await response.json();
                this.updateSummary(summary);
            } else {
                this.calculateLocalSummary();
            }
        } catch (error) {
            this.calculateLocalSummary();
        }
    }

    calculateLocalSummary() {
        const total = this.goals.length;
        const active = this.goals.filter(g => g.status === 'active').length;
        const completed = this.goals.filter(g => g.status === 'completed').length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        this.updateSummary({
            total,
            active,
            completed,
            completion_rate: completionRate
        });
    }

    updateSummary(summary) {
        document.getElementById('totalGoals').textContent = summary.total;
        document.getElementById('activeGoals').textContent = summary.active;
        document.getElementById('completedGoals').textContent = summary.completed;
        document.getElementById('completionRate').textContent = `${summary.completion_rate}%`;
    }

    renderGoals() {
        const grid = document.getElementById('goalsGrid');
        const emptyState = document.getElementById('emptyState');

        if (!grid) return;

        if (this.goals.length === 0) {
            grid.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        grid.style.display = 'grid';
        emptyState.style.display = 'none';

        grid.innerHTML = this.goals.map(goal => this.renderGoalCard(goal)).join('');

        // Adicionar eventos aos botões
        this.goals.forEach(goal => {
            const deleteBtn = document.querySelector(`[data-delete-goal="${goal.id}"]`);
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => this.deleteGoal(goal.id));
            }
        });
    }

    renderGoalCard(goal) {
        const progress = (goal.current_value / goal.target_value) * 100;
        const isCompleted = goal.status === 'completed';
        
        const typeLabel = {
            'daily': 'Diária',
            'weekly': 'Semanal',
            'monthly': 'Mensal'
        }[goal.type] || goal.type;

        const targetLabel = {
            'sessions': `${goal.target_value} sessões`,
            'minutes': `${goal.target_value} minutos`,
            'hours': `${goal.target_value} horas`
        }[goal.target_type] || `${goal.target_value}`;

        const currentLabel = {
            'sessions': `${goal.current_value} sessões`,
            'minutes': `${goal.current_value} minutos`,
            'hours': `${goal.current_value} horas`
        }[goal.target_type] || `${goal.current_value}`;

        const startDate = new Date(goal.start_date).toLocaleDateString('pt-BR');
        const endDate = new Date(goal.end_date).toLocaleDateString('pt-BR');

        return `
            <div class="goal-card ${isCompleted ? 'completed' : ''}">
                <div class="goal-header">
                    <span class="goal-type ${goal.type}">${typeLabel}</span>
                    <div class="goal-actions">
                        <button data-delete-goal="${goal.id}" title="Excluir meta">🗑️</button>
                    </div>
                </div>
                
                <div class="goal-title">
                    ${targetLabel}
                    ${goal.subject_name ? `<br><span style="font-size: 0.85rem; color: #718096;">📚 ${this.escapeHtml(goal.subject_name)}</span>` : ''}
                </div>

                <div class="goal-progress">
                    <div class="progress-label">
                        <span>${currentLabel}</span>
                        <span style="font-weight: 700;">${Math.round(progress)}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${isCompleted ? 'completed' : ''}" 
                             style="width: ${Math.min(progress, 100)}%"></div>
                    </div>
                </div>

                <div class="goal-dates">
                    <div>📅 Início: ${startDate}</div>
                    <div>🏁 Término: ${endDate}</div>
                </div>

                ${isCompleted ? '<div style="text-align: center; margin-top: 15px;"><span class="status-badge completed">✅ Concluída!</span></div>' : ''}
            </div>
        `;
    }

    openGoalModal() {
        const modal = document.getElementById('goalModal');
        const form = document.getElementById('goalForm');
        
        form.reset();
        this.updateDateRange('daily');
        
        modal.showModal();
    }

    closeGoalModal() {
        const modal = document.getElementById('goalModal');
        modal.close();
    }

    updateDateRange(type) {
        const now = new Date();
        let endDate = new Date();

        switch (type) {
            case 'daily':
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'weekly':
                endDate.setDate(now.getDate() + 7);
                break;
            case 'monthly':
                endDate.setMonth(now.getMonth() + 1);
                break;
        }

        this.startDate = now.toISOString();
        this.endDate = endDate.toISOString();
    }

    async saveGoal() {
        const type = document.getElementById('goalType').value;
        const targetType = document.getElementById('targetType').value;
        const targetValue = parseInt(document.getElementById('targetValue').value);
        const subjectId = document.getElementById('subjectId').value || null;

        // Ajustar valor se for horas (converter para minutos)
        let adjustedValue = targetValue;
        if (targetType === 'hours') {
            adjustedValue = targetValue * 60;
        }

        const goal = {
            id: Date.now().toString(),
            type,
            target_type: targetType === 'hours' ? 'minutes' : targetType,
            target_value: adjustedValue,
            current_value: 0,
            subject_id: subjectId,
            start_date: this.startDate,
            end_date: this.endDate,
            status: 'active',
            created_at: new Date().toISOString()
        };

        try {
            const response = await fetch(`${API_BASE_URL}/api/goals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(goal)
            });

            if (response.ok) {
                console.log('✅ Meta criada com sucesso');
            } else {
                console.warn('⚠️ Erro ao salvar no backend, salvando localmente');
            }
        } catch (error) {
            console.warn('⚠️ Backend não disponível, salvando localmente:', error);
        }

        // Salvar também no localStorage
        this.goals.push(goal);
        StorageManager.save('pomodoro_goals', this.goals);

        this.closeGoalModal();
        await this.loadGoals();
        await this.loadSummary();
        this.renderGoals();
    }

    async deleteGoal(goalId) {
        if (!confirm('Tem certeza que deseja excluir esta meta?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/goals/${goalId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                console.warn('⚠️ Erro ao deletar do backend');
            }
        } catch (error) {
            console.warn('⚠️ Backend não disponível:', error);
        }

        // Remover do localStorage
        this.goals = this.goals.filter(g => g.id !== goalId);
        StorageManager.save('pomodoro_goals', this.goals);

        await this.loadGoals();
        await this.loadSummary();
        this.renderGoals();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar app
document.addEventListener('DOMContentLoaded', () => {
    new GoalsApp();
});
