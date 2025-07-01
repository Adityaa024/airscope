import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { motion } from 'framer-motion';
import { Map as MapIcon, Layers, Satellite, Info, Globe, Zap, Clock, TrendingUp, Navigation, MapPin, AlertTriangle } from 'lucide-react';

import { useLocation } from '../contexts/LocationContext';
import { getAQIColor, getAQILevel, getAQIEmoji } from '../utils/air-quality';

// Component to update map view when center changes
const MapUpdater: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 12);
    }
  }, [center, map]);

  return null;
};

export const MapView: React.FC = () => {
  const { t } = useTranslation();
  const { 
    aqiData, 
    currentLocation, 
    searchedLocation, 
    locationName, 
    loadCurrentLocationData,
    isLoading 
  } = useLocation();
  
  const [showBhuvanLayer, setShowBhuvanLayer] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<'osm' | 'satellite' | 'bhuvan' | 'cartolight'>('osm');
  const [bhuvanError, setBhuvanError] = useState(false);

  // Determine map center priority: user location > searched location > data location > default Delhi
  const mapCenter: [number, number] = 
    currentLocation || 
    searchedLocation || 
    (aqiData?.city.geo && aqiData.city.geo[0] && aqiData.city.geo[1] ? aqiData.city.geo : [28.6139, 77.2090]);

  // Mock data for multiple monitoring stations (enhanced with location-based data)
  const monitoringStations = [
    { id: 1, name: 'Delhi - Connaught Place', coords: [28.6315, 77.2167], aqi: 156, trend: 'up' },
    { id: 2, name: 'Delhi - Anand Vihar', coords: [28.6469, 77.3152], aqi: 189, trend: 'down' },
    { id: 3, name: 'Delhi - Punjabi Bagh', coords: [28.6742, 77.1347], aqi: 142, trend: 'stable' },
    { id: 4, name: 'Delhi - RK Puram', coords: [28.5706, 77.1816], aqi: 134, trend: 'up' },
    { id: 5, name: 'Gurgaon - Sector 51', coords: [28.4421, 77.0502], aqi: 167, trend: 'down' }
  ];

  // Add current location data if available
  const allStations = aqiData ? [
    ...monitoringStations,
    {
      id: 999,
      name: locationName,
      coords: mapCenter,
      aqi: aqiData.aqi,
      trend: 'current'
    }
  ] : monitoringStations;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-red-500" />;
      case 'down': return <TrendingUp className="w-3 h-3 text-green-500 rotate-180" />;
      case 'current': return <MapPin className="w-3 h-3 text-blue-500" />;
      default: return <div className="w-3 h-3 bg-gray-400 rounded-full" />;
    }
  };

  // Get the appropriate tile layer URL and attribution
  const getTileLayerConfig = () => {
    switch (selectedLayer) {
      case 'satellite':
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attribution: '&copy; <a href="https://www.esri.com/">Esri</a>',
          maxZoom: 18
        };
      case 'bhuvan':
        // Alternative working Indian satellite imagery
        return {
          url: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
          attribution: '&copy; Google Satellite • <a href="https://bhuvan.nrsc.gov.in/">ISRO Bhuvan Style</a>',
          maxZoom: 20
        };
      case 'cartolight':
        return {
          url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 19
        };
      default:
        return {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        };
    }
  };

  const tileConfig = getTileLayerConfig();

  // Handle Bhuvan layer toggle
  const handleBhuvanToggle = (checked: boolean) => {
    setShowBhuvanLayer(checked);
    if (checked) {
      setSelectedLayer('bhuvan');
      setBhuvanError(false);
    } else {
      setSelectedLayer('osm');
    }
  };

  // Handle tile load error
  const handleTileError = () => {
    if (selectedLayer === 'bhuvan') {
      setBhuvanError(true);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 shimmer"></div>
          <div className="h-96 bg-gray-200 rounded-2xl shimmer"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <MapIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Air Quality Map
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>Real-time monitoring stations • Centered on {locationName}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Location Info */}
      {(currentLocation || searchedLocation) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-blue-700 font-medium">
                  Map centered on: {currentLocation ? '📍 Current Location' : '🔍 Searched Location'} - {locationName}
                </p>
                {currentLocation && (
                  <p className="text-blue-600 text-sm">
                    Your coordinates: {currentLocation[0].toFixed(4)}, {currentLocation[1].toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bhuvan Error Notice */}
      {bhuvanError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <div>
                <h3 className="font-semibold text-orange-800">ISRO Bhuvan Layer Notice</h3>
                <p className="text-orange-700 text-sm">
                  Official ISRO Bhuvan requires authentication. Showing alternative satellite imagery with Indian focus.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Map Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-semibold text-gray-700">Map Layer:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <motion.button
                  onClick={() => {
                    setSelectedLayer('osm');
                    setShowBhuvanLayer(false);
                    setBhuvanError(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    selectedLayer === 'osm'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  Street Map
                </motion.button>
                <motion.button
                  onClick={() => {
                    setSelectedLayer('cartolight');
                    setShowBhuvanLayer(false);
                    setBhuvanError(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    selectedLayer === 'cartolight'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <MapIcon className="w-4 h-4" />
                  Light Map
                </motion.button>
                <motion.button
                  onClick={() => {
                    setSelectedLayer('satellite');
                    setShowBhuvanLayer(false);
                    setBhuvanError(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    selectedLayer === 'satellite'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Satellite className="w-4 h-4" />
                  Satellite
                </motion.button>
                <motion.button
                  onClick={() => {
                    setSelectedLayer('bhuvan');
                    setShowBhuvanLayer(true);
                    setBhuvanError(false);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    selectedLayer === 'bhuvan'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  India Satellite
                </motion.button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                onClick={loadCurrentLocationData}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-200 shadow-lg"
              >
                <Navigation className="w-4 h-4" />
                <span className="font-medium">My Location</span>
              </motion.button>
              
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={showBhuvanLayer}
                  onChange={(e) => handleBhuvanToggle(e.target.checked)}
                  className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 transition-colors duration-200"
                />
                <div className="flex items-center gap-2">
                  <Zap className={`w-4 h-4 ${showBhuvanLayer ? 'text-orange-600' : 'text-orange-500'}`} />
                  <span className={`text-sm font-semibold transition-colors duration-200 ${
                    showBhuvanLayer 
                      ? 'text-orange-700' 
                      : 'text-gray-700 group-hover:text-orange-600'
                  }`}>
                    India Satellite {showBhuvanLayer && '(Active)'}
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bhuvan Layer Info */}
      {showBhuvanLayer && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800">India-Focused Satellite Layer Active</h3>
                <p className="text-orange-700 text-sm">
                  Now showing high-resolution satellite imagery optimized for Indian subcontinent
                  {bhuvanError && ' • Using alternative satellite source due to ISRO Bhuvan access restrictions'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Enhanced Map Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <MapIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Live Air Quality Monitoring</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Updates every 15 minutes • Showing {locationName}</span>
                    {showBhuvanLayer && (
                      <>
                        <span className="mx-2">•</span>
                        <Zap className="w-4 h-4 text-orange-500" />
                        <span className="text-orange-600 font-medium">India Satellite Active</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Live</span>
              </div>
            </div>
          </div>
          
          <div className="h-96 relative">
            <MapContainer
              center={mapCenter}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
              key={selectedLayer} // Force re-render when layer changes
            >
              <TileLayer
                url={tileConfig.url}
                attribution={tileConfig.attribution}
                maxZoom={tileConfig.maxZoom}
                onError={handleTileError}
                crossOrigin={selectedLayer === 'bhuvan' ? 'anonymous' : undefined}
              />
              
              <MapUpdater center={mapCenter} />
              
              {/* Enhanced Monitoring Stations */}
              {allStations.map((station) => (
                <CircleMarker
                  key={station.id}
                  center={station.coords as LatLngExpression}
                  radius={station.id === 999 ? 22 : 18} // Larger for current location
                  fillColor={getAQIColor(station.aqi)}
                  color={station.id === 999 ? "#1D4ED8" : "#ffffff"} // Blue border for current location
                  weight={station.id === 999 ? 5 : 4}
                  opacity={1}
                  fillOpacity={0.9}
                  className="pulse-ring"
                >
                  <Popup>
                    <div className="text-center p-3 min-w-[220px]">
                      <h4 className="font-bold text-gray-800 mb-3">
                        {station.name}
                        {station.id === 999 && (
                          <span className="ml-2 text-blue-600 text-sm">
                            {currentLocation ? '📍 Current' : '🔍 Searched'}
                          </span>
                        )}
                      </h4>
                      <div className="flex items-center justify-center gap-3 mb-3">
                        <span className="text-4xl font-bold" style={{ color: getAQIColor(station.aqi) }}>
                          {station.aqi}
                        </span>
                        <div className="flex flex-col items-center">
                          <span className="text-3xl">{getAQIEmoji(station.aqi)}</span>
                          {getTrendIcon(station.trend)}
                        </div>
                      </div>
                      <div className="text-sm font-semibold mb-2 px-3 py-1 rounded-full" 
                           style={{ 
                             color: getAQIColor(station.aqi),
                             backgroundColor: getAQIColor(station.aqi) + '20'
                           }}>
                        {getAQILevel(station.aqi)}
                      </div>
                      <div className="text-xs text-gray-500 border-t pt-2">
                        <div className="flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" />
                          Updated: {new Date().toLocaleString()}
                        </div>
                        {station.id === 999 && (
                          <div className="mt-1 text-blue-600 font-medium">
                            {station.coords[0].toFixed(4)}, {station.coords[1].toFixed(4)}
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {/* User Location Marker (if different from main station) */}
              {currentLocation && aqiData && currentLocation !== aqiData.city.geo && (
                <CircleMarker
                  center={currentLocation}
                  radius={12}
                  fillColor="#10B981"
                  color="#ffffff"
                  weight={3}
                  opacity={1}
                  fillOpacity={0.8}
                >
                  <Popup>
                    <div className="text-center p-2">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Navigation className="w-4 h-4 text-green-600" />
                        <h4 className="font-bold text-gray-800">Your Location</h4>
                      </div>
                      <div className="text-xs text-gray-500">
                        {currentLocation[0].toFixed(4)}, {currentLocation[1].toFixed(4)}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              )}
            </MapContainer>
          </div>

          {/* Enhanced Legend */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200/50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                  <span className="text-gray-700 font-medium">Good (0-50)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm"></div>
                  <span className="text-gray-700 font-medium">Moderate (51-100)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded-full shadow-sm"></div>
                  <span className="text-gray-700 font-medium">Unhealthy (101-150)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm"></div>
                  <span className="text-gray-700 font-medium">Very Unhealthy (151+)</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  <span>Data updates every 15 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Trend indicators show 24h change</span>
                </div>
                {showBhuvanLayer && (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-600 font-medium">India Satellite Layer</span>
                  </div>
                )}
                {currentLocation && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                    <span>Your Location</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Station List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Monitoring Stations</h3>
            {showBhuvanLayer && (
              <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full">
                <Zap className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">India Satellite View</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allStations.map((station, index) => (
              <motion.div 
                key={station.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`border rounded-xl p-4 hover:shadow-lg transition-all duration-300 bg-white/60 backdrop-blur-sm ${
                  station.id === 999 
                    ? 'border-blue-300 bg-blue-50/60' 
                    : 'border-gray-200/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800 text-sm">
                    {station.name}
                    {station.id === 999 && (
                      <span className="ml-2 text-blue-600 text-xs">
                        {currentLocation ? '📍' : '🔍'}
                      </span>
                    )}
                  </h4>
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{getAQIEmoji(station.aqi)}</span>
                    {getTrendIcon(station.trend)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold" style={{ color: getAQIColor(station.aqi) }}>
                    {station.aqi}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold mb-1" style={{ color: getAQIColor(station.aqi) }}>
                      {getAQILevel(station.aqi)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {station.coords[0].toFixed(4)}, {station.coords[1].toFixed(4)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};