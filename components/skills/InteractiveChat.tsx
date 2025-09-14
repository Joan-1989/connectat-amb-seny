// components/skills/InteractiveChat.tsx
import React, { useState, useEffect, useRef } from 'react';
import { sendMessage, onMessagesSnapshot } from '../../services/firestoreService';
import { generateChatResponse } from '../../services/geminiService';
import type { ChatMessage, ChatScenario } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { moderateText } from '../../services/moderationService';
import { checkAndConsumeQuota } from '../../services/rateLimitService';

interface InteractiveChatProps {
  scenario: ChatScenario;
  onBack: () => void;
}

export default function InteractiveChat({ scenario, onBack }: InteractiveChatProps): React.ReactElement {
  const { currentUser: user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const chatId = `scenario_${scenario.id}_${user?.uid ?? 'anon'}`;
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

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
    setErrMsg(null);
    if (!userInput.trim() || !user) return;

    const mod = moderateText(userInput);
    if (!mod.allowed) { setErrMsg(mod.message ?? 'Aquest missatge no és adequat.'); return; }

    const quota = await checkAndConsumeQuota(user.uid, 'chat');
    if (!quota.ok) { setErrMsg(quota.reason ?? 'Has superat el límit.'); return; }

    const userMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
      role: 'user',
      parts: [{ text: mod.cleaned }],
      userId: user.uid,
    };

    await sendMessage(chatId, userMessage);
    setUserInput('');
    setIsLoading(true);

    try {
      const filteredHistory = [...messages, userMessage]
        .filter(m => m.role === 'user' || m.role === 'model')
        .map(({ role, parts }) => ({ role, parts }));

      const botResponseText = await generateChatResponse(filteredHistory, mod.cleaned, scenario.systemInstruction);

      const botMessage: Omit<ChatMessage, 'id' | 'timestamp'> = {
        role: 'model',
        parts: [{ text: botResponseText }],
        userId: 'bot',
      };
      await sendMessage(chatId, botMessage);
    } catch {
      setErrMsg('Hi ha hagut un problema generant la resposta.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        Necessites iniciar sessió per fer aquesta activitat.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 rounded-lg shadow-inner">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold">{scenario.title}</h4>
        <button onClick={onBack} className="text-sm px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors" aria-label="Tornar enrere">
          ⬅️ Enrere
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">{scenario.description}</p>

      {errMsg && (
        <div role="alert" className="mb-3 p-2 rounded bg-red-50 border border-red-200 text-sm text-red-700">
          {errMsg}
        </div>
      )}

      <div
        className="flex-grow overflow-y-auto space-y-3 pr-2"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
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
              aria-label={msg.userId === user?.uid ? 'Missatge de l’usuari' : 'Resposta del rol'}
            >
              <p className="text-sm">{msg.parts[0]?.text}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-4 flex">
        <label htmlFor="scenario-input" className="sr-only">Escriu la teva resposta</label>
        <input
          id="scenario-input"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-grow border rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand-primary"
          placeholder="Escriu la teva resposta..."
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          className="bg-brand-primary text-white font-bold py-2 px-6 rounded-r-full hover:bg-brand-secondary disabled:bg-gray-400 transition-colors"
          aria-label="Enviar resposta"
        >
          {isLoading ? '...' : 'Enviar'}
        </button>
      </div>

      <div className="mt-4 flex justify-center">
        <button onClick={onBack} className="text-sm px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition-colors" aria-label="Tornar a escenaris">
          ⬅️ Tornar a escenaris
        </button>
      </div>
    </div>
  );
}
