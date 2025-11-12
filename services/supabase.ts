// services/supabase.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vuhtjpscypnekpbtqfxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aHRqcHNjeXBuZWtwYnRxZnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NTgyMTAsImV4cCI6MjA3ODQzNDIxMH0.fFoFsA9-gUpHa4toGejeDQaOb-FXAptgrabwNujg-qY';

export const supabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = supabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // lê tokens/fragmentos do retorno
        flowType: 'pkce',         // *** importante para OAuth no browser ***
      },
    })
  : null as any;

// debug opcional
if (typeof window !== 'undefined') (window as any).__sup = supabase;

if (!supabaseConfigured) {
  console.error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
}
