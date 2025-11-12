
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { supabase, supabaseConfigured } from './services/supabase';
import type { User } from '@supabase/supabase-js';

// Lazy load components for better initial performance
const LandingPage = lazy(() => import('./components/LandingPage').then(module => ({ default: module.LandingPage })));
const LoginPage = lazy(() => import('./components/LoginPage').then(module => ({ default: module.LoginPage })));
const RegistrationPage = lazy(() => import('../components/RegistrationPage').then(module => ({ default: module.RegistrationPage })));
const DashboardLayout = lazy(() => import('./components/DashboardLayout').then(module => ({ default: module.DashboardLayout })));
const ContentGeneratorPage = lazy(() => import('./components/ContentGeneratorPage').then(module => ({ default: module.ContentGeneratorPage })));
const ReelsGeneratorPage = lazy(() => import('../components/ReelsGeneratorPage').then(module => ({ default: module.ReelsGeneratorPage })));
const CommentBotPage = lazy(() => import('./components/CommentBotPage').then(module => ({ default: module.CommentBotPage })));
const HistoryPage = lazy(() => import('./components/HistoryPage').then(module => ({ default: module.HistoryPage })));
const ProfilePage = lazy(() => import('../components/ProfilePage').then(module => ({ default: module.ProfilePage })));
const ApiKeysPage = lazy(() => import('./components/ApiKeysPage').then(module => ({ default: module.ApiKeysPage })));
const BillingPage = lazy(() => import('./components/BillingPage').then(module => ({ default: module.BillingPage })));
const PaymentPage = lazy(() => import('../components/PaymentPage').then(module => ({ default: module.PaymentPage })));
const HelpPage = lazy(() => import('./components/HelpPage').then(module => ({ default: module.HelpPage })));
const ContactPage = lazy(() => import('./components/ContactPage').then(module => ({ default: module.ContactPage })));
const SchedulingPage = lazy(() => import('../components/SchedulingPage').then(module => ({ default: module.SchedulingPage })));
const BlogGeneratorPage = lazy(() => import('./components/BlogGeneratorPage').then(module => ({ default: module.BlogGeneratorPage })));
const VideoScriptGeneratorPage = lazy(() => import('../components/VideoScriptGeneratorPage').then(module => ({ default: module.VideoScriptGeneratorPage })));
const CampaignsPage = lazy(() => import('./components/CampaignsPage').then(module => ({ default: module.CampaignsPage })));


export type Page = 'contentGenerator' | 'reelsGenerator' | 'commentBot' | 'history' | 'profile' | 'apiKeys' | 'billing' | 'help' | 'scheduling' | 'blogGenerator' | 'videoScriptGenerator' | 'campaigns';
type AppFlowState = 'landing' | 'payment' | 'login' | 'register' | 'dashboard' | 'contact';

// Define a type for the profile data from your `profiles` table
export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  plan: 'FREE' | 'PRO' | 'AGENCY';
  credits: number;
  stripe_customer_id?: string;
  // Add other fields from your profiles table here
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
            <p className="text-red-300 mb-6">A aplicação não consegue se conectar ao backend porque as credenciais do Supabase não foram definidas.</p>
            <p className="text-gray-400">Por favor, certifique-se de que as variáveis de ambiente <code>SUPABASE_URL</code> e <code>SUPABASE_ANON_KEY</code> estão configuradas corretamente nos segredos do seu projeto.</p>
        </div>
        <footer className="absolute bottom-0 py-6 text-center text-gray-600 text-sm">
            <p>&copy; {new Date().getFullYear()} Seu Review AI. Potencializado por Gemini.</p>
        </footer>
    </div>
);


const App: React.FC = () => {
  if (!supabaseConfigured) {
    return <SupabaseConfigError />;
  }
  
  const [flowState, setFlowState] = useState<AppFlowState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('contentGenerator');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    // Dev mode for maintenance
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('dev') === 'true') {
        console.warn("--- DEV MODE ACTIVATED ---");
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
        return; // Skip normal auth flow
    }
    
    // Restore plan from session storage on initial load
    const storedPlan = sessionStorage.getItem('selectedPlan');
    if (storedPlan) {
        setSelectedPlan(storedPlan);
    }

    const fetchProfile = async (user: User): Promise<UserProfile | null> => {
        const { data, error } = await supabase!
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') { // Ignore "no rows found" error
            console.error('Error fetching profile:', error);
            return null;
        }
        // Supabase returns `any` so we cast it. We are sure of the shape.
        return data as UserProfile | null;
    };

    const { data: authListener } = supabase!.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
            let profileData = await fetchProfile(currentUser);

            // Retry once if profile not found, to handle DB replication delay
            if (!profileData) {
                console.log("Profile not found on first attempt, retrying in 1.5s...");
                await new Promise(resolve => setTimeout(resolve, 1500));
                profileData = await fetchProfile(currentUser);
            }
            
            // If profile is still not found, attempt to create it as a fallback
            if (!profileData) {
                console.warn("Profile not found after retry, attempting to create one as a fallback.");
                
                const getCreditsForPlan = (plan?: string | null) => {
                    if (plan === 'PRO') return 50;
                    if (plan === 'AGENCY') return 150;
                    return 5; // FREE plan or default
                };

                const planFromReg = sessionStorage.getItem('selectedPlan') || 'FREE';
                const initialPlan = ['FREE', 'PRO', 'AGENCY'].includes(planFromReg) ? planFromReg : 'FREE';

                const { data: newProfile, error: insertError } = await supabase!
                    .from('profiles')
                    .insert({
                        id: currentUser.id,
                        full_name: currentUser.user_metadata.full_name || currentUser.email || 'Novo Usuário',
                        avatar_url: currentUser.user_metadata.avatar_url || '',
                        plan: initialPlan as UserProfile['plan'],
                        credits: getCreditsForPlan(initialPlan),
                    })
                    .select()
                    .single();
                
                if (insertError) {
                    console.error("Fatal Error: Could not fetch or create a user profile.", insertError);
                    await supabase!.auth.signOut();
                    setFlowState('landing');
                    setLoading(false);
                    return; // Exit here if creation fails
                }
                
                console.log("Profile created successfully as a fallback.");
                profileData = newProfile as UserProfile;
            }

            if (profileData) {
                // This is a safety check in case the DB trigger creates a profile without credits
                if (!profileData.credits) {
                    profileData.credits = profileData.plan === 'PRO' ? 50 : profileData.plan === 'AGENCY' ? 150 : 5;
                }
                setProfile(profileData);
                const planFromStorage = sessionStorage.getItem('selectedPlan');
                if (planFromStorage) {
                    setFlowState('payment');
                } else {
                    setFlowState('dashboard');
                }
            }
        } else {
            setProfile(null);
            setFlowState('landing');
        }
        setLoading(false);
      }
    );

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

  const handleRegistrationSuccess = () => {
    // After email/password registration, move to payment
    setFlowState('payment');
  };
  
  const handleLoginClick = () => {
    setFlowState('login');
  };

  const handleShowContact = () => {
    setFlowState('contact');
  };
  
  const handleLogout = async () => {
    await supabase!.auth.signOut().catch(err => console.error("Sign out failed", err));
    setUser(null);
    setProfile(null);
    setCurrentPage('contentGenerator');
    sessionStorage.removeItem('selectedPlan');
    setSelectedPlan(null);
    // Redirect to landing page without dev mode
    if (window.location.search.includes('dev=true')) {
        window.location.href = window.location.origin + window.location.pathname;
    } else {
        setFlowState('landing');
    }
  };

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
  }

  const renderAppContent = () => {
    if (loading) {
        return <LoadingFallback />;
    }

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
        // Show a loading state while profile is being fetched
        return <LoadingFallback />;
    }

    if (flowState === 'register' && selectedPlan) {
        return <RegistrationPage 
                    onRegistrationSuccess={handleRegistrationSuccess} 
                    onGoToLogin={() => {
                        sessionStorage.removeItem('selectedPlan');
                        setSelectedPlan(null);
                        setFlowState('login');
                    }} 
                    planName={selectedPlan} 
                />;
    }

    if (flowState === 'payment' && selectedPlan) {
        return <PaymentPage planName={selectedPlan} onPaymentSuccess={handlePaymentSuccess} onBack={() => setFlowState('landing')} />;
    }

    if (flowState === 'contact') {
        return <ContactPage onBack={() => setFlowState('landing')} />;
    }
    
    if (flowState === 'login') {
        return <LoginPage onGoToRegister={() => {
            if (!selectedPlan) setSelectedPlan('PRO'); // Default to PRO plan
            setFlowState('register');
        }} />;
    }

    // Fallback to landing
    return <LandingPage onSelectPlan={handleSelectPlan} onShowContact={handleShowContact} onLoginClick={handleLoginClick} />;
  }
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      {renderAppContent()}
    </Suspense>
  );
};

export default App;