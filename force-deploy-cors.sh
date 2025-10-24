#!/bin/bash

echo "🚀 FORCING CORS FIX DEPLOYMENT..."

# Force add all changes
echo "Adding all files..."
git add -A

# Commit with force
echo "Committing changes..."
git commit -m "Fix CORS to allow Vercel frontend requests - FORCE UPDATE"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin clean-main

echo "✅ Done! Render will auto-redeploy your backend."
echo "⏰ Wait 2-3 minutes, then test your Vercel frontend!"



