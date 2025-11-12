import React from 'react';

interface ContactPageProps {
    onBack: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Obrigado pelo seu contato! Responderemos em breve.');
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="min-h-screen bg-slate-950 text-gray-200 flex flex-col items-center justify-center p-4">
             <div className="absolute top-8 left-8">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Voltar
                </button>
            </div>
            
            <div className="w-full max-w-2xl animate-fade-in">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-white mb-2">Fale Conosco 💬</h1>
                    <p className="text-lg text-gray-400">
                        Tem alguma dúvida, sugestão ou feedback? Adoraríamos ouvir você.
                    </p>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Seu nome completo"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="seu@email.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Mensagem</label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={5}
                                className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
                                placeholder="Como podemos te ajudar?"
                            ></textarea>
                        </div>
                        <div className="text-center pt-2">
                            <button
                                type="submit"
                                className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-full shadow-md hover:bg-orange-700 transform transition-colors duration-300 ease-in-out"
                            >
                                Enviar Mensagem
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <footer className="absolute bottom-0 py-6 text-center text-gray-600 text-sm">
                <p>&copy; {new Date().getFullYear()} Seu Review AI. Potencializado por Gemini.</p>
             </footer>
        </div>
    );
};

export default ContactPage;