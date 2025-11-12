
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vuhtjpscypnekpbtqfxx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aHRqcHNjeXBuZWtwYnRxZnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NTgyMTAsImV4cCI6MjA3ODQzNDIxMH0.fFoFsA9-gUpHa4toGejeDQaOb-FXAptgrabwNujg-qY';

export const supabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

let supabase = null;

if (supabaseConfigured) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error("Supabase URL (SUPABASE_URL) and Anon Key (SUPABASE_ANON_KEY) are not configured in environment variables. The app will not function correctly.");
}

export { supabase };