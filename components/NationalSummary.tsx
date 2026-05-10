'use client';

import { TIERS } from '@/lib/data';
import { tierFor } from '@/lib/scoring';
import type { StateData } from '@/lib/data';

const CARD = 'rounded-2xl border border-stone-300/70 bg-white/70 backdrop-blur-sm shadow-[0_1px_2px_rgba(60,50,30,0.04),0_12px_32px_-12px_rgba(60,50,30,0.08)]';

interface Props {
  states: StateData[];
}

export default function NationalSummary({ states }: Props) {
  const avg = states.reduce((s, st) => s + st.score, 0) / states.length;
  const tierCounts = TIERS.map((t) => ({
    tier: t,
    count: states.filter((s) => s.tier.name === t.name).length,
  }));
  const highest = [...states].sort((a, b) => b.score - a.score).slice(0, 3);
  const lowest  = [...states].sort((a, b) => a.score - b.score).slice(0, 3);
  const natTier = tierFor(avg);

  return (
    <div className={`${CARD} p-7 mt-6`}>
      <div className="grid grid-cols-4 gap-8">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2">
            National average
          </div>
          <div className="flex items-baseline gap-2">
            <div className="font-display text-5xl font-semibold text-stone-900 tabular-nums leading-none">
              {avg.toFixed(1)}
            </div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: natTier.color }} />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider mt-2" style={{ color: natTier.color }}>
            {natTier.name}
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2">
            States by tier
          </div>
          <div className="space-y-1.5">
            {tierCounts.filter((tc) => tc.count > 0).map((tc) => (
              <div key={tc.tier.name} className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: tc.tier.color }} />
                <span className="font-mono text-[11px] text-stone-700 tabular-nums w-6">{tc.count}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-stone-500">
                  {tc.tier.name.replace(' RISK', '')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2">
            Highest risk
          </div>
          <div className="space-y-1.5">
            {highest.map((s) => (
              <div key={s.code} className="flex items-center gap-2.5 font-mono text-[12px]">
                <span className="tabular-nums text-stone-900 w-10">{s.score.toFixed(1)}</span>
                <span className="text-stone-600">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2">
            Lowest risk
          </div>
          <div className="space-y-1.5">
            {lowest.map((s) => (
              <div key={s.code} className="flex items-center gap-2.5 font-mono text-[12px]">
                <span className="tabular-nums text-stone-900 w-10">{s.score.toFixed(1)}</span>
                <span className="text-stone-600">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
