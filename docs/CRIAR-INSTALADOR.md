# 📦 Guia para Criar Instalador Windows

## 🎯 Sobre o Instalador

O instalador do Pomodoro Boladão foi criado com **Inno Setup**, uma ferramenta gratuita para criar instaladores profissionais para Windows.

### ✨ Funcionalidades do Instalador:

- ✅ Verifica se Python está instalado (obrigatório)
- ✅ Valida versão do Python (mínimo 3.8)
- ✅ Instala automaticamente todas as dependências
- ✅ Cria atalhos no Menu Iniciar e Área de Trabalho
- ✅ Interface moderna e profissional
- ✅ Tela de informações sobre o projeto
- ✅ Suporte a Windows 10 e 11
- ✅ Desinstalador completo incluído

---

## 🛠️ Pré-requisitos

### No Windows (para criar o instalador):

1. **Inno Setup 6.x**
   - Baixe em: https://jrsoftware.org/isdl.php
   - Instale a versão Unicode (recomendado)

2. **Projeto completo do Pomodoro**
   - Todos os arquivos do repositório
   - Incluindo backend/, js/, etc.

---

## 🚀 Como Criar o Instalador

### Método 1: Via Interface Gráfica (Recomendado)

1. **Abra o Inno Setup Compiler**

2. **Abra o arquivo de script:**
   ```
   Arquivo > Abrir > installer.iss
   ```

3. **Compile o instalador:**
   ```
   Build > Compile
   ```
   Ou pressione: `Ctrl + F9`

4. **Aguarde a compilação** (leva cerca de 1-2 minutos)

5. **O instalador será criado em:**
   ```
   installer_output/Pomodoro-Setup-v1.2.0.exe
   ```

### Método 2: Via Linha de Comando

```cmd
cd caminho\para\ciclo-estudo-pomodoro
"C:\Program Files (x86)\Inno Setup 6\ISCC.exe" installer.iss
```

---

## 📋 Estrutura dos Arquivos

```
ciclo-estudo-pomodoro/
├── installer.iss                  ← Script principal do Inno Setup
├── INSTALLER-INFO.txt             ← Texto da tela de boas-vindas
├── LICENSE.txt                    ← Licença MIT
├── check-python.bat               ← Verifica instalação do Python
├── install-dependencies.bat       ← Instala dependências Python
├── icon.ico                       ← Ícone do aplicativo (opcional)
├── launcher.py                    ← Launcher principal
├── backend/
│   └── requirements.txt           ← Dependências Python
└── installer_output/              ← Pasta onde o instalador será criado
    └── Pomodoro-Setup-v1.2.0.exe
```

---

## 🎨 Personalizando o Instalador

### Alterar Versão:

Edite `installer.iss`, linha 6:
```pascal
#define MyAppVersion "1.2.0"
```

### Adicionar Ícone Personalizado:

1. Crie ou baixe um ícone `.ico`
2. Salve como `icon.ico` na raiz do projeto
3. O script já está configurado para usá-lo

### Alterar Informações do Desenvolvedor:

Edite `INSTALLER-INFO.txt` e modifique as seções desejadas.

---

## 🧪 Testando o Instalador

### 1. Teste em Máquina Virtual (Recomendado)

- Use VirtualBox ou VMware
- Instale Windows 10/11 limpo
- Teste o instalador completo

### 2. Teste em Máquina Real

```cmd
# Executar o instalador
Pomodoro-Setup-v1.2.0.exe

# Siga os passos:
1. Aceite a licença
2. Escolha o diretório de instalação
3. Aguarde instalação das dependências
4. Execute o aplicativo
```

### 3. Teste de Desinstalação

```
Painel de Controle > Programas > Desinstalar Pomodoro Boladão
```

---

## 📦 O Que o Instalador Faz

### Durante a Instalação:

1. **Verifica Python:**
   - Detecta se Python está instalado
   - Valida versão (mínimo 3.8)
   - Se não encontrar, oferece link de download

2. **Copia arquivos:**
   - Todos os arquivos do projeto para `C:\Program Files\Pomodoro Boladão\`

3. **Instala dependências:**
   - Atualiza pip
   - Instala requirements.txt automaticamente

4. **Cria atalhos:**
   - Menu Iniciar
   - Área de Trabalho (opcional)
   - Barra de Tarefas (opcional)

5. **Registra no Windows:**
   - Adiciona entrada em "Programas e Recursos"
   - Cria desinstalador automático

---

## 🐛 Problemas Comuns

### "Python não foi detectado"

**Solução:**
- Instale Python: https://www.python.org/downloads/
- Marque a opção: `☑ Add Python to PATH`
- Reinicie o instalador

### "Erro ao instalar dependências"

**Solução:**
```cmd
# Execute manualmente:
cd "C:\Program Files\Pomodoro Boladão"
python -m pip install -r backend\requirements.txt
```

### "Precisa de permissão de administrador"

**Solução:**
- Clique com botão direito no instalador
- Escolha "Executar como administrador"

### "Ícone não aparece"

**Solução:**
- Certifique-se de que `icon.ico` existe na raiz do projeto
- Se não existir, remova a linha `SetupIconFile=icon.ico` do `installer.iss`

---

## 🚀 Distribuindo o Instalador

### Opção 1: GitHub Releases (Recomendado)

```bash
# Criar release com o instalador
git tag v1.2.0
git push origin v1.0.0

# Upload manual do instalador:
# 1. Vá para: github.com/r0bertgabriel/ciclo-estudo-pomodoro/releases
# 2. Clique em "Draft a new release"
# 3. Anexe: Pomodoro-Setup-v1.2.0.exe
```

### Opção 2: Google Drive / Dropbox

```
1. Faça upload do arquivo .exe
2. Gere link público
3. Compartilhe o link
```

### Opção 3: Site Próprio

```
Hospede o instalador em seu site e forneça link de download
```

---

## 📊 Informações Técnicas

### Tamanho do Instalador:

- **Comprimido:** ~10-15 MB
- **Instalado:** ~30-50 MB
- **Compressão:** LZMA2 (máxima)

### Compatibilidade:

- ✅ Windows 10 (64-bit)
- ✅ Windows 11 (64-bit)
- ❌ Windows 7/8 (não suportado oficialmente)
- ❌ Windows 32-bit (não suportado)

### Requisitos Mínimos:

- **SO:** Windows 10 build 10240 ou superior
- **RAM:** 2 GB
- **Disco:** 100 MB livres
- **Python:** 3.8 ou superior

---

## 🔧 Modificações Avançadas

### Adicionar Mais Arquivos ao Instalador:

Edite `installer.iss`, seção `[Files]`:
```pascal
Source: "docs\*"; DestDir: "{app}\docs"; Flags: ignoreversion recursesubdirs
```

### Executar Script Personalizado Após Instalação:

Adicione em `[Run]`:
```pascal
Filename: "{app}\meu-script.bat"; Flags: runhidden waituntilterminated
```

### Alterar Diretório Padrão:

Linha 16 do `installer.iss`:
```pascal
DefaultDirName={autopf}\MeuPomodoro
```

---

## 📝 Checklist Antes de Distribuir

- [ ] Testado em Windows 10
- [ ] Testado em Windows 11
- [ ] Python detectado corretamente
- [ ] Dependências instaladas com sucesso
- [ ] Atalhos criados corretamente
- [ ] Aplicativo abre sem erros
- [ ] Desinstalação funciona completamente
- [ ] Versão atualizada no installer.iss
- [ ] INSTALLER-INFO.txt revisado
- [ ] LICENSE.txt incluída

---

## 🎓 Recursos Adicionais

- **Inno Setup Docs:** https://jrsoftware.org/ishelp/
- **Exemplos:** C:\Program Files (x86)\Inno Setup 6\Examples\
- **FAQ:** https://jrsoftware.org/isfaq.php
- **Forum:** https://groups.google.com/g/inno-setup

---

## 🆘 Suporte

Problemas com o instalador? Abra uma issue:
https://github.com/r0bertgabriel/ciclo-estudo-pomodoro/issues

---

## 💡 Dicas Pro

### Assinatura Digital (Opcional):

Para evitar avisos do Windows Defender:
1. Obtenha certificado de código (Code Signing Certificate)
2. Use SignTool para assinar o .exe
3. Custa cerca de $100-300 por ano

### Build Automático com GitHub Actions:

Adicione workflow para compilar o instalador automaticamente (requer runner Windows).

### Criar Instalador Portátil:

Use a flag `PortableMode=yes` no Inno Setup para criar versão que não requer instalação.

---

**Desenvolvido por Robert Gabriel**
https://github.com/r0bertgabriel
