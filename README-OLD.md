# 🍅 Pomodoro Boladão - Timer com Ciclos de Estudo

Sistema completo de Pomodoro Timer integrado com gerenciamento de ciclos de estudos, controle semanal de horas por disciplina e persistência em banco de dados SQLite.

> **✨ Últimas Atualizações:**  
> ✅ Backend com FastAPI + SQLite  
> ✅ API REST para persistência de dados  
> ✅ Interface dedicada para gerenciamento de ciclos  
> ✅ Sistema de edição de disciplinas  
> ✅ Controle semanal com bloqueio automático  
> ✅ Scripts de inicialização automática (Linux/Mac/Windows)

---

## 🚀 Início Rápido

### 🐧 Linux / 🍎 macOS

```bash
# Clonar o repositório
git clone https://github.com/r0bertgabriel/ciclo-estudo-pomodoro.git
cd ciclo-estudo-pomodoro

# Executar script de inicialização
./start.sh
```

### 🪟 Windows

```batch
REM Clonar o repositório
git clone https://github.com/r0bertgabriel/ciclo-estudo-pomodoro.git
cd ciclo-estudo-pomodoro

REM Executar script de inicialização
start.bat
```

**Pronto! 🎉** A aplicação abrirá automaticamente no navegador em `http://localhost:8080`

---

## 📋 Instalação Detalhada

### Pré-requisitos

#### 🐧 Linux / 🍎 macOS

1. **Python 3.8 ou superior**
   ```bash
   # Verificar versão
   python3 --version
   
   # Ubuntu/Debian
   sudo apt update
   sudo apt install python3 python3-pip
   
   # macOS (usando Homebrew)
   brew install python
   ```

2. **Git** (para clonar o repositório)
   ```bash
   # Ubuntu/Debian
   sudo apt install git
   
   # macOS
   brew install git
   ```

#### 🪟 Windows

1. **Python 3.8 ou superior**
   - Baixar em: https://www.python.org/downloads/
   - ⚠️ **IMPORTANTE**: Marque a opção **"Add Python to PATH"** durante a instalação
   - Verificar instalação:
     ```batch
     python --version
     pip --version
     ```

2. **Git for Windows** (para clonar o repositório)
   - Baixar em: https://git-scm.com/download/win
   - Instalar com configurações padrão

### 🛠️ Instalação Manual

Se preferir instalar e iniciar manualmente:

#### 1. Clonar o Repositório

```bash
git clone https://github.com/r0bertgabriel/ciclo-estudo-pomodoro.git
cd ciclo-estudo-pomodoro
```

#### 2. Instalar Dependências do Backend

```bash
# Linux/macOS
pip3 install -r backend/requirements.txt

# Windows
pip install -r backend\requirements.txt
```

#### 3. Iniciar Backend e Frontend

**Terminal 1 - Backend (FastAPI):**
```bash
# Linux/macOS
cd backend
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Windows
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend (HTTP Server):**
```bash
# Linux/macOS
python3 -m http.server 8080

# Windows
python -m http.server 8080
```

#### 4. Acessar a Aplicação

Abra seu navegador em:
- 🍅 **Timer Pomodoro:** http://localhost:8080/index.html
- 📚 **Gerenciar Ciclos:** http://localhost:8080/ciclos.html
- 📖 **Documentação da API:** http://localhost:8000/docs

---

## 💡 Como Usar

### 1️⃣ Criar um Ciclo de Estudos

1. Acesse http://localhost:8080/ciclos.html
2. Clique em **"+ Novo Ciclo"**
3. Preencha o nome do ciclo (ex: "ENEM 2025")
4. Selecione os dias de estudo
5. Clique em **"Criar Ciclo"**

### 2️⃣ Adicionar Disciplinas

1. No ciclo criado, clique em **"Adicionar Disciplina"**
2. Preencha:
   - Nome da disciplina (ex: "Matemática")
   - Horas semanais desejadas (ex: 10)
   - Cor (para identificação visual)
   - Prioridade (1-5)
3. Clique em **"Adicionar"**

### 3️⃣ Usar o Timer Pomodoro

1. Acesse http://localhost:8080/index.html
2. Selecione a disciplina que vai estudar
3. Clique em **"Iniciar"** para começar o foco
4. Estude durante o período de foco (25min padrão)
5. Faça a pausa quando o timer terminar
6. Repita o ciclo!

### 4️⃣ Acompanhar Progresso

- O sistema registra automaticamente todo tempo estudado
- Veja o progresso semanal de cada disciplina em **"Gerenciar Ciclos"**
- Disciplinas que atingirem o limite semanal ficam bloqueadas até o reset automático
- O reset ocorre toda segunda-feira automaticamente

---

## 📁 Estrutura do Projeto

```
ciclo-estudo-pomodoro/
├── 🚀 start.sh              # Script de inicialização Linux/Mac
├── 🚀 start.bat             # Script de inicialização Windows
├── 📄 index.html            # Timer Pomodoro (página principal)
├── 📄 ciclos.html           # Gerenciamento de ciclos
├── 📄 manifest.json         # PWA manifest
├── 📄 sw.js                 # Service Worker
├── backend/                 # Backend FastAPI
│   ├── 📄 main.py          # API REST
│   ├── 📄 database.py      # Operações SQLite
│   ├── 📄 requirements.txt # Dependências Python
│   └── 🗄️ pomodoro.db      # Banco de dados SQLite
├── js/                      # Frontend JavaScript (ES6 Modules)
│   ├── 📄 app.js           # Aplicação principal do timer
│   ├── 📄 ciclos.js        # Gerenciamento de ciclos
│   ├── 📄 study-cycle.js   # Lógica de ciclos de estudo
│   ├── 📄 storage.js       # Comunicação com API
│   ├── 📄 timer.js         # Lógica do timer
│   ├── 📄 ui.js            # Gerenciamento de UI
│   ├── 📄 notifications.js # Sistema de notificações
│   └── 📄 config.js        # Configurações
├── styles.css               # Estilos do timer
└── ciclos.css               # Estilos do gerenciador
```

---

## 📋 Funcionalidades

### ✅ Pomodoro Timer
- ⏱️ Timer personalizável (foco, pausa curta, pausa longa)
- 🔔 Notificações de conclusão
- 📊 Estatísticas diárias
- 🎯 Seleção obrigatória de disciplina durante foco
- ⏸️ Pausar/Retomar timer
- 🔄 Resetar timer

### ✅ Ciclos de Estudo
- 📚 Criar múltiplos ciclos de estudo
- 🔄 Apenas um ciclo ativo por vez
- 📅 Definir dias de estudo personalizados
- ⏰ Controle de horas semanais por disciplina
- 🎨 Disciplinas com cores e prioridades
- 📈 Bloqueio automático ao atingir limite semanal
- 🔄 Reset automático semanal (segundas-feiras)
- ✏️ Editar ciclos e disciplinas
- 🗑️ Deletar ciclos e disciplinas

### ✅ Gerenciamento
- 💾 Persistência em banco de dados SQLite
- 🔄 Sincronização automática com backend
- 📤 Exportar ciclos (JSON)
- 📥 Importar ciclos (JSON)
- 📊 Visualização de progresso por disciplina
- 🎨 Interface moderna e responsiva
- 📱 Mobile-first design

### ✅ Backend & API
- 🗄️ SQLite para armazenamento persistente
- 🔗 API REST com FastAPI
- 📡 CORS configurado para desenvolvimento
- 🔒 Relacionamentos com CASCADE delete
- 📖 Documentação automática (Swagger/ReDoc)
- ⚡ Hot reload durante desenvolvimento

---

## 🔧 API Endpoints

### Ciclos
- `GET /api/cycles` - Listar todos os ciclos
- `POST /api/cycles` - Criar novo ciclo
- `PUT /api/cycles/{cycle_id}` - Atualizar ciclo
- `DELETE /api/cycles/{cycle_id}` - Deletar ciclo
- `PUT /api/cycles/{cycle_id}/activate` - Ativar ciclo

### Disciplinas
- `POST /api/cycles/{cycle_id}/subjects` - Adicionar disciplina
- `PUT /api/subjects/{subject_id}` - Atualizar disciplina
- `DELETE /api/subjects/{subject_id}` - Deletar disciplina

### Sessões
- `POST /api/sessions` - Registrar sessão de estudo
- `GET /api/sessions` - Listar sessões (com filtros)

Documentação completa: http://localhost:8000/docs

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica
- **CSS3** - Estilos modernos com variáveis CSS e animations
- **JavaScript ES6+** - Módulos, async/await, classes
- **Vanilla JS** - Sem frameworks, código puro e performático

### Backend
- **Python 3.8+** - Linguagem do backend
- **FastAPI** - Framework web moderno e rápido
- **SQLite3** - Banco de dados leve e eficiente
- **Uvicorn** - Servidor ASGI de alta performance
- **Pydantic** - Validação de dados

---

## 🐛 Solução de Problemas

### Backend não inicia
```bash
# Verificar se as dependências estão instaladas
pip3 list | grep fastapi

# Reinstalar dependências
pip3 install -r backend/requirements.txt

# Verificar se a porta 8000 está livre
# Linux/Mac
lsof -i :8000

# Windows
netstat -ano | findstr :8000
```

### Frontend não carrega ciclos
```bash
# Verificar se o backend está rodando
curl http://localhost:8000/api/cycles

# Verificar logs do navegador (F12 > Console)
# Deve aparecer: "✅ StudyCycle: X ciclo(s) encontrado(s) no backend"
```

### Disciplinas não aparecem no dropdown
1. Verifique se há um ciclo ativo em http://localhost:8080/ciclos.html
2. Certifique-se de que o ciclo tem disciplinas cadastradas
3. Recarregue a página http://localhost:8080/index.html
4. Verifique o console do navegador (F12) para erros

### Erro de CORS
- Certifique-se de que o backend está rodando em `localhost:8000`
- O frontend deve estar em `localhost:8080`
- O CORS já está configurado no backend para aceitar requisições dessas origens

---

## 📝 Licença

Este projeto é de código aberto. Sinta-se livre para usar, modificar e distribuir.

---

## 👨‍💻 Desenvolvedor

Desenvolvido com ❤️ e ☕ por [r0bertgabriel](https://github.com/r0bertgabriel)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

---

## 📞 Suporte

Se encontrar problemas ou tiver dúvidas:

1. Verifique a seção [Solução de Problemas](#-solução-de-problemas)
2. Abra uma [Issue no GitHub](https://github.com/r0bertgabriel/ciclo-estudo-pomodoro/issues)
3. Consulte a [documentação da API](http://localhost:8000/docs) quando o backend estiver rodando

---

<div align="center">
  
**🍅 Bons estudos com o Pomodoro Boladão! 🍅**

</div>
