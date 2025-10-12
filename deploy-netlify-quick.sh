#!/bin/bash
set -e

echo "🚀 Quick Netlify Deployment for PrintNSupply"
echo "=============================================="
echo ""

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI globally..."
    sudo npm install -g netlify-cli
fi

cd frontend

echo "🔐 Please login to Netlify (browser will open)..."
netlify login

echo ""
echo "🎯 Deploying to Netlify..."
echo ""

# Build with environment variables
export VITE_API_URL="https://printnsupply-backend.onrender.com"
export VITE_SUPABASE_URL="https://qlchpejqhdjzbfikvlzw.supabase.co"
export VITE_SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsY2hwZWpxaGRqemJmaWt2bHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDA1MTgsImV4cCI6MjA3NTQ3NjUxOH0.e6M4R5P0o6xanOOmiyBL_2REzasx2nVQoI1DtAVGAGA"
export VITE_CLOUDINARY_CLOUD_NAME="dcwzukqqw"
export VITE_CLOUDINARY_UPLOAD_PRESET="printnsupply"
export VITE_STRIPE_PUBLISHABLE_KEY="pk_test_51SG0CkCeoTVIAxUvuRKLMB0AmTRL422LqKbW2famGDWXo74ueXLgeuzGO6Qc3b50We9Oh7kqRok2XN62oc3WId7u00y7mgxB1u"
export VITE_CLERK_PUBLISHABLE_KEY="pk_test_bGVnYWwtYW50LTk2LmNsZXJrLmFjY291bnRzLmRldiQ"

npm install
npm run build

echo ""
echo "🚀 Deploying to Netlify production..."
netlify deploy --prod --dir=dist

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "Your site is now live on Netlify!"
echo "Orders will work immediately - no more localhost errors!"
echo ""
