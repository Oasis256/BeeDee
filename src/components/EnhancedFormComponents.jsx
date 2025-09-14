import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';

// Enhanced Slider Component
export const EnhancedSlider = ({ 
  label, 
  value, 
  onChange, 
  explanation, 
  beginnerMode = false,
  min = 1,
  max = 10,
  step = 1,
  color = 'purple'
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  
  const colorClasses = {
    purple: {
      bg: 'bg-purple-900/50',
      fill: 'bg-purple-500',
      text: 'text-purple-200',
      accent: 'text-purple-400'
    },
    blue: {
      bg: 'bg-blue-900/50',
      fill: 'bg-blue-500',
      text: 'text-blue-200',
      accent: 'text-blue-400'
    },
    green: {
      bg: 'bg-green-900/50',
      fill: 'bg-green-500',
      text: 'text-green-200',
      accent: 'text-green-400'
    }
  };

  const colors = colorClasses[color] || colorClasses.purple;
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-white">
          {label} ({value}/{max})
        </label>
        {beginnerMode && explanation && (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={`w-full h-3 ${colors.bg} rounded-lg appearance-none cursor-pointer slider`}
          style={{
            background: `linear-gradient(to right, ${colors.fill} 0%, ${colors.fill} ${percentage}%, ${colors.bg} ${percentage}%, ${colors.bg} 100%)`
          }}
        />
        
        {/* Value indicators */}
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>

      {/* Beginner explanation */}
      {beginnerMode && explanation && showExplanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg"
        >
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-blue-100 text-sm">{explanation}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Enhanced Text Input Component
export const EnhancedTextInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  explanation,
  beginnerMode = false,
  required = false,
  error = null
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-white">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {beginnerMode && explanation && (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full bg-white/10 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none transition-all ${
            error 
              ? 'border-red-400 focus:ring-2 focus:ring-red-500/20' 
              : isFocused
                ? 'border-purple-400 focus:ring-2 focus:ring-purple-500/20'
                : 'border-white/20 hover:border-white/30'
          }`}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}

      {/* Beginner explanation */}
      {beginnerMode && explanation && showExplanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg"
        >
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-blue-100 text-sm">{explanation}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Enhanced Textarea Component
export const EnhancedTextarea = ({
  label,
  value,
  onChange,
  placeholder,
  explanation,
  beginnerMode = false,
  required = false,
  error = null,
  rows = 3
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-white">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {beginnerMode && explanation && (
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        )}
      </div>
      
      <textarea
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full bg-white/10 border rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none transition-all resize-vertical ${
          error 
            ? 'border-red-400 focus:ring-2 focus:ring-red-500/20' 
            : isFocused
              ? 'border-purple-400 focus:ring-2 focus:ring-purple-500/20'
              : 'border-white/20 hover:border-white/30'
        }`}
      />

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-400 text-sm"
        >
          <AlertCircle className="w-4 h-4" />
          {error}
        </motion.div>
      )}

      {/* Beginner explanation */}
      {beginnerMode && explanation && showExplanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-3 bg-blue-500/20 border border-blue-400/30 rounded-lg"
        >
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <p className="text-blue-100 text-sm">{explanation}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Status Message Component
export const StatusMessage = ({ type, message, onClose, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const typeConfig = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      bg: 'bg-green-500/20 border-green-400/30',
      text: 'text-green-100'
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-red-400" />,
      bg: 'bg-red-500/20 border-red-400/30',
      text: 'text-red-100'
    },
    warning: {
      icon: <AlertCircle className="w-5 h-5 text-yellow-400" />,
      bg: 'bg-yellow-500/20 border-yellow-400/30',
      text: 'text-yellow-100'
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-400" />,
      bg: 'bg-blue-500/20 border-blue-400/30',
      text: 'text-blue-100'
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
      exit={{ opacity: 0, y: -20 }}
      className={`p-4 rounded-lg border flex items-center gap-3 ${config.bg}`}
    >
      {config.icon}
      <span className={`flex-1 ${config.text}`}>{message}</span>
      {onClose && (
        <button
          onClick={handleClose}
          className="text-white/70 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

// Help Tooltip Component
export const HelpTooltip = ({ content, position = 'top', children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 transform -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 transform -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 transform -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 transform -translate-y-1/2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`absolute ${positionClasses[position]} bg-gray-800 text-white text-xs rounded-lg p-2 z-10 max-w-xs shadow-lg border border-gray-700`}
        >
          {content}
          <div className={`absolute w-2 h-2 bg-gray-800 transform rotate-45 ${
            position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2' :
            position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2' :
            position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -translate-x-1/2' :
            'right-full top-1/2 -translate-y-1/2 translate-x-1/2'
          }`} />
        </motion.div>
      )}
    </div>
  );
};
