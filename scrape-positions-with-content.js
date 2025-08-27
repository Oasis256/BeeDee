import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapePositionsWithContent() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set user agent to avoid detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Test with one URL first to perfect the content extraction
  const testUrl = 'https://www.cosmopolitan.com/sex-love/g4967/oral-sex-positions-you-need/';
  
  try {
    console.log(`🔍 Scraping positions with content from: ${testUrl}`);
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
        let foundImages = [];
        
        // Method 1: Look in the same container as the heading
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
        
        // Method 3: Find closest image by proximity
        if (foundImages.length === 0) {
          const headingRect = heading.getBoundingClientRect();
          let closestImage = null;
          let closestDistance = Infinity;
          
          allImages.forEach(img => {
            const imgRect = img.element.getBoundingClientRect();
            const distance = Math.abs(headingRect.top - imgRect.top) + Math.abs(headingRect.left - imgRect.left);
            
            if (distance < closestDistance && distance < 500) {
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
        
        // IMPROVED CONTENT EXTRACTION
        // Look for content between this heading and the next heading
        let currentElement = heading.nextElementSibling;
        let allText = [];
        let paragraphCount = 0;
        
        while (currentElement && currentElement.tagName !== 'H2' && currentElement.tagName !== 'H3') {
          if (currentElement.tagName === 'P' && currentElement.textContent.trim()) {
            const text = currentElement.textContent.trim();
            if (text.length > 10 && text.length < 1000) {
              allText.push(text);
              paragraphCount++;
            }
          }
          currentElement = currentElement.nextElementSibling;
        }

        // Process the extracted text to separate description and instructions
        if (allText.length > 0) {
          // First paragraph is usually the description
          description = allText[0];
          
          // Look for instruction keywords in subsequent paragraphs
          for (let i = 1; i < allText.length; i++) {
            const text = allText[i].toLowerCase();
            if (text.includes('how to') || 
                text.includes('instructions') ||
                text.includes('step') ||
                text.includes('position') ||
                text.includes('start') ||
                text.includes('begin') ||
                text.includes('first') ||
                text.includes('then') ||
                text.includes('next') ||
                text.includes('finally')) {
              howToDoIt = allText[i];
              break;
            }
          }
          
          // If no specific instructions found, use the second paragraph
          if (!howToDoIt && allText.length > 1) {
            howToDoIt = allText[1];
          }
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

    console.log('Enhanced Content Analysis:');
    console.log('Title:', enhancedData.title);
    console.log('All images found:', enhancedData.allImages.length);
    console.log('Positions found:', enhancedData.positions.length);

    // Show sample positions with their content
    console.log('\nSample positions with content:');
    enhancedData.positions.slice(0, 5).forEach(pos => {
      console.log(`\n${pos.number}. ${pos.title}`);
      if (pos.description) {
        console.log(`   Description: ${pos.description.substring(0, 100)}...`);
      } else {
        console.log(`   Description: None found`);
      }
      if (pos.howToDoIt) {
        console.log(`   How To: ${pos.howToDoIt.substring(0, 100)}...`);
      } else {
        console.log(`   How To: None found`);
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

    fs.writeFileSync('positions-with-content.json', JSON.stringify([positionsData], null, 2));
    fs.copyFileSync('positions-with-content.json', 'public/positions-with-content.json');
    console.log('\n📁 Saved positions with content to public/positions-with-content.json');

  } catch (error) {
    console.error('Error during enhanced scraping:', error);
  } finally {
    await browser.close();
  }
}

// Run the enhanced scraper
scrapePositionsWithContent();
