// Historical series generator and linear forecast builder.
// Produces 48 quarters (12 years) of simulated history + optional forecast with confidence bands.

export interface DataPoint {
  q: string;
  idx: number;
  actual?: number;
  forecast?: number;
  lower?: number;
  upper?: number;
}

export interface TimeSeriesResult {
  series: DataPoint[];
  slope: number;
  forecastValue: number | null;
  forecastBand: [number, number] | null;
  totalPast: number;
}

function seededRandom(seed: number): number {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function buildTimeSeries(
  stateCode: string,
  currentScore: number,
  forecastQuarters: number
): TimeSeriesResult {
  const seed = stateCode.charCodeAt(0) * 29 + stateCode.charCodeAt(1) * 17;
  const noise = (i: number) => (seededRandom(seed + i * 7) - 0.5) * 2.8;

  const totalPast = 48;
  const startYear = 2014;
  const history: DataPoint[] = [];

  for (let i = 0; i < totalPast; i++) {
    const yearsBack = (totalPast - 1 - i) / 4;
    const trend = -yearsBack * 0.28;
    let value = currentScore + trend + noise(i);
    const covidStart = (2020 - startYear) * 4 + 1;
    if (i >= covidStart && i <= covidStart + 3) value += 3.8 - (i - covidStart) * 0.5;
    history.push({
      q: `${startYear + Math.floor(i / 4)} Q${(i % 4) + 1}`,
      idx: i,
      actual: Number(Math.max(0, Math.min(100, value)).toFixed(1)),
    });
  }

  // Linear regression over last 12 quarters to drive the forecast
  const windowSize = 12;
  const recent = history.slice(-windowSize);
  const xs = recent.map((_, i) => i);
  const ys = recent.map((p) => p.actual as number);
  const meanX = xs.reduce((a, b) => a + b, 0) / xs.length;
  const meanY = ys.reduce((a, b) => a + b, 0) / ys.length;
  const slope =
    xs.reduce((sum, x, i) => sum + (x - meanX) * (ys[i] - meanY), 0) /
    xs.reduce((sum, x) => sum + (x - meanX) ** 2, 0);
  const intercept = meanY - slope * meanX;
  const residuals = ys.map((y, i) => y - (intercept + slope * xs[i]));
  const residStd = Math.sqrt(residuals.reduce((s, r) => s + r * r, 0) / residuals.length);

  const forecast: DataPoint[] = [];
  for (let i = 1; i <= forecastQuarters; i++) {
    const projected = intercept + slope * (windowSize - 1 + i);
    const bandWidth = residStd * 1.96 * Math.sqrt(1 + i * 0.18);
    const absQ = totalPast + i - 1;
    forecast.push({
      q: `${startYear + Math.floor(absQ / 4)} Q${(absQ % 4) + 1}`,
      idx: absQ,
      forecast: Number(Math.max(0, Math.min(100, projected)).toFixed(1)),
      lower: Number(Math.max(0, projected - bandWidth).toFixed(1)),
      upper: Number(Math.min(100, projected + bandWidth).toFixed(1)),
    });
  }

  const lastActual = history[history.length - 1];
  const bridge: DataPoint = {
    ...lastActual,
    forecast: lastActual.actual,
    lower: lastActual.actual,
    upper: lastActual.actual,
  };
  const series = forecastQuarters > 0 ? [...history, bridge, ...forecast] : [...history];

  return {
    series,
    slope,
    forecastValue: forecast.length ? forecast[forecast.length - 1].forecast! : null,
    forecastBand: forecast.length
      ? [forecast[forecast.length - 1].lower!, forecast[forecast.length - 1].upper!]
      : null,
    totalPast,
  };
}
