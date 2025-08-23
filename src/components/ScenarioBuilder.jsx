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
  const [editingScenario, setEditingScenario] = useState(null)
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
    { value: 'long', label: 'Long (1+ hours)', color: 'text-pink-400', bg: 'bg-pink-500/20' }
  ]

  const safetyOptions = [
    'Safe words', 'Regular check-ins', 'Clear boundaries', 'Aftercare',
    'Safety equipment', 'Gradual intensity', 'Emotional safety', 'Privacy',
    'Comfort levels', 'Proper technique', 'Positive reinforcement'
  ]

  const difficultyLevels = [
    { value: 'beginner', label: 'Beginner', color: 'text-green-400', bg: 'bg-green-500/20' },
    { value: 'intermediate', label: 'Intermediate', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
    { value: 'advanced', label: 'Advanced', color: 'text-red-400', bg: 'bg-red-500/20' }
  ]

  const safetyLevels = [
    { value: 'low', label: 'Low Risk', color: 'text-green-400', bg: 'bg-green-500/20', icon: '🟢' },
    { value: 'moderate', label: 'Moderate Risk', color: 'text-yellow-400', bg: 'bg-yellow-500/20', icon: '🟡' },
    { value: 'high', label: 'High Risk', color: 'text-red-400', bg: 'bg-red-500/20', icon: '🔴' }
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



