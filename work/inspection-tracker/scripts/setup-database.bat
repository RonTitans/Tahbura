@echo off
chcp 65001 >nul
echo הגדרת בסיס נתונים למערכת בדיקות עברית...
echo Setting up database for Hebrew Inspection System...
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

echo ✅ Prerequisites checked
echo.

echo 🔍 Testing database connection...
cd backend

REM Test connection first
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
    echo.
    echo Please check your Supabase credentials in backend\.env:
    echo - SUPABASE_URL should be your project URL
    echo - SUPABASE_SERVICE_ROLE_KEY should be your service role key
    echo - SUPABASE_ANON_KEY should be your anon/public key
    echo.
    echo You can find these values in your Supabase project dashboard:
    echo https://supabase.com/dashboard/project/[your-project]/settings/api
    echo.
    pause
    exit /b 1
)

echo.
echo 🗄️ Setting up database schema and tables...
echo This will create:
echo - Users table (משתמשים)
echo - Buildings table (בניינים)  
echo - Inspection Types table (סוגי בדיקות)
echo - Inspections table (בדיקות)
echo - System Settings table (הגדרות מערכת)
echo.

REM Run database setup
node src/scripts/setup-database.js

if errorlevel 1 (
    echo.
    echo ❌ Database setup failed
    echo.
    echo Common issues:
    echo 1. Insufficient database permissions
    echo 2. Network connectivity issues
    echo 3. Invalid Supabase credentials
    echo 4. Database already exists with conflicting schema
    echo.
    echo Please check the error messages above and try again.
    pause
    exit /b 1
)

echo.
echo 🎉 Database setup completed successfully!
echo.
echo Your Hebrew Inspection Tracking System database is now ready with:
echo ✅ All required tables created
echo ✅ Hebrew language support configured
echo ✅ Row Level Security policies applied
echo ✅ Initial system settings configured
echo.
echo Next steps:
echo 1. Import Excel data: scripts\import-data.bat [excel-file-path]
echo 2. Start development servers: scripts\start-dev.bat
echo 3. Access the application at http://localhost:5173
echo.

REM Ask if user wants to import Excel data now
echo.
set /p IMPORT_DATA="Import Excel inspection data now? (y/n): "
if /i "%IMPORT_DATA%"=="y" (
    echo.
    echo Please provide the path to your Excel file:
    set /p EXCEL_FILE="Excel file path: "
    if not "%EXCEL_FILE%"=="" (
        cd ..
        call scripts\import-data.bat "%EXCEL_FILE%"
    )
) else (
    echo.
    echo To import Excel data later, run: scripts\import-data.bat [excel-file-path]
    echo.
    pause
)