import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Heart, 
  Shield, 
  MessageCircle, 
  BookOpen,
  Users,
  Zap,
  CheckCircle,
  BarChart3
} from 'lucide-react';

const WelcomeTour = ({ isOpen, onClose, beginnerMode }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(0);
    }
  }, [isOpen]);

  const tourSteps = [
    {
      title: "Welcome to BDSM Exploration! 🎉",
      content: "This app helps couples discover and explore BDSM together safely. Whether you're beginners or experienced, we've got tools for you!",
      icon: <Heart className="w-8 h-8 text-pink-400" />,
      highlight: null
    },
    {
      title: "Beginner Mode is Active 🛡️",
      content: "You're in beginner mode! This means you'll see extra explanations, safety tips, and beginner-friendly content throughout the app.",
      icon: <Shield className="w-8 h-8 text-green-400" />,
      highlight: "beginner-mode-toggle",
      showOnlyInBeginner: true
    },
    {
      title: "Start with the BDSM Test 📝",
      content: "Go to the Safety Center and take the compatibility test to discover your preferences. In beginner mode, you'll get helpful explanations for each question.",
      icon: <BookOpen className="w-8 h-8 text-blue-400" />,
      highlight: "safety-tab"
    },
    {
      title: "Explore Scenarios Together 🎭",
      content: "Visit the Exploration Hub to use the Scenario Builder and create new experiences. We've added beginner-friendly templates just for you!",
      icon: <Users className="w-8 h-8 text-purple-400" />,
      highlight: "exploration-tab"
    },
    {
      title: "Communicate & Check-in 💬",
      content: "Use the Couple Hub for regular check-ins and boundary discussions. Perfect for building trust and understanding.",
      icon: <MessageCircle className="w-8 h-8 text-indigo-400" />,
      highlight: "couple-tab"
    },
    {
      title: "View Your Results 📊",
      content: "Check the Results Dashboard to see your compatibility analysis, comparisons, and detailed insights about your preferences.",
      icon: <BarChart3 className="w-8 h-8 text-cyan-400" />,
      highlight: "results-tab"
    },
    {
      title: "You're All Set! ✨",
      content: "Ready to start your BDSM exploration journey? Remember to go at your own pace and communicate openly with your partner.",
      icon: <CheckCircle className="w-8 h-8 text-green-400" />,
      highlight: null
    }
  ];

  const filteredSteps = beginnerMode 
    ? tourSteps 
    : tourSteps.filter(step => !step.showOnlyInBeginner);

  const currentStepData = filteredSteps[currentStep];
  const isLastStep = currentStep === filteredSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const nextStep = () => {
    if (currentStep < filteredSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const skipTour = () => {
    localStorage.setItem('welcomeTourCompleted', 'true');
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-800 to-purple-900 border border-purple-400/30 rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {currentStepData.icon}
                <div>
                  <h3 className="text-xl font-bold text-white">{currentStepData.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex gap-1">
                      {filteredSteps.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index <= currentStep ? 'bg-purple-400' : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-purple-300">
                      {currentStep + 1} of {filteredSteps.length}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-purple-200 leading-relaxed">
                {currentStepData.content}
              </p>
            </div>

            {/* Highlight Element */}
            {currentStepData.highlight && (
              <div className="mb-6 p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                <p className="text-blue-200 text-sm">
                  💡 Look for the highlighted element on the page!
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {!isFirstStep && (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                  </button>
                )}
                <button
                  onClick={skipTour}
                  className="px-4 py-2 text-purple-300 hover:text-white transition-colors"
                >
                  Skip Tour
                </button>
              </div>
              
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all"
              >
                {isLastStep ? 'Get Started!' : 'Next'}
                {!isLastStep && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeTour;
