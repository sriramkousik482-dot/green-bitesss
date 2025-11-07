@echo off
echo ========================================
echo Green Bites - Installation Checker
echo ========================================
echo.

echo Checking if Node.js is installed...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is NOT installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js is installed
    node --version
)
echo.

echo Checking if npm is installed...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is NOT installed!
    pause
    exit /b 1
) else (
    echo ✅ npm is installed
    npm --version
)
echo.

echo Checking project structure...
if exist "package.json" (
    echo ✅ package.json found
) else (
    echo ❌ package.json NOT found!
    echo Make sure you're in the greenbites directory
    pause
    exit /b 1
)

if exist "src" (
    echo ✅ src folder found
) else (
    echo ❌ src folder NOT found!
    pause
    exit /b 1
)

if exist "public" (
    echo ✅ public folder found
) else (
    echo ❌ public folder NOT found!
    pause
    exit /b 1
)
echo.

echo Checking for logo...
if exist "public\logo.jpg" (
    echo ✅ Logo found at public\logo.jpg
    echo.
    echo ========================================
    echo All checks passed! Ready to run!
    echo ========================================
    echo.
    echo To start the application, run:
    echo   start-dev.bat
    echo OR
    echo   npm run dev
) else (
    echo ⚠️  WARNING: logo.jpg NOT found in public folder!
    echo.
    echo Please add your Green Bites logo:
    echo 1. Save the logo image as 'logo.jpg'
    echo 2. Place it in the 'public' folder
    echo 3. Run this check again
)

echo.
echo Checking node_modules...
if exist "node_modules" (
    echo ✅ Dependencies are installed
    echo.
    echo ========================================
    echo Everything is ready!
    echo ========================================
) else (
    echo ⚠️  node_modules not found
    echo Running npm install...
    call npm install
    echo.
    echo ✅ Dependencies installed!
)

echo.
echo ========================================
echo Installation Check Complete!
echo ========================================
echo.
pause
