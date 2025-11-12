// services/supabase.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vuhtjpscypnekpbtqfxx.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aHRqcHNjeXBuZWtwYnRxZnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NTgyMTAsImV4cCI6MjA3ODQzNDIxMH0.fFoFsA9-gUpHa4toGejeDQaOb-FXAptgrabwNujg-qY';

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = supabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        // ✅ Esses três já estavam OK
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,

        // ✅ Correção crucial para Safari/PKCE:
        // usa localStorage para manter a sessão após o redirect
        storage: localStorage,

        // ✅ Garante o fluxo correto para e-mail + OAuth no browser
        flowType: 'pkce',
      },
      // opcional: ajuda a identificar o cliente nos logs
      global: { headers: { 'x-client-info': 'seureview-app' } },
    })
  : (null as any);

// Debug opcional no navegador
if (typeof window !== 'undefined') (window as any).__sup = supabase;

if (!supabaseConfigured) {
  console.error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
}
