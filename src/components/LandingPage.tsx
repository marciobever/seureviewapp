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

        <div id="features">
          <Features />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-10" />

        <div id="how-it-works">
          <HowItWorks />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-10" />

        <div id="pricing">
          <PricingPage onSelectPlan={onSelectPlan} />
        </div>
      </main>

      <Footer />
      <FloatingChatBot />
    </div>
  );
};
