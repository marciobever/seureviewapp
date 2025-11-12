
import React, { useState, useEffect } from 'react';
import { generateReelsVideo } from '../services/geminiService';
import type { UserProfile } from '../App';

const loadingMessages = [
  "Configurando a iluminação do estúdio virtual...",
  "A IA está escolhendo os melhores ângulos...",
  "Renderizando seu vídeo em alta velocidade...",
  "Adicionando uma pitada de viralidade...",
  "Seu Reels está quase pronto para bombar!"
];

const VIDEO_GENERATION_COST = 10; // Custo em créditos

export const ReelsGeneratorPage: React.FC<{ profile: UserProfile }> = ({ profile }) => {
    const [prompt, setPrompt] = useState('');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
    const [apiKeySelected, setApiKeySelected] = useState(false);

    useEffect(() => {
        const checkApiKey = async () => {
            if (window.aistudio) {
                const hasKey = await window.aistudio.hasSelectedApiKey();
                setApiKeySelected(hasKey);
            }
        };
        checkApiKey();
    }, []);

    useEffect(() => {
        let intervalId: number;
        if (isLoading) {
            intervalId = window.setInterval(() => {
                setLoadingMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % loadingMessages.length;
                    return loadingMessages[nextIndex];
                });
            }, 3500);
        }
        return () => clearInterval(intervalId);
    }, [isLoading]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt) {
            setError("Por favor, descreva o produto ou tema para o Reels.");
            return;
        }
        if (profile.credits < VIDEO_GENERATION_COST) {
            setError(`Você não tem créditos suficientes. Geração de vídeo custa ${VIDEO_GENERATION_COST} créditos e você tem ${profile.credits}.`);
            return;
        }

        setIsLoading(true);
        setError(null);
        setVideoUrl(null);
        try {
            // Fix: Create a new GoogleGenAI instance before making an API call.
            const url = await generateReelsVideo(prompt);
            setVideoUrl(url);
            setIsVideoLoading(true);
            // NOTE: In a real app, you would deduct credits here via a backend call.
        } catch (err) {
            console.error(err);
            const errorMessage = (err as Error)?.message || '';
            if (errorMessage.includes("Requested entity was not found")) {
                setError("Sua chave de API pode ter expirado ou é inválida. Por favor, selecione uma chave de API válida para continuar.");
                setApiKeySelected(false); // Reset to show the select key button
            } else {
                 setError("Não foi possível gerar o vídeo. A IA pode estar ocupada ou o tema é muito complexo. Tente novamente com um prompt diferente.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setPrompt('');
        setVideoUrl(null);
        setError(null);
        setIsLoading(false);
        setIsVideoLoading(false);
    }
    
    const handleSelectApiKey = async () => {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            setApiKeySelected(true); // Assume success to avoid race condition
        }
    };

    if (!apiKeySelected) {
        return (
            <div className="max-w-2xl mx-auto text-center animate-fade-in p-8 bg-slate-800 border border-slate-700 rounded-2xl">
                 {error && <p className="text-red-400 mb-4">{error}</p>}
                <h2 className="text-2xl font-bold text-white mb-4">Chave de API Necessária</h2>
                <p className="text-gray-400 mb-6">
                    Para gerar vídeos com o modelo Veo, você precisa selecionar uma chave de API do Google AI Studio. A geração de vídeos pode incorrer em custos.
                </p>
                <button
                    onClick={handleSelectApiKey}
                    className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-full shadow-md hover:bg-orange-700 transition-colors"
                >
                    Selecionar Chave de API
                </button>
                 <p className="text-xs text-gray-500 mt-4">
                    Para mais informações sobre cobrança, visite{' '}
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline hover:text-orange-400">
                        ai.google.dev/gemini-api/docs/billing
                    </a>.
                </p>
            </div>
        );
    }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">Gerador de Reels com IA</h1>
      <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 text-center">
        Transforme uma simples ideia em um vídeo curto e impactante para suas redes sociais.
      </p>

      {!videoUrl && !isLoading && (
         <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4 items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700 shadow-lg">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex: Um unboxing rápido e cinemático do novo smartphone X"
                    className="w-full bg-slate-700 px-6 py-3 text-white placeholder-gray-500 focus:outline-none rounded-lg resize-none border border-slate-600"
                    rows={3}
                    required
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-8 py-3 bg-orange-600 text-white font-semibold rounded-full shadow-md hover:bg-orange-700 transform transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                   Gerar Vídeo Mágico ✨ ({VIDEO_GENERATION_COST} créditos)
                </button>
            </div>
        </form>
      )}

      {isLoading && (
         <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="w-16 h-16 border-4 border-t-orange-500 border-r-orange-500 border-b-orange-500 border-slate-700 rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-semibold text-white mb-2">Gerando seu Reels...</h2>
            <p className="text-gray-400 transition-opacity duration-500 mb-2">{loadingMessage}</p>
            <p className="text-sm text-amber-400">(A geração de vídeo pode levar alguns minutos)</p>
        </div>
      )}

      {error && !isLoading && (
         <div className="w-full text-center bg-red-900/20 border border-red-500/50 rounded-lg p-8">
            <div className="text-5xl mb-4">😢</div>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Oops! Algo deu errado.</h2>
            <p className="text-red-300 mb-6">{error}</p>
            <button
                onClick={handleReset}
                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors"
            >
                Tentar Novamente
            </button>
        </div>
      )}

      {videoUrl && (
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-6">Seu Reels está pronto!</h2>
            <div className="aspect-w-9 aspect-h-16 max-w-sm mx-auto bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 relative flex items-center justify-center">
                {isVideoLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 z-10">
                        <div className="w-10 h-10 border-2 border-t-orange-500 border-slate-600 rounded-full animate-spin"></div>
                        <p className="text-gray-400 text-sm mt-3">Carregando vídeo...</p>
                    </div>
                )}
                <video
                    src={videoUrl}
                    onLoadedData={() => setIsVideoLoading(false)}
                    controls
                    autoPlay
                    loop
                    className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoLoading ? 'opacity-0' : 'opacity-100'}`}
                />
            </div>
            <button
                onClick={handleReset}
                className="mt-8 px-8 py-3 bg-slate-700 text-white font-semibold rounded-full shadow-md hover:bg-slate-600 transform transition-colors duration-300 ease-in-out"
            >
                Gerar Novo Vídeo
            </button>
        </div>
      )}
    </div>
  );
};
