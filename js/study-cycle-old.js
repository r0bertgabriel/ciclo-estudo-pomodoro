/**
 * Gerenciamento de Ciclo de Estudos
 * Sistema de rotação contínua de disciplinas com múltiplos ciclos
 */

import { STORAGE_KEYS } from './config.js';
import { StorageManager } from './storage.js';

export class StudyCycle {
    constructor() {
        this.cycles = [];
        this.activeCycleId = null;
        
        this.loadCycles();
        this.checkWeekReset();
    }

    /**
     * Cria um novo ciclo de estudos
     * @param {Object} cycleData - Dados do ciclo
     * @param {string} cycleData.name - Nome do ciclo
     * @param {Array<string>} cycleData.studyDays - Dias da semana ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
     */
    createCycle(cycleData) {
        const newCycle = {
            id: Date.now().toString(),
            name: cycleData.name,
            studyDays: cycleData.studyDays || ['mon', 'tue', 'wed', 'thu', 'fri'],
            subjects: [],
            currentSubjectIndex: 0,
            createdAt: new Date().toISOString(),
            weekStartDate: this.getWeekStartDate()
        };

        this.cycles.push(newCycle);
        
        // Se for o primeiro ciclo, ativa automaticamente
        if (this.cycles.length === 1) {
            this.activeCycleId = newCycle.id;
        }
        
        this.saveCycles();
        return newCycle;
    }

    /**
     * Obtém a data de início da semana (segunda-feira)
     */
    getWeekStartDate() {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(now.setDate(diff));
        monday.setHours(0, 0, 0, 0);
        return monday.toISOString();
    }

    /**
     * Verifica se precisa resetar o progresso semanal
     */
    checkWeekReset() {
        this.cycles.forEach(cycle => {
            const weekStart = new Date(cycle.weekStartDate);
            const now = new Date();
            const currentWeekStart = new Date(this.getWeekStartDate());
            
            if (weekStart < currentWeekStart) {
                // Nova semana, resetar progresso
                cycle.subjects.forEach(subject => {
                    subject.currentWeekMinutes = 0;
                });
                cycle.weekStartDate = this.getWeekStartDate();
            }
        });
        this.saveCycles();
    }

    /**
     * Adiciona uma disciplina ao ciclo ativo
     * @param {Object} subject - Objeto da disciplina
     * @param {string} subject.name - Nome da disciplina
     * @param {string} subject.color - Cor da disciplina (hex)
     * @param {number} subject.priority - Prioridade (1-5)
     * @param {number} subject.weeklyHours - Horas semanais para estudar
     */
    addSubject(subject, cycleId = null) {
        const cycle = this.getCycle(cycleId || this.activeCycleId);
        if (!cycle) return null;

        const newSubject = {
            id: Date.now().toString(),
            name: subject.name,
            color: subject.color || '#3498db',
            priority: subject.priority || 1,
            weeklyHours: subject.weeklyHours || 2,
            currentWeekMinutes: 0,
            totalSessions: 0,
            totalMinutes: 0,
            lastStudied: null,
            createdAt: new Date().toISOString()
        };

        cycle.subjects.push(newSubject);
        this.saveCycles();
        return newSubject;
    }

    /**
     * Remove uma disciplina do ciclo
     * @param {string} subjectId - ID da disciplina
     */
    removeSubject(subjectId, cycleId = null) {
        const cycle = this.getCycle(cycleId || this.activeCycleId);
        if (!cycle) return;

        cycle.subjects = cycle.subjects.filter(s => s.id !== subjectId);
        
        // Ajustar índice se necessário
        if (cycle.currentSubjectIndex >= cycle.subjects.length) {
            cycle.currentSubjectIndex = 0;
        }
        
        this.saveCycles();
    }

    /**
     * Edita uma disciplina existente
     * @param {string} subjectId - ID da disciplina
     * @param {Object} updates - Atualizações
     */
    editSubject(subjectId, updates, cycleId = null) {
        const cycle = this.getCycle(cycleId || this.activeCycleId);
        if (!cycle) return;

        const subjectIndex = cycle.subjects.findIndex(s => s.id === subjectId);
        if (subjectIndex !== -1) {
            cycle.subjects[subjectIndex] = {
                ...cycle.subjects[subjectIndex],
                ...updates
            };
            this.saveCycles();
        }
    }

    /**
     * Obtém um ciclo por ID
     */
    getCycle(cycleId) {
        return this.cycles.find(c => c.id === cycleId);
    }

    /**
     * Obtém o ciclo ativo
     */
    getActiveCycle() {
        return this.getCycle(this.activeCycleId);
    }

    /**
     * Define o ciclo ativo
     */
    setActiveCycle(cycleId) {
        if (this.cycles.find(c => c.id === cycleId)) {
            this.activeCycleId = cycleId;
            this.saveCycles();
            return true;
        }
        return false;
    }

    /**
     * Remove um ciclo
     */
    removeCycle(cycleId) {
        if (this.cycles.length <= 1) {
            return false; // Não pode remover o último ciclo
        }

        this.cycles = this.cycles.filter(c => c.id !== cycleId);
        
        // Se removeu o ativo, ativar outro
        if (this.activeCycleId === cycleId) {
            this.activeCycleId = this.cycles[0].id;
        }
        
        this.saveCycles();
        return true;
    }

    /**
     * Obtém a disciplina atual do ciclo ativo
     * @returns {Object|null} Disciplina atual
     */
    getCurrentSubject() {
        const cycle = this.getActiveCycle();
        if (!cycle || cycle.subjects.length === 0) return null;
        return cycle.subjects[cycle.currentSubjectIndex];
    }

    /**
     * Obtém uma disciplina por ID
     */
    getSubject(subjectId, cycleId = null) {
        const cycle = this.getCycle(cycleId || this.activeCycleId);
        if (!cycle) return null;
        return cycle.subjects.find(s => s.id === subjectId);
    }

    /**
     * Pula para uma disciplina específica
     */
    jumpToSubject(subjectId) {
        const cycle = this.getActiveCycle();
        if (!cycle) return false;

        const index = cycle.subjects.findIndex(s => s.id === subjectId);
        if (index !== -1) {
            cycle.currentSubjectIndex = index;
            this.saveCycles();
            return true;
        }
        return false;
    }
     * @returns {Object|null} Próxima disciplina
     */
    getNextSubject() {
        if (this.subjects.length === 0) return null;
        const nextIndex = (this.currentIndex + 1) % this.subjects.length;
        return this.subjects[nextIndex];
    }

    /**
     * Avança para a próxima disciplina no ciclo
     * @returns {Object|null} Nova disciplina atual
     */
    advance() {
        if (this.subjects.length === 0) return null;
        
        this.currentIndex = (this.currentIndex + 1) % this.subjects.length;
        
        // Se voltou ao início, incrementa contador de ciclos completos
        if (this.currentIndex === 0) {
            this.cycleProgress.totalSessions++;
        }
        
        this.saveProgress();
        return this.getCurrentSubject();
    }

    /**
     * Registra uma sessão concluída para a disciplina atual
     * @param {number} minutes - Minutos estudados
     * @param {number} performance - Avaliação de 1-5 (opcional)
     */
    recordSession(minutes, performance = null) {
        const current = this.getCurrentSubject();
        if (!current) return;

        const progress = this.cycleProgress.subjectsProgress[current.id];
        
        progress.totalSessions++;
        progress.totalMinutes += minutes;
        progress.lastStudied = new Date().toISOString();
        
        if (performance !== null) {
            progress.performance.push({
                date: new Date().toISOString(),
                rating: performance
            });
        }

        this.cycleProgress.totalSessions++;
        this.saveProgress();
    }

    /**
     * Obtém estatísticas da disciplina
     * @param {string} subjectId - ID da disciplina
     * @returns {Object} Estatísticas
     */
    getSubjectStats(subjectId) {
        const subject = this.subjects.find(s => s.id === subjectId);
        const progress = this.cycleProgress.subjectsProgress[subjectId];
        
        if (!subject || !progress) return null;

        const avgPerformance = progress.performance.length > 0
            ? progress.performance.reduce((sum, p) => sum + p.rating, 0) / progress.performance.length
            : 0;

        return {
            name: subject.name,
            color: subject.color,
            totalSessions: progress.totalSessions,
            totalMinutes: progress.totalMinutes,
            totalHours: Math.floor(progress.totalMinutes / 60),
            lastStudied: progress.lastStudied,
            averagePerformance: avgPerformance.toFixed(1)
        };
    }

    /**
     * Obtém todas as estatísticas do ciclo
     * @returns {Array} Lista de estatísticas por disciplina
     */
    getAllStats() {
        return this.subjects.map(subject => 
            this.getSubjectStats(subject.id)
        ).filter(stats => stats !== null);
    }

    /**
     * Reordena disciplinas no ciclo
     * @param {Array} newOrder - Nova ordem (array de IDs)
     */
    reorderSubjects(newOrder) {
        const reordered = [];
        newOrder.forEach(id => {
            const subject = this.subjects.find(s => s.id === id);
            if (subject) reordered.push(subject);
        });
        
        this.subjects = reordered;
        this.saveCycle();
    }

    /**
     * Move para uma disciplina específica
     * @param {string} subjectId - ID da disciplina
     */
    jumpToSubject(subjectId) {
        const index = this.subjects.findIndex(s => s.id === subjectId);
        if (index !== -1) {
            this.currentIndex = index;
            this.saveProgress();
        }
    }

    /**
     * Reseta o progresso do ciclo
     */
    resetProgress() {
        this.currentIndex = 0;
        this.cycleProgress = {
            totalSessions: 0,
            subjectsProgress: {}
        };

        // Reinicializar progresso de cada disciplina
        this.subjects.forEach(subject => {
            this.cycleProgress.subjectsProgress[subject.id] = {
                totalSessions: 0,
                totalMinutes: 0,
                completedCycles: 0,
                lastStudied: null,
                performance: []
            };
        });

        this.saveProgress();
    }

    /**
     * Exporta o ciclo para JSON
     * @returns {string} JSON do ciclo
     */
    exportCycle() {
        return JSON.stringify({
            subjects: this.subjects,
            progress: this.cycleProgress,
            exportedAt: new Date().toISOString()
        }, null, 2);
    }

    /**
     * Importa ciclo de JSON
     * @param {string} jsonString - JSON do ciclo
     */
    importCycle(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            if (data.subjects && Array.isArray(data.subjects)) {
                this.subjects = data.subjects;
                this.currentIndex = 0;
                
                if (data.progress) {
                    this.cycleProgress = data.progress;
                }
                
                this.saveCycle();
                this.saveProgress();
                return true;
            }
        } catch (error) {
            console.error('Erro ao importar ciclo:', error);
            return false;
        }
    }

    /**
     * Salva o ciclo no localStorage
     */
    saveCycle() {
        StorageManager.save(STORAGE_KEYS.STUDY_CYCLE, {
            subjects: this.subjects,
            currentIndex: this.currentIndex
        });
    }

    /**
     * Carrega o ciclo do localStorage
     */
    loadCycle() {
        const data = StorageManager.load(STORAGE_KEYS.STUDY_CYCLE);
        if (data) {
            this.subjects = data.subjects || [];
            this.currentIndex = data.currentIndex || 0;
        }
    }

    /**
     * Salva o progresso no localStorage
     */
    saveProgress() {
        StorageManager.save(STORAGE_KEYS.CYCLE_PROGRESS, this.cycleProgress);
    }

    /**
     * Carrega o progresso do localStorage
     */
    loadProgress() {
        const data = StorageManager.load(STORAGE_KEYS.CYCLE_PROGRESS);
        if (data) {
            this.cycleProgress = data;
        } else {
            // Inicializar progresso para disciplinas existentes
            this.subjects.forEach(subject => {
                if (!this.cycleProgress.subjectsProgress[subject.id]) {
                    this.cycleProgress.subjectsProgress[subject.id] = {
                        totalSessions: 0,
                        totalMinutes: 0,
                        completedCycles: 0,
                        lastStudied: null,
                        performance: []
                    };
                }
            });
        }
    }

    /**
     * Obtém sugestão de próxima disciplina baseada em prioridade e tempo
     * @returns {Object|null} Disciplina sugerida
     */
    getSuggestedSubject() {
        if (this.subjects.length === 0) return null;

        // Calcular score para cada disciplina
        const scores = this.subjects.map(subject => {
            const progress = this.cycleProgress.subjectsProgress[subject.id];
            const hoursSinceLastStudy = progress.lastStudied
                ? (Date.now() - new Date(progress.lastStudied).getTime()) / (1000 * 60 * 60)
                : 999;

            // Score baseado em: prioridade + tempo sem estudar
            const score = (subject.priority * 20) + (hoursSinceLastStudy * 2);

            return {
                subject,
                score,
                hoursSinceLastStudy
            };
        });

        // Ordenar por score (maior = mais urgente)
        scores.sort((a, b) => b.score - a.score);

        return scores[0].subject;
    }
}
