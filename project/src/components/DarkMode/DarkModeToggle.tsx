import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const DarkModeToggle: React.FC = () => {
  const { theme, setTheme, isDarkMode } = useTheme();

  const themes = [
    { key: 'light', icon: Sun, label: 'Light' },
    { key: 'dark', icon: Moon, label: 'Dark' },
    { key: 'auto', icon: Monitor, label: 'Auto' }
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
      {themes.map(({ key, icon: Icon, label }) => (
        <motion.button
          key={key}
          onClick={() => setTheme(key as any)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            theme === key
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </motion.button>
      ))}
    </div>
  );
};