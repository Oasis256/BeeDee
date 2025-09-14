import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  BarChart3, 
  Users, 
  Heart, 
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const MobileNavigation = ({ 
  tabGroups, 
  activeTab, 
  activeSubTab, 
  onNavigate,
  isMobile = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedTab, setExpandedTab] = useState(null);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [isMobileState, setIsMobile] = useState(false);

  if (!isMobileState) return null;

  const toggleTab = (tabKey) => {
    if (expandedTab === tabKey) {
      setExpandedTab(null);
    } else {
      setExpandedTab(tabKey);
    }
  };

  const handleSubTabClick = (tabKey, subTabKey) => {
    onNavigate(tabKey, subTabKey);
    setIsOpen(false);
    setExpandedTab(null);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 w-12 h-12 bg-purple-600 rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Navigation Panel */}
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="fixed left-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-sm z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-lg">BeeDee</h1>
                    <p className="text-purple-200 text-sm">BDSM Exploration</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  {Object.entries(tabGroups).map(([tabKey, tabConfig]) => (
                    <div key={tabKey}>
                      {/* Main Tab */}
                      <motion.button
                        onClick={() => toggleTab(tabKey)}
                        className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
                          activeTab === tabKey
                            ? `bg-gradient-to-r ${tabConfig.color} text-white shadow-lg`
                            : 'text-purple-200 hover:text-white hover:bg-white/10'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          {tabConfig.icon}
                          <span className="font-medium">{tabConfig.name}</span>
                        </div>
                        {expandedTab === tabKey ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </motion.button>

                      {/* Sub Tabs */}
                      <AnimatePresence>
                        {expandedTab === tabKey && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="ml-4 mt-2 space-y-1"
                          >
                            {Object.entries(tabConfig.subTabs).map(([subTabKey, subTabConfig]) => (
                              <motion.button
                                key={subTabKey}
                                onClick={() => handleSubTabClick(tabKey, subTabKey)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-sm ${
                                  activeSubTab === subTabKey
                                    ? 'bg-white/20 text-white'
                                    : 'text-purple-300 hover:text-white hover:bg-white/10'
                                }`}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {subTabConfig.icon}
                                <span>{subTabConfig.name}</span>
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </nav>

                {/* Mobile Footer */}
                <div className="mt-8 pt-6 border-t border-white/10">
                  <div className="text-center">
                    <p className="text-purple-200 text-xs">
                      Made with ❤️ for exploration
                    </p>
                    <p className="text-purple-300 text-xs mt-1">
                      Communication, consent, and safety are key
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom Navigation for Mobile */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-white/10 z-40"
      >
        <div className="flex justify-around py-2">
          {Object.entries(tabGroups).map(([tabKey, tabConfig]) => (
            <motion.button
              key={tabKey}
              onClick={() => onNavigate(tabKey, Object.keys(tabConfig.subTabs)[0])}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                activeTab === tabKey
                  ? 'text-white'
                  : 'text-purple-300 hover:text-white'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                activeTab === tabKey
                  ? `bg-gradient-to-r ${tabConfig.color}`
                  : 'bg-white/10'
              }`}>
                {tabConfig.icon}
              </div>
              <span className="text-xs font-medium">{tabConfig.name.split(' ')[0]}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default MobileNavigation;
