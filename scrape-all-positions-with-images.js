import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeAllPositionsWithImages() {
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
      console.log(`\n🔍 Scraping positions with matched images from: ${position.category}`);
      console.log(`Expected: ${position.expectedCount} positions`);
      
      try {
        await page.goto(position.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
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

        if (enhancedData.title) {
          allDetailedPositions.push({
            category: position.category,
            expectedCount: position.expectedCount,
            title: enhancedData.title,
            description: `Comprehensive ${position.category.toLowerCase()} guide with detailed instructions and matched images.`,
            images: enhancedData.allImages.slice(0, 20).map(img => ({
              src: img.src,
              alt: img.alt,
              width: img.width,
              height: img.height
            })),
            positions: enhancedData.positions,
            originalUrl: position.url,
            scrapedCount: enhancedData.positions.length
          });

          console.log(`✅ Successfully scraped: ${enhancedData.title}`);
          console.log(`📊 Found ${enhancedData.positions.length} positions (expected ${position.expectedCount})`);
          console.log(`🖼️ Found ${enhancedData.allImages.length} total images`);
          console.log(`🎯 Positions with images: ${enhancedData.positions.filter(p => p.images.length > 0).length}`);
          
          // Show first few positions as preview
          enhancedData.positions.slice(0, 3).forEach(pos => {
            console.log(`   ${pos.number}. ${pos.title}`);
            if (pos.images.length > 0) {
              console.log(`      Image: ${pos.images[0].src.substring(0, 80)}...`);
            } else {
              console.log(`      Image: None found`);
            }
          });
        }

      } catch (error) {
        console.error(`❌ Error scraping ${position.url}:`, error.message);
      }
    }

    // Save the comprehensive scraped data
    fs.writeFileSync('all-positions-with-images.json', JSON.stringify(allDetailedPositions, null, 2));
    console.log(`\n🎉 Successfully scraped comprehensive content with matched images for ${allDetailedPositions.length} categories!`);
    
    // Print comprehensive summary
    console.log('\n📊 Complete Scraping Summary:');
    allDetailedPositions.forEach((category, index) => {
      console.log(`\n${index + 1}. ${category.category}`);
      console.log(`   Article: ${category.title}`);
      console.log(`   Expected: ${category.expectedCount} positions`);
      console.log(`   Scraped: ${category.scrapedCount} positions`);
      console.log(`   Total Images: ${category.images.length}`);
      console.log(`   Positions with Images: ${category.positions.filter(p => p.images.length > 0).length}`);
      console.log(`   URL: ${category.originalUrl}`);
      
      // Show sample positions
      category.positions.slice(0, 3).forEach(pos => {
        console.log(`     ${pos.number}. ${pos.title}`);
        if (pos.images.length > 0) {
          console.log(`        Image: ${pos.images[0].src.substring(0, 80)}...`);
        }
      });
    });

    // Calculate totals
    const totalExpected = allDetailedPositions.reduce((sum, cat) => sum + cat.expectedCount, 0);
    const totalScraped = allDetailedPositions.reduce((sum, cat) => sum + cat.scrapedCount, 0);
    const totalImages = allDetailedPositions.reduce((sum, cat) => sum + cat.images.length, 0);
    const totalPositionsWithImages = allDetailedPositions.reduce((sum, cat) => 
      sum + cat.positions.filter(p => p.images.length > 0).length, 0);
    
    console.log(`\n🎯 COMPLETE TOTALS:`);
    console.log(`   Expected Positions: ${totalExpected}`);
    console.log(`   Scraped Positions: ${totalScraped}`);
    console.log(`   Total Images: ${totalImages}`);
    console.log(`   Positions with Images: ${totalPositionsWithImages}`);
    console.log(`   Success Rate: ${((totalScraped / totalExpected) * 100).toFixed(1)}%`);
    console.log(`   Image Match Rate: ${((totalPositionsWithImages / totalScraped) * 100).toFixed(1)}%`);

    // Copy to public folder for the frontend
    fs.copyFileSync('all-positions-with-images.json', 'public/all-positions-with-images.json');
    console.log(`\n📁 Copied to public/all-positions-with-images.json for frontend use`);

  } catch (error) {
    console.error('Error during comprehensive scraping:', error);
  } finally {
    await browser.close();
  }
}

// Run the comprehensive scraper
scrapeAllPositionsWithImages();
