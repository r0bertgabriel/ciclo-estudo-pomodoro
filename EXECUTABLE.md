# 💻 Como Transformar em Executável Windows (.exe)

## 🎯 Objetivo
Tornar o Pomodoro Timer um aplicativo desktop portátil para Windows.

## 🛠️ Opções Disponíveis

### Opção 1: Electron (Recomendado)
**Prós:**
- ✅ Mais popular e maduro
- ✅ Muita documentação
- ✅ Suporte completo

**Contras:**
- ❌ Arquivo maior (~150MB)
- ❌ Mais pesado

**Instalação:**
```bash
# 1. Instalar dependências
npm install --save-dev electron electron-builder

# 2. Adicionar ao package.json
{
  "main": "electron-main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder --win"
  },
  "build": {
    "appId": "com.pomodoro.app",
    "productName": "Pomodoro Boladão",
    "win": {
      "target": "portable",
      "icon": "icon.ico"
    }
  }
}

# 3. Criar electron-main.js
# (Veja arquivo abaixo)

# 4. Compilar
npm run build
```

### Opção 2: Tauri (Mais Leve)
**Prós:**
- ✅ Muito leve (~5MB)
- ✅ Rápido
- ✅ Moderno

**Contras:**
- ❌ Requer Rust instalado
- ❌ Mais complexo

**Instalação:**
```bash
# 1. Instalar Rust
# https://rustup.rs

# 2. Instalar Tauri CLI
npm install --save-dev @tauri-apps/cli

# 3. Inicializar Tauri
npx tauri init

# 4. Compilar
npm run tauri build
```

### Opção 3: NW.js
**Prós:**
- ✅ Simples
- ✅ Alternativa ao Electron

**Contras:**
- ❌ Menos popular
- ❌ Arquivo médio (~100MB)

## 📦 Implementação Rápida - Electron

### 1. Criar `electron-main.js`

```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, 'favicon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        autoHideMenuBar: true,
        backgroundColor: '#1e1e2e'
    });

    mainWindow.loadFile('index.html');
    
    // Remover na produção:
    // mainWindow.webContents.openDevTools();
    
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
```

### 2. Atualizar `package.json`

```json
{
  "name": "pomodoro-boladao",
  "version": "1.0.0",
  "description": "Aplicativo Pomodoro moderno e customizável",
  "main": "electron-main.js",
  "scripts": {
    "start": "electron .",
    "dev": "node server.js",
    "build": "electron-builder --win --portable"
  },
  "build": {
    "appId": "com.pomodoro.boladao",
    "productName": "Pomodoro Boladão",
    "directories": {
      "output": "dist"
    },
    "files": [
      "**/*",
      "!server.js",
      "!node_modules/**/*",
      "!dist/**/*"
    ],
    "win": {
      "target": [
        {
          "target": "portable",
          "arch": ["x64"]
        }
      ],
      "icon": "favicon.ico"
    }
  },
  "devDependencies": {
    "electron": "^latest",
    "electron-builder": "^latest"
  }
}
```

### 3. Instalar e Compilar

```bash
# Instalar dependências
npm install

# Testar localmente
npm start

# Compilar para Windows
npm run build

# Resultado: dist/Pomodoro Boladão.exe
```

## 📁 Estrutura Final

```
pomodoro/
├── dist/                          ← Executável gerado aqui
│   └── Pomodoro Boladão.exe      ← ARQUIVO PORTÁTIL
├── js/
│   ├── app.js
│   ├── config.js
│   ├── timer.js
│   ├── ui.js
│   ├── storage.js
│   └── notifications.js
├── electron-main.js               ← Ponto de entrada Electron
├── index.html
├── styles.css
├── manifest.json
├── sw.js
├── package.json
└── README.md
```

## 🚀 Passos Resumidos

### Para Electron:

1. **Instalar dependências**
   ```bash
   npm install --save-dev electron electron-builder
   ```

2. **Criar electron-main.js**
   ```bash
   # Copiar código acima
   ```

3. **Atualizar package.json**
   ```bash
   # Adicionar scripts e build config
   ```

4. **Compilar**
   ```bash
   npm run build
   ```

5. **Resultado**
   ```
   dist/Pomodoro Boladão.exe (portable)
   ```

## 📊 Comparação de Tamanhos

| Opção | Tamanho Final |
|-------|---------------|
| Electron | ~150 MB |
| Tauri | ~5-10 MB |
| NW.js | ~100 MB |
| Web (atual) | <1 MB |

## ⚙️ Configurações Adicionais (Opcional)

### Ícone Personalizado
```bash
# Converter PNG para ICO
# Use: https://icoconvert.com
# Coloque como: icon.ico
```

### Auto-update
```javascript
// electron-main.js
const { autoUpdater } = require('electron-updater');

app.whenReady().then(() => {
    autoUpdater.checkForUpdatesAndNotify();
});
```

### Menu Customizado
```javascript
const { Menu } = require('electron');

const template = [
    {
        label: 'Arquivo',
        submenu: [
            { role: 'quit', label: 'Sair' }
        ]
    }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
```

## 🎯 Recomendação

Para criar um **executável portátil Windows**:

1. **Use Electron** (mais fácil e confiável)
2. **Configure como portable** (sem instalação)
3. **Teste no Windows** antes de distribuir

```bash
# Comandos completos:
npm install --save-dev electron electron-builder
# (criar electron-main.js)
# (atualizar package.json)
npm run build
```

O resultado será um único arquivo `.exe` que pode ser executado em qualquer Windows sem instalação! 🎉

## 📝 Notas

- **Desenvolvimento**: Use `node server.js` (mais rápido)
- **Testes Electron**: Use `npm start`
- **Produção**: Use `npm run build`
- **Distribuição**: Compartilhe o `.exe` da pasta `dist/`

---

**Status Atual:** Projeto pronto como aplicação web  
**Próximo Passo:** Implementar Electron para gerar .exe  
**Tempo Estimado:** 15-30 minutos para configurar Electron
