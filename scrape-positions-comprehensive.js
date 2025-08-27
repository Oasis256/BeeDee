import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapePositionsComprehensive() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set user agent to avoid detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Test with one URL first
  const testUrl = 'https://www.cosmopolitan.com/sex-love/g4967/oral-sex-positions-you-need/';
  
  try {
    console.log(`🔍 Comprehensive scraping from: ${testUrl}`);
    await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 8000)); // Wait longer for content to load

    // Comprehensive content extraction
    const comprehensiveData = await page.evaluate(() => {
      const data = {
        title: document.title,
        positions: [],
        allText: document.body.textContent,
        structure: {}
      };

      // Get all headings
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      data.structure.headings = headings.map(h => ({
        tag: h.tagName,
        text: h.textContent.trim(),
        className: h.className
      }));

      // Get all paragraphs
      const paragraphs = Array.from(document.querySelectorAll('p'));
      data.structure.paragraphs = paragraphs.map(p => ({
        text: p.textContent.trim(),
        className: p.className,
        length: p.textContent.trim().length
      })).filter(p => p.length > 20 && p.length < 1000);

      // Get all images
      const images = Array.from(document.querySelectorAll('img'));
      data.structure.images = images.map(img => ({
        src: img.src,
        alt: img.alt || '',
        width: img.width,
        height: img.height
      })).filter(img => 
        img.src && 
        !img.src.includes('logo') && 
        !img.src.includes('ad') && 
        img.width > 100 && 
        img.height > 100
      );

      // Try multiple methods to find positions
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
        
        // Method 1: Look for content in the same container
        let description = '';
        let howToDoIt = '';
        let images = [];
        
        // Look for parent container
        let container = heading.parentElement;
        while (container && container.tagName !== 'BODY') {
          const paragraphs = container.querySelectorAll('p');
          const containerImages = container.querySelectorAll('img');
          
          if (paragraphs.length > 0 || containerImages.length > 0) {
            // Found a container with content
            paragraphs.forEach((p, pIndex) => {
              const text = p.textContent.trim();
              if (text.length > 20 && text.length < 500) {
                if (pIndex === 0) {
                  description = text;
                } else if (text.toLowerCase().includes('how to') || 
                          text.toLowerCase().includes('instructions') ||
                          text.toLowerCase().includes('step')) {
                  howToDoIt = text;
                } else if (!description) {
                  description = text;
                }
              }
            });
            
            containerImages.forEach(img => {
              if (img.src && !img.src.includes('logo') && img.width > 100) {
                images.push({
                  src: img.src,
                  alt: img.alt || ''
                });
              }
            });
            
            break;
          }
          
          container = container.parentElement;
        }
        
        // Method 2: Look for content after the heading
        if (!description) {
          let currentElement = heading.nextElementSibling;
          let paragraphCount = 0;
          
          while (currentElement && currentElement.tagName !== 'H2' && currentElement.tagName !== 'H3') {
            if (currentElement.tagName === 'P' && currentElement.textContent.trim()) {
              const text = currentElement.textContent.trim();
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
            } else if (currentElement.tagName === 'IMG' && !images.length) {
              if (currentElement.src && !currentElement.src.includes('logo') && currentElement.width > 100) {
                images.push({
                  src: currentElement.src,
                  alt: currentElement.alt || ''
                });
              }
            }
            currentElement = currentElement.nextElementSibling;
          }
        }
        
        // Method 3: Look for content in nearby elements
        if (!description) {
          const nearbyElements = heading.parentElement.querySelectorAll('p, div');
          nearbyElements.forEach(el => {
            const text = el.textContent.trim();
            if (text.length > 50 && text.length < 300 && !description) {
              description = text;
            }
          });
        }

        data.positions.push({
          number: positionNumber,
          title: positionTitle,
          description: description.trim(),
          howToDoIt: howToDoIt.trim(),
          images: images
        });
      });

      return data;
    });

    console.log('Comprehensive Analysis:');
    console.log('Title:', comprehensiveData.title);
    console.log('Headings found:', comprehensiveData.structure.headings.length);
    console.log('Paragraphs found:', comprehensiveData.structure.paragraphs.length);
    console.log('Images found:', comprehensiveData.structure.images.length);
    console.log('Positions found:', comprehensiveData.positions.length);

    // Show sample positions
    console.log('\nSample positions:');
    comprehensiveData.positions.slice(0, 5).forEach(pos => {
      console.log(`\n${pos.number}. ${pos.title}`);
      if (pos.description) {
        console.log(`   Description: ${pos.description.substring(0, 100)}...`);
      }
      if (pos.howToDoIt) {
        console.log(`   How To: ${pos.howToDoIt.substring(0, 100)}...`);
      }
      if (pos.images.length > 0) {
        console.log(`   Images: ${pos.images.length}`);
      }
    });

    // Save comprehensive analysis
    fs.writeFileSync('comprehensive-analysis.json', JSON.stringify(comprehensiveData, null, 2));
    console.log('\n📁 Saved comprehensive analysis to comprehensive-analysis.json');

    // Also save just the positions for the frontend
    const positionsData = {
      category: 'Oral Positions',
      title: comprehensiveData.title,
      description: 'Comprehensive oral sex positions guide with detailed instructions.',
      images: comprehensiveData.structure.images.slice(0, 20),
      positions: comprehensiveData.positions,
      originalUrl: testUrl,
      scrapedCount: comprehensiveData.positions.length
    };

    fs.writeFileSync('comprehensive-positions.json', JSON.stringify([positionsData], null, 2));
    fs.copyFileSync('comprehensive-positions.json', 'public/comprehensive-positions.json');
    console.log('📁 Saved positions data to public/comprehensive-positions.json');

  } catch (error) {
    console.error('Error during comprehensive scraping:', error);
  } finally {
    await browser.close();
  }
}

// Run the comprehensive scraper
scrapePositionsComprehensive();
