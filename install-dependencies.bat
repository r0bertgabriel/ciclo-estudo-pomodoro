@echo off
echo ========================================
echo Instalando dependencias do Pomodoro...
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Verificando pip...
python -m pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] pip nao encontrado, tentando instalar...
    python -m ensurepip --default-pip
)

echo [OK] pip esta disponivel
echo.

echo [2/3] Atualizando pip...
python -m pip install --upgrade pip --quiet
echo [OK] pip atualizado
echo.

echo [3/3] Instalando dependencias do backend...
if exist "backend\requirements.txt" (
    python -m pip install -r backend\requirements.txt --quiet
    if %errorlevel% equ 0 (
        echo [OK] Dependencias do backend instaladas com sucesso!
    ) else (
        echo [AVISO] Houve problemas ao instalar algumas dependencias.
        echo O aplicativo pode nao funcionar corretamente.
    )
) else (
    echo [AVISO] Arquivo backend\requirements.txt nao encontrado
)

echo.
echo ========================================
echo Instalacao de dependencias concluida!
echo ========================================
echo.
exit /b 0
