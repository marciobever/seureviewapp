
import React, { useState } from 'react';
import { Logo } from './Logo';

interface HeaderProps {
    onSelectPlan: (planName: string) => void;
    onShowContact: () => void;
    onLoginClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSelectPlan, onShowContact, onLoginClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Funcionalidades', href: '#features' },
    { name: 'Como Funciona', href: '#how-it-works' },
    { name: 'Planos', href: '#pricing' },
  ];

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); // Close menu on click
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-x-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={(e) => handleScrollClick(e, link.href)}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            ))}
             <a 
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    onShowContact();
                }}
                className="text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                Contato
              </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-x-6">
             <div className="h-6 w-px bg-slate-700"></div>
            <button onClick={() => {
                setIsMobileMenuOpen(false);
                onLoginClick();
            }} className="text-gray-300 hover:text-white font-semibold transition-colors px-4 py-2 rounded-md hover:bg-slate-800">
              Entrar
            </button>
            <button onClick={() => {
                setIsMobileMenuOpen(false);
                onSelectPlan('PRO');
            }} className="px-5 py-2 bg-orange-600 text-white font-semibold rounded-full shadow-md hover:bg-orange-700 transform transition-all duration-300 ease-in-out hover:scale-105">
              Começar Agora
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
             <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="p-2 text-gray-300 hover:text-white focus:outline-none"
                aria-label="Open menu"
             >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMobileMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>
          </div>
        </div>
      </div>
       {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-sm absolute top-20 left-0 w-full animate-fade-in border-t border-slate-800">
            <div className="container mx-auto px-6 py-6 space-y-2">
                 {navLinks.map((link) => (
                    <a 
                        key={link.name} 
                        href={link.href}
                        onClick={(e) => handleScrollClick(e, link.href)}
                        className="block text-lg text-gray-300 hover:text-white transition-colors py-3 rounded-md px-4 hover:bg-slate-800"
                    >
                        {link.name}
                    </a>
                ))}
                <a 
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                        onShowContact();
                    }}
                    className="block text-lg text-gray-300 hover:text-white transition-colors py-3 rounded-md px-4 hover:bg-slate-800"
                >
                    Contato
                </a>
                <div className="border-t border-slate-700 pt-6 space-y-4">
                     <button onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLoginClick();
                     }} className="w-full text-center py-3 text-lg text-white font-semibold transition-colors rounded-md bg-slate-800 hover:bg-slate-700">
                        Entrar
                    </button>
                    <button onClick={() => {
                        setIsMobileMenuOpen(false);
                        onSelectPlan('PRO');
                    }} className="w-full px-5 py-3 bg-orange-600 text-white font-semibold rounded-full shadow-md hover:bg-orange-700 transition-colors text-lg">
                        Começar Agora
                    </button>
                </div>
            </div>
        </div>
      )}
       <div className="h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-line-glow"></div>
    </header>
  );
};