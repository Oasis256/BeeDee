import puppeteer from 'puppeteer';
import fs from 'fs';

// Helper function to determine category from article title
function determineCategoryFromTitle(title) {
  const lowerTitle = title.toLowerCase();
  
  if (lowerTitle.includes('blow job') || lowerTitle.includes('oral')) {
    return 'Oral Positions';
  } else if (lowerTitle.includes('69') || lowerTitle.includes('plumber')) {
    return '69 Positions';
  } else if (lowerTitle.includes('guide')) {
    return 'Position Guides';
  } else if (lowerTitle.includes('eiffel tower')) {
    return 'Threesome Positions';
  } else if (lowerTitle.includes('flatiron')) {
    return 'Advanced Positions';
  } else if (lowerTitle.includes('rim job')) {
    return 'Anal Positions';
  } else if (lowerTitle.includes('bridge')) {
    return 'Advanced Positions';
  } else if (lowerTitle.includes('speed bump')) {
    return 'Advanced Positions';
  } else if (lowerTitle.includes('pinball wizard')) {
    return 'Advanced Positions';
  } else if (lowerTitle.includes('adventurous')) {
    return 'Adventure Positions';
  } else if (lowerTitle.includes('foursome')) {
    return 'Group Positions';
  } else if (lowerTitle.includes('threesome')) {
    return 'Threesome Positions';
  } else if (lowerTitle.includes('side')) {
    return 'Side Positions';
  } else if (lowerTitle.includes('behind')) {
    return 'Behind Positions';
  } else if (lowerTitle.includes('cowboy') || lowerTitle.includes('cowgirl')) {
    return 'Advanced Positions';
  } else if (lowerTitle.includes('romantic')) {
    return 'Romantic Positions';
  } else {
    return 'General Positions';
  }
}

async function processFailedArticles() {
  console.log('🔍 Processing failed articles and base-link URLs...');
  
  try {
    // Read the existing scraped data
    const existingDataPath = 'all-positions-with-lazy-loading.json';
    if (!fs.existsSync(existingDataPath)) {
      console.log('❌ No existing scraped data found. Run the main scraper first.');
      return;
    }
    
    const existingData = JSON.parse(fs.readFileSync(existingDataPath, 'utf8'));
    console.log(`📊 Found ${existingData.length} existing articles`);
    
    // Find articles with 0.0% success rate
    const failedArticles = existingData.filter(article => {
      const expectedCount = article.expectedCount || 0;
      const actualCount = article.positions ? article.positions.length : 0;
      const successRate = expectedCount > 0 ? (actualCount / expectedCount) * 100 : 0;
      return successRate === 0.0 && expectedCount > 0;
    });
    
    console.log(`🎯 Found ${failedArticles.length} articles with 0.0% success rate`);
    
    // Collect all base-link URLs from all articles
    const allBaseLinkUrls = [];
    existingData.forEach(article => {
      if (article.baseLinkUrls && article.baseLinkUrls.length > 0) {
        allBaseLinkUrls.push(...article.baseLinkUrls);
      }
    });
    
    // Remove duplicates based on URL
    const uniqueBaseLinkUrls = [];
    const seenUrls = new Set();
    allBaseLinkUrls.forEach(link => {
      if (!seenUrls.has(link.url)) {
        seenUrls.add(link.url);
        uniqueBaseLinkUrls.push(link);
      }
    });
    
    console.log(`🔗 Found ${uniqueBaseLinkUrls.length} unique base-link URLs to process`);
    
    // Combine failed articles with base-link URLs for processing
    const articlesToProcess = [...failedArticles];
    uniqueBaseLinkUrls.forEach(link => {
      // Check if this URL is already in our existing data
      const alreadyExists = existingData.some(article => article.originalUrl === link.url);
      if (!alreadyExists) {
        articlesToProcess.push({
          title: link.title,
          originalUrl: link.url,
          expectedCount: 5, // Default expected count for base-link articles
          positions: [],
          isBaseLink: true
        });
      }
    });
    
    console.log(`📝 Total articles to process: ${articlesToProcess.length} (${failedArticles.length} failed + ${articlesToProcess.length - failedArticles.length} base-links)`);
    
    if (articlesToProcess.length === 0) {
      console.log('✅ No articles to process!');
      return;
    }
    
    // Launch browser
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
        '--disable-extensions',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    let totalNewPositions = 0;
    let totalNewArticles = 0;
    
    // Process each article (failed + base-links)
    for (const article of articlesToProcess) {
      const articleType = article.isBaseLink ? 'base-link' : 'failed';
      console.log(`\n🔍 Processing ${articleType} article: ${article.title}`);
      console.log(`   Expected: ${article.expectedCount} positions`);
      console.log(`   Current: ${article.positions ? article.positions.length : 0} positions`);
      console.log(`   URL: ${article.originalUrl}`);
      
      if (!article.originalUrl) {
        console.log(`❌ Skipping ${article.title} - no URL found`);
        continue;
      }
      
      try {
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        
        // Load the article page
        await page.goto(article.originalUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Scroll to trigger lazy loading
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
            }, 100);
          });
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Extract positions using the proven alternative method
        const alternativePositions = await page.evaluate((articleInfo) => {
          const positions = [];
          
          console.log(`Processing failed article: ${articleInfo.title}`);
          
          // Method 1: Look for h2 elements with data-node-id that have nearby body-image sections
          const h2Elements = Array.from(document.querySelectorAll('h2[data-node-id]'));
          console.log(`Found ${h2Elements.length} h2 elements with data-node-id`);
          
          h2Elements.forEach((h2, index) => {
            const title = h2.textContent.trim();
            
            // Skip if title is too generic or too long
            if (!title || title.length < 3 || title.length > 150) {
              return;
            }
            
            // Skip generic titles
            const excludeKeywords = [
              'sex positions', 'oral sex', 'missionary', 'anal sex', 'chair sex',
              'lesbian sex', 'first-time', 'romantic sex', 'masturbation',
              'deep penetration', 'advertisement', 'related', 'more', 'read', 
              'follow', 'subscribe', 'newsletter', 'tips', 'guide', 'expert'
            ];
            
            if (excludeKeywords.some(keyword => title.toLowerCase().includes(keyword))) {
              return;
            }
            
            console.log(`Processing H2: "${title}"`);
            
            // Look for nearby body-image sections
            const bodyImageSections = Array.from(document.querySelectorAll('section[data-embed="body-image"]'));
            let closestSection = null;
            let minDistance = Infinity;
            
            bodyImageSections.forEach(bodySection => {
              const h2Rect = h2.getBoundingClientRect();
              const sectionRect = bodySection.getBoundingClientRect();
              const distance = Math.abs(h2Rect.top - sectionRect.top);
              
              if (distance < minDistance && distance < 400) {
                minDistance = distance;
                closestSection = bodySection;
              }
            });
            
            if (closestSection) {
              // Extract images from the related body-image section
              const sectionImages = Array.from(closestSection.querySelectorAll('img'))
                .map(img => ({
                  src: img.src,
                  alt: img.alt || '',
                  width: img.width,
                  height: img.height
                }))
                .filter(img => img.src && img.width > 150 && img.height > 150);
              
              // Look for description in <p data-journey-content="true"> elements
              let description = '';
              let howToDoIt = '';
              
              // First, look for the specific data-journey-content="true" pattern
              const journeyContentParagraphs = Array.from(document.querySelectorAll('p[data-journey-content="true"]'));
              const allText = [];
              
              // Find paragraphs that are close to this h2
              journeyContentParagraphs.forEach(p => {
                const pRect = p.getBoundingClientRect();
                const h2Rect = h2.getBoundingClientRect();
                const distance = Math.abs(pRect.top - h2Rect.top);
                
                if (distance < 500) {
                  const text = p.textContent.trim();
                  if (text && text.length > 10 && text.length < 2000) {
                    allText.push(text);
                  }
                }
              });
              
              // If no journey-content paragraphs found, look for regular paragraphs near the h2
              if (allText.length === 0) {
                let nextElement = h2.nextElementSibling;
                let elementCount = 0;
                
                while (nextElement && elementCount < 8) {
                  const text = nextElement.textContent.trim();
                  if (text && text.length > 10 && text.length < 2000) {
                    allText.push(text);
                  }
                  nextElement = nextElement.nextElementSibling;
                  elementCount++;
                }
              }
              
              if (allText.length > 0) {
                const cleanTexts = allText.map(text => {
                  let cleanText = text.replace(/@[A-Z0-9_]+/g, '').trim();
                  cleanText = cleanText.replace(/\s+/g, ' ').trim();
                  cleanText = cleanText.replace(/SHOP NOW.*$/i, '').trim();
                  cleanText = cleanText.replace(/Buy Now.*$/i, '').trim();
                  cleanText = cleanText.replace(/READ MORE.*$/i, '').trim();
                  return cleanText;
                }).filter(text => text.length > 5);

                if (cleanTexts.length > 0) {
                  description = cleanTexts[0];
                  
                  // Look for instruction-like text
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
                        text.includes('partner') ||
                        text.includes('receiver') ||
                        text.includes('giver')) {
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
              if (title && (description || sectionImages.length > 0)) {
                positions.push({
                  number: positions.length + 1,
                  title: title,
                  description: description.trim(),
                  howToDoIt: howToDoIt.trim(),
                  images: sectionImages,
                  slideId: h2.getAttribute('data-node-id'),
                  pageNumber: 1,
                  source: 'h2-with-body-image'
                });
                console.log(`✅ Alternative method found position: "${title}"`);
              }
            }
          });
          
                     // Also look for editorial links to other positions
           const editorialLinks = Array.from(document.querySelectorAll('section[data-embed="editorial-link"] a'));
           console.log(`Found ${editorialLinks.length} editorial links`);
           
           editorialLinks.forEach((link, index) => {
             const url = link.href;
             const title = link.textContent.trim();
             
             if (url && title && url.includes('/sex-love/') && url.includes('positions') && title.length > 3) {
               positions.push({
                 number: positions.length + 1,
                 title: title,
                 description: `Link to: ${title}`,
                 howToDoIt: `See article: ${url}`,
                 images: [],
                 slideId: `editorial-${index}`,
                 pageNumber: 1,
                 source: 'editorial-link',
                 isEditorialLink: true,
                 linkUrl: url
               });
             }
           });
           
           // Look for base-link elements that often contain position links
           const baseLinks = Array.from(document.querySelectorAll('a[data-theme-key="base-link"]'));
           console.log(`Found ${baseLinks.length} base-link elements`);
           
           baseLinks.forEach((link, index) => {
             const url = link.href;
             const title = link.textContent.trim();
             
             if (url && title && url.includes('/sex-love/') && url.includes('positions') && title.length > 3) {
               // Check if this link is already in our positions
               const alreadyExists = positions.some(pos => pos.linkUrl === url);
               
               if (!alreadyExists) {
                 positions.push({
                   number: positions.length + 1,
                   title: title,
                   description: `Link to: ${title}`,
                   howToDoIt: `See article: ${url}`,
                   images: [],
                   slideId: `base-link-${index}`,
                   pageNumber: 1,
                   source: 'base-link',
                   isEditorialLink: true,
                   linkUrl: url
                 });
                 console.log(`✅ Added base-link position: "${title}"`);
               } else {
                 console.log(`⏭️ Skipping duplicate base-link: "${title}"`);
               }
             }
           });
          
          return positions;
        }, article);
        
        console.log(`🎯 Alternative method found ${alternativePositions.length} positions`);
        
                          if (alternativePositions.length > 0) {
           if (article.isBaseLink) {
             // This is a new base-link article - add it to existing data
             const newArticle = {
               category: determineCategoryFromTitle(article.title),
               title: article.title,
               description: `Base-link article: ${article.title}`,
               images: [],
               positions: alternativePositions,
               originalUrl: article.originalUrl,
               scrapedCount: alternativePositions.length,
               pagesScraped: 1,
               expectedCount: article.expectedCount,
               alternativeMethodUsed: true,
               alternativeMethodPositions: alternativePositions.length,
               isBaseLink: true,
               lazyLoadInfo: {
                 totalSlideSections: alternativePositions.length,
                 slideSectionsWithContent: alternativePositions.length,
                 slideSectionsWithoutContent: 0
               }
             };
             
             existingData.push(newArticle);
             totalNewArticles++;
             totalNewPositions += alternativePositions.length;
             
             console.log(`✅ Added new base-link article: ${article.title}`);
             console.log(`   New positions: ${alternativePositions.length}`);
             alternativePositions.forEach((pos, i) => {
               console.log(`     ${i + 1}. ${pos.title}`);
             });
           } else {
             // This is an existing failed article - update it
             const articleIndex = existingData.findIndex(a => a.title === article.title);
             if (articleIndex !== -1) {
               existingData[articleIndex].positions = alternativePositions;
               existingData[articleIndex].alternativeMethodUsed = true;
               existingData[articleIndex].alternativeMethodPositions = alternativePositions.length;
               
               // Update category to be more specific based on article title
               let newCategory = article.category;
               if (article.category === 'Sex Positions') {
                 newCategory = determineCategoryFromTitle(article.title);
                 existingData[articleIndex].category = newCategory;
                 console.log(`   Updated category from "${article.category}" to "${newCategory}"`);
               }
               
               totalNewPositions += alternativePositions.length;
               
               console.log(`✅ Updated failed article: ${article.title}`);
               console.log(`   New positions: ${alternativePositions.length}`);
               alternativePositions.forEach((pos, i) => {
                 console.log(`     ${i + 1}. ${pos.title}`);
               });
             }
           }
         } else {
           console.log(`❌ No positions found for: ${article.title}`);
         }
        
        await page.close();
        
      } catch (error) {
        console.error(`❌ Error processing ${article.title}:`, error.message);
      }
    }
    
    await browser.close();
    
    // Save updated data back to the same file
    fs.writeFileSync(existingDataPath, JSON.stringify(existingData, null, 2));
    console.log(`\n💾 Updated data saved to ${existingDataPath}`);
    
    // Copy to public folder for frontend
    fs.copyFileSync(existingDataPath, 'public/all-sex-positions.json');
    console.log(`📁 Copied to public/all-sex-positions.json for frontend use`);
    
    // Calculate new totals
    const totalPositions = existingData.reduce((sum, article) => sum + (article.positions ? article.positions.length : 0), 0);
    const totalExpected = existingData.reduce((sum, article) => sum + (article.expectedCount || 0), 0);
    const overallSuccessRate = totalExpected > 0 ? (totalPositions / totalExpected) * 100 : 0;
    
    console.log(`\n🎉 PROCESSING COMPLETE!`);
    console.log(`📊 FINAL TOTALS:`);
    console.log(`   Total Articles: ${existingData.length}`);
    console.log(`   Expected Positions: ${totalExpected}`);
    console.log(`   Total Positions: ${totalPositions}`);
    console.log(`   New Articles Added: ${totalNewArticles}`);
    console.log(`   New Positions Added: ${totalNewPositions}`);
    console.log(`   Overall Success Rate: ${overallSuccessRate.toFixed(1)}%`);
    
  } catch (error) {
    console.error('❌ Error during failed article processing:', error);
  }
}

processFailedArticles();
