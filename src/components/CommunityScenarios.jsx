import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Share2, Heart, Star, Download, Upload, Search, Filter, TrendingUp, Clock, Eye, ThumbsUp, MessageCircle, Bookmark, AlertCircle } from 'lucide-react'
import apiService from '../utils/api'

const CommunityScenarios = ({ results }) => {
  const [communityScenarios, setCommunityScenarios] = useState([])
  const [filteredScenarios, setFilteredScenarios] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [showUpload, setShowUpload] = useState(false)
  const [uploadScenario, setUploadScenario] = useState({
    name: '',
    description: '',
    category: 'power-exchange',
    difficulty: 'beginner',
    intensity: 'medium',
    duration: 'medium',
    safetyLevel: 'moderate',
    tags: [],
    instructions: '',
    equipment: [],
    safetyNotes: ''
  })

  useEffect(() => {
    loadCommunityScenarios()
  }, [])

  useEffect(() => {
    filterAndSortScenarios()
  }, [communityScenarios, searchTerm, categoryFilter, difficultyFilter, sortBy])

  const loadCommunityScenarios = async () => {
    try {
      setLoading(true)
      const response = await apiService.getCommunityScenarios()
      if (response.success) {
        setCommunityScenarios(response.scenarios)
      }
    } catch (error) {
      console.error('Error loading community scenarios:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortScenarios = () => {
    let filtered = [...communityScenarios]

    if (searchTerm) {
      filtered = filtered.filter(scenario => 
        scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scenario.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(scenario => scenario.category === categoryFilter)
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(scenario => scenario.difficulty === difficultyFilter)
    }

    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0))
        break
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'rating':
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        break
    }

    setFilteredScenarios(filtered)
  }

  const handleLike = async (scenarioId) => {
    try {
      const response = await apiService.likeScenario(scenarioId)
      if (response.success) {
        setCommunityScenarios(prev => prev.map(s => 
          s.id === scenarioId 
            ? { ...s, likes: (s.likes || 0) + 1, isLiked: true }
            : s
        ))
      }
    } catch (error) {
      console.error('Error liking scenario:', error)
    }
  }

  const handleDownload = async (scenarioId) => {
    try {
      const response = await apiService.downloadScenario(scenarioId)
      if (response.success) {
        setCommunityScenarios(prev => prev.map(s => 
          s.id === scenarioId 
            ? { ...s, downloads: (s.downloads || 0) + 1 }
            : s
        ))
      }
    } catch (error) {
      console.error('Error downloading scenario:', error)
    }
  }

  const handleUpload = async () => {
    if (!uploadScenario.name.trim() || !uploadScenario.description.trim()) {
      return
    }

    try {
      setLoading(true)
      const response = await apiService.uploadScenario(uploadScenario)
      if (response.success) {
        setCommunityScenarios(prev => [response.scenario, ...prev])
        setShowUpload(false)
        setUploadScenario({
          name: '',
          description: '',
          category: 'power-exchange',
          difficulty: 'beginner',
          intensity: 'medium',
          duration: 'medium',
          safetyLevel: 'moderate',
          tags: [],
          instructions: '',
          equipment: [],
          safetyNotes: ''
        })
      }
    } catch (error) {
      console.error('Error uploading scenario:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'bg-green-500',
      'intermediate': 'bg-yellow-500',
      'advanced': 'bg-red-500',
      'expert': 'bg-purple-500'
    }
    return colors[difficulty] || 'bg-gray-500'
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
      'medical-play': 'bg-orange-500'
    }
    return colors[category] || 'bg-gray-500'
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
          <h2 className="text-2xl font-bold text-white mb-2">Community Scenarios</h2>
          <p className="text-purple-200">Discover and share BDSM scenarios with the community</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Share Scenario
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search scenarios..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-purple-400/20 text-white rounded-lg focus:outline-none focus:border-purple-400"
              />
            </div>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-purple-400/20 text-white rounded-lg focus:outline-none focus:border-purple-400"
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
            className="px-3 py-2 bg-white/10 border border-purple-400/20 text-white rounded-lg focus:outline-none focus:border-purple-400"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-purple-400/20 text-white rounded-lg focus:outline-none focus:border-purple-400"
          >
            <option value="popular">Most Popular</option>
            <option value="recent">Most Recent</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Scenarios Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
        </div>
      ) : filteredScenarios.length === 0 ? (
        <div className="text-center py-12 text-purple-300">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No scenarios found</h3>
          <p className="text-sm opacity-75">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScenarios.map((scenario) => (
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-6 hover:bg-gray-800/70 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{scenario.name}</h3>
                  <p className="text-sm text-purple-200 line-clamp-2">{scenario.description}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(scenario.category)} text-white`}>
                  {scenario.category.replace('-', ' ')}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${getDifficultyColor(scenario.difficulty)} text-white`}>
                  {scenario.difficulty}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-purple-300 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{scenario.likes || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{scenario.averageRating?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{scenario.downloads || 0}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleLike(scenario.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    scenario.isLiked
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-700 text-purple-200 hover:bg-gray-600'
                  }`}
                >
                  <Heart className="w-4 h-4" />
                  {scenario.isLiked ? 'Liked' : 'Like'}
                </button>
                <button
                  onClick={() => handleDownload(scenario.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowUpload(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 border border-purple-400/30 rounded-lg p-6 max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Share Scenario</h3>
              <button
                onClick={() => setShowUpload(false)}
                className="text-purple-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 text-sm mb-2">Scenario Name</label>
                <input
                  type="text"
                  value={uploadScenario.name}
                  onChange={(e) => setUploadScenario({ ...uploadScenario, name: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/10 border border-purple-400/20 text-white focus:outline-none focus:border-purple-400"
                  placeholder="Enter scenario name..."
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm mb-2">Description</label>
                <textarea
                  value={uploadScenario.description}
                  onChange={(e) => setUploadScenario({ ...uploadScenario, description: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/10 border border-purple-400/20 text-white focus:outline-none focus:border-purple-400 resize-none"
                  rows="3"
                  placeholder="Describe the scenario..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-200 text-sm mb-2">Category</label>
                  <select
                    value={uploadScenario.category}
                    onChange={(e) => setUploadScenario({ ...uploadScenario, category: e.target.value })}
                    className="w-full p-3 rounded-lg bg-white/10 border border-purple-400/20 text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="bondage">Bondage</option>
                    <option value="power-exchange">Power Exchange</option>
                    <option value="impact-play">Impact Play</option>
                    <option value="sensory">Sensory</option>
                    <option value="role-play">Role Play</option>
                    <option value="caregiver">Caregiver</option>
                    <option value="pet-play">Pet Play</option>
                    <option value="medical-play">Medical Play</option>
                  </select>
                </div>

                <div>
                  <label className="block text-purple-200 text-sm mb-2">Difficulty</label>
                  <select
                    value={uploadScenario.difficulty}
                    onChange={(e) => setUploadScenario({ ...uploadScenario, difficulty: e.target.value })}
                    className="w-full p-3 rounded-lg bg-white/10 border border-purple-400/20 text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpload(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={loading || !uploadScenario.name.trim() || !uploadScenario.description.trim()}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Uploading...' : 'Share Scenario'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default CommunityScenarios
