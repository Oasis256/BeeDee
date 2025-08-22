const axios = require('axios');

async function analyzePagesJS() {
  try {
    console.log('🔍 Analyzing pages.js for data loading mechanisms...');
    
    const response = await axios.get('https://bdsmtest.org/js/pages.js', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const jsContent = response.data;
    console.log(`📄 Got pages.js (${jsContent.length} characters)`);
    
    // Look for data loading functions
    console.log('\n🔍 Looking for data loading functions...');
    
    const dataFunctions = [
      'processUserdata',
      'getuserdata', 
      'loadingdata',
      'loadResults',
      'getResults',
      'fetchResults',
      'loadUserData'
    ];
    
    dataFunctions.forEach(func => {
      const regex = new RegExp(`function\\s+${func}|${func}\\s*[:=]\\s*function`, 'g');
      const matches = jsContent.match(regex);
      if (matches) {
        console.log(`✅ Found function: ${func}`);
        
        // Get the function content
        const funcStart = jsContent.indexOf(func);
        if (funcStart !== -1) {
          const funcContent = jsContent.substring(funcStart, funcStart + 500);
          console.log(`📄 Function content preview: ${funcContent.substring(0, 200)}...`);
        }
      }
    });
    
    // Look for API calls
    console.log('\n🔍 Looking for API calls...');
    
    const apiPatterns = [
      /fetch\(['"`]([^'"`]+)['"`]/g,
      /\.ajax\([^)]+\)/g,
      /\.get\([^)]+\)/g,
      /\.post\([^)]+\)/g,
      /XMLHttpRequest/g,
      /\.open\(['"`]([^'"`]+)['"`],\s*['"`]([^'"`]+)['"`]/g
    ];
    
    apiPatterns.forEach(pattern => {
      const matches = jsContent.match(pattern);
      if (matches) {
        console.log(`🔗 Found API pattern:`, matches.slice(0, 3));
      }
    });
    
    // Look for URL patterns
    console.log('\n🔍 Looking for URL patterns...');
    
    const urlPatterns = [
      /['"`]\/[^'"`]*results[^'"`]*['"`]/g,
      /['"`]\/[^'"`]*data[^'"`]*['"`]/g,
      /['"`]\/[^'"`]*api[^'"`]*['"`]/g,
      /['"`]\/[^'"`]*user[^'"`]*['"`]/g
    ];
    
    urlPatterns.forEach(pattern => {
      const matches = jsContent.match(pattern);
      if (matches) {
        console.log(`🔗 Found URL pattern:`, matches);
      }
    });
    
    // Look for specific data loading logic
    console.log('\n🔍 Looking for specific data loading logic...');
    
    const dataPatterns = [
      /loadResults\s*\([^)]*\)/g,
      /getResults\s*\([^)]*\)/g,
      /processUserdata\s*\([^)]*\)/g,
      /getuserdata\s*\([^)]*\)/g
    ];
    
    dataPatterns.forEach(pattern => {
      const matches = jsContent.match(pattern);
      if (matches) {
        console.log(`📊 Found data pattern:`, matches);
      }
    });
    
    // Look for any hardcoded data or results
    console.log('\n🔍 Looking for hardcoded data...');
    
    const hardcodedPatterns = [
      /results\s*[:=]\s*\[[^\]]+\]/g,
      /data\s*[:=]\s*\{[^}]+\}/g,
      /scores\s*[:=]\s*\[[^\]]+\]/g
    ];
    
    hardcodedPatterns.forEach(pattern => {
      const matches = jsContent.match(pattern);
      if (matches) {
        console.log(`📊 Found hardcoded data:`, matches.slice(0, 2));
      }
    });
    
    // Look for the specific function that loads results
    console.log('\n🔍 Looking for results loading function...');
    
    const resultsFunctionMatch = jsContent.match(/function\s+(\w*[Rr]esults\w*)\s*\([^)]*\)\s*\{[^}]*\}/g);
    if (resultsFunctionMatch) {
      console.log(`📊 Found results function:`, resultsFunctionMatch);
    }
    
    // Look for any AJAX calls to get results
    console.log('\n🔍 Looking for AJAX calls...');
    
    const ajaxMatches = jsContent.match(/\.ajax\s*\(\s*\{[^}]+\}\s*\)/g);
    if (ajaxMatches) {
      console.log(`📊 Found AJAX calls:`, ajaxMatches.slice(0, 2));
    }
    
    // Look for any fetch calls
    console.log('\n🔍 Looking for fetch calls...');
    
    const fetchMatches = jsContent.match(/fetch\s*\([^)]+\)/g);
    if (fetchMatches) {
      console.log(`📊 Found fetch calls:`, fetchMatches);
    }
    
    // Look for any POST requests
    console.log('\n🔍 Looking for POST requests...');
    
    const postMatches = jsContent.match(/\.post\s*\([^)]+\)/g);
    if (postMatches) {
      console.log(`📊 Found POST calls:`, postMatches);
    }
    
    // Look for any GET requests
    console.log('\n🔍 Looking for GET requests...');
    
    const getMatches = jsContent.match(/\.get\s*\([^)]+\)/g);
    if (getMatches) {
      console.log(`📊 Found GET calls:`, getMatches);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

analyzePagesJS();





