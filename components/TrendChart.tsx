'use client';

import { useState, useMemo } from 'react';
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceArea, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { buildTimeSeries, type DataPoint } from '@/lib/timeseries';
import type { StateData } from '@/lib/data';

const CARD = 'rounded-2xl border border-stone-300/70 bg-white/70 backdrop-blur-sm shadow-[0_1px_2px_rgba(60,50,30,0.04),0_12px_32px_-12px_rgba(60,50,30,0.08)]';

const HORIZONS = [
  { label: 'History',  quarters: 0,  sublabel: 'only' },
  { label: '3-year',   quarters: 12, sublabel: 'forecast' },
  { label: '5-year',   quarters: 20, sublabel: 'forecast' },
  { label: '10-year',  quarters: 40, sublabel: 'forecast' },
];

interface Props {
  state: StateData;
}

interface TooltipPayloadEntry {
  dataKey: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: number;
  series: DataPoint[];
}

function CustomTooltip({ active, payload, label, series }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const qLabel = series.find((p) => p.idx === label)?.q ?? '';
  const names: Record<string, string> = {
    actual: 'Historical',
    forecast: 'Forecast',
    upper: '95% upper',
    lower: '95% lower',
  };
  return (
    <div style={{ backgroundColor: '#faf7f2', border: '1px solid #1a1a1a', borderRadius: 8, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, padding: '8px 12px' }}>
      <div style={{ marginBottom: 4, fontWeight: 600 }}>{qLabel}</div>
      {payload.map((entry) =>
        entry.value != null ? (
          <div key={entry.dataKey}>
            {names[entry.dataKey] ?? entry.dataKey}: {entry.value.toFixed(1)}
          </div>
        ) : null
      )}
    </div>
  );
}

export default function TrendChart({ state }: Props) {
  const [horizonIdx, setHorizonIdx] = useState(1);
  const horizon = HORIZONS[horizonIdx];

  const { series, slope, forecastValue, forecastBand, totalPast } = useMemo(
    () => buildTimeSeries(state.code, state.score, horizon.quarters),
    [state.code, state.score, horizon.quarters]
  );

  const direction = slope > 0.15 ? 'rising' : slope < -0.15 ? 'improving' : 'flat';
  const dirIcon =
    direction === 'rising' ? <TrendingUp size={14} /> :
    direction === 'improving' ? <TrendingDown size={14} /> :
    <Minus size={14} />;
  const dirColor = direction === 'rising' ? '#8b2e2a' : direction === 'improving' ? '#4a6d5c' : '#5c5c5c';

  const tickIdx = series.filter((p) => p.q.endsWith('Q1')).map((p) => p.idx);
  const tickStep = series.length > 60 ? 2 : 1;
  const displayTicks = tickIdx.filter((_, i) => i % tickStep === 0);
  const forecastStartX = totalPast - 1;
  const lastIdx = series[series.length - 1]?.idx ?? forecastStartX;

  return (
    <div className={`${CARD} p-6`}>
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-display text-lg font-semibold text-stone-900">Risk trajectory</h3>
        <span
          className="font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5"
          style={{ color: dirColor }}
        >
          {dirIcon}
          <span>
            {direction === 'rising' ? 'deteriorating' : direction === 'improving' ? 'improving' : 'flat'}
          </span>
        </span>
      </div>

      <div className="flex gap-1.5 mb-4">
        {HORIZONS.map((h, i) => (
          <button
            key={h.label}
            onClick={() => setHorizonIdx(i)}
            className={`px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all ${
              i === horizonIdx
                ? 'bg-stone-900 text-stone-50 border border-stone-900'
                : 'bg-stone-50 text-stone-600 border border-stone-200 hover:border-stone-400 hover:text-stone-900'
            }`}
          >
            {h.label}
            <span className="ml-1.5 opacity-60">{h.sublabel}</span>
          </button>
        ))}
      </div>

      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={series} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#ebe5d5" strokeDasharray="2 3" vertical={false} />
            <XAxis
              dataKey="idx"
              ticks={displayTicks}
              tickFormatter={(i) => series.find((p) => p.idx === i)?.q?.slice(0, 4) ?? ''}
              stroke="#8a8275"
              tick={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fill: '#5c5c5c' }}
              tickLine={false}
              axisLine={{ stroke: '#d4cfc4' }}
            />
            <YAxis
              domain={[0, 100]}
              stroke="#8a8275"
              tick={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fill: '#5c5c5c' }}
              tickLine={false}
              axisLine={false}
              width={38}
            />
            {horizon.quarters > 0 && (
              <ReferenceArea x1={forecastStartX} x2={lastIdx} fill="#1a1a1a" fillOpacity={0.03} />
            )}
            <ReferenceLine y={20} stroke="#d4cfc4" strokeDasharray="2 2" />
            <ReferenceLine y={40} stroke="#d4cfc4" strokeDasharray="2 2" />
            <ReferenceLine y={60} stroke="#d4cfc4" strokeDasharray="2 2" />
            <ReferenceLine y={80} stroke="#d4cfc4" strokeDasharray="2 2" />
            <Tooltip content={<CustomTooltip series={series} />} />
            <Area type="monotone" dataKey="upper" stroke="none" fill="#c86b3c" fillOpacity={0.08} connectNulls={false} isAnimationActive={false} />
            <Area type="monotone" dataKey="lower" stroke="none" fill="#faf7f2" fillOpacity={1}    connectNulls={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="actual"   stroke="#1a1a1a" strokeWidth={1.8} dot={false} connectNulls={false} isAnimationActive={false} />
            {horizon.quarters > 0 && (
              <Line type="monotone" dataKey="forecast" stroke="#c86b3c" strokeWidth={1.8} strokeDasharray="4 3" dot={false} connectNulls={false} isAnimationActive={false} />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-baseline gap-6 mt-3 pt-3 border-t border-stone-200">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500">Current</div>
          <div className="font-mono text-lg text-stone-900 tabular-nums">{state.score.toFixed(1)}</div>
        </div>
        {forecastValue !== null && (
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500">
              {horizon.label} projection
            </div>
            <div className="font-mono text-lg tabular-nums" style={{ color: '#c86b3c' }}>
              {forecastValue.toFixed(1)}
              {forecastBand && (
                <span className="text-stone-400 text-xs ml-1.5">
                  [{forecastBand[0].toFixed(1)}–{forecastBand[1].toFixed(1)}]
                </span>
              )}
            </div>
          </div>
        )}
        <div className="flex-1 text-[11px] text-stone-600 italic font-display leading-snug">
          {horizon.quarters === 0
            ? 'Twelve years of quarterly observations. The 2020–21 bump reflects COVID-19 shocks across most states.'
            : 'Forecast is a linear extrapolation of recent trend; the shaded band is a 95% confidence interval that widens with the horizon. A statistical model (SARIMA or Bayesian) will replace this in production.'}
        </div>
      </div>
    </div>
  );
}
