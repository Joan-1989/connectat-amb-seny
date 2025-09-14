// components/skills/GeminiAssistant.tsx
import React, { useState, useEffect, useRef } from 'react';
import { generateChatResponse } from '../../services/geminiService';
import type { ChatMessage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { moderateText } from '../../services/moderationService';
import { checkAndConsumeQuota } from '../../services/rateLimitService';

export default function GeminiAssistant(): React.ReactElement {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);

  const handleSendMessage = async () => {
    setErrMsg(null);
    if (!userInput.trim()) return;

    const mod = moderateText(userInput);
    if (!mod.allowed) { setErrMsg(mod.message ?? 'Aquest missatge no es pot enviar.'); return; }

    if (currentUser?.uid) {
      const quota = await checkAndConsumeQuota(currentUser.uid, 'chat');
      if (!quota.ok) { setErrMsg(quota.reason ?? 'Has superat el límit.'); return; }
    }

    const newMessages: ChatMessage[] = [...history, { role: 'user', parts: [{ text: mod.cleaned }] }];
    setHistory(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const systemInstruction =
        "Ets un assistent amigable i empàtic per a joves. Parla sempre en català amb to proper i segur.";

      const cleanedHistory = newMessages.map(({ role, parts }) => ({ role, parts }));
      const responseText = await generateChatResponse(cleanedHistory, mod.cleaned, systemInstruction);
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: responseText }] }]);
    } catch {
      setHistory(prev => [...prev, { role: 'model', parts: [{ text: "Ups! He tingut un problema. Intenta-ho de nou." }] }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-1 text-center text-gray-700">Parla amb el teu Assistent</h3>
      <p className="text-center text-gray-500 mb-3 text-sm">Les noves respostes s’anuncien al lector de pantalla.</p>

      {errMsg && (
        <div role="alert" className="mb-3 p-2 rounded bg-red-50 border border-red-200 text-sm text-red-700">
          {errMsg}
        </div>
      )}

      <div
        className="flex-grow overflow-y-auto space-y-3 pr-2 mb-4"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
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
              aria-label={msg.role === 'user' ? 'Missatge de l’usuari' : 'Resposta de l’assistent'}
            >
              <p className="text-sm">{msg.parts[0]?.text}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex">
        <label htmlFor="assistant-input" className="sr-only">Escriu un missatge</label>
        <input
          id="assistant-input"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-grow border rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Com et sents avui?"
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          disabled={isLoading}
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          className="bg-blue-500 text-white font-bold py-2 px-6 rounded-r-full hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          aria-label="Enviar missatge"
        >
          {isLoading ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}
