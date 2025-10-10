# Backend Deployment Fix Guide

## 🚨 Current Issue: Backend 404 Error

The backend is not responding on Render. Here are the steps to fix it:

## 🔧 Quick Fix Steps

### Option 1: Manual Render Dashboard Setup

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Create New Web Service**
3. **Connect GitHub Repository**: PrintNSupply
4. **Configure Backend Service**:
   - **Name**: `printnsupply-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Auto-Deploy**: `Yes`

### Option 2: Environment Variables to Set

```
NODE_ENV=production
FRONTEND_URL=https://printnsupply.onrender.com
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
STRIPE_SECRET_KEY=your_stripe_secret
```

## 🧪 Testing Endpoints

Once deployed, test these URLs:

- **Health Check**: https://printnsupply-backend.onrender.com/
- **API Test**: https://printnsupply-backend.onrender.com/test
- **Products**: https://printnsupply-backend.onrender.com/api/products
- **Stationery**: https://printnsupply-backend.onrender.com/stationery

## 🐛 Common Issues

1. **Environment Variables Missing**: Set all required env vars
2. **Build Command Wrong**: Use `cd backend && npm install`
3. **Start Command Wrong**: Use `cd backend && npm start`
4. **Port Issues**: Let Render assign the port automatically

## 🔄 Deployment Commands

If using manual deployment:

```bash
cd backend
npm install
npm start
```

## 📝 Logs to Check

Look for these in Render logs:
- "Server is running on port X"
- "CORS enabled for frontend communication"
- No error messages during startup

## ⚡ Quick Test

Run locally to verify:
```bash
cd backend
npm install
npm start
```

Then visit: http://localhost:5010/