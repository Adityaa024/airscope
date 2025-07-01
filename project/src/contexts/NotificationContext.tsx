import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { AQIData } from '../types/air-quality';
import { getAQILevel } from '../utils/air-quality';

interface NotificationSettings {
  enabled: boolean;
  aqiThreshold: number;
  pushNotifications: boolean;
  emailNotifications: boolean;
  dailySummary: boolean;
  emergencyAlerts: boolean;
}

interface NotificationContextType {
  settings: NotificationSettings;
  updateSettings: (newSettings: Partial<NotificationSettings>) => void;
  checkAQIAlert: (aqiData: AQIData) => void;
  requestNotificationPermission: () => Promise<boolean>;
  hasNotificationPermission: boolean;
  sendEmergencyAlert: (aqiData: AQIData) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Check if we're in a supported environment for Service Workers
const isServiceWorkerSupported = () => {
  return (
    'serviceWorker' in navigator &&
    !window.location.hostname.includes('stackblitz') &&
    !window.location.hostname.includes('webcontainer')
  );
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    aqiThreshold: 100, // Default threshold for notifications
    pushNotifications: true,
    emailNotifications: false,
    dailySummary: true,
    emergencyAlerts: true
  });

  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [lastAlertAQI, setLastAlertAQI] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized) return;
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    }

    // Check notification permission silently
    if ('Notification' in window) {
      setHasNotificationPermission(Notification.permission === 'granted');
      
      // Auto-request permission if not set and notifications are enabled
      if (Notification.permission === 'default' && settings.pushNotifications) {
        // Don't auto-request on first load, wait for user interaction
        console.log('Notification permission not set - will request when user enables notifications');
      }
    }

    // Register service worker for background notifications only in supported environments
    if (isServiceWorkerSupported()) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    setIsInitialized(true);
  }, [isInitialized]);

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
    
    // Only show success toast if user explicitly updated settings
    if (isInitialized) {
      toast.success('Notification settings updated');
      
      // If user enabled push notifications, request permission
      if (newSettings.pushNotifications && !hasNotificationPermission) {
        requestNotificationPermission();
      }
    }
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      toast.error('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      setHasNotificationPermission(true);
      if (isInitialized) {
        toast.success('Notifications are already enabled');
      }
      return true;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        const granted = permission === 'granted';
        setHasNotificationPermission(granted);
        
        if (granted) {
          if (isInitialized) {
            toast.success('🔔 Notifications enabled! You\'ll receive AQI alerts when air quality exceeds your threshold.');
            
            // Send a test notification
            setTimeout(() => {
              sendTestNotification();
            }, 1000);
          }
        } else {
          if (isInitialized) {
            toast.error('Notification permission denied. You can enable it later in browser settings.');
          }
        }
        
        return granted;
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        if (isInitialized) {
          toast.error('Failed to request notification permission');
        }
        return false;
      }
    }

    if (isInitialized) {
      toast.error('Notifications are blocked. Please enable them in browser settings and refresh the page.');
    }
    return false;
  };

  const sendTestNotification = () => {
    if (!hasNotificationPermission || !settings.pushNotifications) return;

    try {
      const notification = new Notification('🌬️ AirScope Notifications Enabled', {
        body: 'You\'ll now receive real-time air quality alerts when AQI exceeds your threshold.',
        icon: '/vite.svg',
        tag: 'test-notification',
        badge: '/vite.svg',
        requireInteraction: false,
        timestamp: Date.now()
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 5 seconds
      setTimeout(() => notification.close(), 5000);
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  const sendNotification = (title: string, body: string, icon?: string, tag?: string) => {
    if (!hasNotificationPermission || !settings.pushNotifications || !isInitialized) return;

    try {
      const notification = new Notification(title, {
        body,
        icon: icon || '/vite.svg',
        tag: tag || 'aqi-alert',
        badge: '/vite.svg',
        requireInteraction: true,
        timestamp: Date.now(),
        actions: [
          {
            action: 'view',
            title: 'View Details'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto close after 10 seconds
      setTimeout(() => notification.close(), 10000);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const checkAQIAlert = (aqiData: AQIData) => {
    if (!settings.enabled || !aqiData || !isInitialized) return;

    const currentAQI = aqiData.aqi;
    const threshold = settings.aqiThreshold;
    const level = getAQILevel(currentAQI);

    // Avoid duplicate alerts for same AQI level (within 10 points)
    if (lastAlertAQI && Math.abs(currentAQI - lastAlertAQI) < 10) return;

    if (currentAQI >= threshold) {
      const title = `🚨 Air Quality Alert - ${level}`;
      const body = `AQI is ${currentAQI} in ${aqiData.city.name}. Consider limiting outdoor activities.`;
      
      // Send push notification
      sendNotification(title, body, undefined, 'aqi-threshold');
      
      // Show toast notification (less intrusive for repeated alerts)
      if (!lastAlertAQI || Math.abs(currentAQI - lastAlertAQI) >= 20) {
        const toastMessage = `⚠️ ${level}: AQI ${currentAQI} in ${aqiData.city.name}`;
        
        if (currentAQI >= 200) {
          toast.error(toastMessage, { 
            duration: 8000,
            style: {
              background: '#DC2626',
              color: 'white',
              fontWeight: 'bold'
            }
          });
        } else if (currentAQI >= 150) {
          toast.error(toastMessage, { duration: 6000 });
        } else {
          toast(toastMessage, { 
            duration: 4000,
            icon: '⚠️',
            style: {
              background: '#F59E0B',
              color: 'white'
            }
          });
        }
      }
      
      setLastAlertAQI(currentAQI);
    }

    // Emergency alerts for very high AQI
    if (currentAQI >= 200 && settings.emergencyAlerts) {
      sendEmergencyAlert(aqiData);
    }
  };

  const sendEmergencyAlert = (aqiData: AQIData) => {
    if (!isInitialized) return;
    
    const title = '🚨 EMERGENCY AIR QUALITY ALERT';
    const body = `HAZARDOUS air quality detected! AQI: ${aqiData.aqi} in ${aqiData.city.name}. Stay indoors immediately!`;
    
    // Send high-priority notification
    sendNotification(title, body, undefined, 'emergency-alert');
    
    // Show emergency toast
    toast.error(title, { 
      duration: 10000,
      style: {
        background: '#DC2626',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px'
      }
    });

    // Vibrate if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  const value = {
    settings,
    updateSettings,
    checkAQIAlert,
    requestNotificationPermission,
    hasNotificationPermission,
    sendEmergencyAlert
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};