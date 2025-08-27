import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Zap, Users, Search, X, Plus, BarChart3, PieChart, TrendingUp, Brain, Download, User, Activity, BarChart, ArrowUpDown } from 'lucide-react'
import BDSMResults from './components/BDSMResults'
import ComparisonGraph from './components/ComparisonGraph'
import PercentageBreakdown from './components/PercentageBreakdown'
import SharedInterests from './components/SharedInterests'
import CompatibilityScore from './components/CompatibilityScore'
import RoleCompatibilityMatrix from './components/RoleCompatibilityMatrix'
import SmartRecommendations from './components/SmartRecommendations'
import RadarChart from './components/RadarChart'
import ScenarioBuilder from './components/ScenarioBuilder'
import AdvancedAnalysis from './components/AdvancedAnalysis'
import ExportResults from './components/ExportResults'
import UserProfiles from './components/UserProfiles'
import SessionAnalytics from './components/SessionAnalytics'
import CommunityScenarios from './components/CommunityScenarios'
import PositionPreferences from './components/PositionPreferences'
import apiService from './utils/api'

function App() {
  const [testIds, setTestIds] = useState([''])
  const [testEmojis, setTestEmojis] = useState(['♞']) // Default to Knight for first test
  const [testNames, setTestNames] = useState(['']) // Names for each test ID
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('detailed') // 'detailed', 'comparison', 'breakdown', 'shared', 'advanced', 'export', 'profiles', 'analytics', 'community', 'positions'
  const [loadingProfiles, setLoadingProfiles] = useState(false)

  const addTestId = () => {
    setTestIds([...testIds, ''])
    // Cycle through emojis: Knight, Peacock, Pussy Cat
    const emojis = ['♞', '🦚', '🐱']
    const nextEmoji = emojis[testEmojis.length % emojis.length]
    setTestEmojis([...testEmojis, nextEmoji])
    setTestNames([...testNames, '']) // Add empty name for new test
  }

  const removeTestId = (index) => {
    const newTestIds = testIds.filter((_, i) => i !== index)
    const newTestEmojis = testEmojis.filter((_, i) => i !== index)
    const newTestNames = testNames.filter((_, i) => i !== index)
    setTestIds(newTestIds)
    setTestEmojis(newTestEmojis)
    setTestNames(newTestNames)
  }

  const updateTestId = (index, value) => {
    const newTestIds = [...testIds]
    newTestIds[index] = value
    setTestIds(newTestIds)
  }

  const updateTestEmoji = (index, emoji) => {
    const newTestEmojis = [...testEmojis]
    newTestEmojis[index] = emoji
    setTestEmojis(newTestEmojis)
  }

  const updateTestName = (index, name) => {
    const newTestNames = [...testNames]
    newTestNames[index] = name
    setTestNames(newTestNames)
  }

  const loadFavorites = async () => {
    setLoadingProfiles(true)
    setError('')
    
    try {
      const response = await apiService.getFavorites()
      const favorites = response.favorites || []
      
      if (favorites.length === 0) {
        setError('No favorites found. Add some profiles to favorites first!')
        setLoadingProfiles(false)
        return
      }

      // Clear current inputs and results
      setTestIds([''])
      setTestEmojis(['♞'])
      setTestNames([''])
      setResults([])

      // Load favorites into the form
      const newTestIds = []
      const newTestEmojis = []
      const newTestNames = []
      
      for (const favorite of favorites) {
        newTestIds.push(favorite.test_id)
        newTestEmojis.push(favorite.emoji)
        newTestNames.push(favorite.name)
      }
      
      setTestIds(newTestIds)
      setTestEmojis(newTestEmojis)
      setTestNames(newTestNames)

      // Now fetch the stored results for all favorites
      const resultsData = await Promise.all(
        newTestIds.map(async (id, index) => {
          try {
            const result = await apiService.fetchTestResults(id.trim())
            // Add the selected emoji and name to the result
            result.selectedEmoji = newTestEmojis[index]
            result.testName = newTestNames[index] || `Test ${index + 1}`
            return result
          } catch (err) {
            console.error(`Error fetching results for ${id}:`, err)
            return { id, error: `Failed to fetch results for ${id}`, selectedEmoji: newTestEmojis[index] }
          }
        })
      )

      setResults(resultsData)
      
    } catch (err) {
      setError('Failed to load favorites. Please try again.')
      console.error('Error loading favorites:', err)
    } finally {
      setLoadingProfiles(false)
    }
  }

  const fetchResults = async () => {
    setLoading(true)
    setError('')
    
    try {
      const validIds = testIds.filter(id => id.trim() !== '')
      if (validIds.length === 0) {
        setError('Please enter at least one test ID')
        setLoading(false)
        return
      }

      const resultsData = await Promise.all(
        validIds.map(async (id, index) => {
          try {
            const result = await apiService.fetchTestResults(id.trim())
            // Add the selected emoji and name to the result
            result.selectedEmoji = testEmojis[index]
            result.testName = testNames[index] || `Test ${index + 1}` // Use name or default
            
            // Save profile if name is provided
            if (testNames[index] && testNames[index].trim()) {
              try {
                await apiService.createProfile(testNames[index].trim(), id.trim(), testEmojis[index])
              } catch (profileError) {
                console.log('Could not save profile:', profileError.message)
              }
            }
            
            return result
          } catch (err) {
            console.error(`Error fetching results for ${id}:`, err)
            return { id, error: `Failed to fetch results for ${id}`, selectedEmoji: testEmojis[index] }
          }
        })
      )

      setResults(resultsData)
    } catch (err) {
      setError('Failed to fetch results. Please check your test IDs and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .dark-dropdown {
          background-color: rgba(31, 41, 55, 0.9);
          border: 1px solid rgba(168, 85, 247, 0.2);
          color: white;
        }
        .dark-dropdown option {
          background-color: rgba(31, 41, 55, 0.95);
          color: white;
          padding: 8px 12px;
        }
        .dark-dropdown option:hover {
          background-color: rgba(168, 85, 247, 0.2);
        }
        .dark-dropdown:focus {
          outline: none;
          border-color: rgba(168, 85, 247, 0.5);
          box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.1);
        }
      `}</style>
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center py-8"
      >
        <div className="container mx-auto px-4">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-4 sparkle"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔥 Compatibility Checker 🔥
          </motion.h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Compare your results with friends and partners in a fun, playful way! 
            <span className="inline-block ml-2 animate-bounce-slow">💕</span>
          </p>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        {/* Input Section */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Users className="text-purple-300 w-6 h-6" />
            <h2 className="text-2xl font-bold text-white">Enter Test IDs</h2>
          </div>

          <div className="space-y-4">
            {testIds.map((id, index) => (
              <div key={index} className="space-y-3">
                {/* Test Name Input */}
                <div className="flex gap-3">
                  {/* Emoji Selection */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateTestEmoji(index, '♞')}
                      className={`px-3 py-3 rounded-lg transition-all ${
                        testEmojis[index] === '♞' 
                          ? 'bg-purple-500/30 border-2 border-purple-400 text-white' 
                          : 'bg-white/10 border border-purple-300/30 text-purple-200 hover:bg-white/20'
                      }`}
                      title="Knight"
                    >
                      <span className="text-xl">♞</span>
                    </button>
                    <button
                      onClick={() => updateTestEmoji(index, '🦚')}
                      className={`px-3 py-3 rounded-lg transition-all ${
                        testEmojis[index] === '🦚' 
                          ? 'bg-purple-500/30 border-2 border-purple-400 text-white' 
                          : 'bg-white/10 border border-purple-300/30 text-purple-200 hover:bg-white/20'
                      }`}
                      title="Peacock"
                    >
                      <span className="text-xl">🦚</span>
                    </button>
                    <button
                      onClick={() => updateTestEmoji(index, '🐱')}
                      className={`px-3 py-3 rounded-lg transition-all ${
                        testEmojis[index] === '🐱' 
                          ? 'bg-purple-500/30 border-2 border-purple-400 text-white' 
                          : 'bg-white/10 border border-purple-300/30 text-purple-200 hover:bg-white/20'
                      }`}
                      title="Pussy Cat"
                    >
                      <span className="text-xl">🐱</span>
                    </button>
                  </div>
                  
                  {/* Test Name Input */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={testNames[index]}
                      onChange={(e) => updateTestName(index, e.target.value)}
                      placeholder="Name (e.g., Me, Partner, Friend)"
                      className="w-full px-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Remove Button */}
                  {testIds.length > 1 && (
                    <button
                      onClick={() => removeTestId(index)}
                      className="px-3 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                {/* Test ID Input */}
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                    <input
                      type="text"
                      value={id}
                      onChange={(e) => updateTestId(index, e.target.value)}
                      placeholder="Enter BDSMTest.org ID (e.g., KTkXzPSn)"
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex gap-3">
              <button
                onClick={addTestId}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Another Test ID
              </button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={loadFavorites}
                disabled={loadingProfiles}
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-200 rounded-lg transition-colors disabled:opacity-50"
              >
                {loadingProfiles ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-200"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4" />
                    Load Favorites
                  </>
                )}
              </motion.button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchResults}
            disabled={loading}
            className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Fetching Results...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Compare Results
              </>
            )}
          </motion.button>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500/20 border border-red-400/30 rounded-lg text-red-200"
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {/* Results Section */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Tab Navigation */}
            <div className="glass-effect rounded-2xl p-2 mb-6">
              <div className="flex gap-2 overflow-x-auto custom-scrollbar">
                <button
                  onClick={() => setActiveTab('detailed')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === 'detailed'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <PieChart className="w-5 h-5" />
                  Detailed Results
                </button>
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === 'comparison'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  Side-by-Side Graph
                </button>
                <button
                  onClick={() => setActiveTab('breakdown')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === 'breakdown'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <TrendingUp className="w-5 h-5" />
                  Percentage Breakdown
                </button>
                <button
                  onClick={() => setActiveTab('shared')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === 'shared'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  Shared Interests
                </button>
                <button
                  onClick={() => setActiveTab('advanced')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === 'advanced'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Brain className="w-5 h-5" />
                  Advanced Analysis
                </button>
                <button
                  onClick={() => setActiveTab('export')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === 'export'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Download className="w-5 h-5" />
                  Export Results
                </button>
                <button
                  onClick={() => setActiveTab('profiles')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === 'profiles'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <User className="w-5 h-5" />
                  User Profiles
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === 'analytics'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <BarChart className="w-5 h-5" />
                  Session Analytics
                </button>
                <button
                  onClick={() => setActiveTab('positions')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === 'positions'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ArrowUpDown className="w-5 h-5" />
                  Positions
                </button>
                <button
                  onClick={() => setActiveTab('community')}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === 'community'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  Community
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'detailed' ? (
              <BDSMResults results={results} />
            ) : activeTab === 'comparison' ? (
              <ComparisonGraph results={results} />
            ) : activeTab === 'breakdown' ? (
              <PercentageBreakdown results={results} />
            ) : activeTab === 'shared' ? (
              <>
                <CompatibilityScore results={results} />
                <RoleCompatibilityMatrix results={results} />
                <SmartRecommendations results={results} />
                <RadarChart results={results} />
                <ScenarioBuilder results={results} />
                <SharedInterests results={results} />
              </>
            ) : activeTab === 'advanced' ? (
              <AdvancedAnalysis results={results} />
            ) : activeTab === 'export' ? (
              <ExportResults results={results} />
            ) : activeTab === 'profiles' ? (
              <UserProfiles results={results} />
            ) : activeTab === 'analytics' ? (
              <SessionAnalytics results={results} />
            ) : activeTab === 'positions' ? (
              <PositionPreferences results={results} />
            ) : activeTab === 'community' ? (
              <CommunityScenarios results={results} />
            ) : null}
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-purple-200">
        <p className="text-sm">
          Made with <Heart className="inline w-4 h-4 text-red-400" /> for fun and exploration
        </p>
        <p className="text-xs mt-2 opacity-70">
          This app fetches public results from BDSMTest.org. Please respect privacy and consent.
        </p>
      </footer>
    </div>
  )
}

export default App
