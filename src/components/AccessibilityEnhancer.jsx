import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// Keyboard navigation hook
export const useKeyboardNavigation = (items, onSelect) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!containerRef.current?.contains(e.target)) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => 
            prev < items.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : items.length - 1
          );
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex >= 0 && onSelect) {
            onSelect(items[focusedIndex], focusedIndex);
          }
          break;
        case 'Escape':
          setFocusedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items, focusedIndex, onSelect]);

  return { focusedIndex, setFocusedIndex, containerRef };
};

// Focus management hook
export const useFocusManagement = () => {
  const focusHistory = useRef([]);
  const currentFocus = useRef(null);

  const saveFocus = () => {
    if (document.activeElement) {
      focusHistory.current.push(document.activeElement);
      currentFocus.current = document.activeElement;
    }
  };

  const restoreFocus = () => {
    if (focusHistory.current.length > 0) {
      const lastFocus = focusHistory.current.pop();
      if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus();
      }
    }
  };

  const trapFocus = (containerRef) => {
    const focusableElements = containerRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    containerRef.current?.addEventListener('keydown', handleTabKey);
    return () => containerRef.current?.removeEventListener('keydown', handleTabKey);
  };

  return { saveFocus, restoreFocus, trapFocus };
};

// Screen reader announcements
export const useScreenReader = () => {
  const [announcements, setAnnouncements] = useState([]);

  const announce = (message, priority = 'polite') => {
    const announcement = {
      id: Date.now(),
      message,
      priority
    };
    
    setAnnouncements(prev => [...prev, announcement]);
    
    // Remove announcement after 5 seconds
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== announcement.id));
    }, 5000);
  };

  return { announce, announcements };
};

// High contrast mode
export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('highContrast');
    if (saved !== null) {
      setIsHighContrast(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('highContrast', JSON.stringify(isHighContrast));
    
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  return { isHighContrast, setIsHighContrast };
};

// Skip links component
export const SkipLinks = ({ links = [] }) => {
  const defaultLinks = [
    { href: '#main-content', text: 'Skip to main content' },
    { href: '#navigation', text: 'Skip to navigation' },
    { href: '#footer', text: 'Skip to footer' }
  ];

  const allLinks = links.length > 0 ? links : defaultLinks;

  return (
    <div className="skip-links">
      {allLinks.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-purple-600 text-white px-4 py-2 rounded-lg z-50"
        >
          {link.text}
        </a>
      ))}
    </div>
  );
};

// Accessible button component
export const AccessibleButton = ({ 
  children, 
  onClick, 
  disabled = false,
  ariaLabel,
  ariaDescribedBy,
  className = '',
  ...props 
}) => {
  const buttonRef = useRef();

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={`focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Accessible form field
export const AccessibleFormField = ({ 
  label, 
  error, 
  helpText,
  required = false,
  children,
  className = ''
}) => {
  const fieldId = `field-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;

  return (
    <div className={`form-field ${className}`}>
      <label 
        htmlFor={fieldId}
        className="block text-sm font-medium text-white mb-1"
      >
        {label}
        {required && <span className="text-red-400 ml-1" aria-label="required">*</span>}
      </label>
      
      {helpText && (
        <p id={helpId} className="text-sm text-purple-200 mb-2">
          {helpText}
        </p>
      )}
      
      <div className="relative">
        {React.cloneElement(children, {
          id: fieldId,
          'aria-describedby': `${error ? errorId : ''} ${helpText ? helpId : ''}`.trim(),
          'aria-invalid': error ? 'true' : 'false',
          'aria-required': required
        })}
      </div>
      
      {error && (
        <p id={errorId} className="text-sm text-red-400 mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Accessible modal
export const AccessibleModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  className = ''
}) => {
  const modalRef = useRef();
  const { saveFocus, restoreFocus, trapFocus } = useFocusManagement();

  useEffect(() => {
    if (isOpen) {
      saveFocus();
      const cleanup = trapFocus(modalRef);
      return cleanup;
    } else {
      restoreFocus();
    }
  }, [isOpen, saveFocus, restoreFocus, trapFocus]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 ${className}`}
      >
        <h2 id="modal-title" className="text-xl font-bold text-white mb-4">
          {title}
        </h2>
        {children}
      </motion.div>
    </div>
  );
};

// Accessibility settings panel
export const AccessibilitySettings = ({ 
  isOpen, 
  onClose,
  highContrast,
  onHighContrastChange,
  fontSize,
  onFontSizeChange
}) => {
  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title="Accessibility Settings"
    >
      <div className="space-y-4">
        <AccessibleFormField
          label="High Contrast Mode"
          helpText="Increases contrast for better visibility"
        >
          <input
            type="checkbox"
            checked={highContrast}
            onChange={(e) => onHighContrastChange(e.target.checked)}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
        </AccessibleFormField>

        <AccessibleFormField
          label="Font Size"
          helpText="Adjust text size for better readability"
        >
          <select
            value={fontSize}
            onChange={(e) => onFontSizeChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </AccessibleFormField>

        <div className="flex justify-end gap-3 pt-4">
          <AccessibleButton
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
          >
            Close
          </AccessibleButton>
        </div>
      </div>
    </AccessibleModal>
  );
};

export default {
  useKeyboardNavigation,
  useFocusManagement,
  useScreenReader,
  useHighContrast,
  SkipLinks,
  AccessibleButton,
  AccessibleFormField,
  AccessibleModal,
  AccessibilitySettings
};
