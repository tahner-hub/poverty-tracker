'use client';

import { TIERS } from '@/lib/data';

export default function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-mono tracking-wide uppercase text-stone-600">
      {TIERS.map((t, i) => {
        const lo = i === 0 ? 0 : TIERS[i - 1].max + 1;
        return (
          <div key={t.name} className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: t.color }} />
            <span>{t.name}</span>
            <span className="text-stone-400 tabular-nums">{lo}–{t.max}</span>
          </div>
        );
      })}
    </div>
  );
}
