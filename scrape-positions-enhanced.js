import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapePositionsEnhanced() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set user agent to avoid detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const allDetailedPositions = [];

  // Test with one URL first to understand the structure better
  const testUrl = 'https://www.cosmopolitan.com/sex-love/g4967/oral-sex-positions-you-need/';
  
  try {
    console.log(`🔍 Enhanced scraping from: ${testUrl}`);
    await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 5000));

    // First, let's analyze the page structure more carefully
    const pageStructure = await page.evaluate(() => {
      const structure = {
        title: document.title,
        headings: [],
        contentBlocks: []
      };

      // Get all headings
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      headings.forEach(h => {
        structure.headings.push({
          tag: h.tagName,
          text: h.textContent.trim(),
          className: h.className,
          id: h.id
        });
      });

      // Look for content blocks around headings
      const h2Headings = Array.from(document.querySelectorAll('h2'));
      h2Headings.forEach((heading, index) => {
        const text = heading.textContent.trim();
        
        // Skip main article title
        if (text.includes('Sex Positions') || text.includes('Oral Sex')) {
          return;
        }

        const contentBlock = {
          heading: text,
          headingIndex: index,
          paragraphs: [],
          images: []
        };

        // Find all content between this heading and the next heading
        let currentElement = heading.nextElementSibling;
        while (currentElement && currentElement.tagName !== 'H2' && currentElement.tagName !== 'H3') {
          if (currentElement.tagName === 'P' && currentElement.textContent.trim()) {
            contentBlock.paragraphs.push(currentElement.textContent.trim());
          } else if (currentElement.tagName === 'IMG') {
            contentBlock.images.push({
              src: currentElement.src,
              alt: currentElement.alt || ''
            });
          }
          currentElement = currentElement.nextElementSibling;
        }

        if (contentBlock.paragraphs.length > 0 || contentBlock.images.length > 0) {
          structure.contentBlocks.push(contentBlock);
        }
      });

      return structure;
    });

    console.log('Page Structure Analysis:');
    console.log('Title:', pageStructure.title);
    console.log('Headings found:', pageStructure.headings.length);
    console.log('Content blocks found:', pageStructure.contentBlocks.length);

    // Show some examples
    console.log('\nSample content blocks:');
    pageStructure.contentBlocks.slice(0, 3).forEach((block, index) => {
      console.log(`\n${index + 1}. ${block.heading}`);
      console.log(`   Paragraphs: ${block.paragraphs.length}`);
      console.log(`   Images: ${block.images.length}`);
      if (block.paragraphs.length > 0) {
        console.log(`   First paragraph: ${block.paragraphs[0].substring(0, 100)}...`);
      }
    });

    // Now extract positions with enhanced content extraction
    const extractedPositions = await page.evaluate(() => {
      const positions = [];

      // Get all H2 headings that look like position titles
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
        
        // Find all content between this heading and the next heading
        let description = '';
        let howToDoIt = '';
        let images = [];
        
        let currentElement = heading.nextElementSibling;
        let paragraphCount = 0;
        
        while (currentElement && currentElement.tagName !== 'H2' && currentElement.tagName !== 'H3') {
          if (currentElement.tagName === 'P' && currentElement.textContent.trim()) {
            const text = currentElement.textContent.trim();
            
            // Skip very short paragraphs (likely navigation or ads)
            if (text.length < 20) {
              currentElement = currentElement.nextElementSibling;
              continue;
            }
            
            // First paragraph is usually the description
            if (paragraphCount === 0) {
              description = text;
            } 
            // Second paragraph might be "How To Do It" or additional description
            else if (paragraphCount === 1) {
              if (text.toLowerCase().includes('how to') || 
                  text.toLowerCase().includes('instructions') ||
                  text.toLowerCase().includes('step') ||
                  text.toLowerCase().includes('position')) {
                howToDoIt = text;
              } else {
                // If no "how to" keywords, add to description
                description += ' ' + text;
              }
            }
            // Additional paragraphs
            else {
              if (text.toLowerCase().includes('how to') || 
                  text.toLowerCase().includes('instructions') ||
                  text.toLowerCase().includes('step')) {
                howToDoIt = text;
              } else if (!howToDoIt) {
                // If we still don't have "how to", use this as description
                description += ' ' + text;
              }
            }
            
            paragraphCount++;
          } else if (currentElement.tagName === 'IMG') {
            images.push({
              src: currentElement.src,
              alt: currentElement.alt || ''
            });
          }
          
          currentElement = currentElement.nextElementSibling;
        }

        positions.push({
          number: positionNumber,
          title: positionTitle,
          description: description.trim(),
          howToDoIt: howToDoIt.trim(),
          images: images
        });
      });

      return positions;
    });

    console.log(`\n✅ Enhanced extraction found ${extractedPositions.length} positions:`);
    extractedPositions.slice(0, 5).forEach(pos => {
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

    // Save the enhanced analysis
    fs.writeFileSync('enhanced-analysis.json', JSON.stringify({
      structure: pageStructure,
      positions: extractedPositions
    }, null, 2));

    console.log('\n📁 Saved enhanced analysis to enhanced-analysis.json');

  } catch (error) {
    console.error('Error during enhanced scraping:', error);
  } finally {
    await browser.close();
  }
}

// Run the enhanced scraper
scrapePositionsEnhanced();
