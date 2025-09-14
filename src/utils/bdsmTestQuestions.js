// BDSM Test Questions Database
// Based on the original BDSMtest.org questions with proper categorization

export const bdsmTestQuestions = [
  // Dominance/Submission Questions
  {
    id: 1,
    question: "I enjoy being in control during sexual activities",
    category: "dominance",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 2,
    question: "I like to be told what to do in bed",
    category: "submission",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 3,
    question: "I enjoy giving orders to my partner",
    category: "dominance",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 4,
    question: "I like to be dominated by my partner",
    category: "submission",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },

  // Sadism/Masochism Questions
  {
    id: 5,
    question: "I find pleasure in giving pain to my partner",
    category: "sadism",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 6,
    question: "I enjoy receiving pain during sexual activities",
    category: "masochism",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 7,
    question: "I like to spank my partner",
    category: "sadism",
    weight: 0.8,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 8,
    question: "I enjoy being spanked",
    category: "masochism",
    weight: 0.8,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },

  // Bondage Questions
  {
    id: 9,
    question: "I enjoy being tied up or restrained",
    category: "rope_bunny",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 10,
    question: "I like to tie up my partner",
    category: "rigger",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 11,
    question: "I enjoy rope bondage",
    category: "rope_bunny",
    weight: 0.9,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 12,
    question: "I like to practice rope bondage on my partner",
    category: "rigger",
    weight: 0.9,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },

  // Brat/Brat Tamer Questions
  {
    id: 13,
    question: "I enjoy being playful and disobedient with my partner",
    category: "brat",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 14,
    question: "I like to tame bratty behavior in my partner",
    category: "brat_tamer",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 15,
    question: "I enjoy pushing my partner's buttons",
    category: "brat",
    weight: 0.8,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 16,
    question: "I like to discipline my partner when they misbehave",
    category: "brat_tamer",
    weight: 0.8,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },

  // Voyeur/Exhibitionist Questions
  {
    id: 17,
    question: "I enjoy watching others engage in sexual activities",
    category: "voyeur",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 18,
    question: "I like to be watched during sexual activities",
    category: "exhibitionist",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 19,
    question: "I enjoy public displays of affection",
    category: "exhibitionist",
    weight: 0.6,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 20,
    question: "I like to watch my partner with others",
    category: "voyeur",
    weight: 0.8,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },

  // Daddy/Mommy/Little Questions
  {
    id: 21,
    question: "I enjoy taking care of my partner like a parent",
    category: "daddy_mommy",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 22,
    question: "I like to be taken care of like a child",
    category: "little",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 23,
    question: "I enjoy age play scenarios",
    category: "ageplayer",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 24,
    question: "I like to set rules and boundaries for my partner",
    category: "daddy_mommy",
    weight: 0.8,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },

  // Pet Play Questions
  {
    id: 25,
    question: "I enjoy acting like an animal during play",
    category: "pet",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 26,
    question: "I like to treat my partner like a pet",
    category: "owner",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 27,
    question: "I enjoy wearing collars or pet accessories",
    category: "pet",
    weight: 0.8,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 28,
    question: "I like to train my partner like a pet",
    category: "owner",
    weight: 0.8,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },

  // Master/Slave Questions
  {
    id: 29,
    question: "I enjoy complete control over my partner",
    category: "master_mistress",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 30,
    question: "I like to completely submit to my partner",
    category: "slave",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 31,
    question: "I enjoy formal protocols and rituals",
    category: "master_mistress",
    weight: 0.7,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 32,
    question: "I like to serve my partner in all ways",
    category: "slave",
    weight: 0.7,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },

  // Degradation Questions
  {
    id: 33,
    question: "I enjoy verbally degrading my partner",
    category: "degrader",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 34,
    question: "I like to be verbally degraded by my partner",
    category: "degradee",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 35,
    question: "I enjoy humiliation play",
    category: "degradee",
    weight: 0.8,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 36,
    question: "I like to humiliate my partner",
    category: "degrader",
    weight: 0.8,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },

  // Primal Questions
  {
    id: 37,
    question: "I enjoy chasing and hunting my partner",
    category: "primal_hunter",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 38,
    question: "I like to be chased and hunted by my partner",
    category: "primal_prey",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 39,
    question: "I enjoy biting and scratching during play",
    category: "primal_hunter",
    weight: 0.8,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 40,
    question: "I like to be bitten and scratched during play",
    category: "primal_prey",
    weight: 0.8,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },

  // Experimentalist Questions
  {
    id: 41,
    question: "I enjoy trying new and unusual sexual activities",
    category: "experimentalist",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 42,
    question: "I like to experiment with different kinks",
    category: "experimentalist",
    weight: 0.9,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 43,
    question: "I enjoy using toys and props during play",
    category: "experimentalist",
    weight: 0.7,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },

  // Vanilla Questions
  {
    id: 44,
    question: "I prefer traditional, romantic sexual activities",
    category: "vanilla",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 45,
    question: "I enjoy gentle, loving sexual experiences",
    category: "vanilla",
    weight: 0.9,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 46,
    question: "I prefer emotional connection over physical intensity",
    category: "vanilla",
    weight: 0.8,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },

  // Switch Questions
  {
    id: 47,
    question: "I enjoy both dominant and submissive roles",
    category: "switch",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 48,
    question: "I like to alternate between being in control and being controlled",
    category: "switch",
    weight: 0.9,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 49,
    question: "I enjoy power exchange in both directions",
    category: "switch",
    weight: 0.8,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },

  // Monogamy/Non-monogamy Questions
  {
    id: 50,
    question: "I prefer exclusive, committed relationships",
    category: "monogamist",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 51,
    question: "I enjoy having multiple partners",
    category: "non_monogamist",
    weight: 1.0,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  },
  {
    id: 52,
    question: "I like to share my partner with others",
    category: "non_monogamist",
    weight: 0.8,
    options: [
      { value: 0, text: "Strongly Disagree" },
      { value: 1, text: "Disagree" },
      { value: 2, text: "Neutral" },
      { value: 3, text: "Agree" },
      { value: 4, text: "Strongly Agree" }
    ]
  }
];

// Category to BDSM role mapping
export const categoryMapping = {
  'dominance': 'Dominant',
  'submission': 'Submissive',
  'sadism': 'Sadist',
  'masochism': 'Masochist',
  'rope_bunny': 'Rope bunny',
  'rigger': 'Rigger',
  'brat': 'Brat',
  'brat_tamer': 'Brat tamer',
  'voyeur': 'Voyeur',
  'exhibitionist': 'Exhibitionist',
  'daddy_mommy': 'Daddy/Mommy',
  'little': 'Little',
  'ageplayer': 'Ageplayer',
  'pet': 'Pet',
  'owner': 'Owner',
  'master_mistress': 'Master/Mistress',
  'slave': 'Slave',
  'degrader': 'Degrader',
  'degradee': 'Degradee',
  'primal_hunter': 'Primal (Hunter)',
  'primal_prey': 'Primal (Prey)',
  'experimentalist': 'Experimentalist',
  'vanilla': 'Vanilla',
  'switch': 'Switch',
  'monogamist': 'Monogamist',
  'non_monogamist': 'Non-monogamist'
};

// Calculate results from answers
export const calculateBDSMResults = (answers) => {
  const categories = {};
  
  // Initialize all categories
  Object.values(categoryMapping).forEach(role => {
    categories[role] = 0;
  });

  // Process answers
  Object.entries(answers).forEach(([questionId, value]) => {
    const question = bdsmTestQuestions.find(q => q.id === parseInt(questionId));
    if (question && categoryMapping[question.category]) {
      const role = categoryMapping[question.category];
      categories[role] += value * question.weight;
    }
  });

  // Convert to percentages and format
  const totalQuestions = bdsmTestQuestions.length;
  const maxPossibleScore = totalQuestions * 4; // 4 is max value per question
  
  const results = Object.entries(categories)
    .map(([role, score]) => ({
      role,
      percentage: Math.round((score / maxPossibleScore) * 100),
      color: getColorForPercentage(Math.round((score / maxPossibleScore) * 100))
    }))
    .filter(result => result.percentage > 0)
    .sort((a, b) => b.percentage - a.percentage);

  return results;
};

// Get color based on percentage
const getColorForPercentage = (percentage) => {
  if (percentage >= 80) return 'green';
  if (percentage >= 60) return 'yellow';
  if (percentage >= 40) return 'orange';
  return 'red';
};

// Generate a unique test ID
export const generateTestId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};


