
import React, { useState } from 'react';

const MetaIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.5 12.06c0-5.8-4.7-10.5-10.5-10.5S1.5 6.26 1.5 12.06c0 5.14 3.68 9.4 8.54 10.32v-7.29H7.47v-3.03h2.57V9.55c0-2.54 1.5-3.96 3.83-3.96 1.11 0 2.27.2 2.27.2v2.58h-1.3c-1.24 0-1.63.77-1.63 1.56v1.9h2.88l-.46 3.03h-2.42v7.32c4.86-.92 8.54-5.18 8.54-10.32z"/>
    </svg>
);

const ConnectionStatus: React.FC<{ isConnected: boolean }> = ({ isConnected }) => {
    if (isConnected) {
        return (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <div>
                        <p className="font-semibold text-white">Conectado à Página "Minha Loja de Afiliado"</p>
                        <p className="text-sm text-gray-400">O bot está ativo e pronto para responder.</p>
                    </div>
                </div>
                <button className="text-sm text-red-400 hover:text-red-300 font-semibold">Desconectar</button>
            </div>
        );
    }
    return (
        <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-center">
            <p className="font-semibold text-white mb-2">Nenhuma conta conectada</p>
            <p className="text-sm text-gray-400">Conecte sua conta do Facebook para começar a automatizar seus comentários e DMs.</p>
        </div>
    );
}

const SentimentChart: React.FC = () => {
    // Mock data
    const sentimentData = [
        { label: 'Positivo', value: 75, color: 'bg-green-500' },
        { label: 'Dúvida', value: 15, color: 'bg-amber-500' },
        { label: 'Negativo', value: 10, color: 'bg-red-500' },
    ];

    return (
        <div>
            <h3 className="text-lg font-bold text-white mb-4">Análise de Sentimento (Últimos 100 comentários)</h3>
            <div className="space-y-3">
                {sentimentData.map(item => (
                    <div key={item.label} className="flex items-center gap-4">
                        <span className="w-20 text-sm text-gray-300">{item.label}</span>
                        <div className="flex-grow bg-slate-700 rounded-full h-4">
                            <div
                                className={`${item.color} h-4 rounded-full`}
                                style={{ width: `${item.value}%` }}
                            ></div>
                        </div>
                        <span className="w-10 text-sm font-semibold text-white">{item.value}%</span>
                    </div>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">A IA analisa o sentimento dos comentários para fornecer insights sobre a recepção do seu conteúdo.</p>
        </div>
    );
};

export const CommentBotPage: React.FC = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [keyword, setKeyword] = useState('QUERO');
    const [replyMessage, setReplyMessage] = useState('Olá! Vi seu interesse. 😊 O link para comprar com desconto já está na sua DM! Qualquer dúvida, me chame por lá.');

    const handleConnect = () => {
        // Lógica de simulação
        alert("Em um ambiente de produção, isso iniciaria o fluxo de autenticação do Facebook (OAuth) para conectar sua conta.");
        setIsConnected(true);
    };

    const handleSaveChanges = () => {
        alert(`Configurações salvas!\n\nPalavra-chave: ${keyword}\nResposta: ${replyMessage}\n\n(Em produção, isso seria salvo no banco de dados e atualizaria a lógica do seu bot no backend.)`);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
             <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 text-center">Bot de Comentários com IA</h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 text-center">
                Responda comentários e DMs automaticamente, 24/7, e nunca mais perca um lead.
            </p>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 space-y-8">
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">1. Conexão com a Conta</h2>
                    <ConnectionStatus isConnected={isConnected} />
                    {!isConnected && (
                        <div className="text-center mt-6">
                             <button
                                onClick={handleConnect}
                                className="w-full max-w-xs flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transform transition-colors duration-300 ease-in-out"
                            >
                                <MetaIcon />
                                <span>Conectar com Facebook</span>
                            </button>
                        </div>
                    )}
                </div>
                 
                <div className={`transition-opacity duration-500 ${!isConnected ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                    <div className="h-px bg-slate-700 my-4"></div>
                    <h2 className="text-xl font-bold text-white mb-4">2. Análise de Sentimento com IA (Em breve)</h2>
                    <SentimentChart />
                </div>


                <div className={`transition-opacity duration-500 ${!isConnected ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                    <div className="h-px bg-slate-700 my-4"></div>
                    <h2 className="text-xl font-bold text-white mb-4">3. Configuração da Automação</h2>
                    <div className="space-y-6">
                         <div>
                            <label htmlFor="keyword" className="block text-sm font-medium text-gray-300 mb-2">Palavra-chave gatilho</label>
                            <input
                                type="text"
                                id="keyword"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Ex: EUQUERO, LINK, QUERO"
                                disabled={!isConnected}
                            />
                            <p className="text-xs text-gray-500 mt-1">Quando um usuário comentar com esta palavra, o bot será ativado.</p>
                        </div>
                        <div>
                            <label htmlFor="reply" className="block text-sm font-medium text-gray-300 mb-2">Resposta automática no post</label>
                            <textarea
                                id="reply"
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                rows={4}
                                className="w-full bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
                                placeholder="Digite a mensagem que o bot responderá publicamente..."
                                disabled={!isConnected}
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-1">Esta mensagem será postada como uma resposta ao comentário do usuário. Uma mensagem separada com o link será enviada na DM.</p>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-700 text-right">
                    <button
                        onClick={handleSaveChanges}
                        disabled={!isConnected}
                        className="px-8 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Salvar Configurações
                    </button>
                </div>

            </div>
        </div>
    );
};
