import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AQIData } from '../types/air-quality';
import { getAQIColor } from '../utils/air-quality';

interface ForecastChartProps {
  data: AQIData;
}

export const ForecastChart: React.FC<ForecastChartProps> = ({ data }) => {
  if (!data.forecast?.daily) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Forecast</h3>
        <div className="text-center py-8 text-gray-500">
          <p>Forecast data not available for this location.</p>
        </div>
      </div>
    );
  }

  const chartData = data.forecast.daily.pm25.map((pm25Data, index) => {
    const pm10Data = data.forecast.daily.pm10?.[index];
    return {
      day: new Date(pm25Data.day).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      PM25: pm25Data.avg,
      PM10: pm10Data?.avg || 0,
      PM25_Max: pm25Data.max,
      PM25_Min: pm25Data.min,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value} μg/m³
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">7-Day Forecast</h3>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              label={{ value: 'μg/m³', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="PM25" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="PM10" 
              stroke="#f97316" 
              strokeWidth={3}
              dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="text-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
          <span className="text-sm font-medium text-gray-700">PM2.5</span>
        </div>
        <div className="text-center">
          <div className="w-4 h-4 bg-orange-500 rounded-full mx-auto mb-2"></div>
          <span className="text-sm font-medium text-gray-700">PM10</span>
        </div>
      </div>
    </div>
  );
};