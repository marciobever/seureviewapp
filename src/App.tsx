import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
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
    // 1) tenta buscar
    const found = await fetchProfile(u);
    if (found) return found;

    // 2) pequeno retry (trigger pode atrasar)
    if (profileTries.current < MAX_PROFILE_TRIES) {
      profileTries.current += 1;
      await new Promise(r => setTimeout(r, 1200));
      const again = await fetchProfile(u);
      if (again) return again;
    }

    // 3) fallback: tenta inserir (policies precisam permitir)
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

    // 4) falhou: retorna null (app sai do spinner)
    return null;
  };

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
      // não desloga em loop; manda para tela segura
      setProfile(null);
      setFlowState('login'); // ou 'landing'
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
    // DEV MODE opcional via ?dev=true
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

    const boot = async () => {
      try {
        setLoading(true);

        const fullUrl = new URL(window.location.href);

        // Trata erro vindo no fragmento (OAuth com hash)
        if (fullUrl.hash && fullUrl.hash.includes('error=')) {
          const params = new URLSearchParams(fullUrl.hash.replace(/^#/, ''));
          console.error('OAuth error:', params.get('error_description') || 'unknown');
          history.replaceState(null, '', window.location.pathname + window.location.search);
        }

        // Troca ?code=... (PKCE) por sessão — apenas uma vez
        const code = fullUrl.searchParams.get('code');
        const exchanged = sessionStorage.getItem('sb-code-exchanged') === '1';
        if (code && !exchanged) {
          try {
            const { error } = await supabase!.auth.exchangeCodeForSession(code);
            if (error) {
              console.error('exchangeCodeForSession error:', error);
            } else {
              sessionStorage.setItem('sb-code-exchanged', '1');
              history.replaceState(null, '', window.location.pathname); // limpa query
            }
          } catch (e) {
            console.error('exchangeCodeForSession throw:', e);
          }
        }

        // Pega sessão atual (cobre também #access_token quando detectSessionInUrl=true)
        const { data, error } = await supabase!.auth.getSession();
        if (error) console.error('getSession error:', error);
        await handleSession(data?.session ?? null);
      } finally {
        setLoading(false);
      }
    };

    boot();

    // Ouve refresh/signIn/signOut
    const { data: authListener } = supabase!.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      await handleSession(session);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // --------- actions ----------
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

  // ✅ se já estiver autenticado, não manda pra tela de login
  const handleLoginClick = () => {
    if (user && profile) setFlowState('dashboard');
    else setFlowState('login');
  };

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

  // --------- render ----------
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

    // ✅ Prioridade: se tem sessão + profile, mostramos o app (exceto fluxo de pagamento)
    if (user && profile && flowState !== 'payment') {
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

    // sessão existe mas o profile ainda está chegando
    if (user && !profile) return <LoadingFallback />;

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
          onBack={() => setFlowState('landing')}
        />
      );
    }

    if (flowState === 'contact') return <ContactPage onBack={() => setFlowState('landing')} />;

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

    return (
      <LandingPage
        onSelectPlan={handleSelectPlan}
        onShowContact={handleShowContact}
        onLoginClick={handleLoginClick}
      />
    );
  };

  return <Suspense fallback={<LoadingFallback />}>{renderAppContent()}</Suspense>;
};

export default App;
