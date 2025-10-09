# Render Deployment Fix

## 🚨 IMMEDIATE FIX FOR RENDER

### Step 1: Update Build Command in Render Dashboard

Go to your Render service settings and change:

**FROM:** `npm install` (current - wrong)
**TO:** `npm run build` (correct)

### Step 2: Alternative Quick Fix

If you can't access the dashboard right now, I've added a `postinstall` script that will automatically build after install.

### Step 3: Manual Build Command Options

Try these build commands in your Render dashboard:

1. **Option 1:** `npm run build`
2. **Option 2:** `./build.sh`  
3. **Option 3:** `cd frontend && npm install && npm run build`
4. **Option 4:** `npm install && npm run build`

### Step 4: Verify Settings

**Service Type:** Static Site
**Build Command:** `npm run build` (or one of the options above)
**Publish Directory:** `frontend/dist`

## 🔧 What's Happening

The logs show Render is running `npm install` instead of building:
```
==> Running build command 'npm install'...
```

It should show:
```
==> Running build command 'npm run build'...
```

## ✅ After Fixing

You should see in the logs:
```
==> Running build command 'npm run build'...
> ez-prints@1.0.0 build
> cd frontend && npm install && npm run build
vite v7.1.9 building for production...
✓ built in 3.03s
```

Then the `frontend/dist` directory will exist and deployment will succeed!