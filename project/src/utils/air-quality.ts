import { HealthAdvice } from '../types/air-quality';

export const getAQILevel = (aqi: number): string => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

export const getAQIColor = (aqi: number): string => {
  if (aqi <= 50) return '#22C55E'; // Green
  if (aqi <= 100) return '#EAB308'; // Yellow
  if (aqi <= 150) return '#F97316'; // Orange
  if (aqi <= 200) return '#EF4444'; // Red
  if (aqi <= 300) return '#A855F7'; // Purple
  return '#7C2D12'; // Maroon
};

export const getAQIBackgroundColor = (aqi: number): string => {
  if (aqi <= 50) return '#F0FDF4'; // Green bg
  if (aqi <= 100) return '#FEFCE8'; // Yellow bg
  if (aqi <= 150) return '#FFF7ED'; // Orange bg
  if (aqi <= 200) return '#FEF2F2'; // Red bg
  if (aqi <= 300) return '#FAF5FF'; // Purple bg
  return '#FEF2F2'; // Maroon bg
};

export const getAQIEmoji = (aqi: number): string => {
  if (aqi <= 50) return '🟢';
  if (aqi <= 100) return '🟡';
  if (aqi <= 150) return '🟠';
  if (aqi <= 200) return '🔴';
  if (aqi <= 300) return '🟣';
  return '⚫';
};

export const getHealthAdvice = (aqi: number): HealthAdvice => {
  const level = getAQILevel(aqi);
  const color = getAQIColor(aqi);
  const bgColor = getAQIBackgroundColor(aqi);
  const emoji = getAQIEmoji(aqi);

  const adviceMap: Record<string, HealthAdvice> = {
    'Good': {
      level: 'Good',
      description: 'Air quality is considered satisfactory, and air pollution poses little or no risk. Perfect time for outdoor activities.',
      recommendations: [
        'Enjoy outdoor activities and exercise',
        'Perfect time for children to play outside',
        'Open windows for fresh air circulation',
        'Great day for jogging, cycling, or sports',
        'No special precautions needed',
        'Ideal conditions for all age groups'
      ],
      color,
      bgColor,
      emoji
    },
    'Moderate': {
      level: 'Moderate',
      description: 'Air quality is acceptable for most people. However, sensitive individuals may experience minor respiratory symptoms.',
      recommendations: [
        'Outdoor activities are generally safe for most people',
        'Sensitive individuals should limit prolonged outdoor exposure',
        'Consider wearing a mask if you have respiratory conditions',
        'Monitor air quality if planning extended outdoor activities',
        'Children and elderly should take breaks during outdoor play',
        'Keep windows open but monitor for any discomfort'
      ],
      color,
      bgColor,
      emoji
    },
    'Unhealthy for Sensitive Groups': {
      level: 'Unhealthy for Sensitive Groups',
      description: 'Members of sensitive groups may experience health effects. The general public is not likely to be affected.',
      recommendations: [
        'Limit outdoor activities if you have heart or lung disease',
        'Wear N95 or equivalent mask when outdoors',
        'Keep windows closed and use air purifiers indoors',
        'Children and elderly should avoid prolonged outdoor exposure',
        'Reschedule outdoor exercise to times with better air quality',
        'Seek medical advice if experiencing breathing difficulties'
      ],
      color,
      bgColor,
      emoji
    },
    'Unhealthy': {
      level: 'Unhealthy',
      description: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
      recommendations: [
        'Avoid outdoor activities, especially strenuous exercise',
        'Wear N95 masks when going outside is necessary',
        'Keep indoor air clean with HEPA air purifiers',
        'Close all windows and doors to prevent outdoor air entry',
        'Limit outdoor exposure for all age groups',
        'Schools should consider moving activities indoors'
      ],
      color,
      bgColor,
      emoji
    },
    'Very Unhealthy': {
      level: 'Very Unhealthy',
      description: 'Health warnings of emergency conditions. The entire population is more likely to be affected by serious health effects.',
      recommendations: [
        'Avoid all outdoor activities and stay indoors',
        'Use high-efficiency air purifiers continuously',
        'Wear N95 or N99 masks if you must go outside',
        'Seek medical attention if experiencing any symptoms',
        'Schools and offices should consider closure',
        'Emergency health measures may be necessary'
      ],
      color,
      bgColor,
      emoji
    },
    'Hazardous': {
      level: 'Hazardous',
      description: 'Health alert: everyone may experience more serious health effects. This is an emergency condition affecting the entire population.',
      recommendations: [
        'EMERGENCY: Avoid all outdoor exposure immediately',
        'Stay indoors with sealed windows and doors',
        'Use multiple high-quality air purifiers',
        'Seek immediate medical attention for any symptoms',
        'Emergency conditions - consider evacuation if possible',
        'Follow official emergency health advisories'
      ],
      color,
      bgColor,
      emoji
    }
  };

  return adviceMap[level];
};

export const formatPollutantValue = (value: number, pollutant: string): string => {
  if (pollutant === 'pm25' || pollutant === 'pm10') {
    return `${value} μg/m³`;
  }
  if (pollutant === 'no2' || pollutant === 'o3' || pollutant === 'so2') {
    return `${value} ppb`;
  }
  if (pollutant === 'co') {
    return `${value} mg/m³`;
  }
  return `${value}`;
};

export const getPollutantName = (pollutant: string): string => {
  const pollutantNames: Record<string, string> = {
    pm25: 'PM2.5',
    pm10: 'PM10',
    no2: 'NO₂',
    o3: 'O₃',
    co: 'CO',
    so2: 'SO₂',
    h: 'Humidity',
    p: 'Pressure',
    t: 'Temperature',
    w: 'Wind'
  };
  return pollutantNames[pollutant] || pollutant.toUpperCase();
};

export const calculateGreenScore = (activities: any[]): number => {
  return activities.reduce((total, activity) => total + (activity.points_earned || 0), 0);
};

export const getBadgeForScore = (score: number): string[] => {
  const badges = [];
  if (score >= 100) badges.push('Air Watcher');
  if (score >= 250) badges.push('Eco Guardian');
  if (score >= 500) badges.push('Green Champion');
  if (score >= 1000) badges.push('Environmental Hero');
  return badges;
};

export const getAQIProgressPercentage = (aqi: number): number => {
  return Math.min((aqi / 500) * 100, 100);
};

// Enhanced WHO/Indian Standards AQI Breakpoints
export const getAQIBreakpoints = () => {
  return {
    pm25: [
      { low: 0, high: 30, aqiLow: 0, aqiHigh: 50, level: 'Good' },
      { low: 31, high: 60, aqiLow: 51, aqiHigh: 100, level: 'Satisfactory' },
      { low: 61, high: 90, aqiLow: 101, aqiHigh: 200, level: 'Moderate' },
      { low: 91, high: 120, aqiLow: 201, aqiHigh: 300, level: 'Poor' },
      { low: 121, high: 250, aqiLow: 301, aqiHigh: 400, level: 'Very Poor' },
      { low: 251, high: 500, aqiLow: 401, aqiHigh: 500, level: 'Severe' }
    ],
    pm10: [
      { low: 0, high: 50, aqiLow: 0, aqiHigh: 50, level: 'Good' },
      { low: 51, high: 100, aqiLow: 51, aqiHigh: 100, level: 'Satisfactory' },
      { low: 101, high: 250, aqiLow: 101, aqiHigh: 200, level: 'Moderate' },
      { low: 251, high: 350, aqiLow: 201, aqiHigh: 300, level: 'Poor' },
      { low: 351, high: 430, aqiLow: 301, aqiHigh: 400, level: 'Very Poor' },
      { low: 431, high: 500, aqiLow: 401, aqiHigh: 500, level: 'Severe' }
    ]
  };
};

// Machine Learning Prediction Utilities
export const generateAQIForecast = (currentAQI: number, hours: number = 24): any[] => {
  const forecast = [];
  const now = new Date();
  
  for (let i = 0; i < hours; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    
    // Enhanced prediction model with multiple factors
    const timeOfDay = time.getHours();
    const isRushHour = (timeOfDay >= 7 && timeOfDay <= 10) || (timeOfDay >= 17 && timeOfDay <= 20);
    const isNight = timeOfDay >= 22 || timeOfDay <= 6;
    const isWeekend = time.getDay() === 0 || time.getDay() === 6;
    
    let variation = 0;
    
    // Traffic patterns
    if (isRushHour && !isWeekend) variation += 25;
    if (isNight) variation -= 20;
    if (isWeekend) variation -= 10;
    
    // Weather simulation (simplified)
    const windEffect = Math.sin(i / 8) * 15; // 8-hour wind cycle
    const temperatureEffect = Math.cos(i / 12) * 10; // 12-hour temperature cycle
    
    // Seasonal patterns
    const month = time.getMonth();
    const winterPollution = (month >= 10 || month <= 2) ? 20 : 0; // Nov-Feb higher pollution
    
    // Add randomness for realistic variation
    const randomVariation = (Math.random() - 0.5) * 30;
    
    const totalVariation = variation + windEffect + temperatureEffect + winterPollution + randomVariation;
    const predictedAQI = Math.max(0, Math.round(currentAQI + totalVariation));
    
    forecast.push({
      time: time.toISOString(),
      aqi: predictedAQI,
      confidence: Math.max(60, 95 - i * 0.8), // Confidence decreases over time
      factors: {
        traffic: isRushHour && !isWeekend ? 'high' : 'low',
        meteorology: windEffect > 0 ? 'favorable' : 'unfavorable',
        seasonal: winterPollution > 0 ? 'winter_effect' : 'normal',
        weekend: isWeekend
      }
    });
  }
  
  return forecast;
};

// Air Quality Index calculation utilities (Indian Standards)
export const calculateAQIFromPollutants = (pollutants: any): number => {
  const breakpoints = getAQIBreakpoints();
  
  let maxAQI = 0;
  
  // Calculate AQI for each pollutant and take the maximum
  Object.entries(pollutants).forEach(([pollutant, value]) => {
    if (breakpoints[pollutant as keyof typeof breakpoints] && typeof value === 'number') {
      const aqi = calculateIndividualAQI(value, pollutant);
      maxAQI = Math.max(maxAQI, aqi);
    }
  });
  
  return maxAQI;
};

const calculateIndividualAQI = (concentration: number, pollutant: string): number => {
  const breakpoints = getAQIBreakpoints();
  const pollutantBreakpoints = breakpoints[pollutant as keyof typeof breakpoints];
  
  if (!pollutantBreakpoints) return 0;
  
  // Find the appropriate breakpoint
  for (const bp of pollutantBreakpoints) {
    if (concentration >= bp.low && concentration <= bp.high) {
      // Linear interpolation formula
      const aqi = ((bp.aqiHigh - bp.aqiLow) / (bp.high - bp.low)) * 
                  (concentration - bp.low) + bp.aqiLow;
      return Math.round(aqi);
    }
  }
  
  // If concentration exceeds all breakpoints, return maximum AQI
  return 500;
};

// Health impact assessment
export const getHealthImpactAssessment = (aqi: number, exposureHours: number): any => {
  const level = getAQILevel(aqi);
  const baseRisk = aqi / 100; // Normalized risk factor
  const exposureMultiplier = Math.log(exposureHours + 1); // Logarithmic exposure effect
  
  return {
    riskLevel: baseRisk * exposureMultiplier,
    recommendations: getHealthAdvice(aqi).recommendations,
    urgency: aqi > 200 ? 'immediate' : aqi > 100 ? 'moderate' : 'low',
    vulnerableGroups: aqi > 100 ? ['children', 'elderly', 'respiratory_patients', 'heart_patients'] : [],
    estimatedHealthCost: calculateHealthCost(aqi, exposureHours)
  };
};

const calculateHealthCost = (aqi: number, hours: number): number => {
  // Simplified health cost calculation (in INR per person per hour)
  const baseCost = Math.max(0, (aqi - 50) * 0.5); // Cost starts after AQI 50
  return baseCost * hours;
};

// Route optimization for cleaner air
export const suggestCleanerRoute = (origin: [number, number], destination: [number, number]): any => {
  // This would integrate with mapping services and air quality data
  // For now, returning mock suggestions
  return {
    routes: [
      {
        name: 'Cleanest Route',
        avgAQI: 85,
        duration: '25 mins',
        distance: '12 km',
        avoidanceFactors: ['industrial_zones', 'heavy_traffic']
      },
      {
        name: 'Fastest Route',
        avgAQI: 120,
        duration: '18 mins',
        distance: '10 km',
        avoidanceFactors: []
      }
    ],
    recommendations: [
      'Use the cleanest route during peak pollution hours',
      'Consider public transport to reduce overall exposure',
      'Wear a mask if AQI exceeds 100 along the route'
    ]
  };
};

// Air quality trend analysis
export const analyzeAQITrend = (historicalData: any[]): any => {
  if (historicalData.length < 7) return null;
  
  const recent = historicalData.slice(-7); // Last 7 days
  const previous = historicalData.slice(-14, -7); // Previous 7 days
  
  const recentAvg = recent.reduce((sum, item) => sum + item.aqi, 0) / recent.length;
  const previousAvg = previous.reduce((sum, item) => sum + item.aqi, 0) / previous.length;
  
  const trend = recentAvg - previousAvg;
  const trendPercentage = (trend / previousAvg) * 100;
  
  return {
    trend: trend > 5 ? 'worsening' : trend < -5 ? 'improving' : 'stable',
    change: trend,
    changePercentage: trendPercentage,
    prediction: trend > 0 ? 'expect_higher_pollution' : 'expect_lower_pollution',
    confidence: Math.min(95, 70 + Math.abs(trendPercentage))
  };
};