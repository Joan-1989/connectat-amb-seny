// components/common/MythBadge.tsx
import React from 'react';

export default function MythBadge({ isMyth }: { isMyth: boolean }): React.ReactElement {
  return isMyth ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 text-xs">
      ❗ Mite
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-xs">
      ✔️ Realitat
    </span>
  );
}
