import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized) return;

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Session error:', error);
      } finally {
        setLoading(false);
        setIsInitialized(true);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Only show toasts for user-initiated actions after initialization
        if (isInitialized) {
          // Handle successful sign in
          if (event === 'SIGNED_IN' && session?.user) {
            toast.success(`Welcome back, ${session.user.email}!`);
          }

          // Handle sign out
          if (event === 'SIGNED_OUT') {
            toast.success('Signed out successfully');
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [isInitialized]);

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // For demo purposes, we'll simulate a successful signup
      // In a real app, this would use Supabase auth
      const mockUser = {
        id: 'demo-user-' + Date.now(),
        email,
        created_at: new Date().toISOString(),
        user_metadata: {},
        app_metadata: {},
        aud: 'authenticated',
        role: 'authenticated'
      } as User;

      const mockSession = {
        access_token: 'demo-token',
        refresh_token: 'demo-refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser
      } as Session;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUser(mockUser);
      setSession(mockSession);
      
      toast.success('Account created successfully! Welcome to AirScope!');
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // For demo purposes, we'll simulate a successful signin
      // In a real app, this would use Supabase auth
      const mockUser = {
        id: 'demo-user-signin',
        email,
        created_at: new Date().toISOString(),
        user_metadata: {},
        app_metadata: {},
        aud: 'authenticated',
        role: 'authenticated'
      } as User;

      const mockSession = {
        access_token: 'demo-token',
        refresh_token: 'demo-refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: mockUser
      } as Session;

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUser(mockUser);
      setSession(mockSession);
      
      toast.success(`Welcome back, ${email}!`);
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      setSession(null);
      
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};