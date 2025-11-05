# 🏷️ Guia de Releases e Versionamento

## 📋 Como Criar Releases Automáticas

### Método 1: Release com Changelog Automático (Recomendado)

```bash
# 1. Certifique-se de que suas mudanças estão commitadas
git add .
git commit -m "feat: adiciona nova funcionalidade X"
git push origin main

# 2. Crie uma tag de versão seguindo Semantic Versioning
git tag v1.0.0

# 3. Envie a tag para o GitHub
git push origin v1.0.0
```

**O que acontece automaticamente:**
- ✅ GitHub Actions compila o `Pomodoro.exe`
- ✅ Gera changelog com base nos commits
- ✅ Cria a release com o .exe anexado
- ✅ Publica automaticamente

### Método 2: Release Manual com Descrição Personalizada

```bash
# 1. Criar tag com mensagem
git tag -a v1.0.0 -m "Release 1.0.0 - Sistema de Pomodoro Completo"

# 2. Enviar tag
git push origin v1.0.0

# 3. Editar a release no GitHub se necessário
# Vá para: https://github.com/r0bertgabriel/ciclo-estudo-pomodoro/releases
```

---

## 🔢 Semantic Versioning (Versionamento Semântico)

Formato: `vMAJOR.MINOR.PATCH` (ex: `v1.2.3`)

### MAJOR (v1.0.0 → v2.0.0)
Mudanças que quebram compatibilidade:
- Remoção de funcionalidades
- Mudanças na API que quebram código existente
- Reestruturação completa

### MINOR (v1.0.0 → v1.1.0)
Novas funcionalidades compatíveis:
- Adicionar novos recursos
- Melhorias significativas
- Novas APIs mantendo compatibilidade

### PATCH (v1.0.0 → v1.0.1)
Correções de bugs:
- Correções de erros
- Pequenas melhorias
- Ajustes de performance

---

## 📝 Padrão de Mensagens de Commit (Conventional Commits)

Use prefixos para categorizar automaticamente no changelog:

### 🚀 Novas Funcionalidades
```bash
git commit -m "feat: adiciona timer customizável"
git commit -m "feat(timer): permite pausar e retomar"
```

### 🐛 Correções de Bugs
```bash
git commit -m "fix: corrige erro no salvamento de dados"
git commit -m "fix(database): resolve problema de conexão"
```

### 📚 Documentação
```bash
git commit -m "docs: atualiza README com novas instruções"
git commit -m "docs(api): documenta endpoints do backend"
```

### 🎨 Interface/Estilo
```bash
git commit -m "style: melhora layout da tela de ciclos"
git commit -m "ui: adiciona animações suaves"
```

### ⚡ Performance
```bash
git commit -m "perf: otimiza consultas ao banco de dados"
git commit -m "perf(timer): reduz uso de memória"
```

### 🔧 Manutenção/Refatoração
```bash
git commit -m "refactor: reorganiza estrutura de pastas"
git commit -m "chore: atualiza dependências"
```

### 🧪 Testes
```bash
git commit -m "test: adiciona testes unitários do timer"
git commit -m "test(api): testa endpoints REST"
```

### 🔒 Segurança
```bash
git commit -m "security: corrige vulnerabilidade XSS"
```

---

## 🎯 Exemplos Práticos

### Exemplo 1: Primeira Release

```bash
# Versão inicial do projeto
git tag v1.0.0
git push origin v1.0.0
```

**Release gerada:**
```
🎉 Release v1.0.0

📦 Download
Baixe o executável Windows abaixo em Assets.

📝 Alterações
- feat: sistema completo de Pomodoro (abc123)
- feat: integração com banco de dados SQLite (def456)
- feat: interface de gerenciamento de ciclos (ghi789)
- docs: adiciona documentação completa (jkl012)

👥 Contribuidores
- @r0bertgabriel
```

### Exemplo 2: Nova Funcionalidade (Minor)

```bash
# Adicionar nova feature
git commit -m "feat: adiciona modo escuro"
git commit -m "feat: permite exportar histórico para CSV"
git push origin main

# Criar release minor
git tag v1.1.0
git push origin v1.1.0
```

### Exemplo 3: Correção de Bug (Patch)

```bash
# Corrigir bugs
git commit -m "fix: corrige erro ao salvar configurações"
git commit -m "fix: resolve problema de notificações"
git push origin main

# Criar release patch
git tag v1.0.1
git push origin v1.0.1
```

### Exemplo 4: Mudança que Quebra Compatibilidade (Major)

```bash
# Mudanças incompatíveis
git commit -m "feat!: nova estrutura de banco de dados (breaking change)"
git commit -m "refactor!: remove suporte a Python 3.7"
git push origin main

# Criar release major
git tag v2.0.0
git push origin v2.0.0
```

---

## 🏗️ Estrutura do Changelog Automático

O GitHub Actions gera automaticamente:

```markdown
## 🎉 Release v1.2.0

### 📦 Download
Baixe o executável Windows abaixo em **Assets**.

### 📝 Alterações desde v1.1.0
- feat: adiciona modo escuro (a1b2c3)
- feat: permite exportar para CSV (d4e5f6)
- fix: corrige bug de notificações (g7h8i9)
- docs: atualiza guia de instalação (j0k1l2)

### 👥 Contribuidores
- @r0bertgabriel
- @outro-colaborador
```

---

## 🔍 Verificar Releases

### Ver todas as releases:
```bash
git tag -l
```

### Ver detalhes de uma tag:
```bash
git show v1.0.0
```

### Ver changelog entre tags:
```bash
git log v1.0.0..v1.1.0 --oneline
```

---

## 🗑️ Deletar Release (se necessário)

### Deletar tag local:
```bash
git tag -d v1.0.0
```

### Deletar tag remota:
```bash
git push origin --delete v1.0.0
```

**⚠️ Atenção:** Deletar releases já publicadas pode confundir usuários!

---

## 📊 Exemplo de Fluxo Completo

```bash
# 1. Desenvolver features
git checkout -b feature/nova-funcionalidade
git commit -m "feat: adiciona nova funcionalidade"
git push origin feature/nova-funcionalidade

# 2. Merge para main (via Pull Request ou direto)
git checkout main
git merge feature/nova-funcionalidade
git push origin main

# 3. Criar release
git tag v1.1.0
git push origin v1.1.0

# 4. Aguardar GitHub Actions (2-5 minutos)
# Acesse: https://github.com/r0bertgabriel/ciclo-estudo-pomodoro/releases

# 5. Release publicada automaticamente com:
#    - Pomodoro.exe anexado
#    - Changelog gerado
#    - Notas de release
```

---

## 🎨 Labels para Categorização

Use labels nos Pull Requests/Issues para melhor organização do changelog:

- `feature` - Nova funcionalidade
- `bug` / `fix` - Correção
- `documentation` - Documentação
- `ui` / `ux` - Interface
- `performance` - Performance
- `security` - Segurança
- `test` - Testes
- `refactor` - Refatoração

---

## 💡 Dicas Pro

### Pre-release (versões beta)
```bash
git tag v2.0.0-beta.1
git push origin v2.0.0-beta.1
```
O GitHub marcará automaticamente como pre-release.

### Release com múltiplos arquivos
Edite `.github/workflows/build-exe.yml` e adicione mais arquivos:
```yaml
files: |
  dist/Pomodoro.exe
  docs/manual.pdf
  LICENSE
```

### Changelog manual
Crie arquivo `CHANGELOG.md` na raiz do projeto e mantenha atualizado.

---

## 🚀 Próximos Passos

1. **Primeira release:** `git tag v1.0.0 && git push origin v1.0.0`
2. **Configure labels** no repositório
3. **Use Conventional Commits** para mensagens padronizadas
4. **Monitore Actions** para ver o processo
5. **Compartilhe** o link da release com usuários!

---

## 📚 Referências

- [Semantic Versioning](https://semver.org/lang/pt-BR/)
- [Conventional Commits](https://www.conventionalcommits.org/pt-br/)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [Keep a Changelog](https://keepachangelog.com/pt-BR/)
