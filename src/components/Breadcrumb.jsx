import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ 
  currentTab, 
  currentSubTab, 
  tabGroups, 
  onNavigate,
  beginnerMode = false 
}) => {
  const getBreadcrumbItems = () => {
    const items = [
      {
        label: 'Home',
        icon: <Home className="w-4 h-4" />,
        onClick: () => onNavigate('results', 'overview'),
        isActive: false
      }
    ];

    if (currentTab && tabGroups[currentTab]) {
      items.push({
        label: tabGroups[currentTab].name,
        icon: tabGroups[currentTab].icon,
        onClick: () => onNavigate(currentTab, Object.keys(tabGroups[currentTab].subTabs)[0]),
        isActive: false
      });

      if (currentSubTab && tabGroups[currentTab].subTabs[currentSubTab]) {
        items.push({
          label: tabGroups[currentTab].subTabs[currentSubTab].name,
          icon: tabGroups[currentTab].subTabs[currentSubTab].icon,
          onClick: null,
          isActive: true
        });
      }
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 text-sm mb-4"
    >
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-purple-300" />
          )}
          <motion.button
            onClick={item.onClick}
            disabled={item.isActive}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
              item.isActive
                ? 'text-white bg-purple-500/20'
                : 'text-purple-200 hover:text-white hover:bg-white/10'
            } ${!item.onClick ? 'cursor-default' : 'cursor-pointer'}`}
            whileHover={item.onClick ? { scale: 1.05 } : {}}
            whileTap={item.onClick ? { scale: 0.95 } : {}}
          >
            {item.icon}
            <span>{item.label}</span>
          </motion.button>
        </React.Fragment>
      ))}
      
      {/* Beginner mode indicator */}
      {beginnerMode && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ml-2 px-2 py-1 bg-green-500/20 text-green-200 rounded-lg text-xs font-medium"
        >
          🎓 Beginner Mode
        </motion.div>
      )}
    </motion.div>
  );
};

export default Breadcrumb;
