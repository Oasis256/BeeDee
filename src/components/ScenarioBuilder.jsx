import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Settings, Users, Zap, Heart, Target, Star, Plus, Save } from 'lucide-react'

const ScenarioBuilder = ({ results }) => {
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [customScenario, setCustomScenario] = useState({
    name: '',
    description: '',
    roles: [],
    intensity: 'medium',
    duration: 'medium',
    safety: []
  })

  if (results.length < 2) {
    return null
  }

  const [result1, result2] = results

  const getEmoji = (role) => {
    const emojiMap = {
      'Submissive': '🙇‍♀️', 'Dominant': '👑', 'Switch': '🔄', 'Voyeur': '👁️',
      'Exhibitionist': '🎭', 'Rope bunny': '🪢', 'Rigger': '🎪', 'Masochist': '💔',
      'Sadist': '⚡', 'Brat': '😈', 'Brat tamer': '🎯', 'Daddy/Mommy': '👨‍👩‍👧‍👦',
      'Little': '🧸', 'Ageplayer': '🎠', 'Pet': '🐾', 'Owner': '🏠',
      'Master/Mistress': '⚜️', 'Slave': '⛓️', 'Degrader': '🗣️', 'Degradee': '😔',
      'Primal (Hunter)': '🐺', 'Primal (Prey)': '🦌', 'Experimentalist': '🧪',
      'Vanilla': '🍦', 'Non-monogamist': '💕'
    }
    return emojiMap[role] || '❓'
  }

  const generateScenarios = () => {
    const scenarios = []

    // Get high-scoring roles for both people
    const highScoreRoles1 = result1.results.filter(item => item.percentage > 70)
    const highScoreRoles2 = result2.results.filter(item => item.percentage > 70)
    const sharedHighRoles = highScoreRoles1.filter(role1 => 
      highScoreRoles2.some(role2 => role2.role === role1.role)
    )

    // Get complementary roles
    const complementaryPairs = {
      'Submissive': ['Dominant', 'Master/Mistress', 'Daddy/Mommy'],
      'Dominant': ['Submissive', 'Slave', 'Little'],
      'Switch': ['Switch', 'Submissive', 'Dominant'],
      'Rigger': ['Rope bunny'],
      'Rope bunny': ['Rigger'],
      'Sadist': ['Masochist'],
      'Masochist': ['Sadist'],
      'Brat': ['Brat tamer'],
      'Brat tamer': ['Brat'],
      'Daddy/Mommy': ['Little', 'Submissive'],
      'Little': ['Daddy/Mommy', 'Dominant'],
      'Pet': ['Owner'],
      'Owner': ['Pet'],
      'Master/Mistress': ['Slave', 'Submissive'],
      'Slave': ['Master/Mistress', 'Dominant'],
      'Degrader': ['Degradee'],
      'Degradee': ['Degrader'],
      'Primal (Hunter)': ['Primal (Prey)'],
      'Primal (Prey)': ['Primal (Hunter)'],
      'Voyeur': ['Exhibitionist'],
      'Exhibitionist': ['Voyeur']
    }

    // Find complementary dynamics
    const complementaryDynamics = []
    result1.results.forEach(role1 => {
      if (complementaryPairs[role1.role] && role1.percentage > 30) {
        const compRole = complementaryPairs[role1.role].find(comp => {
          const role2Item = result2.results.find(r => r.role === comp)
          return role2Item && role2Item.percentage > 30
        })
        if (compRole) {
          complementaryDynamics.push({ role1: role1.role, role2: compRole })
        }
      }
    })

    // Generate scenarios based on shared interests
    if (sharedHighRoles.length > 0) {
      sharedHighRoles.forEach(role => {
        const scenarioMap = {
          'Switch': {
            name: 'Switch Day Adventure',
            description: 'A day where you both explore switching roles, taking turns being dominant and submissive.',
            roles: ['Switch', 'Switch'],
            intensity: 'medium',
            duration: 'long',
            safety: ['Safe words', 'Regular check-ins', 'Clear boundaries']
          },
          'Voyeur': {
            name: 'Private Performance',
            description: 'One partner performs while the other watches, creating an intimate voyeuristic experience.',
            roles: ['Voyeur', 'Exhibitionist'],
            intensity: 'low',
            duration: 'medium',
            safety: ['Consent', 'Privacy', 'Comfort levels']
          },
          'Rope bunny': {
            name: 'Rope Bondage Session',
            description: 'A sensual rope bondage session focusing on restraint and trust.',
            roles: ['Rope bunny', 'Rigger'],
            intensity: 'medium',
            duration: 'medium',
            safety: ['Safety scissors', 'Circulation checks', 'Proper knots']
          },
          'Masochist': {
            name: 'Sensation Play',
            description: 'Exploring different sensations and intensities in a safe, controlled environment.',
            roles: ['Masochist', 'Sadist'],
            intensity: 'high',
            duration: 'medium',
            safety: ['Safe words', 'Gradual intensity', 'Aftercare']
          },
          'Brat': {
            name: 'Brat Training',
            description: 'A playful scenario where the brat challenges the brat tamer with fun consequences.',
            roles: ['Brat', 'Brat tamer'],
            intensity: 'medium',
            duration: 'medium',
            safety: ['Clear rules', 'Fun consequences', 'Mutual enjoyment']
          },
          'Daddy/Mommy': {
            name: 'Caregiver Dynamic',
            description: 'A nurturing scenario focusing on care, guidance, and emotional connection.',
            roles: ['Daddy/Mommy', 'Little'],
            intensity: 'low',
            duration: 'long',
            safety: ['Emotional safety', 'Clear boundaries', 'Gentle care']
          },
          'Pet': {
            name: 'Pet Play Session',
            description: 'An animal role-play scenario with training, rewards, and care.',
            roles: ['Pet', 'Owner'],
            intensity: 'low',
            duration: 'medium',
            safety: ['Comfortable gear', 'Clear commands', 'Positive reinforcement']
          }
        }
        
        if (scenarioMap[role.role]) {
          scenarios.push(scenarioMap[role.role])
        }
      })
    }

    // Generate scenarios based on complementary dynamics
    if (complementaryDynamics.length > 0) {
      complementaryDynamics.forEach(dynamic => {
        const scenarioMap = {
          'Submissive-Dominant': {
            name: 'Power Exchange Scene',
            description: 'A classic dominant/submissive dynamic with clear protocols and power exchange.',
            roles: ['Submissive', 'Dominant'],
            intensity: 'medium',
            duration: 'medium',
            safety: ['Safe words', 'Clear protocols', 'Aftercare']
          },
          'Rigger-Rope bunny': {
            name: 'Artistic Bondage',
            description: 'A beautiful rope bondage session focusing on aesthetics and restraint.',
            roles: ['Rigger', 'Rope bunny'],
            intensity: 'medium',
            duration: 'long',
            safety: ['Safety equipment', 'Proper technique', 'Regular checks']
          },
          'Sadist-Masochist': {
            name: 'Impact Play Session',
            description: 'A controlled impact play session with various implements and sensations.',
            roles: ['Sadist', 'Masochist'],
            intensity: 'high',
            duration: 'medium',
            safety: ['Safe words', 'Gradual build-up', 'Aftercare']
          },
          'Brat-Brat tamer': {
            name: 'Discipline Session',
            description: 'A playful discipline scenario with creative punishments and rewards.',
            roles: ['Brat', 'Brat tamer'],
            intensity: 'medium',
            duration: 'medium',
            safety: ['Fun consequences', 'Clear boundaries', 'Mutual enjoyment']
          },
          'Daddy/Mommy-Little': {
            name: 'Age Play Date',
            description: 'A nurturing age play scenario with care, activities, and emotional connection.',
            roles: ['Daddy/Mommy', 'Little'],
            intensity: 'low',
            duration: 'long',
            safety: ['Emotional safety', 'Clear roles', 'Gentle care']
          },
          'Pet-Owner': {
            name: 'Pet Training',
            description: 'A structured pet training session with commands, rewards, and care.',
            roles: ['Pet', 'Owner'],
            intensity: 'low',
            duration: 'medium',
            safety: ['Comfortable gear', 'Clear commands', 'Positive reinforcement']
          },
          'Voyeur-Exhibitionist': {
            name: 'Show and Tell',
            description: 'A private performance scenario with one partner showing off for the other.',
            roles: ['Voyeur', 'Exhibitionist'],
            intensity: 'low',
            duration: 'medium',
            safety: ['Privacy', 'Consent', 'Comfort levels']
          }
        }
        
        const key = `${dynamic.role1}-${dynamic.role2}`
        if (scenarioMap[key]) {
          scenarios.push(scenarioMap[key])
        }
      })
    }

    return scenarios
  }

  const scenarios = generateScenarios()

  const intensityLevels = [
    { value: 'low', label: 'Low', color: 'text-green-400', bg: 'bg-green-500/20' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { value: 'high', label: 'High', color: 'text-red-400', bg: 'bg-red-500/20' }
  ]

  const durationLevels = [
    { value: 'short', label: 'Short (15-30 min)', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { value: 'medium', label: 'Medium (30-60 min)', color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { value: 'long', label: 'Long (1+ hours)', color: 'text-pink-400', bg: 'bg-pink-500/20' }
  ]

  const safetyOptions = [
    'Safe words', 'Regular check-ins', 'Clear boundaries', 'Aftercare',
    'Safety equipment', 'Gradual intensity', 'Emotional safety', 'Privacy',
    'Comfort levels', 'Proper technique', 'Positive reinforcement'
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6 mb-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Scenario Builder</h3>
        <p className="text-purple-200">Create and customize BDSM scenarios based on your compatibility</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pre-built Scenarios */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            Suggested Scenarios
          </h4>
          
          {scenarios.length > 0 ? (
            scenarios.map((scenario, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                  selectedScenario === scenario
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/50'
                    : 'bg-white/5 border-purple-400/20 hover:bg-white/10'
                }`}
                onClick={() => setSelectedScenario(scenario)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="text-white font-semibold">{scenario.name}</h5>
                  <div className="flex gap-1">
                    {scenario.roles.map((role, roleIndex) => (
                      <span key={roleIndex} className="text-lg">{getEmoji(role)}</span>
                    ))}
                  </div>
                </div>
                
                <p className="text-purple-200 text-sm mb-3">{scenario.description}</p>
                
                <div className="flex gap-2 mb-3">
                  {intensityLevels.find(level => level.value === scenario.intensity) && (
                    <span className={`text-xs px-2 py-1 rounded ${intensityLevels.find(level => level.value === scenario.intensity).bg} ${intensityLevels.find(level => level.value === scenario.intensity).color}`}>
                      {intensityLevels.find(level => level.value === scenario.intensity).label} Intensity
                    </span>
                  )}
                  {durationLevels.find(level => level.value === scenario.duration) && (
                    <span className={`text-xs px-2 py-1 rounded ${durationLevels.find(level => level.value === scenario.duration).bg} ${durationLevels.find(level => level.value === scenario.duration).color}`}>
                      {durationLevels.find(level => level.value === scenario.duration).label}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {scenario.safety.slice(0, 3).map((item, safetyIndex) => (
                    <span key={safetyIndex} className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                      {item}
                    </span>
                  ))}
                  {scenario.safety.length > 3 && (
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                      +{scenario.safety.length - 3} more
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-8 bg-white/5 rounded-lg border border-purple-400/20"
            >
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <h4 className="text-white font-semibold mb-2">No scenarios found</h4>
              <p className="text-purple-200 text-sm">
                Try adding more test results or create a custom scenario below.
              </p>
            </motion.div>
          )}
        </div>

        {/* Custom Scenario Builder */}
        <div className="space-y-4">
          <h4 className="text-xl font-bold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-400" />
            Custom Scenario
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Scenario Name</label>
              <input
                type="text"
                value={customScenario.name}
                onChange={(e) => setCustomScenario({...customScenario, name: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/10 border border-purple-400/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400"
                placeholder="Enter scenario name..."
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Description</label>
              <textarea
                value={customScenario.description}
                onChange={(e) => setCustomScenario({...customScenario, description: e.target.value})}
                className="w-full p-3 rounded-lg bg-white/10 border border-purple-400/20 text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 resize-none"
                rows="3"
                placeholder="Describe your scenario..."
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Intensity Level</label>
              <div className="flex gap-2">
                {intensityLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setCustomScenario({...customScenario, intensity: level.value})}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      customScenario.intensity === level.value
                        ? `${level.bg} ${level.color} border border-current`
                        : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Duration</label>
              <div className="flex gap-2">
                {durationLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setCustomScenario({...customScenario, duration: level.value})}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      customScenario.duration === level.value
                        ? `${level.bg} ${level.color} border border-current`
                        : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Safety Considerations</label>
              <div className="flex flex-wrap gap-2">
                {safetyOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      const newSafety = customScenario.safety.includes(option)
                        ? customScenario.safety.filter(item => item !== option)
                        : [...customScenario.safety, option]
                      setCustomScenario({...customScenario, safety: newSafety})
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      customScenario.safety.includes(option)
                        ? 'bg-green-500/20 text-green-300 border border-green-400/50'
                        : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Custom Scenario
            </motion.button>
          </div>
        </div>
      </div>

      {/* Selected Scenario Details */}
      {selectedScenario && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <Play className="w-5 h-5 text-purple-400" />
            <h4 className="text-xl font-bold text-white">Scenario Details</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-white font-semibold mb-2">Roles Involved</h5>
              <div className="flex gap-2 mb-4">
                {selectedScenario.roles.map((role, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg">
                    <span className="text-lg">{getEmoji(role)}</span>
                    <span className="text-purple-200">{role}</span>
                  </div>
                ))}
              </div>
              
              <h5 className="text-white font-semibold mb-2">Safety Checklist</h5>
              <ul className="space-y-1">
                {selectedScenario.safety.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-purple-200 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="text-white font-semibold mb-2">Scenario Overview</h5>
              <p className="text-purple-200 mb-4">{selectedScenario.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Intensity:</span>
                  <span className={`px-2 py-1 rounded text-sm ${intensityLevels.find(level => level.value === selectedScenario.intensity).bg} ${intensityLevels.find(level => level.value === selectedScenario.intensity).color}`}>
                    {intensityLevels.find(level => level.value === selectedScenario.intensity).label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Duration:</span>
                  <span className={`px-2 py-1 rounded text-sm ${durationLevels.find(level => level.value === selectedScenario.duration).bg} ${durationLevels.find(level => level.value === selectedScenario.duration).color}`}>
                    {durationLevels.find(level => level.value === selectedScenario.duration).label}
                  </span>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Scenario
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ScenarioBuilder



