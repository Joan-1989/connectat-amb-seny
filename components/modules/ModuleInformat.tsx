// components/modules/ModuleInformat.tsx
import React, { useEffect, useState } from 'react';
import type { Article, Myth } from '../../types';
import { getArticles, getMyths } from '../../services/firestoreService';
import MythBadge from '../common/MythBadge';

export default function ModuleInformat(): React.ReactElement {
  const [articles, setArticles] = useState<Article[]>([]);
  const [myths, setMyths] = useState<Myth[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedMyth, setSelectedMyth] = useState<Myth | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [a, m] = await Promise.all([getArticles(), getMyths()]);
        setArticles(a);
        setMyths(m);
      } catch (e) {
        console.error('Error carregant dades:', e);
      }
    })();
  }, []);

  // Helpers de presentació per al modal de mites
  const mythLabels = (m: Myth) => {
    if (m.isMyth === false) {
      return {
        line1Label: 'Afirmació:',
        line2Label: 'Explicació:',
      };
    }
    // Per defecte considerem que és mite
    return {
      line1Label: 'Afirmació incorrecta:',
      line2Label: 'Realitat:',
    };
  };

  return (
    <div className="animate-fade-in">
      <h2 className="mb-6 text-2xl font-bold text-brand-dark">Informa&apos;t</h2>

      {/* ARTICLES */}
      <section className="mb-6 rounded-lg bg-white p-4 shadow-md">
        <h3 className="mb-3 text-lg font-semibold text-brand-dark">Articles</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {articles.map((a) => (
            <article key={a.id} className="rounded-lg border p-3">
              {a.mediaUrl && (
                <div className="mb-2 overflow-hidden rounded-md">
                  {/* imatge opcional si ve de Firestore */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.mediaUrl}
                    alt={a.title}
                    className="h-40 w-full object-cover"
                  />
                </div>
              )}
              <h4 className="font-semibold text-gray-900">{a.title}</h4>
              {a.category && (
                <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 ring-1 ring-blue-200">
                  {a.category}
                </span>
              )}
              <p className="mt-2 line-clamp-3 text-sm text-gray-700">
                {a.summary || (a.content ? String(a.content).slice(0, 140) + '…' : '')}
              </p>

              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(a)}
                  className="w-full rounded-lg border px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  aria-label={`Llegir article: ${a.title}`}
                >
                  Llegir article
                </button>
              </div>
            </article>
          ))}
          {articles.length === 0 && (
            <p className="text-sm text-gray-500">Encara no hi ha articles.</p>
          )}
        </div>
      </section>

      {/* MITES I REALITATS */}
      <section className="rounded-lg bg-white p-4 shadow-md">
        <h3 className="mb-3 text-lg font-semibold text-brand-dark">Mites i Realitats</h3>
        <div className="space-y-2">
          {myths.map((m) => (
            <div key={m.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium text-gray-900">{m.title}</div>
                <MythBadge isMyth={m.isMyth} />
              </div>
              <button
                type="button"
                onClick={() => setSelectedMyth(m)}
                className="mt-2 w-full rounded-lg border px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-label={`Obrir detall: ${m.title}`}
              >
                Veure detall
              </button>
            </div>
          ))}
          {myths.length === 0 && (
            <p className="text-sm text-gray-500">Encara no hi ha mites.</p>
          )}
        </div>
      </section>

      {/* ARTICLE MODAL */}
      {selectedArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 id="article-modal-title" className="text-lg font-bold">
                {selectedArticle.title}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="rounded bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200"
                aria-label="Tancar"
              >
                ✕
              </button>
            </div>

            {selectedArticle.mediaUrl && (
              <div className="mt-3 overflow-hidden rounded-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedArticle.mediaUrl}
                  alt={selectedArticle.title}
                  className="max-h-72 w-full object-cover"
                />
              </div>
            )}

            <div className="mt-3 whitespace-pre-wrap text-sm text-gray-800">
              {selectedArticle.content ?? selectedArticle.summary ?? '—'}
            </div>
          </div>
        </div>
      )}

      {/* MYTH MODAL */}
      {selectedMyth && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="myth-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedMyth(null)}
        >
          <div
            className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 id="myth-modal-title" className="flex items-center gap-2 text-lg font-bold">
                {selectedMyth.title}
                <MythBadge isMyth={selectedMyth.isMyth} />
              </h3>
              <button
                type="button"
                onClick={() => setSelectedMyth(null)}
                className="rounded bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200"
                aria-label="Tancar"
              >
                ✕
              </button>
            </div>

            <div className="mt-3 space-y-2 text-sm">
              <p>
                <strong>{mythLabels(selectedMyth).line1Label}</strong>{' '}
                {selectedMyth.myth}
              </p>
              <p>
                <strong>{mythLabels(selectedMyth).line2Label}</strong>{' '}
                {selectedMyth.reality}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
