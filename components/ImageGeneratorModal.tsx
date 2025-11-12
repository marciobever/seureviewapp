
import React, { useState, useCallback } from 'react';
import { generateMarketingImage } from '../services/geminiService';

interface ImageGeneratorModalProps {
    productName: string;
    onClose: () => void;
    onImageGenerated: (imageUrl: string) => void;
}

export const ImageGeneratorModal: React.FC<ImageGeneratorModalProps> = ({ productName, onClose, onImageGenerated }) => {
    const [prompt, setPrompt] = useState(`Uma imagem de marketing profissional e atraente para o produto: ${productName}, em um fundo limpo e moderno.`);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        try {
            const imageUrl = await generateMarketingImage(prompt);
            setGeneratedImage(imageUrl);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 animate-fade-in">
             <div
                className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold text-white">Gerador de Imagem com IA</h2>
                    <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:bg-slate-700 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </header>

                <div className="p-6 overflow-y-auto space-y-6">
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">Descrição da Imagem (Prompt)</label>
                        <textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={3}
                            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white resize-y"
                        />
                    </div>

                    <div className="text-center">
                         <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Gerando...' : 'Gerar Imagem ✨'}
                        </button>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center items-center h-48 bg-slate-700/50 rounded-lg">
                            <div className="w-10 h-10 border-4 border-t-orange-500 border-slate-600 rounded-full animate-spin"></div>
                        </div>
                    )}
                    {error && (
                        <div className="text-center p-4 bg-red-900/20 rounded-lg">
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    )}
                    {generatedImage && (
                        <div className="text-center space-y-4">
                            <img src={generatedImage} alt="Imagem gerada pela IA" className="w-full max-w-md mx-auto rounded-lg shadow-lg" />
                             <button
                                onClick={() => onImageGenerated(generatedImage)}
                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
                            >
                                Usar esta Imagem
                            </button>
                        </div>
                    )}
                </div>
             </div>
        </div>
    );
};
