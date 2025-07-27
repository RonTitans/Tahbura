@echo off
chcp 65001 >nul
echo בדיקת חיבור למערכת Supabase...
echo Testing Supabase Connection...
echo.

REM Navigate to project root
cd /d "%~dp0.."

echo 🔍 Testing frontend environment variables...
cd frontend
if not exist .env (
    echo ❌ Frontend .env file not found
    pause
    exit /b 1
)

echo ✅ Frontend .env file exists
echo.

echo 🔍 Testing backend environment variables...
cd ..\backend
if not exist .env (
    echo ❌ Backend .env file not found
    pause
    exit /b 1
)

echo ✅ Backend .env file exists
echo.

echo 🔍 Checking if SERVICE_ROLE_KEY needs to be added...
findstr "YOUR_SERVICE_ROLE_KEY_HERE" .env >nul
if %errorlevel%==0 (
    echo ⚠️ WARNING: You need to add your SERVICE_ROLE_KEY to backend\.env
    echo Please go to your Supabase project dashboard:
    echo https://supabase.com/dashboard/project/yqairdihpyxcvsafmxsc/settings/api
    echo Copy the "service_role" key and replace YOUR_SERVICE_ROLE_KEY_HERE in backend\.env
    echo.
    pause
    exit /b 1
)

echo 🔧 Testing Node.js connection to Supabase...
node -e "
try {
  require('dotenv').config();
  const { createClient } = require('@supabase/supabase-js');
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing environment variables');
    process.exit(1);
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('✅ Supabase client created successfully');
  console.log('📡 Project URL:', supabaseUrl);
  console.log('🔑 Using anon key (first 20 chars):', supabaseKey.substring(0, 20) + '...');
  
} catch (error) {
  console.log('❌ Error:', error.message);
  process.exit(1);
}
"

if errorlevel 1 (
    echo.
    echo ❌ Connection test failed
    echo Please check your Supabase credentials
    pause
    exit /b 1
)

echo.
echo 🎉 Connection test passed!
echo.
echo Next steps:
echo 1. Add your SERVICE_ROLE_KEY to backend\.env (if not done yet)
echo 2. Run: scripts\setup-database.bat
echo 3. Run: scripts\start-dev.bat
echo.
pause