import React from 'react';
import { motion } from 'framer-motion';

const LoadingSkeleton = ({ type = 'card', count = 1, className = '' }) => {
  const SkeletonCard = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-white/10 rounded-xl p-6 border border-white/20 ${className}`}
    >
      <div className="animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-white/20 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-white/20 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 bg-white/20 rounded"></div>
          <div className="h-3 bg-white/20 rounded w-5/6"></div>
          <div className="h-3 bg-white/20 rounded w-4/6"></div>
        </div>
        <div className="flex gap-2 mt-4">
          <div className="h-6 bg-white/20 rounded-full w-16"></div>
          <div className="h-6 bg-white/20 rounded-full w-20"></div>
        </div>
      </div>
    </motion.div>
  );

  const SkeletonList = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`space-y-4 ${className}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-white/20 rounded w-2/3 mb-2"></div>
                <div className="h-3 bg-white/20 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );

  const SkeletonChart = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-white/10 rounded-xl p-6 border border-white/20 ${className}`}
    >
      <div className="animate-pulse">
        <div className="h-6 bg-white/20 rounded w-1/3 mb-4"></div>
        <div className="h-48 bg-white/20 rounded mb-4"></div>
        <div className="flex justify-between">
          <div className="h-4 bg-white/20 rounded w-16"></div>
          <div className="h-4 bg-white/20 rounded w-16"></div>
          <div className="h-4 bg-white/20 rounded w-16"></div>
        </div>
      </div>
    </motion.div>
  );

  const SkeletonForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-white/10 rounded-xl p-6 border border-white/20 ${className}`}
    >
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-white/20 rounded w-1/4"></div>
        <div className="h-10 bg-white/20 rounded"></div>
        <div className="h-6 bg-white/20 rounded w-1/3"></div>
        <div className="h-20 bg-white/20 rounded"></div>
        <div className="flex gap-3">
          <div className="h-10 bg-white/20 rounded w-24"></div>
          <div className="h-10 bg-white/20 rounded w-24"></div>
        </div>
      </div>
    </motion.div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'list':
        return <SkeletonList />;
      case 'chart':
        return <SkeletonChart />;
      case 'form':
        return <SkeletonForm />;
      case 'card':
      default:
        return <SkeletonCard />;
    }
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
