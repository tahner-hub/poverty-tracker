import React, { useState, useMemo, useEffect } from 'react';
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceArea, ReferenceLine, ResponsiveContainer
} from 'recharts';
import { TrendingUp, TrendingDown, Info, Minus } from 'lucide-react';

// ============================================================================
// FONTS
// ============================================================================
const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Instrument+Sans:ital,wght@0,400..700;1,400..700&family=JetBrains+Mono:wght@400;500;600&display=swap');
* { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
.font-display { font-family: 'Fraunces', Georgia, serif; font-optical-sizing: auto; font-variation-settings: "SOFT" 50, "WONK" 0; }
.font-body { font-family: 'Instrument Sans', system-ui, sans-serif; }
.font-mono  { font-family: 'JetBrains Mono', ui-monospace, monospace; font-feature-settings: "tnum", "ss01"; }
`;

// ============================================================================
// DATA
// ============================================================================
const POVERTY_RATES = {
  AL: 15.9, AK: 10.8, AZ: 12.9, AR: 15.7, CA: 12.0, CO: 9.7,  CT: 10.0,
  DE: 11.5, FL: 12.7, GA: 13.7, HI: 10.1, ID: 11.2, IL: 11.6, IN: 12.2,
  IA: 10.7, KS: 11.0, KY: 16.5, LA: 18.6, ME: 10.6, MD: 9.0,  MA: 9.4,
  MI: 13.0, MN: 9.3,  MS: 19.1, MO: 12.7, MT: 11.9, NE: 10.7, NV: 12.4,
  NH: 7.2,  NJ: 9.7,  NM: 17.8, NY: 13.6, NC: 13.4, ND: 10.6, OH: 13.4,
  OK: 15.4, OR: 12.1, PA: 11.8, RI: 11.2, SC: 13.9, SD: 12.3, TN: 13.9,
  TX: 13.7, UT: 8.2,  VT: 10.2, VA: 10.2, WA: 10.1, WV: 16.8, WI: 10.7, WY: 10.1
};

const STATE_NAMES = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
  CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
  HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
  MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi', MO: 'Missouri',
  MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey',
  NM: 'New Mexico', NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island', SC: 'South Carolina',
  SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas', UT: 'Utah', VT: 'Vermont',
  VA: 'Virginia', WA: 'Washington', WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
};

const STATE_POSITIONS = {
  ME: [0, 10],
  VT: [1, 9], NH: [1, 10],
  WA: [2, 0], ID: [2, 2], MT: [2, 3], ND: [2, 4], MN: [2, 5], WI: [2, 6], MI: [2, 7], NY: [2, 9], MA: [2, 10],
  OR: [3, 1], UT: [3, 2], WY: [3, 3], SD: [3, 4], IA: [3, 5], IL: [3, 6], IN: [3, 7], OH: [3, 8], PA: [3, 9], NJ: [3, 10], CT: [3, 11], RI: [3, 12],
  CA: [4, 1], NV: [4, 2], CO: [4, 3], NE: [4, 4], MO: [4, 5], KY: [4, 6], WV: [4, 7], VA: [4, 8], MD: [4, 9], DE: [4, 10],
  AZ: [5, 2], NM: [5, 3], KS: [5, 4], AR: [5, 5], TN: [5, 6], NC: [5, 7], SC: [5, 8],
  OK: [6, 4], LA: [6, 5], MS: [6, 6], AL: [6, 7], GA: [6, 8],
  TX: [7, 4], FL: [7, 8],
  AK: [7, 0], HI: [7, 1]
};

function seededRandom(seed) {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function generateIndicators(stateCode) {
  const poverty = POVERTY_RATES[stateCode];
  const normalized = (poverty - 7) / 13;
  const seed = stateCode.charCodeAt(0) * 37 + stateCode.charCodeAt(1) * 11;
  const r = (i) => seededRandom(seed + i * 13) - 0.5;
  return {
    povertyRate: poverty,
    H1: Math.max(0.5, 1.8 + normalized * 5.0 + r(1) * 1.8),
    E1: Math.max(3, 8 + normalized * 22 + r(2) * 6),
    F2: Math.max(10, 22 + normalized * 55 + r(3) * 15),
    F4: Math.max(5, 10 + normalized * 25 + r(4) * 5),
    D1: Math.max(4, 10 + normalized * 25 + r(5) * 6),
    N2: Math.max(20, 32 + normalized * 42 + r(6) * 8),
    L3: 0.8 - normalized * 2.8 + r(7) * 1.2,
    M2: Math.max(40, 55 + normalized * 28 + r(8) * 8)
  };
}

const WEIGHTS = { H1: 0.20, E1: 0.15, F2: 0.15, F4: 0.10, D1: 0.10, N2: 0.10, L3: 0.10, M2: 0.10 };

function compositeScore(ind) {
  return (
    ind.H1 * WEIGHTS.H1 + ind.E1 * WEIGHTS.E1 + ind.F2 * WEIGHTS.F2 + ind.F4 * WEIGHTS.F4 +
    ind.D1 * WEIGHTS.D1 + ind.N2 * WEIGHTS.N2 + ind.L3 * WEIGHTS.L3 + ind.M2 * WEIGHTS.M2
  );
}

const TIERS = [
  { max: 20,  name: 'LOW RISK',      color: '#4a6d5c', label: 'Stable; monitor quarterly.' },
  { max: 40,  name: 'MODERATE RISK', color: '#b08945', label: 'Emerging stress — monitor monthly.' },
  { max: 60,  name: 'HIGH RISK',     color: '#c86b3c', label: 'Active warning — deploy interventions.' },
  { max: 80,  name: 'SEVERE RISK',   color: '#8b2e2a', label: 'Crystallization underway — multi-agency.' },
  { max: 100, name: 'CRISIS',        color: '#4a1614', label: 'Systemic collapse — emergency response.' }
];

function tierFor(score) {
  return TIERS.find(t => score <= t.max) || TIERS[TIERS.length - 1];
}

function buildStates() {
  return Object.keys(POVERTY_RATES).map(code => {
    const indicators = generateIndicators(code);
    const score = compositeScore(indicators);
    return { code, name: STATE_NAMES[code], indicators, score, tier: tierFor(score) };
  });
}

// ============================================================================
// TIME SERIES — 48 historical quarters (12 years) + configurable forecast
// ============================================================================
function buildTimeSeries(stateCode, currentScore, forecastQuarters) {
  const seed = stateCode.charCodeAt(0) * 29 + stateCode.charCodeAt(1) * 17;
  const noise = (i) => (seededRandom(seed + i * 7) - 0.5) * 2.8;

  const totalPast = 48;
  const startYear = 2014;
  const history = [];

  for (let i = 0; i < totalPast; i++) {
    const yearsBack = (totalPast - 1 - i) / 4;
    const trend = -yearsBack * 0.28;
    let value = currentScore + trend + noise(i);
    const covidStart = (2020 - startYear) * 4 + 1;
    if (i >= covidStart && i <= covidStart + 3) value += 3.8 - (i - covidStart) * 0.5;
    history.push({
      q: `${startYear + Math.floor(i / 4)} Q${(i % 4) + 1}`,
      idx: i,
      actual: Number(Math.max(0, Math.min(100, value)).toFixed(1))
    });
  }

  const windowSize = 12;
  const recent = history.slice(-windowSize);
  const xs = recent.map((_, i) => i);
  const ys = recent.map(p => p.actual);
  const meanX = xs.reduce((a, b) => a + b, 0) / xs.length;
  const meanY = ys.reduce((a, b) => a + b, 0) / ys.length;
  const slope = xs.reduce((sum, x, i) => sum + (x - meanX) * (ys[i] - meanY), 0) /
                xs.reduce((sum, x) => sum + (x - meanX) ** 2, 0);
  const intercept = meanY - slope * meanX;
  const residuals = ys.map((y, i) => y - (intercept + slope * xs[i]));
  const residStd = Math.sqrt(residuals.reduce((s, r) => s + r * r, 0) / residuals.length);

  const forecast = [];
  for (let i = 1; i <= forecastQuarters; i++) {
    const projected = intercept + slope * (windowSize - 1 + i);
    const bandWidth = residStd * 1.96 * Math.sqrt(1 + i * 0.18);
    const absQ = totalPast + i - 1;
    forecast.push({
      q: `${startYear + Math.floor(absQ / 4)} Q${(absQ % 4) + 1}`,
      idx: absQ,
      forecast: Number(Math.max(0, Math.min(100, projected)).toFixed(1)),
      lower: Number(Math.max(0, projected - bandWidth).toFixed(1)),
      upper: Number(Math.min(100, projected + bandWidth).toFixed(1))
    });
  }

  const lastActual = history[history.length - 1];
  const bridge = {
    ...lastActual,
    forecast: lastActual.actual,
    lower: lastActual.actual,
    upper: lastActual.actual
  };
  const series = forecastQuarters > 0 ? [...history, bridge, ...forecast] : [...history];

  return {
    series,
    slope,
    forecastValue: forecast.length ? forecast[forecast.length - 1].forecast : null,
    forecastBand: forecast.length ? [forecast[forecast.length - 1].lower, forecast[forecast.length - 1].upper] : null,
    totalPast
  };
}

// ============================================================================
// SHARED CARD STYLE
// ============================================================================
const CARD = "rounded-2xl border border-stone-300/70 bg-white/70 backdrop-blur-sm shadow-[0_1px_2px_rgba(60,50,30,0.04),0_12px_32px_-12px_rgba(60,50,30,0.08)]";

// ============================================================================
// TILE MAP
// ============================================================================
function TileMap({ states, selected, onSelect, hover, onHover }) {
  const tileSize = 48;
  const gap = 5;
  const maxCol = 12;
  const maxRow = 7;
  const width = (maxCol + 1) * (tileSize + gap);
  const height = (maxRow + 1) * (tileSize + gap);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {states.map(s => {
        const [row, col] = STATE_POSITIONS[s.code];
        const x = col * (tileSize + gap);
        const y = row * (tileSize + gap);
        const isSelected = selected === s.code;
        const isHover = hover === s.code;
        return (
          <g key={s.code}
             onMouseEnter={() => onHover(s.code)}
             onMouseLeave={() => onHover(null)}
             onClick={() => onSelect(s.code)}
             style={{ cursor: 'pointer' }}>
            <rect
              x={x} y={y} width={tileSize} height={tileSize} rx={10} ry={10}
              fill={s.tier.color}
              opacity={isSelected ? 1 : (isHover ? 0.94 : 0.82)}
              stroke={isSelected ? '#1a1a1a' : 'transparent'}
              strokeWidth={isSelected ? 2.5 : 0}
              style={{ transition: 'opacity 140ms, stroke-width 140ms' }}
            />
            {isSelected && (
              <rect
                x={x - 3} y={y - 3} width={tileSize + 6} height={tileSize + 6} rx={13} ry={13}
                fill="none" stroke="#1a1a1a" strokeWidth={1} opacity={0.25}
              />
            )}
            <text x={x + tileSize / 2} y={y + tileSize / 2 - 3}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="#faf7f2" fontSize="13"
                  fontFamily="JetBrains Mono, monospace" fontWeight="600"
                  style={{ pointerEvents: 'none' }}>
              {s.code}
            </text>
            <text x={x + tileSize / 2} y={y + tileSize / 2 + 12}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="#faf7f2" fontSize="10.5" opacity="0.88"
                  fontFamily="JetBrains Mono, monospace"
                  style={{ pointerEvents: 'none' }}>
              {s.score.toFixed(0)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-mono tracking-wide uppercase text-stone-600">
      {TIERS.map((t, i) => {
        const lo = i === 0 ? 0 : TIERS[i - 1].max + 1;
        return (
          <div key={t.name} className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-md" style={{ backgroundColor: t.color }}></span>
            <span>{t.name}</span>
            <span className="text-stone-400 tabular-nums">{lo}–{t.max}</span>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================================
// SCORE BREAKDOWN (rounded card)
// ============================================================================
function ScoreBreakdown({ state }) {
  const rows = [
    { id: 'H1', layer: 'Early Warning',    label: 'Eviction filing rate',         value: state.indicators.H1, unit: '/100 HH', weight: WEIGHTS.H1 },
    { id: 'E1', layer: 'Early Warning',    label: 'Disconnection notice rate',    value: state.indicators.E1, unit: '%',       weight: WEIGHTS.E1 },
    { id: 'F2', layer: 'Community Drain',  label: 'Payday loan inquiry index',    value: state.indicators.F2, unit: '',        weight: WEIGHTS.F2 },
    { id: 'F4', layer: 'Community Drain',  label: 'Debt-in-collections rate',     value: state.indicators.F4, unit: '%',       weight: WEIGHTS.F4 },
    { id: 'D1', layer: 'Mobility Barrier', label: 'Broadband non-subscription',   value: state.indicators.D1, unit: '%',       weight: WEIGHTS.D1 },
    { id: 'N2', layer: 'Mobility Barrier', label: 'Free & reduced lunch rate',    value: state.indicators.N2, unit: '%',       weight: WEIGHTS.N2 },
    { id: 'L3', layer: 'Structural',       label: 'Wage growth vs. inflation',    value: state.indicators.L3, unit: '%',       weight: WEIGHTS.L3 },
    { id: 'M2', layer: 'Structural',       label: 'Immobility score',             value: state.indicators.M2, unit: '',        weight: WEIGHTS.M2 }
  ];
  const total = rows.reduce((s, r) => s + r.value * r.weight, 0);

  return (
    <div className={`${CARD} p-6 mt-5`}>
      <h3 className="font-display text-lg font-semibold text-stone-900 mb-3">Score composition</h3>
      <div className="border-t border-stone-200">
        {rows.map(r => {
          const contribution = r.value * r.weight;
          return (
            <div key={r.id} className="py-2.5 border-b border-stone-100 flex items-baseline gap-3">
              <span className="font-mono text-[10px] text-stone-500 w-6">{r.id}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] text-stone-800 truncate">{r.label}</div>
                <div className="font-mono text-[10px] text-stone-500 uppercase tracking-wider mt-0.5">{r.layer} · weight {(r.weight * 100).toFixed(0)}%</div>
              </div>
              <span className="font-mono text-[13px] text-stone-900 tabular-nums w-16 text-right">
                {r.value.toFixed(1)}{r.unit && <span className="text-stone-400 ml-0.5">{r.unit}</span>}
              </span>
              <span className="font-mono text-[13px] font-semibold tabular-nums w-14 text-right" style={{ color: contribution < 0 ? '#4a6d5c' : '#1a1a1a' }}>
                {contribution >= 0 ? '+' : ''}{contribution.toFixed(2)}
              </span>
            </div>
          );
        })}
        <div className="py-3 flex items-baseline gap-3 border-t-2 border-stone-800 mt-1">
          <span className="flex-1 font-display italic text-stone-700">Composite Risk Index</span>
          <span className="font-mono text-xl font-semibold text-stone-900 tabular-nums">{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TREND CHART — with forecast horizon toggle (History / 3Y / 5Y / 10Y)
// ============================================================================
const HORIZONS = [
  { label: 'History',  quarters: 0,  sublabel: 'only' },
  { label: '3-year',   quarters: 12, sublabel: 'forecast' },
  { label: '5-year',   quarters: 20, sublabel: 'forecast' },
  { label: '10-year',  quarters: 40, sublabel: 'forecast' }
];

function TrendChart({ state }) {
  const [horizonIdx, setHorizonIdx] = useState(1);
  const horizon = HORIZONS[horizonIdx];

  const { series, slope, forecastValue, forecastBand, totalPast } = useMemo(
    () => buildTimeSeries(state.code, state.score, horizon.quarters),
    [state.code, state.score, horizon.quarters]
  );

  const direction = slope > 0.15 ? 'rising' : slope < -0.15 ? 'improving' : 'flat';
  const dirIcon = direction === 'rising' ? <TrendingUp size={14} /> : direction === 'improving' ? <TrendingDown size={14} /> : <Minus size={14} />;
  const dirColor = direction === 'rising' ? '#8b2e2a' : direction === 'improving' ? '#4a6d5c' : '#5c5c5c';

  const tickIdx = series.filter(p => p.q.endsWith('Q1')).map(p => p.idx);
  const tickStep = series.length > 60 ? 2 : 1;
  const displayTicks = tickIdx.filter((_, i) => i % tickStep === 0);
  const forecastStartX = totalPast - 1;

  return (
    <div className={`${CARD} p-6`}>
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="font-display text-lg font-semibold text-stone-900">Risk trajectory</h3>
        <span className="font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5" style={{ color: dirColor }}>
          {dirIcon}
          <span>{direction === 'rising' ? 'deteriorating' : direction === 'improving' ? 'improving' : 'flat'}</span>
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
              tickFormatter={(i) => series.find(p => p.idx === i)?.q?.slice(0, 4) || ''}
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
              <ReferenceArea x1={forecastStartX} x2={series[series.length - 1].idx} fill="#1a1a1a" fillOpacity={0.03} />
            )}
            <ReferenceLine y={20} stroke="#d4cfc4" strokeDasharray="2 2" />
            <ReferenceLine y={40} stroke="#d4cfc4" strokeDasharray="2 2" />
            <ReferenceLine y={60} stroke="#d4cfc4" strokeDasharray="2 2" />
            <ReferenceLine y={80} stroke="#d4cfc4" strokeDasharray="2 2" />
            <Tooltip
              contentStyle={{ backgroundColor: '#faf7f2', border: '1px solid #1a1a1a', borderRadius: 8, fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
              labelFormatter={(i) => series.find(p => p.idx === i)?.q || ''}
              formatter={(value, name) => {
                if (value == null) return null;
                const labels = { actual: 'Historical', forecast: 'Forecast', upper: '95% upper', lower: '95% lower' };
                return [value.toFixed(1), labels[name] || name];
              }}
            />
            <Area type="monotone" dataKey="upper" stroke="none" fill="#c86b3c" fillOpacity={0.08} connectNulls={false} isAnimationActive={false} />
            <Area type="monotone" dataKey="lower" stroke="none" fill="#faf7f2" fillOpacity={1} connectNulls={false} isAnimationActive={false} />
            <Line type="monotone" dataKey="actual" stroke="#1a1a1a" strokeWidth={1.8} dot={false} connectNulls={false} isAnimationActive={false} />
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
            <div className="font-mono text-[10px] uppercase tracking-wider text-stone-500">{horizon.label} projection</div>
            <div className="font-mono text-lg tabular-nums" style={{ color: '#c86b3c' }}>
              {forecastValue.toFixed(1)}
              <span className="text-stone-400 text-xs ml-1.5">[{forecastBand[0].toFixed(1)}–{forecastBand[1].toFixed(1)}]</span>
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

// ============================================================================
// STATE DETAIL — highlighted header card + trend + breakdown
// ============================================================================
function StateDetail({ state }) {
  const tier = state.tier;

  return (
    <div>
      <div
        className="rounded-2xl p-6 mb-5 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${tier.color}f0 0%, ${tier.color} 100%)`,
          boxShadow: `0 18px 40px -16px ${tier.color}55`
        }}
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)', backgroundSize: '16px 16px' }} />

        <div className="relative">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 mb-2">
            Selected · {state.code}
          </div>
          <h2 className="font-display text-4xl font-medium tracking-tight text-white leading-none mb-5">
            {state.name}
          </h2>
          <div className="flex items-end gap-5">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-white/70">Composite Risk Index</div>
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
            <div><span className="text-white/60">Poverty rate</span> <span className="text-white tabular-nums ml-1.5">{state.indicators.povertyRate.toFixed(1)}%</span></div>
            <div><span className="text-white/60">Source</span> <span className="text-white ml-1.5">ACS 2023</span></div>
          </div>
        </div>
      </div>

      <TrendChart state={state} />
      <ScoreBreakdown state={state} />
    </div>
  );
}

// ============================================================================
// NATIONAL SUMMARY
// ============================================================================
function NationalSummary({ states }) {
  const avg = states.reduce((s, st) => s + st.score, 0) / states.length;
  const tierCounts = TIERS.map(t => ({ tier: t, count: states.filter(s => s.tier.name === t.name).length }));
  const highest = [...states].sort((a, b) => b.score - a.score).slice(0, 3);
  const lowest = [...states].sort((a, b) => a.score - b.score).slice(0, 3);
  const natTier = tierFor(avg);

  return (
    <div className={`${CARD} p-7 mt-6`}>
      <div className="grid grid-cols-4 gap-8">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2">National average</div>
          <div className="flex items-baseline gap-2">
            <div className="font-display text-5xl font-semibold text-stone-900 tabular-nums leading-none">{avg.toFixed(1)}</div>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: natTier.color }} />
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider mt-2" style={{ color: natTier.color }}>{natTier.name}</div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2">States by tier</div>
          <div className="space-y-1.5">
            {tierCounts.filter(tc => tc.count > 0).map(tc => (
              <div key={tc.tier.name} className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: tc.tier.color }} />
                <span className="font-mono text-[11px] text-stone-700 tabular-nums w-6">{tc.count}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-stone-500">{tc.tier.name.replace(' RISK', '')}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2">Highest risk</div>
          <div className="space-y-1.5">
            {highest.map(s => (
              <div key={s.code} className="flex items-center gap-2.5 font-mono text-[12px]">
                <span className="tabular-nums text-stone-900 w-10">{s.score.toFixed(1)}</span>
                <span className="text-stone-600">{s.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-2">Lowest risk</div>
          <div className="space-y-1.5">
            {lowest.map(s => (
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

// ============================================================================
// MAIN
// ============================================================================
export default function Dashboard() {
  const states = useMemo(buildStates, []);
  const [selected, setSelected] = useState('MS');
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const styleId = 'poverty-tracker-fonts';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = FONT_CSS;
      document.head.appendChild(style);
    }
  }, []);

  const selectedState = states.find(s => s.code === selected);
  const hoverState = hover ? states.find(s => s.code === hover) : null;

  return (
    <div
      className="font-body min-h-screen"
      style={{
        backgroundColor: '#faf7f2',
        backgroundImage: 'radial-gradient(circle at 20% 0%, rgba(200,107,60,0.04) 0%, transparent 45%), radial-gradient(circle at 85% 25%, rgba(74,109,92,0.04) 0%, transparent 45%)',
        color: '#1a1a1a'
      }}
    >
      <div className="max-w-[1320px] mx-auto px-8 pt-10 pb-16">

        <header className="flex items-end justify-between pb-6 border-b-4 border-double border-stone-800">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500 mb-1">
              Phase 0 · Prototype · Sample data
            </div>
            <h1 className="font-display text-[54px] font-semibold tracking-tight leading-[0.95] text-stone-900">
              The Predictive<br />Poverty Tracker
            </h1>
          </div>
          <div className="text-right font-display italic text-stone-600 text-[13px] max-w-[36ch] leading-snug pb-2">
            A composite index of eight microeconomic stress signals, scored 0–100 across all fifty states. Higher scores indicate greater pressure toward entrenched poverty.
          </div>
        </header>

        <NationalSummary states={states} />

        <div className="grid grid-cols-12 gap-7 pt-7">
          <div className="col-span-7">
            <div className={`${CARD} p-7`}>
              <div className="flex items-baseline justify-between mb-5">
                <h2 className="font-display text-xl font-semibold text-stone-900">State-level risk map</h2>
                <span className="font-mono text-[11px] text-stone-500 tabular-nums">
                  {hoverState ? `${hoverState.name} · ${hoverState.score.toFixed(1)}` : 'Hover or click a state'}
                </span>
              </div>
              <TileMap states={states} selected={selected} onSelect={setSelected} hover={hover} onHover={setHover} />
              <div className="mt-5 pt-5 border-t border-stone-200">
                <Legend />
              </div>
              <div className="mt-5 pt-5 border-t border-stone-200 font-display italic text-[12px] text-stone-600 leading-snug">
                <Info size={12} className="inline mr-1.5 -mt-0.5" />
                Index formula and weights match Section D of the Predictive Poverty Tracker workbook. Values here are illustrative; Phase&nbsp;1 connects the eight component indicators to live Census, BLS, Eviction&nbsp;Lab, and FCC data feeds.
              </div>
            </div>
          </div>

          <div className="col-span-5">
            <StateDetail state={selectedState} />
          </div>
        </div>

        <footer className="mt-14 pt-6 border-t border-stone-300 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-stone-500">
          <span>Predictive Poverty Tracker · v0.2 prototype</span>
          <span>Index formula: Section D · CRI weighted 8-component composite</span>
        </footer>
      </div>
    </div>
  );
}
