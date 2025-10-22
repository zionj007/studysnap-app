# Fix Git Secrets Issue
# This script will help resolve the GitHub push protection issue

Write-Host "🔧 Fixing GitHub Secrets Detection Issue" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "server\server.js")) {
    Write-Host "❌ Error: Please run this script from the StudySnap root directory" -ForegroundColor Red
    Write-Host "   Current directory: $PWD" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Found StudySnap project structure" -ForegroundColor Green

# Check if files contain the actual API key
$apiKey = "YOUR_OPENAI_API_KEY_HERE"
$placeholder = "your_openai_api_key_here"

# Fix DEPLOYMENT_ENV_GUIDE.md
if (Test-Path "DEPLOYMENT_ENV_GUIDE.md") {
    Write-Host "📝 Fixing DEPLOYMENT_ENV_GUIDE.md..." -ForegroundColor Yellow
    $content = Get-Content "DEPLOYMENT_ENV_GUIDE.md" -Raw
    $content = $content -replace [regex]::Escape($apiKey), $placeholder
    Set-Content "DEPLOYMENT_ENV_GUIDE.md" -Value $content -NoNewline
    Write-Host "✅ Fixed DEPLOYMENT_ENV_GUIDE.md" -ForegroundColor Green
}

# Fix setup-env.bat
if (Test-Path "setup-env.bat") {
    Write-Host "📝 Fixing setup-env.bat..." -ForegroundColor Yellow
    $content = Get-Content "setup-env.bat" -Raw
    $content = $content -replace [regex]::Escape($apiKey), $placeholder
    Set-Content "setup-env.bat" -Value $content -NoNewline
    Write-Host "✅ Fixed setup-env.bat" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Files have been fixed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Open Git Bash or Command Prompt" -ForegroundColor White
Write-Host "2. Run these commands:" -ForegroundColor White
Write-Host "   git add DEPLOYMENT_ENV_GUIDE.md setup-env.bat" -ForegroundColor Gray
Write-Host "   git commit -m 'Remove API key from documentation files'" -ForegroundColor Gray
Write-Host "   git push" -ForegroundColor Gray
Write-Host ""
Write-Host "3. If still having issues, try:" -ForegroundColor White
Write-Host "   git reset --soft HEAD~1" -ForegroundColor Gray
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Clean commit without secrets'" -ForegroundColor Gray
Write-Host "   git push" -ForegroundColor Gray
Write-Host ""
Read-Host "Press Enter to exit"
