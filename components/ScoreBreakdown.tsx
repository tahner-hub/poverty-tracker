'use client';

import { WEIGHTS } from '@/lib/scoring';
import type { StateData } from '@/lib/data';
import Tooltip, { TooltipTitle, TooltipBody, TooltipMeta } from './Tooltip';

const CARD = 'rounded-2xl border border-stone-300/70 bg-white/70 backdrop-blur-sm shadow-[0_1px_2px_rgba(60,50,30,0.04),0_12px_32px_-12px_rgba(60,50,30,0.08)]';

interface Props {
  state: StateData;
}

// Definitions sourced from the Predictive Poverty Tracker workbook and documentation.
const ROWS = [
  {
    id:         'H1' as const,
    layer:      'Early Warning',
    label:      'Eviction filing rate',
    name:       'Eviction Filing Rate',
    unit:       '/100 HH',
    signal:     'Leading',
    definition: 'Cases filed in court per 100 renter households. Filing alone — before any judgment — signals that a tenant is at least one to two months behind on rent and is the earliest externally visible sign of household financial stress.',
  },
  {
    id:         'E1' as const,
    layer:      'Early Warning',
    label:      'Disconnection notice rate',
    name:       'Final Disconnection Notice Rate',
    unit:       '%',
    signal:     'Leading',
    definition: 'Percentage of households that have received a final utility shutoff warning. Families at this stage are typically one to two paychecks away from a full housing crisis.',
  },
  {
    id:         'F2' as const,
    layer:      'Community Drain',
    label:      'Payday loan inquiry index',
    name:       'Payday Loan Inquiry Volume',
    unit:       '',
    signal:     'Leading',
    definition: 'Indexed volume of credit inquiries submitted to payday and high-cost short-term lenders. Spikes in this indicator predict formal eviction filings 12 to 24 months later — the longest predictive lead time of any indicator in the index.',
  },
  {
    id:         'F4' as const,
    layer:      'Community Drain',
    label:      'Debt-in-collections rate',
    name:       'Debt-in-Collections Rate',
    unit:       '%',
    signal:     'Concurrent',
    definition: 'Percentage of residents with at least one unpaid bill transferred to a third-party debt collector. Once in collections, credit scores drop and access to mainstream financial products is lost — deepening financial exclusion.',
  },
  {
    id:         'D1' as const,
    layer:      'Mobility Barrier',
    label:      'Broadband non-subscription',
    name:       'Broadband Non-Subscription Rate',
    unit:       '%',
    signal:     'Concurrent',
    definition: 'Percentage of households without fixed high-speed internet service. Without broadband, re-employment timelines lengthen and access to telehealth, remote education, and digital government services is lost.',
  },
  {
    id:         'N2' as const,
    layer:      'Mobility Barrier',
    label:      'Free & reduced lunch rate',
    name:       'Free & Reduced Lunch Rate',
    unit:       '%',
    signal:     'Concurrent',
    definition: 'Percentage of K–12 students certified for the federal Free and Reduced Price Lunch program — a stable annual proxy for child poverty that is less subject to administrative noise than other benefit program data.',
  },
  {
    id:         'L3' as const,
    layer:      'Structural',
    label:      'Wage growth vs. inflation',
    name:       'Wage Growth vs. Inflation Spread',
    unit:       '%',
    signal:     'Leading',
    definition: 'Local median wage growth minus local consumer price inflation. A negative spread means real purchasing power is falling even for fully employed households — a slow-motion poverty tide invisible to standard unemployment figures.',
  },
  {
    id:         'M2' as const,
    layer:      'Structural',
    label:      'Immobility score',
    name:       'Immobility Score',
    unit:       '',
    signal:     'Structural',
    definition: "Derived from Harvard's Opportunity Atlas: the probability that a child born to parents in the bottom income quintile will reach the top quintile as an adult, inverted so that higher scores indicate lower upward mobility.",
  },
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

          const tooltipContent = (
            <>
              <TooltipTitle>{r.id} · {r.name}</TooltipTitle>
              <TooltipBody>{r.definition}</TooltipBody>
              <TooltipMeta>
                {r.signal} · {r.layer} · Weight {(WEIGHTS[r.id] * 100).toFixed(0)}%
              </TooltipMeta>
            </>
          );

          return (
            <div key={r.id} className="py-2.5 border-b border-stone-100 flex items-baseline gap-3">
              {/* Hoverable trigger: id badge + label. Layer/weight line sits below, outside the trigger. */}
              <div className="flex-1 min-w-0">
                <Tooltip content={tooltipContent} side="top" maxWidth={280}>
                  <span className="inline-flex items-baseline gap-2 cursor-help group">
                    <span className="font-mono text-[10px] text-stone-400 w-6 shrink-0 group-hover:text-stone-700 transition-colors">
                      {r.id}
                    </span>
                    <span className="text-[13px] text-stone-800 truncate border-b border-dashed border-transparent group-hover:border-stone-400 transition-colors">
                      {r.label}
                    </span>
                  </span>
                </Tooltip>
                <div className="font-mono text-[10px] text-stone-500 uppercase tracking-wider mt-0.5 pl-8">
                  {r.layer} · weight {(WEIGHTS[r.id] * 100).toFixed(0)}%
                </div>
              </div>

              {/* Current value */}
              <span className="font-mono text-[13px] text-stone-900 tabular-nums w-16 text-right">
                {value.toFixed(1)}
                {r.unit && <span className="text-stone-400 ml-0.5">{r.unit}</span>}
              </span>

              {/* Weighted contribution */}
              <span
                className="font-mono text-[13px] font-semibold tabular-nums w-14 text-right"
                style={{ color: contribution < 0 ? '#4a6d5c' : '#1a1a1a' }}
              >
                {contribution >= 0 ? '+' : ''}{contribution.toFixed(2)}
              </span>
            </div>
          );
        })}

        {/* Totals row */}
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
