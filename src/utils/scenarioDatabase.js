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
  // BEGINNER SCENARIOS
  'first-time-bondage': {
    id: 'first-time-bondage',
    name: 'First Time Bondage',
    description: 'A gentle and safe introduction to bondage play designed specifically for beginners. This scenario focuses on building trust and comfort with basic restraint techniques while maintaining clear communication and safety protocols. Perfect for couples who are curious about bondage but want to start with the absolute basics in a controlled, educational environment.',
    category: 'bondage',
    intensity: 'low',
    duration: 'short',
    difficulty: 'beginner',
    safetyLevel: 'low',
    roles: ['Submissive', 'Dominant'],
    equipment: ['Soft rope or scarves', 'Safety scissors', 'Comfortable surface'],
    steps: [
      'Discuss boundaries and safe words before starting',
      'Start with simple wrist binding using soft materials',
      'Keep sessions short (15-20 minutes maximum)',
      'Check circulation and comfort every 5 minutes',
      'Have safety scissors within immediate reach',
      'Practice release techniques before starting',
      'End with gentle aftercare and discussion'
    ],
    safety: ['Safe words', 'Regular check-ins', 'Easy release', 'No suspension', 'Soft materials only', 'Short duration']
  },

  'romantic-evening': {
    id: 'romantic-evening',
    name: 'Romantic Evening',
    description: 'A deeply intimate and sensual evening designed to strengthen emotional bonds through gentle power exchange and physical connection. This scenario emphasizes the romantic aspects of BDSM, focusing on trust, vulnerability, and mutual pleasure rather than intense domination. Perfect for couples who want to explore dominance and submission in a loving, nurturing context.',
    category: 'power-exchange',
    intensity: 'low',
    duration: 'long',
    difficulty: 'beginner',
    safetyLevel: 'low',
    roles: ['Submissive', 'Dominant'],
    equipment: ['Candles', 'Massage oil', 'Soft music', 'Comfortable bedding', 'Warm towels', 'Hydration'],
    steps: [
      'Create a romantic atmosphere with candles and soft music',
      'Begin with gentle, full-body massage using warm oil',
      'Gradually introduce power dynamics through touch and voice',
      'Focus on emotional connection and mutual pleasure',
      'Build intimacy through eye contact and gentle communication',
      'End with extended cuddling and emotional aftercare',
      'Discuss the experience and feelings afterward'
    ],
    safety: ['Emotional safety', 'Clear boundaries', 'Gentle care', 'Aftercare', 'Open communication', 'Mutual consent']
  },

  'caregiver-date': {
    id: 'caregiver-date',
    name: 'Caregiver Date',
    description: 'A nurturing and emotionally supportive dynamic that focuses on caregiving and being cared for. This scenario explores the caregiver/little dynamic in a gentle, non-sexual context, emphasizing emotional safety, trust, and mutual support. Perfect for partners who want to explore age regression, caregiving roles, or simply enjoy a nurturing dynamic.',
    category: 'caregiver',
    intensity: 'low',
    duration: 'long',
    difficulty: 'beginner',
    safetyLevel: 'low',
    roles: ['Little', 'Daddy/Mommy'],
    equipment: ['Comfortable clothes', 'Snacks', 'Activities', 'Comfort items', 'Soft blankets', 'Age-appropriate toys'],
    steps: [
      'Create a safe, comfortable, and nurturing environment',
      'Establish clear caregiver/little roles and boundaries',
      'Engage in gentle, age-appropriate activities together',
      'Provide emotional support and guidance throughout',
      'Maintain clear communication and consent boundaries',
      'End with gentle aftercare and emotional check-in',
      'Discuss feelings and experiences afterward'
    ],
    safety: ['Emotional safety', 'Clear roles', 'Gentle care', 'No pressure', 'Age-appropriate activities', 'Emotional check-ins']
  },

  'sensory-exploration': {
    id: 'sensory-exploration',
    name: 'Sensory Exploration',
    description: 'A gentle introduction to sensory play that focuses on discovering new sensations through various textures, temperatures, and stimuli. This scenario is designed to heighten awareness and create intimate connections through touch, sound, and other sensory experiences. Perfect for couples who want to explore sensation play in a safe, controlled environment.',
    category: 'sensory',
    intensity: 'low',
    duration: 'medium',
    difficulty: 'beginner',
    safetyLevel: 'low',
    roles: ['Submissive', 'Dominant'],
    equipment: ['Blindfold', 'Feathers', 'Ice cubes', 'Warm oil', 'Silk scarves', 'Different textures', 'Soft music'],
    steps: [
      'Blindfold the submissive to heighten other senses',
      'Use different textures and temperatures on various body areas',
      'Vary pressure and speed of touch and stimulation',
      'Ask for feedback on sensations and preferences',
      'Maintain constant communication throughout',
      'End with gentle aftercare and sensation discussion',
      'Document what worked well for future reference'
    ],
    safety: ['Safe words', 'Temperature awareness', 'Gentle pressure', 'Communication', 'Sensation feedback', 'Gradual exploration']
  },

  'role-play-basics': {
    id: 'role-play-basics',
    name: 'Role Play Basics',
    description: 'An introduction to role-playing that focuses on simple, familiar scenarios to build comfort and confidence. This scenario helps couples explore different personas and dynamics in a safe, controlled environment. Perfect for beginners who want to try role-playing without complex costumes or elaborate scenarios.',
    category: 'role-play',
    intensity: 'low',
    duration: 'medium',
    difficulty: 'beginner',
    safetyLevel: 'low',
    roles: ['Submissive', 'Dominant'],
    equipment: ['Costumes (optional)', 'Props (optional)', 'Comfortable space', 'Communication tools'],
    steps: [
      'Choose simple, familiar roles (teacher/student, boss/employee)',
      'Set clear boundaries and limits for the scenario',
      'Start with verbal role-play and dialogue',
      'Gradually add physical elements and touch',
      'Maintain character throughout the session',
      'Have regular check-ins to ensure comfort',
      'End with discussion about the experience'
    ],
    safety: ['Clear boundaries', 'Safe words', 'Consent check-ins', 'Easy exit', 'Character breaks if needed', 'Open communication']
  },

  // INTERMEDIATE SCENARIOS
  'impact-introduction': {
    id: 'impact-introduction',
    name: 'Impact Introduction',
    description: 'A structured introduction to impact play that focuses on safety, communication, and gradual intensity building. This scenario is designed for couples who want to explore the sensations of impact play in a controlled, educational environment. The emphasis is on learning proper technique, understanding body responses, and establishing clear communication patterns.',
    category: 'impact-play',
    intensity: 'medium',
    duration: 'short',
    difficulty: 'intermediate',
    safetyLevel: 'moderate',
    roles: ['Masochist', 'Sadist'],
    equipment: ['Hands only', 'Safe words established', 'Comfortable surface', 'Aftercare supplies'],
    steps: [
      'Start with hands only - no implements for first sessions',
      'Begin with gentle spanking on safe areas (buttocks, thighs)',
      'Gradually increase intensity based on feedback',
      'Check in frequently using established safe words',
      'Monitor skin condition and body responses',
      'Provide thorough aftercare including skin care',
      'Discuss experience and plan for future sessions'
    ],
    safety: ['Safe words', 'Gradual intensity', 'Aftercare', 'No implements yet', 'Skin monitoring', 'Safe areas only']
  },

  'rope-bondage-basic': {
    id: 'rope-bondage-basic',
    name: 'Basic Rope Bondage',
    description: 'A comprehensive introduction to rope bondage that focuses on fundamental techniques, safety practices, and building confidence with rope work. This scenario is designed for couples who have some experience with basic bondage and want to learn proper rope techniques. The emphasis is on education, safety, and creating beautiful, functional ties.',
    category: 'bondage',
    intensity: 'medium',
    duration: 'medium',
    difficulty: 'intermediate',
    safetyLevel: 'moderate',
    roles: ['Submissive', 'Rigger'],
    equipment: ['Natural fiber rope', 'Safety scissors', 'Comfortable surface', 'Rope cutting tool'],
    steps: [
      'Learn basic rope safety and anatomy',
      'Practice simple wrist and ankle ties',
      'Learn proper tension and circulation checks',
      'Practice release techniques before starting',
      'Create simple decorative elements',
      'Monitor circulation throughout session',
      'Provide thorough aftercare and skin care'
    ],
    safety: ['Rope safety', 'Circulation checks', 'Easy release', 'No suspension', 'Proper technique', 'Aftercare']
  },

  'power-exchange-intermediate': {
    id: 'power-exchange-intermediate',
    name: 'Intermediate Power Exchange',
    description: 'A deeper exploration of power dynamics that builds on basic concepts with more structured protocols and longer duration. This scenario introduces more complex power exchange elements while maintaining strong safety protocols and clear communication. Perfect for couples who have experience with basic power exchange and want to deepen their dynamic.',
    category: 'power-exchange',
    intensity: 'medium',
    duration: 'long',
    difficulty: 'intermediate',
    safetyLevel: 'moderate',
    roles: ['Submissive', 'Dominant'],
    equipment: ['Collar (optional)', 'Protocol list', 'Communication tools', 'Aftercare supplies'],
    steps: [
      'Establish clear protocols and expectations',
      'Begin with formal power exchange ritual',
      'Implement structured communication protocols',
      'Gradually introduce new power dynamics',
      'Maintain regular check-ins and feedback',
      'Provide comprehensive emotional aftercare',
      'Discuss and adjust protocols as needed'
    ],
    safety: ['Clear protocols', 'Regular check-ins', 'Emotional safety', 'Aftercare', 'Flexible boundaries', 'Open communication']
  },

  'sensory-advanced': {
    id: 'sensory-advanced',
    name: 'Advanced Sensory Play',
    description: 'An exploration of more complex sensory experiences that combines multiple sensations and longer duration. This scenario builds on basic sensory play with more sophisticated techniques and combinations. Perfect for couples who enjoy sensation play and want to explore more intense and varied experiences.',
    category: 'sensory',
    intensity: 'medium',
    duration: 'long',
    difficulty: 'intermediate',
    safetyLevel: 'moderate',
    roles: ['Submissive', 'Dominant'],
    equipment: ['Multiple textures', 'Temperature tools', 'Vibrators', 'Blindfold', 'Earplugs', 'Various oils'],
    steps: [
      'Combine multiple sensory inputs simultaneously',
      'Use temperature contrast for heightened sensation',
      'Incorporate vibration and texture combinations',
      'Create sensory deprivation elements',
      'Build intensity through sensation layering',
      'Monitor responses and adjust accordingly',
      'Provide thorough sensory aftercare'
    ],
    safety: ['Temperature safety', 'Sensation monitoring', 'Easy removal', 'Communication', 'Gradual building', 'Aftercare']
  },

  'role-play-complex': {
    id: 'role-play-complex',
    name: 'Complex Role Play',
    description: 'Advanced role-playing scenarios that involve more complex characters, longer duration, and deeper immersion. This scenario is designed for couples who have experience with basic role-play and want to explore more elaborate scenarios with multiple characters or complex storylines.',
    category: 'role-play',
    intensity: 'medium',
    duration: 'long',
    difficulty: 'intermediate',
    safetyLevel: 'moderate',
    roles: ['Multiple roles', 'Switch'],
    equipment: ['Costumes', 'Props', 'Character notes', 'Communication tools'],
    steps: [
      'Develop detailed character backgrounds',
      'Create complex scenario storylines',
      'Establish multiple character interactions',
      'Maintain character consistency throughout',
      'Handle character transitions smoothly',
      'Provide character-specific aftercare',
      'Debrief and discuss character experiences'
    ],
    safety: ['Character boundaries', 'Safe words', 'Character breaks', 'Emotional safety', 'Clear transitions', 'Aftercare']
  },

  // ADVANCED SCENARIOS
  'impact-advanced': {
    id: 'impact-advanced',
    name: 'Advanced Impact Play',
    description: 'Intensive impact play session that explores various implements, techniques, and body areas. This scenario is designed for experienced practitioners who understand safety protocols and have established communication patterns. The focus is on technique, variety, and intense sensation exploration.',
    category: 'impact-play',
    intensity: 'high',
    duration: 'long',
    difficulty: 'advanced',
    safetyLevel: 'high',
    roles: ['Masochist', 'Sadist'],
    equipment: ['Various implements', 'Safety kit', 'Aftercare supplies', 'Medical supplies'],
    steps: [
      'Warm up with lighter implements',
      'Gradually increase intensity and variety',
      'Explore different body areas safely',
      'Monitor skin condition and responses',
      'Provide regular breaks and check-ins',
      'End with comprehensive aftercare',
      'Document techniques and responses'
    ],
    safety: ['Advanced safety protocols', 'Medical monitoring', 'Comprehensive aftercare', 'Skin care', 'Regular breaks', 'Emergency plan']
  },

  'rope-suspension': {
    id: 'rope-suspension',
    name: 'Rope Suspension',
    description: 'Advanced rope bondage involving suspension techniques and complex ties. This scenario requires extensive rope experience, proper safety equipment, and a thorough understanding of suspension safety. Only for experienced practitioners with proper training and safety protocols.',
    category: 'bondage',
    intensity: 'high',
    duration: 'long',
    difficulty: 'advanced',
    safetyLevel: 'high',
    roles: ['Submissive', 'Rigger'],
    equipment: ['Suspension rig', 'Safety equipment', 'Multiple ropes', 'Emergency kit', 'Spotter'],
    steps: [
      'Complete safety check of all equipment',
      'Begin with ground work and warm-up',
      'Gradually build suspension structure',
      'Monitor circulation and comfort constantly',
      'Have spotter present throughout',
      'Provide immediate release capability',
      'End with thorough aftercare and monitoring'
    ],
    safety: ['Professional training required', 'Safety equipment', 'Spotter present', 'Emergency plan', 'Medical monitoring', 'Comprehensive aftercare']
  },

  'power-exchange-advanced': {
    id: 'power-exchange-advanced',
    name: 'Advanced Power Exchange',
    description: 'Intensive power exchange dynamic with complex protocols, extended duration, and deep psychological elements. This scenario explores the most intense aspects of power exchange while maintaining strict safety protocols and emotional care. For experienced practitioners only.',
    category: 'power-exchange',
    intensity: 'high',
    duration: 'very-long',
    difficulty: 'advanced',
    safetyLevel: 'high',
    roles: ['Submissive', 'Dominant'],
    equipment: ['Protocol materials', 'Communication tools', 'Aftercare supplies', 'Support system'],
    steps: [
      'Establish comprehensive protocols and boundaries',
      'Begin with formal power exchange ceremony',
      'Implement intensive power dynamics',
      'Maintain constant communication and monitoring',
      'Provide regular emotional check-ins',
      'End with extensive aftercare and support',
      'Debrief and process emotional experiences'
    ],
    safety: ['Psychological safety', 'Emotional monitoring', 'Support system', 'Comprehensive aftercare', 'Professional support available', 'Clear exit strategies']
  },

  // EXTREME SCENARIOS
  'extreme-impact-mastery': {
    id: 'extreme-impact-mastery',
    name: 'Extreme Impact Mastery',
    description: 'The most intense impact play session designed for expert practitioners who have mastered safety protocols and have extensive experience. This scenario pushes the boundaries of impact play while maintaining the highest safety standards. Only for those with professional training and extensive experience.',
    category: 'impact-play',
    intensity: 'extreme',
    duration: 'very-long',
    difficulty: 'expert',
    safetyLevel: 'very-high',
    roles: ['Expert Masochist', 'Expert Sadist'],
    equipment: ['Professional implements', 'Medical kit', 'Emergency equipment', 'Professional support'],
    steps: [
      'Complete medical and safety assessment',
      'Begin with extensive warm-up protocol',
      'Gradually build to maximum intensity',
      'Monitor vital signs throughout session',
      'Have emergency medical support available',
      'Provide intensive medical aftercare',
      'Schedule follow-up medical monitoring'
    ],
    safety: ['Professional medical supervision', 'Emergency protocols', 'Vital sign monitoring', 'Medical aftercare', 'Follow-up care', 'Professional training required']
  },

  'extreme-bondage-mastery': {
    id: 'extreme-bondage-mastery',
    name: 'Extreme Bondage Mastery',
    description: 'The most advanced bondage scenario involving complex suspension, multiple restraints, and extended duration. This scenario requires professional training, extensive experience, and comprehensive safety protocols. Only for expert practitioners with proper certification and support systems.',
    category: 'bondage',
    intensity: 'extreme',
    duration: 'very-long',
    difficulty: 'expert',
    safetyLevel: 'very-high',
    roles: ['Expert Submissive', 'Expert Rigger'],
    equipment: ['Professional rigging equipment', 'Medical monitoring', 'Emergency systems', 'Professional support team'],
    steps: [
      'Complete comprehensive safety assessment',
      'Set up professional monitoring systems',
      'Execute complex bondage techniques',
      'Monitor all vital signs continuously',
      'Have emergency release systems ready',
      'Provide professional medical aftercare',
      'Schedule comprehensive follow-up care'
    ],
    safety: ['Professional certification required', 'Medical monitoring', 'Emergency systems', 'Professional support', 'Comprehensive aftercare', 'Follow-up monitoring']
  },

  'extreme-power-mastery': {
    id: 'extreme-power-mastery',
    name: 'Extreme Power Mastery',
    description: 'The most intense power exchange dynamic possible, involving deep psychological elements, extended protocols, and maximum intensity. This scenario is only for expert practitioners with extensive experience and professional support systems. Requires comprehensive psychological and emotional preparation.',
    category: 'power-exchange',
    intensity: 'extreme',
    duration: 'very-long',
    difficulty: 'expert',
    safetyLevel: 'very-high',
    roles: ['Expert Submissive', 'Expert Dominant'],
    equipment: ['Professional support materials', 'Psychological support', 'Medical monitoring', 'Emergency protocols'],
    steps: [
      'Complete psychological assessment',
      'Establish comprehensive support systems',
      'Execute intensive power dynamics',
      'Monitor psychological state continuously',
      'Provide professional psychological support',
      'End with intensive emotional aftercare',
      'Schedule professional follow-up care'
    ],
    safety: ['Professional psychological support', 'Medical monitoring', 'Emergency protocols', 'Comprehensive aftercare', 'Professional follow-up', 'Support systems required']
  },

  'extreme-sensory-overload': {
    id: 'extreme-sensory-overload',
    name: 'Extreme Sensory Overload',
    description: 'Maximum intensity sensory play that combines all possible sensations in an overwhelming experience. This scenario is designed for expert practitioners who have mastered sensory play and want to explore the absolute limits of sensation. Requires extensive experience and professional support.',
    category: 'sensory',
    intensity: 'extreme',
    duration: 'very-long',
    difficulty: 'expert',
    safetyLevel: 'very-high',
    roles: ['Expert Submissive', 'Expert Dominant'],
    equipment: ['Professional sensory equipment', 'Medical monitoring', 'Emergency systems', 'Professional support'],
    steps: [
      'Complete sensory tolerance assessment',
      'Set up comprehensive monitoring systems',
      'Gradually build to maximum sensory input',
      'Monitor all responses continuously',
      'Have emergency shutdown procedures ready',
      'Provide intensive sensory aftercare',
      'Schedule professional follow-up monitoring'
    ],
    safety: ['Professional supervision required', 'Medical monitoring', 'Emergency protocols', 'Sensory aftercare', 'Professional support', 'Follow-up care required']
  },

  'extreme-role-mastery': {
    id: 'extreme-role-mastery',
    name: 'Extreme Role Mastery',
    description: 'The most complex and intense role-playing scenario involving multiple characters, extended duration, and deep psychological immersion. This scenario is only for expert practitioners with extensive role-play experience and professional psychological support. Requires comprehensive preparation and support systems.',
    category: 'role-play',
    intensity: 'extreme',
    duration: 'very-long',
    difficulty: 'expert',
    safetyLevel: 'very-high',
    roles: ['Multiple Expert Roles', 'Professional Support'],
    equipment: ['Professional role materials', 'Psychological support', 'Medical monitoring', 'Emergency protocols'],
    steps: [
      'Complete psychological assessment',
      'Establish comprehensive character systems',
      'Execute intensive role immersion',
      'Monitor psychological state continuously',
      'Provide professional psychological support',
      'End with intensive character aftercare',
      'Schedule professional follow-up care'
    ],
    safety: ['Professional psychological support', 'Medical monitoring', 'Emergency protocols', 'Character aftercare', 'Professional follow-up', 'Support systems required']
  },

  // ADDITIONAL TEMPLATES FROM BROKEN FILE
  'power-exchange-dynamic': {
    id: 'power-exchange-dynamic',
    name: 'Power Exchange Dynamic',
    description: 'A comprehensive exploration of power exchange that extends beyond the bedroom into daily life and activities. This scenario focuses on building a sustainable, long-term dynamic that enhances the relationship through structured protocols, clear expectations, and mutual growth. Perfect for couples who want to deepen their power exchange beyond occasional play sessions.',
    category: 'power-exchange',
    intensity: 'medium',
    duration: 'long',
    difficulty: 'intermediate',
    safetyLevel: 'moderate',
    roles: ['Submissive', 'Dominant'],
    equipment: ['Collar (optional)', 'Rules list', 'Journal', 'Communication tools', 'Progress tracking'],
    steps: [
      'Establish clear rules, expectations, and boundaries together',
      'Set up daily protocols and routines that work for both partners',
      'Create accountability system with regular check-ins',
      'Maintain regular communication about the dynamic',
      'Balance power exchange with equality in decision-making',
      'Regularly review and adjust the dynamic as needed',
      'Ensure the dynamic enhances rather than restricts the relationship'
    ],
    safety: ['Clear communication', 'Regular check-ins', 'Flexible boundaries', 'Consent', 'Relationship balance', 'Mutual growth']
  },

  'sensory-deprivation': {
    id: 'sensory-deprivation',
    name: 'Sensory Deprivation',
    description: 'A structured exploration of sensory deprivation that focuses on enhancing remaining senses through controlled deprivation of others. This scenario is designed to heighten awareness and create intense sensory experiences by removing visual and auditory input while enhancing touch, taste, and other sensations.',
    category: 'sensory',
    intensity: 'medium',
    duration: 'medium',
    difficulty: 'intermediate',
    safetyLevel: 'moderate',
    roles: ['Submissive', 'Dominant'],
    equipment: ['Blindfold', 'Earplugs', 'Restraints', 'Various textures', 'Comfort items', 'Communication tools'],
    steps: [
      'Start with single sense deprivation (blindfold only)',
      'Gradually add more deprivation (earplugs, restraints)',
      'Enhance remaining senses with various textures and sensations',
      'Maintain constant communication and check-ins',
      'Provide gentle reintroduction to senses one at a time',
      'Monitor psychological state throughout the session',
      'End with comprehensive aftercare and sensation discussion'
    ],
    safety: ['Gradual deprivation', 'Communication', 'Safe words', 'Gentle reintroduction', 'Psychological monitoring', 'Sensation discussion']
  },

  'pet-play-basics': {
    id: 'pet-play-basics',
    name: 'Pet Play Basics',
    description: 'An introduction to pet play dynamics that focuses on exploring animal personas and training relationships in a safe, consensual environment. This scenario helps couples explore the psychological aspects of taking on animal characteristics, building trust through training, and creating a nurturing dynamic.',
    category: 'pet-play',
    intensity: 'medium',
    duration: 'medium',
    difficulty: 'intermediate',
    safetyLevel: 'moderate',
    roles: ['Pet', 'Owner'],
    equipment: ['Collar', 'Leash', 'Pet toys', 'Treats', 'Comfortable space', 'Training aids'],
    steps: [
      'Establish pet persona and specific animal behaviors',
      'Set up clear training commands and expectations',
      'Create safe play environment with boundaries',
      'Practice basic commands with positive reinforcement',
      'Maintain clear communication throughout the session',
      'End with positive reinforcement and aftercare',
      'Discuss the experience and plan for future sessions'
    ],
    safety: ['Clear roles', 'Safe environment', 'Positive reinforcement', 'Consent', 'Communication', 'Boundary respect']
  },

  'degradation-light': {
    id: 'degradation-light',
    name: 'Light Degradation',
    description: 'A gentle introduction to verbal and psychological degradation play that focuses on mild humiliation and verbal control in a safe, consensual environment. This scenario is designed for couples who want to explore the psychological aspects of degradation without intense emotional impact.',
    category: 'psychological',
    intensity: 'medium',
    duration: 'short',
    difficulty: 'intermediate',
    safetyLevel: 'moderate',
    roles: ['Degradee', 'Degrader'],
    equipment: ['Safe words', 'Aftercare items', 'Communication tools', 'Comfort items'],
    steps: [
      'Establish clear boundaries and limits for language use',
      'Start with mild language and gradually test comfort levels',
      'Check in frequently using established safe words',
      'Provide positive reinforcement and emotional support',
      'End with thorough aftercare and emotional check-in',
      'Discuss the experience and emotional impact afterward',
      'Plan for future sessions with adjusted boundaries if needed'
    ],
    safety: ['Clear boundaries', 'Frequent check-ins', 'Aftercare', 'Consent', 'Emotional monitoring', 'Language limits']
  },

  'age-play-basics': {
    id: 'age-play-basics',
    name: 'Age Play Basics',
    description: 'A gentle exploration of age regression and caregiving dynamics that focuses on emotional safety, trust, and nurturing relationships. This scenario is designed for couples who want to explore age play in a safe, non-sexual context, emphasizing emotional connection and care rather than sexual elements.',
    category: 'age-play',
    intensity: 'low',
    duration: 'long',
    difficulty: 'intermediate',
    safetyLevel: 'moderate',
    roles: ['Little', 'Caregiver'],
    equipment: ['Comfort items', 'Activities', 'Snacks', 'Age-appropriate toys', 'Soft blankets', 'Comfortable space'],
    steps: [
      'Establish specific age range and persona for the little',
      'Create safe, nurturing environment with age-appropriate items',
      'Engage in age-appropriate activities and play',
      'Maintain clear boundaries between play and reality',
      'Provide gentle aftercare and emotional support',
      'Discuss the experience and emotional impact afterward',
      'Plan for future sessions with adjusted boundaries if needed'
    ],
    safety: ['Clear boundaries', 'Safe environment', 'Gentle care', 'Consent', 'Age-appropriate activities', 'Emotional support']
  },

  'medical-play': {
    id: 'medical-play',
    name: 'Medical Play',
    description: 'Role-play involving medical scenarios with safe, clean implements and proper medical awareness. This scenario explores the psychological aspects of medical role-play while maintaining strict safety protocols and medical knowledge. This comprehensive medical play experience focuses on the psychological dynamics of medical scenarios, including the power dynamics between medical professionals and patients, the vulnerability of medical examinations, and the intense sensations that can come from medical role-play. The scenario emphasizes proper medical knowledge, safe implements, and maintaining the psychological aspects of medical play while ensuring complete safety.',
    category: 'role-play',
    intensity: 'medium',
    duration: 'medium',
    difficulty: 'advanced',
    safetyLevel: 'high',
    roles: ['Patient', 'Doctor/Nurse'],
    equipment: ['Medical props', 'Safe implements', 'Aftercare items', 'Sterile supplies'],
    steps: [
      'Establish medical scenario and roles',
      'Use safe, clean implements only',
      'Maintain medical role throughout session',
      'Provide thorough aftercare and monitoring',
      'Check for any real medical issues',
      'Document any concerns for follow-up'
    ],
    safety: ['Clean implements', 'Medical awareness', 'Aftercare', 'Safety protocols', 'Medical monitoring']
  },

  'exhibitionism-private': {
    id: 'exhibitionism-private',
    name: 'Private Exhibitionism',
    description: 'Exhibitionism in controlled, private settings with complete consent from all parties. This scenario explores the psychological aspects of being watched in a safe, controlled environment. This comprehensive exhibitionism experience focuses on the psychological thrill of being observed while maintaining complete privacy and safety. The scenario explores the dynamics of being watched, performing for an audience, and the intense arousal that comes from being the center of attention. Perfect for couples who want to explore exhibitionism in a completely safe, private environment with full consent from all participants.',
    category: 'exhibitionism',
    intensity: 'medium',
    duration: 'short',
    difficulty: 'intermediate',
    safetyLevel: 'moderate',
    roles: ['Exhibitionist', 'Observer'],
    equipment: ['Private space', 'Consent agreements', 'Safety equipment'],
    steps: [
      'Ensure complete privacy and security',
      'Get explicit consent from all involved parties',
      'Set clear boundaries and limits',
      'Maintain safety protocols throughout',
      'Provide comprehensive aftercare',
      'Discuss experience and feelings afterward'
    ],
    safety: ['Complete privacy', 'Full consent', 'Clear boundaries', 'Safety protocols', 'Aftercare']
  },

  'voyeurism-controlled': {
    id: 'voyeurism-controlled',
    name: 'Controlled Voyeurism',
    description: 'Watching others in consensual, controlled settings with proper boundaries and consent. This scenario explores the psychological aspects of voyeurism in a safe, ethical environment. This comprehensive voyeurism experience focuses on the psychological arousal and excitement of watching others engage in intimate activities with full consent and proper boundaries. The scenario explores the dynamics of observation, the thrill of being a spectator, and the intense arousal that comes from watching consensual activities. Perfect for couples who want to explore voyeurism in a completely safe, ethical environment with full consent from all participants.',
    category: 'voyeurism',
    intensity: 'low',
    duration: 'medium',
    difficulty: 'intermediate',
    safetyLevel: 'moderate',
    roles: ['Voyeur', 'Performer'],
    equipment: ['Private space', 'Consent agreements', 'Safety equipment'],
    steps: [
      'Ensure complete privacy and security',
      'Get explicit consent from all involved parties',
      'Set clear boundaries and viewing limits',
      'Maintain safety protocols throughout',
      'Provide comprehensive aftercare',
      'Discuss experience and feelings afterward'
    ],
    safety: ['Complete privacy', 'Full consent', 'Clear boundaries', 'Safety protocols', 'Aftercare']
  },

  'breath-play-light': {
    id: 'breath-play-light',
    name: 'Light Breath Play',
    description: 'Very mild breath restriction play with hands only and constant monitoring. This is an advanced technique that requires extensive experience and proper safety protocols. This scenario explores the psychological and physical sensations of controlled breath restriction in the safest possible manner. The focus is on creating intense sensations through minimal, controlled pressure while maintaining absolute safety and immediate release capability. Perfect for experienced practitioners who want to explore breath play without the risks associated with more intense techniques.',
    category: 'breath-play',
    intensity: 'high',
    duration: 'very-short',
    difficulty: 'advanced',
    safetyLevel: 'very-high',
    roles: ['Submissive', 'Dominant'],
    equipment: ['Hands only', 'Safety monitoring', 'Emergency plan'],
    steps: [
      'Use hands only, no implements or tools',
      'Very short duration (seconds only)',
      'Constant monitoring and communication',
      'Immediate release on any signal',
      'Thorough aftercare and monitoring',
      'Check for any complications'
    ],
    safety: ['Hands only', 'Very short duration', 'Constant monitoring', 'Immediate release', 'Medical awareness']
  },

  'temperature-play': {
    id: 'temperature-play',
    name: 'Temperature Play',
    description: 'Exploring sensations with hot and cold in safe temperature ranges. This scenario focuses on sensory exploration through temperature variations while maintaining safety. This comprehensive temperature play experience combines various hot and cold elements to create intense sensory stimulation. The scenario explores the contrast between different temperatures and their effects on the body, creating heightened awareness and unique sensations. Perfect for couples who want to explore sensory play with temperature variations in a controlled, safe environment.',
    category: 'sensory',
    intensity: 'medium',
    duration: 'medium',
    difficulty: 'intermediate',
    safetyLevel: 'moderate',
    roles: ['Submissive', 'Dominant'],
    equipment: ['Ice cubes', 'Warm oil', 'Temperature-safe items', 'Safety equipment'],
    steps: [
      'Test temperature on yourself first',
      'Use safe temperature ranges only',
      'Monitor skin response constantly',
      'Avoid extreme temperatures',
      'Provide comprehensive aftercare',
      'Check for any skin damage'
    ],
    safety: ['Temperature testing', 'Safe ranges', 'Skin monitoring', 'Aftercare', 'Damage assessment']
  },

  'electro-stimulation': {
    id: 'electro-stimulation',
    name: 'Electro-Stimulation',
    description: 'Using electrical stimulation devices safely with proper training and equipment. This is an advanced technique that requires extensive experience and proper safety protocols. This scenario explores the unique sensations of electrical stimulation through safe, controlled devices designed specifically for BDSM play. The focus is on understanding electrical safety, proper device operation, and creating intense sensations through controlled electrical impulses. Perfect for experienced practitioners who want to explore the boundaries of sensory play with electrical stimulation in a safe, controlled environment.',
    category: 'sensory',
    intensity: 'high',
    duration: 'short',
    difficulty: 'advanced',
    safetyLevel: 'very-high',
    roles: ['Submissive', 'Dominant'],
    equipment: ['Safe electro-stim devices', 'Safety instructions', 'Medical monitoring'],
    steps: [
      'Read all safety instructions thoroughly',
      'Start with lowest settings only',
      'Test on yourself first',
      'Monitor response carefully',
      'Provide comprehensive aftercare',
      'Check for any complications'
    ],
    safety: ['Safety instructions', 'Lowest settings', 'Self-testing', 'Monitoring', 'Medical awareness']
  },

  'wax-play': {
    id: 'wax-play',
    name: 'Wax Play',
    description: 'Using candle wax for sensory stimulation with body-safe candles and proper temperature control. This scenario explores temperature and texture sensations safely. This comprehensive wax play experience combines the visual appeal of dripping wax with the intense sensory stimulation of temperature and texture. The scenario focuses on creating beautiful patterns and sensations through controlled wax application while maintaining strict safety protocols. Perfect for couples who want to explore the artistic and sensory aspects of wax play in a safe, controlled environment.',
    category: 'sensory',
    intensity: 'medium',
    duration: 'short',
    difficulty: 'intermediate',
    safetyLevel: 'moderate',
    roles: ['Submissive', 'Dominant'],
    equipment: ['Body-safe candles', 'Safety equipment', 'Temperature monitoring'],
    steps: [
      'Use body-safe candles only',
      'Test temperature on yourself first',
      'Start with higher drops to test temperature',
      'Monitor skin response constantly',
      'Provide comprehensive aftercare',
      'Check for any burns or damage'
    ],
    safety: ['Body-safe candles', 'Temperature testing', 'Skin monitoring', 'Aftercare', 'Burn assessment']
  },

  'knife-play': {
    id: 'knife-play',
    name: 'Knife Play',
    description: 'Sensation play with dull blades and proper safety protocols. This is an advanced technique that requires extensive experience and proper safety measures. This scenario explores the psychological and physical sensations of knife play using only dull, safe blades designed specifically for BDSM play. The focus is on creating intense psychological arousal and physical sensations through the threat and presence of blades without any actual cutting or injury. Perfect for experienced practitioners who want to explore the psychological aspects of knife play in the safest possible manner.',
    category: 'sensory',
    intensity: 'high',
    duration: 'short',
    difficulty: 'advanced',
    safetyLevel: 'very-high',
    roles: ['Submissive', 'Dominant'],
    equipment: ['Dull blades only', 'Safety equipment', 'Medical monitoring'],
    steps: [
      'Use dull blades only, never sharp',
      'Test on yourself first',
      'Avoid sensitive areas completely',
      'Monitor skin response constantly',
      'Provide comprehensive aftercare',
      'Check for any cuts or damage'
    ],
    safety: ['Dull blades only', 'Self-testing', 'Safe areas', 'Monitoring', 'Medical awareness']
  },

  'fire-play': {
    id: 'fire-play',
    name: 'Fire Play',
    description: 'Controlled fire play with proper safety equipment and extensive training. This is an expert-level technique that requires professional training and comprehensive safety measures. This scenario explores the intense sensations and visual spectacle of controlled fire play using specialized equipment and techniques designed for BDSM play. The focus is on creating dramatic visual effects and intense sensations through controlled flame application while maintaining the highest safety standards. Perfect for expert practitioners who have received proper training and want to explore the most intense forms of sensory play.',
    category: 'sensory',
    intensity: 'high',
    duration: 'short',
    difficulty: 'advanced',
    safetyLevel: 'very-high',
    roles: ['Submissive', 'Dominant'],
    equipment: ['Fire safety equipment', 'Fire extinguisher', 'Medical monitoring'],
    steps: [
      'Use proper safety equipment',
      'Have fire extinguisher nearby',
      'Test techniques thoroughly first',
      'Monitor constantly throughout',
      'Provide comprehensive aftercare',
      'Check for any burns or damage'
    ],
    safety: ['Safety equipment', 'Fire extinguisher', 'Thorough testing', 'Constant monitoring', 'Medical awareness']
  }
}
