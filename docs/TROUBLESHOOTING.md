# 🔧 Troubleshooting - Resolvendo Erros Comuns

## ❌ Erro: "Could not import module 'main'"

### Problema:
```bash
ERROR: Error loading ASGI app. Could not import module "main".
```

### Causa:
Você está tentando executar o uvicorn do **diretório errado**. O uvicorn precisa ser executado do diretório `backend/`.

### ✅ Solução:

**Opção 1: Navegar para o diretório backend**
```bash
cd backend
python3 -m uvicorn main:app --reload --port 8000
```

**Opção 2: Usar o script de inicialização (recomendado)**
```bash
# Do diretório raiz do projeto
./scripts/linux/start-backend-only.sh
```

**Opção 3: Usar o módulo Python completo**
```bash
# Do diretório raiz do projeto
python3 -m uvicorn backend.main:app --reload --port 8000
```

---

## ⚠️ Erro: Conflito de Rotas no FastAPI

### Problema:
```
WARNING: Detected duplicate route
```

### Causa:
Endpoints com caminhos específicos devem ser definidos **ANTES** de endpoints com parâmetros variáveis.

### Exemplo ERRADO:
```python
@app.get("/api/stats/{date}")  # ❌ Este captura tudo, incluindo "general"
async def get_stats(date: str):
    pass

@app.get("/api/stats/general")  # ❌ Nunca será chamado!
async def get_general_stats():
    pass
```

### ✅ Solução (já corrigida):
```python
# Rotas específicas primeiro
@app.get("/api/stats/general")
async def get_general_stats():
    pass

@app.get("/api/stats/chart-data")
async def get_chart_data():
    pass

# Rotas com parâmetros por último
@app.get("/api/stats/{date}")
async def get_stats(date: str):
    pass
```

---

## 🔍 Erro: Módulo não encontrado

### Problema:
```bash
ModuleNotFoundError: No module named 'fastapi'
```

### Causa:
Dependências não instaladas.

### ✅ Solução:
```bash
cd backend
pip3 install -r requirements.txt
```

ou

```bash
pip3 install fastapi uvicorn pydantic
```

---

## 🗄️ Erro: Banco de dados não encontrado

### Problema:
```
sqlite3.OperationalError: unable to open database file
```

### Causa:
O banco de dados `pomodoro.db` não existe ou não tem permissões.

### ✅ Solução:
```bash
cd backend
# O banco será criado automaticamente na primeira execução
python3 -c "from database import Database; db = Database(); print('✅ Banco criado!')"
```

---

## 🌐 Erro: CORS (acesso negado)

### Problema:
```
Access to fetch at 'http://localhost:8000/api/...' from origin 'http://localhost:8080' 
has been blocked by CORS policy
```

### Causa:
CORS não configurado ou frontend em porta diferente.

### ✅ Solução:
O CORS já está configurado para aceitar todas as origens em desenvolvimento:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Se o problema persistir, limpe o cache do navegador (Ctrl+Shift+Del).

---

## 🔄 Erro: Porta já em uso

### Problema:
```
ERROR: [Errno 98] Address already in use
```

### Causa:
Já existe um processo usando a porta 8000.

### ✅ Solução:

**Encontrar o processo:**
```bash
lsof -i :8000
# ou
netstat -tulpn | grep 8000
```

**Matar o processo:**
```bash
kill -9 <PID>
```

**Usar outra porta:**
```bash
python3 -m uvicorn main:app --port 8001 --reload
```

---

## 📦 Erro: Import circular

### Problema:
```
ImportError: cannot import name 'X' from partially initialized module 'Y'
```

### Causa:
Arquivos Python importando um ao outro de forma circular.

### ✅ Solução:
Use imports condicionais:
```python
try:
    from backend.database import Database
except ModuleNotFoundError:
    from database import Database
```

---

## 🐍 Erro: Versão do Python

### Problema:
```
SyntaxError: invalid syntax
```
ou
```
TypeError: 'type' object is not subscriptable
```

### Causa:
Python muito antigo (< 3.8).

### ✅ Solução:
Verifique a versão:
```bash
python3 --version
```

Atualize para Python 3.8 ou superior:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3.10

# Fedora
sudo dnf install python3.10
```

---

## 🔐 Erro: Permissões

### Problema:
```
PermissionError: [Errno 13] Permission denied
```

### Causa:
Sem permissão para criar arquivos ou executar scripts.

### ✅ Solução:

**Para arquivos:**
```bash
chmod 644 pomodoro.db
chmod 755 backend/
```

**Para scripts:**
```bash
chmod +x scripts/linux/*.sh
```

---

## 📝 Erro: JSON inválido

### Problema:
```
json.decoder.JSONDecodeError: Expecting value
```

### Causa:
Dados corrompidos no localStorage ou resposta vazia da API.

### ✅ Solução:

**Limpar localStorage do navegador:**
```javascript
// No console do navegador (F12)
localStorage.clear();
location.reload();
```

**Verificar API:**
```bash
curl http://localhost:8000/api/cycles
```

---

## 🔄 Erro: Auto-reload não funciona

### Problema:
Mudanças no código não são detectadas automaticamente.

### Causa:
Sistema de arquivos não suporta watchdog ou muitos arquivos.

### ✅ Solução:

**Desabilitar reload:**
```bash
python3 -m uvicorn main:app --port 8000
# Sem o flag --reload
```

**Usar alternativa:**
```bash
# Instalar watchfiles
pip3 install watchfiles

# Usar com watchfiles
python3 -m uvicorn main:app --port 8000 --reload --reload-delay 0.25
```

---

## 🌐 Erro: Frontend não carrega

### Problema:
Página em branco ou erro 404.

### Causa:
Servidor HTTP do frontend não está rodando.

### ✅ Solução:

**Iniciar frontend:**
```bash
# Do diretório raiz do projeto
python3 -m http.server 8080
```

**Ou usar script completo:**
```bash
./scripts/linux/start-all.sh
```

---

## 🧪 Como Testar se Está Funcionando

### 1. Testar Backend:
```bash
curl http://localhost:8000/
# Resposta: {"message":"Pomodoro API is running"}
```

### 2. Testar Endpoints:
```bash
curl http://localhost:8000/api/cycles
curl http://localhost:8000/api/stats/general
```

### 3. Testar Frontend:
```bash
curl http://localhost:8080/index.html
# Deve retornar HTML
```

### 4. Ver Logs em Tempo Real:
```bash
# Terminal 1 - Backend
cd backend
python3 -m uvicorn main:app --reload --port 8000 --log-level debug

# Terminal 2 - Frontend
python3 -m http.server 8080

# Terminal 3 - Monitorar
watch -n 1 'curl -s http://localhost:8000/ | jq'
```

---

## 🆘 Ainda com Problemas?

### Verificação Completa:

```bash
# 1. Python instalado?
python3 --version

# 2. Dependências instaladas?
pip3 list | grep fastapi

# 3. Arquivos existem?
ls -la backend/main.py backend/database.py

# 4. Sintaxe correta?
python3 -m py_compile backend/main.py
python3 -m py_compile backend/database.py

# 5. Importação funciona?
cd backend && python3 -c "from main import app; print('OK')"

# 6. Porta livre?
lsof -i :8000

# 7. Firewall bloqueando?
sudo ufw status
```

---

## 📚 Recursos Úteis

- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **Uvicorn Docs:** https://www.uvicorn.org/
- **Python Docs:** https://docs.python.org/3/

---

## 🎯 Comandos Rápidos

```bash
# Parar todos os processos Python
pkill -f uvicorn

# Limpar cache Python
find . -type d -name "__pycache__" -exec rm -r {} +
find . -type f -name "*.pyc" -delete

# Reinstalar dependências
pip3 uninstall -y fastapi uvicorn
pip3 install -r backend/requirements.txt

# Reset completo
rm backend/pomodoro.db
cd backend && python3 -c "from database import Database; Database()"
```

---

**✅ Problema resolvido? Ótimo! Continue estudando com o Pomodoro Boladão! 🍅**
