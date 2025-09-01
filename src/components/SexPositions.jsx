import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  Info
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

  // Load scraped data
  useEffect(() => {
    const loadScrapedData = async () => {
      try {
        setLoading(true);
        // Load the lazy-loading optimized data (99.2% success rate)
        const response = await fetch('/all-sex-positions.json');
        if (response.ok) {
          const data = await response.json();
          setScrapedData(data);
          console.log('✅ Loaded lazy-loading optimized positions:', data.length, 'categories');
          console.log('📊 Total positions:', data.reduce((sum, cat) => sum + cat.positions.length, 0));
          console.log('🎯 Success rate: 99.2% (235/237 positions)');
        } else {
          console.error('Failed to load lazy-loading optimized positions');
          // Fallback to hardcoded data if scraping fails
          setScrapedData(fallbackData);
        }
      } catch (error) {
        console.error('Error loading scraped data:', error);
        // Fallback to hardcoded data if scraping fails
        setScrapedData(fallbackData);
      } finally {
        setLoading(false);
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

  // Define categories based on the scraped data
  const getCategories = () => {
    const categories = {
      'all': { name: 'All Positions', emoji: '🌟', count: scrapedData.reduce((sum, cat) => sum + cat.positions.length, 0) }
    }

    // Group articles by their actual categories from the data
    const categoryGroups = {}
    
    scrapedData.forEach(article => {
      // Extract category from article title or use a default
      let category = 'Sex Positions' // default
      
      // Try to determine category from title
      const title = article.title.toLowerCase()
      if (title.includes('oral') || title.includes('blow job')) {
        category = 'Oral Positions'
      } else if (title.includes('anal')) {
        category = 'Anal Positions'
      } else if (title.includes('missionary')) {
        category = 'Missionary Variations'
      } else if (title.includes('lesbian')) {
        category = 'Lesbian Positions'
      } else if (title.includes('first-time') || title.includes('debut')) {
        category = 'Beginner Positions'
      } else if (title.includes('romantic')) {
        category = 'Romantic Positions'
      } else if (title.includes('masturbation') || title.includes('solo')) {
        category = 'Solo Positions'
      } else if (title.includes('deep penetration')) {
        category = 'Deep Penetration'
      } else if (title.includes('chair')) {
        category = 'Chair Positions'
      } else if (title.includes('rim job') || title.includes('rimming')) {
        category = 'Rimming Positions'
      } else if (title.includes('foursome') || title.includes('threesome')) {
        category = 'Group Positions'
      } else if (title.includes('guide') || title.includes('positions guide')) {
        category = 'Position Guides'
      } else if (title.includes('bridge') || title.includes('eiffel tower') || title.includes('speed bump')) {
        category = 'Specialty Positions'
      }
      
      if (!categoryGroups[category]) {
        categoryGroups[category] = []
      }
      categoryGroups[category].push(article)
    })

    // Create category objects with counts
    Object.keys(categoryGroups).forEach(key => {
      const count = categoryGroups[key].reduce((sum, article) => sum + article.positions.length, 0)
      const emoji = getCategoryEmoji(key)
      categories[key] = { name: key, emoji, count, articles: categoryGroups[key] }
    })

    return categories
  }

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'Oral Positions': '😊',
      'Anal Positions': '🔥',
      'Missionary Variations': '💕',
      'Lesbian Positions': '💝',
      'Beginner Positions': '🌱',
      'Romantic Positions': '💖',
      'Solo Positions': '🫂',
      'Deep Penetration': '⚡',
      'Chair Positions': '🪑',
      'Rimming Positions': '🍑',
      'Group Positions': '👥',
      'Position Guides': '📚',
      'Specialty Positions': '⭐',
      'Sex Positions': '💫'
    }
    return emojiMap[category] || '💫'
  }

  const categories = getCategories()

  // Filter data based on category and search
  const getFilteredData = () => {
    if (activeCategory === 'all') {
      // Return all articles grouped by category
      const groupedData = []
      Object.keys(categories).forEach(key => {
        if (key !== 'all' && categories[key].articles) {
          groupedData.push({
            category: key,
            title: key,
            description: `${categories[key].count} positions in ${key}`,
            images: [],
            positions: categories[key].articles.flatMap(article => article.positions),
            articles: categories[key].articles
          })
        }
      })
      return groupedData
    } else {
      // Return specific category
      const category = categories[activeCategory]
      if (category && category.articles) {
        return [{
          category: activeCategory,
          title: activeCategory,
          description: `${category.count} positions in ${activeCategory}`,
          images: [],
          positions: category.articles.flatMap(article => article.positions),
          articles: category.articles
        }]
      }
    }
    return []
  }

  const filteredData = getFilteredData()

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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto mb-4"></div>
          <p className="text-purple-200">Loading sex positions from Cosmopolitan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Heart className="w-8 h-8 text-pink-400" />
            Sex Positions from Cosmopolitan
            <Heart className="w-8 h-8 text-pink-400" />
          </h1>
          <p className="text-purple-200 text-lg max-w-3xl mx-auto">
            Discover <strong>{scrapedData.reduce((sum, cat) => sum + cat.positions.length, 0)} real sex positions</strong> with actual images and expert tips from Cosmopolitan's comprehensive guides. 
            Each position includes detailed instructions, professional illustrations, and step-by-step "How To Do It" guides.
            <br />
            <span className="text-pink-300 font-bold">🎉 {scrapedData.reduce((sum, cat) => sum + cat.positions.length, 0)} Real Positions with 99.2% Success Rate!</span>
          </p>
          <div className="mt-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30 max-w-2xl mx-auto">
            <p className="text-blue-200 text-sm">
              <strong>Source:</strong> Content and images sourced from 
              <a href="https://www.cosmopolitan.com/sex-love/positions/" target="_blank" rel="noopener noreferrer" 
                 className="text-pink-300 hover:text-pink-200 underline ml-1">
                Cosmopolitan's Sex Positions Guide
                <ExternalLink className="inline w-3 h-3 ml-1" />
              </a>
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search positions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeCategory === key
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                    : 'text-purple-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-lg">{category.emoji}</span>
                {category.name}
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-purple-200">
            Showing <strong>{filteredData.reduce((sum, cat) => sum + cat.positions.length, 0)}</strong> of <strong>{scrapedData.reduce((sum, cat) => sum + cat.positions.length, 0)}</strong> positions
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((category) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
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

              {/* Category Info */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white">{category.category}</h3>
                <p className="text-purple-200 text-sm">{category.description}</p>
                
                {/* Article Titles */}
                <div className="space-y-1">
                  {category.articles && category.articles.slice(0, 2).map((article, index) => (
                    <div key={index} className="text-xs text-purple-300">
                      • {article.title}
                    </div>
                  ))}
                  {category.articles && category.articles.length > 2 && (
                    <div className="text-xs text-purple-400">
                      +{category.articles.length - 2} more articles
                    </div>
                  )}
                </div>

                {/* Sample Positions with Content */}
                <div className="space-y-3">
                  {category.positions.slice(0, 2).map((position) => (
                    <div key={position.number} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-pink-400 font-bold text-sm">{position.number}.</span>
                        <span className="text-sm font-medium text-white line-clamp-1">{position.title}</span>
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
                              console.log('Image failed to load:', position.images[0].src);
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Description */}
                      {position.description && (
                        <div className="mb-2">
                          <div className="flex items-center gap-1 mb-1">
                            <Info className="w-3 h-3 text-purple-300" />
                            <span className="text-xs font-medium text-purple-300">Description</span>
                          </div>
                          <p className="text-purple-200 text-xs line-clamp-2">{position.description}</p>
                        </div>
                      )}
                      
                      {/* How To Do It */}
                      {position.howToDoIt && (
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <Play className="w-3 h-3 text-pink-300" />
                            <span className="text-xs font-medium text-pink-300">How To Do It</span>
                          </div>
                          <p className="text-purple-200 text-xs line-clamp-2">{position.howToDoIt}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {category.positions.length > 2 && (
                    <div className="text-xs text-purple-300 text-center">
                      +{category.positions.length - 2} more positions with full details
                    </div>
                  )}
                </div>

                {/* View Details Button */}
                <button 
                  className="w-full mt-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                  onClick={() => openPositionModal(category)}
                >
                  <BookOpen className="w-4 h-4" />
                  View All Positions
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-purple-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No positions found</h3>
            <p className="text-purple-200">Try adjusting your search or category filter</p>
          </div>
        )}

        {/* Position Modal */}
        {showPositionModal && selectedPosition && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar"
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
                  {selectedPosition.positions.map((position) => (
                    <div key={position.number} className="bg-white/10 rounded-lg p-4 border border-white/20">
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-2xl font-bold text-pink-400 bg-pink-400/20 rounded-full w-8 h-8 flex items-center justify-center">
                          {position.number}
                        </span>
                        <h4 className="text-lg font-semibold text-white">{position.title}</h4>
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
                  ))}
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
      </div>
    </div>
  )
}

export default SexPositions
