@echo off
echo 🚀 StudySnap GitHub Upload Script
echo =================================

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first:
    echo    Download from: https://git-scm.com/downloads
    pause
    exit /b 1
)

echo ✅ Git is installed

REM Initialize git repository if not already initialized
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
) else (
    echo ✅ Git repository already initialized
)

REM Add all files
echo 📦 Adding files to Git...
git add .

REM Commit changes
echo 💾 Committing changes...
git commit -m "feat: Complete StudySnap app with AI quiz generation

- Add comprehensive React frontend with modern UI
- Implement Node.js backend with Express
- Add OpenAI integration with local fallback
- Include file upload support (PDF, TXT, images)
- Add quiz generation with 7-15 questions
- Implement progress tracking and statistics
- Add study tips and welcome screen
- Include Pro features and upgrade system
- Add deployment configuration for Vercel/Render
- Complete documentation and setup guides"

if %errorlevel% neq 0 (
    echo ℹ️  No changes to commit or commit failed
) else (
    echo ✅ Changes committed successfully
)

REM Check if remote origin exists
git remote get-url origin >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Remote origin already configured
    for /f "tokens=*" %%i in ('git remote get-url origin') do set REMOTE_URL=%%i
    echo    Remote URL: %REMOTE_URL%
) else (
    echo ⚠️  No remote origin configured
    echo    Please add your GitHub repository URL:
    echo    git remote add origin https://github.com/YOUR_USERNAME/studysnapapp.git
    echo.
    echo    Then run: git push -u origin main
    pause
    exit /b 0
)

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo 🎉 Successfully uploaded StudySnap to GitHub!
    echo.
    echo 📋 Next Steps:
    echo 1. Go to your GitHub repository
    echo 2. Deploy frontend to Vercel (set Root Directory to 'client')
    echo 3. Deploy backend to Render/Railway (set Root Directory to 'server')
    echo 4. Configure environment variables
    echo 5. Test your deployed app!
    echo.
    echo 🔗 Deployment guides are in the repository:
    echo    - DEPLOYMENT_CHECKLIST.md
    echo    - VERCEL_DEPLOYMENT_FIX.md
    echo    - DEPLOYMENT_QUICK_START.md
) else (
    echo ❌ Failed to push to GitHub
    echo    Please check your internet connection and GitHub credentials
)

pause
