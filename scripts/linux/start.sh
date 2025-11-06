#!/bin/bash

# 🍅 Script de inicialização do Pomodoro Boladão
# Inicia backend (FastAPI) e frontend (HTTP Server) simultaneamente

echo "🍅 Iniciando Pomodoro Boladão..."
echo ""

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado! Por favor, instale o Python 3.8 ou superior."
    exit 1
fi

# Verificar se pip está instalado
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 não encontrado! Por favor, instale o pip."
    exit 1
fi

# Verificar se as dependências do backend estão instaladas
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "📦 Instalando dependências do backend..."
    pip3 install -r backend/requirements.txt
    echo ""
fi

# Criar diretório para logs se não existir
mkdir -p logs

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo "🛑 Encerrando servidores..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT SIGTERM

# Iniciar backend (FastAPI)
echo "🚀 Iniciando backend na porta 8000..."
cd backend
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Aguardar backend inicializar
sleep 2

# Verificar se backend está rodando
if ! curl -s http://localhost:8000/api/cycles > /dev/null; then
    echo "❌ Erro ao iniciar backend! Verifique o arquivo logs/backend.log"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Backend rodando em http://localhost:8000"

# Iniciar frontend (HTTP Server)
echo "🚀 Iniciando frontend na porta 8080..."
cd frontend
python3 -m http.server 8080 > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Aguardar frontend inicializar
sleep 1

echo "✅ Frontend rodando em http://localhost:8080"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Pomodoro Boladão está rodando!"
echo ""
echo "📱 Acesse a aplicação:"
echo "   🍅 Timer Pomodoro:  http://localhost:8080/index.html"
echo "   📚 Gerenciar Ciclos: http://localhost:8080/ciclos.html"
echo ""
echo "🔧 APIs disponíveis:"
echo "   📊 API Backend:     http://localhost:8000/api/cycles"
echo "   📖 Documentação:    http://localhost:8000/docs"
echo ""
echo "📝 Logs disponíveis em:"
echo "   Backend:  logs/backend.log"
echo "   Frontend: logs/frontend.log"
echo ""
echo "Pressione Ctrl+C para encerrar os servidores"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Manter o script rodando
wait
