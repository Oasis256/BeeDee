import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeCosmoRobust() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set user agent to avoid detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const allPositions = [];

  // Start from the specified URL
  const startUrl = 'https://www.cosmopolitan.com/sex-love/positions/?page=3';
  
  try {
    console.log(`Starting scrape from: ${startUrl}`);
    await page.goto(startUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 5000));

    // First, let's see what we can find on the page
    const pageStructure = await page.evaluate(() => {
      const structure = {
        title: document.title,
        headings: [],
        links: [],
        sections: []
      };

      // Get all headings
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      headings.forEach(h => {
        structure.headings.push({
          tag: h.tagName,
          text: h.textContent.trim(),
          id: h.id,
          className: h.className
        });
      });

      // Get all links
      const links = Array.from(document.querySelectorAll('a[href*="cosmopolitan.com"]'));
      links.forEach(link => {
        structure.links.push({
          text: link.textContent.trim(),
          href: link.href,
          isUnderlined: link.style.textDecoration === 'underline' || 
                       link.querySelector('u') ||
                       link.classList.contains('underlined') ||
                       link.style.textDecorationLine === 'underline'
        });
      });

      // Try to find sections by looking for specific patterns
      const sectionPatterns = [
        'Best Oral Ever, Right This Way',
        'Your Sexual Debut Awaits!',
        'Team Work Makes the Dream Work',
        'Party of Three?',
        'From the Back:'
      ];

      sectionPatterns.forEach(pattern => {
        const elements = Array.from(document.querySelectorAll('*')).filter(el => 
          el.textContent && el.textContent.includes(pattern)
        );
        
        if (elements.length > 0) {
          structure.sections.push({
            pattern: pattern,
            elements: elements.map(el => ({
              tagName: el.tagName,
              text: el.textContent.trim(),
              className: el.className
            }))
          });
        }
      });

      return structure;
    });

    console.log('Page structure analysis:');
    console.log('Title:', pageStructure.title);
    console.log('Headings found:', pageStructure.headings.length);
    console.log('Links found:', pageStructure.links.length);
    console.log('Sections found:', pageStructure.sections.length);

    // Now try to extract content based on the structure
    const extractedContent = await page.evaluate(() => {
      const content = [];

      // Look for links that might be position guides
      const positionLinks = Array.from(document.querySelectorAll('a')).filter(link => {
        const text = link.textContent.trim();
        const href = link.href;
        
        return href.includes('cosmopolitan.com') && 
               (text.includes('Sex Positions') || 
                text.includes('Position') || 
                text.includes('Sex') ||
                text.includes('Oral') ||
                text.includes('Anal') ||
                text.includes('Missionary') ||
                text.includes('Cowgirl') ||
                text.includes('Chair') ||
                text.includes('Bridge') ||
                text.includes('Blow Job') ||
                text.includes('Rim Job') ||
                text.includes('Threesome') ||
                text.includes('Foursome'));
      });

      positionLinks.forEach(link => {
        content.push({
          text: link.textContent.trim(),
          href: link.href,
          isUnderlined: link.style.textDecoration === 'underline' || 
                       link.querySelector('u') ||
                       link.classList.contains('underlined')
        });
      });

      return content;
    });

    console.log(`Found ${extractedContent.length} potential position links`);

    // Follow each link to get detailed content
    for (const link of extractedContent) {
      if (link.href) {
        try {
          console.log(`Following link: ${link.text} -> ${link.href}`);
          
          await page.goto(link.href, { waitUntil: 'domcontentloaded', timeout: 30000 });
          await new Promise(resolve => setTimeout(resolve, 3000));

          const positionData = await page.evaluate(() => {
            // Extract the main title
            const title = document.querySelector('h1')?.textContent?.trim() || 
                         document.querySelector('h2')?.textContent?.trim() || '';
            
            // Extract the main description
            const description = document.querySelector('p')?.textContent?.trim() || 
                              document.querySelector('.article-body p')?.textContent?.trim() || '';
            
            // Extract all images that look like position illustrations
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

            // Extract individual position names and descriptions
            const positionElements = Array.from(document.querySelectorAll('h2, h3, h4')).filter(el => 
              el.textContent && 
              (el.textContent.includes('Position') || 
               el.textContent.includes('Sex') || 
               el.textContent.includes('Style') ||
               el.textContent.includes('How to') ||
               el.textContent.includes('The '))
            );

            const positions = positionElements.map(el => {
              const nextParagraph = el.nextElementSibling;
              return {
                name: el.textContent?.trim(),
                description: nextParagraph?.textContent?.trim() || ''
              };
            });

            return {
              title,
              description,
              images: images.slice(0, 15),
              positions: positions.slice(0, 20)
            };
          });

          if (positionData.title) {
            allPositions.push({
              linkText: link.text,
              title: positionData.title,
              description: positionData.description,
              images: positionData.images,
              positions: positionData.positions,
              originalUrl: link.href
            });

            console.log(`✅ Successfully scraped: ${positionData.title} (${positionData.images.length} images, ${positionData.positions.length} positions)`);
          }

        } catch (error) {
          console.error(`❌ Error scraping ${link.href}:`, error.message);
        }
      }
    }

    // Save the scraped data
    fs.writeFileSync('cosmo-robust-positions.json', JSON.stringify(allPositions, null, 2));
    console.log(`\n🎉 Successfully scraped ${allPositions.length} position guides from Cosmopolitan!`);
    
    // Print summary
    console.log('\n📊 Scraping Summary:');
    allPositions.forEach((pos, index) => {
      console.log(`${index + 1}. ${pos.linkText}`);
      console.log(`   Title: ${pos.title}`);
      console.log(`   Images: ${pos.images.length}, Positions: ${pos.positions.length}`);
      console.log(`   URL: ${pos.originalUrl}\n`);
    });

  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }
}

// Run the scraper
scrapeCosmoRobust();
