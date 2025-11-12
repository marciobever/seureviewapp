
import React from 'react';

interface PricingCardProps {
  planName: string;
  price: string;
  priceDetails: string;
  features: string[];
  isFeatured?: boolean;
  onSelectPlan: (planName: string) => void;
}

const CheckIcon = () => (
    <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

const PricingCard: React.FC<PricingCardProps> = ({ planName, price, priceDetails, features, isFeatured = false, onSelectPlan }) => (
  <div className={`border rounded-2xl p-8 flex flex-col ${isFeatured ? 'bg-slate-800 border-orange-500 scale-105 card-glow' : 'bg-slate-900/50 border-slate-700'}`}>
    {isFeatured && (
        <div className="text-center mb-4">
            <span className="text-sm font-bold text-orange-300 bg-orange-500/10 px-3 py-1 rounded-full">MAIS POPULAR</span>
        </div>
    )}
    <h3 className="text-2xl font-semibold text-white text-center">{planName}</h3>
    <p className="text-center mt-4">
        <span className="text-5xl font-extrabold text-white">{price}</span>
        <span className="text-gray-400">/{priceDetails}</span>
    </p>
    <ul className="mt-8 space-y-4 flex-grow">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start">
          <CheckIcon />
          <span className="ml-3 text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
    <button
        onClick={() => onSelectPlan(planName)}
        className={`w-full mt-10 py-3 font-semibold rounded-lg transition-transform transform hover:scale-105 ${isFeatured ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
    >
      Escolher Plano
    </button>
  </div>
);

const StripeLogo = () => (
    <svg width="50" height="20" viewBox="0 0 50 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M42.8253 10.0211C42.8253 13.0132 45.4284 15.5898 48.4619 15.5898C49.2081 15.5898 49.8823 15.394 50 15.1983L49.9736 12.0016C49.3713 12.3931 48.5598 12.5888 47.9048 12.5888C46.8523 12.5888 45.8262 11.6663 45.8262 10.0211C45.8262 8.37586 46.8787 7.42691 47.9048 7.42691C48.5598 7.42691 49.3713 7.62263 49.9736 8.01413L50 4.81747C49.8823 4.62174 49.2081 4.42602 48.4619 4.42602C45.4284 4.42602 42.8253 7.0026 42.8253 10.0211Z" fill="#fff"/>
        <path d="M34.7905 4.5459H38.0163V15.47H34.7905V4.5459Z" fill="#fff"/>
        <path d="M26.7559 4.5459H30.4965C32.9056 4.5459 34.3219 6.21008 34.3219 8.52041C34.3219 10.3621 33.3191 11.5464 31.724 11.9908L32.7268 15.47H29.1362L28.3247 12.3134H28.272V15.47H25.0462L26.7559 4.5459ZM29.8164 9.8763C30.6543 9.8763 31.1805 9.27483 31.1805 8.52041C31.1805 7.73952 30.6543 7.16452 29.8164 7.16452H28.4568L27.9306 9.8763H29.8164Z" fill="#fff"/>
        <path d="M19.1678 4.5459H23.5358L20.4779 15.47H16.11L19.1678 4.5459Z" fill="#fff"/>
        <path d="M14.0044 4.5459L18.3724 4.5459L17.5609 7.79105H13.2193L12.4078 11.0362H16.7494L15.9379 14.2813H11.5963L10.7848 17.5265H6.41682L10.7848 4.5459H14.0044Z" fill="#fff"/>
        <path d="M0 8.79155C0 6.09021 2.05928 4.42602 4.47161 4.42602C5.07394 4.42602 5.67627 4.57313 6.17013 4.8693L7.00806 1.77051C6.08413 1.35254 5.07394 1.2319 4.13214 1.2319C1.52906 1.2319 0.476562 3.12061 0.476562 5.58983L0.476562 8.79155H0Z" fill="#fff"/>
    </svg>
);


export const PricingPage: React.FC<{onSelectPlan: (planName: string) => void}> = ({ onSelectPlan }) => {
  return (
    <section className="py-20" id="pricing">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Planos que cabem no seu bolso</h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-16">Escolha o plano ideal para alavancar sua estratégia de marketing de afiliado.</p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            <PricingCard 
                planName="Teste Gratuito"
                price="Grátis"
                priceDetails="3 dias"
                features={[
                    "Acesso a todas as funcionalidades",
                    "Geração de posts ilimitada",
                    "5 Créditos Avançados (Vídeo/Blog)",
                    "Sem necessidade de cartão",
                    "Suporte por e-mail"
                ]}
                onSelectPlan={onSelectPlan}
            />
            <PricingCard 
                planName="PRO"
                price="49"
                priceDetails="mês"
                features={[
                    "Geração de posts ilimitada",
                    "50 Créditos Avançados / mês",
                    "Geração de Imagens com IA",
                    "Gerador de Artigos e Roteiros",
                    "Bot de Comentários (Em breve)",
                    "Suporte prioritário"
                ]}
                isFeatured={true}
                onSelectPlan={onSelectPlan}
            />
            <PricingCard 
                planName="Agência"
                price="99"
                priceDetails="mês"
                features={[
                    "Tudo do plano PRO",
                    "150 Créditos Avançados / mês",
                    "Múltiplos usuários",
                    "Dashboard para clientes",
                    "API de acesso (em breve)",
                    "Gerente de conta dedicado"
                ]}
                onSelectPlan={onSelectPlan}
            />
        </div>
         <div className="mt-16 flex justify-center items-center gap-3">
            <span className="text-gray-400">Pagamentos seguros via</span>
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg">
                <StripeLogo />
            </div>
        </div>
      </div>
    </section>
  );
};
