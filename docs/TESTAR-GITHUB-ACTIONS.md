# 🧪 Testando o GitHub Actions

## Guia Rápido para Testar o Build Automático

### 1️⃣ Fazer Commit e Push

```bash
# Adicionar os novos arquivos do GitHub Actions
git add .github/workflows/build-exe.yml
git add .github/workflows/README.md
git add CRIAR-EXECUTAVEL.md
git add README.md

# Fazer commit
git commit -m "Adiciona GitHub Actions para build automático do .exe"

# Enviar para o GitHub
git push origin main
```

### 2️⃣ Acompanhar o Build

1. Acesse: https://github.com/r0bertgabriel/ciclo-estudo-pomodoro/actions

2. Você verá o workflow "Build Windows Executable" em execução

3. Clique nele para ver os detalhes em tempo real

4. O processo leva cerca de 2-5 minutos

### 3️⃣ Baixar o Executável

Após o build completar (ícone verde ✅):

1. Role até a seção **Artifacts**

2. Clique em **Pomodoro-Windows-exe** para baixar

3. Extraia o arquivo ZIP

4. Use o `Pomodoro.exe`

## 📋 Checklist de Verificação

- [ ] Workflow aparece na aba Actions?
- [ ] Build completou com sucesso (verde)?
- [ ] Artifact "Pomodoro-Windows-exe" está disponível?
- [ ] O .exe foi baixado e extraído?
- [ ] O executável abre corretamente no Windows?

## 🎯 Próximos Passos

### Criar uma Release Oficial

```bash
# Criar tag de versão
git tag v1.0.0
git commit --allow-empty -m "Release v1.0.0"
git push origin v1.0.0
```

Isso criará automaticamente uma Release com o .exe anexado!

### Testar Execução Manual

1. Vá para **Actions** > **Build Windows Executable**
2. Clique em **Run workflow**
3. Selecione branch `main`
4. Clique em **Run workflow**

## 🐛 Se Algo Der Errado

### Build falhou?

1. Clique no workflow falhado
2. Expanda o log do erro
3. Verifique a mensagem de erro

**Erros comuns:**

- Falta de dependência: Adicione ao `backend/requirements.txt`
- Erro de sintaxe: Verifique o código Python
- Problema do PyInstaller: Veja os logs detalhados

### Artifact não aparece?

- Certifique-se de que o workflow completou (não apenas passou)
- Verifique se há erros no step "Upload executable as artifact"

### Quero cancelar um build?

1. Vá para Actions
2. Clique no workflow em execução
3. Botão "Cancel workflow" no topo

## 💡 Dicas

- O artifact fica disponível por **90 dias**
- Você pode baixar quantas vezes quiser
- Cada push gera um novo build
- Builds de Pull Requests também funcionam (para testes)

## 🎓 Aprendizado

Este setup demonstra:

- ✅ CI/CD básico com GitHub Actions
- ✅ Build cross-platform (Linux → Windows)
- ✅ Gestão de artifacts
- ✅ Automação de releases
- ✅ Versionamento com tags Git

Agora você tem um pipeline profissional de build! 🚀
