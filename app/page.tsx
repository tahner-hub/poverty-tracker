'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Info } from 'lucide-react';
import { buildAllStates } from '@/lib/scoring';
import TileMap from '@/components/TileMap';
import NationalSummary from '@/components/NationalSummary';
import StateDetail from '@/components/StateDetail';
import Legend from '@/components/Legend';

const CARD = 'rounded-2xl border border-stone-300/70 bg-white/70 backdrop-blur-sm shadow-[0_1px_2px_rgba(60,50,30,0.04),0_12px_32px_-12px_rgba(60,50,30,0.08)]';

export default function Dashboard() {
  const states = useMemo(buildAllStates, []);
  const [selected, setSelected] = useState('MS');
  const [hover, setHover] = useState<string | null>(null);

  const selectedState = states.find((s) => s.code === selected)!;
  const hoverState = hover ? states.find((s) => s.code === hover) : null;

  return (
    <div
      className="font-body min-h-screen"
      style={{
        backgroundColor: '#faf7f2',
        backgroundImage:
          'radial-gradient(circle at 20% 0%, rgba(200,107,60,0.04) 0%, transparent 45%), radial-gradient(circle at 85% 25%, rgba(74,109,92,0.04) 0%, transparent 45%)',
        color: '#1a1a1a',
      }}
    >
      <div className="max-w-[1320px] mx-auto px-8 pt-10 pb-16">

        {/* Header */}
        <header className="flex items-end justify-between pb-6 border-b-4 border-double border-stone-800">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500 mb-1">
              Phase 1 · Sample data
            </div>
            <h1 className="font-display text-[54px] font-semibold tracking-tight leading-[0.95] text-stone-900">
              The Predictive<br />Poverty Tracker
            </h1>
          </div>
          <div className="flex flex-col items-end gap-3 pb-2">
            <div className="text-right font-display italic text-stone-600 text-[13px] max-w-[36ch] leading-snug">
              A composite index of eight microeconomic stress signals, scored 0–100 across all fifty
              states. Higher scores indicate greater pressure toward entrenched poverty.
            </div>
            <Link
              href="/about"
              className="font-mono text-[11px] uppercase tracking-wider text-stone-500 hover:text-stone-900 border border-stone-300 hover:border-stone-600 rounded-full px-4 py-1.5 transition-colors"
            >
              Methodology →
            </Link>
          </div>
        </header>

        <NationalSummary states={states} />

        {/* Main two-column layout */}
        <div className="grid grid-cols-12 gap-7 pt-7">

          {/* Left: tile map */}
          <div className="col-span-7">
            <div className={`${CARD} p-7`}>
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="font-display text-xl font-semibold text-stone-900">
                  State-level risk map
                </h2>
                <span className="font-mono text-[11px] text-stone-500 tabular-nums">
                  {hoverState
                    ? `${hoverState.name} · ${hoverState.score.toFixed(1)}`
                    : 'Hover or click a state'}
                </span>
              </div>
              <TileMap
                states={states}
                selected={selected}
                onSelect={setSelected}
                hover={hover}
                onHover={setHover}
              />
              <div className="mt-5 pt-5 border-t border-stone-200">
                <Legend />
              </div>
              <div className="mt-5 pt-5 border-t border-stone-200 font-display italic text-[12px] text-stone-600 leading-snug">
                <Info size={12} className="inline mr-1.5 -mt-0.5" />
                Index formula and weights match Section D of the Predictive Poverty Tracker workbook.
                Values here are illustrative; Phase&nbsp;2 connects the eight component indicators to
                live Census, BLS, Eviction&nbsp;Lab, and FCC data feeds.
              </div>
            </div>
          </div>

          {/* Right: state detail */}
          <div className="col-span-5">
            <StateDetail state={selectedState} />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-14 pt-6 border-t border-stone-300 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-stone-500">
          <span>Predictive Poverty Tracker · v1.0</span>
          <span>Index formula: Section D · CRI weighted 8-component composite</span>
        </footer>
      </div>
    </div>
  );
}
