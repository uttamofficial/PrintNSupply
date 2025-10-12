#!/bin/bash

echo "🚀 Starting PrintNSupply build process..."

# Install root dependencies first
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Build the frontend
echo "🔨 Building frontend..."
npm run build

# Copy _redirects file for Render deployment
if [ -f "public/_redirects" ]; then
    echo "📋 Copying _redirects file..."
    cp public/_redirects dist/
fi

# Copy render.json if it exists
if [ -f "render.json" ]; then
    echo "📋 Copying render.json..."
    cp render.json dist/
fi

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful! dist directory created."
    echo "📁 Contents of dist directory:"
    ls -la dist/
else
    echo "❌ Build failed! dist directory not found."
    exit 1
fi

echo "🎉 Build process completed successfully!"