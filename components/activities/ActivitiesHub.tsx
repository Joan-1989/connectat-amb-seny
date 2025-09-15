// components/activities/ActivitiesHub.tsx
import React, { useState } from 'react';
import EmotionCards from './EmotionCards';
import RoleplayLab from './RoleplayLab';
import SocialDilemmas from './SocialDilemmas';
import ReflectionJournal from './ReflectionJournal';

type ActivityKey = 'emotion' | 'roleplay' | 'dilemmas' | 'journal' | null;

const CARDS: Array<{
  key: ActivityKey;
  title: string;
  desc: string;
  img: string;
  alt: string;
  cta: string;
}> = [
  {
    key: 'emotion',
    title: 'Cartes d’emocions',
    desc:
      'Arrossega estratègies a cada situació i aprèn a regular el que sents. Guarda les partides i compara’n els resultats.',
    img: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop',
    alt: 'Emocions i targetes',
    cta: 'Comença',
  },
  {
    key: 'roleplay',
    title: 'Roleplay (IA)',
    desc:
      'Conversa de rol amb personatges (pressió de grup, límits, foto incòmoda…). Ramificacions i feedback instantani.',
    img: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=1600&auto=format&fit=crop',
    alt: 'Converses de roleplay',
    cta: 'Practica',
  },
  {
    key: 'dilemmas',
    title: 'Dilemes socials',
    desc:
      'Tria entre opcions en situacions reals i rep una anàlisi (pros/contres, resposta assertiva) feta amb IA.',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop',
    alt: 'Decisions i dilemes',
    cta: 'Explora',
  },
  {
    key: 'journal',
    title: 'Diari reflexiu (IA)',
    desc:
      'Escriu què ha passat i com t’has sentit. L’assistent et torna fortaleses, suggeriments i un petit resum.',
    img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop',
    alt: 'Diari i reflexió',
    cta: 'Escriu',
  },
];

export default function ActivitiesHub(): React.ReactElement {
  const [active, setActive] = useState<ActivityKey>(null);

  if (active) {
    return (
      <div className="rounded-xl bg-white p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-brand-dark">
            {CARDS.find(c => c.key === active)?.title}
          </h3>
          <button
            type="button"
            onClick={() => setActive(null)}
            className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label="Tornar al llistat d’activitats"
          >
            ← Tornar
          </button>
        </div>

        {active === 'emotion' && <EmotionCards />}
        {active === 'roleplay' && <RoleplayLab />}
        {active === 'dilemmas' && <SocialDilemmas />}
        {active === 'journal' && <ReflectionJournal />}
      </div>
    );
  }

  return (
    <section className="rounded-xl bg-white p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-brand-dark">Tria una activitat</h3>
        <span className="text-xs text-gray-500">{CARDS.length} disponibles</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {CARDS.map(card => (
          <article key={card.key} className="rounded-xl border overflow-hidden bg-white">
            <img
              src={card.img}
              alt={card.alt}
              className="h-36 w-full object-cover"
              loading="lazy"
            />
            <div className="p-4">
              <h4 className="font-semibold text-brand-dark">{card.title}</h4>
              <p className="mt-1 text-sm text-gray-700">{card.desc}</p>
              <button
                type="button"
                onClick={() => setActive(card.key)}
                className="mt-3 w-full rounded-lg border px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-label={`${card.cta}: ${card.title}`}
              >
                {card.cta}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
