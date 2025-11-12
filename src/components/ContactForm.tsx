
import React from 'react';

export const ContactForm: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Obrigado pelo seu contato! Responderemos em breve.');
        // Here you would typically handle form submission
        (e.target as HTMLFormElement).reset();
    };

    return (
        <section className="py-20" id="contact">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Entre em Contato</h2>
                    <p className="text-lg text-gray-400 mb-12">
                        Tem alguma dúvida ou sugestão? Adoraríamos ouvir você. Preencha o formulário abaixo.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-slate-800/50 border border-slate-700 rounded-2xl p-8 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                            className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                            className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
                            placeholder="Como podemos te ajudar?"
                        ></textarea>
                    </div>
                    <div className="text-center">
                        <button
                            type="submit"
                            className="px-8 py-3 bg-emerald-600 text-white font-semibold rounded-full shadow-md hover:bg-emerald-700 transform transition-colors duration-300 ease-in-out"
                        >
                            Enviar Mensagem
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};