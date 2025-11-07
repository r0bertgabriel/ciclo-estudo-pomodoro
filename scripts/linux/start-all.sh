#!/bin/bash

# Script para iniciar Backend e Frontend juntos
# Pomodoro Boladão 🍅

echo "🍅 Iniciando Pomodoro Boladão..."
echo "================================"

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale o Python 3."
    exit 1
fi

echo "✅ Python encontrado: $(python3 --version)"

# Verificar se o pip está instalado
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 não encontrado. Por favor, instale o pip."
    exit 1
fi

echo "✅ pip encontrado"

# Instalar dependências do backend se necessário
if [ ! -d "backend/__pycache__" ]; then
    echo "📦 Instalando dependências do backend..."
    pip3 install -r backend/requirements.txt
fi

# Criar diretório para logs se não existir
mkdir -p logs

# Iniciar o backend em background
echo ""
echo "🚀 Iniciando backend (FastAPI) na porta 8000..."
python3 -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000 > logs/backend.log 2>&1 &
BACKEND_PID=$!

# Aguardar backend iniciar
echo "⏳ Aguardando backend inicializar..."
sleep 3

# Verificar se o backend está rodando
if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "⚠️  Backend pode não ter iniciado corretamente. Verificando logs..."
    tail -n 20 logs/backend.log
fi

# Iniciar o frontend em background
echo ""
echo "🚀 Iniciando frontend (HTTP Server) na porta 8080..."
python3 -m http.server 8080 > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

# Aguardar frontend iniciar
sleep 2

echo ""
echo "================================"
echo "✅ Aplicação iniciada com sucesso!"
echo ""
echo "📱 Frontend: http://localhost:8080"
echo "   - Timer: http://localhost:8080/index.html"
echo "   - Gerenciar Ciclos: http://localhost:8080/ciclos.html"
echo ""
echo "🔧 Backend API: http://localhost:8000"
echo "   - Documentação: http://localhost:8000/docs"
echo ""
echo "🔍 PIDs dos processos:"
echo "   - Backend: $BACKEND_PID"
echo "   - Frontend: $FRONTEND_PID"
echo ""
echo "📋 Logs salvos em:"
echo "   - Backend: logs/backend.log"
echo "   - Frontend: logs/frontend.log"
echo ""
echo "⚠️  Para parar a aplicação, pressione Ctrl+C ou execute:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "================================"

# Função para limpar ao sair
cleanup() {
    echo ""
    echo "🛑 Parando aplicação..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Aplicação parada!"
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT SIGTERM

# Manter script rodando
echo "💡 Pressione Ctrl+C para parar a aplicação"
echo ""

# Abrir navegador automaticamente (se disponível)
# Suprimir erros do Fontconfig
export FONTCONFIG_FILE=/dev/null
export FONTCONFIG_PATH=/dev/null

if command -v xdg-open &> /dev/null; then
    sleep 2
    xdg-open http://localhost:8080/index.html >/dev/null 2>&1 &
elif command -v open &> /dev/null; then
    sleep 2
    open http://localhost:8080/index.html >/dev/null 2>&1 &
fi

# Aguardar indefinidamente
wait
