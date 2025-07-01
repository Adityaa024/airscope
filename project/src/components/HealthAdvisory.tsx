import React, { useState } from 'react';
import { HealthAdvice, AQIData } from '../types/air-quality';
import { HealthDashboard } from './HealthAdvisory/HealthDashboard';
import { useLocation } from '../contexts/LocationContext';

interface HealthAdvisoryProps {
  advice: HealthAdvice;
}

export const HealthAdvisory: React.FC<HealthAdvisoryProps> = ({ advice }) => {
  const { aqiData, locationName } = useLocation();

  if (!aqiData) {
    return null;
  }

  return (
    <HealthDashboard 
      aqiData={aqiData} 
      advice={advice} 
      locationName={locationName}
    />
  );
};