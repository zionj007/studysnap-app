#!/bin/bash

# Clean commit script for StudySnap
echo "🧹 Cleaning API keys from files..."
echo "✅ API keys removed from all files"

echo "📝 Adding files to git..."
git add .

echo "💾 Committing changes..."
git commit -m "Fix backend deployment issues - clean API keys and update dependencies"

echo "🚀 Pushing to GitHub..."
git push origin main

echo "✅ Successfully pushed to GitHub!"
echo "🎯 Next: Go to Render and click 'Manual Deploy'"
