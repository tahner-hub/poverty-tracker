# Where We Left Off

## What's Done — Phase 1 ✅

The prototype has been converted into a real, deployed Next.js site.

**Live URL:** https://povtracker.app  
**GitHub:** https://github.com/tahner-hub/poverty-tracker  
**Local folder:** `/Users/tahne/Documents/poverty-tracker/`

### File structure

```
poverty-tracker/
├── app/
│   ├── layout.tsx          Page title, meta description, font setup
│   ├── page.tsx            Main dashboard (header, map, state detail, footer)
│   └── globals.css         Google Fonts import + Tailwind base styles
├── components/
│   ├── TileMap.tsx         50-state SVG tile map, click/hover interaction
│   ├── NationalSummary.tsx 4-column summary card (avg score, tier counts, top/bottom 3)
│   ├── StateDetail.tsx     Colored state header card with score + tier badge
│   ├── TrendChart.tsx      12-year history + 3/5/10-year forecast, horizon toggles
│   ├── ScoreBreakdown.tsx  8-indicator score composition table with weighted contributions
│   └── Legend.tsx          5-tier color legend
├── lib/
│   ├── data.ts             All state data, positions, tier definitions, TypeScript types
│   ├── scoring.ts          CRI formula, weights (H1 20%, E1 15%, F2 15% …), tier logic
│   └── timeseries.ts       12-year history builder + linear forecast with confidence bands
└── [reference files]
    ├── poverty-tracker-prototype.jsx       Original Claude.ai prototype
    ├── Predictive_Poverty_Tracker.xlsx     48-indicator framework and CRI formula
    └── Predictive_Poverty_Tracker_Documentation.docx  Full platform specification
```

All data is currently **simulated** — the CRI formula and weights are real (from the workbook), but the indicator values are generated from ACS poverty rates as proxies. Live data feeds come in Phase 2.

---

## Tabled for Phase 1.5 (Next Session)

### (a) About / Methodology Page
A public-facing page (`/about`) explaining the project for non-technical visitors:
- What the Composite Risk Index is and why it exists
- The four layers (Early Warning, Community Drain, Mobility Barriers, Analytics Engine)
- Each of the 8 indicators: what it measures, its weight, and why it was chosen
- The 5 risk tiers and what each one means operationally
- Data sources and limitations (currently simulated; what live sources will replace them)
- Brief note on the forecasting approach (linear now → SARIMA/Bayesian in Phase 4)

### (b) Hover Tooltips Throughout the Dashboard
- **State tiles:** hovering a tile shows a small floating card with the state name, CRI score, tier badge, and a 3-line mini-breakdown of the top contributing indicators
- **Indicator rows (score table):** hovering an indicator ID (H1, E1, etc.) shows the full definition, data source, signal type (Leading/Concurrent/Structural), and update frequency
- **Tier badges:** hovering the tier badge (e.g., "HIGH RISK") shows the score range, the operational meaning, and the recommended policy response from the framework

---

## Future Phases at a Glance

| Phase | Goal | Key work |
|-------|------|----------|
| **2** | Real database + admin panel | Supabase (PostgreSQL) backend; 48-indicator data tables; password-protected data entry form; user roles (Viewer, Analyst, Data Manager, Admin) |
| **3** | Alerts + deep analysis | Data Explorer (all 48 indicators, filterable/exportable); Trend Analysis page (compare states side by side); configurable threshold alerts; email notifications (Resend) |
| **4** | Live data + real forecasting | Eviction Lab API (H1/H2); USDA FNS for SNAP caseloads (N1); SARIMA or Bayesian CAR model replacing the linear forecast; lead-lag analysis tool; mobile optimization |

---

## How Future Updates Work

Whenever code changes are made, open Terminal, navigate to the project folder, and run:

```bash
git add .
git commit -m "brief description of what changed"
git push
```

Vercel detects the push and rebuilds the live site automatically — usually live within 60 seconds.
