import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';

// Lazily initialize the AI instance
const getAi = (() => {
    let aiInstance: GoogleGenAI | null = null;
    return () => {
        if (!aiInstance) {
            aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        }
        return aiInstance;
    };
})();

const systemInstruction = `Você é "SeuReview AI Assistant", o assistente virtual da plataforma SeuReview AI. Sua missão é ajudar os usuários a entender a plataforma, responder suas perguntas e incentivá-los a usar as ferramentas. Responda sempre em português do Brasil, de forma amigável e prestativa.

**INFORMAÇÕES SOBRE A PLATAFORMA SEUREVIEW AI:**

**1. Propósito Principal:**
A SeuReview AI é uma plataforma de automação de conteúdo para marketing de afiliados. O objetivo é ajudar afiliados a economizar tempo e criar conteúdo de alta conversão (reviews de produtos, posts para redes sociais, vídeos) em segundos usando Inteligência Artificial.

**2. Funcionalidades Principais:**
*   **Busca Inteligente de Produtos:** O usuário descreve um produto, e a IA encontra as 8 melhores opções de afiliados em lojas populares (Shopee, Amazon, Mercado Livre, etc.), mostrando dados como preço, comissão, avaliação e volume de vendas.
*   **Gerador de Conteúdo Persuasivo:** Após escolher um produto, a IA cria automaticamente títulos, textos para posts (com hashtags e emojis) e o link de afiliado pronto para ser publicado.
*   **Criação de Vídeos para Reels:** A plataforma pode gerar vídeos curtos e dinâmicos (formato 9:16) para Reels e TikTok a partir de uma simples descrição de texto.
*   **Bot de Comentários (Em breve):** Uma funcionalidade futura para responder comentários e DMs automaticamente.

**3. Como Funciona (Processo em 3 Passos):**
*   **Passo 1: Buscar:** O usuário descreve o produto que quer divulgar na ferramenta "Gerador de Conteúdo".
*   **Passo 2: Escolher:** A IA apresenta 8 opções de produtos. O usuário analisa os dados e escolhe o melhor.
*   **Passo 3: Editar e Publique:** Um painel de edição abre com o conteúdo gerado (título, post, link). O usuário pode ajustar o texto e copiar para publicar.

**4. Planos e Preços:**
*   **Teste Gratuito:** Totalmente grátis por 3 dias. Dá acesso a todas as funcionalidades sem precisar de cartão de crédito.
*   **Plano PRO:** Custa R$49 por mês. Inclui gerações ilimitadas, geração de imagens, vídeos para Reels e suporte prioritário. É o plano mais popular.
*   **Plano Agência:** Custa R$99 por mês. Inclui tudo do PRO, mais recursos para múltiplos usuários e agências.

**5. Como Responder:**
*   Use as informações acima para basear todas as suas respostas.
*   Se um usuário perguntar sobre preços, detalhe os planos.
*   Se perguntar como começar, explique o fluxo de 3 passos.
*   Seja um especialista na plataforma e guie o usuário.
*   Se não souber a resposta, diga que vai verificar com a equipe de suporte. Não invente funcionalidades.`;


interface Message {
  sender: 'user' | 'bot';
  text: string;
  isError?: boolean;
}

// Icons (self-contained within the component)
const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const BotIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-400">
        <path d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 21L15.65 15.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.5 13.5L12 12L10.5 10.5L9 12L10.5 13.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ChatTriggerIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isBot = message.sender === 'bot';
  return (
    <div className={`flex items-start gap-3 w-full animate-fade-in ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isBot ? (message.isError ? 'bg-red-900/50' : 'bg-slate-700') : 'bg-orange-600'}`}>
        {isBot ? <BotIcon /> : <UserIcon />}
      </div>
      <div className={`p-3 rounded-xl max-w-xs text-sm ${isBot ? (message.isError ? 'bg-red-900/20 border border-red-500/30 text-red-300 rounded-tl-none' : 'bg-slate-700 text-gray-300 rounded-tl-none') : 'bg-orange-800 text-white rounded-tr-none'}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};


export const FloatingChatBot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !chat) {
            const ai = getAi();
            const chatSession = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: systemInstruction,
                },
            });
            setChat(chatSession);
            setMessages([
                {
                    sender: 'bot',
                    text: 'Olá! 👋 Sou o assistente do SeuReview AI. Como posso ajudar você?'
                }
            ]);
        }
    }, [isOpen, chat]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (!userInput.trim() || isLoading || !chat) return;

        const userMessage: Message = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await chat.sendMessage({ message: userInput });
            const botMessage: Message = { sender: 'bot', text: response.text };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.';
            const errorBotMessage: Message = { sender: 'bot', text: `Desculpe, não consegui processar sua solicitação. Detalhes: ${errorMessage}`, isError: true };
            setMessages(prev => [...prev, errorBotMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            <div className={`w-80 md:w-96 h-[450px] md:h-[500px] mb-4 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl flex flex-col transform origin-bottom-right transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <BotIcon />
                        <h2 className="text-base font-bold text-white">Assistente IA</h2>
                    </div>
                </header>
                {/* Chat body */}
                <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg} />
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3 animate-fade-in">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-700">
                                <BotIcon />
                            </div>
                            <div className="p-3 rounded-xl max-w-lg bg-slate-700 text-gray-400 rounded-tl-none italic text-sm">
                                Digitando...
                            </div>
                        </div>
                    )}
                </div>
                {/* Input */}
                <div className="p-3 border-t border-slate-700">
                    <div className="flex items-center gap-2 bg-slate-700 rounded-full border border-slate-600 p-1">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                            placeholder="Sua pergunta..."
                            className="w-full bg-transparent px-3 py-1 text-white placeholder-gray-400 focus:outline-none text-sm"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading || !userInput.trim()}
                            className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Enviar mensagem"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Trigger Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-700 transition-all transform hover:scale-110 focus:outline-none ring-4 ring-slate-900"
                aria-label={isOpen ? "Fechar chat" : "Abrir chat"}
            >
                {isOpen ? <CloseIcon /> : <ChatTriggerIcon />}
            </button>
        </div>
    );
};