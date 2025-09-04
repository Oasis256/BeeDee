import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Heart, Star, Eye, X, Filter, Clock, User, Moon, Sun, Bookmark, CheckCircle, Circle } from 'lucide-react'

const SimpleSexPositions = () => {
  const [selectedPosition, setSelectedPosition] = useState(null)
  const [showPositionModal, setShowPositionModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showImageModal, setShowImageModal] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [scrapedData, setScrapedData] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const [favorites, setFavorites] = useState([])

  // Load user preferences from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('sexPositionsFavorites')
    const savedDarkMode = localStorage.getItem('sexPositionsDarkMode')
    
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites))
    if (savedDarkMode !== null) setDarkMode(JSON.parse(savedDarkMode))
  }, [])

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('sexPositionsFavorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('sexPositionsDarkMode', JSON.stringify(darkMode))
  }, [darkMode])

  // Load scraped data
  useEffect(() => {
    const loadScrapedData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Starting to load data...');
        
        const response = await fetch('/all-sex-positions.json');
        console.log('📡 Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Loaded positions:', data.length, 'categories');
          setScrapedData(data);
        } else {
          console.error('❌ Failed to load positions, using fallback data');
          setScrapedData([]);
        }
      } catch (error) {
        console.error('❌ Error loading data:', error);
        setScrapedData([]);
      } finally {
        setLoading(false);
        console.log('🏁 Finished loading data');
      }
    };

    loadScrapedData();
  }, []);

  const toggleFavorite = (positionId) => {
    setFavorites(prev => 
      prev.includes(positionId) 
        ? prev.filter(id => id !== positionId)
        : [...prev, positionId]
    )
  }

  const openPositionModal = (category) => {
    setSelectedPosition(category)
    setShowPositionModal(true)
  }

  const openImageModal = (image) => {
    setSelectedImage(image)
    setShowImageModal(true)
  }

  const getCategories = () => {
    const categories = ['all', 'favorites']
    const uniqueCategories = [...new Set(scrapedData.map(item => item.category))]
    return [...categories, ...uniqueCategories]
  }

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
    } else if (activeCategory !== 'all') {
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

  const filteredData = getFilteredData()

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-gray-100 via-pink-100 to-indigo-100'} text-white p-6 flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className={darkMode ? 'text-purple-200' : 'text-gray-700'}>Loading sex positions...</p>
        </div>
      </div>
    )
  }

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
      <div className="max-w-7xl mx-auto">
        {/* Debug Info */}
        <div className="mb-4 p-2 bg-blue-500/20 rounded text-xs">
          Debug: Data loaded: {scrapedData?.length || 0} categories, Loading: {loading.toString()}
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">Sex Positions</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-white/10' : 'bg-gray-800/10'} transition-colors`}
            >
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-purple-300' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                darkMode 
                  ? 'bg-white/10 border-purple-300/30 text-white placeholder-purple-200' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-pink-500`}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {getCategories().map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? 'bg-pink-500 text-white'
                    : darkMode 
                      ? 'bg-white/10 text-purple-200 hover:bg-white/20' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category === 'all' ? 'All Positions' : 
                 category === 'favorites' ? 'Favorites' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className={`mb-6 text-sm ${darkMode ? 'text-purple-200' : 'text-gray-600'}`}>
          Found {filteredData.length} categories with positions
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((category, index) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl p-6 ${
                darkMode 
                  ? 'bg-white/10 backdrop-blur-sm border border-white/20' 
                  : 'bg-white shadow-lg border border-gray-200'
              }`}
            >
              <h3 className="text-xl font-bold mb-4">{category.title}</h3>
              
              <div className="space-y-3">
                {category.positions.slice(0, 2).map((position) => {
                  const positionId = `${category.category}-${category.title}-${position.number}-${position.title}`
                  const isFavorited = favorites.includes(positionId)
                  
                  return (
                    <div key={`${category.originalUrl}-${position.number}-${position.title}`} className={`p-3 rounded-lg ${
                      darkMode ? 'bg-white/5' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{position.title}</h4>
                        <button
                          onClick={() => toggleFavorite(positionId)}
                          className={`p-1 rounded transition-colors ${
                            isFavorited 
                              ? 'text-pink-500' 
                              : darkMode ? 'text-purple-300 hover:text-pink-400' : 'text-gray-400 hover:text-pink-500'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      
                      {position.images && position.images.length > 0 && (
                        <div className="mb-3">
                          <img
                            src={position.images[0].src}
                            alt={position.images[0].alt || position.title}
                            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openImageModal(position.images[0])}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              console.warn('Image failed to load:', position.images[0].src);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              <button 
                className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all"
                onClick={() => openPositionModal(category)}
              >
                View All Positions
              </button>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Search className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-purple-300' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>No positions found</h3>
            <p className={darkMode ? 'text-purple-200' : 'text-gray-600'}>Try adjusting your search or category filter</p>
          </div>
        )}
      </div>

      {/* Position Modal */}
      {showPositionModal && selectedPosition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{selectedPosition.title}</h2>
              <button
                onClick={() => setShowPositionModal(false)}
                className="p-2 hover:bg-gray-200 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {selectedPosition.positions.map((position) => {
                const positionId = `${selectedPosition.category}-${selectedPosition.title}-${position.number}-${position.title}`
                const isFavorited = favorites.includes(positionId)
                
                return (
                  <div key={`${selectedPosition.originalUrl}-${position.number}-${position.title}`} className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold">{position.title}</h3>
                      <button
                        onClick={() => toggleFavorite(positionId)}
                        className={`p-1 rounded transition-colors ${
                          isFavorited ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
                        }`}
                      >
                        <Bookmark className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    
                    {position.description && (
                      <p className="mb-3 text-sm">{position.description}</p>
                    )}
                    
                    {position.images && position.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {position.images.map((image, idx) => (
                          <img
                            key={idx}
                            src={image.src}
                            alt={image.alt || position.title}
                            className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => openImageModal(image)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt || 'Position image'}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default SimpleSexPositions
