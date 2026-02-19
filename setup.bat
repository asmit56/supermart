@echo off
REM SuperMart Setup Script for Windows

echo 🚀 Starting SuperMart Setup...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

echo.
echo ✅ Installation complete!
echo.
echo 📝 Setting up environment variables...
echo    - Edit .env.local file and update MONGODB_URI if needed
echo    - Make sure MongoDB is running
echo.

echo 🌐 Starting development server...
echo    - The app will be available at http://localhost:3000
echo.

echo 📄 To initialize demo data:
echo    1. Wait for the dev server to start (message will say 'ready')
echo    2. Open a new terminal and run:
echo       curl http://localhost:3000/api/init
echo    3. Then login with demo credentials:
echo       📧 Seller: seller@demo.com / demo123
echo       📧 Buyer: buyer@demo.com / demo123
echo.

call npm run dev
