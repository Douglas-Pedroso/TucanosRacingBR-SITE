@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 Iniciando Tucanos Racing Bot...
echo ========================================
echo.

REM Verifica se Node.js está instalado
node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js não está instalado!
    echo Baixe em: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo.

REM Inicia o bot
node bot.js

if errorlevel 1 (
    echo.
    echo ❌ Erro ao iniciar o bot. Verifique o arquivo .env
    pause
)
