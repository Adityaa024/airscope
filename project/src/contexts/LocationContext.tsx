import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchAQIData, fetchAQIByCoordinates, fetchHistoricalData } from '../services/api';
import { AQIData } from '../types/air-quality';
import toast from 'react-hot-toast';

interface LocationContextType {
  currentLocation: [number, number] | null;
  searchedLocation: [number, number] | null;
  locationName: string;
  aqiData: AQIData | null;
  isLoading: boolean;
  error: string | null;
  setCurrentLocation: (coords: [number, number]) => void;
  setSearchedLocation: (coords: [number, number], name: string) => void;
  loadLocationData: (location: string) => Promise<void>;
  loadCurrentLocationData: () => Promise<void>;
  clearError: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

// Clean location name to avoid duplicates like "delhi,delhi,delhi"
const cleanLocationName = (locationName: string): string => {
  if (!locationName) return 'Unknown Location';
  
  // Split by comma and remove duplicates
  const parts = locationName.split(',').map(part => part.trim()).filter(Boolean);
  const uniqueParts = [...new Set(parts)];
  
  // If we have multiple unique parts, join them (max 2)
  if (uniqueParts.length > 1) {
    return uniqueParts.slice(0, 2).join(', ');
  }
  
  // If single part or all duplicates, return the first part
  return uniqueParts[0] || 'Unknown Location';
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocationState] = useState<[number, number] | null>(null);
  const [searchedLocation, setSearchedLocationState] = useState<[number, number] | null>(null);
  const [locationName, setLocationName] = useState<string>('Delhi');
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved location on app start
  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized) return;
    
    const savedLocation = localStorage.getItem('currentLocation');
    const savedLocationName = localStorage.getItem('locationName');
    
    if (savedLocation) {
      try {
        const coords = JSON.parse(savedLocation);
        setCurrentLocationState(coords);
        if (savedLocationName) {
          const cleanName = cleanLocationName(savedLocationName);
          setLocationName(cleanName);
        }
      } catch (error) {
        console.error('Error loading saved location:', error);
      }
    }
    
    // Load default data silently
    loadLocationDataSilently('Delhi');
    setIsInitialized(true);
  }, [isInitialized]);

  const setCurrentLocation = (coords: [number, number]) => {
    setCurrentLocationState(coords);
    setSearchedLocationState(null);
    localStorage.setItem('currentLocation', JSON.stringify(coords));
    localStorage.setItem('locationName', 'Current Location');
    setLocationName('Current Location');
  };

  const setSearchedLocation = (coords: [number, number], name: string) => {
    const cleanName = cleanLocationName(name);
    setSearchedLocationState(coords);
    setCurrentLocationState(null);
    localStorage.setItem('currentLocation', JSON.stringify(coords));
    localStorage.setItem('locationName', cleanName);
    setLocationName(cleanName);
  };

  // Silent loading for initialization (no toasts)
  const loadLocationDataSilently = async (location: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchAQIData(location);
      setAqiData(data);
      const cleanName = cleanLocationName(data.city.name);
      setLocationName(cleanName);
      
      // If the data has coordinates, save them as searched location
      if (data.city.geo && data.city.geo[0] && data.city.geo[1]) {
        setSearchedLocation(data.city.geo, cleanName);
      }
    } catch (err) {
      // More specific error handling
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error loading AQI data:', errorMessage);
      
      // Don't set error state during silent initialization - the API service now provides fallback data
      // The app should continue working with mock/cached data
      if (errorMessage.includes('Network error') || errorMessage.includes('timeout')) {
        console.warn('Network issues detected, app will use cached/mock data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocationData = async (location: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchAQIData(location);
      setAqiData(data);
      const cleanName = cleanLocationName(data.city.name);
      setLocationName(cleanName);
      
      // If the data has coordinates, save them as searched location
      if (data.city.geo && data.city.geo[0] && data.city.geo[1]) {
        setSearchedLocation(data.city.geo, cleanName);
      }
      
      // Only show success toast for user-initiated actions
      if (isInitialized) {
        toast.success(`Loaded data for ${cleanName}`);
      }
    } catch (err) {
      // More specific error handling
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error loading AQI data:', errorMessage);
      
      // Since the API service now provides fallback data, we shouldn't reach this point
      // But if we do, provide a user-friendly message
      if (errorMessage.includes('Network error') || errorMessage.includes('timeout')) {
        setError('Network connection issues. Using cached data where available.');
        if (isInitialized) {
          toast.error('Network issues - using cached data');
        }
      } else if (errorMessage.includes('API returned status: error')) {
        setError('Unable to find data for this location. Try a different search term.');
        if (isInitialized) {
          toast.error('Location not found - try a different search');
        }
      } else {
        setError('Unable to load fresh data. Using available cached information.');
        if (isInitialized) {
          toast.error('Using cached data - refresh may help');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadCurrentLocationData = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      if (isInitialized) {
        toast.error('Geolocation not supported');
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const coords: [number, number] = [latitude, longitude];
          
          const data = await fetchAQIByCoordinates(latitude, longitude);
          setAqiData(data);
          setCurrentLocation(coords);
          
          if (isInitialized) {
            toast.success('Location found! Loading air quality data...');
          }
        } catch (err) {
          // More specific error handling
          const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
          console.error('Error loading AQI data by coordinates:', errorMessage);
          
          // Since the API service now provides fallback data, we shouldn't reach this point
          if (errorMessage.includes('Network error') || errorMessage.includes('timeout')) {
            setError('Network connection issues. Using cached data where available.');
            if (isInitialized) {
              toast.error('Network issues - using available data');
            }
          } else {
            setError('Unable to load fresh location data. Using available information.');
            if (isInitialized) {
              toast.error('Using available data for your location');
            }
          }
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Unable to retrieve your location. Please search for a city instead.');
        if (isInitialized) {
          toast.error('Location access denied');
        }
        // Fallback to Delhi
        loadLocationData('Delhi');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    currentLocation,
    searchedLocation,
    locationName,
    aqiData,
    isLoading,
    error,
    setCurrentLocation,
    setSearchedLocation,
    loadLocationData,
    loadCurrentLocationData,
    clearError,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};