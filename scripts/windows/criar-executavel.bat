@echo off
REM ============================================
REM Script para criar executável do Pomodoro
REM ============================================

title Criando Executavel Pomodoro...

echo.
echo ╔════════════════════════════════════════════╗
echo ║   CRIAR EXECUTÁVEL - POMODORO BOLADÃO      ║
echo ╚════════════════════════════════════════════╝
echo.

REM Verificar se PyInstaller está instalado
python -c "import PyInstaller" 2>nul
if errorlevel 1 (
    echo 📦 PyInstaller não encontrado. Instalando...
    pip install pyinstaller
    echo.
)

echo ✅ PyInstaller instalado!
echo.

REM Limpar builds anteriores
if exist "build" (
    echo 🧹 Limpando builds anteriores...
    rmdir /s /q build
)
if exist "dist" (
    rmdir /s /q dist
)
if exist "Pomodoro.spec" (
    del Pomodoro.spec
)

echo.
echo ════════════════════════════════════════════
echo 🔨 CRIANDO EXECUTÁVEL...
echo ════════════════════════════════════════════
echo.
echo Opções:
echo   --onefile      : Arquivo único
echo   --windowed     : Sem console
echo   --name         : Nome do executável
echo.

REM Criar executável
pyinstaller --onefile --windowed --name="Pomodoro" launcher.py

echo.
if exist "dist\Pomodoro.exe" (
    echo ════════════════════════════════════════════
    echo ✅ EXECUTÁVEL CRIADO COM SUCESSO!
    echo ════════════════════════════════════════════
    echo.
    echo 📁 Localização: dist\Pomodoro.exe
    echo 📏 Tamanho: 
    dir "dist\Pomodoro.exe" | findstr Pomodoro.exe
    echo.
    echo 💡 Para usar:
    echo    1. Copie Pomodoro.exe para a pasta do projeto
    echo    2. Duplo clique para executar
    echo.
    echo 🚀 Abrindo pasta...
    explorer dist
) else (
    echo ════════════════════════════════════════════
    echo ❌ ERRO AO CRIAR EXECUTÁVEL
    echo ════════════════════════════════════════════
    echo.
    echo Verifique os logs acima para mais detalhes.
)

echo.
pause
