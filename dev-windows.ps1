# Windows Development Script for BeeDee
Write-Host "🚀 Starting BeeDee Development Environment" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Check if Node.js is available
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install npm first." -ForegroundColor Red
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Check if data file exists
if (-not (Test-Path "public/all-sex-positions.json")) {
    Write-Host "📊 No data file found. Would you like to run the scraper? (y/n)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Host "🕷️  Running scraper..." -ForegroundColor Cyan
        node scrape-sex-positions.js
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Scraper completed successfully" -ForegroundColor Green
            if (Test-Path "all-sex-positions.json") {
                Copy-Item "all-sex-positions.json" "public/" -Force
                Write-Host "✅ Data copied to public directory" -ForegroundColor Green
            }
        } else {
            Write-Host "⚠️  Scraper failed, but continuing with development" -ForegroundColor Yellow
        }
    } else {
        Write-Host "ℹ️  Using fallback data for development" -ForegroundColor Cyan
    }
} else {
    Write-Host "✅ Data file found" -ForegroundColor Green
}

# Start development server
Write-Host ""
Write-Host "🎯 Starting development server..." -ForegroundColor Cyan
Write-Host "🌐 App will be available at: http://localhost:3000" -ForegroundColor Green
Write-Host "📊 Data will be available at: http://localhost:3000/all-sex-positions.json" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev
