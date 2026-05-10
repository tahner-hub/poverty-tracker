'use client';

import { WEIGHTS } from '@/lib/scoring';
import type { StateData } from '@/lib/data';

const CARD = 'rounded-2xl border border-stone-300/70 bg-white/70 backdrop-blur-sm shadow-[0_1px_2px_rgba(60,50,30,0.04),0_12px_32px_-12px_rgba(60,50,30,0.08)]';

interface Props {
  state: StateData;
}

const ROWS = [
  { id: 'H1' as const, layer: 'Early Warning',    label: 'Eviction filing rate',       unit: '/100 HH' },
  { id: 'E1' as const, layer: 'Early Warning',    label: 'Disconnection notice rate',  unit: '%'       },
  { id: 'F2' as const, layer: 'Community Drain',  label: 'Payday loan inquiry index',  unit: ''        },
  { id: 'F4' as const, layer: 'Community Drain',  label: 'Debt-in-collections rate',   unit: '%'       },
  { id: 'D1' as const, layer: 'Mobility Barrier', label: 'Broadband non-subscription', unit: '%'       },
  { id: 'N2' as const, layer: 'Mobility Barrier', label: 'Free & reduced lunch rate',  unit: '%'       },
  { id: 'L3' as const, layer: 'Structural',       label: 'Wage growth vs. inflation',  unit: '%'       },
  { id: 'M2' as const, layer: 'Structural',       label: 'Immobility score',           unit: ''        },
] as const;

export default function ScoreBreakdown({ state }: Props) {
  const total = ROWS.reduce((s, r) => s + state.indicators[r.id] * WEIGHTS[r.id], 0);

  return (
    <div className={`${CARD} p-6 mt-5`}>
      <h3 className="font-display text-lg font-semibold text-stone-900 mb-3">Score composition</h3>
      <div className="border-t border-stone-200">
        {ROWS.map((r) => {
          const value = state.indicators[r.id];
          const contribution = value * WEIGHTS[r.id];
          return (
            <div key={r.id} className="py-2.5 border-b border-stone-100 flex items-baseline gap-3">
              <span className="font-mono text-[10px] text-stone-500 w-6">{r.id}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-stone-800 truncate">{r.label}</div>
                <div className="font-mono text-[10px] text-stone-500 uppercase tracking-wider mt-0.5">
                  {r.layer} · weight {(WEIGHTS[r.id] * 100).toFixed(0)}%
                </div>
              </div>
              <span className="font-mono text-[13px] text-stone-900 tabular-nums w-16 text-right">
                {value.toFixed(1)}
                {r.unit && <span className="text-stone-400 ml-0.5">{r.unit}</span>}
              </span>
              <span
                className="font-mono text-[13px] font-semibold tabular-nums w-14 text-right"
                style={{ color: contribution < 0 ? '#4a6d5c' : '#1a1a1a' }}
              >
                {contribution >= 0 ? '+' : ''}{contribution.toFixed(2)}
              </span>
            </div>
          );
        })}
        <div className="py-3 flex items-baseline gap-3 border-t-2 border-stone-800 mt-1">
          <span className="flex-1 font-display italic text-stone-700">Composite Risk Index</span>
          <span className="font-mono text-xl font-semibold text-stone-900 tabular-nums">
            {total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
