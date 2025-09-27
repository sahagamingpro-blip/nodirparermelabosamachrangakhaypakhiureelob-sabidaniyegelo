@echo off
:: YONO Game Deployment Script for Windows
:: This script helps with deploying the application to production

echo 🚀 Starting YONO Game Deployment Process

:: Check if we're in the right directory
if not exist "package.json" (
  echo ❌ Error: package.json not found. Please run this script from the project root directory.
  pause
  exit /b 1
)

echo ✅ Project directory verified

:: Check Node.js version
node --version
echo 🔧 Node.js version displayed above

:: Install dependencies
echo 📦 Installing dependencies...
npm ci
if %errorlevel% neq 0 (
  echo ❌ Error: Failed to install dependencies
  pause
  exit /b 1
)
echo ✅ Dependencies installed successfully

:: Run type checking
echo 🔍 Running type checking...
npm run check
if %errorlevel% neq 0 (
  echo ❌ Error: Type checking failed
  pause
  exit /b 1
)
echo ✅ Type checking passed

:: Build the application
echo 🏗️  Building the application...
npm run build
if %errorlevel% neq 0 (
  echo ❌ Error: Build failed
  pause
  exit /b 1
)
echo ✅ Application built successfully

:: Check if dist directory exists
if not exist "dist" (
  echo ❌ Error: dist directory not found after build
  pause
  exit /b 1
)

echo ✅ Build artifacts verified

:: Display deployment instructions
echo.
echo ✅ Deployment preparation completed successfully!
echo.
echo Next steps:
echo 1. Set your production environment variables
echo 2. Configure your database
echo 3. Deploy using your preferred method:
echo    - Vercel: Push to GitHub and connect to Vercel
echo    - Docker: Run 'docker build -t yono-game .'
echo    - Direct: Run 'npm start' to start the server
echo.
echo For detailed deployment instructions, see DEPLOYMENT_GUIDE.md and PRODUCTION_ENVIRONMENT_GUIDE.md
echo.
pause