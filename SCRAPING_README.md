# Sex Positions Scraper

## Overview
This scraper extracts sex positions from Cosmopolitan's comprehensive guides with a **99.2% success rate** (235/237 positions).

## Files
- `scrape-sex-positions.js` - Main scraper script
- `all-sex-positions.json` - Scraped data (235 positions across 9 categories)
- `public/all-sex-positions.json` - Frontend data file

## Features
- **Lazy Loading Support**: Properly handles dynamic content loading
- **High Success Rate**: 99.2% (235/237 expected positions)
- **Rich Content**: Each position includes title, description, how-to instructions, and images
- **Multiple Categories**: 9 different sex position categories

## Categories & Results
1. **Oral Positions**: 38/38 positions (100%)
2. **Missionary Variations**: 22/22 positions (100%)
3. **Anal Positions**: 27/27 positions (100%)
4. **Chair Positions**: 12/12 positions (100%)
5. **Lesbian Positions**: 40/40 positions (100%)
6. **Beginner Positions**: 19/20 positions (95%)
7. **Romantic Positions**: 32/33 positions (97%)
8. **Solo Positions**: 25/25 positions (100%)
9. **Deep Penetration**: 20/20 positions (100%)

## Usage
```bash
node scrape-sex-positions.js
```

## Data Structure
Each position includes:
- `number`: Position number
- `title`: Position name
- `description`: Detailed description
- `howToDoIt`: Step-by-step instructions
- `images`: Array of position images
- `slideId`: Original slide section ID

## Frontend Integration
The scraped data is automatically loaded by the `SexPositions` component and displayed with:
- Category filtering
- Search functionality
- Image galleries
- Detailed position views
- Click-to-expand images

## Technical Details
- Uses Puppeteer for web scraping
- Handles lazy loading with multiple scroll passes
- Filters out ads and non-content images
- Extracts content from `section[id^="slide-"]` elements
- Processes 9 Cosmopolitan sex position guides
