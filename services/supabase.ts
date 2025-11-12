// services/supabase.ts
import { createClient } from '@supabase/supabase-js';

// ⚠️ Em produção prefira variáveis de ambiente Vite:
// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const SUPABASE_URL = 'https://vuhtjpscypnekpbtqfxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ1aHRqcHNjeXBuZWtwYnRxZnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NTgyMTAsImV4cCI6MjA3ODQzNDIxMH0.fFoFsA9-gUpHa4toGejeDQaOb-FXAptgrabwNujg-qY';

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = supabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // lê o #access_token após o redirect OAuth
      },
    })
  : null;

// opcional: ajuda no debug pelo console do navegador
// @ts-ignore
if (typeof window !== 'undefined') (window as any).__sup = supabase;

if (!supabaseConfigured) {
  console.error(
    'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (ou ajuste neste arquivo).'
  );
}
