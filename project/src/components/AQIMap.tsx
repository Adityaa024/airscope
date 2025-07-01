import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation, Layers, Eye, EyeOff } from 'lucide-react';

import { AQIData } from '../types/air-quality';
import { getAQIColor, getAQILevel, getAQIEmoji } from '../utils/air-quality';
import { HeatmapOverlay } from './PollutionHeatmap/HeatmapOverlay';

interface AQIMapProps {
  data: AQIData;
  center?: [number, number];
  userLocation?: [number, number];
}

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

export const AQIMap: React.FC<AQIMapProps> = ({ data, center, userLocation }) => {
  const [showHeatmap, setShowHeatmap] = useState(false);
  
  // Determine map center priority: user location > data location > default Delhi
  const mapCenter: LatLngExpression = 
    userLocation || 
    center || 
    (data.city.geo && data.city.geo[0] && data.city.geo[1] ? data.city.geo : [28.6139, 77.2090]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Location Map</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Air quality monitoring station</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {userLocation && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                  <Navigation className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Your Location</span>
                </div>
              )}
              
              <motion.button
                onClick={() => setShowHeatmap(!showHeatmap)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  showHeatmap
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showHeatmap ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="text-sm font-medium">
                  {showHeatmap ? 'Hide' : 'Show'} Pollution Sources
                </span>
              </motion.button>
            </div>
          </div>
        </div>
        
        <div className="h-80 relative">
          <MapContainer
            center={mapCenter}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <MapUpdater center={mapCenter as [number, number]} />
            
            {/* Main AQI Station Marker */}
            <CircleMarker
              center={data.city.geo || mapCenter}
              radius={20}
              fillColor={getAQIColor(data.aqi)}
              color="#ffffff"
              weight={4}
              opacity={1}
              fillOpacity={0.9}
              className="pulse-ring"
            >
              <Popup>
                <div className="text-center p-3 min-w-[200px]">
                  <h4 className="font-bold text-gray-800 mb-3">{data.city.name}</h4>
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <span className="text-3xl font-bold" style={{ color: getAQIColor(data.aqi) }}>
                      {data.aqi}
                    </span>
                    <span className="text-2xl">{getAQIEmoji(data.aqi)}</span>
                  </div>
                  <div className="text-sm font-semibold mb-2 px-3 py-1 rounded-full" 
                       style={{ 
                         color: getAQIColor(data.aqi),
                         backgroundColor: getAQIColor(data.aqi) + '20'
                       }}>
                    {getAQILevel(data.aqi)}
                  </div>
                  <div className="text-xs text-gray-500 border-t pt-2">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" />
                      Updated: {new Date(data.time.s).toLocaleString()}
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>

            {/* User Location Marker (if different from AQI station) */}
            {userLocation && userLocation !== data.city.geo && (
              <CircleMarker
                center={userLocation}
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
                      {userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            )}
          </MapContainer>
        </div>

        {/* Enhanced Legend */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200/50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
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
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>AQI Station</span>
              </div>
              {userLocation && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Your Location</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pollution Source Heatmap */}
      {showHeatmap && (
        <HeatmapOverlay 
          center={mapCenter as [number, number]} 
          aqi={data.aqi}
        />
      )}
    </div>
  );
};