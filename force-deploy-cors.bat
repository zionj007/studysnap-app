@echo off
echo 🚀 FORCING CORS FIX DEPLOYMENT...

echo Adding all files...
git add -A

echo Committing changes...
git commit -m "Fix CORS to allow Vercel frontend requests - FORCE UPDATE"

echo Pushing to GitHub...
git push origin clean-main

echo ✅ Done! Render will auto-redeploy your backend.
echo ⏰ Wait 2-3 minutes, then test your Vercel frontend!
pause
