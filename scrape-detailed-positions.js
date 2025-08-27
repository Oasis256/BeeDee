import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeDetailedPositions() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set user agent to avoid detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const allDetailedPositions = [];

  // URLs from the successful scraping
  const positionUrls = [
    {
      url: 'https://www.cosmopolitan.com/sex-love/g4967/oral-sex-positions-you-need/',
      category: 'Oral Positions',
      expectedCount: 38
    },
    {
      url: 'https://www.cosmopolitan.com/sex-love/positions/g63107690/missionary-sex-positions-list/',
      category: 'Missionary Variations',
      expectedCount: 22
    },
    {
      url: 'https://www.cosmopolitan.com/sex-love/positions/g5025/anal-sex-positions/',
      category: 'Anal Positions',
      expectedCount: 27
    },
    {
      url: 'https://www.cosmopolitan.com/sex-love/positions/g38819444/best-chair-sex-positions/',
      category: 'Chair Positions',
      expectedCount: 12
    },
    {
      url: 'https://www.cosmopolitan.com/sex-love/positions/g38237776/bridge-sex-position/',
      category: 'Bridge Positions',
      expectedCount: 1
    },
    {
      url: 'https://www.cosmopolitan.com/sex-love/positions/g4090/mind-blowing-lesbian-sex-positions/',
      category: 'Lesbian Positions',
      expectedCount: 40
    },
    {
      url: 'https://www.cosmopolitan.com/sex-love/positions/news/g5949/first-time-sex-positions/',
      category: 'Beginner Positions',
      expectedCount: 20
    },
    {
      url: 'https://www.cosmopolitan.com/sex-love/positions/g2064/romantic-sex-positions/',
      category: 'Romantic Positions',
      expectedCount: 33
    },
    {
      url: 'https://www.cosmopolitan.com/sex-love/positions/g5727/masturbation-positions-for-women/',
      category: 'Solo Positions',
      expectedCount: 25
    },
    {
      url: 'https://www.cosmopolitan.com/sex-love/positions/g6018/sex-positions-deep-penetration/',
      category: 'Deep Penetration',
      expectedCount: 20
    }
  ];

  try {
    for (const position of positionUrls) {
      console.log(`\n🔍 Scraping detailed positions from: ${position.category}`);
      console.log(`Expected: ${position.expectedCount} positions`);
      
      try {
        await page.goto(position.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 5000));

        const detailedData = await page.evaluate(() => {
          // Extract the main article info
          const title = document.querySelector('h1')?.textContent?.trim() || 
                       document.querySelector('h2')?.textContent?.trim() || '';
          
          const description = document.querySelector('p')?.textContent?.trim() || 
                            document.querySelector('.article-body p')?.textContent?.trim() || '';
          
          // Extract all images
          const images = Array.from(document.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt || '',
            width: img.width,
            height: img.height
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

          // Find all numbered positions (looking for patterns like "1.", "2.", "27.", etc.)
          const positionElements = [];
          
          // Method 1: Look for numbered headings
          const numberedHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).filter(el => {
            const text = el.textContent.trim();
            return /^\d+\./.test(text) || /^\d+\)/.test(text) || /^\d+\s/.test(text);
          });

          numberedHeadings.forEach((heading, index) => {
            const positionNumber = index + 1;
            const positionTitle = heading.textContent.trim().replace(/^\d+[\.\)]\s*/, '');
            
            // Find the description and instructions
            let description = '';
            let howToDoIt = '';
            
            // Look for description in the next paragraph
            let currentElement = heading.nextElementSibling;
            while (currentElement && currentElement.tagName !== 'H1' && currentElement.tagName !== 'H2' && currentElement.tagName !== 'H3') {
              if (currentElement.tagName === 'P' && currentElement.textContent.trim()) {
                const text = currentElement.textContent.trim();
                if (text.toLowerCase().includes('how to') || text.toLowerCase().includes('instructions')) {
                  howToDoIt = text;
                } else if (!description) {
                  description = text;
                }
              }
              currentElement = currentElement.nextElementSibling;
            }

            positionElements.push({
              number: positionNumber,
              title: positionTitle,
              description: description,
              howToDoIt: howToDoIt
            });
          });

          // Method 2: If no numbered headings found, look for any headings that might be positions
          if (positionElements.length === 0) {
            const allHeadings = Array.from(document.querySelectorAll('h2, h3, h4')).filter(el => 
              el.textContent && 
              (el.textContent.includes('Position') || 
               el.textContent.includes('Sex') || 
               el.textContent.includes('Style') ||
               el.textContent.includes('How to') ||
               el.textContent.includes('The ') ||
               el.textContent.includes('1') ||
               el.textContent.includes('2') ||
               el.textContent.includes('3'))
            );

            allHeadings.forEach((heading, index) => {
              const positionNumber = index + 1;
              const positionTitle = heading.textContent.trim();
              
              // Find the description and instructions
              let description = '';
              let howToDoIt = '';
              
              let currentElement = heading.nextElementSibling;
              while (currentElement && currentElement.tagName !== 'H2' && currentElement.tagName !== 'H3') {
                if (currentElement.tagName === 'P' && currentElement.textContent.trim()) {
                  const text = currentElement.textContent.trim();
                  if (text.toLowerCase().includes('how to') || text.toLowerCase().includes('instructions')) {
                    howToDoIt = text;
                  } else if (!description) {
                    description = text;
                  }
                }
                currentElement = currentElement.nextElementSibling;
              }

              positionElements.push({
                number: positionNumber,
                title: positionTitle,
                description: description,
                howToDoIt: howToDoIt
              });
            });
          }

          // Method 3: Look for any text that might be position descriptions
          if (positionElements.length === 0) {
            const paragraphs = Array.from(document.querySelectorAll('p')).filter(p => 
              p.textContent && p.textContent.length > 50 && p.textContent.length < 500
            );

            paragraphs.forEach((paragraph, index) => {
              const text = paragraph.textContent.trim();
              if (text && !text.includes('advertisement') && !text.includes('click here')) {
                positionElements.push({
                  number: index + 1,
                  title: `Position ${index + 1}`,
                  description: text,
                  howToDoIt: ''
                });
              }
            });
          }

          return {
            title,
            description,
            images: images.slice(0, 20),
            positions: positionElements.slice(0, 50) // Limit to 50 positions
          };
        });

        if (detailedData.title) {
          allDetailedPositions.push({
            category: position.category,
            expectedCount: position.expectedCount,
            title: detailedData.title,
            description: detailedData.description,
            images: detailedData.images,
            positions: detailedData.positions,
            originalUrl: position.url,
            scrapedCount: detailedData.positions.length
          });

          console.log(`✅ Successfully scraped: ${detailedData.title}`);
          console.log(`📊 Found ${detailedData.positions.length} positions (expected ${position.expectedCount})`);
          console.log(`🖼️ Found ${detailedData.images.length} images`);
          
          // Show first few positions as preview
          detailedData.positions.slice(0, 3).forEach(pos => {
            console.log(`   ${pos.number}. ${pos.title}`);
          });
        }

      } catch (error) {
        console.error(`❌ Error scraping ${position.url}:`, error.message);
      }
    }

    // Save the detailed scraped data
    fs.writeFileSync('detailed-positions-complete.json', JSON.stringify(allDetailedPositions, null, 2));
    console.log(`\n🎉 Successfully scraped detailed content for ${allDetailedPositions.length} categories!`);
    
    // Print comprehensive summary
    console.log('\n📊 Detailed Scraping Summary:');
    allDetailedPositions.forEach((category, index) => {
      console.log(`\n${index + 1}. ${category.category}`);
      console.log(`   Article: ${category.title}`);
      console.log(`   Expected: ${category.expectedCount} positions`);
      console.log(`   Scraped: ${category.scrapedCount} positions`);
      console.log(`   Images: ${category.images.length}`);
      console.log(`   URL: ${category.originalUrl}`);
      
      // Show sample positions
      category.positions.slice(0, 3).forEach(pos => {
        console.log(`     ${pos.number}. ${pos.title}`);
        if (pos.description) console.log(`        Desc: ${pos.description.substring(0, 100)}...`);
        if (pos.howToDoIt) console.log(`        How: ${pos.howToDoIt.substring(0, 100)}...`);
      });
    });

    // Calculate totals
    const totalExpected = allDetailedPositions.reduce((sum, cat) => sum + cat.expectedCount, 0);
    const totalScraped = allDetailedPositions.reduce((sum, cat) => sum + cat.scrapedCount, 0);
    const totalImages = allDetailedPositions.reduce((sum, cat) => sum + cat.images.length, 0);
    
    console.log(`\n🎯 TOTALS:`);
    console.log(`   Expected Positions: ${totalExpected}`);
    console.log(`   Scraped Positions: ${totalScraped}`);
    console.log(`   Total Images: ${totalImages}`);
    console.log(`   Success Rate: ${((totalScraped / totalExpected) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }
}

// Run the detailed scraper
scrapeDetailedPositions();
