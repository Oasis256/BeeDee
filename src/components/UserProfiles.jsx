import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Edit, Trash2, Plus, Search, Star, Clock, Activity, Settings, Heart } from 'lucide-react'
import apiService from '../utils/api'

const UserProfiles = ({ results }) => {
  const [profiles, setProfiles] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [editingProfile, setEditingProfile] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProfile, setNewProfile] = useState({ name: '', testId: '', emoji: '♞' })
  const [stats, setStats] = useState(null)
  const [profileResults, setProfileResults] = useState({})
  const [loadingStatus, setLoadingStatus] = useState('')

  useEffect(() => {
    loadProfiles()
    loadFavorites()
    loadStats()
  }, [])

  useEffect(() => {
    // Auto-load all profile results when profiles are loaded
    if (profiles.length > 0 && Object.keys(profileResults).length === 0) {
      loadAllProfileResults()
    }
  }, [profiles])

  useEffect(() => {
    // Load results for profiles that aren't currently loaded
    loadMissingProfileResults()
  }, [profiles, results])

  const loadProfiles = async () => {
    setLoading(true)
    try {
      const response = await apiService.getAllProfiles()
      setProfiles(response.profiles || [])
    } catch (error) {
      console.error('Error loading profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFavorites = async () => {
    try {
      const response = await apiService.getFavorites()
      setFavorites(response.favorites || [])
    } catch (error) {
      console.error('Error loading favorites:', error)
    }
  }

  const loadStats = async () => {
    try {
      const [profileStats, globalStats] = await Promise.all([
        apiService.getProfileStats(),
        apiService.getGlobalStats()
      ])
      setStats({
        profiles: profileStats.stats,
        global: globalStats.stats
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadAllProfileResults = async () => {
    if (profiles.length === 0) return
    
    setLoading(true)
    setLoadingStatus('Loading profile results...')
    try {
      const newResults = { ...profileResults }
      let loadedCount = 0
      
      for (const profile of profiles) {
        setLoadingStatus(`Loading ${profile.name} (${loadedCount + 1}/${profiles.length})...`)
        try {
          const result = await apiService.fetchTestResults(profile.test_id)
          if (result && result.results) {
            newResults[profile.test_id] = result.results
            loadedCount++
          }
        } catch (error) {
          console.error(`Error loading results for ${profile.test_id}:`, error)
        }
      }
      
      setProfileResults(newResults)
      setLoadingStatus(`Loaded ${loadedCount} of ${profiles.length} profiles`)
    } catch (error) {
      console.error('Error loading all profile results:', error)
      setLoadingStatus('Error loading profiles')
    } finally {
      setLoading(false)
      setTimeout(() => setLoadingStatus(''), 2000)
    }
  }

  const loadMissingProfileResults = async () => {
    if (profiles.length === 0) return
    
    const loadedTestIds = Object.keys(profileResults)
    const missingProfiles = profiles.filter(profile => !loadedTestIds.includes(profile.test_id))
    
    if (missingProfiles.length === 0) return
    
    try {
      const newResults = { ...profileResults }
      
      for (const profile of missingProfiles) {
        try {
          const result = await apiService.fetchTestResults(profile.test_id)
          if (result && result.results) {
            newResults[profile.test_id] = result.results
          }
        } catch (error) {
          console.error(`Error loading results for ${profile.test_id}:`, error)
        }
      }
      
      setProfileResults(newResults)
    } catch (error) {
      console.error('Error loading missing profile results:', error)
    }
  }

  const handleAddProfile = async () => {
    if (!newProfile.name.trim() || !newProfile.testId.trim()) {
      return
    }

    try {
      await apiService.createProfile(newProfile.name, newProfile.testId, newProfile.emoji)
      setNewProfile({ name: '', testId: '', emoji: '♞' })
      setShowAddForm(false)
      loadProfiles()
      loadStats()
    } catch (error) {
      console.error('Error adding profile:', error)
    }
  }

  const handleUpdateProfile = async () => {
    if (!editingProfile.name.trim()) {
      return
    }

    try {
      await apiService.updateProfile(editingProfile.test_id, editingProfile.name, editingProfile.emoji)
      setEditingProfile(null)
      loadProfiles()
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleDeleteProfile = async (testId) => {
    if (!confirm('Are you sure you want to delete this profile?')) {
      return
    }

    try {
      await apiService.deleteProfile(testId)
      loadProfiles()
      loadStats()
    } catch (error) {
      console.error('Error deleting profile:', error)
    }
  }

  const handleToggleFavorite = async (testId, name, emoji) => {
    try {
      const isFavorite = favorites.some(fav => fav.test_id === testId)
      if (isFavorite) {
        await apiService.removeFavorite(testId)
      } else {
        await apiService.addFavorite(testId, name, emoji)
      }
      loadFavorites()
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const filteredProfiles = profiles.filter(profile =>
    profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.test_id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getProfileResults = (testId) => {
    // First check current results
    const currentResult = results.find(result => result.id === testId)
    if (currentResult) {
      return currentResult
    }
    
    // Then check profile results
    const profileResult = profileResults[testId]
    if (profileResult) {
      return { id: testId, results: profileResult }
    }
    
    return null
  }

  const getTopRoles = (testId) => {
    const result = getProfileResults(testId)
    if (!result || !result.results) return []
    return result.results.slice(0, 3)
  }

  const calculateCompatibility = (profile1, profile2) => {
    const result1 = getProfileResults(profile1.test_id)
    const result2 = getProfileResults(profile2.test_id)
    
    if (!result1 || !result2) return null
    
    const roles = ['Submissive', 'Dominant', 'Switch', 'Voyeur', 'Exhibitionist', 'Masochist', 'Sadist']
    let totalCompatibility = 0
    let validRoles = 0
    
    roles.forEach(role => {
      const role1 = result1.results.find(r => r.role === role)
      const role2 = result2.results.find(r => r.role === role)
      
      if (role1 && role2) {
        validRoles++
        let compatibility = 0
        
        // Complementary roles (e.g., Submissive + Dominant)
        if ((role === 'Submissive' && role2.percentage > 70) || (role === 'Dominant' && role1.percentage > 70)) {
          compatibility = Math.min(role1.percentage, role2.percentage) * 0.8
        }
        // Similar roles (e.g., both Switch)
        else if (Math.abs(role1.percentage - role2.percentage) < 20) {
          compatibility = (role1.percentage + role2.percentage) / 2
        }
        // Neutral compatibility
        else {
          compatibility = (role1.percentage + role2.percentage) / 2 * 0.6
        }
        
        totalCompatibility += compatibility
      }
    })
    
    return validRoles > 0 ? Math.round(totalCompatibility / validRoles) : null
  }

  const getCompatibilityWithCurrent = (profile) => {
    if (results.length === 0) return null
    
    const currentProfiles = results.map(result => ({
      test_id: result.id,
      name: result.testName || result.id
    }))
    
    let totalCompatibility = 0
    let validComparisons = 0
    
    currentProfiles.forEach(currentProfile => {
      const compatibility = calculateCompatibility(profile, currentProfile)
      if (compatibility !== null) {
        totalCompatibility += compatibility
        validComparisons++
      }
    })
    
    return validComparisons > 0 ? Math.round(totalCompatibility / validComparisons) : null
  }

  const getCompatibilityColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    if (score >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const getEmojiOptions = () => {
    return ['♞', '🦚', '🐱', '⭐', '💖', '🔥', '🌙', '☀️', '🌸', '🍀', '🎭', '🎪', '🎨', '🎵', '🎮', '📚', '🏆', '💎', '🌟', '✨']
  }

  if (loading) {
    return (
      <div className="glass-effect rounded-2xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p className="text-purple-200">{loadingStatus || 'Loading profiles and results...'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <User className="w-6 h-6 text-purple-300" />
            <h2 className="text-2xl font-bold text-white">User Profiles</h2>
          </div>
                     <div className="flex gap-2">
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={loadAllProfileResults}
               className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-200 rounded-lg transition-colors"
             >
               <Activity className="w-4 h-4" />
               Load All Profiles
             </motion.button>
             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onClick={() => setShowAddForm(true)}
               className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-lg transition-colors"
             >
               <Plus className="w-4 h-4" />
               Add Profile
             </motion.button>
           </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-purple-500/20 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.profiles?.total_profiles || 0}</div>
              <div className="text-purple-200 text-sm">Total Profiles</div>
            </div>
            <div className="text-center p-4 bg-green-500/20 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.global?.total_tests || 0}</div>
              <div className="text-green-200 text-sm">Tests Analyzed</div>
            </div>
            <div className="text-center p-4 bg-blue-500/20 rounded-lg">
              <div className="text-2xl font-bold text-white">{favorites.length}</div>
              <div className="text-blue-200 text-sm">Favorites</div>
            </div>
            <div className="text-center p-4 bg-yellow-500/20 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.global?.unique_roles || 0}</div>
              <div className="text-yellow-200 text-sm">Unique Roles</div>
            </div>
          </div>
        )}

                 {/* Search Bar */}
         <div className="relative">
           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
           <input
             type="text"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             placeholder="Search profiles by name or test ID..."
             className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
           />
         </div>

         {/* Loading Status */}
         {loadingStatus && !loading && (
           <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
               <span className="text-green-200 text-sm">{loadingStatus}</span>
             </div>
           </div>
         )}
      </div>

      {/* Add Profile Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-effect rounded-2xl p-6"
          >
            <h3 className="text-lg font-semibold text-purple-200 mb-4">Add New Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-purple-200 text-sm mb-2">Name</label>
                <input
                  type="text"
                  value={newProfile.name}
                  onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  placeholder="Enter name"
                  className="w-full px-4 py-2 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-purple-200 text-sm mb-2">Test ID</label>
                <input
                  type="text"
                  value={newProfile.testId}
                  onChange={(e) => setNewProfile({ ...newProfile, testId: e.target.value })}
                  placeholder="Enter test ID"
                  className="w-full px-4 py-2 bg-white/10 border border-purple-300/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-purple-200 text-sm mb-2">Emoji</label>
                <select
                  value={newProfile.emoji}
                  onChange={(e) => setNewProfile({ ...newProfile, emoji: e.target.value })}
                  className="w-full px-4 py-2 bg-white/10 border border-purple-300/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  {getEmojiOptions().map(emoji => (
                    <option key={emoji} value={emoji}>{emoji}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddProfile}
                className="px-6 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-200 rounded-lg transition-colors"
              >
                Add Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile, index) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-effect rounded-2xl p-6"
          >
            {/* Profile Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{profile.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold text-white">{profile.name}</h3>
                  <p className="text-purple-300 text-sm">{profile.test_id}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleFavorite(profile.test_id, profile.name, profile.emoji)}
                  className={`p-2 rounded-lg transition-colors ${
                    favorites.some(fav => fav.test_id === profile.test_id)
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-white/10 text-purple-200 hover:bg-white/20'
                  }`}
                >
                  <Star className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingProfile(profile)}
                  className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteProfile(profile.test_id)}
                  className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-purple-200 text-sm">
                <Clock className="w-4 h-4" />
                <span>Created: {new Date(profile.created_at).toLocaleDateString()}</span>
              </div>

              {/* Top Roles */}
              <div>
                <h4 className="text-purple-200 font-medium mb-2">Top Roles</h4>
                {(() => {
                  const topRoles = getTopRoles(profile.test_id)
                  if (topRoles.length > 0) {
                    return (
                      <div className="space-y-1">
                        {topRoles.map((role, roleIndex) => (
                          <div key={roleIndex} className="flex items-center justify-between">
                            <span className="text-white text-sm">{role.role}</span>
                            <span className={`text-sm font-medium ${
                              role.percentage >= 80 ? 'text-green-400' : 
                              role.percentage >= 60 ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {role.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )
                  } else {
                    return (
                      <div className="text-center py-2">
                        <button
                          onClick={async () => {
                            try {
                              const result = await apiService.fetchTestResults(profile.test_id)
                              if (result && result.results) {
                                setProfileResults(prev => ({
                                  ...prev,
                                  [profile.test_id]: result.results
                                }))
                              }
                            } catch (error) {
                              console.error('Error loading results:', error)
                            }
                          }}
                          className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 text-sm rounded-lg transition-colors"
                        >
                          Load Results
                        </button>
                      </div>
                    )
                  }
                })()}
              </div>

              {/* Compatibility with Current Results */}
              {results.length > 0 && (
                <div>
                  <h4 className="text-purple-200 font-medium mb-2">Current Compatibility</h4>
                  <div className="space-y-2">
                    {(() => {
                      const compatibility = getCompatibilityWithCurrent(profile)
                      if (compatibility !== null) {
                        return (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-red-400" />
                              <span className="text-white text-sm">Overall Score</span>
                            </div>
                            <span className={`text-lg font-bold ${getCompatibilityColor(compatibility)}`}>
                              {compatibility}%
                            </span>
                          </div>
                        )
                      } else {
                        return (
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-300 text-sm">
                              {results.length} participant{results.length > 1 ? 's' : ''} analyzed
                            </span>
                          </div>
                        )
                      }
                    })()}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editingProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingProfile(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-effect rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-purple-200 mb-4">Edit Profile</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-purple-200 text-sm mb-2">Name</label>
                  <input
                    type="text"
                    value={editingProfile.name}
                    onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-purple-300/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <div>
                  <label className="block text-purple-200 text-sm mb-2">Emoji</label>
                  <select
                    value={editingProfile.emoji}
                    onChange={(e) => setEditingProfile({ ...editingProfile, emoji: e.target.value })}
                    className="w-full px-4 py-2 bg-white/10 border border-purple-300/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    {getEmojiOptions().map(emoji => (
                      <option key={emoji} value={emoji}>{emoji}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpdateProfile}
                    className="flex-1 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-200 rounded-lg transition-colors"
                  >
                    Update
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditingProfile(null)}
                    className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredProfiles.length === 0 && !loading && (
        <div className="glass-effect rounded-2xl p-8 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-purple-400" />
          <h3 className="text-xl font-bold text-white mb-2">No Profiles Found</h3>
          <p className="text-purple-200 mb-4">
            {searchQuery ? 'Try adjusting your search terms.' : 'Start by adding your first profile!'}
          </p>
          {!searchQuery && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-lg transition-colors"
            >
              Add Your First Profile
            </motion.button>
          )}
        </div>
      )}
    </div>
  )
}

export default UserProfiles
