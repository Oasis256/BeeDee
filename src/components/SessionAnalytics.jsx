import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Star, 
  Calendar, 
  Target, 
  Award,
  Activity,
  PieChart,
  LineChart,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'

const SessionAnalytics = ({ results }) => {
  const [sessionLogs, setSessionLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [timeRange, setTimeRange] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSessionLogs()
  }, [])

  useEffect(() => {
    filterLogs()
  }, [sessionLogs, timeRange, categoryFilter, difficultyFilter])

  const loadSessionLogs = () => {
    try {
      const logs = JSON.parse(localStorage.getItem('scenarioLogs') || '[]')
      setSessionLogs(logs)
    } catch (error) {
      console.error('Error loading session logs:', error)
    }
  }

  const filterLogs = () => {
    let filtered = [...sessionLogs]

    // Time range filter
    if (timeRange !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (timeRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3)
          break
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1)
          break
      }
      
      filtered = filtered.filter(log => new Date(log.timestamp) >= filterDate)
    }

    setFilteredLogs(filtered)
  }

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'week': return 'Last 7 Days'
      case 'month': return 'Last 30 Days'
      case 'quarter': return 'Last 3 Months'
      case 'year': return 'Last Year'
      default: return 'All Time'
    }
  }

  const calculateStats = () => {
    if (filteredLogs.length === 0) return {}

    const totalSessions = filteredLogs.length
    const totalDuration = filteredLogs.reduce((sum, log) => {
      const [hours, minutes, seconds] = log.duration.split(':').map(Number)
      return sum + hours * 3600 + minutes * 60 + seconds
    }, 0)
    
    const averageRating = filteredLogs.reduce((sum, log) => sum + (log.rating || 0), 0) / totalSessions
    const averageDuration = totalDuration / totalSessions

    // Category breakdown
    const categoryStats = {}
    filteredLogs.forEach(log => {
      const category = log.category || 'unknown'
      categoryStats[category] = (categoryStats[category] || 0) + 1
    })

    // Difficulty breakdown
    const difficultyStats = {}
    filteredLogs.forEach(log => {
      const difficulty = log.difficulty || 'unknown'
      difficultyStats[difficulty] = (difficultyStats[difficulty] || 0) + 1
    })

    // Rating distribution
    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    filteredLogs.forEach(log => {
      const rating = log.rating || 0
      if (rating >= 1 && rating <= 5) {
        ratingDistribution[rating]++
      }
    })

    // Weekly activity
    const weeklyActivity = {}
    filteredLogs.forEach(log => {
      const date = new Date(log.timestamp)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]
      weeklyActivity[weekKey] = (weeklyActivity[weekKey] || 0) + 1
    })

    return {
      totalSessions,
      totalDuration,
      averageRating: Math.round(averageRating * 10) / 10,
      averageDuration: Math.round(averageDuration / 60), // in minutes
      categoryStats,
      difficultyStats,
      ratingDistribution,
      weeklyActivity
    }
  }

  const stats = calculateStats()

  const exportData = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `session-analytics-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const getCategoryColor = (category) => {
    const colors = {
      'bondage': 'bg-purple-500',
      'power-exchange': 'bg-blue-500',
      'impact-play': 'bg-red-500',
      'sensory': 'bg-green-500',
      'role-play': 'bg-yellow-500',
      'caregiver': 'bg-pink-500',
      'pet-play': 'bg-indigo-500',
      'medical-play': 'bg-orange-500',
      'exhibitionism': 'bg-teal-500',
      'voyeurism': 'bg-cyan-500',
      'breath-play': 'bg-rose-500',
      'unknown': 'bg-gray-500'
    }
    return colors[category] || colors.unknown
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'bg-green-500',
      'intermediate': 'bg-yellow-500',
      'advanced': 'bg-red-500',
      'expert': 'bg-purple-500',
      'unknown': 'bg-gray-500'
    }
    return colors[difficulty] || colors.unknown
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Session Analytics</h2>
          <p className="text-purple-200">Track your BDSM exploration progress and insights</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={loadSessionLogs}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-purple-300" />
            <span className="text-purple-200 text-sm">Filters:</span>
          </div>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1 bg-white/10 border border-purple-400/20 text-white rounded text-sm focus:outline-none focus:border-purple-400"
          >
            <option value="all">All Time</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">Last Year</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1 bg-white/10 border border-purple-400/20 text-white rounded text-sm focus:outline-none focus:border-purple-400"
          >
            <option value="all">All Categories</option>
            <option value="bondage">Bondage</option>
            <option value="power-exchange">Power Exchange</option>
            <option value="impact-play">Impact Play</option>
            <option value="sensory">Sensory</option>
            <option value="role-play">Role Play</option>
            <option value="caregiver">Caregiver</option>
            <option value="pet-play">Pet Play</option>
            <option value="medical-play">Medical Play</option>
          </select>

          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="px-3 py-1 bg-white/10 border border-purple-400/20 text-white rounded text-sm focus:outline-none focus:border-purple-400"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="text-center py-12 text-purple-300">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Session Data</h3>
          <p className="text-sm opacity-75">Complete some scenarios to see your analytics here</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Activity className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-purple-300 text-sm">Total Sessions</p>
                  <p className="text-2xl font-bold text-white">{stats.totalSessions}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-purple-300 text-sm">Total Time</p>
                  <p className="text-2xl font-bold text-white">{formatDuration(stats.totalDuration)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-purple-300 text-sm">Avg Rating</p>
                  <p className="text-2xl font-bold text-white">{stats.averageRating}/5</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Target className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-purple-300 text-sm">Avg Duration</p>
                  <p className="text-2xl font-bold text-white">{stats.averageDuration}m</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Distribution */}
            <div className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Category Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.categoryStats)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getCategoryColor(category)}`}></div>
                        <span className="text-purple-200 capitalize">{category.replace('-', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getCategoryColor(category)}`}
                            style={{ width: `${(count / stats.totalSessions) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Difficulty Distribution */}
            <div className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Difficulty Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.difficultyStats)
                  .sort(([,a], [,b]) => b - a)
                  .map(([difficulty, count]) => (
                    <div key={difficulty} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getDifficultyColor(difficulty)}`}></div>
                        <span className="text-purple-200 capitalize">{difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getDifficultyColor(difficulty)}`}
                            style={{ width: `${(count / stats.totalSessions) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Rating Distribution
            </h3>
            <div className="grid grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(rating => (
                <div key={rating} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stats.ratingDistribution[rating] || 0}</div>
                  <div className="text-sm text-purple-300">sessions</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Sessions
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {filteredLogs
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, 10)
                .map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-purple-300 text-sm">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-white font-medium">{log.scenario}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-purple-300 text-sm">{log.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-purple-300 text-sm">{log.rating}/5</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}

export default SessionAnalytics
