import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeFinalPositions() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set user agent to avoid detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const allDetailedPositions = [];

  // URLs to scrape
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

          // Extract individual positions by looking for H2 headings
          const positionHeadings = Array.from(document.querySelectorAll('h2')).filter(el => {
            const text = el.textContent.trim();
            // Filter out the main article title and other non-position headings
            return text && 
                   !text.includes('Sex Positions') && 
                   !text.includes('Oral Sex') &&
                   !text.includes('Missionary') &&
                   !text.includes('Anal Sex') &&
                   !text.includes('Chair Sex') &&
                   !text.includes('Lesbian Sex') &&
                   !text.includes('First-Time') &&
                   !text.includes('Romantic Sex') &&
                   !text.includes('Masturbation') &&
                   !text.includes('Deep Penetration') &&
                   text.length > 3 && 
                   text.length < 100;
          });

          const positions = positionHeadings.map((heading, index) => {
            const positionNumber = index + 1;
            const positionTitle = heading.textContent.trim();
            
            // Find the description and instructions
            let description = '';
            let howToDoIt = '';
            
            // Look for content after this heading until the next heading
            let currentElement = heading.nextElementSibling;
            while (currentElement && currentElement.tagName !== 'H2' && currentElement.tagName !== 'H3') {
              if (currentElement.tagName === 'P' && currentElement.textContent.trim()) {
                const text = currentElement.textContent.trim();
                if (text.toLowerCase().includes('how to') || text.toLowerCase().includes('instructions')) {
                  howToDoIt = text;
                } else if (!description && text.length > 20) {
                  description = text;
                }
              }
              currentElement = currentElement.nextElementSibling;
            }

            return {
              number: positionNumber,
              title: positionTitle,
              description: description,
              howToDoIt: howToDoIt
            };
          });

          return {
            title,
            description,
            images: images.slice(0, 20),
            positions: positions.slice(0, 50) // Limit to 50 positions
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
          detailedData.positions.slice(0, 5).forEach(pos => {
            console.log(`   ${pos.number}. ${pos.title}`);
            if (pos.description) console.log(`      ${pos.description.substring(0, 80)}...`);
          });
        }

      } catch (error) {
        console.error(`❌ Error scraping ${position.url}:`, error.message);
      }
    }

    // Save the detailed scraped data
    fs.writeFileSync('final-positions-complete.json', JSON.stringify(allDetailedPositions, null, 2));
    console.log(`\n🎉 Successfully scraped detailed content for ${allDetailedPositions.length} categories!`);
    
    // Print comprehensive summary
    console.log('\n📊 Final Scraping Summary:');
    allDetailedPositions.forEach((category, index) => {
      console.log(`\n${index + 1}. ${category.category}`);
      console.log(`   Article: ${category.title}`);
      console.log(`   Expected: ${category.expectedCount} positions`);
      console.log(`   Scraped: ${category.scrapedCount} positions`);
      console.log(`   Images: ${category.images.length}`);
      console.log(`   URL: ${category.originalUrl}`);
      
      // Show sample positions
      category.positions.slice(0, 5).forEach(pos => {
        console.log(`     ${pos.number}. ${pos.title}`);
        if (pos.description) console.log(`        Desc: ${pos.description.substring(0, 100)}...`);
        if (pos.howToDoIt) console.log(`        How: ${pos.howToDoIt.substring(0, 100)}...`);
      });
    });

    // Calculate totals
    const totalExpected = allDetailedPositions.reduce((sum, cat) => sum + cat.expectedCount, 0);
    const totalScraped = allDetailedPositions.reduce((sum, cat) => sum + cat.scrapedCount, 0);
    const totalImages = allDetailedPositions.reduce((sum, cat) => sum + cat.images.length, 0);
    
    console.log(`\n🎯 FINAL TOTALS:`);
    console.log(`   Expected Positions: ${totalExpected}`);
    console.log(`   Scraped Positions: ${totalScraped}`);
    console.log(`   Total Images: ${totalImages}`);
    console.log(`   Success Rate: ${((totalScraped / totalExpected) * 100).toFixed(1)}%`);

    // Copy to public folder for the frontend
    fs.copyFileSync('final-positions-complete.json', 'public/final-positions-complete.json');
    console.log(`\n📁 Copied to public/final-positions-complete.json for frontend use`);

  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }
}

// Run the final scraper
scrapeFinalPositions();
