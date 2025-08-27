import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapePositionsComplete() {
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
      console.log(`\n🔍 Scraping ALL positions from: ${position.category}`);
      console.log(`Expected: ${position.expectedCount} positions`);
      
      try {
        await page.goto(position.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 8000));

        const enhancedData = await page.evaluate(() => {
          const data = {
            title: document.title,
            positions: [],
            allImages: [],
            allHeadings: []
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

          // Get ALL headings for analysis
          const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
          data.allHeadings = allHeadings.map((heading, index) => ({
            index,
            tag: heading.tagName,
            text: heading.textContent.trim(),
            className: heading.className,
            id: heading.id
          }));

          // Method 1: Look for ALL headings that might be positions
          const allPossibleHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).filter(el => {
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
                   !text.includes('Advertisement') &&
                   !text.includes('Related') &&
                   !text.includes('More') &&
                   !text.includes('Read') &&
                   !text.includes('Follow') &&
                   !text.includes('Subscribe') &&
                   !text.includes('Newsletter') &&
                   text.length > 3 && 
                   text.length < 100;
          });

          // Method 2: Look for numbered patterns in text
          const numberedPatterns = [];
          const allText = document.body.textContent;
          const numberMatches = allText.match(/\d+\.\s+[A-Z][^.!?]+/g);
          if (numberMatches) {
            numberMatches.forEach(match => {
              const cleanMatch = match.trim();
              if (cleanMatch.length > 5 && cleanMatch.length < 100) {
                numberedPatterns.push(cleanMatch);
              }
            });
          }

          // Method 3: Look for specific position patterns
          const positionPatterns = [];
          const positionKeywords = [
            'position', 'pose', 'style', 'technique', 'method', 'way', 'variation',
            'missionary', 'doggy', 'cowgirl', 'reverse', 'standing', 'sitting',
            'oral', 'anal', 'penetration', 'stimulation', 'pleasure'
          ];

          allHeadings.forEach(heading => {
            const text = heading.textContent.toLowerCase();
            if (positionKeywords.some(keyword => text.includes(keyword))) {
              positionPatterns.push(heading.textContent.trim());
            }
          });

          console.log(`Found ${allPossibleHeadings.length} possible headings`);
          console.log(`Found ${numberedPatterns.length} numbered patterns`);
          console.log(`Found ${positionPatterns.length} position patterns`);

          // Combine all methods and create positions
          const allPositionCandidates = [...allPossibleHeadings, ...numberedPatterns, ...positionPatterns];
          const uniquePositions = [...new Set(allPositionCandidates)];

          uniquePositions.forEach((candidate, index) => {
            const positionNumber = index + 1;
            let positionTitle = '';
            let description = '';
            let howToDoIt = '';
            let foundImages = [];

            // Extract title
            if (typeof candidate === 'string') {
              positionTitle = candidate;
            } else if (candidate.textContent) {
              positionTitle = candidate.textContent.trim();
            }

            // Find associated content and images
            if (candidate && candidate.nextElementSibling) {
              let currentElement = candidate.nextElementSibling;
              let allText = [];
              
              // Look for content in different ways
              while (currentElement && currentElement.tagName !== 'H1' && currentElement.tagName !== 'H2' && currentElement.tagName !== 'H3') {
                if (currentElement.tagName === 'P' && currentElement.textContent.trim()) {
                  const text = currentElement.textContent.trim();
                  if (text.length > 10 && text.length < 1000) {
                    allText.push(text);
                  }
                } else if (currentElement.tagName === 'DIV' && currentElement.textContent.trim()) {
                  const text = currentElement.textContent.trim();
                  if (text.length > 10 && text.length < 1000) {
                    allText.push(text);
                  }
                }
                currentElement = currentElement.nextElementSibling;
              }

              // Find images near this position
              if (candidate.getBoundingClientRect) {
                const candidateRect = candidate.getBoundingClientRect();
                allImages.forEach(img => {
                  const imgRect = img.element.getBoundingClientRect();
                  const distance = Math.abs(candidateRect.top - imgRect.top) + Math.abs(candidateRect.left - imgRect.left);
                  
                  if (distance < 300 && !foundImages.some(found => found.src === img.src)) {
                    foundImages.push({
                      src: img.src,
                      alt: img.alt,
                      width: img.width,
                      height: img.height
                    });
                  }
                });
              }

              // Process the extracted text
              if (allText.length > 0) {
                // Clean up the text
                const cleanTexts = allText.map(text => {
                  let cleanText = text.replace(/@[A-Z0-9_]+/g, '').trim();
                  cleanText = cleanText.replace(/\s+/g, ' ').trim();
                  return cleanText;
                }).filter(text => text.length > 5);

                if (cleanTexts.length > 0) {
                  description = cleanTexts[0];
                  
                  // Look for instruction keywords
                  for (let i = 1; i < cleanTexts.length; i++) {
                    const text = cleanTexts[i].toLowerCase();
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
                      howToDoIt = cleanTexts[i];
                      break;
                    }
                  }
                  
                  if (!howToDoIt && cleanTexts.length > 1) {
                    howToDoIt = cleanTexts[1];
                  }
                }
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
            scrapedCount: enhancedData.positions.length,
            allHeadings: enhancedData.allHeadings
          });

          console.log(`✅ Successfully scraped: ${enhancedData.title}`);
          console.log(`📊 Found ${enhancedData.positions.length} positions (expected ${position.expectedCount})`);
          console.log(`🖼️ Found ${enhancedData.allImages.length} total images`);
          console.log(`🎯 Positions with content: ${enhancedData.positions.filter(p => p.description || p.howToDoIt).length}`);
          console.log(`📝 All headings found: ${enhancedData.allHeadings.length}`);
          
          // Show first few positions as preview
          enhancedData.positions.slice(0, 3).forEach(pos => {
            console.log(`   ${pos.number}. ${pos.title}`);
            if (pos.description) {
              console.log(`      Description: ${pos.description.substring(0, 80)}...`);
            }
            if (pos.howToDoIt) {
              console.log(`      How To: ${pos.howToDoIt.substring(0, 80)}...`);
            }
            if (pos.images.length > 0) {
              console.log(`      Image: ${pos.images[0].src.substring(0, 80)}...`);
            }
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
      console.log(`   Total Images: ${category.images.length}`);
      console.log(`   Positions with Content: ${category.positions.filter(p => p.description || p.howToDoIt).length}`);
      console.log(`   All Headings: ${category.allHeadings.length}`);
      console.log(`   URL: ${category.originalUrl}`);
      
      // Show sample positions
      category.positions.slice(0, 2).forEach(pos => {
        console.log(`     ${pos.number}. ${pos.title}`);
        if (pos.description) {
          console.log(`        Description: ${pos.description.substring(0, 60)}...`);
        }
        if (pos.howToDoIt) {
          console.log(`        How To: ${pos.howToDoIt.substring(0, 60)}...`);
        }
      });
    });

    // Calculate totals
    const totalExpected = allDetailedPositions.reduce((sum, cat) => sum + cat.expectedCount, 0);
    const totalScraped = allDetailedPositions.reduce((sum, cat) => sum + cat.scrapedCount, 0);
    const totalImages = allDetailedPositions.reduce((sum, cat) => sum + cat.images.length, 0);
    const totalPositionsWithContent = allDetailedPositions.reduce((sum, cat) => 
      sum + cat.positions.filter(p => p.description || p.howToDoIt).length, 0);
    
    console.log(`\n🎯 COMPLETE TOTALS:`);
    console.log(`   Expected Positions: ${totalExpected}`);
    console.log(`   Scraped Positions: ${totalScraped}`);
    console.log(`   Total Images: ${totalImages}`);
    console.log(`   Positions with Content: ${totalPositionsWithContent}`);
    console.log(`   Success Rate: ${((totalScraped / totalExpected) * 100).toFixed(1)}%`);
    console.log(`   Content Rate: ${((totalPositionsWithContent / totalScraped) * 100).toFixed(1)}%`);

    // Copy to public folder for the frontend
    fs.copyFileSync('all-positions-complete.json', 'public/all-positions-complete.json');
    console.log(`\n📁 Copied to public/all-positions-complete.json for frontend use`);

  } catch (error) {
    console.error('Error during comprehensive scraping:', error);
  } finally {
    await browser.close();
  }
}

// Run the complete scraper
scrapePositionsComplete();
