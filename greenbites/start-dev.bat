@echo off
echo Starting Green Bites Development Server...
echo.
echo Make sure you have added logo.jpg to the public folder!
echo.
cd /d "%~dp0"
call npm run dev
pause
