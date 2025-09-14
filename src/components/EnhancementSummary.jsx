import React from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Heart, 
  Shield, 
  Smartphone, 
  Lightbulb, 
  Gauge, 
  Accessibility,
  CheckCircle,
  ArrowRight,
  X,
  Sparkles
} from 'lucide-react';

const EnhancementSummary = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  const enhancements = [
    {
      category: 'Quick Access',
      icon: <Zap className="w-6 h-6" />,
      color: 'from-yellow-500 to-orange-500',
      features: [
        'Floating action buttons',
        'Smart suggestions based on user state',
        'Quick navigation shortcuts',
        'Context-aware recommendations'
      ]
    },
    {
      category: 'Smart Defaults',
      icon: <Heart className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-500',
      features: [
        'Remembers last used tabs',
        'Auto-selects relevant content',
        'Persistent user preferences',
        'Intelligent navigation flow'
      ]
    },
    {
      category: 'Visual Polish',
      icon: <Shield className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      features: [
        'Breadcrumb navigation',
        'Loading skeletons',
        'Smooth transitions',
        'Enhanced animations'
      ]
    },
    {
      category: 'Beginner Mode',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Feature highlights with animations',
        'Contextual tooltips',
        'Guided tours for each section',
        'Educational content integration'
      ]
    },
    {
      category: 'Mobile Optimized',
      icon: <Smartphone className="w-6 h-6" />,
      color: 'from-purple-500 to-indigo-500',
      features: [
        'Collapsible navigation',
        'Touch-friendly interactions',
        'Bottom navigation bar',
        'Responsive design improvements'
      ]
    },
    {
      category: 'Performance',
      icon: <Gauge className="w-6 h-6" />,
      color: 'from-cyan-500 to-blue-500',
      features: [
        'Lazy loading components',
        'Virtual scrolling for lists',
        'Optimized animations',
        'Bundle size optimization'
      ]
    },
    {
      category: 'Accessibility',
      icon: <Accessibility className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      features: [
        'Keyboard navigation support',
        'Screen reader optimization',
        'High contrast mode',
        'Focus management'
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">🚀 All Enhancements Implemented!</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enhancements.map((enhancement, index) => (
            <motion.div
              key={enhancement.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${enhancement.color} flex items-center justify-center`}>
                  {enhancement.icon}
                </div>
                <h3 className="text-white font-semibold">{enhancement.category}</h3>
              </div>
              
              <ul className="space-y-2">
                {enhancement.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2 text-sm text-purple-200">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-400/30">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h4 className="text-white font-semibold">What's New?</h4>
          </div>
          <p className="text-purple-200 text-sm leading-relaxed">
            Your BDSM exploration app now features comprehensive enhancements including smart navigation, 
            accessibility improvements, mobile optimization, performance boosts, and beginner-friendly features. 
            Everything is designed to make your journey smoother and more intuitive!
          </p>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
          >
            Explore Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancementSummary;
