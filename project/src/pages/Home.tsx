import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Loader2, WifiOff, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { AQICard } from '../components/AQICard';
import { PollutantGrid } from '../components/PollutantGrid';
import { HealthAdvisory } from '../components/HealthAdvisory';
import { LocationSearch } from '../components/LocationSearch';
import { AQIMap } from '../components/AQIMap';
import { ForecastChart } from '../components/ForecastChart';
import { useLocation } from '../contexts/LocationContext';
import { useNotifications } from '../contexts/NotificationContext';
import { getHealthAdvice } from '../utils/air-quality';
import { isOnline } from '../services/api';

export const Home: React.FC = () => {
  const { t } = useTranslation();
  const {
    currentLocation,
    searchedLocation,
    locationName,
    aqiData,
    isLoading,
    error,
    loadLocationData,
    loadCurrentLocationData,
    clearError
  } = useLocation();

  const { checkAQIAlert } = useNotifications();

  const [isOffline, setIsOffline] = React.useState(!isOnline());

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for AQI alerts when data changes
  useEffect(() => {
    if (aqiData) {
      checkAQIAlert(aqiData);
    }
  }, [aqiData, checkAQIAlert]);

  const healthAdvice = aqiData ? getHealthAdvice(aqiData.aqi) : null;

  return (
    <div className="min-h-screen pb-20 lg:pb-8 layout-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mobile-padding content-wrapper">
        {/* Current Location Indicator */}
        {(currentLocation || searchedLocation) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-blue-700 font-medium truncate">
                  {currentLocation ? '📍 Current Location' : '🔍 Searched Location'}: {locationName}
                </p>
                {currentLocation && (
                  <p className="text-blue-600 text-sm truncate">
                    {currentLocation[0].toFixed(4)}, {currentLocation[1].toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Offline Indicator */}
        <AnimatePresence>
          {isOffline && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-orange-50 border border-orange-200 rounded-2xl p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <WifiOff className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <p className="text-orange-700 font-medium">{t('home.offline')}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Location Search */}
        <div className="mb-8 w-full">
          <LocationSearch
            onLocationSelect={loadLocationData}
            onCurrentLocation={loadCurrentLocationData}
            isLoading={isLoading}
          />
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-4 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 font-medium truncate">{error}</p>
                </div>
                <button
                  onClick={clearError}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200 flex-shrink-0 ml-2"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && !aqiData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-12"
            >
              <div className="text-center">
                <div className="relative">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                  <div className="absolute inset-0 w-12 h-12 border-4 border-blue-200 rounded-full mx-auto animate-ping"></div>
                </div>
                <p className="text-gray-600 font-medium">Loading air quality data...</p>
                <p className="text-gray-500 text-sm mt-1">Please wait while we fetch the latest information</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <AnimatePresence>
          {aqiData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-8 w-full"
            >
              {/* Top Section - AQI Card and Health Advisory */}
              <div className="grid lg:grid-cols-2 gap-8 grid-container">
                <div className="grid-item">
                  <AQICard data={aqiData} isLoading={isLoading} />
                </div>
                {healthAdvice && (
                  <div className="grid-item">
                    <HealthAdvisory advice={healthAdvice} />
                  </div>
                )}
              </div>

              {/* Pollutant Grid */}
              <div className="w-full">
                <PollutantGrid data={aqiData} />
              </div>

              {/* Map and Forecast */}
              <div className="grid lg:grid-cols-2 gap-8 grid-container">
                <div className="grid-item">
                  <AQIMap 
                    data={aqiData} 
                    center={searchedLocation || undefined}
                    userLocation={currentLocation || undefined}
                  />
                </div>
                <div className="grid-item">
                  <ForecastChart data={aqiData} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};