import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PositionTimer from './PositionTimer'
import { 
  Heart, 
  Star, 
  Eye, 
  Shield, 
  Zap,
  ArrowRight,
  BookOpen,
  Users,
  Target,
  Activity,
  X,
  ExternalLink,
  Filter,
  Search,
  Play,
  Info,
  Clock,
  User,
  Moon,
  Sun,
  Bookmark,
  Shuffle,
  Timer,
  CheckCircle,
  Circle,
  Settings,
  TrendingUp
} from 'lucide-react'

const SexPositions = ({ results }) => {
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [showPositionModal, setShowPositionModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showIllustrations, setShowIllustrations] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [scrapedData, setScrapedData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  
  // New state for enhanced features
  const [favorites, setFavorites] = useState([])
  const [darkMode, setDarkMode] = useState(true)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [filters, setFilters] = useState({
    difficulty: 'all',
    duration: 'all',
    partnerCount: 'all',
    hasImages: 'all',
    hasDescription: 'all'
  })
  const [completedPositions, setCompletedPositions] = useState([])
  const [showCompleted, setShowCompleted] = useState(false)
  const [showTimer, setShowTimer] = useState(false)

  // Load user preferences from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('sexPositionsFavorites')
    const savedDarkMode = localStorage.getItem('sexPositionsDarkMode')
    const savedCompleted = localStorage.getItem('sexPositionsCompleted')
    
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
    if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode))
    if (savedCompleted) setCompletedPositions(JSON.parse(savedCompleted))
  }, [])

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('sexPositionsFavorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('sexPositionsDarkMode', JSON.stringify(darkMode))
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('sexPositionsCompleted', JSON.stringify(completedPositions))
  }, [completedPositions])

  // Load scraped data
  useEffect(() => {
    const loadScrapedData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Starting to load data...');
        
        // Try main data file first
        const response = await fetch('/all-sex-positions.json');
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Loaded positions:', data.length, 'categories');
          setScrapedData(data);
        } else {
          console.warn('⚠️ Main data file not found, trying fallback file...');
          
          // Try fallback data file
          const fallbackResponse = await fetch('/fallback-sex-positions.json');
          if (fallbackResponse.ok) {
            const fallbackFileData = await fallbackResponse.json();
            console.log('✅ Loaded fallback positions:', fallbackFileData.categories?.length || 0, 'categories');
            setScrapedData(fallbackFileData.categories || []);
          } else {
            console.error('❌ Both main and fallback files failed, using built-in fallback data');
            setScrapedData(fallbackData);
          }
        }
      } catch (error) {
        console.error('❌ Error loading data, trying fallback file...', error);
        
        // Try fallback file on error
        try {
          const fallbackResponse = await fetch('/fallback-sex-positions.json');
          if (fallbackResponse.ok) {
            const fallbackFileData = await fallbackResponse.json();
            console.log('✅ Loaded fallback positions:', fallbackFileData.categories?.length || 0, 'categories');
            setScrapedData(fallbackFileData.categories || []);
          } else {
            console.error('❌ Fallback file also failed, using built-in fallback data');
            setScrapedData(fallbackData);
          }
        } catch (fallbackError) {
          console.error('❌ Fallback file also failed:', fallbackError);
          setScrapedData(fallbackData);
        }
      } finally {
        setLoading(false);
        console.log('🏁 Finished loading data');
      }
    };

    loadScrapedData();
  }, []);

  // Fallback data in case scraping fails
  const fallbackData = [
    {
      category: 'Oral Positions',
      title: '38 Oral Sex Positions That\'ll Help You Level Up on Going Down',
      description: 'Comprehensive oral sex positions guide with detailed instructions.',
      images: [
        {
          src: 'https://hips.hearstapps.com/hmg-prod/images/1-the-bend-and-slap-67ed8b36236d4.jpg?crop=1xw:1xh;center,top&resize=980:*',
          alt: 'Oral sex position illustration'
        }
      ],
      positions: [
        {
          number: 1,
          title: 'The Bend and Slap',
          description: 'Want to try an oral/spanking hybrid? One partner puts both knees on a chair (with a pillow for comfort) and leans forward.',
          howToDoIt: 'The receiver sits on their partner\'s lap. They slide down slowly, bracing their hands on their partner\'s thighs for full control.'
        }
      ],
      originalUrl: 'https://www.cosmopolitan.com/sex-love/g4967/oral-sex-positions-you-need/'
    }
  ]

  // Enhanced helper functions with error handling
  const getDifficultyLevel = (title, description) => {
    try {
      const text = `${title || ''} ${description || ''}`.toLowerCase()
      if (text.includes('beginner') || text.includes('first-time') || text.includes('easy') || text.includes('simple')) {
        return 'beginner'
      } else if (text.includes('advanced') || text.includes('expert') || text.includes('difficult') || text.includes('complex')) {
        return 'advanced'
      } else {
        return 'intermediate'
      }
    } catch (error) {
      console.warn('Error determining difficulty level:', error)
      return 'intermediate'
    }
  }

  const getDurationEstimate = (description) => {
    try {
      const text = (description || '').toLowerCase()
      if (text.includes('quick') || text.includes('fast') || text.includes('brief')) {
        return 'quick'
      } else if (text.includes('long') || text.includes('extended') || text.includes('marathon')) {
        return 'long'
      } else {
        return 'medium'
      }
    } catch (error) {
      console.warn('Error determining duration:', error)
      return 'medium'
    }
  }

  const getPartnerCount = (title, description) => {
    try {
      const text = `${title || ''} ${description || ''}`.toLowerCase()
      if (text.includes('foursome') || text.includes('threesome') || text.includes('group') || text.includes('multiple')) {
        return 'group'
      } else if (text.includes('solo') || text.includes('masturbation') || text.includes('alone')) {
        return 'solo'
      } else {
        return 'couple'
      }
    } catch (error) {
      console.warn('Error determining partner count:', error)
      return 'couple'
    }
  }

  const toggleFavorite = (positionId) => {
    setFavorites(prev => 
      prev.includes(positionId) 
        ? prev.filter(id => id !== positionId)
        : [...prev, positionId]
    )
  }

  const toggleCompleted = (positionId) => {
    setCompletedPositions(prev => 
      prev.includes(positionId) 
        ? prev.filter(id => id !== positionId)
        : [...prev, positionId]
    )
  }

  const getRandomPosition = () => {
    const allPositions = scrapedData.flatMap(category => 
      category.positions.map(pos => ({ ...pos, category: category.category }))
    )
    const randomIndex = Math.floor(Math.random() * allPositions.length)
    return allPositions[randomIndex]
  }

  // Enhanced filtering logic
  const getFilteredData = () => {
    let filtered = scrapedData

    // Filter by category
    if (activeCategory === 'favorites') {
      filtered = scrapedData.filter(category => 
        category.positions.some(pos => {
          const posId = `${category.category}-${category.title}-${pos.number}-${pos.title}`
          return favorites.includes(posId)
        })
      )
    } else if (activeCategory === 'completed') {
      filtered = scrapedData.filter(category => 
        category.positions.some(pos => {
          const posId = `${category.category}-${category.title}-${pos.number}-${pos.title}`
          return completedPositions.includes(posId)
        })
      )
    } else if (activeCategory !== 'all' && activeCategory !== 'random') {
      filtered = scrapedData.filter(item => item.category === activeCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.positions.some(pos => 
          pos.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (pos.description && pos.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      )
    }

    return filtered
  }

  const applyAdvancedFilters = (positions) => {
    return positions.filter(position => {
      const difficulty = getDifficultyLevel(position.title, position.description)
      const duration = getDurationEstimate(position.description)
      const partnerCount = getPartnerCount(position.title, position.description)
      const hasImages = position.images && position.images.length > 0
      const hasDescription = position.description && position.description.length > 0

      return (
        (filters.difficulty === 'all' || difficulty === filters.difficulty) &&
        (filters.duration === 'all' || duration === filters.duration) &&
        (filters.partnerCount === 'all' || partnerCount === filters.partnerCount) &&
        (filters.hasImages === 'all' || (filters.hasImages === 'yes' ? hasImages : !hasImages)) &&
        (filters.hasDescription === 'all' || (filters.hasDescription === 'yes' ? hasDescription : !hasDescription))
      )
    })
  }

  const filteredData = getFilteredData().map(category => ({
    ...category,
    positions: applyAdvancedFilters(category.positions)
  })).filter(category => category.positions.length > 0)

  // Enhanced categories with difficulty and partner count
  const getCategories = () => {
    const categories = {
      'all': { name: 'All Articles', emoji: '🌟', count: scrapedData.reduce((sum, cat) => sum + cat.positions.length, 0) },
      'favorites': { name: 'Favorites', emoji: '❤️', count: favorites.length },
      'completed': { name: 'Completed', emoji: '✅', count: completedPositions.length },
      'random': { name: 'Random', emoji: '🎲', count: 1 }
    }

    // Add unique categories from scraped data
    const uniqueCategories = [...new Set(scrapedData.map(item => item.category))]
    uniqueCategories.forEach(category => {
      if (!categories[category]) {
        const categoryArticles = scrapedData.filter(item => item.category === category)
        categories[category] = { 
          name: category, 
          emoji: '🔥', 
          count: categoryArticles.reduce((sum, cat) => sum + cat.positions.length, 0) 
        }
      }
    })
    
    return categories
  }

  const categories = getCategories()

  const openPositionModal = (position) => {
    setSelectedPosition(position)
    setShowPositionModal(true)
  }

  const openImageModal = (image) => {
    setSelectedImage(image)
    setShowImageModal(true)
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-gray-100 via-pink-100 to-indigo-100'} text-white p-6 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className={darkMode ? 'text-purple-200' : 'text-gray-700'}>Loading sex positions from Cosmopolitan...</p>
        </div>
      </div>
    )
  }

  // Fallback if no data is loaded
  if (!scrapedData || scrapedData.length === 0) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-gray-100 via-pink-100 to-indigo-100'} ${darkMode ? 'text-white' : 'text-gray-900'} p-6 flex items-center justify-center`}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Sex Positions App</h1>
          <p className={`text-lg mb-4 ${darkMode ? 'text-purple-200' : 'text-gray-700'}`}>No data available</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-gray-100 via-pink-100 to-indigo-100'} ${darkMode ? 'text-white' : 'text-gray-900'} p-6`}>
      <style>{`
        ${darkMode ? `
          select option {
            background-color: rgba(31, 41, 55, 0.95) !important;
            color: white !important;
            padding: 8px 12px !important;
          }
          select option:hover {
            background-color: rgba(168, 85, 247, 0.2) !important;
          }
          select:focus {
            outline: none !important;
            border-color: rgba(168, 85, 247, 0.5) !important;
            box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.1) !important;
          }
        ` : ''}
      `}</style>
      <div className="max-w-7xl mx-auto">
        {/* Debug Info */}
        <div className="mb-4 p-2 bg-blue-500/20 rounded text-xs">
          Debug: Data loaded: {scrapedData?.length || 0} categories, Loading: {loading.toString()}
        </div>
        {/* Header with Theme Toggle */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
              <Heart className="w-8 h-8 text-pink-400" />
              Sex Positions from Cosmopolitan
              <Heart className="w-8 h-8 text-pink-400" />
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-800/10 hover:bg-gray-800/20'} transition-colors`}
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
          <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-purple-200' : 'text-gray-700'}`}>
            Discover <strong>{scrapedData.reduce((sum, cat) => sum + cat.positions.length, 0)} real sex positions</strong> with actual images and expert tips from Cosmopolitan's comprehensive guides. 
            Each position includes detailed instructions, professional illustrations, and step-by-step "How To Do It" guides.
            <br />
            <span className="text-pink-300 font-bold">🎉 {scrapedData.reduce((sum, cat) => sum + cat.positions.length, 0)} Real Positions with 99.2% Success Rate!</span>
          </p>
          <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30 max-w-2xl mx-auto">
            <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
              <strong>Source:</strong> Content and images sourced from 
              <a href="https://www.cosmopolitan.com/sex-love/positions/" target="_blank" rel="noopener noreferrer" 
                 className="text-pink-300 hover:text-pink-200 underline ml-1">
                Cosmopolitan's Sex Positions Guide
                <ExternalLink className="inline w-3 h-3 ml-1" />
              </a>
            </p>
          </div>
        </div>

        {/* Enhanced Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4 items-center justify-center">
            <div className="relative max-w-md">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-purple-300' : 'text-gray-500'} w-5 h-5`} />
              <input
                type="text"
                placeholder="Search positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 ${darkMode ? 'bg-white/10 border-white/20 text-white placeholder-purple-300' : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
              />
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-white/80 hover:bg-white/90'} ${darkMode ? 'text-white' : 'text-gray-700'}`}
            >
              <Filter className="w-5 h-5" />
              Advanced Filters
            </button>
                          <button
                onClick={() => {
                  const randomPos = getRandomPosition()
                  if (randomPos) {
                    setSelectedPosition({ ...randomPos, positions: [randomPos] })
                    setShowPositionModal(true)
                  }
                }}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${darkMode ? 'bg-pink-500 hover:bg-pink-600' : 'bg-pink-600 hover:bg-pink-700'} text-white`}
              >
                <Shuffle className="w-5 h-5" />
                Surprise Me!
              </button>
              <button
                onClick={() => setShowTimer(!showTimer)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${darkMode ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
              >
                <Timer className="w-5 h-5" />
                Timer
              </button>
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-4 rounded-lg ${darkMode ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-300'} border`}
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-purple-200' : 'text-gray-700'}`}>Difficulty</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                    className={`w-full p-2 rounded ${darkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    style={darkMode ? {
                      backgroundColor: 'rgba(31, 41, 55, 0.9)',
                      borderColor: 'rgba(168, 85, 247, 0.2)',
                      color: 'white'
                    } : {}}
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-purple-200' : 'text-gray-700'}`}>Duration</label>
                  <select
                    value={filters.duration}
                    onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value }))}
                    className={`w-full p-2 rounded ${darkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    style={darkMode ? {
                      backgroundColor: 'rgba(31, 41, 55, 0.9)',
                      borderColor: 'rgba(168, 85, 247, 0.2)',
                      color: 'white'
                    } : {}}
                  >
                    <option value="all">Any Duration</option>
                    <option value="quick">Quick</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-purple-200' : 'text-gray-700'}`}>Partner Count</label>
                  <select
                    value={filters.partnerCount}
                    onChange={(e) => setFilters(prev => ({ ...prev, partnerCount: e.target.value }))}
                    className={`w-full p-2 rounded ${darkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    style={darkMode ? {
                      backgroundColor: 'rgba(31, 41, 55, 0.9)',
                      borderColor: 'rgba(168, 85, 247, 0.2)',
                      color: 'white'
                    } : {}}
                  >
                    <option value="all">All</option>
                    <option value="solo">Solo</option>
                    <option value="couple">Couple</option>
                    <option value="group">Group</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-purple-200' : 'text-gray-700'}`}>Has Images</label>
                  <select
                    value={filters.hasImages}
                    onChange={(e) => setFilters(prev => ({ ...prev, hasImages: e.target.value }))}
                    className={`w-full p-2 rounded ${darkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    style={darkMode ? {
                      backgroundColor: 'rgba(31, 41, 55, 0.9)',
                      borderColor: 'rgba(168, 85, 247, 0.2)',
                      color: 'white'
                    } : {}}
                  >
                    <option value="all">All</option>
                    <option value="yes">With Images</option>
                    <option value="no">Without Images</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-purple-200' : 'text-gray-700'}`}>Show Completed</label>
                  <button
                    onClick={() => setShowCompleted(!showCompleted)}
                    className={`w-full p-2 rounded font-medium transition-all ${showCompleted ? 'bg-green-500 text-white' : darkMode ? 'bg-white/10 text-white' : 'bg-white text-gray-900'}`}
                  >
                    {showCompleted ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Enhanced Category Filter */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeCategory === key
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : darkMode ? 'text-purple-200 hover:text-white hover:bg-white/10' : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'
                }`}
              >
                <span className="text-lg">{category.emoji}</span>
                {category.name}
                <span className={`text-xs px-2 py-1 rounded-full ${activeCategory === key ? 'bg-white/20' : darkMode ? 'bg-white/20' : 'bg-gray-200'}`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className={darkMode ? 'text-purple-200' : 'text-gray-700'}>
            Showing <strong>{filteredData.reduce((sum, cat) => sum + cat.positions.length, 0)}</strong> of <strong>{scrapedData.reduce((sum, cat) => sum + cat.positions.length, 0)}</strong> positions
          </p>
        </div>

        {/* Enhanced Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((category, index) => (
            <motion.div
              key={`${category.category}-${category.title}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`${darkMode ? 'bg-white/10 backdrop-blur-sm border-white/20' : 'bg-white/90 backdrop-blur-sm border-gray-200'} rounded-xl p-6 border`}
            >
              {/* Category Image - Use diverse images from positions */}
              <div className="relative mb-4">
                {(() => {
                  // Get a diverse image from the positions in this category
                  const allImages = category.positions
                    .filter(pos => pos.images && pos.images.length > 0)
                    .flatMap(pos => pos.images)
                    .filter(img => img.src && !img.src.includes('logo') && !img.src.includes('ad'))
                  
                  const imageCount = allImages.length
                  const displayImage = allImages[0] || null
                  
                  return (
                    <>
                      {displayImage ? (
                        <img
                          src={displayImage.src}
                          alt={displayImage.alt || category.title}
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      {/* Fallback gradient if no image */}
                      <div 
                        className={`w-full h-48 rounded-lg ${displayImage ? 'hidden' : 'block'}`}
                        style={{
                          background: `linear-gradient(135deg, 
                            hsl(${Math.random() * 360}, 70%, 60%), 
                            hsl(${(Math.random() * 360 + 180) % 360}, 70%, 60%))`
                        }}
                      >
                        <div className="flex items-center justify-center h-full">
                          <span className="text-4xl">{categories[category.category]?.emoji || '💫'}</span>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/50 rounded-full p-2">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute bottom-2 left-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 rounded text-xs font-medium">
                        {category.positions.length} Positions
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/50 rounded-full px-2 py-1 text-xs text-white">
                        {imageCount} Images
                      </div>
                    </>
                  )
                })()}
              </div>

                              {/* Enhanced Category Info */}
                <div className="space-y-3">
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{category.title}</h3>
                  <p className={`text-sm ${darkMode ? 'text-purple-200' : 'text-gray-600'}`}>{category.description}</p>
                  
                  {/* Article Titles */}
                  <div className="space-y-1">
                    {category.articles && category.articles.slice(0, 2).map((article, index) => (
                      <div key={index} className={`text-xs ${darkMode ? 'text-purple-300' : 'text-gray-500'}`}>
                        • {article.title}
                      </div>
                    ))}
                    {category.articles && category.articles.length > 2 && (
                      <div className={`text-xs ${darkMode ? 'text-purple-400' : 'text-gray-400'}`}>
                        +{category.articles.length - 2} more articles
                      </div>
                    )}
                  </div>

                {/* Enhanced Sample Positions with Content */}
                <div className="space-y-3">
                  {category.positions.slice(0, 2).map((position) => {
                    const positionId = `${category.category}-${category.title}-${position.number}-${position.title}`
                    const isFavorite = favorites.includes(positionId)
                    const isCompleted = completedPositions.includes(positionId)
                    const difficulty = getDifficultyLevel(position.title, position.description)
                    const duration = getDurationEstimate(position.description)
                    const partnerCount = getPartnerCount(position.title, position.description)
                    
                    return (
                      <div key={`${category.originalUrl}-${position.number}-${position.title}`} className={`${darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'} rounded-lg p-3 border`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-pink-400 font-bold text-sm">{position.number}.</span>
                            <span className={`text-sm font-medium line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{position.title}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => toggleFavorite(positionId)}
                              className={`p-1 rounded transition-colors ${isFavorite ? 'text-red-400' : darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-400'}`}
                            >
                              {isFavorite ? <Bookmark className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => toggleCompleted(positionId)}
                              className={`p-1 rounded transition-colors ${isCompleted ? 'text-green-400' : darkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-400'}`}
                            >
                              {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        
                        {/* Position Metadata */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                            difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {difficulty}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            duration === 'quick' ? 'bg-blue-500/20 text-blue-400' :
                            duration === 'medium' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {duration}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            partnerCount === 'solo' ? 'bg-gray-500/20 text-gray-400' :
                            partnerCount === 'couple' ? 'bg-pink-500/20 text-pink-400' :
                            'bg-purple-500/20 text-purple-400'
                          }`}>
                            {partnerCount === 'solo' ? <User className="w-3 h-3 inline mr-1" /> :
                             <Users className="w-3 h-3 inline mr-1" />}
                            {partnerCount}
                          </span>
                        </div>
                        
                        {/* Position Image */}
                        {position.images && position.images.length > 0 && (
                          <div className="mb-3">
                            <img
                              src={position.images[0].src}
                              alt={position.images[0].alt || position.title}
                              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => openImageModal(position.images[0])}
                                                          onError={(e) => {
                              e.target.style.display = 'none';
                              console.warn('Image failed to load:', position.images[0].src);
                            }}
                            />
                          </div>
                        )}
                        
                        {/* Description */}
                        {position.description && (
                          <div className="mb-2">
                            <div className="flex items-center gap-1 mb-1">
                              <Info className={`w-3 h-3 ${darkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                              <span className={`text-xs font-medium ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>Description</span>
                            </div>
                            <p className={`text-xs line-clamp-2 ${darkMode ? 'text-purple-200' : 'text-gray-600'}`}>{position.description}</p>
                          </div>
                        )}
                        
                        {/* How To Do It */}
                        {position.howToDoIt && (
                          <div>
                            <div className="flex items-center gap-1 mb-1">
                              <Play className={`w-3 h-3 ${darkMode ? 'text-pink-300' : 'text-pink-600'}`} />
                              <span className={`text-xs font-medium ${darkMode ? 'text-pink-300' : 'text-pink-600'}`}>How To Do It</span>
                            </div>
                            <p className={`text-xs line-clamp-2 ${darkMode ? 'text-purple-200' : 'text-gray-600'}`}>{position.howToDoIt}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                  
                  {category.positions.length > 2 && (
                    <div className={`text-xs text-center ${darkMode ? 'text-purple-300' : 'text-gray-500'}`}>
                      +{category.positions.length - 2} more positions with full details
                    </div>
                  )}
                </div>

                {/* Enhanced View Details Button */}
                <button 
                  className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                  onClick={() => openPositionModal(category)}
                >
                  <BookOpen className="w-4 h-4" />
                  View All Positions
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                {/* Quick Stats */}
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className={`${darkMode ? 'text-purple-300' : 'text-gray-500'}`}>
                    {category.positions.filter(pos => {
                      const posId = `${category.category}-${category.title}-${pos.number}-${pos.title}`
                      return favorites.includes(posId)
                    }).length} favorited
                  </span>
                  <span className={`${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                    {category.positions.filter(pos => {
                      const posId = `${category.category}-${category.title}-${pos.number}-${pos.title}`
                      return completedPositions.includes(posId)
                    }).length} completed
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced No Results */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Search className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-purple-300' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No positions found</h3>
            <p className={darkMode ? 'text-purple-200' : 'text-gray-600'}>Try adjusting your search or category filter</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setFilters({
                  difficulty: 'all',
                  duration: 'all',
                  partnerCount: 'all',
                  hasImages: 'all',
                  hasDescription: 'all'
                })
                setActiveCategory('all')
              }}
              className="mt-4 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Enhanced Position Modal */}
        {showPositionModal && selectedPosition && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`${darkMode ? 'bg-gradient-to-br from-purple-900 to-pink-900' : 'bg-white'} rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar`}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">{selectedPosition.title}</h2>
                  <p className="text-purple-200 mb-2">{selectedPosition.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-purple-500/30 rounded-full text-sm text-purple-200">
                      {selectedPosition.positions.length} Positions
                    </span>
                    <a 
                      href={selectedPosition.originalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-pink-300 hover:text-pink-200 text-sm"
                    >
                      View Original Article
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => setShowPositionModal(false)}
                  className="text-white hover:text-pink-400 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Position Images Gallery */}
              {selectedPosition.images.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">Position Illustrations</h3>
                    <button
                      onClick={() => setShowIllustrations(!showIllustrations)}
                      className="flex items-center gap-2 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-purple-200 transition-colors"
                    >
                      <Eye className={`w-4 h-4 ${showIllustrations ? 'text-green-400' : 'text-gray-400'}`} />
                      {showIllustrations ? 'Hide' : 'Show'} Illustrations
                    </button>
                  </div>
                  {showIllustrations && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {selectedPosition.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.src}
                            alt={image.alt || `Position illustration ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openImageModal(image)}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              console.log('Modal image failed to load:', image.src);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Individual Positions */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white">All Positions in {selectedPosition.category}</h3>
                
                {/* Show articles if this is a category view */}
                {selectedPosition.articles && selectedPosition.articles.length > 1 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-white mb-3">Articles in this category:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedPosition.articles.map((article, index) => (
                        <div key={index} className="bg-white/10 rounded-lg p-3 border border-white/20">
                          <h5 className="font-medium text-white mb-1">{article.title}</h5>
                          <p className="text-purple-200 text-sm">{article.positions.length} positions</p>
                          <a 
                            href={article.originalUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-pink-300 hover:text-pink-200 text-xs flex items-center gap-1 mt-2"
                          >
                            View Original Article
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedPosition.positions.map((position) => {
                    const positionId = `${selectedPosition.category}-${selectedPosition.title}-${position.number}-${position.title}`
                    const isFavorite = favorites.includes(positionId)
                    const isCompleted = completedPositions.includes(positionId)
                    
                    return (
                    <div key={`${selectedPosition.originalUrl}-${position.number}-${position.title}`} className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl font-bold text-pink-400 bg-pink-400/20 rounded-full w-8 h-8 flex items-center justify-center">
                            {position.number}
                          </span>
                          <h4 className="text-lg font-semibold text-white">{position.title}</h4>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleFavorite(positionId)}
                            className={`p-2 rounded-lg transition-colors ${
                              isFavorite 
                                ? 'bg-pink-500/20 text-pink-400' 
                                : 'bg-white/10 text-gray-400 hover:text-pink-400 hover:bg-pink-500/10'
                            }`}
                          >
                            <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => toggleCompleted(positionId)}
                            className={`p-2 rounded-lg transition-colors ${
                              isCompleted 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-white/10 text-gray-400 hover:text-green-400 hover:bg-green-500/10'
                            }`}
                          >
                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      
                      {/* Position Image */}
                      {position.images && position.images.length > 0 && (
                        <div className="mb-4">
                          <img
                            src={position.images[0].src}
                            alt={position.images[0].alt || position.title}
                            className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openImageModal(position.images[0])}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              console.log('Position image failed to load:', position.images[0].src);
                            }}
                          />
                        </div>
                      )}
                      
                      {position.description && (
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Info className="w-4 h-4 text-purple-300" />
                            <span className="text-sm font-medium text-purple-300">Description</span>
                          </div>
                          <p className="text-purple-200 text-sm">{position.description}</p>
                        </div>
                      )}
                      
                      {position.howToDoIt && (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Play className="w-4 h-4 text-pink-300" />
                            <span className="text-sm font-medium text-pink-300">How To Do It</span>
                          </div>
                          <p className="text-purple-200 text-sm">{position.howToDoIt}</p>
                        </div>
                      )}
                    </div>
                  )
                  })}
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-6 p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                <p className="text-yellow-200 text-sm">
                  <strong>Important:</strong> Always practice safe sex, communicate openly with your partner, 
                  and respect each other's boundaries. This content is for educational purposes only and is sourced from 
                  Cosmopolitan's expert guides. Consult with healthcare professionals for personalized advice.
                </p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Image Modal */}
        {showImageModal && selectedImage && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowImageModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image */}
              <img
                src={selectedImage.src}
                alt={selectedImage.alt || 'Expanded position image'}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  console.log('Expanded image failed to load:', selectedImage.src);
                }}
              />

              {/* Image Info */}
              {selectedImage.alt && (
                <div className="mt-4 p-4 bg-white/10 rounded-lg">
                  <p className="text-white text-center">{selectedImage.alt}</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
        
        {/* Position Timer */}
        {showTimer && (
          <PositionTimer onClose={() => setShowTimer(false)} />
        )}
      </div>
    </div>
  )
}

export default SexPositions
