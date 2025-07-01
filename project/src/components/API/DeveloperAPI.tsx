import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Key, 
  Copy, 
  Check, 
  Download, 
  Globe, 
  Zap,
  Shield,
  Users,
  BarChart3,
  MapPin,
  Clock,
  Database
} from 'lucide-react';
import toast from 'react-hot-toast';

interface APIEndpoint {
  method: 'GET' | 'POST';
  endpoint: string;
  description: string;
  parameters: string[];
  example: string;
  response: string;
}

export const DeveloperAPI: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'endpoints' | 'examples' | 'pricing'>('overview');

  const generateAPIKey = () => {
    const key = `asc_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`;
    setApiKey(key);
    toast.success('API key generated successfully!');
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(type);
    toast.success(`${type} copied to clipboard!`);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const apiEndpoints: APIEndpoint[] = [
    {
      method: 'GET',
      endpoint: '/api/v1/aqi/current',
      description: 'Get current AQI data for a location',
      parameters: ['location', 'lat', 'lng', 'api_key'],
      example: 'https://api.airscope.app/v1/aqi/current?location=Delhi&api_key=YOUR_API_KEY',
      response: `{
  "status": "success",
  "data": {
    "aqi": 156,
    "location": "Delhi",
    "coordinates": [28.6139, 77.2090],
    "pollutants": {
      "pm25": 89,
      "pm10": 134,
      "no2": 45,
      "o3": 67
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "health_advisory": "Unhealthy for Sensitive Groups"
  }
}`
    },
    {
      method: 'GET',
      endpoint: '/api/v1/aqi/forecast',
      description: 'Get AQI forecast for next 24-72 hours',
      parameters: ['location', 'hours', 'api_key'],
      example: 'https://api.airscope.app/v1/aqi/forecast?location=Mumbai&hours=24&api_key=YOUR_API_KEY',
      response: `{
  "status": "success",
  "data": {
    "location": "Mumbai",
    "forecast": [
      {
        "timestamp": "2024-01-15T11:00:00Z",
        "aqi": 142,
        "confidence": 95
      }
    ]
  }
}`
    },
    {
      method: 'GET',
      endpoint: '/api/v1/aqi/historical',
      description: 'Get historical AQI data',
      parameters: ['location', 'start_date', 'end_date', 'api_key'],
      example: 'https://api.airscope.app/v1/aqi/historical?location=Bangalore&start_date=2024-01-01&end_date=2024-01-15&api_key=YOUR_API_KEY',
      response: `{
  "status": "success",
  "data": {
    "location": "Bangalore",
    "period": "2024-01-01 to 2024-01-15",
    "data": [
      {
        "date": "2024-01-01",
        "aqi": 89,
        "avg_pm25": 45
      }
    ]
  }
}`
    },
    {
      method: 'POST',
      endpoint: '/api/v1/alerts/subscribe',
      description: 'Subscribe to AQI alerts',
      parameters: ['location', 'threshold', 'webhook_url', 'api_key'],
      example: 'POST https://api.airscope.app/v1/alerts/subscribe',
      response: `{
  "status": "success",
  "data": {
    "subscription_id": "sub_123456",
    "location": "Delhi",
    "threshold": 100,
    "webhook_url": "https://your-app.com/webhook"
  }
}`
    }
  ];

  const codeExamples = {
    javascript: `// JavaScript/Node.js Example
const axios = require('axios');

async function getCurrentAQI(location) {
  try {
    const response = await axios.get('https://api.airscope.app/v1/aqi/current', {
      params: {
        location: location,
        api_key: 'YOUR_API_KEY'
      }
    });
    
    console.log('Current AQI:', response.data.data.aqi);
    return response.data;
  } catch (error) {
    console.error('Error fetching AQI:', error);
  }
}

getCurrentAQI('Delhi');`,

    python: `# Python Example
import requests

def get_current_aqi(location):
    url = "https://api.airscope.app/v1/aqi/current"
    params = {
        "location": location,
        "api_key": "YOUR_API_KEY"
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        print(f"Current AQI: {data['data']['aqi']}")
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching AQI: {e}")

get_current_aqi("Delhi")`,

    curl: `# cURL Example
curl -X GET "https://api.airscope.app/v1/aqi/current?location=Delhi&api_key=YOUR_API_KEY" \\
  -H "Accept: application/json" \\
  -H "User-Agent: YourApp/1.0"`,

    php: `<?php
// PHP Example
function getCurrentAQI($location) {
    $url = "https://api.airscope.app/v1/aqi/current";
    $params = http_build_query([
        'location' => $location,
        'api_key' => 'YOUR_API_KEY'
    ]);
    
    $response = file_get_contents($url . '?' . $params);
    $data = json_decode($response, true);
    
    if ($data && $data['status'] === 'success') {
        echo "Current AQI: " . $data['data']['aqi'];
        return $data;
    }
    
    return null;
}

getCurrentAQI("Delhi");
?>`
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
            <Code className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AirScope Developer API
            </h1>
            <p className="text-gray-600">Integrate real-time air quality data into your applications</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          {[
            { key: 'overview', label: 'Overview', icon: <Globe className="w-4 h-4" /> },
            { key: 'endpoints', label: 'API Endpoints', icon: <Database className="w-4 h-4" /> },
            { key: 'examples', label: 'Code Examples', icon: <Code className="w-4 h-4" /> },
            { key: 'pricing', label: 'Pricing', icon: <BarChart3 className="w-4 h-4" /> }
          ].map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                selectedTab === tab.key
                  ? 'bg-white text-purple-600 shadow-md'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* API Key Generation */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Key className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Get Your API Key</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-4">
                  Generate your API key to start integrating AirScope data into your applications. 
                  Our API provides real-time air quality data, forecasts, and historical information.
                </p>
                <motion.button
                  onClick={generateAPIKey}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg"
                >
                  <Key className="w-5 h-5" />
                  Generate API Key
                </motion.button>
              </div>
              
              {apiKey && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your API Key
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={apiKey}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg font-mono text-sm"
                    />
                    <motion.button
                      onClick={() => copyToClipboard(apiKey, 'API Key')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      {copiedEndpoint === 'API Key' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </motion.button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Keep this key secure and don't share it publicly
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Zap className="w-6 h-6 text-yellow-500" />,
                title: 'Real-time Data',
                description: 'Get current AQI data updated every 15 minutes from monitoring stations across India',
                bg: 'from-yellow-50 to-orange-50',
                border: 'border-yellow-200'
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-blue-500" />,
                title: 'Forecasting',
                description: 'AI-powered air quality predictions for up to 72 hours with confidence intervals',
                bg: 'from-blue-50 to-cyan-50',
                border: 'border-blue-200'
              },
              {
                icon: <Clock className="w-6 h-6 text-green-500" />,
                title: 'Historical Data',
                description: 'Access historical air quality trends and patterns for analysis and research',
                bg: 'from-green-50 to-emerald-50',
                border: 'border-green-200'
              },
              {
                icon: <MapPin className="w-6 h-6 text-purple-500" />,
                title: 'Location-based',
                description: 'Query data by city name, coordinates, or postal code with automatic geocoding',
                bg: 'from-purple-50 to-pink-50',
                border: 'border-purple-200'
              },
              {
                icon: <Shield className="w-6 h-6 text-red-500" />,
                title: 'Health Alerts',
                description: 'Set up webhooks for AQI threshold alerts and emergency notifications',
                bg: 'from-red-50 to-rose-50',
                border: 'border-red-200'
              },
              {
                icon: <Users className="w-6 h-6 text-indigo-500" />,
                title: 'City Integration',
                description: 'Designed for government agencies, schools, hospitals, and smart city initiatives',
                bg: 'from-indigo-50 to-blue-50',
                border: 'border-indigo-200'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-2xl border ${feature.border} bg-gradient-to-br ${feature.bg} shadow-lg`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/80 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-800">{feature.title}</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* API Endpoints Tab */}
      {selectedTab === 'endpoints' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {apiEndpoints.map((endpoint, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                    endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-lg font-mono text-gray-800">{endpoint.endpoint}</code>
                </div>
                <motion.button
                  onClick={() => copyToClipboard(endpoint.example, `Endpoint ${index}`)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  {copiedEndpoint === `Endpoint ${index}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </motion.button>
              </div>
              
              <p className="text-gray-600 mb-4">{endpoint.description}</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Parameters</h4>
                  <div className="space-y-2">
                    {endpoint.parameters.map((param, paramIndex) => (
                      <code key={paramIndex} className="block px-3 py-1 bg-gray-100 rounded text-sm">
                        {param}
                      </code>
                    ))}
                  </div>
                  
                  <h4 className="font-semibold text-gray-800 mt-4 mb-2">Example Request</h4>
                  <div className="p-3 bg-gray-900 rounded-lg overflow-x-auto">
                    <code className="text-green-400 text-sm">{endpoint.example}</code>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Response</h4>
                  <div className="p-3 bg-gray-900 rounded-lg overflow-x-auto">
                    <pre className="text-green-400 text-xs">{endpoint.response}</pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Code Examples Tab */}
      {selectedTab === 'examples' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {Object.entries(codeExamples).map(([language, code], index) => (
            <div key={language} className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 capitalize">{language}</h3>
                <motion.button
                  onClick={() => copyToClipboard(code, language)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  {copiedEndpoint === language ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy
                </motion.button>
              </div>
              <div className="p-4 bg-gray-900 rounded-lg overflow-x-auto">
                <pre className="text-green-400 text-sm">{code}</pre>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Pricing Tab */}
      {selectedTab === 'pricing' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Free Tier',
                price: '₹0',
                period: '/month',
                requests: '1,000',
                features: [
                  'Current AQI data',
                  'Basic forecasting',
                  'Email support',
                  'Rate limit: 100/hour'
                ],
                color: 'from-green-500 to-emerald-500',
                popular: false
              },
              {
                name: 'Professional',
                price: '₹2,999',
                period: '/month',
                requests: '50,000',
                features: [
                  'All Free features',
                  'Historical data access',
                  'Webhook alerts',
                  'Priority support',
                  'Rate limit: 1000/hour'
                ],
                color: 'from-blue-500 to-purple-500',
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                requests: 'Unlimited',
                features: [
                  'All Professional features',
                  'Custom integrations',
                  'Dedicated support',
                  'SLA guarantee',
                  'White-label options'
                ],
                color: 'from-purple-500 to-pink-500',
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-6 rounded-2xl border-2 ${
                  plan.popular ? 'border-blue-300 shadow-xl' : 'border-gray-200 shadow-lg'
                } bg-white`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-blue-500 text-white text-sm font-bold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-gray-800">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{plan.requests} requests/month</p>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Usage Guidelines */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-bold text-blue-800 mb-4">Usage Guidelines</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <h4 className="font-semibold mb-2">Rate Limits</h4>
                <ul className="space-y-1">
                  <li>• Free: 100 requests/hour</li>
                  <li>• Professional: 1,000 requests/hour</li>
                  <li>• Enterprise: Custom limits</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data Retention</h4>
                <ul className="space-y-1">
                  <li>• Current data: Real-time</li>
                  <li>• Historical: Up to 2 years</li>
                  <li>• Forecasts: 72 hours ahead</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};