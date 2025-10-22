# StudySnap Deployment Guide

## 🚀 Environment Variables Fix

This guide will help you deploy StudySnap with proper environment variable configuration.

## 📋 Required Environment Variables

### For Backend (Render/Railway/Railway)

#### Required Variables:
```
OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE
NODE_ENV=production
PORT=3001
```

#### Optional Variables:
```
CORS_ORIGIN=https://your-frontend-domain.vercel.app
MAX_FILE_SIZE=10485760
LOG_LEVEL=info
```

### For Frontend (Vercel)

#### Usually No Variables Needed
The frontend will make API calls to your deployed backend.

## 🔧 Platform-Specific Instructions

### 1. Render.com Deployment

1. **Connect Repository:**
   - Go to https://render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `server` folder as root directory

2. **Configure Environment Variables:**
   - In Render dashboard, go to your service
   - Click "Environment" tab
   - Add these variables:
     ```
     OPENAI_API_KEY = YOUR_OPENAI_API_KEY_HERE
     NODE_ENV = production
     PORT = 3001
     ```

3. **Deploy Settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Health Check Path: `/health`

### 2. Railway Deployment

1. **Connect Repository:**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Choose the `server` folder

2. **Configure Environment Variables:**
   - In Railway dashboard, go to your project
   - Click "Variables" tab
   - Add these variables:
     ```
     OPENAI_API_KEY = YOUR_OPENAI_API_KEY_HERE
     NODE_ENV = production
     PORT = 3001
     ```

### 3. Vercel Frontend Deployment

1. **Deploy Frontend:**
   - Run the fix script: `bash fix-vercel-deployment.sh`
   - Commit changes: `git add . && git commit -m "Fix deployment" && git push`
   - Deploy to Vercel

2. **Update API URLs:**
   - After backend deployment, update frontend API calls
   - Replace `http://localhost:3001` with your backend URL

## 🔍 Troubleshooting

### Common Issues:

1. **"OpenAI API key not configured"**
   - Check that `OPENAI_API_KEY` is set in environment variables
   - Verify the key is correct and has credits

2. **"CORS error"**
   - Set `CORS_ORIGIN` to your frontend URL
   - For Vercel: `https://your-app.vercel.app`

3. **"Port already in use"**
   - Set `PORT` environment variable
   - Most platforms auto-assign ports

4. **"Health check failed"**
   - Check `/health` endpoint
   - Verify all required environment variables are set

### Testing Environment Variables:

1. **Check Health Endpoint:**
   ```bash
   curl https://your-backend-url.com/health
   ```

2. **Expected Response:**
   ```json
   {
     "status": "OK",
     "environment": "production",
     "services": {
       "openai": "configured",
       "uploads": "available"
     },
     "environment_variables": {
       "openai_configured": true
     }
   }
   ```

## 📝 Environment Variable Checklist

### Backend Deployment:
- [ ] `OPENAI_API_KEY` set correctly
- [ ] `NODE_ENV=production`
- [ ] `PORT` set (or auto-assigned)
- [ ] `CORS_ORIGIN` set to frontend URL
- [ ] Health check endpoint working

### Frontend Deployment:
- [ ] API calls updated to backend URL
- [ ] CORS configured on backend
- [ ] All components working

## 🎯 Quick Fix Commands

### For Local Development:
```bash
# Create .env file in server folder
echo "OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE" > server/.env
echo "NODE_ENV=development" >> server/.env
echo "PORT=3001" >> server/.env
```

### For Production:
Set these in your deployment platform's environment variables section.

## ✅ Success Indicators

- Health endpoint returns `"openai": "configured"`
- Frontend can upload files
- Quiz generation works
- No CORS errors in browser console
- All API endpoints responding correctly
