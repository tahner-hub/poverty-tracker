// CRI formula, indicator generation, and tier assignment.
// All weights match Section D of the Predictive Poverty Tracker workbook.

import {
  POVERTY_RATES,
  STATE_NAMES,
  TIERS,
  type Indicators,
  type StateData,
  type Tier,
} from './data';

export const WEIGHTS = {
  H1: 0.20,
  E1: 0.15,
  F2: 0.15,
  F4: 0.10,
  D1: 0.10,
  N2: 0.10,
  L3: 0.10,
  M2: 0.10,
} as const;

function seededRandom(seed: number): number {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function generateIndicators(stateCode: string): Indicators {
  const poverty = POVERTY_RATES[stateCode];
  const normalized = (poverty - 7) / 13;
  const seed = stateCode.charCodeAt(0) * 37 + stateCode.charCodeAt(1) * 11;
  const r = (i: number) => seededRandom(seed + i * 13) - 0.5;
  return {
    povertyRate: poverty,
    H1: Math.max(0.5, 1.8 + normalized * 5.0 + r(1) * 1.8),
    E1: Math.max(3,   8   + normalized * 22  + r(2) * 6),
    F2: Math.max(10,  22  + normalized * 55  + r(3) * 15),
    F4: Math.max(5,   10  + normalized * 25  + r(4) * 5),
    D1: Math.max(4,   10  + normalized * 25  + r(5) * 6),
    N2: Math.max(20,  32  + normalized * 42  + r(6) * 8),
    L3: 0.8 - normalized * 2.8 + r(7) * 1.2,
    M2: Math.max(40,  55  + normalized * 28  + r(8) * 8),
  };
}

export function compositeScore(ind: Indicators): number {
  return (
    ind.H1 * WEIGHTS.H1 +
    ind.E1 * WEIGHTS.E1 +
    ind.F2 * WEIGHTS.F2 +
    ind.F4 * WEIGHTS.F4 +
    ind.D1 * WEIGHTS.D1 +
    ind.N2 * WEIGHTS.N2 +
    ind.L3 * WEIGHTS.L3 +
    ind.M2 * WEIGHTS.M2
  );
}

export function tierFor(score: number): Tier {
  return TIERS.find((t) => score <= t.max) ?? TIERS[TIERS.length - 1];
}

export function buildAllStates(): StateData[] {
  return Object.keys(POVERTY_RATES).map((code) => {
    const indicators = generateIndicators(code);
    const score = compositeScore(indicators);
    return {
      code,
      name: STATE_NAMES[code],
      indicators,
      score,
      tier: tierFor(score),
    };
  });
}
