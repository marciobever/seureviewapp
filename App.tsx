import React, { useState, useEffect, Suspense, lazy } from 'react';
import { supabase, supabaseConfigured } from './services/supabase';
import type { User, Session } from '@supabase/supabase-js';

// Lazy load components
const LandingPage = lazy(() => import('./components/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./components/LoginPage').then(m => ({ default: m.LoginPage })));
const RegistrationPage = lazy(() => import('../components/RegistrationPage').then(m => ({ default: m.RegistrationPage })));
const DashboardLayout = lazy(() => import('./components/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const ContentGeneratorPage = lazy(() => import('./components/ContentGeneratorPage').then(m => ({ default: m.ContentGeneratorPage })));
const ReelsGeneratorPage = lazy(() => import('../components/ReelsGeneratorPage').then(m => ({ default: m.ReelsGeneratorPage })));
const CommentBotPage = lazy(() => import('./components/CommentBotPage').then(m => ({ default: m.CommentBotPage })));
const HistoryPage = lazy(() => import('./components/HistoryPage').then(m => ({ default: m.HistoryPage })));
const ProfilePage = lazy(() => import('../components/ProfilePage').then(m => ({ default: m.ProfilePage })));
const ApiKeysPage = lazy(() => import('./components/ApiKeysPage').then(m => ({ default: m.ApiKeysPage })));
const BillingPage = lazy(() => import('./components/BillingPage').then(m => ({ default: m.BillingPage })));
const PaymentPage = lazy(() => import('../components/PaymentPage').then(m => ({ default: m.PaymentPage })));
const HelpPage = lazy(() => import('./components/HelpPage').then(m => ({ default: m.HelpPage })));
const ContactPage = lazy(() => import('./components/ContactPage').then(m => ({ default: m.ContactPage })));
const SchedulingPage = lazy(() => import('../components/SchedulingPage').then(m => ({ default: m.SchedulingPage })));
const BlogGeneratorPage = lazy(() => import('./components/BlogGeneratorPage').then(m => ({ default: m.BlogGeneratorPage })));
const VideoScriptGeneratorPage = lazy(() => import('../components/VideoScriptGeneratorPage').then(m => ({ default: m.VideoScriptGeneratorPage })));
const CampaignsPage = lazy(() => import('./components/CampaignsPage').then(m => ({ default: m.CampaignsPage })));

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

const App: React.FC = () => {
  if (!supabaseConfigured) return <SupabaseConfigError />;

  const [flowState, setFlowState] = useState<AppFlowState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('contentGenerator');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // util: busca perfil
  const fetchProfile = async (u: User): Promise<UserProfile | null> => {
    const { data, error } = await supabase!
      .from('profiles')
      .select('*')
      .eq('id', u.id)
      .single();

    // PGRST116 = no rows
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      return null;
    }
    return (data as UserProfile) ?? null;
  };

  // util: cria perfil fallback
  const ensureProfile = async (u: User): Promise<UserProfile | null> => {
    let p = await fetchProfile(u);
    if (p) return p;

    console.log('Profile not found, retry in 1.5s…');
    await new Promise(r => setTimeout(r, 1500));
    p = await fetchProfile(u);
    if (p) return p;

    console.warn('Creating profile fallback…');
    const getCreditsForPlan = (plan?: string | null) => {
      if (plan === 'PRO') return 50;
      if (plan === 'AGENCY') return 150;
      return 5;
    };
    const planFromReg = sessionStorage.getItem('selectedPlan') || 'FREE';
    const initialPlan = (['FREE', 'PRO', 'AGENCY'].includes(planFromReg) ? planFromReg : 'FREE') as UserProfile['plan'];

    const { data: newProfile, error: insertError } = await supabase!
      .from('profiles')
      .insert({
        id: u.id,
        full_name: u.user_metadata.full_name || u.email || 'Novo Usuário',
        avatar_url: u.user_metadata.avatar_url || '',
        plan: initialPlan,
        credits: getCreditsForPlan(initialPlan),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Fatal: could not create profile.', insertError);
      return null;
    }
    return newProfile as UserProfile;
  };

  // util: aplica sessão atual ao estado
  const handleSession = async (session: Session | null) => {
    const u = session?.user ?? null;
    setUser(u);

    if (!u) {
      setProfile(null);
      setFlowState('landing');
      return;
    }

    const p = await ensureProfile(u);
    if (!p) {
      // se falhar, signOut e volta
      await supabase!.auth.signOut().catch(() => {});
      setUser(null);
      setProfile(null);
      setFlowState('landing');
      return;
    }

    // safety credit default
    if (!p.credits) {
      p.credits = p.plan === 'PRO' ? 50 : p.plan === 'AGENCY' ? 150 : 5;
    }
    setProfile(p);

    const planFromStorage = sessionStorage.getItem('selectedPlan');
    setFlowState(planFromStorage ? 'payment' : 'dashboard');
  };

  useEffect(() => {
    // Dev mode
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

    // Restaurar plano escolhido
    const storedPlan = sessionStorage.getItem('selectedPlan');
    if (storedPlan) setSelectedPlan(storedPlan);

    // 1) Carregar sessão atual imediatamente (pega o login pós-OAuth)
    const boot = async () => {
      setLoading(true);

      // Trata possíveis erros vindos do redirect do OAuth
      const hash = new URL(window.location.href).hash;
      if (hash && hash.includes('error=')) {
        const params = new URLSearchParams(hash.replace(/^#/, ''));
        const errDesc = params.get('error_description');
        console.error('OAuth error:', errDesc || 'unknown');
        // limpa fragmento da URL sem recarregar
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }

      const { data: sessData, error: sessErr } = await supabase!.auth.getSession();
      if (sessErr) console.error('getSession error:', sessErr);
      await handleSession(sessData?.session ?? null);
      setLoading(false);
    };

    boot();

    // 2) Listener para mudanças futuras (autoRefresh / signOut / etc.)
    const { data: authListener } = supabase!.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      await handleSession(session);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    sessionStorage.setItem('selectedPlan', planName);
    setFlowState('register');
  };

  const handlePaymentSuccess = () => {
    alert('Pagamento bem-sucedido! Bem-vindo ao seu dashboard.');
    sessionStorage.removeItem('selectedPlan');
    setSelectedPlan(null);
    setFlowState('dashboard');
  };

  const handleRegistrationSuccess = () => setFlowState('payment');

  const handleLoginClick = () => setFlowState('login');

  const handleShowContact = () => setFlowState('contact');

  const handleLogout = async () => {
    await supabase!.auth.signOut().catch(err => console.error('Sign out failed', err));
    setUser(null);
    setProfile(null);
    setCurrentPage('contentGenerator');
    sessionStorage.removeItem('selectedPlan');
    setSelectedPlan(null);
    if (window.location.search.includes('dev=true')) {
      window.location.href = window.location.origin + window.location.pathname;
    } else {
      setFlowState('landing');
    }
  };

  const renderCurrentPage = () => {
    if (!user || !profile) return <LoadingFallback />;

    switch (currentPage) {
      case 'contentGenerator': return <ContentGeneratorPage />;
      case 'reelsGenerator': return <ReelsGeneratorPage profile={profile} />;
      case 'blogGenerator': return <BlogGeneratorPage profile={profile} />;
      case 'videoScriptGenerator': return <VideoScriptGeneratorPage profile={profile} />;
      case 'commentBot': return <CommentBotPage />;
      case 'history': return <HistoryPage />;
      case 'scheduling': return <SchedulingPage />;
      case 'campaigns': return <CampaignsPage />;
      case 'profile': return <ProfilePage user={user} profile={profile} />;
      case 'apiKeys': return <ApiKeysPage />;
      case 'billing': return <BillingPage />;
      case 'help': return <HelpPage />;
      default: return <ContentGeneratorPage />;
    }
  };

  const renderAppContent = () => {
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
      return <PaymentPage planName={selectedPlan} onPaymentSuccess={handlePaymentSuccess} onBack={() => setFlowState('landing')} />;
    }

    if (flowState === 'contact') {
      return <ContactPage onBack={() => setFlowState('landing')} />;
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

    return <LandingPage onSelectPlan={handleSelectPlan} onShowContact={handleShowContact} onLoginClick={handleLoginClick} />;
  };

  return <Suspense fallback={<LoadingFallback />}>{renderAppContent()}</Suspense>;
};

export default App;
