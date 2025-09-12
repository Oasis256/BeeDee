import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Shield, 
  Users, 
  MessageCircle, 
  BookOpen, 
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

const AftercareGuides = () => {
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedGuide, setExpandedGuide] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    loadAftercareGuides();
  }, []);

  useEffect(() => {
    filterGuides();
  }, [guides, searchTerm, selectedCategory]);

  const loadAftercareGuides = async () => {
    try {
      const response = await fetch('/aftercare-guides.json');
      const data = await response.json();
      
      if (data.guides && data.guides.length > 0) {
        // Filter out guides with minimal content
        const validGuides = data.guides.filter(guide => 
          guide.wordCount > 100 && guide.content.length > 200
        );
        setGuides(validGuides);
      }
    } catch (error) {
      console.error('Error loading aftercare guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterGuides = () => {
    let filtered = guides;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(guide =>
        guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.keyTopics?.some(topic => 
          topic.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(guide =>
        guide.category === selectedCategory ||
        guide.keyTopics?.includes(selectedCategory)
      );
    }

    setFilteredGuides(filtered);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'physical_care': return <Shield className="w-4 h-4" />;
      case 'emotional_support': return <Heart className="w-4 h-4" />;
      case 'comprehensive': return <BookOpen className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'physical_care': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'emotional_support': return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'comprehensive': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories', icon: <Filter className="w-4 h-4" /> },
    { value: 'physical_care', label: 'Physical Care', icon: <Shield className="w-4 h-4" /> },
    { value: 'emotional_support', label: 'Emotional Support', icon: <Heart className="w-4 h-4" /> },
    { value: 'comprehensive', label: 'Comprehensive', icon: <BookOpen className="w-4 h-4" /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-800 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400"></div>
            <span className="ml-4 text-purple-200">Loading aftercare guides...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Heart className="w-10 h-10 text-pink-400" />
            BDSM Aftercare Guides
          </h1>
          <p className="text-purple-200 text-lg max-w-3xl mx-auto">
            Essential resources for post-scene care, emotional support, and maintaining healthy BDSM relationships
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search aftercare guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-purple-900/50 border border-purple-500/50 rounded-lg pl-10 pr-4 py-3 text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-purple-900/50 border border-purple-500/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                style={{
                  colorScheme: 'dark',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem'
                }}
              >
                {categories.map(category => (
                  <option 
                    key={category.value} 
                    value={category.value}
                    style={{ backgroundColor: '#581c87', color: 'white', padding: '8px' }}
                  >
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-purple-200">
            Found {filteredGuides.length} aftercare guide{filteredGuides.length !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Guides List */}
        <div className="space-y-6">
          {filteredGuides.map((guide, index) => (
            <motion.div
              key={guide.url}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden"
            >
              {/* Guide Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {guide.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-purple-200 mb-3">
                      <span className="flex items-center gap-1">
                        {getCategoryIcon(guide.category)}
                        {guide.source}
                      </span>
                      <span>{guide.wordCount} words</span>
                      <span>{guide.sections.length} sections</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(guide.content, guide.url)}
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      title="Copy content"
                    >
                      {copiedId === guide.url ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-purple-300" />
                      )}
                    </button>
                    <a
                      href={guide.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      title="Open original"
                    >
                      <ExternalLink className="w-4 h-4 text-purple-300" />
                    </a>
                  </div>
                </div>

                {/* Categories and Topics */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs border ${getCategoryColor(guide.category)}`}>
                    {guide.category.replace('_', ' ')}
                  </span>
                  {guide.keyTopics?.slice(0, 5).map((topic, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs border border-pink-500/30"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Content Preview */}
                <div className="text-purple-200 leading-relaxed">
                  {expandedGuide === guide.url ? (
                    <div>
                      <p className="mb-4">{guide.content}</p>
                      
                      {/* Sections */}
                      {guide.sections.length > 0 && (
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold text-white mb-3">Sections:</h3>
                          <div className="space-y-3">
                            {guide.sections.map((section, idx) => (
                              <div key={idx} className="bg-white/5 rounded-lg p-4">
                                <h4 className="font-medium text-white mb-2">
                                  {section.title}
                                </h4>
                                <p className="text-purple-200 text-sm">
                                  {section.content.substring(0, 200)}
                                  {section.content.length > 200 && '...'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tips */}
                      {guide.tips.length > 0 && (
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold text-white mb-3">Tips & Lists:</h3>
                          <div className="space-y-3">
                            {guide.tips.map((tip, idx) => (
                              <div key={idx} className="bg-white/5 rounded-lg p-4">
                                <ul className="space-y-1">
                                  {tip.items.slice(0, 5).map((item, itemIdx) => (
                                    <li key={itemIdx} className="text-purple-200 text-sm flex items-start gap-2">
                                      <span className="text-pink-400 mt-1">•</span>
                                      {item}
                                    </li>
                                  ))}
                                  {tip.items.length > 5 && (
                                    <li className="text-purple-300 text-xs italic">
                                      ... and {tip.items.length - 5} more items
                                    </li>
                                  )}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p>
                      {guide.content.substring(0, 300)}
                      {guide.content.length > 300 && '...'}
                    </p>
                  )}
                </div>

                {/* Expand/Collapse Button */}
                <button
                  onClick={() => setExpandedGuide(
                    expandedGuide === guide.url ? null : guide.url
                  )}
                  className="mt-4 flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
                >
                  {expandedGuide === guide.url ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Show More
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredGuides.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <MessageCircle className="w-16 h-16 text-purple-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No guides found</h3>
            <p className="text-purple-200">
              Try adjusting your search terms or category filter
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AftercareGuides;
