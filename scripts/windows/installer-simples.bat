@echo off
chcp 65001 >nul
title Instalador Simples - Pomodoro Boladão

echo.
echo ═══════════════════════════════════════════════════════════════════
echo         🍅 INSTALADOR DO POMODORO BOLADÃO 🍅
echo ═══════════════════════════════════════════════════════════════════
echo.
echo   Sistema de gerenciamento de tempo com Técnica Pomodoro
echo   Desenvolvido por: Robert Gabriel
echo   GitHub: https://github.com/r0bertgabriel/ciclo-estudo-pomodoro
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
pause

:: Verificar privilégios de administrador
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [AVISO] Este script precisa de privilégios de administrador.
    echo Por favor, execute como administrador.
    echo.
    pause
    exit /b 1
)

:: Etapa 1: Verificar Python
echo.
echo ═══════════════════════════════════════════════════════════════════
echo [ETAPA 1/4] Verificando Python...
echo ═══════════════════════════════════════════════════════════════════
echo.

python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Python não encontrado!
    echo.
    echo O Pomodoro Boladão requer Python 3.8 ou superior.
    echo.
    echo Por favor, instale o Python:
    echo 1. Acesse: https://www.python.org/downloads/
    echo 2. Baixe Python 3.8 ou superior
    echo 3. Durante a instalação, marque: [X] Add Python to PATH
    echo 4. Execute este instalador novamente
    echo.
    pause
    exit /b 1
)

echo [OK] Python detectado:
python --version
echo.

:: Verificar versão do Python
python -c "import sys; exit(0 if sys.version_info >= (3, 8) else 1)" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Versão do Python incompatível!
    echo.
    echo Este aplicativo requer Python 3.8 ou superior.
    echo Por favor, atualize o Python.
    echo.
    pause
    exit /b 1
)

echo [OK] Versão do Python compatível!
echo.
pause

:: Etapa 2: Definir diretório de instalação
echo.
echo ═══════════════════════════════════════════════════════════════════
echo [ETAPA 2/4] Definindo diretório de instalação...
echo ═══════════════════════════════════════════════════════════════════
echo.

set "INSTALL_DIR=%ProgramFiles%\Pomodoro Boladao"
echo Diretório de instalação: %INSTALL_DIR%
echo.
echo Pressione ENTER para aceitar ou digite um caminho personalizado:
set /p "CUSTOM_DIR="

if not "%CUSTOM_DIR%"=="" (
    set "INSTALL_DIR=%CUSTOM_DIR%"
)

echo.
echo [OK] Instalando em: %INSTALL_DIR%
echo.
pause

:: Etapa 3: Copiar arquivos
echo.
echo ═══════════════════════════════════════════════════════════════════
echo [ETAPA 3/4] Copiando arquivos...
echo ═══════════════════════════════════════════════════════════════════
echo.

if exist "%INSTALL_DIR%" (
    echo [AVISO] Diretório já existe. Será sobrescrito.
    rmdir /s /q "%INSTALL_DIR%" 2>nul
)

mkdir "%INSTALL_DIR%" 2>nul

echo Copiando arquivos do projeto...
xcopy /E /I /Y /Q "%~dp0*" "%INSTALL_DIR%" >nul 2>&1

if %errorlevel% neq 0 (
    echo [ERRO] Falha ao copiar arquivos!
    pause
    exit /b 1
)

echo [OK] Arquivos copiados com sucesso!
echo.
pause

:: Etapa 4: Instalar dependências
echo.
echo ═══════════════════════════════════════════════════════════════════
echo [ETAPA 4/4] Instalando dependências Python...
echo ═══════════════════════════════════════════════════════════════════
echo.

cd /d "%INSTALL_DIR%"

echo Atualizando pip...
python -m pip install --upgrade pip --quiet

echo Instalando dependências do backend...
if exist "backend\requirements.txt" (
    python -m pip install -r backend\requirements.txt --quiet
    if %errorlevel% equ 0 (
        echo [OK] Dependências instaladas com sucesso!
    ) else (
        echo [AVISO] Houve problemas ao instalar algumas dependências.
    )
) else (
    echo [AVISO] Arquivo backend\requirements.txt não encontrado
)

echo.
pause

:: Criar atalhos
echo.
echo ═══════════════════════════════════════════════════════════════════
echo Criando atalhos...
echo ═══════════════════════════════════════════════════════════════════
echo.

:: Criar script VBS para criar atalho
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut.vbs"
echo sLinkFile = "%USERPROFILE%\Desktop\Pomodoro Boladao.lnk" >> "%TEMP%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut.vbs"
echo oLink.TargetPath = "pythonw.exe" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Arguments = """%INSTALL_DIR%\launcher.py""" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%INSTALL_DIR%" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Description = "Pomodoro Boladao - Timer de Estudo" >> "%TEMP%\CreateShortcut.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut.vbs"

cscript //nologo "%TEMP%\CreateShortcut.vbs"
del "%TEMP%\CreateShortcut.vbs"

if exist "%USERPROFILE%\Desktop\Pomodoro Boladao.lnk" (
    echo [OK] Atalho criado na Área de Trabalho!
) else (
    echo [AVISO] Não foi possível criar atalho.
)

echo.

:: Criar atalho no Menu Iniciar
set "START_MENU=%ProgramData%\Microsoft\Windows\Start Menu\Programs"
if not exist "%START_MENU%\Pomodoro Boladao" mkdir "%START_MENU%\Pomodoro Boladao"

echo Set oWS = WScript.CreateObject("WScript.Shell") > "%TEMP%\CreateShortcut2.vbs"
echo sLinkFile = "%START_MENU%\Pomodoro Boladao\Pomodoro Boladao.lnk" >> "%TEMP%\CreateShortcut2.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%TEMP%\CreateShortcut2.vbs"
echo oLink.TargetPath = "pythonw.exe" >> "%TEMP%\CreateShortcut2.vbs"
echo oLink.Arguments = """%INSTALL_DIR%\launcher.py""" >> "%TEMP%\CreateShortcut2.vbs"
echo oLink.WorkingDirectory = "%INSTALL_DIR%" >> "%TEMP%\CreateShortcut2.vbs"
echo oLink.Description = "Pomodoro Boladao - Timer de Estudo" >> "%TEMP%\CreateShortcut2.vbs"
echo oLink.Save >> "%TEMP%\CreateShortcut2.vbs"

cscript //nologo "%TEMP%\CreateShortcut2.vbs"
del "%TEMP%\CreateShortcut2.vbs"

if exist "%START_MENU%\Pomodoro Boladao\Pomodoro Boladao.lnk" (
    echo [OK] Atalho criado no Menu Iniciar!
)

:: Finalização
echo.
echo ═══════════════════════════════════════════════════════════════════
echo         ✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO! ✅
echo ═══════════════════════════════════════════════════════════════════
echo.
echo   🍅 O Pomodoro Boladão foi instalado com sucesso!
echo.
echo   📁 Local de instalação: %INSTALL_DIR%
echo   🔗 Atalhos criados:
echo      - Área de Trabalho
echo      - Menu Iniciar
echo.
echo   🚀 Para iniciar:
echo      1. Use o atalho da Área de Trabalho
echo      2. Ou busque "Pomodoro" no Menu Iniciar
echo      3. Clique em "▶ Iniciar Pomodoro"
echo.
echo   📚 Documentação disponível em:
echo      %INSTALL_DIR%\README.md
echo.
echo   👨‍💻 Desenvolvido por: Robert Gabriel
echo   🌐 GitHub: https://github.com/r0bertgabriel
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.

choice /C SN /M "Deseja iniciar o Pomodoro Boladao agora?"
if %errorlevel% equ 1 (
    echo.
    echo Iniciando Pomodoro Boladão...
    start "" pythonw.exe "%INSTALL_DIR%\launcher.py"
)

echo.
echo Obrigado por instalar o Pomodoro Boladão! 🍅
echo.
pause
exit /b 0
