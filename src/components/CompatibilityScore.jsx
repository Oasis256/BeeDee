import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Target, TrendingUp, Zap } from 'lucide-react'

const CompatibilityScore = ({ results }) => {
  if (results.length < 2) {
    return null
  }

  const calculateCompatibilityScore = (result1, result2) => {
    // Get all roles from both results
    const allRoles = new Set()
    result1.results.forEach(item => allRoles.add(item.role))
    result2.results.forEach(item => allRoles.add(item.role))

    let totalScore = 0
    let maxPossibleScore = 0
    let sharedInterests = 0
    let complementaryRoles = 0
    let highInterestMatches = 0

    // Define complementary role pairs
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

    // Calculate scores for each role
    Array.from(allRoles).forEach(role => {
      const result1Item = result1.results.find(item => item.role === role)
      const result2Item = result2.results.find(item => item.role === role)
      
      const percentage1 = result1Item ? result1Item.percentage : 0
      const percentage2 = result2Item ? result2Item.percentage : 0
      
      // Shared interest bonus (both have >20%)
      if (percentage1 > 20 && percentage2 > 20) {
        const sharedScore = Math.min(percentage1, percentage2) * 2
        totalScore += sharedScore
        sharedInterests++
      }
      
      // High interest bonus (either has >80%)
      if (percentage1 > 80 || percentage2 > 80) {
        const highScore = Math.max(percentage1, percentage2) * 0.5
        totalScore += highScore
        highInterestMatches++
      }
      
      // Complementary role bonus
      if (complementaryPairs[role]) {
        const complementaryRole = complementaryPairs[role].find(compRole => {
          const comp1Item = result1.results.find(item => item.role === compRole)
          const comp2Item = result2.results.find(item => item.role === compRole)
          return (comp1Item && comp1Item.percentage > 30) || (comp2Item && comp2Item.percentage > 30)
        })
        
        if (complementaryRole) {
          const comp1Item = result1.results.find(item => item.role === complementaryRole)
          const comp2Item = result2.results.find(item => item.role === complementaryRole)
          const comp1Score = comp1Item ? comp1Item.percentage : 0
          const comp2Score = comp2Item ? comp2Item.percentage : 0
          
          if (comp1Score > 30 || comp2Score > 30) {
            const complementaryScore = Math.max(comp1Score, comp2Score) * 0.8
            totalScore += complementaryScore
            complementaryRoles++
          }
        }
      }
      
      maxPossibleScore += 200 // Theoretical max per role
    })

    // Calculate final percentage
    const compatibilityPercentage = Math.min(100, Math.round((totalScore / maxPossibleScore) * 100))
    
    // Determine compatibility level
    let compatibilityLevel = 'Low'
    let levelColor = 'text-red-400'
    let levelBg = 'bg-red-500/20'
    
    if (compatibilityPercentage >= 80) {
      compatibilityLevel = 'Excellent'
      levelColor = 'text-emerald-400'
      levelBg = 'bg-emerald-500/20'
    } else if (compatibilityPercentage >= 60) {
      compatibilityLevel = 'Good'
      levelColor = 'text-green-400'
      levelBg = 'bg-green-500/20'
    } else if (compatibilityPercentage >= 40) {
      compatibilityLevel = 'Fair'
      levelColor = 'text-yellow-400'
      levelBg = 'bg-yellow-500/20'
    } else if (compatibilityPercentage >= 20) {
      compatibilityLevel = 'Poor'
      levelColor = 'text-orange-400'
      levelBg = 'bg-orange-500/20'
    }

    return {
      percentage: compatibilityPercentage,
      level: compatibilityLevel,
      levelColor,
      levelBg,
      sharedInterests,
      complementaryRoles,
      highInterestMatches,
      totalScore,
      maxPossibleScore
    }
  }

  const [result1, result2] = results
  const compatibility = calculateCompatibilityScore(result1, result2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6 mb-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Overall Compatibility Score</h3>
        <p className="text-purple-200">Based on shared interests, complementary roles, and high-interest matches</p>
      </div>

      {/* Main Score Display */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-8 border-purple-400/30 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="text-center"
            >
              <div className={`text-3xl font-bold ${compatibility.levelColor}`}>
                {compatibility.percentage}%
              </div>
              <div className="text-sm text-purple-200">
                {compatibility.level}
              </div>
            </motion.div>
          </div>
          
          {/* Animated ring */}
          <motion.div
            initial={{ strokeDasharray: "0 283" }}
            animate={{ strokeDasharray: `${(compatibility.percentage / 100) * 283} 283` }}
            transition={{ duration: 2, delay: 0.5 }}
            className="absolute inset-0 w-32 h-32"
            style={{
              transform: 'rotate(-90deg)'
            }}
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                className="drop-shadow-lg"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/10 rounded-lg p-4 text-center border border-green-400/30"
        >
          <div className="flex items-center justify-center mb-2">
            <Heart className="w-6 h-6 text-green-400 mr-2" />
            <span className="text-green-400 font-bold text-xl">{compatibility.sharedInterests}</span>
          </div>
          <div className="text-sm text-purple-200">Shared Interests</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white/10 rounded-lg p-4 text-center border border-blue-400/30"
        >
          <div className="flex items-center justify-center mb-2">
            <Target className="w-6 h-6 text-blue-400 mr-2" />
            <span className="text-blue-400 font-bold text-xl">{compatibility.complementaryRoles}</span>
          </div>
          <div className="text-sm text-purple-200">Complementary Roles</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white/10 rounded-lg p-4 text-center border border-amber-400/30"
        >
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="w-6 h-6 text-amber-400 mr-2" />
            <span className="text-amber-400 font-bold text-xl">{compatibility.highInterestMatches}</span>
          </div>
          <div className="text-sm text-purple-200">High Interest Matches</div>
        </motion.div>
      </div>

      {/* Compatibility Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="mt-6 p-4 rounded-lg bg-white/5 border border-purple-400/20"
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-purple-400" />
          <h4 className="text-lg font-semibold text-white">Compatibility Insights</h4>
        </div>
        
        {compatibility.percentage >= 80 && (
          <p className="text-green-300 text-sm">
            🎉 Excellent compatibility! You have strong shared interests and complementary dynamics that could create exciting experiences together.
          </p>
        )}
        {compatibility.percentage >= 60 && compatibility.percentage < 80 && (
          <p className="text-green-300 text-sm">
            👍 Good compatibility! You have solid shared interests and some complementary roles that could lead to fulfilling experiences.
          </p>
        )}
        {compatibility.percentage >= 40 && compatibility.percentage < 60 && (
          <p className="text-yellow-300 text-sm">
            🤔 Fair compatibility. You have some shared interests, but consider exploring new roles together to enhance your dynamic.
          </p>
        )}
        {compatibility.percentage >= 20 && compatibility.percentage < 40 && (
          <p className="text-orange-300 text-sm">
            ⚠️ Limited compatibility. Focus on your shared interests and consider open communication about exploring new areas together.
          </p>
        )}
        {compatibility.percentage < 20 && (
          <p className="text-red-300 text-sm">
            💭 Low compatibility. This might indicate different interests, but remember that communication and compromise can bridge many gaps.
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}

export default CompatibilityScore





