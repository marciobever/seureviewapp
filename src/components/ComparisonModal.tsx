
import React, { useState, useEffect, useCallback } from 'react';
import type { ProductOption } from '../types';
import { compareProducts } from '../services/geminiService';

interface ComparisonModalProps {
    product1: ProductOption;
    product2: ProductOption;
    onClose: () => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ product1, product2, onClose }) => {
    const [comparisonResult, setComparisonResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchComparison = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await compareProducts(product1, product2);
            setComparisonResult(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [product1, product2]);

    useEffect(() => {
        fetchComparison();
    }, [fetchComparison]);

    // Basic markdown to HTML renderer
    const renderMarkdown = (text: string) => {
        let html = text
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-semibold text-white mt-4 mb-2">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-orange-400 mt-6 mb-3">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold text-white mb-4">$1</h1>')
            .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code class="bg-slate-700 text-amber-300 rounded px-1 py-0.5 text-sm">$1</code>')
            .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-slate-600 pl-4 text-gray-400 italic my-2">$1</blockquote>')
            .replace(/\n/g, '<br />');
        
        // Table rendering
        html = html.replace(
            /<br \/>\|(.+)\|(.+)\|(.+)\|<br \/>\|-+\|:-+:\|-+:\|<br \/>((?:\|.+\|<br \/>)+)/g,
            (match, header1, header2, header3, rows) => {
                const rowHtml = rows.split('<br />').filter(Boolean).map(row => {
                    const cells = row.split('|').slice(1, -1);
                    return `<tr class="border-b border-slate-700">${cells.map(cell => `<td class="px-4 py-2">${cell.trim()}</td>`).join('')}</tr>`;
                }).join('');

                return `<div class="overflow-x-auto my-4"><table class="w-full text-sm text-left text-gray-300">
                    <thead class="text-xs text-gray-200 uppercase bg-slate-700/50">
                        <tr><th class="px-4 py-2">${header1.trim()}</th><th class="px-4 py-2">${header2.trim()}</th><th class="px-4 py-2">${header3.trim()}</th></tr>
                    </thead>
                    <tbody>${rowHtml}</tbody>
                </table></div>`;
            }
        );
            
        return { __html: html };
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div
                className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Comparativo de Produtos</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-slate-700 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <div className="p-6 overflow-y-auto">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="w-12 h-12 border-4 border-t-orange-500 border-slate-700 rounded-full animate-spin"></div>
                            <p className="text-gray-400 mt-4">IA está analisando os produtos...</p>
                        </div>
                    )}
                    {error && (
                         <div className="text-center p-4">
                            <h3 className="text-lg font-bold text-red-400 mb-2">Erro na Comparação</h3>
                            <p className="text-red-300 text-sm mb-4">{error}</p>
                            <button onClick={fetchComparison} className="px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg text-sm">Tentar Novamente</button>
                        </div>
                    )}
                    {!isLoading && !error && (
                        <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={renderMarkdown(comparisonResult)} />
                    )}
                </div>
            </div>
        </div>
    );
};