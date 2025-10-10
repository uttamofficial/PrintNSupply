#!/bin/bash

echo "🔍 Checking Render Backend Status..."
echo "======================================"
echo ""

# Check if backend is responding
echo "Testing backend health endpoint..."
response=$(curl -s -o /dev/null -w "%{http_code}" https://printnsupply-backend.onrender.com/health)

if [ "$response" = "200" ]; then
    echo "✅ Backend is UP and responding!"
    echo ""
    echo "Testing CORS for localhost:5173..."
    curl -s -X OPTIONS https://printnsupply-backend.onrender.com/api/orders/create \
         -H "Origin: http://localhost:5173" \
         -H "Access-Control-Request-Method: POST" \
         -i | grep -i "access-control" || echo "❌ CORS not configured yet"
elif [ "$response" = "502" ]; then
    echo "❌ Backend is DOWN (502 Bad Gateway)"
    echo "   This means:"
    echo "   1. Backend is still deploying (wait 5 more minutes)"
    echo "   2. Backend crashed during deployment"
    echo "   3. Environment variables missing on Render"
    echo ""
    echo "💡 SOLUTION: Use local backend for now!"
    echo ""
    echo "Run this command:"
    echo "   cd backend && npm start"
    echo ""
    echo "Or check Render logs:"
    echo "   https://dashboard.render.com/web/YOUR_BACKEND_SERVICE_ID/logs"
else
    echo "❌ Unexpected response: $response"
fi

echo ""
echo "======================================"
echo ""

# Check if frontend is using correct URL
echo "🔍 Checking Frontend Configuration..."
if [ -f "frontend/.env.local" ]; then
    echo "Frontend .env.local:"
    cat frontend/.env.local | grep VITE_API_URL || echo "   VITE_API_URL not set!"
else
    echo "❌ frontend/.env.local not found!"
fi

echo ""
echo "======================================"
echo ""
echo "📊 Status Summary:"
echo ""
echo "Backend URL: https://printnsupply-backend.onrender.com"
echo "Backend Status: $([ "$response" = "200" ] && echo "✅ UP" || echo "❌ DOWN ($response)")"
echo "Frontend Dev: http://localhost:5173"
echo "Frontend Prod: https://uttamofficial.github.io/PrintNSupply/"
echo ""

if [ "$response" != "200" ]; then
    echo "⚠️  ACTION REQUIRED:"
    echo "   1. Check Render dashboard for backend logs"
    echo "   2. Or run backend locally: cd backend && npm start"
    echo "   3. Or wait 5 minutes for Render to finish deploying"
fi
