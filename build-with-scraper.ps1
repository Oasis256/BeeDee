# PowerShell script to build Sex Positions App with Local Scraper

Write-Host "🚀 Building Sex Positions App with Local Scraper" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Check if Node.js is available
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is available: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js and try again" -ForegroundColor Yellow
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm is available: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install npm and try again" -ForegroundColor Yellow
    exit 1
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green

# Run the scraper
Write-Host "🕷️  Running scraper to fetch sex positions data..." -ForegroundColor Cyan
node scrape-sex-positions.js

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Scraper failed, but continuing with build..." -ForegroundColor Yellow
    Write-Host "The app will work with existing data or fallback data" -ForegroundColor Yellow
} else {
    Write-Host "✅ Scraping completed successfully!" -ForegroundColor Green
}

# Copy scraped data to public directory
if (Test-Path "all-sex-positions.json") {
    Write-Host "📁 Copying scraped data to public directory..." -ForegroundColor Cyan
    Copy-Item "all-sex-positions.json" "public/" -Force
    Write-Host "✅ Data copied successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  No scraped data found, app will use fallback data" -ForegroundColor Yellow
}

# Build the frontend
Write-Host "🔨 Building frontend..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build completed successfully!" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 App is ready!" -ForegroundColor Green
Write-Host "================" -ForegroundColor Green
Write-Host ""
Write-Host "To run the app locally:" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "To serve the built app:" -ForegroundColor White
Write-Host "  npx serve dist" -ForegroundColor Cyan
Write-Host ""
Write-Host "The app will be available at:" -ForegroundColor White
Write-Host "  http://localhost:3000 (dev mode)" -ForegroundColor Cyan
Write-Host "  http://localhost:3000 (serve mode)" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Scraped data is available at:" -ForegroundColor White
Write-Host "  http://localhost:3000/all-sex-positions.json" -ForegroundColor Cyan
