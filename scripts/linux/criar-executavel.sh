#!/bin/bash

# ============================================
# Script para criar executável do Pomodoro
# ============================================

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   CRIAR EXECUTÁVEL - POMODORO BOLADÃO      ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Verificar se PyInstaller está instalado
if ! python3 -c "import PyInstaller" 2>/dev/null; then
    echo "📦 PyInstaller não encontrado. Instalando..."
    pip3 install pyinstaller
    echo ""
fi

echo "✅ PyInstaller instalado!"
echo ""

# Limpar builds anteriores
if [ -d "build" ]; then
    echo "🧹 Limpando builds anteriores..."
    rm -rf build
fi
if [ -d "dist" ]; then
    rm -rf dist
fi
if [ -f "Pomodoro.spec" ]; then
    rm Pomodoro.spec
fi

echo ""
echo "════════════════════════════════════════════"
echo "🔨 CRIANDO EXECUTÁVEL..."
echo "════════════════════════════════════════════"
echo ""
echo "Opções:"
echo "  --onefile      : Arquivo único"
echo "  --windowed     : Sem console"
echo "  --name         : Nome do executável"
echo ""

# Criar executável
pyinstaller --onefile --windowed --name="Pomodoro" launcher.py

echo ""
if [ -f "dist/Pomodoro" ]; then
    echo "════════════════════════════════════════════"
    echo "✅ EXECUTÁVEL CRIADO COM SUCESSO!"
    echo "════════════════════════════════════════════"
    echo ""
    echo "📁 Localização: dist/Pomodoro"
    echo "📏 Tamanho: $(du -h dist/Pomodoro | cut -f1)"
    echo ""
    echo "💡 Para usar:"
    echo "   1. Copie Pomodoro para a pasta do projeto"
    echo "   2. Execute: ./Pomodoro"
    echo ""
    echo "🚀 Listando arquivos em dist/:"
    ls -lh dist/
else
    echo "════════════════════════════════════════════"
    echo "❌ ERRO AO CRIAR EXECUTÁVEL"
    echo "════════════════════════════════════════════"
    echo ""
    echo "Verifique os logs acima para mais detalhes."
fi

echo ""
