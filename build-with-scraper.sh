#!/bin/bash

echo "🚀 Building Sex Positions App with Local Scraper"
echo "================================================"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH"
    echo "Please install Node.js and try again"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed or not in PATH"
    echo "Please install npm and try again"
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Run the scraper
echo "🕷️  Running scraper to fetch sex positions data..."
node scrape-sex-positions.js

if [ $? -ne 0 ]; then
    echo "⚠️  Scraper failed, but continuing with build..."
    echo "The app will work with existing data or fallback data"
else
    echo "✅ Scraping completed successfully!"
fi

# Copy scraped data to public directory
if [ -f "all-sex-positions.json" ]; then
    echo "📁 Copying scraped data to public directory..."
    cp all-sex-positions.json public/
    echo "✅ Data copied successfully"
else
    echo "⚠️  No scraped data found, app will use fallback data"
fi

# Build the frontend
echo "🔨 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully!"

echo ""
echo "🎉 App is ready!"
echo "================"
echo ""
echo "To run the app locally:"
echo "  npm run dev"
echo ""
echo "To serve the built app:"
echo "  npx serve dist"
echo ""
echo "The app will be available at:"
echo "  http://localhost:3000 (dev mode)"
echo "  http://localhost:3000 (serve mode)"
echo ""
echo "📊 Scraped data is available at:"
echo "  http://localhost:3000/all-sex-positions.json"
