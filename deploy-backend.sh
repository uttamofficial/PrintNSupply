#!/bin/bash

echo "🚀 Starting PrintNSupply Backend deployment..."

# Navigate to backend directory
cd backend

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Check if server.js exists
if [ ! -f "server.js" ]; then
    echo "❌ server.js not found!"
    exit 1
fi

echo "✅ Backend setup complete!"
echo "📍 Starting server with npm start..."

# Start the server
npm start