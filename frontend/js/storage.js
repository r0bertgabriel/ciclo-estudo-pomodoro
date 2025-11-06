/**
 * Gerenciamento de Storage com Backend API
 */

import { API_BASE_URL, DEFAULT_SETTINGS, STORAGE_KEYS } from './config.js';

export class StorageManager {
    /**
     * Salva dados no localStorage (SÍNCRONO)
     * @param {string} key - Chave de armazenamento
     * @param {any} data - Dados a serem salvos
     */
    static save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    }

    /**
     * Carrega dados do localStorage (SÍNCRONO)
     * @param {string} key - Chave de armazenamento
     * @param {any} defaultValue - Valor padrão caso não exista
     * @returns {any} Dados carregados ou valor padrão
     */
    static load(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
            return defaultValue;
        }
    }

    /**
     * Remove dados do localStorage
     * @param {string} key - Chave de armazenamento
     */
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
            return false;
        }
    }

    // ===== MÉTODOS DA API =====

    /**
     * Busca todos os ciclos da API
     */
    static async getCycles() {
        try {
            // Verifica se backend está disponível
            const backendAvailable = await checkBackendAvailability();
            
            if (!backendAvailable) {
                // Fallback para localStorage
                console.info('📦 Carregando ciclos do localStorage (modo offline)');
                return this.load(STORAGE_KEYS.CYCLES) || [];
            }
            
            const response = await fetch(`${API_BASE_URL}/api/cycles`);
            if (!response.ok) throw new Error('Erro ao carregar ciclos');
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar ciclos:', error);
            // Fallback para localStorage em caso de erro
            console.info('📦 Fallback: carregando ciclos do localStorage');
            return this.load(STORAGE_KEYS.CYCLES) || [];
        }
    }

    /**
     * Busca o ciclo ativo
     */
    static async getActiveCycle() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cycles/active`);
            if (!response.ok) throw new Error('Erro ao carregar ciclo ativo');
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar ciclo ativo:', error);
            return null;
        }
    }

    /**
     * Cria um novo ciclo
     */
    static async createCycle(cycle) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cycles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cycle)
            });
            if (!response.ok) throw new Error('Erro ao criar ciclo');
            return await response.json();
        } catch (error) {
            console.error('Erro ao criar ciclo:', error);
            return null;
        }
    }

    /**
     * Atualiza um ciclo
     */
    static async updateCycle(cycleId, updates) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cycles/${cycleId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            if (!response.ok) throw new Error('Erro ao atualizar ciclo');
            return await response.json();
        } catch (error) {
            console.error('Erro ao atualizar ciclo:', error);
            return null;
        }
    }

    /**
     * Deleta um ciclo
     */
    static async deleteCycle(cycleId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cycles/${cycleId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Erro ao deletar ciclo');
            return true;
        } catch (error) {
            console.error('Erro ao deletar ciclo:', error);
            return false;
        }
    }

    /**
     * Ativa um ciclo
     */
    static async activateCycle(cycleId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/cycles/${cycleId}/activate`, {
                method: 'PUT'
            });
            if (!response.ok) throw new Error('Erro ao ativar ciclo');
            return true;
        } catch (error) {
            console.error('Erro ao ativar ciclo:', error);
            return false;
        }
    }

    /**
     * Cria uma nova disciplina
     */
    static async createSubject(subject) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/subjects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subject)
            });
            if (!response.ok) throw new Error('Erro ao criar disciplina');
            return await response.json();
        } catch (error) {
            console.error('Erro ao criar disciplina:', error);
            return null;
        }
    }

    /**
     * Atualiza uma disciplina
     */
    static async updateSubject(subjectId, updates) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/subjects/${subjectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates)
            });
            if (!response.ok) throw new Error('Erro ao atualizar disciplina');
            return true;
        } catch (error) {
            console.error('Erro ao atualizar disciplina:', error);
            return false;
        }
    }

    /**
     * Deleta uma disciplina
     */
    static async deleteSubject(subjectId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/subjects/${subjectId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Erro ao deletar disciplina');
            return true;
        } catch (error) {
            console.error('Erro ao deletar disciplina:', error);
            return false;
        }
    }

    /**
     * Registra uma sessão de estudo
     */
    static async createSession(session) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(session)
            });
            if (!response.ok) throw new Error('Erro ao criar sessão');
            return true;
        } catch (error) {
            console.error('Erro ao criar sessão:', error);
            return false;
        }
    }

    /**
     * Busca estatísticas de uma data
     */
    static async getStats(date) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/stats/${date}`);
            if (!response.ok) throw new Error('Erro ao buscar estatísticas');
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            return null;
        }
    }

    /**
     * Atualiza estatísticas
     */
    static async updateStats(date, stats) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/stats/${date}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(stats)
            });
            if (!response.ok) throw new Error('Erro ao atualizar estatísticas');
            return true;
        } catch (error) {
            console.error('Erro ao atualizar estatísticas:', error);
            return false;
        }
    }

    /**
     * Carrega configurações
     * @returns {Object} Configurações salvas ou padrão
     */
    static loadSettings() {
        return this.load(STORAGE_KEYS.SETTINGS, { ...DEFAULT_SETTINGS });
    }

    /**
     * Salva configurações
     * @param {Object} settings - Configurações a serem salvas
     */
    static saveSettings(settings) {
        return this.save(STORAGE_KEYS.SETTINGS, settings);
    }

    /**
     * Carrega estatísticas
     * @returns {Object} Estatísticas salvas ou padrão
     */
    static loadStats() {
        const stats = this.load(STORAGE_KEYS.STATS, null);
        const today = new Date().toDateString();

        // Resetar estatísticas se for um novo dia
        if (!stats || stats.date !== today) {
            return {
                completedSessions: 0,
                totalMinutes: 0,
                date: today
            };
        }

        return stats;
    }

    /**
     * Salva estatísticas
     * @param {Object} stats - Estatísticas a serem salvas
     */
    static saveStats(stats) {
        return this.save(STORAGE_KEYS.STATS, stats);
    }

    /**
     * Limpa todas as estatísticas
     */
    static clearStats() {
        return this.remove(STORAGE_KEYS.STATS);
    }
}
