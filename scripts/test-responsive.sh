#!/bin/bash

# Script para testar o Pomodoro em diferentes tamanhos de tela
# Uso: ./test-responsive.sh

echo "🧪 Testando Pomodoro - Layout Responsivo"
echo "========================================"
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se os servidores estão rodando
echo -e "${BLUE}📡 Verificando servidores...${NC}"

# Backend
if ! curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Backend não está rodando. Iniciando...${NC}"
    cd "$(dirname "$0")/../backend"
    python main.py &
    BACKEND_PID=$!
    echo "Backend PID: $BACKEND_PID"
    sleep 2
else
    echo -e "${GREEN}✓ Backend rodando em http://localhost:8000${NC}"
fi

# Frontend
if ! curl -s http://localhost:8001 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Frontend não está rodando. Iniciando...${NC}"
    cd "$(dirname "$0")/../frontend"
    python -m http.server 8001 &
    FRONTEND_PID=$!
    echo "Frontend PID: $FRONTEND_PID"
    sleep 1
else
    echo -e "${GREEN}✓ Frontend rodando em http://localhost:8001${NC}"
fi

echo ""
echo -e "${BLUE}🎨 CSS Modular:${NC}"
echo "  - variables.css: Variáveis e temas"
echo "  - base.css: Reset e estilos base"
echo "  - layout.css: Layout principal"
echo "  - buttons.css: Botões"
echo "  - timer.css: Timer e componentes"
echo "  - stats.css: Estatísticas"
echo "  - cycles.css: Ciclos de estudo"
echo "  - animations.css: Animações"
echo "  - responsive.css: Media queries desktop"
echo ""

echo -e "${BLUE}📐 Breakpoints de Teste:${NC}"
echo ""
echo "1. ${YELLOW}Mobile (< 1024px)${NC}"
echo "   Timer: 4-6rem"
echo "   Layout: 1 coluna"
echo "   URL: http://localhost:8001"
echo ""

echo "2. ${YELLOW}Desktop 1024px${NC}"
echo "   Timer: 10-18rem (+250%)"
echo "   Layout: 2 colunas (grid)"
echo "   URL: http://localhost:8001"
echo ""

echo "3. ${YELLOW}Desktop 1400px${NC}"
echo "   Timer: 12-20rem (+300%)"
echo "   Container: 1600px"
echo "   URL: http://localhost:8001"
echo ""

echo "4. ${YELLOW}Desktop 1920px${NC}"
echo "   Timer: 14-24rem (+350%)"
echo "   Container: 1800px"
echo "   URL: http://localhost:8001"
echo ""

echo -e "${GREEN}✓ Acesse http://localhost:8001 e redimensione a janela!${NC}"
echo ""
echo "Pressione Ctrl+C para parar os servidores"
echo ""

# Aguardar interrupção
wait
