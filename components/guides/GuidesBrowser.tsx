// components/guides/GuidesBrowser.tsx
import React from 'react';
import { GUIDES } from '../../data/guides';
import type { Guide } from '../../types';

function isDirectImage(url?: string): boolean {
  if (!url) return false;
  // Evitem URLs d'Unsplash que són pàgines HTML (no la imatge directa)
  return url.includes('images.unsplash.com') || /\.(png|jpe?g|webp|gif)$/i.test(url);
}

interface GuidesBrowserProps {
  title?: string;
}

export default function GuidesBrowser({ title = 'Guies pràctiques' }: GuidesBrowserProps): React.ReactElement {
  const [selected, setSelected] = React.useState<Guide | null>(null);

  return (
    <section className="rounded-lg bg-white p-4 shadow-md">
      <h3 className="mb-3 text-lg font-semibold text-brand-dark">{title}</h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {GUIDES.map(g => (
          <article key={g.id} className="overflow-hidden rounded-lg border bg-white">
            {/* Hero */}
            {g.hero?.type === 'image' && isDirectImage(g.hero.url) && (
              <img
                src={g.hero.url}
                alt={g.hero.alt || g.title}
                className="h-40 w-full object-cover"
                loading="lazy"
              />
            )}
            {g.hero?.type === 'video' && g.hero.url && (
              <div className="relative h-0 w-full" style={{ paddingTop: '56.25%' }}>
                <iframe
                  title={g.title}
                  src={g.hero.url}
                  className="absolute left-0 top-0 h-full w-full"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Cos */}
            <div className="p-3">
              <h4 className="font-semibold">{g.title}</h4>
              <p className="mt-1 line-clamp-3 text-sm text-gray-700">{g.summary}</p>
              <button
                type="button"
                onClick={() => setSelected(g)}
                className="mt-3 w-full rounded-lg border px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-label={`Obrir guia: ${g.title}`}
              >
                Obrir guia
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Modal de detall */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 id="guide-modal-title" className="text-lg font-bold">{selected.title}</h3>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded bg-gray-100 px-2 py-1 text-sm hover:bg-gray-200"
                aria-label="Tancar"
              >
                ✕
              </button>
            </div>

            {/* Hero dins el modal (opcional) */}
            {selected.hero?.type === 'image' && isDirectImage(selected.hero.url) && (
              <img
                src={selected.hero.url}
                alt={selected.hero.alt || selected.title}
                className="mt-4 w-full rounded-lg object-cover"
                loading="lazy"
              />
            )}
            {selected.hero?.type === 'video' && selected.hero.url && (
              <div className="relative mt-4 w-full overflow-hidden rounded-lg" style={{ paddingTop: '56.25%' }}>
                <iframe
                  title={selected.title}
                  src={selected.hero.url}
                  className="absolute left-0 top-0 h-full w-full"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {/* Seccions */}
            <div className="mt-4 space-y-6">
              {selected.sections?.map((sec, i) => (
                <section key={i} className="rounded-lg border p-4">
                  <h4 className="font-semibold text-brand-dark">{sec.title}</h4>
                  {sec.bullets && (
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-800">
                      {sec.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                    </ul>
                  )}
                  {sec.image?.type === 'image' && isDirectImage(sec.image.url) && (
                    <img
                      src={sec.image.url}
                      alt={sec.image.alt || sec.title}
                      className="mt-3 w-full rounded-md object-cover"
                      loading="lazy"
                    />
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
