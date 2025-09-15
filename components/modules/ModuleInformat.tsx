// components/modules/ModuleInformat.tsx
import React, { useMemo, useState } from 'react';
// Contingut 100% de codi
import { GUIDES } from '../../data/guides';
import { SEED_ARTICLES, SEED_MYTHS } from '../../data/seedContent';

import MythBadge from '../common/MythBadge';
import HeroSlider from '../common/HeroSlider';

export default function ModuleInformat(): React.ReactElement {
  // Seleccions per a modals
  const [selectedGuide, setSelectedGuide] = useState<(typeof GUIDES)[number] | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<(typeof SEED_ARTICLES)[number] | null>(null);
  const [selectedMyth, setSelectedMyth] = useState<(typeof SEED_MYTHS)[number] | null>(null);

  // Slider hero (3 diapositives destacades)
  const slides = useMemo(
    () => [
      {
        title: 'Senyals d’alerta: què observar',
        subtitle: 'Checklist per detectar problemes amb pantalles, joc, compres o xarxes.',
        imageUrl: GUIDES.find(g => g.id === 'senyals-alerta')?.hero.url
          ?? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1600&auto=format&fit=crop',
        ctaLabel: 'Obrir guia',
        onCta: () => setSelectedGuide(GUIDES.find(g => g.id === 'senyals-alerta') ?? null),
      },
      {
        title: 'Eines ràpides d’autoregulació',
        subtitle: 'Respiració 4–6, STOP, “si… aleshores…”, micro-hàbits.',
        imageUrl: GUIDES.find(g => g.id === 'autoregulacio-eines')?.hero.url
          ?? 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1600&auto=format&fit=crop',
        ctaLabel: 'Aprèn-les',
        onCta: () => setSelectedGuide(GUIDES.find(g => g.id === 'autoregulacio-eines') ?? null),
      },
      {
        title: 'Parlar-ne a casa (sense baralles)',
        subtitle: 'Com obrir conversa, validar emocions i pactar límits realistes.',
        imageUrl: GUIDES.find(g => g.id === 'parlar-a-casa')?.hero.url
          ?? 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop',
        ctaLabel: 'Veure guia',
        onCta: () => setSelectedGuide(GUIDES.find(g => g.id === 'parlar-a-casa') ?? null),
      },
    ],
    []
  );

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-brand-dark">Informa&apos;t</h2>

      {/* HERO */}
      <HeroSlider slides={slides} />

      {/* GUIES */}
      <section className="rounded-lg bg-white p-4 shadow-md">
        <h3 className="mb-2 text-lg font-semibold text-brand-dark">Guies pràctiques</h3>
        <p className="mb-4 text-sm text-gray-600">
          Materials curts, visuals i accionables per entendre i prevenir problemes.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {GUIDES.map(g => (
            <article key={g.id} className="overflow-hidden rounded-lg border bg-white">
              {g.hero?.type === 'image' && (
                <img
                  src={g.hero.url}
                  alt={g.hero.alt ?? ''}
                  className="h-36 w-full object-cover"
                />
              )}
              <div className="p-3">
                <h4 className="font-semibold">{g.title}</h4>
                <p className="mt-1 line-clamp-3 text-sm text-gray-700">{g.summary}</p>
                <button
                  type="button"
                  onClick={() => setSelectedGuide(g)}
                  className="mt-3 w-full rounded-lg border px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  aria-label={`Obrir guia: ${g.title}`}
                >
                  Obrir guia
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ARTICLES */}
      <section className="rounded-lg bg-white p-4 shadow-md">
        <h3 className="mb-2 text-lg font-semibold text-brand-dark">Articles</h3>
        <p className="mb-4 text-sm text-gray-600">Idees clau, neuroeducació i plans pràctics.</p>
        <div className="grid gap-3 md:grid-cols-2">
          {SEED_ARTICLES.map(a => (
            <article key={a.id} className="overflow-hidden rounded-lg border">
              {a.mediaType === 'image' && a.mediaUrl && (
                <img src={a.mediaUrl} alt="" className="h-40 w-full object-cover" />
              )}
              <div className="p-3">
                <h4 className="font-semibold">{a.title}</h4>
                <p className="mt-1 line-clamp-3 text-sm text-gray-700">{a.summary}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>{a.category}</span>
                  {a.mediaType === 'video' && <span>🎬 Vídeo</span>}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedArticle(a)}
                  className="mt-3 w-full rounded-lg border px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  aria-label={`Llegir article: ${a.title}`}
                >
                  Llegir
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* MITES I REALITATS */}
      <section className="rounded-lg bg-white p-4 shadow-md">
        <h3 className="mb-2 text-lg font-semibold text-brand-dark">Mites i Realitats</h3>
        <div className="space-y-2">
          {SEED_MYTHS.map(m => (
            <div key={m.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">{m.title}</div>
                <MythBadge isMyth={m.isMyth} />
              </div>
              <button
                type="button"
                onClick={() => setSelectedMyth(m)}
                className="mt-2 w-full rounded-lg border px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-label={`Obrir mite: ${m.title}`}
              >
                Veure detall
              </button>
            </div>
          ))}
          {SEED_MYTHS.length === 0 && (
            <p className="text-sm text-gray-500">Encara no hi ha mites.</p>
          )}
        </div>
      </section>

      {/* ===== Modals ===== */}

      {/* Guia */}
      {selectedGuide && (
        <div role="dialog" aria-modal="true" aria-labelledby="guide-title"
             className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
            {selectedGuide.hero?.type === 'image' && (
              <img
                src={selectedGuide.hero.url}
                alt={selectedGuide.hero.alt ?? ''}
                className="h-48 w-full rounded-t-xl object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 id="guide-title" className="text-lg font-bold">
                  {selectedGuide.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedGuide(null)}
                  className="rounded bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200"
                  aria-label="Tancar"
                >
                  ✕
                </button>
              </div>
              {selectedGuide.sections?.map((sec, idx) => (
                <section key={idx} className="mt-3">
                  {sec.title && <h4 className="font-semibold">{sec.title}</h4>}
                  {sec.bullets && (
                    <ul className="mt-1 list-disc pl-5 text-sm text-gray-800">
                      {sec.bullets.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  )}
                  {sec.image?.type === 'image' && sec.image.url && (
                    <img
                      src={sec.image.url}
                      alt={sec.image.alt ?? ''}
                      className="mt-2 rounded-lg border"
                    />
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Article */}
      {selectedArticle && (
        <div role="dialog" aria-modal="true" aria-labelledby="article-title"
             className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 id="article-title" className="text-lg font-bold">
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

            {selectedArticle.mediaType === 'video' && selectedArticle.mediaUrl ? (
              <div className="mt-3 aspect-video w-full overflow-hidden rounded-lg border">
                <iframe
                  title={selectedArticle.title}
                  src={selectedArticle.mediaUrl}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              selectedArticle.mediaType === 'image' &&
              selectedArticle.mediaUrl && (
                <img
                  src={selectedArticle.mediaUrl}
                  alt=""
                  className="mt-3 max-h-64 w-full rounded-lg object-cover"
                />
              )
            )}

            <div className="mt-3 whitespace-pre-wrap text-sm text-gray-800">
              {selectedArticle.content ?? selectedArticle.summary}
            </div>
          </div>
        </div>
      )}

      {/* Mite */}
      {selectedMyth && (
        <div role="dialog" aria-modal="true" aria-labelledby="myth-title"
             className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 id="myth-title" className="text-lg font-bold">
                {selectedMyth.title}
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
              <p><strong>Afirmació:</strong> {selectedMyth.myth}</p>
              <p className="rounded-md bg-emerald-50 p-2"><strong>Realitat:</strong> {selectedMyth.reality}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
