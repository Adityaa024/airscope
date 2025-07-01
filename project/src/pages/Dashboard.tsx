import React from 'react';
import { motion } from 'framer-motion';
import { Wind, User, LogOut, Leaf, Users, ArrowLeft, Activity, Map, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleBackToApp = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={handleBackToApp}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to App</span>
              </motion.button>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Wind className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    AirScope Dashboard
                  </h1>
                  <p className="text-sm text-gray-600">Welcome back, {user?.email}</p>
                </div>
              </div>
            </div>
            
            <motion.button
              onClick={handleSignOut}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Welcome to AirScope!</h2>
              <p className="text-gray-600">Your personal air quality companion</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </h3>
              <div className="space-y-2">
                <p className="text-blue-700 text-sm">
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                <p className="text-blue-700 text-sm">
                  <span className="font-medium">Joined:</span> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Recently'}
                </p>
                <p className="text-blue-700 text-sm">
                  <span className="font-medium">Status:</span> Active Member
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Quick Stats
              </h3>
              <div className="space-y-2">
                <p className="text-green-700 text-sm">
                  <span className="font-medium">Features:</span> All Access
                </p>
                <p className="text-green-700 text-sm">
                  <span className="font-medium">Eco Tips:</span> Available
                </p>
                <p className="text-green-700 text-sm">
                  <span className="font-medium">Community:</span> Connected
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <Link
            to="/"
            className="group bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-200">
                <Wind className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Air Quality Monitor</h3>
            </div>
            <p className="text-gray-600">Check real-time air quality data for your location</p>
          </Link>

          <Link
            to="/eco-tips"
            className="group bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl group-hover:from-green-200 group-hover:to-green-300 transition-all duration-200">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Eco Tips</h3>
            </div>
            <p className="text-gray-600">Discover community tips for cleaner air</p>
          </Link>

          <Link
            to="/map"
            className="group bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-200">
                <Map className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Air Quality Map</h3>
            </div>
            <p className="text-gray-600">Explore air quality data across different regions</p>
          </Link>

          <Link
            to="/forecast"
            className="group bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-200">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Forecast</h3>
            </div>
            <p className="text-gray-600">View AI-powered air quality predictions</p>
          </Link>

          <Link
            to="/history"
            className="group bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all duration-200">
                <Activity className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Historical Data</h3>
            </div>
            <p className="text-gray-600">Analyze air quality trends over time</p>
          </Link>

          <div className="group bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-xl border border-gray-300 p-6 opacity-75">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gray-300 rounded-xl">
                <Users className="w-6 h-6 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600">More Features</h3>
            </div>
            <p className="text-gray-500">Additional features coming soon!</p>
          </div>
        </motion.div>

        {/* Feature Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">🎉 Welcome to the Community!</h3>
              <p className="text-blue-100 mb-4">
                You now have access to all AirScope features including eco tips, community insights, and personalized air quality tracking.
              </p>
              <Link
                to="/eco-tips"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-200 font-semibold"
              >
                <Leaf className="w-5 h-5" />
                Explore Eco Tips
              </Link>
            </div>
            <div className="hidden lg:block text-6xl">
              🌱
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};