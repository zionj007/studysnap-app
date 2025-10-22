#!/bin/bash

echo "🔧 StudySnap Environment Setup Script"
echo "===================================="

# Check if we're in the right directory
if [ ! -f "server/server.js" ]; then
    echo "❌ Error: Please run this script from the StudySnap root directory"
    echo "   Current directory: $(pwd)"
    exit 1
fi

echo "✅ Found StudySnap project structure"

# Create server .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "📝 Creating server/.env file..."
    cat > server/.env << 'EOF'
# Development Environment Variables
NODE_ENV=development
PORT=3001

# OpenAI Configuration
OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,txt,png,jpg,jpeg

# Logging
LOG_LEVEL=debug
EOF
    echo "✅ Created server/.env file"
else
    echo "✅ server/.env file already exists"
fi

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. For local development:"
echo "   npm run dev"
echo ""
echo "2. For deployment:"
echo "   - Set environment variables in your deployment platform"
echo "   - Required: OPENAI_API_KEY, NODE_ENV=production"
echo "   - Optional: CORS_ORIGIN, PORT"
echo ""
echo "3. Test the setup:"
echo "   curl http://localhost:3001/health"
echo ""
echo "📖 See DEPLOYMENT_ENV_GUIDE.md for detailed deployment instructions"
