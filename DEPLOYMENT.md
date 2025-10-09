# PrintNSupply - Deployment Guide

## 🚀 Deployment Instructions

### Frontend Deployment (Render/Netlify/Vercel)

#### For Render:
1. Connect your GitHub repository to Render
2. Create a new Static Site
3. Configure build settings:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Environment Variables**: Add the following from your `.env.example` files

#### For Netlify:
1. Connect your GitHub repository
2. Configure build settings:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

#### For Vercel:
1. Connect your GitHub repository
2. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`

### Backend Deployment (Render/Railway/Heroku)

#### For Render:
1. Create a new Web Service
2. Configure build settings:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**: Add all backend environment variables

### Environment Variables Required

#### Frontend (.env.local):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_KEY=your_supabase_anon_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_API_URL=your_backend_url
```

#### Backend (.env):
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
PORT=5010
NODE_ENV=production
```

## 🔧 Local Development

1. **Install Dependencies:**
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Set up Environment Variables:**
   - Copy `.env.example` files to `.env` files
   - Fill in your API keys and credentials

3. **Run Development Servers:**
   ```bash
   npm run dev
   ```

## 📋 Build Process

### Frontend:
```bash
cd frontend
npm install
npm run build
```
This creates a `dist` folder with the production build.

### Backend:
```bash
cd backend
npm install
npm start
```

## 🐛 Common Deployment Issues

1. **"Publish directory dist does not exist"**
   - Make sure the build command runs successfully
   - Verify the build creates the `dist` directory
   - Check that the publish path is `frontend/dist`

2. **Environment Variables Not Working**
   - Frontend variables must start with `VITE_`
   - Backend variables should not be prefixed
   - Make sure all required variables are set

3. **CORS Issues**
   - Update CORS settings in backend to allow your frontend domain
   - Set the correct API URL in frontend environment variables

## 🌐 Live URLs (After Deployment)
- Frontend: [Your frontend URL]
- Backend API: [Your backend URL]