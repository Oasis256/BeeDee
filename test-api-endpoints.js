const axios = require('axios');

async function testAPIEndpoints() {
  const testId = 'KTkXzPSn';
  
  console.log(`🚀 Testing API endpoints for test ID: ${testId}`);
  
  // The endpoints I found in the JavaScript
  const endpoints = [
    `/ajax/myresults`,
    `/ajax/getuserdata`,
    `/results/yours`,
    `/results/notyours`,
    `/results/copy/all`,
    `/results/copy/ten`,
    `/results/copy/url`,
    `/results/copy/allandurl`
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n🔍 Testing: https://bdsmtest.org${endpoint}`);
      
      const response = await axios.get(`https://bdsmtest.org${endpoint}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Referer': `https://bdsmtest.org/r/${testId}`,
          'Origin': 'https://bdsmtest.org'
        },
        timeout: 10000
      });
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`📄 Response type: ${typeof response.data}`);
      console.log(`📄 Response length: ${JSON.stringify(response.data).length}`);
      console.log(`📄 Response preview: ${JSON.stringify(response.data).substring(0, 200)}...`);
      
      // If it looks like JSON data, try to parse it
      if (typeof response.data === 'object' || response.data.includes('{') || response.data.includes('[')) {
        console.log(`📊 Parsed data:`, response.data);
      }
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Response: ${error.response.data}`);
      }
    }
  }
  
  // Try POST requests with the test ID
  console.log(`\n🔍 Trying POST requests with test ID...`);
  
  const postEndpoints = [
    `/ajax/getuserdata`,
    `/ajax/myresults`
  ];
  
  for (const endpoint of postEndpoints) {
    try {
      console.log(`\n🔍 POST to: https://bdsmtest.org${endpoint}`);
      
      const response = await axios.post(`https://bdsmtest.org${endpoint}`, {
        id: testId,
        testId: testId,
        user: testId
      }, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
          'Referer': `https://bdsmtest.org/r/${testId}`,
          'Origin': 'https://bdsmtest.org'
        },
        timeout: 10000
      });
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`📄 Response:`, response.data);
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Response: ${error.response.data}`);
      }
    }
  }
  
  // Try with query parameters
  console.log(`\n🔍 Trying with query parameters...`);
  
  const queryEndpoints = [
    `/ajax/getuserdata?id=${testId}`,
    `/ajax/myresults?id=${testId}`,
    `/results/yours?id=${testId}`,
    `/results/notyours?id=${testId}`
  ];
  
  for (const endpoint of queryEndpoints) {
    try {
      console.log(`\n🔍 Testing: https://bdsmtest.org${endpoint}`);
      
      const response = await axios.get(`https://bdsmtest.org${endpoint}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Referer': `https://bdsmtest.org/r/${testId}`,
          'Origin': 'https://bdsmtest.org'
        },
        timeout: 10000
      });
      
      console.log(`✅ Status: ${response.status}`);
      console.log(`📄 Response:`, response.data);
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Response: ${error.response.data}`);
      }
    }
  }
}

testAPIEndpoints();





