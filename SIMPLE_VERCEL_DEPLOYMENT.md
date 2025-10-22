# 🚀 SIMPLE VERCEL DEPLOYMENT GUIDE

## ✅ **SOLUTION FOR GREYED OUT FIELDS**

The build command and output directory are greyed out because Vercel auto-detects the framework. Here's how to fix it:

---

## 🔧 **STEP 1: Delete ALL Old Vercel Projects**

1. **Go to**: https://vercel.com/dashboard
2. **Delete EVERY StudySnap project** (this clears cached settings)
3. **Make sure dashboard is empty**

---

## 🔧 **STEP 2: Deploy with Correct Settings**

1. **Go to**: https://vercel.com
2. **Click**: "New Project"
3. **Import**: Your GitHub repository (`studysnap-app`)

### **IMPORTANT: Set Root Directory**

4. **Look for "Root Directory" setting**
5. **Click "Edit" next to Root Directory**
6. **Enter**: `client`
7. **Click "Save"**

### **Verify Settings**

After setting root directory to `client`, you should see:
- **Build Command**: `npm run build` (should be editable)
- **Output Directory**: `dist` (should be editable)
- **Install Command**: `npm install` (should be editable)

---

## 🔧 **STEP 3: Deploy**

1. **Click**: "Deploy"
2. **Wait for build to complete**

---

## 🎯 **Why This Works**

- **Root Directory = `client`**: Tells Vercel where your frontend code is
- **Auto-detection**: Vercel will detect Vite and set correct build commands
- **Clean slate**: No cached configurations from old projects

---

## 🚨 **If Fields Are Still Greyed Out**

If the fields are still greyed out after setting root directory:

1. **Refresh the page**
2. **Try again** with the same steps
3. **Or manually override** by clicking "Edit" next to each field

---

**The key is setting Root Directory to `client` first!** 🚀
