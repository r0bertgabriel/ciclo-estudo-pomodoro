@echo off
REM 🍅 Launcher do Pomodoro Boladão para Windows
REM Usa o launcher.py para iniciar a aplicação com interface gráfica

echo.
echo ================================================================================
echo 🍅 POMODORO BOLADAO - LAUNCHER WINDOWS
echo ================================================================================
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python nao encontrado!
    echo.
    echo Por favor, instale o Python 3.8 ou superior:
    echo https://www.python.org/downloads/
    echo.
    echo IMPORTANTE: Durante a instalacao, marque a opcao "Add Python to PATH"
    echo.
    pause
    exit /b 1
)

REM Verificar se tkinter está disponível (para GUI)
python -c "import tkinter" >nul 2>&1
if errorlevel 1 (
    echo ⚠️  tkinter nao encontrado (necessario para interface grafica)
    echo.
    echo Iniciando em modo console...
    echo.
    python launcher.py --console
) else (
    REM Iniciar com interface gráfica
    python launcher.py
)

echo.
echo Pressione qualquer tecla para sair...
pause >nul
