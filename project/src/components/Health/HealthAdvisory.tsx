import React from 'react';
import { Shield, AlertTriangle, Heart, VenetianMask as Mask } from 'lucide-react';
import { HealthAdvice } from '../../types/air-quality';

interface HealthAdvisoryProps {
  advice: HealthAdvice;
}

export const HealthAdvisory: React.FC<HealthAdvisoryProps> = ({ advice }) => {
  const getIcon = () => {
    if (advice.level === 'Good') return <Shield className="w-6 h-6" />;
    if (advice.level === 'Moderate') return <Heart className="w-6 h-6" />;
    if (['Unhealthy for Sensitive Groups', 'Unhealthy'].includes(advice.level)) return <Mask className="w-6 h-6" />;
    return <AlertTriangle className="w-6 h-6" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="p-3 rounded-full flex items-center justify-center"
          style={{ backgroundColor: advice.bgColor, color: advice.color }}
        >
          {getIcon()}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Health Advisory</h3>
          <div className="flex items-center gap-2">
            <span 
              className="text-sm font-medium"
              style={{ color: advice.color }}
            >
              {advice.level}
            </span>
            <span className="text-lg">{advice.emoji}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-6 leading-relaxed">
        {advice.description}
      </p>

      <div>
        <h4 className="font-semibold text-gray-800 mb-3">Recommendations:</h4>
        <ul className="space-y-2">
          {advice.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start gap-3">
              <div 
                className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                style={{ backgroundColor: advice.color }}
              ></div>
              <span className="text-gray-600 text-sm leading-relaxed">
                {recommendation}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};