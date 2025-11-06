#!/bin/bash

# 🚀 Script de inicialização do Frontend (Node.js)
# Inicia o servidor frontend usando Node.js (server.js)

echo "🚀 Iniciando Frontend com Node.js..."
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado! Por favor, instale o Node.js."
    echo ""
    echo "Para instalar Node.js no Linux:"
    echo "  Ubuntu/Debian: sudo apt install nodejs"
    echo "  Arch: sudo pacman -S nodejs"
    echo "  Fedora: sudo dnf install nodejs"
    echo ""
    exit 1
fi

# Verificar versão do Node.js
NODE_VERSION=$(node --version)
echo "✅ Node.js detectado: $NODE_VERSION"
echo ""

# Criar diretório para logs se não existir
mkdir -p logs

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo "🛑 Encerrando servidor frontend..."
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Capturar Ctrl+C
trap cleanup SIGINT SIGTERM

# Iniciar servidor frontend
echo "🌐 Iniciando servidor frontend na porta 8080..."
node server.js > logs/frontend-node.log 2>&1 &
FRONTEND_PID=$!

# Aguardar servidor inicializar
sleep 2

# Verificar se está rodando
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "❌ Erro ao iniciar frontend! Verifique o arquivo logs/frontend-node.log"
    exit 1
fi

echo "✅ Frontend rodando em http://localhost:8080"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Servidor Frontend está rodando!"
echo ""
echo "📱 Acesse a aplicação:"
echo "   🍅 Timer Pomodoro:      http://localhost:8080/"
echo "   📚 Gerenciar Ciclos:    http://localhost:8080/ciclos.html"
echo "   📊 Dashboard Analytics: http://localhost:8080/dashboard.html"
echo ""
echo "📝 Logs disponíveis em:"
echo "   Frontend: logs/frontend-node.log"
echo ""
echo "⚠️  ATENÇÃO: O backend deve estar rodando na porta 8000!"
echo "   Para iniciar o backend: ./scripts/linux/start-backend-only.sh"
echo ""
echo "Pressione Ctrl+C para encerrar o servidor"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Manter o script rodando
wait
