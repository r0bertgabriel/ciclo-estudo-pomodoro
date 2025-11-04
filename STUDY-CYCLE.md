# 🔄 Sistema de Ciclo de Estudos - Documentação

## 📚 O que é o Ciclo de Estudos?

Um **Ciclo de Estudos** é um método revolucionário de organização que substitui cronogramas fixos por uma sequência contínua e rotativa de disciplinas.

### 🎯 Conceito Principal

Em vez de definir horários fixos como:
- Segunda: Matemática
- Terça: Português
- Quarta: História

O ciclo estabelece uma **ordem lógica** que você segue continuamente:
```
Matemática → Português → História → Física → [volta para Matemática]
```

## ✨ Benefícios

### 1. **Flexibilidade Total**
- Não depende de dias específicos
- Estude no seu ritmo
- Retome de onde parou

### 2. **Equilíbrio Automático**
- Todas as matérias recebem atenção
- Distribuição justa do tempo
- Evita negligenciar disciplinas

### 3. **Zero Culpa**
- Se não estudou ontem, não há "atraso"
- Apenas continue do ponto onde parou
- Sem pressão de "recuperar" dias perdidos

### 4. **Progresso Contínuo**
- Sempre avança
- Visualiza evolução por disciplina
- Estatísticas detalhadas

## 🚀 Como Funciona no Pomodoro Timer

### 1. **Configurar o Ciclo**

1. Clique no botão **🔄** (Ciclo de Estudos)
2. Adicione suas disciplinas:
   - **Nome**: Ex: "Matemática", "Inglês"
   - **Cor**: Escolha uma cor para identificação visual
   - **Prioridade**: 1 (baixa) a 5 (urgente)

### 2. **Estudar com o Ciclo**

1. A **disciplina atual** aparece destacada
2. Inicie um Pomodoro de foco (25min)
3. Ao completar, o sistema:
   - ✅ Registra a sessão
   - ✅ Contabiliza o tempo
   - ✅ **Avança automaticamente** para próxima disciplina

### 3. **Acompanhar Progresso**

No modal do ciclo você vê:
- 📊 Total de sessões por disciplina
- ⏱️ Tempo total estudado
- 📅 Última vez que estudou cada matéria
- 🔄 Quantos ciclos completos realizou

## 📋 Exemplo Prático

### Configuração
```
Ciclo criado:
1. Português (Prioridade 4, Cor: Azul)
2. Matemática (Prioridade 5, Cor: Verde)
3. História (Prioridade 3, Cor: Laranja)
4. Física (Prioridade 4, Cor: Roxo)
```

### Dia 1 - Segunda-feira
- 9h: Português - 25min ✅
- 9h30: Matemática - 25min ✅
- 10h: História - 25min ✅
- *Pausa para almoço*

### Dia 2 - Terça-feira
- 14h: **Física** - 25min ✅ (continua de onde parou!)
- 14h30: Português - 25min ✅ (volta ao início do ciclo)
- 15h: Matemática - 25min ✅

### Resultado
- Não importa o dia da semana
- Sempre sabe qual matéria vem depois
- Distribuição equilibrada garantida

## 🎨 Interface

### Tela Principal
```
┌─────────────────────────────────┐
│  📚 Disciplina Atual            │
│                                 │
│  📗 Matemática                  │
│  📚 5 sessões | ⏱️ 2h 5m       │
│  ⭐ Prioridade 5                │
│  Próxima: Português             │
│                                 │
│  [← Anterior]  [Próxima →]     │
└─────────────────────────────────┘
```

### Modal de Gerenciamento
```
┌────────────────────────────────────────┐
│  🔄 Gerenciar Ciclo de Estudos        │
├────────────────────────────────────────┤
│                                        │
│  Adicionar Disciplina                 │
│  [Nome] [Cor] [Prioridade] [Adicionar]│
│                                        │
│  Disciplinas no Ciclo                 │
│  ┌──────────────────────────────────┐ │
│  │ 🟢 Matemática        5 sessões   │ │
│  │    Prioridade: 5     2h 5m      ➜│✕│
│  ├──────────────────────────────────┤ │
│  │ 🔵 Português         3 sessões   │ │
│  │    Prioridade: 4     1h 15m     ➜│✕│
│  └──────────────────────────────────┘ │
│                                        │
│  Estatísticas do Ciclo                │
│  [Cards com estatísticas detalhadas]  │
│                                        │
│  [Resetar] [Exportar] [Importar]      │
└────────────────────────────────────────┘
```

## 🔧 Funcionalidades

### ✅ Gerenciamento de Disciplinas
- **Adicionar**: Nome + Cor + Prioridade
- **Remover**: Exclui disciplina do ciclo
- **Reordenar**: (Futuro) Arrastar para reordenar
- **Editar**: (Futuro) Modificar propriedades

### ✅ Navegação
- **Próxima**: Avança manualmente para próxima disciplina
- **Anterior**: Volta para disciplina anterior
- **Pular para**: Clica em uma disciplina específica

### ✅ Registro Automático
- Cada Pomodoro de foco completo registra:
  - ✅ +1 sessão na disciplina atual
  - ✅ +25 minutos no tempo total
  - ✅ Data e hora do estudo
  - ✅ Avança automaticamente para próxima

### ✅ Estatísticas
- **Por Disciplina**:
  - Total de sessões
  - Tempo total (horas e minutos)
  - Última vez estudada
  - Média de performance (futuro)

- **Global**:
  - Ciclos completos
  - Total de sessões no ciclo
  - Distribuição de tempo

### ✅ Importar/Exportar
- **Exportar**: Salva ciclo em arquivo JSON
- **Importar**: Carrega ciclo de arquivo JSON
- **Backup automático**: Salvo no localStorage

### ✅ Resetar Progresso
- Mantém as disciplinas
- Zera todas as estatísticas
- Volta para primeira disciplina

## 🎯 Casos de Uso

### 1. Estudante de Concurso
```javascript
Ciclo: [
  "Português (Prioridade 5)",
  "Matemática (Prioridade 5)",
  "Direito Const. (Prioridade 4)",
  "RLM (Prioridade 3)",
  "Informática (Prioridade 3)"
]

Estratégia:
- 1 Pomodoro por disciplina
- Completa ciclo diariamente
- Prioridades ajustadas por dificuldade
```

### 2. Estudante Universitário
```javascript
Ciclo: [
  "Cálculo I (Prioridade 5)",
  "Álgebra Linear (Prioridade 4)",
  "Física I (Prioridade 4)",
  "Programação (Prioridade 3)"
]

Estratégia:
- 2 Pomodoros por disciplina
- Ciclo completo = 1 dia
- Revisão antes das provas
```

### 3. Autodidata / Cursos Online
```javascript
Ciclo: [
  "JavaScript (Prioridade 5)",
  "React (Prioridade 4)",
  "Node.js (Prioridade 3)",
  "Inglês (Prioridade 2)"
]

Estratégia:
- Flexível conforme disponibilidade
- Foco em habilidades práticas
- Ajusta prioridades conforme projetos
```

## 💡 Dicas de Uso

### 1. **Defina Prioridades Realisticamente**
- Prioridade 5: Urgente/Difícil
- Prioridade 3: Manutenção regular
- Prioridade 1: Revisão/Bonus

### 2. **Use Cores Estrategicamente**
- 🔴 Vermelho: Matérias difíceis/urgentes
- 🟡 Amarelo: Médio esforço
- 🟢 Verde: Já domina/revisão

### 3. **Ajuste o Ciclo Regularmente**
- Remove matérias já dominadas
- Adiciona novos conteúdos
- Reavalia prioridades semanalmente

### 4. **Combine com Estatísticas**
- Identifique matérias negligenciadas
- Balance tempo entre disciplinas
- Comemore os ciclos completos!

## 🔄 Fluxo de Trabalho Recomendado

### Configuração Inicial (5-10 min)
1. Liste todas as disciplinas
2. Defina cores e prioridades
3. Ordene do mais ao menos prioritário

### Rotina Diária
1. Abra o Pomodoro Timer
2. Veja qual disciplina está na vez
3. Inicie o Pomodoro de 25min
4. Estude com foco total
5. Complete → Sistema avança automaticamente
6. Faça a pausa
7. Repita com próxima disciplina

### Revisão Semanal (10-15 min)
1. Abra estatísticas do ciclo
2. Veja distribuição de tempo
3. Identifique gaps
4. Ajuste prioridades se necessário
5. Exporte backup do ciclo

## 📊 Exemplo de Estatísticas

Após 1 semana de uso:
```
Ciclo: 5 disciplinas
Ciclos Completos: 3
Total de Sessões: 27

Por Disciplina:
┌─────────────┬──────────┬──────────┬─────────────┐
│ Disciplina  │ Sessões  │ Tempo    │ Última Vez  │
├─────────────┼──────────┼──────────┼─────────────┤
│ Matemática  │ 8        │ 3h 20m   │ Hoje        │
│ Português   │ 7        │ 2h 55m   │ Ontem       │
│ História    │ 5        │ 2h 5m    │ 2 dias      │
│ Física      │ 4        │ 1h 40m   │ 3 dias      │
│ Inglês      │ 3        │ 1h 15m   │ 3 dias      │
└─────────────┴──────────┴──────────┴─────────────┘

Insight: Inglês precisa de mais atenção!
```

## 🎓 Metodologia por Trás

### Fundamentação
- **Repetição Espaçada**: Revisões regulares
- **Interleaving**: Alterna conteúdos para melhor retenção
- **Pomodoro**: Foco intenso em blocos curtos
- **Gamificação**: Progresso visível motiva continuidade

### Por que funciona?
1. **Elimina procrastinação**: Sempre sabe o que fazer
2. **Reduz sobrecarga**: Uma disciplina por vez
3. **Mantém constância**: Rotação garante revisão
4. **Flexibilidade**: Adapta-se à sua rotina

## 🚀 Próximos Passos

### Futuras Melhorias
- [ ] Arrastar e soltar para reordenar
- [ ] Sistema de metas por disciplina
- [ ] Gráficos de evolução
- [ ] Sugestão inteligente de próxima disciplina
- [ ] Integração com calendário
- [ ] Modo de revisão automática

## 📝 Resumo

O **Ciclo de Estudos** integrado ao Pomodoro Timer oferece:

✅ **Organização sem rigidez**  
✅ **Progresso equilibrado**  
✅ **Registro automático**  
✅ **Estatísticas detalhadas**  
✅ **Flexibilidade total**  
✅ **Zero culpa por "dias perdidos"**  

**Resultado**: Estudo consistente, organizado e livre de estresse! 🎯🍅
