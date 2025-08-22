import React from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp } from 'lucide-react'

const PercentageBreakdown = ({ results }) => {
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
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {result.selectedEmoji || '♞'}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {result.selectedEmoji || '♞'} {result.testName || `Test ${index + 1}`}
              </h3>
              <p className="text-purple-200 text-sm">
                {result.error ? 'Error loading results' : `${result.results.length} roles analyzed`}
              </p>
            </div>
          </div>

          {result.error ? (
            <div className="text-red-300 p-4 bg-red-500/20 rounded-lg">
              {result.error}
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="text-purple-300 w-5 h-5" />
                <h4 className="text-lg font-semibold text-white">Complete Percentage Breakdown</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.results.map((item, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: itemIndex * 0.02 }}
                    className="bg-white/5 rounded-lg p-3 border border-purple-400/20 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getEmoji(item.role)}</span>
                        <span className="text-white font-medium text-sm truncate">
                          {item.role}
                        </span>
                      </div>
                      <span className="text-white font-bold text-lg">
                        {item.percentage}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-2 relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1, delay: itemIndex * 0.02 + 0.5 }}
                        className={`h-2 rounded-full ${getColorClass(item.color)} relative`}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}

export default PercentageBreakdown





