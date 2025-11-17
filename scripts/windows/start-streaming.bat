@echo off
REM Script Windows para iniciar Pomodoro em modo streaming
REM Chama o script Python multiplataforma

echo.
echo ========================================
echo  Pomodoro Boladao - Modo Streaming
echo ========================================
echo.

REM Verificar se Python esta instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo Erro: Python nao encontrado!
    echo Instale Python 3.8+ em: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Executar script Python
python "%~dp0start-streaming.py"

pause
