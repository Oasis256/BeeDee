import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Clock, Shield } from 'lucide-react';

export const ProgressBar = ({ 
  current, 
  total, 
  label = '', 
  showPercentage = true,
  color = 'purple',
  size = 'medium'
}) => {
  const percentage = (current / total) * 100;
  
  const sizeClasses = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  };
  
  const colorClasses = {
    purple: {
      bg: 'bg-purple-900/50',
      fill: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    blue: {
      bg: 'bg-blue-900/50',
      fill: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    green: {
      bg: 'bg-green-900/50',
      fill: 'bg-gradient-to-r from-green-500 to-emerald-500'
    }
  };
  
  const colors = colorClasses[color] || colorClasses.purple;
  
  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">{label}</span>
          {showPercentage && (
            <span className="text-sm text-purple-200">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      
      <div className={`w-full ${colors.bg} rounded-full ${sizeClasses[size]}`}>
        <motion.div
          className={`${colors.fill} ${sizeClasses[size]} rounded-full transition-all duration-500 ease-out`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-400">
        <span>{current} of {total}</span>
        <span>{Math.round(percentage)}% complete</span>
      </div>
    </div>
  );
};

export const StepIndicator = ({ 
  steps, 
  currentStep, 
  onStepClick,
  beginnerMode = false 
}) => {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = onStepClick && (isCompleted || isCurrent);
        
        return (
          <div key={index} className="flex items-center">
            <motion.button
              onClick={isClickable ? () => onStepClick(index) : undefined}
              disabled={!isClickable}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                isCompleted
                  ? 'bg-green-500 text-white'
                  : isCurrent
                    ? 'bg-purple-500 text-white ring-2 ring-purple-300'
                    : 'bg-gray-600 text-gray-400'
              } ${isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
              whileHover={isClickable ? { scale: 1.05 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
            >
              {isCompleted ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
              
              {/* Beginner mode indicator */}
              {beginnerMode && isCurrent && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                  <Shield className="w-2 h-2 text-white" />
                </div>
              )}
            </motion.button>
            
            {/* Step label */}
            <div className="ml-3 min-w-0">
              <p className={`text-sm font-medium ${
                isCurrent ? 'text-white' : isCompleted ? 'text-green-300' : 'text-gray-400'
              }`}>
                {step.title}
              </p>
              {step.description && (
                <p className="text-xs text-gray-500 truncate max-w-32">
                  {step.description}
                </p>
              )}
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                index < currentStep ? 'bg-green-500' : 'bg-gray-600'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const CompletionStatus = ({ 
  completed, 
  total, 
  title = 'Progress',
  beginnerMode = false 
}) => {
  const percentage = (completed / total) * 100;
  const isComplete = completed === total;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-xl"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          {beginnerMode && (
            <Shield className="w-4 h-4 text-green-400" title="Beginner Mode" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <Clock className="w-5 h-5 text-purple-400" />
          )}
          <span className="text-sm text-purple-200">
            {completed}/{total}
          </span>
        </div>
      </div>
      
      <ProgressBar 
        current={completed} 
        total={total} 
        color="purple"
        showPercentage={false}
      />
      
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-3 p-2 bg-green-500/20 border border-green-400/30 rounded-lg"
        >
          <p className="text-green-200 text-sm text-center">
            🎉 Congratulations! You've completed all steps!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export const CircularProgress = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 8,
  color = 'purple',
  label = '',
  showPercentage = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const colorClasses = {
    purple: {
      stroke: '#a855f7',
      background: '#581c87'
    },
    blue: {
      stroke: '#3b82f6',
      background: '#1e40af'
    },
    green: {
      stroke: '#10b981',
      background: '#065f46'
    }
  };
  
  const colors = colorClasses[color] || colorClasses.purple;
  
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.background}
            strokeWidth={strokeWidth}
            fill="transparent"
            className="opacity-30"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {showPercentage && (
            <span className="text-2xl font-bold text-white">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>
      
      {label && (
        <p className="text-sm text-purple-200 text-center">{label}</p>
      )}
    </div>
  );
};
