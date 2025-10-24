#!/bin/bash
# GitHub Upload Script for StudySnap
echo "🚀 StudySnap GitHub Upload Script"
echo "================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   Download from: https://git-scm.com/downloads"
    exit 1
fi

echo "✅ Git is installed"

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
else
    echo "✅ Git repository already initialized"
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    # Commit changes
    echo "💾 Committing changes..."
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
    
    echo "✅ Changes committed successfully"
fi

# Check if remote origin exists
if git remote get-url origin &> /dev/null; then
    echo "✅ Remote origin already configured"
    REMOTE_URL=$(git remote get-url origin)
    echo "   Remote URL: $REMOTE_URL"
else
    echo "⚠️  No remote origin configured"
    echo "   Please add your GitHub repository URL:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/studysnapapp.git"
    echo ""
    echo "   Then run: git push -u origin main"
    exit 0
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Successfully uploaded StudySnap to GitHub!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Go to your GitHub repository"
    echo "2. Deploy frontend to Vercel (set Root Directory to 'client')"
    echo "3. Deploy backend to Render/Railway (set Root Directory to 'server')"
    echo "4. Configure environment variables"
    echo "5. Test your deployed app!"
    echo ""
    echo "🔗 Deployment guides are in the repository:"
    echo "   - DEPLOYMENT_CHECKLIST.md"
    echo "   - VERCEL_DEPLOYMENT_FIX.md"
    echo "   - DEPLOYMENT_QUICK_START.md"
else
    echo "❌ Failed to push to GitHub"
    echo "   Please check your internet connection and GitHub credentials"
fi



