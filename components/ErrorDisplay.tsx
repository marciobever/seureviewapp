
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onReset: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onReset }) => {
  return (
    <div className="w-full max-w-md mx-auto text-center bg-red-900/20 border border-red-500/50 rounded-lg p-8">
      <div className="text-5xl mb-4">😢</div>
      <h2 className="text-2xl font-bold text-red-400 mb-2">Oops! Algo deu errado.</h2>
      <p className="text-red-300 mb-6">{message}</p>
      <button
        onClick={onReset}
        className="px-6 py-2 bg-red-500 text-white font-semibold rounded-full hover:bg-red-600 transition-colors"
      >
        Tentar Novamente
      </button>
    </div>
  );
};
