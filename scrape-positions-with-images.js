import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapePositionsWithImages() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set user agent to avoid detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const allDetailedPositions = [];

  // Test with one URL first to perfect the image matching
  const testUrl = 'https://www.cosmopolitan.com/sex-love/g4967/oral-sex-positions-you-need/';
  
  try {
    console.log(`🔍 Scraping positions with matched images from: ${testUrl}`);
    await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 8000));

    const enhancedData = await page.evaluate(() => {
      const data = {
        title: document.title,
        positions: [],
        allImages: []
      };

      // Get all images first
      const allImages = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.alt || '',
        width: img.width,
        height: img.height,
        element: img
      })).filter(img => 
        img.src && 
        !img.src.includes('logo') && 
        !img.src.includes('ad') && 
        !img.src.includes('icon') &&
        !img.src.includes('search') &&
        !img.src.includes('close') &&
        img.width > 100 && 
        img.height > 100
      );

      data.allImages = allImages;

      // Find position headings
      const positionHeadings = Array.from(document.querySelectorAll('h2')).filter(el => {
        const text = el.textContent.trim();
        return text && 
               !text.includes('Sex Positions') && 
               !text.includes('Oral Sex') &&
               text.length > 3 && 
               text.length < 100;
      });

      positionHeadings.forEach((heading, index) => {
        const positionTitle = heading.textContent.trim();
        const positionNumber = index + 1;
        
        let description = '';
        let howToDoIt = '';
        let positionImages = [];
        
        // Method 1: Find images that are specifically associated with this position
        // Look for images that are in the same container or nearby
        let foundImages = [];
        
        // Look in the same container as the heading
        let container = heading.parentElement;
        while (container && container.tagName !== 'BODY') {
          const containerImages = container.querySelectorAll('img');
          containerImages.forEach(img => {
            if (img.src && !img.src.includes('logo') && img.width > 100) {
              foundImages.push({
                src: img.src,
                alt: img.alt || '',
                width: img.width,
                height: img.height
              });
            }
          });
          
          if (foundImages.length > 0) {
            break;
          }
          
          container = container.parentElement;
        }
        
        // Method 2: Look for images between this heading and the next heading
        if (foundImages.length === 0) {
          let currentElement = heading.nextElementSibling;
          while (currentElement && currentElement.tagName !== 'H2' && currentElement.tagName !== 'H3') {
            if (currentElement.tagName === 'IMG') {
              if (currentElement.src && !currentElement.src.includes('logo') && currentElement.width > 100) {
                foundImages.push({
                  src: currentElement.src,
                  alt: currentElement.alt || '',
                  width: currentElement.width,
                  height: currentElement.height
                });
              }
            }
            currentElement = currentElement.nextElementSibling;
          }
        }
        
        // Method 3: Look for images that might be associated by proximity
        if (foundImages.length === 0) {
          // Find the closest image to this heading
          const headingRect = heading.getBoundingClientRect();
          let closestImage = null;
          let closestDistance = Infinity;
          
          allImages.forEach(img => {
            const imgRect = img.element.getBoundingClientRect();
            const distance = Math.abs(headingRect.top - imgRect.top) + Math.abs(headingRect.left - imgRect.left);
            
            if (distance < closestDistance && distance < 500) { // Within 500px
              closestDistance = distance;
              closestImage = img;
            }
          });
          
          if (closestImage) {
            foundImages.push({
              src: closestImage.src,
              alt: closestImage.alt,
              width: closestImage.width,
              height: closestImage.height
            });
          }
        }
        
        // Extract description and instructions
        let descElement = heading.nextElementSibling;
        let paragraphCount = 0;
        
        while (descElement && descElement.tagName !== 'H2' && descElement.tagName !== 'H3') {
          if (descElement.tagName === 'P' && descElement.textContent.trim()) {
            const text = descElement.textContent.trim();
            if (text.length > 20 && text.length < 500) {
              if (paragraphCount === 0) {
                description = text;
              } else if (text.toLowerCase().includes('how to') || 
                        text.toLowerCase().includes('instructions') ||
                        text.toLowerCase().includes('step')) {
                howToDoIt = text;
              }
              paragraphCount++;
            }
          }
          descElement = descElement.nextElementSibling;
        }

        data.positions.push({
          number: positionNumber,
          title: positionTitle,
          description: description.trim(),
          howToDoIt: howToDoIt.trim(),
          images: foundImages
        });
      });

      return data;
    });

    console.log('Enhanced Analysis:');
    console.log('Title:', enhancedData.title);
    console.log('All images found:', enhancedData.allImages.length);
    console.log('Positions found:', enhancedData.positions.length);

    // Show sample positions with their images
    console.log('\nSample positions with images:');
    enhancedData.positions.slice(0, 5).forEach(pos => {
      console.log(`\n${pos.number}. ${pos.title}`);
      if (pos.description) {
        console.log(`   Description: ${pos.description.substring(0, 100)}...`);
      }
      if (pos.howToDoIt) {
        console.log(`   How To: ${pos.howToDoIt.substring(0, 100)}...`);
      }
      if (pos.images.length > 0) {
        console.log(`   Images: ${pos.images.length} - ${pos.images[0].src.substring(0, 80)}...`);
      } else {
        console.log(`   Images: None found`);
      }
    });

    // Save enhanced data
    const positionsData = {
      category: 'Oral Positions',
      title: enhancedData.title,
      description: 'Comprehensive oral sex positions guide with detailed instructions and matched images.',
      images: enhancedData.allImages.slice(0, 20).map(img => ({
        src: img.src,
        alt: img.alt,
        width: img.width,
        height: img.height
      })),
      positions: enhancedData.positions,
      originalUrl: testUrl,
      scrapedCount: enhancedData.positions.length
    };

    fs.writeFileSync('positions-with-images.json', JSON.stringify([positionsData], null, 2));
    fs.copyFileSync('positions-with-images.json', 'public/positions-with-images.json');
    console.log('\n📁 Saved positions with matched images to public/positions-with-images.json');

  } catch (error) {
    console.error('Error during enhanced scraping:', error);
  } finally {
    await browser.close();
  }
}

// Run the enhanced scraper
scrapePositionsWithImages();
