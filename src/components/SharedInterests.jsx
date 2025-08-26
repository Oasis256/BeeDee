import React from 'react'
import { motion } from 'framer-motion'
import { Users, TrendingUp, Heart } from 'lucide-react'

const SharedInterests = ({ results }) => {
  if (results.length < 2) {
    return null
  }

  // Generate all possible pairings
  const generatePairings = () => {
    const pairings = []
    for (let i = 0; i < results.length; i++) {
      for (let j = i + 1; j < results.length; j++) {
        pairings.push([results[i], results[j]])
      }
    }
    return pairings
  }

  const pairings = generatePairings()

  const getEmoji = (role) => {
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
      'Non-monogamist': '💕'
    }
    return emojiMap[role] || '❓'
  }

  const getColorClass = (percentage) => {
    if (percentage >= 80) return 'bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600'
    if (percentage >= 60) return 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600'
    if (percentage >= 40) return 'bg-gradient-to-r from-orange-400 via-orange-500 to-red-500'
    return 'bg-gradient-to-r from-red-400 via-red-500 to-pink-600'
  }

  // Calculate shared interests for each pairing
  const calculatePairingSharedInterests = (pairing) => {
    const [result1, result2] = pairing
    
    // Get all unique roles from both results
    const uniqueRoles = new Set()
    if (result1.results) {
      result1.results.forEach(item => uniqueRoles.add(item.role))
    }
    if (result2.results) {
      result2.results.forEach(item => uniqueRoles.add(item.role))
    }

    // Calculate shared interests for each role
    const sharedInterests = Array.from(uniqueRoles).map(role => {
      const result1Item = result1.results?.find(item => item.role === role)
      const result2Item = result2.results?.find(item => item.role === role)
      
      const percentage1 = result1Item ? result1Item.percentage : 0
      const percentage2 = result2Item ? result2Item.percentage : 0
      
      const avgPercentage = (percentage1 + percentage2) / 2
      const minPercentage = Math.min(percentage1, percentage2)
      const maxPercentage = Math.max(percentage1, percentage2)
      
      return {
        role,
        percentages: [percentage1, percentage2],
        avgPercentage: Math.round(avgPercentage),
        minPercentage,
        maxPercentage,
        isShared: percentage1 > 0 && percentage2 > 0
      }
    })

    // Sort by average percentage (highest first)
    sharedInterests.sort((a, b) => b.avgPercentage - a.avgPercentage)

    // Group by shared status
    const trulyShared = sharedInterests.filter(item => item.isShared && item.avgPercentage > 20)
    const commonHigh = sharedInterests.filter(item => item.avgPercentage > 80)
    const otherRoles = sharedInterests.filter(item => item.avgPercentage <= 50 && !item.isShared)

    return {
      trulyShared,
      commonHigh,
      otherRoles,
      allSharedInterests: sharedInterests
    }
  }

  return (
    <div className="space-y-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Individual Pairing Analysis</h2>
        <p className="text-purple-200">Detailed shared interests breakdown for each pairing</p>
      </div>
      
      {pairings.map((pairing, pairingIndex) => {
        const [result1, result2] = pairing
        const pairingData = calculatePairingSharedInterests(pairing)
        
        return (
          <motion.div
            key={`${result1.id}-${result2.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: pairingIndex * 0.2 }}
            className="glass-effect rounded-2xl p-8 border-2 border-purple-400/20"
          >
            {/* Pairing Header */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-3xl">
                    {result1.selectedEmoji || '♞'}
                  </span>
                </div>
                <div className="text-center">
                  <h4 className="text-white font-semibold text-lg">{result1.testName || `Test ${pairingIndex * 2 + 1}`}</h4>
                  <p className="text-purple-200 text-sm">{result1.id}</p>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-white font-bold text-4xl mb-2">VS</span>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <h4 className="text-white font-semibold text-lg">{result2.testName || `Test ${pairingIndex * 2 + 2}`}</h4>
                  <p className="text-purple-200 text-sm">{result2.id}</p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-3xl">
                    {result2.selectedEmoji || '♞'}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 rounded-lg p-4 text-center border border-green-400/30">
                <div className="text-2xl font-bold text-green-300">{pairingData.trulyShared.length}</div>
                <div className="text-sm text-purple-200">Shared Interests</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center border border-amber-400/30">
                <div className="text-2xl font-bold text-amber-300">{pairingData.commonHigh.length}</div>
                <div className="text-sm text-purple-200">80%+ Interest</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center border border-purple-400/30">
                <div className="text-2xl font-bold text-purple-300">{pairingData.allSharedInterests.length}</div>
                <div className="text-sm text-purple-200">Total Roles</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center border border-blue-400/30">
                <div className="text-2xl font-bold text-blue-300">
                  {pairingData.trulyShared.length > 0 ? Math.round(pairingData.trulyShared.reduce((sum, item) => sum + item.avgPercentage, 0) / pairingData.trulyShared.length) : 0}%
                </div>
                <div className="text-sm text-purple-200">Avg Shared %</div>
              </div>
            </div>

            {/* Truly Shared Interests */}
            {pairingData.trulyShared.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Truly Shared Interests</h4>
                  <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                    {pairingData.trulyShared.length} roles
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pairingData.trulyShared.map((item, index) => (
                    <motion.div
                      key={item.role}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 rounded-lg p-3 border border-green-400/30"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getEmoji(item.role)}</span>
                        <span className="text-white font-semibold text-sm">{item.role}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-green-200 text-xs">Avg:</span>
                          <span className="text-white font-bold text-sm">{item.avgPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.avgPercentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                            className={`h-1.5 rounded-full ${getColorClass(item.avgPercentage)}`}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-purple-200">
                          <span>{result1.selectedEmoji || '♞'}: {item.percentages[0]}%</span>
                          <span>{result2.selectedEmoji || '♞'}: {item.percentages[1]}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* High Interest Roles (80%+) */}
            {pairingData.commonHigh.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-white">High Interest Roles (80%+)</h4>
                  <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full text-sm font-medium">
                    {pairingData.commonHigh.length} roles
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {pairingData.commonHigh.map((item, index) => (
                    <motion.div
                      key={item.role}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="bg-white/10 rounded-lg p-3 border border-amber-400/30"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getEmoji(item.role)}</span>
                        <span className="text-white font-semibold text-sm">{item.role}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-amber-200 text-xs">Avg:</span>
                          <span className="text-white font-bold text-sm">{item.avgPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-1.5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.avgPercentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 + 0.8 }}
                            className={`h-1.5 rounded-full ${getColorClass(item.avgPercentage)}`}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-purple-200">
                          <span>{result1.selectedEmoji || '♞'}: {item.percentages[0]}%</span>
                          <span>{result2.selectedEmoji || '♞'}: {item.percentages[1]}%</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Individual Comparison Table */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white">Detailed Comparison</h4>
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium">
                  Top 10 roles
                </span>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-purple-400/30">
                      <th className="text-left py-2 px-2 text-purple-200 font-semibold">Role</th>
                      <th className="text-center py-2 px-2 text-purple-200 font-semibold">
                        {result1.selectedEmoji || '♞'} {result1.testName || 'Test 1'}
                      </th>
                      <th className="text-center py-2 px-2 text-purple-200 font-semibold">
                        {result2.selectedEmoji || '♞'} {result2.testName || 'Test 2'}
                      </th>
                      <th className="text-center py-2 px-2 text-purple-200 font-semibold">Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pairingData.allSharedInterests.slice(0, 10).map((item, rowIndex) => (
                      <motion.tr
                        key={item.role}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: rowIndex * 0.05 + 0.5 }}
                        className="border-b border-purple-400/10 hover:bg-white/5"
                      >
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{getEmoji(item.role)}</span>
                            <span className="text-white font-medium text-sm">{item.role}</span>
                          </div>
                        </td>
                        <td className="text-center py-2 px-2">
                          <span className={`font-bold text-sm ${item.percentages[0] > 50 ? 'text-green-300' : item.percentages[0] > 20 ? 'text-yellow-300' : 'text-red-300'}`}>
                            {item.percentages[0]}%
                          </span>
                        </td>
                        <td className="text-center py-2 px-2">
                          <span className={`font-bold text-sm ${item.percentages[1] > 50 ? 'text-green-300' : item.percentages[1] > 20 ? 'text-yellow-300' : 'text-red-300'}`}>
                            {item.percentages[1]}%
                          </span>
                        </td>
                        <td className="text-center py-2 px-2">
                          <span className="text-white font-bold text-sm">{item.avgPercentage}%</span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default SharedInterests
