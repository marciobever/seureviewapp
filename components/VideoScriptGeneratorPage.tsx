
import React, { useState } from 'react';
import { generateVideoScript } from '../services/geminiService';
import type { UserProfile } from '../App';
import type { VideoScript } from '../types';

const SCRIPT_COST = 3; // Custo em créditos

export const VideoScriptGeneratorPage: React.FC<{ profile: UserProfile }> = ({ profile }) => {
    const [topic, setTopic] = useState('');
    const [videoType, setVideoType] = useState<'short' | 'long'>('short');
    const [script, setScript] = useState<VideoScript | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic) {
            setError("Por favor, insira um tópico para o roteiro.");
            return;
        }
         if (profile.credits < SCRIPT_COST) {
            setError(`Você não tem créditos suficientes. A geração de roteiros custa ${SCRIPT_COST} créditos e você tem ${profile.credits}.`);
            return;
        }

        setIsLoading(true);
        setError(null);
        setScript(null);
        try {
            const result = await generateVideoScript(topic, videoType);
            setScript(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setTopic('');
        setScript(null);
        setError(null);
        setIsLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">Gerador de Roteiros de Vídeo</h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 text-center">
                Crie roteiros estruturados para seus vídeos do YouTube, Reels ou TikTok em segundos.
            </p>

            {!script && !isLoading && (
                 <form onSubmit={handleSubmit}>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 shadow-lg space-y-4">
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Ex: Review completo do iPhone 15 Pro Max"
                            className="w-full bg-slate-700 px-6 py-3 text-white placeholder-gray-500 focus:outline-none rounded-lg resize-none border border-slate-600"
                            rows={3}
                            required
                        />
                        <div className="flex justify-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="videoType" value="short" checked={videoType === 'short'} onChange={() => setVideoType('short')} className="form-radio text-orange-500 bg-slate-600"/>
                                <span className="text-white">Vídeo Curto (Reels/TikTok)</span>
                            </label>
                             <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="videoType" value="long" checked={videoType === 'long'} onChange={() => setVideoType('long')} className="form-radio text-orange-500 bg-slate-600"/>
                                <span className="text-white">Vídeo Longo (YouTube)</span>
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="w-full px-8 py-3 bg-orange-600 text-white font-semibold rounded-full shadow-md hover:bg-orange-700 transform transition-colors duration-300 ease-in-out"
                        >
                           Gerar Roteiro ({SCRIPT_COST} créditos)
                        </button>
                    </div>
                </form>
            )}

            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="w-16 h-16 border-4 border-t-orange-500 border-slate-700 rounded-full animate-spin mb-6"></div>
                    <h2 className="text-2xl font-semibold text-white">Escrevendo seu roteiro...</h2>
                    <p className="text-gray-400">A IA está estruturando as melhores cenas e falas.</p>
                </div>
            )}

             {error && !isLoading && (
                <div className="w-full text-center bg-red-900/20 border border-red-500/50 rounded-lg p-8 mt-6">
                    <h2 className="text-2xl font-bold text-red-400 mb-2">Erro ao Gerar Roteiro</h2>
                    <p className="text-red-300 mb-6">{error}</p>
                    <button onClick={handleReset} className="px-6 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600">
                        Tentar Novamente
                    </button>
                </div>
            )}

            {script && (
                <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-8 animate-fade-in space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-orange-400 mb-1">Título do Vídeo</h2>
                        <p className="text-gray-300">{script.title}</p>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Gancho (Hook)</h3>
                        <p className="text-gray-300 italic">"{script.hook}"</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Introdução</h3>
                        <p className="text-gray-300">{script.introduction}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Pontos Principais / Cenas</h3>
                        <ul className="list-disc list-inside text-gray-300 space-y-2 pl-2">
                            {script.mainPoints.map((point, index) => <li key={index}>{point}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Chamada para Ação (CTA)</h3>
                        <p className="text-gray-300 font-bold">{script.callToAction}</p>
                    </div>
                     <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Encerramento (Outro)</h3>
                        <p className="text-gray-300">{script.outro}</p>
                    </div>
                     <div className="text-center mt-8 pt-6 border-t border-slate-700">
                        <button onClick={handleReset} className="px-8 py-3 bg-slate-700 text-white font-semibold rounded-full hover:bg-slate-600">
                            Gerar Novo Roteiro
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
