'use client';

import TrendChart from './TrendChart';
import ScoreBreakdown from './ScoreBreakdown';
import type { StateData } from '@/lib/data';

interface Props {
  state: StateData;
}

export default function StateDetail({ state }: Props) {
  const { tier } = state;

  return (
    <div>
      {/* Colored header card */}
      <div
        className="rounded-2xl p-6 mb-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${tier.color}f0 0%, ${tier.color} 100%)`,
          boxShadow: `0 18px 40px -16px ${tier.color}55`,
        }}
      >
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '16px 16px',
          }}
        />

        <div className="relative">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 mb-2">
            Selected · {state.code}
          </div>
          <h2 className="font-display text-4xl font-medium tracking-tight text-white leading-none mb-5">
            {state.name}
          </h2>
          <div className="flex items-end gap-5">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-white/70">
                Composite Risk Index
              </div>
              <div className="font-display text-[64px] font-semibold tracking-tight text-white leading-none tabular-nums mt-1">
                {state.score.toFixed(1)}
              </div>
            </div>
            <div className="pb-2">
              <div className="inline-block px-2.5 py-1 rounded-md font-mono text-[10px] uppercase tracking-wider text-stone-900 bg-white/95">
                {tier.name}
              </div>
              <div className="text-[12px] italic text-white/90 font-display mt-1.5 max-w-[26ch] leading-snug">
                {tier.label}
              </div>
            </div>
          </div>
          <div className="flex gap-5 mt-5 pt-4 border-t border-white/20 font-mono text-[11px] text-white/80">
            <div>
              <span className="text-white/60">Poverty rate</span>
              <span className="text-white tabular-nums ml-1.5">
                {state.indicators.povertyRate.toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-white/60">Source</span>
              <span className="text-white ml-1.5">ACS 2023</span>
            </div>
          </div>
        </div>
      </div>

      <TrendChart state={state} />
      <ScoreBreakdown state={state} />
    </div>
  );
}
