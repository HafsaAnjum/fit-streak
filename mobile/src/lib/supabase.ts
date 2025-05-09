
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with the same credentials as your web app
const SUPABASE_URL = "https://vuhsbvtmzyfcookhlxdy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aHNidnRtenlmY29va2hseGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NTk0NDQsImV4cCI6MjA2MjEzNTQ0NH0.hi8XXAez4MtMOP0uafflyEW1jOC9xgN1gTFGGEIOFgg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
