# 🔧 Guia Multiplataforma - Windows, Linux (Debian/Arch)

## ✅ Status de Compatibilidade

| Sistema | Status | Método de Instalação | Notas |
|---------|--------|---------------------|-------|
| 🪟 **Windows 10/11** | ✅ Testado | `launcher.bat` ou `launcher.py` | Requer Python 3.8+ |
| 🐧 **Arch Linux** | ✅ Testado | `launcher.py` ou `start-all.sh` | Funcionando 100% |
| 🐧 **Debian/Ubuntu** | ✅ Corrigido | `launcher.py` ou `start-all.sh` | **Modo offline se backend falhar** |
| 🍎 **macOS** | ⚠️ Não testado | `launcher.py` ou scripts Linux | Deve funcionar igual Linux |

---

## 🚨 Problema Identificado no Debian

### Sintoma:
```
Erro ao buscar ciclos: Error: Erro ao carregar ciclos
    getCycles http://localhost:8080/js/storage.js:61
```

### Causa:
- Backend não estava rodando ou não estava acessível
- Frontend tentava conectar ao backend sem verificar disponibilidade
- Aplicação quebrava completamente se backend falhasse

### Solução Implementada ✅:

1. **Health Check Automático**: Antes de tentar conectar ao backend, a aplicação verifica se ele está disponível via `/api/health`

2. **Fallback Inteligente**: Se backend não estiver disponível:
   - ✅ Aplicação funciona em **modo offline** usando localStorage
   - ✅ Dados são salvos localmente no navegador
   - ✅ Nenhum erro é exibido ao usuário
   - ✅ Aplicação continua 100% funcional

3. **Sincronização Automática**: Quando backend fica disponível, dados podem ser sincronizados

---

## 🪟 Windows - Guia de Instalação

### Pré-requisitos

1. **Python 3.8 ou superior**
   - Download: https://www.python.org/downloads/
   - ⚠️ **IMPORTANTE**: Durante instalação, marque "Add Python to PATH"

2. **Git** (opcional)
   - Download: https://git-scm.com/download/win

### Método 1: Launcher com Interface Gráfica (Recomendado)

```batch
# 1. Baixar projeto
git clone https://github.com/r0bertgabriel/ciclo-estudo-pomodoro.git
cd ciclo-estudo-pomodoro

# 2. Executar launcher
python launcher.py
```

**OU** clique duas vezes em: `scripts\windows\launcher.bat`

### Método 2: Script Tradicional

```batch
# Executar script start.bat
scripts\windows\start.bat
```

### Método 3: Manual

```batch
# Terminal 1 - Backend
python -m pip install -r backend\requirements.txt
python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
python -m http.server 8080
```

### Verificar se está funcionando:

1. Abrir navegador em: `http://localhost:8080/`
2. Backend API docs: `http://localhost:8000/docs`
3. Health check: `http://localhost:8000/api/health`

---

## 🐧 Linux (Debian/Ubuntu) - Guia de Instalação

### Pré-requisitos

```bash
# Atualizar sistema
sudo apt update
sudo apt upgrade -y

# Instalar Python 3.8+ e dependências
sudo apt install -y python3 python3-pip python3-venv python3-tk git

# Verificar versão
python3 --version  # Deve ser 3.8 ou superior
```

### Método 1: Launcher com Interface Gráfica (Recomendado)

```bash
# 1. Clonar projeto
git clone https://github.com/r0bertgabriel/ciclo-estudo-pomodoro.git
cd ciclo-estudo-pomodoro

# 2. Dar permissão de execução
chmod +x launcher.py

# 3. Executar launcher
./launcher.py
```

### Método 2: Script Tradicional

```bash
# Dar permissões
chmod +x scripts/linux/start-all.sh

# Executar
./scripts/linux/start-all.sh
```

### Método 3: Manual

```bash
# Terminal 1 - Backend
pip3 install -r backend/requirements.txt
python3 -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
python3 -m http.server 8080
```

### ⚠️ Se Backend Não Iniciar (Modo Offline)

**Não tem problema!** A aplicação funciona em modo offline:

```bash
# Apenas frontend
cd frontend
python3 -m http.server 8080

# Abrir navegador em http://localhost:8080
# Dados serão salvos no localStorage do navegador
```

---

## 🐧 Arch Linux - Guia de Instalação

### Pré-requisitos

```bash
# Instalar Python e dependências
sudo pacman -S python python-pip tk git

# Verificar versão
python --version  # Deve ser 3.8 ou superior
```

### Método 1: Launcher (Recomendado)

```bash
# 1. Clonar projeto
git clone https://github.com/r0bertgabriel/ciclo-estudo-pomodoro.git
cd ciclo-estudo-pomodoro

# 2. Executar launcher
python launcher.py
```

### Método 2: Script

```bash
chmod +x scripts/linux/start-all.sh
./scripts/linux/start-all.sh
```

---

## 🔍 Verificar se Está Funcionando

### 1. Backend está rodando?

```bash
# Linux/macOS
curl http://localhost:8000/api/health

# Windows (PowerShell)
Invoke-WebRequest http://localhost:8000/api/health

# Resposta esperada:
# {
#   "status": "healthy",
#   "service": "Pomodoro API",
#   "version": "1.0.0",
#   "timestamp": "2025-11-06T20:00:00.000000"
# }
```

### 2. Frontend está acessível?

Abrir no navegador:
- Timer: `http://localhost:8080/`
- Ciclos: `http://localhost:8080/ciclos.html`
- Dashboard: `http://localhost:8080/dashboard.html`

### 3. Verificar logs no console (F12):

**Backend disponível:**
```
✅ Backend disponível
📡 Carregando ciclos da API
```

**Backend indisponível (modo offline):**
```
⚠️ Backend não disponível: Failed to fetch
ℹ️ Aplicação funcionando em modo offline (localStorage)
📦 Carregando ciclos do localStorage (modo offline)
```

---

## 🛠️ Solução de Problemas

### ❌ "Python não encontrado"

**Windows:**
1. Baixar Python: https://www.python.org/downloads/
2. Durante instalação, marcar "Add Python to PATH"
3. Reiniciar terminal

**Linux:**
```bash
# Debian/Ubuntu
sudo apt install python3 python3-pip

# Arch
sudo pacman -S python python-pip
```

### ❌ "ModuleNotFoundError: No module named 'fastapi'"

```bash
# Linux/macOS
pip3 install -r backend/requirements.txt

# Windows
pip install -r backend\requirements.txt
```

### ❌ "Erro ao buscar ciclos" no Debian

**Solução**: Aplicação agora funciona em modo offline automaticamente!

✅ Não é mais necessário backend rodando
✅ Dados salvos no localStorage
✅ Aplicação 100% funcional

Para usar com backend:
```bash
# Terminal 1
python3 -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2
cd frontend
python3 -m http.server 8080
```

### ❌ "tkinter not found" no Windows

Interface gráfica não disponível. Use modo console:

```batch
python launcher.py --console
```

### ❌ Porta 8000 ou 8080 já está em uso

```bash
# Linux/macOS - Encontrar processo usando porta
sudo lsof -i :8000
sudo lsof -i :8080

# Matar processo
kill -9 <PID>

# Windows - Encontrar e matar processo
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

---

## 📊 Modos de Operação

### Modo Online (Backend + Frontend)

```
✅ Backend rodando (porta 8000)
✅ Frontend rodando (porta 8080)
✅ Dados salvos no SQLite + localStorage
✅ Dashboard com estatísticas completas
✅ Sincronização automática
```

### Modo Offline (Apenas Frontend)

```
⚠️ Backend não disponível
✅ Frontend rodando (porta 8080)
✅ Dados salvos apenas no localStorage
✅ Timer, ciclos e disciplinas funcionam normalmente
⚠️ Dashboard pode ter funcionalidade limitada
✅ Sem erros exibidos ao usuário
```

---

## 🎯 Compatibilidade de Recursos

| Recurso | Online | Offline |
|---------|--------|---------|
| Timer Pomodoro | ✅ | ✅ |
| Criar Ciclos | ✅ | ✅ |
| Adicionar Disciplinas | ✅ | ✅ |
| Editar Disciplinas | ✅ | ✅ |
| Registrar Sessões | ✅ | ✅ |
| Dashboard Básico | ✅ | ✅ |
| Dashboard Avançado | ✅ | ⚠️ Limitado |
| Estatísticas | ✅ | ⚠️ Limitado |
| Exportar CSV/JSON | ✅ | ⚠️ Apenas localStorage |
| Sincronização Multi-dispositivo | ✅ | ❌ |
| Backup no Servidor | ✅ | ❌ |

---

## 📝 Changelog - Correções Multiplataforma

### v1.3.1 - 2025-11-06

**✅ Correções:**
- Adicionado health check automático (`/api/health`)
- Implementado fallback para localStorage quando backend indisponível
- Corrigido erro "Erro ao buscar ciclos" no Debian
- Corrigido `start.bat` para Windows (frontend rodando de /frontend/)
- Adicionado `launcher.bat` para Windows com interface gráfica
- Melhorada compatibilidade entre Arch, Debian e Windows

**✅ Melhorias:**
- Aplicação agora funciona 100% offline se necessário
- Mensagens de log mais claras (modo online vs offline)
- Verificação automática de disponibilidade do backend
- Timeout de 2s para health check (não trava a aplicação)

---

## 🚀 Próximos Passos

Após iniciar a aplicação:

1. **Criar um Ciclo**: Acesse `http://localhost:8080/ciclos.html`
2. **Adicionar Disciplinas**: Defina matérias e horas semanais
3. **Iniciar Pomodoro**: Volte para `http://localhost:8080/` e estude!
4. **Ver Estatísticas**: Acesse `http://localhost:8080/dashboard.html`

---

**Testado em:**
- ✅ Windows 10/11
- ✅ Arch Linux (btw)
- ✅ Debian 12
- ✅ Ubuntu 22.04 LTS

**Status**: 🟢 Produção - Multiplataforma
