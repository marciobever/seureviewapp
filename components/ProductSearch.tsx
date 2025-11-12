import React, { useState } from 'react';

interface ProductSearchProps {
  onSummarize: (query: string, provider: string) => void;
  isLoading: boolean;
}

export const ProductSearch: React.FC<ProductSearchProps> = ({ onSummarize, isLoading }) => {
  const [query, setQuery] = useState('');
  const [provider, setProvider] = useState('all');

  const providers = [
    { id: 'all', name: 'Todas as Lojas' },
    { id: 'Mercado Livre', name: 'Mercado Livre' },
    { id: 'Shopee', name: 'Shopee' },
    { id: 'Amazon', name: 'Amazon' },
    { id: 'Temu', name: 'Temu' },
    { id: 'Aliexpress', name: 'Aliexpress' },
    { id: 'Shein', name: 'Shein' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSummarize(query, provider);
  };

  return (
    <section className="text-center py-10 md:py-16">
      <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
        Gerador de Conteúdo de Afiliado
      </h2>
      <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
        Escolha uma loja, descreva o produto e a IA criará uma review completa, post para redes sociais e uma imagem de marketing.
      </p>
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-3 items-center bg-slate-800/50 p-2 rounded-xl md:rounded-full border border-slate-700 shadow-lg">
          <div className="flex-shrink-0 w-full md:w-auto">
             <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                disabled={isLoading}
                className="w-full text-center md:text-left bg-slate-700 border-slate-600 rounded-full py-3 pl-4 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
             >
                {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
             </select>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex: Melhor cadeira gamer custo-benefício"
            className="w-full md:flex-1 bg-transparent px-6 py-3 text-white placeholder-gray-500 focus:outline-none"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-8 py-3 bg-orange-600 text-white font-semibold rounded-full shadow-md hover:bg-orange-700 transform transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Analisando...' : 'Gerar Conteúdo'}
          </button>
        </div>
      </form>
    </section>
  );
};