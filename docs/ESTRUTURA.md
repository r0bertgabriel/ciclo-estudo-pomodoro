# 📁 Estrutura do Projeto

## 🏗️ Organização de Diretórios

```
ciclo-estudo-pomodoro/
│
├── 📂 .github/                      # Configurações do GitHub
│   ├── workflows/                   # GitHub Actions (CI/CD)
│   │   ├── build-exe.yml           # Build automático do .exe
│   │   └── README.md               # Docs do workflow
│   ├── release.yml                 # Config de releases
│   └── PULL_REQUEST_TEMPLATE.md    # Template de PRs
│
├── 📂 backend/                      # Backend Python/FastAPI
│   ├── __init__.py
│   ├── main.py                     # Aplicação FastAPI
│   ├── database.py                 # Gerenciamento do SQLite
│   └── requirements.txt            # Dependências Python
│
├── 📂 frontend/                     # Frontend (HTML/CSS/JS)
│   ├── index.html                  # Página principal
│   ├── ciclos.html                 # Gerenciamento de ciclos
│   ├── styles.css                  # Estilos principais
│   ├── ciclos.css                  # Estilos dos ciclos
│   ├── favicon.ico                 # Ícone do site
│   ├── manifest.json               # PWA manifest
│   ├── sw.js                       # Service Worker
│   │
│   ├── 📂 js/                      # JavaScript modules
│   │   ├── app.js                  # App principal
│   │   ├── timer.js                # Lógica do timer
│   │   ├── ui.js                   # Interface
│   │   ├── storage.js              # LocalStorage
│   │   ├── notifications.js        # Notificações
│   │   ├── config.js               # Configurações
│   │   ├── ciclos.js               # Gerenciamento de ciclos
│   │   └── study-cycle.js          # Ciclos de estudo
│   │
│   └── 📂 public/                  # Assets públicos
│       ├── foco.png                # Imagem modo foco
│       ├── curta.png               # Imagem pausa curta
│       └── longa.png               # Imagem pausa longa
│
├── 📂 docs/                         # Documentação
│   ├── API.md                      # Documentação da API
│   ├── CRIAR-EXECUTAVEL.md         # Como criar .exe
│   ├── CRIAR-INSTALADOR.md         # Como criar instalador
│   ├── GUIA-RELEASES.md            # Guia de releases
│   ├── INICIO-RAPIDO.md            # Início rápido
│   ├── INSTRUCOES-WINDOWS.txt      # Instruções Windows
│   ├── QUICK-START.md              # Quick start (EN)
│   ├── QUICK-START-CYCLE.md        # Quick start ciclos
│   ├── START-GUIDE.md              # Guia de início
│   ├── STUDY-CYCLE.md              # Sobre ciclos de estudo
│   ├── SUMMARY.md                  # Resumo do projeto
│   ├── TESTAR-GITHUB-ACTIONS.md    # Testar GitHub Actions
│   ├── intrucoes.md                # Instruções gerais
│   └── start.md                    # Como iniciar
│
├── 📂 scripts/                      # Scripts de automação
│   │
│   ├── 📂 windows/                 # Scripts Windows
│   │   ├── start.bat               # Iniciar aplicação
│   │   ├── start-conda.bat         # Iniciar com Anaconda
│   │   ├── check-python.bat        # Verificar Python
│   │   ├── install-dependencies.bat # Instalar deps
│   │   ├── criar-atalho.vbs        # Criar atalho
│   │   ├── criar-executavel.bat    # Criar .exe
│   │   └── installer-simples.bat   # Instalador simples
│   │
│   ├── 📂 linux/                   # Scripts Linux/Mac
│   │   ├── start.sh                # Iniciar aplicação
│   │   ├── start-all.sh            # Iniciar tudo
│   │   ├── start-backend.sh        # Iniciar só backend
│   │   └── criar-executavel.sh     # Criar executável
│   │
│   ├── installer.iss               # Script Inno Setup
│   └── INSTALLER-INFO.txt          # Info do instalador
│
├── 📂 tests/                        # Testes e debug
│   ├── debug.html                  # Debug geral
│   ├── debug-load.html             # Debug carregamento
│   ├── debug-app-load.html         # Debug app
│   └── test-persistence.html       # Teste persistência
│
├── 📄 launcher.py                   # Launcher GUI (Tkinter)
├── 📄 server.js                     # Servidor Node.js
├── 📄 package.json                  # Configurações Node
├── 📄 Pomodoro.spec                 # Spec PyInstaller
├── 📄 README.md                     # Documentação principal
├── 📄 CHANGELOG.md                  # Histórico de mudanças
├── 📄 LICENSE.txt                   # Licença MIT
└── 📄 .gitignore                    # Arquivos ignorados

# Pastas ignoradas (não versionadas):
├── 🚫 build/                        # Build temporário
├── 🚫 dist/                         # Distribuição
├── 🚫 logs/                         # Logs da aplicação
├── 🚫 __pycache__/                  # Cache Python
└── 🚫 *.db                          # Banco de dados local
```

---

## 📚 Descrição dos Componentes

### Backend (`/backend`)

Servidor FastAPI com API REST para gerenciamento de dados do Pomodoro:

- **main.py**: Aplicação principal, rotas da API
- **database.py**: Gerenciamento do banco SQLite
- **requirements.txt**: Dependências Python (FastAPI, Uvicorn)

### Frontend (`/frontend`)

Interface web do Pomodoro Timer:

- **HTML**: Estrutura das páginas
- **CSS**: Estilos e layout
- **JS**: Lógica da aplicação (timer, notificações, etc.)
- **Public**: Assets estáticos (imagens)

### Documentação (`/docs`)

Toda documentação centralizada:

- Guias de início rápido
- Instruções de instalação
- Documentação da API
- Guias de desenvolvimento

### Scripts (`/scripts`)

Scripts organizados por plataforma:

- **Windows**: Scripts .bat e .vbs
- **Linux**: Scripts shell .sh
- **Instalador**: Configurações Inno Setup

### Testes (`/tests`)

Arquivos de teste e debug:

- Testes de persistência
- Debug de carregamento
- Testes de funcionalidades

---

## 🔄 Fluxo de Execução

### Desenvolvimento Local

1. **Backend**: `uvicorn backend.main:app --reload --port 8000`
2. **Frontend**: `node server.js` (porta 8080)
3. **Acesso**: http://localhost:8080

### Produção

1. **Launcher**: `python launcher.py`
   - Inicia backend e frontend automaticamente
   - Abre navegador
   - Interface gráfica para controle

### Build

1. **Executável**: `scripts/windows/criar-executavel.bat`
2. **Instalador**: Compilar `scripts/installer.iss` com Inno Setup

---

## 📦 Dependências

### Python (Backend)

```txt
fastapi>=0.104.1
uvicorn[standard]>=0.24.0
```

### Node.js (Frontend Server)

```json
{
  "type": "module"
}
```

---

## 🚀 Como Contribuir

1. Documentação vai em `/docs`
2. Scripts novos em `/scripts/windows` ou `/scripts/linux`
3. Frontend em `/frontend`
4. Backend em `/backend`
5. Testes em `/tests`

---

## 📝 Notas

- Arquivos de build (`build/`, `dist/`) são ignorados
- Database local (`*.db`) não é versionado
- Logs ficam em `/logs` (ignorado)
- Cache Python em `__pycache__/` (ignorado)

---

**Estrutura mantida por**: Roberto Gabriel  
**GitHub**: https://github.com/r0bertgabriel/ciclo-estudo-pomodoro
