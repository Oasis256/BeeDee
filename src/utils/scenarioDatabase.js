// Scenario Database - Separates content from code for better maintainability

// Helper functions for working with scenarios
export const getScenarioById = (id) => {
  return scenarioDatabase[id] || null
}

export const getAllScenarios = () => {
  return Object.values(scenarioDatabase)
}

export const getScenariosByCategory = (category) => {
  return Object.values(scenarioDatabase).filter(scenario => scenario.category === category)
}

export const getScenariosByDifficulty = (difficulty) => {
  return Object.values(scenarioDatabase).filter(scenario => scenario.difficulty === difficulty)
}

export const getScenariosByIntensity = (intensity) => {
  return Object.values(scenarioDatabase).filter(scenario => scenario.intensity === intensity)
}

export const searchScenarios = (query) => {
  const searchTerm = query.toLowerCase()
  return Object.values(scenarioDatabase).filter(scenario => 
    scenario.name.toLowerCase().includes(searchTerm) ||
    scenario.description.toLowerCase().includes(searchTerm) ||
    scenario.category.toLowerCase().includes(searchTerm) ||
    scenario.roles.some(role => role.toLowerCase().includes(searchTerm))
  )
}

// Scenario Database
export const scenarioDatabase = {
  'first-time-bondage': {
    id: 'first-time-bondage',
    name: 'First Time Bondage',
    description: 'A gentle and safe introduction to bondage play designed specifically for beginners.',
    category: 'bondage',
    intensity: 'low',
    duration: 'short',
    difficulty: 'beginner',
    safetyLevel: 'low',
    roles: ['Submissive', 'Dominant'],
    equipment: ['Soft rope or scarves', 'Safety scissors'],
    steps: [
      'Start with simple wrist binding',
      'Use soft materials only',
      'Keep sessions short (15-20 minutes)',
      'Check circulation frequently',
      'Have safety scissors nearby'
    ],
    safety: ['Safe words', 'Regular check-ins', 'Easy release', 'No suspension']
  },

  'romantic-evening': {
    id: 'romantic-evening',
    name: 'Romantic Evening',
    description: 'A sensual and intimate evening focused on connection',
    category: 'power-exchange',
    intensity: 'low',
    duration: 'long',
    difficulty: 'beginner',
    safetyLevel: 'low',
    roles: ['Submissive', 'Dominant'],
    equipment: ['Candles', 'Massage oil', 'Soft music'],
    steps: [
      'Set the mood with candles and music',
      'Start with gentle massage',
      'Build intimacy gradually',
      'Focus on emotional connection',
      'End with cuddling and aftercare'
    ],
    safety: ['Emotional safety', 'Clear boundaries', 'Gentle care', 'Aftercare']
  },

  'impact-introduction': {
    id: 'impact-introduction',
    name: 'Impact Introduction',
    description: 'Safe introduction to impact play for beginners',
    category: 'impact-play',
    intensity: 'medium',
    duration: 'short',
    difficulty: 'intermediate',
    safetyLevel: 'moderate',
    roles: ['Masochist', 'Sadist'],
    equipment: ['Hands only', 'Safe words established'],
    steps: [
      'Start with hands only',
      'Begin with gentle spanking',
      'Gradually increase intensity',
      'Check in frequently',
      'Provide thorough aftercare'
    ],
    safety: ['Safe words', 'Gradual intensity', 'Aftercare', 'No implements yet']
  }
}
