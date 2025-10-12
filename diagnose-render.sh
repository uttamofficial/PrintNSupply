#!/bin/bash

echo "🔍 Diagnosing Render Deployment Issue"
echo "======================================"
echo ""

echo "Checking current deployment status..."
echo ""

# Check if the site is accessible
echo "1️⃣ Testing frontend accessibility..."
if curl -s -o /dev/null -w "%{http_code}" https://printnsupply.onrender.com | grep -q "200"; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend is not accessible or down"
fi
echo ""

# Check what build is deployed
echo "2️⃣ Checking current build version..."
CURRENT_BUILD=$(curl -s https://printnsupply.onrender.com | grep -o "index-[A-Za-z0-9]*.js" | head -1)
echo "Current build file: $CURRENT_BUILD"
echo ""

# Try to fetch and check if backend URL is in the build
echo "3️⃣ Checking if backend URL is in the deployed build..."
if curl -s "https://printnsupply.onrender.com/assets/$CURRENT_BUILD" | grep -q "printnsupply-backend.onrender.com"; then
    echo "✅ Backend URL found in build!"
    echo "   The issue might be with browser cache - try hard refresh"
else
    echo "❌ Backend URL NOT found in build"
    echo "   Still using localhost:5010"
    echo ""
    echo "🔍 Checking what URL is in the build..."
    curl -s "https://printnsupply.onrender.com/assets/$CURRENT_BUILD" | grep -o "localhost:5010" | head -1
fi
echo ""

# Check backend
echo "4️⃣ Testing backend connectivity..."
if curl -s https://printnsupply-backend.onrender.com/health | grep -q "healthy"; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is not responding"
fi
echo ""

echo "📊 Diagnosis Complete!"
echo ""
echo "Common Issues:"
echo "1. Render doesn't export envVars to static site builds"
echo "2. Build script isn't being executed properly"
echo "3. Environment variables need to be set in Render dashboard manually"
echo ""
echo "Recommended Fix:"
echo "Either deploy to Netlify (guaranteed to work) or manually configure Render dashboard"
