
import React from 'react';

const loadingMessages = [
  "Analisando centenas de reviews...",
  "Aplicando um pouco de mágica de IA...",
  "Separando o joio do trigo...",
  "Preparando seu resumo super rápido...",
  "Quase lá, não pisque!"
];

export const LoadingSpinner: React.FC = () => {
    const [message, setMessage] = React.useState(loadingMessages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prev => {
                const currentIndex = loadingMessages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % loadingMessages.length;
                return loadingMessages[nextIndex];
            });
        }, 2500);

        return () => clearInterval(intervalId);
    }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 border-4 border-t-orange-500 border-r-orange-500 border-b-orange-500 border-slate-700 rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-semibold text-white mb-2">Processando...</h2>
      <p className="text-gray-400 transition-opacity duration-500">{message}</p>
    </div>
  );
};