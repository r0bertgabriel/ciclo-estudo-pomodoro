# 🤖 GitHub Actions - Build Automático

Este repositório utiliza GitHub Actions para compilar automaticamente o executável Windows (.exe) do Pomodoro.

## 📋 Como Funciona

### Gatilhos Automáticos

O workflow é executado automaticamente quando:

- ✅ Push para branch `main`
- ✅ Pull Request para `main`
- ✅ Criação de tags de versão (ex: `v1.0.0`)
- ✅ Manual (via interface do GitHub)

### Processo de Build

1. **Checkout do código** - Baixa o repositório
2. **Setup Python 3.11** - Configura ambiente Windows
3. **Instalação de dependências** - Instala PyInstaller + requirements
4. **Build do executável** - Executa PyInstaller no Windows
5. **Upload do artifact** - Salva o `.exe` por 90 dias
6. **Release** (apenas em tags) - Cria release com `.exe` anexado

## 🚀 Como Usar

### Opção 1: Download do Artifact (desenvolvimento)

1. Faça push das suas alterações:
   ```bash
   git add .
   git commit -m "Descrição da alteração"
   git push origin main
   ```

2. Acesse a aba **Actions** no GitHub:
   ```
   https://github.com/r0bertgabriel/ciclo-estudo-pomodoro/actions
   ```

3. Clique no workflow mais recente (verde = sucesso)

4. Role até **Artifacts** e baixe `Pomodoro-Windows-exe`

5. Extraia o arquivo ZIP e use o `Pomodoro.exe`

### Opção 2: Release Oficial (distribuição)

1. Crie uma tag de versão:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. O GitHub Actions automaticamente:
   - Compila o executável
   - Cria uma Release
   - Anexa o `Pomodoro.exe`

3. Acesse a aba **Releases** e baixe o `.exe`:
   ```
   https://github.com/r0bertgabriel/ciclo-estudo-pomodoro/releases
   ```

### Opção 3: Manual

1. Vá para **Actions** > **Build Windows Executable**

2. Clique em **Run workflow**

3. Selecione a branch e clique em **Run workflow**

4. Aguarde o build completar e baixe o artifact

## 📊 Status do Build

Você pode ver o status atual na página principal do repositório através do badge:

[![Build Windows Executable](https://github.com/r0bertgabriel/ciclo-estudo-pomodoro/actions/workflows/build-exe.yml/badge.svg)](https://github.com/r0bertgabriel/ciclo-estudo-pomodoro/actions/workflows/build-exe.yml)

## 🔧 Configuração do Workflow

O arquivo de configuração está em:
```
.github/workflows/build-exe.yml
```

### Modificar o Workflow

Para alterar a configuração do build, edite o arquivo `.github/workflows/build-exe.yml`:

```yaml
# Alterar versão do Python
python-version: '3.11'  # Mudar para '3.10', '3.12', etc

# Alterar tempo de retenção dos artifacts
retention-days: 90  # Mudar para 30, 60, etc

# Adicionar ícone personalizado
pyinstaller --onefile --windowed --name="Pomodoro" --icon=icon.ico launcher.py
```

## 🐛 Troubleshooting

### Build falhou?

1. Verifique os logs do workflow em **Actions**
2. Comum: dependências faltando em `backend/requirements.txt`
3. Solução: adicione as dependências e faça push novamente

### Artifact não aparece?

1. Verifique se o workflow completou com sucesso (verde)
2. Artifacts ficam disponíveis por 90 dias
3. Após esse período, execute o workflow novamente

### Release não foi criada?

1. Certifique-se de que a tag começa com `v` (ex: `v1.0.0`)
2. Verifique se o workflow teve permissões para criar releases
3. O token `GITHUB_TOKEN` já vem configurado automaticamente

## 💡 Vantagens

- ✅ **Compilação Windows mesmo desenvolvendo no Linux/Mac**
- ✅ **Builds automáticos a cada commit**
- ✅ **Artifacts salvos por 90 dias**
- ✅ **Releases automatizadas com versionamento**
- ✅ **Histórico completo de builds**
- ✅ **Sem necessidade de VM ou dual boot**

## 📚 Documentação Adicional

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [PyInstaller Manual](https://pyinstaller.org/en/stable/)
- [Guia Completo de Build](../CRIAR-EXECUTAVEL.md)
