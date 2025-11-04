# 🚀 Guia de Inicialização Completo

## ⚠️ IMPORTANTE: Ordem Correta de Inicialização

Para evitar os erros **NaN:NaN** e **disciplinas não sendo salvas**, siga esta ordem:

## 📋 Passo a Passo

### 1️⃣ **Iniciar o Backend PRIMEIRO**

```bash
# Na raiz do projeto:
cd /home/br4b0/Desktop/Development/in_silico/prototipos/ciclo-estudo-pomodoro

# Iniciar o backend FastAPI:
python3 -m uvicorn backend.main:app --reload --port 8000
```

**✅ Verificar se o backend está rodando:**
```bash
curl http://localhost:8000/api/cycles
```

Deve retornar `[]` (lista vazia).

---

### 2️⃣ **Iniciar o Frontend (Servidor HTTP)**

**Em outro terminal:**

```bash
# Na raiz do projeto:
python3 -m http.server 8080
```

**✅ Acessar a aplicação:**
- Abra o navegador em: http://localhost:8080

---

## 🐛 Problemas Comuns e Soluções

### ❌ Problema: `NaN:NaN` aparece nos tempos

**Causa:** 
- `localStorage` pode estar corrompido
- Configurações não foram carregadas corretamente

**Solução:**
1. Abra o **Console do Navegador** (F12)
2. Execute:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

---

### ❌ Problema: Disciplinas não são salvas

**Causa:** 
- Backend não está rodando
- Backend foi iniciado na porta errada

**Solução:**
1. Verificar se o backend está rodando:
   ```bash
   lsof -i :8000
   ```
2. Se não estiver rodando, inicie conforme o **Passo 1**

---

### ❌ Problema: `ModuleNotFoundError: No module named 'database'`

**Causa:** 
- Falta o arquivo `__init__.py` no diretório `backend/`

**Solução:**
```bash
# Criar o arquivo __init__.py:
touch backend/__init__.py
```

---

### ❌ Problema: `No module named 'uvicorn'`

**Causa:** 
- Dependências do backend não foram instaladas

**Solução:**
```bash
# Instalar dependências:
cd backend/
pip install -r requirements.txt
```

---

## 🔧 Comandos Úteis

### Parar processos:
```bash
# Parar backend:
pkill -f uvicorn

# Parar servidor HTTP:
pkill -f "http.server"
```

### Ver logs do backend:
```bash
# Os logs aparecem no terminal onde você rodou o uvicorn
```

### Limpar banco de dados:
```bash
# Remover o arquivo de banco de dados:
rm backend/pomodoro.db
```

---

## 📚 Estrutura de Arquivos

```
ciclo-estudo-pomodoro/
├── backend/
│   ├── __init__.py      ← IMPORTANTE: Deve existir!
│   ├── main.py          ← API FastAPI
│   ├── database.py      ← Gerenciamento do SQLite
│   └── requirements.txt ← Dependências Python
├── js/
│   ├── app.js           ← Aplicação principal
│   ├── storage.js       ← Gerenciamento de storage
│   └── ...
├── index.html           ← Página principal
└── ...
```

---

## ✅ Checklist de Inicialização

- [ ] Backend instalado (`pip install -r requirements.txt`)
- [ ] Arquivo `backend/__init__.py` existe
- [ ] Backend rodando na porta 8000
- [ ] Teste do backend: `curl http://localhost:8000/api/cycles` retorna `[]`
- [ ] Servidor HTTP rodando na porta 8080
- [ ] Aplicação acessível em http://localhost:8080
- [ ] Console do navegador sem erros

---

## 🎯 Resumo Rápido

1. **Backend:** `python3 -m uvicorn backend.main:app --reload --port 8000`
2. **Frontend:** `python3 -m http.server 8080`
3. **Acessar:** http://localhost:8080

**Pronto! 🎉**
