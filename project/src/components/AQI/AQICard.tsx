import React from 'react';
import { Activity, MapPin, Clock } from 'lucide-react';
import { AQIData } from '../../types/air-quality';
import { getAQILevel, getAQIColor, getAQIBackgroundColor, getAQIEmoji } from '../../utils/air-quality';

interface AQICardProps {
  data: AQIData;
  isLoading?: boolean;
}

export const AQICard: React.FC<AQICardProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-16 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const aqiColor = getAQIColor(data.aqi);
  const aqiBgColor = getAQIBackgroundColor(data.aqi);
  const aqiLevel = getAQILevel(data.aqi);
  const aqiEmoji = getAQIEmoji(data.aqi);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-full" style={{ backgroundColor: aqiBgColor }}>
            <Activity className="w-6 h-6" style={{ color: aqiColor }} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Air Quality Index</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{data.city.name}</span>
            </div>
          </div>
        </div>
        <div className="text-4xl">{aqiEmoji}</div>
      </div>

      <div className="text-center mb-6">
        <div 
          className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-4 border-4 border-white shadow-lg"
          style={{ backgroundColor: aqiBgColor }}
        >
          <span className="text-4xl font-bold" style={{ color: aqiColor }}>
            {data.aqi}
          </span>
        </div>
        <h3 className="text-2xl font-bold mb-2" style={{ color: aqiColor }}>
          {aqiLevel}
        </h3>
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Clock className="w-4 h-4" />
          <span className="text-sm">
            Updated: {new Date(data.time.s).toLocaleString()}
          </span>
        </div>
      </div>

      {data.dominentpol && (
        <div className="text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
            Dominant Pollutant: {data.dominentpol.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
};