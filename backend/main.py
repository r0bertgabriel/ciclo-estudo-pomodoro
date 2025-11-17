from datetime import datetime
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import compatível com Windows e Linux
try:
    from backend.database import Database
    from backend.ngrok_integration import get_ngrok_url, init_ngrok
except ModuleNotFoundError:
    from database import Database
    from ngrok_integration import get_ngrok_url, init_ngrok

app = FastAPI(title="Pomodoro API", version="1.0.0")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar database
db = Database()

# ===== MODELS =====

class CycleCreate(BaseModel):
    id: str
    name: str
    study_days: List[str]
    created_at: str
    week_start_date: str
    is_active: Optional[bool] = False

class CycleUpdate(BaseModel):
    name: str
    study_days: List[str]
    week_start_date: Optional[str] = None

class SubjectCreate(BaseModel):
    id: str
    cycle_id: str
    name: str
    weeklyHours: int
    color: str
    priority: int
    currentWeekMinutes: Optional[int] = 0
    totalMinutes: Optional[int] = 0
    totalSessions: Optional[int] = 0

class SubjectUpdate(BaseModel):
    name: str
    weeklyHours: int
    color: str
    priority: int
    currentWeekMinutes: Optional[int] = 0
    totalMinutes: Optional[int] = 0
    totalSessions: Optional[int] = 0

class SessionCreate(BaseModel):
    subject_id: str
    minutes: int
    started_at: str
    completed_at: str

class StatsUpdate(BaseModel):
    completedSessions: int
    totalFocusTime: int
    totalBreakTime: int

class GoalCreate(BaseModel):
    id: str
    type: str  # 'daily', 'weekly', 'monthly'
    target_type: str  # 'sessions', 'minutes', 'hours'
    target_value: int
    current_value: Optional[int] = 0
    subject_id: Optional[str] = None
    start_date: str
    end_date: str
    status: Optional[str] = 'active'
    created_at: str

class GoalUpdate(BaseModel):
    current_value: Optional[int] = None
    status: Optional[str] = None
    completed_at: Optional[str] = None

# ===== CYCLES ENDPOINTS =====

@app.get("/")
async def root():
    return {"message": "Pomodoro API is running"}

@app.get("/api/health")
async def health_check():
    """Health check endpoint para verificar se o backend está disponível"""
    return {
        "status": "healthy",
        "service": "Pomodoro API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/cycles")
async def create_cycle(cycle: CycleCreate):
    """Cria um novo ciclo"""
    try:
        result = db.create_cycle(cycle.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/cycles")
async def get_cycles():
    """Retorna todos os ciclos"""
    try:
        cycles = db.get_all_cycles()
        return cycles
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/cycles/active")
async def get_active_cycle():
    """Retorna o ciclo ativo"""
    try:
        cycle = db.get_active_cycle()
        if not cycle:
            return None
        return cycle
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/cycles/{cycle_id}")
async def get_cycle(cycle_id: str):
    """Retorna um ciclo específico"""
    try:
        cycle = db.get_cycle_by_id(cycle_id)
        if not cycle:
            raise HTTPException(status_code=404, detail="Cycle not found")
        return cycle
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/cycles/{cycle_id}/activate")
async def activate_cycle(cycle_id: str):
    """Define um ciclo como ativo"""
    try:
        db.set_active_cycle(cycle_id)
        return {"message": "Cycle activated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/cycles/{cycle_id}")
async def update_cycle(cycle_id: str, cycle: CycleUpdate):
    """Atualiza um ciclo"""
    try:
        db.update_cycle(cycle_id, cycle.dict())
        return {"message": "Cycle updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/cycles/{cycle_id}")
async def delete_cycle(cycle_id: str):
    """Deleta um ciclo"""
    try:
        db.delete_cycle(cycle_id)
        return {"message": "Cycle deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== SUBJECTS ENDPOINTS =====

@app.post("/api/subjects")
async def create_subject(subject: SubjectCreate):
    """Cria uma nova disciplina"""
    try:
        # Converter para formato do banco
        subject_dict = subject.dict()
        subject_dict['weekly_hours'] = subject_dict.pop('weeklyHours')
        result = db.create_subject(subject_dict)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/subjects/{subject_id}")
async def update_subject(subject_id: str, subject: SubjectUpdate):
    """Atualiza uma disciplina"""
    try:
        db.update_subject(subject_id, subject.dict())
        return {"message": "Subject updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/subjects/{subject_id}")
async def delete_subject(subject_id: str):
    """Deleta uma disciplina"""
    try:
        db.delete_subject(subject_id)
        return {"message": "Subject deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/cycles/{cycle_id}/reset-week")
async def reset_week(cycle_id: str):
    """Reseta os minutos semanais de um ciclo"""
    try:
        db.reset_week_minutes(cycle_id)
        return {"message": "Week reset"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== SESSIONS ENDPOINTS =====

@app.post("/api/sessions")
async def create_session(session: SessionCreate):
    """Registra uma sessão de estudo"""
    try:
        db.create_session(session.dict())
        return {"message": "Session created"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== STATS ENDPOINTS =====

# Dashboard endpoints devem vir ANTES dos endpoints com parâmetros
@app.get("/api/stats/general")
async def get_general_stats():
    """Retorna estatísticas gerais do usuário"""
    try:
        stats = db.get_general_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats/today")
async def get_today_stats():
    """Retorna estatísticas de hoje para contadores de streaming"""
    try:
        today = datetime.now().strftime("%Y-%m-%d")
        stats = db.get_day_stats(today)
        
        # Calcular streak atual
        streak = db.get_current_streak()
        
        return {
            "total_minutes": stats.get("total_minutes", 0),
            "sessions_completed": stats.get("sessions_completed", 0),
            "current_streak": streak
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats/chart-data")
async def get_chart_data(period: str = "week", subject: str = "all"):
    """Retorna dados para gráficos de evolução"""
    try:
        data = db.get_chart_data(period, subject)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats/heatmap")
async def get_heatmap_data():
    """Retorna dados para o heatmap de atividade"""
    try:
        data = db.get_heatmap_data()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats/patterns")
async def get_patterns():
    """Retorna análise de padrões de estudo"""
    try:
        patterns = db.get_study_patterns()
        return patterns
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/stats/ranking")
async def get_subject_ranking():
    """Retorna ranking de disciplinas"""
    try:
        ranking = db.get_subject_ranking()
        return ranking
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoints com parâmetros devem vir DEPOIS
@app.get("/api/stats/{date}")
async def get_stats(date: str):
    """Retorna estatísticas de uma data"""
    try:
        stats = db.get_or_create_stats(date)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/stats/{date}")
async def update_stats(date: str, stats: StatsUpdate):
    """Atualiza estatísticas"""
    try:
        db.update_stats(date, stats.dict())
        return {"message": "Stats updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== EXPORT ENDPOINTS =====

@app.get("/api/export/csv")
async def export_to_csv():
    """Exporta dados em formato CSV"""
    try:
        import csv
        import io
        from datetime import datetime

        from fastapi.responses import StreamingResponse
        
        # Buscar todas as sessões
        sessions = db.get_all_sessions()
        
        # Criar CSV
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Cabeçalho
        writer.writerow(['Data', 'Disciplina', 'Minutos', 'Hora Início', 'Hora Fim'])
        
        # Dados
        for session in sessions:
            writer.writerow([
                session['started_at'].split('T')[0],
                session['subject_name'],
                session['minutes'],
                session['started_at'].split('T')[1][:5],
                session['completed_at'].split('T')[1][:5]
            ])
        
        output.seek(0)
        
        return StreamingResponse(
            iter([output.getvalue()]),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=pomodoro-stats-{datetime.now().strftime('%Y-%m-%d')}.csv"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/export/json")
async def export_to_json():
    """Exporta todos os dados em formato JSON"""
    try:
        data = {
            'cycles': db.get_all_cycles(),
            'subjects': db.get_all_subjects(),
            'sessions': db.get_all_sessions(),
            'exported_at': datetime.now().isoformat()
        }
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== BACKUP ENDPOINTS =====

@app.post("/api/backup/create")
async def create_backup():
    """Cria um backup do banco de dados"""
    try:
        import shutil
        from datetime import datetime

        from fastapi.responses import FileResponse
        
        # Copiar banco de dados para arquivo temporário
        backup_path = f"pomodoro-backup-{datetime.now().strftime('%Y%m%d-%H%M%S')}.db"
        shutil.copy2(db.db_path, backup_path)
        
        return FileResponse(
            backup_path,
            media_type='application/octet-stream',
            filename=backup_path
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/backup/restore")
async def restore_backup(file: bytes):
    """Restaura banco de dados de um backup"""
    try:
        import shutil
        
        # Fazer backup do banco atual antes de restaurar
        shutil.copy2(db.db_path, f"{db.db_path}.backup")
        
        # Restaurar do arquivo enviado
        with open(db.db_path, 'wb') as f:
            f.write(file)
        
        return {"message": "Backup restored successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== GOALS ENDPOINTS =====

@app.post("/api/goals")
async def create_goal(goal: GoalCreate):
    """Cria uma nova meta"""
    try:
        result = db.create_goal(goal.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/goals")
async def get_goals(active_only: bool = False):
    """Retorna todas as metas ou apenas ativas"""
    try:
        if active_only:
            goals = db.get_active_goals()
        else:
            goals = db.get_all_goals()
        return goals
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/goals/summary")
async def get_goals_summary():
    """Retorna resumo das metas"""
    try:
        summary = db.get_goals_summary()
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/goals/{goal_id}")
async def update_goal(goal_id: str, goal: GoalUpdate):
    """Atualiza uma meta"""
    try:
        updates = {k: v for k, v in goal.dict().items() if v is not None}
        db.update_goal(goal_id, updates)
        return {"message": "Goal updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/goals/{goal_id}/progress")
async def update_goal_progress(goal_id: str, current_value: int):
    """Atualiza o progresso de uma meta"""
    try:
        db.update_goal_progress(goal_id, current_value)
        return {"message": "Goal progress updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/goals/{goal_id}")
async def delete_goal(goal_id: str):
    """Deleta uma meta"""
    try:
        db.delete_goal(goal_id)
        return {"message": "Goal deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== NGROK & QR CODE =====

@app.get("/api/ngrok/url")
async def get_public_url():
    """Retorna URL pública do ngrok"""
    print("🔍 Endpoint /api/ngrok/url chamado")
    url = get_ngrok_url()
    if url:
        print(f"✅ Retornando URL: {url}")
        return {"url": url, "qr_data": url, "active": True}
    print("❌ Ngrok não está ativo")
    return {"url": None, "message": "Ngrok não está ativo", "active": False}

@app.on_event("startup")
async def startup_event():
    """Inicia ngrok ao iniciar o servidor"""
    import os
    if os.getenv("ENABLE_NGROK", "false").lower() == "true":
        print("🚀 Iniciando túnel ngrok...")
        url = init_ngrok(8000)
        if url:
            print(f"✅ Acesso público via: {url}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
