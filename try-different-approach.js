const axios = require('axios');
const cheerio = require('cheerio');

async function tryDifferentApproach() {
  const testId = 'KTkXzPSn';
  
  console.log(`🚀 Trying different approaches for test ID: ${testId}`);
  
  // Approach 1: Try to get the results page with different headers
  console.log('\n🔍 Approach 1: Different headers...');
  
  try {
    const response = await axios.get(`https://bdsmtest.org/r/${testId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
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
      }
    });
    
    const $ = cheerio.load(response.data);
    console.log(`📄 Page title: ${$('title').text()}`);
    
    // Look for any results in the page
    const bodyText = $('body').text();
    const percentageMatches = bodyText.match(/(\d+)%/g);
    console.log(`🔢 Found ${percentageMatches ? percentageMatches.length : 0} percentage matches`);
    
    if (percentageMatches) {
      console.log(`📊 Percentages found:`, percentageMatches.slice(0, 10));
    }
    
  } catch (error) {
    console.log(`❌ Approach 1 failed: ${error.message}`);
  }
  
  // Approach 2: Try to find alternative endpoints
  console.log('\n🔍 Approach 2: Alternative endpoints...');
  
  const alternativeEndpoints = [
    `https://bdsmtest.org/api/v1/results/${testId}`,
    `https://bdsmtest.org/api/v2/results/${testId}`,
    `https://bdsmtest.org/data/results/${testId}`,
    `https://bdsmtest.org/json/results/${testId}`,
    `https://bdsmtest.org/results/${testId}/json`,
    `https://bdsmtest.org/results/${testId}/data`,
    `https://bdsmtest.org/test/${testId}/results`,
    `https://bdsmtest.org/test/${testId}/data`
  ];
  
  for (const endpoint of alternativeEndpoints) {
    try {
      console.log(`🔍 Trying: ${endpoint}`);
      const response = await axios.get(endpoint, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        },
        timeout: 5000
      });
      
      if (response.status === 200) {
        console.log(`✅ SUCCESS! ${endpoint} returned:`, response.data);
        break;
      }
    } catch (error) {
      console.log(`❌ ${endpoint} failed: ${error.message}`);
    }
  }
  
  // Approach 3: Try to find the results in the page source
  console.log('\n🔍 Approach 3: Deep page analysis...');
  
  try {
    const response = await axios.get(`https://bdsmtest.org/r/${testId}`);
    const $ = cheerio.load(response.data);
    
    // Look for any script tags that might contain results
    const scripts = $('script');
    console.log(`📜 Found ${scripts.length} script tags`);
    
    scripts.each((index, script) => {
      const scriptContent = $(script).html();
      if (scriptContent) {
        // Look for any data that looks like results
        const dataPattern = /(\d+)%\s*['"`]([^'"`]+)['"`]/g;
        let match;
        while ((match = dataPattern.exec(scriptContent)) !== null) {
          const percentage = parseInt(match[1]);
          const role = match[2];
          if (percentage >= 0 && percentage <= 100 && role.length > 0) {
            console.log(`📊 Found potential result in script ${index}: ${role} ${percentage}%`);
          }
        }
      }
    });
    
    // Look for any hidden data
    const hiddenInputs = $('input[type="hidden"]');
    console.log(`🔍 Found ${hiddenInputs.length} hidden inputs`);
    
    hiddenInputs.each((index, input) => {
      const value = $(input).attr('value');
      const name = $(input).attr('name');
      console.log(`🔍 Hidden input ${index + 1}: name="${name}", value="${value}"`);
    });
    
    // Look for any data attributes
    const elementsWithData = $('[data-*]');
    console.log(`📊 Found ${elementsWithData.length} elements with data attributes`);
    
    elementsWithData.each((index, element) => {
      const dataAttrs = $(element).attr();
      Object.keys(dataAttrs).forEach(key => {
        if (key.startsWith('data-')) {
          console.log(`📊 Data attribute ${key}: ${dataAttrs[key]}`);
        }
      });
    });
    
  } catch (error) {
    console.log(`❌ Approach 3 failed: ${error.message}`);
  }
  
  // Approach 4: Try to find the results in the page text
  console.log('\n🔍 Approach 4: Text analysis...');
  
  try {
    const response = await axios.get(`https://bdsmtest.org/r/${testId}`);
    const $ = cheerio.load(response.data);
    
    const bodyText = $('body').text();
    
    // Look for patterns that might indicate results
    const patterns = [
      /(\d+)%\s*([A-Za-z\s\/\-()]+)/g,
      /([A-Za-z\s\/\-()]+)\s*(\d+)%/g,
      /(\d+)%[^a-zA-Z]*([A-Za-z\s\/\-()]+)/g
    ];
    
    patterns.forEach((pattern, index) => {
      let match;
      const results = [];
      while ((match = pattern.exec(bodyText)) !== null) {
        const percentage = parseInt(match[1]);
        const role = match[2] ? match[2].trim() : '';
        
        if (percentage >= 0 && percentage <= 100 && role.length > 0 && role.length < 50) {
          results.push({ role, percentage });
        }
      }
      
      if (results.length > 0) {
        console.log(`📊 Pattern ${index + 1} found ${results.length} potential results:`, results.slice(0, 5));
      }
    });
    
  } catch (error) {
    console.log(`❌ Approach 4 failed: ${error.message}`);
  }
}

tryDifferentApproach();





