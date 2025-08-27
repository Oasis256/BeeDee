import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeAllPositions() {
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
      console.log(`\n🔍 Scraping comprehensive positions from: ${position.category}`);
      console.log(`Expected: ${position.expectedCount} positions`);
      
      try {
        await page.goto(position.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 8000)); // Wait longer for content to load

        const comprehensiveData = await page.evaluate(() => {
          const data = {
            title: document.title,
            positions: [],
            images: []
          };

          // Get all images
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

          // Try multiple methods to find positions
          const positionHeadings = Array.from(document.querySelectorAll('h2')).filter(el => {
            const text = el.textContent.trim();
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

          data.images = images;
          return data;
        });

        if (comprehensiveData.title) {
          allDetailedPositions.push({
            category: position.category,
            expectedCount: position.expectedCount,
            title: comprehensiveData.title,
            description: `Comprehensive ${position.category.toLowerCase()} guide with detailed instructions.`,
            images: comprehensiveData.images.slice(0, 20),
            positions: comprehensiveData.positions,
            originalUrl: position.url,
            scrapedCount: comprehensiveData.positions.length
          });

          console.log(`✅ Successfully scraped: ${comprehensiveData.title}`);
          console.log(`📊 Found ${comprehensiveData.positions.length} positions (expected ${position.expectedCount})`);
          console.log(`🖼️ Found ${comprehensiveData.images.length} images`);
          
          // Show first few positions as preview
          comprehensiveData.positions.slice(0, 3).forEach(pos => {
            console.log(`   ${pos.number}. ${pos.title}`);
            if (pos.description) console.log(`      ${pos.description.substring(0, 80)}...`);
          });
        }

      } catch (error) {
        console.error(`❌ Error scraping ${position.url}:`, error.message);
      }
    }

    // Save the comprehensive scraped data
    fs.writeFileSync('all-positions-complete.json', JSON.stringify(allDetailedPositions, null, 2));
    console.log(`\n🎉 Successfully scraped comprehensive content for ${allDetailedPositions.length} categories!`);
    
    // Print comprehensive summary
    console.log('\n📊 Complete Scraping Summary:');
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
    
    console.log(`\n🎯 COMPLETE TOTALS:`);
    console.log(`   Expected Positions: ${totalExpected}`);
    console.log(`   Scraped Positions: ${totalScraped}`);
    console.log(`   Total Images: ${totalImages}`);
    console.log(`   Success Rate: ${((totalScraped / totalExpected) * 100).toFixed(1)}%`);

    // Copy to public folder for the frontend
    fs.copyFileSync('all-positions-complete.json', 'public/all-positions-complete.json');
    console.log(`\n📁 Copied to public/all-positions-complete.json for frontend use`);

  } catch (error) {
    console.error('Error during comprehensive scraping:', error);
  } finally {
    await browser.close();
  }
}

// Run the comprehensive scraper
scrapeAllPositions();
