#!/bin/bash

echo "🐳 Building Docker image with scraper..."

# Build the Docker image
docker build -t beedee-sex-positions .

if [ $? -eq 0 ]; then
    echo "✅ Docker build completed successfully!"
    echo ""
    echo "🚀 To run the container:"
    echo "   docker run -p 8080:80 beedee-sex-positions"
    echo ""
    echo "🌐 The app will be available at: http://localhost:8080"
    echo ""
    echo "📊 The scraper will run during build time to ensure fresh data!"
else
    echo "❌ Docker build failed!"
    exit 1
fi
