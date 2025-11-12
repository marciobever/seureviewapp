
import React, { useState } from 'react';
import { generateBlogPost } from '../services/geminiService';
import type { UserProfile } from '../App';
import type { BlogPost } from '../types';

const BLOG_POST_COST = 5; // Custo em créditos

export const BlogGeneratorPage: React.FC<{ profile: UserProfile }> = ({ profile }) => {
    const [topic, setTopic] = useState('');
    const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic) {
            setError("Por favor, insira um tópico para o artigo.");
            return;
        }
        if (profile.credits < BLOG_POST_COST) {
            setError(`Você não tem créditos suficientes. A geração de artigos custa ${BLOG_POST_COST} créditos e você tem ${profile.credits}.`);
            return;
        }

        setIsLoading(true);
        setError(null);
        setBlogPost(null);
        try {
            const result = await generateBlogPost(topic);
            setBlogPost(result);
            // NOTE: In a real app, deduct credits here via a backend call.
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setTopic('');
        setBlogPost(null);
        setError(null);
        setIsLoading(false);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">Gerador de Artigos de Blog (SEO)</h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 text-center">
                Crie artigos completos e otimizados para mecanismos de busca sobre qualquer produto ou nicho.
            </p>

            {!blogPost && !isLoading && (
                 <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4 items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700 shadow-lg">
                        <textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Ex: Os 5 melhores fones de ouvido sem fio para gamers em 2024"
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
                           Gerar Artigo ({BLOG_POST_COST} créditos)
                        </button>
                    </div>
                </form>
            )}

            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="w-16 h-16 border-4 border-t-orange-500 border-slate-700 rounded-full animate-spin mb-6"></div>
                    <h2 className="text-2xl font-semibold text-white">Criando seu artigo...</h2>
                    <p className="text-gray-400">A IA está pesquisando e escrevendo, isso pode levar um momento.</p>
                </div>
            )}

            {error && !isLoading && (
                <div className="w-full text-center bg-red-900/20 border border-red-500/50 rounded-lg p-8 mt-6">
                    <h2 className="text-2xl font-bold text-red-400 mb-2">Erro ao Gerar Artigo</h2>
                    <p className="text-red-300 mb-6">{error}</p>
                    <button onClick={handleReset} className="px-6 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600">
                        Tentar Novamente
                    </button>
                </div>
            )}

            {blogPost && (
                <div className="mt-8 bg-slate-800 border border-slate-700 rounded-lg p-8 animate-fade-in">
                    <h2 className="text-3xl font-bold text-orange-400 mb-4">{blogPost.title}</h2>
                    <p className="text-gray-300 italic mb-6">{blogPost.introduction}</p>
                    
                    {blogPost.sections.map((section, index) => (
                        <div key={index} className="mb-6">
                            <h3 className="text-2xl font-semibold text-white mb-2">{section.heading}</h3>
                            <p className="text-gray-300 whitespace-pre-line">{section.content}</p>
                        </div>
                    ))}

                    <h3 className="text-2xl font-semibold text-white mb-2">Conclusão</h3>
                    <p className="text-gray-300 mb-6">{blogPost.conclusion}</p>

                    <div className="pt-4 border-t border-slate-700">
                        <h4 className="font-semibold text-white mb-2">Palavras-chave SEO:</h4>
                        <div className="flex flex-wrap gap-2">
                            {blogPost.seoKeywords.map(keyword => (
                                <span key={keyword} className="bg-slate-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">{keyword}</span>
                            ))}
                        </div>
                    </div>
                     <div className="text-center mt-8">
                        <button onClick={handleReset} className="px-8 py-3 bg-slate-700 text-white font-semibold rounded-full hover:bg-slate-600">
                            Gerar Novo Artigo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
