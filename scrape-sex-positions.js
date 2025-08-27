import puppeteer from 'puppeteer';
import fs from 'fs';

async function scrapeSexPositions() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set user agent to avoid detection
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

  const sexPositions = [];

  // Main categories from Cosmopolitan
  const categories = [
    {
      name: 'Oral Positions',
      url: 'https://www.cosmopolitan.com/sex-love/positions/',
      selector: 'a[href*="oral"]'
    },
    {
      name: 'Missionary Variations',
      url: 'https://www.cosmopolitan.com/sex-love/positions/',
      selector: 'a[href*="missionary"]'
    },
    {
      name: 'Anal Positions',
      url: 'https://www.cosmopolitan.com/sex-love/positions/',
      selector: 'a[href*="anal"]'
    },
    {
      name: 'Cowgirl Positions',
      url: 'https://www.cosmopolitan.com/sex-love/positions/',
      selector: 'a[href*="cowgirl"]'
    },
    {
      name: 'Standing Positions',
      url: 'https://www.cosmopolitan.com/sex-love/positions/',
      selector: 'a[href*="standing"]'
    },
    {
      name: 'Chair Positions',
      url: 'https://www.cosmopolitan.com/sex-love/positions/',
      selector: 'a[href*="chair"]'
    },
    {
      name: 'Bridge Positions',
      url: 'https://www.cosmopolitan.com/sex-love/positions/',
      selector: 'a[href*="bridge"]'
    }
  ];

  try {
    for (const category of categories) {
      console.log(`Scraping ${category.name}...`);
      
      await page.goto(category.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Extract links and images
      const links = await page.evaluate((selector) => {
        const elements = document.querySelectorAll(selector);
        return Array.from(elements).map(el => ({
          href: el.href,
          text: el.textContent?.trim(),
          image: el.querySelector('img')?.src || null
        }));
      }, category.selector);

      // Follow each link to get detailed content
      for (const link of links.slice(0, 5)) { // Limit to 5 per category
        if (link.href) {
          try {
            console.log(`Following link: ${link.href}`);
                         await page.goto(link.href, { waitUntil: 'domcontentloaded', timeout: 30000 });
             await new Promise(resolve => setTimeout(resolve, 2000));

            const positionData = await page.evaluate(() => {
              // Extract position details
              const title = document.querySelector('h1')?.textContent?.trim() || 
                           document.querySelector('h2')?.textContent?.trim() || '';
              
              const description = document.querySelector('p')?.textContent?.trim() || '';
              
              const images = Array.from(document.querySelectorAll('img')).map(img => ({
                src: img.src,
                alt: img.alt || ''
              })).filter(img => img.src && !img.src.includes('logo') && !img.src.includes('ad'));

              return {
                title,
                description,
                images: images.slice(0, 3) // Limit to 3 images
              };
            });

            if (positionData.title) {
              sexPositions.push({
                category: category.name,
                title: positionData.title,
                description: positionData.description,
                images: positionData.images,
                originalUrl: link.href
              });
            }
          } catch (error) {
            console.error(`Error scraping ${link.href}:`, error.message);
          }
        }
      }
    }

    // Save the scraped data
    fs.writeFileSync('scraped-sex-positions.json', JSON.stringify(sexPositions, null, 2));
    console.log(`Scraped ${sexPositions.length} sex positions successfully!`);

  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    await browser.close();
  }
}

// Run the scraper
scrapeSexPositions();
