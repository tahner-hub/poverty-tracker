# Predictive Poverty Tracker

A public-facing data dashboard that estimates and forecasts poverty risk for all 50 U.S. states using a Composite Risk Index (CRI) of eight microeconomic indicators.

Higher scores (0–100 scale) indicate greater pressure toward entrenched poverty. The five risk tiers range from **Low** (0–20) to **Crisis** (81–100).

## The Eight CRI Indicators

| ID | Indicator | Weight |
|----|-----------|--------|
| H1 | Eviction filing rate | 20% |
| E1 | Final disconnection notice rate | 15% |
| F2 | Payday loan inquiry index | 15% |
| F4 | Debt-in-collections rate | 10% |
| D1 | Broadband non-subscription rate | 10% |
| N2 | Free & reduced lunch rate | 10% |
| L3 | Wage growth vs. inflation spread | 10% |
| M2 | Immobility score | 10% |

Formula and weights match Section D of the Predictive Poverty Tracker workbook.

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS**
- **Recharts** for data visualization
- Deployed on **Vercel**

## Running Locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project Status

- **Phase 1** ✅ — Static dashboard with simulated data, live on Vercel
- **Phase 2** — Supabase database + admin data entry panel
- **Phase 3** — Configurable alerts + email notifications
- **Phase 4** — Live data APIs (Eviction Lab, USDA FNS) + SARIMA forecasting model
