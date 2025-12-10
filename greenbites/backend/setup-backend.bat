@echo off
echo ========================================
echo GreenBites Backend Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] Node.js found: 
node --version
echo.

REM Check if npm is installed
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

echo [2/5] npm found:
npm --version
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found!
    echo Please run this script from the backend folder.
    pause
    exit /b 1
)

echo [3/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo [4/5] Creating .env file...
    copy .env.example .env >nul 2>&1
    echo .env file created! Please update it with your configuration.
    echo.
) else (
    echo [4/5] .env file already exists.
    echo.
)

echo [5/5] Checking MongoDB...
echo.
echo IMPORTANT: Make sure MongoDB is running!
echo.
echo Option 1: Local MongoDB
echo   - Install from: https://www.mongodb.com/try/download/community
echo   - Start with: mongod
echo.
echo Option 2: MongoDB Atlas (Cloud)
echo   - Sign up at: https://www.mongodb.com/cloud/atlas
echo   - Update MONGODB_URI in .env file
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Update .env file with your configuration
echo 2. Make sure MongoDB is running
echo 3. Run: npm run dev
echo.
echo The server will start on http://localhost:5000
echo.
pause
