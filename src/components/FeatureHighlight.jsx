import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  Lightbulb,
  Shield,
  Heart,
  Zap,
  BarChart3
} from 'lucide-react';

const FeatureHighlight = ({ 
  feature, 
  isVisible, 
  onClose, 
  onNext,
  position = 'top-right' 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const getFeatureConfig = (featureType) => {
    const configs = {
      'beginner-mode': {
        icon: <Shield className="w-6 h-6 text-green-400" />,
        title: 'Beginner Mode Active!',
        description: 'You\'ll see extra explanations, safety tips, and beginner-friendly content throughout the app.',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-400/30'
      },
      'bdsm-test': {
        icon: <Zap className="w-6 h-6 text-blue-400" />,
        title: 'Take the BDSM Test',
        description: 'Discover your preferences and compatibility with detailed explanations for each question.',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-400/30'
      },
      'scenario-builder': {
        icon: <Heart className="w-6 h-6 text-purple-400" />,
        title: 'Try Scenario Builder',
        description: 'Create and explore new experiences with beginner-friendly templates and safety guides.',
        color: 'from-purple-500 to-pink-500',
        bgColor: 'bg-purple-500/20',
        borderColor: 'border-purple-400/30'
      },
      'communication-hub': {
        icon: <Heart className="w-6 h-6 text-pink-400" />,
        title: 'Communication Hub',
        description: 'Regular check-ins and boundary discussions to build trust and understanding.',
        color: 'from-pink-500 to-rose-500',
        bgColor: 'bg-pink-500/20',
        borderColor: 'border-pink-400/30'
      },
      'results-dashboard': {
        icon: <BarChart3 className="w-6 h-6 text-cyan-400" />,
        title: 'Results Dashboard',
        description: 'View your compatibility analysis, comparisons, and detailed insights about your preferences.',
        color: 'from-cyan-500 to-blue-500',
        bgColor: 'bg-cyan-500/20',
        borderColor: 'border-cyan-400/30'
      }
    };
    return configs[featureType] || configs['beginner-mode'];
  };

  const config = getFeatureConfig(feature);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        className={`fixed ${positionClasses[position]} z-50 max-w-sm`}
      >
        <div className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4 shadow-xl backdrop-blur-sm`}>
          {/* Pulsing animation for attention */}
          {isAnimating && (
            <motion.div
              className="absolute inset-0 rounded-xl"
              animate={{ 
                boxShadow: [
                  '0 0 0 0 rgba(168, 85, 247, 0.4)',
                  '0 0 0 10px rgba(168, 85, 247, 0)',
                  '0 0 0 0 rgba(168, 85, 247, 0)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
          
          <div className="relative">
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {config.icon}
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-semibold text-sm">{config.title}</h3>
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </div>
                <p className="text-white/90 text-xs leading-relaxed mb-3">
                  {config.description}
                </p>
                
                <div className="flex items-center gap-2">
                  {onNext && (
                    <button
                      onClick={onNext}
                      className={`flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r ${config.color} text-white rounded-lg text-xs font-medium hover:shadow-md transition-all`}
                    >
                      Try Now
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Feature Highlight Manager
export const FeatureHighlightManager = ({ 
  beginnerMode, 
  currentTab, 
  currentSubTab, 
  onNavigate,
  results 
}) => {
  const [activeHighlights, setActiveHighlights] = useState(new Set());
  const [dismissedHighlights, setDismissedHighlights] = useState(new Set());

  useEffect(() => {
    if (!beginnerMode) return;

    const highlights = new Set();

    // Show beginner mode highlight when first enabled
    if (beginnerMode && !dismissedHighlights.has('beginner-mode')) {
      highlights.add('beginner-mode');
    }

    // Show test highlight if no results
    if (results.length === 0 && !dismissedHighlights.has('bdsm-test')) {
      highlights.add('bdsm-test');
    }

    // Show scenario builder highlight when in exploration
    if (currentTab === 'exploration' && currentSubTab === 'scenarios' && !dismissedHighlights.has('scenario-builder')) {
      highlights.add('scenario-builder');
    }

    // Show communication highlight when in couple hub
    if (currentTab === 'couple' && currentSubTab === 'communication' && !dismissedHighlights.has('communication-hub')) {
      highlights.add('communication-hub');
    }

    // Show results highlight when viewing results
    if (currentTab === 'results' && !dismissedHighlights.has('results-dashboard')) {
      highlights.add('results-dashboard');
    }

    setActiveHighlights(highlights);
  }, [beginnerMode, currentTab, currentSubTab, results.length, dismissedHighlights]);

  const dismissHighlight = (feature) => {
    setDismissedHighlights(prev => new Set([...prev, feature]));
    setActiveHighlights(prev => {
      const newSet = new Set(prev);
      newSet.delete(feature);
      return newSet;
    });
  };

  const handleNext = (feature) => {
    switch (feature) {
      case 'bdsm-test':
        onNavigate('safety', 'test');
        break;
      case 'scenario-builder':
        onNavigate('exploration', 'scenarios');
        break;
      case 'communication-hub':
        onNavigate('couple', 'communication');
        break;
      case 'results-dashboard':
        onNavigate('results', 'overview');
        break;
    }
    dismissHighlight(feature);
  };

  return (
    <>
      {Array.from(activeHighlights).map((feature, index) => (
        <FeatureHighlight
          key={feature}
          feature={feature}
          isVisible={true}
          onClose={() => dismissHighlight(feature)}
          onNext={() => handleNext(feature)}
          position={index === 0 ? 'top-right' : 'top-left'}
        />
      ))}
    </>
  );
};

export default FeatureHighlight;
