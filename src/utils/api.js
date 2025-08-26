import axios from 'axios'
import logger from './logger.js'

class ApiService {
  constructor() {
    this.baseURL = null
    this.discoveredPort = null
    
    // Log environment configuration
    logger.api('Initializing API service', {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      NODE_ENV: import.meta.env.NODE_ENV,
      MODE: import.meta.env.MODE
    })
  }

  async discoverPort() {
    if (this.discoveredPort) {
      return this.discoveredPort
    }

    // Check for environment variable first (production)
    const envApiUrl = import.meta.env.VITE_API_URL
    logger.api('Checking environment variable', {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      envApiUrl: envApiUrl,
      type: typeof envApiUrl
    })
    
    // Force use of environment variable if available
    if (envApiUrl) {
      logger.api(`Using environment API URL: ${envApiUrl}`)
      
      // Handle relative URLs (for nginx proxy setup)
      if (envApiUrl.startsWith('/')) {
        this.baseURL = envApiUrl
        logger.api(`Using relative API URL: ${this.baseURL}`)
        return null
      }
      
      // Handle absolute URLs
      try {
        const healthUrl = envApiUrl.replace('/api', '/health')
        logger.api(`Testing health endpoint: ${healthUrl}`)
        const response = await axios.get(healthUrl, { timeout: 5000 })
        if (response.status === 200) {
          this.baseURL = envApiUrl
          logger.api(`Successfully connected to backend via environment URL`)
          return null
        }
      } catch (error) {
        logger.error(`Failed to connect to environment API URL: ${error.message}`)
        // Don't fall back to port discovery if environment variable is set
        throw new Error(`Backend server not found at ${envApiUrl}`)
      }
    }

    // If no environment variable, fall back to port discovery
    logger.api('No VITE_API_URL environment variable found, falling back to port discovery')

    // Get the current host and protocol from the browser
    const currentHost = window.location.hostname
    const currentProtocol = window.location.protocol
    
    logger.api(`Current hostname is ${currentHost}, protocol is ${currentProtocol}`)

    // Special handling for your subdomain setup
    if (currentHost === 'bee.shu-le.tech') {
      const backendHost = 'dee.shu-le.tech'
      logger.api(`Detected bee.shu-le.tech frontend, connecting to ${backendHost} backend`)
      
      // Try to connect to the backend subdomain
      try {
        const url = `${currentProtocol}//${backendHost}/health`
        logger.api(`Trying to connect to: ${url}`)
        const response = await axios.get(url, { timeout: 5000 })
        if (response.status === 200) {
          this.discoveredPort = null // No port needed for subdomain
          this.baseURL = `${currentProtocol}//${backendHost}/api`
          logger.api(`Successfully connected to backend on ${backendHost}`)
          return null
        }
      } catch (error) {
        logger.error(`Failed to connect to ${currentProtocol}//${backendHost} - ${error.message}`)
      }
      
      // If HTTPS failed, try HTTP as fallback
      if (currentProtocol === 'https:') {
        try {
          const url = `http://${backendHost}/health`
          logger.api(`Trying HTTP fallback: ${url}`)
          const response = await axios.get(url, { timeout: 5000 })
          if (response.status === 200) {
            this.discoveredPort = null
            this.baseURL = `http://${backendHost}/api`
            logger.api(`Successfully connected to backend on ${backendHost} via HTTP`)
            return null
          }
        } catch (error) {
          logger.error(`Failed to connect to http://${backendHost} - ${error.message}`)
        }
      }
    }

    // Fallback to localhost for development
    const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1'
    const host = isLocalhost ? 'localhost' : currentHost
    
    logger.api(`Falling back to port discovery on ${host}`)

    // Try ports from 3001 to 3010 on the detected host with both protocols
    for (let port = 3001; port <= 3010; port++) {
      // Try current protocol first
      try {
        const url = `${currentProtocol}//${host}:${port}/health`
        logger.api(`Trying to connect to: ${url}`)
        const response = await axios.get(url, { timeout: 3000 })
        if (response.status === 200) {
          this.discoveredPort = port
          this.baseURL = `${currentProtocol}//${host}:${port}/api`
          logger.api(`Successfully discovered backend server on ${host}:${port}`)
          return port
        }
      } catch (error) {
        logger.error(`Failed to connect to ${currentProtocol}//${host}:${port} - ${error.message}`)
      }
      
      // If current protocol failed, try the opposite protocol
      const oppositeProtocol = currentProtocol === 'https:' ? 'http:' : 'https:'
      try {
        const url = `${oppositeProtocol}//${host}:${port}/health`
        logger.api(`Trying to connect to: ${url}`)
        const response = await axios.get(url, { timeout: 3000 })
        if (response.status === 200) {
          this.discoveredPort = port
          this.baseURL = `${oppositeProtocol}//${host}:${port}/api`
          logger.api(`Successfully discovered backend server on ${host}:${port}`)
          return port
        }
      } catch (error) {
        logger.error(`Failed to connect to ${oppositeProtocol}//${host}:${port} - ${error.message}`)
      }
    }
    
    // If we're not on localhost, also try localhost as a fallback
    if (host !== 'localhost') {
      logger.api(`Trying localhost fallback...`)
      for (let port = 3001; port <= 3010; port++) {
        // Try current protocol first
        try {
          const url = `${currentProtocol}//localhost:${port}/health`
          logger.api(`Trying to connect to: ${url}`)
          const response = await axios.get(url, { timeout: 3000 })
          if (response.status === 200) {
            this.discoveredPort = port
            this.baseURL = `${currentProtocol}//localhost:${port}/api`
            logger.api(`Successfully discovered backend server on localhost:${port}`)
            return port
          }
        } catch (error) {
          logger.error(`Failed to connect to ${currentProtocol}//localhost:${port} - ${error.message}`)
        }
        
        // Try opposite protocol
        const oppositeProtocol = currentProtocol === 'https:' ? 'http:' : 'https:'
        try {
          const url = `${oppositeProtocol}//localhost:${port}/health`
          logger.api(`Trying to connect to: ${url}`)
          const response = await axios.get(url, { timeout: 3000 })
          if (response.status === 200) {
            this.discoveredPort = port
            this.baseURL = `${oppositeProtocol}//localhost:${port}/api`
            logger.api(`Successfully discovered backend server on localhost:${port}`)
            return port
          }
        } catch (error) {
          logger.error(`Failed to connect to ${oppositeProtocol}//localhost:${port} - ${error.message}`)
        }
      }
    }
    
    logger.error(`Backend server not found`)
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
      logger.error('Error fetching test results:', error)
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
      logger.error('Error creating profile:', error)
      throw error
    }
  }

  async getAllProfiles() {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/profiles`)
      return response.data
    } catch (error) {
      logger.error('Error fetching profiles:', error)
      throw error
    }
  }

  async getProfile(testId) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/profiles/${testId}`)
      return response.data
    } catch (error) {
      logger.error('Error fetching profile:', error)
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
      logger.error('Error fetching favorites:', error)
      logger.error('Error details:', {
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

  // Community Scenarios
  async getCommunityScenarios() {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.get(`${baseURL}/community-scenarios`)
      return response.data
    } catch (error) {
      console.error('Error fetching community scenarios:', error)
      throw error
    }
  }

  async uploadScenario(scenarioData) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.post(`${baseURL}/community-scenarios`, scenarioData)
      return response.data
    } catch (error) {
      console.error('Error uploading scenario:', error)
      throw error
    }
  }

  async likeScenario(scenarioId) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.post(`${baseURL}/community-scenarios/${scenarioId}/like`)
      return response.data
    } catch (error) {
      console.error('Error liking scenario:', error)
      throw error
    }
  }

  async downloadScenario(scenarioId) {
    try {
      const baseURL = await this.getBaseURL()
      const response = await axios.post(`${baseURL}/community-scenarios/${scenarioId}/download`)
      return response.data
    } catch (error) {
      console.error('Error downloading scenario:', error)
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
