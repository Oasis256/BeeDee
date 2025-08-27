import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapePositionsWithLazyLoading() {
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
    fs.copyFileSync('all-positions-with-lazy-loading.json', 'public/all-positions-with-lazy-loading.json');
    console.log(`\n📁 Copied to public/all-positions-with-lazy-loading.json for frontend use`);

  } catch (error) {
    console.error('Error during lazy-loading optimized scraping:', error);
  } finally {
    await browser.close();
  }
}

// Run the lazy-loading optimized scraper
scrapePositionsWithLazyLoading();
