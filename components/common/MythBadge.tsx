import React from 'react';

export default function MythBadge({ isMyth }: { isMyth?: boolean }): React.ReactElement {
  const label = isMyth ? 'Mite' : 'Realitat';
  const cls = isMyth
    ? 'bg-rose-100 text-rose-700 ring-1 ring-rose-200'
    : 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200';

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>
      {label}
    </span>
  );
}
