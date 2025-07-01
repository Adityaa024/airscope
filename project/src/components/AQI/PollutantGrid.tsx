import React from 'react';
import { AQIData } from '../../types/air-quality';
import { formatPollutantValue, getPollutantName, getAQIColor } from '../../utils/air-quality';

interface PollutantGridProps {
  data: AQIData;
}

export const PollutantGrid: React.FC<PollutantGridProps> = ({ data }) => {
  const pollutants = Object.entries(data.iaqi || {}).filter(([key, value]) => 
    ['pm25', 'pm10', 'no2', 'o3', 'co', 'so2'].includes(key) && value?.v !== undefined
  );

  if (pollutants.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Pollutant Breakdown</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {pollutants.map(([pollutant, data], index) => {
          const value = data.v;
          const color = getAQIColor(value);
          
          return (
            <div 
              key={pollutant}
              className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-200 border-l-4"
              style={{ borderLeftColor: color }}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-600 mb-1">
                  {getPollutantName(pollutant)}
                </span>
                <span className="text-2xl font-bold" style={{ color }}>
                  {value}
                </span>
                <span className="text-xs text-gray-500">
                  {formatPollutantValue(value, pollutant)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};