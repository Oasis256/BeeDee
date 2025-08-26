import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Settings, Users, Zap, Heart, Target, Star, Plus, Save, Database, Trash2, CheckCircle, AlertCircle, Edit } from 'lucide-react'
import apiService from '../utils/api'

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
  const [customScenario, setCustomScenario] = useState({
    name: '',
    description: '',
    roles: [],
    roleAssignments: {}, // { 'Submissive': 'User Name 1', 'Dominant': 'User Name 2' }
    intensity: 'medium',
    duration: 'medium',
    difficulty: 'beginner',
    category: 'power-exchange',
    safety: [],
    equipment: [],
    steps: [],
    safetyLevel: 'moderate'
  })

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
        // Reset form and reload scenarios
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
        await loadSavedScenarios()
        showMessage('success', 'Custom scenario saved successfully!')
      }
    } catch (error) {
      console.error('Error saving scenario:', error)
      showMessage('error', 'Error saving scenario. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const saveSuggestedScenario = async (scenario) => {
    try {
      setLoading(true)
      const testIds = results.map(r => r.id)
      const scenarioData = {
        ...scenario,
        testIds,
        isCustom: false
      }
      
      const response = await apiService.saveScenario(scenarioData)
      if (response.success) {
        await loadSavedScenarios()
        showMessage('success', 'Scenario saved successfully!')
      }
    } catch (error) {
      console.error('Error saving scenario:', error)
      showMessage('error', 'Error saving scenario. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const confirmDeleteScenario = (scenarioId) => {
    setScenarioToDelete(scenarioId)
    setShowDeleteConfirm(true)
  }

  const deleteScenario = async () => {
    if (!scenarioToDelete) return

    try {
      setLoading(true)
      await apiService.deleteScenario(scenarioToDelete)
      await loadSavedScenarios()
      showMessage('success', 'Scenario deleted successfully!')
    } catch (error) {
      console.error('Error deleting scenario:', error)
      showMessage('error', 'Error deleting scenario. Please try again.')
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

  const editScenario = (scenario) => {
    setEditingScenario(scenario)
    setCustomScenario({
      name: scenario.name,
      description: scenario.description,
      roles: scenario.roles || [],
      intensity: scenario.intensity || 'medium',
      duration: scenario.duration || 'medium',
      category: scenario.category || 'power-exchange',
      roleAssignments: scenario.roleAssignments || {},
      difficulty: scenario.difficulty || 'intermediate',
      equipment: scenario.equipment || [],
      steps: scenario.steps || [],
      safety: scenario.safety || [],
      safetyLevel: scenario.safetyLevel || 'moderate'
    })
  }

  const updateScenario = async () => {
    if (!editingScenario) return
    
    try {
      setLoading(true)
      const updatedScenario = {
        ...customScenario,
        id: editingScenario.id,
        testIds: results.map(r => r.id)
      }
      
      await apiService.updateScenario(editingScenario.id, updatedScenario)
      showMessage('success', 'Scenario updated successfully!')
      setEditingScenario(null)
      await loadSavedScenarios()
      
      // Reset custom scenario form
      setCustomScenario({
        name: '',
        description: '',
        roles: [],
        intensity: 'medium',
        duration: 'medium',
        category: 'power-exchange',
        roleAssignments: {},
        difficulty: 'intermediate',
        equipment: [],
        steps: [],
        safety: [],
        safetyLevel: 'moderate'
      })
    } catch (error) {
      console.error('Error updating scenario:', error)
      showMessage('error', 'Failed to update scenario')
    } finally {
      setLoading(false)
    }
  }

  const cancelEdit = () => {
    setEditingScenario(null)
    setCustomScenario({
      name: '',
      description: '',
      roles: [],
      intensity: 'medium',
      duration: 'medium',
      category: 'power-exchange',
      roleAssignments: {},
      difficulty: 'intermediate',
      equipment: [],
      steps: [],
      safety: [],
      safetyLevel: 'moderate'
    })
  }

  // Scenario Templates
  const scenarioTemplates = [
    // BEGINNER SCENARIOS
    {
      id: 'first-time-bondage',
      name: 'First Time Bondage',
      description: 'A gentle introduction to bondage for beginners',
      category: 'bondage',
      intensity: 'low',
      duration: 'short',
      difficulty: 'beginner',
      safetyLevel: 'low',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Soft rope or scarves', 'Safety scissors'],
      steps: [
        'Start with simple wrist binding',
        'Use soft materials only',
        'Keep sessions short (15-20 minutes)',
        'Check circulation frequently',
        'Have safety scissors nearby'
      ],
      safety: ['Safe words', 'Regular check-ins', 'Easy release', 'No suspension']
    },
    {
      id: 'romantic-evening',
      name: 'Romantic Evening',
      description: 'A sensual and intimate evening focused on connection',
      category: 'power-exchange',
      intensity: 'low',
      duration: 'long',
      difficulty: 'beginner',
      safetyLevel: 'low',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Candles', 'Massage oil', 'Soft music'],
      steps: [
        'Set the mood with candles and music',
        'Start with gentle massage',
        'Build intimacy gradually',
        'Focus on emotional connection',
        'End with cuddling and aftercare'
      ],
      safety: ['Emotional safety', 'Clear boundaries', 'Gentle care', 'Aftercare']
    },
    {
      id: 'caregiver-date',
      name: 'Caregiver Date',
      description: 'A nurturing and caring dynamic for emotional connection',
      category: 'caregiver',
      intensity: 'low',
      duration: 'long',
      difficulty: 'beginner',
      safetyLevel: 'low',
      roles: ['Little', 'Daddy/Mommy'],
      equipment: ['Comfortable clothes', 'Snacks', 'Activities'],
      steps: [
        'Create a safe, comfortable space',
        'Engage in gentle activities',
        'Provide emotional support',
        'Maintain clear boundaries',
        'End with gentle aftercare'
      ],
      safety: ['Emotional safety', 'Clear roles', 'Gentle care', 'No pressure']
    },
    {
      id: 'sensory-exploration',
      name: 'Sensory Exploration',
      description: 'Discover new sensations through touch, taste, and sound',
      category: 'sensory',
      intensity: 'low',
      duration: 'medium',
      difficulty: 'beginner',
      safetyLevel: 'low',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Blindfold', 'Feathers', 'Ice cubes', 'Warm oil'],
      steps: [
        'Blindfold the submissive',
        'Use different textures and temperatures',
        'Vary pressure and speed',
        'Ask for feedback on sensations',
        'End with gentle aftercare'
      ],
      safety: ['Safe words', 'Temperature awareness', 'Gentle pressure', 'Communication']
    },
    {
      id: 'role-play-basics',
      name: 'Role Play Basics',
      description: 'Simple role-playing scenarios for beginners',
      category: 'role-play',
      intensity: 'low',
      duration: 'medium',
      difficulty: 'beginner',
      safetyLevel: 'low',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Costumes (optional)', 'Props (optional)'],
      steps: [
        'Choose simple roles (teacher/student, boss/employee)',
        'Set clear boundaries and limits',
        'Start with verbal role-play',
        'Gradually add physical elements',
        'Maintain character throughout'
      ],
      safety: ['Clear boundaries', 'Safe words', 'Consent check-ins', 'Easy exit']
    },

    // INTERMEDIATE SCENARIOS
    {
      id: 'impact-introduction',
      name: 'Impact Introduction',
      description: 'Safe introduction to impact play for beginners',
      category: 'impact-play',
      intensity: 'medium',
      duration: 'short',
      difficulty: 'intermediate',
      safetyLevel: 'moderate',
      roles: ['Masochist', 'Sadist'],
      equipment: ['Hands only', 'Safe words established'],
      steps: [
        'Start with hands only',
        'Begin with gentle spanking',
        'Gradually increase intensity',
        'Check in frequently',
        'Provide thorough aftercare'
      ],
      safety: ['Safe words', 'Gradual intensity', 'Aftercare', 'No implements yet']
    },
    {
      id: 'rope-bondage-basic',
      name: 'Basic Rope Bondage',
      description: 'Introduction to rope work with simple ties',
      category: 'bondage',
      intensity: 'medium',
      duration: 'medium',
      difficulty: 'intermediate',
      safetyLevel: 'moderate',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Cotton rope', 'Safety scissors', 'Rope cutter'],
      steps: [
        'Learn basic single column tie',
        'Practice on yourself first',
        'Start with wrist binding',
        'Check circulation every 10 minutes',
        'Have multiple safety tools nearby'
      ],
      safety: ['Rope safety', 'Circulation checks', 'Safety tools', 'Proper technique']
    },
    {
      id: 'power-exchange-dynamic',
      name: 'Power Exchange Dynamic',
      description: 'Exploring dominance and submission in daily activities',
      category: 'power-exchange',
      intensity: 'medium',
      duration: 'long',
      difficulty: 'intermediate',
      safetyLevel: 'moderate',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Collar (optional)', 'Rules list', 'Journal'],
      steps: [
        'Establish clear rules and expectations',
        'Set up daily protocols',
        'Create accountability system',
        'Regular check-ins and communication',
        'Maintain balance and consent'
      ],
      safety: ['Clear communication', 'Regular check-ins', 'Flexible boundaries', 'Consent']
    },
    {
      id: 'sensory-deprivation',
      name: 'Sensory Deprivation',
      description: 'Exploring sensation through deprivation and enhancement',
      category: 'sensory',
      intensity: 'medium',
      duration: 'medium',
      difficulty: 'intermediate',
      safetyLevel: 'moderate',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Blindfold', 'Earplugs', 'Restraints', 'Various textures'],
      steps: [
        'Start with single sense deprivation',
        'Gradually add more deprivation',
        'Enhance remaining senses',
        'Maintain communication',
        'Provide gentle reintroduction to senses'
      ],
      safety: ['Gradual deprivation', 'Communication', 'Safe words', 'Gentle reintroduction']
    },
    {
      id: 'pet-play-basics',
      name: 'Pet Play Basics',
      description: 'Introduction to animal role-play dynamics',
      category: 'pet-play',
      intensity: 'medium',
      duration: 'medium',
      difficulty: 'intermediate',
      safetyLevel: 'moderate',
      roles: ['Pet', 'Owner'],
      equipment: ['Collar', 'Leash', 'Pet toys', 'Treats'],
      steps: [
        'Establish pet persona and behaviors',
        'Set up training commands',
        'Create safe play environment',
        'Practice basic commands',
        'End with positive reinforcement'
      ],
      safety: ['Clear roles', 'Safe environment', 'Positive reinforcement', 'Consent']
    },
    {
      id: 'degradation-light',
      name: 'Light Degradation',
      description: 'Mild verbal and psychological play',
      category: 'psychological',
      intensity: 'medium',
      duration: 'short',
      difficulty: 'intermediate',
      safetyLevel: 'moderate',
      roles: ['Degradee', 'Degrader'],
      equipment: ['Safe words', 'Aftercare items'],
      steps: [
        'Establish clear boundaries',
        'Start with mild language',
        'Check in frequently',
        'Provide positive reinforcement',
        'End with thorough aftercare'
      ],
      safety: ['Clear boundaries', 'Frequent check-ins', 'Aftercare', 'Consent']
    },
    {
      id: 'age-play-basics',
      name: 'Age Play Basics',
      description: 'Gentle age regression and caregiving dynamics',
      category: 'age-play',
      intensity: 'low',
      duration: 'long',
      difficulty: 'intermediate',
      safetyLevel: 'moderate',
      roles: ['Little', 'Caregiver'],
      equipment: ['Comfort items', 'Activities', 'Snacks'],
      steps: [
        'Establish age range and persona',
        'Create safe, nurturing environment',
        'Engage in age-appropriate activities',
        'Maintain clear boundaries',
        'Provide gentle aftercare'
      ],
      safety: ['Clear boundaries', 'Safe environment', 'Gentle care', 'Consent']
    },

    // ADVANCED SCENARIOS
    {
      id: 'advanced-bondage',
      name: 'Advanced Bondage',
      description: 'Complex rope work and suspension preparation',
      category: 'bondage',
      intensity: 'high',
      duration: 'long',
      difficulty: 'advanced',
      safetyLevel: 'high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Multiple rope types', 'Suspension rig', 'Safety equipment'],
      steps: [
        'Master basic ties thoroughly',
        'Learn suspension safety',
        'Practice with spotter present',
        'Check all connections',
        'Have emergency plan ready'
      ],
      safety: ['Advanced training', 'Spotter required', 'Emergency plan', 'Proper equipment']
    },
    {
      id: 'intense-impact',
      name: 'Intense Impact Play',
      description: 'Advanced impact play with multiple implements',
      category: 'impact-play',
      intensity: 'high',
      duration: 'medium',
      difficulty: 'advanced',
      safetyLevel: 'high',
      roles: ['Masochist', 'Sadist'],
      equipment: ['Multiple implements', 'First aid kit', 'Aftercare items'],
      steps: [
        'Warm up thoroughly',
        'Use multiple implements',
        'Monitor skin condition',
        'Provide intense aftercare',
        'Check for bruising and damage'
      ],
      safety: ['Proper warm-up', 'Skin monitoring', 'Intense aftercare', 'Medical awareness']
    },
    {
      id: 'total-power-exchange',
      name: 'Total Power Exchange',
      description: 'Complete dominance and submission dynamic',
      category: 'power-exchange',
      intensity: 'high',
      duration: 'very-long',
      difficulty: 'advanced',
      safetyLevel: 'high',
      roles: ['Slave', 'Master/Mistress'],
      equipment: ['Collar', 'Rules', 'Protocols', 'Communication tools'],
      steps: [
        'Establish complete protocols',
        'Set up 24/7 dynamic',
        'Create accountability systems',
        'Regular deep check-ins',
        'Maintain safety and consent'
      ],
      safety: ['Complete communication', 'Regular check-ins', 'Safety protocols', 'Consent']
    },
    {
      id: 'primal-play',
      name: 'Primal Play',
      description: 'Raw, animalistic play with hunting and capture',
      category: 'primal',
      intensity: 'high',
      duration: 'medium',
      difficulty: 'advanced',
      safetyLevel: 'high',
      roles: ['Prey', 'Hunter'],
      equipment: ['Safe space', 'Protective gear', 'First aid kit'],
      steps: [
        'Establish safe boundaries',
        'Create hunting environment',
        'Practice safe capture',
        'Monitor intensity levels',
        'Provide thorough aftercare'
      ],
      safety: ['Safe environment', 'Protective gear', 'Intensity monitoring', 'Aftercare']
    },
    {
      id: 'sensory-overload',
      name: 'Sensory Overload',
      description: 'Intense sensory stimulation and deprivation',
      category: 'sensory',
      intensity: 'high',
      duration: 'short',
      difficulty: 'advanced',
      safetyLevel: 'high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Multiple sensory tools', 'Restraints', 'Safety equipment'],
      steps: [
        'Gradual sensory build-up',
        'Monitor submissive response',
        'Provide safe words',
        'Control intensity carefully',
        'Gentle sensory reintroduction'
      ],
      safety: ['Gradual build-up', 'Response monitoring', 'Safe words', 'Gentle reintroduction']
    },

    // SPECIALTY SCENARIOS
    {
      id: 'medical-play',
      name: 'Medical Play',
      description: 'Role-play involving medical scenarios',
      category: 'role-play',
      intensity: 'medium',
      duration: 'medium',
      difficulty: 'advanced',
      safetyLevel: 'high',
      roles: ['Patient', 'Doctor/Nurse'],
      equipment: ['Medical props', 'Safe implements', 'Aftercare items'],
      steps: [
        'Establish medical scenario',
        'Use safe, clean implements',
        'Maintain medical role',
        'Provide thorough aftercare',
        'Check for any real medical issues'
      ],
      safety: ['Clean implements', 'Medical awareness', 'Aftercare', 'Safety']
    },
    {
      id: 'exhibitionism-private',
      name: 'Private Exhibitionism',
      description: 'Exhibitionism in controlled, private settings',
      category: 'exhibitionism',
      intensity: 'medium',
      duration: 'short',
      difficulty: 'intermediate',
      safetyLevel: 'moderate',
      roles: ['Exhibitionist', 'Observer'],
      equipment: ['Private space', 'Consent from all parties'],
      steps: [
        'Ensure complete privacy',
        'Get consent from all involved',
        'Set clear boundaries',
        'Maintain safety protocols',
        'Provide aftercare'
      ],
      safety: ['Complete privacy', 'Full consent', 'Clear boundaries', 'Safety']
    },
    {
      id: 'voyeurism-controlled',
      name: 'Controlled Voyeurism',
      description: 'Watching others in consensual, controlled settings',
      category: 'voyeurism',
      intensity: 'low',
      duration: 'medium',
      difficulty: 'intermediate',
      safetyLevel: 'moderate',
      roles: ['Voyeur', 'Performer'],
      equipment: ['Private space', 'Consent from all parties'],
      steps: [
        'Ensure complete privacy',
        'Get consent from all involved',
        'Set clear boundaries',
        'Maintain safety protocols',
        'Provide aftercare'
      ],
      safety: ['Complete privacy', 'Full consent', 'Clear boundaries', 'Safety']
    },
    {
      id: 'breath-play-light',
      name: 'Light Breath Play',
      description: 'Very mild breath restriction play',
      category: 'breath-play',
      intensity: 'high',
      duration: 'very-short',
      difficulty: 'advanced',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Hands only', 'Safety monitoring'],
      steps: [
        'Use hands only, no implements',
        'Very short duration (seconds)',
        'Constant monitoring',
        'Immediate release on signal',
        'Thorough aftercare'
      ],
      safety: ['Hands only', 'Very short duration', 'Constant monitoring', 'Immediate release']
    },
    {
      id: 'temperature-play',
      name: 'Temperature Play',
      description: 'Exploring sensations with hot and cold',
      category: 'sensory',
      intensity: 'medium',
      duration: 'medium',
      difficulty: 'intermediate',
      safetyLevel: 'moderate',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Ice cubes', 'Warm oil', 'Temperature-safe items'],
      steps: [
        'Test temperature on yourself first',
        'Use safe temperature ranges',
        'Monitor skin response',
        'Avoid extreme temperatures',
        'Provide aftercare'
      ],
      safety: ['Temperature testing', 'Safe ranges', 'Skin monitoring', 'Aftercare']
    },
    {
      id: 'electro-stimulation',
      name: 'Electro-Stimulation',
      description: 'Using electrical stimulation devices safely',
      category: 'sensory',
      intensity: 'high',
      duration: 'short',
      difficulty: 'advanced',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Safe electro-stim devices', 'Safety instructions'],
      steps: [
        'Read all safety instructions',
        'Start with lowest settings',
        'Test on yourself first',
        'Monitor response carefully',
        'Provide aftercare'
      ],
      safety: ['Safety instructions', 'Lowest settings', 'Self-testing', 'Monitoring']
    },
    {
      id: 'wax-play',
      name: 'Wax Play',
      description: 'Using candle wax for sensory stimulation',
      category: 'sensory',
      intensity: 'medium',
      duration: 'short',
      difficulty: 'intermediate',
      safetyLevel: 'moderate',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Body-safe candles', 'Safety equipment'],
      steps: [
        'Use body-safe candles only',
        'Test temperature on yourself',
        'Start with higher drops',
        'Monitor skin response',
        'Provide aftercare'
      ],
      safety: ['Body-safe candles', 'Temperature testing', 'Skin monitoring', 'Aftercare']
    },
    {
      id: 'knife-play',
      name: 'Knife Play',
      description: 'Sensation play with dull blades',
      category: 'sensory',
      intensity: 'high',
      duration: 'short',
      difficulty: 'advanced',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Dull blades only', 'Safety equipment'],
      steps: [
        'Use dull blades only',
        'Test on yourself first',
        'Avoid sensitive areas',
        'Monitor skin response',
        'Provide aftercare'
      ],
      safety: ['Dull blades only', 'Self-testing', 'Safe areas', 'Monitoring']
    },
    {
      id: 'fire-play',
      name: 'Fire Play',
      description: 'Controlled fire play with safety equipment',
      category: 'sensory',
      intensity: 'high',
      duration: 'short',
      difficulty: 'advanced',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Fire safety equipment', 'Fire extinguisher'],
      steps: [
        'Use proper safety equipment',
        'Have fire extinguisher nearby',
        'Test techniques thoroughly',
        'Monitor constantly',
        'Provide aftercare'
      ],
      safety: ['Safety equipment', 'Fire extinguisher', 'Thorough testing', 'Constant monitoring']
    },
    {
      id: 'needle-play',
      name: 'Needle Play',
      description: 'Body piercing and needle play',
      category: 'body-modification',
      intensity: 'high',
      duration: 'short',
      difficulty: 'advanced',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Sterile needles', 'Safety equipment'],
      steps: [
        'Use sterile equipment only',
        'Proper sterilization procedures',
        'Avoid dangerous areas',
        'Monitor for infection',
        'Provide aftercare'
      ],
      safety: ['Sterile equipment', 'Proper sterilization', 'Safe areas', 'Infection monitoring']
    },
    {
      id: 'branding-play',
      name: 'Branding Play',
      description: 'Temporary marking and branding',
      category: 'body-modification',
      intensity: 'high',
      duration: 'short',
      difficulty: 'advanced',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Safe branding tools', 'Safety equipment'],
      steps: [
        'Use safe branding tools',
        'Test on yourself first',
        'Avoid dangerous areas',
        'Monitor healing process',
        'Provide aftercare'
      ],
      safety: ['Safe tools', 'Self-testing', 'Safe areas', 'Healing monitoring']
    },
    {
      id: 'suspension-bondage',
      name: 'Suspension Bondage',
      description: 'Advanced rope suspension work',
      category: 'bondage',
      intensity: 'high',
      duration: 'medium',
      difficulty: 'advanced',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Suspension rig', 'Safety equipment', 'Spotter'],
      steps: [
        'Master ground bondage first',
        'Use proper suspension rig',
        'Have spotter present',
        'Check all connections',
        'Provide aftercare'
      ],
      safety: ['Ground bondage mastery', 'Proper rig', 'Spotter required', 'Connection checks']
    },
    {
      id: 'water-play',
      name: 'Water Play',
      description: 'Sensation play with water and liquids',
      category: 'sensory',
      intensity: 'medium',
      duration: 'short',
      difficulty: 'intermediate',
      safetyLevel: 'moderate',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Safe liquids', 'Protection', 'Clean-up supplies'],
      steps: [
        'Use body-safe liquids only',
        'Protect sensitive areas',
        'Have clean-up supplies ready',
        'Monitor skin response',
        'Provide aftercare'
      ],
      safety: ['Body-safe liquids', 'Protection', 'Clean-up ready', 'Skin monitoring']
    },
    {
      id: 'food-play',
      name: 'Food Play',
      description: 'Sensual play with food items',
      category: 'sensory',
      intensity: 'low',
      duration: 'medium',
      difficulty: 'beginner',
      safetyLevel: 'low',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Body-safe foods', 'Clean-up supplies'],
      steps: [
        'Use body-safe foods only',
        'Avoid sensitive areas',
        'Have clean-up supplies ready',
        'Monitor for allergies',
        'Provide aftercare'
      ],
      safety: ['Body-safe foods', 'Safe areas', 'Clean-up ready', 'Allergy awareness']
    },
    {
      id: 'massage-sensual',
      name: 'Sensual Massage',
      description: 'Intimate massage with sensual elements',
      category: 'sensory',
      intensity: 'low',
      duration: 'long',
      difficulty: 'beginner',
      safetyLevel: 'low',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Massage oil', 'Towels', 'Comfortable surface'],
      steps: [
        'Create comfortable environment',
        'Use appropriate massage oil',
        'Focus on sensual areas',
        'Maintain communication',
        'Provide aftercare'
      ],
      safety: ['Comfortable environment', 'Appropriate oil', 'Communication', 'Aftercare']
    },
    {
      id: 'dance-sensual',
      name: 'Sensual Dance',
      description: 'Intimate dancing and movement',
      category: 'sensory',
      intensity: 'low',
      duration: 'medium',
      difficulty: 'beginner',
      safetyLevel: 'low',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Music', 'Comfortable space', 'Optional costumes'],
      steps: [
        'Choose appropriate music',
        'Create comfortable space',
        'Start with simple movements',
        'Build intimacy gradually',
        'End with connection'
      ],
      safety: ['Appropriate music', 'Comfortable space', 'Gradual build-up', 'Connection']
    },
    {
      id: 'photography-artistic',
      name: 'Artistic Photography',
      description: 'Tasteful, artistic nude photography',
      category: 'exhibitionism',
      intensity: 'low',
      duration: 'medium',
      difficulty: 'intermediate',
      safetyLevel: 'moderate',
      roles: ['Model', 'Photographer'],
      equipment: ['Camera', 'Private space', 'Consent agreement'],
      steps: [
        'Ensure complete privacy',
        'Get written consent',
        'Set clear boundaries',
        'Focus on artistic quality',
        'Respect privacy and consent'
      ],
      safety: ['Complete privacy', 'Written consent', 'Clear boundaries', 'Privacy respect']
    },
    {
      id: 'writing-erotic',
      name: 'Erotic Writing',
      description: 'Collaborative erotic story writing',
      category: 'psychological',
      intensity: 'low',
      duration: 'long',
      difficulty: 'beginner',
      safetyLevel: 'low',
      roles: ['Writer', 'Collaborator'],
      equipment: ['Writing materials', 'Privacy'],
      steps: [
        'Establish writing boundaries',
        'Collaborate on story elements',
        'Respect each other\'s limits',
        'Share and discuss content',
        'Maintain creative connection'
      ],
      safety: ['Writing boundaries', 'Collaboration', 'Respect limits', 'Creative connection']
    },
    {
      id: 'fantasy-exploration',
      name: 'Fantasy Exploration',
      description: 'Exploring sexual fantasies together',
      category: 'psychological',
      intensity: 'medium',
      duration: 'long',
      difficulty: 'intermediate',
      safetyLevel: 'moderate',
      roles: ['Explorer', 'Partner'],
      equipment: ['Privacy', 'Communication tools'],
      steps: [
        'Create safe space for sharing',
        'Share fantasies gradually',
        'Discuss boundaries and limits',
        'Explore feasible elements',
        'Maintain open communication'
      ],
      safety: ['Safe space', 'Gradual sharing', 'Boundary discussion', 'Open communication']
    },
    {
      id: 'ritual-creation',
      name: 'Ritual Creation',
      description: 'Creating meaningful BDSM rituals',
      category: 'psychological',
      intensity: 'medium',
      duration: 'long',
      difficulty: 'advanced',
      safetyLevel: 'moderate',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Ritual items', 'Symbolic objects'],
      steps: [
        'Design meaningful rituals',
        'Incorporate symbolic elements',
        'Practice regularly',
        'Maintain significance',
        'Adapt as needed'
      ],
      safety: ['Meaningful design', 'Symbolic elements', 'Regular practice', 'Adaptation']
    },
    {
      id: 'protocol-establishment',
      name: 'Protocol Establishment',
      description: 'Setting up formal protocols and rules',
      category: 'power-exchange',
      intensity: 'medium',
      duration: 'very-long',
      difficulty: 'advanced',
      safetyLevel: 'moderate',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Written protocols', 'Communication tools'],
      steps: [
        'Design formal protocols',
        'Write clear rules',
        'Establish accountability',
        'Regular protocol review',
        'Maintain flexibility'
      ],
      safety: ['Formal design', 'Clear rules', 'Accountability', 'Regular review']
    },
    {
      id: 'training-program',
      name: 'Training Program',
      description: 'Structured training and development program',
      category: 'power-exchange',
      intensity: 'high',
      duration: 'very-long',
      difficulty: 'advanced',
      safetyLevel: 'high',
      roles: ['Trainee', 'Trainer'],
      equipment: ['Training materials', 'Progress tracking'],
      steps: [
        'Design training curriculum',
        'Set clear objectives',
        'Track progress regularly',
        'Provide feedback',
        'Maintain motivation'
      ],
      safety: ['Curriculum design', 'Clear objectives', 'Progress tracking', 'Feedback']
    },
    {
      id: 'discipline-system',
      name: 'Discipline System',
      description: 'Establishing rules and consequences',
      category: 'power-exchange',
      intensity: 'medium',
      duration: 'very-long',
      difficulty: 'advanced',
      safetyLevel: 'moderate',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Rule book', 'Tracking system'],
      steps: [
        'Establish clear rules',
        'Define consequences',
        'Create tracking system',
        'Maintain consistency',
        'Regular review and adjustment'
      ],
      safety: ['Clear rules', 'Defined consequences', 'Tracking system', 'Consistency']
    },
    {
      id: 'reward-system',
      name: 'Reward System',
      description: 'Positive reinforcement and reward structure',
      category: 'power-exchange',
      intensity: 'low',
      duration: 'very-long',
      difficulty: 'intermediate',
      safetyLevel: 'low',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Reward tracking', 'Positive reinforcement items'],
      steps: [
        'Design reward structure',
        'Set achievable goals',
        'Track accomplishments',
        'Provide positive reinforcement',
        'Maintain motivation'
      ],
      safety: ['Reward structure', 'Achievable goals', 'Accomplishment tracking', 'Motivation']
    },
    {
      id: 'communication-workshop',
      name: 'Communication Workshop',
      description: 'Improving BDSM communication skills',
      category: 'psychological',
      intensity: 'low',
      duration: 'long',
      difficulty: 'beginner',
      safetyLevel: 'low',
      roles: ['Partner 1', 'Partner 2'],
      equipment: ['Communication tools', 'Privacy'],
      steps: [
        'Practice active listening',
        'Use "I" statements',
        'Share feelings openly',
        'Practice negotiation skills',
        'Build trust through communication'
      ],
      safety: ['Active listening', 'I statements', 'Open sharing', 'Negotiation practice']
    },
    {
      id: 'negotiation-practice',
      name: 'Negotiation Practice',
      description: 'Practicing BDSM negotiation skills',
      category: 'psychological',
      intensity: 'low',
      duration: 'medium',
      difficulty: 'intermediate',
      safetyLevel: 'low',
      roles: ['Negotiator 1', 'Negotiator 2'],
      equipment: ['Negotiation tools', 'Privacy'],
      steps: [
        'Set up negotiation scenario',
        'Practice clear communication',
        'Discuss boundaries and limits',
        'Reach mutual agreement',
        'Document agreements'
      ],
      safety: ['Negotiation scenario', 'Clear communication', 'Boundary discussion', 'Agreement documentation']
    },
    {
      id: 'aftercare-focus',
      name: 'Aftercare Focus',
      description: 'Dedicated aftercare and recovery session',
      category: 'care',
      intensity: 'low',
      duration: 'long',
      difficulty: 'beginner',
      safetyLevel: 'low',
      roles: ['Care Receiver', 'Care Giver'],
      equipment: ['Comfort items', 'Hydration', 'Snacks'],
      steps: [
        'Create comfortable environment',
        'Provide physical comfort',
        'Offer emotional support',
        'Monitor well-being',
        'Allow adequate recovery time'
      ],
      safety: ['Comfortable environment', 'Physical comfort', 'Emotional support', 'Recovery time']
    },
    {
      id: 'check-in-ritual',
      name: 'Check-in Ritual',
      description: 'Regular relationship and dynamic check-ins',
      category: 'care',
      intensity: 'low',
      duration: 'medium',
      difficulty: 'beginner',
      safetyLevel: 'low',
      roles: ['Partner 1', 'Partner 2'],
      equipment: ['Communication tools', 'Privacy'],
      steps: [
        'Schedule regular check-ins',
        'Create safe space for sharing',
        'Discuss relationship status',
        'Address concerns openly',
        'Plan for future growth'
      ],
      safety: ['Regular scheduling', 'Safe space', 'Open discussion', 'Future planning']
    },

    // EXTREME INTENSITY SCENARIOS
    {
      id: 'extreme-bondage-suspension',
      name: 'Extreme Bondage Suspension',
      description: 'Advanced suspension with complex rope work and extreme positions',
      category: 'bondage',
      intensity: 'extreme',
      duration: 'long',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant', 'Spotter'],
      equipment: ['Professional suspension rig', 'Multiple rope types', 'Safety equipment', 'Medical kit'],
      steps: [
        'Complete advanced rope training',
        'Set up professional suspension rig',
        'Have multiple spotters present',
        'Use complex suspension techniques',
        'Monitor vital signs throughout',
        'Have emergency plan ready'
      ],
      safety: ['Expert training required', 'Multiple spotters', 'Vital sign monitoring', 'Emergency plan']
    },
    {
      id: 'extreme-impact-marathon',
      name: 'Extreme Impact Marathon',
      description: 'Prolonged, intense impact play with multiple implements and techniques',
      category: 'impact-play',
      intensity: 'extreme',
      duration: 'very-long',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Masochist', 'Sadist'],
      equipment: ['Multiple impact implements', 'Medical kit', 'Aftercare supplies', 'Monitoring equipment'],
      steps: [
        'Extensive warm-up period',
        'Use multiple implements in rotation',
        'Monitor skin condition constantly',
        'Provide breaks and hydration',
        'Intense aftercare and medical monitoring',
        'Check for serious injury'
      ],
      safety: ['Extensive warm-up', 'Constant monitoring', 'Regular breaks', 'Medical monitoring']
    },
    {
      id: 'extreme-sensory-overload',
      name: 'Extreme Sensory Overload',
      description: 'Maximum sensory stimulation with deprivation and intense sensations',
      category: 'sensory',
      intensity: 'extreme',
      duration: 'medium',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Multiple sensory tools', 'Restraints', 'Medical monitoring', 'Safety equipment'],
      steps: [
        'Gradual sensory build-up',
        'Combine multiple sensations',
        'Monitor psychological state',
        'Provide safe words and signals',
        'Gentle sensory reintroduction',
        'Intense psychological aftercare'
      ],
      safety: ['Gradual build-up', 'Psychological monitoring', 'Multiple safe words', 'Intense aftercare']
    },
    {
      id: 'extreme-power-exchange',
      name: 'Extreme Power Exchange',
      description: 'Complete surrender and total dominance with extreme protocols',
      category: 'power-exchange',
      intensity: 'extreme',
      duration: 'very-long',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Slave', 'Master/Mistress'],
      equipment: ['Protocols', 'Communication tools', 'Monitoring systems', 'Safety equipment'],
      steps: [
        'Establish extreme protocols',
        'Complete surrender of control',
        '24/7 monitoring and control',
        'Regular psychological check-ins',
        'Maintain safety and consent',
        'Provide intensive aftercare'
      ],
      safety: ['Extreme protocols', '24/7 monitoring', 'Psychological check-ins', 'Intensive aftercare']
    },
    {
      id: 'extreme-primal-hunt',
      name: 'Extreme Primal Hunt',
      description: 'Intense primal play with full hunting and capture scenarios',
      category: 'primal',
      intensity: 'extreme',
      duration: 'long',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Prey', 'Hunter'],
      equipment: ['Safe hunting environment', 'Protective gear', 'Medical kit', 'Safety equipment'],
      steps: [
        'Create extensive hunting environment',
        'Full primal mindset engagement',
        'Intense chase and capture',
        'Monitor physical exertion',
        'Provide intensive aftercare',
        'Check for injuries'
      ],
      safety: ['Extensive environment', 'Physical monitoring', 'Intensive aftercare', 'Injury checking']
    },
    {
      id: 'extreme-degradation',
      name: 'Extreme Degradation',
      description: 'Intense psychological and verbal degradation play',
      category: 'psychological',
      intensity: 'extreme',
      duration: 'medium',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Degradee', 'Degrader'],
      equipment: ['Safe words', 'Aftercare supplies', 'Psychological support'],
      steps: [
        'Establish extreme boundaries',
        'Intense verbal degradation',
        'Psychological manipulation',
        'Constant monitoring of mental state',
        'Provide intensive psychological aftercare',
        'Check for psychological impact'
      ],
      safety: ['Extreme boundaries', 'Mental state monitoring', 'Psychological aftercare', 'Impact assessment']
    },
    {
      id: 'extreme-age-play',
      name: 'Extreme Age Play',
      description: 'Deep age regression with complete caregiver dependency',
      category: 'age-play',
      intensity: 'extreme',
      duration: 'very-long',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Little', 'Caregiver'],
      equipment: ['Age-appropriate items', 'Safety equipment', 'Psychological support'],
      steps: [
        'Deep age regression',
        'Complete dependency on caregiver',
        'Intensive nurturing and care',
        'Monitor psychological state',
        'Gradual return to adult mindset',
        'Intensive aftercare'
      ],
      safety: ['Deep regression', 'Psychological monitoring', 'Gradual return', 'Intensive aftercare']
    },
    {
      id: 'extreme-pet-play',
      name: 'Extreme Pet Play',
      description: 'Complete animal transformation with intensive training',
      category: 'pet-play',
      intensity: 'extreme',
      duration: 'very-long',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Pet', 'Owner'],
      equipment: ['Pet equipment', 'Training tools', 'Safety equipment', 'Monitoring systems'],
      steps: [
        'Complete animal transformation',
        'Intensive training protocols',
        'Full pet lifestyle adoption',
        'Monitor psychological state',
        'Gradual return to human mindset',
        'Intensive aftercare'
      ],
      safety: ['Complete transformation', 'Psychological monitoring', 'Gradual return', 'Intensive aftercare']
    },
    {
      id: 'extreme-medical-play',
      name: 'Extreme Medical Play',
      description: 'Intensive medical role-play with advanced procedures',
      category: 'role-play',
      intensity: 'extreme',
      duration: 'long',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Patient', 'Doctor/Nurse'],
      equipment: ['Medical equipment', 'Sterile supplies', 'Safety equipment', 'Medical monitoring'],
      steps: [
        'Advanced medical procedures',
        'Intensive role-play scenarios',
        'Monitor psychological impact',
        'Maintain medical safety',
        'Provide intensive aftercare',
        'Check for psychological effects'
      ],
      safety: ['Advanced procedures', 'Psychological monitoring', 'Medical safety', 'Intensive aftercare']
    },
    {
      id: 'extreme-exhibitionism',
      name: 'Extreme Exhibitionism',
      description: 'High-risk exhibitionism in controlled but public settings',
      category: 'exhibitionism',
      intensity: 'extreme',
      duration: 'short',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Exhibitionist', 'Observer'],
      equipment: ['Risk management tools', 'Safety equipment', 'Legal protection'],
      steps: [
        'Extensive risk assessment',
        'Legal protection measures',
        'Controlled public exposure',
        'Constant safety monitoring',
        'Immediate exit strategies',
        'Intensive aftercare'
      ],
      safety: ['Risk assessment', 'Legal protection', 'Safety monitoring', 'Exit strategies']
    },
    {
      id: 'extreme-voyeurism',
      name: 'Extreme Voyeurism',
      description: 'Intensive voyeuristic experiences in controlled settings',
      category: 'voyeurism',
      intensity: 'extreme',
      duration: 'medium',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Voyeur', 'Performer'],
      equipment: ['Private venues', 'Safety equipment', 'Legal protection', 'Monitoring systems'],
      steps: [
        'Secure private venues',
        'Legal protection measures',
        'Intensive voyeuristic scenarios',
        'Constant safety monitoring',
        'Immediate exit strategies',
        'Intensive aftercare'
      ],
      safety: ['Secure venues', 'Legal protection', 'Safety monitoring', 'Exit strategies']
    },
    {
      id: 'extreme-breath-play',
      name: 'Extreme Breath Play',
      description: 'Advanced breath restriction with multiple techniques',
      category: 'breath-play',
      intensity: 'extreme',
      duration: 'very-short',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Breath play tools', 'Medical monitoring', 'Safety equipment', 'Emergency kit'],
      steps: [
        'Advanced breath techniques',
        'Constant medical monitoring',
        'Immediate release systems',
        'Emergency response plan',
        'Intensive medical aftercare',
        'Check for medical complications'
      ],
      safety: ['Advanced techniques', 'Medical monitoring', 'Immediate release', 'Emergency plan']
    },
    {
      id: 'extreme-temperature-play',
      name: 'Extreme Temperature Play',
      description: 'Intense temperature variations with extreme hot and cold',
      category: 'sensory',
      intensity: 'extreme',
      duration: 'short',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Temperature tools', 'Medical monitoring', 'Safety equipment', 'Emergency kit'],
      steps: [
        'Extreme temperature variations',
        'Constant skin monitoring',
        'Immediate temperature control',
        'Emergency response plan',
        'Intensive medical aftercare',
        'Check for tissue damage'
      ],
      safety: ['Temperature control', 'Skin monitoring', 'Emergency plan', 'Damage assessment']
    },
    {
      id: 'extreme-electro-stimulation',
      name: 'Extreme Electro-Stimulation',
      description: 'Intensive electrical stimulation with advanced devices',
      category: 'sensory',
      intensity: 'extreme',
      duration: 'short',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Advanced electro devices', 'Medical monitoring', 'Safety equipment', 'Emergency kit'],
      steps: [
        'Advanced electro techniques',
        'Constant medical monitoring',
        'Immediate power control',
        'Emergency response plan',
        'Intensive medical aftercare',
        'Check for electrical injury'
      ],
      safety: ['Advanced techniques', 'Medical monitoring', 'Power control', 'Emergency plan']
    },
    {
      id: 'extreme-wax-play',
      name: 'Extreme Wax Play',
      description: 'Intensive wax play with multiple temperatures and techniques',
      category: 'sensory',
      intensity: 'extreme',
      duration: 'medium',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Multiple wax types', 'Medical monitoring', 'Safety equipment', 'Emergency kit'],
      steps: [
        'Multiple wax temperatures',
        'Constant skin monitoring',
        'Immediate temperature control',
        'Emergency response plan',
        'Intensive medical aftercare',
        'Check for burns'
      ],
      safety: ['Temperature control', 'Skin monitoring', 'Emergency plan', 'Burn assessment']
    },
    {
      id: 'extreme-knife-play',
      name: 'Extreme Knife Play',
      description: 'Advanced knife play with multiple techniques and implements',
      category: 'sensory',
      intensity: 'extreme',
      duration: 'short',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Multiple knife types', 'Medical monitoring', 'Safety equipment', 'Emergency kit'],
      steps: [
        'Advanced knife techniques',
        'Constant skin monitoring',
        'Immediate safety control',
        'Emergency response plan',
        'Intensive medical aftercare',
        'Check for cuts'
      ],
      safety: ['Advanced techniques', 'Skin monitoring', 'Safety control', 'Emergency plan']
    },
    {
      id: 'extreme-fire-play',
      name: 'Extreme Fire Play',
      description: 'Intensive fire play with advanced techniques and safety',
      category: 'sensory',
      intensity: 'extreme',
      duration: 'short',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Advanced fire tools', 'Fire safety equipment', 'Medical monitoring', 'Emergency kit'],
      steps: [
        'Advanced fire techniques',
        'Constant safety monitoring',
        'Immediate fire control',
        'Emergency response plan',
        'Intensive medical aftercare',
        'Check for burns'
      ],
      safety: ['Advanced techniques', 'Safety monitoring', 'Fire control', 'Emergency plan']
    },
    {
      id: 'extreme-needle-play',
      name: 'Extreme Needle Play',
      description: 'Advanced body piercing and needle play techniques',
      category: 'body-modification',
      intensity: 'extreme',
      duration: 'medium',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Advanced needles', 'Sterile supplies', 'Medical monitoring', 'Emergency kit'],
      steps: [
        'Advanced piercing techniques',
        'Constant medical monitoring',
        'Immediate medical control',
        'Emergency response plan',
        'Intensive medical aftercare',
        'Check for infection'
      ],
      safety: ['Advanced techniques', 'Medical monitoring', 'Medical control', 'Emergency plan']
    },
    {
      id: 'extreme-branding-play',
      name: 'Extreme Branding Play',
      description: 'Advanced branding and marking techniques',
      category: 'body-modification',
      intensity: 'extreme',
      duration: 'short',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Advanced branding tools', 'Medical monitoring', 'Safety equipment', 'Emergency kit'],
      steps: [
        'Advanced branding techniques',
        'Constant medical monitoring',
        'Immediate medical control',
        'Emergency response plan',
        'Intensive medical aftercare',
        'Check for tissue damage'
      ],
      safety: ['Advanced techniques', 'Medical monitoring', 'Medical control', 'Emergency plan']
    },
    {
      id: 'extreme-water-play',
      name: 'Extreme Water Play',
      description: 'Intensive water and liquid play techniques',
      category: 'sensory',
      intensity: 'extreme',
      duration: 'short',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Submissive', 'Dominant'],
      equipment: ['Advanced water tools', 'Medical monitoring', 'Safety equipment', 'Emergency kit'],
      steps: [
        'Advanced water techniques',
        'Constant medical monitoring',
        'Immediate safety control',
        'Emergency response plan',
        'Intensive medical aftercare',
        'Check for complications'
      ],
      safety: ['Advanced techniques', 'Medical monitoring', 'Safety control', 'Emergency plan']
    },
    {
      id: 'extreme-ritual-play',
      name: 'Extreme Ritual Play',
      description: 'Intensive ritual and ceremonial BDSM experiences',
      category: 'psychological',
      intensity: 'extreme',
      duration: 'very-long',
      difficulty: 'expert',
      safetyLevel: 'very-high',
      roles: ['Participant', 'Ritual Leader'],
      equipment: ['Ritual items', 'Ceremonial tools', 'Safety equipment', 'Psychological support'],
      steps: [
        'Intensive ritual preparation',
        'Deep psychological engagement',
        'Constant psychological monitoring',
        'Immediate psychological support',
        'Intensive psychological aftercare',
        'Check for psychological impact'
      ],
      safety: ['Ritual preparation', 'Psychological monitoring', 'Psychological support', 'Impact assessment']
    }
  ]

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

  // Safety Guide
  const saveSessionLog = () => {
    const sessionData = {
      scenario: activeTimer?.scenario?.name || 'Custom Scenario',
      duration: formatTime(timerTime),
      rating: sessionRating,
      notes: sessionNotes,
      timestamp: new Date().toISOString()
    }
    
    // Save to localStorage for now (could be expanded to database)
    const existingLogs = JSON.parse(localStorage.getItem('scenarioLogs') || '[]')
    existingLogs.push(sessionData)
    localStorage.setItem('scenarioLogs', JSON.stringify(existingLogs))
    
    setShowSessionLog(false)
    setSessionNotes('')
    setSessionRating(0)
    showMessage('success', 'Session log saved successfully!')
  }

  const safetyGuide = {
    'bondage': {
      title: 'Bondage Safety',
      points: [
        'Always have safety scissors nearby',
        'Check circulation every 10-15 minutes',
        'Never leave a bound person alone',
        'Start with simple ties and work up',
        'Learn proper techniques before advanced bondage',
        'Use appropriate materials (avoid thin cords)',
        'Have a safe word and check-in system'
      ]
    },
    'impact-play': {
      title: 'Impact Play Safety',
      points: [
        'Start gentle and build intensity slowly',
        'Avoid sensitive areas (kidneys, spine, face)',
        'Use appropriate implements for your skill level',
        'Check skin condition regularly',
        'Provide thorough aftercare',
        'Learn proper technique before using tools',
        'Establish clear safe words'
      ]
    },
    'power-exchange': {
      title: 'Power Exchange Safety',
      points: [
        'Establish clear boundaries before starting',
        'Use safe words and check-in regularly',
        'Respect limits and consent at all times',
        'Provide emotional aftercare',
        'Communicate openly about expectations',
        'Start with simple protocols',
        'Build trust gradually over time'
      ]
    },
    'general': {
      title: 'General Safety Guidelines',
      points: [
        'Always obtain enthusiastic consent',
        'Establish safe words before any scene',
        'Start slow and build intensity gradually',
        'Provide appropriate aftercare',
        'Communicate openly about boundaries',
        'Never pressure someone into activities',
        'Educate yourself on techniques before trying them'
      ]
    }
  }

  const addRoleToScenario = (role) => {
    if (!customScenario.roles.includes(role)) {
      setCustomScenario({
        ...customScenario,
        roles: [...customScenario.roles, role],
        roleAssignments: {
          ...customScenario.roleAssignments,
          [role]: customScenario.roles.length === 0 ? (results[0]?.testName || 'Partner 1') : (results[1]?.testName || 'Partner 2')
        }
      })
    }
  }

  const removeRoleFromScenario = (role) => {
    setCustomScenario({
      ...customScenario,
      roles: customScenario.roles.filter(r => r !== role),
      roleAssignments: Object.fromEntries(
        Object.entries(customScenario.roleAssignments).filter(([key]) => key !== role)
      )
    })
  }

  const assignRoleToPartner = (role, partner) => {
    setCustomScenario({
      ...customScenario,
      roleAssignments: {
        ...customScenario.roleAssignments,
        [role]: partner
      }
    })
  }

  const addStep = () => {
    setCustomScenario({
      ...customScenario,
      steps: [...customScenario.steps, '']
    })
  }

  const updateStep = (index, value) => {
    const newSteps = [...customScenario.steps]
    newSteps[index] = value
    setCustomScenario({
      ...customScenario,
      steps: newSteps
    })
  }

  const removeStep = (index) => {
    setCustomScenario({
      ...customScenario,
      steps: customScenario.steps.filter((_, i) => i !== index)
    })
  }

  const startScenario = (scenario) => {
    // Convert duration to seconds
    let targetTime = 0
    let isRange = false
    
    if (scenario.duration === 'short') {
      targetTime = 22.5 * 60 // 22.5 minutes (average of 15-30 min range)
      isRange = true
    } else if (scenario.duration === 'medium') {
      targetTime = 45 * 60 // 45 minutes (average of 30-60 min range)
      isRange = true
    } else if (scenario.duration === 'long') {
      targetTime = 90 * 60 // 90 minutes (1.5 hours)
      isRange = true
    } else {
      // For custom durations, use stopwatch mode
      isRange = false
      targetTime = 0
    }
    
    setActiveTimer({
      scenario,
      isRange,
      targetTime,
      startTime: Date.now()
    })
    setTimerTime(0)
    setIsTimerRunning(true)
  }

  const stopTimer = () => {
    setIsTimerRunning(false)
    setActiveTimer(null)
    setTimerTime(0)
    setShowSessionLog(true)
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
  }

  const resumeTimer = () => {
    setIsTimerRunning(true)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

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
      'Degradee': ['Degrager'],
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
            description: 'An exciting day-long exploration where both partners take turns experiencing dominant and submissive roles. This scenario allows you to understand each other\'s perspectives and discover new dynamics. Start with gentle power exchanges and gradually build intensity as you both become comfortable in your alternating roles. Perfect for couples who want to explore both sides of the dynamic spectrum.',
            roles: ['Switch', 'Switch'],
            intensity: 'medium',
            duration: 'long',
            difficulty: 'intermediate',
            safety: ['Safe words', 'Regular check-ins', 'Clear boundaries']
          },
          'Voyeur': {
            name: 'Private Performance',
            description: 'A sensual and intimate scenario where one partner becomes the performer while the other enjoys the role of the captivated audience. The exhibitionist partner can dance, undress, or engage in self-pleasure while the voyeur partner watches with rapt attention. This scenario builds anticipation and creates a unique dynamic of desire and observation. Set the mood with dim lighting and create a comfortable, private space for this intimate performance.',
            roles: ['Voyeur', 'Exhibitionist'],
            intensity: 'low',
            duration: 'medium',
            difficulty: 'beginner',
            safety: ['Consent', 'Privacy', 'Comfort levels']
          },
          'Rope bunny': {
            name: 'Rope Bondage Session',
            description: 'An artistic and intimate bondage experience that combines restraint with aesthetic beauty. The rigger creates intricate patterns and secure bindings while the rope bunny experiences the sensation of being bound and vulnerable. This scenario requires trust, communication, and proper technique. Focus on creating beautiful rope work that is both functional and visually appealing, while maintaining constant awareness of safety and comfort.',
            roles: ['Rope bunny', 'Rigger'],
            intensity: 'medium',
            duration: 'medium',
            difficulty: 'advanced',
            safety: ['Safety scissors', 'Circulation checks', 'Proper knots']
          },
          'Masochist': {
            name: 'Sensation Play',
            description: 'An intense exploration of physical sensations and pain play in a carefully controlled environment. The sadist partner uses various implements and techniques to create different sensations, while the masochist partner experiences the range of feelings from gentle stimulation to more intense sensations. This scenario requires excellent communication, gradual intensity building, and thorough aftercare. Always start gentle and build up slowly, checking in frequently to ensure both partners are comfortable.',
            roles: ['Masochist', 'Sadist'],
            intensity: 'high',
            duration: 'medium',
            difficulty: 'advanced',
            safety: ['Safe words', 'Gradual intensity', 'Aftercare']
          },
          'Brat': {
            name: 'Brat Training',
            description: 'A playful and dynamic scenario where the brat partner intentionally challenges and tests boundaries while the brat tamer responds with creative and fun consequences. This scenario combines discipline with humor and mutual enjoyment. The brat can use sass, backtalk, or playful disobedience to provoke responses, while the brat tamer creates appropriate and enjoyable consequences. This dynamic requires clear communication about boundaries and ensures both partners are having fun throughout the experience.',
            roles: ['Brat', 'Brat tamer'],
            intensity: 'medium',
            duration: 'medium',
            difficulty: 'intermediate',
            safety: ['Clear rules', 'Fun consequences', 'Mutual enjoyment']
          },
          'Daddy/Mommy': {
            name: 'Caregiver Dynamic',
            description: 'A deeply nurturing and emotionally intimate scenario that focuses on care, guidance, and unconditional support. The caregiver partner provides emotional safety, gentle discipline, and loving guidance while the little partner can express their more vulnerable and playful side. This scenario can include activities like coloring, watching cartoons, cuddling, or gentle play. The emphasis is on creating a safe emotional space where both partners can express their needs and feel supported.',
            roles: ['Daddy/Mommy', 'Little'],
            intensity: 'low',
            duration: 'long',
            difficulty: 'beginner',
            safety: ['Emotional safety', 'Clear boundaries', 'Gentle care']
          },
          'Pet': {
            name: 'Pet Play Session',
            description: 'A playful and affectionate animal role-play scenario where one partner takes on the role of a beloved pet while the other acts as their caring owner. This scenario can include training sessions, playtime, grooming, and lots of positive reinforcement. The pet partner can wear ears, a tail, or other accessories to enhance the experience. The owner provides gentle guidance, clear commands, and plenty of praise and affection. This dynamic creates a safe space for vulnerability and playfulness.',
            roles: ['Pet', 'Owner'],
            intensity: 'low',
            duration: 'medium',
            difficulty: 'beginner',
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
            description: 'A classic and deeply intimate power exchange scenario where the dominant partner takes control while the submissive partner surrenders their power in a consensual and trusting dynamic. This scenario can include protocols, rules, and rituals that enhance the power dynamic. The dominant provides clear guidance and structure while the submissive follows directions and finds pleasure in surrender. This creates a profound connection built on trust, communication, and mutual respect.',
            roles: ['Submissive', 'Dominant'],
            intensity: 'medium',
            duration: 'medium',
            difficulty: 'intermediate',
            safety: ['Safe words', 'Clear protocols', 'Aftercare'],
            safetyLevel: 'moderate'
          },
          'Rigger-Rope bunny': {
            name: 'Artistic Bondage',
            description: 'An artistic and meditative bondage experience that combines the beauty of rope work with the intimacy of restraint. The rigger creates intricate patterns, harnesses, and decorative ties while the rope bunny experiences the sensation of being bound and the aesthetic pleasure of beautiful rope work. This scenario requires patience, skill, and constant communication. The focus is on creating both functional restraint and visually stunning rope art that enhances the overall experience.',
            roles: ['Rigger', 'Rope bunny'],
            intensity: 'medium',
            duration: 'long',
            difficulty: 'advanced',
            safety: ['Safety equipment', 'Proper technique', 'Regular checks'],
            safetyLevel: 'moderate'
          },
          'Sadist-Masochist': {
            name: 'Impact Play Session',
            description: 'An intense and carefully controlled impact play session that explores the boundaries of sensation and pain. The sadist partner uses various implements like paddles, floggers, or hands to create different sensations while the masochist partner experiences the range of feelings from gentle stimulation to more intense sensations. This scenario requires excellent communication, gradual intensity building, and thorough aftercare. The focus is on creating pleasurable sensations through controlled impact while maintaining safety and comfort.',
            roles: ['Sadist', 'Masochist'],
            intensity: 'high',
            duration: 'medium',
            difficulty: 'advanced',
            safety: ['Safe words', 'Gradual build-up', 'Aftercare'],
            safetyLevel: 'high'
          },
          'Brat-Brat tamer': {
            name: 'Discipline Session',
            description: 'A dynamic and playful discipline scenario where the brat partner intentionally challenges authority while the brat tamer responds with creative and enjoyable consequences. This scenario combines fun with structure, allowing both partners to express their playful sides. The brat can use sass, backtalk, or playful disobedience to provoke responses, while the brat tamer creates appropriate and enjoyable consequences that maintain the dynamic while ensuring mutual enjoyment.',
            roles: ['Brat', 'Brat tamer'],
            intensity: 'medium',
            duration: 'medium',
            difficulty: 'intermediate',
            safety: ['Fun consequences', 'Clear boundaries', 'Mutual enjoyment'],
            safetyLevel: 'moderate'
          },
          'Daddy/Mommy-Little': {
            name: 'Age Play Date',
            description: 'A deeply nurturing and emotionally intimate age play scenario that focuses on care, guidance, and unconditional love. The caregiver partner provides emotional safety, gentle discipline, and loving guidance while the little partner can express their more vulnerable and playful side. This scenario can include activities like coloring, watching cartoons, cuddling, or gentle play. The emphasis is on creating a safe emotional space where both partners can express their needs and feel supported.',
            roles: ['Daddy/Mommy', 'Little'],
            intensity: 'low',
            duration: 'long',
            difficulty: 'beginner',
            safety: ['Emotional safety', 'Clear roles', 'Gentle care'],
            safetyLevel: 'low'
          },
          'Pet-Owner': {
            name: 'Pet Training',
            description: 'A structured and affectionate pet training session that combines discipline with love and care. The owner provides clear commands, consistent training, and plenty of positive reinforcement while the pet partner learns to follow instructions and find pleasure in being a good pet. This scenario can include training exercises, playtime, grooming, and lots of praise. The focus is on creating a loving and structured environment where both partners can enjoy their roles.',
            roles: ['Pet', 'Owner'],
            intensity: 'low',
            duration: 'medium',
            difficulty: 'beginner',
            safety: ['Comfortable gear', 'Clear commands', 'Positive reinforcement'],
            safetyLevel: 'low'
          },
          'Voyeur-Exhibitionist': {
            name: 'Show and Tell',
            description: 'A sensual and intimate performance scenario where the exhibitionist partner becomes the center of attention while the voyeur partner enjoys the role of the captivated audience. The exhibitionist can dance, undress, or engage in self-pleasure while the voyeur watches with rapt attention and provides verbal encouragement. This scenario builds anticipation and creates a unique dynamic of desire and observation. Set the mood with dim lighting and create a comfortable, private space for this intimate performance.',
            roles: ['Voyeur', 'Exhibitionist'],
            intensity: 'low',
            duration: 'medium',
            difficulty: 'beginner',
            safety: ['Privacy', 'Consent', 'Comfort levels'],
            safetyLevel: 'low'
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
    { value: 'high', label: 'High', color: 'text-red-400', bg: 'bg-red-500/20' },
    { value: 'extreme', label: 'Extreme', color: 'text-purple-400', bg: 'bg-purple-500/20' }
  ]

  const durationLevels = [
    { value: 'short', label: 'Short (15-30 min)', color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { value: 'medium', label: 'Medium (30-60 min)', color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { value: 'long', label: 'Long (1+ hours)', color: 'text-pink-400', bg: 'bg-pink-500/20' },
    { value: 'very-long', label: 'Very Long (3+ hours)', color: 'text-red-400', bg: 'bg-red-500/20' }
  ]

  const safetyOptions = [
    'Safe words', 'Regular check-ins', 'Clear boundaries', 'Aftercare',
    'Safety equipment', 'Gradual intensity', 'Emotional safety', 'Privacy',
    'Comfort levels', 'Proper technique', 'Positive reinforcement'
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
    { value: 'power-exchange', label: 'Power Exchange', icon: '👑' },
    { value: 'bondage', label: 'Bondage', icon: '🪢' },
    { value: 'impact-play', label: 'Impact Play', icon: '⚡' },
    { value: 'sensation-play', label: 'Sensation Play', icon: '✨' },
    { value: 'role-play', label: 'Role Play', icon: '🎭' },
    { value: 'caregiver', label: 'Caregiver', icon: '🧸' },
    { value: 'pet-play', label: 'Pet Play', icon: '🐾' },
    { value: 'voyeurism', label: 'Voyeurism', icon: '👁️' },
    { value: 'rough-play', label: 'Rough Play', icon: '🥊' },
    { value: 'extreme-play', label: 'Extreme Play', icon: '💀' }
  ]

  const equipmentOptions = [
    'Rope', 'Handcuffs', 'Blindfold', 'Gag', 'Paddle', 'Crop', 'Whip',
    'Vibrator', 'Dildo', 'Plug', 'Collar', 'Leash', 'Feather', 'Ice',
    'Wax', 'Massage oil', 'Lube', 'Condoms', 'Gloves', 'Scissors'
  ]

  const allRoles = [
    'Submissive', 'Dominant', 'Switch', 'Voyeur', 'Exhibitionist',
    'Rope bunny', 'Rigger', 'Masochist', 'Sadist', 'Brat', 'Brat tamer',
    'Daddy/Mommy', 'Little', 'Ageplayer', 'Pet', 'Owner', 'Master/Mistress',
    'Slave', 'Degrader', 'Degradee', 'Primal (Hunter)', 'Primal (Prey)',
    'Experimentalist', 'Vanilla', 'Non-monogamist'
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6 mb-6"
    >
      {/* Message Display */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-500/20 border border-green-400/50 text-green-300' 
              : 'bg-red-500/20 border border-red-400/50 text-red-300'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {message.text}
        </motion.div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Scenario Builder</h3>
        <p className="text-purple-200">Create and customize BDSM scenarios based on your compatibility</p>
      </div>

             <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         {/* Pre-built Scenarios */}
         <div className="space-y-4">
           <h4 className="text-xl font-bold text-white flex items-center gap-2">
             <Star className="w-5 h-5 text-amber-400" />
             Suggested Scenarios
           </h4>
           
           <div className="space-y-4">
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
                     <span className="text-xs px-2 py-1 rounded bg-yellow-500/20 text-yellow-400">
                       🟡 Moderate Risk
                     </span>
                   </div>
                   
                   <div className="flex flex-wrap gap-1 mb-3">
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
                   
                   <div className="flex justify-end">
                     <button
                       onClick={(e) => {
                         e.stopPropagation()
                         saveSuggestedScenario(scenario)
                       }}
                       disabled={loading}
                       className="px-3 py-1 bg-white/10 text-purple-200 text-xs font-medium rounded-lg flex items-center gap-1 border border-purple-400/30 hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                       title="Save this scenario"
                     >
                       <Save className="w-3 h-3" />
                       {loading ? 'Saving...' : 'Save'}
                     </button>
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

             {/* Saved Scenarios */}
             {savedScenarios.length > 0 && (
               <div>
                 <h4 className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                   <Database className="w-5 h-5 text-blue-400" />
                   Scenarios ({savedScenarios.length})
                 </h4>
                 
                 <div className="space-y-4">
                   {savedScenarios.map((scenario, index) => (
                     <motion.div
                       key={scenario.id}
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
                         {difficultyLevels.find(level => level.value === scenario.difficulty) && (
                           <span className={`text-xs px-2 py-1 rounded ${difficultyLevels.find(level => level.value === scenario.difficulty).bg} ${difficultyLevels.find(level => level.value === scenario.difficulty).color}`}>
                             {difficultyLevels.find(level => level.value === scenario.difficulty).label}
                           </span>
                         )}
                         {safetyLevels.find(level => level.value === scenario.safetyLevel) && (
                           <span className={`text-xs px-2 py-1 rounded ${safetyLevels.find(level => level.value === scenario.safetyLevel).bg} ${safetyLevels.find(level => level.value === scenario.safetyLevel).color}`}>
                             {safetyLevels.find(level => level.value === scenario.safetyLevel).icon} {safetyLevels.find(level => level.value === scenario.safetyLevel).label}
                           </span>
                         )}
                       </div>
                       
                       <div className="flex flex-wrap gap-1 mb-3">
                         {scenario.safety && scenario.safety.slice(0, 3).map((item, safetyIndex) => (
                           <span key={safetyIndex} className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded">
                             {item}
                           </span>
                         ))}
                         {scenario.safety && scenario.safety.length > 3 && (
                           <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                             +{scenario.safety.length - 3} more
                           </span>
                         )}
                       </div>
                       
                       <div className="flex justify-between items-center">
                         <div className="text-xs text-purple-300">
                           {scenario.isCustom ? 'Custom Scenario' : 'Suggested Scenario'} • Saved {new Date(scenario.created_at).toLocaleDateString()}
                         </div>
                         <div className="flex gap-2">
                           <button
                             onClick={(e) => {
                               e.stopPropagation()
                               editScenario(scenario)
                             }}
                             className="text-blue-400 hover:text-blue-300 transition-colors"
                             title="Edit scenario"
                           >
                             <Edit className="w-4 h-4" />
                           </button>
                           <button
                             onClick={(e) => {
                               e.stopPropagation()
                               confirmDeleteScenario(scenario.id)
                             }}
                             className="text-red-400 hover:text-red-300 transition-colors"
                             title="Delete scenario"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                       </div>
                     </motion.div>
                   ))}
                 </div>
               </div>
             )}
           </div>
         </div>

         {/* Custom Scenario Builder */}
         <div className="space-y-4">
           <div className="flex items-center justify-between">
             <h4 className="text-xl font-bold text-white flex items-center gap-2">
               {editingScenario ? (
                 <>
                   <Edit className="w-5 h-5 text-blue-400" />
                   Edit Scenario: {editingScenario.name}
                 </>
               ) : (
                 <>
                   <Plus className="w-5 h-5 text-green-400" />
                   Custom Scenario Builder
                 </>
               )}
             </h4>
             
             {!editingScenario && (
               <div className="flex gap-2">
                 <button
                   onClick={() => setShowTemplates(!showTemplates)}
                   className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-lg border border-blue-400/30 hover:bg-blue-500/30 transition-colors"
                 >
                   📋 Templates
                 </button>
                 <button
                   onClick={() => setShowSafetyGuide(!showSafetyGuide)}
                   className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-lg border border-green-400/30 hover:bg-green-500/30 transition-colors"
                 >
                   🛡️ Safety Guide
                 </button>
               </div>
             )}
           </div>
           
                        {/* Templates Panel */}
             {showTemplates && !editingScenario && (
               <motion.div
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="p-4 rounded-lg bg-blue-500/10 border border-blue-400/30"
               >
                 <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                   📋 Scenario Templates
                 </h5>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {scenarioTemplates.map((template) => (
                     <motion.div
                       key={template.id}
                       whileHover={{ scale: 1.02 }}
                       className="p-3 rounded-lg bg-white/5 border border-blue-400/20 cursor-pointer hover:bg-white/10 transition-all"
                       onClick={() => applyTemplate(template)}
                     >
                       <div className="flex items-start justify-between mb-2">
                         <h6 className="text-white font-medium">{template.name}</h6>
                         <span className={`text-xs px-2 py-1 rounded ${difficultyLevels.find(level => level.value === template.difficulty).bg} ${difficultyLevels.find(level => level.value === template.difficulty).color}`}>
                           {template.difficulty}
                         </span>
                       </div>
                       <p className="text-purple-200 text-sm mb-2">{template.description}</p>
                       <div className="flex gap-1">
                         {template.roles.map((role, index) => (
                           <span key={index} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                             {role}
                           </span>
                         ))}
                       </div>
                     </motion.div>
                   ))}
                 </div>
               </motion.div>
             )}

             {/* Safety Guide Panel */}
             {showSafetyGuide && !editingScenario && (
               <motion.div
                 initial={{ opacity: 0, y: -20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="p-4 rounded-lg bg-green-500/10 border border-green-400/30"
               >
                 <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
                   🛡️ Safety Guidelines
                 </h5>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {Object.entries(safetyGuide).map(([key, guide]) => (
                     <div key={key} className="space-y-2">
                       <h6 className="text-green-300 font-medium">{guide.title}</h6>
                       <ul className="space-y-1">
                         {guide.points.map((point, index) => (
                           <li key={index} className="text-purple-200 text-sm flex items-start gap-2">
                             <span className="text-green-400 mt-1">•</span>
                             {point}
                           </li>
                         ))}
                       </ul>
                     </div>
                   ))}
                 </div>
               </motion.div>
             )}

             <div className="space-y-4">
            {/* Basic Info */}
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

            {/* Category Selection */}
            <div>
              <label className="block text-white font-medium mb-2">Category</label>
              <div className="grid grid-cols-2 gap-2">
                {scenarioCategories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setCustomScenario({...customScenario, category: category.value})}
                    className={`p-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      customScenario.category === category.value
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50'
                        : 'bg-white/10 text-purple-200 hover:bg-white/20'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

                         {/* Role Selection */}
             <div>
               <label className="block text-white font-medium mb-2">Select Roles</label>
               <div className="grid grid-cols-3 gap-2">
                 {allRoles.map((role) => (
                   <button
                     key={role}
                     onClick={() => {
                       if (customScenario.roles.includes(role)) {
                         removeRoleFromScenario(role)
                       } else {
                         addRoleToScenario(role)
                       }
                     }}
                     className={`p-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                       customScenario.roles.includes(role)
                         ? 'bg-blue-500/20 text-blue-300 border border-blue-400/50'
                         : 'bg-white/10 text-purple-200 hover:bg-white/20'
                     }`}
                   >
                     <span className="text-sm">{getEmoji(role)}</span>
                     {role}
                   </button>
                 ))}
               </div>
             </div>

            {/* Role Assignments */}
            {customScenario.roles.length > 0 && (
              <div>
                <label className="block text-white font-medium mb-2">Role Assignments</label>
                <div className="space-y-2">
                  {customScenario.roles.map((role) => (
                    <div key={role} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                      <span className="text-lg">{getEmoji(role)}</span>
                      <span className="text-purple-200 text-sm flex-1">{role}</span>
                      <select
                        value={customScenario.roleAssignments[role] || ''}
                        onChange={(e) => assignRoleToPartner(role, e.target.value)}
                        className="w-full bg-white/10 text-purple-200 text-sm px-2 py-1 rounded border border-purple-400/20 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23a855f7' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em',
                          paddingRight: '2.5rem'
                        }}
                      >
                        <option value="">Select Partner</option>
                        {results.map((result, index) => (
                          <option key={result.id} value={result.testName || `Partner ${index + 1}`}>
                            {result.testName || `Partner ${index + 1}`}
                          </option>
                        ))}
                        <option value="Both">Both</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Difficulty & Safety */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Difficulty</label>
                <div className="flex gap-2">
                  {difficultyLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setCustomScenario({...customScenario, difficulty: level.value})}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        customScenario.difficulty === level.value
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
                <label className="block text-white font-medium mb-2">Safety Level</label>
                <div className="flex gap-2">
                  {safetyLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setCustomScenario({...customScenario, safetyLevel: level.value})}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        customScenario.safetyLevel === level.value
                          ? `${level.bg} ${level.color} border border-current`
                          : 'bg-white/10 text-purple-200 hover:bg-white/20'
                      }`}
                    >
                      <span className="mr-1">{level.icon}</span>
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Intensity & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">Intensity</label>
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
            </div>

                         {/* Equipment */}
             <div>
               <label className="block text-white font-medium mb-2">Equipment Needed</label>
               <div className="flex flex-wrap gap-2">
                 {equipmentOptions.map((equipment) => (
                   <button
                     key={equipment}
                     onClick={() => {
                       const newEquipment = customScenario.equipment.includes(equipment)
                         ? customScenario.equipment.filter(item => item !== equipment)
                         : [...customScenario.equipment, equipment]
                       setCustomScenario({...customScenario, equipment: newEquipment})
                     }}
                     className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                       customScenario.equipment.includes(equipment)
                         ? 'bg-orange-500/20 text-orange-300 border border-orange-400/50'
                         : 'bg-white/10 text-purple-200 hover:bg-white/20'
                     }`}
                   >
                     {equipment}
                   </button>
                 ))}
               </div>
             </div>

             {/* Safety Considerations */}
             <div>
               <label className="block text-white font-medium mb-2">Safety Considerations</label>
               <div className="flex flex-wrap gap-2">
                 {safetyOptions.map((option) => (
                   <button
                     key={option}
                     onClick={() => {
                       const currentSafety = customScenario.safety || []
                       const newSafety = currentSafety.includes(option)
                         ? currentSafety.filter(item => item !== option)
                         : [...currentSafety, option]
                       setCustomScenario({...customScenario, safety: newSafety})
                     }}
                     className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                       (customScenario.safety || []).includes(option)
                         ? 'bg-green-500/20 text-green-300 border border-green-400/50'
                         : 'bg-white/10 text-purple-200 hover:bg-white/20'
                     }`}
                   >
                     {option}
                   </button>
                 ))}
               </div>
             </div>

            {/* Step-by-Step Instructions */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-white font-medium">Step-by-Step Instructions</label>
                <button
                  onClick={addStep}
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  + Add Step
                </button>
              </div>
              <div className="space-y-2">
                {customScenario.steps.map((step, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-purple-300 text-sm mt-2">{index + 1}.</span>
                    <input
                      type="text"
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      className="flex-1 p-2 rounded-lg bg-white/10 border border-purple-400/20 text-white text-sm placeholder-purple-300 focus:outline-none focus:border-purple-400"
                      placeholder={`Step ${index + 1}...`}
                    />
                    <button
                      onClick={() => removeStep(index)}
                      className="text-red-400 hover:text-red-300 text-sm mt-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

                         <div className="flex gap-3">
                           {editingScenario && (
                             <motion.button
                               whileHover={{ scale: 1.05 }}
                               whileTap={{ scale: 0.95 }}
                               onClick={cancelEdit}
                               disabled={loading}
                               className="flex-1 bg-white/10 text-purple-200 font-semibold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-400/30 hover:bg-white/20"
                             >
                               Cancel
                             </motion.button>
                           )}
                           <motion.button
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                             onClick={editingScenario ? updateScenario : saveCustomScenario}
                             disabled={loading}
                             className={`flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${editingScenario ? 'flex-1' : 'w-full'}`}
                           >
                             <Save className="w-4 h-4" />
                             {loading ? 'Saving...' : editingScenario ? 'Update Scenario' : 'Save Custom Scenario'}
                           </motion.button>
                         </div>
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
                <div className="flex items-center justify-between">
                  <span className="text-purple-200">Safety Level:</span>
                  <span className={`px-2 py-1 rounded text-sm ${(() => {
                    const safetyLevel = selectedScenario.safetyLevel || 'moderate';
                    const levelInfo = safetyLevels.find(level => level.value === safetyLevel);
                    return levelInfo ? `${levelInfo.bg} ${levelInfo.color}` : '';
                  })()}`}>
                    {(() => {
                      const safetyLevel = selectedScenario.safetyLevel || 'moderate';
                      const levelInfo = safetyLevels.find(level => level.value === safetyLevel);
                      return levelInfo ? `${levelInfo.icon} ${levelInfo.label}` : 'Moderate Risk';
                    })()}
                  </span>
                </div>
              </div>
              
                             <div className="flex justify-end mt-4">
                 <motion.button
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => startScenario(selectedScenario)}
                   className="px-4 py-2 bg-white/10 text-purple-200 text-sm font-medium rounded-lg flex items-center gap-2 border border-purple-400/30 hover:bg-white/20 transition-all"
                 >
                   <Play className="w-4 h-4" />
                   Start Scenario
                 </motion.button>
               </div>
            </div>
          </div>
                 </motion.div>
       )}

       {/* Active Timer Display */}
       {activeTimer && (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mt-6 p-6 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/50"
         >
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-3">
               <Play className="w-6 h-6 text-green-400" />
               <div>
                 <h4 className="text-xl font-bold text-white">{activeTimer.scenario.name}</h4>
                 <p className="text-purple-200 text-sm">
                   {activeTimer.isRange ? 'Timer' : 'Stopwatch'} • {activeTimer.scenario.intensity} intensity
                 </p>
               </div>
             </div>
             
             <div className="text-right">
               <div className="text-3xl font-mono font-bold text-white mb-1">
                 {formatTime(timerTime)}
               </div>
               {activeTimer.isRange && (
                 <div className="text-sm text-purple-200">
                   Target: {formatTime(activeTimer.targetTime)}
                 </div>
               )}
             </div>
           </div>
           
           <div className="flex gap-3">
             {isTimerRunning ? (
               <button
                 onClick={pauseTimer}
                 className="px-4 py-2 bg-yellow-500/20 text-yellow-300 border border-yellow-400/50 rounded-lg hover:bg-yellow-500/30 transition-colors"
               >
                 ⏸️ Pause
               </button>
             ) : (
               <button
                 onClick={resumeTimer}
                 className="px-4 py-2 bg-green-500/20 text-green-300 border border-green-400/50 rounded-lg hover:bg-green-500/30 transition-colors"
               >
                 ▶️ Resume
               </button>
             )}
             
             <button
               onClick={stopTimer}
               className="px-4 py-2 bg-red-500/20 text-red-300 border border-red-400/50 rounded-lg hover:bg-red-500/30 transition-colors"
             >
               ⏹️ Stop
             </button>
           </div>
           
           {activeTimer.isRange && (
             <div className="mt-4">
               <div className="w-full bg-white/10 rounded-full h-2">
                 <div 
                   className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-1000"
                   style={{ width: `${Math.min((timerTime / activeTimer.targetTime) * 100, 100)}%` }}
                 ></div>
               </div>
               <div className="text-xs text-purple-200 mt-1">
                 Progress: {Math.round((timerTime / activeTimer.targetTime) * 100)}%
               </div>
             </div>
           )}
         </motion.div>
       )}

       {/* Session Logging Modal */}
       {showSessionLog && (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
           onClick={() => setShowSessionLog(false)}
         >
           <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
             onClick={(e) => e.stopPropagation()}
           >
             <h3 className="text-white font-bold text-lg mb-4">Session Log</h3>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-purple-200 text-sm mb-2">Scenario</label>
                 <div className="text-white font-medium">{activeTimer?.scenario?.name || 'Custom Scenario'}</div>
               </div>
               
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



