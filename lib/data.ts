// All static reference data: state codes, names, positions, and tier definitions.

export const POVERTY_RATES: Record<string, number> = {
  AL: 15.9, AK: 10.8, AZ: 12.9, AR: 15.7, CA: 12.0, CO: 9.7,  CT: 10.0,
  DE: 11.5, FL: 12.7, GA: 13.7, HI: 10.1, ID: 11.2, IL: 11.6, IN: 12.2,
  IA: 10.7, KS: 11.0, KY: 16.5, LA: 18.6, ME: 10.6, MD: 9.0,  MA: 9.4,
  MI: 13.0, MN: 9.3,  MS: 19.1, MO: 12.7, MT: 11.9, NE: 10.7, NV: 12.4,
  NH: 7.2,  NJ: 9.7,  NM: 17.8, NY: 13.6, NC: 13.4, ND: 10.6, OH: 13.4,
  OK: 15.4, OR: 12.1, PA: 11.8, RI: 11.2, SC: 13.9, SD: 12.3, TN: 13.9,
  TX: 13.7, UT: 8.2,  VT: 10.2, VA: 10.2, WA: 10.1, WV: 16.8, WI: 10.7, WY: 10.1,
};

export const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama',        AK: 'Alaska',         AZ: 'Arizona',       AR: 'Arkansas',
  CA: 'California',     CO: 'Colorado',        CT: 'Connecticut',   DE: 'Delaware',
  FL: 'Florida',        GA: 'Georgia',         HI: 'Hawaii',        ID: 'Idaho',
  IL: 'Illinois',       IN: 'Indiana',         IA: 'Iowa',          KS: 'Kansas',
  KY: 'Kentucky',       LA: 'Louisiana',       ME: 'Maine',         MD: 'Maryland',
  MA: 'Massachusetts',  MI: 'Michigan',        MN: 'Minnesota',     MS: 'Mississippi',
  MO: 'Missouri',       MT: 'Montana',         NE: 'Nebraska',      NV: 'Nevada',
  NH: 'New Hampshire',  NJ: 'New Jersey',      NM: 'New Mexico',    NY: 'New York',
  NC: 'North Carolina', ND: 'North Dakota',    OH: 'Ohio',          OK: 'Oklahoma',
  OR: 'Oregon',         PA: 'Pennsylvania',    RI: 'Rhode Island',  SC: 'South Carolina',
  SD: 'South Dakota',   TN: 'Tennessee',       TX: 'Texas',         UT: 'Utah',
  VT: 'Vermont',        VA: 'Virginia',        WA: 'Washington',    WV: 'West Virginia',
  WI: 'Wisconsin',      WY: 'Wyoming',
};

// [row, col] grid positions for the tile map
export const STATE_POSITIONS: Record<string, [number, number]> = {
  ME: [0, 10],
  VT: [1, 9],  NH: [1, 10],
  WA: [2, 0],  ID: [2, 2],  MT: [2, 3],  ND: [2, 4],  MN: [2, 5],  WI: [2, 6],  MI: [2, 7],  NY: [2, 9],  MA: [2, 10],
  OR: [3, 1],  UT: [3, 2],  WY: [3, 3],  SD: [3, 4],  IA: [3, 5],  IL: [3, 6],  IN: [3, 7],  OH: [3, 8],  PA: [3, 9],  NJ: [3, 10], CT: [3, 11], RI: [3, 12],
  CA: [4, 1],  NV: [4, 2],  CO: [4, 3],  NE: [4, 4],  MO: [4, 5],  KY: [4, 6],  WV: [4, 7],  VA: [4, 8],  MD: [4, 9],  DE: [4, 10],
  AZ: [5, 2],  NM: [5, 3],  KS: [5, 4],  AR: [5, 5],  TN: [5, 6],  NC: [5, 7],  SC: [5, 8],
  OK: [6, 4],  LA: [6, 5],  MS: [6, 6],  AL: [6, 7],  GA: [6, 8],
  TX: [7, 4],  FL: [7, 8],
  AK: [7, 0],  HI: [7, 1],
};

export interface Tier {
  max: number;
  name: string;
  color: string;
  label: string;
}

export const TIERS: Tier[] = [
  { max: 20,  name: 'LOW RISK',      color: '#4a6d5c', label: 'Stable; monitor quarterly.' },
  { max: 40,  name: 'MODERATE RISK', color: '#b08945', label: 'Emerging stress — monitor monthly.' },
  { max: 60,  name: 'HIGH RISK',     color: '#c86b3c', label: 'Active warning — deploy interventions.' },
  { max: 80,  name: 'SEVERE RISK',   color: '#8b2e2a', label: 'Crystallization underway — multi-agency.' },
  { max: 100, name: 'CRISIS',        color: '#4a1614', label: 'Systemic collapse — emergency response.' },
];

export interface Indicators {
  povertyRate: number;
  H1: number; // Eviction filing rate
  E1: number; // Disconnection notice rate
  F2: number; // Payday loan inquiry index
  F4: number; // Debt-in-collections rate
  D1: number; // Broadband non-subscription rate
  N2: number; // Free & reduced lunch rate
  L3: number; // Wage growth vs. inflation
  M2: number; // Immobility score
}

export interface StateData {
  code: string;
  name: string;
  indicators: Indicators;
  score: number;
  tier: Tier;
}
