#!/bin/bash
# Deployment script for StudySnap
echo "🚀 Starting StudySnap deployment..."

# Check if client directory exists
if [ ! -d "client" ]; then
    echo "❌ Error: client directory not found!"
    echo "Current directory contents:"
    ls -la
    exit 1
fi

echo "✅ Client directory found"

# Navigate to client directory
cd client

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Output directory: dist/"
ls -la dist/



