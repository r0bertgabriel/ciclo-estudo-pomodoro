#!/bin/bash

# Script para iniciar o backend do Pomodoro Boladão
# Este script garante que o servidor seja iniciado do diretório correto

echo "🚀 Iniciando Backend do Pomodoro Boladão..."
echo ""

# Verificar se estamos no diretório correto
if [ ! -f "backend/main.py" ]; then
    echo "❌ ERRO: Execute este script do diretório raiz do projeto!"
    echo "   Use: ./scripts/linux/start-backend.sh"
    exit 1
fi

# Verificar se Python 3 está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ ERRO: Python 3 não está instalado!"
    echo "   Instale o Python 3 primeiro."
    exit 1
fi

# Verificar dependências
echo "📦 Verificando dependências..."
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "⚠️  FastAPI não encontrado. Instalando dependências..."
    pip3 install -r backend/requirements.txt
fi

echo "✅ Dependências OK!"
echo ""

# Entrar no diretório backend
cd backend

# Verificar se o módulo pode ser importado
if ! python3 -c "from main import app" 2>/dev/null; then
    echo "❌ ERRO: Não foi possível importar o módulo main!"
    echo "   Verifique se há erros no código."
    exit 1
fi

echo "✅ Módulo main verificado com sucesso!"
echo ""

# Iniciar servidor
echo "🌐 Iniciando servidor na porta 8000..."
echo "   Acesse: http://localhost:8000"
echo "   Documentação da API: http://localhost:8000/docs"
echo ""
echo "⚠️  Pressione CTRL+C para parar o servidor"
echo ""

python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
