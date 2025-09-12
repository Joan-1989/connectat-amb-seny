import React, { useState, useEffect, useRef } from 'react';
import type { ChatScenario, ChatMessage } from '../../types';
import { generateChatResponse } from '../../services/geminiService';

interface InteractiveChatProps {
    scenario: ChatScenario;
    onBack: () => void;
}

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${isUser ? 'bg-brand-primary text-white' : 'bg-gray-200 text-brand-dark'}`}>
                {message.parts[0].text}
            </div>
        </div>
    );
};


export default function InteractiveChat({ scenario, onBack }: InteractiveChatProps): React.ReactElement {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', parts: [{ text: scenario.initialMessage }] }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', parts: [{ text: userInput }] };
        const newMessages = [...messages, newUserMessage];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);

        const history = newMessages.slice(0, -1);
        
        try {
            const responseText = await generateChatResponse(history, userInput, scenario.systemInstruction);
            const modelMessage: ChatMessage = { role: 'model', parts: [{ text: responseText }] };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chat error:", error);
             const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Hi ha hagut un error. Torna a intentar-ho." }] };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg flex flex-col h-[75vh] max-h-[700px]">
            <header className="p-4 border-b">
                 <button onClick={onBack} className="text-brand-primary font-bold mb-2">&larr; Tornar als escenaris</button>
                <h2 className="text-xl font-bold text-brand-dark">{scenario.title}</h2>
                <p className="text-sm text-gray-500">{scenario.description}</p>
            </header>
            
            <main className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <ChatBubble key={index} message={msg} />
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                         <div className="px-4 py-2 rounded-2xl bg-gray-200 text-brand-dark">
                            <span className="animate-pulse">...</span>
                        </div>
                    </div>
                )}
                 <div ref={chatEndRef} />
            </main>

            <footer className="p-4 border-t bg-gray-50">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={e => setUserInput(e.target.value)}
                        placeholder="Escriu la teva resposta..."
                        className="flex-1 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !userInput.trim()} className="bg-brand-primary text-white rounded-full p-3 hover:bg-blue-600 disabled:bg-gray-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </form>
            </footer>
        </div>
    );
}