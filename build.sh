#!/bin/bash

# StudySnap Production Build Script

echo "🚀 Building StudySnap for Production..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the root directory"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

# Build client
echo "🏗️ Building client..."
cd client
npm run build
cd ..

# Check if build was successful
if [ ! -d "client/dist" ]; then
    echo "❌ Error: Client build failed"
    exit 1
fi

echo "✅ Build completed successfully!"
echo ""
echo "📁 Build artifacts:"
echo "   - Client: ./client/dist/"
echo "   - Server: ./server/"
echo ""
echo "🐳 To deploy with Docker:"
echo "   docker-compose up -d"
echo ""
echo "☁️ To deploy to cloud:"
echo "   - Frontend: Deploy ./client/dist to Vercel/Netlify"
echo "   - Backend: Deploy ./server to Render/Railway"
echo ""
echo "🔧 Don't forget to:"
echo "   1. Set up environment variables"
echo "   2. Configure OpenAI API key"
echo "   3. Set up Stripe for Pro features"
echo "   4. Configure CORS origins"



