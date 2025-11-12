
import React, { useState } from 'react';
import { Logo } from './Logo';
import { supabase } from '../services/supabase';

interface LoginPageProps {
    onGoToRegister: () => void;
}

const GoogleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25C22.56 11.45 22.49 10.68 22.36 9.92H12V14.48H18.19C17.92 16.03 17.11 17.33 15.82 18.23V21.09H19.78C21.56 19.31 22.56 16.94 22.56 12.25Z" fill="#4285F4"/>
        <path d="M12 23C14.97 23 17.45 22.04 19.28 20.39L15.82 18.23C14.81 18.91 13.51 19.34 12 19.34C9.22 19.34 6.84 17.56 5.92 15.05H1.86V17.91C3.69 21.01 7.52 23 12 23Z" fill="#34A853"/>
        <path d="M5.92 15.05C5.71 14.48 5.58 13.88 5.58 13.27C5.58 12.66 5.71 12.06 5.92 11.49V8.63H1.86C1.03 10.13 0.5 11.83 0.5 13.27C0.5 14.71 1.03 16.41 1.86 17.91L5.92 15.05Z" fill="#FBBC05"/>
        <path d="M12 7.2C13.62 7.2 15.06 7.78 16.27 8.92L19.84 5.35C17.45 3.22 14.97 2 12 2C7.52 2 3.69 3.99 1.86 7.09L5.92 9.95C6.84 7.44 9.22 5.66 12 5.66V7.2Z" fill="#EA4335"/>
    </svg>
)

export const LoginPage: React.FC<LoginPageProps> = ({ onGoToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
      // After popup, onAuthStateChanged in App.tsx will handle setting the app flow state.
    } catch (error) {
      console.error("Error during Google sign-in:", error);
      setError("Houve um erro ao tentar fazer login com o Google. Tente novamente.");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        // onAuthStateChanged in App.tsx will handle the rest
    } catch (err: any) {
        console.error("Error during email login:", err);
        if (err.message.includes('Invalid login credentials')) {
            setError('E-mail ou senha inválidos.');
        } else {
            setError('Ocorreu um erro ao tentar fazer login.');
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
            <Logo />
        </div>
        <p className="text-lg text-gray-400">Automação de conteúdo para marketing de afiliados.</p>
      </div>
      <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-2 text-center">Login</h2>
        <p className="text-gray-400 mb-6 text-center">Acesse sua conta para continuar.</p>

        {error && <p className="bg-red-500/10 text-red-400 text-sm p-3 rounded-md mb-4 text-center">{error}</p>}

        <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
                <input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
                <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
                <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition-colors disabled:opacity-50">
                {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
        </form>

        <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-slate-600"></div>
            <span className="flex-shrink mx-4 text-slate-500 text-sm">OU</span>
            <div className="flex-grow border-t border-slate-600"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-700 font-bold rounded-lg shadow-md hover:bg-gray-200 transform transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500"
        >
          <GoogleIcon />
          <span>Entrar com o Google</span>
        </button>

        <p className="mt-8 text-sm text-center text-gray-400">
            Não tem uma conta?{' '}
            <button onClick={onGoToRegister} className="font-semibold text-orange-400 hover:text-orange-300 focus:outline-none bg-transparent border-none cursor-pointer p-0">
                Cadastre-se
            </button>
        </p>
      </div>
       <footer className="absolute bottom-0 py-6 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} Seu Review AI. Potencializado por Gemini.</p>
      </footer>
    </div>
  );
};
