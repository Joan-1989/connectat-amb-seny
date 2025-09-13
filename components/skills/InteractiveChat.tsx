import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, onMessagesSnapshot } from '../../services/firestoreService';
import { generateChatResponse } from '../../services/geminiService';
import type { ChatMessage, ChatScenario } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface InteractiveChatProps {
  scenario: ChatScenario;
  onBack: () => void; // Callback per tornar enrere
}

export default function InteractiveChat({ scenario, onBack }: InteractiveChatProps) {
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

    const userMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
      role: 'user',
      parts: [{ text: userInput }],
      userId: user.uid,
    };

    await sendMessage(chatId, userMessage);
    setUserInput('');
    setIsLoading(true);

    try {
      const filteredHistory = [...messages, userMessage];
      while (filteredHistory.length && filteredHistory[0].role !== 'user') {
        filteredHistory.shift();
      }

      const botResponseText = await generateChatResponse(
        filteredHistory,
        userInput,
        scenario.systemInstruction
      );

      const botMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
        role: 'model',
        parts: [{ text: botResponseText }],
        userId: 'bot',
      };
      await sendMessage(chatId, botMessage);
    } catch (error) {
      console.error('Error en la resposta de l’assistent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 rounded-lg shadow-inner">
      {/* 🔹 Header amb botó enrere */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">{scenario.title}</h4>
        <button
          onClick={onBack}
          className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          ⬅️ Enrere
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">{scenario.description}</p>

      {/* Missatges */}
      <div className="flex-grow overflow-y-auto space-y-3 pr-2">
        {messages.map((msg, index) => (
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

      {/* Input */}
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

      {/* 🔹 Botó enrere fixat al peu */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={onBack}
          className="text-sm px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          ⬅️ Tornar a escenaris
        </button>
      </div>
    </div>
  );
}
