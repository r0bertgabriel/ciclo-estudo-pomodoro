#!/bin/bash

# Script Linux/macOS para iniciar Pomodoro em modo streaming
# Chama o script Python multiplataforma

echo ""
echo "========================================"
echo " Pomodoro Boladão - Modo Streaming"
echo "========================================"
echo ""

# Detectar diretório do script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"

echo "📁 Diretório do projeto: $PROJECT_DIR"
cd "$PROJECT_DIR"

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado!"
    echo "Instale Python 3.8+ em: https://www.python.org/downloads/"
    exit 1
fi

# Executar script Python multiplataforma
python3 "$SCRIPT_DIR/../start-streaming.py"
