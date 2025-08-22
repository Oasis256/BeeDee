const axios = require('axios');

async function findResultsData() {
  try {
    console.log('🔍 Looking for results data loading mechanism...');
    
    // Get the pages.js file
    const response = await axios.get('https://bdsmtest.org/js/pages.js');
    const jsContent = response.data;
    
    // Look for the specific function that loads results
    console.log('🔍 Looking for results loading function...');
    
    // Search for any function that might load results
    const resultsPattern = /function\s+(\w*[Rr]esults\w*)\s*\([^)]*\)\s*\{[\s\S]*?\}/g;
    const resultsMatches = jsContent.match(resultsPattern);
    
    if (resultsMatches) {
      console.log('📊 Found results functions:');
      resultsMatches.forEach((match, index) => {
        console.log(`Function ${index + 1}: ${match.substring(0, 200)}...`);
      });
    }
    
    // Look for any data loading that might contain results
    console.log('\n🔍 Looking for data loading patterns...');
    
    const dataPatterns = [
      /loadResults\s*\([^)]*\)/g,
      /getResults\s*\([^)]*\)/g,
      /processResults\s*\([^)]*\)/g,
      /showResults\s*\([^)]*\)/g
    ];
    
    dataPatterns.forEach(pattern => {
      const matches = jsContent.match(pattern);
      if (matches) {
        console.log(`📊 Found pattern:`, matches);
      }
    });
    
    // Look for any hardcoded results data
    console.log('\n🔍 Looking for hardcoded results...');
    
    const hardcodedPattern = /results\s*[:=]\s*\[[\s\S]*?\]/g;
    const hardcodedMatches = jsContent.match(hardcodedPattern);
    
    if (hardcodedMatches) {
      console.log('📊 Found hardcoded results:');
      hardcodedMatches.forEach(match => {
        console.log(match.substring(0, 300));
      });
    }
    
    // Look for any AJAX calls that might load results
    console.log('\n🔍 Looking for AJAX calls...');
    
    const ajaxPattern = /\.ajax\s*\(\s*\{[\s\S]*?\}\s*\)/g;
    const ajaxMatches = jsContent.match(ajaxPattern);
    
    if (ajaxMatches) {
      console.log('📊 Found AJAX calls:');
      ajaxMatches.forEach(match => {
        console.log(match.substring(0, 300));
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

findResultsData();





