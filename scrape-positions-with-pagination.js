import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapePositionsWithPagination() {
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
      console.log(`\n🎯 SCRAPING WITH PAGINATION: ${position.category}`);
      console.log(`Expected: ${position.expectedCount} positions`);
      
      try {
        await page.goto(position.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 15000));

        // Scroll to load all content
        console.log(`   Scrolling to load all content...`);
        await page.evaluate(async () => {
          await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              
              if(totalHeight >= scrollHeight){
                clearInterval(timer);
                resolve();
              }
            }, 100);
          });
        });

        // Wait for any dynamic content to load
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Check for pagination controls and click through pages
        console.log(`   Checking for pagination...`);
        const paginationData = await page.evaluate(async () => {
          const data = {
            hasPagination: false,
            totalPages: 0,
            currentPage: 1,
            paginationElements: []
          };

          // Look for pagination controls
          const paginationSelectors = [
            '.pagination',
            '.pager',
            '.page-numbers',
            '[class*="pagination"]',
            '[class*="pager"]',
            'nav[class*="pagination"]',
            '.load-more',
            '.show-more',
            'button[class*="load"]',
            'button[class*="more"]'
          ];

          for (const selector of paginationSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
              data.hasPagination = true;
              data.paginationElements = Array.from(elements).map(el => ({
                tagName: el.tagName,
                className: el.className,
                text: el.textContent.trim(),
                href: el.href || ''
              }));
              break;
            }
          }

          // Look for page numbers
          const pageNumbers = document.querySelectorAll('a[href*="page"], a[href*="?page"], .page-number, .pagination a');
          if (pageNumbers.length > 0) {
            data.hasPagination = true;
            const numbers = Array.from(pageNumbers)
              .map(el => {
                const text = el.textContent.trim();
                const href = el.href || '';
                const pageMatch = text.match(/\d+/) || href.match(/page=(\d+)/);
                return pageMatch ? parseInt(pageMatch[0] || pageMatch[1]) : null;
              })
              .filter(num => num !== null);
            
            if (numbers.length > 0) {
              data.totalPages = Math.max(...numbers);
            }
          }

          return data;
        });

        console.log(`   Pagination found: ${paginationData.hasPagination}, Total pages: ${paginationData.totalPages}`);

        // If pagination found, iterate through pages
        let allSlideSections = [];
        let currentPage = 1;
        const maxPages = paginationData.totalPages || 3; // Default to 3 pages if we can't determine

        while (currentPage <= maxPages) {
          console.log(`   Processing page ${currentPage}...`);
          
          if (currentPage > 1) {
            // Try to navigate to next page
            const nextPageUrl = position.url.includes('?') 
              ? `${position.url}&page=${currentPage}`
              : `${position.url}?page=${currentPage}`;
            
            await page.goto(nextPageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
            await new Promise(resolve => setTimeout(resolve, 10000));
            
            // Scroll to load content
            await page.evaluate(async () => {
              await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                  const scrollHeight = document.body.scrollHeight;
                  window.scrollBy(0, distance);
                  totalHeight += distance;
                  
                  if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                  }
                }, 100);
              });
            });
            
            await new Promise(resolve => setTimeout(resolve, 3000));
          }

          // Extract slide sections from current page
          const pageSlideData = await page.evaluate((pageInfo) => {
            const data = {
              page: pageInfo.currentPage,
              slideSections: [],
              positions: []
            };

            // Find all slide sections
            const slideSections = Array.from(document.querySelectorAll('section[id^="slide-"]'));
            
            data.slideSections = slideSections.map(section => ({
              id: section.id,
              className: section.className,
              children: section.children.length
            }));

            // Process each slide section
            slideSections.forEach((section, index) => {
              let positionTitle = '';
              let description = '';
              let howToDoIt = '';
              let foundImages = [];

              // Look for position title
              const titleElements = section.querySelectorAll('h1, h2, h3, h4, h5, h6, strong, b');
              for (const titleEl of titleElements) {
                const text = titleEl.textContent.trim();
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
                  positionTitle = text;
                  break;
                }
              }

              // Look for numbered patterns
              if (!positionTitle) {
                const allText = section.textContent;
                const numberMatches = allText.match(/\d+\.\s+([A-Z][^.!?]+)/g);
                if (numberMatches && numberMatches.length > 0) {
                  positionTitle = numberMatches[0].replace(/^\d+\.\s*/, '').trim();
                }
              }

              // Look for images
              const images = Array.from(section.querySelectorAll('img')).map(img => ({
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

              foundImages = images;

              // Look for description
              const paragraphs = Array.from(section.querySelectorAll('p'));
              const allText = [];
              
              paragraphs.forEach(p => {
                const text = p.textContent.trim();
                if (text.length > 10 && text.length < 1000) {
                  allText.push(text);
                }
              });

              // Also look in div elements
              const divs = Array.from(section.querySelectorAll('div'));
              divs.forEach(div => {
                const text = div.textContent.trim();
                if (text.length > 10 && text.length < 1000 && !allText.includes(text)) {
                  allText.push(text);
                }
              });

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

              // Only add if we have a title and some content
              if (positionTitle && (description || foundImages.length > 0)) {
                data.positions.push({
                  number: data.positions.length + 1,
                  title: positionTitle,
                  description: description.trim(),
                  howToDoIt: howToDoIt.trim(),
                  images: foundImages,
                  slideId: section.id,
                  page: pageInfo.currentPage
                });
              }
            });

            return data;
          }, { currentPage });

          // Add positions from this page
          allSlideSections = allSlideSections.concat(pageSlideData.slideSections);
          
          console.log(`   Page ${currentPage}: Found ${pageSlideData.positions.length} positions from ${pageSlideData.slideSections.length} slide sections`);

          // If we found enough positions, we can stop
          if (pageSlideData.positions.length === 0 && currentPage > 1) {
            console.log(`   No more positions found on page ${currentPage}, stopping pagination`);
            break;
          }

          currentPage++;
        }

        // Combine all positions from all pages
        const allPositions = [];
        let positionNumber = 1;

        for (let page = 1; page <= maxPages; page++) {
          const pageSlideData = await page.evaluate((pageInfo) => {
            // Re-extract positions for this page
            const positions = [];
            const slideSections = Array.from(document.querySelectorAll('section[id^="slide-"]'));
            
            slideSections.forEach((section, index) => {
              // ... (same position extraction logic as above)
              let positionTitle = '';
              let description = '';
              let howToDoIt = '';
              let foundImages = [];

              // Look for position title
              const titleElements = section.querySelectorAll('h1, h2, h3, h4, h5, h6, strong, b');
              for (const titleEl of titleElements) {
                const text = titleEl.textContent.trim();
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
                  positionTitle = text;
                  break;
                }
              }

              // Look for numbered patterns
              if (!positionTitle) {
                const allText = section.textContent;
                const numberMatches = allText.match(/\d+\.\s+([A-Z][^.!?]+)/g);
                if (numberMatches && numberMatches.length > 0) {
                  positionTitle = numberMatches[0].replace(/^\d+\.\s*/, '').trim();
                }
              }

              // Look for images
              const images = Array.from(section.querySelectorAll('img')).map(img => ({
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

              foundImages = images;

              // Look for description
              const paragraphs = Array.from(section.querySelectorAll('p'));
              const allText = [];
              
              paragraphs.forEach(p => {
                const text = p.textContent.trim();
                if (text.length > 10 && text.length < 1000) {
                  allText.push(text);
                }
              });

              // Also look in div elements
              const divs = Array.from(section.querySelectorAll('div'));
              divs.forEach(div => {
                const text = div.textContent.trim();
                if (text.length > 10 && text.length < 1000 && !allText.includes(text)) {
                  allText.push(text);
                }
              });

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

              // Only add if we have a title and some content
              if (positionTitle && (description || foundImages.length > 0)) {
                positions.push({
                  title: positionTitle,
                  description: description.trim(),
                  howToDoIt: howToDoIt.trim(),
                  images: foundImages,
                  slideId: section.id
                });
              }
            });

            return positions;
          }, { currentPage: page });

          // Add positions from this page
          pageSlideData.forEach(pos => {
            allPositions.push({
              ...pos,
              number: positionNumber++,
              page: page
            });
          });
        }

        // Get all images for the category
        const allImages = await page.evaluate(() => {
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
          return images;
        });

        const title = await page.title();

        if (title) {
          allDetailedPositions.push({
            category: position.category,
            expectedCount: position.expectedCount,
            title: title,
            description: `Pagination-based ${position.category.toLowerCase()} guide with detailed instructions and matched images.`,
            images: allImages.slice(0, 20).map(img => ({
              src: img.src,
              alt: img.alt,
              width: img.width,
              height: img.height
            })),
            positions: allPositions,
            originalUrl: position.url,
            scrapedCount: allPositions.length,
            slideSections: allSlideSections,
            paginationInfo: paginationData
          });

          console.log(`✅ Successfully scraped: ${title}`);
          console.log(`📊 Found ${allPositions.length} positions from ${allSlideSections.length} slide sections across ${maxPages} pages (expected ${position.expectedCount})`);
          console.log(`🖼️ Found ${allImages.length} total images`);
          console.log(`🎯 Positions with descriptions: ${allPositions.filter(p => p.description).length}`);
          console.log(`🎯 Positions with images: ${allPositions.filter(p => p.images.length > 0).length}`);
          
          const successRate = ((allPositions.length / position.expectedCount) * 100).toFixed(1);
          console.log(`📈 Success Rate: ${successRate}%`);
          
          if (allPositions.length >= position.expectedCount) {
            console.log(`🎉 EXCEEDED EXPECTATIONS! Found ${allPositions.length - position.expectedCount} extra positions`);
          } else {
            console.log(`⚠️ Still missing ${position.expectedCount - allPositions.length} positions`);
          }
        }

      } catch (error) {
        console.error(`❌ Error scraping ${position.url}:`, error.message);
      }
    }

    // Save the pagination-based scraped data
    fs.writeFileSync('all-positions-with-pagination.json', JSON.stringify(allDetailedPositions, null, 2));
    console.log(`\n🎉 Successfully scraped pagination-based positions for ${allDetailedPositions.length} categories!`);
    
    // Print comprehensive summary
    console.log('\n📊 PAGINATION-BASED SUCCESS RATE SUMMARY:');
    allDetailedPositions.forEach((category, index) => {
      console.log(`\n${index + 1}. ${category.category}`);
      console.log(`   Article: ${category.title}`);
      console.log(`   Expected: ${category.expectedCount} positions`);
      console.log(`   Scraped: ${category.scrapedCount} positions`);
      console.log(`   Slide Sections: ${category.slideSections.length}`);
      console.log(`   Total Images: ${category.images.length}`);
      console.log(`   Positions with Descriptions: ${category.positions.filter(p => p.description).length}`);
      console.log(`   Positions with Images: ${category.positions.filter(p => p.images.length > 0).length}`);
      console.log(`   Pagination: ${category.paginationInfo.hasPagination ? 'Yes' : 'No'}`);
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
    const totalSlideSections = allDetailedPositions.reduce((sum, cat) => sum + cat.slideSections.length, 0);
    const totalPositionsWithDescriptions = allDetailedPositions.reduce((sum, cat) => 
      sum + cat.positions.filter(p => p.description).length, 0);
    const totalPositionsWithImages = allDetailedPositions.reduce((sum, cat) => 
      sum + cat.positions.filter(p => p.images.length > 0).length, 0);
    
    console.log(`\n🎯 PAGINATION-BASED FINAL TOTALS:`);
    console.log(`   Expected Positions: ${totalExpected}`);
    console.log(`   Scraped Positions: ${totalScraped}`);
    console.log(`   Total Slide Sections: ${totalSlideSections}`);
    console.log(`   Total Images: ${totalImages}`);
    console.log(`   Positions with Descriptions: ${totalPositionsWithDescriptions}`);
    console.log(`   Positions with Images: ${totalPositionsWithImages}`);
    console.log(`   Success Rate: ${((totalScraped / totalExpected) * 100).toFixed(1)}%`);
    console.log(`   Description Rate: ${((totalPositionsWithDescriptions / totalScraped) * 100).toFixed(1)}%`);
    console.log(`   Image Rate: ${((totalPositionsWithImages / totalScraped) * 100).toFixed(1)}%`);

    // Copy to public folder for the frontend
    fs.copyFileSync('all-positions-with-pagination.json', 'public/all-positions-with-pagination.json');
    console.log(`\n📁 Copied to public/all-positions-with-pagination.json for frontend use`);

  } catch (error) {
    console.error('Error during pagination-based scraping:', error);
  } finally {
    await browser.close();
  }
}

// Run the pagination-based scraper
scrapePositionsWithPagination();
