# 📦 Changelog

## v1.3.1 - 2025-11-06

### 🔧 Correções Críticas
- **Compatibilidade Multiplataforma**: Corrigido funcionamento no Debian, Arch e Windows
- **Modo Offline**: Aplicação agora funciona 100% sem backend (localStorage)
- **Erro ao Criar Ciclo**: Adicionado fallback inteligente para localStorage
- **Erro ao Buscar Ciclos**: Implementado health check automático do backend
- **Ícone Duplicado**: Removido emoji duplicado na aba do navegador

### ✨ Melhorias
- Health check endpoint (`/api/health`) para verificar disponibilidade do backend
- Fallback automático para localStorage em todos os métodos críticos:
  - `getCycles()` - buscar ciclos
  - `getActiveCycle()` - buscar ciclo ativo
  - `createCycle()` - criar ciclo
  - `createSubject()` - criar disciplina
- Mensagens de log informativas (modo online vs offline)
- Salvamento duplo (backend + localStorage) para redundância
- Timeout de 2s no health check (não trava aplicação)

### 🐛 Bugs Corrigidos
- Frontend rodando de diretório incorreto no Windows (`start.bat`)
- Métodos retornando `null` e quebrando aplicação
- Erros não tratados quando backend indisponível
- Ícone 🍅 aparecendo duplicado no título

### 📚 Documentação
- Criado `docs/MULTIPLATAFORMA.md` - Guia completo de instalação
- Criado `docs/CORRECOES-MULTIPLATAFORMA-v1.3.1.md` - Detalhes técnicos
- Criado `scripts/windows/launcher.bat` - Launcher para Windows

### 🧪 Testes
- ✅ Arch Linux - 100% funcional
- ✅ Debian 12 - 100% funcional  
- ✅ Modo offline - 100% funcional
- ⚠️ Windows - Pendente testes

---

## v1.4.0 - 2025-11-05

### Novidades
- add rotina realeses (6fda93b)
- Corrige versão do actions/upload-artifact para v4 (68ad04f)
- Adiciona GitHub Actions para build automático do .exe (0d34ff6)
- criando executaveis (a53cd75)
- delete .mdss (a3cd81d)
- up (a6bbe4a)
- correcao guto (150d93b)
- adc imagens (736c63e)
- up (4f9cb22)
- up (4d52860)
- first commit (e7b0856)

---

Consulte releases anteriores para histórico completo.
