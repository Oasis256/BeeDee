import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

// Lazy loading wrapper
export const LazyComponent = ({ 
  children, 
  fallback = null, 
  threshold = 0.1,
  rootMargin = '50px'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = React.useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
};

// Virtual scrolling for long lists
export const VirtualList = ({ 
  items, 
  itemHeight = 60, 
  containerHeight = 400,
  renderItem,
  className = ''
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = React.useRef();

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index
    }));
  }, [items, itemHeight, containerHeight, scrollTop]);

  const totalHeight = items.length * itemHeight;
  const offsetY = Math.floor(scrollTop / itemHeight) * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map((item) => (
            <div
              key={item.index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, item.index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Debounced search
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized heavy computations
export const useMemoizedComputation = (computeFn, dependencies) => {
  return useMemo(() => {
    return computeFn();
  }, dependencies);
};

// Image lazy loading with placeholder
export const LazyImage = ({ 
  src, 
  alt, 
  placeholder = null,
  className = '',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = React.useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative ${className}`} {...props}>
      {!isLoaded && placeholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded">
          {placeholder}
        </div>
      )}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
};

// Optimized animation wrapper
export const OptimizedMotion = ({ 
  children, 
  animation = 'fadeIn',
  delay = 0,
  ...props 
}) => {
  const animations = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slideUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    },
    slideIn: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.9 }
    }
  };

  const animationConfig = animations[animation] || animations.fadeIn;

  return (
    <motion.div
      initial={animationConfig.initial}
      animate={animationConfig.animate}
      exit={animationConfig.exit}
      transition={{ delay, duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Bundle size optimization - dynamic imports
export const dynamicImport = (importFn) => {
  return React.lazy(importFn);
};

// Example usage for heavy components
export const LazyBDSMTest = dynamicImport(() => import('./BDSMTestEmbed'));
export const LazyScenarioBuilder = dynamicImport(() => import('./ScenarioBuilder'));
export const LazyCommunicationHub = dynamicImport(() => import('./CoupleCommunicationHub'));

export default {
  LazyComponent,
  VirtualList,
  useDebounce,
  useMemoizedComputation,
  LazyImage,
  usePerformanceMonitor,
  OptimizedMotion,
  dynamicImport
};
