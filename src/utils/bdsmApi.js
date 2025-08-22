import axios from 'axios'

// Since BDSMTest.org doesn't have a public API, we'll need to scrape the results
// We'll use a CORS proxy to avoid CORS issues
const CORS_PROXY = 'https://api.allorigins.win/raw?url='

export const fetchBDSMResults = async (testId) => {
  try {
    console.log(`🔍 Attempting to fetch real results for test ID: ${testId}`)
    
    // Try to fetch from our backend API first
    const response = await axios.get(`http://localhost:3001/api/bdsm-results/${testId}`)
    
    if (response.data.success && response.data.results.length > 0) {
      console.log(`✅ Successfully fetched REAL results for ${testId} using Puppeteer!`)
      return {
        ...response.data,
        dataSource: 'real'
      }
    } else {
      console.log(`⚠️ No results found for ${testId}, using demo data`)
      return {
        ...getMockResults(testId),
        dataSource: 'demo',
        message: 'No results found for this test ID. This is demo data.'
      }
    }
    
  } catch (error) {
    console.error('Error fetching real BDSM results:', error)
    console.log(`🔄 Backend error, using demo data for ${testId}`)
    
    // Fallback to mock data if the backend is not available
    return {
      ...getMockResults(testId),
      dataSource: 'demo',
      message: 'Backend error. This is demo data.'
    }
  }
}

const parseBDSMResults = (html, testId) => {
  // Create a temporary DOM element to parse the HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  
  // Extract the results from the page
  const results = []
  
  // Look for the results list - this is a simplified parser
  // In a real implementation, you'd need more robust parsing
  const resultElements = doc.querySelectorAll('.result-item, .role-item, [class*="result"]')
  
  if (resultElements.length === 0) {
    // Fallback: try to find results in a different format
    const text = doc.body.textContent
    const lines = text.split('\n')
    
    // Look for patterns like "90% Submissive" or "Submissive (90%)"
    const percentagePattern = /(\d+)%\s*([A-Za-z\s\/\-()]+)/g
    let match
    
    while ((match = percentagePattern.exec(text)) !== null) {
      const percentage = parseInt(match[1])
      const role = match[2].trim()
      
      if (percentage >= 0 && percentage <= 100 && role.length > 0) {
        results.push({
          role,
          percentage,
          color: getColorForPercentage(percentage)
        })
      }
    }
  } else {
    // Parse structured results
    resultElements.forEach(element => {
      const text = element.textContent
      const percentageMatch = text.match(/(\d+)%/)
      const roleMatch = text.match(/([A-Za-z\s\/\-()]+)/)
      
      if (percentageMatch && roleMatch) {
        const percentage = parseInt(percentageMatch[1])
        const role = roleMatch[1].trim()
        
        results.push({
          role,
          percentage,
          color: getColorForPercentage(percentage)
        })
      }
    })
  }
  
  // Sort by percentage (highest first)
  results.sort((a, b) => b.percentage - a.percentage)
  
  return {
    id: testId,
    results,
    timestamp: new Date().toISOString()
  }
}

const getColorForPercentage = (percentage) => {
  if (percentage >= 80) return 'green'
  if (percentage >= 60) return 'yellow'
  if (percentage >= 40) return 'orange'
  return 'red'
}

// Mock data for development/testing when the API doesn't work
export const getMockResults = (testId) => {
  const mockResults = [
    { role: 'Submissive', percentage: 90, color: 'green' },
    { role: 'Voyeur', percentage: 88, color: 'green' },
    { role: 'Rope bunny', percentage: 88, color: 'green' },
    { role: 'Non-monogamist', percentage: 85, color: 'green' },
    { role: 'Switch', percentage: 73, color: 'green' },
    { role: 'Masochist', percentage: 65, color: 'green' },
    { role: 'Experimentalist', percentage: 60, color: 'green' },
    { role: 'Primal (Prey)', percentage: 58, color: 'yellow' },
    { role: 'Brat', percentage: 52, color: 'yellow' },
    { role: 'Vanilla', percentage: 50, color: 'yellow' },
    { role: 'Slave', percentage: 17, color: 'orange' },
    { role: 'Dominant', percentage: 16, color: 'orange' },
    { role: 'Rigger', percentage: 10, color: 'red' },
    { role: 'Degradee', percentage: 8, color: 'red' },
    { role: 'Sadist', percentage: 7, color: 'red' },
    { role: 'Pet', percentage: 6, color: 'red' },
    { role: 'Daddy/Mommy', percentage: 0, color: 'red' },
    { role: 'Ageplayer', percentage: 0, color: 'red' },
    { role: 'Brat tamer', percentage: 0, color: 'red' },
    { role: 'Degrader', percentage: 0, color: 'red' },
    { role: 'Little', percentage: 0, color: 'red' },
    { role: 'Master/Mistress', percentage: 0, color: 'red' },
    { role: 'Owner', percentage: 0, color: 'red' },
    { role: 'Primal (Hunter)', percentage: 0, color: 'red' },
    { role: 'Exhibitionist', percentage: 0, color: 'red' }
  ]
  
  return {
    id: testId,
    results: mockResults,
    timestamp: new Date().toISOString()
  }
}
