#!/bin/bash

echo "🚀 StudySnap Vercel Deployment Fix"
echo "=================================="

# Check if we're in the right directory
if [ ! -d "client" ]; then
    echo "❌ Error: 'client' directory not found!"
    echo "This script should be run from the root of your StudySnap project."
    echo "Current directory: $(pwd)"
    echo ""
    echo "Please ensure you have the following structure:"
    echo "  studysnap/"
    echo "  ├── client/"
    echo "  ├── server/"
    echo "  ├── package.json"
    echo "  └── vercel.json"
    exit 1
fi

echo "✅ Found client directory"

# Create a temporary directory for Vercel deployment
echo "📁 Creating Vercel deployment structure..."

# Copy client files to root for Vercel
cp -r client/* ./
cp client/package.json ./package-frontend.json

# Update vercel.json for the new structure
cat > vercel.json << 'EOF'
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
EOF

# Update package.json for Vercel
cat > package.json << 'EOF'
{
  "name": "studysnap-frontend",
  "version": "1.0.0",
  "description": "StudySnap Frontend - AI-powered study assistant",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.14",
    "vite": "^5.2.0"
  }
}
EOF

echo "✅ Vercel deployment structure created"
echo ""
echo "📋 Next steps:"
echo "1. Commit these changes to GitHub:"
echo "   git add ."
echo "   git commit -m 'Fix Vercel deployment structure'"
echo "   git push"
echo ""
echo "2. Redeploy on Vercel - it should work now!"
echo ""
echo "⚠️  Note: This creates a frontend-only deployment."
echo "   For full-stack deployment, consider using:"
echo "   - Vercel (frontend) + Render/Railway (backend)"
echo "   - Or deploy both to Railway/Render"



