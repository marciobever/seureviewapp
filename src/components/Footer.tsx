
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} Seu Review AI. Todos os direitos reservados.</p>
        <p className="text-sm mt-1">Potencializado por Gemini</p>
      </div>
    </footer>
  );
};