@echo off
chcp 65001 >nul
echo מתחיל את מערכת מעקב הבדיקות העברית...
echo Starting Hebrew Inspection Tracking System...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Navigate to project root
cd /d "%~dp0.."

REM Check if backend dependencies are installed
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
    cd ..
)

REM Check if frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
    cd ..
)

REM Check if .env file exists in backend
if not exist "backend\.env" (
    echo ⚠️ Backend .env file not found
    echo Please copy backend\.env.example to backend\.env and configure your Supabase settings
    pause
    exit /b 1
)

echo ✅ All dependencies installed
echo.
echo 🚀 Starting development servers...
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3001
echo.

REM Start both servers in parallel
start "Frontend Dev Server" cmd /c "cd frontend && npm run dev"
start "Backend API Server" cmd /c "cd backend && npm run dev"

echo 🎉 Development servers started!
echo Press any key to stop all servers...
pause >nul

REM Kill all node processes (this will stop both servers)
taskkill /f /im node.exe >nul 2>&1
echo 🛑 Development servers stopped