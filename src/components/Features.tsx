
import React from 'react';

// New Stylized Illustrations
const BotIllustration = () => (
    <svg viewBox="0 0 100 80" className="w-full h-full">
        <path d="M20 30 Q50 10 80 30" stroke="#fb923c" fill="none" strokeWidth="2" strokeLinecap="round" />
        <path d="M25 40 Q50 25 75 40" stroke="#fb923c" fill="none" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        <path d="M30 50 Q50 40 70 50" stroke="#fb923c" fill="none" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
        <rect x="10" y="55" width="80" height="20" rx="5" fill="#1e293b" />
        <circle cx="20" cy="65" r="3" fill="#f97316"/>
        <text x="30" y="68" fill="#e2e8f0" fontSize="8" fontFamily="Inter">QUERO</text>
        <path d="M60 65 L70 60 L70 70 Z" fill="#38bdf8" />
        <path d="M75 65 L85 60 L85 70 Z" fill="#38bdf8" opacity="0.7"/>
    </svg>
);
const MultiContentIllustration = () => (
    <svg viewBox="0 0 100 80" className="w-full h-full">
        <rect x="10" y="20" width="40" height="50" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="2"/>
        <rect x="15" y="25" width="30" height="5" rx="2" fill="#f97316"/>
        <rect x="15" y="35" width="25" height="3" rx="1.5" fill="#475569"/>
        <rect x="15" y="42" width="28" height="3" rx="1.5" fill="#475569"/>
        <rect x="55" y="28" width="35" height="40" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="2" transform="rotate(10 60 40)"/>
        <path d="M65 40 L75 45 L65 50 Z" fill="#f97316" transform="rotate(10 60 40)"/>
        <rect x="25" y="35" width="45" height="35" rx="5" fill="#1e293b" stroke="#f97316" strokeWidth="2" transform="rotate(-5 40 45)"/>
        <rect x="30" y="42" width="35" height="3" rx="1.5" fill="#475569" transform="rotate(-5 40 45)"/>
        <rect x="30" y="50" width="30" height="3" rx="1.5" fill="#475569" transform="rotate(-5 40 45)"/>
    </svg>
);
const SearchIllustration = () => (
    <svg viewBox="0 0 100 80" className="w-full h-full">
        <circle cx="35" cy="40" r="15" stroke="#f97316" strokeWidth="2" fill="none"/>
        <line x1="47" y1="52" x2="60" y2="65" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
        <rect x="65" y="20" width="25" height="15" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="2"/>
        <rect x="65" y="45" width="25" height="15" rx="3" fill="#1e293b" stroke="#f97316" strokeWidth="2"/>
        <line x1="40" y1="40" x2="65" y2="27.5" stroke="#475569" strokeDasharray="2 2"/>
        <line x1="40" y1="40" x2="65" y2="52.5" stroke="#f97316" strokeDasharray="2 2"/>
    </svg>
);
const MediaStudioIllustration = () => (
    <svg viewBox="0 0 100 80" className="w-full h-full">
        <rect x="10" y="20" width="80" height="50" rx="5" fill="#1e293b" stroke="#334155" strokeWidth="2"/>
        <path d="M20 60 Q35 45 50 55 T 80 50" stroke="#f97316" fill="none" strokeWidth="2"/>
        <circle cx="30" cy="35" r="5" fill="#fb923c"/>
        <path d="M55 25 L85 25 L70 45 Z" fill="#38bdf8"/>
        <circle cx="75" cy="30" r="3" fill="#fef08a"/>
    </svg>
);


const FeatureItem: React.FC<{ illustration: React.ReactNode; title: string; children: React.ReactNode }> = ({ illustration, title, children }) => (
  <div className="p-8 bg-slate-800/50 rounded-2xl border border-slate-700/80 card-glow-strong flex flex-col items-center text-center">
    <div className="h-32 w-full mb-6">
        {illustration}
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{children}</p>
  </div>
);

export const Features: React.FC = () => {
  return (
    <section className="py-20 text-center" id="features">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-glow">Uma Máquina de Conteúdo, Não Apenas uma Ferramenta</h2>
      <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-16">De posts a vídeos, de busca a automação. Tudo que você precisa para criar conteúdo que converte, em escala.</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto text-left">
        <FeatureItem illustration={<BotIllustration />} title="Automação com Bots de IA">
          Nunca mais perca um lead. Configure bots para responder comentários com uma palavra-chave (ex: "QUERO"), enviar DMs automáticas com seu link e interagir com clientes no Facebook e Instagram, 24/7.
        </FeatureItem>
         <FeatureItem illustration={<MultiContentIllustration />} title="Geração Multi-Formato">
          Vá além de simples posts. Transforme qualquer produto em um artigo de blog otimizado para SEO, um roteiro para vídeo (YouTube/Reels) ou dezenas de variações de posts para redes sociais.
        </FeatureItem>
        <FeatureItem illustration={<SearchIllustration />} title="Busca e Análise de Produtos">
          Encontre produtos de alto potencial com nossa busca inteligente. Compare-os lado a lado com a IA para criar reviews detalhados que ajudam seu público a tomar a decisão de compra.
        </FeatureItem>
        <FeatureItem illustration={<MediaStudioIllustration />} title="Estúdio de Mídia com IA">
          Destaque-se da concorrência. Gere imagens de marketing únicas com o Imagen para seus produtos e crie vídeos curtos e dinâmicos com o Veo para capturar a atenção do seu público.
        </FeatureItem>
      </div>
    </section>
  );
};