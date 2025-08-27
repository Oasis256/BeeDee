import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapePositionsAdvanced() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set user agent to avoid detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const allDetailedPositions = [];

  // Test with one URL first to understand the structure
  const testUrl = 'https://www.cosmopolitan.com/sex-love/g4967/oral-sex-positions-you-need/';
  
  try {
    console.log(`🔍 Analyzing structure of: ${testUrl}`);
    await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 5000));

    // First, let's analyze the page structure
    const pageAnalysis = await page.evaluate(() => {
      const analysis = {
        title: document.title,
        headings: [],
        paragraphs: [],
        images: [],
        potentialPositions: []
      };

      // Get all headings
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      headings.forEach(h => {
        analysis.headings.push({
          tag: h.tagName,
          text: h.textContent.trim(),
          className: h.className,
          id: h.id
        });
      });

      // Get all paragraphs
      const paragraphs = Array.from(document.querySelectorAll('p'));
      paragraphs.forEach(p => {
        const text = p.textContent.trim();
        if (text.length > 20 && text.length < 1000) {
          analysis.paragraphs.push({
            text: text,
            className: p.className
          });
        }
      });

      // Get all images
      const images = Array.from(document.querySelectorAll('img'));
      images.forEach(img => {
        analysis.images.push({
          src: img.src,
          alt: img.alt || '',
          width: img.width,
          height: img.height
        });
      });

      // Look for potential position patterns
      const allText = document.body.textContent;
      
      // Look for numbered patterns like "1.", "2.", "27.", etc.
      const numberedMatches = allText.match(/\d+\.\s+[A-Z][^.!?]*[.!?]/g);
      if (numberedMatches) {
        analysis.potentialPositions = numberedMatches.slice(0, 50);
      }

      return analysis;
    });

    console.log('Page Analysis:');
    console.log('Title:', pageAnalysis.title);
    console.log('Headings found:', pageAnalysis.headings.length);
    console.log('Paragraphs found:', pageAnalysis.paragraphs.length);
    console.log('Images found:', pageAnalysis.images.length);
    console.log('Potential numbered positions:', pageAnalysis.potentialPositions.length);

    // Show some examples
    console.log('\nSample headings:');
    pageAnalysis.headings.slice(0, 5).forEach(h => {
      console.log(`  ${h.tag}: ${h.text}`);
    });

    console.log('\nSample paragraphs:');
    pageAnalysis.paragraphs.slice(0, 5).forEach(p => {
      console.log(`  ${p.text.substring(0, 100)}...`);
    });

    console.log('\nSample potential positions:');
    pageAnalysis.potentialPositions.slice(0, 5).forEach(pos => {
      console.log(`  ${pos}`);
    });

    // Now try to extract positions using multiple methods
    const extractedPositions = await page.evaluate(() => {
      const positions = [];

      // Method 1: Look for numbered headings with specific patterns
      const numberedHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).filter(el => {
        const text = el.textContent.trim();
        return /^\d+\./.test(text) || /^\d+\)/.test(text) || /^\d+\s/.test(text);
      });

      numberedHeadings.forEach((heading, index) => {
        const text = heading.textContent.trim();
        const number = text.match(/^(\d+)/)?.[1] || (index + 1);
        const title = text.replace(/^\d+[\.\)]\s*/, '');
        
        // Find associated content
        let description = '';
        let howToDoIt = '';
        
        let currentElement = heading.nextElementSibling;
        while (currentElement && currentElement.tagName !== 'H1' && currentElement.tagName !== 'H2' && currentElement.tagName !== 'H3') {
          if (currentElement.tagName === 'P' && currentElement.textContent.trim()) {
            const content = currentElement.textContent.trim();
            if (content.toLowerCase().includes('how to') || content.toLowerCase().includes('instructions')) {
              howToDoIt = content;
            } else if (!description) {
              description = content;
            }
          }
          currentElement = currentElement.nextElementSibling;
        }

        positions.push({
          number: parseInt(number),
          title: title,
          description: description,
          howToDoIt: howToDoIt,
          method: 'numbered-heading'
        });
      });

      // Method 2: Look for any text that starts with numbers
      if (positions.length === 0) {
        const allElements = Array.from(document.querySelectorAll('*'));
        const numberedElements = allElements.filter(el => {
          const text = el.textContent.trim();
          return /^\d+\./.test(text) && text.length > 10 && text.length < 200;
        });

        numberedElements.forEach((element, index) => {
          const text = element.textContent.trim();
          const number = text.match(/^(\d+)/)?.[1] || (index + 1);
          const title = text.replace(/^\d+\.\s*/, '');
          
          positions.push({
            number: parseInt(number),
            title: title,
            description: '',
            howToDoIt: '',
            method: 'numbered-text'
          });
        });
      }

      // Method 3: Look for position-related headings
      if (positions.length === 0) {
        const positionHeadings = Array.from(document.querySelectorAll('h2, h3, h4')).filter(el => {
          const text = el.textContent.trim();
          return text.includes('Position') || text.includes('Sex') || text.includes('Style') || 
                 text.includes('The ') || text.includes('How to') || text.includes('1') || text.includes('2');
        });

        positionHeadings.forEach((heading, index) => {
          const title = heading.textContent.trim();
          
          // Find associated content
          let description = '';
          let howToDoIt = '';
          
          let currentElement = heading.nextElementSibling;
          while (currentElement && currentElement.tagName !== 'H2' && currentElement.tagName !== 'H3') {
            if (currentElement.tagName === 'P' && currentElement.textContent.trim()) {
              const content = currentElement.textContent.trim();
              if (content.toLowerCase().includes('how to') || content.toLowerCase().includes('instructions')) {
                howToDoIt = content;
              } else if (!description) {
                description = content;
              }
            }
            currentElement = currentElement.nextElementSibling;
          }

          positions.push({
            number: index + 1,
            title: title,
            description: description,
            howToDoIt: howToDoIt,
            method: 'position-heading'
          });
        });
      }

      // Method 4: Look for any content that might be position descriptions
      if (positions.length === 0) {
        const paragraphs = Array.from(document.querySelectorAll('p')).filter(p => {
          const text = p.textContent.trim();
          return text.length > 50 && text.length < 500 && 
                 !text.includes('advertisement') && !text.includes('click here') &&
                 (text.includes('position') || text.includes('sex') || text.includes('style'));
        });

        paragraphs.forEach((paragraph, index) => {
          const text = paragraph.textContent.trim();
          
          positions.push({
            number: index + 1,
            title: `Position ${index + 1}`,
            description: text,
            howToDoIt: '',
            method: 'paragraph-content'
          });
        });
      }

      return positions;
    });

    console.log(`\n✅ Extracted ${extractedPositions.length} positions using advanced methods:`);
    extractedPositions.forEach(pos => {
      console.log(`  ${pos.number}. ${pos.title} (${pos.method})`);
      if (pos.description) console.log(`     Desc: ${pos.description.substring(0, 100)}...`);
      if (pos.howToDoIt) console.log(`     How: ${pos.howToDoIt.substring(0, 100)}...`);
    });

    // Save the analysis for debugging
    fs.writeFileSync('page-analysis.json', JSON.stringify({
      analysis: pageAnalysis,
      extractedPositions: extractedPositions
    }, null, 2));

    console.log('\n📁 Saved page analysis to page-analysis.json for debugging');

  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }
}

// Run the advanced scraper
scrapePositionsAdvanced();
