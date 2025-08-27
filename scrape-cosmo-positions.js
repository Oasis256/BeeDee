import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeCosmoPositions() {
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

    // Extract all sections and their links
    const sections = await page.evaluate(() => {
      const sections = [];
      
      // Find all section headers (h2, h3 elements that might be section titles)
      const sectionHeaders = Array.from(document.querySelectorAll('h2, h3')).filter(el => 
        el.textContent && 
        (el.textContent.includes('Best') || 
         el.textContent.includes('Your') || 
         el.textContent.includes('Team') || 
         el.textContent.includes('Party') || 
         el.textContent.includes('From'))
      );

      sectionHeaders.forEach(header => {
        const sectionTitle = header.textContent.trim();
        const section = {
          title: sectionTitle,
          links: []
        };

        // Find all links that come after this header until the next header
        let currentElement = header.nextElementSibling;
        while (currentElement && !['H2', 'H3'].includes(currentElement.tagName)) {
          if (currentElement.tagName === 'A' && currentElement.href) {
            // Check if this link has underlined text (indicating it's a position link)
            const linkText = currentElement.textContent.trim();
            const isUnderlined = currentElement.style.textDecoration === 'underline' || 
                               currentElement.querySelector('u') ||
                               currentElement.classList.contains('underlined');
            
            if (linkText && currentElement.href.includes('cosmopolitan.com')) {
              section.links.push({
                text: linkText,
                href: currentElement.href,
                isUnderlined: isUnderlined
              });
            }
          }
          currentElement = currentElement.nextElementSibling;
        }

        if (section.links.length > 0) {
          sections.push(section);
        }
      });

      return sections;
    });

    console.log(`Found ${sections.length} sections with links`);

    // Now follow each link to get detailed content
    for (const section of sections) {
      console.log(`\nProcessing section: ${section.title}`);
      
      for (const link of section.links) {
        if (link.href && link.isUnderlined) {
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
                images: images.slice(0, 15), // Limit to 15 images
                positions: positions.slice(0, 20) // Limit to 20 positions
              };
            });

            if (positionData.title) {
              allPositions.push({
                section: section.title,
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
    }

    // Save the scraped data
    fs.writeFileSync('cosmo-sex-positions.json', JSON.stringify(allPositions, null, 2));
    console.log(`\n🎉 Successfully scraped ${allPositions.length} position guides from Cosmopolitan!`);
    
    // Print summary
    console.log('\n📊 Scraping Summary:');
    allPositions.forEach((pos, index) => {
      console.log(`${index + 1}. ${pos.section} - ${pos.linkText}`);
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
scrapeCosmoPositions();
