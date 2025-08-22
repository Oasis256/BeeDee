import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, TrendingUp, Heart, Zap, Users, Info, X } from 'lucide-react'

const ComparisonGraph = ({ results }) => {
  const [expandedRoles, setExpandedRoles] = useState({})
  const [hoveredRole, setHoveredRole] = useState(null)

  const toggleRoleExpansion = (role) => {
    setExpandedRoles(prev => ({
      ...prev,
      [role]: !prev[role]
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
    const emoji = emojiMap[cleanRole] || '❓'
    if (emoji === '❓') {
      console.log(`No emoji found for role: "${cleanRole}" (original: "${role}")`);
    }
    return emoji
  }

  const getRoleDescription = (role) => {
    // Clean the role name first (remove "More info" and tabs/unicode chars)
    const cleanRole = role.replace(/[\t\u00c2\u00a0]*More[\u00c2\u00a0\s]*info/gi, '').replace(/\s+/g, ' ').trim();
    
    // Try to find the role in any of the results to get the scraped description
    for (const result of results) {
      if (result.results) {
        const roleResult = result.results.find(r => r.role === role);
        if (roleResult && roleResult.description) {
          console.log(`Found scraped description for ${cleanRole}:`, roleResult.description);
          return roleResult.description;
        }
      }
    }
    
    console.log(`No scraped description found for ${cleanRole}, using fallback`);
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
      'Non-monogamist': 'Enjoys having multiple partners or open relationships. Finds fulfillment in polyamory or ethical non-monogamy.',
      'Monogamist': 'Prefers exclusive, committed relationships with one partner. Values deep emotional and physical connection.',
      'Boy/Girl': 'Enjoys age play where they take on a younger persona, often involves being cared for and guided.',
      'Caregiver': 'Takes on a nurturing, protective role, often involves caring for and guiding their partner.'
    }
    return descriptions[role] || 'A BDSM role or kink preference that involves specific dynamics and activities.'
  }

  // Get all unique roles from all results
  const allRoles = [...new Set(results.flatMap(result => 
    result.results ? result.results.map(item => item.role) : []
  ))]

  // Create a map for quick lookup of percentages by test ID and role
  const resultsMap = results.reduce((acc, result) => {
    if (result.results) {
      acc[result.id] = result.results.reduce((roleAcc, item) => {
        roleAcc[item.role] = item.percentage
        return roleAcc
      }, {})
    }
    return acc
  }, {})

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Users className="text-purple-300 w-8 h-8" />
          <h2 className="text-3xl font-bold text-white">Side-by-Side Comparison</h2>
        </div>
        <p className="text-purple-200 text-lg">
          Compare all {allRoles.length} roles across {results.length} test results
        </p>
      </motion.div>

      {/* Test IDs Header */}
      <div className="glass-effect rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {result.selectedEmoji || (index === 0 ? '♞' : index === 1 ? '🦚' : String.fromCharCode(65 + index))}
                </span>
              </div>
              <div>
                <span className="text-white font-semibold">
                  {result.selectedEmoji || (index === 0 ? '♞' : index === 1 ? '🦚' : String.fromCharCode(65 + index))} {result.testName || `Test ${String.fromCharCode(65 + index)}`}
                </span>
                <div className="text-xs text-purple-200">{result.id}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

             {/* Comparison Chart */}
       <div className="glass-effect rounded-2xl p-6">
         {/* Color Legend with Tooltips */}
         <div className="mb-6 p-4 bg-white/5 rounded-lg border border-purple-400/20">
           <h4 className="text-white font-semibold mb-3 text-center">Percentage Color Guide</h4>
           <div className="flex flex-wrap justify-center gap-4">
             <div className="flex items-center gap-2 group relative">
               <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
               </div>
               <span className="text-white text-sm">90%+</span>
               <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-purple-900/95 backdrop-blur-sm border border-purple-400/30 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-purple-100 whitespace-nowrap z-20">
                 Excellent Compatibility
               </div>
             </div>
             
             <div className="flex items-center gap-2 group relative">
               <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
               </div>
               <span className="text-white text-sm">60-89%</span>
               <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-purple-900/95 backdrop-blur-sm border border-purple-400/30 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-purple-100 whitespace-nowrap z-20">
                 Good Compatibility
               </div>
             </div>
             
             <div className="flex items-center gap-2 group relative">
               <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-red-500 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
               </div>
               <span className="text-white text-sm">40-59%</span>
               <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-purple-900/95 backdrop-blur-sm border border-purple-400/30 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-purple-100 whitespace-nowrap z-20">
                 Moderate Compatibility
               </div>
             </div>
             
             <div className="flex items-center gap-2 group relative">
               <div className="w-6 h-6 rounded-full bg-gradient-to-r from-red-400 via-red-500 to-pink-600 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
               </div>
               <span className="text-white text-sm">0-39%</span>
               <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-purple-900/95 backdrop-blur-sm border border-purple-400/30 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-purple-100 whitespace-nowrap z-20">
                 Low Compatibility
               </div>
             </div>
           </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {allRoles.map((role, roleIndex) => (
             <motion.div
               key={role}
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: roleIndex * 0.05 }}
               className="space-y-3 relative"
             >
               {/* Role Header */}
               <div 
                 className="flex items-center justify-between cursor-pointer"
                 onMouseEnter={() => setHoveredRole(role)}
                 onMouseLeave={() => setHoveredRole(null)}
                 onClick={() => toggleRoleExpansion(role)}
               >
                 <div className="flex items-center gap-2">
                   <span className="text-xl">{getEmoji(role)}</span>
                   <h3 className="text-sm font-semibold text-white truncate">
                     {role.replace(/[\t\u00c2\u00a0]*More[\u00c2\u00a0\s]*info.*$/gi, '').trim()}
                   </h3>
                 </div>
                 <div className="p-1 text-purple-300 transition-colors flex-shrink-0">
                   {expandedRoles[role] ? <X className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                 </div>
               </div>
               
               {/* Hover Tooltip */}
               <AnimatePresence>
                 {hoveredRole === role && !expandedRoles[role] && (
                   <motion.div
                     initial={{ opacity: 0, y: -10, scale: 0.95 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: -10, scale: 0.95 }}
                     transition={{ duration: 0.2 }}
                     className="absolute z-10 top-full left-0 mt-2 p-4 bg-purple-900/95 backdrop-blur-sm border border-purple-400/30 rounded-lg shadow-xl max-w-sm"
                   >
                     <p className="text-purple-100 text-xs leading-relaxed break-words">
                       {getRoleDescription(role)}
                     </p>
                     <div className="text-xs text-purple-300 mt-2 opacity-80">
                       Click to expand
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
               
               {/* Expandable Description */}
               <AnimatePresence>
                 {expandedRoles[role] && (
                   <motion.div
                     initial={{ opacity: 0, height: 0 }}
                     animate={{ opacity: 1, height: 'auto' }}
                     exit={{ opacity: 0, height: 0 }}
                     transition={{ duration: 0.3 }}
                     className="p-3 bg-purple-500/10 border border-purple-400/20 rounded-lg mb-3"
                   >
                     <p className="text-purple-200 text-xs leading-relaxed">
                       {getRoleDescription(role)}
                     </p>
                   </motion.div>
                 )}
               </AnimatePresence>

               {/* Bars */}
               <div className="space-y-2">
                 {results.map((result, resultIndex) => {
                   const percentage = resultsMap[result.id]?.[role] || 0
                   const color = percentage >= 80 ? 'green' : 
                                percentage >= 60 ? 'yellow' : 
                                percentage >= 40 ? 'orange' : 'red'
                   
                   return (
                     <motion.div
                       key={`${result.id}-${role}`}
                       initial={{ width: 0 }}
                       animate={{ width: '100%' }}
                       transition={{ duration: 1, delay: roleIndex * 0.05 + resultIndex * 0.1 }}
                       className="space-y-1"
                     >
                       <div className="flex items-center justify-between">
                         <span className="text-xs text-purple-200 font-medium">
                           {results[resultIndex]?.selectedEmoji || (resultIndex === 0 ? '♞' : resultIndex === 1 ? '🦚' : String.fromCharCode(65 + resultIndex))} {results[resultIndex]?.testName || `Test ${String.fromCharCode(65 + resultIndex)}`}
                         </span>
                         <span className="text-xs font-bold text-white">
                           {percentage}%
                         </span>
                       </div>
                       
                       <div className="w-full bg-gray-700 rounded-full h-3 relative overflow-hidden">
                         <motion.div
                           initial={{ width: 0 }}
                           animate={{ width: `${percentage}%` }}
                           transition={{ duration: 1.5, delay: roleIndex * 0.05 + resultIndex * 0.1 + 0.2 }}
                           className={`h-3 rounded-full ${getColorClass(color)} relative`}
                         >
                           <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                         </motion.div>
                       </div>
                     </motion.div>
                   )
                 })}
               </div>
             </motion.div>
           ))}
         </div>
       </div>

      {/* Legend */}
      <div className="glass-effect rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Color Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm text-white">80-100% (High)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm text-white">60-79% (Medium)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-sm text-white">40-59% (Low)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm text-white">0-39% (Very Low)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComparisonGraph
