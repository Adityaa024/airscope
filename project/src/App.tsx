import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Wind, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home';
import { Forecast } from './pages/Forecast';
import { History } from './pages/History';
import { MapView } from './pages/MapView';
import { EcoTips } from './pages/EcoTips';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { API } from './pages/API';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LocationProvider } from './contexts/LocationContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

import './i18n';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <NotificationProvider>
            <Router>
              <Routes>
                {/* Auth routes without layout */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Main app routes with layout */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="forecast" element={<Forecast />} />
                  <Route path="history" element={<History />} />
                  <Route path="map" element={<MapView />} />
                  <Route path="api" element={<API />} />
                  <Route path="eco-tips" element={
                    <ProtectedRoute>
                      <EcoTips />
                    </ProtectedRoute>
                  } />
                  <Route path="dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                </Route>
              </Routes>
            </Router>
          </NotificationProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;