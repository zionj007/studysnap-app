# ✅ StudySnap Deployment Checklist

## Before Deploying

- [ ] **Code is pushed to GitHub** (main branch)
- [ ] **Local build works** (`cd client && npm run build`)
- [ ] **Environment variables ready** (OpenAI API key, backend URL)
- [ ] **Backend deployed** (Render/Railway) and URL available

## Vercel Frontend Deployment

### Method 1: Root Directory Approach
1. [ ] Go to [vercel.com](https://vercel.com) → New Project
2. [ ] Import GitHub repository
3. [ ] **Set Root Directory to `client`** ⚠️ **CRITICAL**
4. [ ] Add Environment Variable: `VITE_API_URL` = `https://your-backend-url.com/api`
5. [ ] Click Deploy

### Method 2: Custom Build Command
1. [ ] Go to [vercel.com](https://vercel.com) → New Project
2. [ ] Import GitHub repository
3. [ ] **Keep Root Directory as root** (don't change)
4. [ ] **Override Build Command**: `cd client && npm install && npm run build`
5. [ ] **Override Output Directory**: `client/dist`
6. [ ] Add Environment Variable: `VITE_API_URL` = `https://your-backend-url.com/api`
7. [ ] Click Deploy

## Backend Deployment (Render)

1. [ ] Go to [render.com](https://render.com) → New Web Service
2. [ ] Connect GitHub repository
3. [ ] **Set Root Directory to `server`**
4. [ ] **Build Command**: `npm install`
5. [ ] **Start Command**: `npm start`
6. [ ] Add Environment Variables:
   - [ ] `OPENAI_API_KEY` = your OpenAI API key
   - [ ] `NODE_ENV` = `production`
   - [ ] `CORS_ORIGIN` = your Vercel frontend URL
7. [ ] Click Create Web Service

## Testing After Deployment

- [ ] **Frontend loads**: Visit your Vercel URL
- [ ] **Backend health check**: `https://your-backend-url.com/health`
- [ ] **File upload works**: Upload a test file
- [ ] **Quiz generation works**: Generate questions
- [ ] **Quiz functionality**: Take a quiz and see results

## Common Issues & Solutions

### ❌ "cd: client: No such file or directory"
**Solution**: Set Root Directory to `client` in Vercel settings

### ❌ "Build failed" 
**Solution**: Check that all dependencies are in `client/package.json`

### ❌ "CORS error"
**Solution**: Set `CORS_ORIGIN` environment variable to your frontend URL

### ❌ "OpenAI quota exceeded"
**Solution**: App will automatically use local quiz generator as fallback

## Environment Variables Reference

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-url.com/api
```

### Backend (Render/Railway)
```
OPENAI_API_KEY=sk-proj-your-key-here
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.vercel.app
PORT=3001
```

---

**🎉 Once deployed, your StudySnap app will be live and ready to use!**



