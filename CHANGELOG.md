# 📦 Changelog

## v1.4.0 - 2025-11-17

### 🎨 Refatoração CSS Modular
- **Arquitetura Modular**: CSS dividido em 9 módulos temáticos (de 2098 linhas para módulos organizados)
  - `css/variables.css` - Variáveis e temas (70 linhas)
  - `css/base.css` - Reset e estilos base (70 linhas)
  - `css/layout.css` - Layout principal (98 linhas)
  - `css/buttons.css` - Botões (134 linhas)
  - `css/timer.css` - Timer e componentes (267 linhas)
  - `css/stats.css` - Estatísticas (43 linhas)
  - `css/cycles.css` - Ciclos de estudo (81 linhas)
  - `css/animations.css` - Animações (90 linhas)
  - `css/responsive.css` - Media queries desktop (230 linhas)
- **Arquivo Mestre**: `styles-modular.css` importa todos os módulos via `@import`
- **Backward Compatible**: `styles.css` original mantido como fallback

### 🖥️ Otimização Desktop MASSIVA
- **Timer Display Gigante**:
  - Mobile (< 1024px): 4-6rem (mantido)
  - Desktop 1024px: **10-18rem** (+250%)
  - Desktop 1400px: **12-20rem** (+300%)
  - Desktop 1920px: **14-24rem** (+350%)
- **Layout Grid 2 Colunas**: 
  - Timer ocupa coluna esquerda (85vh de altura)
  - Stats + Cycles em sidebar direita sempre visível
- **Elementos Aumentados**:
  - Botões: 48px → **80px** (+67%)
  - Mode buttons: 48px → **60px** (+25%)
  - Quote: 1.1rem → **1.5-1.7rem** (+45%)
  - Progress bar: 12px → **20px** (+67%)
  - Stat values: 2.5rem → **3rem** (+20%)

### ✨ Melhorias Visuais
- **Múltiplas Sombras de Glow**: Timer com 4 camadas de sombra em desktop
- **Hover Effects Interativos**: Stats cards com scale e glow ao passar mouse
- **Sticky Positioning**: Stats section fica fixo ao rolar página
- **Breakpoints Responsivos**: 1024px, 1400px, 1920px para ultra-wide

### 📊 Performance
- **Cacheamento por Módulo**: Navegadores podem cachear arquivos CSS individuais
- **Carregamento Paralelo**: Múltiplos arquivos CSS carregados simultaneamente
- **Zero Breaking Changes**: Compatibilidade total com versões anteriores

### 📚 Documentação
- `docs/REFATORACAO-CSS.md` - Guia completo da modularização
- `docs/COMPARATIVO-LAYOUT.md` - Antes vs Depois visual com diagramas
- `docs/RESUMO-REFATORACAO.md` - Resumo executivo das mudanças
- `scripts/test-responsive.sh` - Script para testar breakpoints

### 🧪 Testes
- ✅ CSS modular carregando corretamente (9 módulos)
- ✅ Layout desktop funcionando em 1024px+
- ✅ Mobile preservado (< 1024px)
- ✅ Sem erros de compilação
- ✅ Backward compatibility mantida

---

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
