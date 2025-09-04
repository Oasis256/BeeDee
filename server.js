import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
import Database from './server/database.js';

const app = express();
let PORT = 3001;
const db = new Database();

// Enable CORS for the React app
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
    'http://localhost:3002',
    'https://localhost:3002',
    'http://localhost:3003',
    'https://localhost:3003',
    'http://localhost:3004',
    'https://localhost:3004',
    'http://localhost:3005',
    'https://localhost:3005',
    'http://bee.shu-le.tech:3000', 
    'https://bee.shu-le.tech:3000', 
    'http://bee.shu-le.tech', 
    'https://bee.shu-le.tech',
    'http://bee.shu-le.tech:80',
    'https://bee.shu-le.tech:443',
    'http://dee.shu-le.tech',
    'https://dee.shu-le.tech'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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

// Initialize database
db.init().catch(console.error);

// API endpoint to fetch BDSM test results
app.get('/api/bdsm-results/:testId', async (req, res) => {
  const { testId } = req.params;
  
  if (!testId) {
    return res.status(400).json({ error: 'Test ID is required' });
  }

  try {
    console.log(`🔍 Attempting to fetch results for ${testId}...`);
    
    // First, check if we have cached results in the database
    const cachedResults = await db.getCachedResults(testId);
    if (cachedResults) {
      console.log(`📋 Found cached results for ${testId}`);
      res.json(cachedResults);
      return;
    }
    
    // If no cached results, try to scrape real data
    console.log(`🔍 Attempting to scrape real data for ${testId} using Puppeteer...`);
    const results = await scrapeBDSMResults(testId);
    
    if (results && results.length > 0) {
      // Save results to database
      await db.saveTestResults(testId, results, 'real');
      
      // Get profile if exists
      const profile = await db.getProfile(testId);
      
      const response = {
        id: testId,
        results: results,
        success: true,
        timestamp: new Date().toISOString(),
        dataSource: 'real',
        profile
      };
      
      console.log(`✅ Successfully scraped and saved ${results.length} results for ${testId}`);
      res.json(response);
    } else {
      // Fallback to demo data if scraping failed
      console.log(`⚠️ Scraping failed for ${testId}, using demo data`);
      
      let demoData;
      if (demoResults[testId]) {
        demoData = demoResults[testId];
      } else {
        // Generate random demo data for unknown test IDs
        demoData = {
          id: testId,
          results: demoResults['T8n7yENK'].results.map(result => ({
            ...result,
            percentage: Math.floor(Math.random() * 100)
          })),
          success: true,
          timestamp: new Date().toISOString(),
          dataSource: 'demo'
        };
      }
      
      // Save demo data to database
      await db.saveTestResults(testId, demoData.results, 'demo');
      res.json(demoData);
    }
  } catch (error) {
    console.error(`❌ Error in API endpoint for ${testId}:`, error.message);
    
    // Fallback to demo data on error
    console.log(`🔄 Backend error, using demo data for ${testId}`);
    
    let demoData;
    if (demoResults[testId]) {
      demoData = demoResults[testId];
    } else {
      demoData = {
        id: testId,
        results: demoResults['T8n7yENK'].results.map(result => ({
          ...result,
          percentage: Math.floor(Math.random() * 100)
        })),
        success: true,
        timestamp: new Date().toISOString(),
        dataSource: 'demo'
      };
    }
    
    // Save demo data to database
    try {
      await db.saveTestResults(testId, demoData.results, 'demo');
    } catch (dbError) {
      console.error('Error saving demo data to database:', dbError);
    }
    
    res.json(demoData);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  console.log(`🏥 Health check request from ${req.ip} (${req.headers.host})`)
  res.json({ status: 'OK', message: 'BDSM Results API is running with Puppeteer and SQLite' });
});

// Profile management endpoints
app.post('/api/profiles', async (req, res) => {
  try {
    const { name, testId, emoji } = req.body;
    const profile = await db.createProfile(name, testId, emoji);
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/profiles', async (req, res) => {
  try {
    const profiles = await db.getAllProfiles();
    res.json({ success: true, profiles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/profiles/:testId', async (req, res) => {
  try {
    const profile = await db.getProfile(req.params.testId);
    if (profile) {
      res.json({ success: true, profile });
    } else {
      res.status(404).json({ error: 'Profile not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/profiles/:testId', async (req, res) => {
  try {
    const { name, emoji } = req.body;
    const profile = await db.updateProfile(req.params.testId, name, emoji);
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/profiles/:testId', async (req, res) => {
  try {
    await db.deleteProfile(req.params.testId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Couple Profiles endpoints
app.post('/api/couple-profiles', async (req, res) => {
  try {
    const { coupleName, partnerIds, partnerNames, relationshipDuration, bdsmExperience, privacyLevel, description } = req.body;
    const profile = await db.createCoupleProfile(coupleName, partnerIds, partnerNames, relationshipDuration, bdsmExperience, privacyLevel, description);
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/couple-profiles', async (req, res) => {
  try {
    const profiles = await db.getAllCoupleProfiles();
    res.json({ success: true, profiles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/couple-profiles/:id', async (req, res) => {
  try {
    const profile = await db.getCoupleProfile(parseInt(req.params.id));
    if (profile) {
      res.json({ success: true, profile });
    } else {
      res.status(404).json({ error: 'Couple profile not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/couple-profiles/:id', async (req, res) => {
  try {
    const { coupleName, partnerIds, partnerNames, relationshipDuration, bdsmExperience, privacyLevel, description } = req.body;
    const profile = await db.updateCoupleProfile(parseInt(req.params.id), coupleName, partnerIds, partnerNames, relationshipDuration, bdsmExperience, privacyLevel, description);
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/couple-profiles/:id', async (req, res) => {
  try {
    await db.deleteCoupleProfile(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check-ins endpoints
app.post('/api/check-ins', async (req, res) => {
  try {
    const { coupleId, date, mood, relationshipSatisfaction, bdsmSatisfaction, notes } = req.body;
    const checkIn = await db.createCheckIn(coupleId, date, mood, relationshipSatisfaction, bdsmSatisfaction, notes);
    res.json({ success: true, checkIn });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/check-ins/:coupleId', async (req, res) => {
  try {
    const checkIns = await db.getCheckIns(parseInt(req.params.coupleId));
    res.json({ success: true, checkIns });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/check-ins/:id', async (req, res) => {
  try {
    await db.deleteCheckIn(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Boundaries endpoints
app.post('/api/boundaries', async (req, res) => {
  try {
    const { coupleId, category, description, hardLimit, softLimit, notes } = req.body;
    const boundary = await db.createBoundary(coupleId, category, description, hardLimit, softLimit, notes);
    res.json({ success: true, boundary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/boundaries/:coupleId', async (req, res) => {
  try {
    const boundaries = await db.getBoundaries(parseInt(req.params.coupleId));
    res.json({ success: true, boundaries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/boundaries/:id', async (req, res) => {
  try {
    await db.deleteBoundary(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Favorites endpoints
app.post('/api/favorites', async (req, res) => {
  try {
    const { testId, name, emoji } = req.body;
    await db.addFavorite(testId, name, emoji);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/favorites', async (req, res) => {
  try {
    console.log(`⭐ Favorites request from ${req.ip} (${req.headers.host})`)
    const favorites = await db.getFavorites();
    console.log(`✅ Returning ${favorites.length} favorites`)
    res.json({ success: true, favorites });
  } catch (error) {
    console.error(`❌ Error in favorites endpoint:`, error)
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/favorites/:testId', async (req, res) => {
  try {
    await db.removeFavorite(req.params.testId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analysis history endpoints
app.post('/api/analysis', async (req, res) => {
  try {
    const { testIds, analysisType, resultData } = req.body;
    await db.saveAnalysis(testIds, analysisType, resultData);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analysis/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const history = await db.getAnalysisHistory(limit);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export history endpoints
app.post('/api/export', async (req, res) => {
  try {
    const { testIds, format, filePath } = req.body;
    await db.saveExport(testIds, format, filePath);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/export/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const history = await db.getExportHistory(limit);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Share history endpoints
app.post('/api/share', async (req, res) => {
  try {
    const { testIds, method, shareData } = req.body;
    await db.saveShare(testIds, method, shareData);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/share/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const history = await db.getShareHistory(limit);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Scenario endpoints
app.post('/api/scenarios', async (req, res) => {
  try {
    const scenarioData = req.body;
    const result = await db.saveScenario(scenarioData);
    res.json(result);
  } catch (error) {
    console.error('Error in /api/scenarios POST:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/scenarios', async (req, res) => {
  try {
    const { testIds } = req.query;
    const scenarios = await db.getScenarios(testIds ? JSON.parse(testIds) : null);
    res.json({ success: true, scenarios });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/scenarios/:id', async (req, res) => {
  try {
    const scenario = await db.getScenario(parseInt(req.params.id));
    if (scenario) {
      res.json({ success: true, scenario });
    } else {
      res.status(404).json({ error: 'Scenario not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/scenarios/:id', async (req, res) => {
  try {
    const scenarioData = req.body;
    await db.updateScenario(parseInt(req.params.id), scenarioData);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/scenarios/:id', async (req, res) => {
  try {
    await db.deleteScenario(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/scenarios/stats', async (req, res) => {
  try {
    const stats = await db.getScenarioStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Statistics endpoints
app.get('/api/stats/profiles', async (req, res) => {
  try {
    const stats = await db.getProfileStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats/global', async (req, res) => {
  try {
    const stats = await db.getGlobalStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats/shares', async (req, res) => {
  try {
    const stats = await db.getShareStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/stats/analysis', async (req, res) => {
  try {
    const stats = await db.getAnalysisStats();
    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search and analytics endpoints
app.get('/api/search/profiles', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }
    const profiles = await db.searchProfiles(q);
    res.json({ success: true, profiles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/top-roles', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const roles = await db.getTopRoles(limit);
    res.json({ success: true, roles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics/role-distribution', async (req, res) => {
  try {
    const distribution = await db.getRoleDistribution();
    res.json({ success: true, distribution });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Community Scenarios endpoints
app.get('/api/community-scenarios', async (req, res) => {
  try {
    const scenarios = await db.getCommunityScenarios();
    res.json({ success: true, scenarios });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/community-scenarios', async (req, res) => {
  try {
    const scenarioData = req.body;
    const scenario = await db.createCommunityScenario(scenarioData);
    res.json({ success: true, scenario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/community-scenarios/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.likeCommunityScenario(id);
    res.json({ success: true, likes: result.likes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/community-scenarios/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.downloadCommunityScenario(id);
    res.json({ success: true, downloads: result.downloads });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Function to start server with port fallback
async function startServer(initialPort) {
  try {
    // Initialize database first
    await db.init();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exit(1);
  }

  for (let port = initialPort; port <= initialPort + 10; port++) {
    try {
      await new Promise((resolve, reject) => {
        const server = app.listen(port, '0.0.0.0', () => {
          PORT = port;
          console.log(`🚀 BDSM Results API server running on http://0.0.0.0:${PORT}`);
          console.log(`📊 API endpoint: http://0.0.0.0:${PORT}/api/bdsm-results/:testId`);
          console.log(`🗄️ SQLite database: ${db.dbPath}`);
          console.log(`🌐 Using Puppeteer to scrape real data from bdsmtest.org`);
          resolve();
        });
        
        server.on('error', (error) => {
          if (error.code === 'EADDRINUSE') {
            console.log(`⚠️ Port ${port} is in use, trying next port...`);
            reject(error);
          } else {
            console.error(`❌ Server error on port ${port}:`, error);
            reject(error);
          }
        });
      });
      return; // Successfully started
    } catch (error) {
      if (port === initialPort + 10) {
        console.error(`❌ Failed to start server on any port from ${initialPort} to ${initialPort + 10}`);
        process.exit(1);
      }
      // Continue to next port
    }
  }
}

// Start the server
startServer(3001);
