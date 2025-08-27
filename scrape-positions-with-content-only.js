import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapePositionsWithContentOnly() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const allDetailedPositions = [];

  const positionUrls = [
    { url: 'https://www.cosmopolitan.com/sex-love/g4967/oral-sex-positions-you-need/', category: 'Oral Positions', expectedCount: 38 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g63107690/missionary-sex-positions-list/', category: 'Missionary Variations', expectedCount: 22 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g5025/anal-sex-positions/', category: 'Anal Positions', expectedCount: 27 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g38819444/best-chair-sex-positions/', category: 'Chair Positions', expectedCount: 12 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g4090/mind-blowing-lesbian-sex-positions/', category: 'Lesbian Positions', expectedCount: 40 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/news/g5949/first-time-sex-positions/', category: 'Beginner Positions', expectedCount: 20 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g2064/romantic-sex-positions/', category: 'Romantic Positions', expectedCount: 33 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g5727/masturbation-positions-for-women/', category: 'Solo Positions', expectedCount: 25 },
    { url: 'https://www.cosmopolitan.com/sex-love/positions/g6018/sex-positions-deep-penetration/', category: 'Deep Penetration', expectedCount: 20 }
  ];

  try {
    for (const position of positionUrls) {
      console.log(`\n🎯 SCRAPING WITH CONTENT ONLY: ${position.category}`);
      console.log(`Expected: ${position.expectedCount} positions`);
      
      try {
        await page.goto(position.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 15000));

        const contentOnlyData = await page.evaluate((categoryInfo) => {
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

          // Find positions that actually have content
          const positionsWithContent = [];

          // Method 1: Look for headings that have associated content
          allHeadings.forEach((heading, index) => {
            const text = heading.textContent.trim();
            if (text && 
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
                !text.includes('Tips') &&
                !text.includes('Guide') &&
                !text.includes('Expert') &&
                text.length > 3 && 
                text.length < 150) {
              
              // Check if this heading has associated content
              let hasContent = false;
              let description = '';
              let howToDoIt = '';
              let foundImages = [];

              // Look for content after this heading
              let currentElement = heading.nextElementSibling;
              let allText = [];
              
              // Look for content in different ways
              while (currentElement && currentElement.tagName !== 'H1' && currentElement.tagName !== 'H2' && currentElement.tagName !== 'H3') {
                if (currentElement.tagName === 'P' && currentElement.textContent.trim()) {
                  const text = currentElement.textContent.trim();
                  if (text.length > 10 && text.length < 1000) {
                    allText.push(text);
                    hasContent = true;
                  }
                } else if (currentElement.tagName === 'DIV' && currentElement.textContent.trim()) {
                  const text = currentElement.textContent.trim();
                  if (text.length > 10 && text.length < 1000) {
                    allText.push(text);
                    hasContent = true;
                  }
                }
                currentElement = currentElement.nextElementSibling;
              }

              // Find images near this position
              if (heading.getBoundingClientRect) {
                const headingRect = heading.getBoundingClientRect();
                allImages.forEach(img => {
                  const imgRect = img.element.getBoundingClientRect();
                  const distance = Math.abs(headingRect.top - imgRect.top) + Math.abs(headingRect.left - imgRect.left);
                  
                  if (distance < 500 && !foundImages.some(found => found.src === img.src)) {
                    foundImages.push({
                      src: img.src,
                      alt: img.alt,
                      width: img.width,
                      height: img.height
                    });
                    hasContent = true;
                  }
                });
              }

              // Only include if it has content (description or images)
              if (hasContent) {
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

                positionsWithContent.push({
                  number: positionsWithContent.length + 1,
                  title: text,
                  description: description.trim(),
                  howToDoIt: howToDoIt.trim(),
                  images: foundImages
                });
              }
            }
          });

          // Method 2: Look for numbered patterns that have content
          const allText = document.body.textContent;
          const numberMatches = allText.match(/\d+\.\s+[A-Z][^.!?]+/g);
          if (numberMatches) {
            numberMatches.forEach(match => {
              const cleanMatch = match.trim();
              if (cleanMatch.length > 5 && cleanMatch.length < 150) {
                // Check if this numbered item has content
                const positionTitle = cleanMatch.replace(/^\d+\.\s*/, '').trim();
                
                // Look for the element containing this text
                const elementWithText = Array.from(document.querySelectorAll('*')).find(el => 
                  el.textContent.includes(positionTitle) && el.textContent.length < 200
                );

                if (elementWithText) {
                  let hasContent = false;
                  let description = '';
                  let howToDoIt = '';
                  let foundImages = [];

                  // Look for content after this element
                  let currentElement = elementWithText.nextElementSibling;
                  let allText = [];
                  
                  while (currentElement && currentElement.tagName !== 'H1' && currentElement.tagName !== 'H2' && currentElement.tagName !== 'H3') {
                    if (currentElement.tagName === 'P' && currentElement.textContent.trim()) {
                      const text = currentElement.textContent.trim();
                      if (text.length > 10 && text.length < 1000) {
                        allText.push(text);
                        hasContent = true;
                      }
                    } else if (currentElement.tagName === 'DIV' && currentElement.textContent.trim()) {
                      const text = currentElement.textContent.trim();
                      if (text.length > 10 && text.length < 1000) {
                        allText.push(text);
                        hasContent = true;
                      }
                    }
                    currentElement = currentElement.nextElementSibling;
                  }

                  // Find images near this position
                  if (elementWithText.getBoundingClientRect) {
                    const elementRect = elementWithText.getBoundingClientRect();
                    allImages.forEach(img => {
                      const imgRect = img.element.getBoundingClientRect();
                      const distance = Math.abs(elementRect.top - imgRect.top) + Math.abs(elementRect.left - imgRect.left);
                      
                      if (distance < 500 && !foundImages.some(found => found.src === img.src)) {
                        foundImages.push({
                          src: img.src,
                          alt: img.alt,
                          width: img.width,
                          height: img.height
                        });
                        hasContent = true;
                      }
                    });
                  }

                  // Only include if it has content and isn't already included
                  if (hasContent && !positionsWithContent.some(p => p.title === positionTitle)) {
                    // Process the extracted text
                    if (allText.length > 0) {
                      const cleanTexts = allText.map(text => {
                        let cleanText = text.replace(/@[A-Z0-9_]+/g, '').trim();
                        cleanText = cleanText.replace(/\s+/g, ' ').trim();
                        return cleanText;
                      }).filter(text => text.length > 5);

                      if (cleanTexts.length > 0) {
                        description = cleanTexts[0];
                        
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

                    positionsWithContent.push({
                      number: positionsWithContent.length + 1,
                      title: positionTitle,
                      description: description.trim(),
                      howToDoIt: howToDoIt.trim(),
                      images: foundImages
                    });
                  }
                }
              }
            });
          }

          data.positions = positionsWithContent;

          return data;
        }, position);

        if (contentOnlyData.title) {
          allDetailedPositions.push({
            category: position.category,
            expectedCount: position.expectedCount,
            title: contentOnlyData.title,
            description: `Content-verified ${position.category.toLowerCase()} guide with detailed instructions and matched images.`,
            images: contentOnlyData.allImages.slice(0, 20).map(img => ({
              src: img.src,
              alt: img.alt,
              width: img.width,
              height: img.height
            })),
            positions: contentOnlyData.positions,
            originalUrl: position.url,
            scrapedCount: contentOnlyData.positions.length,
            allHeadings: contentOnlyData.allHeadings
          });

          console.log(`✅ Successfully scraped: ${contentOnlyData.title}`);
          console.log(`📊 Found ${contentOnlyData.positions.length} positions WITH CONTENT (expected ${position.expectedCount})`);
          console.log(`🖼️ Found ${contentOnlyData.allImages.length} total images`);
          console.log(`🎯 Positions with descriptions: ${contentOnlyData.positions.filter(p => p.description).length}`);
          console.log(`🎯 Positions with images: ${contentOnlyData.positions.filter(p => p.images.length > 0).length}`);
          
          const successRate = ((contentOnlyData.positions.length / position.expectedCount) * 100).toFixed(1);
          console.log(`📈 Success Rate: ${successRate}%`);
          
          if (contentOnlyData.positions.length >= position.expectedCount) {
            console.log(`🎉 EXCEEDED EXPECTATIONS! Found ${contentOnlyData.positions.length - position.expectedCount} extra positions`);
          } else {
            console.log(`⚠️ Still missing ${position.expectedCount - contentOnlyData.positions.length} positions`);
          }
        }

      } catch (error) {
        console.error(`❌ Error scraping ${position.url}:`, error.message);
      }
    }

    // Save the content-verified scraped data
    fs.writeFileSync('all-positions-content-only.json', JSON.stringify(allDetailedPositions, null, 2));
    console.log(`\n🎉 Successfully scraped content-verified positions for ${allDetailedPositions.length} categories!`);
    
    // Print comprehensive summary
    console.log('\n📊 CONTENT-ONLY SUCCESS RATE SUMMARY:');
    allDetailedPositions.forEach((category, index) => {
      console.log(`\n${index + 1}. ${category.category}`);
      console.log(`   Article: ${category.title}`);
      console.log(`   Expected: ${category.expectedCount} positions`);
      console.log(`   Scraped: ${category.scrapedCount} positions`);
      console.log(`   Total Images: ${category.images.length}`);
      console.log(`   Positions with Descriptions: ${category.positions.filter(p => p.description).length}`);
      console.log(`   Positions with Images: ${category.positions.filter(p => p.images.length > 0).length}`);
      console.log(`   All Headings: ${category.allHeadings.length}`);
      console.log(`   URL: ${category.originalUrl}`);
      
      const successRate = ((category.scrapedCount / category.expectedCount) * 100).toFixed(1);
      console.log(`   Success Rate: ${successRate}%`);
      
      if (category.scrapedCount >= category.expectedCount) {
        console.log(`   🎉 EXCEEDED by ${category.scrapedCount - category.expectedCount} positions!`);
      } else {
        console.log(`   ❌ Missing ${category.expectedCount - category.scrapedCount} positions`);
      }
    });

    // Calculate totals
    const totalExpected = allDetailedPositions.reduce((sum, cat) => sum + cat.expectedCount, 0);
    const totalScraped = allDetailedPositions.reduce((sum, cat) => sum + cat.scrapedCount, 0);
    const totalImages = allDetailedPositions.reduce((sum, cat) => sum + cat.images.length, 0);
    const totalPositionsWithDescriptions = allDetailedPositions.reduce((sum, cat) => 
      sum + cat.positions.filter(p => p.description).length, 0);
    const totalPositionsWithImages = allDetailedPositions.reduce((sum, cat) => 
      sum + cat.positions.filter(p => p.images.length > 0).length, 0);
    
    console.log(`\n🎯 CONTENT-ONLY FINAL TOTALS:`);
    console.log(`   Expected Positions: ${totalExpected}`);
    console.log(`   Scraped Positions: ${totalScraped}`);
    console.log(`   Total Images: ${totalImages}`);
    console.log(`   Positions with Descriptions: ${totalPositionsWithDescriptions}`);
    console.log(`   Positions with Images: ${totalPositionsWithImages}`);
    console.log(`   Success Rate: ${((totalScraped / totalExpected) * 100).toFixed(1)}%`);
    console.log(`   Description Rate: ${((totalPositionsWithDescriptions / totalScraped) * 100).toFixed(1)}%`);
    console.log(`   Image Rate: ${((totalPositionsWithImages / totalScraped) * 100).toFixed(1)}%`);

    // Copy to public folder for the frontend
    fs.copyFileSync('all-positions-content-only.json', 'public/all-positions-content-only.json');
    console.log(`\n📁 Copied to public/all-positions-content-only.json for frontend use`);

  } catch (error) {
    console.error('Error during content-only scraping:', error);
  } finally {
    await browser.close();
  }
}

// Run the content-only scraper
scrapePositionsWithContentOnly();
