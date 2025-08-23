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
            '**Role Reversal Workshop**: Dedicate an entire weekend to exploring both sides of your dynamic. Start with a structured "switch day" where you trade roles every 2-3 hours, using a timer to signal transitions. Create detailed character profiles for each role, including specific mannerisms, speech patterns, and behavioral expectations. This helps you fully embody each role and understand your partner\'s perspective.',
            '**Progressive Power Exchange**: Design a multi-session arc where you gradually build intensity in both dominant and submissive roles. Begin with light power exchange (simple commands, basic protocols) and progressively increase complexity over several weeks. Document your experiences in a shared journal to track growth and preferences.',
            '**Switch Challenge Series**: Create a series of themed challenges that test both your dominant and submissive skills. Each challenge should last 24-48 hours and focus on specific aspects like service, discipline, creativity, or endurance. Examples include "Service Mastery Week," "Creative Dominance Challenge," or "Submissive Growth Month."'
          ],
          'Voyeur': [
            '**Staged Performance Theater**: Transform your space into a private theater where one partner performs elaborate scenes for the other. Create detailed scripts, costumes, and scenarios that cater to your voyeuristic desires. Include multiple acts with different themes, from sensual to intense, with proper lighting and atmosphere.',
            '**Documentation Project**: Invest in quality recording equipment and create a comprehensive video library of your intimate moments. Plan themed photo/video sessions with different aesthetics, scenarios, and intensity levels. This creates lasting memories and allows for private viewing and analysis of your dynamics.',
            '**Social Voyeurism Exploration**: Research and attend BDSM clubs, events, or workshops where you can safely observe others in a consensual environment. Start with educational events and gradually progress to social play spaces. Always respect boundaries and follow venue rules.'
          ],
          'Exhibitionist': [
            '**Controlled Exhibitionism**: Design scenarios where you can safely explore exhibitionist desires in controlled environments. This might include private parties with trusted friends, remote-controlled toys in semi-public places, or creating content for private sharing. Always prioritize consent and safety.',
            '**Performance Art Sessions**: Create elaborate performance pieces that combine exhibitionism with artistic expression. Plan themed performances with costumes, music, and choreography. These can be recorded for private viewing or performed for a select, consenting audience.',
            '**Public Play Integration**: Explore ways to incorporate subtle exhibitionist elements into your daily life, such as wearing revealing clothing under conservative outfits, using remote-controlled toys in public, or creating scenarios that feel public while remaining private.'
          ],
          'Rope bunny': [
            '**Comprehensive Rope Education**: Enroll in formal rope bondage workshops and safety courses. Learn about different rope types (cotton, jute, silk, hemp), their properties, and appropriate uses. Practice basic ties extensively before progressing to more complex patterns.',
            '**Sensory Rope Exploration**: Experiment with different rope materials and textures to enhance the sensory experience. Try temperature play with chilled or warmed ropes, incorporate different textures, and explore how various ties affect sensation and mobility.',
            '**Advanced Rope Techniques**: Progress to more complex ties and positions, including partial suspension, decorative ties, and functional bondage. Always prioritize safety with proper equipment, knowledge of nerve locations, and emergency release procedures.'
          ],
          'Rigger': [
            '**Professional Skill Development**: Attend advanced rope bondage workshops and certification courses. Learn from experienced riggers about safety protocols, nerve anatomy, and advanced techniques. Practice extensively on mannequins or willing partners before attempting complex ties.',
            '**Artistic Rope Photography**: Combine your rope skills with photography to create beautiful, artistic images. Learn about lighting, composition, and posing to showcase your rope work. This can be a creative outlet and a way to document your progress.',
            '**Community Teaching**: Share your knowledge by teaching basic rope safety and techniques to others in your community. This reinforces your own learning and helps build a safer, more educated BDSM community.'
          ],
          'Masochist': [
            '**Sensation Mapping Project**: Create a comprehensive map of your body\'s response to different types of stimulation. Test various implements, intensities, and techniques to understand your pain tolerance and preferences. Document your findings for future reference.',
            '**Multi-Sensory Impact Play**: Design scenes that combine different types of impact play with other sensations. Incorporate temperature play (ice, wax, hot oil), texture play (different materials and surfaces), and psychological elements for a complete experience.',
            '**Progressive Pain Training**: Develop a structured program to gradually increase your pain tolerance and endurance. Start with light sensations and progressively build intensity over multiple sessions. Always include proper aftercare and recovery time.'
          ],
          'Sadist': [
            '**Safe Impact Play Mastery**: Invest in proper training for safe impact play techniques. Learn about different implements, their effects, and appropriate use. Understand anatomy to avoid dangerous areas and practice on safe targets before using on a partner.',
            '**Sensation Variety Exploration**: Experiment with different types of sensations beyond impact, including temperature play, pressure points, and psychological elements. Learn to read your partner\'s responses and adjust intensity accordingly.',
            '**Aftercare Protocol Development**: Create comprehensive aftercare routines that address physical, emotional, and psychological needs. Learn about drop prevention, recovery techniques, and long-term care for your partner\'s well-being.'
          ],
          'Brat': [
            '**Creative Disobedience Workshop**: Develop a repertoire of playful disobedience techniques that challenge your partner without crossing serious boundaries. Create scenarios that allow for safe, consensual bratting with clear consequences and rewards.',
            '**Structured Brat Training**: Design a training program that channels your bratty energy into productive activities. This might include learning new skills, completing challenges, or developing creative projects that benefit your relationship.',
            '**Playful Power Dynamics**: Explore ways to express your bratty nature through games, challenges, and creative scenarios. Focus on maintaining the playful, consensual nature of bratting while respecting your partner\'s boundaries.'
          ],
          'Brat tamer': [
            '**Discipline Strategy Development**: Create a comprehensive system for handling bratty behavior that includes clear consequences, rewards, and training protocols. Develop multiple approaches for different types of bratting and situations.',
            '**Creative Punishment Design**: Design punishments that are effective, safe, and appropriate for your partner\'s limits and preferences. Focus on creative, consensual consequences that address the behavior without causing harm.',
            '**Structured Training Programs**: Develop formal training programs that help your brat channel their energy productively. Create challenges, goals, and reward systems that encourage positive behavior and personal growth.'
          ],
          'Daddy/Mommy': [
            '**Comprehensive Caregiving System**: Develop a complete caregiving dynamic that addresses physical, emotional, and psychological needs. Create routines, protocols, and rituals that provide structure and support for your little.',
            '**Age Play Scenario Development**: Design detailed age play scenarios that are appropriate, safe, and fulfilling for both partners. Create environments, activities, and dynamics that support the age play dynamic.',
            '**Nurturing Relationship Building**: Focus on building a strong, nurturing relationship that provides guidance, support, and care. Develop communication techniques and relationship skills that enhance the caregiver dynamic.'
          ],
          'Little': [
            '**Little Space Environment Creation**: Design a dedicated space and environment that supports your little headspace. Include toys, activities, and comforts that help you access and maintain your little state safely.',
            '**Age-Appropriate Activity Planning**: Develop a variety of age-appropriate activities and scenarios that support your little dynamic. Create play sessions, learning activities, and care routines that enhance your experience.',
            '**Regression and Care Integration**: Work with your caregiver to develop safe, consensual regression techniques and care protocols. Focus on creating a supportive environment for exploring your little side.'
          ],
          'Pet': [
            '**Comprehensive Pet Training Program**: Develop a complete training program that addresses obedience, behavior, and skill development. Create structured training sessions with clear goals, rewards, and progression.',
            '**Animal Role-Play Enhancement**: Design detailed animal role-play scenarios with appropriate gear, behaviors, and dynamics. Create environments and activities that support the pet play dynamic.',
            '**Pet Care and Maintenance**: Develop routines for pet care, grooming, exercise, and health maintenance. Create a structured environment that supports your pet role and relationship with your owner.'
          ],
          'Owner': [
            '**Professional Pet Training**: Develop comprehensive training programs that address obedience, behavior modification, and skill development. Create structured training sessions with clear protocols and progression.',
            '**Pet Care System Development**: Design complete care systems that address your pet\'s physical, emotional, and psychological needs. Create routines, protocols, and environments that support the pet-owner dynamic.',
            '**Relationship Enhancement**: Focus on building a strong, loving relationship with your pet that provides guidance, care, and support. Develop communication techniques and relationship skills that enhance the owner-pet dynamic.'
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
            '**Comprehensive Service Protocol**: Design a complete service day with detailed protocols, schedules, and expectations. Include multiple service activities such as domestic service, personal care, and intimate service. Create a structured environment with clear rules, rewards, and consequences that enhance the power dynamic.',
            '**Extended Power Exchange Dynamic**: Develop a 24-48 hour power exchange scenario with comprehensive protocols, check-in schedules, and safety measures. Include both structured activities and free-form interaction, with clear boundaries and emergency procedures. Document the experience for future reference and improvement.',
            '**Progressive Training Program**: Create a multi-week training program that gradually builds the submissive\'s skills and the dominant\'s leadership abilities. Include specific goals, milestones, and evaluation criteria. Focus on personal growth, relationship development, and skill acquisition.'
          ],
          'Rigger-Rope bunny': [
            '**Advanced Rope Photography Project**: Plan a comprehensive rope photography session with professional equipment, multiple locations, and various tie patterns. Create a detailed shot list, lighting setup, and post-processing workflow. This can be a creative project and a way to document your rope journey.',
            '**Multi-Session Rope Adventure**: Design a series of connected rope sessions that tell a story or explore a theme. Each session should build on the previous one, with increasing complexity and intensity. Include proper warm-up, progression, and cool-down periods.',
            '**Suspension Safety Workshop**: Plan a dedicated session focused on suspension safety and technique. Work with experienced riggers, use proper equipment, and practice emergency procedures. Start with partial suspension and gradually progress to full suspension.'
          ],
          'Sadist-Masochist': [
            '**Comprehensive Sensation Mapping**: Design a detailed session to map your partner\'s response to different types of stimulation. Test various implements, intensities, and techniques systematically. Document responses, preferences, and limits for future reference.',
            '**Multi-Sensory Impact Scene**: Create a complex scene that combines different types of impact play with other sensations. Include temperature play, pressure points, psychological elements, and various implements. Design the scene to build intensity gradually and include proper aftercare.',
            '**Endurance and Training Program**: Develop a structured program to build your partner\'s pain tolerance and endurance. Include progressive training sessions, recovery periods, and evaluation criteria. Focus on safe, consensual progression and personal growth.'
          ],
          'Brat-Brat tamer': [
            '**Comprehensive Brat Training Academy**: Design a complete training program that addresses different types of bratty behavior and appropriate responses. Include structured lessons, practical exercises, and evaluation criteria. Create a supportive environment for learning and growth.',
            '**Creative Challenge Series**: Develop a series of creative challenges that test both the brat\'s creativity and the tamer\'s discipline skills. Each challenge should have clear objectives, rules, and consequences. Focus on maintaining the playful, consensual nature of the dynamic.',
            '**Discipline and Reward System**: Create a comprehensive system for handling bratty behavior that includes clear consequences, rewards, and training protocols. Develop multiple approaches for different situations and maintain consistency in application.'
          ],
          'Daddy/Mommy-Little': [
            '**Complete Little Space Environment**: Design a comprehensive little space that supports all aspects of the age play dynamic. Include appropriate toys, activities, furniture, and decorations. Create routines and protocols that enhance the caregiver-little relationship.',
            '**Age-Appropriate Activity Program**: Develop a complete program of age-appropriate activities that support the little dynamic. Include educational activities, creative projects, play sessions, and care routines. Focus on creating a supportive, nurturing environment.',
            '**Caregiver Training and Development**: Create a comprehensive training program for the caregiver role that includes communication skills, discipline techniques, and care protocols. Focus on building a strong, loving relationship that provides guidance and support.'
          ],
          'Pet-Owner': [
            '**Professional Pet Training Academy**: Design a comprehensive training program that addresses obedience, behavior modification, and skill development. Include structured training sessions, evaluation criteria, and progression milestones. Create a supportive environment for learning and growth.',
            '**Complete Pet Care System**: Develop a complete care system that addresses all aspects of pet care, including grooming, exercise, health maintenance, and emotional support. Create routines and protocols that enhance the pet-owner relationship.',
            '**Animal Role-Play Enhancement**: Design detailed animal role-play scenarios with appropriate gear, behaviors, and dynamics. Create environments and activities that support the pet play dynamic and enhance the relationship.'
          ],
          'Voyeur-Exhibitionist': [
            '**Private Performance Theater**: Create a dedicated performance space with proper lighting, sound, and atmosphere. Design elaborate performance pieces with costumes, choreography, and multiple acts. Include both private performances and recorded content for later viewing.',
            '**Controlled Exhibitionism Program**: Develop a structured program for exploring exhibitionist desires in safe, controlled environments. Include private parties, remote-controlled play, and content creation. Always prioritize consent, safety, and legal compliance.',
            '**Social Integration Project**: Explore ways to incorporate voyeuristic and exhibitionist elements into your social life in appropriate, consensual ways. This might include attending events, joining communities, or creating private social spaces.'
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
        '**Comprehensive Exploration Program**: Design a structured program to explore roles and activities outside your comfort zones. Start with low-intensity versions and gradually increase complexity. Include regular check-ins, documentation, and evaluation to track progress and preferences.',
        '**Skill Development Workshop**: Create a series of workshops focused on developing new skills and techniques. Include both individual practice and partner exercises. Focus on building confidence, competence, and comfort with new activities.',
        '**Progressive Challenge System**: Develop a system of progressive challenges that encourage growth and exploration. Each challenge should be achievable but slightly outside your comfort zone. Include support, guidance, and celebration of achievements.',
        '**Educational Resource Development**: Build a comprehensive library of educational resources, including books, videos, workshops, and community connections. Focus on continuous learning and skill development in areas of interest.',
        '**Personal Growth Integration**: Integrate BDSM exploration with personal growth and development goals. Use the dynamic as a tool for self-improvement, relationship enhancement, and skill development. Focus on holistic growth and well-being.'
      )
    }

    // Generate communication recommendations
    recommendations.communication.push(
      '**Comprehensive Communication Protocol**: Develop a complete communication system that includes regular check-ins, emergency procedures, and ongoing dialogue. Create structured formats for discussing experiences, feelings, and needs. Include both verbal and non-verbal communication techniques.',
      '**Relationship Documentation System**: Create a comprehensive system for documenting your relationship, including shared journals, experience logs, and progress tracking. Use this documentation to track growth, identify patterns, and plan future activities.',
      '**Boundary and Consent Framework**: Establish a detailed framework for discussing and maintaining boundaries, consent, and safety. Include regular boundary reviews, consent check-ins, and safety protocol updates. Focus on creating a safe, consensual environment.',
      '**Aftercare and Recovery Protocol**: Develop comprehensive aftercare protocols that address physical, emotional, and psychological needs. Include immediate aftercare, extended recovery support, and long-term relationship maintenance. Focus on supporting each other\'s well-being.',
      '**Community Integration and Support**: Build connections with the BDSM community for support, education, and social interaction. Attend workshops, events, and social gatherings. Use community resources to enhance your relationship and personal growth.',
      '**Conflict Resolution and Problem-Solving**: Develop effective strategies for resolving conflicts and addressing challenges in your dynamic. Include communication techniques, problem-solving methods, and relationship maintenance strategies. Focus on building a strong, resilient relationship.',
      '**Personal Development and Growth**: Use your BDSM dynamic as a tool for personal development and growth. Focus on building self-awareness, emotional intelligence, and relationship skills. Use the dynamic to enhance your overall well-being and life satisfaction.'
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
        <p className="text-purple-200">Smart suggestions based on your compatibility</p>
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
              className="p-6 rounded-lg bg-white/5 border border-purple-400/20 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-purple-100 leading-relaxed text-sm whitespace-pre-line">
                      {recommendation.split('**').map((part, i) => {
                        if (i % 2 === 1) {
                          return <strong key={i} className="text-white font-semibold">{part}</strong>
                        }
                        return part
                      })}
                    </p>
                  </div>
                </div>
              </div>
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





