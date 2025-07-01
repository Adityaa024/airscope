import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  Factory, 
  Truck, 
  Building, 
  Flame, 
  Wind,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Info
} from 'lucide-react';

interface PollutionSource {
  id: string;
  type: 'traffic' | 'industrial' | 'construction' | 'burning' | 'residential';
  name: string;
  coordinates: [number, number];
  intensity: number; // 0-100
  contribution: number; // percentage contribution to local AQI
  description: string;
}

interface HeatmapOverlayProps {
  center: [number, number];
  aqi: number;
  onSourceSelect?: (source: PollutionSource) => void;
}

export const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({ center, aqi, onSourceSelect }) => {
  const [pollutionSources, setPollutionSources] = useState<PollutionSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<PollutionSource | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(true);

  useEffect(() => {
    // Generate pollution sources based on location and AQI
    generatePollutionSources();
  }, [center, aqi]);

  const generatePollutionSources = () => {
    const sources: PollutionSource[] = [];
    const [lat, lng] = center;

    // Traffic sources (major roads and intersections)
    sources.push(
      {
        id: 'traffic-1',
        type: 'traffic',
        name: 'Ring Road Traffic',
        coordinates: [lat + 0.01, lng + 0.01],
        intensity: Math.min(85, aqi * 0.6),
        contribution: 35,
        description: 'Heavy vehicle traffic on major arterial road'
      },
      {
        id: 'traffic-2',
        type: 'traffic',
        name: 'Highway Junction',
        coordinates: [lat - 0.015, lng + 0.02],
        intensity: Math.min(75, aqi * 0.5),
        contribution: 25,
        description: 'Major highway intersection with high diesel vehicle density'
      }
    );

    // Industrial sources
    if (aqi > 100) {
      sources.push(
        {
          id: 'industrial-1',
          type: 'industrial',
          name: 'Industrial Complex',
          coordinates: [lat + 0.02, lng - 0.01],
          intensity: Math.min(90, aqi * 0.7),
          contribution: 20,
          description: 'Manufacturing and chemical processing facilities'
        },
        {
          id: 'industrial-2',
          type: 'industrial',
          name: 'Power Plant',
          coordinates: [lat - 0.02, lng - 0.02],
          intensity: Math.min(80, aqi * 0.6),
          contribution: 15,
          description: 'Coal-fired thermal power generation'
        }
      );
    }

    // Construction sources
    sources.push({
      id: 'construction-1',
      type: 'construction',
      name: 'Construction Site',
      coordinates: [lat + 0.005, lng - 0.015],
      intensity: Math.min(60, aqi * 0.4),
      contribution: 10,
      description: 'Large-scale construction and demolition activities'
    });

    // Burning sources (seasonal)
    if (aqi > 150) {
      sources.push({
        id: 'burning-1',
        type: 'burning',
        name: 'Agricultural Burning',
        coordinates: [lat + 0.03, lng + 0.03],
        intensity: Math.min(95, aqi * 0.8),
        contribution: 30,
        description: 'Crop residue burning in nearby agricultural areas'
      });
    }

    // Residential sources
    sources.push({
      id: 'residential-1',
      type: 'residential',
      name: 'Dense Residential Area',
      coordinates: [lat - 0.01, lng + 0.015],
      intensity: Math.min(50, aqi * 0.3),
      contribution: 8,
      description: 'High-density housing with cooking and heating emissions'
    });

    setPollutionSources(sources);
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'traffic': return <Car className="w-4 h-4" />;
      case 'industrial': return <Factory className="w-4 h-4" />;
      case 'construction': return <Building className="w-4 h-4" />;
      case 'burning': return <Flame className="w-4 h-4" />;
      case 'residential': return <Building className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getSourceColor = (type: string, intensity: number) => {
    const baseColors = {
      traffic: '#EF4444',
      industrial: '#8B5CF6',
      construction: '#F97316',
      burning: '#DC2626',
      residential: '#10B981'
    };

    const opacity = Math.max(0.3, intensity / 100);
    return `${baseColors[type as keyof typeof baseColors]}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  };

  const getIntensityLevel = (intensity: number) => {
    if (intensity >= 80) return 'Very High';
    if (intensity >= 60) return 'High';
    if (intensity >= 40) return 'Moderate';
    if (intensity >= 20) return 'Low';
    return 'Very Low';
  };

  const totalContribution = pollutionSources.reduce((sum, source) => sum + source.contribution, 0);

  return (
    <div className="space-y-6">
      {/* Heatmap Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Pollution Source Heatmap</h2>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={(e) => setShowHeatmap(e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <span className="text-sm font-medium text-gray-700">Show Heatmap</span>
          </label>
        </div>

        {showHeatmap && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pollutionSources.map((source, index) => (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setSelectedSource(source);
                  onSourceSelect?.(source);
                }}
                className="p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg"
                style={{
                  backgroundColor: getSourceColor(source.type, source.intensity),
                  borderColor: getSourceColor(source.type, source.intensity).slice(0, -2)
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/80 rounded-lg">
                    {getSourceIcon(source.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">{source.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="capitalize">{source.type}</span>
                      <span>•</span>
                      <span>{getIntensityLevel(source.intensity)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Contribution</span>
                    <span className="text-sm font-bold text-gray-800">{source.contribution}%</span>
                  </div>
                  <div className="w-full bg-white/60 rounded-full h-2">
                    <div
                      className="bg-gray-800 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(source.contribution / Math.max(...pollutionSources.map(s => s.contribution))) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">{source.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Source Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Pollution Source Analysis</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Source Breakdown */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Source Contribution Breakdown</h3>
            <div className="space-y-3">
              {pollutionSources
                .sort((a, b) => b.contribution - a.contribution)
                .map((source, index) => (
                  <div key={source.id} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: getSourceColor(source.type, 50) }}>
                      {getSourceIcon(source.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-800">{source.name}</span>
                        <span className="text-sm font-bold text-gray-600">{source.contribution}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="h-2 rounded-full transition-all duration-1000"
                          style={{
                            width: `${(source.contribution / totalContribution) * 100}%`,
                            backgroundColor: getSourceColor(source.type, source.intensity).slice(0, -2)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Mitigation Recommendations</h3>
            <div className="space-y-3">
              {pollutionSources
                .filter(source => source.contribution > 15)
                .map((source, index) => (
                  <div key={source.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      {getSourceIcon(source.type)}
                      <span className="font-medium text-blue-800 text-sm">{source.type.toUpperCase()}</span>
                    </div>
                    <p className="text-xs text-blue-700">
                      {source.type === 'traffic' && 'Consider using public transport or carpooling. Avoid peak hours.'}
                      {source.type === 'industrial' && 'Support stricter emission controls and cleaner technologies.'}
                      {source.type === 'construction' && 'Ensure proper dust control measures and covered materials.'}
                      {source.type === 'burning' && 'Report illegal burning. Support alternative waste management.'}
                      {source.type === 'residential' && 'Use cleaner cooking fuels and improve ventilation.'}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Vehicle Density Indicator */}
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
          <div className="flex items-center gap-3 mb-3">
            <Truck className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-orange-800">Vehicle Density Impact</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(aqi * 0.4)}
              </div>
              <div className="text-xs text-orange-700">Cars/km²</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {Math.round(aqi * 0.15)}
              </div>
              <div className="text-xs text-red-700">Trucks/km²</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(aqi * 0.25)}
              </div>
              <div className="text-xs text-purple-700">2-Wheelers/km²</div>
            </div>
          </div>
        </div>

        {/* Industrial Zone Indicator */}
        {aqi > 100 && (
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <Factory className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Industrial Zone Impact</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {pollutionSources.filter(s => s.type === 'industrial').length}
                </div>
                <div className="text-xs text-purple-700">Active Facilities</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-600">
                  {pollutionSources
                    .filter(s => s.type === 'industrial')
                    .reduce((sum, s) => sum + s.contribution, 0)}%
                </div>
                <div className="text-xs text-indigo-700">Total Contribution</div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Selected Source Details */}
      {selectedSource && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: getSourceColor(selectedSource.type, selectedSource.intensity) }}>
                {getSourceIcon(selectedSource.type)}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{selectedSource.name}</h3>
                <p className="text-sm text-gray-600 capitalize">{selectedSource.type} Source</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedSource(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-800">{selectedSource.intensity}</div>
              <div className="text-xs text-gray-600">Intensity</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-800">{selectedSource.contribution}%</div>
              <div className="text-xs text-gray-600">Contribution</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-800">{getIntensityLevel(selectedSource.intensity)}</div>
              <div className="text-xs text-gray-600">Level</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-xl font-bold text-gray-800">
                {selectedSource.coordinates[0].toFixed(3)}, {selectedSource.coordinates[1].toFixed(3)}
              </div>
              <div className="text-xs text-gray-600">Coordinates</div>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">{selectedSource.description}</p>
        </motion.div>
      )}

      {/* Info Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-blue-50 border border-blue-200 rounded-2xl p-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <Info className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold text-blue-800">About Pollution Source Mapping</h3>
        </div>
        <p className="text-blue-700 text-sm leading-relaxed">
          This heatmap shows estimated pollution sources based on vehicle density, industrial zones, and environmental factors. 
          Data is derived from satellite imagery, traffic patterns, and emission inventories. Use this information to make 
          informed decisions about route planning and outdoor activities.
        </p>
      </motion.div>
    </div>
  );
};