@echo off
SETLOCAL

echo 🔧 StudySnap Environment Setup Script
echo ====================================

REM Check if we're in the right directory
if not exist "server\server.js" (
    echo ❌ Error: Please run this script from the StudySnap root directory
    echo    Current directory: %CD%
    pause
    exit /b 1
)

echo ✅ Found StudySnap project structure

REM Create server .env file if it doesn't exist
if not exist "server\.env" (
    echo 📝 Creating server\.env file...
    (
        echo # Development Environment Variables
        echo NODE_ENV=development
        echo PORT=3001
        echo.
        echo # OpenAI Configuration
        echo OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
        echo.
        echo # CORS Configuration
        echo CORS_ORIGIN=http://localhost:5173
        echo.
        echo # File Upload Configuration
        echo MAX_FILE_SIZE=10485760
        echo ALLOWED_FILE_TYPES=pdf,txt,png,jpg,jpeg
        echo.
        echo # Logging
        echo LOG_LEVEL=debug
    ) > server\.env
    echo ✅ Created server\.env file
) else (
    echo ✅ server\.env file already exists
)

REM Install server dependencies
echo 📦 Installing server dependencies...
cd server
npm install
cd ..

echo.
echo 🎉 Environment setup complete!
echo.
echo 📋 Next steps:
echo 1. For local development:
echo    npm run dev
echo.
echo 2. For deployment:
echo    - Set environment variables in your deployment platform
echo    - Required: OPENAI_API_KEY, NODE_ENV=production
echo    - Optional: CORS_ORIGIN, PORT
echo.
echo 3. Test the setup:
echo    curl http://localhost:3001/health
echo.
echo 📖 See DEPLOYMENT_ENV_GUIDE.md for detailed deployment instructions
pause
ENDLOCAL
