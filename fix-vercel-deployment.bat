@echo off
SETLOCAL

echo 🚀 StudySnap Vercel Deployment Fix
echo ==================================

REM Check if we're in the right directory
if not exist "client" (
    echo ❌ Error: 'client' directory not found!
    echo This script should be run from the root of your StudySnap project.
    echo Current directory: %CD%
    echo.
    echo Please ensure you have the following structure:
    echo   studysnap/
    echo   ├── client/
    echo   ├── server/
    echo   ├── package.json
    echo   └── vercel.json
    pause
    exit /b 1
)

echo ✅ Found client directory

REM Create Vercel deployment structure
echo 📁 Creating Vercel deployment structure...

REM Copy client files to root for Vercel
xcopy /E /I /Y client\* .\
copy client\package.json package-frontend.json

REM Update vercel.json for the new structure
(
echo {
echo   "version": 2,
echo   "buildCommand": "npm run build",
echo   "outputDirectory": "dist",
echo   "installCommand": "npm install",
echo   "framework": "vite",
echo   "rewrites": [
echo     {
echo       "source": "/(.*)",
echo       "destination": "/index.html"
echo     }
echo   ]
echo }
) > vercel.json

REM Update package.json for Vercel
(
echo {
echo   "name": "studysnap-frontend",
echo   "version": "1.0.0",
echo   "description": "StudySnap Frontend - AI-powered study assistant",
echo   "type": "module",
echo   "scripts": {
echo     "dev": "vite",
echo     "build": "vite build",
echo     "preview": "vite preview"
echo   },
echo   "dependencies": {
echo     "react": "^18.2.0",
echo     "react-dom": "^18.2.0"
echo   },
echo   "devDependencies": {
echo     "@types/react": "^18.2.66",
echo     "@types/react-dom": "^18.2.22",
echo     "@vitejs/plugin-react": "^4.2.1",
echo     "autoprefixer": "^10.4.21",
echo     "postcss": "^8.5.6",
echo     "tailwindcss": "^4.1.14",
echo     "vite": "^5.2.0"
echo   }
echo }
) > package.json

echo ✅ Vercel deployment structure created
echo.
echo 📋 Next steps:
echo 1. Commit these changes to GitHub:
echo    git add .
echo    git commit -m "Fix Vercel deployment structure"
echo    git push
echo.
echo 2. Redeploy on Vercel - it should work now!
echo.
echo ⚠️  Note: This creates a frontend-only deployment.
echo    For full-stack deployment, consider using:
echo    - Vercel (frontend) + Render/Railway (backend)
echo    - Or deploy both to Railway/Render
echo.
pause
ENDLOCAL
