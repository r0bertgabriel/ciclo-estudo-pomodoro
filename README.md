# 🍅 Pomodoro Timer com Ciclos de Estudo

Sistema completo de Pomodoro Timer integrado com gerenciamento de ciclos de estudos, controle semanal de horas por disciplina e persistência em banco de dados SQLite.

> **✨ Últimas Atualizações:**  
> ✅ Backend com FastAPI + SQLite  
> ✅ API REST para persistência de dados  
> ✅ Interface dedicada para gerenciamento de ciclos  
> ✅ Sistema de edição de disciplinas  
> ✅ Controle semanal com bloqueio automático  
> ✅ Modal removido em favor de tela cheia

## � Instalação

### Pré-requisitos
- Python 3.8+
- Navegador moderno com suporte a ES6 modules

### 1. Instalar Dependências Python

```bash
cd backend
pip install -r requirements.txt
```

### 2. Iniciar o Backend

```bash
cd backend
python main.py
```

O servidor estará disponível em `http://localhost:8000`

### 3. Abrir a Aplicação

Abra o arquivo `index.html` no navegador ou use um servidor HTTP simples:

```bash
# Com Python
python -m http.server 8080

# Com Node.js
npx http-server -p 8080
```

Acesse: `http://localhost:8080`  
✅ **Responsividade completa** mobile-first  

## 📁 Nova Estrutura


## 📋 Funcionalidades Atuais

### ✅ Pomodoro Timer
- ⏱️ Timer personalizável (foco, pausa curta, pausa longa)
- 🔔 Notificações de conclusão
- 📊 Estatísticas diárias
- 🎯 Seleção obrigatória de disciplina durante foco

### ✅ Ciclos de Estudo
- 📚 Criar múltiplos ciclos de estudo
- 🔄 Apenas um ciclo ativo por vez
- 📅 Definir dias de estudo personalizados
- ⏰ Controle de horas semanais por disciplina
- 🎨 Disciplinas com cores e prioridades
- 📈 Bloqueio automático ao atingir limite semanal
- 🔄 Reset automático semanal

### ✅ Gerenciamento
- ✏️ Editar disciplinas existentes
- ⚙️ Ajustar tempo manualmente
- 🚀 Pular para próxima disciplina
- 📊 Visualização de progresso por disciplina
- 💾 Exportar/Importar ciclos (JSON)
- 🌐 Interface dedicada em tela cheia

### ✅ Backend & Persistência
- 🗄️ SQLite para armazenamento persistente
- 🔗 API REST com FastAPI
- 📡 CORS configurado para desenvolvimento
- 🔒 Relacionamentos com CASCADE delete

## 🎯 Recomendações de Funcionalidades Futuras

### 1. 📅 Histórico e Calendário
**Descrição:** Visualização de todas as sessões de estudo em formato de calendário

**Funcionalidades:**
- Calendário mensal com código de cores por disciplina
- Clique em um dia para ver sessões detalhadas
- Heatmap de intensidade de estudo
- Filtros por ciclo e disciplina
- Visualização de streaks (dias consecutivos)

**Impacto:** Ajuda o usuário a visualizar padrões de estudo e identificar períodos de baixa produtividade

---

### 2. 📊 Analytics e Insights Avançados
**Descrição:** Dashboard com gráficos e métricas detalhadas

**Funcionalidades:**
- Gráficos de distribuição de tempo por disciplina
- Comparação entre semanas/meses
- Horários de pico de produtividade
- Taxa de conclusão de sessões
- Tempo médio de foco por disciplina
- Previsão de conclusão de metas

**Impacto:** Insights profundos sobre hábitos de estudo para otimização

---

### 3. 🏆 Sistema de Conquistas e Gamificação
**Descrição:** Motivação através de conquistas e recompensas

**Funcionalidades:**
- Badges por marcos atingidos (10h, 50h, 100h)
- Streaks de dias consecutivos
- Níveis de experiência por disciplina
- Desafios semanais personalizados
- Ranking de produtividade (opcional, multiplayer)
- Recompensas por consistência

**Impacto:** Aumenta engajamento e motivação através de gamificação

---

### 4. 📄 Relatórios Exportáveis
**Descrição:** Geração de relatórios profissionais em múltiplos formatos

**Funcionalidades:**
- Exportar em PDF, CSV, Excel
- Relatórios semanais/mensais/semestrais
- Gráficos e tabelas incluídos
- Resumo executivo de desempenho
- Comparação entre períodos
- Templates personalizáveis

**Impacto:** Documentação formal de progresso para compartilhar com professores/orientadores

---

### 5. ⏰ Sistema de Lembretes e Notificações
**Descrição:** Notificações inteligentes para manter consistência

**Funcionalidades:**
- Lembretes de horários de estudo fixos
- Alertas quando não estudar há X dias
- Notificações de metas diárias não cumpridas
- Sugestões de disciplinas negligenciadas
- Integração com notificações do sistema
- Envio de emails/SMS (opcional)

**Impacto:** Mantém usuário engajado e previne abandono do hábito

---

### 6. 🎨 Modo Foco Aprimorado
**Descrição:** Recursos avançados para manter concentração

**Funcionalidades:**
- Bloqueio de sites distractivos (integração com extensão)
- Música ambiente (white noise, lofi, binaural beats)
- Tela de foco fullscreen sem distrações
- Frases motivacionais durante pausas
- Respiração guiada nas pausas
- Modo Pomodoro estendido (50-10, 90-15)

**Impacto:** Maximiza qualidade das sessões de foco

---

### 7. 👥 Salas de Estudo Colaborativas
**Descrição:** Estudo em grupo virtual e competição amigável

**Funcionalidades:**
- Criar/entrar em salas de estudo
- Ver quem está estudando em tempo real
- Chat durante pausas (bloqueado durante foco)
- Competições de produtividade
- Ranking de sala
- Compartilhar progresso

**Impacto:** Motivação social e senso de comunidade

---

### 8. 📱 Aplicativo Mobile (PWA)
**Descrição:** Versão mobile com funcionalidades offline

**Funcionalidades:**
- Progressive Web App (PWA)
- Funciona offline
- Instalável no celular
- Notificações push
- Sincronização com desktop
- Interface otimizada para mobile

**Impacto:** Acesso em qualquer lugar, sem depender do computador

---

### 9. 🌓 Temas Personalizáveis
**Descrição:** Personalização visual da interface

**Funcionalidades:**
- Dark mode / Light mode / Auto
- Temas predefinidos (Ocean, Forest, Sunset, etc.)
- Editor de temas customizados
- Cores de destaque personalizáveis
- Fontes e tamanhos ajustáveis
- Exportar/Importar temas

**Impacto:** Conforto visual e experiência personalizada

---

### 10. ⚙️ Durações Personalizadas por Disciplina
**Descrição:** Configurações de Pomodoro específicas por disciplina

**Funcionalidades:**
- Definir duração de foco por disciplina
- Pausas customizadas por tipo de estudo
- Templates de configuração (Matemática: 45-10, Leitura: 60-15)
- Sugestões baseadas em desempenho
- Ciclos adaptativos (aumenta duração ao longo do tempo)

**Impacto:** Otimização baseada nas necessidades de cada matéria

---

### 11. 🧠 Técnica de Revisão Espaçada (Spaced Repetition)
**Descrição:** Integração com técnicas de memorização

**Funcionalidades:**
- Marcação de tópicos estudados por sessão
- Algoritmo de revisão espaçada
- Lembretes automáticos de revisão
- Cartões de revisão (flashcards)
- Gráfico de curva de esquecimento
- Integração com Anki (opcional)

**Impacto:** Melhora retenção de conteúdo estudado

---

### 12. 📝 Notas e Anotações Integradas
**Descrição:** Tomar notas durante/após sessões de estudo

**Funcionalidades:**
- Editor de texto simples por sessão
- Markdown support
- Vincular notas a disciplinas/ciclos
- Busca em todas as notas
- Tags e categorização
- Exportar notas em PDF/Markdown

**Impacto:** Centraliza informações e facilita revisão

---

### 13. 🔗 Integrações Externas
**Descrição:** Conectar com outras ferramentas de produtividade

**Funcionalidades:**
- Google Calendar (sincronizar sessões)
- Notion (exportar dados)
- Trello/Asana (vincular tarefas)
- Spotify (controlar música)
- RescueTime (importar dados)
- Webhooks para automações

**Impacto:** Ecossistema integrado de produtividade

---

### 14. 🎯 Planos de Estudo Automáticos
**Descrição:** IA sugere distribuição de tempo de estudo

**Funcionalidades:**
- Algoritmo de distribuição ótima de horas
- Considera prioridades e dificuldades
- Sugere horários ideais baseado em histórico
- Ajusta plano automaticamente
- Alertas de desvio do plano
- Templates de estudo (preparação para prova, rotina regular)

**Impacto:** Otimiza distribuição de esforço de forma inteligente

---

### 15. 🔐 Sistema de Usuários Multi-Perfil
**Descrição:** Suporte para múltiplos usuários e sincronização

**Funcionalidades:**
- Cadastro e autenticação de usuários
- Múltiplos perfis na mesma conta
- Sincronização cross-device
- Backup automático em nuvem
- Compartilhamento de ciclos entre usuários
- Controle de privacidade

**Impacto:** Permite uso por várias pessoas e acesso multi-dispositivo

---

## 🎨 Priorização Sugerida

### 🔥 Alta Prioridade (Implementar primeiro)
1. **Histórico e Calendário** - Visibilidade essencial
2. **Modo Foco Aprimorado** - Melhora core do produto
3. **Temas Personalizáveis** - Rápido e alto impacto visual

### ⚡ Média Prioridade (Implementar em seguida)
4. **Analytics e Insights** - Valor agregado significativo
5. **Sistema de Lembretes** - Mantém engajamento
6. **Durações Personalizadas** - Flexibilidade útil
7. **Aplicativo Mobile (PWA)** - Expande alcance

### 💡 Baixa Prioridade (Longo prazo)
8. **Sistema de Conquistas** - Gamificação opcional
9. **Relatórios Exportáveis** - Uso específico
10. **Salas Colaborativas** - Requer infraestrutura maior
11. **Revisão Espaçada** - Feature especializada
12. **Notas Integradas** - Pode usar ferramentas externas
13. **Integrações** - Complexidade de manutenção
14. **Planos Automáticos** - Requer IA/ML
15. **Multi-Perfil** - Infraestrutura complexa

---

## 🛠️ Stack Tecnológica

- **Frontend:** HTML5, CSS3, JavaScript ES6 Modules
- **Backend:** Python 3.8+, FastAPI
- **Database:** SQLite
- **API:** RESTful com CORS

## 📁 Estrutura do Projeto

```
pomodoro/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── database.py          # SQLite operations
│   ├── requirements.txt     # Python dependencies
│   └── pomodoro.db          # SQLite database (auto-created)
├── js/
│   ├── app.js              # Main Pomodoro app
│   ├── config.js           # Constants and settings
│   ├── storage.js          # API communication
│   ├── study-cycle.js      # Cycle management logic
│   └── ciclos.js           # Full-page ciclos app
├── ciclos.html             # Full-page cycles management
├── ciclos.css              # Styles for ciclos page
├── index.html              # Main Pomodoro interface
├── styles.css              # Global styles
└── README.md               # This file
```

## 🐛 Troubleshooting

### Backend não inicia
```bash
# Verifique se as dependências estão instaladas
pip list | grep fastapi

# Reinstale se necessário
pip install -r backend/requirements.txt
```

### CORS Error no navegador
Verifique se o backend está rodando em `http://localhost:8000` e o frontend em `http://localhost:8080`

### Dados não aparecem
1. Verifique o console do navegador (F12)
2. Confirme que o backend está rodando
3. Teste a API diretamente: `http://localhost:8000/api/cycles`

## 📄 Licença

Este projeto é de código aberto e está disponível para uso pessoal e educacional.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

---

**Desenvolvido com ❤️ e ☕**


## 🚀 Como Usar

### Opção 1: Servidor Node.js (Recomendado)
```bash
# Iniciar servidor
node server.js

# Acesse: http://localhost:8000
```

### Opção 2: Navegador Direto
```bash
# Abra index.html diretamente no navegador
# Ou use qualquer servidor HTTP
```

### Opção 3: Instalar como PWA
```bash
# Chrome: Menu → Instalar app
# Edge: Menu → Apps → Instalar este site como app
```

## ⚙️ Configurações

- **Tempos:** Foco (1-60min), Pausas (1-60min)
- **Comportamento:** Auto-start, Notificações
- **Sons:** Sino, Carrilhão, Digital, Nenhum
- **Temas:** Muda automaticamente por modo

## 🎨 Personalização

### Modificar Cores

```css
/* styles.css */
:root {
    --color-focus: #e74c3c;
    --color-short-break: #3498db;
    --color-long-break: #2ecc71;
}
```

### Adicionar Frases

```javascript
// js/config.js
export const MOTIVATIONAL_QUOTES = {
    focus: {
        running: ["Sua frase aqui!"]
    }
};
```

## 📱 Compatibilidade

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+  
- ✅ Safari 14+
- ✅ Mobile browsers

## 💡 Recursos

- ⏱️ Timer customizável
- 🎨 3 temas dinâmicos
- 📊 Estatísticas diárias
- 🔔 Notificações
- 🔊 Sons personalizáveis
- ⌨️ Atalhos de teclado
- 📱 PWA instalável
- 💾 Salvamento automático

## 🏗️ Arquitetura

```
MVC Pattern + Event-Driven

Timer (Model)
  ↓ events
App (Controller)
  ↓ commands
UI (View)
```

---

**Bom Foco! 🍅**
