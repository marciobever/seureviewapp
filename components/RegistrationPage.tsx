import React, { useState } from 'react';
import { Logo } from './Logo';
import { supabase } from '../services/supabase';

interface RegistrationPageProps {
    onRegistrationSuccess: () => void;
    onGoToLogin: () => void;
    planName: string;
}

const GoogleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25C22.56 11.45 22.49 10.68 22.36 9.92H12V14.48H18.19C17.92 16.03 17.11 17.33 15.82 18.23V21.09H19.78C21.56 19.31 22.56 16.94 22.56 12.25Z" fill="#4285F4"/>
        <path d="M12 23C14.97 23 17.45 22.04 19.28 20.39L15.82 18.23C14.81 18.91 13.51 19.34 12 19.34C9.22 19.34 6.84 17.56 5.92 15.05H1.86V17.91C3.69 21.01 7.52 23 12 23Z" fill="#34A853"/>
        <path d="M5.92 15.05C5.71 14.48 5.58 13.88 5.58 13.27C5.58 12.66 5.71 12.06 5.92 11.49V8.63H1.86C1.03 10.13 0.5 11.83 0.5 13.27C0.5 14.71 1.03 16.41 1.86 17.91L5.92 15.05Z" fill="#FBBC05"/>
        <path d="M12 7.2C13.62 7.2 15.06 7.78 16.27 8.92L19.84 5.35C17.45 3.22 14.97 2 12 2C7.52 2 3.69 3.99 1.86 7.09L5.92 9.95C6.84 7.44 9.22 5.66 12 5.66V7.2Z" fill="#EA4335"/>
    </svg>
)

export const RegistrationPage: React.FC<RegistrationPageProps> = ({ onRegistrationSuccess, onGoToLogin, planName }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [registrationComplete, setRegistrationComplete] = useState(false);

    const handleGoogleSignUp = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
            });
            if (error) throw error;
            // onAuthStateChanged in App.tsx will handle the redirect to the payment page
        } catch (error) {
            console.error("Error during Google sign-up:", error);
            setError("Houve um erro ao tentar o cadastro com Google. Tente novamente.");
        }
    };
    
    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError("Por favor, preencha todos os campos.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    }
                }
            });
            if (error) throw error;
            // The user object is available in data.user, but we need email confirmation.
            // A confirmation email has been sent.
            setRegistrationComplete(true);
            
        } catch (err: any) {
            if (err.message.includes('User already registered')) {
                setError('Este e-mail já está em uso. Tente fazer login.');
            } else if (err.message.includes('Password should be at least 6 characters')) {
                setError('A senha deve ter pelo menos 6 caracteres.');
            } else {
                setError('Ocorreu um erro no cadastro. Por favor, tente novamente.');
            }
            console.error("Supabase registration error:", err);
        } finally {
            setIsLoading(false);
        }
    };
    
    if (registrationComplete) {
        return (
            <div className="min-h-screen bg-slate-900 text-gray-200 flex flex-col items-center justify-center p-4 animate-fade-in">
                <div className="w-full max-w-md text-center bg-slate-800 border border-slate-700 rounded-2xl p-8">
                    <div className="flex justify-center mb-6 text-green-400">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19h18" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 13l2 2 4-4" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-white mb-4">Confirme seu E-mail</h2>
                    <p className="text-gray-400 mb-8">
                        Enviamos um link de confirmação para <strong className="text-orange-400">{email}</strong>. Por favor, verifique sua caixa de entrada (e a pasta de spam) para ativar sua conta.
                    </p>
                    <button
                        onClick={onGoToLogin}
                        className="w-full px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition-colors"
                    >
                        Ir para Login
                    </button>
                </div>
                 <footer className="absolute bottom-0 py-6 text-center text-gray-600 text-sm">
                    <p>&copy; {new Date().getFullYear()} Seu Review AI. Potencializado por Gemini.</p>
                </footer>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-slate-900 text-gray-200 flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <Logo />
                </div>
                <p className="text-lg text-gray-400">Crie sua conta para começar.</p>
            </div>
            <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-8">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold text-white">Criar Conta</h2>
                    <p className="text-gray-400 mt-1">Plano Selecionado: <span className="font-bold text-orange-400">{planName}</span></p>
                </div>

                {error && <p className="bg-red-500/10 text-red-400 text-sm p-3 rounded-md mb-4 text-center">{error}</p>}
                
                <form onSubmit={handleEmailSignUp} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                        <input id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
                        <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                     <div>
                        <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
                        <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition-colors disabled:opacity-50">
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Criando conta...</span>
                            </>
                        ) : (
                            'Cadastrar e Continuar'
                        )}
                    </button>
                </form>
                
                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-slate-600"></div>
                    <span className="flex-shrink mx-4 text-slate-500 text-sm">OU</span>
                    <div className="flex-grow border-t border-slate-600"></div>
                </div>

                <button
                  onClick={handleGoogleSignUp}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-700 font-bold rounded-lg shadow-md hover:bg-gray-200 transform transition-colors duration-300 ease-in-out"
                >
                  <GoogleIcon />
                  <span>Cadastrar com o Google</span>
                </button>
                
                <p className="mt-8 text-sm text-center text-gray-400">
                    Já tem uma conta?{' '}
                    <button onClick={onGoToLogin} className="font-semibold text-orange-400 hover:text-orange-300 focus:outline-none bg-transparent border-none cursor-pointer p-0">
                        Faça login
                    </button>
                </p>
            </div>
             <footer className="absolute bottom-0 py-6 text-center text-gray-600 text-sm">
                <p>&copy; {new Date().getFullYear()} Seu Review AI. Potencializado por Gemini.</p>
            </footer>
        </div>
    );
};

export default RegistrationPage;