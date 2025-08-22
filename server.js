import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Enable CORS for the React app
app.use(cors());
app.use(express.json());

// Function to scrape BDSMTest.org results using Puppeteer
async function scrapeBDSMResults(testId) {
  let browser;
  try {
    const url = `https://bdsmtest.org/r/${testId}`;
    console.log(`🔍 Scraping results for test ID: ${testId} using Puppeteer`);
    
    // Launch Puppeteer browser with more options to avoid detection
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-images',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set user agent to look like a real browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set extra headers to look more like a real browser
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    
    // Navigate to the page with longer timeout
    console.log(`🌐 Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait for the page to load and JavaScript to execute
    console.log(`⏳ Waiting for page to load...`);
    await new Promise(resolve => setTimeout(resolve, 8000));
    
    // Check if we got blocked or if the page loaded properly
    const pageTitle = await page.title();
    console.log(`📄 Page title: ${pageTitle}`);
    
    // Look for the copy-paste area which contains the results
    const copyPasteData = await page.evaluate(() => {
      const copyPasteArea = document.getElementById('copypastearea');
      if (copyPasteArea) {
        console.log('Found copypastearea element');
        return copyPasteArea.textContent || copyPasteArea.innerText || '';
      }
      console.log('copypastearea element not found');
      return null;
    });
    
          if (copyPasteData) {
        console.log(`📋 Found copy-paste data: ${copyPasteData.substring(0, 200)}...`);
        
        // Parse the copy-paste data which should contain the results in a clean format
        const results = [];
        const lines = copyPasteData.split('\n').filter(line => line.trim().length > 0);
        
        lines.forEach(line => {
          // Skip header lines and URLs
          if (line.includes('== Results from bdsmtest.org: ==') || line.includes('https://bdsmtest.org/')) {
            return;
          }
          
          // Look for patterns like "100% Switch" or "Switch 100%"
          const patterns = [
            /(\d+)%\s*([A-Za-z\s\/\-()]+)/g,
            /([A-Za-z\s\/\-()]+)\s*(\d+)%/g
          ];
          
          patterns.forEach(pattern => {
            let match;
            while ((match = pattern.exec(line)) !== null) {
              const percentage = parseInt(match[1]);
              const role = match[2] ? match[2].trim() : '';
              
              if (percentage >= 0 && percentage <= 100 && role.length > 0 && role.length < 50) {
                // Check if this role is already added
                const existingRole = results.find(r => r.role === role);
                if (!existingRole) {
                  results.push({
                    role: role,
                    percentage,
                    color: getColorForPercentage(percentage)
                  });
                }
              }
            }
          });
        });
        
        if (results.length > 0) {
          // Sort by percentage (highest first)
          results.sort((a, b) => b.percentage - a.percentage);
          console.log(`✅ Found ${results.length} results from copy-paste data`);
          return results;
        }
      }
    
    // If copy-paste area didn't work, try to find results in the rendered page
    console.log(`⚠️ Copy-paste area not found, looking for results in rendered page...`);
    
    const pageResults = await page.evaluate(() => {
      const results = [];
      
      // Look for any elements containing percentages and role names
      const allText = document.body.innerText;
      console.log('Page text length:', allText.length);
      
      // Look for patterns like "90% Submissive" or "Submissive 90%"
      const patterns = [
        /(\d+)%\s*([A-Za-z\s\/\-()]+)/g,
        /([A-Za-z\s\/\-()]+)\s*(\d+)%/g
      ];
      
      patterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(allText)) !== null) {
          const percentage = parseInt(match[1]);
          const role = match[2] ? match[2].trim() : '';
          
          // Clean up the role name
          const cleanRole = role.replace(/[\t\u00c2\u00a0]*More[\u00c2\u00a0\s]*info.*$/gi, '').replace(/\s+/g, ' ').trim();
          
          if (percentage >= 0 && percentage <= 100 && cleanRole.length > 0 && cleanRole.length < 50) {
            const existingRole = results.find(r => r.role === cleanRole);
            if (!existingRole) {
              results.push({
                role: cleanRole,
                percentage,
                color: getColorForPercentage(percentage)
              });
            }
          }
        }
      });
      
      return results;
    });
    
    if (pageResults && pageResults.length > 0) {
      // Sort by percentage (highest first)
      pageResults.sort((a, b) => b.percentage - a.percentage);
      console.log(`✅ Found ${pageResults.length} results from page content`);
      return pageResults;
    }
    
    console.log(`❌ No results found for ${testId}`);
    return [];
    
  } catch (error) {
    console.log(`❌ Error scraping results for ${testId}: ${error.message}`);
    console.log(`🔍 Error details:`, error);
    console.log(`🔍 Error stack:`, error.stack);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

function getColorForPercentage(percentage) {
  if (percentage >= 80) return 'green';
  if (percentage >= 60) return 'yellow';
  if (percentage >= 40) return 'orange';
  return 'red';
}

// Demo data as fallback
const demoResults = {
  'T8n7yENK': {
    id: 'T8n7yENK',
    results: [
      { role: 'Switch', percentage: 100, color: 'green' },
      { role: 'Experimentalist', percentage: 98, color: 'green' },
      { role: 'Voyeur', percentage: 93, color: 'green' },
      { role: 'Primal (Prey)', percentage: 90, color: 'green' },
      { role: 'Rigger', percentage: 89, color: 'green' },
      { role: 'Non-monogamist', percentage: 79, color: 'yellow' },
      { role: 'Submissive', percentage: 79, color: 'yellow' },
      { role: 'Rope bunny', percentage: 78, color: 'yellow' },
      { role: 'Daddy/Mommy', percentage: 71, color: 'yellow' },
      { role: 'Dominant', percentage: 71, color: 'yellow' },
      { role: 'Little', percentage: 64, color: 'orange' },
      { role: 'Degrader', percentage: 62, color: 'orange' },
      { role: 'Ageplayer', percentage: 61, color: 'orange' },
      { role: 'Degradee', percentage: 61, color: 'orange' },
      { role: 'Masochist', percentage: 59, color: 'orange' },
      { role: 'Brat tamer', percentage: 58, color: 'orange' },
      { role: 'Owner', percentage: 57, color: 'orange' },
      { role: 'Primal (Hunter)', percentage: 56, color: 'orange' },
      { role: 'Sadist', percentage: 54, color: 'orange' },
      { role: 'Master/Mistress', percentage: 53, color: 'orange' },
      { role: 'Pet', percentage: 48, color: 'red' },
      { role: 'Brat', percentage: 47, color: 'red' },
      { role: 'Slave', percentage: 34, color: 'red' },
      { role: 'Vanilla', percentage: 29, color: 'red' },
      { role: 'Exhibitionist', percentage: 12, color: 'red' }
    ],
    success: true,
    timestamp: new Date().toISOString(),
    dataSource: 'demo'
  }
};

// API endpoint to fetch BDSM test results
app.get('/api/bdsm-results/:testId', async (req, res) => {
  const { testId } = req.params;
  
  if (!testId) {
    return res.status(400).json({ error: 'Test ID is required' });
  }

  try {
    console.log(`🔍 Attempting to scrape real data for ${testId} using Puppeteer...`);
    
    // Try to scrape real data first
    const results = await scrapeBDSMResults(testId);
    
    if (results && results.length > 0) {
      const response = {
        id: testId,
        results: results,
        success: true,
        timestamp: new Date().toISOString(),
        dataSource: 'real'
      };
      
      console.log(`✅ Successfully scraped ${results.length} results for ${testId}`);
      res.json(response);
    } else {
      // Fallback to demo data if scraping failed
      console.log(`⚠️ Scraping failed for ${testId}, using demo data`);
      
      if (demoResults[testId]) {
        res.json(demoResults[testId]);
      } else {
        // Generate random demo data for unknown test IDs
        const genericDemo = {
          id: testId,
          results: demoResults['T8n7yENK'].results.map(result => ({
            ...result,
            percentage: Math.floor(Math.random() * 100)
          })),
          success: true,
          timestamp: new Date().toISOString(),
          dataSource: 'demo'
        };
        res.json(genericDemo);
      }
    }
  } catch (error) {
    console.error(`❌ Error in API endpoint for ${testId}:`, error.message);
    
    // Fallback to demo data on error
    console.log(`🔄 Backend error, using demo data for ${testId}`);
    
    if (demoResults[testId]) {
      res.json(demoResults[testId]);
    } else {
      res.status(500).json({ 
        error: 'Failed to fetch results',
        success: false,
        message: 'Backend error. This is demo data.'
      });
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'BDSM Results API is running with Puppeteer' });
});

app.listen(PORT, () => {
  console.log(`🚀 BDSM Results API server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/bdsm-results/:testId`);
  console.log(`🌐 Using Puppeteer to scrape real data from bdsmtest.org`);
});
