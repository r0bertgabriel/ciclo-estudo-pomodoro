# 🚀 Guia Rápido de Inicialização

## 🐧 Linux / 🍎 macOS

### Opção 1: Automática (Recomendada)

```bash
./start.sh
```

### Opção 2: Manual

**Terminal 1:**
```bash
cd backend
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2:**
```bash
python3 -m http.server 8080
```

---

## 🪟 Windows

### Opção 1: Automática (Recomendada)

```batch
start.bat
```

### Opção 2: Manual

**Terminal 1:**
```batch
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2:**
```batch
python -m http.server 8080
```

---

## 🌐 Acessar Aplicação

Após iniciar, acesse:

- 🍅 **Timer:** http://localhost:8080/index.html
- 📚 **Ciclos:** http://localhost:8080/ciclos.html
- 📖 **API Docs:** http://localhost:8000/docs

---

## 🛑 Parar Servidores

### Linux/macOS (se usou start.sh)
Pressione `Ctrl+C` no terminal

### Windows (se usou start.bat)
Feche as duas janelas CMD abertas

---

## ⚠️ Problemas Comuns

### Backend não inicia
```bash
# Instalar dependências
pip3 install -r backend/requirements.txt  # Linux/Mac
pip install -r backend\requirements.txt   # Windows
```

### Porta já em uso
```bash
# Linux/Mac - Verificar porta 8000
lsof -i :8000

# Windows - Verificar porta 8000
netstat -ano | findstr :8000
```

### Python não encontrado
- **Linux/Mac:** Instale com `sudo apt install python3` ou `brew install python`
- **Windows:** Baixe em https://www.python.org/downloads/ e marque "Add to PATH"
