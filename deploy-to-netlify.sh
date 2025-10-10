#!/bin/bash

echo "🚀 Quick Deploy to Netlify - PrintNSupply Frontend"
echo "=================================================="
echo ""

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
    echo "✅ Netlify CLI installed!"
    echo ""
fi

# Login to Netlify
echo "🔐 Logging in to Netlify..."
echo "   (This will open your browser)"
echo ""
netlify login

echo ""
echo "✅ Logged in successfully!"
echo ""

# Navigate to frontend directory
cd frontend || exit

# Initialize Netlify (if not already done)
if [ ! -f ".netlify/state.json" ]; then
    echo "🎯 Initializing Netlify site..."
    netlify init
else
    echo "✅ Netlify already initialized"
fi

echo ""
echo "🔧 Setting environment variables..."
echo ""

# Set all environment variables
netlify env:set VITE_API_URL "https://printnsupply-backend.onrender.com"
netlify env:set VITE_SUPABASE_URL "https://qlchpejqhdjzbfikvlzw.supabase.co"
netlify env:set VITE_SUPABASE_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsY2hwZWpxaGRqemJmaWt2bHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDA1MTgsImV4cCI6MjA3NTQ3NjUxOH0.e6M4R5P0o6xanOOmiyBL_2REzasx2nVQoI1DtAVGAGA"
netlify env:set VITE_CLOUDINARY_CLOUD_NAME "dcwzukqqw"
netlify env:set VITE_CLOUDINARY_UPLOAD_PRESET "printnsupply"
netlify env:set VITE_STRIPE_PUBLISHABLE_KEY "pk_test_51SG0CkCeoTVIAxUvuRKLMB0AmTRL422LqKbW2famGDWXo74ueXLgeuzGO6Qc3b50We9Oh7kqRok2XN62oc3WId7u00y7mgxB1u"
netlify env:set VITE_CLERK_PUBLISHABLE_KEY "pk_test_bGVnYWwtYW50LTk2LmNsZXJrLmFjY291bnRzLmRldiQ"

echo ""
echo "✅ Environment variables set!"
echo ""

echo "🏗️ Building and deploying to production..."
echo ""

# Deploy to production
netlify deploy --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Your site is now live on Netlify!"
echo "2. Copy the deployment URL (shown above)"
echo "3. Update backend CORS to include the new Netlify URL"
echo "4. Test your site - orders should work now!"
echo ""
echo "To update backend CORS:"
echo "1. Edit backend/server.js"
echo "2. Add your Netlify URL to allowedOrigins array"
echo "3. Push changes and redeploy backend"
echo ""
