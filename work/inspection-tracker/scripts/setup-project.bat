@echo off
chcp 65001 >nul
echo הגדרת מערכת מעקב בדיקות עברית...
echo Setting up Hebrew Inspection Tracking System...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Navigate to project root
cd /d "%~dp0.."

echo.
echo 📦 Installing backend dependencies...
cd backend
if not exist package.json (
    echo ❌ Backend package.json not found
    pause
    exit /b 1
)

npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo ✅ Backend dependencies installed

echo.
echo 📦 Installing frontend dependencies...
cd ..\frontend
if not exist package.json (
    echo ❌ Frontend package.json not found
    pause
    exit /b 1
)

npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

echo ✅ Frontend dependencies installed

echo.
echo 🔧 Setting up environment files...
cd ..\backend

REM Create .env file if it doesn't exist
if not exist .env (
    if exist .env.example (
        copy .env.example .env >nul
        echo ✅ Created backend .env file from example
        echo ⚠️ Please edit backend\.env and add your Supabase credentials
    ) else (
        echo # Hebrew Inspection Tracker Backend Environment > .env
        echo # מערכת מעקב בדיקות עברית - משתני סביבה >> .env
        echo. >> .env
        echo # Supabase Configuration >> .env
        echo SUPABASE_URL=your_supabase_project_url >> .env
        echo SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key >> .env
        echo SUPABASE_ANON_KEY=your_supabase_anon_key >> .env
        echo. >> .env
        echo # Server Configuration >> .env
        echo PORT=3001 >> .env
        echo NODE_ENV=development >> .env
        echo. >> .env
        echo # File Upload Configuration >> .env
        echo MAX_FILE_SIZE=10485760 >> .env
        echo UPLOAD_FOLDER=uploads >> .env
        
        echo ✅ Created backend .env file with template
        echo ⚠️ Please edit backend\.env and add your Supabase credentials
    )
) else (
    echo ✅ Backend .env file already exists
)

echo.
echo 🔧 Setting up frontend environment...
cd ..\frontend

if not exist .env (
    echo # Hebrew Inspection Tracker Frontend Environment > .env
    echo # מערכת מעקב בדיקות עברית - משתני סביבה Frontend >> .env
    echo. >> .env
    echo # Supabase Configuration >> .env
    echo VITE_SUPABASE_URL=your_supabase_project_url >> .env
    echo VITE_SUPABASE_ANON_KEY=your_supabase_anon_key >> .env
    echo. >> .env
    echo # App Configuration >> .env
    echo VITE_APP_NAME="מערכת מעקב בדיקות הנדסיות" >> .env
    echo VITE_COMPANY_NAME="קריית התקשוב" >> .env
    echo VITE_API_URL=http://localhost:3001 >> .env
    
    echo ✅ Created frontend .env file with template
    echo ⚠️ Please edit frontend\.env and add your Supabase credentials
) else (
    echo ✅ Frontend .env file already exists
)

echo.
echo 📋 Creating project documentation...
cd ..

if not exist README.md (
    echo # מערכת מעקב בדיקות הנדסיות - קריית התקשוב > README.md
    echo Hebrew Construction Site Inspection Tracking System >> README.md
    echo. >> README.md
    echo ## Quick Start >> README.md
    echo. >> README.md
    echo 1. Configure your Supabase credentials in backend/.env and frontend/.env >> README.md
    echo 2. Run `scripts\start-dev.bat` to start the development servers >> README.md
    echo 3. Run `scripts\import-data.bat` to import Excel inspection data >> README.md
    echo. >> README.md
    echo ## Project Structure >> README.md
    echo. >> README.md
    echo - `/frontend` - React TypeScript application with Hebrew RTL support >> README.md
    echo - `/backend` - Node.js API server with Supabase integration >> README.md
    echo - `/database` - SQL schema and seed data >> README.md
    echo - `/scripts` - Development and deployment scripts >> README.md
    echo. >> README.md
    echo ## Features >> README.md
    echo. >> README.md
    echo - 📱 Mobile PWA for field technicians >> README.md
    echo - 🏢 Desktop dashboard for project managers >> README.md
    echo - 🇮🇱 Full Hebrew language support with RTL layout >> README.md
    echo - 📊 Excel import/export of inspection data >> README.md
    echo - 📸 Photo capture and attachment >> README.md
    echo - 🔐 Role-based access control >> README.md
    
    echo ✅ Created README.md
) else (
    echo ✅ README.md already exists
)

echo.
echo 🎉 Project setup completed successfully!
echo.
echo Next steps:
echo 1. Edit backend\.env and frontend\.env with your Supabase credentials
echo 2. Run scripts\setup-database.bat to initialize the database
echo 3. Run scripts\start-dev.bat to start development servers
echo 4. Visit http://localhost:5173 to access the application
echo.
echo For Excel data import, use: scripts\import-data.bat [path-to-excel-file]
echo.
pause