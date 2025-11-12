import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

interface Message {
  sender: 'user' | 'bot';
  text: string;
  isError?: boolean;
}

const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const BotIcon: React.FC = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-400">
        <path d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 21L15.65 15.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.5 13.5L12 12L10.5 10.5L9 12L10.5 13.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.5 7.5V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.5 10.5H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.5 15V14.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isBot = message.sender === 'bot';
  return (
    <div className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isBot ? (message.isError ? 'bg-red-900/50' : 'bg-slate-700') : 'bg-orange-600'}`}>
        {isBot ? <BotIcon /> : <UserIcon />}
      </div>
      <div className={`p-4 rounded-xl max-w-lg ${isBot ? (message.isError ? 'bg-red-900/20 border border-red-500/30 text-red-300 rounded-tl-none' : 'bg-slate-700 text-gray-300 rounded-tl-none') : 'bg-orange-800 text-white rounded-tr-none'}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

export const ChatBotPage: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const chatSession = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: 'Você é o assistente virtual do SeuReview AI, uma plataforma de automação de conteúdo para marketing de afiliados. Seja amigável, prestativo e responda em português do Brasil. Ajude os usuários a entenderem a plataforma e a tirarem o máximo proveito dela.',
            },
        });
        setChat(chatSession);
        setMessages([
            {
                sender: 'bot',
                text: 'Olá! 👋 Sou o assistente do SeuReview AI. Como posso ajudar você a automatizar seu conteúdo de afiliado hoje?'
            }
        ]);
    }, []);

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
        <div className="max-w-3xl mx-auto h-full flex flex-col animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white">Assistente IA</h1>
                <p className="text-gray-400">Tire suas dúvidas sobre a plataforma ou peça dicas.</p>
            </div>
            <div className="flex-grow bg-slate-800 border border-slate-700 rounded-2xl flex flex-col overflow-hidden">
                <div ref={chatContainerRef} className="flex-grow p-6 space-y-6 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <ChatMessage key={index} message={msg} />
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-700">
                                <BotIcon />
                            </div>
                            <div className="p-4 rounded-xl max-w-lg bg-slate-700 text-gray-400 rounded-tl-none italic">
                                Digitando...
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                    <div className="flex items-center gap-3 bg-slate-700 rounded-full border border-slate-600 p-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                            placeholder="Digite sua pergunta..."
                            className="w-full bg-transparent px-4 py-2 text-white placeholder-gray-500 focus:outline-none"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading || !userInput.trim()}
                            className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Enviar mensagem"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ChatBotPage;