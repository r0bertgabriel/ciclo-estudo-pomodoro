# 🔧 Como Criar Executável (.exe) do Pomodoro

## 📋 Pré-requisitos

1. Python instalado
2. PyInstaller instalado

---

## 🤖 MÉTODO 0: GitHub Actions (Recomendado para Desenvolvimento no Linux)

**Se você está desenvolvendo no Linux mas precisa do .exe para Windows**, o GitHub Actions fará o build automaticamente!

### Como funciona:

1. **Faça commit e push das suas mudanças:**
   ```bash
   git add .
   git commit -m "Atualização do projeto"
   git push origin main
   ```

2. **O GitHub Actions automaticamente:**
   - Detecta o push
   - Executa em um ambiente Windows
   - Compila o executável `.exe`
   - Salva como artifact

3. **Baixe o executável:**
   - Vá para: https://github.com/r0bertgabriel/ciclo-estudo-pomodoro/actions
   - Clique no workflow mais recente
   - Baixe o artifact "Pomodoro-Windows-exe"
   - Extraia o `Pomodoro.exe`

### Para criar uma Release com o .exe:

```bash
# Crie uma tag de versão
git tag v1.0.0
git push origin v1.0.0
```

O GitHub Actions automaticamente criará uma Release com o `Pomodoro.exe` anexado!

### ⚠️ Importante sobre PyInstaller:

**PyInstaller cria executáveis NATIVOS do sistema operacional:**
- **Linux** → Gera binário Linux (sem extensão)
- **Windows** → Gera `Pomodoro.exe`
- **macOS** → Gera app macOS

**Não é possível criar .exe no Linux diretamente!** Por isso o GitHub Actions é a melhor solução.

---

## 🚀 MÉTODO 1: Automático (Scripts Locais)

### Windows:

Execute o script `criar-executavel.bat`:

```batch
criar-executavel.bat
```

### Linux/Mac:

Execute o script `criar-executavel.sh`:

```bash
chmod +x criar-executavel.sh
./criar-executavel.sh
```

O executável será criado em `dist/Pomodoro.exe`

---

## 🛠️ MÉTODO 2: Manual

### Passo 1: Instalar PyInstaller

**Windows:**
```batch
pip install pyinstaller
```

**Linux/Mac:**
```bash
pip3 install pyinstaller
```

### Passo 2: Criar Executável

**Opção A - Executável Único (Recomendado):**

```batch
pyinstaller --onefile --windowed --name="Pomodoro" --icon=icon.ico launcher.py
```

**Opção B - Com Console (para debug):**

```batch
pyinstaller --onefile --name="Pomodoro" --icon=icon.ico launcher.py
```

**Opção C - Executável + Dependências:**

```batch
pyinstaller --windowed --name="Pomodoro" --icon=icon.ico launcher.py
```

### Passo 3: Localizar Executável

O executável estará em:
```
dist/Pomodoro.exe
```

---

## 📦 Parâmetros do PyInstaller

| Parâmetro | Descrição |
|-----------|-----------|
| `--onefile` | Cria um único arquivo .exe |
| `--windowed` | Sem console (apenas janela GUI) |
| `--console` | Com console para debug |
| `--name="Nome"` | Nome do executável |
| `--icon=arquivo.ico` | Ícone do executável |
| `--add-data` | Incluir arquivos adicionais |

---

## 🎨 Criar Ícone Personalizado

1. Encontre uma imagem de tomate (PNG)
2. Use um conversor online: https://convertio.co/png-ico/
3. Salve como `icon.ico` na pasta do projeto

Ou use o ícone padrão do Windows.

---

## 📁 Estrutura Final

Após criar o executável:

```
ciclo-estudo-pomodoro/
├── dist/
│   └── Pomodoro.exe          ← Executável final
├── build/                     ← Arquivos temporários
├── Pomodoro.spec             ← Configuração do build
├── launcher.py
├── backend/
├── js/
└── ...
```

---

## 🚀 Distribuir o Executável

### Opção 1: Executável Sozinho (--onefile)

1. Copie `Pomodoro.exe` de `dist/`
2. Coloque na pasta do projeto
3. Distribua a pasta completa

### Opção 2: Pasta Completa

1. Copie toda a pasta `dist/Pomodoro/`
2. Distribua junto com backend/ e js/

---

## ⚙️ Configuração Avançada

### Incluir Backend e JS automaticamente:

Crie um arquivo `Pomodoro.spec`:

```python
# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['launcher.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('backend', 'backend'),
        ('js', 'js'),
        ('*.html', '.'),
        ('*.css', '.'),
        ('*.json', '.'),
    ],
    hiddenimports=['uvicorn', 'fastapi'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='Pomodoro',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='icon.ico'
)
```

Depois execute:
```batch
pyinstaller Pomodoro.spec
```

---

## 🐛 Problemas Comuns

### "PyInstaller não encontrado"
```bash
pip install --upgrade pyinstaller
```

### "Erro ao importar tkinter"
- Reinstale Python com suporte a Tk

### Executável muito grande
- Use UPX: `pyinstaller --onefile --upx-dir=caminho/upx launcher.py`
- Baixe UPX: https://upx.github.io/

### Antivírus bloqueia executável
- Adicione exceção no antivírus
- Assine digitalmente o executável (avançado)

---

## ✅ Teste Final

1. Copie `Pomodoro.exe` para área de trabalho
2. Duplo clique
3. Interface deve abrir
4. Clique em "Iniciar"
5. Navegador abre automaticamente

---

## 📝 Notas Importantes

⚠️ **O executável PRECISA:**
- Estar na pasta raiz do projeto
- Ter acesso às pastas `backend/` e `js/`
- Ter Python instalado no sistema (ou incluir no build)

💡 **Dica:** Para distribuir sem Python instalado, use:
```bash
pyinstaller --onefile --windowed --add-binary "Python DLLs" launcher.py
```

---

## 🎯 Resumo Rápido

```bash
# 1. Instalar PyInstaller
pip install pyinstaller

# 2. Criar executável
pyinstaller --onefile --windowed --name="Pomodoro" launcher.py

# 3. Pegar o executável
# Está em: dist/Pomodoro.exe

# 4. Usar
# Duplo clique em Pomodoro.exe
```

---

pip install pyinstaller
pyinstaller --onefile --windowed --name="Pomodoro" launcher.py


