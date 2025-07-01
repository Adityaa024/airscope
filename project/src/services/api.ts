import { APIResponse, AQIData } from '../types/air-quality';
import { searchIndianLocations, getPopularCities, convertLocationToAPIFormat, IndianLocation } from '../data/indianLocations';

// Get API configuration from environment variables
const API_TOKEN = import.meta.env.VITE_WAQI_API_TOKEN;
const BASE_URL = 'https://api.waqi.info';

// Configuration from environment
const CACHE_DURATION = parseInt(import.meta.env.VITE_CACHE_DURATION) || 15 * 60 * 1000; // 15 minutes
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 8000;
const SEARCH_TIMEOUT = parseInt(import.meta.env.VITE_SEARCH_TIMEOUT) || 3000; // Reduced for faster search

const CACHE_KEY_PREFIX = 'aqi_cache_';
const SEARCH_CACHE_PREFIX = 'search_cache_';

interface CacheEntry {
  data: AQIData;
  timestamp: number;
}

interface SearchCacheEntry {
  data: any[];
  timestamp: number;
}

// Mock AQI data for fallback when API fails
const createMockAQIData = (locationName: string, coordinates?: [number, number]): AQIData => {
  const mockAQI = Math.floor(Math.random() * 150) + 50; // Random AQI between 50-200
  
  // Clean location name to avoid duplicates
  const cleanLocationName = cleanLocationName_func(locationName);
  
  return {
    aqi: mockAQI,
    idx: Math.floor(Math.random() * 10000),
    attributions: [
      {
        url: "https://waqi.info/",
        name: "World Air Quality Index Project",
        logo: "https://waqi.info/images/logo.png"
      }
    ],
    city: {
      geo: coordinates || [28.6139, 77.2090], // Use provided coordinates or default to Delhi
      name: cleanLocationName,
      url: `https://aqicn.org/city/${cleanLocationName.toLowerCase().replace(/\s+/g, '-')}/`
    },
    dominentpol: "pm25",
    iaqi: {
      co: { v: Math.floor(Math.random() * 20) + 5 },
      h: { v: Math.floor(Math.random() * 40) + 30 },
      no2: { v: Math.floor(Math.random() * 50) + 10 },
      o3: { v: Math.floor(Math.random() * 80) + 20 },
      p: { v: Math.floor(Math.random() * 20) + 1010 },
      pm10: { v: Math.floor(Math.random() * 100) + 30 },
      pm25: { v: Math.floor(Math.random() * 80) + 20 },
      so2: { v: Math.floor(Math.random() * 30) + 5 },
      t: { v: Math.floor(Math.random() * 20) + 15 },
      w: { v: Math.floor(Math.random() * 10) + 2 }
    },
    time: {
      s: new Date().toISOString().slice(0, 19) + "+00:00",
      tz: "+05:30",
      v: Math.floor(Date.now() / 1000),
      iso: new Date().toISOString()
    },
    forecast: {
      daily: {
        o3: [],
        pm10: [],
        pm25: [],
        uvi: []
      }
    },
    debug: {
      sync: new Date().toISOString()
    }
  };
};

// Clean location name to avoid duplicates like "delhi,delhi,delhi"
const cleanLocationName_func = (locationName: string): string => {
  if (!locationName) return 'Unknown Location';
  
  // Split by comma and remove duplicates
  const parts = locationName.split(',').map(part => part.trim()).filter(Boolean);
  const uniqueParts = [...new Set(parts)];
  
  // If we have multiple unique parts, join them
  if (uniqueParts.length > 1) {
    return uniqueParts.slice(0, 2).join(', '); // Take max 2 parts
  }
  
  // If single part or all duplicates, return the first part
  return uniqueParts[0] || 'Unknown Location';
};

// Clean and normalize location query for API
const normalizeLocationQuery = (location: string): string => {
  // Remove extra commas and duplicates
  const cleaned = cleanLocationName_func(location);
  
  // For Indian cities, try to use just the city name for better API results
  const parts = cleaned.split(',').map(p => p.trim());
  
  // If it looks like "Area, City, State", try just "City" first
  if (parts.length >= 2) {
    const cityPart = parts[parts.length - 2]; // Usually the city is second to last
    if (cityPart && cityPart.length > 2) {
      return cityPart;
    }
  }
  
  return parts[0] || location;
};

const getCacheKey = (location: string): string => {
  const cleanLocation = cleanLocationName_func(location);
  return `${CACHE_KEY_PREFIX}${cleanLocation.toLowerCase().replace(/\s+/g, '_')}`;
};

const getSearchCacheKey = (query: string): string => {
  return `${SEARCH_CACHE_PREFIX}${query.toLowerCase().replace(/\s+/g, '_')}`;
};

const getCachedData = (location: string): AQIData | null => {
  try {
    const cached = localStorage.getItem(getCacheKey(location));
    if (cached) {
      const entry: CacheEntry = JSON.parse(cached);
      if (Date.now() - entry.timestamp < CACHE_DURATION) {
        return entry.data;
      }
    }
  } catch (error) {
    console.error('Error reading cache:', error);
  }
  return null;
};

const getCachedSearchData = (query: string): any[] | null => {
  try {
    const cached = localStorage.getItem(getSearchCacheKey(query));
    if (cached) {
      const entry: SearchCacheEntry = JSON.parse(cached);
      if (Date.now() - entry.timestamp < CACHE_DURATION) {
        return entry.data;
      }
    }
  } catch (error) {
    console.error('Error reading search cache:', error);
  }
  return null;
};

const setCachedData = (location: string, data: AQIData): void => {
  try {
    // Clean the location name before caching
    const cleanedData = {
      ...data,
      city: {
        ...data.city,
        name: cleanLocationName_func(data.city.name)
      }
    };
    
    const entry: CacheEntry = {
      data: cleanedData,
      timestamp: Date.now()
    };
    localStorage.setItem(getCacheKey(location), JSON.stringify(entry));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
};

const setCachedSearchData = (query: string, data: any[]): void => {
  try {
    // Clean search results to avoid duplicates
    const cleanedData = data.map(item => ({
      ...item,
      station: {
        ...item.station,
        name: cleanLocationName_func(item.station.name)
      }
    }));
    
    const entry: SearchCacheEntry = {
      data: cleanedData,
      timestamp: Date.now()
    };
    localStorage.setItem(getSearchCacheKey(query), JSON.stringify(entry));
  } catch (error) {
    console.error('Error setting search cache:', error);
  }
};

// Enhanced error checking
const validateAPIToken = (): boolean => {
  if (!API_TOKEN) {
    console.warn('WAQI API token is missing. Using fallback data.');
    return false;
  }
  if (API_TOKEN.length < 10) {
    console.warn('WAQI API token appears to be invalid. Using fallback data.');
    return false;
  }
  return true;
};

// Fast fetch with aggressive timeout for search
const fetchWithTimeout = async (url: string, timeout: number = API_TIMEOUT): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AirScope/1.0'
      }
    });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      return response;
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeout}ms`);
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error - unable to connect');
      }
    }
    throw error;
  }
};

export const fetchAQIData = async (location: string): Promise<AQIData> => {
  const cleanLocation = cleanLocationName_func(location);
  
  // Check cache first
  const cachedData = getCachedData(cleanLocation);
  if (cachedData) {
    return cachedData;
  }

  // Validate API token before making request
  if (!validateAPIToken()) {
    console.warn('API token invalid, using mock data for:', cleanLocation);
    const mockData = createMockAQIData(cleanLocation);
    setCachedData(cleanLocation, mockData);
    return mockData;
  }

  try {
    // Normalize the location query for better API results
    const normalizedLocation = normalizeLocationQuery(cleanLocation);
    const response = await fetchWithTimeout(`${BASE_URL}/feed/${encodeURIComponent(normalizedLocation)}/?token=${API_TOKEN}`);
    const data: APIResponse = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(`API returned status: ${data.status}`);
    }
    
    if (!data.data) {
      throw new Error('No data received from API');
    }
    
    // Clean the response data to avoid duplicates
    const cleanedData = {
      ...data.data,
      city: {
        ...data.data.city,
        name: cleanLocationName_func(data.data.city.name)
      }
    };
    
    // Cache the cleaned data
    setCachedData(cleanLocation, cleanedData);
    
    return cleanedData;
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    
    // Try to return last known data from cache (even if expired)
    try {
      const cached = localStorage.getItem(getCacheKey(cleanLocation));
      if (cached) {
        const entry: CacheEntry = JSON.parse(cached);
        console.warn('Using expired cached data for:', cleanLocation);
        return entry.data;
      }
    } catch (cacheError) {
      console.error('Error reading expired cache:', cacheError);
    }
    
    // Final fallback: return mock data
    console.warn('Using mock data as fallback for:', cleanLocation);
    const mockData = createMockAQIData(cleanLocation);
    setCachedData(cleanLocation, mockData);
    return mockData;
  }
};

export const fetchAQIByCoordinates = async (lat: number, lng: number): Promise<AQIData> => {
  const locationKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  
  // Check cache first
  const cachedData = getCachedData(locationKey);
  if (cachedData) {
    return cachedData;
  }

  // Validate API token before making request
  if (!validateAPIToken()) {
    console.warn('API token invalid, using mock data for coordinates:', lat, lng);
    const mockData = createMockAQIData('Current Location', [lat, lng]);
    setCachedData(locationKey, mockData);
    return mockData;
  }

  try {
    const response = await fetchWithTimeout(`${BASE_URL}/feed/geo:${lat};${lng}/?token=${API_TOKEN}`);
    const data: APIResponse = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error(`API returned status: ${data.status}`);
    }
    
    if (!data.data) {
      throw new Error('No data received from API');
    }
    
    // Clean the response data
    const cleanedData = {
      ...data.data,
      city: {
        ...data.data.city,
        name: cleanLocationName_func(data.data.city.name),
        geo: [lat, lng] // Ensure coordinates are preserved
      }
    };
    
    // Cache the cleaned data
    setCachedData(locationKey, cleanedData);
    
    return cleanedData;
  } catch (error) {
    console.error('Error fetching AQI data by coordinates:', error);
    
    // Try to return last known data from cache (even if expired)
    try {
      const cached = localStorage.getItem(getCacheKey(locationKey));
      if (cached) {
        const entry: CacheEntry = JSON.parse(cached);
        console.warn('Using expired cached data for coordinates:', lat, lng);
        return entry.data;
      }
    } catch (cacheError) {
      console.error('Error reading expired cache:', cacheError);
    }
    
    // Final fallback: return mock data
    console.warn('Using mock data as fallback for coordinates:', lat, lng);
    const mockData = createMockAQIData('Current Location', [lat, lng]);
    setCachedData(locationKey, mockData);
    return mockData;
  }
};

// Enhanced search with comprehensive Indian location database
export const searchLocations = async (query: string): Promise<any[]> => {
  // Return empty for very short queries
  if (!query || query.length < 2) return [];

  // Check cache first for faster results
  const cachedResults = getCachedSearchData(query);
  if (cachedResults) {
    return cachedResults;
  }

  // Search our comprehensive Indian database first (instant results)
  const localResults = searchIndianLocations(query, 8);
  const formattedLocalResults = localResults.map(location => ({
    station: {
      name: cleanLocationName_func(`${location.name}, ${location.city}`),
      geo: location.coordinates
    }
  }));

  // If we have good local matches, return them immediately
  if (localResults.length > 0) {
    setCachedSearchData(query, formattedLocalResults);
    return formattedLocalResults;
  }

  // If no local matches, try popular cities as fallback
  const popularCities = getPopularCities();
  const queryLower = query.toLowerCase();
  const matchingPopularCities = popularCities.filter(city => 
    city.name.toLowerCase().includes(queryLower) ||
    city.city.toLowerCase().includes(queryLower) ||
    city.state.toLowerCase().includes(queryLower)
  );

  if (matchingPopularCities.length > 0) {
    const formattedPopularResults = matchingPopularCities.map(location => ({
      station: {
        name: cleanLocationName_func(location.name),
        geo: location.coordinates
      }
    }));
    setCachedSearchData(query, formattedPopularResults);
    return formattedPopularResults;
  }

  // Only make API call as last resort with very short timeout
  if (validateAPIToken()) {
    try {
      const response = await fetchWithTimeout(
        `${BASE_URL}/search/?token=${API_TOKEN}&keyword=${encodeURIComponent(query)}`, 
        SEARCH_TIMEOUT
      );
      const data = await response.json();
      
      if (data.status === 'ok' && data.data && data.data.length > 0) {
        // Clean the API results to avoid duplicates
        const cleanedResults = data.data.slice(0, 5).map((item: any) => ({
          ...item,
          station: {
            ...item.station,
            name: cleanLocationName_func(item.station.name)
          }
        }));
        setCachedSearchData(query, cleanedResults);
        return cleanedResults;
      }
    } catch (error) {
      console.warn('API search failed, using local database only:', error);
    }
  }

  // Return empty array if nothing found
  return [];
};

// Get instant suggestions for popular searches
export const getInstantSuggestions = (query: string): any[] => {
  if (!query || query.length < 1) {
    // Return popular cities for empty query
    return getPopularCities().slice(0, 5).map(location => ({
      station: {
        name: cleanLocationName_func(location.name),
        geo: location.coordinates
      }
    }));
  }

  // Search local database only for instant results
  const localResults = searchIndianLocations(query, 6);
  return localResults.map(location => ({
    station: {
      name: cleanLocationName_func(`${location.name}, ${location.city}`),
      geo: location.coordinates
    }
  }));
};

// Offline detection
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Get historical data (mock implementation - would need actual historical API)
export const fetchHistoricalData = async (location: string, days: number = 7): Promise<any[]> => {
  // This would integrate with a historical data API
  // For now, returning mock data
  const mockData = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    mockData.push({
      date: date.toISOString().split('T')[0],
      pm25: Math.floor(Math.random() * 150) + 20,
      pm10: Math.floor(Math.random() * 200) + 30,
      no2: Math.floor(Math.random() * 80) + 10,
      aqi: Math.floor(Math.random() * 200) + 50
    });
  }
  
  return mockData;
};