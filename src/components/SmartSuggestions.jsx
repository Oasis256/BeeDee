import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  ArrowRight, 
  X, 
  Heart, 
  Shield, 
  Zap, 
  MessageCircle,
  BarChart3,
  Users,
  BookOpen,
  TrendingUp
} from 'lucide-react';

const SmartSuggestions = ({ 
  results, 
  currentTab, 
  currentSubTab, 
  beginnerMode,
  onNavigate,
  userActivity = {}
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [dismissedSuggestions, setDismissedSuggestions] = useState(new Set());

  useEffect(() => {
    generateSuggestions();
  }, [results, currentTab, currentSubTab, beginnerMode, userActivity]);

  const generateSuggestions = () => {
    const newSuggestions = [];

    // No results - suggest taking the test
    if (results.length === 0) {
      newSuggestions.push({
        id: 'take-test',
        type: 'primary',
        title: 'Start Your Journey',
        description: 'Take the BDSM compatibility test to discover your preferences and begin exploring together.',
        icon: <Zap className="w-5 h-5" />,
        action: () => onNavigate('safety', 'test'),
        color: 'from-green-500 to-emerald-500',
        priority: 1
      });
    }

    // Has results but hasn't explored scenarios
    if (results.length > 0 && !userActivity.exploredScenarios) {
      newSuggestions.push({
        id: 'explore-scenarios',
        type: 'secondary',
        title: 'Try Scenario Builder',
        description: 'Create personalized scenarios based on your compatibility results.',
        icon: <Heart className="w-5 h-5" />,
        action: () => onNavigate('exploration', 'scenarios'),
        color: 'from-purple-500 to-pink-500',
        priority: 2
      });
    }

    // Has results but hasn't communicated
    if (results.length > 0 && !userActivity.usedCommunication) {
      newSuggestions.push({
        id: 'start-communication',
        type: 'secondary',
        title: 'Open Communication',
        description: 'Use our communication tools to discuss boundaries and preferences.',
        icon: <MessageCircle className="w-5 h-5" />,
        action: () => onNavigate('couple', 'communication'),
        color: 'from-pink-500 to-rose-500',
        priority: 3
      });
    }

    // Beginner mode suggestions
    if (beginnerMode) {
      if (!userActivity.viewedSafetyGuide) {
        newSuggestions.push({
          id: 'safety-guide',
          type: 'safety',
          title: 'Safety First',
          description: 'Learn about safe practices, consent, and aftercare in BDSM.',
          icon: <Shield className="w-5 h-5" />,
          action: () => onNavigate('safety', 'aftercare'),
          color: 'from-green-500 to-emerald-500',
          priority: 1
        });
      }

      if (!userActivity.viewedEducation) {
        newSuggestions.push({
          id: 'education',
          type: 'education',
          title: 'Learn the Basics',
          description: 'Explore our educational content about BDSM terminology and practices.',
          icon: <BookOpen className="w-5 h-5" />,
          action: () => onNavigate('safety', 'education'),
          color: 'from-blue-500 to-cyan-500',
          priority: 4
        });
      }
    }

    // Advanced suggestions for experienced users
    if (results.length > 0 && !beginnerMode) {
      if (!userActivity.usedAnalytics) {
        newSuggestions.push({
          id: 'analytics',
          type: 'analytics',
          title: 'Track Progress',
          description: 'Monitor your exploration journey and see how your preferences evolve.',
          icon: <TrendingUp className="w-5 h-5" />,
          action: () => onNavigate('couple', 'tracking'),
          color: 'from-cyan-500 to-blue-500',
          priority: 5
        });
      }
    }

    // Context-aware suggestions based on current location
    if (currentTab === 'results' && currentSubTab === 'overview') {
      newSuggestions.push({
        id: 'detailed-analysis',
        type: 'contextual',
        title: 'Deep Dive Analysis',
        description: 'Get detailed insights into your compatibility and individual preferences.',
        icon: <BarChart3 className="w-5 h-5" />,
        action: () => onNavigate('results', 'detailed'),
        color: 'from-indigo-500 to-purple-500',
        priority: 6
      });
    }

    // Filter out dismissed suggestions and sort by priority
    const filteredSuggestions = newSuggestions
      .filter(suggestion => !dismissedSuggestions.has(suggestion.id))
      .sort((a, b) => a.priority - b.priority)
      .slice(0, 3); // Show max 3 suggestions

    setSuggestions(filteredSuggestions);
  };

  const dismissSuggestion = (suggestionId) => {
    setDismissedSuggestions(prev => new Set([...prev, suggestionId]));
  };

  const getTypeIcon = (type) => {
    const icons = {
      primary: <Zap className="w-4 h-4" />,
      secondary: <Heart className="w-4 h-4" />,
      safety: <Shield className="w-4 h-4" />,
      education: <BookOpen className="w-4 h-4" />,
      analytics: <TrendingUp className="w-4 h-4" />,
      contextual: <Lightbulb className="w-4 h-4" />
    };
    return icons[type] || <Lightbulb className="w-4 h-4" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      primary: 'border-green-400/30 bg-green-500/10',
      secondary: 'border-purple-400/30 bg-purple-500/10',
      safety: 'border-green-400/30 bg-green-500/10',
      education: 'border-blue-400/30 bg-blue-500/10',
      analytics: 'border-cyan-400/30 bg-cyan-500/10',
      contextual: 'border-yellow-400/30 bg-yellow-500/10'
    };
    return colors[type] || 'border-purple-400/30 bg-purple-500/10';
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-yellow-400" />
        <h3 className="text-white font-semibold">Smart Suggestions</h3>
      </div>

      <AnimatePresence>
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
            className={`border rounded-xl p-4 ${getTypeColor(suggestion.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2">
                {getTypeIcon(suggestion.type)}
                {suggestion.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-white font-medium text-sm">{suggestion.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${suggestion.color} text-white`}>
                    {suggestion.type}
                  </span>
                </div>
                <p className="text-white/80 text-xs mb-3 leading-relaxed">
                  {suggestion.description}
                </p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={suggestion.action}
                    className={`flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r ${suggestion.color} text-white rounded-lg text-xs font-medium hover:shadow-md transition-all`}
                  >
                    Try Now
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => dismissSuggestion(suggestion.id)}
                    className="text-white/50 hover:text-white/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SmartSuggestions;
