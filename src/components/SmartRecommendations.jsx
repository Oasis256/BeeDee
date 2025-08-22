import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, Sparkles, TrendingUp, Heart, Target, Zap, Star, ArrowRight } from 'lucide-react'

const SmartRecommendations = ({ results }) => {
  const [selectedCategory, setSelectedCategory] = useState('activities')

  if (results.length < 2) {
    return null
  }

  const [result1, result2] = results

  const generateRecommendations = () => {
    const recommendations = {
      activities: [],
      scenarios: [],
      growth: [],
      communication: []
    }

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
      'Degradee': ['Degrader'],
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

    // Generate activity recommendations
    if (sharedHighRoles.length > 0) {
      sharedHighRoles.forEach(role => {
        const activityMap = {
          'Switch': [
            'Try alternating dominant/submissive roles during the same session',
            'Create a "switch day" where you trade roles every hour',
            'Explore power exchange games with role reversal'
          ],
          'Voyeur': [
            'Set up a scenario where one watches the other perform',
            'Try video recording for private viewing later',
            'Visit a BDSM club or event to watch others'
          ],
          'Exhibitionist': [
            'Explore public play in safe, consensual environments',
            'Try remote-controlled toys in semi-public places',
            'Create a private photo/video session'
          ],
          'Rope bunny': [
            'Learn basic rope bondage techniques together',
            'Try different types of rope (cotton, jute, silk)',
            'Explore suspension play with proper safety measures'
          ],
          'Rigger': [
            'Take a rope bondage workshop together',
            'Practice different tie patterns and techniques',
            'Explore artistic rope photography'
          ],
          'Masochist': [
            'Experiment with different types of impact play',
            'Try sensation play with various implements',
            'Explore temperature play (ice, wax)'
          ],
          'Sadist': [
            'Learn safe impact play techniques',
            'Experiment with different sensations and intensities',
            'Practice aftercare and check-in protocols'
          ],
          'Brat': [
            'Create playful disobedience scenarios',
            'Set up "punishment" games with fun consequences',
            'Explore playful power dynamics'
          ],
          'Brat tamer': [
            'Develop creative "punishment" scenarios',
            'Practice firm but loving discipline',
            'Create structured brat training sessions'
          ],
          'Daddy/Mommy': [
            'Explore age play scenarios together',
            'Create nurturing and caring dynamics',
            'Practice gentle guidance and support'
          ],
          'Little': [
            'Set up age play scenes with toys and activities',
            'Create a safe space for little activities',
            'Explore regression and care dynamics'
          ],
          'Pet': [
            'Try pet play with collars and leashes',
            'Create animal role-play scenarios',
            'Explore training and reward systems'
          ],
          'Owner': [
            'Develop pet training routines',
            'Create structured pet care scenarios',
            'Practice gentle dominance and guidance'
          ]
        }
        
        if (activityMap[role.role]) {
          recommendations.activities.push(...activityMap[role.role])
        }
      })
    }

    // Generate scenario recommendations
    if (complementaryDynamics.length > 0) {
      complementaryDynamics.forEach(dynamic => {
        const scenarioMap = {
          'Submissive-Dominant': [
            'Create a "service day" where the submissive serves the dominant',
            'Set up a power exchange scene with clear protocols',
            'Try a "24-hour dynamic" with safe words and check-ins'
          ],
          'Rigger-Rope bunny': [
            'Plan a rope bondage photo session',
            'Create a "rope date night" with different ties',
            'Try a rope suspension scene with proper safety'
          ],
          'Sadist-Masochist': [
            'Design an impact play scene with multiple sensations',
            'Create a "pain tolerance" exploration session',
            'Try a "sensation buffet" with various implements'
          ],
          'Brat-Brat tamer': [
            'Set up a "brat training" scenario',
            'Create playful disobedience challenges',
            'Design a "punishment and reward" system'
          ],
          'Daddy/Mommy-Little': [
            'Plan an age play date with activities and care',
            'Create a "little space" environment',
            'Try a "caregiver" role-play scenario'
          ],
          'Pet-Owner': [
            'Design a pet training session',
            'Create an animal role-play scenario',
            'Try a "pet care" dynamic with routines'
          ],
          'Voyeur-Exhibitionist': [
            'Set up a "show and tell" scenario',
            'Create a private performance space',
            'Try remote-controlled play in semi-public'
          ]
        }
        
        const key = `${dynamic.role1}-${dynamic.role2}`
        if (scenarioMap[key]) {
          recommendations.scenarios.push(...scenarioMap[key])
        }
      })
    }

    // Generate growth recommendations
    const lowScoreRoles1 = result1.results.filter(item => item.percentage < 30)
    const lowScoreRoles2 = result2.results.filter(item => item.percentage < 30)
    
    if (lowScoreRoles1.length > 0 || lowScoreRoles2.length > 0) {
      recommendations.growth.push(
        'Consider exploring roles outside your comfort zone together',
        'Start with low-intensity versions of new activities',
        'Use this as an opportunity to learn and grow together',
        'Focus on communication and consent when trying new things'
      )
    }

    // Generate communication recommendations
    recommendations.communication.push(
      'Set up regular check-ins to discuss your dynamic',
      'Create a shared journal to track experiences and feelings',
      'Establish clear boundaries and safe words',
      'Practice active listening during aftercare',
      'Consider attending BDSM workshops or events together'
    )

    return recommendations
  }

  const recommendations = generateRecommendations()

  const categories = [
    { id: 'activities', name: 'Activities', icon: Sparkles, color: 'text-purple-400' },
    { id: 'scenarios', name: 'Scenarios', icon: Star, color: 'text-amber-400' },
    { id: 'growth', name: 'Growth', icon: TrendingUp, color: 'text-green-400' },
    { id: 'communication', name: 'Communication', icon: Heart, color: 'text-pink-400' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6 mb-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Smart Recommendations</h3>
        <p className="text-purple-200">AI-powered suggestions based on your compatibility</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              <Icon className={`w-4 h-4 ${selectedCategory === category.id ? 'text-white' : category.color}`} />
              {category.name}
            </motion.button>
          )
        })}
      </div>

      {/* Recommendations Content */}
      <motion.div
        key={selectedCategory}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        {recommendations[selectedCategory].length > 0 ? (
          recommendations[selectedCategory].map((recommendation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-purple-400/20 hover:bg-white/10 transition-all"
            >
              <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <ArrowRight className="w-3 h-3 text-white" />
              </div>
              <p className="text-purple-100 leading-relaxed">{recommendation}</p>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8 bg-white/5 rounded-lg border border-purple-400/20"
          >
            <Lightbulb className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <h4 className="text-white font-semibold mb-2">No specific recommendations</h4>
            <p className="text-purple-200 text-sm">
              Focus on open communication and exploring your shared interests together.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30"
      >
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-purple-400" />
          <h4 className="text-white font-semibold">Pro Tips</h4>
        </div>
        <ul className="text-purple-200 text-sm space-y-1">
          <li>• Always prioritize safety, consent, and communication</li>
          <li>• Start slowly and build up intensity gradually</li>
          <li>• Use safe words and check in regularly</li>
          <li>• Remember that BDSM is about mutual pleasure and growth</li>
        </ul>
      </motion.div>
    </motion.div>
  )
}

export default SmartRecommendations





