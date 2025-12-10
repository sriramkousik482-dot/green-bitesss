@echo off
echo Starting GreenBites Backend Server...
echo.

REM Check if .env exists
if not exist ".env" (
    echo [WARNING] .env file not found!
    echo Creating from .env.example...
    copy .env.example .env >nul 2>&1
    echo.
    echo Please update .env with your configuration and run this script again.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo [INFO] Dependencies not installed. Installing now...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
    echo.
)

echo.
echo ========================================
echo Server starting on http://localhost:5000
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start the server with nodemon (if available) or node
where nodemon >nul 2>&1
if %errorlevel% equ 0 (
    nodemon server.js
) else (
    node server.js
)
