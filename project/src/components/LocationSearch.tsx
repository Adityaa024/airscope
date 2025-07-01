import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, Navigation, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchLocations, getInstantSuggestions } from '../services/api';
import { useLocation } from '../contexts/LocationContext';

interface LocationSearchProps {
  onLocationSelect: (location: string) => void;
  onCurrentLocation: () => void;
  isLoading?: boolean;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  onLocationSelect,
  onCurrentLocation,
  isLoading
}) => {
  const { currentLocation, locationName } = useLocation();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load instant suggestions on focus
  useEffect(() => {
    if (showSuggestions && !query) {
      const instantSuggestions = getInstantSuggestions('');
      setSuggestions(instantSuggestions);
    }
  }, [showSuggestions, query]);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 1) {
      // Show popular cities for empty query
      const instantSuggestions = getInstantSuggestions('');
      setSuggestions(instantSuggestions);
      setShowSuggestions(true);
      return;
    }

    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      // First try instant suggestions from local database
      const instantResults = getInstantSuggestions(searchQuery);
      if (instantResults.length > 0) {
        setSuggestions(instantResults);
        setShowSuggestions(true);
        setIsSearching(false);
        return;
      }

      // If no instant results, try API search
      const results = await searchLocations(searchQuery);
      setSuggestions(results.slice(0, 6));
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // For very short queries, search immediately
    if (value.length <= 2) {
      handleSearch(value);
      return;
    }
    
    // Debounce longer queries with shorter delay for faster response
    debounceRef.current = setTimeout(() => {
      handleSearch(value);
    }, 100); // Reduced from 150ms to 100ms
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
    if (!query) {
      handleSearch(''); // Load popular cities
    }
  };

  const handleSuggestionClick = (location: any) => {
    // Extract clean location name (avoid duplicates like "delhi,delhi,delhi")
    const locationName = location.station.name;
    const cleanName = locationName.split(',')[0].trim(); // Take first part only
    
    setQuery(cleanName);
    setShowSuggestions(false);
    onLocationSelect(cleanName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Clean the query before submitting
      const cleanQuery = query.split(',')[0].trim();
      onLocationSelect(cleanQuery);
      setShowSuggestions(false);
    }
  };

  const handleCurrentLocation = () => {
    setIsLocationLoading(true);
    onCurrentLocation();
    setTimeout(() => setIsLocationLoading(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 relative z-50 overflow-visible w-full max-w-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-xl flex-shrink-0">
          <Search className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-800">Search Location</h3>
          {currentLocation && (
            <p className="text-sm text-blue-600 truncate">📍 Current: {locationName}</p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative min-w-0" ref={searchRef}>
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                placeholder="Search cities, areas, colonies..."
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white/90 backdrop-blur-sm font-medium"
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200 disabled:opacity-50 flex-shrink-0"
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>

          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl z-[9999] max-h-80 overflow-y-auto search-dropdown"
                style={{ position: 'absolute', zIndex: 9999 }}
              >
                {!query && (
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Popular Cities
                    </p>
                  </div>
                )}
                {suggestions.map((location, index) => {
                  // Clean display name to avoid duplicates
                  const displayName = location.station.name.split(',')[0].trim();
                  const fullName = location.station.name;
                  
                  return (
                    <motion.button
                      key={`${index}-${displayName}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleSuggestionClick(location)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 flex items-center gap-3 transition-all duration-200 first:rounded-t-xl last:rounded-b-xl group"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-200 flex-shrink-0">
                        <MapPin className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 truncate">
                          {displayName}
                        </div>
                        {location.station.geo && (
                          <div className="text-xs text-gray-500 truncate">
                            📍 {location.station.geo[0].toFixed(4)}, {location.station.geo[1].toFixed(4)}
                          </div>
                        )}
                        {fullName !== displayName && (
                          <div className="text-xs text-gray-400 truncate">
                            {fullName}
                          </div>
                        )}
                      </div>
                      {!query && (
                        <div className="text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                          Popular
                        </div>
                      )}
                    </motion.button>
                  );
                })}
                
                {/* Search tip */}
                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                  <p className="text-xs text-gray-500 text-center">
                    💡 Search for cities, areas, colonies, or neighborhoods across India
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          onClick={handleCurrentLocation}
          disabled={isLoading || isLocationLoading}
          whileHover={{ scale: isLocationLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLocationLoading ? 1 : 0.98 }}
          className="px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-semibold min-w-fit flex-shrink-0"
        >
          {isLocationLoading ? (
            <>
              <Target className="w-5 h-5 animate-spin-slow" />
              <span className="hidden sm:inline">Locating...</span>
            </>
          ) : (
            <>
              <Navigation className="w-5 h-5" />
              <span className="hidden sm:inline">Current Location</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Search Enhancement Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">🚀</span>
          <h4 className="text-sm font-semibold text-green-800">Enhanced Search</h4>
        </div>
        <p className="text-xs text-green-700">
          Now supports comprehensive search across Indian cities, localities, colonies, and neighborhoods - 
          just like Google Maps! Try searching for your specific area.
        </p>
      </motion.div>
    </motion.div>
  );
};