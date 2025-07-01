import React from 'react';
import { Activity, MapPin, Clock, Info, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AQIData } from '../types/air-quality';
import { getAQILevel, getAQIColor, getAQIBackgroundColor, getAQIEmoji } from '../utils/air-quality';

interface AQICardProps {
  data: AQIData;
  isLoading?: boolean;
}

export const AQICard: React.FC<AQICardProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded-xl mb-4 shimmer"></div>
        <div className="h-32 bg-gray-200 rounded-full mx-auto mb-4 shimmer"></div>
        <div className="h-6 bg-gray-200 rounded-xl mb-2 shimmer"></div>
        <div className="h-4 bg-gray-200 rounded-lg shimmer"></div>
      </div>
    );
  }

  const aqiColor = getAQIColor(data.aqi);
  const aqiBgColor = getAQIBackgroundColor(data.aqi);
  const aqiLevel = getAQILevel(data.aqi);
  const aqiEmoji = getAQIEmoji(data.aqi);

  // Calculate AQI ring percentage
  const aqiPercentage = Math.min((data.aqi / 300) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-white/20 card-shadow hover:card-shadow-hover"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div 
            className="p-3 rounded-xl shadow-lg"
            style={{ backgroundColor: aqiBgColor }}
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Activity className="w-6 h-6" style={{ color: aqiColor }} />
          </motion.div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-800">Air Quality Index</h2>
              <div 
                className="tooltip cursor-help"
                data-tooltip="Real-time air quality measurement"
              >
                <Info className="w-4 h-4 text-gray-400 hover:text-blue-500 transition-colors duration-200" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">{data.city.name}</span>
            </div>
          </div>
        </div>
        <motion.div 
          className="text-4xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          {aqiEmoji}
        </motion.div>
      </div>

      <div className="text-center mb-6">
        {/* AQI Circle with Ring */}
        <div className="relative inline-flex items-center justify-center mb-4">
          {/* Background ring */}
          <div className="w-36 h-36 rounded-full bg-gray-200"></div>
          
          {/* Progress ring */}
          <svg className="absolute w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="64"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            <motion.circle
              cx="72"
              cy="72"
              r="64"
              stroke={aqiColor}
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 64}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 64 * (1 - aqiPercentage / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="drop-shadow-lg"
            />
          </svg>
          
          {/* AQI Value */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <span className="text-4xl font-bold" style={{ color: aqiColor }}>
              {data.aqi}
            </span>
          </motion.div>
        </div>

        <motion.h3 
          className="text-2xl font-bold mb-2"
          style={{ color: aqiColor }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {aqiLevel}
        </motion.h3>
        
        <motion.div 
          className="flex items-center justify-center gap-2 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">
            Updated: {new Date(data.time.s).toLocaleString()}
          </span>
        </motion.div>
      </div>

      {/* Sub-factors */}
      {data.iaqi && Object.keys(data.iaqi).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mb-6"
        >
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Pollutants</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(data.iaqi)
              .filter(([key, value]) => ['pm25', 'pm10', 'no2', 'o3'].includes(key) && value?.v !== undefined)
              .slice(0, 4)
              .map(([pollutant, value], index) => (
                <motion.div
                  key={pollutant}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-3 text-center"
                >
                  <div className="text-xs font-medium text-gray-600 mb-1">
                    {pollutant.toUpperCase()}
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    {value.v}
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}

      {data.dominentpol && (
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <span className="inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-md">
            <AlertCircle className="w-4 h-4 mr-2" />
            Dominant Pollutant: {data.dominentpol.toUpperCase()}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};