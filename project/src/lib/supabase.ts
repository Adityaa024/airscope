import { createClient } from "@supabase/supabase-js";

// Get Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL is not configured in environment variables');
}

if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY is not configured in environment variables');
}

// Create Supabase client with error handling
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Export configuration info
export const getSupabaseConfig = () => {
  return {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    isConfigured: !!(supabaseUrl && supabaseAnonKey),
    url: supabaseUrl
  };
};

// Validate Supabase configuration
export const validateSupabaseConfig = (): boolean => {
  const config = getSupabaseConfig();
  
  if (!config.isConfigured) {
    console.warn('Supabase is not properly configured. Some features may not work.');
    return false;
  }
  
  return true;
};