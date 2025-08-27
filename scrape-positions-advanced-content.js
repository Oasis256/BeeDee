import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapePositionsAdvancedContent() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set user agent to avoid detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  // Test with one URL first to analyze the structure
  const testUrl = 'https://www.cosmopolitan.com/sex-love/g4967/oral-sex-positions-you-need/';
  
  try {
    console.log(`🔍 Analyzing page structure from: ${testUrl}`);
    await page.goto(testUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 8000));

    // First, let's analyze the page structure
    const pageAnalysis = await page.evaluate(() => {
      const analysis = {
        title: document.title,
        headings: [],
        paragraphs: [],
        images: [],
        structure: []
      };

      // Get all headings
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      headings.forEach((heading, index) => {
        analysis.headings.push({
          index,
          tag: heading.tagName,
          text: heading.textContent.trim(),
          id: heading.id,
          className: heading.className
        });
      });

      // Get all paragraphs
      const paragraphs = Array.from(document.querySelectorAll('p'));
      paragraphs.forEach((p, index) => {
        const text = p.textContent.trim();
        if (text.length > 20) {
          analysis.paragraphs.push({
            index,
            text: text.substring(0, 200),
            className: p.className,
            parentTag: p.parentElement?.tagName
          });
        }
      });

      // Get all images
      const images = Array.from(document.querySelectorAll('img'));
      images.forEach((img, index) => {
        if (img.src && img.width > 100) {
          analysis.images.push({
            index,
            src: img.src,
            alt: img.alt,
            width: img.width,
            height: img.height
          });
        }
      });

      // Analyze the structure around position headings
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
        const structure = {
          position: index + 1,
          title: positionTitle,
          heading: {
            tag: heading.tagName,
            className: heading.className,
            id: heading.id
          },
          siblings: [],
          parent: {
            tag: heading.parentElement?.tagName,
            className: heading.parentElement?.className,
            id: heading.parentElement?.id
          }
        };

        // Look at siblings
        let currentElement = heading.nextElementSibling;
        let siblingCount = 0;
        while (currentElement && currentElement.tagName !== 'H2' && siblingCount < 10) {
          structure.siblings.push({
            tag: currentElement.tagName,
            className: currentElement.className,
            text: currentElement.textContent.trim().substring(0, 100),
            hasText: currentElement.textContent.trim().length > 10
          });
          currentElement = currentElement.nextElementSibling;
          siblingCount++;
        }

        analysis.structure.push(structure);
      });

      return analysis;
    });

    console.log('Page Structure Analysis:');
    console.log('Title:', pageAnalysis.title);
    console.log('Total headings:', pageAnalysis.headings.length);
    console.log('Total paragraphs:', pageAnalysis.paragraphs.length);
    console.log('Total images:', pageAnalysis.images.length);
    console.log('Position structures found:', pageAnalysis.structure.length);

    // Show the structure analysis
    console.log('\nStructure Analysis for first 3 positions:');
    pageAnalysis.structure.slice(0, 3).forEach(pos => {
      console.log(`\n${pos.position}. ${pos.title}`);
      console.log(`   Heading: ${pos.heading.tag} (${pos.heading.className})`);
      console.log(`   Parent: ${pos.parent.tag} (${pos.parent.className})`);
      console.log(`   Siblings: ${pos.siblings.length}`);
      pos.siblings.forEach((sibling, i) => {
        if (sibling.hasText) {
          console.log(`     ${i + 1}. ${sibling.tag}: ${sibling.text}...`);
        }
      });
    });

    // Now try to extract content based on the analysis
    const contentData = await page.evaluate(() => {
      const data = {
        title: document.title,
        positions: []
      };

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
        
        // Find images
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
        
        // Look for content in different ways
        let currentElement = heading.nextElementSibling;
        let allText = [];
        
        // Method 1: Look for paragraphs
        while (currentElement && currentElement.tagName !== 'H2' && currentElement.tagName !== 'H3') {
          if (currentElement.tagName === 'P' && currentElement.textContent.trim()) {
            const text = currentElement.textContent.trim();
            if (text.length > 10 && text.length < 1000) {
              allText.push(text);
            }
          }
          currentElement = currentElement.nextElementSibling;
        }
        
        // Method 2: Look for div content
        if (allText.length === 0) {
          currentElement = heading.nextElementSibling;
          while (currentElement && currentElement.tagName !== 'H2' && currentElement.tagName !== 'H3') {
            if (currentElement.tagName === 'DIV' && currentElement.textContent.trim()) {
              const text = currentElement.textContent.trim();
              if (text.length > 10 && text.length < 1000) {
                allText.push(text);
              }
            }
            currentElement = currentElement.nextElementSibling;
          }
        }
        
        // Method 3: Look for any text content
        if (allText.length === 0) {
          currentElement = heading.nextElementSibling;
          while (currentElement && currentElement.tagName !== 'H2' && currentElement.tagName !== 'H3') {
            const text = currentElement.textContent.trim();
            if (text.length > 10 && text.length < 1000 && 
                !text.includes('advertisement') && 
                !text.includes('sponsored')) {
              allText.push(text);
            }
            currentElement = currentElement.nextElementSibling;
          }
        }

        // Process the extracted text
        if (allText.length > 0) {
          description = allText[0];
          
          // Look for instruction keywords
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
          
          if (!howToDoIt && allText.length > 1) {
            howToDoIt = allText[1];
          }
        }

        data.positions.push({
          number: positionNumber,
          title: positionTitle,
          description: description.trim(),
          howToDoIt: howToDoIt.trim(),
          images: foundImages,
          textFound: allText.length
        });
      });

      return data;
    });

    console.log('\nContent Extraction Results:');
    console.log('Positions with content:', contentData.positions.filter(p => p.description || p.howToDoIt).length);
    
    // Show sample positions with content
    console.log('\nSample positions with content:');
    contentData.positions.slice(0, 5).forEach(pos => {
      console.log(`\n${pos.number}. ${pos.title}`);
      console.log(`   Text blocks found: ${pos.textFound}`);
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
        console.log(`   Images: ${pos.images.length}`);
      } else {
        console.log(`   Images: None found`);
      }
    });

    // Save the analysis and content
    const outputData = {
      analysis: pageAnalysis,
      content: contentData
    };

    fs.writeFileSync('page-analysis.json', JSON.stringify(outputData, null, 2));
    console.log('\n📁 Saved page analysis to page-analysis.json');

  } catch (error) {
    console.error('Error during advanced analysis:', error);
  } finally {
    await browser.close();
  }
}

// Run the advanced scraper
scrapePositionsAdvancedContent();
