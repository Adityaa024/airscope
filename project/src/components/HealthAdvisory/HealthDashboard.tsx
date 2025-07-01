import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  Heart, 
  VenetianMask as Mask, 
  Activity,
  Wind,
  Eye,
  Thermometer,
  Droplets,
  Clock,
  MapPin,
  Phone,
  Building2,
  GraduationCap,
  Users,
  ChevronDown,
  ChevronUp,
  Bell,
  Settings
} from 'lucide-react';
import { AQIData, HealthAdvice } from '../../types/air-quality';
import { getAQILevel, getAQIColor } from '../../utils/air-quality';
import { useNotifications } from '../../contexts/NotificationContext';

interface HealthDashboardProps {
  aqiData: AQIData;
  advice: HealthAdvice;
  locationName: string;
}

interface ActionableRecommendation {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'immediate' | 'outdoor' | 'indoor' | 'health';
  completed?: boolean;
}

interface EmergencyContact {
  type: 'hospital' | 'school' | 'emergency';
  name: string;
  phone: string;
  address: string;
  distance: string;
}

export const HealthDashboard: React.FC<HealthDashboardProps> = ({ aqiData, advice, locationName }) => {
  const { settings, updateSettings, requestNotificationPermission, hasNotificationPermission } = useNotifications();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['recommendations']));
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [showEmergencyContacts, setShowEmergencyContacts] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const toggleAction = (actionId: string) => {
    setCompletedActions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(actionId)) {
        newSet.delete(actionId);
      } else {
        newSet.add(actionId);
      }
      return newSet;
    });
  };

  // Generate actionable recommendations based on WHO/Indian standards
  const getActionableRecommendations = (): ActionableRecommendation[] => {
    const aqi = aqiData.aqi;
    const recommendations: ActionableRecommendation[] = [];

    // WHO/Indian standard breakpoints
    if (aqi <= 50) {
      // Good air quality
      recommendations.push(
        {
          id: 'enjoy-outdoors',
          icon: <Activity className="w-5 h-5" />,
          title: 'Enjoy outdoor activities',
          description: 'Perfect time for jogging, cycling, or outdoor sports',
          priority: 'low',
          category: 'outdoor'
        },
        {
          id: 'open-windows',
          icon: <Wind className="w-5 h-5" />,
          title: 'Open windows for fresh air',
          description: 'Let natural ventilation improve indoor air quality',
          priority: 'low',
          category: 'indoor'
        }
      );
    } else if (aqi <= 100) {
      // Moderate air quality
      recommendations.push(
        {
          id: 'limit-prolonged-outdoor',
          icon: <Clock className="w-5 h-5" />,
          title: 'Limit prolonged outdoor exposure',
          description: 'Reduce extended outdoor activities, especially for sensitive individuals',
          priority: 'medium',
          category: 'outdoor'
        },
        {
          id: 'consider-mask',
          icon: <Mask className="w-5 h-5" />,
          title: 'Consider wearing a mask',
          description: 'Use N95 or equivalent mask if you have respiratory conditions',
          priority: 'medium',
          category: 'health'
        }
      );
    } else if (aqi <= 150) {
      // Unhealthy for sensitive groups
      recommendations.push(
        {
          id: 'wear-mask-mandatory',
          icon: <Mask className="w-5 h-5" />,
          title: 'Wear a mask when outdoors',
          description: 'Use N95 or N99 mask to filter harmful particles',
          priority: 'high',
          category: 'immediate'
        },
        {
          id: 'avoid-outdoor-exercise',
          icon: <Activity className="w-5 h-5" />,
          title: 'Avoid outdoor exercise',
          description: 'Move workouts indoors or postpone until air quality improves',
          priority: 'high',
          category: 'outdoor'
        },
        {
          id: 'use-air-purifier',
          icon: <Wind className="w-5 h-5" />,
          title: 'Use air purifier indoors',
          description: 'Run HEPA air purifiers to clean indoor air',
          priority: 'high',
          category: 'indoor'
        }
      );
    } else if (aqi <= 200) {
      // Unhealthy
      recommendations.push(
        {
          id: 'stay-indoors',
          icon: <Building2 className="w-5 h-5" />,
          title: 'Stay indoors as much as possible',
          description: 'Minimize all outdoor activities and exposure',
          priority: 'high',
          category: 'immediate'
        },
        {
          id: 'seal-windows',
          icon: <Shield className="w-5 h-5" />,
          title: 'Keep windows and doors closed',
          description: 'Prevent outdoor pollutants from entering your home',
          priority: 'high',
          category: 'indoor'
        },
        {
          id: 'monitor-health',
          icon: <Heart className="w-5 h-5" />,
          title: 'Monitor your health closely',
          description: 'Watch for symptoms like coughing, shortness of breath, or chest pain',
          priority: 'high',
          category: 'health'
        }
      );
    } else {
      // Very unhealthy/Hazardous
      recommendations.push(
        {
          id: 'emergency-indoors',
          icon: <AlertTriangle className="w-5 h-5" />,
          title: 'EMERGENCY: Stay indoors immediately',
          description: 'Avoid all outdoor exposure. This is a health emergency.',
          priority: 'high',
          category: 'immediate'
        },
        {
          id: 'medical-attention',
          icon: <Phone className="w-5 h-5" />,
          title: 'Seek medical attention if symptomatic',
          description: 'Contact healthcare provider if experiencing breathing difficulties',
          priority: 'high',
          category: 'health'
        },
        {
          id: 'emergency-supplies',
          icon: <Shield className="w-5 h-5" />,
          title: 'Prepare emergency supplies',
          description: 'Ensure you have medications, water, and food for extended indoor stay',
          priority: 'high',
          category: 'immediate'
        }
      );
    }

    return recommendations;
  };

  // Emergency contacts for high AQI situations
  const getEmergencyContacts = (): EmergencyContact[] => {
    return [
      {
        type: 'emergency',
        name: 'National Emergency Helpline',
        phone: '112',
        address: 'Pan-India Emergency Services',
        distance: 'Immediate'
      },
      {
        type: 'hospital',
        name: 'AIIMS Emergency',
        phone: '011-26588500',
        address: 'All India Institute of Medical Sciences, New Delhi',
        distance: '2.5 km'
      },
      {
        type: 'hospital',
        name: 'Safdarjung Hospital',
        phone: '011-26165060',
        address: 'Safdarjung Hospital, New Delhi',
        distance: '3.2 km'
      },
      {
        type: 'school',
        name: 'School Emergency Protocol',
        phone: '011-23073300',
        address: 'Delhi Education Department',
        distance: 'City-wide'
      }
    ];
  };

  const recommendations = getActionableRecommendations();
  const emergencyContacts = getEmergencyContacts();
  const completedCount = recommendations.filter(r => completedActions.has(r.id)).length;
  const completionPercentage = recommendations.length > 0 ? (completedCount / recommendations.length) * 100 : 0;

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'immediate': return <AlertTriangle className="w-4 h-4" />;
      case 'outdoor': return <Activity className="w-4 h-4" />;
      case 'indoor': return <Building2 className="w-4 h-4" />;
      case 'health': return <Heart className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div 
            className="p-3 rounded-xl shadow-lg"
            style={{ backgroundColor: advice.bgColor, color: advice.color }}
          >
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Health & Advisory Dashboard</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{locationName} • AQI {aqiData.aqi} • {getAQILevel(aqiData.aqi)}</span>
            </div>
          </div>
        </div>
        
        {/* Notification Settings */}
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => setShowEmergencyContacts(!showEmergencyContacts)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm font-medium">Emergency</span>
          </motion.button>
          
          <motion.button
            onClick={requestNotificationPermission}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
              hasNotificationPermission 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span className="text-sm font-medium">
              {hasNotificationPermission ? 'Alerts On' : 'Enable Alerts'}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Emergency Contacts */}
      <AnimatePresence>
        {showEmergencyContacts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4"
          >
            <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Emergency Response Contacts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    {contact.type === 'hospital' && <Heart className="w-4 h-4 text-red-600" />}
                    {contact.type === 'school' && <GraduationCap className="w-4 h-4 text-blue-600" />}
                    {contact.type === 'emergency' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                    <span className="font-semibold text-gray-800 text-sm">{contact.name}</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline font-medium">
                        {contact.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{contact.address}</span>
                    </div>
                    <div className="text-gray-500">Distance: {contact.distance}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Status */}
      <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: advice.bgColor }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{advice.emoji}</span>
            <div>
              <h3 className="font-bold text-lg" style={{ color: advice.color }}>
                {advice.level}
              </h3>
              <p className="text-sm" style={{ color: advice.color }}>
                {advice.description}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: advice.color }}>
              {aqiData.aqi}
            </div>
            <div className="text-xs" style={{ color: advice.color }}>
              AQI Level
            </div>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">Action Progress</h3>
          <span className="text-sm text-gray-600">
            {completedCount}/{recommendations.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {completionPercentage.toFixed(0)}% of recommended actions completed
        </div>
      </div>

      {/* Actionable Recommendations */}
      <div className="mb-6">
        <motion.button
          onClick={() => toggleSection('recommendations')}
          className="flex items-center justify-between w-full p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-200"
        >
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-800">
              Actionable Recommendations ({recommendations.length})
            </h3>
          </div>
          {expandedSections.has('recommendations') ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </motion.button>

        <AnimatePresence>
          {expandedSections.has('recommendations') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-3"
            >
              {recommendations.map((recommendation, index) => (
                <motion.div
                  key={recommendation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    completedActions.has(recommendation.id)
                      ? 'bg-green-50 border-green-200 opacity-75'
                      : `${getPriorityColor(recommendation.priority)} hover:shadow-md`
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <motion.button
                      onClick={() => toggleAction(recommendation.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                        completedActions.has(recommendation.id)
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {completedActions.has(recommendation.id) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-xs"
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.button>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {recommendation.icon}
                        <h4 className={`font-semibold ${
                          completedActions.has(recommendation.id) ? 'line-through text-gray-500' : ''
                        }`}>
                          {recommendation.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          {getCategoryIcon(recommendation.category)}
                          <span className="text-xs px-2 py-1 rounded-full bg-white/60 font-medium">
                            {recommendation.category}
                          </span>
                        </div>
                      </div>
                      <p className={`text-sm ${
                        completedActions.has(recommendation.id) ? 'text-gray-500' : ''
                      }`}>
                        {recommendation.description}
                      </p>
                    </div>
                    
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                      recommendation.priority === 'high' ? 'bg-red-200 text-red-800' :
                      recommendation.priority === 'medium' ? 'bg-orange-200 text-orange-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      {recommendation.priority.toUpperCase()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { 
            icon: <Eye className="w-5 h-5" />, 
            label: 'Visibility', 
            value: aqiData.iaqi?.h?.v ? `${aqiData.iaqi.h.v}%` : 'N/A',
            color: 'text-blue-600'
          },
          { 
            icon: <Thermometer className="w-5 h-5" />, 
            label: 'Temperature', 
            value: aqiData.iaqi?.t?.v ? `${aqiData.iaqi.t.v}°C` : 'N/A',
            color: 'text-orange-600'
          },
          { 
            icon: <Droplets className="w-5 h-5" />, 
            label: 'Humidity', 
            value: aqiData.iaqi?.h?.v ? `${aqiData.iaqi.h.v}%` : 'N/A',
            color: 'text-cyan-600'
          },
          { 
            icon: <Wind className="w-5 h-5" />, 
            label: 'Wind Speed', 
            value: aqiData.iaqi?.w?.v ? `${aqiData.iaqi.w.v} m/s` : 'N/A',
            color: 'text-green-600'
          }
        ].map((metric, index) => (
          <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/30">
            <div className="flex items-center gap-2 mb-2">
              <div className={metric.color}>
                {metric.icon}
              </div>
              <span className="text-xs font-medium text-gray-600">{metric.label}</span>
            </div>
            <div className="text-lg font-bold text-gray-800">{metric.value}</div>
          </div>
        ))}
      </div>

      {/* Notification Settings */}
      <motion.button
        onClick={() => toggleSection('settings')}
        className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="flex items-center gap-3">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="font-bold text-gray-800">Alert Settings</h3>
        </div>
        {expandedSections.has('settings') ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </motion.button>

      <AnimatePresence>
        {expandedSections.has('settings') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AQI Alert Threshold
                </label>
                <select
                  value={settings.aqiThreshold}
                  onChange={(e) => updateSettings({ aqiThreshold: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={50}>50 - Good</option>
                  <option value={100}>100 - Moderate</option>
                  <option value={150}>150 - Unhealthy for Sensitive</option>
                  <option value={200}>200 - Unhealthy</option>
                </select>
              </div>
              
              <div className="space-y-3">
                {[
                  { key: 'pushNotifications', label: 'Push Notifications' },
                  { key: 'emergencyAlerts', label: 'Emergency Alerts' },
                  { key: 'dailySummary', label: 'Daily Summary' }
                ].map((setting) => (
                  <label key={setting.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[setting.key as keyof typeof settings] as boolean}
                      onChange={(e) => updateSettings({ [setting.key]: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{setting.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          Health recommendations based on WHO and Indian National Air Quality Standards
        </p>
        <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-400">
          <span>Last updated: {new Date(aqiData.time.s).toLocaleString()}</span>
          <span>•</span>
          <span>Source: CPCB & AQICN</span>
        </div>
      </div>
    </motion.div>
  );
};