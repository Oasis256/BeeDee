import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapePositionsWithLazyLoading() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-extensions'
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined
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
      console.log(`\n🎯 SCRAPING WITH LAZY LOADING: ${position.category}`);
      console.log(`Expected: ${position.expectedCount} positions`);
      
      try {
        await page.goto(position.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 15000));

        // Initial scroll to trigger lazy loading
        console.log(`   Initial scroll to trigger lazy loading...`);
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

        // Wait for lazy loading to complete
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Scroll again to make sure all content is loaded
        console.log(`   Second scroll to ensure all content is loaded...`);
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

        // Wait again for any remaining lazy loading
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Scroll to top to start fresh
        await page.evaluate(() => {
          window.scrollTo(0, 0);
        });

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Now extract all slide sections after lazy loading
        const lazyLoadData = await page.evaluate((categoryInfo) => {
          const data = {
            title: document.title,
            positions: [],
            allImages: [],
            slideSections: [],
            lazyLoadInfo: {
              totalSlideSections: 0,
              slideSectionsWithContent: 0,
              slideSectionsWithoutContent: 0
            }
          };

          // Find all slide sections after lazy loading
          const slideSections = Array.from(document.querySelectorAll('section[id^="slide-"]'));
          data.lazyLoadInfo.totalSlideSections = slideSections.length;
          
          data.slideSections = slideSections.map(section => ({
            id: section.id,
            className: section.className,
            children: section.children.length
          }));

          console.log(`Found ${slideSections.length} slide sections after lazy loading`);

          // Process each slide section
          slideSections.forEach((section, index) => {
            let positionTitle = '';
            let description = '';
            let howToDoIt = '';
            let foundImages = [];

            // Look for position title in the slide
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

            // If no title found in headings, look for numbered patterns
            if (!positionTitle) {
              const allText = section.textContent;
              const numberMatches = allText.match(/\d+\.\s+([A-Z][^.!?]+)/g);
              if (numberMatches && numberMatches.length > 0) {
                positionTitle = numberMatches[0].replace(/^\d+\.\s*/, '').trim();
              }
            }

            // Look for images in this slide
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

            // Look for description and how-to content in the slide
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

            // Only add if we have a title and some content
            if (positionTitle && (description || foundImages.length > 0)) {
              data.positions.push({
                number: data.positions.length + 1,
                title: positionTitle,
                description: description.trim(),
                howToDoIt: howToDoIt.trim(),
                images: foundImages,
                slideId: section.id
              });
              data.lazyLoadInfo.slideSectionsWithContent++;
            } else {
              data.lazyLoadInfo.slideSectionsWithoutContent++;
            }
          });

          // Get all images for the category
          const allImages = Array.from(document.querySelectorAll('img')).map(img => ({
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

          data.allImages = allImages;

          return data;
        }, position);

        if (lazyLoadData.title) {
          allDetailedPositions.push({
            category: position.category,
            expectedCount: position.expectedCount,
            title: lazyLoadData.title,
            description: `Lazy-loading optimized ${position.category.toLowerCase()} guide with detailed instructions and matched images.`,
            images: lazyLoadData.allImages.slice(0, 20).map(img => ({
              src: img.src,
              alt: img.alt,
              width: img.width,
              height: img.height
            })),
            positions: lazyLoadData.positions,
            originalUrl: position.url,
            scrapedCount: lazyLoadData.positions.length,
            slideSections: lazyLoadData.slideSections,
            lazyLoadInfo: lazyLoadData.lazyLoadInfo
          });

          console.log(`✅ Successfully scraped: ${lazyLoadData.title}`);
          console.log(`📊 Found ${lazyLoadData.positions.length} positions from ${lazyLoadData.lazyLoadInfo.totalSlideSections} slide sections (expected ${position.expectedCount})`);
          console.log(`🖼️ Found ${lazyLoadData.allImages.length} total images`);
          console.log(`🎯 Positions with descriptions: ${lazyLoadData.positions.filter(p => p.description).length}`);
          console.log(`🎯 Positions with images: ${lazyLoadData.positions.filter(p => p.images.length > 0).length}`);
          console.log(`📈 Slide sections with content: ${lazyLoadData.lazyLoadInfo.slideSectionsWithContent}`);
          console.log(`📈 Slide sections without content: ${lazyLoadData.lazyLoadInfo.slideSectionsWithoutContent}`);
          
          const successRate = ((lazyLoadData.positions.length / position.expectedCount) * 100).toFixed(1);
          console.log(`📈 Success Rate: ${successRate}%`);
          
          if (lazyLoadData.positions.length >= position.expectedCount) {
            console.log(`🎉 EXCEEDED EXPECTATIONS! Found ${lazyLoadData.positions.length - position.expectedCount} extra positions`);
          } else {
            console.log(`⚠️ Still missing ${position.expectedCount - lazyLoadData.positions.length} positions`);
          }
        }

      } catch (error) {
        console.error(`❌ Error scraping ${position.url}:`, error.message);
      }
    }

    // Save the lazy-loading optimized scraped data
    fs.writeFileSync('all-positions-with-lazy-loading.json', JSON.stringify(allDetailedPositions, null, 2));
    console.log(`\n🎉 Successfully scraped lazy-loading optimized positions for ${allDetailedPositions.length} categories!`);
    
    // Print comprehensive summary
    console.log('\n📊 LAZY-LOADING OPTIMIZED SUCCESS RATE SUMMARY:');
    allDetailedPositions.forEach((category, index) => {
      console.log(`\n${index + 1}. ${category.category}`);
      console.log(`   Article: ${category.title}`);
      console.log(`   Expected: ${category.expectedCount} positions`);
      console.log(`   Scraped: ${category.scrapedCount} positions`);
      console.log(`   Total Slide Sections: ${category.lazyLoadInfo.totalSlideSections}`);
      console.log(`   Slide Sections with Content: ${category.lazyLoadInfo.slideSectionsWithContent}`);
      console.log(`   Slide Sections without Content: ${category.lazyLoadInfo.slideSectionsWithoutContent}`);
      console.log(`   Total Images: ${category.images.length}`);
      console.log(`   Positions with Descriptions: ${category.positions.filter(p => p.description).length}`);
      console.log(`   Positions with Images: ${category.positions.filter(p => p.images.length > 0).length}`);
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
    const totalSlideSections = allDetailedPositions.reduce((sum, cat) => sum + cat.lazyLoadInfo.totalSlideSections, 0);
    const totalPositionsWithDescriptions = allDetailedPositions.reduce((sum, cat) => 
      sum + cat.positions.filter(p => p.description).length, 0);
    const totalPositionsWithImages = allDetailedPositions.reduce((sum, cat) => 
      sum + cat.positions.filter(p => p.images.length > 0).length, 0);
    
    console.log(`\n🎯 LAZY-LOADING OPTIMIZED FINAL TOTALS:`);
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
    fs.copyFileSync('all-sex-positions.json', 'public/all-sex-positions.json');
    console.log(`\n📁 Copied to public/all-sex-positions.json for frontend use`);

  } catch (error) {
    console.error('Error during lazy-loading optimized scraping:', error);
  } finally {
    await browser.close();
  }
}

async function discoverArticles(browser) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  const allArticles = [];
  const mainIndexUrl = 'https://www.cosmopolitan.com/sex-love/positions/';
  let pageNumber = 1;
  const maxPages = 20; // Safety limit
  let previousArticleCount = 0;
  
  while (pageNumber <= maxPages) {
    const indexUrl = pageNumber === 1 ? mainIndexUrl : `${mainIndexUrl}?page=${pageNumber}`;
    console.log(`   Loading index page ${pageNumber}: ${indexUrl}`);
    
    try {
      await page.goto(indexUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 2000)); // Reduced from 3000ms

      // Optimized scroll to trigger lazy loading
      await page.evaluate(() => {
        return new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 200; // Increased from 100
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            
            if(totalHeight >= scrollHeight){
              clearInterval(timer);
              resolve();
            }
          }, 50); // Reduced from 100ms
        });
      });

      await new Promise(resolve => setTimeout(resolve, 1000)); // Reduced from 2000ms

      // Extract all article links from this index page
      const pageArticles = await page.evaluate(() => {
        const articles = [];
        
        // Find all sections with data-vars-block-curation="curated"
        const curatedSections = Array.from(document.querySelectorAll('section[data-vars-block-curation="curated"]'));
        
        curatedSections.forEach(section => {
          const links = section.querySelectorAll('a');
          
          links.forEach((linkElement) => {
            const url = linkElement.href;
            const title = linkElement.textContent.trim();
            
            // Enhanced filtering for sex position articles
            if (url.includes('/sex-love/') && 
                (url.includes('positions') || url.includes('sex-positions') || url.includes('oral-sex') || 
                 url.includes('anal-sex') || url.includes('missionary') || url.includes('lesbian') ||
                 url.includes('first-time') || url.includes('romantic') || url.includes('masturbation') ||
                 url.includes('deep-penetration') || url.includes('chair-sex') || url.includes('rim-job') ||
                 url.includes('foursome') || url.includes('threesome') || url.includes('bridge') ||
                 url.includes('eiffel-tower') || url.includes('speed-bump'))) {
              
              // Skip navigation and utility links
              if (!url.includes('#') && 
                  !url.includes('auth') && 
                  !url.includes('search') && 
                  !url.includes('membership') &&
                  title.length > 5) {
                articles.push({
                  url: url,
                  title: title,
                  category: 'Sex Positions'
                });
              }
            }
          });
        });
        
        return articles;
      });

      console.log(`   Found ${pageArticles.length} article links on index page ${pageNumber}`);
      
      // Check if we've reached the end (same count as previous page)
      if (pageArticles.length === previousArticleCount && pageNumber > 1) {
        console.log(`   Same article count as previous page (${pageArticles.length}), reached the end`);
        break;
      }
      
      if (pageArticles.length === 0) {
        console.log(`   No article links found on page ${pageNumber}, stopping discovery`);
        break;
      }

      // Add unique articles only
      pageArticles.forEach(article => {
        const exists = allArticles.some(existing => existing.url === article.url);
        if (!exists) {
          allArticles.push(article);
        }
      });
      
      previousArticleCount = pageArticles.length;
      pageNumber++;
      
    } catch (error) {
      console.log(`   Error loading index page ${pageNumber}: ${error.message}`);
      break;
    }
  }

  await page.close();
  return allArticles;
}

async function scrapeArticle(browser, article) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  try {
    console.log(`   URL: ${article.url}`);
    
    // Load the article page with reduced wait time
    await page.goto(article.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 4000)); // Reduced from 8000ms

    // Optimized scroll to trigger lazy loading
    await page.evaluate(() => {
      return new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 200; // Increased from 100
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          
          if(totalHeight >= scrollHeight){
            clearInterval(timer);
            resolve();
          }
        }, 50); // Reduced from 100ms
      });
    });

    await new Promise(resolve => setTimeout(resolve, 2000)); // Reduced from 3000ms

    // Check for pagination and scrape all pages
    const allPositions = [];
    let pageNumber = 1;
    let maxPages = 20; // Safety limit
    let previousPositionCount = 0;
    
    while (pageNumber <= maxPages) {
      const pageUrl = pageNumber === 1 ? article.url : `${article.url}?page=${pageNumber}`;
      console.log(`   Loading page ${pageNumber}: ${pageUrl}`);
      
      try {
        if (pageNumber > 1) {
          await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
          await new Promise(resolve => setTimeout(resolve, 3000)); // Reduced from 5000ms
          
          // Optimized scroll for pagination
          await page.evaluate(() => {
            return new Promise((resolve) => {
              let totalHeight = 0;
              const distance = 200;
              const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                
                if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
                }
              }, 50);
            });
          });
          
          await new Promise(resolve => setTimeout(resolve, 1000)); // Reduced from 2000ms
        }

        // Enhanced lazy loading with fewer passes but more efficient
        console.log(`   Enhanced lazy loading to reveal all content...`);
        
        // More efficient scroll passes
        for (let pass = 0; pass < 3; pass++) { // Reduced from 5 passes
          await page.evaluate(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollTo(0, scrollHeight);
          });
          await new Promise(resolve => setTimeout(resolve, 2000)); // Reduced from 3000ms
        }
        
        // Scroll back to top
        await page.evaluate(() => {
          window.scrollTo(0, 0);
        });
        
        // Final wait for any remaining lazy loading
        await new Promise(resolve => setTimeout(resolve, 3000)); // Reduced from 5000ms

        // Extract positions from this page using enhanced logic
        const pageData = await page.evaluate((articleInfo, currentPageNumber) => {
          const data = {
            title: document.title,
            positions: [],
            allImages: [],
            lazyLoadInfo: {
              totalSlideSections: 0,
              slideSectionsWithContent: 0,
              slideSectionsWithoutContent: 0
            }
          };

          // Enhanced image filtering function
          const isValidImage = (img) => {
            return img.src && 
                   !img.src.includes('logo') && 
                   !img.src.includes('ad') && 
                   !img.src.includes('icon') &&
                   !img.src.includes('search') &&
                   !img.src.includes('close') &&
                   !img.src.includes('button') &&
                   !img.src.includes('banner') &&
                   !img.src.includes('social') &&
                   !img.src.includes('share') &&
                   !img.src.includes('play') &&
                   !img.src.includes('pause') &&
                   !img.src.includes('volume') &&
                   !img.src.includes('fullscreen') &&
                   img.width > 150 && // Increased from 100
                   img.height > 150 && // Increased from 100
                   img.width < 2000 && // Added max size
                   img.height < 2000; // Added max size
          };

          // Enhanced content validation function
          const isValidContent = (text) => {
            if (!text || text.length < 10 || text.length > 2000) return false;
            
            const excludeKeywords = [
              'advertisement', 'sponsored', 'click here', 'subscribe', 'newsletter',
              'follow us', 'share this', 'related articles', 'more from', 'read more',
              'cookie policy', 'privacy policy', 'terms of service', 'contact us'
            ];
            
            return !excludeKeywords.some(keyword => text.toLowerCase().includes(keyword));
          };

          // Find all slide sections - this is where positions are located
          const slideSections = Array.from(document.querySelectorAll('section[id^="slide-"]'));
          data.lazyLoadInfo.totalSlideSections = slideSections.length;

          console.log(`Found ${slideSections.length} slide sections on page ${currentPageNumber}`);

          // Process each slide section with enhanced extraction
          slideSections.forEach((section, index) => {
            let positionTitle = '';
            let description = '';
            let howToDoIt = '';
            let foundImages = [];

            // Enhanced title extraction with better filtering
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
                  text.length < 150 &&
                  isValidContent(text)) {
                positionTitle = text;
                break;
              }
            }

            // Enhanced numbered pattern detection
            if (!positionTitle) {
              const allText = section.textContent;
              const numberMatches = allText.match(/\d+\.\s+([A-Z][^.!?]+)/g);
              if (numberMatches && numberMatches.length > 0) {
                const potentialTitle = numberMatches[0].replace(/^\d+\.\s*/, '').trim();
                if (isValidContent(potentialTitle)) {
                  positionTitle = potentialTitle;
                }
              }
            }

            // Enhanced image extraction with better filtering
            const images = Array.from(section.querySelectorAll('img'))
              .map(img => ({
                src: img.src,
                alt: img.alt || '',
                width: img.width,
                height: img.height
              }))
              .filter(img => isValidImage(img));

            foundImages = images;

            // Enhanced text extraction with better validation
            const paragraphs = Array.from(section.querySelectorAll('p'));
            const allText = [];
            
            paragraphs.forEach(p => {
              const text = p.textContent.trim();
              if (isValidContent(text)) {
                allText.push(text);
              }
            });

            // Also look in div elements with validation
            const divs = Array.from(section.querySelectorAll('div'));
            divs.forEach(div => {
              const text = div.textContent.trim();
              if (isValidContent(text) && !allText.includes(text)) {
                allText.push(text);
              }
            });

            // Process the extracted text with enhanced cleaning
            if (allText.length > 0) {
              const cleanTexts = allText.map(text => {
                let cleanText = text.replace(/@[A-Z0-9_]+/g, '').trim();
                cleanText = cleanText.replace(/\s+/g, ' ').trim();
                cleanText = cleanText.replace(/SHOP NOW.*$/i, '').trim(); // Remove shop now text
                cleanText = cleanText.replace(/Buy Now.*$/i, '').trim(); // Remove buy now text
                return cleanText;
              }).filter(text => text.length > 10 && isValidContent(text));

              if (cleanTexts.length > 0) {
                description = cleanTexts[0];
                
                // Enhanced instruction detection
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
                      text.includes('finally') ||
                      text.includes('while') ||
                      text.includes('during') ||
                      text.includes('partner')) {
                    howToDoIt = cleanTexts[i];
                    break;
                  }
                }
                
                if (!howToDoIt && cleanTexts.length > 1) {
                  howToDoIt = cleanTexts[1];
                }
              }
            }

            // Enhanced validation before adding position
            if (positionTitle && (description || foundImages.length > 0) && isValidContent(positionTitle)) {
              data.positions.push({
                number: data.positions.length + 1,
                title: positionTitle,
                description: description.trim(),
                howToDoIt: howToDoIt.trim(),
                images: foundImages,
                slideId: section.id,
                pageNumber: currentPageNumber
              });
              data.lazyLoadInfo.slideSectionsWithContent++;
            } else {
              data.lazyLoadInfo.slideSectionsWithoutContent++;
            }
          });

          // Enhanced image collection with better filtering
          const allImages = Array.from(document.querySelectorAll('img'))
            .map(img => ({
              src: img.src,
              alt: img.alt || '',
              width: img.width,
              height: img.height
            }))
            .filter(img => isValidImage(img));

          data.allImages = allImages;

          // Enhanced alternative method for missing positions
          if (data.positions.length === 0) {
            console.log(`No positions found in slide sections, trying alternative method...`);
            
            // Find sections with data-embed="body-image" that contain images
            const bodyImageSections = Array.from(document.querySelectorAll('section[data-embed="body-image"]'));
            console.log(`Found ${bodyImageSections.length} body-image sections`);
            
            bodyImageSections.forEach((section, index) => {
              const images = section.querySelectorAll('img');
              if (images.length > 0) {
                // Look for h2 elements with data-node-id near this section
                const h2Elements = Array.from(document.querySelectorAll('h2[data-node-id]'));
                
                h2Elements.forEach(h2 => {
                  const title = h2.textContent.trim();
                  
                  // Enhanced proximity detection
                  let closestSection = null;
                  let minDistance = Infinity;
                  
                  bodyImageSections.forEach(bodySection => {
                    const h2Rect = h2.getBoundingClientRect();
                    const sectionRect = bodySection.getBoundingClientRect();
                    const distance = Math.abs(h2Rect.top - sectionRect.top);
                    
                    if (distance < minDistance && distance < 300) { // Reduced from 500px
                      minDistance = distance;
                      closestSection = bodySection;
                    }
                  });
                  
                  if (closestSection === section && title && 
                      !title.includes('Sex Positions') && 
                      !title.includes('Oral Sex') &&
                      !title.includes('Missionary') &&
                      !title.includes('Anal Sex') &&
                      !title.includes('Chair Sex') &&
                      !title.includes('Lesbian Sex') &&
                      !title.includes('First-Time') &&
                      !title.includes('Romantic Sex') &&
                      !title.includes('Masturbation') &&
                      !title.includes('Deep Penetration') &&
                      !title.includes('Advertisement') &&
                      !title.includes('Related') &&
                      !title.includes('More') &&
                      !title.includes('Read') &&
                      !title.includes('Follow') &&
                      !title.includes('Subscribe') &&
                      !title.includes('Newsletter') &&
                      !title.includes('Tips') &&
                      !title.includes('Guide') &&
                      !title.includes('Expert') &&
                      title.length > 3 && 
                      title.length < 150 &&
                      isValidContent(title)) {
                    
                    // Extract images from the related body-image section
                    const sectionImages = Array.from(section.querySelectorAll('img'))
                      .map(img => ({
                        src: img.src,
                        alt: img.alt || '',
                        width: img.width,
                        height: img.height
                      }))
                      .filter(img => isValidImage(img));
                    
                    // Enhanced text extraction for alternative method
                    let description = '';
                    let howToDoIt = '';
                    
                    let nextElement = h2.nextElementSibling;
                    let elementCount = 0;
                    const allText = [];
                    
                    while (nextElement && elementCount < 5) {
                      const text = nextElement.textContent.trim();
                      if (isValidContent(text) && !allText.includes(text)) {
                        allText.push(text);
                      }
                      nextElement = nextElement.nextElementSibling;
                      elementCount++;
                    }
                    
                    if (allText.length > 0) {
                      const cleanTexts = allText.map(text => {
                        let cleanText = text.replace(/@[A-Z0-9_]+/g, '').trim();
                        cleanText = cleanText.replace(/\s+/g, ' ').trim();
                        cleanText = cleanText.replace(/SHOP NOW.*$/i, '').trim();
                        cleanText = cleanText.replace(/Buy Now.*$/i, '').trim();
                        return cleanText;
                      }).filter(text => text.length > 5 && isValidContent(text));

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
                              text.includes('finally') ||
                              text.includes('while') ||
                              text.includes('during') ||
                              text.includes('partner')) {
                            howToDoIt = cleanTexts[i];
                            break;
                          }
                        }
                        
                        if (!howToDoIt && cleanTexts.length > 1) {
                          howToDoIt = cleanTexts[1];
                        }
                      }
                    }
                    
                    // Add the position if we have valid content
                    if (title && (description || sectionImages.length > 0) && isValidContent(title)) {
                      data.positions.push({
                        number: data.positions.length + 1,
                        title: title,
                        description: description.trim(),
                        howToDoIt: howToDoIt.trim(),
                        images: sectionImages,
                        slideId: h2.getAttribute('data-node-id'),
                        pageNumber: currentPageNumber,
                        source: 'h2-with-body-image'
                      });
                      data.lazyLoadInfo.slideSectionsWithContent++;
                    }
                  }
                });
              }
            });
            
            console.log(`Alternative method found ${data.positions.length} positions`);
          }

          return data;
        }, article, pageNumber);

        // Check if this page has any new positions
        if (pageData.positions.length === 0) {
          console.log(`   No positions found on page ${pageNumber}, stopping pagination`);
          break;
        }

        // Check if we've reached the end (same count as previous page)
        if (pageData.positions.length === previousPositionCount && pageNumber > 1) {
          console.log(`   Same position count as previous page (${pageData.positions.length}), reached the end`);
          break;
        }

        // Add positions from this page to our collection
        allPositions.push(...pageData.positions);
        console.log(`   Found ${pageData.positions.length} positions on page ${pageNumber} (total: ${allPositions.length})`);

        previousPositionCount = pageData.positions.length;
        pageNumber++;
        
      } catch (error) {
        console.log(`   Error loading page ${pageNumber}: ${error.message}`);
        break;
      }
    }

    // Create the final result object
    const result = {
      category: article.category,
      title: article.title,
      description: `Article: ${article.title}`,
      images: [],
      positions: allPositions,
      originalUrl: article.url,
      scrapedCount: allPositions.length,
      pagesScraped: pageNumber - 1,
      lazyLoadInfo: {
        totalSlideSections: allPositions.length,
        slideSectionsWithContent: allPositions.length,
        slideSectionsWithoutContent: 0
      }
    };

    await page.close();
    return result;
    
  } catch (error) {
    console.error(`❌ Error scraping article ${article.url}:`, error.message);
    await page.close();
    return null;
  }
}

function printSummary(allDetailedPositions) {
  console.log('\n📊 COMPREHENSIVE SEX POSITIONS SUMMARY:');
  allDetailedPositions.forEach((category, index) => {
    console.log(`\n${index + 1}. ${category.category}`);
    console.log(`   Article: ${category.title}`);
    console.log(`   Scraped: ${category.scrapedCount} positions`);
    console.log(`   Pages Scraped: ${category.pagesScraped}`);
    console.log(`   Total Images: ${category.images.length}`);
    console.log(`   Positions with Descriptions: ${category.positions.filter(p => p.description).length}`);
    console.log(`   Positions with Images: ${category.positions.filter(p => p.images.length > 0).length}`);
    console.log(`   URL: ${category.originalUrl}`);
    console.log(`   ✅ Successfully scraped ${category.scrapedCount} positions`);
  });

  // Calculate totals
  const totalScraped = allDetailedPositions.reduce((sum, cat) => sum + cat.scrapedCount, 0);
  const totalImages = allDetailedPositions.reduce((sum, cat) => sum + cat.images.length, 0);
  const totalPositionsWithDescriptions = allDetailedPositions.reduce((sum, cat) => 
    sum + cat.positions.filter(p => p.description).length, 0);
  const totalPositionsWithImages = allDetailedPositions.reduce((sum, cat) => 
    sum + cat.positions.filter(p => p.images.length > 0).length, 0);
  
  console.log(`\n🎯 COMPREHENSIVE SEX POSITIONS FINAL TOTALS:`);
  console.log(`   Articles Scraped: ${allDetailedPositions.length}`);
  console.log(`   Total Positions: ${totalScraped}`);
  console.log(`   Total Images: ${totalImages}`);
  console.log(`   Positions with Descriptions: ${totalPositionsWithDescriptions}`);
  console.log(`   Positions with Images: ${totalPositionsWithImages}`);
  console.log(`   Description Rate: ${((totalPositionsWithDescriptions / totalScraped) * 100).toFixed(1)}%`);
  console.log(`   Image Rate: ${((totalPositionsWithImages / totalScraped) * 100).toFixed(1)}%`);
}

// Run the enhanced scraper
scrapePositionsWithLazyLoading();

