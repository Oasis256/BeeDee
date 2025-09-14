import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Zap, Users, Search, X, Plus, BarChart3, PieChart, TrendingUp, Brain, Download, User, Activity, BarChart, ArrowUpDown, MessageCircle, Shield, FileText, GraduationCap, Moon, Sun, BookOpen, Eye } from 'lucide-react'
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
import SexPositions from './components/SexPositions'
import DebugApp from './components/DebugApp'
import CoupleProfileManager from './components/CoupleProfileManager'
import EnhancedCompatibilityAnalysis from './components/EnhancedCompatibilityAnalysis'
import CoupleCommunicationHub from './components/CoupleCommunicationHub'
import AftercareGuides from './components/AftercareGuides'
import BDSMTestEmbed from './components/BDSMTestEmbed'
import WelcomeTour from './components/WelcomeTour'
import QuickAccess from './components/QuickAccess'
import Breadcrumb from './components/Breadcrumb'
import LoadingSkeleton from './components/LoadingSkeleton'
import { FeatureHighlightManager } from './components/FeatureHighlight'
import MobileNavigation from './components/MobileNavigation'
import SmartSuggestions from './components/SmartSuggestions'
import { useHighContrast, SkipLinks } from './components/AccessibilityEnhancer'
import './styles/accessibility.css'
import apiService from './utils/api'

function App() {
  const [testIds, setTestIds] = useState([''])
  const [testEmojis, setTestEmojis] = useState(['♞']) // Default to Knight for first test
  const [testNames, setTestNames] = useState(['']) // Names for each test ID
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('results') // 'results', 'exploration', 'couple', 'safety'
  const [activeSubTab, setActiveSubTab] = useState('overview') // Sub-tab within each main tab
  const [loadingProfiles, setLoadingProfiles] = useState(false)
  const [currentCoupleProfile, setCurrentCoupleProfile] = useState(null)
  const [beginnerMode, setBeginnerMode] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [showWelcomeTour, setShowWelcomeTour] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [lastUsedTabs, setLastUsedTabs] = useState({})
  const [userActivity, setUserActivity] = useState({})
  const { isHighContrast, setIsHighContrast } = useHighContrast()

  // Load user preferences from localStorage
  useEffect(() => {
    const savedBeginnerMode = localStorage.getItem('beginnerMode')
    const savedDarkMode = localStorage.getItem('darkMode')
    const tourCompleted = localStorage.getItem('welcomeTourCompleted')
    const savedLastUsedTabs = localStorage.getItem('lastUsedTabs')
    
    if (savedBeginnerMode !== null) setBeginnerMode(JSON.parse(savedBeginnerMode))
    if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode))
    if (savedLastUsedTabs !== null) setLastUsedTabs(JSON.parse(savedLastUsedTabs))
    
    // Mobile detection
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Show welcome tour for new users or when beginner mode is first enabled
    if (!tourCompleted && beginnerMode) {
      setShowWelcomeTour(true)
    }
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('beginnerMode', JSON.stringify(beginnerMode))
  }, [beginnerMode])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('lastUsedTabs', JSON.stringify(lastUsedTabs))
  }, [lastUsedTabs])

  // Handle beginner mode toggle
  const handleBeginnerModeToggle = () => {
    const newBeginnerMode = !beginnerMode
    setBeginnerMode(newBeginnerMode)
    
    // Show welcome tour when beginner mode is first enabled
    if (newBeginnerMode && !localStorage.getItem('welcomeTourCompleted')) {
      setShowWelcomeTour(true)
    }
  }

  // Tab group configuration
  const tabGroups = {
    results: {
      name: 'Results Dashboard',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      subTabs: {
        overview: { name: 'Overview', icon: <PieChart className="w-4 h-4" /> },
        comparison: { name: 'Comparison', icon: <BarChart3 className="w-4 h-4" /> },
        analytics: { name: 'Analytics', icon: <Brain className="w-4 h-4" /> },
        export: { name: 'Export', icon: <Download className="w-4 h-4" /> }
      }
    },
    exploration: {
      name: 'Exploration Hub',
      icon: <Users className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      subTabs: {
        scenarios: { name: 'Scenarios', icon: <Zap className="w-4 h-4" /> },
        positions: { name: 'Positions', icon: <ArrowUpDown className="w-4 h-4" /> },
        community: { name: 'Community', icon: <Users className="w-4 h-4" /> }
      }
    },
    couple: {
      name: 'Couple Hub',
      icon: <Heart className="w-5 h-5" />,
      color: 'from-pink-500 to-rose-500',
      subTabs: {
        profiles: { name: 'Profiles', icon: <User className="w-4 h-4" /> },
        communication: { name: 'Communication', icon: <MessageCircle className="w-4 h-4" /> },
        tracking: { name: 'Tracking', icon: <Activity className="w-4 h-4" /> }
      }
    },
    safety: {
      name: 'Safety Center',
      icon: <Shield className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      subTabs: {
        test: { name: 'BDSM Test', icon: <FileText className="w-4 h-4" /> },
        aftercare: { name: 'Aftercare', icon: <Shield className="w-4 h-4" /> },
        education: { name: 'Education', icon: <BookOpen className="w-4 h-4" /> }
      }
    }
  }

  // Handle main tab change with smart defaults
  const handleMainTabChange = (tab) => {
    setActiveTab(tab)
    
    // Use last used sub-tab if available, otherwise use first sub-tab
    const lastUsedSubTab = lastUsedTabs[tab]
    const firstSubTab = Object.keys(tabGroups[tab].subTabs)[0]
    const targetSubTab = lastUsedSubTab || firstSubTab
    
    setActiveSubTab(targetSubTab)
    
    // Remember this tab usage
    setLastUsedTabs(prev => ({
      ...prev,
      [tab]: targetSubTab
    }))
  }

  // Handle sub-tab change with memory
  const handleSubTabChange = (subTab) => {
    setActiveSubTab(subTab)
    
    // Remember this sub-tab usage
    setLastUsedTabs(prev => ({
      ...prev,
      [activeTab]: subTab
    }))
  }

  // Navigation handler for quick access
  const handleNavigate = (tab, subTab) => {
    setActiveTab(tab)
    setActiveSubTab(subTab)
    
    // Remember this navigation
    setLastUsedTabs(prev => ({
      ...prev,
      [tab]: subTab
    }))
  }

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

  const handleCoupleProfileUpdate = (profile) => {
    setCurrentCoupleProfile(profile)
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
    <div className={`min-h-screen ${darkMode ? 'dark' : 'light-mode'} ${isHighContrast ? 'high-contrast' : ''}`}>
      <SkipLinks />
      <div className={`min-h-screen ${darkMode 
        ? 'bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900' 
        : 'bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100 text-gray-900'
      }`}>
      <style>{`
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
          {/* Mode Toggles */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={handleBeginnerModeToggle}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                beginnerMode 
                  ? 'bg-green-500/30 text-green-200 border-2 border-green-400' 
                  : darkMode 
                    ? 'bg-white/10 text-purple-200 border border-purple-300/30 hover:bg-white/20'
                    : 'bg-gray-200/50 text-gray-700 border border-gray-300 hover:bg-gray-300/50'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              {beginnerMode ? 'Beginner Mode ON' : 'Beginner Mode'}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                darkMode 
                  ? 'bg-purple-500/30 text-purple-200 border-2 border-purple-400' 
                  : 'bg-gray-200/50 text-gray-700 border border-gray-300 hover:bg-gray-300/50'
              }`}
            >
              {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              {darkMode ? 'Dark Mode' : 'Light Mode'}
            </button>
            <button
              onClick={() => setIsHighContrast(!isHighContrast)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isHighContrast 
                  ? 'bg-yellow-500/30 text-yellow-200 border-2 border-yellow-400' 
                  : darkMode 
                    ? 'bg-white/10 text-purple-200 border border-purple-300/30 hover:bg-white/20'
                    : 'bg-gray-200/50 text-gray-700 border border-gray-300 hover:bg-gray-300/50'
              }`}
            >
              <Eye className="w-4 h-4" />
              {isHighContrast ? 'High Contrast ON' : 'High Contrast'}
            </button>
          </div>

          <motion.h1 
            className={`text-5xl md:text-7xl font-bold mb-4 sparkle ${darkMode ? 'text-white' : 'text-gray-900'}`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔥 Compatibility Checker 🔥
          </motion.h1>
          <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-purple-200' : 'text-gray-600'}`}>
            Compare your results with friends and partners in a fun, playful way! 
            <span className="inline-block ml-2 animate-bounce-slow">💕</span>
          </p>
          
          {/* Beginner Mode Info */}
          {beginnerMode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 max-w-3xl mx-auto bg-green-500/20 border border-green-400/30 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-green-400" />
                <h3 className="text-green-200 font-semibold">Beginner Mode Active</h3>
              </div>
              <p className="text-green-100 text-sm">
                You're in beginner mode! This means you'll see extra explanations, safety tips, and beginner-friendly content throughout the app. 
                Perfect for those new to BDSM exploration.
              </p>
              <button
                onClick={() => setShowWelcomeTour(true)}
                className="mt-3 px-4 py-2 bg-green-500/30 hover:bg-green-500/40 text-green-200 rounded-lg transition-colors text-sm font-medium"
              >
                🎯 Take a Quick Tour
              </button>
            </motion.div>
          )}
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
            {/* Main Tab Navigation */}
            <div className="glass-effect rounded-2xl p-2 mb-6">
              <div className="flex gap-2 overflow-x-auto custom-scrollbar">
                {Object.entries(tabGroups).map(([tabKey, tabConfig]) => (
                <button
                    key={tabKey}
                    onClick={() => handleMainTabChange(tabKey)}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all whitespace-nowrap ${
                      activeTab === tabKey
                        ? `bg-gradient-to-r ${tabConfig.color} text-white shadow-lg`
                      : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                    {tabConfig.icon}
                    {tabConfig.name}
                </button>
                ))}
              </div>
            </div>

            {/* Breadcrumb Navigation */}
            <Breadcrumb
              currentTab={activeTab}
              currentSubTab={activeSubTab}
              tabGroups={tabGroups}
              onNavigate={handleNavigate}
              beginnerMode={beginnerMode}
            />

            {/* Sub Tab Navigation */}
            {results.length > 0 && (
              <div className="glass-effect rounded-xl p-2 mb-6">
                <div className="flex gap-1 overflow-x-auto custom-scrollbar">
                  {Object.entries(tabGroups[activeTab].subTabs).map(([subTabKey, subTabConfig]) => (
                <button
                      key={subTabKey}
                      onClick={() => handleSubTabChange(subTabKey)}
                      className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                        activeSubTab === subTabKey
                          ? `bg-gradient-to-r ${tabGroups[activeTab].color} text-white shadow-md`
                      : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                      {subTabConfig.icon}
                      {subTabConfig.name}
                </button>
                  ))}
                </div>
              </div>
            )}

            {/* Smart Suggestions */}
            <SmartSuggestions
              results={results}
              currentTab={activeTab}
              currentSubTab={activeSubTab}
              beginnerMode={beginnerMode}
              onNavigate={handleNavigate}
              userActivity={userActivity}
            />

            {/* Tab Content */}
            {activeTab === 'results' && (
              <>
                {activeSubTab === 'overview' && (
                  <>
                    <BDSMResults results={results} beginnerMode={beginnerMode} />
                    <PercentageBreakdown results={results} beginnerMode={beginnerMode} />
                  </>
                )}
                {activeSubTab === 'comparison' && (
                  <ComparisonGraph results={results} beginnerMode={beginnerMode} />
                )}
                {activeSubTab === 'analytics' && (
                  <>
                    <AdvancedAnalysis results={results} beginnerMode={beginnerMode} />
                    <EnhancedCompatibilityAnalysis 
                      coupleProfile={currentCoupleProfile} 
                      partner1Results={results[0]} 
                      partner2Results={results[1]} 
                      beginnerMode={beginnerMode}
                    />
                    <SessionAnalytics results={results} beginnerMode={beginnerMode} />
                  </>
                )}
                {activeSubTab === 'export' && (
                  <ExportResults results={results} beginnerMode={beginnerMode} />
                )}
              </>
            )}

            {activeTab === 'exploration' && (
              <>
                {activeSubTab === 'scenarios' && (
                  <>
                    <ScenarioBuilder results={results} beginnerMode={beginnerMode} />
                    <CompatibilityScore results={results} beginnerMode={beginnerMode} />
                    <RoleCompatibilityMatrix results={results} beginnerMode={beginnerMode} />
                    <SmartRecommendations results={results} beginnerMode={beginnerMode} />
                    <RadarChart results={results} beginnerMode={beginnerMode} />
                    <SharedInterests results={results} beginnerMode={beginnerMode} />
                  </>
                )}
                {activeSubTab === 'positions' && (
                  <>
                    <PositionPreferences results={results} beginnerMode={beginnerMode} />
                    <SexPositions results={results} beginnerMode={beginnerMode} />
                  </>
                )}
                {activeSubTab === 'community' && (
                  <CommunityScenarios results={results} beginnerMode={beginnerMode} />
                )}
              </>
            )}

            {activeTab === 'couple' && (
              <>
                {activeSubTab === 'profiles' && (
                  <>
                    <CoupleProfileManager 
                      onProfileUpdate={handleCoupleProfileUpdate}
                      currentProfile={currentCoupleProfile}
                      beginnerMode={beginnerMode}
                    />
                    <UserProfiles results={results} beginnerMode={beginnerMode} />
                  </>
                )}
                {activeSubTab === 'communication' && (
                  <CoupleCommunicationHub 
                    coupleProfile={currentCoupleProfile}
                    onProfileUpdate={handleCoupleProfileUpdate}
                    beginnerMode={beginnerMode}
                  />
                )}
                {activeSubTab === 'tracking' && (
                  <SessionAnalytics results={results} beginnerMode={beginnerMode} />
                )}
              </>
            )}

            {activeTab === 'safety' && (
              <>
                {activeSubTab === 'test' && (
                  <BDSMTestEmbed 
                    beginnerMode={beginnerMode}
                    onTestComplete={(testResults) => {
                      // Add the test results to the existing results
                      const newResults = [...results, {
                        id: testResults[0]?.role || 'Custom Test',
                        results: testResults,
                        success: true,
                        timestamp: new Date().toISOString(),
                        dataSource: 'custom'
                      }];
                      setResults(newResults);
                      // Switch to results overview to show the new results
                      setActiveTab('results');
                      setActiveSubTab('overview');
                    }}
                    onTestIdGenerated={(testId) => {
                      // Add the test ID to the existing test IDs
                      const newTestIds = [...testIds, testId];
                      setTestIds(newTestIds);
                    }}
                  />
                )}
                {activeSubTab === 'aftercare' && (
                  <AftercareGuides beginnerMode={beginnerMode} />
                )}
                {activeSubTab === 'education' && (
                  <AftercareGuides beginnerMode={beginnerMode} />
                )}
              </>
            )}
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

      {/* Welcome Tour */}
      <WelcomeTour 
        isOpen={showWelcomeTour}
        onClose={() => setShowWelcomeTour(false)}
        beginnerMode={beginnerMode}
      />

      {/* Mobile Navigation */}
      <MobileNavigation
        tabGroups={tabGroups}
        activeTab={activeTab}
        activeSubTab={activeSubTab}
        onNavigate={handleNavigate}
        isMobile={isMobile}
      />

      {/* Quick Access */}
      <QuickAccess
        results={results}
        onNavigate={handleNavigate}
        beginnerMode={beginnerMode}
        currentTab={activeTab}
        currentSubTab={activeSubTab}
      />

      {/* Feature Highlights */}
      <FeatureHighlightManager
        beginnerMode={beginnerMode}
        currentTab={activeTab}
        currentSubTab={activeSubTab}
        onNavigate={handleNavigate}
        results={results}
      />
      </div>
    </div>
  )
}

export default App
