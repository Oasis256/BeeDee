import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  FileText, 
  MessageCircle, 
  Zap, 
  X,
  Heart,
  Shield,
  BarChart3,
  Users
} from 'lucide-react';

const QuickAccess = ({ 
  results, 
  onNavigate, 
  beginnerMode = false,
  currentTab = 'results',
  currentSubTab = 'overview'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Quick actions based on current state
  const getQuickActions = () => {
    const actions = [];

    // If no results, suggest taking the test
    if (results.length === 0) {
      actions.push({
        id: 'take-test',
        label: 'Take BDSM Test',
        icon: <FileText className="w-5 h-5" />,
        color: 'from-green-500 to-emerald-500',
        action: () => onNavigate('safety', 'test'),
        priority: 'high'
      });
    }

    // If results exist, suggest exploring
    if (results.length > 0) {
      actions.push({
        id: 'explore-scenarios',
        label: 'Explore Scenarios',
        icon: <Zap className="w-5 h-5" />,
        color: 'from-purple-500 to-pink-500',
        action: () => onNavigate('exploration', 'scenarios'),
        priority: 'high'
      });

      actions.push({
        id: 'view-results',
        label: 'View Results',
        icon: <BarChart3 className="w-5 h-5" />,
        color: 'from-blue-500 to-cyan-500',
        action: () => onNavigate('results', 'overview'),
        priority: 'medium'
      });
    }

    // Always suggest communication
    actions.push({
      id: 'communicate',
      label: 'Check-in',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'from-pink-500 to-rose-500',
      action: () => onNavigate('couple', 'communication'),
      priority: 'medium'
    });

    // Beginner mode suggestions
    if (beginnerMode) {
      actions.push({
        id: 'safety-guide',
        label: 'Safety Guide',
        icon: <Shield className="w-5 h-5" />,
        color: 'from-green-500 to-emerald-500',
        action: () => onNavigate('safety', 'aftercare'),
        priority: 'high'
      });
    }

    return actions.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const quickActions = getQuickActions();

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bottom-16 right-0 mb-2 space-y-2"
            >
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    action.action();
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-all whitespace-nowrap bg-gradient-to-r ${action.color}`}
                >
                  {action.icon}
                  {action.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center ${
            isOpen 
              ? 'bg-gradient-to-r from-red-500 to-pink-500' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Plus className="w-6 h-6 text-white" />
          )}
        </motion.button>
      </motion.div>

      {/* Smart Suggestions Banner */}
      {showSuggestions && results.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-30 max-w-md mx-4"
        >
          <div className="bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-5 h-5 text-white" />
              <h3 className="text-white font-semibold">Ready to Start?</h3>
              <button
                onClick={() => setShowSuggestions(false)}
                className="ml-auto text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-white/90 text-sm mb-3">
              Take the BDSM compatibility test to discover your preferences and start your exploration journey!
            </p>
            <button
              onClick={() => {
                onNavigate('safety', 'test');
                setShowSuggestions(false);
              }}
              className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Take Test Now
            </button>
          </div>
        </motion.div>
      )}

      {/* Show suggestions after a delay for new users */}
      {results.length === 0 && !showSuggestions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          onAnimationComplete={() => setShowSuggestions(true)}
        />
      )}
    </>
  );
};

export default QuickAccess;
