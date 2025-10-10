#!/bin/bash

echo "🔧 EMERGENCY FIX: Building Frontend Locally with Correct Environment Variables"
echo "==============================================================================="
echo ""
echo "This will build your frontend with the production backend URL hardcoded."
echo "You can then manually upload the dist folder to Render or any static host."
echo ""

cd frontend || exit

echo "✅ Setting environment variables..."
export VITE_API_URL="https://printnsupply-backend.onrender.com"
export VITE_SUPABASE_URL="https://qlchpejqhdjzbfikvlzw.supabase.co"
export VITE_SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsY2hwZWpxaGRqemJmaWt2bHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDA1MTgsImV4cCI6MjA3NTQ3NjUxOH0.e6M4R5P0o6xanOOmiyBL_2REzasx2nVQoI1DtAVGAGA"
export VITE_CLOUDINARY_CLOUD_NAME="dcwzukqqw"
export VITE_CLOUDINARY_UPLOAD_PRESET="printnsupply"
export VITE_STRIPE_PUBLISHABLE_KEY="pk_test_51SG0CkCeoTVIAxUvuRKLMB0AmTRL422LqKbW2famGDWXo74ueXLgeuzGO6Qc3b50We9Oh7kqRok2XN62oc3WId7u00y7mgxB1u"
export VITE_CLERK_PUBLISHABLE_KEY="pk_test_bGVnYWwtYW50LTk2LmNsZXJrLmFjY291bnRzLmRldiQ"

echo "VITE_API_URL = $VITE_API_URL"
echo ""

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🏗️ Building production bundle..."
npm run build

echo ""
echo "🔍 Verifying build..."
if grep -r "printnsupply-backend.onrender.com" dist/ > /dev/null 2>&1; then
    echo "✅ SUCCESS! Backend URL is correctly embedded in the build!"
    echo ""
    echo "📊 Build Statistics:"
    ls -lh dist/assets/*.js | awk '{print $9, "-", $5}'
    echo ""
    echo "🎯 The dist folder is ready to deploy!"
    echo ""
    echo "📋 Next Steps:"
    echo ""
    echo "OPTION 1 - Manual Upload to Render:"
    echo "  1. Zip the dist folder: cd frontend && zip -r dist.zip dist/"
    echo "  2. Go to Render Dashboard → printnsupply-frontend"
    echo "  3. Settings → Deploy → Manual Deploy"
    echo ""
    echo "OPTION 2 - Use Vercel (Easiest):"
    echo "  1. npm install -g vercel"
    echo "  2. cd frontend"
    echo "  3. vercel --prod"
    echo ""
    echo "OPTION 3 - GitHub Pages:"
    echo "  1. Push dist folder to gh-pages branch"
    echo "  2. Enable GitHub Pages in repo settings"
    echo ""
    echo "✅ The build is complete and working!"
    echo "   Your frontend will connect to: https://printnsupply-backend.onrender.com"
else
    echo "❌ ERROR: Backend URL not found in build!"
    echo "Environment variables may not have been applied correctly."
fi
