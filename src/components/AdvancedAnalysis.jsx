import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, TrendingUp, BarChart3, PieChart, Target, Zap, Lightbulb, Activity, Users, MessageCircle, Clock, Heart } from 'lucide-react'
import apiService from '../utils/api'

const AdvancedAnalysis = ({ results }) => {
  const [analysisData, setAnalysisData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useState('compatibility')

  useEffect(() => {
    if (results.length > 0) {
      performAdvancedAnalysis()
    }
  }, [results])

  const performAdvancedAnalysis = async () => {
    setLoading(true)
    try {
      // Perform various analyses
      const analyses = {
        compatibility: analyzeCompatibility(),
        roleDynamics: analyzeRoleDynamics(),
        kinkAlignment: analyzeKinkAlignment(),
        powerDynamics: analyzePowerDynamics(),
        communication: analyzeCommunication(),
        growthPotential: analyzeGrowthPotential()
      }

      setAnalysisData(analyses)

      // Save analysis to database
      const testIds = results.map(r => r.id)
      await apiService.saveAnalysis(testIds, 'advanced_analysis', analyses)
    } catch (error) {
      console.error('Error performing advanced analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeCompatibility = () => {
    if (results.length < 2) return null

    const compatibilityScores = {}
    const roles = ['Submissive', 'Dominant', 'Switch', 'Voyeur', 'Exhibitionist', 'Masochist', 'Sadist']

    roles.forEach(role => {
      const scores = results.map(result => {
        const roleResult = result.results.find(r => r.role === role)
        return roleResult ? roleResult.percentage : 0
      })

      // Calculate compatibility based on complementary scores
      if (scores.length === 2) {
        const [score1, score2] = scores
        let compatibility = 0

        // Complementary roles (e.g., Submissive + Dominant)
        if ((role === 'Submissive' && score2 > 70) || (role === 'Dominant' && score1 > 70)) {
          compatibility = Math.min(score1, score2) * 0.8
        }
        // Similar roles (e.g., both Switch)
        else if (Math.abs(score1 - score2) < 20) {
          compatibility = (score1 + score2) / 2
        }
        // Neutral compatibility
        else {
          compatibility = (score1 + score2) / 2 * 0.6
        }

        compatibilityScores[role] = Math.round(compatibility)
      }
    })

    return compatibilityScores
  }

  const analyzeRoleDynamics = () => {
    const dynamics = {
      primaryRoles: [],
      secondaryRoles: [],
      potentialConflicts: [],
      synergies: []
    }

    results.forEach(result => {
      const topRoles = result.results.slice(0, 3)
      const highRoles = result.results.filter(r => r.percentage >= 70)
      const lowRoles = result.results.filter(r => r.percentage <= 30)

      dynamics.primaryRoles.push({
        testId: result.id,
        name: result.testName || result.id,
        roles: topRoles
      })

      if (highRoles.length > 0) {
        dynamics.secondaryRoles.push({
          testId: result.id,
          name: result.testName || result.id,
          roles: highRoles
        })
      }
    })

    return dynamics
  }

  const analyzeKinkAlignment = () => {
    const alignment = {
      sharedKinks: [],
      complementaryKinks: [],
      potentialExplorations: []
    }

    if (results.length >= 2) {
      const allRoles = new Set()
      results.forEach(result => {
        result.results.forEach(r => allRoles.add(r.role))
      })

      allRoles.forEach(role => {
        const roleScores = results.map(result => {
          const roleResult = result.results.find(r => r.role === role)
          return roleResult ? roleResult.percentage : 0
        })

        const avgScore = roleScores.reduce((a, b) => a + b, 0) / roleScores.length
        const maxScore = Math.max(...roleScores)
        const minScore = Math.min(...roleScores)

        if (avgScore >= 60) {
          alignment.sharedKinks.push({
            role,
            averageScore: Math.round(avgScore),
            scores: roleScores
          })
        } else if (maxScore >= 50 && minScore >= 15) {
          alignment.complementaryKinks.push({
            role,
            maxScore: Math.round(maxScore),
            minScore: Math.round(minScore),
            potential: Math.round((maxScore + minScore) / 2)
          })
        }
        
        // Also check for complementary role pairs
        const complementaryPairs = {
          'Submissive': ['Dominant', 'Master/Mistress', 'Daddy/Mommy'],
          'Dominant': ['Submissive', 'Slave', 'Little'],
          'Rigger': ['Rope bunny'],
          'Rope bunny': ['Rigger'],
          'Sadist': ['Masochist'],
          'Masochist': ['Sadist'],
          'Brat': ['Brat tamer'],
          'Brat tamer': ['Brat'],
          'Voyeur': ['Exhibitionist'],
          'Exhibitionist': ['Voyeur'],
          'Pet': ['Owner'],
          'Owner': ['Pet'],
          'Primal (Hunter)': ['Primal (Prey)'],
          'Primal (Prey)': ['Primal (Hunter)']
        }
        
        if (complementaryPairs[role]) {
          const complementaryRoles = complementaryPairs[role]
          complementaryRoles.forEach(compRole => {
            const compScores = results.map(result => {
              const compRoleResult = result.results.find(r => r.role === compRole)
              return compRoleResult ? compRoleResult.percentage : 0
            })
            
            const compMaxScore = Math.max(...compScores)
            const compMinScore = Math.min(...compScores)
            
            // If one person has the original role and another has the complementary role
            if (maxScore >= 40 && compMaxScore >= 40) {
              const existingComp = alignment.complementaryKinks.find(c => c.role === `${role} ↔ ${compRole}`)
              if (!existingComp) {
                alignment.complementaryKinks.push({
                  role: `${role} ↔ ${compRole}`,
                  maxScore: Math.round(Math.max(maxScore, compMaxScore)),
                  minScore: Math.round(Math.min(minScore, compMinScore)),
                  potential: Math.round((Math.max(maxScore, compMaxScore) + Math.min(minScore, compMinScore)) / 2)
                })
              }
            }
          })
        } else if (maxScore >= 50) {
          alignment.potentialExplorations.push({
            role,
            maxScore: Math.round(maxScore),
            interest: maxScore >= 60 ? 'High' : 'Moderate'
          })
        }
      })
    }

    return alignment
  }

  const analyzePowerDynamics = () => {
    const dynamics = {
      dominantTendencies: [],
      submissiveTendencies: [],
      switchPotential: [],
      powerBalance: 'Balanced'
    }

    results.forEach(result => {
      const dominant = result.results.find(r => r.role === 'Dominant')
      const submissive = result.results.find(r => r.role === 'Submissive')
      const switchRole = result.results.find(r => r.role === 'Switch')

      if (dominant && dominant.percentage >= 60) {
        dynamics.dominantTendencies.push({
          testId: result.id,
          name: result.testName || result.id,
          score: dominant.percentage
        })
      }

      if (submissive && submissive.percentage >= 60) {
        dynamics.submissiveTendencies.push({
          testId: result.id,
          name: result.testName || result.id,
          score: submissive.percentage
        })
      }

      if (switchRole && switchRole.percentage >= 50) {
        dynamics.switchPotential.push({
          testId: result.id,
          name: result.testName || result.id,
          score: switchRole.percentage
        })
      }
    })

    // Determine power balance
    if (dynamics.dominantTendencies.length > dynamics.submissiveTendencies.length) {
      dynamics.powerBalance = 'Dominant-leaning'
    } else if (dynamics.submissiveTendencies.length > dynamics.dominantTendencies.length) {
      dynamics.powerBalance = 'Submissive-leaning'
    } else if (dynamics.switchPotential.length > 0) {
      dynamics.powerBalance = 'Switch-friendly'
    }

    return dynamics
  }

  const analyzeCommunication = () => {
    const communication = {
      openness: [],
      exploration: [],
      boundaries: [],
      recommendations: []
    }

    results.forEach(result => {
      const experimentalist = result.results.find(r => r.role === 'Experimentalist')
      const vanilla = result.results.find(r => r.role === 'Vanilla')
      const voyeur = result.results.find(r => r.role === 'Voyeur')
      const exhibitionist = result.results.find(r => r.role === 'Exhibitionist')
      const switchRole = result.results.find(r => r.role === 'Switch')
      const dominant = result.results.find(r => r.role === 'Dominant')
      const submissive = result.results.find(r => r.role === 'Submissive')

      if (experimentalist && experimentalist.percentage >= 60) {
        communication.openness.push({
          testId: result.id,
          name: result.testName || result.id,
          score: experimentalist.percentage,
          trait: 'High openness to new experiences'
        })
      }

      if (voyeur && voyeur.percentage >= 50 || exhibitionist && exhibitionist.percentage >= 50) {
        communication.exploration.push({
          testId: result.id,
          name: result.testName || result.id,
          voyeurScore: voyeur ? voyeur.percentage : 0,
          exhibitionistScore: exhibitionist ? exhibitionist.percentage : 0
        })
      }

      if (vanilla && vanilla.percentage >= 40) {
        communication.boundaries.push({
          testId: result.id,
          name: result.testName || result.id,
          score: vanilla.percentage,
          note: 'May prefer traditional approaches'
        })
      }
    })

    // Generate comprehensive AI recommendations
    const totalParticipants = results.length
    const hasHighOpenness = communication.openness.length > 0
    const hasExploration = communication.exploration.length > 0
    const hasBoundaries = communication.boundaries.length > 0
    const hasSwitch = results.some(r => r.results.find(role => role.role === 'Switch' && role.percentage >= 50))
    const hasDominant = results.some(r => r.results.find(role => role.role === 'Dominant' && role.percentage >= 60))
    const hasSubmissive = results.some(r => r.results.find(role => role.role === 'Submissive' && role.percentage >= 60))

    // Core Communication Strategy
    communication.recommendations.push(
      `Establish a comprehensive communication framework that includes regular check-ins, safe words, and ongoing consent discussions. Given ${totalParticipants} participant${totalParticipants > 1 ? 's' : ''}, create a shared vocabulary for discussing desires, boundaries, and experiences.`
    )

    // Openness and Exploration
    if (hasHighOpenness) {
      communication.recommendations.push(
        `Leverage the high experimentalist tendencies (${communication.openness.map(p => `${p.name}: ${p.score}%`).join(', ')}) to create an environment where new ideas and experiences can be openly discussed. Consider implementing a "curiosity journal" where participants can note interests they'd like to explore together.`
      )
    }

    if (hasExploration) {
      const voyeurExhibitionist = communication.exploration.map(p => 
        `${p.name} (Voyeur: ${p.voyeurScore}%, Exhibitionist: ${p.exhibitionistScore}%)`
      ).join(', ')
      communication.recommendations.push(
        `The voyeur/exhibitionist dynamic (${voyeurExhibitionist}) suggests a natural complementary relationship. Consider how these tendencies can be integrated into shared experiences, such as role-playing scenarios or gradual exposure to new activities.`
      )
    }

    // Power Dynamics Communication
    if (hasSwitch) {
      communication.recommendations.push(
        `With switch tendencies present, establish clear protocols for role negotiation and transition. Consider implementing a "switch check-in" system where participants can discuss their current headspace and desired role dynamics before scenes.`
      )
    }

    if (hasDominant && hasSubmissive) {
      communication.recommendations.push(
        `The presence of both dominant and submissive tendencies creates an opportunity for structured power exchange. Develop clear protocols for scene negotiation, including limits, desires, and aftercare needs. Consider creating a "power dynamic agreement" that can be revisited regularly.`
      )
    }

    // Boundary Management
    if (hasBoundaries) {
      const boundaryPeople = communication.boundaries.map(p => `${p.name} (${p.score}%)`).join(', ')
      communication.recommendations.push(
        `Respect the traditional preferences of ${boundaryPeople}. These participants may prefer established protocols and gradual progression. Consider implementing a "comfort zone expansion" approach that respects their boundaries while gently encouraging exploration.`
      )
    }

    // Advanced Communication Techniques
    communication.recommendations.push(
      `Implement a "traffic light" communication system (Green: continue, Yellow: slow down/check in, Red: stop immediately) and consider using a "desire/limit/fantasy" framework for deeper discussions about wants and boundaries.`
    )

    // Relationship Building
    communication.recommendations.push(
      `Focus on building trust through consistent communication patterns. Regular debriefing sessions after experiences can help participants process emotions, discuss what worked well, and identify areas for future exploration or adjustment.`
    )

    // Safety and Consent
    communication.recommendations.push(
      `Establish clear consent protocols that go beyond simple "yes/no" responses. Consider implementing ongoing consent check-ins and create a safe space for participants to express concerns or withdraw consent at any time without judgment.`
    )

    // Personal Growth
    communication.recommendations.push(
      `Use this compatibility analysis as a starting point for personal and relationship growth. Regular revisiting of these insights can help track how communication patterns evolve and identify new areas for exploration as comfort levels increase.`
    )

    return communication
  }

  const analyzeGrowthPotential = () => {
    const growth = {
      learningAreas: [],
      developmentOpportunities: [],
      compatibilityGrowth: [],
      timeline: '6-12 months'
    }

    if (results.length >= 2) {
      const roleScores = {}
      
      // Collect all role scores
      results.forEach(result => {
        result.results.forEach(r => {
          if (!roleScores[r.role]) {
            roleScores[r.role] = []
          }
          roleScores[r.role].push(r.percentage)
        })
      })

      // Find areas for growth
      Object.entries(roleScores).forEach(([role, scores]) => {
        const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
        const maxScore = Math.max(...scores)
        const minScore = Math.min(...scores)

        if (avgScore >= 30 && avgScore <= 60) {
          growth.learningAreas.push({
            role,
            averageScore: Math.round(avgScore),
            potential: Math.round((100 - avgScore) * 0.8)
          })
        }

        if (maxScore >= 70 && minScore <= 40) {
          growth.developmentOpportunities.push({
            role,
            maxScore: Math.round(maxScore),
            minScore: Math.round(minScore),
            teachingPotential: Math.round(maxScore * 0.7)
          })
        }
      })

      // Calculate compatibility growth potential
      const totalGrowthPotential = growth.learningAreas.length + growth.developmentOpportunities.length
      if (totalGrowthPotential >= 5) {
        growth.timeline = '3-6 months'
      } else if (totalGrowthPotential >= 3) {
        growth.timeline = '6-12 months'
      } else {
        growth.timeline = '12+ months'
      }
    }

    return growth
  }

  const getAnalysisIcon = (type) => {
    switch (type) {
      case 'compatibility': return <Heart className="w-5 h-5" />
      case 'roleDynamics': return <Users className="w-5 h-5" />
      case 'kinkAlignment': return <Target className="w-5 h-5" />
      case 'powerDynamics': return <Zap className="w-5 h-5" />
      case 'communication': return <MessageCircle className="w-5 h-5" />
      case 'growthPotential': return <TrendingUp className="w-5 h-5" />
      default: return <Brain className="w-5 h-5" />
    }
  }

  const getTabInsights = () => {
    if (!analysisData) return []

    switch (selectedAnalysis) {
      case 'compatibility':
        return [
          `**Compatibility Foundation**: Your compatibility scores indicate a strong foundation for building a meaningful relationship. The balanced scores across different roles suggest you have complementary strengths that can support each other's growth and development. Focus on leveraging these natural alignments to create a supportive and nurturing dynamic.`,
          `**Relationship Potential**: The compatibility analysis reveals both areas of natural harmony and opportunities for growth. Use this data to identify your relationship's strengths and areas that may benefit from additional communication, compromise, or exploration. This balanced approach can lead to a more resilient and fulfilling partnership.`,
          `**Strategic Planning**: Use your compatibility data as a strategic foundation for relationship planning. Consider how your aligned interests can form the core of your shared activities, while your differences can become opportunities for learning and personal growth. This approach can help you build a relationship that supports both individual and collective development.`,
          `**Trust Building**: Your compatibility scores suggest a natural trust potential. Focus on building this trust through consistent communication, shared experiences, and mutual respect for each other's boundaries and preferences. This foundation of trust will support deeper exploration and more meaningful connections.`
        ]
      
      case 'roleDynamics':
        return [
          `**Dynamic Flexibility**: Your role dynamics analysis reveals a natural flexibility that allows for fluid transitions between different power structures. This adaptability is a significant strength that can support various relationship phases and different types of interactions. Embrace this flexibility as it provides opportunities for rich, multifaceted dynamics.`,
          `**Complementary Strengths**: The role analysis shows how each person's natural tendencies can complement and enhance the other's experiences. This complementary relationship creates opportunities for mutual growth, learning, and satisfaction. Consider how you can leverage these complementary strengths in both intimate and everyday relationship contexts.`,
          `**Evolutionary Potential**: Your role dynamics have significant potential for evolution and growth over time. As your relationship develops and comfort levels increase, these dynamics can become more sophisticated and nuanced. Plan for this evolution by creating structures that support ongoing communication and adaptation.`,
          `**Balanced Power Exchange**: The role dynamics suggest a natural balance that can support healthy power exchange. This balance provides a stable foundation for exploring various power structures while maintaining mutual respect and consent. Use this foundation to build more complex and satisfying dynamics.`
        ]
      
      case 'kinkAlignment':
        return [
          `**Shared Foundation**: Your kink alignment reveals a strong foundation of shared interests that can form the core of your dynamic. These shared interests provide a solid base for building trust, intimacy, and mutual satisfaction. Focus on developing these shared areas as they represent your strongest connection points.`,
          `**Teaching and Learning**: The complementary kinks identified in your analysis create excellent opportunities for mutual teaching and learning. These complementary interests can become the basis for educational experiences, skill development, and shared growth. Consider how you can structure learning experiences that benefit both partners.`,
          `**Exploration Strategy**: Use your kink alignment to develop a strategic approach to exploration. The shared interests can serve as comfortable starting points, while the complementary interests can become areas for guided exploration. This approach can help you expand your comfort zones while maintaining safety and consent.`,
          `**Activity Planning**: Your kink alignment provides a roadmap for planning activities and scenarios that cater to both partners' interests and comfort levels. Use this alignment to create experiences that are satisfying for both participants while respecting individual boundaries and preferences.`
        ]
      
      case 'powerDynamics':
        return [
          `**Natural Balance**: Your power dynamics analysis reveals a natural balance that can support healthy and sustainable power exchange. This balance provides a stable foundation for exploring various power structures while maintaining mutual respect and safety. Use this foundation to build more complex and satisfying dynamics.`,
          `**Structured Opportunities**: The power balance suggests numerous opportunities for implementing structured scenes and protocols that respect both partners' needs and preferences. These structures can provide clarity, safety, and enhanced satisfaction for both participants. Consider developing protocols that reflect your natural power balance.`,
          `**Everyday Integration**: Your power dynamics can be expressed not just in intimate contexts, but also in everyday relationship interactions. Consider how these dynamics can enhance communication, decision-making, and daily life while maintaining consent and mutual satisfaction.`,
          `**Growth and Evolution**: The power dynamics analysis suggests potential for growth and evolution in your power exchange. As your relationship develops, these dynamics can become more sophisticated and nuanced. Plan for this evolution by creating flexible structures that can adapt to changing needs and preferences.`
        ]
      
      case 'communication':
        return [
          `**Communication Foundation**: Your communication analysis reveals specific patterns and preferences that can inform how you structure your communication protocols. Understanding these patterns can help you create more effective and satisfying communication systems that work for both partners.`,
          `**Boundary Management**: The analysis shows how to approach boundary discussions and consent in ways that respect both partners' comfort levels and communication styles. Use this understanding to develop boundary management systems that feel natural and supportive.`,
          `**Conflict Resolution**: Your communication patterns suggest specific approaches to conflict resolution and problem-solving that can work well for your dynamic. Consider how these patterns can be leveraged to address challenges and maintain relationship harmony.`,
          `**Growth Communication**: The communication analysis provides insights into how to discuss growth, change, and evolution in your relationship. Use these insights to create communication structures that support ongoing development and adaptation.`
        ]
      
      case 'growthPotential':
        return [
          `**Development Roadmap**: Your growth potential analysis provides a comprehensive roadmap for personal and relationship development. The identified learning areas and opportunities can become structured goals for exploration and skill development. Use this roadmap to create a development plan that supports both individual and collective growth.`,
          `**Timeline Strategy**: The development timeline provides a realistic framework for setting expectations and celebrating progress. Use this timeline to create milestones and checkpoints that help you track your development and maintain motivation. This structured approach can enhance your learning experience.`,
          `**Skill Development**: The analysis reveals specific skills and areas that can be developed through mutual exploration and learning. Consider how you can structure learning experiences that benefit both partners while respecting individual comfort levels and preferences.`,
          `**Progress Tracking**: Use the growth potential analysis to create systems for tracking progress and celebrating achievements. Regular review of your development can help maintain motivation and identify new opportunities for growth and exploration.`
        ]
      
      default:
        return []
    }
  }

  const renderAnalysisContent = () => {
    if (!analysisData) return null

    switch (selectedAnalysis) {
      case 'compatibility':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Compatibility Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(analysisData.compatibility || {}).map(([role, score]) => (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-effect rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-200 font-medium">{role}</span>
                    <span className={`text-lg font-bold ${
                      score >= 80 ? 'text-green-400' : 
                      score >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {score}%
                    </span>
                  </div>
                  <div className="w-full bg-purple-800/30 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        score >= 80 ? 'bg-green-500' : 
                        score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )

      case 'roleDynamics':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Role Dynamics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-effect rounded-lg p-4">
                <h4 className="text-lg font-semibold text-purple-200 mb-3">Primary Roles</h4>
                {analysisData.roleDynamics?.primaryRoles?.map((person, index) => (
                  <div key={index} className="mb-3">
                    <div className="text-white font-medium mb-1">{person.name}</div>
                    <div className="flex flex-wrap gap-1">
                      {person.roles.map((role, roleIndex) => (
                        <span key={roleIndex} className="px-2 py-1 bg-purple-500/30 rounded text-xs text-purple-200">
                          {role.role} ({role.percentage}%)
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="glass-effect rounded-lg p-4">
                <h4 className="text-lg font-semibold text-purple-200 mb-3">Power Balance</h4>
                <div className="text-2xl font-bold text-white mb-2">
                  {analysisData.powerDynamics?.powerBalance}
                </div>
                <p className="text-purple-200 text-sm">
                  Based on dominant and submissive tendencies across all participants
                </p>
              </div>
            </div>
          </div>
        )

      case 'kinkAlignment':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Kink Alignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-effect rounded-lg p-4">
                <h4 className="text-lg font-semibold text-green-400 mb-3">Shared Kinks</h4>
                {analysisData.kinkAlignment?.sharedKinks?.map((kink, index) => (
                  <div key={index} className="mb-2 p-2 bg-green-500/20 rounded">
                    <div className="text-white font-medium">{kink.role}</div>
                    <div className="text-green-300 text-sm">Avg: {kink.averageScore}%</div>
                  </div>
                ))}
              </div>
              <div className="glass-effect rounded-lg p-4">
                <h4 className="text-lg font-semibold text-yellow-400 mb-3">Complementary</h4>
                {analysisData.kinkAlignment?.complementaryKinks?.map((kink, index) => (
                  <div key={index} className="mb-2 p-2 bg-yellow-500/20 rounded">
                    <div className="text-white font-medium">{kink.role}</div>
                    <div className="text-yellow-300 text-sm">Potential: {kink.potential}%</div>
                  </div>
                ))}
              </div>
              <div className="glass-effect rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-400 mb-3">Exploration</h4>
                {analysisData.kinkAlignment?.potentialExplorations?.map((kink, index) => (
                  <div key={index} className="mb-2 p-2 bg-blue-500/20 rounded">
                    <div className="text-white font-medium">{kink.role}</div>
                    <div className="text-blue-300 text-sm">{kink.interest} Interest</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'growthPotential':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Growth Potential</h3>
            <div className="glass-effect rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-purple-300" />
                <span className="text-white font-medium">Development Timeline</span>
              </div>
              <div className="text-2xl font-bold text-purple-300">{analysisData.growthPotential?.timeline}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-effect rounded-lg p-4">
                <h4 className="text-lg font-semibold text-purple-200 mb-3">Learning Areas</h4>
                {analysisData.growthPotential?.learningAreas?.map((area, index) => (
                  <div key={index} className="mb-2 p-2 bg-purple-500/20 rounded">
                    <div className="text-white font-medium">{area.role}</div>
                    <div className="text-purple-300 text-sm">Potential: +{area.potential}%</div>
                  </div>
                ))}
              </div>
              <div className="glass-effect rounded-lg p-4">
                <h4 className="text-lg font-semibold text-purple-200 mb-3">Teaching Opportunities</h4>
                {analysisData.growthPotential?.developmentOpportunities?.map((opp, index) => (
                  <div key={index} className="mb-2 p-2 bg-purple-500/20 rounded">
                    <div className="text-white font-medium">{opp.role}</div>
                    <div className="text-purple-300 text-sm">Teaching: {opp.teachingPotential}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'powerDynamics':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Power Dynamics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-effect rounded-lg p-4">
                <h4 className="text-lg font-semibold text-red-400 mb-3">Dominant Tendencies</h4>
                {analysisData.powerDynamics?.dominantTendencies?.map((person, index) => (
                  <div key={index} className="mb-2 p-2 bg-red-500/20 rounded">
                    <div className="text-white font-medium">{person.name}</div>
                    <div className="text-red-300 text-sm">Score: {person.score}%</div>
                  </div>
                ))}
                {(!analysisData.powerDynamics?.dominantTendencies || analysisData.powerDynamics.dominantTendencies.length === 0) && (
                  <p className="text-purple-300 text-sm">No strong dominant tendencies found</p>
                )}
              </div>
              <div className="glass-effect rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-400 mb-3">Submissive Tendencies</h4>
                {analysisData.powerDynamics?.submissiveTendencies?.map((person, index) => (
                  <div key={index} className="mb-2 p-2 bg-blue-500/20 rounded">
                    <div className="text-white font-medium">{person.name}</div>
                    <div className="text-blue-300 text-sm">Score: {person.score}%</div>
                  </div>
                ))}
                {(!analysisData.powerDynamics?.submissiveTendencies || analysisData.powerDynamics.submissiveTendencies.length === 0) && (
                  <p className="text-purple-300 text-sm">No strong submissive tendencies found</p>
                )}
              </div>
              <div className="glass-effect rounded-lg p-4">
                <h4 className="text-lg font-semibold text-purple-400 mb-3">Switch Potential</h4>
                {analysisData.powerDynamics?.switchPotential?.map((person, index) => (
                  <div key={index} className="mb-2 p-2 bg-purple-500/20 rounded">
                    <div className="text-white font-medium">{person.name}</div>
                    <div className="text-purple-300 text-sm">Score: {person.score}%</div>
                  </div>
                ))}
                {(!analysisData.powerDynamics?.switchPotential || analysisData.powerDynamics.switchPotential.length === 0) && (
                  <p className="text-purple-300 text-sm">No switch tendencies found</p>
                )}
              </div>
            </div>
            <div className="glass-effect rounded-lg p-4">
              <h4 className="text-lg font-semibold text-purple-200 mb-3">Overall Power Balance</h4>
              <div className="text-2xl font-bold text-white mb-2">
                {analysisData.powerDynamics?.powerBalance}
              </div>
              <p className="text-purple-200 text-sm">
                This indicates the general power dynamic preference across all participants
              </p>
            </div>
          </div>
        )

      case 'communication':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">Communication Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-effect rounded-lg p-4">
                <h4 className="text-lg font-semibold text-green-400 mb-3">Openness</h4>
                {analysisData.communication?.openness?.map((person, index) => (
                  <div key={index} className="mb-2 p-2 bg-green-500/20 rounded">
                    <div className="text-white font-medium">{person.name}</div>
                    <div className="text-green-300 text-sm">{person.trait}</div>
                    <div className="text-green-300 text-sm">Score: {person.score}%</div>
                  </div>
                ))}
                {(!analysisData.communication?.openness || analysisData.communication.openness.length === 0) && (
                  <p className="text-purple-300 text-sm">No high openness scores found</p>
                )}
              </div>
              <div className="glass-effect rounded-lg p-4">
                <h4 className="text-lg font-semibold text-yellow-400 mb-3">Exploration</h4>
                {analysisData.communication?.exploration?.map((person, index) => (
                  <div key={index} className="mb-2 p-2 bg-yellow-500/20 rounded">
                    <div className="text-white font-medium">{person.name}</div>
                    <div className="text-yellow-300 text-sm">
                      Voyeur: {person.voyeurScore}% | Exhibitionist: {person.exhibitionistScore}%
                    </div>
                  </div>
                ))}
                {(!analysisData.communication?.exploration || analysisData.communication.exploration.length === 0) && (
                  <p className="text-purple-300 text-sm">No exploration tendencies found</p>
                )}
              </div>
              <div className="glass-effect rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-400 mb-3">Boundaries</h4>
                {analysisData.communication?.boundaries?.map((person, index) => (
                  <div key={index} className="mb-2 p-2 bg-blue-500/20 rounded">
                    <div className="text-white font-medium">{person.name}</div>
                    <div className="text-blue-300 text-sm">{person.note}</div>
                    <div className="text-blue-300 text-sm">Score: {person.score}%</div>
                  </div>
                ))}
                {(!analysisData.communication?.boundaries || analysisData.communication.boundaries.length === 0) && (
                  <p className="text-purple-300 text-sm">No boundary preferences found</p>
                )}
              </div>
            </div>
            <div className="glass-effect rounded-lg p-4">
              <h4 className="text-lg font-semibold text-purple-200 mb-3">Communication Recommendations</h4>
              <div className="space-y-2">
                {analysisData.communication?.recommendations?.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-purple-200">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center text-purple-200">
            <Brain className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <p>Select an analysis type to view detailed insights</p>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="glass-effect rounded-2xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
        <p className="text-purple-200">Performing advanced analysis...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Analysis Type Selector */}
      <div className="glass-effect rounded-2xl p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'compatibility', label: 'Compatibility', icon: <Heart className="w-4 h-4" /> },
            { key: 'roleDynamics', label: 'Role Dynamics', icon: <Users className="w-4 h-4" /> },
            { key: 'kinkAlignment', label: 'Kink Alignment', icon: <Target className="w-4 h-4" /> },
            { key: 'powerDynamics', label: 'Power Dynamics', icon: <Zap className="w-4 h-4" /> },
            { key: 'communication', label: 'Communication', icon: <MessageCircle className="w-4 h-4" /> },
            { key: 'growthPotential', label: 'Growth Potential', icon: <TrendingUp className="w-4 h-4" /> }
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setSelectedAnalysis(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                selectedAnalysis === key
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-purple-200 hover:text-white hover:bg-white/10'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Content */}
      <div className="glass-effect rounded-2xl p-6">
        {renderAnalysisContent()}
      </div>

      {/* Dynamic Insights - Show different content based on selected tab */}
      {analysisData && (
         <div className="glass-effect rounded-2xl p-6">
           <div className="flex items-center gap-2 mb-6">
             <Lightbulb className="w-6 h-6 text-yellow-400" />
             <h3 className="text-xl font-bold text-white">
               {selectedAnalysis === 'compatibility' && 'Compatibility Insights'}
               {selectedAnalysis === 'roleDynamics' && 'Role Dynamics Insights'}
               {selectedAnalysis === 'kinkAlignment' && 'Kink Alignment Insights'}
               {selectedAnalysis === 'powerDynamics' && 'Power Dynamics Insights'}
               {selectedAnalysis === 'communication' && 'Communication Insights'}
               {selectedAnalysis === 'growthPotential' && 'Growth Potential Insights'}
             </h3>
           </div>
           
           <div className="mb-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
             <div className="flex items-center gap-2 mb-2">
               <Brain className="w-5 h-5 text-purple-400" />
               <h4 className="text-lg font-semibold text-purple-200">Analysis Summary</h4>
             </div>
             <p className="text-purple-200 text-sm">
               {selectedAnalysis === 'compatibility' && `Based on the compatibility analysis of ${results.length} participant${results.length > 1 ? 's' : ''}, here are key insights about your overall compatibility and relationship potential.`}
               {selectedAnalysis === 'roleDynamics' && `Based on the role dynamics analysis of ${results.length} participant${results.length > 1 ? 's' : ''}, here are insights about how your roles interact and complement each other.`}
               {selectedAnalysis === 'kinkAlignment' && `Based on the kink alignment analysis of ${results.length} participant${results.length > 1 ? 's' : ''}, here are insights about your shared interests and exploration opportunities.`}
               {selectedAnalysis === 'powerDynamics' && `Based on the power dynamics analysis of ${results.length} participant${results.length > 1 ? 's' : ''}, here are insights about your power exchange potential and balance.`}
               {selectedAnalysis === 'communication' && `Based on the compatibility analysis of ${results.length} participant${results.length > 1 ? 's' : ''}, here are communication strategies tailored to your specific dynamics and preferences.`}
               {selectedAnalysis === 'growthPotential' && `Based on the growth potential analysis of ${results.length} participant${results.length > 1 ? 's' : ''}, here are insights about your development opportunities and learning areas.`}
             </p>
           </div>

           <div className="space-y-4">
             {getTabInsights().map((rec, index) => (
               <motion.div
                 key={index}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: index * 0.1 }}
                 className="group relative"
               >
                 <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg hover:from-yellow-500/15 hover:to-orange-500/15 transition-all duration-300">
                   <div className="flex-shrink-0">
                     <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2 group-hover:scale-110 transition-transform duration-200"></div>
                   </div>
                   <div className="flex-1">
                     <p className="text-purple-200 leading-relaxed">
                       {rec.split('**').map((part, i) => {
                         if (i % 2 === 1) {
                           return <strong key={i} className="text-white font-semibold">{part}</strong>
                         }
                         return part
                       })}
                     </p>
                     <div className="mt-2 flex items-center gap-2 text-xs text-purple-300">
                       <span className="px-2 py-1 bg-purple-500/20 rounded">Insight #{index + 1}</span>
                       <span className="px-2 py-1 bg-yellow-500/20 rounded">
                         {selectedAnalysis === 'compatibility' && 'Compatibility'}
                         {selectedAnalysis === 'roleDynamics' && 'Role Dynamics'}
                         {selectedAnalysis === 'kinkAlignment' && 'Kink Alignment'}
                         {selectedAnalysis === 'powerDynamics' && 'Power Dynamics'}
                         {selectedAnalysis === 'communication' && 'Communication'}
                         {selectedAnalysis === 'growthPotential' && 'Growth Potential'}
                       </span>
                     </div>
                   </div>
                 </div>
               </motion.div>
             ))}
           </div>

           <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-lg">
             <div className="flex items-center gap-2 mb-2">
               <TrendingUp className="w-5 h-5 text-green-400" />
               <h4 className="text-lg font-semibold text-green-200">Implementation Tips</h4>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-200">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                 <span>Start with one recommendation at a time</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                 <span>Schedule regular check-ins to discuss progress</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                 <span>Be patient with the learning process</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                 <span>Celebrate small victories and improvements</span>
               </div>
             </div>
           </div>
         </div>
       )}
    </div>
  )
}

export default AdvancedAnalysis
