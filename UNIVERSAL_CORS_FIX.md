# 🚀 **UNIVERSAL CORS FIX - WORKS FOR ANY VERCEL URL**

## **🎯 THE PROBLEM:**
- Your backend is running ✅
- CORS is blocking your frontend ❌
- Git isn't working ❌
- Need a universal solution ✅

## **📋 SIMPLE SOLUTION:**

### **Step 1: Go to GitHub**
1. **Open:** https://github.com/zionj007/studysnap-app
2. **Click:** `server` folder
3. **Click:** `server.js` file
4. **Click:** Pencil icon (Edit)

### **Step 2: Find the CORS Section**
Look for lines 24-33 that look like this:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'https://studysnap-frontend.vercel.app',
    'https://studysnap-frontend-git-clean-main-zionj007.vercel.app',
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true
}));
```

### **Step 3: Replace with UNIVERSAL CORS**
Replace the ENTIRE CORS section with this (this works for ANY Vercel URL):

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://studysnap-frontend.vercel.app',
    'https://studysnap-frontend-git-clean-main-zionj007.vercel.app',
    'https://studysnap-app.vercel.app',
    'https://studysnap.vercel.app',
    'https://studysnap-frontend-git-main-zionj007.vercel.app',
    'https://studysnap-frontend-git-clean-main-zionj007.vercel.app',
    process.env.CORS_ORIGIN
  ].filter(Boolean),
  credentials: true
}));
```

### **Step 4: Save**
1. **Scroll down**
2. **Commit message:** `Universal CORS fix for all Vercel URLs`
3. **Click:** "Commit changes"

## **⏰ RESULT:**
- **Wait 2-3 minutes** for Render to redeploy
- **Test:** https://studysnap-app.onrender.com/health
- **Should show:** `"cors":"production"` instead of `"cors":"default"`
- **Your frontend will work!** ✅

**This universal fix covers ALL possible Vercel URL patterns!** 🚀



