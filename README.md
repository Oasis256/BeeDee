# BDSM Compatibility Checker

A modern React application for analyzing and comparing BDSM role compatibility test results.

## Features

- **Multiple Test Comparison**: Compare results from multiple BDSM compatibility tests
- **Role Compatibility Matrix**: Interactive matrix showing compatibility between 25 different BDSM roles
- **Visual Analytics**: Radar charts, percentage breakdowns, and detailed comparisons
- **Smart Recommendations**: Smart suggestions based on compatibility results
- **Modern UI**: Glass morphism design with smooth animations
- **Custom Test Names**: Add custom names and emojis to your test results

## Docker Support

This project is fully containerized and can be run using Docker.

### Quick Start

#### Production Build
```bash
# Build and run production version
docker-compose --profile prod up --build

# Access the application at http://localhost
```

#### Development Build
```bash
# Build and run development version with hot reloading
docker-compose --profile dev up --build

# Access the application at http://localhost:3000
```

#### Custom Port
```bash
# Run production version on port 8080
docker-compose --profile prod-custom up --build

# Access the application at http://localhost:8080
```

### Manual Docker Commands

#### Production
```bash
# Build the production image
docker build -t bdsm-compatibility-checker .

# Run the container
docker run -p 80:80 bdsm-compatibility-checker
```

#### Development
```bash
# Build the development image
docker build -f Dockerfile.dev -t bdsm-compatibility-checker:dev .

# Run the development container
docker run -p 3000:3000 -v $(pwd):/app bdsm-compatibility-checker:dev
```

### Docker Features

- **Multi-stage builds** for optimized production images
- **Nginx server** for production serving with gzip compression
- **Security headers** for enhanced security
- **Health check endpoint** at `/health`
- **Hot reloading** in development mode
- **Volume mounting** for development file changes

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd bdsm-compatibility-checker

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
```

## Usage

1. **Add Test Results**: Enter your BDSM compatibility test results by providing the test ID
2. **Compare Results**: Add multiple test results to compare compatibility
3. **Analyze Compatibility**: Use the various analysis tools to understand your compatibility
4. **Get Recommendations**: View smart suggestions for activities and scenarios

## Analysis Tools

- **Comparison Graph**: Side-by-side comparison of multiple test results
- **Percentage Breakdown**: Complete breakdown of all roles for each test
- **Shared Interests**: Analysis of shared interests across test results
- **Compatibility Score**: Overall compatibility score between two results
- **Role Compatibility Matrix**: Interactive matrix showing role compatibility
- **Smart Recommendations**: Smart activity and scenario suggestions
- **Radar Chart**: Visual comparison of top role interests
- **Scenario Builder**: Build custom BDSM scenarios based on compatibility

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Roadmap

- **More Analysis Types**: Add different compatibility algorithms
- **Export Results**: Save compatibility reports
- **User Profiles**: Store favorite test IDs
- **Social Features**: Share results with friends
