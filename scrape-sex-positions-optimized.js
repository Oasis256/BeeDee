import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapePositionsWithLazyLoading() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const allDetailedPositions = [];
  const progressFile = 'scraping-progress.json';
  const resultsFile = 'all-positions-with-lazy-loading.json';

  // Load existing results if available
  let existingResults = [];
  if (fs.existsSync(resultsFile)) {
    try {
      existingResults = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
      console.log(`📂 Loaded existing results: ${existingResults.length} articles already scraped`);
    } catch (error) {
      console.log('⚠️ Could not load existing results file, starting fresh');
    }
  }

  // Load progress if exists
  let progress = { completed: [], failed: [], partial: [] };
  if (fs.existsSync(progressFile)) {
    try {
      progress = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
      console.log(`📂 Resuming from progress: ${progress.completed.length} completed, ${progress.failed.length} failed, ${progress.partial.length} partial`);
    } catch (error) {
      console.log('⚠️ Could not load progress file, starting fresh');
    }
    // Initialize partial from existing results if not in progress
    if (progress.partial.length === 0 && existingResults.length > 0) {
      existingResults.forEach(article => {
        if (article.scrapedCount > 0 && article.scrapedCount < 5) { // Consider < 5 positions as partial
          progress.partial.push({ 
            url: article.originalUrl, 
            title: article.title, 
            positions: article.scrapedCount,
            reason: 'Low position count'
          });
        }
      });
    }
  }

  // Add specific shower sex position URLs
  const specificUrls = [
    'https://www.cosmopolitan.com/sex-love/a5015/shower-sex-positions/',
    'https://www.cosmopolitan.com/sex-love/positions/g36729324/standing-69-positions/'
  ];

  // Step 1: Discover all article URLs from the main index pages
  console.log(`\n🎯 STEP 1: Discovering all article URLs from index pages...`);
  const discoveredArticles = await discoverArticles(browser);
  console.log(`📊 Discovered ${discoveredArticles.length} articles from index pages`);

  // Add specific URLs to discovered articles with proper titles
  specificUrls.forEach(url => {
    if (!discoveredArticles.some(article => article.url === url)) {
      let title = 'Sex Positions';
      let category = 'Sex Positions';
      
      // Set specific titles for known URLs
      if (url.includes('shower-sex-positions')) {
        title = 'Shower Sex Positions';
      } else if (url.includes('standing-69-positions')) {
        title = 'Standing 69 Positions';
      }
      
      discoveredArticles.push({
        url: url,
        title: title,
        category: category
      });
    }
  });
  
  // Force re-scraping of specific articles that may have wrong content
  const forceRescrapeUrls = [
    'https://www.cosmopolitan.com/sex-love/a5015/shower-sex-positions/',
    'https://www.cosmopolitan.com/sex-love/positions/g36729324/standing-69-positions/'
  ];
  
  // Remove these from completed progress to force re-scraping
  progress.completed = progress.completed.filter(completed => 
    !forceRescrapeUrls.includes(completed.url)
  );
  
  // Also remove from existing results to force complete re-scraping
  existingResults = existingResults.filter(result => 
    !forceRescrapeUrls.includes(result.originalUrl)
  );
  
  console.log('🔄 Forcing re-scrape of shower sex positions and standing 69 positions articles');

  // Step 2: Identify articles that need scraping (failed, partial, or new)
  console.log(`\n🎯 STEP 2: Identifying articles that need scraping...`);
  
  const articlesToScrape = [];
  
  // Add failed articles
  progress.failed.forEach(failed => {
    const article = discoveredArticles.find(a => a.url === failed.url) || {
      url: failed.url,
      title: failed.title,
      category: 'Sex Positions'
    };
    articlesToScrape.push({ ...article, reason: 'Failed', originalError: failed.error });
  });
  
  // Add partial success articles
  progress.partial.forEach(partial => {
    const article = discoveredArticles.find(a => a.url === partial.url) || {
      url: partial.url,
      title: partial.title,
      category: 'Sex Positions'
    };
    articlesToScrape.push({ ...article, reason: 'Partial', originalCount: partial.positions });
  });
  
  // Add new articles not in any progress category
  discoveredArticles.forEach(article => {
    const isCompleted = progress.completed.some(c => c.url === article.url);
    const isFailed = progress.failed.some(f => f.url === article.url);
    const isPartial = progress.partial.some(p => p.url === article.url);
    const isInQueue = articlesToScrape.some(q => q.url === article.url);
    
    if (!isCompleted && !isFailed && !isPartial && !isInQueue) {
      articlesToScrape.push({ ...article, reason: 'New' });
    }
  });

  console.log(`📋 Articles to scrape: ${articlesToScrape.length}`);
  console.log(`   - Failed: ${articlesToScrape.filter(a => a.reason === 'Failed').length}`);
  console.log(`   - Partial: ${articlesToScrape.filter(a => a.reason === 'Partial').length}`);
  console.log(`   - New: ${articlesToScrape.filter(a => a.reason === 'New').length}`);

  if (articlesToScrape.length === 0) {
    console.log(`\n🎉 All articles are already successfully scraped! No work needed.`);
    
    // Merge existing results with any new data
    const finalResults = [...existingResults];
    fs.writeFileSync(resultsFile, JSON.stringify(finalResults, null, 2));
    fs.copyFileSync(resultsFile, 'public/all-sex-positions.json');
    console.log(`📁 Updated public/all-sex-positions.json with existing data`);
    
    await browser.close();
    return;
  }

  // Step 3: Scrape articles that need work with parallel processing
  console.log(`\n🎯 STEP 3: Scraping articles that need work...`);
  
  // Process articles in parallel batches of 5
  const batchSize = 5;
  for (let i = 0; i < articlesToScrape.length; i += batchSize) {
    const batch = articlesToScrape.slice(i, i + batchSize);
    console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(articlesToScrape.length/batchSize)} (${batch.length} articles)`);
    
    const batchPromises = batch.map(article => scrapeArticle(browser, article));
    
    const batchResults = await Promise.allSettled(batchPromises);
    
    batchResults.forEach((result, index) => {
      const article = batch[index];
      if (result.status === 'fulfilled' && result.value) {
        // Check if this is a retry of a failed/partial article
        const existingIndex = existingResults.findIndex(existing => existing.originalUrl === article.url);
        if (existingIndex >= 0) {
          // Update existing result
          existingResults[existingIndex] = result.value;
          console.log(`🔄 Updated: ${result.value.category} (${result.value.scrapedCount} positions) - was ${article.reason}`);
        } else {
          // Add new result
          existingResults.push(result.value);
          console.log(`✅ New: ${result.value.category} (${result.value.scrapedCount} positions)`);
        }
        
        // Update progress
        progress.completed.push({ url: article.url, title: article.title, positions: result.value.scrapedCount });
        
        // Remove from failed/partial if it was there
        progress.failed = progress.failed.filter(f => f.url !== article.url);
        progress.partial = progress.partial.filter(p => p.url !== article.url);
        
      } else {
        const error = result.reason?.message || 'Unknown error';
        console.log(`❌ Failed to scrape: ${article.title} - ${error}`);
        
        // Update progress
        if (article.reason === 'Failed') {
          // Update existing failed entry
          const failedIndex = progress.failed.findIndex(f => f.url === article.url);
          if (failedIndex >= 0) {
            progress.failed[failedIndex].error = error;
            progress.failed[failedIndex].retryCount = (progress.failed[failedIndex].retryCount || 0) + 1;
          }
        } else {
          // Add new failed entry
          progress.failed.push({ 
            url: article.url, 
            title: article.title, 
            error: error,
            retryCount: 1
          });
        }
      }
    });
    
    // Save progress after each batch
    fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2));
    
    // Save results after each batch
    fs.writeFileSync(resultsFile, JSON.stringify(existingResults, null, 2));
    
    // Reduced delay between batches
    if (i + batchSize < articlesToScrape.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Final save and copy
  fs.writeFileSync(resultsFile, JSON.stringify(existingResults, null, 2));
  console.log(`\n🎉 Successfully processed ${articlesToScrape.length} articles!`);
  
  // Print summary
  printSummary(existingResults);

  // Copy to public folder for the frontend
  fs.copyFileSync(resultsFile, 'public/all-sex-positions.json');
  console.log(`\n📁 Copied to public/all-sex-positions.json for frontend use`);

  // Keep progress file for future runs (don't delete it)
  console.log(`📁 Progress saved for future runs`);

  await browser.close();
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
          // Updated to handle both old slide format and new listicle format
          let slideSections = Array.from(document.querySelectorAll('section[id^="slide-"]'));

          // If no old format found, try new listicle format
          if (slideSections.length === 0) {
            slideSections = Array.from(document.querySelectorAll('div[data-theme-key="listicle-slide-inner-container"]'));
            console.log(`Found ${slideSections.length} listicle slide sections on page ${currentPageNumber}`);
          } else {
          console.log(`Found ${slideSections.length} slide sections on page ${currentPageNumber}`);
          }
          
          data.lazyLoadInfo.totalSlideSections = slideSections.length;

          // Process each slide section with enhanced extraction
          slideSections.forEach((section, index) => {
            let positionTitle = '';
            let description = '';
            let howToDoIt = '';
            let foundImages = [];

            // Enhanced title extraction with better filtering
             // Try new listicle format first, then fall back to old format
             let titleElements = section.querySelectorAll('h2[data-theme-key="listicle-slide-item-title"]');
             if (titleElements.length === 0) {
               titleElements = section.querySelectorAll('h1, h2, h3, h4, h5, h6, strong, b');
             }
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
               // Try to get position number from listicle format first
               const numberSpan = section.querySelector('span.css-n8n0ey');
               if (numberSpan) {
                 const numberText = numberSpan.textContent.trim();
                 const numberMatch = numberText.match(/(\d+)/);
                 if (numberMatch) {
                   // Look for title in the same section
                   const titleH2 = section.querySelector('h2[data-theme-key="listicle-slide-item-title"]');
                   if (titleH2) {
                     positionTitle = titleH2.textContent.trim();
                   }
                 }
               }
               
               // Fall back to old pattern detection
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
            }

            // Enhanced image extraction with better filtering
            const images = Array.from(section.querySelectorAll('img'))
               .map(img => {
                 // Try to get photo credit from listicle format
                 let photoCredit = '';
                 const figcaption = img.closest('div').querySelector('figcaption span.css-170cidh');
                 if (figcaption) {
                   photoCredit = figcaption.textContent.trim();
                 }
                 
                 return {
                src: img.src,
                alt: img.alt || '',
                width: img.width,
                   height: img.height,
                   photoCredit: photoCredit
                 };
               })
              .filter(img => isValidImage(img));

            foundImages = images;

            // Enhanced text extraction with better validation
             // Try new listicle format first, then fall back to old format
             let paragraphs = section.querySelectorAll('div[data-theme-key="listicle-slide-item-meta"] p');
             if (paragraphs.length === 0) {
               paragraphs = section.querySelectorAll('p');
             }
            const allText = [];
            
            paragraphs.forEach(p => {
              const text = p.textContent.trim();
              if (isValidContent(text)) {
                allText.push(text);
              }
            });

            // Also look in div elements with validation
             // For listicle format, look in the specific content areas
             let divs = section.querySelectorAll('div[data-theme-key="listicle-slide-item-meta"] div');
             if (divs.length === 0) {
               divs = section.querySelectorAll('div');
             }
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
               // Try to get the actual position number from listicle format
               let positionNumber = data.positions.length + 1;
               const numberSpan = section.querySelector('span.css-n8n0ey');
               if (numberSpan) {
                 const numberText = numberSpan.textContent.trim();
                 const numberMatch = numberText.match(/(\d+)/);
                 if (numberMatch) {
                   positionNumber = parseInt(numberMatch[1]);
                 }
               }
               
              data.positions.push({
                 number: positionNumber,
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
            
             // First try listicle format as alternative
             const listicleSections = Array.from(document.querySelectorAll('div[data-theme-key="listicle-slide-inner-container"]'));
             if (listicleSections.length > 0) {
               console.log(`Found ${listicleSections.length} listicle sections, trying to extract positions...`);
               
               listicleSections.forEach((section, index) => {
                 let positionTitle = '';
                 let description = '';
                 let howToDoIt = '';
                 let foundImages = [];
                 
                 // Extract title from listicle format
                 const titleH2 = section.querySelector('h2[data-theme-key="listicle-slide-item-title"]');
                 if (titleH2) {
                   positionTitle = titleH2.textContent.trim();
                 }
                 
                 // Extract position number
                 let positionNumber = index + 1;
                 const numberSpan = section.querySelector('span.css-n8n0ey');
                 if (numberSpan) {
                   const numberText = numberSpan.textContent.trim();
                   const numberMatch = numberText.match(/(\d+)/);
                   if (numberMatch) {
                     positionNumber = parseInt(numberMatch[1]);
                   }
                 }
                 
                 // Extract images with photo credits
                 const images = Array.from(section.querySelectorAll('img'))
                   .map(img => {
                     let photoCredit = '';
                     const figcaption = img.closest('div').querySelector('figcaption span.css-170cidh');
                     if (figcaption) {
                       photoCredit = figcaption.textContent.trim();
                     }
                     
                     return {
                       src: img.src,
                       alt: img.alt || '',
                       width: img.width,
                       height: img.height,
                       photoCredit: photoCredit
                     };
                   })
                   .filter(img => isValidImage(img));
                 
                 foundImages = images;
                 
                 // Extract description from listicle meta
                 const metaDiv = section.querySelector('div[data-theme-key="listicle-slide-item-meta"]');
                 if (metaDiv) {
                   const paragraphs = metaDiv.querySelectorAll('p');
                   const allText = [];
                   
                   paragraphs.forEach(p => {
                     const text = p.textContent.trim();
                     if (isValidContent(text)) {
                       allText.push(text);
                     }
                   });
                   
                   if (allText.length > 0) {
                     const cleanTexts = allText.map(text => {
                       let cleanText = text.replace(/@[A-Z0-9_]+/g, '').trim();
                       cleanText = cleanText.replace(/\s+/g, ' ').trim();
                       cleanText = cleanText.replace(/SHOP NOW.*$/i, '').trim();
                       cleanText = cleanText.replace(/Buy Now.*$/i, '').trim();
                       return cleanText;
                     }).filter(text => text.length > 10 && isValidContent(text));
                     
                     if (cleanTexts.length > 0) {
                       description = cleanTexts[0];
                       
                       if (cleanTexts.length > 1) {
                         howToDoIt = cleanTexts[1];
                       }
                     }
                   }
                 }
                 
                 // Add position if valid
                 if (positionTitle && (description || foundImages.length > 0) && isValidContent(positionTitle)) {
                   data.positions.push({
                     number: positionNumber,
                     title: positionTitle,
                     description: description.trim(),
                     howToDoIt: howToDoIt.trim(),
                     images: foundImages,
                     slideId: section.id || `listicle-${index}`,
                     pageNumber: currentPageNumber
                   });
                   data.lazyLoadInfo.slideSectionsWithContent++;
                 }
               });
               
               if (data.positions.length > 0) {
                 console.log(`Successfully extracted ${data.positions.length} positions from listicle format`);
                 return;
               }
             }
             
             // Fall back to old body-image method
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
