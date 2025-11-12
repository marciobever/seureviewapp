
import React, { useState, useEffect } from 'react';
import type { HistoryItem } from '../types';

const HistoryCard: React.FC<{ item: HistoryItem }> = ({ item }) => {
    const { product, content, generatedAt } = item;
    const formattedDate = new Date(generatedAt).toLocaleString('pt-BR');

    const copyToClipboard = () => {
        const fullText = `${content.socialPostTitle}\n\n${content.socialPostBody}\n\nCompre aqui: ${content.affiliateUrl}`;
        navigator.clipboard.writeText(fullText).then(() => {
            alert('Conteúdo copiado para a área de transferência!');
        });
    };

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 md:w-1/4">
                <img src={content.productImageUrl} alt={product.productName} className="w-full h-auto object-cover rounded-md mb-2"/>
                <h3 className="font-semibold text-white text-sm">{product.productName}</h3>
                <p className="text-xs text-gray-400 mt-1">{formattedDate}</p>
            </div>
            <div className="flex-grow md:w-3/4">
                <h4 className="font-bold text-lg text-orange-400 mb-2">{content.socialPostTitle}</h4>
                <p className="text-gray-300 text-sm whitespace-pre-wrap mb-4">{content.socialPostBody}</p>
                <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                     <input 
                        type="text" 
                        readOnly 
                        value={content.affiliateUrl} 
                        className="w-full sm:flex-grow bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white text-sm"
                    />
                    <button 
                        onClick={copyToClipboard}
                        className="w-full sm:w-auto flex-shrink-0 px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg text-sm hover:bg-orange-700"
                    >
                        Copiar
                    </button>
                </div>
            </div>
        </div>
    );
};


export const HistoryPage: React.FC = () => {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedHistory = localStorage.getItem('seu-review-history');
            if (storedHistory) {
                setHistory(JSON.parse(storedHistory));
            }
        } catch (e) {
            console.error("Failed to load history from localStorage", e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearHistory = () => {
        if (window.confirm("Tem certeza de que deseja limpar todo o histórico? Esta ação não pode ser desfeita.")) {
            localStorage.removeItem('seu-review-history');
            setHistory([]);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-t-orange-500 border-slate-700 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Histórico de Conteúdo</h1>
                    <p className="text-gray-400">Veja suas últimas 10 gerações de conteúdo.</p>
                </div>
                <div className="flex items-center gap-4">
                     <select
                        disabled={history.length === 0}
                        className="bg-slate-700 border-slate-600 rounded-md py-2 pl-3 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none disabled:opacity-50"
                     >
                        <option value="all">Todas as Campanhas</option>
                        <option value="dia-das-maes">Campanha Dia das Mães</option>
                        <option value="black-friday">Campanha Black Friday</option>
                     </select>
                    {history.length > 0 && (
                         <button
                            onClick={clearHistory}
                            className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 font-semibold rounded-lg text-sm hover:bg-red-600/30 hover:text-red-300"
                         >
                             Limpar Histórico
                         </button>
                    )}
                </div>
            </div>
            {history.length === 0 ? (
                <div className="text-center bg-slate-800 border border-slate-700 rounded-lg p-12">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <h3 className="mt-4 text-xl font-semibold text-white">Histórico Vazio</h3>
                    <p className="mt-2 text-gray-400">Você ainda não gerou nenhum conteúdo. Comece na página "Gerador de Conteúdo" e suas criações aparecerão aqui.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {history.map(item => (
                        <HistoryCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};
