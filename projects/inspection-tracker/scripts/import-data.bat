@echo off
chcp 65001 >nul
echo יבוא נתוני אקסל למערכת בדיקות עברית...
echo Importing Excel data to Hebrew Inspection System...
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

REM Check if backend is set up
if not exist "backend\node_modules" (
    echo ❌ Backend dependencies not installed
    echo Please run scripts\setup-project.bat first
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist "backend\.env" (
    echo ❌ Backend .env file not found
    echo Please run scripts\setup-project.bat and configure your Supabase credentials
    pause
    exit /b 1
)

REM Get Excel file path from command line argument or ask user
set "EXCEL_FILE=%~1"
if "%EXCEL_FILE%"=="" (
    echo.
    echo Please provide the path to your Excel file:
    echo Example: "קובץ בדיקות כולל לקריית התקשוב גרסא מלאה 150725.xlsx"
    echo.
    set /p EXCEL_FILE="Excel file path: "
)

if "%EXCEL_FILE%"=="" (
    echo ❌ No Excel file specified
    pause
    exit /b 1
)

REM Check if Excel file exists
if not exist "%EXCEL_FILE%" (
    echo ❌ Excel file not found: %EXCEL_FILE%
    echo Please check the file path and try again
    pause
    exit /b 1
)

echo ✅ Excel file found: %EXCEL_FILE%
echo.

REM Test database connection first
echo 🔍 Testing database connection...
cd backend
node -e "
const { testConnection } = require('./src/config/supabase.js');
testConnection().then(success => {
  if (!success) {
    console.error('❌ Database connection failed');
    process.exit(1);
  }
  console.log('✅ Database connection successful');
}).catch(err => {
  console.error('❌ Database connection error:', err.message);
  process.exit(1);
});
"

if errorlevel 1 (
    echo.
    echo ❌ Database connection failed
    echo Please check your Supabase credentials in backend\.env
    pause
    exit /b 1
)

echo.
echo 🗄️ Setting up database schema (if needed)...
node src/scripts/setup-database.js
if errorlevel 1 (
    echo ❌ Database setup failed
    pause
    exit /b 1
)

echo.
echo 📥 Starting Excel data import...
echo File: %EXCEL_FILE%
echo.

REM Run the Excel import script
node src/scripts/import-excel.js "%EXCEL_FILE%"

if errorlevel 1 (
    echo.
    echo ❌ Excel import failed
    echo Please check:
    echo 1. Excel file format and content
    echo 2. Database connection and permissions
    echo 3. File encoding (should be UTF-8 compatible)
    pause
    exit /b 1
)

echo.
echo 🎉 Excel import completed successfully!
echo.
echo The following data has been imported:
echo - Buildings (בניינים)
echo - Inspection Types (סוגי בדיקות)
echo.
echo You can now:
echo 1. Start the development servers: scripts\start-dev.bat
echo 2. Access the web interface at http://localhost:5173
echo 3. View the imported data in the dashboard
echo.

REM Ask if user wants to start the development servers
echo.
set /p START_DEV="Start development servers now? (y/n): "
if /i "%START_DEV%"=="y" (
    echo.
    echo 🚀 Starting development servers...
    cd ..
    call scripts\start-dev.bat
) else (
    echo.
    echo To start development servers later, run: scripts\start-dev.bat
    echo.
    pause
)