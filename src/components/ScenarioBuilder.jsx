import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Settings, Users, Zap, Heart, Target, Star, Plus, Save, Database, Trash2, CheckCircle, AlertCircle, Edit, Shield } from 'lucide-react'
import apiService from '../utils/api'
import { getAllScenarios, getScenariosByCategory, getScenariosByDifficulty, searchScenarios } from '../utils/scenarioDatabase'
import SafetyChecklist from './SafetyChecklist'

const ScenarioBuilder = ({ results }) => {
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [savedScenarios, setSavedScenarios] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [scenarioToDelete, setScenarioToDelete] = useState(null)
  const [activeTimer, setActiveTimer] = useState(null)
  const [timerTime, setTimerTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [sessionNotes, setSessionNotes] = useState('')
  const [sessionRating, setSessionRating] = useState(0)
  const [showSessionLog, setShowSessionLog] = useState(false)
  const [editingScenario, setEditingScenario] = useState(null)
  const [showTemplates, setShowTemplates] = useState(false)
  const [showSafetyGuide, setShowSafetyGuide] = useState(false)
  const [showSafetyChecklist, setShowSafetyChecklist] = useState(false)
  const [selectedScenarioForChecklist, setSelectedScenarioForChecklist] = useState(null)
  const [customScenario, setCustomScenario] = useState({
    name: '',
    description: '',
    roles: [],
    roleAssignments: {},
    intensity: 'medium',
    duration: 'medium',
    difficulty: 'beginner',
    category: 'power-exchange',
    safety: [],
    equipment: [],
    steps: [],
    safetyLevel: 'moderate'
  })

  // Get scenarios from database
  const scenarioTemplates = getAllScenarios()

  useEffect(() => {
    if (results.length > 0) {
      loadSavedScenarios()
    }
  }, [results])

  useEffect(() => {
    let interval
    if (isTimerRunning && activeTimer) {
      interval = setInterval(() => {
        setTimerTime(prev => {
          const newTime = prev + 1
          if (activeTimer.isRange && newTime >= activeTimer.targetTime) {
            setIsTimerRunning(false)
            return activeTimer.targetTime
          }
          return newTime
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, activeTimer])

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  const loadSavedScenarios = async () => {
    try {
      setLoading(true)
      const testIds = results.map(r => r.id)
      const response = await apiService.getScenarios(testIds)
      if (response.success) {
        setSavedScenarios(response.scenarios)
      }
    } catch (error) {
      console.error('Error loading saved scenarios:', error)
      showMessage('error', 'Failed to load saved scenarios')
    } finally {
      setLoading(false)
    }
  }

  const saveCustomScenario = async () => {
    if (!customScenario.name.trim()) {
      showMessage('error', 'Please enter a scenario name')
      return
    }

    try {
      setLoading(true)
      const testIds = results.map(r => r.id)
      const scenarioData = {
        ...customScenario,
        testIds,
        isCustom: true
      }
      
      const response = await apiService.saveScenario(scenarioData)
      if (response.success) {
        setSavedScenarios(prev => [...prev, response.scenario])
        setCustomScenario({
          name: '',
          description: '',
          roles: [],
          roleAssignments: {},
          intensity: 'medium',
          duration: 'medium',
          difficulty: 'beginner',
          category: 'power-exchange',
          safety: [],
          equipment: [],
          steps: [],
          safetyLevel: 'moderate'
        })
        showMessage('success', 'Scenario saved successfully!')
      }
    } catch (error) {
      console.error('Error saving scenario:', error)
      showMessage('error', 'Failed to save scenario')
    } finally {
      setLoading(false)
    }
  }

  const deleteScenario = async () => {
    if (!scenarioToDelete) return

    try {
      setLoading(true)
      const response = await apiService.deleteScenario(scenarioToDelete.id)
      if (response.success) {
        setSavedScenarios(prev => prev.filter(s => s.id !== scenarioToDelete.id))
        showMessage('success', 'Scenario deleted successfully!')
      }
    } catch (error) {
      console.error('Error deleting scenario:', error)
      showMessage('error', 'Failed to delete scenario')
    } finally {
      setLoading(false)
      setShowDeleteConfirm(false)
      setScenarioToDelete(null)
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setScenarioToDelete(null)
  }

  const startTimer = (scenario, duration = null) => {
    // Show safety checklist first for scenarios with higher risk
    if (scenario.safetyLevel === 'high' || scenario.safetyLevel === 'very-high' || scenario.difficulty === 'advanced' || scenario.difficulty === 'expert') {
      setSelectedScenarioForChecklist(scenario)
      setShowSafetyChecklist(true)
      return
    }
    
    const targetTime = duration || (scenario.duration === 'short' ? 900 : scenario.duration === 'medium' ? 1800 : 3600)
    setActiveTimer({ scenario, targetTime, isRange: false })
    setTimerTime(0)
    setIsTimerRunning(true)
  }

  const handleSafetyChecklistComplete = () => {
    setShowSafetyChecklist(false)
    const scenario = selectedScenarioForChecklist
    const targetTime = scenario.duration === 'short' ? 900 : scenario.duration === 'medium' ? 1800 : 3600
    setActiveTimer({ scenario, targetTime, isRange: false })
    setTimerTime(0)
    setIsTimerRunning(true)
    setSelectedScenarioForChecklist(null)
  }

  const stopTimer = () => {
    setIsTimerRunning(false)
    setShowSessionLog(true)
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const applyTemplate = (template) => {
    setCustomScenario({
      name: template.name,
      description: template.description,
      roles: template.roles,
      intensity: template.intensity,
      duration: template.duration,
      category: template.category,
      roleAssignments: {},
      difficulty: template.difficulty,
      equipment: template.equipment,
      steps: template.steps,
      safety: template.safety,
      safetyLevel: template.safetyLevel
    })
    setShowTemplates(false)
    showMessage('success', `Template "${template.name}" applied successfully!`)
  }

  const saveSessionLog = () => {
    const sessionData = {
      scenario: activeTimer?.scenario?.name || 'Custom Scenario',
      duration: formatTime(timerTime),
      rating: sessionRating,
      notes: sessionNotes,
      category: activeTimer?.scenario?.category || 'unknown',
      difficulty: activeTimer?.scenario?.difficulty || 'unknown',
      intensity: activeTimer?.scenario?.intensity || 'unknown',
      timestamp: new Date().toISOString()
    }
    
    const existingLogs = JSON.parse(localStorage.getItem('scenarioLogs') || '[]')
    existingLogs.push(sessionData)
    localStorage.setItem('scenarioLogs', JSON.stringify(existingLogs))
    
    setShowSessionLog(false)
    setSessionNotes('')
    setSessionRating(0)
    showMessage('success', 'Session log saved successfully!')
  }

  // Configuration arrays
  const intensityLevels = [
    { value: 'low', label: 'Low', color: 'text-green-400', bg: 'bg-green-500/20' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { value: 'high', label: 'High', color: 'text-red-400', bg: 'bg-red-500/20' },
    { value: 'extreme', label: 'Extreme', color: 'text-purple-400', bg: 'bg-purple-500/20' }
  ]

  const durationLevels = [
    { value: 'short', label: 'Short (15-30 min)', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { value: 'medium', label: 'Medium (30-60 min)', color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { value: 'long', label: 'Long (1+ hours)', color: 'text-pink-400', bg: 'bg-pink-500/20' },
    { value: 'very-long', label: 'Very Long (3+ hours)', color: 'text-red-400', bg: 'bg-red-500/20' }
  ]

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner', color: 'text-green-400', bg: 'bg-green-500/20' },
    { value: 'intermediate', label: 'Intermediate', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { value: 'advanced', label: 'Advanced', color: 'text-red-400', bg: 'bg-red-500/20' },
    { value: 'expert', label: 'Expert', color: 'text-purple-400', bg: 'bg-purple-500/20' }
  ]

  const safetyLevels = [
    { value: 'low', label: 'Low Risk', color: 'text-green-400', bg: 'bg-green-500/20', icon: '🟢' },
    { value: 'moderate', label: 'Moderate Risk', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: '🟡' },
    { value: 'high', label: 'High Risk', color: 'text-red-400', bg: 'bg-red-500/20', icon: '🔴' },
    { value: 'very-high', label: 'Very High Risk', color: 'text-purple-400', bg: 'bg-purple-500/20', icon: '💀' }
  ]

  const scenarioCategories = [
    'power-exchange', 'bondage', 'impact-play', 'sensory', 'role-play', 'caregiver', 'pet-play', 'medical-play'
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Scenario Builder</h2>
          <p className="text-purple-200">Create and manage BDSM scenarios for your compatibility results</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Database className="w-4 h-4" />
            Templates
          </button>
                     <button
             onClick={() => setShowSafetyGuide(true)}
             className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
           >
             <AlertCircle className="w-4 h-4" />
             Safety Guide
           </button>
           <button
             onClick={() => {
               setSelectedScenarioForChecklist(customScenario)
               setShowSafetyChecklist(true)
             }}
             className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
           >
             <Shield className="w-4 h-4" />
             Safety Checklist
           </button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-500/20 border border-green-400/30 text-green-200' :
            message.type === 'error' ? 'bg-red-500/20 border border-red-400/30 text-red-200' :
            'bg-blue-500/20 border border-blue-400/30 text-blue-200'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Custom Scenario Builder */}
        <div className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Edit className="w-5 h-5" />
            Custom Scenario
          </h3>

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-purple-200 text-sm mb-2">Scenario Name</label>
              <input
                type="text"
                value={customScenario.name}
                onChange={(e) => setCustomScenario({ ...customScenario, name: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/10 border border-purple-400/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                placeholder="Enter scenario name..."
              />
            </div>

            <div>
              <label className="block text-purple-200 text-sm mb-2">Description</label>
              <textarea
                value={customScenario.description}
                onChange={(e) => setCustomScenario({ ...customScenario, description: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/10 border border-purple-400/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 resize-none"
                rows="3"
                placeholder="Describe the scenario..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-purple-200 text-sm mb-2">Category</label>
              <select
                value={customScenario.category}
                onChange={(e) => setCustomScenario({ ...customScenario, category: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/10 border border-purple-400/20 text-white focus:outline-none focus:border-purple-400"
              >
                {scenarioCategories.map(category => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            {/* Intensity, Duration, Difficulty */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-purple-200 text-sm mb-2">Intensity</label>
                <select
                  value={customScenario.intensity}
                  onChange={(e) => setCustomScenario({ ...customScenario, intensity: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/10 border border-purple-400/20 text-white focus:outline-none focus:border-purple-400"
                >
                  {intensityLevels.map(level => (
                    <option key={level.value} value={level.value} className="bg-gray-800">
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-purple-200 text-sm mb-2">Duration</label>
                <select
                  value={customScenario.duration}
                  onChange={(e) => setCustomScenario({ ...customScenario, duration: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/10 border border-purple-400/20 text-white focus:outline-none focus:border-purple-400"
                >
                  {durationLevels.map(level => (
                    <option key={level.value} value={level.value} className="bg-gray-800">
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-purple-200 text-sm mb-2">Difficulty</label>
                <select
                  value={customScenario.difficulty}
                  onChange={(e) => setCustomScenario({ ...customScenario, difficulty: e.target.value })}
                  className="w-full p-3 rounded-lg bg-white/10 border border-purple-400/20 text-white focus:outline-none focus:border-purple-400"
                >
                  {difficultyLevels.map(level => (
                    <option key={level.value} value={level.value} className="bg-gray-800">
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Safety Level */}
            <div>
              <label className="block text-purple-200 text-sm mb-2">Safety Level</label>
              <select
                value={customScenario.safetyLevel}
                onChange={(e) => setCustomScenario({ ...customScenario, safetyLevel: e.target.value })}
                className="w-full p-3 rounded-lg bg-white/10 border border-purple-400/20 text-white focus:outline-none focus:border-purple-400"
              >
                {safetyLevels.map(level => (
                  <option key={level.value} value={level.value} className="bg-gray-800">
                    {level.icon} {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={saveCustomScenario}
            disabled={loading || !customScenario.name.trim()}
            className="w-full mt-6 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Scenario
              </>
            )}
          </button>
        </div>

        {/* Saved Scenarios */}
        <div className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Saved Scenarios
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
            </div>
          ) : savedScenarios.length === 0 ? (
            <div className="text-center py-8 text-purple-300">
              <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No saved scenarios yet</p>
              <p className="text-sm opacity-75">Create a custom scenario or use a template to get started</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {savedScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="bg-gray-700/50 border border-purple-400/20 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white">{scenario.name}</h4>
                      <p className="text-sm text-purple-200">{scenario.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startTimer(scenario)}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        title="Start Timer"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setScenarioToDelete(scenario)
                          setShowDeleteConfirm(true)
                        }}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${intensityLevels.find(l => l.value === scenario.intensity)?.bg} ${intensityLevels.find(l => l.value === scenario.intensity)?.color}`}>
                      {intensityLevels.find(l => l.value === scenario.intensity)?.label}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${durationLevels.find(l => l.value === scenario.duration)?.bg} ${durationLevels.find(l => l.value === scenario.duration)?.color}`}>
                      {durationLevels.find(l => l.value === scenario.duration)?.label}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${difficultyLevels.find(l => l.value === scenario.difficulty)?.bg} ${difficultyLevels.find(l => l.value === scenario.difficulty)?.color}`}>
                      {difficultyLevels.find(l => l.value === scenario.difficulty)?.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Timer */}
      {activeTimer && (
        <div className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Active Session: {activeTimer.scenario.name}</h3>
              <div className="text-3xl font-mono text-purple-400">{formatTime(timerTime)}</div>
            </div>
            <div className="flex gap-3">
              {isTimerRunning ? (
                <button
                  onClick={stopTimer}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Stop Session
                </button>
              ) : (
                <button
                  onClick={() => setIsTimerRunning(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Resume
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowTemplates(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 border border-purple-400/30 rounded-lg p-6 max-w-4xl mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Scenario Templates</h3>
              <button
                onClick={() => setShowTemplates(false)}
                className="text-purple-300 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenarioTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-gray-700/50 border border-purple-400/20 rounded-lg p-4 cursor-pointer hover:bg-gray-700/70 transition-colors"
                  onClick={() => applyTemplate(template)}
                >
                  <h4 className="font-semibold text-white mb-2">{template.name}</h4>
                  <p className="text-sm text-purple-200 mb-3 line-clamp-3">{template.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs ${intensityLevels.find(l => l.value === template.intensity)?.bg} ${intensityLevels.find(l => l.value === template.intensity)?.color}`}>
                      {intensityLevels.find(l => l.value === template.intensity)?.label}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${durationLevels.find(l => l.value === template.duration)?.bg} ${durationLevels.find(l => l.value === template.duration)?.color}`}>
                      {durationLevels.find(l => l.value === template.duration)?.label}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${difficultyLevels.find(l => l.value === template.difficulty)?.bg} ${difficultyLevels.find(l => l.value === template.difficulty)?.color}`}>
                      {difficultyLevels.find(l => l.value === template.difficulty)?.label}
                    </span>
                  </div>
                  
                  <div className="text-xs text-purple-300">
                    Roles: {template.roles.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Safety Guide Modal */}
      {showSafetyGuide && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowSafetyGuide(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 border border-red-400/30 rounded-lg p-6 max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-red-400" />
                Safety Guide
              </h3>
              <button
                onClick={() => setShowSafetyGuide(false)}
                className="text-purple-300 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-700/50 border border-red-400/20 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-white mb-3">General Safety Guidelines</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-purple-200">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Always obtain enthusiastic consent</span>
                  </li>
                  <li className="flex items-start gap-2 text-purple-200">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Establish safe words before any scene</span>
                  </li>
                  <li className="flex items-start gap-2 text-purple-200">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Start slow and build intensity gradually</span>
                  </li>
                  <li className="flex items-start gap-2 text-purple-200">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Provide appropriate aftercare</span>
                  </li>
                  <li className="flex items-start gap-2 text-purple-200">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Communicate openly about boundaries</span>
                  </li>
                  <li className="flex items-start gap-2 text-purple-200">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Never pressure someone into activities</span>
                  </li>
                  <li className="flex items-start gap-2 text-purple-200">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>Educate yourself on techniques before trying them</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Session Log Modal */}
      {showSessionLog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 border border-purple-400/30 rounded-lg p-6 max-w-md mx-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">Session Log</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 text-sm mb-2">Duration</label>
                <div className="text-white font-medium">{formatTime(timerTime)}</div>
              </div>
              
              <div>
                <label className="block text-purple-200 text-sm mb-2">Rating (1-5)</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setSessionRating(star)}
                      className={`text-2xl ${sessionRating >= star ? 'text-yellow-400' : 'text-gray-400'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-purple-200 text-sm mb-2">Notes</label>
                <textarea
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full p-3 rounded-lg bg-white/10 border border-purple-400/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 resize-none"
                  rows="3"
                  placeholder="How was the session? Any notes or feedback..."
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSessionLog(false)}
                  className="flex-1 px-4 py-2 bg-white/10 text-purple-200 rounded-lg border border-purple-400/30 hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveSessionLog}
                  className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  Save Log
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

             {/* Safety Checklist Modal */}
       {showSafetyChecklist && (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
           onClick={() => setShowSafetyChecklist(false)}
         >
           <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="bg-gray-800 border border-purple-400/30 rounded-lg p-6 max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
             onClick={(e) => e.stopPropagation()}
           >
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-2xl font-bold text-white">Safety Checklist</h3>
               <button
                 onClick={() => setShowSafetyChecklist(false)}
                 className="text-purple-300 hover:text-white"
               >
                 ✕
               </button>
             </div>
             
             <SafetyChecklist 
               scenario={selectedScenarioForChecklist} 
               onComplete={handleSafetyChecklistComplete}
             />
           </motion.div>
         </motion.div>
       )}

       {/* Delete Confirmation Modal */}
       {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={cancelDelete}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 border border-red-400/30 rounded-lg p-6 max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-white">Delete Scenario</h3>
            </div>
            
            <p className="text-purple-200 mb-6">
              Are you sure you want to delete this scenario? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={deleteScenario}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ScenarioBuilder
