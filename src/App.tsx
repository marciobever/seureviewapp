import React, { useState, useEffect, useRef } from 'react';
import { supabase, supabaseConfigured } from './services/supabase';
import type { User, Session } from '@supabase/supabase-js';

// Imports diretos (sem lazy / Suspense)
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegistrationPage } from '../components/RegistrationPage';
import { DashboardLayout } from './components/DashboardLayout';
import { ContentGeneratorPage } from './components/ContentGeneratorPage';
import { ReelsGeneratorPage } from '../components/ReelsGeneratorPage';
import { CommentBotPage } from './components/CommentBotPage';
import { HistoryPage } from './components/HistoryPage';
import { ProfilePage } from '../components/ProfilePage';
import { ApiKeysPage } from './components/ApiKeysPage';
import { BillingPage } from './components/BillingPage';
import { PaymentPage } from '../components/PaymentPage';
import { HelpPage } from './components/HelpPage';
import { ContactPage } from './components/ContactPage';
import { SchedulingPage } from '../components/SchedulingPage';
import { BlogGeneratorPage } from './components/BlogGeneratorPage';
import { VideoScriptGeneratorPage } from '../components/VideoScriptGeneratorPage';
import { CampaignsPage } from './components/CampaignsPage';

export type Page =
  | 'contentGenerator' | 'reelsGenerator' | 'commentBot' | 'history'
  | 'profile' | 'apiKeys' | 'billing' | 'help' | 'scheduling'
  | 'blogGenerator' | 'videoScriptGenerator' | 'campaigns';

type AppFlowState = 'landing' | 'payment' | 'login' | 'register' | 'dashboard' | 'contact';

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  plan: 'FREE' | 'PRO' | 'AGENCY';
  credits: number;
  stripe_customer_id?: string;
}

const LoadingFallback: React.FC = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-t-orange-500 border-slate-700 rounded-full animate-spin"></div>
  </div>
);

const SupabaseConfigError: React.FC = () => (
  <div className="min-h-screen bg-slate-950 text-gray-200 flex flex-col items-center justify-center p-4">
    <div className="w-full max-w-2xl text-center bg-slate-800 border border-red-500/50 rounded-lg p-8">
      <div className="text-5xl mb-4" role="img" aria-label="tool icon">🔧</div>
      <h1 className="text-2xl font-bold text-red-400 mb-2">Erro de Configuração</h1>
      <p className="text-red-300 mb-6">
        As credenciais do Supabase não foram definidas (<code>SUPABASE_URL</code> / <code>SUPABASE_ANON_KEY</code>).
      </p>
    </div>
    <footer className="absolute bottom-0 py-6 text-center text-gray-600 text-sm">
      <p>&copy; {new Date().getFullYear()} Seu Review AI. Potencializado por Gemini.</p>
    </footer>
  </div>
);

// (por enquanto não usamos HAS_GEMINI pra não travar nada por falta de env)
// const HAS_GEMINI = !!(import.meta as any)?.env?.VITE_GEMINI_API_KEY;

const App: React.FC = () => {
  if (!supabaseConfigured) return <SupabaseConfigError />;

  // ====== roteamento simples por pathname ======
  const url = new URL(window.location.href);
  const isAppPath = url.pathname.startsWith('/app') || url.searchParams.get('app') === '1';
  // Se NÃO for /app, mostramos SEMPRE a landing (corrige Safari mostrando login)
  const forceMarketing = !isAppPath;

  const [flowState, setFlowState] = useState<AppFlowState>(forceMarketing ? 'landing' : 'login');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(!forceMarketing);
  const [currentPage, setCurrentPage] = useState<Page>('contentGenerator');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // anti-loop: limite de tentativas para obter/criar profile
  const profileTries = useRef(0);
  const MAX_PROFILE_TRIES = 3;

  // --------- helpers: profile ----------
  const fetchProfile = async (u: User): Promise<UserProfile | null> => {
    const { data, error } = await supabase!
      .from('profiles')
      .select('*')
      .eq('id', u.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('profiles SELECT error:', error);
      return null;
    }
    return (data as UserProfile) ?? null;
  };

  const ensureProfile = async (u: User): Promise<UserProfile | null> => {
    const found = await fetchProfile(u);
    if (found) return found;

    if (profileTries.current < MAX_PROFILE_TRIES) {
      profileTries.current += 1;
      await new Promise(r => setTimeout(r, 1200));
      const again = await fetchProfile(u);
      if (again) return again;
    }

    // fallback de INSERT — só vai funcionar se as policies permitirem
    try {
      const planFromReg = (sessionStorage.getItem('selectedPlan') || 'FREE') as UserProfile['plan'];
      const credits = planFromReg === 'PRO' ? 50 : planFromReg === 'AGENCY' ? 150 : 5;

      const { data: inserted, error: insErr } = await supabase!
        .from('profiles')
        .insert({
          id: u.id,
          full_name: u.user_metadata.full_name || u.email || 'Novo Usuário',
          avatar_url: u.user_metadata.avatar_url || '',
          plan: planFromReg,
          credits,
        })
        .select()
        .single();

      if (!insErr && inserted) return inserted as UserProfile;
      console.warn('profiles INSERT fallback error:', insErr);
    } catch (e) {
      console.warn('profiles INSERT fallback exception:', e);
    }

    return null;
  };

  const handleSession = async (session: Session | null) => {
    const u = session?.user ?? null;
    setUser(u);

    if (!u) {
      setProfile(null);
      setFlowState(forceMarketing ? 'landing' : 'login');
      return;
    }

    const p = await ensureProfile(u);
    if (!p) {
      setProfile(null);
      setFlowState('login');
      return;
    }

    if (!p.credits) {
      p.credits = p.plan === 'PRO' ? 50 : p.plan === 'AGENCY' ? 150 : 5;
    }

    setProfile(p);

    const planFromStorage = sessionStorage.getItem('selectedPlan');
    setFlowState(planFromStorage ? 'payment' : 'dashboard');
  };

  // --------- boot + listeners ----------
  useEffect(() => {
    // Se estamos na landing (marketing), não mexe com Supabase aqui.
    if (forceMarketing) return;

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('dev') === 'true') {
      console.warn('--- DEV MODE ACTIVATED ---');
      const mockUser = {
        id: '00000000-0000-0000-0000-000000000000',
        email: 'dev@seureview.ai',
        user_metadata: {
          full_name: 'Dev Maintainer',
          avatar_url: `https://ui-avatars.com/api/?name=Dev&background=1e293b&color=fb923c`,
        },
        app_metadata: { provider: 'email' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const mockProfile: UserProfile = {
        id: '00000000-0000-0000-0000-000000000000',
        full_name: 'Dev Maintainer',
        avatar_url: `https://ui-avatars.com/api/?name=Dev&background=1e293b&color=fb923c`,
        plan: 'AGENCY',
        credits: 9999,
      };

      setUser(mockUser);
      setProfile(mockProfile);
      setFlowState('dashboard');
      setLoading(false);
      return;
    }

    const storedPlan = sessionStorage.getItem('selectedPlan');
    if (storedPlan) setSelectedPlan(storedPlan);

    let cancelled = false;

    const boot = async () => {
      try {
        setLoading(true);

        const fullUrl = new URL(window.location.href);

        // Trata erro vindo no fragmento (hash)
        if (fullUrl.hash && fullUrl.hash.includes('error=')) {
          const params = new URLSearchParams(fullUrl.hash.replace(/^#/, ''));
          console.error('OAuth error:', params.get('error_description') || 'unknown');
          history.replaceState(null, '', fullUrl.pathname + fullUrl.search);
        }

        const { data, error } = await supabase!.auth.getSession();
        if (error) {
          console.error('getSession error:', error);
        } else if (!cancelled) {
          await handleSession(data?.session ?? null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    boot();

    const { data: authListener } = supabase!.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
            await handleSession(session);
            return;
          }
          await handleSession(session);
        } catch (e) {
          console.error('onAuthStateChange handleSession error:', e);
        }
      }
    );

    return () => {
      cancelled = true;
      authListener.subscription.unsubscribe();
    };
  }, [forceMarketing]);

  // --------- actions ----------
  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    sessionStorage.setItem('selectedPlan', planName);
    window.location.href = '/app';
  };

  const handlePaymentSuccess = () => {
    alert('Pagamento bem-sucedido! Bem-vindo ao seu dashboard.');
    sessionStorage.removeItem('selectedPlan');
    setSelectedPlan(null);
    setFlowState('dashboard');
  };

  const handleRegistrationSuccess = () => setFlowState('payment');

  const handleLoginClick = () => {
    if (forceMarketing) {
      window.location.href = '/app';
    } else {
      setFlowState('login');
    }
  };

  const handleShowContact = () => setFlowState('contact');

  const handleLogout = async () => {
    await supabase!.auth.signOut().catch(err => console.error('Sign out failed', err));
    setUser(null);
    setProfile(null);
    setCurrentPage('contentGenerator');
    sessionStorage.removeItem('selectedPlan');
    setSelectedPlan(null);
    window.location.href = '/';
  };

  // --------- render ----------
  const renderCurrentPage = () => {
    if (!user || !profile) return <LoadingFallback />;

    switch (currentPage) {
      case 'contentGenerator':
        return <ContentGeneratorPage />;

      case 'reelsGenerator':
        return <ReelsGeneratorPage profile={profile} />;

      case 'blogGenerator':
        return <BlogGeneratorPage profile={profile} />;

      case 'videoScriptGenerator':
        return <VideoScriptGeneratorPage profile={profile} />;

      case 'commentBot':
        return <CommentBotPage />;

      case 'history':
        return <HistoryPage />;

      case 'scheduling':
        return <SchedulingPage />;

      case 'campaigns':
        return <CampaignsPage />;

      case 'profile':
        return <ProfilePage user={user} profile={profile} />;

      case 'apiKeys':
        return <ApiKeysPage />;

      case 'billing':
        return <BillingPage />;

      case 'help':
        return <HelpPage />;

      default:
        return <ContentGeneratorPage />;
    }
  };

  const renderAppContent = () => {
    // LANDING sempre que não for /app
    if (forceMarketing) {
      return (
        <LandingPage
          onSelectPlan={handleSelectPlan}
          onShowContact={handleShowContact}
          onLoginClick={handleLoginClick}
        />
      );
    }

    if (loading) return <LoadingFallback />;

    if (user && profile && flowState === 'dashboard') {
      return (
        <DashboardLayout
          user={user}
          profile={profile}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLogout={handleLogout}
        >
          {renderCurrentPage()}
        </DashboardLayout>
      );
    }

    if (user && !profile && flowState === 'dashboard') {
      return <LoadingFallback />;
    }

    if (flowState === 'register' && selectedPlan) {
      return (
        <RegistrationPage
          onRegistrationSuccess={handleRegistrationSuccess}
          onGoToLogin={() => {
            sessionStorage.removeItem('selectedPlan');
            setSelectedPlan(null);
            setFlowState('login');
          }}
          planName={selectedPlan}
        />
      );
    }

    if (flowState === 'payment' && selectedPlan) {
      return (
        <PaymentPage
          planName={selectedPlan}
          onPaymentSuccess={handlePaymentSuccess}
          onBack={() => setFlowState('login')}
        />
      );
    }

    if (flowState === 'contact') {
      return <ContactPage onBack={() => setFlowState('login')} />;
    }

    if (flowState === 'login') {
      return (
        <LoginPage
          onGoToRegister={() => {
            if (!selectedPlan) setSelectedPlan('PRO');
            setFlowState('register');
          }}
        />
      );
    }

    return <LoadingFallback />;
  };

  // Sem Suspense, render direto
  return renderAppContent();
};

export default App;
