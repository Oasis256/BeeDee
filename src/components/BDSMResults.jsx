import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, TrendingUp, Heart, Zap, Info, X } from 'lucide-react'

const BDSMResults = ({ results }) => {
  const [expandedRoles, setExpandedRoles] = useState({})
  const [hoveredRole, setHoveredRole] = useState(null)

  const toggleRoleExpansion = (resultId, role) => {
    const key = `${resultId}-${role}`
    setExpandedRoles(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }
  const getColorClass = (color) => {
    switch (color) {
      case 'green': return 'bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600'
      case 'yellow': return 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600'
      case 'orange': return 'bg-gradient-to-r from-orange-400 via-orange-500 to-red-500'
      case 'red': return 'bg-gradient-to-r from-red-400 via-red-500 to-pink-600'
      default: return 'bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600'
    }
  }

  const getEmoji = (role) => {
    // Clean the role name first (remove "More info" and tabs/unicode chars)
    const cleanRole = role.replace(/[\t\u00c2\u00a0]*More[\u00c2\u00a0\s]*info/gi, '').replace(/\s+/g, ' ').trim();
    
    const emojiMap = {
      'Submissive': '🙇‍♀️',
      'Dominant': '👑',
      'Switch': '🔄',
      'Voyeur': '👁️',
      'Exhibitionist': '🎭',
      'Rope bunny': '🪢',
      'Rigger': '🎪',
      'Masochist': '💔',
      'Sadist': '⚡',
      'Brat': '😈',
      'Brat tamer': '🎯',
      'Daddy/Mommy': '👨‍👩‍👧‍👦',
      'Little': '🧸',
      'Ageplayer': '🎠',
      'Pet': '🐾',
      'Owner': '🏠',
      'Master/Mistress': '⚜️',
      'Slave': '⛓️',
      'Degrader': '🗣️',
      'Degradee': '😔',
      'Primal (Hunter)': '🐺',
      'Primal (Prey)': '🦌',
      'Experimentalist': '🧪',
      'Vanilla': '🍦',
      'Non-monogamist': '💕',
      'Monogamist': '💍',
      'Boy/Girl': '👶',
      'Caregiver': '🤱'
    }
    return emojiMap[cleanRole] || '❓'
  }

  const getRoleDescription = (role, result) => {
    // First try to use scraped description from the server
    if (result && result.description) {
      return result.description;
    }
    
    // Fallback to hardcoded descriptions
    const descriptions = {
      'Submissive': 'Enjoys being controlled, following orders, and serving their partner. Often finds pleasure in giving up control and being guided.',
      'Dominant': 'Takes control in scenes, enjoys giving orders, and leading their partner. Finds pleasure in being in charge and directing activities.',
      'Switch': 'Enjoys both dominant and submissive roles, can adapt to different situations and partner preferences.',
      'Voyeur': 'Gets aroused by watching others engage in sexual activities. Enjoys observing without necessarily participating.',
      'Exhibitionist': 'Enjoys being watched during sexual activities. Gets pleasure from performing for others or being seen.',
      'Rope bunny': 'Enjoys being tied up, restrained, or bound. Finds pleasure in the sensation and helplessness of bondage.',
      'Rigger': 'Enjoys tying up their partner, creating intricate bondage patterns, and controlling through restraint.',
      'Masochist': 'Enjoys receiving pain or discomfort for sexual pleasure. Finds arousal in physical sensations like spanking, biting, etc.',
      'Sadist': 'Enjoys giving pain or discomfort to their partner for sexual pleasure. Finds arousal in causing controlled physical sensations.',
      'Brat': 'A submissive who enjoys being playful, disobedient, or challenging. Often provokes their dominant for fun.',
      'Brat tamer': 'Enjoys dealing with bratty behavior, using discipline and control to manage playful disobedience.',
      'Daddy/Mommy': 'Takes on a nurturing, caring dominant role. Often involves age play or caregiver dynamics.',
      'Little': 'Enjoys age regression, being cared for, and taking on a younger persona in scenes.',
      'Ageplayer': 'Enjoys role-playing different ages, often involving age regression or age progression scenarios.',
      'Pet': 'Enjoys taking on animal characteristics, often involves pet play, collars, and animal-like behavior.',
      'Owner': 'Takes responsibility for their pet partner, provides care, training, and guidance.',
      'Master/Mistress': 'A more formal dominant role, often involves strict protocols, training, and long-term power exchange.',
      'Slave': 'A more intense submissive role, often involves complete submission, protocols, and serving their master/mistress.',
      'Degrader': 'Enjoys verbally or emotionally degrading their partner, using humiliation and verbal control.',
      'Degradee': 'Enjoys being verbally or emotionally degraded, finds pleasure in humiliation and verbal submission.',
      'Primal (Hunter)': 'Enjoys predatory behavior, chasing, and taking what they want. Often involves animalistic instincts.',
      'Primal (Prey)': 'Enjoys being chased, caught, and "hunted" by their partner. Finds pleasure in the chase and capture.',
      'Experimentalist': 'Enjoys trying new things, exploring different kinks, and being open to new experiences.',
      'Vanilla': 'Prefers traditional, non-kinky sexual activities. Enjoys conventional romantic and sexual experiences.',
      'Non-monogamist': 'Enjoys having multiple partners or open relationships. Finds fulfillment in polyamory or ethical non-monogamy.'
    }
    return descriptions[role] || 'A BDSM role or kink preference that involves specific dynamics and activities.'
  }

  return (
    <div className="space-y-6">
      {results.map((result, index) => (
        <motion.div
          key={result.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-effect rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {result.selectedEmoji || '♞'}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {result.selectedEmoji || '♞'} {result.testName || `Test ${index + 1}`}
              </h3>
              <p className="text-purple-200 text-sm">
                {result.error ? 'Error loading results' : `${result.results.length} roles analyzed`}
              </p>
              {result.dataSource && (
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    result.dataSource === 'real' 
                      ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                      : 'bg-orange-500/20 text-orange-300 border border-orange-400/30'
                  }`}>
                    {result.dataSource === 'real' ? '🔗 REAL DATA (Puppeteer)' : '🎭 Demo Data'}
                  </span>
                  {result.message && (
                    <span className="text-xs text-orange-300 opacity-80">
                      {result.message}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {result.error ? (
            <div className="text-red-300 p-4 bg-red-500/20 rounded-lg">
              {result.error}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Color Legend with Tooltips */}
              <div className="mb-4 p-3 bg-white/5 rounded-lg border border-purple-400/20">
                <h5 className="text-white font-semibold mb-2 text-center text-sm">Percentage Color Guide</h5>
                <div className="flex flex-wrap justify-center gap-3">
                  <div className="flex items-center gap-2 group relative">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                    <span className="text-white text-xs">90%+</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-purple-900/95 backdrop-blur-sm border border-purple-400/30 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-purple-100 whitespace-nowrap z-20">
                      Excellent
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 group relative">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                    <span className="text-white text-xs">60-89%</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-purple-900/95 backdrop-blur-sm border border-purple-400/30 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-purple-100 whitespace-nowrap z-20">
                      Good
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 group relative">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                    <span className="text-white text-xs">40-59%</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-purple-900/95 backdrop-blur-sm border border-purple-400/30 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-purple-100 whitespace-nowrap z-20">
                      Moderate
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 group relative">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-400 via-red-500 to-pink-600 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                    <span className="text-white text-xs">0-39%</span>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-purple-900/95 backdrop-blur-sm border border-purple-400/30 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-purple-100 whitespace-nowrap z-20">
                      Low
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="text-purple-300 w-5 h-5" />
                <h4 className="text-lg font-semibold text-white">All Results ({result.results.length} roles)</h4>
              </div>
              
              {result.results.map((item, itemIndex) => {
                const isExpanded = expandedRoles[`${result.id}-${item.role}`]
                const roleKey = `${result.id}-${item.role}`
                const isHovered = hoveredRole === roleKey
                
                return (
                  <div key={item.role} className="space-y-2 relative">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: itemIndex * 0.05 }}
                      className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                      onMouseEnter={() => setHoveredRole(roleKey)}
                      onMouseLeave={() => setHoveredRole(null)}
                      onClick={() => toggleRoleExpansion(result.id, item.role)}
                    >
                      <span className="text-2xl">{getEmoji(item.role)}</span>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-medium">
                            {item.role.replace(/[\t\u00c2\u00a0]*More[\u00c2\u00a0\s]*info.*$/gi, '').trim()}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-purple-200 font-bold">{item.percentage}%</span>
                            <div className="p-1 text-purple-300 transition-colors">
                              {isExpanded ? <X className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-700 rounded-full h-2 relative overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 1, delay: itemIndex * 0.1 }}
                            className={`h-2 rounded-full ${getColorClass(item.color)} relative`}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                    
               {/* Hover Tooltip */}
               <AnimatePresence>
                 {isHovered && !isExpanded && (
                   <motion.div
                     initial={{ opacity: 0, y: -10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: -10, scale: 0.95 }}
                     transition={{ duration: 0.2 }}
                     className="absolute z-10 top-full left-0 mt-2 p-4 bg-purple-900/95 backdrop-blur-sm border border-purple-400/30 rounded-lg shadow-xl max-w-sm"
                   >
                     <p className="text-purple-100 text-sm leading-relaxed break-words">
                       {getRoleDescription(item.role, item)}
                     </p>
                     <div className="text-xs text-purple-300 mt-2 opacity-80">
                       Click to expand
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
                    
                    {/* Expandable Description */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg"
                        >
                          <p className="text-purple-200 text-sm leading-relaxed">
                            {getRoleDescription(item.role, item)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

export default BDSMResults
