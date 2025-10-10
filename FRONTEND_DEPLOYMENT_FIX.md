# 🚨 Frontend Still Connecting to Localhost - Fix Guide

## The Problem

Even though we added environment variables to `render.yaml`, the frontend is **still trying to connect to localhost:5010**. This is because:

1. **Environment variables in `render.yaml` are NOT automatically applied** - Render needs explicit configuration
2. **The frontend build is cached** - It's using the old build without the environment variables
3. **Render's Blueprint (YAML) has limitations** - Environment variables might not be read during build time

---

## ✅ IMMEDIATE FIX - Manual Dashboard Configuration

### Step 1: Add Environment Variables in Render Dashboard

1. **Go to**: https://dashboard.render.com
2. **Click**: `printnsupply-frontend` (or your frontend service name)
3. **Click**: "Environment" tab in the left sidebar
4. **Click**: "Add Environment Variable" for each of these:

```bash
VITE_API_URL=https://printnsupply-backend.onrender.com
VITE_SUPABASE_URL=https://qlchpejqhdjzbfikvlzw.supabase.co
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsY2hwZWpxaGRqemJmaWt2bHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDA1MTgsImV4cCI6MjA3NTQ3NjUxOH0.e6M4R5P0o6xanOOmiyBL_2REzasx2nVQoI1DtAVGAGA
VITE_CLOUDINARY_CLOUD_NAME=dcwzukqqw
VITE_CLOUDINARY_UPLOAD_PRESET=printnsupply
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SG0CkCeoTVIAxUvuRKLMB0AmTRL422LqKbW2famGDWXo74ueXLgeuzGO6Qc3b50We9Oh7kqRok2XN62oc3WId7u00y7mgxB1u
VITE_CLERK_PUBLISHABLE_KEY=pk_test_bGVnYWwtYW50LTk2LmNsZXJrLmFjY291bnRzLmRldiQ
```

5. **Click**: "Save Changes"

### Step 2: Force Rebuild with Clear Cache

After adding all environment variables:

1. **Go to**: "Manual Deploy" tab
2. **Click**: "Clear build cache & deploy"
3. **Wait**: 5-10 minutes for deployment to complete

---

## 🔍 Why This Happens

### Render's Environment Variable Behavior:

1. **Static Sites**: Environment variables in `render.yaml` are NOT automatically passed to the build process
2. **Build Time vs Runtime**: Vite needs env vars at **build time** (not runtime)
3. **YAML Limitations**: Render's Blueprint YAML doesn't always apply env vars for static sites

### How Vite Environment Variables Work:

```javascript
// During BUILD time, Vite replaces this:
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5010';

// With the actual value:
const API_URL = "https://printnsupply-backend.onrender.com";

// But ONLY if VITE_API_URL is set BEFORE the build!
```

If the variable isn't set during build → It defaults to `localhost:5010` → Gets hardcoded into the bundle → Can't be changed at runtime!

---

## 🧪 Verify the Fix

After redeployment:

### Method 1: Check the Build Log

1. Go to Render dashboard → printnsupply-frontend
2. Click "Logs" tab
3. Look for these lines during build:
   ```
   VITE v5.x.x building for production...
   ✓ built in 15s
   ```
4. Check if environment variables are mentioned

### Method 2: Test in Browser

1. Open: https://printnsupply.onrender.com
2. Open Developer Console (F12)
3. Run this command:
   ```javascript
   // This will show what URL the app is using
   console.log('API URL:', import.meta.env.VITE_API_URL);
   ```
4. Should show: `https://printnsupply-backend.onrender.com`
5. If it shows `undefined` → Environment variables weren't applied

### Method 3: Try Creating an Order

1. Go to: https://printnsupply.onrender.com
2. Add items to cart
3. Click "Place Order"
4. Open Network tab in DevTools
5. Check the request URL - should be to `printnsupply-backend.onrender.com`, NOT `localhost:5010`

---

## 🔧 Alternative Solution: Use .env in Build Command

If manual dashboard configuration doesn't work, update the build command:

```yaml
buildCommand: |
  export VITE_API_URL=https://printnsupply-backend.onrender.com
  export VITE_SUPABASE_URL=https://qlchpejqhdjzbfikvlzw.supabase.co
  export VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsY2hwZWpxaGRqemJmaWt2bHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDA1MTgsImV4cCI6MjA3NTQ3NjUxOH0.e6M4R5P0o6xanOOmiyBL_2REzasx2nVQoI1DtAVGAGA
  export VITE_CLOUDINARY_CLOUD_NAME=dcwzukqqw
  export VITE_CLOUDINARY_UPLOAD_PRESET=printnsupply
  export VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51SG0CkCeoTVIAxUvuRKLMB0AmTRL422LqKbW2famGDWXo74ueXLgeuzGO6Qc3b50We9Oh7kqRok2XN62oc3WId7u00y7mgxB1u
  export VITE_CLERK_PUBLISHABLE_KEY=pk_test_bGVnYWwtYW50LTk2LmNsZXJrLmFjY291bnRzLmRldiQ
  npm install && npm run build:frontend && cp frontend/public/_redirects frontend/dist/
```

---

## 🎯 Best Solution: Switch to Netlify or Vercel

Both platforms handle environment variables **much better** for static sites:

### Deploy to Netlify (Recommended):

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   cd frontend
   netlify init
   ```

4. **Set Environment Variables**:
   ```bash
   netlify env:set VITE_API_URL "https://printnsupply-backend.onrender.com"
   netlify env:set VITE_SUPABASE_URL "https://qlchpejqhdjzbfikvlzw.supabase.co"
   # ... etc
   ```

5. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

**Netlify Advantages:**
- ✅ Automatically applies environment variables during build
- ✅ Better SPA routing support (no manual redirects needed)
- ✅ Faster builds and deployments
- ✅ Better caching and CDN
- ✅ Free SSL and custom domains

---

## 📋 Troubleshooting Checklist

- [ ] Environment variables added in Render dashboard (not just render.yaml)
- [ ] All 7 VITE_ variables are set
- [ ] Build cache cleared and redeployed
- [ ] Waited 5-10 minutes for deployment to complete
- [ ] Checked browser console for API URL
- [ ] Checked Network tab for request URLs
- [ ] Backend is responding (test with curl)
- [ ] No CORS errors in browser console

---

## 🆘 If Still Not Working

1. **Check Render Build Logs**:
   - Look for "Environment variables" section
   - Verify variables are being passed to build

2. **Try Local Build with Same Vars**:
   ```bash
   cd frontend
   export VITE_API_URL=https://printnsupply-backend.onrender.com
   npm run build
   # Check if dist/assets/*.js contains the backend URL
   grep -r "printnsupply-backend" dist/
   ```

3. **Consider Netlify/Vercel**:
   - Render might have issues with static site env vars
   - Netlify and Vercel are specifically designed for this use case

---

**TL;DR: Add environment variables manually in Render dashboard → Clear build cache → Redeploy → Should work!** 🚀
