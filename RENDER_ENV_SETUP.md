# Render Environment Variables Setup Guide

## ⚠️ CRITICAL: Backend Environment Variables Must Be Set Manually

The backend environment variables **CANNOT** be set in `render.yaml` because they contain secrets. You **MUST** add them manually in the Render dashboard.

---

## 🎯 Backend Service Setup (printnsupply-backend)

1. **Go to**: https://dashboard.render.com
2. **Select**: `printnsupply-backend` service
3. **Click**: "Environment" tab in the left sidebar
4. **Add these environment variables**:

### Required Backend Variables:

```bash
# Node Environment
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://printnsupply.onrender.com

# Supabase Configuration
SUPABASE_URL=https://qlchpejqhdjzbfikvlzw.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsY2hwZWpxaGRqemJmaWt2bHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDA1MTgsImV4cCI6MjA3NTQ3NjUxOH0.e6M4R5P0o6xanOOmiyBL_2REzasx2nVQoI1DtAVGAGA

# Cloudinary Configuration (GET THESE FROM YOUR CLOUDINARY DASHBOARD)
CLOUDINARY_CLOUD_NAME=dcwzukqqw
CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>

# Stripe Configuration (GET SECRET KEY FROM STRIPE DASHBOARD)
STRIPE_SECRET_KEY=<YOUR_STRIPE_SECRET_KEY>
STRIPE_PUBLISHABLE_KEY=pk_test_51SG0CkCeoTVIAxUvuRKLMB0AmTRL422LqKbW2famGDWXo74ueXLgeuzGO6Qc3b50We9Oh7kqRok2XN62oc3WId7u00y7mgxB1u
```

### ⚠️ Where to Find Missing Keys:

**Cloudinary Keys:**
1. Go to: https://console.cloudinary.com/
2. Go to Settings → API Keys
3. Copy `API Key` and `API Secret`

**Stripe Secret Key:**
1. Go to: https://dashboard.stripe.com/test/apikeys
2. Copy the `Secret key` (starts with `sk_test_...`)
3. ⚠️ **NEVER** use the live key unless you're in production mode!

---

## ✅ Frontend Service Setup (printnsupply-frontend)

The frontend environment variables are **already set** in `render.yaml` and will be automatically applied:

```yaml
VITE_API_URL=https://printnsupply-backend.onrender.com
VITE_SUPABASE_URL=https://qlchpejqhdjzbfikvlzw.supabase.co
VITE_SUPABASE_KEY=<already set>
VITE_CLOUDINARY_CLOUD_NAME=dcwzukqqw
VITE_CLOUDINARY_UPLOAD_PRESET=printnsupply
VITE_STRIPE_PUBLISHABLE_KEY=<already set>
VITE_CLERK_PUBLISHABLE_KEY=<already set>
```

**No manual action needed for frontend** - these are baked into the build automatically.

---

## 🔧 How to Add Environment Variables in Render:

1. **Navigate to Service**:
   - Dashboard → Select `printnsupply-backend`

2. **Go to Environment Tab**:
   - Click "Environment" in the left sidebar

3. **Add Each Variable**:
   - Click "Add Environment Variable"
   - Enter `Key` (e.g., `SUPABASE_URL`)
   - Enter `Value` (copy from above)
   - Click "Save Changes"

4. **Redeploy**:
   - After adding all variables, click "Manual Deploy" → "Deploy latest commit"
   - Or wait for automatic deployment if you push new code

---

## 🧪 Verify Backend is Working:

After deployment, test these endpoints:

```bash
# Health check
curl https://printnsupply-backend.onrender.com/health

# Test products endpoint
curl https://printnsupply-backend.onrender.com/api/products

# Check CORS headers
curl -I https://printnsupply-backend.onrender.com/health
```

Should return:
- ✅ `200 OK` status
- ✅ `access-control-allow-origin: https://printnsupply.onrender.com`
- ✅ JSON data for products

---

## 🐛 Troubleshooting:

### Issue: Still getting `localhost:5010` errors

**Solution**: Frontend wasn't rebuilt with new environment variables
- Go to Render dashboard
- Select `printnsupply-frontend`
- Click "Manual Deploy" → "Clear build cache & deploy"

### Issue: Backend returns 500 errors

**Solution**: Backend environment variables are missing
- Check that ALL backend env vars are set in Render dashboard
- Especially check `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and `STRIPE_SECRET_KEY`
- Check backend logs: Dashboard → printnsupply-backend → Logs

### Issue: CORS errors

**Solution**: FRONTEND_URL not set correctly
- Ensure `FRONTEND_URL=https://printnsupply.onrender.com` (no trailing slash)
- Redeploy backend after setting

---

## 📋 Deployment Checklist:

- [x] Update `render.yaml` with frontend env vars (already done)
- [ ] Add all backend env vars in Render dashboard
- [ ] Get Cloudinary API key and secret
- [ ] Get Stripe secret key
- [ ] Deploy backend with all env vars
- [ ] Clear frontend build cache and redeploy
- [ ] Test order creation flow
- [ ] Verify payment processing works

---

## 🚀 Next Steps After Setup:

1. **Test Order Creation**:
   - Go to: https://printnsupply.onrender.com
   - Add items to cart
   - Go to checkout
   - Place order
   - Check if order is created successfully (no localhost errors)

2. **Test Payment Flow**:
   - Complete payment with Stripe test card: `4242 4242 4242 4242`
   - Verify payment intent is created
   - Check backend logs for any errors

3. **Monitor Logs**:
   - Backend: https://dashboard.render.com/web/<backend-service-id>/logs
   - Frontend: Check browser console for any errors

---

**Once all environment variables are set, the `ERR_CONNECTION_REFUSED` error will be fixed!** 🎉
