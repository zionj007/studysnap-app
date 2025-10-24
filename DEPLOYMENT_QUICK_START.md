# 🚀 StudySnap Deployment Guide

## Quick Deployment Steps

### **Option 1: Deploy Frontend to Vercel (Recommended)**

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - **Important**: Set the **Root Directory** to `client`
   - Add Environment Variable: `VITE_API_URL` = `https://your-backend-url.com/api`
   - Click "Deploy"

### **Option 2: Deploy Backend to Render**

1. **Deploy Backend**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - **Important**: Set the **Root Directory** to `server`
   - Add Environment Variables:
     - `OPENAI_API_KEY` = your OpenAI API key
     - `NODE_ENV` = `production`
     - `CORS_ORIGIN` = your Vercel frontend URL
   - Click "Create Web Service"

### **Option 3: Deploy Both to Railway (Easiest)**

1. **Deploy to Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will detect both services automatically
   - Configure environment variables for both services
   - Deploy!

## Environment Variables

### Frontend (Vercel/Railway)
- `VITE_API_URL`: Your backend API URL

### Backend (Render/Railway)
- `OPENAI_API_KEY`: Your OpenAI API key
- `NODE_ENV`: `production`
- `CORS_ORIGIN`: Your frontend URL
- `PORT`: `3001` (or your preferred port)

## Troubleshooting

### If Vercel build fails:
1. Make sure the **Root Directory** is set to `client`
2. Check that all dependencies are in `client/package.json`
3. Ensure the build script runs: `npm run build`

### If backend deployment fails:
1. Make sure the **Root Directory** is set to `server`
2. Check that `OPENAI_API_KEY` is set correctly
3. Verify `CORS_ORIGIN` matches your frontend URL

## Testing Your Deployment

1. **Frontend**: Visit your Vercel/Railway URL
2. **Backend**: Test `https://your-backend-url.com/health`
3. **Full App**: Upload a file and generate a quiz

## Pro Tips

- Use Railway for the easiest full-stack deployment
- Vercel + Render gives you the best performance
- Always test locally before deploying
- Keep your environment variables secure

---

**Need help?** Check the logs in your deployment platform's dashboard for specific error messages.



