# Funcionalidades de Streaming - Pomodoro Boladão

## 📋 Resumo

Este documento descreve as novas funcionalidades implementadas especificamente para uso em **streaming/transmissão de tela** (Discord, OBS, etc.), onde uma pessoa hospeda o timer e outras pessoas apenas assistem.

## 🎨 Funcionalidades Implementadas

### 1. **Animações de Status** ✨

**Descrição**: Animações visuais para mudanças de estado do timer.

**Características**:
- Animação de pulso quando o modo muda (Foco → Pausa → Pausa Longa)
- Transição suave no display do timer
- Efeito de celebração com confetes quando uma sessão é completada
- Animação de "completar sessão" (pulso 3x) ao terminar um pomodoro

**Arquivos**:
- `frontend/css/status-animations.css`
- `frontend/js/streaming-features.js`

**Como funciona**:
- Eventos automáticos disparados pelo timer
- Classes CSS aplicadas dinamicamente
- Confetes gerados aleatoriamente na tela

---

### 2. **Barra de Progresso Grande** 📊

**Descrição**: Barra de progresso diária visível e animada.

**Características**:
- Exibe progresso em relação à meta diária (4 pomodoros)
- Altura aumentada (24px) para melhor visibilidade
- Animação de brilho contínuo
- Gradiente de cor baseado no modo atual
- Texto mostrando "X / 4 Pomodoros"

**Arquivos**:
- `frontend/css/streaming.css`
- `frontend/js/streaming-features.js`

**Localização**: Aparece no topo da seção de progresso, acima das estatísticas existentes.

---

### 3. **Relatório Visual ao Final** 🎉

**Descrição**: Card/modal com resumo da sessão ao completar um ciclo (4 pomodoros).

**Características**:
- Aparece automaticamente ao completar 4 pomodoros
- Mostra:
  - Total de minutos estudados
  - Número de sessões
  - Matéria estudada
  - Sequência atual de dias
- Botão para **exportar como imagem** (PNG)
- Design atrativo com emoji, cores e sombras

**Arquivos**:
- `frontend/css/streaming.css`
- `frontend/js/streaming-features.js`

**Dependência**: `html2canvas` (carregado via CDN)

**Como usar**:
1. Complete um ciclo de 4 pomodoros
2. Modal aparece automaticamente
3. Clique em "💾 Salvar Imagem" para exportar
4. Compartilhe a imagem nas redes sociais!

---

### 4. **Contadores Visíveis** 🔢

**Descrição**: Painel fixo no canto superior direito com estatísticas em tempo real.

**Características**:
- **Horas hoje**: Total de horas e minutos estudados hoje
- **Sessões**: Número de sessões completadas
- **Sequência**: Dias consecutivos com estudo

**Arquivos**:
- `frontend/css/streaming.css`
- `frontend/js/streaming-features.js`

**Atualização**: Automática a cada tick do timer (1 segundo)

**Localização**: Posição fixa no canto superior direito da tela

---

### 5. **Histórico de Sessões (Lateral)** 📚

**Descrição**: Sidebar deslizante com lista de sessões recentes.

**Características**:
- Armazena até 20 sessões recentes
- Mostra para cada sessão:
  - Horário (data/hora)
  - Matéria estudada
  - Duração em minutos
- Animação de entrada para novas sessões
- Toggle button no canto direito
- Salva no localStorage

**Arquivos**:
- `frontend/css/streaming.css`
- `frontend/js/streaming-features.js`

**Como usar**:
1. Clique no botão "Histórico" (vertical, canto direito)
2. Sidebar desliza para dentro
3. Veja lista de sessões recentes
4. Clique novamente para fechar

---

### 6. **QR Code com ngrok** 📱

**Descrição**: QR Code gerado automaticamente com URL pública para acesso rápido via mobile.

**Características**:
- Integração com ngrok para túnel público
- QR Code gerado automaticamente
- Atualiza a cada 30 segundos
- Aparece apenas quando ngrok está ativo
- Localização: Canto inferior direito

**Arquivos Backend**:
- `backend/ngrok_integration.py`
- `backend/main.py` (endpoint `/api/ngrok/url`)

**Arquivos Frontend**:
- `frontend/js/qr-code.js`
- `frontend/css/streaming.css`

**Dependência**: 
- `ngrok` instalado no sistema
- `requests` (Python)
- `qrcodejs` (JavaScript, via CDN)

**Como ativar**:

1. **Instalar ngrok**:
   ```bash
   # Ubuntu/Debian
   sudo snap install ngrok
   
   # Ou baixe em: https://ngrok.com/download
   ```

2. **Configurar variável de ambiente**:
   ```bash
   export ENABLE_NGROK=true
   ```

3. **Iniciar o backend**:
   ```bash
   cd backend
   python main.py
   ```

4. **Usar QR Code**:
   - QR Code aparece automaticamente no canto inferior direito
   - Escaneie com celular para acessar o timer
   - Outros usuários podem acessar via este link

---

## 🚀 Como Usar em Streaming

### Setup Recomendado

1. **Iniciar com ngrok** (opcional, mas recomendado):
   ```bash
   export ENABLE_NGROK=true
   cd backend
   python main.py
   ```

2. **Abrir frontend** no navegador

3. **Configurar OBS/Discord**:
   - Compartilhe a janela do navegador
   - Ajuste o layout para mostrar:
     - Timer principal (centralizado)
     - Contadores (canto superior direito)
     - Barra de progresso (topo)
   - QR Code (canto inferior direito) para viewers acessarem

4. **Iniciar sessão**:
   - Escolha matéria
   - Inicie timer
   - Animações e confetes aparecem automaticamente

5. **Ao final do ciclo**:
   - Relatório aparece automaticamente
   - Exporte e compartilhe nas redes sociais
   - Histórico fica disponível na sidebar

---

## 📊 Estatísticas e Dados

### Endpoint Backend: `/api/stats/today`

**Retorna**:
```json
{
  "total_minutes": 125,
  "sessions_completed": 5,
  "current_streak": 7
}
```

### Cálculo de Streak

- Conta dias **consecutivos** com pelo menos 1 sessão
- Inclui hoje e ontem
- Para se o padrão quebrar

### Armazenamento

- **Histórico de sessões**: `localStorage` (frontend)
- **Estatísticas**: SQLite (backend)
- **Streak**: Calculado em tempo real

---

## 🎨 Personalização

### Cores

As cores seguem as variáveis CSS existentes:
- `--current-primary`: Cor do modo atual
- `--current-glow`: Brilho/sombra
- `--color-card`: Fundo dos cards
- `--color-border`: Bordas

### Ajustar Meta Diária

Edite `frontend/js/streaming-features.js`:

```javascript
updateDailyProgress(sessions) {
    const goal = 4; // ← Altere aqui
    // ...
}
```

### Desativar Funcionalidades

Remova os imports em `frontend/index.html`:

```html
<!-- Comentar para desativar -->
<!--
<script type="module" src="./js/streaming-features.js"></script>
<script type="module" src="./js/qr-code.js"></script>
-->
```

---

## 🐛 Troubleshooting

### QR Code não aparece

1. Verificar se ngrok está instalado:
   ```bash
   which ngrok
   ```

2. Verificar variável de ambiente:
   ```bash
   echo $ENABLE_NGROK
   ```

3. Verificar logs do backend:
   ```
   ✅ Túnel ngrok ativo: https://xxxx.ngrok.io
   ```

### Contadores não atualizam

- Verificar se backend está rodando
- Verificar endpoint `/api/stats/today`
- Abrir console do navegador para erros

### Animações não funcionam

- Verificar se `status-animations.css` está importado
- Limpar cache do navegador
- Verificar console para erros de JavaScript

### Exportar relatório falha

- Verificar se `html2canvas` está carregado
- Verificar console: `window.html2canvas`
- Recarregar página

---

## 📦 Dependências

### Backend
```
fastapi==0.121.0
uvicorn==0.38.0
pydantic==2.12.3
requests==2.31.0
```

### Frontend (CDN)
- `html2canvas@1.4.1`
- `qrcodejs@1.0.0`

### Sistema
- `ngrok` (opcional, para QR Code)

---

## 🔄 Próximas Melhorias

Possíveis extensões futuras:
- [ ] Integração com Twitch/YouTube chat
- [ ] Overlay customizável (posição dos elementos)
- [ ] Temas específicos para streaming
- [ ] Sons customizados
- [ ] Efeitos de partículas mais elaborados
- [ ] Dashboard de visualizadores
- [ ] Compartilhamento social automático

---

## 📝 Changelog

### v1.4.0 - Funcionalidades de Streaming

**Adicionado**:
- ✅ Animações de status e transições
- ✅ Barra de progresso grande animada
- ✅ Relatório visual exportável
- ✅ Contadores visíveis em tempo real
- ✅ Histórico de sessões lateral
- ✅ QR Code com integração ngrok

**Arquivos criados**:
- `frontend/css/status-animations.css`
- `frontend/css/streaming.css`
- `frontend/js/streaming-features.js`
- `frontend/js/qr-code.js`
- `backend/ngrok_integration.py`

**Arquivos modificados**:
- `frontend/index.html`
- `frontend/styles-modular.css`
- `frontend/js/timer.js`
- `backend/main.py`
- `backend/database.py`
- `backend/requirements.txt`

---

## 📧 Suporte

Para dúvidas ou problemas, verifique:
1. Console do navegador (F12)
2. Logs do backend
3. Documentação do ngrok: https://ngrok.com/docs
4. Issues no repositório
