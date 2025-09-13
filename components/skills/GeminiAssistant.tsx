// components/skills/GeminiAssistant.tsx

import React, { useState, useEffect, useRef } from 'react';
import { generateChatResponse } from '../../services/geminiService';
import type { ChatMessage } from '../../types';

export default function GeminiAssistant() {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Efecte per a desplaçar-se cap avall quan arriben missatges nous
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages: ChatMessage[] = [...history, { role: 'user', parts: [{ text: userInput }] }];
    setHistory(newMessages);
    const currentUserInput = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      const systemInstruction = "Ets un assistent amigable i empàtic per a joves. El teu objectiu és ajudar-los a gestionar les seves emocions i a entendre millor els seus sentiments. Escolta'ls activament, ofereix suport i proporciona consells pràctics i positius. Parla sempre en català.";
      const responseText = await generateChatResponse(newMessages, currentUserInput, systemInstruction);
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: responseText }] }]);
    } catch (error) {
      console.error("Error a l'assistent de Gemini:", error);
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: "Ups! He tingut un problema. Intenta-ho de nou." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 text-center text-gray-700">Parla amb el teu Assistent</h3>
      <div className="flex-grow overflow-y-auto space-y-3 pr-2 mb-4">
        {history.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.parts[0].text}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-grow border rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Com et sents avui?"
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          className="bg-blue-500 text-white font-bold py-2 px-6 rounded-r-full hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}