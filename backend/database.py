import json
import sqlite3
from datetime import datetime


class Database:
    def __init__(self, db_path="pomodoro.db"):
        self.db_path = db_path
        self.init_db()
    
    def get_connection(self):
        return sqlite3.connect(self.db_path)
    
    def init_db(self):
        """Inicializa o banco de dados com as tabelas necessárias"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Tabela de ciclos
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cycles (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                study_days TEXT NOT NULL,
                created_at TEXT NOT NULL,
                week_start_date TEXT NOT NULL,
                is_active INTEGER DEFAULT 0
            )
        ''')
        
        # Tabela de disciplinas
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS subjects (
                id TEXT PRIMARY KEY,
                cycle_id TEXT NOT NULL,
                name TEXT NOT NULL,
                weekly_hours INTEGER NOT NULL,
                color TEXT NOT NULL,
                priority INTEGER NOT NULL,
                current_week_minutes INTEGER DEFAULT 0,
                total_minutes INTEGER DEFAULT 0,
                total_sessions INTEGER DEFAULT 0,
                FOREIGN KEY (cycle_id) REFERENCES cycles(id) ON DELETE CASCADE
            )
        ''')
        
        # Tabela de sessões de estudo
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS study_sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                subject_id TEXT NOT NULL,
                minutes INTEGER NOT NULL,
                started_at TEXT NOT NULL,
                completed_at TEXT NOT NULL,
                FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
            )
        ''')
        
        # Tabela de estatísticas
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                completed_sessions INTEGER DEFAULT 0,
                total_focus_time INTEGER DEFAULT 0,
                total_break_time INTEGER DEFAULT 0,
                UNIQUE(date)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    # ===== CYCLES =====
    
    def create_cycle(self, cycle_data):
        """Cria um novo ciclo (ou atualiza se já existir)"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT OR REPLACE INTO cycles (id, name, study_days, created_at, week_start_date, is_active)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                cycle_data['id'],
                cycle_data['name'],
                json.dumps(cycle_data['study_days']),
                cycle_data['created_at'],
                cycle_data['week_start_date'],
                1 if cycle_data.get('is_active', False) else 0
            ))
            
            conn.commit()
            return cycle_data
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
    
    def get_all_cycles(self):
        """Retorna todos os ciclos"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM cycles')
        rows = cursor.fetchall()
        
        cycles = []
        for row in rows:
            cycle = {
                'id': row[0],
                'name': row[1],
                'study_days': json.loads(row[2]),
                'created_at': row[3],
                'week_start_date': row[4],
                'is_active': bool(row[5]),
                'subjects': self.get_subjects_by_cycle(row[0])
            }
            cycles.append(cycle)
        
        conn.close()
        return cycles
    
    def get_cycle_by_id(self, cycle_id):
        """Retorna um ciclo específico"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM cycles WHERE id = ?', (cycle_id,))
        row = cursor.fetchone()
        
        if not row:
            conn.close()
            return None
        
        cycle = {
            'id': row[0],
            'name': row[1],
            'study_days': json.loads(row[2]),
            'created_at': row[3],
            'week_start_date': row[4],
            'is_active': bool(row[5]),
            'subjects': self.get_subjects_by_cycle(row[0])
        }
        
        conn.close()
        return cycle
    
    def get_active_cycle(self):
        """Retorna o ciclo ativo"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM cycles WHERE is_active = 1 LIMIT 1')
        row = cursor.fetchone()
        
        if not row:
            conn.close()
            return None
        
        cycle = {
            'id': row[0],
            'name': row[1],
            'study_days': json.loads(row[2]),
            'created_at': row[3],
            'week_start_date': row[4],
            'is_active': bool(row[5]),
            'subjects': self.get_subjects_by_cycle(row[0])
        }
        
        conn.close()
        return cycle
    
    def set_active_cycle(self, cycle_id):
        """Define um ciclo como ativo"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Desativar todos os ciclos
        cursor.execute('UPDATE cycles SET is_active = 0')
        
        # Ativar o ciclo especificado
        cursor.execute('UPDATE cycles SET is_active = 1 WHERE id = ?', (cycle_id,))
        
        conn.commit()
        conn.close()
        return True
    
    def update_cycle(self, cycle_id, cycle_data):
        """Atualiza um ciclo"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE cycles 
            SET name = ?, study_days = ?, week_start_date = ?
            WHERE id = ?
        ''', (
            cycle_data['name'],
            json.dumps(cycle_data['study_days']),
            cycle_data.get('week_start_date', ''),
            cycle_id
        ))
        
        conn.commit()
        conn.close()
        return True
    
    def delete_cycle(self, cycle_id):
        """Deleta um ciclo"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM cycles WHERE id = ?', (cycle_id,))
        
        conn.commit()
        conn.close()
        return True
    
    # ===== SUBJECTS =====
    
    def create_subject(self, subject_data):
        """Cria uma nova disciplina (ou atualiza se já existir)"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            cursor.execute('''
                INSERT OR REPLACE INTO subjects 
                (id, cycle_id, name, weekly_hours, color, priority, current_week_minutes, total_minutes, total_sessions)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                subject_data['id'],
                subject_data['cycle_id'],
                subject_data['name'],
                subject_data.get('weekly_hours', subject_data.get('weeklyHours', 0)),
                subject_data['color'],
                subject_data['priority'],
                subject_data.get('current_week_minutes', subject_data.get('currentWeekMinutes', 0)),
                subject_data.get('total_minutes', subject_data.get('totalMinutes', 0)),
                subject_data.get('total_sessions', subject_data.get('totalSessions', 0))
            ))
            
            conn.commit()
            return subject_data
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            conn.close()
    
    def get_subjects_by_cycle(self, cycle_id):
        """Retorna todas as disciplinas de um ciclo"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM subjects WHERE cycle_id = ?', (cycle_id,))
        rows = cursor.fetchall()
        
        subjects = []
        for row in rows:
            subject = {
                'id': row[0],
                'cycle_id': row[1],
                'name': row[2],
                'weeklyHours': row[3],
                'color': row[4],
                'priority': row[5],
                'currentWeekMinutes': row[6],
                'totalMinutes': row[7],
                'totalSessions': row[8]
            }
            subjects.append(subject)
        
        conn.close()
        return subjects
    
    def update_subject(self, subject_id, subject_data):
        """Atualiza uma disciplina"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE subjects 
            SET name = ?, weekly_hours = ?, color = ?, priority = ?, 
                current_week_minutes = ?, total_minutes = ?, total_sessions = ?
            WHERE id = ?
        ''', (
            subject_data['name'],
            subject_data['weeklyHours'],
            subject_data['color'],
            subject_data['priority'],
            subject_data.get('currentWeekMinutes', 0),
            subject_data.get('totalMinutes', 0),
            subject_data.get('totalSessions', 0),
            subject_id
        ))
        
        conn.commit()
        conn.close()
        return True
    
    def delete_subject(self, subject_id):
        """Deleta uma disciplina"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('DELETE FROM subjects WHERE id = ?', (subject_id,))
        
        conn.commit()
        conn.close()
        return True
    
    def reset_week_minutes(self, cycle_id):
        """Reseta os minutos semanais de todas as disciplinas de um ciclo"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE subjects 
            SET current_week_minutes = 0 
            WHERE cycle_id = ?
        ''', (cycle_id,))
        
        conn.commit()
        conn.close()
        return True
    
    # ===== SESSIONS =====
    
    def create_session(self, session_data):
        """Registra uma sessão de estudo"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO study_sessions (subject_id, minutes, started_at, completed_at)
            VALUES (?, ?, ?, ?)
        ''', (
            session_data['subject_id'],
            session_data['minutes'],
            session_data['started_at'],
            session_data['completed_at']
        ))
        
        conn.commit()
        conn.close()
        return True
    
    # ===== STATS =====
    
    def get_or_create_stats(self, date):
        """Retorna ou cria estatísticas para uma data"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM stats WHERE date = ?', (date,))
        row = cursor.fetchone()
        
        if row:
            stats = {
                'date': row[1],
                'completedSessions': row[2],
                'totalFocusTime': row[3],
                'totalBreakTime': row[4]
            }
            conn.close()
            return stats
        
        # Criar novo registro
        cursor.execute('''
            INSERT INTO stats (date, completed_sessions, total_focus_time, total_break_time)
            VALUES (?, 0, 0, 0)
        ''', (date,))
        
        conn.commit()
        conn.close()
        
        return {
            'date': date,
            'completedSessions': 0,
            'totalFocusTime': 0,
            'totalBreakTime': 0
        }
    
    def update_stats(self, date, stats_data):
        """Atualiza estatísticas"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            UPDATE stats 
            SET completed_sessions = ?, total_focus_time = ?, total_break_time = ?
            WHERE date = ?
        ''', (
            stats_data['completedSessions'],
            stats_data['totalFocusTime'],
            stats_data['totalBreakTime'],
            date
        ))
        
        conn.commit()
        conn.close()
        return True
    
    # ===== ANALYTICS & DASHBOARD =====
    
    def get_general_stats(self):
        """Retorna estatísticas gerais"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Total de minutos estudados
        cursor.execute('SELECT SUM(minutes) FROM study_sessions')
        total_minutes = cursor.fetchone()[0] or 0
        
        # Total de sessões
        cursor.execute('SELECT COUNT(*) FROM study_sessions')
        total_sessions = cursor.fetchone()[0] or 0
        
        # Total de disciplinas
        cursor.execute('SELECT COUNT(DISTINCT subject_id) FROM study_sessions')
        total_subjects = cursor.fetchone()[0] or 0
        
        # Sequência de dias consecutivos (streak)
        cursor.execute('''
            SELECT DISTINCT DATE(started_at) as study_date 
            FROM study_sessions 
            ORDER BY study_date DESC
        ''')
        dates = [row[0] for row in cursor.fetchall()]
        
        current_streak = 0
        if dates:
            from datetime import timedelta
            today = datetime.now().date()
            
            for i, date_str in enumerate(dates):
                date = datetime.strptime(date_str, '%Y-%m-%d').date()
                expected_date = today - timedelta(days=i)
                
                if date == expected_date:
                    current_streak += 1
                else:
                    break
        
        conn.close()
        
        return {
            'totalMinutes': total_minutes,
            'totalSessions': total_sessions,
            'totalSubjects': total_subjects,
            'currentStreak': current_streak
        }
    
    def get_chart_data(self, period='week', subject_id='all'):
        """Retorna dados para gráficos"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Determinar período
        from datetime import timedelta
        
        if period == 'week':
            days = 7
        elif period == 'month':
            days = 30
        else:
            days = 365
        
        start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
        
        # Query base
        query = '''
            SELECT DATE(started_at) as date, SUM(minutes) as total_minutes
            FROM study_sessions
            WHERE started_at >= ?
        '''
        params = [start_date]
        
        if subject_id != 'all':
            query += ' AND subject_id = ?'
            params.append(subject_id)
        
        query += ' GROUP BY DATE(started_at) ORDER BY date'
        
        cursor.execute(query, params)
        results = cursor.fetchall()
        
        conn.close()
        
        # Formatar dados
        labels = []
        data = []
        
        for row in results:
            date = datetime.strptime(row[0], '%Y-%m-%d')
            labels.append(date.strftime('%d/%m'))
            data.append(row[1] / 60)  # Converter para horas
        
        return {
            'evolution': {
                'labels': labels,
                'datasets': [{
                    'label': 'Horas de Estudo',
                    'data': data,
                    'borderColor': '#667eea',
                    'backgroundColor': 'rgba(102, 126, 234, 0.1)',
                    'borderWidth': 3,
                    'fill': True,
                    'tension': 0.4
                }]
            },
            'subjects': None  # TODO: Implementar gráfico por disciplina
        }
    
    def get_heatmap_data(self):
        """Retorna dados para heatmap de atividade"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        # Buscar sessões dos últimos 30 dias
        from datetime import timedelta
        start_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        
        cursor.execute('''
            SELECT started_at, minutes
            FROM study_sessions
            WHERE started_at >= ?
        ''', (start_date,))
        
        sessions = cursor.fetchall()
        conn.close()
        
        # Criar matriz 7 dias x 17 horas (6h-22h)
        heatmap = [[0 for _ in range(17)] for _ in range(7)]
        
        for session in sessions:
            dt = datetime.fromisoformat(session[0])
            day_of_week = dt.weekday()  # 0 = Segunda
            hour = dt.hour
            
            if 6 <= hour <= 22:
                hour_index = hour - 6
                heatmap[day_of_week][hour_index] += session[1] // 15  # Intensidade
        
        return heatmap
    
    def get_study_patterns(self):
        """Retorna análise de padrões de estudo"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        from collections import defaultdict
        
        # Buscar todas as sessões
        cursor.execute('''
            SELECT started_at, minutes
            FROM study_sessions
        ''')
        sessions = cursor.fetchall()
        
        if not sessions:
            conn.close()
            return {
                'bestTime': '14:00 - 16:00',
                'bestTimeMinutes': 0,
                'bestDay': 'Segunda-feira',
                'bestDayMinutes': 0,
                'avgDuration': 25,
                'completionRate': 0
            }
        
        # Análise por horário
        hour_stats = defaultdict(int)
        day_stats = defaultdict(int)
        durations = []
        
        for session in sessions:
            dt = datetime.fromisoformat(session[0])
            hour = dt.hour
            day = dt.weekday()
            minutes = session[1]
            
            hour_stats[hour] += minutes
            day_stats[day] += minutes
            durations.append(minutes)
        
        # Melhor horário (intervalo de 2 horas)
        best_hour = max(hour_stats.keys(), key=lambda x: hour_stats[x]) if hour_stats else 14
        best_time = f"{best_hour}:00 - {best_hour + 2}:00"
        best_time_minutes = hour_stats[best_hour] if hour_stats else 0
        
        # Melhor dia
        day_names = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 
                     'Sexta-feira', 'Sábado', 'Domingo']
        best_day_index = max(day_stats.keys(), key=lambda x: day_stats[x]) if day_stats else 0
        best_day = day_names[best_day_index]
        best_day_minutes = day_stats[best_day_index] if day_stats else 0
        
        # Duração média
        avg_duration = sum(durations) // len(durations) if durations else 25
        
        # Taxa de conclusão (assumindo 25 min como meta)
        completion_rate = int((avg_duration / 25) * 100) if avg_duration else 0
        
        conn.close()
        
        return {
            'bestTime': best_time,
            'bestTimeMinutes': best_time_minutes,
            'bestDay': best_day,
            'bestDayMinutes': best_day_minutes,
            'avgDuration': avg_duration,
            'completionRate': min(completion_rate, 100)
        }
    
    def get_subject_ranking(self):
        """Retorna ranking de disciplinas"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                s.id,
                s.name,
                s.weekly_hours,
                s.current_week_minutes,
                COUNT(ss.id) as sessions
            FROM subjects s
            LEFT JOIN study_sessions ss ON s.id = ss.subject_id
            GROUP BY s.id
            ORDER BY s.current_week_minutes DESC
        ''')
        
        subjects = cursor.fetchall()
        conn.close()
        
        ranking = []
        for subject in subjects:
            ranking.append({
                'id': subject[0],
                'name': subject[1],
                'weeklyHours': subject[2],
                'currentMinutes': subject[3],
                'sessions': subject[4]
            })
        
        return ranking
    
    def get_all_sessions(self):
        """Retorna todas as sessões com informações da disciplina"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT 
                ss.id,
                ss.subject_id,
                s.name as subject_name,
                ss.minutes,
                ss.started_at,
                ss.completed_at
            FROM study_sessions ss
            JOIN subjects s ON ss.subject_id = s.id
            ORDER BY ss.started_at DESC
        ''')
        
        sessions = cursor.fetchall()
        conn.close()
        
        result = []
        for session in sessions:
            result.append({
                'id': session[0],
                'subject_id': session[1],
                'subject_name': session[2],
                'minutes': session[3],
                'started_at': session[4],
                'completed_at': session[5]
            })
        
        return result
    
    def get_all_subjects(self):
        """Retorna todas as disciplinas"""
        conn = self.get_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT id, name FROM subjects')
        subjects = cursor.fetchall()
        conn.close()
        
        return [{'id': s[0], 'name': s[1]} for s in subjects]
