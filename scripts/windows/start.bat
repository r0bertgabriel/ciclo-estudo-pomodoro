@echo off
REM 🍅 Script de inicialização do Pomodoro Boladão para Windows
REM Inicia backend (FastAPI) e frontend (HTTP Server) simultaneamente

echo 🍅 Iniciando Pomodoro Boladão...
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado! Por favor, instale o Python 3.8 ou superior.
    echo    Download: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Verificar se pip está instalado
pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ pip não encontrado! Por favor, reinstale o Python com pip.
    pause
    exit /b 1
)

REM Verificar se as dependências do backend estão instaladas
python -c "import fastapi" >nul 2>&1
if errorlevel 1 (
    echo 📦 Instalando dependências do backend...
    pip install -r backend\requirements.txt
    echo.
)

REM Criar diretório para logs se não existir
if not exist logs mkdir logs

REM Iniciar backend (FastAPI)
echo 🚀 Iniciando backend na porta 8000...
start "Backend - Pomodoro API" cmd /k "python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

REM Aguardar backend inicializar
timeout /t 3 /nobreak >nul

REM Iniciar frontend (HTTP Server) - CORRIGIDO para rodar de dentro de /frontend/
echo 🚀 Iniciando frontend na porta 8080...
cd frontend
start "Frontend - Pomodoro App" cmd /k "python -m http.server 8080"
cd ..

REM Aguardar frontend inicializar
timeout /t 2 /nobreak >nul

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo 🎉 Pomodoro Boladão está rodando!
echo.
echo 📱 Acesse a aplicação:
echo    🍅 Timer Pomodoro:  http://localhost:8080/index.html
echo    📚 Gerenciar Ciclos: http://localhost:8080/ciclos.html
echo.
echo 🔧 APIs disponíveis:
echo    📊 API Backend:     http://localhost:8000/api/cycles
echo    📖 Documentação:    http://localhost:8000/docs
echo.
echo 💡 Duas janelas CMD foram abertas (Backend e Frontend)
echo    Feche ambas para encerrar os servidores
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Abrir navegador automaticamente
timeout /t 2 /nobreak >nul
start http://localhost:8080/index.html

pause
