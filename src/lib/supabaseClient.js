import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;

// Singleton pattern for Supabase clients
let supabaseInstance = null;
let supabaseServiceInstance = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: {
          getItem: (key) => localStorage.getItem(key),
          setItem: (key, value) => localStorage.setItem(key, value),
          removeItem: (key) => localStorage.removeItem(key),
        },
      },
    });
  }
  return supabaseInstance;
};

export const getSupabaseServiceClient = () => {
  if (!supabaseServiceInstance) {
    supabaseServiceInstance = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return supabaseServiceInstance;
};

// Export the initialized clients
export const supabase = getSupabaseClient();
export const supabaseService = getSupabaseServiceClient();
