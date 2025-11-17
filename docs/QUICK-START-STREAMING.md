# Guia Rápido - Funcionalidades de Streaming

## 🚀 Início Rápido

### Opção 1: Script Automatizado (Linux)

```bash
cd /caminho/do/projeto
./scripts/linux/start-streaming.sh
```

Este script:
- ✅ Verifica dependências
- ✅ Inicia frontend (porta 3000)
- ✅ Inicia backend (porta 8000)
- ✅ Ativa ngrok automaticamente (se instalado)
- ✅ Mostra QR Code

### Opção 2: Manual

**Terminal 1 - Backend com ngrok**:
```bash
cd backend
export ENABLE_NGROK=true
python3 main.py
```

**Terminal 2 - Frontend**:
```bash
cd frontend
python3 -m http.server 3000
```

**Abrir navegador**: http://localhost:3000

---

## 📱 Instalar ngrok (Opcional)

### Ubuntu/Debian/Linux
```bash
sudo snap install ngrok
```

### Outras opções
Baixe em: https://ngrok.com/download

---

## 🎨 Funcionalidades Ativas

Quando o app estiver rodando, você verá:

### 1. Contadores (Canto Superior Direito)
- ⏱️ Horas hoje
- 🍅 Sessões
- 🔥 Sequência

### 2. Barra de Progresso Grande (Topo)
- Meta: 4 pomodoros/dia
- Animação de brilho
- Cores do modo atual

### 3. Histórico (Botão Lateral Direito)
- Clique para abrir sidebar
- Lista de 20 sessões recentes
- Data, matéria e duração

### 4. Animações Automáticas
- Pulso ao mudar modo
- Confetes ao completar sessão
- Transições suaves

### 5. Relatório ao Final do Ciclo
- Aparece após 4 pomodoros
- Botão "Salvar Imagem"
- Compartilhe nas redes sociais

### 6. QR Code (Canto Inferior Direito)
- Somente se ngrok estiver ativo
- Escanear para acesso mobile
- Atualiza a cada 30 segundos

---

## 🎬 Usar em Streaming

### Discord
1. Compartilhar tela → Selecione janela do navegador
2. Ajuste tamanho para mostrar elementos importantes
3. Inicie timer

### OBS Studio
1. Adicionar fonte → Captura de janela
2. Selecione navegador com Pomodoro
3. Crop/redimensione conforme necessário
4. Inicie timer

### Dicas
- Modo tela cheia (F11) para melhor visualização
- Tema escuro recomendado para streaming noturno
- QR Code permite viewers acessarem junto

---

## 🔧 Personalizar

### Alterar Meta Diária

Edite `frontend/js/streaming-features.js`, linha ~175:

```javascript
const goal = 4; // Mude para 6, 8, etc.
```

### Desativar Funcionalidade Específica

Edite `frontend/index.html`, comente o script:

```html
<!-- <script type="module" src="./js/qr-code.js"></script> -->
```

### Posição dos Contadores

Edite `frontend/css/streaming.css`:

```css
.streaming-counters {
    top: 80px;    /* Altere aqui */
    right: 20px;  /* Ou aqui */
}
```

---

## 📊 Estatísticas

### Ver Dados em Tempo Real

Backend API: http://localhost:8000/api/stats/today

Retorna:
```json
{
  "total_minutes": 125,
  "sessions_completed": 5,
  "current_streak": 7
}
```

### Dashboard Completo

Acesse: http://localhost:3000/dashboard.html

---

## ❓ Problemas Comuns

### QR Code não aparece
- Verifique se ngrok está rodando: `ps aux | grep ngrok`
- Variável de ambiente: `export ENABLE_NGROK=true`
- Porta 4040: http://localhost:4040

### Contadores zerados
- Backend está rodando?
- Complete pelo menos 1 sessão
- Recarregue a página

### Animações não funcionam
- Limpe cache: Ctrl+Shift+R
- Console do navegador: F12 → Console
- Verifique erros JavaScript

### Exportar relatório falha
- `html2canvas` carregado? Console: `window.html2canvas`
- Permissões do navegador
- Tente outro navegador

---

## 📝 Atalhos

| Ação | Atalho |
|------|--------|
| Iniciar/Pausar | Espaço |
| Parar | Esc |
| Abrir histórico | H |
| Abrir config | C |
| Tela cheia | F11 |

---

## 🔄 Atualizar

```bash
cd /caminho/do/projeto
git pull origin main
cd backend
pip3 install -r requirements.txt
```

---

## 📚 Documentação Completa

Veja `docs/STREAMING-FEATURES.md` para detalhes técnicos completos.

---

## 🎯 Checklist de Streaming

Antes de começar:
- [ ] Backend rodando
- [ ] Frontend rodando
- [ ] ngrok ativo (opcional)
- [ ] QR Code visível (se ngrok)
- [ ] Navegador em tela cheia
- [ ] OBS/Discord configurado
- [ ] Audio funcionando
- [ ] Timer testado

Durante:
- [ ] Escolher matéria antes de iniciar
- [ ] Pausar entre sessões
- [ ] Mostrar relatório ao final
- [ ] Compartilhar progresso

---

Bons estudos! 🍅📚✨
