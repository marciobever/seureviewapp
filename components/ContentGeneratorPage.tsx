
import React, { useState, useCallback } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorDisplay } from './ErrorDisplay';
import { ProductSearch } from './ProductSearch';
import { ProductSelectionPage } from './ProductSelectionPage';
import { searchProductOptions } from '../services/geminiService';
import type { ProductOption } from '../types';

type Step = 'search' | 'select';

export const ContentGeneratorPage: React.FC = () => {
    const [step, setStep] = useState<Step>('search');
    const [productOptions, setProductOptions] = useState<ProductOption[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentProvider, setCurrentProvider] = useState('all');

    const handleSearch = useCallback(async (productQuery: string, provider: string) => {
        if (!productQuery) {
            setError("Por favor, digite o nome de um produto para buscar.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setProductOptions([]);
        setCurrentProvider(provider);
        
        try {
            const results = await searchProductOptions(productQuery, provider);
            if (results.length === 0) {
                setError("Nenhum produto encontrado para esta busca. Tente um termo diferente.");
                 setStep('search');
            } else {
                setProductOptions(results);
                setStep('select');
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : String(err);
            setError(`Não foi possível buscar os produtos. Detalhes: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleReset = useCallback(() => {
        setStep('search');
        setProductOptions([]);
        setError(null);
        setIsLoading(false);
    }, []);

    const renderStep = () => {
        if (isLoading) return <LoadingSpinner />;
        
        if (step === 'search') {
             return (
                <>
                    <ProductSearch onSummarize={handleSearch} isLoading={isLoading} />
                    {error && <div className="mt-8"><ErrorDisplay message={error} onReset={handleReset} /></div>}
                </>
             )
        }
        
        if (step === 'select') {
            if (error) return <ErrorDisplay message={error} onReset={handleReset} />;
            return <ProductSelectionPage 
                options={productOptions} 
                onBack={handleReset} 
                provider={currentProvider}
            />;
        }

        // Fallback
        return <ProductSearch onSummarize={handleSearch} isLoading={isLoading} />;
    }
    
    return <div>{renderStep()}</div>;
};
