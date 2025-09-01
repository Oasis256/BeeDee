# Docker Build with Integrated Scraper

This Docker setup automatically runs the sex positions scraper during the build process to ensure fresh data is always available.

## 🚀 Quick Start

### Option 1: Using the build script
```bash
./build-docker.sh
```

### Option 2: Using docker-compose
```bash
docker-compose -f docker-compose-sex-positions.yml up --build
```

### Option 3: Manual Docker build
```bash
docker build -t beedee-sex-positions .
docker run -p 8080:80 beedee-sex-positions
```

## 📊 What Happens During Build

1. **Scraper Execution**: The `scrape-sex-positions.js` script runs automatically
2. **Data Collection**: Fresh sex positions data is fetched from Cosmopolitan
3. **Data Processing**: Images, descriptions, and metadata are extracted
4. **File Generation**: `all-sex-positions.json` is created with the latest data
5. **Frontend Build**: The React app is built with the fresh data included
6. **Container Creation**: Everything is packaged into a production-ready container

## 🌐 Accessing the App

Once the container is running, access the app at:
- **Local**: http://localhost:8080
- **Network**: http://your-server-ip:8080

## 🔄 Data Freshness

- **Build-time scraping**: Data is fetched during Docker build
- **No runtime dependencies**: The app works offline with pre-scraped data
- **Consistent experience**: All users get the same data version
- **Easy updates**: Rebuild the container to get fresh data

## 🛠️ Customization

### Change the port
```bash
docker run -p 3000:80 beedee-sex-positions
```

### Mount data volume for persistence
```bash
docker run -p 8080:80 -v ./data:/app/data beedee-sex-positions
```

### Build with custom API URL
```bash
docker build --build-arg VITE_API_URL=https://your-api.com/api -t beedee-sex-positions .
```

## 📁 File Structure

```
/app/
├── dist/                    # Built frontend
├── all-sex-positions.json   # Scraped data
├── server.js               # Backend server
└── nginx.conf              # Nginx configuration
```

## 🔧 Troubleshooting

### Build fails during scraping
- Check internet connection
- Verify Cosmopolitan website accessibility
- Check Docker has enough memory (recommend 2GB+)

### Data not loading
- Verify `all-sex-positions.json` exists in the container
- Check nginx configuration
- Ensure port 80 is exposed

### Performance issues
- Increase Docker memory allocation
- Use SSD storage for faster builds
- Consider using multi-stage builds for optimization

## 🎯 Benefits

✅ **Automated data collection** - No manual scraping needed  
✅ **Consistent builds** - Same data across all deployments  
✅ **Offline capability** - App works without internet  
✅ **Easy deployment** - Single container with everything included  
✅ **Version control** - Data version tied to container version  
✅ **Scalable** - Easy to deploy to multiple environments
