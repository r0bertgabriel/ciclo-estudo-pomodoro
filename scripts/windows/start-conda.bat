@echo off
REM ============================================
REM 🍅 Pomodoro Boladão - Inicialização Anaconda
REM Script otimizado para rodar em UMA janela
REM ============================================

title Pomodoro Boladao - Carregando...

echo.
echo ╔════════════════════════════════════════════╗
echo ║    🍅 POMODORO BOLADÃO - ANACONDA 🍅        ║
echo ╚════════════════════════════════════════════╝
echo.

REM Detectar caminho do Anaconda/Miniconda
set "CONDA_PATH="
if exist "%USERPROFILE%\anaconda3\Scripts\activate.bat" (
    set "CONDA_PATH=%USERPROFILE%\anaconda3"
) else if exist "%USERPROFILE%\miniconda3\Scripts\activate.bat" (
    set "CONDA_PATH=%USERPROFILE%\miniconda3"
) else if exist "C:\ProgramData\Anaconda3\Scripts\activate.bat" (
    set "CONDA_PATH=C:\ProgramData\Anaconda3"
) else if exist "C:\ProgramData\Miniconda3\Scripts\activate.bat" (
    set "CONDA_PATH=C:\ProgramData\Miniconda3"
)

if "%CONDA_PATH%"=="" (
    echo ❌ Anaconda/Miniconda não encontrado!
    echo.
    echo Por favor, edite este arquivo e defina o caminho manualmente:
    echo set "CONDA_PATH=C:\caminho\para\seu\anaconda3"
    echo.
    pause
    exit /b 1
)

echo ✅ Anaconda encontrado em: %CONDA_PATH%
echo.

REM Inicializar Conda
call "%CONDA_PATH%\Scripts\activate.bat" "%CONDA_PATH%"

REM Ativar ambiente default
echo 🔄 Ativando ambiente 'default'...
call conda activate default
if errorlevel 1 (
    echo ⚠️  Ambiente 'default' não encontrado, usando base
    call conda activate base
)

echo ✅ Ambiente ativado!
echo.

REM Verificar dependências
echo 🔍 Verificando dependências...
python -c "import fastapi, uvicorn" 2>nul
if errorlevel 1 (
    echo 📦 Instalando dependências...
    pip install -r backend\requirements.txt
)

echo.
echo ════════════════════════════════════════════
echo 🚀 INICIANDO APLICAÇÃO...
echo ════════════════════════════════════════════
echo.

REM Criar diretório de logs
if not exist logs mkdir logs

REM Mudar título da janela
title Pomodoro Boladao - Executando

REM Iniciar backend em background (mesma janela)
echo [%TIME%] ▶️  Iniciando Backend (porta 8000)...
start /B python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 > logs\backend.log 2>&1

REM Aguardar backend iniciar
timeout /t 3 /nobreak >nul

REM Iniciar frontend em background (mesma janela)
echo [%TIME%] ▶️  Iniciando Frontend (porta 8080)...
start /B python -m http.server 8080 > logs\frontend.log 2>&1

REM Aguardar frontend iniciar
timeout /t 2 /nobreak >nul

echo.
echo ════════════════════════════════════════════
echo ✅ APLICAÇÃO INICIADA COM SUCESSO!
echo ════════════════════════════════════════════
echo.
echo 📱 Acesse no navegador:
echo    └─ Timer:  http://localhost:8080/index.html
echo    └─ Ciclos: http://localhost:8080/ciclos.html
echo.
echo 🔧 API Backend:
echo    └─ Docs: http://localhost:8000/docs
echo.
echo 📋 Logs salvos em: .\logs\
echo.
echo ════════════════════════════════════════════
echo.
echo 💡 INSTRUÇÕES:
echo    • Mantenha esta janela ABERTA
echo    • Para parar: Feche esta janela ou pressione Ctrl+C
echo.
echo ⏳ Aguardando... (aplicação está rodando)
echo.

REM Abrir navegador automaticamente
timeout /t 2 /nobreak >nul
start http://localhost:8080/index.html

REM Manter janela aberta e aguardar
echo ════════════════════════════════════════════
echo Pressione qualquer tecla para PARAR a aplicação
echo ════════════════════════════════════════════
pause >nul

REM Parar processos
echo.
echo 🛑 Parando aplicação...
taskkill /F /FI "WINDOWTITLE eq Pomodoro*" >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do taskkill /F /PID %%a >nul 2>&1

echo ✅ Aplicação parada!
timeout /t 2 /nobreak >nul
