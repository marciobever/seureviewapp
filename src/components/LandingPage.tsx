import React from 'react';
import { Header } from './Header';
import { Hero } from './Hero';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { PricingPage } from '../../components/PricingPage';
import { Footer } from './Footer';
import { FloatingChatBot } from './FloatingChatBot';

interface LandingPageProps {
  onSelectPlan: (planName: string) => void;
  onShowContact: () => void;
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectPlan,
  onShowContact,
  onLoginClick,
}) => {
  return (
    <div>
      <Header
        onSelectPlan={onSelectPlan}
        onShowContact={onShowContact}
        onLoginClick={onLoginClick}
      />

      <main>
        <Hero onCTAClick={() => onSelectPlan('Teste Gratuito')} />

        {/* Carrossel de plataformas compatíveis */}
        <section className="relative mt-10 mb-6">
          <p className="text-center text-sm uppercase tracking-[0.25em] text-slate-400 mb-4">
            COMPATÍVEL COM AS MAIORES PLATAFORMAS
          </p>

          <div className="scroller overflow-hidden">
            <div className="scroller-inner text-gray-500 items-center">
              {[
                'Amazon',
                'Shopee',
                'AliExpress',
                'Mercado Livre',
                'Temu',
                'Shein',
                'Magazine Luiza',
                'Americanas',
                'Submarino',
                'OLX',
              ].map((brand) => (
                <div
                  key={brand}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700/60 backdrop-blur-sm shadow-sm hover:border-orange-400/70 hover:text-orange-200 transition-all"
                >
                  {/* Ícone genérico de sacola / e-commerce */}
                  <div className="h-7 w-7 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="h-4 w-4"
                    >
                      <path
                        d="M7 9V8a5 5 0 0 1 10 0v1h1.2a1.8 1.8 0 0 1 1.8 1.93l-.7 8.4A2 2 0 0 1 17.32 21H6.68a2 2 0 0 1-1.98-1.67l-.7-8.4A1.8 1.8 0 0 1 5.8 9H7zm2 0h6V8a3 3 0 0 0-6 0v1z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div id="features">
          <Features />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-10"></div>

        <div id="how-it-works">
          <HowItWorks />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-10"></div>

        <div id="pricing">
          <PricingPage onSelectPlan={onSelectPlan} />
        </div>
      </main>

      <Footer />
      <FloatingChatBot />
    </div>
  );
};
