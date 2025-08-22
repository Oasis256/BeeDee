import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Grid, Zap, Heart, Target } from 'lucide-react'

const RoleCompatibilityMatrix = ({ results }) => {
  const [selectedRole, setSelectedRole] = useState(null)

  // Define role compatibility matrix
  const compatibilityMatrix = {
    'Submissive': {
      'Dominant': 95, 'Master/Mistress': 90, 'Daddy/Mommy': 85, 'Switch': 70, 'Sadist': 60, 'Rigger': 50, 'Brat tamer': 45, 'Owner': 40, 'Degrader': 35, 'Primal (Hunter)': 30, 'Voyeur': 25, 'Exhibitionist': 20, 'Masochist': 15, 'Rope bunny': 10, 'Pet': 5, 'Little': 0, 'Slave': 0, 'Brat': 0, 'Degradee': 0, 'Primal (Prey)': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Dominant': {
      'Submissive': 95, 'Slave': 90, 'Little': 85, 'Switch': 70, 'Rope bunny': 60, 'Pet': 55, 'Masochist': 50, 'Degradee': 45, 'Primal (Prey)': 40, 'Brat': 35, 'Voyeur': 30, 'Exhibitionist': 25, 'Sadist': 20, 'Rigger': 15, 'Brat tamer': 10, 'Degrader': 5, 'Master/Mistress': 0, 'Daddy/Mommy': 0, 'Owner': 0, 'Primal (Hunter)': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Switch': {
      'Switch': 100, 'Submissive': 70, 'Dominant': 70, 'Rope bunny': 65, 'Rigger': 65, 'Masochist': 60, 'Sadist': 60, 'Brat': 55, 'Brat tamer': 55, 'Voyeur': 50, 'Exhibitionist': 50, 'Pet': 45, 'Owner': 45, 'Little': 40, 'Daddy/Mommy': 40, 'Degrader': 35, 'Degradee': 35, 'Primal (Hunter)': 30, 'Primal (Prey)': 30, 'Master/Mistress': 25, 'Slave': 25, 'Ageplayer': 20, 'Experimentalist': 15, 'Non-monogamist': 10, 'Vanilla': 5
    },
    'Rigger': {
      'Rope bunny': 95, 'Switch': 65, 'Submissive': 50, 'Masochist': 45, 'Pet': 40, 'Degradee': 35, 'Primal (Prey)': 30, 'Brat': 25, 'Voyeur': 20, 'Exhibitionist': 15, 'Sadist': 10, 'Brat tamer': 5, 'Dominant': 0, 'Master/Mistress': 0, 'Daddy/Mommy': 0, 'Owner': 0, 'Little': 0, 'Slave': 0, 'Degrader': 0, 'Primal (Hunter)': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Rope bunny': {
      'Rigger': 95, 'Switch': 65, 'Submissive': 10, 'Masochist': 45, 'Pet': 40, 'Degradee': 35, 'Primal (Prey)': 30, 'Brat': 25, 'Voyeur': 20, 'Exhibitionist': 15, 'Sadist': 10, 'Brat tamer': 5, 'Dominant': 0, 'Master/Mistress': 0, 'Daddy/Mommy': 0, 'Owner': 0, 'Little': 0, 'Slave': 0, 'Degrader': 0, 'Primal (Hunter)': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Sadist': {
      'Masochist': 95, 'Switch': 60, 'Submissive': 60, 'Rope bunny': 10, 'Pet': 35, 'Degradee': 30, 'Primal (Prey)': 25, 'Brat': 20, 'Voyeur': 15, 'Exhibitionist': 10, 'Rigger': 0, 'Brat tamer': 0, 'Dominant': 0, 'Master/Mistress': 0, 'Daddy/Mommy': 0, 'Owner': 0, 'Little': 0, 'Slave': 0, 'Degrader': 0, 'Primal (Hunter)': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Masochist': {
      'Sadist': 95, 'Switch': 60, 'Submissive': 15, 'Rope bunny': 45, 'Pet': 35, 'Degradee': 30, 'Primal (Prey)': 25, 'Brat': 20, 'Voyeur': 15, 'Exhibitionist': 10, 'Rigger': 0, 'Brat tamer': 0, 'Dominant': 0, 'Master/Mistress': 0, 'Daddy/Mommy': 0, 'Owner': 0, 'Little': 0, 'Slave': 0, 'Degrader': 0, 'Primal (Hunter)': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Brat': {
      'Brat tamer': 95, 'Switch': 55, 'Dominant': 35, 'Master/Mistress': 30, 'Daddy/Mommy': 25, 'Owner': 20, 'Primal (Hunter)': 15, 'Degrader': 10, 'Sadist': 0, 'Submissive': 0, 'Rope bunny': 0, 'Pet': 0, 'Little': 0, 'Slave': 0, 'Masochist': 0, 'Degradee': 0, 'Primal (Prey)': 0, 'Voyeur': 0, 'Exhibitionist': 0, 'Rigger': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Brat tamer': {
      'Brat': 95, 'Switch': 55, 'Dominant': 10, 'Master/Mistress': 30, 'Daddy/Mommy': 25, 'Owner': 20, 'Primal (Hunter)': 15, 'Degrader': 10, 'Sadist': 0, 'Submissive': 0, 'Rope bunny': 0, 'Pet': 0, 'Little': 0, 'Slave': 0, 'Masochist': 0, 'Degradee': 0, 'Primal (Prey)': 0, 'Voyeur': 0, 'Exhibitionist': 0, 'Rigger': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Daddy/Mommy': {
      'Little': 95, 'Submissive': 85, 'Switch': 40, 'Brat': 25, 'Pet': 20, 'Slave': 15, 'Primal (Prey)': 10, 'Ageplayer': 5, 'Dominant': 0, 'Master/Mistress': 0, 'Owner': 0, 'Primal (Hunter)': 0, 'Brat tamer': 0, 'Degrader': 0, 'Sadist': 0, 'Rope bunny': 0, 'Masochist': 0, 'Degradee': 0, 'Voyeur': 0, 'Exhibitionist': 0, 'Rigger': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Little': {
      'Daddy/Mommy': 95, 'Dominant': 85, 'Switch': 40, 'Brat': 25, 'Pet': 20, 'Slave': 15, 'Primal (Prey)': 10, 'Ageplayer': 5, 'Submissive': 0, 'Master/Mistress': 0, 'Owner': 0, 'Primal (Hunter)': 0, 'Brat tamer': 0, 'Degrader': 0, 'Sadist': 0, 'Rope bunny': 0, 'Masochist': 0, 'Degradee': 0, 'Voyeur': 0, 'Exhibitionist': 0, 'Rigger': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Pet': {
      'Owner': 95, 'Dominant': 55, 'Switch': 45, 'Daddy/Mommy': 20, 'Master/Mistress': 15, 'Brat': 10, 'Primal (Prey)': 5, 'Submissive': 0, 'Little': 0, 'Slave': 0, 'Brat tamer': 0, 'Degrader': 0, 'Sadist': 0, 'Rope bunny': 0, 'Masochist': 0, 'Degradee': 0, 'Primal (Hunter)': 0, 'Voyeur': 0, 'Exhibitionist': 0, 'Rigger': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Owner': {
      'Pet': 95, 'Dominant': 10, 'Switch': 45, 'Daddy/Mommy': 20, 'Master/Mistress': 15, 'Brat': 10, 'Primal (Prey)': 5, 'Submissive': 0, 'Little': 0, 'Slave': 0, 'Brat tamer': 0, 'Degrader': 0, 'Sadist': 0, 'Rope bunny': 0, 'Masochist': 0, 'Degradee': 0, 'Primal (Hunter)': 0, 'Voyeur': 0, 'Exhibitionist': 0, 'Rigger': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Master/Mistress': {
      'Slave': 95, 'Submissive': 90, 'Switch': 25, 'Brat': 30, 'Pet': 15, 'Little': 0, 'Daddy/Mommy': 0, 'Owner': 0, 'Primal (Prey)': 0, 'Ageplayer': 0, 'Dominant': 0, 'Brat tamer': 0, 'Degrader': 0, 'Sadist': 0, 'Rope bunny': 0, 'Masochist': 0, 'Degradee': 0, 'Primal (Hunter)': 0, 'Voyeur': 0, 'Exhibitionist': 0, 'Rigger': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Slave': {
      'Master/Mistress': 95, 'Dominant': 90, 'Switch': 25, 'Brat': 0, 'Pet': 0, 'Little': 0, 'Daddy/Mommy': 0, 'Owner': 0, 'Primal (Prey)': 0, 'Ageplayer': 0, 'Submissive': 0, 'Brat tamer': 0, 'Degrader': 0, 'Sadist': 0, 'Rope bunny': 0, 'Masochist': 0, 'Degradee': 0, 'Primal (Hunter)': 0, 'Voyeur': 0, 'Exhibitionist': 0, 'Rigger': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Degrader': {
      'Degradee': 95, 'Switch': 35, 'Submissive': 35, 'Brat': 10, 'Dominant': 5, 'Master/Mistress': 0, 'Daddy/Mommy': 0, 'Owner': 0, 'Little': 0, 'Slave': 0, 'Brat tamer': 0, 'Sadist': 0, 'Rope bunny': 0, 'Pet': 0, 'Masochist': 0, 'Primal (Hunter)': 0, 'Primal (Prey)': 0, 'Voyeur': 0, 'Exhibitionist': 0, 'Rigger': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Degradee': {
      'Degrader': 95, 'Switch': 35, 'Submissive': 0, 'Brat': 0, 'Dominant': 0, 'Master/Mistress': 0, 'Daddy/Mommy': 0, 'Owner': 0, 'Little': 0, 'Slave': 0, 'Brat tamer': 0, 'Sadist': 0, 'Rope bunny': 0, 'Pet': 0, 'Masochist': 0, 'Primal (Hunter)': 0, 'Primal (Prey)': 0, 'Voyeur': 0, 'Exhibitionist': 0, 'Rigger': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Primal (Hunter)': {
      'Primal (Prey)': 95, 'Switch': 30, 'Dominant': 0, 'Brat': 15, 'Pet': 0, 'Little': 0, 'Daddy/Mommy': 0, 'Owner': 0, 'Master/Mistress': 0, 'Slave': 0, 'Brat tamer': 0, 'Degrader': 0, 'Sadist': 0, 'Rope bunny': 0, 'Submissive': 0, 'Masochist': 0, 'Degradee': 0, 'Voyeur': 0, 'Exhibitionist': 0, 'Rigger': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Primal (Prey)': {
      'Primal (Hunter)': 95, 'Switch': 30, 'Submissive': 0, 'Brat': 0, 'Pet': 0, 'Little': 0, 'Daddy/Mommy': 0, 'Owner': 0, 'Master/Mistress': 0, 'Slave': 0, 'Brat tamer': 0, 'Degrader': 0, 'Sadist': 0, 'Rope bunny': 0, 'Dominant': 0, 'Masochist': 0, 'Degradee': 0, 'Voyeur': 0, 'Exhibitionist': 0, 'Rigger': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Voyeur': {
      'Exhibitionist': 95, 'Switch': 50, 'Submissive': 25, 'Dominant': 30, 'Rope bunny': 20, 'Pet': 15, 'Little': 0, 'Daddy/Mommy': 0, 'Owner': 0, 'Master/Mistress': 0, 'Slave': 0, 'Brat': 0, 'Brat tamer': 0, 'Degrader': 0, 'Sadist': 0, 'Masochist': 0, 'Degradee': 0, 'Primal (Hunter)': 0, 'Primal (Prey)': 0, 'Rigger': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Exhibitionist': {
      'Voyeur': 95, 'Switch': 50, 'Submissive': 0, 'Dominant': 0, 'Rope bunny': 0, 'Pet': 0, 'Little': 0, 'Daddy/Mommy': 0, 'Owner': 0, 'Master/Mistress': 0, 'Slave': 0, 'Brat': 0, 'Brat tamer': 0, 'Degrader': 0, 'Sadist': 0, 'Masochist': 0, 'Degradee': 0, 'Primal (Hunter)': 0, 'Primal (Prey)': 0, 'Rigger': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Ageplayer': {
      'Daddy/Mommy': 95, 'Little': 90, 'Switch': 40, 'Submissive': 30, 'Dominant': 25, 'Pet': 20, 'Master/Mistress': 15, 'Owner': 10, 'Brat': 5, 'Brat tamer': 0, 'Degrader': 0, 'Sadist': 0, 'Rope bunny': 0, 'Masochist': 0, 'Degradee': 0, 'Primal (Hunter)': 0, 'Primal (Prey)': 0, 'Voyeur': 0, 'Exhibitionist': 0, 'Rigger': 0, 'Slave': 0, 'Experimentalist': 0, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Experimentalist': {
      'Switch': 85, 'Submissive': 60, 'Dominant': 55, 'Rope bunny': 50, 'Rigger': 50, 'Masochist': 45, 'Sadist': 45, 'Voyeur': 40, 'Exhibitionist': 40, 'Pet': 35, 'Owner': 35, 'Brat': 30, 'Brat tamer': 30, 'Daddy/Mommy': 25, 'Little': 25, 'Degrader': 20, 'Degradee': 20, 'Primal (Hunter)': 15, 'Primal (Prey)': 15, 'Master/Mistress': 10, 'Slave': 10, 'Ageplayer': 5, 'Non-monogamist': 0, 'Vanilla': 0
    },
    'Non-monogamist': {
      'Non-monogamist': 100, 'Switch': 70, 'Submissive': 45, 'Dominant': 40, 'Voyeur': 35, 'Exhibitionist': 35, 'Rope bunny': 30, 'Rigger': 30, 'Pet': 25, 'Owner': 25, 'Brat': 20, 'Brat tamer': 20, 'Daddy/Mommy': 15, 'Little': 15, 'Master/Mistress': 10, 'Slave': 10, 'Degrader': 5, 'Degradee': 5, 'Primal (Hunter)': 0, 'Primal (Prey)': 0, 'Sadist': 0, 'Masochist': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Vanilla': 0
    },
    'Vanilla': {
      'Vanilla': 100, 'Switch': 60, 'Submissive': 40, 'Dominant': 35, 'Voyeur': 30, 'Exhibitionist': 25, 'Rope bunny': 20, 'Rigger': 15, 'Pet': 15, 'Owner': 10, 'Brat': 10, 'Brat tamer': 5, 'Daddy/Mommy': 5, 'Little': 5, 'Master/Mistress': 0, 'Slave': 0, 'Degrader': 0, 'Degradee': 0, 'Primal (Hunter)': 0, 'Primal (Prey)': 0, 'Sadist': 0, 'Masochist': 0, 'Ageplayer': 0, 'Experimentalist': 0, 'Non-monogamist': 0
    }
  }

  const allRoles = [
    'Submissive', 'Dominant', 'Switch', 'Rigger', 'Rope bunny', 'Sadist', 'Masochist', 
    'Brat', 'Brat tamer', 'Daddy/Mommy', 'Little', 'Pet', 'Owner', 'Master/Mistress', 
    'Slave', 'Degrader', 'Degradee', 'Primal (Hunter)', 'Primal (Prey)', 'Voyeur', 
    'Exhibitionist', 'Ageplayer', 'Experimentalist', 'Non-monogamist', 'Vanilla'
  ]

  const getCompatibilityColor = (score) => {
    if (score >= 90) return 'bg-emerald-500'
    if (score >= 70) return 'bg-green-500'
    if (score >= 50) return 'bg-yellow-500'
    if (score >= 30) return 'bg-orange-500'
    if (score >= 10) return 'bg-red-500'
    return 'bg-gray-600'
  }

  const getCompatibilityText = (score) => {
    if (score >= 90) return 'Perfect'
    if (score >= 70) return 'Great'
    if (score >= 50) return 'Good'
    if (score >= 30) return 'Fair'
    if (score >= 10) return 'Poor'
    return 'None'
  }

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6 mb-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Role Compatibility Matrix</h3>
        <p className="text-purple-200">See how different roles work together</p>
      </div>

      {/* Role Selection */}
      <div className="mb-6">
        <label className="block text-white font-semibold mb-3">Select a role to see its compatibility:</label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {allRoles.map((role) => (
            <motion.button
              key={role}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedRole(selectedRole === role ? null : role)}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                selectedRole === role
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{getEmoji(role)}</span>
                <span className="truncate">{role}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Compatibility Grid */}
      {selectedRole && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="text-center">
            <h4 className="text-xl font-bold text-white mb-2">
              {getEmoji(selectedRole)} {selectedRole} Compatibility
            </h4>
            <p className="text-purple-200 text-sm">Click on any role to see detailed compatibility</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {allRoles.map((role) => {
              const compatibility = compatibilityMatrix[selectedRole]?.[role] || 0
              return (
                <motion.div
                  key={role}
                  whileHover={{ scale: 1.05 }}
                  className={`p-4 rounded-lg text-center cursor-pointer transition-all ${
                    compatibility >= 90 ? 'bg-emerald-500/20 border border-emerald-400/50' :
                    compatibility >= 70 ? 'bg-green-500/20 border border-green-400/50' :
                    compatibility >= 50 ? 'bg-yellow-500/20 border border-yellow-400/50' :
                    compatibility >= 30 ? 'bg-orange-500/20 border border-orange-400/50' :
                    compatibility >= 10 ? 'bg-red-500/20 border border-red-400/50' :
                    'bg-gray-500/20 border border-gray-400/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{getEmoji(role)}</div>
                  <div className="text-white font-semibold text-sm mb-1">{role}</div>
                  <div className={`text-xs font-bold px-2 py-1 rounded-full ${getCompatibilityColor(compatibility)}`}>
                    {compatibility}%
                  </div>
                  <div className="text-xs text-purple-200 mt-1">
                    {getCompatibilityText(compatibility)}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 rounded-lg bg-white/5 border border-purple-400/20">
            <h5 className="text-white font-semibold mb-3">Compatibility Legend:</h5>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                <span className="text-white">90-100%: Perfect</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-white">70-89%: Great</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-white">50-69%: Good</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-white">30-49%: Fair</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-white">10-29%: Poor</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      {!selectedRole && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-6 bg-white/5 rounded-lg border border-purple-400/20"
        >
          <Grid className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <h4 className="text-white font-semibold mb-2">How to use the Matrix</h4>
          <p className="text-purple-200 text-sm">
            Select any role above to see how it pairs with all other roles. 
            Perfect matches (90%+) are ideal combinations, while lower scores 
            indicate roles that may not work well together.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default RoleCompatibilityMatrix




