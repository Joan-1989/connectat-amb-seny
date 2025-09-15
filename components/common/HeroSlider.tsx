// components/common/HeroSlider.tsx
import React, { useEffect, useState } from 'react';

export type Slide = {
  title: string;
  subtitle?: string;
  imageUrl: string;
  ctaLabel?: string;
  onCta?: () => void;
};

interface HeroSliderProps {
  slides: Slide[];
  autoMs?: number;
}

export default function HeroSlider({ slides, autoMs = 6500 }: HeroSliderProps): React.ReactElement {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI(prev => (prev + 1) % slides.length), autoMs);
    return () => clearInterval(t);
  }, [slides.length, autoMs]);

  const current = slides[i];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gray-900 text-white shadow-lg">
      {/* imatge */}
      <img
        src={current.imageUrl}
        alt=""
        className="h-56 w-full object-cover opacity-70 md:h-72"
      />

      {/* gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

      {/* text */}
      <div className="absolute inset-0 flex items-end p-5">
        <div>
          <h2 className="text-xl font-extrabold md:text-2xl">{current.title}</h2>
          {current.subtitle && (
            <p className="mt-1 max-w-2xl text-sm text-gray-200">{current.subtitle}</p>
          )}
          {current.onCta && current.ctaLabel && (
            <button
              type="button"
              onClick={current.onCta}
              className="mt-3 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-white"
            >
              {current.ctaLabel}
            </button>
          )}
        </div>
      </div>

      {/* dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Anar a la diapositiva ${idx + 1}`}
            className={`h-2 w-2 rounded-full ${idx === i ? 'bg-white' : 'bg-white/50'}`}
            onClick={() => setI(idx)}
          />
        ))}
      </div>
    </section>
  );
}
