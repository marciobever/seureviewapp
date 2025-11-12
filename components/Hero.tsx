import React from 'react';
import { PartnersBanner } from './PartnersBanner';

interface LandingHeroProps {
  onCTAClick: () => void;
}

const PostIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 12h6m-3-4h.01" /></svg>;
const ArticleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;

const FeaturePill: React.FC<{icon: React.ReactNode; label: string}> = ({icon, label}) => (
    <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-full px-4 py-2">
        <div className="text-orange-400">{icon}</div>
        <span className="text-sm font-medium text-gray-300">{label}</span>
    </div>
);

export const Hero: React.FC<LandingHeroProps> = ({ onCTAClick }) => {
  return (
    <section className="min-h-[calc(100vh-5rem)] flex flex-col justify-center text-center">
       <div className="container mx-auto px-4 animate-fade-in-up flex-grow flex flex-col justify-center items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight text-glow">
            A Central de Conteúdo IA que <br/> Transforma <span className="text-orange-400">Cliques em Comissões</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Pare de perder tempo. Gere posts virais, artigos de blog otimizados para SEO, roteiros para vídeos, imagens de marketing e automatize suas redes sociais, tudo em um só lugar.
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-3 mb-10">
            <FeaturePill icon={<PostIcon />} label="Posts Sociais" />
            <FeaturePill icon={<ArticleIcon />} label="Artigos de Blog" />
            <FeaturePill icon={<VideoIcon />} label="Roteiros de Vídeo" />
            <FeaturePill icon={<ImageIcon />} label="Imagens com IA" />
        </div>

        <div className="flex flex-col items-center">
            <button
                onClick={onCTAClick}
                className="px-10 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-full shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-105 transform transition-all duration-300 ease-in-out"
            >
                Comece a Automatizar (Teste Grátis)
            </button>
            <p className="text-sm text-gray-500 mt-4">Não é necessário cartão de crédito.</p>
        </div>
       </div>
       <div className="w-full pb-10">
        <PartnersBanner />
       </div>
    </section>
  );
};