import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  AlertCircle, 
  Shield, 
  Heart, 
  Users, 
  Clock, 
  Phone,
  MapPin,
  FileText,
  Settings
} from 'lucide-react'

const SafetyChecklist = ({ scenario, onComplete }) => {
  const [checklist, setChecklist] = useState([])
  const [completedItems, setCompletedItems] = useState(new Set())
  const [showEmergency, setShowEmergency] = useState(false)

  useEffect(() => {
    generateChecklist()
  }, [scenario])

  const generateChecklist = () => {
    const baseChecklist = [
      {
        id: 'consent',
        category: 'consent',
        text: 'All participants have given enthusiastic consent',
        critical: true,
        icon: Heart
      },
      {
        id: 'safewords',
        category: 'communication',
        text: 'Safe words are established and understood',
        critical: true,
        icon: Users
      },
      {
        id: 'emergency',
        category: 'emergency',
        text: 'Emergency contact information is readily available',
        critical: true,
        icon: Phone
      },
      {
        id: 'location',
        category: 'environment',
        text: 'Location is private and secure',
        critical: true,
        icon: MapPin
      },
      {
        id: 'time',
        category: 'planning',
        text: 'Adequate time is allocated for the session',
        critical: false,
        icon: Clock
      }
    ]

    const scenarioSpecific = getScenarioSpecificItems()
    const difficultySpecific = getDifficultySpecificItems()

    setChecklist([...baseChecklist, ...scenarioSpecific, ...difficultySpecific])
  }

  const getScenarioSpecificItems = () => {
    if (!scenario) return []

    const items = []

    switch (scenario.category) {
      case 'bondage':
        items.push(
          {
            id: 'rope-safety',
            category: 'equipment',
            text: 'Safety scissors are within immediate reach',
            critical: true,
            icon: Shield
          },
          {
            id: 'circulation',
            category: 'monitoring',
            text: 'Circulation check procedures are understood',
            critical: true,
            icon: Heart
          },
          {
            id: 'release-practice',
            category: 'preparation',
            text: 'Release techniques have been practiced',
            critical: true,
            icon: Settings
          }
        )
        break

      case 'impact-play':
        items.push(
          {
            id: 'safe-areas',
            category: 'knowledge',
            text: 'Safe impact areas are identified',
            critical: true,
            icon: Shield
          },
          {
            id: 'warm-up',
            category: 'technique',
            text: 'Warm-up procedures are planned',
            critical: false,
            icon: Clock
          },
          {
            id: 'aftercare',
            category: 'planning',
            text: 'Aftercare plan is prepared',
            critical: true,
            icon: Heart
          }
        )
        break

      case 'breath-play':
        items.push(
          {
            id: 'hands-only',
            category: 'equipment',
            text: 'Using hands only (no implements)',
            critical: true,
            icon: Shield
          },
          {
            id: 'short-duration',
            category: 'timing',
            text: 'Very short duration planned (seconds only)',
            critical: true,
            icon: Clock
          },
          {
            id: 'immediate-release',
            category: 'safety',
            text: 'Immediate release capability is confirmed',
            critical: true,
            icon: AlertCircle
          }
        )
        break

      case 'sensory':
        items.push(
          {
            id: 'temperature-test',
            category: 'equipment',
            text: 'Temperature-sensitive items are tested',
            critical: false,
            icon: Shield
          },
          {
            id: 'easy-removal',
            category: 'equipment',
            text: 'All sensory items can be easily removed',
            critical: true,
            icon: Settings
          }
        )
        break

      case 'power-exchange':
        items.push(
          {
            id: 'boundaries',
            category: 'communication',
            text: 'Clear boundaries and limits are established',
            critical: true,
            icon: Users
          },
          {
            id: 'aftercare-plan',
            category: 'planning',
            text: 'Comprehensive aftercare plan is ready',
            critical: true,
            icon: Heart
          }
        )
        break
    }

    return items
  }

  const getDifficultySpecificItems = () => {
    if (!scenario) return []

    const items = []

    switch (scenario.difficulty) {
      case 'beginner':
        items.push(
          {
            id: 'short-session',
            category: 'planning',
            text: 'Keep session short (15-30 minutes)',
            critical: false,
            icon: Clock
          },
          {
            id: 'simple-techniques',
            category: 'technique',
            text: 'Use simple, basic techniques only',
            critical: false,
            icon: Settings
          }
        )
        break

      case 'intermediate':
        items.push(
          {
            id: 'experience-check',
            category: 'knowledge',
            text: 'All participants have relevant experience',
            critical: true,
            icon: Users
          },
          {
            id: 'backup-plan',
            category: 'planning',
            text: 'Backup plan is prepared',
            critical: false,
            icon: FileText
          }
        )
        break

      case 'advanced':
      case 'expert':
        items.push(
          {
            id: 'professional-training',
            category: 'knowledge',
            text: 'Professional training has been received',
            critical: true,
            icon: Shield
          },
          {
            id: 'medical-support',
            category: 'emergency',
            text: 'Medical support is available if needed',
            critical: true,
            icon: Phone
          },
          {
            id: 'comprehensive-planning',
            category: 'planning',
            text: 'Comprehensive safety plan is documented',
            critical: true,
            icon: FileText
          }
        )
        break
    }

    return items
  }

  const toggleItem = (itemId) => {
    const newCompleted = new Set(completedItems)
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId)
    } else {
      newCompleted.add(itemId)
    }
    setCompletedItems(newCompleted)
  }

  const getCompletionPercentage = () => {
    if (checklist.length === 0) return 0
    return Math.round((completedItems.size / checklist.length) * 100)
  }

  const getCriticalItemsCompleted = () => {
    const criticalItems = checklist.filter(item => item.critical)
    const completedCritical = criticalItems.filter(item => completedItems.has(item.id))
    return completedCritical.length === criticalItems.length
  }

  const handleComplete = () => {
    if (getCriticalItemsCompleted()) {
      onComplete && onComplete()
    }
  }

  const groupedItems = checklist.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = []
    }
    groups[item.category].push(item)
    return groups
  }, {})

  const categoryLabels = {
    consent: 'Consent & Communication',
    communication: 'Communication',
    emergency: 'Emergency Preparedness',
    environment: 'Environment',
    planning: 'Planning',
    equipment: 'Equipment & Tools',
    monitoring: 'Monitoring',
    preparation: 'Preparation',
    knowledge: 'Knowledge & Experience',
    technique: 'Technique',
    timing: 'Timing',
    safety: 'Safety Protocols'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Safety Checklist</h2>
        <p className="text-purple-200">
          Complete all critical items before proceeding with your scenario
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-purple-200 text-sm">Progress</span>
          <span className="text-white font-medium">{getCompletionPercentage()}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getCompletionPercentage()}%` }}
          ></div>
        </div>
        <div className="mt-2 text-xs text-purple-300">
          {completedItems.size} of {checklist.length} items completed
        </div>
      </div>

      {/* Emergency Contact Button */}
      <div className="text-center">
        <button
          onClick={() => setShowEmergency(!showEmergency)}
          className="flex items-center gap-2 mx-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <AlertCircle className="w-5 h-5" />
          Emergency Contacts
        </button>
      </div>

      {showEmergency && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-500/20 border border-red-400/30 rounded-lg p-4"
        >
          <h3 className="text-lg font-semibold text-white mb-3">Emergency Contacts</h3>
          <div className="space-y-2 text-red-200">
            <p><strong>Local Emergency:</strong> 911 (US) / 112 (EU)</p>
            <p><strong>Poison Control:</strong> 1-800-222-1222 (US)</p>
            <p><strong>Local Hospital:</strong> [Add your local hospital number]</p>
            <p><strong>Trusted Friend:</strong> [Add trusted friend's number]</p>
          </div>
        </motion.div>
      )}

      {/* Checklist Items */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              {categoryLabels[category] || category}
            </h3>
            <div className="space-y-3">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                    completedItems.has(item.id)
                      ? 'bg-green-500/20 border border-green-400/30'
                      : item.critical
                      ? 'bg-red-500/10 border border-red-400/20'
                      : 'bg-gray-700/30 border border-gray-600/30'
                  }`}
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="flex-shrink-0 mt-1">
                    {completedItems.has(item.id) ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <item.icon className={`w-5 h-5 ${item.critical ? 'text-red-400' : 'text-purple-400'}`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${completedItems.has(item.id) ? 'text-green-200 line-through' : 'text-white'}`}>
                      {item.text}
                    </p>
                    {item.critical && (
                      <p className="text-xs text-red-300 mt-1">Critical - Must complete</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Completion Button */}
      <div className="text-center">
        <button
          onClick={handleComplete}
          disabled={!getCriticalItemsCompleted()}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            getCriticalItemsCompleted()
              ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {getCriticalItemsCompleted() ? '✅ Safety Checklist Complete' : '⚠️ Complete Critical Items First'}
        </button>
      </div>

      {/* Warning */}
      <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-yellow-200 font-semibold mb-1">Important Safety Notice</h4>
            <p className="text-yellow-100 text-sm">
              This checklist is a general guide. Always prioritize your safety and the safety of all participants. 
              If you're unsure about any aspect, seek professional guidance or reconsider the activity.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SafetyChecklist
