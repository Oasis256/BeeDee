import axios from 'axios'

class ApiService {
  constructor() {
    this.baseURL = null
    this.discoveredPort = null
  }

  async discoverPort() {
    if (this.discoveredPort) {
      return this.discoveredPort
    }

    // Check for environment variable first (production)
    const envApiUrl = import.meta.env.VITE_API_URL
    console.log(`🔍 Environment variable check:`, {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      envApiUrl: envApiUrl,
      type: typeof envApiUrl
    })
    
    if (envApiUrl) {
      console.log(`🔍 Using environment API URL: ${envApiUrl}`)
      
      // Handle relative URLs (for nginx proxy setup)
      if (envApiUrl.startsWith('/')) {
        this.baseURL = envApiUrl
        console.log(`✅ Using relative API URL: ${this.baseURL}`)
        console.log(`🔗 Base URL set to: ${this.baseURL}`)
        return null
      }
      
      // Handle absolute URLs
      try {
        const healthUrl = envApiUrl.replace('/api', '/health')
        console.log(`🔍 Testing health endpoint: ${healthUrl}`)
        const response = await axios.get(healthUrl, { timeout: 5000 })
        if (response.status === 200) {
          this.baseURL = envApiUrl
          console.log(`✅ Successfully connected to backend via environment URL`)
          console.log(`🔗 Base URL set to: ${this.baseURL}`)
          return null
        }
      } catch (error) {
        console.log(`❌ Failed to connect to environment API URL: ${error.message}`)
        // Don't fall back to port discovery if environment variable is set
        throw new Error(`Backend server not found at ${envApiUrl}`)
      }
    }

    // Get the current host and protocol from the browser
    const currentHost = window.location.hostname
    const currentProtocol = window.location.protocol
    
    console.log(`🔍 API Service: Current hostname is ${currentHost}, protocol is ${currentProtocol}`)

    // Special handling for your subdomain setup
    if (currentHost === 'bee.shu-le.tech') {
      const backendHost = 'dee.shu-le.tech'
      console.log(`🔍 Detected bee.shu-le.tech frontend, connecting to ${backendHost} backend`)
      
      // Try to connect to the backend subdomain
      try {
        const url = `${currentProtocol}//${backendHost}/health`
        console.log(`🔍 Trying to connect to: ${url}`)
        const response = await axios.get(url, { timeout: 5000 })
        if (response.status === 200) {
          this.discoveredPort = null // No port needed for subdomain
          this.baseURL = `${currentProtocol}//${backendHost}/api`
          console.log(`✅ Successfully connected to backend on ${backendHost}`)
          console.log(`🔗 Base URL set to: ${this.baseURL}`)
          return null
        }
      } catch (error) {
        console.log(`❌ Failed to connect to ${currentProtocol}//${backendHost} - ${error.message}`)
      }
      
      // If HTTPS failed, try HTTP as fallback
      if (currentProtocol === 'https:') {
        try {
          const url = `http://${backendHost}/health`
          console.log(`🔍 Trying HTTP fallback: ${url}`)
          const response = await axios.get(url, { timeout: 5000 })
          if (response.status === 200) {
            this.discoveredPort = null
            this.baseURL = `http://${backendHost}/api`
            console.log(`✅ Successfully connected to backend on ${backendHost} via HTTP`)
            console.log(`🔗 Base URL set to: ${this.baseURL}`)
            return null
          }
        } catch (error) {
          console.log(`❌ Failed to connect to http://${backendHost} - ${error.message}`)
        }
      }
    }

    // Fallback to localhost for development
    const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1'
    const host = isLocalhost ? 'localhost' : currentHost
    
    console.log(`🔄 Falling back to port discovery on ${host}`)

    // Try ports from 3001 to 3010 on the detected host with both protocols
    for (let port = 3001; port <= 3010; port++) {
      // Try current protocol first
      try {
        const url = `${currentProtocol}//${host}:${port}/health`
        console.log(`🔍 Trying to connect to: ${url}`)
        const response = await axios.get(url, { timeout: 3000 })
        if (response.status === 200) {
          this.discoveredPort = port
          this.baseURL = `${currentProtocol}//${host}:${port}/api`
          console.log(`✅ Successfully discovered backend server on ${host}:${port}`)
          console.log(`🔗 Base URL set to: ${this.baseURL}`)
          return port
        }
      } catch (error) {
        console.log(`❌ Failed to connect to ${currentProtocol}//${host}:${port} - ${error.message}`)
      }
      
      // If current protocol failed, try the opposite protocol
      const oppositeProtocol = currentProtocol === 'https:' ? 'http:' : 'https:'
      try {
        const url = `${oppositeProtocol}//${host}:${port}/health`
        console.log(`🔍 Trying to connect to: ${url}`)
        const response = await axios.get(url, { timeout: 3000 })
        if (response.status === 200) {
          this.discoveredPort = port
          this.baseURL = `${oppositeProtocol}//${host}:${port}/api`
          console.log(`✅ Successfully discovered backend server on ${host}:${port}`)
          console.log(`🔗 Base URL set to: ${this.baseURL}`)
          return port
        }
      } catch (error) {
        console.log(`❌ Failed to connect to ${oppositeProtocol}//${host}:${port} - ${error.message}`)
      }
    }
    
    // If we're not on localhost, also try localhost as a fallback
    if (host !== 'localhost') {
      console.log(`🔄 Trying localhost fallback...`)
      for (let port = 3001; port <= 3010; port++) {
        // Try current protocol first
        try {
          const url = `${currentProtocol}//localhost:${port}/health`
          console.log(`🔍 Trying to connect to: ${url}`)
          const response = await axios.get(url, { timeout: 3000 })
          if (response.status === 200) {
            this.discoveredPort = port
            this.baseURL = `${currentProtocol}//localhost:${port}/api`
            console.log(`✅ Successfully discovered backend server on localhost:${port}`)
            console.log(`🔗 Base URL set to: ${this.baseURL}`)
            return port
          }
        } catch (error) {
          console.log(`❌ Failed to connect to ${currentProtocol}//localhost:${port} - ${error.message}`)
        }
        
        // Try opposite protocol
        const oppositeProtocol = currentProtocol === 'https:' ? 'http:' : 'https:'
        try {
          const url = `${oppositeProtocol}//localhost:${port}/health`
          console.log(`🔍 Trying to connect to: ${url}`)
          const response = await axios.get(url, { timeout: 3000 })
          if (response.status === 200) {
            this.discoveredPort = port
            this.baseURL = `${oppositeProtocol}//localhost:${port}/api`
            console.log(`✅ Successfully discovered backend server on localhost:${port}`)
            console.log(`🔗 Base URL set to: ${this.baseURL}`)
            return port
          }
        } catch (error) {
          console.log(`❌ Failed to connect to ${oppositeProtocol}//localhost:${port} - ${error.message}`)
        }
      }
    }
    
    console.error(`❌ Backend server not found`)
    throw new Error(`Backend server not found`)
  }

  async getBaseURL() {
    if (!this.baseURL) {
      await this.discoverPort()
    }
    return this.baseURL
  }

  // Test Results
  async fetchTestResults(testId) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/bdsm-results/${testId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching test results:', error)
      throw error
    }
  }

  // Profile Management
  async createProfile(name, testId, emoji = '♞') {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.post(`${baseURL}/profiles`, {
        name,
        testId,
        emoji
      })
      return response.data
    } catch (error) {
      console.error('Error creating profile:', error)
      throw error
    }
  }

  async getAllProfiles() {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/profiles`)
      return response.data
    } catch (error) {
      console.error('Error fetching profiles:', error)
      throw error
    }
  }

  async getProfile(testId) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/profiles/${testId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching profile:', error)
      throw error
    }
  }

  async updateProfile(testId, name, emoji) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.put(`${baseURL}/profiles/${testId}`, {
        name,
        emoji
      })
      return response.data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  async deleteProfile(testId) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.delete(`${baseURL}/profiles/${testId}`)
      return response.data
    } catch (error) {
      console.error('Error deleting profile:', error)
      throw error
    }
  }

  // Favorites Management
  async addFavorite(testId, name = null, emoji = '⭐') {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.post(`${baseURL}/favorites`, {
        testId,
        name,
        emoji
      })
      return response.data
    } catch (error) {
      console.error('Error adding favorite:', error)
      throw error
    }
  }

  async getFavorites() {
    try {
      const baseURL = await this.getBaseURL()
      console.log(`🔍 getFavorites: Making request to ${baseURL}/favorites`)
      const response = await axios.get(`${baseURL}/favorites`)
      console.log(`✅ getFavorites: Response received:`, response.data)
      return response.data
    } catch (error) {
      console.error('❌ Error fetching favorites:', error)
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
      throw error
    }
  }

  async removeFavorite(testId) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.delete(`${baseURL}/favorites/${testId}`)
      return response.data
    } catch (error) {
      console.error('Error removing favorite:', error)
      throw error
    }
  }

  // Analysis History
  async saveAnalysis(testIds, analysisType, resultData) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.post(`${baseURL}/analysis`, {
        testIds,
        analysisType,
        resultData
      })
      return response.data
    } catch (error) {
      console.error('Error saving analysis:', error)
      throw error
    }
  }

  async getAnalysisHistory(limit = 10) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/analysis/history?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Error fetching analysis history:', error)
      throw error
    }
  }

  // Export History
  async saveExport(testIds, format, filePath = null) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.post(`${baseURL}/export`, {
        testIds,
        format,
        filePath
      })
      return response.data
    } catch (error) {
      console.error('Error saving export:', error)
      throw error
    }
  }

  async getExportHistory(limit = 10) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/export/history?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Error fetching export history:', error)
      throw error
    }
  }

  // Share History
  async saveShare(testIds, method, shareData = null) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.post(`${baseURL}/share`, {
        testIds,
        method,
        shareData
      })
      return response.data
    } catch (error) {
      console.error('Error saving share:', error)
      throw error
    }
  }

  async getShareHistory(limit = 10) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/share/history?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Error fetching share history:', error)
      throw error
    }
  }

  // Scenario Management
  async saveScenario(scenario) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.post(`${baseURL}/scenarios`, scenario)
      return response.data
    } catch (error) {
      console.error('Error saving scenario:', error)
      throw error
    }
  }

  async getScenarios(testIds = null) {
    try {
      const baseURL = await this.getBaseURL()
      const params = testIds ? `?testIds=${JSON.stringify(testIds)}` : ''
      const response = await axios.get(`${baseURL}/scenarios${params}`)
      return response.data
    } catch (error) {
      console.error('Error fetching scenarios:', error)
      throw error
    }
  }

  async getScenario(id) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/scenarios/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching scenario:', error)
      throw error
    }
  }

  async updateScenario(id, scenario) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.put(`${baseURL}/scenarios/${id}`, scenario)
      return response.data
    } catch (error) {
      console.error('Error updating scenario:', error)
      throw error
    }
  }

  async deleteScenario(id) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.delete(`${baseURL}/scenarios/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting scenario:', error)
      throw error
    }
  }

  async getScenarioStats() {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/scenarios/stats`)
      return response.data
    } catch (error) {
      console.error('Error fetching scenario stats:', error)
      throw error
    }
  }

  // Statistics
  async getProfileStats() {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/stats/profiles`)
      return response.data
    } catch (error) {
      console.error('Error fetching profile stats:', error)
      throw error
    }
  }

  async getGlobalStats() {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/stats/global`)
      return response.data
    } catch (error) {
      console.error('Error fetching global stats:', error)
      throw error
    }
  }

  async getShareStats() {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/stats/shares`)
      return response.data
    } catch (error) {
      console.error('Error fetching share stats:', error)
      throw error
    }
  }

  async getAnalysisStats() {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/stats/analysis`)
      return response.data
    } catch (error) {
      console.error('Error fetching analysis stats:', error)
      throw error
    }
  }

  // Search and Analytics
  async searchProfiles(query) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/search/profiles?q=${encodeURIComponent(query)}`)
      return response.data
    } catch (error) {
      console.error('Error searching profiles:', error)
      throw error
    }
  }

  async getTopRoles(limit = 10) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/analytics/top-roles?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Error fetching top roles:', error)
      throw error
    }
  }

  async getRoleDistribution() {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/analytics/role-distribution`)
      return response.data
    } catch (error) {
      console.error('Error fetching role distribution:', error)
      throw error
    }
  }

  // Health check
  async healthCheck() {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL.replace('/api', '')}/health`)
      return response.data
    } catch (error) {
      console.error('Error checking server health:', error)
      throw error
    }
  }
}

const apiService = new ApiService()
export default apiService
