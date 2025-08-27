import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Users, 
  Target, 
  Star, 
  Plus, 
  Edit, 
  Save, 
  Trash2,
  Zap,
  Shield,
  Crown,
  Lock,
  Unlock,
  ArrowUpDown,
  TrendingUp,
  Activity,
  X
} from 'lucide-react'
import { externalResources, disclaimer, safetyGuidelines } from '../utils/externalResources'
import HowToGuideModal from './HowToGuideModal'

const PositionPreferences = ({ results }) => {
  const [positionPreferences, setPositionPreferences] = useState({})
  const [roleDynamics, setRoleDynamics] = useState({})
  const [editingPosition, setEditingPosition] = useState(null)
  const [showAddPosition, setShowAddPosition] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [showPositionModal, setShowPositionModal] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [showHowToGuide, setShowHowToGuide] = useState(false)

  // Position categories with emojis and descriptions
  const positionCategories = {
    'power-exchange': {
      emoji: '👑',
      name: 'Power Exchange',
      positions: [
        { 
          name: 'Dominant', 
          emoji: '👑', 
          description: 'Taking control and leading',
          detailedDescription: 'The Dominant role involves taking control of the scene, making decisions, and guiding the experience. This includes setting boundaries, giving commands, and maintaining authority while ensuring the safety and well-being of all participants. Dominants often enjoy the responsibility of leadership and the trust placed in them by their partners.',
          tips: ['Always prioritize consent and safety', 'Communicate clearly about expectations', 'Check in regularly with your partner', 'Be prepared to adapt and adjust'],
          safetyNotes: ['Establish clear safe words', 'Discuss limits before starting', 'Monitor partner\'s physical and emotional state', 'Have an exit strategy planned']
        },
        { 
          name: 'Submissive', 
          emoji: '🙇‍♀️', 
          description: 'Surrendering control',
          detailedDescription: 'The Submissive role involves surrendering control to a trusted partner, following their lead, and finding pleasure in obedience and service. This can include following commands, accepting discipline, and finding freedom through submission. Submissives often experience deep trust and vulnerability.',
          tips: ['Choose your Dominant carefully', 'Communicate your needs and limits', 'Use safe words when needed', 'Trust your instincts'],
          safetyNotes: ['Never submit to someone you don\'t trust', 'Keep your safe words accessible', 'Stay aware of your physical limits', 'Have a support system in place']
        },
        { 
          name: 'Switch', 
          emoji: '🔄', 
          description: 'Alternating between roles',
          detailedDescription: 'Switches enjoy both dominant and submissive roles, often alternating between them based on mood, partner, or scene. This flexibility allows for diverse experiences and deeper understanding of both perspectives. Switches can adapt to their partner\'s needs and explore different dynamics.',
          tips: ['Be clear about which role you\'re in', 'Communicate role preferences', 'Respect your partner\'s role', 'Take time to transition between roles'],
          safetyNotes: ['Ensure both partners are comfortable with role switching', 'Establish different safe words for each role', 'Check in about role preferences regularly', 'Don\'t feel pressured to switch if not comfortable']
        },
        { 
          name: 'Service Top', 
          emoji: '🤝', 
          description: 'Providing service through dominance',
          detailedDescription: 'Service Tops provide dominance as a form of service to their partner. They take control to fulfill their partner\'s desires and needs, focusing on giving pleasure and satisfaction through their dominant actions. The emphasis is on serving their partner\'s fantasies and needs.',
          tips: ['Focus on your partner\'s desires', 'Ask for feedback regularly', 'Be attentive to reactions', 'Prioritize your partner\'s pleasure'],
          safetyNotes: ['Ensure your partner\'s needs are being met', 'Check in about satisfaction levels', 'Be willing to adjust your approach', 'Maintain clear communication about desires']
        },
        { 
          name: 'Power Bottom', 
          emoji: '💪', 
          description: 'Maintaining control while receiving',
          detailedDescription: 'Power Bottoms maintain control and authority while being in the receiving position. They direct the scene, set the pace, and maintain their dominance even while being penetrated or receiving stimulation. This role combines the pleasure of receiving with the thrill of control.',
          tips: ['Be clear about your desires', 'Direct your partner confidently', 'Maintain your authority', 'Express your needs clearly'],
          safetyNotes: ['Ensure your partner respects your control', 'Communicate boundaries clearly', 'Don\'t compromise your safety for control', 'Have clear agreements about authority']
        }
      ]
    },
    'physical-positions': {
      emoji: '🧘',
      name: 'Physical Positions',
      positions: [
        { 
          name: 'Missionary', 
          emoji: '⬆️', 
          description: 'Face to face, deep penetration',
          detailedDescription: 'The classic missionary position allows for intimate eye contact and deep emotional connection. The receiving partner lies on their back with legs spread, while the penetrating partner positions themselves on top. This position provides excellent control and allows for deep penetration while maintaining close physical and emotional intimacy.',
          tips: ['Use pillows to adjust angle and depth', 'Maintain eye contact for intimacy', 'Control the pace for maximum pleasure', 'Use your hands to caress and stimulate'],
          safetyNotes: ['Ensure comfortable positioning', 'Watch for signs of discomfort', 'Communicate about depth and pace', 'Have safe words established']
        },
        { 
          name: 'Doggy Style', 
          emoji: '🐕', 
          description: 'Bent over, intense thrusting',
          detailedDescription: 'Doggy style involves the receiving partner on hands and knees while the penetrating partner enters from behind. This position allows for deep penetration and intense thrusting, providing access to sensitive areas and creating powerful sensations. It\'s excellent for those who enjoy being dominated or taking control.',
          tips: ['Adjust height with pillows or furniture', 'Use your hands to guide and control', 'Vary the angle for different sensations', 'Communicate about depth and speed'],
          safetyNotes: ['Ensure stable positioning', 'Watch for signs of discomfort', 'Control the intensity', 'Have clear communication about limits']
        },
        { 
          name: 'Standing Doggy', 
          emoji: '🚶', 
          description: 'Standing bent over surface',
          detailedDescription: 'A variation of doggy style where the receiving partner bends over a surface like a bed, table, or counter while standing. This position provides excellent leverage for intense thrusting and allows for deep penetration while maintaining the excitement of a standing position.',
          tips: ['Choose a stable surface at the right height', 'Use your hands for balance and control', 'Adjust the angle for maximum pleasure', 'Communicate about positioning comfort'],
          safetyNotes: ['Ensure the surface is stable and safe', 'Watch for balance and comfort', 'Control the intensity', 'Have clear communication about positioning']
        },
        { 
          name: 'Prone Bone', 
          emoji: '🦴', 
          description: 'Lying flat, deep penetration',
          detailedDescription: 'The receiving partner lies flat on their stomach while the penetrating partner positions themselves on top. This position allows for very deep penetration and intense sensations, as the receiving partner is completely vulnerable and the penetrating partner has full control over the experience.',
          tips: ['Use pillows to adjust the angle', 'Control the depth and pace carefully', 'Use your hands to caress and stimulate', 'Communicate about comfort and pleasure'],
          safetyNotes: ['Ensure comfortable positioning', 'Watch for signs of discomfort', 'Control the depth carefully', 'Have clear communication about limits']
        },
        { 
          name: 'Standing Carry', 
          emoji: '💪', 
          description: 'Holding partner up',
          detailedDescription: 'An advanced position where the penetrating partner holds the receiving partner up while standing. This requires significant strength and balance but provides intense sensations and deep penetration. The receiving partner wraps their legs around the penetrating partner\'s waist.',
          tips: ['Ensure you have the strength for this position', 'Use walls or furniture for support', 'Communicate about comfort and safety', 'Have a safe way to lower your partner'],
          safetyNotes: ['Only attempt if both partners are comfortable', 'Have a safe way to end the position', 'Watch for signs of fatigue', 'Communicate clearly about safety']
        },
        { 
          name: 'Edge of Bed', 
          emoji: '🛏️', 
          description: 'Partner on bed edge',
          detailedDescription: 'The receiving partner lies on their back at the edge of the bed with legs spread, while the penetrating partner stands and enters. This position provides excellent control, deep penetration, and allows for intense thrusting while the receiving partner is comfortable and supported.',
          tips: ['Adjust bed height for optimal positioning', 'Use pillows for comfort and angle', 'Control the pace and depth', 'Use your hands to stimulate and guide'],
          safetyNotes: ['Ensure the bed is stable', 'Watch for signs of discomfort', 'Control the intensity', 'Have clear communication about positioning']
        },
        { 
          name: 'Against Wall', 
          emoji: '🧱', 
          description: 'Standing against wall',
          detailedDescription: 'The receiving partner stands with their back against a wall while the penetrating partner enters from the front. This position allows for deep penetration and intense thrusting while maintaining the excitement of a standing position. It\'s excellent for quick, passionate encounters.',
          tips: ['Choose a stable wall surface', 'Use your hands for balance and control', 'Adjust the angle for maximum pleasure', 'Communicate about positioning comfort'],
          safetyNotes: ['Ensure the wall is clean and safe', 'Watch for balance and comfort', 'Control the intensity', 'Have clear communication about positioning']
        },
        { 
          name: 'Chair Position', 
          emoji: '🪑', 
          description: 'Sitting on chair/edge',
          detailedDescription: 'The penetrating partner sits on a chair while the receiving partner sits on their lap facing them or facing away. This position provides intimate connection and allows for deep penetration while both partners are comfortable and supported.',
          tips: ['Choose a stable chair', 'Adjust positioning for comfort', 'Use your hands to guide and stimulate', 'Communicate about positioning and pleasure'],
          safetyNotes: ['Ensure the chair is stable', 'Watch for signs of discomfort', 'Control the intensity', 'Have clear communication about positioning']
        },
        { 
          name: 'Spooning', 
          emoji: '🥄', 
          description: 'Side lying position',
          detailedDescription: 'Both partners lie on their sides with the penetrating partner behind the receiving partner. This position provides intimate connection and allows for gentle to moderate penetration while both partners are comfortable and relaxed.',
          tips: ['Use pillows for comfort and positioning', 'Adjust the angle for optimal penetration', 'Use your hands to caress and stimulate', 'Communicate about comfort and pleasure'],
          safetyNotes: ['Ensure comfortable positioning', 'Watch for signs of discomfort', 'Control the intensity', 'Have clear communication about positioning']
        },
        { 
          name: 'Cowgirl', 
          emoji: '🤠', 
          description: 'Partner on top, riding',
          detailedDescription: 'The receiving partner sits on top of the penetrating partner, controlling the pace and depth of penetration. This position gives the receiving partner full control over their pleasure while the penetrating partner can relax and enjoy the experience.',
          tips: ['Start slowly and build up intensity', 'Use your hands to stimulate your partner', 'Control the pace and depth', 'Communicate about positioning and pleasure'],
          safetyNotes: ['Ensure comfortable positioning', 'Watch for signs of discomfort', 'Control the intensity', 'Have clear communication about positioning']
        },
        { 
          name: 'Reverse Cowgirl', 
          emoji: '🔄', 
          description: 'Partner on top, facing away',
          detailedDescription: 'Similar to cowgirl but the receiving partner faces away from the penetrating partner. This position provides deep penetration and allows the receiving partner to control the pace while providing a different angle of stimulation.',
          tips: ['Start slowly and build up intensity', 'Use your hands for balance and stimulation', 'Control the pace and depth', 'Communicate about positioning and pleasure'],
          safetyNotes: ['Ensure comfortable positioning', 'Watch for signs of discomfort', 'Control the intensity', 'Have clear communication about positioning']
        },
        { 
          name: 'Butterfly', 
          emoji: '🦋', 
          description: 'Legs up, deep access',
          detailedDescription: 'The receiving partner lies on their back with legs raised and spread, often supported by the penetrating partner or pillows. This position provides excellent access and allows for very deep penetration while the receiving partner is completely exposed and vulnerable.',
          tips: ['Use pillows to support the legs', 'Control the depth and pace carefully', 'Use your hands to stimulate and guide', 'Communicate about comfort and pleasure'],
          safetyNotes: ['Ensure comfortable positioning', 'Watch for signs of discomfort', 'Control the depth carefully', 'Have clear communication about limits']
        }
      ]
    },
    'bondage-positions': {
      emoji: '🪢',
      name: 'Bondage Positions',
      positions: [
        { name: 'Rigger', emoji: '🎪', description: 'Tying partner up' },
        { name: 'Rope Bunny', emoji: '🪢', description: 'Being tied up' },
        { name: 'Suspension', emoji: '🕊️', description: 'Hanging positions' },
        { name: 'Spread Eagle', emoji: '✋', description: 'Limbs spread wide' },
        { name: 'Frog Tie', emoji: '🐸', description: 'Knees bent and tied' },
        { name: 'Box Tie', emoji: '📦', description: 'Arms behind back' }
      ]
    },
    'impact-positions': {
      emoji: '⚡',
      name: 'Impact Play',
      positions: [
        { name: 'Giver', emoji: '🎯', description: 'Administering impact' },
        { name: 'Receiver', emoji: '💔', description: 'Receiving impact' },
        { name: 'Over Knee', emoji: '🦵', description: 'Across lap' },
        { name: 'Bent Over', emoji: '🙇', description: 'Bent for spanking' },
        { name: 'Standing', emoji: '🚶', description: 'Upright impact' }
      ]
    },
    'sensory-positions': {
      emoji: '👁️',
      name: 'Sensory Play',
      positions: [
        { name: 'Blindfolded', emoji: '🙈', description: 'Vision restricted' },
        { name: 'Gagged', emoji: '🤐', description: 'Speech restricted' },
        { name: 'Restrained', emoji: '⛓️', description: 'Movement limited' },
        { name: 'Sensory Deprivation', emoji: '🔇', description: 'Multiple senses blocked' },
        { name: 'Sensory Overload', emoji: '🔊', description: 'Intense stimulation' }
      ]
    },
    'intense-positions': {
      emoji: '💥',
      name: 'Intense Penetration',
      positions: [
        { 
          name: 'Deep Doggy', 
          emoji: '🐕', 
          description: 'Bent over, maximum depth',
          detailedDescription: 'An intense variation of doggy style focused on achieving maximum depth and penetration. The receiving partner arches their back to allow for deeper access while the penetrating partner uses their full strength for powerful, deep thrusting. This position is designed for those who crave intense, deep stimulation.',
          tips: ['Arch your back for maximum depth', 'Use your hands to guide and control', 'Build up intensity gradually', 'Communicate about depth and pace'],
          safetyNotes: ['Ensure both partners are comfortable with intensity', 'Have clear safe words established', 'Watch for signs of discomfort', 'Control the depth carefully']
        },
        { 
          name: 'Standing Deep', 
          emoji: '🚶', 
          description: 'Standing, intense thrusting',
          detailedDescription: 'A standing position that allows for intense, deep thrusting while maintaining the excitement of being upright. The receiving partner bends over a surface while the penetrating partner stands behind, providing excellent leverage for powerful, deep penetration.',
          tips: ['Choose a stable surface at the right height', 'Use your hands for balance and control', 'Adjust the angle for maximum depth', 'Communicate about positioning comfort'],
          safetyNotes: ['Ensure the surface is stable and safe', 'Watch for balance and comfort', 'Control the intensity', 'Have clear communication about positioning']
        },
        { 
          name: 'Prone Deep', 
          emoji: '🦴', 
          description: 'Lying flat, deep pounding',
          detailedDescription: 'The receiving partner lies completely flat on their stomach while the penetrating partner positions themselves on top for maximum depth and control. This position allows for very deep penetration and intense pounding as the receiving partner is completely vulnerable and exposed.',
          tips: ['Use pillows to adjust the angle', 'Control the depth and pace carefully', 'Use your hands to caress and stimulate', 'Communicate about comfort and pleasure'],
          safetyNotes: ['Ensure comfortable positioning', 'Watch for signs of discomfort', 'Control the depth carefully', 'Have clear communication about limits']
        },
        { 
          name: 'Edge Pound', 
          emoji: '🛏️', 
          description: 'Bed edge, hard thrusting',
          detailedDescription: 'The receiving partner lies on their back at the edge of the bed with legs spread, while the penetrating partner stands and delivers intense, hard thrusting. This position provides excellent control and allows for deep penetration with maximum force.',
          tips: ['Adjust bed height for optimal positioning', 'Use pillows for comfort and angle', 'Control the pace and depth', 'Use your hands to stimulate and guide'],
          safetyNotes: ['Ensure the bed is stable', 'Watch for signs of discomfort', 'Control the intensity', 'Have clear communication about positioning']
        },
        { 
          name: 'Wall Pound', 
          emoji: '🧱', 
          description: 'Against wall, intense',
          detailedDescription: 'The receiving partner stands with their back against a wall while the penetrating partner delivers intense, deep thrusting. This position allows for powerful penetration while maintaining the excitement of a standing position and the receiving partner being pinned against the wall.',
          tips: ['Choose a stable wall surface', 'Use your hands for balance and control', 'Adjust the angle for maximum pleasure', 'Communicate about positioning comfort'],
          safetyNotes: ['Ensure the wall is clean and safe', 'Watch for balance and comfort', 'Control the intensity', 'Have clear communication about positioning']
        },
        { 
          name: 'Chair Pound', 
          emoji: '🪑', 
          description: 'Chair edge, deep access',
          detailedDescription: 'The receiving partner sits on the edge of a chair while the penetrating partner stands and delivers intense, deep thrusting. This position provides excellent access and allows for deep penetration while the receiving partner is comfortable and supported.',
          tips: ['Choose a stable chair', 'Adjust positioning for comfort', 'Use your hands to guide and stimulate', 'Communicate about positioning and pleasure'],
          safetyNotes: ['Ensure the chair is stable', 'Watch for signs of discomfort', 'Control the intensity', 'Have clear communication about positioning']
        },
        { 
          name: 'Carry Pound', 
          emoji: '💪', 
          description: 'Holding up, intense',
          detailedDescription: 'An advanced position where the penetrating partner holds the receiving partner up while delivering intense, deep thrusting. This requires significant strength but provides the most intense sensations as the receiving partner is completely supported and vulnerable.',
          tips: ['Ensure you have the strength for this position', 'Use walls or furniture for support', 'Communicate about comfort and safety', 'Have a safe way to lower your partner'],
          safetyNotes: ['Only attempt if both partners are comfortable', 'Have a safe way to end the position', 'Watch for signs of fatigue', 'Communicate clearly about safety']
        },
        { 
          name: 'Butterfly Pound', 
          emoji: '🦋', 
          description: 'Legs up, maximum depth',
          detailedDescription: 'The receiving partner lies on their back with legs raised and spread wide, often supported by the penetrating partner. This position provides maximum access and allows for the deepest possible penetration while the receiving partner is completely exposed.',
          tips: ['Use pillows to support the legs', 'Control the depth and pace carefully', 'Use your hands to stimulate and guide', 'Communicate about comfort and pleasure'],
          safetyNotes: ['Ensure comfortable positioning', 'Watch for signs of discomfort', 'Control the depth carefully', 'Have clear communication about limits']
        },
        { 
          name: 'Split Pound', 
          emoji: '✂️', 
          description: 'Legs spread wide',
          detailedDescription: 'The receiving partner lies on their back with legs spread as wide as possible, providing maximum access and allowing for deep, intense penetration. This position is designed for those who enjoy being completely exposed and vulnerable.',
          tips: ['Use pillows to support the legs', 'Control the depth and pace carefully', 'Use your hands to stimulate and guide', 'Communicate about comfort and pleasure'],
          safetyNotes: ['Ensure comfortable positioning', 'Watch for signs of discomfort', 'Control the depth carefully', 'Have clear communication about limits']
        },
        { 
          name: 'Elevated Pound', 
          emoji: '📐', 
          description: 'Elevated hips, deep',
          detailedDescription: 'The receiving partner lies on their back with hips elevated using pillows or furniture, creating an optimal angle for deep penetration. This position allows for intense thrusting while the receiving partner is comfortable and supported.',
          tips: ['Use pillows to elevate the hips', 'Adjust the angle for optimal penetration', 'Control the pace and depth', 'Use your hands to stimulate and guide'],
          safetyNotes: ['Ensure comfortable positioning', 'Watch for signs of discomfort', 'Control the intensity', 'Have clear communication about positioning']
        }
      ]
    },
    'role-play-positions': {
      emoji: '🎭',
      name: 'Role Play',
      positions: [
        { name: 'Teacher', emoji: '👨‍🏫', description: 'Educational role' },
        { name: 'Student', emoji: '👨‍🎓', description: 'Learning role' },
        { name: 'Doctor', emoji: '👨‍⚕️', description: 'Medical role' },
        { name: 'Patient', emoji: '🏥', description: 'Medical subject' },
        { name: 'Boss', emoji: '💼', description: 'Workplace authority' },
        { name: 'Employee', emoji: '👔', description: 'Workplace subordinate' }
      ]
    }
  }

  // Role dynamics analysis
  const analyzeRoleDynamics = () => {
    if (results.length < 2) return {}

    const dynamics = {}
    
    results.forEach((result, index) => {
      const topRoles = result.results.slice(0, 5) // Top 5 roles
      dynamics[result.id] = {
        primaryRole: topRoles[0]?.role || 'Unknown',
        roleStrengths: topRoles.map(r => ({ role: r.role, percentage: r.percentage })),
        compatibility: {}
      }
    })

    // Analyze compatibility between profiles
    results.forEach((result1, i) => {
      results.forEach((result2, j) => {
        if (i !== j) {
          const compatibility = calculateCompatibility(result1, result2)
          dynamics[result1.id].compatibility[result2.id] = compatibility
        }
      })
    })

    return dynamics
  }

  const calculateCompatibility = (profile1, profile2) => {
    const role1 = profile1.results[0]?.role
    const role2 = profile2.results[0]?.role
    
    // Complementary role pairs
    const complementaryPairs = {
      'Dominant': 'Submissive',
      'Submissive': 'Dominant',
      'Rigger': 'Rope bunny',
      'Rope bunny': 'Rigger',
      'Sadist': 'Masochist',
      'Masochist': 'Sadist',
      'Brat tamer': 'Brat',
      'Brat': 'Brat tamer',
      'Daddy/Mommy': 'Little',
      'Little': 'Daddy/Mommy',
      'Owner': 'Pet',
      'Pet': 'Owner',
      'Master/Mistress': 'Slave',
      'Slave': 'Master/Mistress',
      'Degrader': 'Degradee',
      'Degradee': 'Degrader',
      'Primal (Hunter)': 'Primal (Prey)',
      'Primal (Prey)': 'Primal (Hunter)'
    }

    if (complementaryPairs[role1] === role2) {
      return { score: 95, type: 'complementary', description: 'Perfect complementary roles!' }
    }

    if (role1 === role2) {
      return { score: 85, type: 'matching', description: 'Same role preferences' }
    }

    // Check for switch compatibility
    if (role1 === 'Switch' || role2 === 'Switch') {
      return { score: 80, type: 'switch', description: 'Switch flexibility enhances compatibility' }
    }

    return { score: 60, type: 'neutral', description: 'Different but compatible preferences' }
  }

  const addPositionPreference = (testId, category, position) => {
    setPositionPreferences(prev => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        [category]: [...(prev[testId]?.[category] || []), position]
      }
    }))
  }

  const removePositionPreference = (testId, category, positionName) => {
    setPositionPreferences(prev => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        [category]: prev[testId]?.[category]?.filter(p => p.name !== positionName) || []
      }
    }))
  }

  const getCompatibilityColor = (score) => {
    if (score >= 90) return 'text-green-400 bg-green-500/20'
    if (score >= 80) return 'text-blue-400 bg-blue-500/20'
    if (score >= 70) return 'text-yellow-400 bg-yellow-500/20'
    return 'text-red-400 bg-red-500/20'
  }

  const roleDynamicsData = analyzeRoleDynamics()

  const handlePositionClick = (position) => {
    setSelectedPosition(position)
    setShowPositionModal(true)
  }

  // Generate position recommendations based on BDSM test results
  const generateRecommendations = () => {
    const recommendations = {
      individual: {},
      couples: [],
      sweet: {}
    }

    results.forEach((result, index) => {
      const topRoles = result.results.slice(0, 3)
      const individualRecs = []
      const sweetRecs = []

      // Individual recommendations based on top roles
      topRoles.forEach(role => {
        const roleName = role.role.toLowerCase()
        
        // Power exchange recommendations
        if (roleName.includes('dominant') || roleName.includes('master') || roleName.includes('daddy')) {
          individualRecs.push({
            category: 'power-exchange',
            position: 'Dominant',
            reason: `Your ${role.percentage}% ${role.role} score suggests you enjoy taking control`,
            confidence: role.percentage
          })
        }
        
        if (roleName.includes('submissive') || roleName.includes('slave') || roleName.includes('little')) {
          individualRecs.push({
            category: 'power-exchange',
            position: 'Submissive',
            reason: `Your ${role.percentage}% ${role.role} score indicates you enjoy surrendering control`,
            confidence: role.percentage
          })
        }

        // Physical position recommendations based on roles
        if (roleName.includes('sadist') || roleName.includes('rigger')) {
          individualRecs.push({
            category: 'physical-positions',
            position: 'Doggy Style',
            reason: `Your ${role.percentage}% ${role.role} score suggests you'd enjoy positions with control`,
            confidence: role.percentage
          })
        }

        if (roleName.includes('masochist') || roleName.includes('rope bunny')) {
          individualRecs.push({
            category: 'physical-positions',
            position: 'Butterfly',
            reason: `Your ${role.percentage}% ${role.role} score indicates you enjoy being vulnerable`,
            confidence: role.percentage
          })
        }

        // Sweet/gentle recommendations for high scores
        if (role.percentage >= 80) {
          if (roleName.includes('switch')) {
            sweetRecs.push({
              category: 'physical-positions',
              position: 'Missionary',
              reason: `Your high ${role.percentage}% Switch score suggests you'd enjoy intimate, face-to-face positions`,
              confidence: role.percentage
            })
          }
          
          if (roleName.includes('submissive') || roleName.includes('little')) {
            sweetRecs.push({
              category: 'physical-positions',
              position: 'Spooning',
              reason: `Your ${role.percentage}% ${role.role} score suggests gentle, intimate positions would be perfect`,
              confidence: role.percentage
            })
          }
        }
      })

      recommendations.individual[result.id] = individualRecs
      recommendations.sweet[result.id] = sweetRecs
    })

    // Couples recommendations
    if (results.length >= 2) {
      for (let i = 0; i < results.length; i++) {
        for (let j = i + 1; j < results.length; j++) {
          const result1 = results[i]
          const result2 = results[j]
          const coupleRecs = []

          const role1 = result1.results[0]?.role.toLowerCase()
          const role2 = result2.results[0]?.role.toLowerCase()
          const score1 = result1.results[0]?.percentage || 0
          const score2 = result2.results[0]?.percentage || 0

          // Complementary role recommendations
          if ((role1.includes('dominant') && role2.includes('submissive')) ||
              (role1.includes('submissive') && role2.includes('dominant'))) {
            coupleRecs.push({
              category: 'intense-positions',
              position: 'Deep Doggy',
              reason: `Perfect complementary roles: ${result1.results[0]?.role} (${score1}%) and ${result2.results[0]?.role} (${score2}%)`,
              confidence: Math.min(score1, score2)
            })
          }

          if ((role1.includes('rigger') && role2.includes('rope bunny')) ||
              (role1.includes('rope bunny') && role2.includes('rigger'))) {
            coupleRecs.push({
              category: 'bondage-positions',
              position: 'Spread Eagle',
              reason: `Ideal bondage pair: ${result1.results[0]?.role} (${score1}%) and ${result2.results[0]?.role} (${score2}%)`,
              confidence: Math.min(score1, score2)
            })
          }

          // Switch compatibility
          if (role1.includes('switch') || role2.includes('switch')) {
            coupleRecs.push({
              category: 'physical-positions',
              position: 'Cowgirl',
              reason: `Switch flexibility allows for dynamic role changes during play`,
              confidence: Math.max(score1, score2)
            })
          }

          // High intensity for high scores
          if (score1 >= 85 && score2 >= 85) {
            coupleRecs.push({
              category: 'intense-positions',
              position: 'Carry Pound',
              reason: `Both partners have high scores (${score1}% and ${score2}%) - perfect for intense positions`,
              confidence: Math.min(score1, score2)
            })
          }

          // Sweet recommendations for moderate scores
          if (score1 <= 60 && score2 <= 60) {
            coupleRecs.push({
              category: 'physical-positions',
              position: 'Spooning',
              reason: `Moderate scores suggest gentle, intimate positions would be most comfortable`,
              confidence: 100 - Math.max(score1, score2)
            })
          }

          if (coupleRecs.length > 0) {
            recommendations.couples.push({
              partner1: result1,
              partner2: result2,
              recommendations: coupleRecs
            })
          }
        }
      }
    }

    return recommendations
  }

  const recommendations = generateRecommendations()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Position & Role Dynamics</h2>
          <p className="text-purple-200">Track position preferences and analyze role compatibility</p>
        </div>
                 <div className="flex gap-2">
           <button
             onClick={() => setShowHowToGuide(true)}
             className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-colors"
           >
             <Target className="w-4 h-4" />
             How-To Guide
           </button>
           <button
             onClick={() => setShowRecommendations(true)}
             className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors"
           >
             <Star className="w-4 h-4" />
             Get Recommendations
           </button>
           <button
             onClick={() => setShowAddPosition(true)}
             className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
           >
             <Plus className="w-4 h-4" />
             Add Position
           </button>
         </div>
      </div>

      {/* Role Dynamics Analysis */}
      {results.length >= 2 && (
        <div className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Role Compatibility Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((result1, i) => (
              <div key={result1.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {result1.selectedEmoji || '♞'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{result1.testName || `Profile ${i + 1}`}</h4>
                    <p className="text-sm text-purple-300">
                      Primary: {roleDynamicsData[result1.id]?.primaryRole || 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Compatibility with other profiles */}
                {results.map((result2, j) => {
                  if (i !== j) {
                    const compatibility = roleDynamicsData[result1.id]?.compatibility[result2.id]
                    if (compatibility) {
                      return (
                        <div key={result2.id} className="bg-gray-700/30 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-purple-300">with</span>
                              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-xs">
                                  {result2.selectedEmoji || '♞'}
                                </span>
                              </div>
                              <span className="text-sm text-white">{result2.testName || `Profile ${j + 1}`}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCompatibilityColor(compatibility.score)}`}>
                              {compatibility.score}%
                            </span>
                          </div>
                          <p className="text-xs text-purple-200">{compatibility.description}</p>
                        </div>
                      )
                    }
                  }
                  return null
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Position Preferences by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(positionCategories).map(([categoryKey, category]) => (
          <div key={categoryKey} className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">{category.emoji}</span>
              {category.name}
            </h3>
            
                         <div className="space-y-3">
               {category.positions.map((position) => (
                 <div key={position.name} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                   <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => handlePositionClick(position)}>
                     <span className="text-xl">{position.emoji}</span>
                     <div>
                       <h4 className="font-medium text-white">{position.name}</h4>
                       <p className="text-sm text-purple-300">{position.description}</p>
                     </div>
                   </div>
                  
                  <div className="flex gap-2">
                    {results.map((result, index) => {
                      const isSelected = positionPreferences[result.id]?.[categoryKey]?.some(p => p.name === position.name)
                      return (
                        <button
                          key={result.id}
                          onClick={() => {
                            if (isSelected) {
                              removePositionPreference(result.id, categoryKey, position.name)
                            } else {
                              addPositionPreference(result.id, categoryKey, position)
                            }
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                            isSelected 
                              ? 'bg-purple-500 text-white' 
                              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          }`}
                          title={`${result.testName || `Profile ${index + 1}`}: ${isSelected ? 'Remove' : 'Add'}`}
                        >
                          {result.selectedEmoji || '♞'}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Position Preferences Summary */}
      {Object.keys(positionPreferences).length > 0 && (
        <div className="bg-gray-800/50 border border-purple-400/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Position Preferences Summary
          </h3>
          
          <div className="space-y-4">
            {results.map((result, index) => {
              const preferences = positionPreferences[result.id]
              if (!preferences) return null
              
              return (
                <div key={result.id} className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {result.selectedEmoji || '♞'}
                      </span>
                    </div>
                    <h4 className="font-semibold text-white">{result.testName || `Profile ${index + 1}`}</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(preferences).map(([categoryKey, positions]) => (
                      <div key={categoryKey} className="space-y-2">
                        <h5 className="text-sm font-medium text-purple-300 flex items-center gap-2">
                          <span>{positionCategories[categoryKey]?.emoji}</span>
                          {positionCategories[categoryKey]?.name}
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {positions.map((position, posIndex) => (
                            <span
                              key={posIndex}
                              className="px-2 py-1 bg-purple-500/20 text-purple-200 rounded text-xs flex items-center gap-1"
                            >
                              <span>{position.emoji}</span>
                              {position.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
                 </div>
       )}

       {/* Position Details Modal */}
       {showPositionModal && selectedPosition && (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
           onClick={() => setShowPositionModal(false)}
         >
           <motion.div
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             exit={{ scale: 0.9, opacity: 0 }}
             className="bg-gray-800 border border-purple-400/20 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
             onClick={(e) => e.stopPropagation()}
           >
             <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                 <span className="text-3xl">{selectedPosition.emoji}</span>
                 <h3 className="text-2xl font-bold text-white">{selectedPosition.name}</h3>
               </div>
               <button
                 onClick={() => setShowPositionModal(false)}
                 className="text-gray-400 hover:text-white transition-colors"
               >
                 <X className="w-6 h-6" />
               </button>
             </div>

             <div className="space-y-6">
               {/* Detailed Description */}
               <div>
                 <h4 className="text-lg font-semibold text-white mb-2">Description</h4>
                 <p className="text-purple-200 leading-relaxed">
                   {selectedPosition.detailedDescription || selectedPosition.description}
                 </p>
               </div>

               {/* Tips */}
               {selectedPosition.tips && (
                 <div>
                   <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                     <Star className="w-5 h-5" />
                     Tips & Techniques
                   </h4>
                   <ul className="space-y-2">
                     {selectedPosition.tips.map((tip, index) => (
                       <li key={index} className="flex items-start gap-2">
                         <span className="text-purple-400 mt-1">•</span>
                         <span className="text-purple-200">{tip}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               )}

               {/* Safety Notes */}
               {selectedPosition.safetyNotes && (
                 <div>
                   <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                     <Shield className="w-5 h-5" />
                     Safety Considerations
                   </h4>
                   <ul className="space-y-2">
                     {selectedPosition.safetyNotes.map((note, index) => (
                       <li key={index} className="flex items-start gap-2">
                         <span className="text-red-400 mt-1">⚠</span>
                         <span className="text-purple-200">{note}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               )}

               {/* Compatibility Notes */}
               <div>
                 <h4 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                   <Heart className="w-5 h-5" />
                   Compatibility
                 </h4>
                 <p className="text-purple-200">
                   This position works well with partners who enjoy {selectedPosition.description.toLowerCase()}. 
                   Always communicate openly about comfort, limits, and desires before attempting any new position.
                 </p>
               </div>

                {/* General Safety Guidelines */}
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6" />
                    Essential Safety Guidelines
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-lg font-semibold text-red-200 mb-3">Before Any Position:</h5>
                      <ul className="text-red-100 space-y-2 text-sm">
                        <li>• Establish clear safe words and signals</li>
                        <li>• Discuss limits, boundaries, and expectations</li>
                        <li>• Ensure both partners are comfortable and consenting</li>
                        <li>• Have emergency contacts readily available</li>
                        <li>• Prepare safety equipment (scissors, first aid)</li>
                        <li>• Choose a safe, private environment</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold text-red-200 mb-3">During Play:</h5>
                      <ul className="text-red-100 space-y-2 text-sm">
                        <li>• Always respect safe words immediately</li>
                        <li>• Check in regularly with your partner</li>
                        <li>• Monitor physical and emotional state</li>
                        <li>• Communicate clearly about comfort and limits</li>
                        <li>• Be prepared to stop or adjust at any time</li>
                        <li>• Watch for signs of distress or discomfort</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* External Resources Section */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-blue-300 mb-4 flex items-center gap-2">
                    <Target className="w-6 h-6" />
                    External Learning Resources
                  </h4>
                  
                  <div className="space-y-6">
                    {/* Visual Guides */}
                    <div>
                      <h5 className="text-lg font-semibold text-blue-200 mb-3">📸 Visual Position Guides</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h6 className="font-medium text-blue-300 mb-2">Anatomical Diagrams</h6>
                          <ul className="text-blue-100 space-y-1 text-sm">
                            <li>• <a href="https://www.kinkly.com/position-guides" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Kinkly Position Library</a></li>
                            <li>• <a href="https://www.cosmopolitan.com/sex-love/sex-positions/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Cosmopolitan Sex Positions</a></li>
                            <li>• <a href="https://www.menshealth.com/sex-women/g19544885/sex-positions/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Men's Health Position Guide</a></li>
                          </ul>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h6 className="font-medium text-blue-300 mb-2">BDSM-Specific Visuals</h6>
                          <ul className="text-blue-100 space-y-1 text-sm">
                            <li>• <a href="https://www.fetlife.com/groups/rope-bondage" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">FetLife Rope Bondage Group</a></li>
                            <li>• <a href="https://www.reddit.com/r/BDSMcommunity/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">BDSM Community Reddit</a></li>
                            <li>• <a href="https://www.tumblr.com/tagged/bdsm-positions" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">BDSM Positions on Tumblr</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Video Tutorials */}
                    <div>
                      <h5 className="text-lg font-semibold text-blue-200 mb-3">🎥 Video Tutorials</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h6 className="font-medium text-blue-300 mb-2">Educational Platforms</h6>
                          <ul className="text-blue-100 space-y-1 text-sm">
                            <li>• <a href="https://www.youtube.com/c/KinkUniversity" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Kink University (YouTube)</a></li>
                            <li>• <a href="https://www.youtube.com/c/WattsTheSafeword" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Watts the Safeword</a></li>
                            <li>• <a href="https://www.youtube.com/c/EvieLupine" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Evie Lupine BDSM</a></li>
                          </ul>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h6 className="font-medium text-blue-300 mb-2">Professional Content</h6>
                          <ul className="text-blue-100 space-y-1 text-sm">
                            <li>• <a href="https://www.kinkacademy.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Kink Academy</a></li>
                            <li>• <a href="https://www.crash-restraint.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Crash Restraint (Rope)</a></li>
                            <li>• <a href="https://www.theduchy.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">The Duchy (Rope Tutorials)</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Written Guides */}
                    <div>
                      <h5 className="text-lg font-semibold text-blue-200 mb-3">📚 Comprehensive Written Guides</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h6 className="font-medium text-blue-300 mb-2">BDSM Education</h6>
                          <ul className="text-blue-100 space-y-1 text-sm">
                            <li>• <a href="https://www.bdsmtest.org/education" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">BDSM Test Education</a></li>
                            <li>• <a href="https://www.fetlife.com/learning" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">FetLife Learning Center</a></li>
                            <li>• <a href="https://www.kinkly.com/education" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Kinkly Education Hub</a></li>
                          </ul>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h6 className="font-medium text-blue-300 mb-2">Safety & Technique</h6>
                          <ul className="text-blue-100 space-y-1 text-sm">
                            <li>• <a href="https://www.ncsfreedom.org/resources/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">NCSF Safety Resources</a></li>
                            <li>• <a href="https://www.rope365.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Rope365 Daily Tutorials</a></li>
                            <li>• <a href="https://www.bdsmwiki.info/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">BDSM Wiki</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Position-Specific Resources */}
                    <div>
                      <h5 className="text-lg font-semibold text-blue-200 mb-3">🎯 Position-Specific Resources</h5>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h6 className="font-medium text-blue-300 mb-2">Power Exchange</h6>
                          <ul className="text-blue-100 space-y-1 text-sm">
                            <li>• <a href="https://www.dominantguide.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Dominant Guide</a></li>
                            <li>• <a href="https://www.submissiveguide.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Submissive Guide</a></li>
                            <li>• <a href="https://www.switchguide.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Switch Guide</a></li>
                          </ul>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h6 className="font-medium text-blue-300 mb-2">Bondage & Rope</h6>
                          <ul className="text-blue-100 space-y-1 text-sm">
                            <li>• <a href="https://www.twistedmonk.com/learn/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Twisted Monk Tutorials</a></li>
                            <li>• <a href="https://www.rope365.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Rope365 Daily</a></li>
                            <li>• <a href="https://www.ropeconnection.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Rope Connection</a></li>
                          </ul>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h6 className="font-medium text-blue-300 mb-2">Impact Play</h6>
                          <ul className="text-blue-100 space-y-1 text-sm">
                            <li>• <a href="https://www.impactplayguide.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Impact Play Guide</a></li>
                            <li>• <a href="https://www.spankingguide.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Spanking Guide</a></li>
                            <li>• <a href="https://www.floggingguide.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Flogging Guide</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Community & Events */}
                    <div>
                      <h5 className="text-lg font-semibold text-blue-200 mb-3">🤝 Community & Events</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h6 className="font-medium text-blue-300 mb-2">Online Communities</h6>
                          <ul className="text-blue-100 space-y-1 text-sm">
                            <li>• <a href="https://www.fetlife.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">FetLife Community</a></li>
                            <li>• <a href="https://www.reddit.com/r/BDSMcommunity/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">BDSM Community Reddit</a></li>
                            <li>• <a href="https://discord.gg/bdsm" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">BDSM Discord Servers</a></li>
                          </ul>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h6 className="font-medium text-blue-300 mb-2">Events & Workshops</h6>
                          <ul className="text-blue-100 space-y-1 text-sm">
                            <li>• <a href="https://www.fetlife.com/events" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">FetLife Events</a></li>
                            <li>• <a href="https://www.kinkacademy.com/events" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Kink Academy Events</a></li>
                            <li>• <a href="https://www.bdsmconferences.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">BDSM Conferences</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Safety & Legal */}
                    <div>
                      <h5 className="text-lg font-semibold text-blue-200 mb-3">🛡️ Safety & Legal Resources</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h6 className="font-medium text-blue-300 mb-2">Safety Organizations</h6>
                          <ul className="text-blue-100 space-y-1 text-sm">
                            <li>• <a href="https://www.ncsfreedom.org/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">NCSF (National Coalition)</a></li>
                            <li>• <a href="https://www.woodhullfoundation.org/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Woodhull Freedom Foundation</a></li>
                            <li>• <a href="https://www.consentacademy.org/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Consent Academy</a></li>
                          </ul>
                        </div>
                        <div className="bg-gray-700/30 rounded-lg p-4">
                          <h6 className="font-medium text-blue-300 mb-2">Medical & Health</h6>
                          <ul className="text-blue-100 space-y-1 text-sm">
                            <li>• <a href="https://www.plannedparenthood.org/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">Planned Parenthood</a></li>
                            <li>• <a href="https://www.cdc.gov/std/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">CDC STD Information</a></li>
                            <li>• <a href="https://www.ashasexualhealth.org/" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 underline">ASHA Sexual Health</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                      <h6 className="font-medium text-yellow-300 mb-2">⚠️ Important Disclaimer</h6>
                      <p className="text-yellow-100 text-sm">
                        These external resources are provided for educational purposes only. Always verify the credibility of sources, 
                        prioritize safety, and ensure all activities are consensual. The links provided are examples and may not be 
                        actively maintained. Always research thoroughly before engaging in any BDSM activities.
                      </p>
                    </div>
                  </div>
                                 </div>
               </div>
             </motion.div>
           </motion.div>
         )}

         {/* Recommendations Modal */}
         {showRecommendations && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
             onClick={() => setShowRecommendations(false)}
           >
             <motion.div
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-gray-800 border border-purple-400/20 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
               onClick={(e) => e.stopPropagation()}
             >
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                   <Star className="w-8 h-8 text-yellow-400" />
                   <h3 className="text-2xl font-bold text-white">Position Recommendations</h3>
                 </div>
                 <button
                   onClick={() => setShowRecommendations(false)}
                   className="text-gray-400 hover:text-white transition-colors"
                 >
                   <X className="w-6 h-6" />
                 </button>
               </div>

               <div className="space-y-8">
                 {/* Individual Recommendations */}
                 <div>
                   <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                     <Users className="w-5 h-5" />
                     Individual Recommendations
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {results.map((result, index) => {
                       const individualRecs = recommendations.individual[result.id] || []
                       const sweetRecs = recommendations.sweet[result.id] || []
                       
                       return (
                         <div key={result.id} className="bg-gray-700/30 rounded-lg p-4">
                           <div className="flex items-center gap-3 mb-3">
                             <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                               <span className="text-white font-bold text-sm">
                                 {result.selectedEmoji || '♞'}
                               </span>
                             </div>
                             <h5 className="font-semibold text-white">{result.testName || `Profile ${index + 1}`}</h5>
                           </div>
                           
                           <div className="space-y-3">
                             {individualRecs.map((rec, recIndex) => (
                               <div key={recIndex} className="bg-gray-600/30 rounded p-3">
                                 <div className="flex items-center justify-between mb-2">
                                   <span className="text-sm font-medium text-purple-300">
                                     {positionCategories[rec.category]?.emoji} {rec.position}
                                   </span>
                                   <span className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded">
                                     {rec.confidence}% match
                                   </span>
                                 </div>
                                 <p className="text-xs text-purple-200">{rec.reason}</p>
                               </div>
                             ))}
                             
                             {/* Sweet Recommendations */}
                             {sweetRecs.length > 0 && (
                               <div className="mt-4">
                                 <h6 className="text-sm font-medium text-pink-300 mb-2 flex items-center gap-1">
                                   <Heart className="w-4 h-4" />
                                   Sweet & Gentle
                                 </h6>
                                 {sweetRecs.map((rec, recIndex) => (
                                   <div key={recIndex} className="bg-pink-500/10 border border-pink-500/20 rounded p-3 mb-2">
                                     <div className="flex items-center justify-between mb-2">
                                       <span className="text-sm font-medium text-pink-300">
                                         {positionCategories[rec.category]?.emoji} {rec.position}
                                       </span>
                                       <span className="text-xs bg-pink-500/20 text-pink-200 px-2 py-1 rounded">
                                         {rec.confidence}% match
                                       </span>
                                     </div>
                                     <p className="text-xs text-pink-200">{rec.reason}</p>
                                   </div>
                                 ))}
                               </div>
                             )}
                           </div>
                         </div>
                       )
                     })}
                   </div>
                 </div>

                 {/* Couples Recommendations */}
                 {recommendations.couples.length > 0 && (
                   <div>
                     <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                       <Heart className="w-5 h-5" />
                       Couples Recommendations
                     </h4>
                     <div className="space-y-4">
                       {recommendations.couples.map((couple, index) => (
                         <div key={index} className="bg-gray-700/30 rounded-lg p-4">
                           <div className="flex items-center gap-3 mb-4">
                             <div className="flex items-center gap-2">
                               <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                 <span className="text-white font-bold text-sm">
                                   {couple.partner1.selectedEmoji || '♞'}
                                 </span>
                               </div>
                               <span className="text-white font-medium">{couple.partner1.testName || 'Partner 1'}</span>
                             </div>
                             <span className="text-purple-300">+</span>
                             <div className="flex items-center gap-2">
                               <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                 <span className="text-white font-bold text-sm">
                                   {couple.partner2.selectedEmoji || '♞'}
                                 </span>
                               </div>
                               <span className="text-white font-medium">{couple.partner2.testName || 'Partner 2'}</span>
                             </div>
                           </div>
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                             {couple.recommendations.map((rec, recIndex) => (
                               <div key={recIndex} className="bg-gray-600/30 rounded p-3">
                                 <div className="flex items-center justify-between mb-2">
                                   <span className="text-sm font-medium text-purple-300">
                                     {positionCategories[rec.category]?.emoji} {rec.position}
                                   </span>
                                   <span className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded">
                                     {rec.confidence}% match
                                   </span>
                                 </div>
                                 <p className="text-xs text-purple-200">{rec.reason}</p>
                               </div>
                             ))}
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}

                 {/* No Recommendations Message */}
                 {Object.keys(recommendations.individual).length === 0 && recommendations.couples.length === 0 && (
                   <div className="text-center py-8">
                     <Star className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                     <h4 className="text-lg font-semibold text-gray-400 mb-2">No Recommendations Yet</h4>
                     <p className="text-gray-500">Add more BDSM test results to get personalized position recommendations!</p>
                   </div>
                 )}
               </div>
             </motion.div>
           </motion.div>
         )}

        {/* How-To Guide Modal */}
        <HowToGuideModal 
          isOpen={showHowToGuide} 
          onClose={() => setShowHowToGuide(false)} 
        />
     </motion.div>
   )
 }

export default PositionPreferences
