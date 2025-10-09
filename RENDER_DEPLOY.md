# PrintNSupply Render Deployment Configuration

## Frontend Static Site Settings

**Service Type:** Static Site
**Build Command:** `./build.sh`
**Publish Directory:** `frontend/dist`
**Auto-Deploy:** Yes

### Environment Variables (Required)
```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_KEY=your_supabase_anon_key_here
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_API_URL=https://your-backend-url.onrender.com
```

## Alternative Build Commands (if build.sh fails)

**Option 1:** `npm run build`
**Option 2:** `npm install && npm run build:frontend`
**Option 3:** `cd frontend && npm install && npm run build`

## Backend Web Service Settings

**Service Type:** Web Service
**Build Command:** `cd backend && npm install`
**Start Command:** `cd backend && npm start`
**Environment:** Node

### Backend Environment Variables
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

## Troubleshooting

If "dist does not exist" error occurs:
1. Check that build command completes successfully
2. Verify environment variables are set
3. Try alternative build commands listed above
4. Check build logs for specific error messages