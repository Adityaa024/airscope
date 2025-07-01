// Data.gov.in API service for Indian AQI data
export interface DataGovAPIResponse {
  status: string;
  total: number;
  count: number;
  message: string;
  records: DataGovRecord[];
}

export interface DataGovRecord {
  id: string;
  station: string;
  city: string;
  state: string;
  agency: string;
  last_update: string;
  pollutant_id: string;
  pollutant_min: string;
  pollutant_max: string;
  pollutant_avg: string;
  pollutant_unit: string;
  type: string;
}

export interface ProcessedAQIData {
  station: string;
  city: string;
  state: string;
  agency: string;
  lastUpdate: string;
  pollutants: {
    [key: string]: {
      min: number;
      max: number;
      avg: number;
      unit: string;
    };
  };
  aqi: number;
  level: string;
  coordinates?: [number, number];
}

// Get API configuration from environment variables
const DATA_GOV_API_KEY = import.meta.env.VITE_DATAGOV_API_KEY;
const DATA_GOV_BASE_URL = 'https://api.data.gov.in/resource/7c3c0e24-d74a-4ee8-922e-43509f20c1cf';
const CACHE_DURATION = parseInt(import.meta.env.VITE_CACHE_DURATION) || 5 * 60 * 1000; // 5 minutes
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000; // 10 seconds

// Cache management for data.gov.in API
const DATAGOV_CACHE_PREFIX = 'datagov_aqi_';

interface DataGovCacheEntry {
  data: ProcessedAQIData[];
  timestamp: number;
}

const getDataGovCacheKey = (city: string): string => {
  return `${DATAGOV_CACHE_PREFIX}${city.toLowerCase().replace(/\s+/g, '_')}`;
};

const getCachedDataGovData = (city: string): ProcessedAQIData[] | null => {
  try {
    const cached = localStorage.getItem(getDataGovCacheKey(city));
    if (cached) {
      const entry: DataGovCacheEntry = JSON.parse(cached);
      if (Date.now() - entry.timestamp < CACHE_DURATION) {
        return entry.data;
      }
    }
  } catch (error) {
    console.error('Error reading data.gov.in cache:', error);
  }
  return null;
};

const setCachedDataGovData = (city: string, data: ProcessedAQIData[]): void => {
  try {
    const entry: DataGovCacheEntry = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(getDataGovCacheKey(city), JSON.stringify(entry));
  } catch (error) {
    console.error('Error setting data.gov.in cache:', error);
  }
};

// Enhanced fetch with timeout and better error handling
const fetchWithTimeout = async (url: string, timeout: number = API_TIMEOUT): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'AirScope/1.0'
      },
      mode: 'cors' // Explicitly set CORS mode
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - data.gov.in server not responding');
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error - unable to connect to data.gov.in');
      }
    }
    throw error;
  }
};

// Calculate AQI from pollutant concentrations (Indian standards)
const calculateAQI = (pollutants: any): number => {
  let maxAQI = 0;
  
  // PM2.5 breakpoints (Indian standards)
  if (pollutants.pm25) {
    const pm25 = pollutants.pm25.avg;
    let aqi = 0;
    if (pm25 <= 30) aqi = (pm25 / 30) * 50;
    else if (pm25 <= 60) aqi = 50 + ((pm25 - 30) / 30) * 50;
    else if (pm25 <= 90) aqi = 100 + ((pm25 - 60) / 30) * 100;
    else if (pm25 <= 120) aqi = 200 + ((pm25 - 90) / 30) * 100;
    else if (pm25 <= 250) aqi = 300 + ((pm25 - 120) / 130) * 100;
    else aqi = 400 + ((pm25 - 250) / 250) * 100;
    maxAQI = Math.max(maxAQI, Math.round(aqi));
  }
  
  // PM10 breakpoints (Indian standards)
  if (pollutants.pm10) {
    const pm10 = pollutants.pm10.avg;
    let aqi = 0;
    if (pm10 <= 50) aqi = (pm10 / 50) * 50;
    else if (pm10 <= 100) aqi = 50 + ((pm10 - 50) / 50) * 50;
    else if (pm10 <= 250) aqi = 100 + ((pm10 - 100) / 150) * 100;
    else if (pm10 <= 350) aqi = 200 + ((pm10 - 250) / 100) * 100;
    else if (pm10 <= 430) aqi = 300 + ((pm10 - 350) / 80) * 100;
    else aqi = 400 + ((pm10 - 430) / 70) * 100;
    maxAQI = Math.max(maxAQI, Math.round(aqi));
  }
  
  // NO2 breakpoints
  if (pollutants.no2) {
    const no2 = pollutants.no2.avg;
    let aqi = 0;
    if (no2 <= 40) aqi = (no2 / 40) * 50;
    else if (no2 <= 80) aqi = 50 + ((no2 - 40) / 40) * 50;
    else if (no2 <= 180) aqi = 100 + ((no2 - 80) / 100) * 100;
    else if (no2 <= 280) aqi = 200 + ((no2 - 180) / 100) * 100;
    else if (no2 <= 400) aqi = 300 + ((no2 - 280) / 120) * 100;
    else aqi = 400 + ((no2 - 400) / 100) * 100;
    maxAQI = Math.max(maxAQI, Math.round(aqi));
  }
  
  // O3 breakpoints
  if (pollutants.o3) {
    const o3 = pollutants.o3.avg;
    let aqi = 0;
    if (o3 <= 50) aqi = (o3 / 50) * 50;
    else if (o3 <= 100) aqi = 50 + ((o3 - 50) / 50) * 50;
    else if (o3 <= 168) aqi = 100 + ((o3 - 100) / 68) * 100;
    else if (o3 <= 208) aqi = 200 + ((o3 - 168) / 40) * 100;
    else if (o3 <= 748) aqi = 300 + ((o3 - 208) / 540) * 100;
    else aqi = 400 + ((o3 - 748) / 252) * 100;
    maxAQI = Math.max(maxAQI, Math.round(aqi));
  }
  
  return Math.min(maxAQI, 500); // Cap at 500
};

// Get AQI level based on Indian standards
const getAQILevel = (aqi: number): string => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
};

// Process raw data.gov.in records into structured format
const processDataGovRecords = (records: DataGovRecord[]): ProcessedAQIData[] => {
  const stationMap = new Map<string, any>();
  
  // Group records by station
  records.forEach(record => {
    const stationKey = `${record.station}_${record.city}_${record.state}`;
    
    if (!stationMap.has(stationKey)) {
      stationMap.set(stationKey, {
        station: record.station,
        city: record.city,
        state: record.state,
        agency: record.agency,
        lastUpdate: record.last_update,
        pollutants: {}
      });
    }
    
    const station = stationMap.get(stationKey);
    const pollutantKey = record.pollutant_id.toLowerCase();
    
    station.pollutants[pollutantKey] = {
      min: parseFloat(record.pollutant_min) || 0,
      max: parseFloat(record.pollutant_max) || 0,
      avg: parseFloat(record.pollutant_avg) || 0,
      unit: record.pollutant_unit
    };
    
    // Update last update time to the most recent
    if (new Date(record.last_update) > new Date(station.lastUpdate)) {
      station.lastUpdate = record.last_update;
    }
  });
  
  // Convert to array and calculate AQI for each station
  return Array.from(stationMap.values()).map(station => {
    const aqi = calculateAQI(station.pollutants);
    return {
      ...station,
      aqi,
      level: getAQILevel(aqi)
    };
  });
};

// Fetch AQI data from data.gov.in API with enhanced error handling
export const fetchDataGovAQI = async (city?: string, limit: number = 100): Promise<ProcessedAQIData[]> => {
  // Check cache first
  if (city) {
    const cachedData = getCachedDataGovData(city);
    if (cachedData) {
      console.log(`Using cached data for ${city}`);
      return cachedData;
    }
  }
  
  try {
    let url = `${DATA_GOV_BASE_URL}?api-key=${DATA_GOV_API_KEY}&format=json&limit=${limit}`;
    
    // Add city filter if specified
    if (city) {
      // Clean city name for better matching
      const cleanCity = city.trim().replace(/[^\w\s]/g, '');
      url += `&filters[city]=${encodeURIComponent(cleanCity)}`;
    }
    
    console.log(`Fetching from data.gov.in:`, url);
    
    const response = await fetchWithTimeout(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data: DataGovAPIResponse = await response.json();
    
    console.log('Data.gov.in response:', {
      status: data.status,
      total: data.total,
      count: data.count,
      recordsLength: data.records?.length || 0
    });
    
    if (!data.records || data.records.length === 0) {
      console.warn(`No records found in data.gov.in response for ${city || 'all cities'}`);
      return [];
    }
    
    const processedData = processDataGovRecords(data.records);
    
    // Filter by city if specified and we got broader results
    let filteredData = processedData;
    if (city) {
      const cityLower = city.toLowerCase();
      filteredData = processedData.filter(station => 
        station.city.toLowerCase().includes(cityLower) ||
        station.station.toLowerCase().includes(cityLower)
      );
      
      // If no matches, return all data (user can see available stations)
      if (filteredData.length === 0) {
        filteredData = processedData.slice(0, limit);
      }
    }
    
    // Cache the data if city-specific and we have results
    if (city && filteredData.length > 0) {
      setCachedDataGovData(city, filteredData);
    }
    
    console.log(`Successfully fetched ${filteredData.length} stations`);
    return filteredData;
    
  } catch (error) {
    console.error('Data.gov.in API error:', error);
    
    // Try to return cached data if available
    if (city) {
      const cachedData = getCachedDataGovData(city);
      if (cachedData) {
        console.warn('Using cached data.gov.in data due to API error');
        return cachedData;
      }
    }
    
    // Return empty array instead of throwing to prevent component crash
    return [];
  }
};

// Get available cities from data.gov.in API
export const getAvailableCities = async (): Promise<string[]> => {
  try {
    const data = await fetchDataGovAQI(undefined, 1000); // Get more records to find all cities
    const cities = [...new Set(data.map(station => station.city))];
    return cities.sort();
  } catch (error) {
    console.error('Error fetching available cities:', error);
    // Return common Indian cities as fallback
    return [
      'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
      'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
      'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad',
      'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik'
    ];
  }
};

// Search stations by city or state
export const searchDataGovStations = async (query: string): Promise<ProcessedAQIData[]> => {
  try {
    const allData = await fetchDataGovAQI(undefined, 500);
    const searchTerm = query.toLowerCase();
    
    return allData.filter(station => 
      station.city.toLowerCase().includes(searchTerm) ||
      station.state.toLowerCase().includes(searchTerm) ||
      station.station.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error searching data.gov.in stations:', error);
    return [];
  }
};

// Get station details by city with enhanced matching
export const getStationsByCity = async (city: string): Promise<ProcessedAQIData[]> => {
  return await fetchDataGovAQI(city);
};

// Convert data.gov.in format to our AQI format for compatibility
export const convertToAQIFormat = (dataGovStation: ProcessedAQIData): any => {
  return {
    idx: Math.random() * 1000, // Generate random ID
    aqi: dataGovStation.aqi,
    dominentpol: getDominantPollutant(dataGovStation.pollutants),
    time: {
      s: dataGovStation.lastUpdate,
      tz: '+05:30',
      v: new Date(dataGovStation.lastUpdate).getTime() / 1000
    },
    city: {
      name: `${dataGovStation.station}, ${dataGovStation.city}`,
      geo: dataGovStation.coordinates || [0, 0],
      url: `https://data.gov.in/station/${dataGovStation.station}`
    },
    iaqi: convertPollutantsToIAQI(dataGovStation.pollutants)
  };
};

// Get dominant pollutant
const getDominantPollutant = (pollutants: any): string => {
  let maxAQI = 0;
  let dominantPollutant = 'pm25';
  
  Object.entries(pollutants).forEach(([pollutant, data]: [string, any]) => {
    const aqi = calculateAQI({ [pollutant]: data });
    if (aqi > maxAQI) {
      maxAQI = aqi;
      dominantPollutant = pollutant;
    }
  });
  
  return dominantPollutant;
};

// Convert pollutants to IAQI format
const convertPollutantsToIAQI = (pollutants: any): any => {
  const iaqi: any = {};
  
  Object.entries(pollutants).forEach(([pollutant, data]: [string, any]) => {
    iaqi[pollutant] = { v: Math.round(data.avg) };
  });
  
  return iaqi;
};

// Health check for data.gov.in API with better error handling
export const checkDataGovAPIHealth = async (): Promise<boolean> => {
  try {
    const url = `${DATA_GOV_BASE_URL}?api-key=${DATA_GOV_API_KEY}&format=json&limit=1`;
    const response = await fetchWithTimeout(url, 5000);
    return response.ok;
  } catch (error) {
    console.log('Data.gov.in API health check failed:', error);
    return false;
  }
};

// Get real-time status of the API
export const getAPIStatus = async (): Promise<{
  isOnline: boolean;
  lastChecked: Date;
  responseTime?: number;
}> => {
  const startTime = Date.now();
  
  try {
    const isOnline = await checkDataGovAPIHealth();
    const responseTime = Date.now() - startTime;
    
    return {
      isOnline,
      lastChecked: new Date(),
      responseTime
    };
  } catch (error) {
    return {
      isOnline: false,
      lastChecked: new Date()
    };
  }
};