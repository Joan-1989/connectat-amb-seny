// components/skills/InteractiveChat.tsx

import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, onMessagesSnapshot } from '../../services/firestoreService';
import { generateChatResponse } from '../../services/geminiService';
// 👇 CORRECCIÓ 1: Importem ChatScenario en lloc de Scenario
import type { ChatMessage, ChatScenario } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface InteractiveChatProps {
  scenario: ChatScenario; // <--- Tipus de prop corregit
}

export default function InteractiveChat({ scenario }: InteractiveChatProps) {
  // 👇 CORRECCIÓ 2: Obtenim 'currentUser' i el renombrem a 'user' per a la resta del component
  const { currentUser: user } = useAuth(); 
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatId = `scenario_${scenario.id}_${user?.uid}`;
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = onMessagesSnapshot(chatId, (newMessages) => {
      // Afegim el missatge inicial si el xat està buit
      if (newMessages.length === 0) {
        const initialMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
            role: 'model',
            parts: [{ text: scenario.initialMessage }],
            userId: 'bot',
        };
        sendMessage(chatId, initialMessage);
      }
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, [chatId, user, scenario.initialMessage]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || !user) return;

    // 👇 CORRECCIÓ 3: userMessage ara inclou userId, que ja és vàlid al tipus ChatMessage
    const userMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
      role: 'user',
      parts: [{ text: userInput }],
      userId: user.uid,
    };

    await sendMessage(chatId, userMessage);
    setUserInput('');
    setIsLoading(true);

    try {
      // 👇 CORRECCIÓ 4: Passem el userMessage ja creat (i tipat) per a mantenir la consistència
      const history = [...messages, userMessage]; 
      const botResponseText = await generateChatResponse(history, userInput, scenario.systemInstruction);
      
      const botMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
        role: 'model',
        parts: [{ text: botResponseText }],
        userId: 'bot',
      };
      await sendMessage(chatId, botMessage);
    } catch (error) {
      console.error("Error en la resposta de l'assistent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 rounded-lg shadow-inner">
      <h4 className="text-lg font-semibold mb-2">{scenario.title}</h4>
      <p className="text-sm text-gray-600 mb-4">{scenario.description}</p>
      <div className="flex-grow overflow-y-auto space-y-3 pr-2">
        {messages.map((msg, index) => (
          // 👇 CORRECCIÓ 5: Ara podem comparar msg.userId amb l'uid de l'usuari
          <div
            key={msg.id || index}
            className={`flex ${msg.userId === user?.uid ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                msg.userId === user?.uid
                  ? 'bg-brand-primary text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.parts[0].text}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-grow border rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          placeholder="Escriu la teva resposta..."
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          className="bg-brand-primary text-white font-bold py-2 px-6 rounded-r-full hover:bg-brand-secondary disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}