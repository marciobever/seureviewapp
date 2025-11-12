import React from 'react';
import { Logo } from './Logo';

interface PaymentPageProps {
  planName: string;
  onPaymentSuccess: () => void;
  onBack: () => void;
}

const StripeLogo = () => (
    <svg width="60" height="25" viewBox="0 0 50 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M42.8253 10.0211C42.8253 13.0132 45.4284 15.5898 48.4619 15.5898C49.2081 15.5898 49.8823 15.394 50 15.1983L49.9736 12.0016C49.3713 12.3931 48.5598 12.5888 47.9048 12.5888C46.8523 12.5888 45.8262 11.6663 45.8262 10.0211C45.8262 8.37586 46.8787 7.42691 47.9048 7.42691C48.5598 7.42691 49.3713 7.62263 49.9736 8.01413L50 4.81747C49.8823 4.62174 49.2081 4.42602 48.4619 4.42602C45.4284 4.42602 42.8253 7.0026 42.8253 10.0211Z" fill="#fff"/>
        <path d="M34.7905 4.5459H38.0163V15.47H34.7905V4.5459Z" fill="#fff"/>
        <path d="M26.7559 4.5459H30.4965C32.9056 4.5459 34.3219 6.21008 34.3219 8.52041C34.3219 10.3621 33.3191 11.5464 31.724 11.9908L32.7268 15.47H29.1362L28.3247 12.3134H28.272V15.47H25.0462L26.7559 4.5459ZM29.8164 9.8763C30.6543 9.8763 31.1805 9.27483 31.1805 8.52041C31.1805 7.73952 30.6543 7.16452 29.8164 7.16452H28.4568L27.9306 9.8763H29.8164Z" fill="#fff"/>
        <path d="M19.1678 4.5459H23.5358L20.4779 15.47H16.11L19.1678 4.5459Z" fill="#fff"/>
        <path d="M14.0044 4.5459L18.3724 4.5459L17.5609 7.79105H13.2193L12.4078 11.0362H16.7494L15.9379 14.2813H11.5963L10.7848 17.5265H6.41682L10.7848 4.5459H14.0044Z" fill="#fff"/>
        <path d="M0 8.79155C0 6.09021 2.05928 4.42602 4.47161 4.42602C5.07394 4.42602 5.67627 4.57313 6.17013 4.8693L7.00806 1.77051C6.08413 1.35254 5.07394 1.2319 4.13214 1.2319C1.52906 1.2319 0.476562 3.12061 0.476562 5.58983L0.476562 8.79155H0Z" fill="#fff"/>
    </svg>
);

export const PaymentPage: React.FC<PaymentPageProps> = ({ planName, onPaymentSuccess, onBack }) => {
  const getPrice = () => {
      switch(planName) {
          case 'PRO': return 'R$ 49,00';
          case 'Agência': return 'R$ 99,00';
          case 'Teste Gratuito': return 'R$ 0,00';
          default: return 'N/A';
      }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 flex flex-col items-center justify-center p-4">
      <div className="absolute top-8 left-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar
        </button>
      </div>
      <div className="text-center mb-8">
        <Logo />
      </div>
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-white mb-2 text-center">Finalize sua Assinatura</h2>
        <p className="text-gray-400 mb-6 text-center">Você está a um passo de automatizar seu conteúdo.</p>
        
        <div className="bg-slate-700/50 rounded-lg p-4 mb-6 flex justify-between items-center">
            <div>
                <p className="font-semibold text-white">Plano {planName}</p>
                <p className="text-sm text-gray-400">Acesso completo à plataforma</p>
            </div>
            <p className="text-2xl font-bold text-orange-400">{getPrice()}</p>
        </div>
        
        <button
          onClick={onPaymentSuccess}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-orange-600 text-white font-bold rounded-lg shadow-md hover:bg-orange-700 transform transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-orange-500"
        >
          <span>{planName === 'Teste Gratuito' ? 'Ativar Teste Gratuito' : 'Pagar com Stripe'}</span>
        </button>
        <div className="flex justify-center items-center gap-2 mt-4">
            <span className="text-xs text-gray-500">Pagamentos seguros via</span>
            <StripeLogo />
        </div>
      </div>
    </div>
  );
};