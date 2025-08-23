import puppeteer from 'puppeteer'

class BDSMScraper {
  constructor() {
    this.browser = null
    this.page = null
  }

  async init() {
    try {
      this.browser = await puppeteer.launch({
        headless: false, // Use non-headless mode to avoid detection
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
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-blink-features=AutomationControlled',
          '--disable-extensions-except',
          '--disable-plugins-discovery',
          '--disable-default-apps',
          '--disable-sync',
          '--disable-translate',
          '--hide-scrollbars',
          '--mute-audio',
          '--no-default-browser-check',
          '--no-pings',
          '--disable-background-networking',
          '--disable-client-side-phishing-detection',
          '--disable-component-extensions-with-background-pages',
          '--disable-domain-reliability',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
          '--force-color-profile=srgb',
          '--metrics-recording-only',
          '--password-store=basic',
          '--use-mock-keychain',
          '--disable-blink-features=AutomationControlled',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--disable-extensions',
          '--disable-plugins',
          '--disable-images',
          '--disable-javascript',
          '--disable-css',
          '--disable-fonts',
          '--disable-default-apps',
          '--disable-sync',
          '--disable-translate',
          '--hide-scrollbars',
          '--mute-audio',
          '--no-default-browser-check',
          '--no-pings',
          '--disable-background-networking',
          '--disable-client-side-phishing-detection',
          '--disable-component-extensions-with-background-pages',
          '--disable-domain-reliability',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
          '--force-color-profile=srgb',
          '--metrics-recording-only',
          '--password-store=basic',
          '--use-mock-keychain',
          '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        ]
      })
      
      this.page = await this.browser.newPage()
      
      // Set user agent to look more like a real browser
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
      
      // Set viewport
      await this.page.setViewport({ width: 1920, height: 1080 })
      
      // Enable JavaScript
      await this.page.setJavaScriptEnabled(true)
      
      // Advanced anti-detection techniques
      await this.page.evaluateOnNewDocument(() => {
        // Remove webdriver property
        delete navigator.__proto__.webdriver;
        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined,
        });
        
        // Override permissions
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
          parameters.name === 'notifications' ?
            Promise.resolve({ state: Notification.permission }) :
            originalQuery(parameters)
        );
        
        // Override plugins
        Object.defineProperty(navigator, 'plugins', {
          get: () => [1, 2, 3, 4, 5],
        });
        
        // Override languages
        Object.defineProperty(navigator, 'languages', {
          get: () => ['en-US', 'en'],
        });
        
        // Override chrome
        Object.defineProperty(window, 'chrome', {
          writable: true,
          enumerable: true,
          configurable: true,
          value: {
            runtime: {},
          },
        });
        
        // Override permissions
        const originalGetProperty = Object.getOwnPropertyDescriptor;
        Object.getOwnPropertyDescriptor = function(obj, prop) {
          if (prop === 'webdriver') {
            return undefined;
          }
          return originalGetProperty(obj, prop);
        };
        
        // Override toString
        const originalToString = Function.prototype.toString;
        Function.prototype.toString = function() {
          if (this === Function.prototype.toString) return originalToString.call(originalToString);
          if (this === window.navigator.permissions.query) return 'function query() { [native code] }';
          return originalToString.call(this);
        };
      });
      
      // Set extra headers to look more human
      await this.page.setExtraHTTPHeaders({
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      })
      
      console.log('✅ Scraper initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize scraper:', error)
      throw error
    }
  }

  async scrapeTest(testId) {
    try {
      console.log(`🔍 Starting scrape for test ID: ${testId}`)
      
      // Try multiple approaches to bypass anti-bot protection
      const approaches = [
        () => this.scrapeWithApproach1(testId),
        () => this.scrapeWithApproach2(testId),
        () => this.scrapeWithApproach3(testId)
      ]
      
      for (let i = 0; i < approaches.length; i++) {
        try {
          console.log(`🔄 Trying approach ${i + 1} for ${testId}`)
          const result = await approaches[i]()
          
          if (result.success) {
            console.log(`✅ Approach ${i + 1} succeeded for ${testId}`)
            return result
          }
          
          console.log(`⚠️ Approach ${i + 1} failed for ${testId}: ${result.error}`)
          
        } catch (error) {
          console.log(`❌ Approach ${i + 1} error for ${testId}: ${error.message}`)
          
          // If the page was closed, try to recreate it
          if (error.message.includes('Session closed') || error.message.includes('Protocol error')) {
            try {
              await this.recreatePage()
              console.log(`🔄 Recreated page after error`)
            } catch (recreateError) {
              console.log(`❌ Failed to recreate page: ${recreateError.message}`)
            }
          }
        }
      }
      
      // All approaches failed, return fallback
      console.log(`📋 All approaches failed for ${testId}, using fallback data`)
      return {
        success: false,
        error: 'All scraping approaches failed',
        fallback: this.generateFallbackData(testId)
      }
      
    } catch (error) {
      console.error(`❌ Error scraping test ${testId}:`, error.message)
      return {
        success: false,
        error: error.message,
        fallback: this.generateFallbackData(testId)
      }
    }
  }

  async recreatePage() {
    try {
      if (this.page) {
        await this.page.close().catch(() => {})
      }
      
      this.page = await this.browser.newPage()
      
      // Set user agent to look more like a real browser
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
      
      // Set viewport
      await this.page.setViewport({ width: 1920, height: 1080 })
      
      // Enable JavaScript
      await this.page.setJavaScriptEnabled(true)
      
      // Advanced anti-detection techniques
      await this.page.evaluateOnNewDocument(() => {
        // Remove webdriver property
        delete navigator.__proto__.webdriver;
        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined,
        });
        
        // Override permissions
        const originalQuery = window.navigator.permissions.query;
        window.navigator.permissions.query = (parameters) => (
          parameters.name === 'notifications' ?
            Promise.resolve({ state: Notification.permission }) :
            originalQuery(parameters)
        );
        
        // Override plugins
        Object.defineProperty(navigator, 'plugins', {
          get: () => [1, 2, 3, 4, 5],
        });
        
        // Override languages
        Object.defineProperty(navigator, 'languages', {
          get: () => ['en-US', 'en'],
        });
        
        // Override chrome
        Object.defineProperty(window, 'chrome', {
          writable: true,
          enumerable: true,
          configurable: true,
          value: {
            runtime: {},
          },
        });
        
        // Override permissions
        const originalGetProperty = Object.getOwnPropertyDescriptor;
        Object.getOwnPropertyDescriptor = function(obj, prop) {
          if (prop === 'webdriver') {
            return undefined;
          }
          return originalGetProperty(obj, prop);
        };
        
        // Override toString
        const originalToString = Function.prototype.toString;
        Function.prototype.toString = function() {
          if (this === Function.prototype.toString) return originalToString.call(originalToString);
          if (this === window.navigator.permissions.query) return 'function query() { [native code] }';
          return originalToString.call(this);
        };
      });
      
      console.log('✅ Page recreated successfully')
    } catch (error) {
      console.error('❌ Failed to recreate page:', error.message)
      throw error
    }
  }

  async scrapeWithApproach1(testId) {
    // Approach 1: Standard navigation with anti-bot handling
    const url = `https://bdsmtest.org/r/${testId}`
    
    // Create a fresh page for this approach
    const page = await this.browser.newPage()
    
    try {
      // Set user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
      
      // Set viewport
      await page.setViewport({ width: 1920, height: 1080 })
      
      // Apply anti-detection techniques
      await page.evaluateOnNewDocument(() => {
        delete navigator.__proto__.webdriver;
        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined,
        });
      });
      
      await page.goto(url, { 
        waitUntil: 'domcontentloaded', 
        timeout: 30000 
      })
      
      await page.waitForTimeout(3000)
      await this.handleAntiBotChallengesOnPage(page)
      
      const blocked = await this.checkIfBlockedOnPage(page)
      if (blocked) {
        throw new Error('Access blocked by BDSMTest.org')
      }
      
      const results = await this.extractTestResultsFromPage(page)
      if (results && results.length > 0) {
        return {
          success: true,
          data: {
            id: testId,
            testName: `BDSM Test ${testId}`,
            selectedEmoji: '🔗',
            results: results,
            compatibilityScore: this.calculateCompatibilityScore(results),
            sharedInterestsCount: results.filter(r => r.percentage > 50).length
          }
        }
      }
      
      throw new Error('Could not extract test results')
    } finally {
      await page.close().catch(() => {})
    }
  }

  async scrapeWithApproach2(testId) {
    // Approach 2: Try with different user agent and headers
    const url = `https://bdsmtest.org/r/${testId}`
    
    // Create a fresh page for this approach
    const page = await this.browser.newPage()
    
    try {
      // Set different user agent
      await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
      
      // Set different headers
      await page.setExtraHTTPHeaders({
        'Accept-Language': 'en-GB,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Cache-Control': 'max-age=0',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1'
      })
      
      // Apply anti-detection techniques
      await page.evaluateOnNewDocument(() => {
        delete navigator.__proto__.webdriver;
        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined,
        });
      });
      
      await page.goto(url, { 
        waitUntil: 'networkidle0', 
        timeout: 30000 
      })
      
      await page.waitForTimeout(5000)
      await this.handleAntiBotChallengesOnPage(page)
      
      const blocked = await this.checkIfBlockedOnPage(page)
      if (blocked) {
        throw new Error('Access blocked by BDSMTest.org')
      }
      
      const results = await this.extractTestResultsFromPage(page)
      if (results && results.length > 0) {
        return {
          success: true,
          data: {
            id: testId,
            testName: `BDSM Test ${testId}`,
            selectedEmoji: '🔗',
            results: results,
            compatibilityScore: this.calculateCompatibilityScore(results),
            sharedInterestsCount: results.filter(r => r.percentage > 50).length
          }
        }
      }
      
      throw new Error('Could not extract test results')
    } finally {
      await page.close().catch(() => {})
    }
  }

  async scrapeWithApproach3(testId) {
    // Approach 3: Try with minimal browser features
    const url = `https://bdsmtest.org/r/${testId}`
    
    // Create a fresh page for this approach
    const page = await this.browser.newPage()
    
    try {
      // Set user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
      
      // Set viewport
      await page.setViewport({ width: 1920, height: 1080 })
      
      // Disable JavaScript temporarily
      await page.setJavaScriptEnabled(false)
      
      await page.goto(url, { 
        waitUntil: 'domcontentloaded', 
        timeout: 30000 
      })
      
      await page.waitForTimeout(2000)
      
      // Re-enable JavaScript
      await page.setJavaScriptEnabled(true)
      
      // Apply anti-detection techniques
      await page.evaluateOnNewDocument(() => {
        delete navigator.__proto__.webdriver;
        Object.defineProperty(navigator, 'webdriver', {
          get: () => undefined,
        });
      });
      
      await page.waitForTimeout(3000)
      await this.handleAntiBotChallengesOnPage(page)
      
      const blocked = await this.checkIfBlockedOnPage(page)
      if (blocked) {
        throw new Error('Access blocked by BDSMTest.org')
      }
      
      const results = await this.extractTestResultsFromPage(page)
      if (results && results.length > 0) {
        return {
          success: true,
          data: {
            id: testId,
            testName: `BDSM Test ${testId}`,
            selectedEmoji: '🔗',
            results: results,
            compatibilityScore: this.calculateCompatibilityScore(results),
            sharedInterestsCount: results.filter(r => r.percentage > 50).length
          }
        }
      }
      
      throw new Error('Could not extract test results')
    } finally {
      await page.close().catch(() => {})
    }
  }

  async handleAntiBotChallengesOnPage(page) {
    try {
      // Wait for potential CAPTCHA or challenge elements
      await page.waitForTimeout(3000)
      
      // Check for common anti-bot challenge elements
      const challengeSelectors = [
        'iframe[src*="captcha"]',
        'iframe[src*="challenge"]',
        'iframe[src*="cloudflare"]',
        '.captcha',
        '.challenge',
        '#cf-challenge',
        '.cf-browser-verification',
        '#challenge-form',
        '.cf-browser-verification',
        '.cf-wrapper',
        '.cf-error-code'
      ]
      
      let challengeFound = false
      for (const selector of challengeSelectors) {
        try {
          const element = await page.$(selector)
          if (element) {
            console.log(`🔍 Found anti-bot challenge: ${selector}`)
            challengeFound = true
            
            // Try to interact with the challenge
            await this.handleSpecificChallengeOnPage(page, selector)
            break
          }
        } catch (error) {
          continue
        }
      }
      
      if (!challengeFound) {
        // Try to click any "I'm human" or "Verify" buttons
        const verifyButtons = [
          'button:contains("I\'m human")',
          'button:contains("Verify")',
          'button:contains("Continue")',
          'button:contains("Submit")',
          'input[type="submit"]',
          '.cf-button',
          '#cf-button',
          'button[type="submit"]'
        ]
        
        for (const buttonSelector of verifyButtons) {
          try {
            await page.waitForSelector(buttonSelector, { timeout: 2000 })
            await page.click(buttonSelector)
            console.log(`✅ Clicked verification button: ${buttonSelector}`)
            await page.waitForTimeout(3000)
            break
          } catch (error) {
            continue
          }
        }
      }
      
      // Wait a bit more for any redirects or page changes
      await page.waitForTimeout(2000)
      
    } catch (error) {
      console.log('No anti-bot challenges found or handled')
    }
  }

  async handleSpecificChallengeOnPage(page, selector) {
    try {
      if (selector.includes('captcha')) {
        console.log('🔄 Handling CAPTCHA challenge...')
        
        // Wait for CAPTCHA to load
        await page.waitForTimeout(5000)
        
        // Try to find and click the CAPTCHA checkbox
        const checkboxSelectors = [
          '.recaptcha-checkbox',
          '#recaptcha-anchor',
          '.g-recaptcha',
          'iframe[title*="recaptcha"]'
        ]
        
        for (const checkboxSelector of checkboxSelectors) {
          try {
            const checkbox = await page.$(checkboxSelector)
            if (checkbox) {
              await checkbox.click()
              console.log('✅ Clicked CAPTCHA checkbox')
              await page.waitForTimeout(5000)
              break
            }
          } catch (error) {
            continue
          }
        }
        
        // Wait for CAPTCHA verification
        await page.waitForTimeout(10000)
        
      } else if (selector.includes('cloudflare')) {
        console.log('🔄 Handling Cloudflare challenge...')
        
        // Wait for Cloudflare challenge to load
        await page.waitForTimeout(3000)
        
        // Try to find and click the "I'm human" button
        const humanButtonSelectors = [
          'button:contains("I\'m human")',
          'button:contains("Verify")',
          '.cf-button',
          '#cf-button',
          'input[type="submit"]'
        ]
        
        for (const buttonSelector of humanButtonSelectors) {
          try {
            await page.waitForSelector(buttonSelector, { timeout: 3000 })
            await page.click(buttonSelector)
            console.log('✅ Clicked Cloudflare verification button')
            await page.waitForTimeout(5000)
            break
          } catch (error) {
            continue
          }
        }
      }
      
    } catch (error) {
      console.log('Error handling specific challenge:', error.message)
    }
  }

  async handleAntiBotChallenges() {
    try {
      // Wait for potential CAPTCHA or challenge elements
      await this.page.waitForTimeout(3000)
      
      // Check for common anti-bot challenge elements
      const challengeSelectors = [
        'iframe[src*="captcha"]',
        'iframe[src*="challenge"]',
        'iframe[src*="cloudflare"]',
        '.captcha',
        '.challenge',
        '#cf-challenge',
        '.cf-browser-verification',
        '#challenge-form',
        '.cf-browser-verification',
        '.cf-wrapper',
        '.cf-error-code'
      ]
      
      let challengeFound = false
      for (const selector of challengeSelectors) {
        try {
          const element = await this.page.$(selector)
          if (element) {
            console.log(`🔍 Found anti-bot challenge: ${selector}`)
            challengeFound = true
            
            // Try to interact with the challenge
            await this.handleSpecificChallenge(selector)
            break
          }
        } catch (error) {
          continue
        }
      }
      
      if (!challengeFound) {
        // Try to click any "I'm human" or "Verify" buttons
        const verifyButtons = [
          'button:contains("I\'m human")',
          'button:contains("Verify")',
          'button:contains("Continue")',
          'button:contains("Submit")',
          'input[type="submit"]',
          '.cf-button',
          '#cf-button',
          'button[type="submit"]'
        ]
        
        for (const buttonSelector of verifyButtons) {
          try {
            await this.page.waitForSelector(buttonSelector, { timeout: 2000 })
            await this.page.click(buttonSelector)
            console.log(`✅ Clicked verification button: ${buttonSelector}`)
            await this.page.waitForTimeout(3000)
            break
          } catch (error) {
            continue
          }
        }
      }
      
      // Wait a bit more for any redirects or page changes
      await this.page.waitForTimeout(2000)
      
    } catch (error) {
      console.log('No anti-bot challenges found or handled')
    }
  }

  async handleSpecificChallenge(selector) {
    try {
      if (selector.includes('captcha')) {
        console.log('🔄 Handling CAPTCHA challenge...')
        
        // Wait for CAPTCHA to load
        await this.page.waitForTimeout(5000)
        
        // Try to find and click the CAPTCHA checkbox
        const checkboxSelectors = [
          '.recaptcha-checkbox',
          '#recaptcha-anchor',
          '.g-recaptcha',
          'iframe[title*="recaptcha"]'
        ]
        
        for (const checkboxSelector of checkboxSelectors) {
          try {
            const checkbox = await this.page.$(checkboxSelector)
            if (checkbox) {
              await checkbox.click()
              console.log('✅ Clicked CAPTCHA checkbox')
              await this.page.waitForTimeout(5000)
              break
            }
          } catch (error) {
            continue
          }
        }
        
        // Wait for CAPTCHA verification
        await this.page.waitForTimeout(10000)
        
      } else if (selector.includes('cloudflare')) {
        console.log('🔄 Handling Cloudflare challenge...')
        
        // Wait for Cloudflare challenge to load
        await this.page.waitForTimeout(3000)
        
        // Try to find and click the "I'm human" button
        const humanButtonSelectors = [
          'button:contains("I\'m human")',
          'button:contains("Verify")',
          '.cf-button',
          '#cf-button',
          'input[type="submit"]'
        ]
        
        for (const buttonSelector of humanButtonSelectors) {
          try {
            await this.page.waitForSelector(buttonSelector, { timeout: 3000 })
            await this.page.click(buttonSelector)
            console.log('✅ Clicked Cloudflare verification button')
            await this.page.waitForTimeout(5000)
            break
          } catch (error) {
            continue
          }
        }
      }
      
    } catch (error) {
      console.log('Error handling specific challenge:', error.message)
    }
  }

  async checkIfBlockedOnPage(page) {
    try {
      const title = await page.title()
      const url = page.url()
      
      // Check for common blocking indicators
      const blockingIndicators = [
        'This is no place for humans',
        'Access denied',
        'Forbidden',
        'Blocked',
        'Robot',
        'Bot',
        'Rate limited',
        'Too many requests',
        'Security check',
        'Cloudflare'
      ]
      
      const pageContent = await page.content()
      const pageText = await page.evaluate(() => document.body.innerText)
      
      for (const indicator of blockingIndicators) {
        if (pageContent.toLowerCase().includes(indicator.toLowerCase()) || 
            pageText.toLowerCase().includes(indicator.toLowerCase()) ||
            title.toLowerCase().includes(indicator.toLowerCase()) ||
            url.toLowerCase().includes(indicator.toLowerCase())) {
          return true
        }
      }
      
      // Check for 401/403 status
      const response = await page.evaluate(() => {
        return window.performance.getEntriesByType('navigation')[0]?.responseStatus
      })
      
      if (response === 401 || response === 403) {
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error checking if blocked:', error)
      return false
    }
  }

  async checkIfBlocked() {
    return this.checkIfBlockedOnPage(this.page)
  }

  async extractTestResultsFromPage(page) {
    try {
      // Wait for the results to load
      await page.waitForTimeout(3000)
      
      // Method 1: Try to find the copy-paste area (most reliable)
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
        return this.parseCopyPasteData(copyPasteData);
      }
      
      // Method 2: Try to find results in the main content area
      const mainContentData = await page.evaluate(() => {
        // Look for common result containers
        const selectors = [
          '.results-container',
          '.test-results',
          '.results',
          '[data-testid="results"]',
          '.content',
          'main',
          '#main',
          '.main'
        ];
        
        for (const selector of selectors) {
          const element = document.querySelector(selector);
          if (element) {
            console.log(`Found results in: ${selector}`);
            return element.innerText || element.textContent || '';
          }
        }
        
        // If no specific container found, try the entire body
        return document.body.innerText || document.body.textContent || '';
      });
      
      if (mainContentData) {
        console.log(`📄 Found main content data: ${mainContentData.substring(0, 200)}...`);
        return this.parseMainContentData(mainContentData);
      }
      
      // Method 3: Try to find any elements with percentage data
      const percentageElements = await this.page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const results = [];
        
        for (const element of elements) {
          const text = element.innerText || element.textContent || '';
          if (text.includes('%') && text.length < 100) {
            // Look for patterns like "Role: XX%" or "XX% Role"
            const patterns = [
              /([A-Za-z\s\/\-\(\)]+):\s*(\d+)%/g,
              /(\d+)%\s*([A-Za-z\s\/\-\(\)]+)/g
            ];
            
            for (const pattern of patterns) {
              let match;
              while ((match = pattern.exec(text)) !== null) {
                const role = match[1]?.trim() || match[2]?.trim();
                const percentage = parseInt(match[2] || match[1]);
                
                if (role && percentage >= 0 && percentage <= 100 && role.length > 0 && role.length < 50) {
                  results.push({
                    role: role,
                    percentage: percentage
                  });
                }
              }
            }
          }
        }
        
        return results;
      });
      
      if (percentageElements && percentageElements.length > 0) {
        console.log(`📊 Found ${percentageElements.length} percentage elements`);
        return percentageElements;
      }
      
      return null;
    } catch (error) {
      console.error('Error extracting test results:', error)
      return null
    }
  }

  async extractTestResults() {
    return this.extractTestResultsFromPage(this.page)
  }

  parseCopyPasteData(data) {
    try {
      const results = [];
      const lines = data.split('\n').filter(line => line.trim().length > 0);
      
      lines.forEach(line => {
        // Skip header lines and URLs
        if (line.includes('== Results from bdsmtest.org: ==') || 
            line.includes('https://bdsmtest.org/') ||
            line.includes('==') ||
            line.trim().length === 0) {
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
                  percentage: percentage
                });
              }
            }
          }
        });
      });
      
      return results.sort((a, b) => b.percentage - a.percentage);
    } catch (error) {
      console.error('Error parsing copy-paste data:', error);
      return null;
    }
  }

  parseMainContentData(data) {
    try {
      const results = [];
      
      // Look for patterns like "Role: XX%" or "XX% Role"
      const patterns = [
        /([A-Za-z\s\/\-\(\)]+):\s*(\d+)%/g,
        /(\d+)%\s*([A-Za-z\s\/\-\(\)]+)/g
      ];
      
      for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(data)) !== null) {
          const role = match[1]?.trim() || match[2]?.trim();
          const percentage = parseInt(match[2] || match[1]);
          
          if (role && percentage >= 0 && percentage <= 100 && role.length > 0 && role.length < 50) {
            // Check if this role is already added
            const existingRole = results.find(r => r.role === role);
            if (!existingRole) {
              results.push({
                role: role,
                percentage: percentage
              });
            }
          }
        }
      }
      
      return results.sort((a, b) => b.percentage - a.percentage);
    } catch (error) {
      console.error('Error parsing main content data:', error);
      return null;
    }
  }

  calculateCompatibilityScore(results) {
    if (!results || results.length === 0) return 0
    
    const highScoreRoles = results.filter(r => r.percentage > 70)
    const mediumScoreRoles = results.filter(r => r.percentage > 40 && r.percentage <= 70)
    
    const score = (highScoreRoles.length * 10 + mediumScoreRoles.length * 5) / results.length
    return Math.min(Math.round(score), 100)
  }

  generateFallbackData(testId) {
    // Generate realistic demo data based on the test ID
    const seed = testId.toString().split('').reduce((a, b) => a + parseInt(b), 0)
    const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
    
    const roles = [
      'Submissive', 'Dominant', 'Switch', 'Master/Mistress', 'Slave',
      'Daddy/Mommy', 'Little', 'Rigger', 'Rope bunny', 'Sadist',
      'Masochist', 'Brat', 'Brat tamer', 'Vanilla', 'Experimentalist',
      'Non-monogamist', 'Ageplayer', 'Pet', 'Owner', 'Primal (Hunter)',
      'Primal (Prey)', 'Voyeur', 'Exhibitionist', 'Degradation', 'Praise'
    ]
    
    const results = roles.map(role => ({
      role: role,
      percentage: random(0, 100)
    })).sort((a, b) => b.percentage - a.percentage)
    
    const emojis = ['🎭', '♞', '🦋', '🌹', '⚡', '🔥', '💎', '🌟', '🌙', '☀️']
    const selectedEmoji = emojis[seed % emojis.length]
    
    return {
      id: testId,
      testName: `Demo Test ${testId}`,
      selectedEmoji: selectedEmoji,
      results: results,
      compatibilityScore: this.calculateCompatibilityScore(results),
      sharedInterestsCount: results.filter(r => r.percentage > 50).length,
      source: 'demo'
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close()
    }
  }
}

export default BDSMScraper
