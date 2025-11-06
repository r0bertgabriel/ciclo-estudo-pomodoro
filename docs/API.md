# 📡 Documentação da API

## Base URL
```
http://localhost:8000/api
```

## 📚 Documentação Interativa
FastAPI gera documentação automática:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 🔄 Endpoints - Ciclos

### GET /cycles
Retorna todos os ciclos

**Response 200:**
```json
[
  {
    "id": "cycle_1234567890",
    "name": "Semestre 2024.2",
    "study_days": ["mon", "tue", "wed", "thu", "fri"],
    "created_at": "2024-01-15T10:30:00",
    "week_start_date": "2024-01-15",
    "is_active": true,
    "subjects": [...]
  }
]
```

---

### GET /cycles/active
Retorna o ciclo ativo

**Response 200:**
```json
{
  "id": "cycle_1234567890",
  "name": "Semestre 2024.2",
  "study_days": ["mon", "tue", "wed", "thu", "fri"],
  "created_at": "2024-01-15T10:30:00",
  "week_start_date": "2024-01-15",
  "is_active": true,
  "subjects": [...]
}
```

---

### GET /cycles/{cycle_id}
Retorna um ciclo específico

**Response 200:**
```json
{
  "id": "cycle_1234567890",
  "name": "Semestre 2024.2",
  "study_days": ["mon", "tue", "wed", "thu", "fri"],
  "created_at": "2024-01-15T10:30:00",
  "week_start_date": "2024-01-15",
  "is_active": true,
  "subjects": [...]
}
```

---

### POST /cycles
Cria um novo ciclo

**Request Body:**
```json
{
  "id": "cycle_1234567890",
  "name": "Semestre 2024.2",
  "study_days": ["mon", "tue", "wed", "thu", "fri"],
  "created_at": "2024-01-15T10:30:00",
  "week_start_date": "2024-01-15",
  "is_active": false
}
```

**Response 200:**
```json
{
  "id": "cycle_1234567890",
  "name": "Semestre 2024.2",
  "study_days": ["mon", "tue", "wed", "thu", "fri"],
  "created_at": "2024-01-15T10:30:00",
  "week_start_date": "2024-01-15",
  "is_active": false
}
```

---

### PUT /cycles/{cycle_id}
Atualiza um ciclo

**Request Body:**
```json
{
  "name": "Semestre 2024.2 - Atualizado",
  "study_days": ["mon", "tue", "wed", "thu", "fri", "sat"],
  "week_start_date": "2024-01-22"
}
```

**Response 200:**
```json
{
  "message": "Cycle updated"
}
```

---

### PUT /cycles/{cycle_id}/activate
Define um ciclo como ativo

**Response 200:**
```json
{
  "message": "Cycle activated"
}
```

---

### DELETE /cycles/{cycle_id}
Deleta um ciclo (CASCADE: deleta todas as disciplinas)

**Response 200:**
```json
{
  "message": "Cycle deleted"
}
```

---

## 📚 Endpoints - Disciplinas

### POST /subjects
Cria uma nova disciplina

**Request Body:**
```json
{
  "id": "subject_9876543210",
  "cycle_id": "cycle_1234567890",
  "name": "Matemática",
  "weeklyHours": 10,
  "color": "#3498db",
  "priority": 3,
  "currentWeekMinutes": 0,
  "totalMinutes": 0,
  "totalSessions": 0
}
```

**Response 200:**
```json
{
  "id": "subject_9876543210",
  "cycle_id": "cycle_1234567890",
  "name": "Matemática",
  "weekly_hours": 10,
  "color": "#3498db",
  "priority": 3,
  "current_week_minutes": 0,
  "total_minutes": 0,
  "total_sessions": 0
}
```

---

### PUT /subjects/{subject_id}
Atualiza uma disciplina

**Request Body:**
```json
{
  "name": "Matemática Avançada",
  "weeklyHours": 12,
  "color": "#e74c3c",
  "priority": 3,
  "currentWeekMinutes": 120,
  "totalMinutes": 600,
  "totalSessions": 8
}
```

**Response 200:**
```json
{
  "message": "Subject updated"
}
```

---

### DELETE /subjects/{subject_id}
Deleta uma disciplina

**Response 200:**
```json
{
  "message": "Subject deleted"
}
```

---

### PUT /cycles/{cycle_id}/reset-week
Reseta os minutos semanais de todas as disciplinas do ciclo

**Response 200:**
```json
{
  "message": "Week reset"
}
```

---

## 📊 Endpoints - Sessões

### POST /sessions
Registra uma sessão de estudo concluída

**Request Body:**
```json
{
  "subject_id": "subject_9876543210",
  "minutes": 25,
  "started_at": "2024-01-15T14:00:00",
  "completed_at": "2024-01-15T14:25:00"
}
```

**Response 200:**
```json
{
  "message": "Session created"
}
```

---

## 📈 Endpoints - Estatísticas

### GET /stats/{date}
Retorna estatísticas de uma data específica (formato: YYYY-MM-DD)

**Response 200:**
```json
{
  "date": "2024-01-15",
  "completedSessions": 8,
  "totalFocusTime": 200,
  "totalBreakTime": 40
}
```

---

### PUT /stats/{date}
Atualiza estatísticas de uma data

**Request Body:**
```json
{
  "completedSessions": 10,
  "totalFocusTime": 250,
  "totalBreakTime": 50
}
```

**Response 200:**
```json
{
  "message": "Stats updated"
}
```

---

## 🔒 Estrutura do Banco de Dados

### Tabela: cycles
```sql
CREATE TABLE cycles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    study_days TEXT NOT NULL,  -- JSON array
    created_at TEXT NOT NULL,
    week_start_date TEXT NOT NULL,
    is_active INTEGER DEFAULT 0
)
```

### Tabela: subjects
```sql
CREATE TABLE subjects (
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
```

### Tabela: study_sessions
```sql
CREATE TABLE study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id TEXT NOT NULL,
    minutes INTEGER NOT NULL,
    started_at TEXT NOT NULL,
    completed_at TEXT NOT NULL,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
)
```

### Tabela: stats
```sql
CREATE TABLE stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT UNIQUE NOT NULL,
    completed_sessions INTEGER DEFAULT 0,
    total_focus_time INTEGER DEFAULT 0,
    total_break_time INTEGER DEFAULT 0
)
```

---

## 🧪 Testando a API

### Com cURL

```bash
# Listar ciclos
curl http://localhost:8000/api/cycles

# Criar ciclo
curl -X POST http://localhost:8000/api/cycles \
  -H "Content-Type: application/json" \
  -d '{
    "id": "cycle_test",
    "name": "Teste",
    "study_days": ["mon", "tue"],
    "created_at": "2024-01-15T10:00:00",
    "week_start_date": "2024-01-15",
    "is_active": true
  }'

# Ativar ciclo
curl -X PUT http://localhost:8000/api/cycles/cycle_test/activate
```

### Com Postman/Insomnia

1. Importe a URL base: `http://localhost:8000`
2. Crie requests para cada endpoint
3. Use JSON nos body dos POSTs/PUTs

---

## ⚠️ Códigos de Erro

- **200:** Sucesso
- **404:** Recurso não encontrado
- **500:** Erro interno do servidor

---

**Documentação gerada automaticamente em:** http://localhost:8000/docs
