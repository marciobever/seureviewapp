
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

// Tipos para as chaves de API
export interface ApiKeys {
    mercadoLivre: string;
    shopeeAppId: string;
    shopeePassword: string;
    amazon: string;
    temu: string;
    aliexpress: string;
    shein: string;
}

const initialApiKeys: ApiKeys = {
    mercadoLivre: '',
    shopeeAppId: '',
    shopeePassword: '',
    amazon: '',
    temu: '',
    aliexpress: '',
    shein: '',
};

type ValidationStatus = 'valid' | 'invalid' | 'empty';
type AllKeys = ApiKeys & { stripePublishableKey: string; stripeSecretKey: string; };

const ValidatedInputField: React.FC<{
    label: string;
    id: keyof AllKeys;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    status: ValidationStatus;
    type?: string;
}> = ({ label, id, value, onChange, placeholder, status, type = "password" }) => {
    const statusColor = {
        valid: 'bg-green-500',
        invalid: 'bg-red-500',
        empty: 'bg-slate-500'
    }[status];

    const statusTitle = {
        valid: 'Formato válido',
        invalid: 'Formato inválido',
        empty: 'Campo vazio'
    }[status];

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
            <div className="flex items-center gap-3">
                <input
                    type={type}
                    id={id}
                    name={id}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="flex-grow w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="w-3 h-3 flex-shrink-0" title={statusTitle}>
                    <div className={`w-full h-full rounded-full transition-colors ${statusColor}`}></div>
                </div>
            </div>
        </div>
    );
};


export const ApiKeysPage: React.FC = () => {
    const [keys, setKeys] = useState<ApiKeys>(initialApiKeys);
    const [stripePublishableKey, setStripePublishableKey] = useState('');
    const [stripeSecretKey, setStripeSecretKey] = useState('');
    const [validation, setValidation] = useState<Record<string, ValidationStatus>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [saveStatus, setSaveStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const fetchKeys = async () => {
            setIsLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data, error } = await supabase
                        .from('user_api_keys')
                        .select('keys')
                        .eq('user_id', user.id)
                        .single();

                    if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
                        throw error;
                    }

                    if (data && data.keys) {
                        setKeys(prev => ({...prev, ...(data.keys as ApiKeys)}));
                    }
                }
            } catch (error) {
                console.error("Error fetching API keys:", error);
                setSaveStatus({ message: 'Não foi possível carregar suas chaves salvas.', type: 'error' });
            } finally {
                setIsLoading(false);
            }
        };

        fetchKeys();
    }, []);

    const validateKey = (name: string, value: string): ValidationStatus => {
        if (!value) return 'empty';
        switch (name) {
            case 'stripePublishableKey':
                return value.startsWith('pk_') && value.length > 15 ? 'valid' : 'invalid';
            case 'stripeSecretKey':
                return value.startsWith('sk_') && value.length > 15 ? 'valid' : 'invalid';
            case 'shopeeAppId':
                return /^\d{10,}$/.test(value) ? 'valid' : 'invalid';
            case 'shopeePassword':
                return /^[A-Z0-9]{32}$/.test(value) ? 'valid' : 'invalid';
            case 'mercadoLivre':
            case 'amazon':
            case 'temu':
            case 'aliexpress':
            case 'shein':
                return value.length > 10 ? 'valid' : 'invalid';
            default:
                return 'empty';
        }
    };

    const runAllValidations = () => {
        const affiliateKeysStatus = Object.fromEntries(
            Object.entries(keys).map(([key, value]) => [key, validateKey(key, value as string)])
        );
        const stripeStatus = {
            stripePublishableKey: validateKey('stripePublishableKey', stripePublishableKey),
            stripeSecretKey: validateKey('stripeSecretKey', stripeSecretKey),
        };
        setValidation({ ...affiliateKeysStatus, ...stripeStatus });
    };

    useEffect(() => {
       runAllValidations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [keys, stripePublishableKey, stripeSecretKey]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name in keys) {
            setKeys(prev => ({ ...prev, [name as keyof ApiKeys]: value }));
        } else if (name === 'stripePublishableKey') {
            setStripePublishableKey(value);
        } else if (name === 'stripeSecretKey') {
            setStripeSecretKey(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveStatus(null);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error("Usuário não autenticado.");
            }
            
            const { error } = await supabase
              .from('user_api_keys')
              .upsert({ user_id: user.id, keys: keys, updated_at: new Date().toISOString() });

            if (error) throw error;

            setSaveStatus({ message: 'Chaves de afiliados salvas com sucesso!', type: 'success' });
        } catch (error) {
             console.error("Error saving API keys:", error);
             const errorMessage = (error as any).message || "Ocorreu um erro desconhecido.";
             setSaveStatus({ message: `Falha ao salvar: ${errorMessage}`, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };
    
    const stripeBackendCode = `
// Exemplo de backend (Node.js/Express) para criar uma Sessão de Checkout
// ATENÇÃO: Use sua chave secreta SOMENTE no backend.

const stripe = require('stripe')('sua_chave_secreta_aqui');
const express = require('express');
const app = express();

app.post('/create-checkout-session', async (req, res) => {
  // O ID do Price é criado no seu Dashboard da Stripe
  const priceId = 'price_1P...'; // Ex: ID do seu plano PRO

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription', // Para pagamentos recorrentes
    success_url: \`\${req.headers.origin}/?session_id={CHECKOUT_SESSION_ID}\`,
    cancel_url: \`\${req.headers.origin}\`,
  });

  res.redirect(303, session.url);
});

app.listen(4242, () => console.log('Running on port 4242'));
    `;
    
    if (isLoading) {
        return (
             <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-t-orange-500 border-slate-700 rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">Chaves de API</h1>
            <p className="text-gray-400 mb-8">Conecte suas contas de afiliado e seu gateway de pagamento. As chaves são salvas de forma segura no seu perfil.</p>
            
            {/* Stripe Section */}
            <div className="mb-10">
                <h2 className="text-xl font-bold text-white mb-4">Gateway de Pagamento (Stripe)</h2>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 space-y-6">
                    <ValidatedInputField 
                        label="Chave Publicável (Publishable Key)" 
                        id="stripePublishableKey" 
                        value={stripePublishableKey} 
                        onChange={handleChange} 
                        placeholder="pk_test_..." 
                        type="text"
                        status={validation.stripePublishableKey || 'empty'}
                    />
                     <ValidatedInputField 
                        label="Chave Secreta (Secret Key)"
                        id="stripeSecretKey" 
                        value={stripeSecretKey} 
                        onChange={handleChange} 
                        placeholder="sk_test_..."
                        status={validation.stripeSecretKey || 'empty'}
                    />
                     <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-3">Implementação (Backend)</h3>
                        <p className="text-gray-400 mb-4 text-sm">
                           Para processar pagamentos de forma segura, a lógica de criação de checkout deve rodar no seu servidor. Use este código Node.js como guia.
                        </p>
                        <div className="bg-slate-900 rounded-md p-4 text-sm font-mono text-gray-300 overflow-x-auto">
                            <pre><code>{stripeBackendCode}</code></pre>
                        </div>
                    </div>
                </div>
            </div>


            {/* Affiliate APIs Section */}
             <h2 className="text-xl font-bold text-white mb-4">Plataformas de Afiliados</h2>
            <form onSubmit={handleSubmit}>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
                     <div className="space-y-6">
                        <ValidatedInputField label="API Key - Mercado Livre" id="mercadoLivre" value={keys.mercadoLivre} onChange={handleChange} placeholder="Cole sua chave da API aqui" status={validation.mercadoLivre || 'empty'} />
                        <ValidatedInputField label="AppID - Shopee" id="shopeeAppId" value={keys.shopeeAppId} onChange={handleChange} placeholder="Cole seu AppID da Shopee aqui" type="text" status={validation.shopeeAppId || 'empty'} />
                        <ValidatedInputField label="Senha da API - Shopee" id="shopeePassword" value={keys.shopeePassword} onChange={handleChange} placeholder="Cole sua senha da API aqui" status={validation.shopeePassword || 'empty'} />
                        <ValidatedInputField label="API Key - Amazon Associados" id="amazon" value={keys.amazon} onChange={handleChange} placeholder="Cole sua chave da API aqui" status={validation.amazon || 'empty'} />
                        <ValidatedInputField label="API Key - Temu" id="temu" value={keys.temu} onChange={handleChange} placeholder="Cole sua chave da API aqui" status={validation.temu || 'empty'} />
                        <ValidatedInputField label="API Key - Aliexpress" id="aliexpress" value={keys.aliexpress} onChange={handleChange} placeholder="Cole sua chave da API aqui" status={validation.aliexpress || 'empty'} />
                        <ValidatedInputField label="API Key - Shein" id="shein" value={keys.shein} onChange={handleChange} placeholder="Cole sua chave da API aqui" status={validation.shein || 'empty'} />
                    </div>

                    <div className="pt-6 mt-6 border-t border-slate-700 text-right">
                         {saveStatus && (
                            <div className={`text-sm text-center mb-4 p-3 rounded-md ${saveStatus.type === 'success' ? 'bg-green-500/10 text-green-300' : 'bg-red-500/10 text-red-300'}`}>
                                {saveStatus.message}
                            </div>
                        )}
                        <button type="submit" disabled={isSaving} className="px-6 py-2 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                           {isSaving ? 'Salvando...' : 'Salvar Chaves de Afiliados'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
