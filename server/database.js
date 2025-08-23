import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class Database {
  constructor() {
    this.db = null
    this.dbPath = path.join(__dirname, '..', 'bdsm_compatibility.db')
  }

  async init() {
    try {
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database
      })

      // Create tables
      await this.createTables()
      console.log('✅ Database initialized successfully')
    } catch (error) {
      console.error('❌ Database initialization error:', error)
      throw error
    }
  }

  async createTables() {
    // User profiles table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        test_id TEXT UNIQUE NOT NULL,
        emoji TEXT DEFAULT '♞',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Test results table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS test_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        test_id TEXT NOT NULL,
        role TEXT NOT NULL,
        percentage INTEGER NOT NULL,
        color TEXT DEFAULT 'green',
        data_source TEXT DEFAULT 'real',
        scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(test_id, role)
      )
    `)

    // Favorites table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS favorite_tests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        test_id TEXT NOT NULL,
        name TEXT,
        emoji TEXT DEFAULT '⭐',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(test_id)
      )
    `)

    // Compatibility analysis history
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS compatibility_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        test_ids TEXT NOT NULL, -- JSON array of test IDs
        analysis_type TEXT NOT NULL, -- 'shared_interests', 'compatibility_score', etc.
        result_data TEXT NOT NULL, -- JSON string of analysis results
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Export history
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS export_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        test_ids TEXT NOT NULL, -- JSON array of test IDs
        export_format TEXT NOT NULL, -- 'pdf', 'csv', 'json'
        file_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Share history
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS share_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        test_ids TEXT NOT NULL, -- JSON array of test IDs
        share_method TEXT NOT NULL, -- 'link', 'email', 'social'
        share_data TEXT, -- Additional share data
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Scenarios table
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS scenarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        roles TEXT NOT NULL, -- JSON array of roles
        intensity TEXT DEFAULT 'medium',
        duration TEXT DEFAULT 'medium',
        safety TEXT, -- JSON array of safety considerations
        test_ids TEXT, -- JSON array of related test IDs
        difficulty TEXT DEFAULT 'intermediate',
        category TEXT DEFAULT 'power-exchange',
        role_assignments TEXT, -- JSON object of role assignments
        equipment TEXT, -- JSON array of equipment
        steps TEXT, -- JSON array of steps
        safety_level TEXT DEFAULT 'moderate',
        is_custom BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('✅ Database tables created successfully')
  }

  // User Profile Methods
  async createProfile(name, testId, emoji = '♞') {
    try {
      const result = await this.db.run(
        'INSERT OR REPLACE INTO user_profiles (name, test_id, emoji) VALUES (?, ?, ?)',
        [name, testId, emoji]
      )
      return { id: result.lastID, name, testId, emoji }
    } catch (error) {
      console.error('Error creating profile:', error)
      throw error
    }
  }

  async getProfile(testId) {
    try {
      return await this.db.get(
        'SELECT * FROM user_profiles WHERE test_id = ?',
        [testId]
      )
    } catch (error) {
      console.error('Error getting profile:', error)
      throw error
    }
  }

  async getAllProfiles() {
    try {
      return await this.db.all('SELECT * FROM user_profiles ORDER BY created_at DESC')
    } catch (error) {
      console.error('Error getting all profiles:', error)
      throw error
    }
  }

  async updateProfile(testId, name, emoji) {
    try {
      await this.db.run(
        'UPDATE user_profiles SET name = ?, emoji = ?, updated_at = CURRENT_TIMESTAMP WHERE test_id = ?',
        [name, emoji, testId]
      )
      return await this.getProfile(testId)
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  async deleteProfile(testId) {
    try {
      await this.db.run('DELETE FROM user_profiles WHERE test_id = ?', [testId])
      await this.db.run('DELETE FROM test_results WHERE test_id = ?', [testId])
      return true
    } catch (error) {
      console.error('Error deleting profile:', error)
      throw error
    }
  }

  // Test Results Methods
  async saveTestResults(testId, results, dataSource = 'real') {
    try {
      // Delete existing results for this test
      await this.db.run('DELETE FROM test_results WHERE test_id = ?', [testId])

      // Insert new results
      for (const result of results) {
        await this.db.run(
          'INSERT INTO test_results (test_id, role, percentage, color, data_source) VALUES (?, ?, ?, ?, ?)',
          [testId, result.role, result.percentage, result.color, dataSource]
        )
      }

      return results.length
    } catch (error) {
      console.error('Error saving test results:', error)
      throw error
    }
  }

  async getTestResults(testId) {
    try {
      const results = await this.db.all(
        'SELECT * FROM test_results WHERE test_id = ? ORDER BY percentage DESC',
        [testId]
      )
      return results.map(row => ({
        role: row.role,
        percentage: row.percentage,
        color: row.color
      }))
    } catch (error) {
      console.error('Error getting test results:', error)
      throw error
    }
  }

  async getCachedResults(testId) {
    try {
      const results = await this.getTestResults(testId)
      if (results.length > 0) {
        const profile = await this.getProfile(testId)
        return {
          id: testId,
          results,
          success: true,
          timestamp: new Date().toISOString(),
          dataSource: 'cached',
          profile
        }
      }
      return null
    } catch (error) {
      console.error('Error getting cached results:', error)
      return null
    }
  }

  // Favorites Methods
  async addFavorite(testId, name = null, emoji = '⭐') {
    try {
      await this.db.run(
        'INSERT OR REPLACE INTO favorite_tests (test_id, name, emoji) VALUES (?, ?, ?)',
        [testId, name, emoji]
      )
      return true
    } catch (error) {
      console.error('Error adding favorite:', error)
      throw error
    }
  }

  async removeFavorite(testId) {
    try {
      await this.db.run('DELETE FROM favorite_tests WHERE test_id = ?', [testId])
      return true
    } catch (error) {
      console.error('Error removing favorite:', error)
      throw error
    }
  }

  async getFavorites() {
    try {
      return await this.db.all('SELECT * FROM favorite_tests ORDER BY created_at DESC')
    } catch (error) {
      console.error('Error getting favorites:', error)
      throw error
    }
  }

  async isFavorite(testId) {
    try {
      const result = await this.db.get(
        'SELECT COUNT(*) as count FROM favorite_tests WHERE test_id = ?',
        [testId]
      )
      return result.count > 0
    } catch (error) {
      console.error('Error checking favorite:', error)
      return false
    }
  }

  // Analysis History Methods
  async saveAnalysis(testIds, analysisType, resultData) {
    try {
      await this.db.run(
        'INSERT INTO compatibility_history (test_ids, analysis_type, result_data) VALUES (?, ?, ?)',
        [JSON.stringify(testIds), analysisType, JSON.stringify(resultData)]
      )
      return true
    } catch (error) {
      console.error('Error saving analysis:', error)
      throw error
    }
  }

  async getAnalysisHistory(limit = 10) {
    try {
      return await this.db.all(
        'SELECT * FROM compatibility_history ORDER BY created_at DESC LIMIT ?',
        [limit]
      )
    } catch (error) {
      console.error('Error getting analysis history:', error)
      throw error
    }
  }

  // Export History Methods
  async saveExport(testIds, format, filePath = null) {
    try {
      await this.db.run(
        'INSERT INTO export_history (test_ids, export_format, file_path) VALUES (?, ?, ?)',
        [JSON.stringify(testIds), format, filePath]
      )
      return true
    } catch (error) {
      console.error('Error saving export:', error)
      throw error
    }
  }

  async getExportHistory(limit = 10) {
    try {
      return await this.db.all(
        'SELECT * FROM export_history ORDER BY created_at DESC LIMIT ?',
        [limit]
      )
    } catch (error) {
      console.error('Error getting export history:', error)
      throw error
    }
  }

  // Share History Methods
  async saveShare(testIds, method, shareData = null) {
    try {
      await this.db.run(
        'INSERT INTO share_history (test_ids, share_method, share_data) VALUES (?, ?, ?)',
        [JSON.stringify(testIds), method, shareData]
      )
      return true
    } catch (error) {
      console.error('Error saving share:', error)
      throw error
    }
  }

  async getShareHistory(limit = 10) {
    try {
      return await this.db.all(
        'SELECT * FROM share_history ORDER BY created_at DESC LIMIT ?',
        [limit]
      )
    } catch (error) {
      console.error('Error getting share history:', error)
      throw error
    }
  }

  // Statistics Methods
  async getProfileStats() {
    try {
      const stats = await this.db.get(`
        SELECT 
          COUNT(*) as total_profiles,
          COUNT(DISTINCT test_id) as unique_tests,
          MAX(created_at) as latest_profile
        FROM user_profiles
      `)
      return stats
    } catch (error) {
      console.error('Error getting profile stats:', error)
      throw error
    }
  }

  async getGlobalStats() {
    try {
      const stats = await this.db.get(`
        SELECT 
          COUNT(*) as total_results,
          COUNT(DISTINCT test_id) as total_tests,
          COUNT(DISTINCT role) as unique_roles,
          AVG(percentage) as avg_percentage
        FROM test_results
      `)
      return stats
    } catch (error) {
      console.error('Error getting global stats:', error)
      throw error
    }
  }

  async getShareStats() {
    try {
      const stats = await this.db.get(`
        SELECT 
          COUNT(*) as total_shares,
          COUNT(DISTINCT share_method) as share_methods,
          MAX(created_at) as latest_share
        FROM share_history
      `)
      return stats
    } catch (error) {
      console.error('Error getting share stats:', error)
      throw error
    }
  }

  async getAnalysisStats() {
    try {
      const stats = await this.db.get(`
        SELECT 
          COUNT(*) as total_analyses,
          COUNT(DISTINCT analysis_type) as analysis_types,
          MAX(created_at) as latest_analysis
        FROM compatibility_history
      `)
      return stats
    } catch (error) {
      console.error('Error getting analysis stats:', error)
      throw error
    }
  }

  // Search and Filter Methods
  async searchProfiles(query) {
    try {
      return await this.db.all(
        'SELECT * FROM user_profiles WHERE name LIKE ? OR test_id LIKE ? ORDER BY created_at DESC',
        [`%${query}%`, `%${query}%`]
      )
    } catch (error) {
      console.error('Error searching profiles:', error)
      throw error
    }
  }

  async getTopRoles(limit = 10) {
    try {
      return await this.db.all(`
        SELECT 
          role,
          AVG(percentage) as avg_percentage,
          COUNT(*) as test_count
        FROM test_results 
        GROUP BY role 
        ORDER BY avg_percentage DESC 
        LIMIT ?
      `, [limit])
    } catch (error) {
      console.error('Error getting top roles:', error)
      throw error
    }
  }

  async getRoleDistribution() {
    try {
      return await this.db.all(`
        SELECT 
          role,
          COUNT(*) as frequency,
          AVG(percentage) as avg_percentage
        FROM test_results 
        GROUP BY role 
        ORDER BY frequency DESC
      `)
    } catch (error) {
      console.error('Error getting role distribution:', error)
      throw error
    }
  }

  // Scenario Methods
  async saveScenario(scenario) {
    try {
      const { 
        name, 
        description, 
        roles, 
        intensity, 
        duration, 
        safety, 
        testIds, 
        isCustom = false,
        difficulty = 'intermediate',
        category = 'power-exchange',
        roleAssignments = {},
        equipment = [],
        steps = [],
        safetyLevel = 'moderate'
      } = scenario
      
      const result = await this.db.run(`
        INSERT INTO scenarios (
          name, description, roles, intensity, duration, safety, test_ids, is_custom,
          difficulty, category, role_assignments, equipment, steps, safety_level
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        name,
        description,
        JSON.stringify(roles),
        intensity,
        duration,
        JSON.stringify(safety),
        JSON.stringify(testIds),
        isCustom ? 1 : 0,
        difficulty,
        category,
        JSON.stringify(roleAssignments),
        JSON.stringify(equipment),
        JSON.stringify(steps),
        safetyLevel
      ])
      
      return result.lastID
    } catch (error) {
      console.error('Error saving scenario:', error)
      throw error
    }
  }

  async getScenarios(testIds = null) {
    try {
      let query = 'SELECT * FROM scenarios ORDER BY created_at DESC'
      let params = []
      
      if (testIds) {
        query = 'SELECT * FROM scenarios WHERE test_ids LIKE ? ORDER BY created_at DESC'
        params = [`%${testIds.join('%')}%`]
      }
      
      const scenarios = await this.db.all(query, params)
      
      // Parse JSON fields
      return scenarios.map(scenario => ({
        ...scenario,
        roles: JSON.parse(scenario.roles || '[]'),
        safety: JSON.parse(scenario.safety || '[]'),
        testIds: JSON.parse(scenario.testIds || '[]'),
        roleAssignments: JSON.parse(scenario.role_assignments || '{}'),
        equipment: JSON.parse(scenario.equipment || '[]'),
        steps: JSON.parse(scenario.steps || '[]')
      }))
    } catch (error) {
      console.error('Error getting scenarios:', error)
      throw error
    }
  }

  async getScenario(id) {
    try {
      const scenario = await this.db.get('SELECT * FROM scenarios WHERE id = ?', [id])
      
      if (scenario) {
        return {
          ...scenario,
          roles: JSON.parse(scenario.roles || '[]'),
          safety: JSON.parse(scenario.safety || '[]'),
          testIds: JSON.parse(scenario.testIds || '[]'),
          roleAssignments: JSON.parse(scenario.role_assignments || '{}'),
          equipment: JSON.parse(scenario.equipment || '[]'),
          steps: JSON.parse(scenario.steps || '[]')
        }
      }
      
      return null
    } catch (error) {
      console.error('Error getting scenario:', error)
      throw error
    }
  }

  async updateScenario(id, scenario) {
    try {
      const { 
        name, 
        description, 
        roles, 
        intensity, 
        duration, 
        safety, 
        testIds,
        difficulty,
        category,
        roleAssignments,
        equipment,
        steps,
        safetyLevel
      } = scenario
      
      await this.db.run(`
        UPDATE scenarios 
        SET name = ?, 
            description = ?, 
            roles = ?, 
            intensity = ?, 
            duration = ?, 
            safety = ?, 
            test_ids = ?, 
            difficulty = ?,
            category = ?,
            role_assignments = ?,
            equipment = ?,
            steps = ?,
            safety_level = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        name,
        description,
        JSON.stringify(roles),
        intensity,
        duration,
        JSON.stringify(safety),
        JSON.stringify(testIds),
        difficulty,
        category,
        JSON.stringify(roleAssignments),
        JSON.stringify(equipment),
        JSON.stringify(steps),
        safetyLevel,
        id
      ])
      
      return true
    } catch (error) {
      console.error('Error updating scenario:', error)
      throw error
    }
  }

  async deleteScenario(id) {
    try {
      await this.db.run('DELETE FROM scenarios WHERE id = ?', [id])
      return true
    } catch (error) {
      console.error('Error deleting scenario:', error)
      throw error
    }
  }

  async getScenarioStats() {
    try {
      const stats = await this.db.get(`
        SELECT 
          COUNT(*) as total_scenarios,
          COUNT(CASE WHEN is_custom = 1 THEN 1 END) as custom_scenarios,
          COUNT(CASE WHEN is_custom = 0 THEN 1 END) as suggested_scenarios,
          MAX(created_at) as latest_scenario
        FROM scenarios
      `)
      return stats
    } catch (error) {
      console.error('Error getting scenario stats:', error)
      throw error
    }
  }

  // Cleanup Methods
  async cleanupOldData(daysOld = 30) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      await this.db.run(
        'DELETE FROM compatibility_history WHERE created_at < ?',
        [cutoffDate.toISOString()]
      )

      await this.db.run(
        'DELETE FROM export_history WHERE created_at < ?',
        [cutoffDate.toISOString()]
      )

      await this.db.run(
        'DELETE FROM share_history WHERE created_at < ?',
        [cutoffDate.toISOString()]
      )

      console.log('✅ Cleaned up old data')
      return true
    } catch (error) {
      console.error('Error cleaning up old data:', error)
      throw error
    }
  }

  async close() {
    if (this.db) {
      await this.db.close()
      console.log('✅ Database connection closed')
    }
  }
}

export default Database
