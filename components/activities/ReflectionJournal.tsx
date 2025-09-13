import React, { useState } from 'react';
import type { JournalFeedback } from '../../types';
import { analyzeJournalEntry } from '../../services/geminiService';

export default function ReflectionJournal(): React.ReactElement {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [fb, setFb] = useState<JournalFeedback | null>(null);
  const [videoUrl, setVideoUrl] = useState('');

  function renderYouTube(url: string) {
    if (!url) return null;
    // Accepta links de YouTube curts o llargs
    const match = url.match(/(?:v=|\.be\/)([a-zA-Z0-9_-]{6,})/);
    if (!match) return <div className="text-xs text-red-600">Enllaç de YouTube no reconegut.</div>;
    const id = match[1];
    return (
      <div className="mt-3 aspect-video">
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${id}`}
          title="Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
          allowFullScreen
        />
      </div>
    );
  }

  async function onAnalyze() {
    if (!text.trim()) return;
    setLoading(true);
    setFb(null);
    try {
      const res = await analyzeJournalEntry(text);
      setFb(res);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h2 className="text-xl font-bold text-brand-dark mb-1">Diari de Reflexió</h2>
      <p className="text-gray-600 mb-4">Escriu com et sents; rebràs feedback empàtic i idees pràctiques.</p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        className="w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-brand-primary"
        placeholder="Avui m’he sentit..."
      />
      <div className="mt-2 flex gap-2">
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="flex-1 p-2 rounded border"
          placeholder="(Opcional) Enllaç de vídeo de YouTube relacionat amb com et sents"
        />
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="px-4 py-2 rounded bg-brand-primary text-white font-semibold hover:bg-brand-secondary disabled:bg-gray-400"
        >
          {loading ? 'Analitzant...' : 'Analitza el meu text'}
        </button>
      </div>

      {renderYouTube(videoUrl)}

      {fb && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded border bg-green-50">
            <h4 className="font-semibold mb-2">Fortaleses/validacions</h4>
            <ul className="list-disc ml-5 text-sm space-y-1">
              {fb.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="p-3 rounded border bg-yellow-50">
            <h4 className="font-semibold mb-2">Suggeriments</h4>
            <ul className="list-disc ml-5 text-sm space-y-1">
              {fb.suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="p-3 rounded border bg-blue-50">
            <h4 className="font-semibold mb-2">Resum</h4>
            <p className="text-sm">{fb.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
