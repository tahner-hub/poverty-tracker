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
│   ├── globals.css         Google Fonts import + Tailwind base styles + tooltip animations
│   └── about/
│       └── page.tsx        Methodology page (/about)
├── components/
│   ├── TileMap.tsx         50-state SVG tile map, click/hover interaction
│   ├── NationalSummary.tsx 4-column summary card (avg score, tier counts, top/bottom 3)
│   ├── StateDetail.tsx     Colored state header card — CRI score, tier badge, both with tooltips
│   ├── TrendChart.tsx      12-year history + 3/5/10-year forecast, horizon toggles
│   ├── ScoreBreakdown.tsx  8-indicator score composition table with weighted contributions + tooltips
│   ├── Tooltip.tsx         Reusable floating tooltip component + TooltipTitle/Body/Meta/Link
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

## What's Done — Phase 1.5 ✅

### (a) Methodology Page (`/about`)
A full public-facing page explaining the project for non-technical visitors:
- What the Composite Risk Index is and why it exists
- The four layers (Early Warning, Community Drain, Mobility Barriers, Structural)
- Each of the 8 indicators: full name, definition, weight, signal type, and layer — all sourced from the workbook
- Worked example table (how indicator values combine into a CRI score)
- The 5 risk tiers with score ranges and operational guidance
- Data sources and limitations — split into current (simulated) and future (live API) tables
- Top-of-page amber notice linking to the data disclaimer section
- Linked from the dashboard header as "Methodology →"

### (b) Reusable Tooltip Component (`components/Tooltip.tsx`)
A lightweight hover tooltip built with React state and CSS positioning:
- Dark warm card (`#1e1b18`) with fade+slide entrance animation (130ms ease-out)
- `side="top"` (default) or `side="bottom"`, with matching directional arrow
- Named sub-components: `TooltipTitle`, `TooltipBody`, `TooltipMeta`, `TooltipLink`
- Mouse-only for now — keyboard and touch support deferred (see below)

### (c) Indicator Tooltips (`ScoreBreakdown.tsx`)
Hovering any indicator row (id badge + label) shows:
- Full indicator name and one-sentence definition sourced from the workbook
- Signal type, layer, and weight in monospace caps at the bottom
- All 8 indicators wired: H1, E1, F2, F4, D1, N2, L3, M2

### (d) Tier Badge + CRI Tooltips (`StateDetail.tsx`)
- **Tier badge** (e.g., "MODERATE RISK"): shows tier name, score range, and operational label
- **ⓘ icon** next to "Composite Risk Index": one-line definition + "Read methodology →" link to `/about`

---

## Deferred — Tooltip Accessibility Pass
The `Tooltip` component currently responds to mouse hover only. A future pass should add:
- **Keyboard**: show on focus (Tab/Shift+Tab to reach trigger), dismiss on Escape
- **Touch/mobile**: show on tap, dismiss on tap-outside

Intentionally deferred to a later accessibility phase. Filed per user request after Task 2 review.

---

## Future Ideas

### Multi-State Compare Mode
**What:** Pin 2–4 states to view their CRI score breakdowns side by side — same 8 indicators, each state in its own column, color-coded by tier.

**Why it belongs here:** The original instinct behind the tile map tooltip was "I want to quickly compare states." A tooltip can't deliver that — a real compare view can. The tile map's existing color + click interaction already handles single-state exploration well; the gap is cross-state analysis.

**Scope:** Phase 2+ build. Requires a persistent "pinned states" list (local state or URL params), a new layout panel or page, and column-based adaptation of the ScoreBreakdown table. Not a tooltip.

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
