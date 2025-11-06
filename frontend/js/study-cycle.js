/**
 * Gerenciamento de Ciclo de Estudos - v2
 * Sistema de múltiplos ciclos com controle semanal
 */

import { STORAGE_KEYS } from './config.js';
import { StorageManager } from './storage.js';

export class StudyCycle {
    constructor() {
        this.cycles = [];
        this.activeCycleId = null;
        this.loadPromise = null;
        
        // Não carregar no construtor - deve ser chamado explicitamente
        // this.loadCycles();
        this.checkWeekReset();
    }

    /**
     * Cria um novo ciclo de estudos
     */
    async createCycle(cycleData) {
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
        
        await this.saveCycles();
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
     * Adiciona uma disciplina ao ciclo
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
     * Remove uma disciplina do ciclo (localStorage + backend)
     */
    async removeSubject(subjectId, cycleId = null) {
        const cycle = this.getCycle(cycleId || this.activeCycleId);
        if (!cycle) return;

        cycle.subjects = cycle.subjects.filter(s => s.id !== subjectId);
        
        // Ajustar índice se necessário
        if (cycle.currentSubjectIndex >= cycle.subjects.length) {
            cycle.currentSubjectIndex = 0;
        }
        
        // Deletar do backend
        try {
            await StorageManager.deleteSubject(subjectId);
        } catch (error) {
            console.warn('Erro ao deletar disciplina do backend:', error);
        }
        
        await this.saveCycles();
    }
    
    /**
     * Alias para removeSubject
     */
    async deleteSubject(subjectId, cycleId = null) {
        return await this.removeSubject(subjectId, cycleId);
    }

    /**
     * Edita uma disciplina existente (localStorage + backend)
     */
    async editSubject(subjectId, updates, cycleId = null) {
        const cycle = this.getCycle(cycleId || this.activeCycleId);
        if (!cycle) return;

        const subjectIndex = cycle.subjects.findIndex(s => s.id === subjectId);
        if (subjectIndex !== -1) {
            cycle.subjects[subjectIndex] = {
                ...cycle.subjects[subjectIndex],
                ...updates
            };
            
            // Atualizar no backend
            try {
                await StorageManager.updateSubject(subjectId, updates);
            } catch (error) {
                console.warn('Erro ao atualizar disciplina no backend:', error);
            }
            
            await this.saveCycles();
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
     * Remove um ciclo (localStorage + backend)
     */
    async deleteCycle(cycleId) {
        if (this.cycles.length <= 1) {
            return false; // Não pode remover o último ciclo
        }

        this.cycles = this.cycles.filter(c => c.id !== cycleId);
        
        // Se removeu o ativo, ativar outro
        if (this.activeCycleId === cycleId) {
            this.activeCycleId = this.cycles[0].id;
        }
        
        // Deletar do backend
        try {
            await StorageManager.deleteCycle(cycleId);
        } catch (error) {
            console.warn('Erro ao deletar ciclo do backend:', error);
        }
        
        await this.saveCycles();
        return true;
    }
    
    /**
     * Remove um ciclo (alias para deleteCycle - compatibilidade)
     */
    async removeCycle(cycleId) {
        return await this.deleteCycle(cycleId);
    }

    /**
     * Edita um ciclo (localStorage + backend)
     */
    async editCycle(cycleId, updates) {
        const cycle = this.getCycle(cycleId);
        if (!cycle) return false;

        Object.assign(cycle, updates);
        
        // Atualizar no backend
        try {
            await StorageManager.updateCycle(cycleId, updates);
        } catch (error) {
            console.warn('Erro ao atualizar ciclo no backend:', error);
        }
        
        await this.saveCycles();
        return true;
    }

    /**
     * Obtém a disciplina atual do ciclo ativo
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

    /**
     * Avança para a próxima disciplina no ciclo
     */
    advance() {
        const cycle = this.getActiveCycle();
        if (!cycle || cycle.subjects.length === 0) return null;
        
        cycle.currentSubjectIndex = (cycle.currentSubjectIndex + 1) % cycle.subjects.length;
        this.saveCycles();
        
        return this.getCurrentSubject();
    }

    /**
     * Registra uma sessão de estudo (localStorage + backend)
     */
    async recordSession(subjectId, minutes) {
        const cycle = this.getActiveCycle();
        if (!cycle) return false;

        const subject = cycle.subjects.find(s => s.id === subjectId);
        if (!subject) return false;

        // Atualizar localStorage
        subject.currentWeekMinutes += minutes;
        subject.totalMinutes += minutes;
        subject.totalSessions++;
        subject.lastStudied = new Date().toISOString();

        await this.saveCycles();
        
        // Salvar no backend
        try {
            const now = new Date();
            const session = {
                subject_id: subjectId,
                minutes: minutes,
                started_at: new Date(now.getTime() - minutes * 60000).toISOString(),
                completed_at: now.toISOString()
            };
            
            await StorageManager.createSession(session);
            console.log('✅ Sessão salva no backend:', session);
        } catch (error) {
            console.warn('⚠️ Erro ao salvar sessão no backend:', error);
        }
        
        return true;
    }

    /**
     * Verifica se uma disciplina ainda tem tempo disponível na semana
     */
    hasTimeAvailable(subjectId) {
        const cycle = this.getActiveCycle();
        if (!cycle) return false;

        const subject = cycle.subjects.find(s => s.id === subjectId);
        if (!subject) return false;

        const weeklyMinutes = subject.weeklyHours * 60;
        return subject.currentWeekMinutes < weeklyMinutes;
    }

    /**
     * Obtém minutos restantes na semana para uma disciplina
     */
    getRemainingMinutes(subjectId) {
        const cycle = this.getActiveCycle();
        if (!cycle) return 0;

        const subject = cycle.subjects.find(s => s.id === subjectId);
        if (!subject) return 0;

        const weeklyMinutes = subject.weeklyHours * 60;
        const remaining = weeklyMinutes - subject.currentWeekMinutes;
        return Math.max(0, remaining);
    }

    /**
     * Obtém progresso semanal de uma disciplina (0-100%)
     */
    getWeeklyProgress(subjectId) {
        const cycle = this.getActiveCycle();
        if (!cycle) return 0;

        const subject = cycle.subjects.find(s => s.id === subjectId);
        if (!subject) return 0;

        const weeklyMinutes = subject.weeklyHours * 60;
        const progress = (subject.currentWeekMinutes / weeklyMinutes) * 100;
        return Math.min(100, progress);
    }

    /**
     * Obtém estatísticas de uma disciplina
     */
    getSubjectStats(subjectId) {
        const cycle = this.getActiveCycle();
        if (!cycle) return null;

        const subject = cycle.subjects.find(s => s.id === subjectId);
        if (!subject) return null;

        return {
            name: subject.name,
            color: subject.color,
            priority: subject.priority,
            weeklyHours: subject.weeklyHours,
            currentWeekMinutes: subject.currentWeekMinutes,
            weeklyProgress: this.getWeeklyProgress(subjectId),
            remainingMinutes: this.getRemainingMinutes(subjectId),
            totalSessions: subject.totalSessions,
            totalMinutes: subject.totalMinutes,
            totalHours: Math.floor(subject.totalMinutes / 60),
            lastStudied: subject.lastStudied
        };
    }

    /**
     * Obtém todas as estatísticas do ciclo ativo
     */
    getAllStats() {
        const cycle = this.getActiveCycle();
        if (!cycle) return [];

        return cycle.subjects.map(subject => this.getSubjectStats(subject.id));
    }

    /**
     * Exporta um ciclo para JSON
     */
    exportCycle(cycleId = null) {
        const cycle = this.getCycle(cycleId || this.activeCycleId);
        if (!cycle) return null;

        return {
            version: '2.0',
            cycle: cycle,
            exportDate: new Date().toISOString()
        };
    }

    /**
     * Importa um ciclo de JSON
     */
    importCycle(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            
            if (data.version === '2.0' && data.cycle) {
                const imported = {
                    ...data.cycle,
                    id: Date.now().toString(),
                    createdAt: new Date().toISOString(),
                    weekStartDate: this.getWeekStartDate()
                };
                
                // Resetar progresso semanal
                imported.subjects.forEach(subject => {
                    subject.currentWeekMinutes = 0;
                });
                
                this.cycles.push(imported);
                this.saveCycles();
                return imported;
            }
            
            return null;
        } catch (error) {
            console.error('Erro ao importar ciclo:', error);
            return null;
        }
    }

    /**
     * Salva todos os ciclos (localStorage + backend)
     */
    async saveCycles() {
        const data = {
            cycles: this.cycles,
            activeCycleId: this.activeCycleId
        };
        
        // Salvar no localStorage (síncrono)
        StorageManager.save(STORAGE_KEYS.STUDY_CYCLE, data);
        
        // Salvar no backend (assíncrono)
        try {
            // Sincronizar cada ciclo com o backend
            for (const cycle of this.cycles) {
                await this.syncCycleToBackend(cycle);
            }
        } catch (error) {
            console.warn('Erro ao sincronizar ciclos com backend:', error);
        }
    }
    
    /**
     * Sincroniza um ciclo com o backend
     */
    async syncCycleToBackend(cycle) {
        try {
            // Verificar se o ciclo já existe no backend
            const cycleData = {
                id: cycle.id,
                name: cycle.name,
                study_days: cycle.studyDays,
                created_at: cycle.createdAt,
                week_start_date: cycle.weekStartDate,
                is_active: cycle.id === this.activeCycleId
            };
            
            // Tentar criar ou atualizar o ciclo
            await StorageManager.createCycle(cycleData);
            
            // Sincronizar disciplinas
            for (const subject of cycle.subjects) {
                await this.syncSubjectToBackend(subject, cycle.id);
            }
        } catch (error) {
            console.warn('Erro ao sincronizar ciclo com backend:', error);
        }
    }
    
    /**
     * Sincroniza uma disciplina com o backend
     */
    async syncSubjectToBackend(subject, cycleId) {
        try {
            const subjectData = {
                id: subject.id,
                cycle_id: cycleId,
                name: subject.name,
                weeklyHours: subject.weeklyHours,
                color: subject.color,
                priority: subject.priority,
                currentWeekMinutes: subject.currentWeekMinutes || 0,
                totalMinutes: subject.totalMinutes || 0,
                totalSessions: subject.totalSessions || 0
            };
            
            await StorageManager.createSubject(subjectData);
        } catch (error) {
            console.warn('Erro ao sincronizar disciplina com backend:', error);
        }
    }

    /**
     * Carrega todos os ciclos (localStorage + backend)
     */
    async loadCycles() {
        // Se já está carregando, retornar a Promise existente
        if (this.loadPromise) {
            return this.loadPromise;
        }
        
        this.loadPromise = this._loadCyclesInternal();
        const result = await this.loadPromise;
        this.loadPromise = null;
        return result;
    }
    
    async _loadCyclesInternal() {
        console.log('🔄 StudyCycle: Iniciando carregamento de ciclos...');
        
        // Primeiro, tentar carregar do backend
        try {
            console.log('🌐 StudyCycle: Tentando carregar do backend...');
            const backendCycles = await StorageManager.getCycles();
            console.log('📦 StudyCycle: Resposta do backend:', backendCycles);
            
            if (backendCycles && backendCycles.length > 0) {
                console.log(`✅ StudyCycle: ${backendCycles.length} ciclo(s) encontrado(s) no backend`);
                
                // Converter formato do backend para formato local
                this.cycles = await Promise.all(backendCycles.map(async (cycle) => {
                    // Buscar disciplinas do ciclo
                    const subjects = cycle.subjects || [];
                    console.log(`  📚 Ciclo "${cycle.name}": ${subjects.length} disciplina(s)`);
                    
                    return {
                        id: cycle.id,
                        name: cycle.name,
                        studyDays: cycle.study_days || [],
                        subjects: subjects.map(s => ({
                            id: s.id,
                            name: s.name,
                            weeklyHours: s.weeklyHours || s.weekly_hours,
                            color: s.color,
                            priority: s.priority,
                            currentWeekMinutes: s.currentWeekMinutes || s.current_week_minutes || 0,
                            totalMinutes: s.totalMinutes || s.total_minutes || 0,
                            totalSessions: s.totalSessions || s.total_sessions || 0
                        })),
                        createdAt: cycle.created_at,
                        weekStartDate: cycle.week_start_date
                    };
                }));
                
                // Verificar ciclo ativo
                const activeCycle = backendCycles.find(c => c.is_active);
                if (activeCycle) {
                    this.activeCycleId = activeCycle.id;
                    console.log('✅ StudyCycle: Ciclo ativo definido:', activeCycle.name);
                } else if (this.cycles.length > 0) {
                    this.activeCycleId = this.cycles[0].id;
                    console.log('⚠️ StudyCycle: Nenhum ciclo ativo no backend, usando primeiro ciclo:', this.cycles[0].name);
                }
                
                console.log('💾 StudyCycle: Salvando no localStorage...');
                // Salvar no localStorage para acesso offline
                const data = {
                    cycles: this.cycles,
                    activeCycleId: this.activeCycleId
                };
                StorageManager.save(STORAGE_KEYS.STUDY_CYCLE, data);
                
                console.log('✅ StudyCycle: Carregamento concluído com sucesso!');
                return;
            } else {
                console.log('⚠️ StudyCycle: Nenhum ciclo encontrado no backend');
            }
        } catch (error) {
            console.warn('❌ StudyCycle: Erro ao carregar ciclos do backend, usando localStorage:', error);
        }
        
        // Fallback para localStorage
        console.log('📂 StudyCycle: Tentando carregar do localStorage...');
        const data = StorageManager.load(STORAGE_KEYS.STUDY_CYCLE);
        
        if (data) {
            this.cycles = data.cycles || [];
            this.activeCycleId = data.activeCycleId;
        }

        // Se não tem nenhum ciclo, criar um padrão
        if (this.cycles.length === 0) {
            await this.createCycle({
                name: 'Meu Ciclo de Estudos',
                studyDays: ['mon', 'tue', 'wed', 'thu', 'fri']
            });
        }
    }

    /**
     * Lista todos os ciclos
     */
    getAllCycles() {
        return this.cycles.map(cycle => ({
            id: cycle.id,
            name: cycle.name,
            active: cycle.id === this.activeCycleId,
            subjectsCount: cycle.subjects.length,
            studyDays: cycle.studyDays,
            createdAt: cycle.createdAt
        }));
    }
}
