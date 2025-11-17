/**
 * Dashboard de Produtividade
 */

import { API_BASE_URL } from './config.js';

class Dashboard {
    constructor() {
        this.charts = {};
        this.currentPeriod = 'week';
        this.currentSubject = 'all';
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadData();
        this.setupCharts();
    }

    setupEventListeners() {
        // Filtros
        document.getElementById('periodFilter').addEventListener('change', (e) => {
            this.currentPeriod = e.target.value;
            this.loadData();
        });

        document.getElementById('subjectFilter').addEventListener('change', (e) => {
            this.currentSubject = e.target.value;
            this.loadData();
        });

        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.loadData();
        });

        // Controles de gráfico
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateEvolutionChart(e.target.dataset.chart);
            });
        });

        // Modals
        document.getElementById('exportBtn').addEventListener('click', () => {
            document.getElementById('exportModal').classList.add('active');
        });

        document.getElementById('closeExportModal').addEventListener('click', () => {
            document.getElementById('exportModal').classList.remove('active');
        });

        document.getElementById('backupBtn').addEventListener('click', () => {
            document.getElementById('backupModal').classList.add('active');
        });

        document.getElementById('closeBackupModal').addEventListener('click', () => {
            document.getElementById('backupModal').classList.remove('active');
        });

        // Exportação
        document.getElementById('exportCsvBtn').addEventListener('click', () => {
            this.exportToCSV();
        });

        document.getElementById('exportJsonBtn').addEventListener('click', () => {
            this.exportToJSON();
        });

        // Backup
        document.getElementById('createBackupBtn').addEventListener('click', () => {
            this.createBackup();
        });

        document.getElementById('restoreBackupBtn').addEventListener('click', () => {
            document.getElementById('restoreBackupInput').click();
        });

        document.getElementById('restoreBackupInput').addEventListener('change', (e) => {
            this.restoreBackup(e.target.files[0]);
        });

        // Fechar modal ao clicar fora
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
    }

    async loadData() {
        try {
            // Carregar estatísticas gerais
            await this.loadGeneralStats();
            
            // Carregar disciplinas para filtro
            await this.loadSubjectsFilter();
            
            // Carregar dados para gráficos
            await this.loadChartData();
            
            // Carregar heatmap
            await this.loadHeatmap();
            
            // Carregar análise de padrões
            await this.loadPatterns();
            
            // Carregar ranking
            await this.loadRanking();
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    async loadGeneralStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/stats/general`);
            const stats = await response.json();
            
            document.getElementById('totalHours').textContent = `${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`;
            document.getElementById('totalSessions').textContent = stats.totalSessions || 0;
            document.getElementById('totalSubjects').textContent = stats.totalSubjects || 0;
            document.getElementById('currentStreak').textContent = stats.currentStreak || 0;
        } catch (error) {
            console.error('Erro ao carregar estatísticas gerais:', error);
        }
    }

    async loadSubjectsFilter() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/subjects`);
            const subjects = await response.json();
            
            const select = document.getElementById('subjectFilter');
            select.innerHTML = '<option value="all">Todas as Disciplinas</option>';
            
            subjects.forEach(subject => {
                const option = document.createElement('option');
                option.value = subject.id;
                option.textContent = subject.name;
                select.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar disciplinas:', error);
        }
    }

    setupCharts() {
        // Configuração padrão dos gráficos
        Chart.defaults.font.family = "'Inter', 'Segoe UI', sans-serif";
        Chart.defaults.font.size = 12;
        Chart.defaults.color = '#666';
    }

    async loadChartData() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/stats/chart-data?period=${this.currentPeriod}&subject=${this.currentSubject}`);
            const data = await response.json();
            
            this.updateEvolutionChart('daily', data.evolution);
            this.updateSubjectCharts(data.subjects);
        } catch (error) {
            console.error('Erro ao carregar dados de gráficos:', error);
        }
    }

    updateEvolutionChart(type, data = null) {
        const ctx = document.getElementById('evolutionChart');
        
        if (this.charts.evolution) {
            this.charts.evolution.destroy();
        }

        // Se não houver dados, mostrar mensagem
        if (!data || !data.labels || data.labels.length === 0) {
            ctx.getContext('2d').clearRect(0, 0, ctx.width, ctx.height);
            const parent = ctx.parentElement;
            parent.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 1.1rem;">Nenhum dado disponível ainda. Comece a estudar!</div>';
            return;
        }

        this.charts.evolution = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + 'h';
                            }
                        }
                    }
                }
            }
        });
    }

    updateSubjectCharts(data) {
        // Gráfico de Pizza
        const ctxPie = document.getElementById('subjectPieChart');
        
        if (this.charts.subjectPie) {
            this.charts.subjectPie.destroy();
        }

        // Se não houver dados, mostrar mensagem
        if (!data || !data.labels || data.labels.length === 0) {
            const parent = ctxPie.parentElement;
            parent.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">Sem dados</div>';
            return;
        }

        this.charts.subjectPie = new Chart(ctxPie, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });

        // Gráfico de Barras
        const ctxBar = document.getElementById('subjectBarChart');
        
        if (this.charts.subjectBar) {
            this.charts.subjectBar.destroy();
        }

        // Se não houver dados, mostrar mensagem
        if (!data || !data.labels || data.labels.length === 0) {
            const parent = ctxBar.parentElement;
            parent.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">Sem dados</div>';
            return;
        }

        this.charts.subjectBar = new Chart(ctxBar, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + 'h';
                            }
                        }
                    }
                }
            }
        });
    }

    async loadHeatmap() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/stats/heatmap`);
            const data = await response.json();
            
            this.renderHeatmap(data);
        } catch (error) {
            console.error('Erro ao carregar heatmap:', error);
            // Renderizar vazio se não houver dados
            const container = document.getElementById('heatmapContainer');
            container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 300px; color: #999; font-size: 1.1rem;">Nenhum dado disponível ainda. Comece a estudar!</div>';
        }
    }

    renderHeatmap(data) {
        const container = document.getElementById('heatmapContainer');
        
        // Se não houver dados, mostrar mensagem
        if (!data) {
            container.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 300px; color: #999; font-size: 1.1rem;">Nenhum dado disponível ainda. Comece a estudar!</div>';
            return;
        }
        
        const days = ['', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
        const hours = ['6h', '7h', '8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h'];
        
        let html = '<div class="heatmap-grid">';
        
        // Cabeçalho
        days.forEach(day => {
            html += `<div class="heatmap-header">${day}</div>`;
        });
        
        // Dados
        hours.forEach((hour, hourIndex) => {
            html += `<div class="heatmap-time">${hour}</div>`;
            for (let day = 0; day < 7; day++) {
                const intensity = data[day]?.[hourIndex] || 0;
                const minutes = intensity * 15;
                html += `<div class="heatmap-cell" data-intensity="${intensity}" title="${minutes} min">
                    ${minutes > 0 ? minutes : ''}
                </div>`;
            }
        });
        
        html += '</div>';
        
        // Legenda
        html += '<div class="heatmap-legend">';
        html += '<span>Menos</span>';
        for (let i = 0; i <= 4; i++) {
            html += `<div class="heatmap-legend-item" data-intensity="${i}"></div>`;
        }
        html += '<span>Mais</span>';
        html += '</div>';
        
        container.innerHTML = html;
    }

    async loadPatterns() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/stats/patterns`);
            const patterns = await response.json();
            
            document.getElementById('bestTimeOfDay').textContent = patterns.bestTime || '14:00 - 16:00';
            document.getElementById('bestTimeDesc').textContent = `${patterns.bestTimeMinutes || 0} minutos estudados`;
            
            document.getElementById('bestDayOfWeek').textContent = patterns.bestDay || 'Quarta-feira';
            document.getElementById('bestDayDesc').textContent = `${patterns.bestDayMinutes || 0} minutos estudados`;
            
            document.getElementById('avgSessionDuration').textContent = `${patterns.avgDuration || 25} min`;
            document.getElementById('completionRate').textContent = `${patterns.completionRate || 0}%`;
        } catch (error) {
            console.error('Erro ao carregar padrões:', error);
        }
    }

    async loadRanking() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/stats/ranking`);
            const ranking = await response.json();
            
            this.renderRanking(ranking);
        } catch (error) {
            console.error('Erro ao carregar ranking:', error);
            this.renderRanking([]); // Renderizar vazio
        }
    }

    renderRanking(data) {
        const container = document.getElementById('rankingContainer');
        
        if (!data || data.length === 0) {
            container.innerHTML = '<div class="ranking-loading">Nenhum dado disponível ainda</div>';
            return;
        }
        
        let html = '<div class="ranking-list">';
        
        data.forEach((item, index) => {
            const position = index + 1;
            const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '';
            const progress = (item.currentMinutes / (item.weeklyHours * 60)) * 100;
            
            html += `
                <div class="ranking-item">
                    <div class="ranking-position">${medal || position}</div>
                    <div class="ranking-subject">
                        <div class="ranking-subject-name">${item.name}</div>
                        <div class="ranking-subject-stats">
                            ${Math.floor(item.currentMinutes / 60)}h ${item.currentMinutes % 60}m • ${item.sessions} sessões
                        </div>
                    </div>
                    <div class="ranking-progress">
                        <div class="ranking-progress-bar">
                            <div class="ranking-progress-fill" style="width: ${Math.min(progress, 100)}%"></div>
                        </div>
                        <div class="ranking-progress-text">${Math.round(progress)}% da meta</div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    // Exportação
    async exportToCSV() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/export/csv`);
            const blob = await response.blob();
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pomodoro-stats-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            document.getElementById('exportModal').classList.remove('active');
            alert('✅ Dados exportados com sucesso!');
        } catch (error) {
            console.error('Erro ao exportar CSV:', error);
            alert('❌ Erro ao exportar dados');
        }
    }

    async exportToJSON() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/export/json`);
            const data = await response.json();
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pomodoro-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            document.getElementById('exportModal').classList.remove('active');
            alert('✅ Dados exportados com sucesso!');
        } catch (error) {
            console.error('Erro ao exportar JSON:', error);
            alert('❌ Erro ao exportar dados');
        }
    }

    async createBackup() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/backup/create`, {
                method: 'POST'
            });
            const blob = await response.blob();
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `pomodoro-backup-${new Date().toISOString().split('T')[0]}.db`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            alert('✅ Backup criado com sucesso!');
        } catch (error) {
            console.error('Erro ao criar backup:', error);
            alert('❌ Erro ao criar backup');
        }
    }

    async restoreBackup(file) {
        if (!file) return;
        
        if (!confirm('⚠️ ATENÇÃO: Restaurar um backup substituirá TODOS os dados atuais. Deseja continuar?')) {
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch(`${API_BASE_URL}/api/backup/restore`, {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                alert('✅ Backup restaurado com sucesso! A página será recarregada.');
                document.getElementById('backupModal').classList.remove('active');
                setTimeout(() => window.location.reload(), 1000);
            } else {
                throw new Error('Erro ao restaurar backup');
            }
        } catch (error) {
            console.error('Erro ao restaurar backup:', error);
            alert('❌ Erro ao restaurar backup');
        }
    }
}

// Inicializar dashboard
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});
