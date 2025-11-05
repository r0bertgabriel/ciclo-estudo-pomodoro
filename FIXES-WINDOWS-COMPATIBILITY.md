# 🔧 Correção de Compatibilidade Windows/Linux

## Problema Identificado

Ao executar a aplicação no Windows, ocorria o erro:
```
ModuleNotFoundError: No module named 'backend'
```

## Causa Raiz

O Python no Windows não reconhecia o módulo `backend` quando o uvicorn era executado de dentro da pasta `backend/`, usando o comando:
```bash
cd backend
python -m uvicorn main:app --reload
```

Isso ocorria porque o import no arquivo `main.py` era:
```python
from backend.database import Database
```

## Solução Aplicada

### 1. Atualizado `backend/main.py`

Adicionado import com fallback para compatibilidade:

```python
# Import compatível com Windows e Linux
try:
    from backend.database import Database
except ModuleNotFoundError:
    from database import Database
```

### 2. Atualizado `start.bat` (Windows)

**Antes:**
```batch
start "Backend" cmd /k "cd backend && python -m uvicorn main:app --reload"
```

**Depois:**
```batch
start "Backend" cmd /k "python -m uvicorn backend.main:app --reload"
```

### 3. Atualizado `start-all.sh` (Linux/Mac)

**Antes:**
```bash
cd backend
python3 -m uvicorn main:app --reload
```

**Depois:**
```bash
python3 -m uvicorn backend.main:app --reload
```

### 4. Atualizado README.md

Corrigidos os comandos nas seções de instalação:

**Linux/Mac:**
```bash
# Terminal 1 - Backend (executar do diretório raiz)
python3 -m uvicorn backend.main:app --reload --port 8000
```

**Windows:**
```batch
REM Terminal 1 - Backend (executar do diretório raiz)
python -m uvicorn backend.main:app --reload --port 8000
```

### 5. Atualizado INSTRUCOES-WINDOWS.txt

Alterado de:
```
cd Desktop\ciclo-estudo-pomodoro\backend
python -m uvicorn main:app --reload --port 8000
```

Para:
```
cd Desktop\ciclo-estudo-pomodoro
python -m uvicorn backend.main:app --reload --port 8000
```

## Como Funciona Agora

### Execução Correta

O comando `python -m uvicorn backend.main:app` faz com que o Python:

1. Execute o uvicorn como módulo
2. Importe `backend.main` como um pacote Python válido
3. Carregue a aplicação `app` do módulo
4. Funcione tanto no Windows quanto no Linux/Mac

### Estrutura de Diretórios

```
ciclo-estudo-pomodoro/          <- Executar daqui
├── backend/
│   ├── __init__.py             <- Torna backend um pacote
│   ├── main.py                 <- Módulo principal
│   └── database.py
├── start.bat                   <- Executa backend.main:app
└── start-all.sh                <- Executa backend.main:app
```

## Benefícios

✅ **Compatibilidade Total:** Funciona em Windows, Linux e macOS
✅ **Sem Mudança de Diretório:** Executa do diretório raiz
✅ **Import Robusto:** Fallback garante funcionamento em ambos os casos
✅ **Manutenibilidade:** Código mais limpo e organizado
✅ **Documentação Atualizada:** README e instruções refletem as mudanças

## Testado Em

- ✅ Windows 10/11 (Python 3.8+)
- ✅ Linux Ubuntu/Debian (Python 3.8+)
- ✅ macOS (Python 3.8+)

## Para Usuários

### Se você já tinha o projeto:

1. Baixe as atualizações:
   ```bash
   git pull
   ```

2. Execute normalmente:
   ```bash
   # Windows
   start.bat
   
   # Linux/Mac
   ./start-all.sh
   ```

### Se você é novo:

Basta seguir o README.md atualizado - tudo funcionará automaticamente! 🎉

---

**Data da Correção:** 05/11/2025  
**Versão:** 1.1.0  
**Status:** ✅ Resolvido
