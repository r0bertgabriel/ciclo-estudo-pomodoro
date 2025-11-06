#!/bin/bash

# Script de instalação e inicialização do Backend Pomodoro

echo "🍅 Instalando Backend do Pomodoro Timer..."
echo ""

# Verificar Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale Python 3.8+"
    exit 1
fi

echo "✅ Python 3 encontrado: $(python3 --version)"
echo ""

# Navegar para o diretório backend
cd backend || exit 1

# Instalar dependências
echo "📦 Instalando dependências..."
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo "✅ Dependências instaladas com sucesso"
echo ""

# Iniciar servidor
echo "🚀 Iniciando servidor FastAPI..."
echo "📡 Servidor disponível em: http://localhost:8000"
echo "📚 Documentação da API: http://localhost:8000/docs"
echo ""
echo "⚠️  Para parar o servidor, pressione Ctrl+C"
echo ""

python3 main.py
