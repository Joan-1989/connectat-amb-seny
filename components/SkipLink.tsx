// components/SkipLink.tsx
import React from 'react';

export default function SkipLink(): React.ReactElement {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-black text-white px-4 py-2 rounded z-50"
    >
      Saltar al contingut principal
    </a>
  );
}
