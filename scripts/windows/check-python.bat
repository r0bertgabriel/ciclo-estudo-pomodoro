@echo off
echo ========================================
echo Verificando instalacao do Python...
echo ========================================
echo.

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Python nao encontrado!
    echo.
    echo Por favor, instale o Python 3.8 ou superior:
    echo https://www.python.org/downloads/
    echo.
    echo Certifique-se de marcar a opcao:
    echo [X] Add Python to PATH
    echo.
    pause
    exit /b 1
)

echo [OK] Python detectado com sucesso!
python --version

echo.
echo ========================================
echo Verificando versao do Python...
echo ========================================

python -c "import sys; exit(0 if sys.version_info >= (3, 8) else 1)" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Versao do Python incompativel!
    echo.
    echo Este aplicativo requer Python 3.8 ou superior.
    echo Por favor, atualize o Python.
    echo.
    pause
    exit /b 1
)

echo [OK] Versao do Python compativel!
echo.
exit /b 0
