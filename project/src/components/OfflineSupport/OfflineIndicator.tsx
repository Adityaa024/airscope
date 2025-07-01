import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Download, RefreshCw, Database } from 'lucide-react';
import toast from 'react-hot-toast';

interface OfflineData {
  lastSync: string;
  cachedLocations: string[];
  dataSize: string;
}

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflinePanel, setShowOfflinePanel] = useState(false);
  const [offlineData, setOfflineData] = useState<OfflineData>({
    lastSync: new Date().toISOString(),
    cachedLocations: ['Delhi', 'Mumbai', 'Bangalore'],
    dataSize: '2.3 MB'
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online! Syncing latest data...');
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You are offline. Using cached data.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncOfflineData = async () => {
    // Simulate data sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    setOfflineData(prev => ({
      ...prev,
      lastSync: new Date().toISOString()
    }));
    toast.success('Data synchronized successfully!');
  };

  const downloadOfflineData = async () => {
    toast.loading('Downloading offline data...', { id: 'offline-download' });
    
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setOfflineData(prev => ({
      ...prev,
      cachedLocations: [...prev.cachedLocations, 'Chennai', 'Kolkata'],
      dataSize: '4.7 MB',
      lastSync: new Date().toISOString()
    }));
    
    toast.success('Offline data downloaded successfully!', { id: 'offline-download' });
  };

  return (
    <>
      {/* Status Indicator */}
      <motion.button
        onClick={() => setShowOfflinePanel(!showOfflinePanel)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
          isOnline
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
        }`}
      >
        {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
        <span className="text-sm font-medium">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </motion.button>

      {/* Offline Panel */}
      <AnimatePresence>
        {showOfflinePanel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 z-50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${
                isOnline ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white">
                  {isOnline ? 'Online Mode' : 'Offline Mode'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isOnline ? 'Real-time data available' : 'Using cached data'}
                </p>
              </div>
            </div>

            {/* Offline Data Info */}
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-800 dark:text-white">Cached Data</span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <div>Size: {offlineData.dataSize}</div>
                  <div>Locations: {offlineData.cachedLocations.length}</div>
                  <div>Last sync: {new Date(offlineData.lastSync).toLocaleString()}</div>
                </div>
              </div>

              {/* Cached Locations */}
              <div>
                <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-2">
                  Cached Locations
                </h4>
                <div className="flex flex-wrap gap-2">
                  {offlineData.cachedLocations.map((location, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                    >
                      {location}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {isOnline && (
                  <motion.button
                    onClick={syncOfflineData}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Sync Now
                  </motion.button>
                )}
                
                <motion.button
                  onClick={downloadOfflineData}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download More
                </motion.button>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                💡 Offline Tips
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Data is cached for 24 hours</li>
                <li>• Download data before traveling</li>
                <li>• Forecasts work offline too</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};