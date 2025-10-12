#!/bin/bash

# Render Frontend Environment Variables Fix Script
# This script exports all environment variables before building

echo "🔧 Setting up environment variables for production build..."

# Critical: Set VITE_API_URL
export VITE_API_URL="https://printnsupply-backend.onrender.com"
echo "✅ VITE_API_URL=$VITE_API_URL"

# Supabase Configuration
export VITE_SUPABASE_URL="https://qlchpejqhdjzbfikvlzw.supabase.co"
export VITE_SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsY2hwZWpxaGRqemJmaWt2bHp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDA1MTgsImV4cCI6MjA3NTQ3NjUxOH0.e6M4R5P0o6xanOOmiyBL_2REzasx2nVQoI1DtAVGAGA"
echo "✅ VITE_SUPABASE_URL=$VITE_SUPABASE_URL"

# Cloudinary Configuration
export VITE_CLOUDINARY_CLOUD_NAME="dcwzukqqw"
export VITE_CLOUDINARY_UPLOAD_PRESET="printnsupply"
echo "✅ VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME"

# Stripe Configuration
export VITE_STRIPE_PUBLISHABLE_KEY="pk_test_51SG0CkCeoTVIAxUvuRKLMB0AmTRL422LqKbW2famGDWXo74ueXLgeuzGO6Qc3b50We9Oh7kqRok2XN62oc3WId7u00y7mgxB1u"
echo "✅ VITE_STRIPE_PUBLISHABLE_KEY set"

# Clerk Configuration
export VITE_CLERK_PUBLISHABLE_KEY="pk_test_bGVnYWwtYW50LTk2LmNsZXJrLmFjY291bnRzLmRldiQ"
echo "✅ VITE_CLERK_PUBLISHABLE_KEY set"

echo ""
echo "🏗️ Building frontend with environment variables..."
echo ""

# Install dependencies
npm install

# Build frontend
npm run build:frontend

# Copy redirect file
cp frontend/public/_redirects frontend/dist/ 2>/dev/null || true

echo ""
echo "✅ Build complete!"
echo ""
echo "🔍 Verifying API_URL in build..."

# Check if the backend URL is in the built files
if grep -r "printnsupply-backend.onrender.com" frontend/dist/ > /dev/null 2>&1; then
    echo "✅ SUCCESS: Backend URL found in build files!"
    echo "   The frontend will connect to: https://printnsupply-backend.onrender.com"
else
    echo "❌ WARNING: Backend URL NOT found in build files!"
    echo "   The build might still use localhost:5010"
    echo "   Check environment variables during build"
fi

echo ""
echo "📦 Build artifacts ready in: frontend/dist/"
