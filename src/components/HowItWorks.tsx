
import React from 'react';

const Step: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="text-center p-6 bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700 transform hover:-translate-y-2 transition-transform duration-300 w-full max-w-xs h-full flex flex-col">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-700 mx-auto mb-4 text-orange-400 ring-4 ring-slate-700/50">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-400 flex-grow">{description}</p>
  </div>
);

const ConnectorArrow = () => (
    <div className="hidden md:flex items-center justify-center text-orange-500/50 animate-pulse mx-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
    </div>
);

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const SelectIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>;

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-20" id="how-it-works">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-20 text-glow">Como Funciona em 3 Passos Simples</h2>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-x-4 gap-y-8">
            <Step 
              icon={<SearchIcon />}
              title="1. Busque o Produto"
              description="Descreva o produto que você quer divulgar. A IA buscará as melhores opções de afiliados com base nas vendas e comissões."
            />
            <ConnectorArrow />
            <Step 
              icon={<SelectIcon />}
              title="2. Escolha ou Compare"
              description="Analise os produtos, selecione o melhor para gerar um post, ou ative o modo de comparação para uma análise detalhada."
            />
            <ConnectorArrow />
            <Step 
              icon={<EditIcon />}
              title="3. Gere, Edite e Expanda"
              description="Um painel se abre com o conteúdo pronto. Edite, gere imagens com IA, ou transforme seu post em um artigo de blog ou roteiro de vídeo."
            />
        </div>
      </div>
    </section>
  );
};