import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  TrendingUp, 
  History, 
  Map, 
  Wind,
  Leaf,
  User,
  LogIn,
  Menu,
  X,
  Code,
  Settings,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { DarkModeToggle } from '../DarkMode/DarkModeToggle';
import { OfflineIndicator } from '../OfflineSupport/OfflineIndicator';

export const Navigation: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { hasNotificationPermission, requestNotificationPermission } = useNotifications();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const publicNavItems = [
    { path: '/', icon: Home, label: t('navigation.home') },
    { path: '/forecast', icon: TrendingUp, label: t('navigation.forecast') },
    { path: '/history', icon: History, label: t('navigation.history') },
    { path: '/map', icon: Map, label: t('navigation.map') }
  ];

  const authNavItems = [
    { path: '/eco-tips', icon: Leaf, label: 'Eco Tips' },
    { path: '/dashboard', icon: User, label: 'Dashboard' }
  ];

  const developerItems = [
    { path: '/api', icon: Code, label: 'Developer API' }
  ];

  const allNavItems = user 
    ? [...publicNavItems, ...authNavItems, ...developerItems] 
    : [...publicNavItems, ...developerItems];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  {t('app.title')}
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('app.subtitle')}</p>
              </div>
            </motion.div>
            
            <div className="flex items-center space-x-2">
              {allNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `nav-link flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 shadow-md active'
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
              
              {/* Notification Bell */}
              <motion.button
                onClick={requestNotificationPermission}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  hasNotificationPermission
                    ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/50'
                    : 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/50'
                }`}
                title={hasNotificationPermission ? 'Notifications enabled' : 'Enable notifications'}
              >
                <Bell className="w-4 h-4" />
              </motion.button>

              {/* Dark Mode Toggle */}
              <DarkModeToggle />

              {/* Offline Indicator */}
              <div className="relative">
                <OfflineIndicator />
              </div>
              
              {!user && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <NavLink
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </NavLink>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Header */}
      <nav className="lg:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg border-b border-white/20 dark:border-gray-700/20 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <Wind className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  AirScope
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Mobile Controls */}
              <motion.button
                onClick={requestNotificationPermission}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  hasNotificationPermission
                    ? 'text-green-600 hover:bg-green-50'
                    : 'text-orange-600 hover:bg-orange-50'
                }`}
              >
                <Bell className="w-4 h-4" />
              </motion.button>

              <OfflineIndicator />
              
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
            >
              <div className="px-4 py-2 space-y-1">
                {allNavItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                ))}
                
                {/* Dark Mode Toggle in Mobile */}
                <div className="px-3 py-3">
                  <DarkModeToggle />
                </div>
                
                {!user && (
                  <NavLink
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 bg-blue-500 text-white rounded-xl font-medium"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </NavLink>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {allNavItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};