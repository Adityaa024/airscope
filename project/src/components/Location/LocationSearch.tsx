import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, Navigation } from 'lucide-react';
import { searchLocations } from '../../services/api';

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
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchLocations(searchQuery);
      setSuggestions(results.slice(0, 5));
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
    
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleSuggestionClick = (location: any) => {
    setQuery(location.station.name);
    setShowSuggestions(false);
    onLocationSelect(location.station.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onLocationSelect(query.trim());
      setShowSuggestions(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Search Location</h3>
      
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative" ref={searchRef}>
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Enter city name..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200"
            >
              {isSearching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
              {suggestions.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(location)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                >
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-800">
                      {location.station.name}
                    </div>
                    {location.station.geo && (
                      <div className="text-xs text-gray-500">
                        {location.station.geo[0]}, {location.station.geo[1]}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={onCurrentLocation}
          disabled={isLoading}
          className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Navigation className="w-5 h-5" />
          <span className="hidden sm:inline">Current Location</span>
        </button>
      </div>
    </div>
  );
};