const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class AftercareScraper {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = [];
    this.progress = {
      completed: [],
      failed: [],
      total: 0
    };
  }

  async init() {
    console.log('🚀 Starting Aftercare Guides Scraper...');
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    this.page = await this.browser.newPage();
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async scrapeAftercareGuides() {
    const aftercareSources = [
      {
        name: 'Submissive Guide - Aftercare Series',
        url: 'https://www.submissiveguide.com/safety%2C%20personalgrowth%2C%20fundamentals/series/series-aftercare',
        type: 'comprehensive_guide',
        category: 'educational'
      },
      {
        name: 'Lock The Cock - BDSM Aftercare',
        url: 'https://lockthecock.com/blogs/chastity-fun/bdsm-aftercare',
        type: 'practical_guide',
        category: 'physical_care'
      },
      {
        name: 'Hellsc - BDSM Aftercare Guide',
        url: 'https://hellsc.com.au/bdsm-aftercare/',
        type: 'comprehensive_guide',
        category: 'emotional_support'
      },
      {
        name: '420 Bud Cloud - Complete Aftercare Guide',
        url: 'https://420budcloud.com/the-complete-bdsm-aftercare-guide-learn-how-to-do-it-right/',
        type: 'complete_guide',
        category: 'comprehensive'
      }
    ];

    this.progress.total = aftercareSources.length;
    console.log(`📋 Found ${this.progress.total} aftercare sources to scrape`);

    for (const source of aftercareSources) {
      try {
        console.log(`\n🔍 Scraping: ${source.name}`);
        console.log(`📍 URL: ${source.url}`);
        
        const guide = await this.scrapeAftercareGuide(source);
        if (guide) {
          this.results.push(guide);
          this.progress.completed.push(source.url);
          console.log(`✅ Successfully scraped: ${source.name}`);
        } else {
          this.progress.failed.push(source.url);
          console.log(`❌ Failed to scrape: ${source.name}`);
        }
      } catch (error) {
        console.error(`❌ Error scraping ${source.name}:`, error.message);
        this.progress.failed.push(source.url);
      }
    }
  }

  async scrapeAftercareGuide(source) {
    try {
      await this.page.goto(source.url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait for content to load
      await this.page.waitForTimeout(2000);

      const guide = await this.page.evaluate((sourceInfo) => {
        const guide = {
          title: '',
          content: '',
          sections: [],
          tips: [],
          categories: [],
          source: sourceInfo.name,
          url: sourceInfo.url,
          type: sourceInfo.type,
          category: sourceInfo.category,
          scrapedAt: new Date().toISOString()
        };

        // Extract title
        const titleSelectors = [
          'h1',
          '.entry-title',
          '.post-title',
          '.article-title',
          'title'
        ];
        
        for (const selector of titleSelectors) {
          const titleEl = document.querySelector(selector);
          if (titleEl && titleEl.textContent.trim()) {
            guide.title = titleEl.textContent.trim();
            break;
          }
        }

        // Extract main content
        const contentSelectors = [
          '.entry-content',
          '.post-content',
          '.article-content',
          '.content',
          'main',
          'article'
        ];

        let contentElement = null;
        for (const selector of contentSelectors) {
          contentElement = document.querySelector(selector);
          if (contentElement) break;
        }

        if (!contentElement) {
          contentElement = document.body;
        }

        // Extract text content
        const textContent = contentElement.innerText || contentElement.textContent || '';
        guide.content = textContent.replace(/\s+/g, ' ').trim();

        // Extract sections (headings and their content)
        const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach((heading, index) => {
          const section = {
            title: heading.textContent.trim(),
            level: parseInt(heading.tagName.charAt(1)),
            content: ''
          };

          // Get content until next heading
          let nextElement = heading.nextElementSibling;
          const sectionContent = [];
          
          while (nextElement && !nextElement.matches('h1, h2, h3, h4, h5, h6')) {
            if (nextElement.textContent.trim()) {
              sectionContent.push(nextElement.textContent.trim());
            }
            nextElement = nextElement.nextElementSibling;
          }
          
          section.content = sectionContent.join(' ').replace(/\s+/g, ' ').trim();
          if (section.content) {
            guide.sections.push(section);
          }
        });

        // Extract tips and lists
        const lists = contentElement.querySelectorAll('ul, ol');
        lists.forEach(list => {
          const items = Array.from(list.querySelectorAll('li')).map(li => li.textContent.trim());
          if (items.length > 0) {
            guide.tips.push({
              type: list.tagName.toLowerCase(),
              items: items
            });
          }
        });

        // Extract categories/tags
        const categorySelectors = [
          '.tags a',
          '.categories a',
          '.post-tags a',
          '[rel="tag"]'
        ];

        categorySelectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            const category = el.textContent.trim();
            if (category && !guide.categories.includes(category)) {
              guide.categories.push(category);
            }
          });
        });

        return guide;
      }, source);

      // Add some additional processing
      if (guide.content) {
        guide.wordCount = guide.content.split(' ').length;
        guide.hasSections = guide.sections.length > 0;
        guide.hasTips = guide.tips.length > 0;
        
        // Extract key aftercare topics
        const aftercareKeywords = [
          'physical care', 'emotional support', 'hydration', 'nutrition',
          'cuddling', 'reassurance', 'communication', 'comfort',
          'recovery', 'safety', 'trust', 'intimacy', 'bonding',
          'sub drop', 'dom drop', 'aftercare plan', 'check-in'
        ];
        
        guide.keyTopics = aftercareKeywords.filter(keyword => 
          guide.content.toLowerCase().includes(keyword.toLowerCase())
        );
      }

      return guide;
    } catch (error) {
      console.error(`Error scraping ${source.url}:`, error.message);
      return null;
    }
  }

  async saveResults() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `aftercare-guides-${timestamp}.json`;
    
    const output = {
      scrapedAt: new Date().toISOString(),
      totalGuides: this.results.length,
      progress: this.progress,
      guides: this.results
    };

    fs.writeFileSync(filename, JSON.stringify(output, null, 2));
    console.log(`\n💾 Results saved to: ${filename}`);

    // Also save to public directory for the app
    const publicFilename = path.join('public', 'aftercare-guides.json');
    fs.writeFileSync(publicFilename, JSON.stringify(output, null, 2));
    console.log(`📁 Also saved to: ${publicFilename}`);

    return filename;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  printSummary() {
    console.log('\n📊 SCRAPING SUMMARY');
    console.log('==================');
    console.log(`✅ Successfully scraped: ${this.progress.completed.length}`);
    console.log(`❌ Failed to scrape: ${this.progress.failed.length}`);
    console.log(`📋 Total guides found: ${this.results.length}`);
    
    if (this.results.length > 0) {
      console.log('\n📚 SCRAPED GUIDES:');
      this.results.forEach((guide, index) => {
        console.log(`${index + 1}. ${guide.title}`);
        console.log(`   Source: ${guide.source}`);
        console.log(`   Type: ${guide.type}`);
        console.log(`   Sections: ${guide.sections.length}`);
        console.log(`   Tips: ${guide.tips.length}`);
        console.log(`   Word Count: ${guide.wordCount || 0}`);
        console.log(`   Key Topics: ${guide.keyTopics?.join(', ') || 'None'}`);
        console.log('');
      });
    }

    if (this.progress.failed.length > 0) {
      console.log('\n❌ FAILED URLS:');
      this.progress.failed.forEach(url => console.log(`   ${url}`));
    }
  }
}

// Main execution
async function main() {
  const scraper = new AftercareScraper();
  
  try {
    await scraper.init();
    await scraper.scrapeAftercareGuides();
    await scraper.saveResults();
    scraper.printSummary();
  } catch (error) {
    console.error('❌ Scraping failed:', error);
  } finally {
    await scraper.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = AftercareScraper;
