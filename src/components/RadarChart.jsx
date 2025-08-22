import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PieChart, Target, Users } from 'lucide-react'

const RadarChart = ({ results }) => {
  if (results.length < 2) {
    return null
  }

  const [result1, result2] = results

  // Get top 8 roles for better visualization
  const topRoles = useMemo(() => {
    const allRoles = new Set()
    result1.results.forEach(item => allRoles.add(item.role))
    result2.results.forEach(item => allRoles.add(item.role))
    
    // Get the top 8 roles by average percentage
    const roleAverages = Array.from(allRoles).map(role => {
      const item1 = result1.results.find(item => item.role === role)
      const item2 = result2.results.find(item => item.role === role)
      const avg = ((item1?.percentage || 0) + (item2?.percentage || 0)) / 2
      return { role, avg }
    })
    
    return roleAverages
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 8)
      .map(item => item.role)
  }, [result1, result2])

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

  const getRoleData = (result, role) => {
    const item = result.results.find(item => item.role === role)
    return item ? item.percentage : 0
  }

  const createRadarPath = (data, radius, centerX, centerY) => {
    const points = data.map((value, index) => {
      const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2
      const x = centerX + (value / 100) * radius * Math.cos(angle)
      const y = centerY + (value / 100) * radius * Math.sin(angle)
      return `${x},${y}`
    })
    return `M ${points.join(' L ')} Z`
  }

  const createGridPath = (level, radius, centerX, centerY, numPoints) => {
    const points = Array.from({ length: numPoints }, (_, index) => {
      const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2
      const x = centerX + level * radius * Math.cos(angle)
      const y = centerY + level * radius * Math.sin(angle)
      return `${x},${y}`
    })
    return `M ${points.join(' L ')} Z`
  }

  const centerX = 200
  const centerY = 200
  const radius = 150
  const numPoints = topRoles.length

  const data1 = topRoles.map(role => getRoleData(result1, role))
  const data2 = topRoles.map(role => getRoleData(result2, role))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6 mb-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Radar Chart Comparison</h3>
        <p className="text-purple-200">Visual comparison of your top role interests</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Radar Chart */}
        <div className="flex-1">
          <div className="relative w-full max-w-md mx-auto">
            <svg width="400" height="400" viewBox="0 0 400 400" className="w-full h-auto">
              {/* Grid circles */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, index) => (
                <g key={index}>
                  <path
                    d={createGridPath(level, radius, centerX, centerY, numPoints)}
                    fill="none"
                    stroke="rgba(139, 92, 246, 0.2)"
                    strokeWidth="1"
                  />
                  <text
                    x={centerX + level * radius + 10}
                    y={centerY}
                    fill="rgba(139, 92, 246, 0.6)"
                    fontSize="12"
                    textAnchor="start"
                  >
                    {Math.round(level * 100)}%
                  </text>
                </g>
              ))}

              {/* Role labels */}
              {topRoles.map((role, index) => {
                const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2
                const labelRadius = radius + 30
                const x = centerX + labelRadius * Math.cos(angle)
                const y = centerY + labelRadius * Math.sin(angle)
                
                return (
                  <g key={role}>
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={centerX + radius * Math.cos(angle)}
                      y2={centerY + radius * Math.sin(angle)}
                      stroke="rgba(139, 92, 246, 0.3)"
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={y}
                      fill="white"
                      fontSize="10"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-medium"
                    >
                      {getEmoji(role)}
                    </text>
                    <text
                      x={x}
                      y={y + 15}
                      fill="rgba(255, 255, 255, 0.7)"
                      fontSize="8"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {role.length > 8 ? role.substring(0, 8) + '...' : role}
                    </text>
                  </g>
                )
              })}

              {/* Data polygons */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
                d={createRadarPath(data1, radius, centerX, centerY)}
                fill="rgba(236, 72, 153, 0.2)"
                stroke="rgba(236, 72, 153, 0.8)"
                strokeWidth="2"
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 1 }}
                d={createRadarPath(data2, radius, centerX, centerY)}
                fill="rgba(139, 92, 246, 0.2)"
                stroke="rgba(139, 92, 246, 0.8)"
                strokeWidth="2"
              />

              {/* Data points */}
              {data1.map((value, index) => {
                const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2
                const x = centerX + (value / 100) * radius * Math.cos(angle)
                const y = centerY + (value / 100) * radius * Math.sin(angle)
                
                return (
                  <motion.circle
                    key={`point1-${index}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5 + index * 0.1 }}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="rgba(236, 72, 153, 1)"
                    stroke="white"
                    strokeWidth="2"
                  />
                )
              })}

              {data2.map((value, index) => {
                const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2
                const x = centerX + (value / 100) * radius * Math.cos(angle)
                const y = centerY + (value / 100) * radius * Math.sin(angle)
                
                return (
                  <motion.circle
                    key={`point2-${index}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2 + index * 0.1 }}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="rgba(139, 92, 246, 1)"
                    stroke="white"
                    strokeWidth="2"
                  />
                )
              })}
            </svg>
          </div>
        </div>

        {/* Legend and Details */}
        <div className="flex-1 space-y-4">
          {/* Legend */}
          <div className="bg-white/5 rounded-lg p-4 border border-purple-400/20">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Chart Legend
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                <span className="text-white text-sm">{result1.selectedEmoji || '♞'} {result1.testName || 'Person 1'}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-white text-sm">{result2.selectedEmoji || '♞'} {result2.testName || 'Person 2'}</span>
              </div>
            </div>
          </div>

          {/* Top Roles Comparison */}
          <div className="bg-white/5 rounded-lg p-4 border border-purple-400/20">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Top Roles Comparison
            </h4>
            <div className="space-y-2">
              {topRoles.map((role, index) => {
                const value1 = getRoleData(result1, role)
                const value2 = getRoleData(result2, role)
                const diff = Math.abs(value1 - value2)
                
                return (
                  <div key={role} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getEmoji(role)}</span>
                      <span className="text-purple-200">{role}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-pink-400 font-medium">{value1}%</span>
                      <span className="text-purple-400 font-medium">{value2}%</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        diff < 10 ? 'bg-green-500/20 text-green-300' :
                        diff < 30 ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {diff}% diff
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-400/30">
            <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Chart Insights
            </h4>
            <ul className="text-purple-200 text-sm space-y-1">
              <li>• Larger areas indicate higher overall interest</li>
              <li>• Overlapping areas show shared interests</li>
              <li>• Gaps indicate potential areas for exploration</li>
              <li>• Similar shapes suggest compatible dynamics</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default RadarChart





