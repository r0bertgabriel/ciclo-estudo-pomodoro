# ⚡ Guia Rápido de Início

## 🚀 Iniciar o Projeto em 3 Passos

### 1️⃣ Instalar e Iniciar Backend

```bash
# Opção A: Usar o script automático
./start-backend.sh

# Opção B: Manual
cd backend
pip install -r requirements.txt
python main.py
```

✅ Backend rodando em: `http://localhost:8000`  
📚 Documentação da API: `http://localhost:8000/docs`

---

### 2️⃣ Iniciar Frontend

Abra um novo terminal e execute:

```bash
# Opção A: Python
python -m http.server 8080

# Opção B: Node.js
npx http-server -p 8080
```

✅ Frontend rodando em: `http://localhost:8080`

---

### 3️⃣ Acessar a Aplicação

Abra no navegador: `http://localhost:8080`

---

## 🎯 Primeiros Passos

### 1. Criar seu Primeiro Ciclo

1. Clique em **"Ciclos"** no canto superior direito
2. Clique em **"➕ Novo Ciclo"**
3. Digite o nome (ex: "Semestre 2024.2")
4. Selecione os dias de estudo
5. Clique em **"Salvar"**

### 2. Adicionar Disciplinas

1. Na mesma tela, preencha o formulário:
   - **Nome:** Ex: "Matemática"
   - **Horas Semanais:** 10
   - **Cor:** Escolha uma cor
   - **Prioridade:** Alta/Média/Baixa
2. Clique em **"➕ Adicionar Disciplina"**

### 3. Usar o Pomodoro

1. Clique em **"⏱️ Ir para Pomodoro"** (ou volte para a página inicial)
2. Selecione uma disciplina no seletor
3. Clique em **"Iniciar"**
4. Foque durante o timer!

---

## 🎨 Dicas Rápidas

### Editar Disciplina
- Clique no botão **✏️** na disciplina
- O formulário será preenchido
- Faça as alterações e clique em **"💾 Salvar Alterações"**

### Ajustar Tempo Manualmente
- Clique no botão **⚙️** na disciplina
- Digite os minutos adicionais/negativos
- Útil para correções ou estudo fora do timer

### Pular para Próxima Disciplina
- Clique no botão **🚀** para ir direto para outra disciplina
- Útil quando terminar antes do tempo

### Exportar Dados
- Na tela de Ciclos, clique em **"📥 Exportar Ciclo"**
- Salve o arquivo JSON
- Use **"📤 Importar Ciclo"** para restaurar

---

## 🐛 Problemas Comuns

### Backend não inicia
```bash
# Verifique se Python está instalado
python3 --version

# Reinstale as dependências
pip install --upgrade -r backend/requirements.txt
```

### Erro CORS no navegador
- Certifique-se que o backend está em `localhost:8000`
- Certifique-se que o frontend está em `localhost:8080`
- Não use `file://` diretamente

### Disciplinas não aparecem
1. Abra o Console (F12)
2. Verifique se há erros
3. Confirme que o backend está rodando
4. Teste: `http://localhost:8000/api/cycles`

---

## 📖 Próximos Passos

- Explore as estatísticas do ciclo
- Configure o timer em **"Config"**
- Experimente diferentes combinações de horas semanais
- Use a função de ajuste manual quando necessário

---

**Bons estudos! 🍅📚**
