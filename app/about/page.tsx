import Link from 'next/link';
import { TIERS } from '@/lib/data';
import { WEIGHTS } from '@/lib/scoring';

export const metadata = {
  title: 'Methodology | Predictive Poverty Tracker',
  description:
    'Technical and plain-language reference for the Composite Risk Index — how it is constructed, what each indicator measures, and how to interpret the five risk tiers.',
};

// ─── Layer metadata ──────────────────────────────────────────────────────────

const LAYER_META: Record<string, { color: string; bg: string; lead: string }> = {
  'Early Warning':   { color: '#8b2e2a', bg: 'rgba(139,46,42,0.07)',  lead: '30–60 day predictive lead' },
  'Community Drain': { color: '#b08945', bg: 'rgba(176,137,69,0.07)', lead: '12–24 month predictive lead' },
  'Mobility Barrier':{ color: '#4a6d5c', bg: 'rgba(74,109,92,0.07)',  lead: 'Concurrent structural signal' },
  'Structural':      { color: '#3a3530', bg: 'rgba(58,53,48,0.06)',   lead: 'Generational baseline' },
};

const SIGNAL_COLOR: Record<string, string> = {
  Leading:    '#8b2e2a',
  Concurrent: '#5c5c5c',
  Structural: '#4a6d5c',
};

// ─── Indicator registry (content drawn from source workbook & documentation) ─

const INDICATORS = [
  {
    id: 'H1',
    layer: 'Early Warning',
    name: 'Eviction Filing Rate',
    weight: WEIGHTS.H1,
    signal: 'Leading' as const,
    unit: 'cases per 100 renter households',
    source: 'Eviction Lab (Princeton University) / Local Court Records',
    what:
      'The number of eviction cases filed in court per 100 renter households in a given period. Filing is distinct from a formal eviction judgment — the act of filing alone signals that a tenant is at least one to two months behind on rent.',
    why:
      'Eviction filings are the single most powerful leading indicator in the framework. They appear weeks before household financial collapse becomes visible through any other channel. A surge in filings signals broad economic pressure across an area, even when many cases are later resolved or dismissed.',
  },
  {
    id: 'E1',
    layer: 'Early Warning',
    name: 'Final Disconnection Notice Rate',
    weight: WEIGHTS.E1,
    signal: 'Leading' as const,
    unit: '% of households receiving a final utility shutoff warning',
    source: 'State Utility Providers / State Departments of Energy Resources',
    what:
      'The percentage of households receiving a final shutoff notice from their electricity, gas, or water utility — the last formal warning before service is interrupted.',
    why:
      'Utility companies generate near-real-time data on disconnection notices, making this one of the most accessible early-warning streams available. When families receive final notices they are typically one to two paychecks away from a full housing crisis.',
  },
  {
    id: 'F2',
    layer: 'Community Drain',
    name: 'Payday Loan Inquiry Volume',
    weight: WEIGHTS.F2,
    signal: 'Leading' as const,
    unit: 'indexed volume of payday credit inquiries (0–100 scale)',
    source: 'Consumer Financial Protection Bureau / FinTech Data Providers',
    what:
      'A real-time count of credit inquiries submitted to payday and high-cost short-term lenders, indexed to a 0–100 scale for comparability across geographies.',
    why:
      'This is the longest-lead indicator in the framework: spikes in payday loan inquiries predict formal eviction filings 12 to 24 months later. When households turn to high-cost credit they signal that savings and regular income are no longer sufficient to cover basic expenses — a precondition that reliably precedes housing collapse.',
  },
  {
    id: 'F4',
    layer: 'Community Drain',
    name: 'Debt-in-Collections Rate',
    weight: WEIGHTS.F4,
    signal: 'Concurrent' as const,
    unit: '% of residents with at least one account in third-party debt collection',
    source: 'CFPB Consumer Credit Panel / Urban Institute',
    what:
      'The percentage of residents in a geographic area who have at least one unpaid bill or account that has been transferred to a third-party debt collector.',
    why:
      'Once a debt enters collections, a credit score drop follows — closing off access to mainstream financial products and forcing further reliance on high-cost alternatives. This cascading financial exclusion is a reliable concurrent signal of entrenched economic stress and deepening poverty.',
  },
  {
    id: 'D1',
    layer: 'Mobility Barrier',
    name: 'Broadband Non-Subscription Rate',
    weight: WEIGHTS.D1,
    signal: 'Concurrent' as const,
    unit: '% of households without fixed high-speed internet service',
    source: 'FCC Broadband Data Collection / U.S. Census American Community Survey',
    what:
      'The percentage of households that do not subscribe to a fixed high-speed broadband connection. Smartphone-only internet access is classified as non-subscribed for this indicator.',
    why:
      'Households without broadband face longer re-employment timelines, reduced access to telehealth and remote education, and inability to access digital-only government services. In an economy where most hiring, credentialing, and benefit enrollment happens online, connectivity is a baseline requirement for economic mobility.',
  },
  {
    id: 'N2',
    layer: 'Mobility Barrier',
    name: 'Free & Reduced Lunch Rate',
    weight: WEIGHTS.N2,
    signal: 'Concurrent' as const,
    unit: '% of K–12 students certified for the federal Free and Reduced Price Lunch program',
    source: 'National Center for Education Statistics / U.S. Department of Education',
    what:
      'The percentage of enrolled K–12 students who qualify for the federal Free and Reduced Price Lunch program, which requires household income at or below 185% of the federal poverty line.',
    why:
      'The FRL rate is a uniquely stable proxy for child poverty — it updates annually at the school-district level and is less subject to administrative noise than other benefit program data. High rates indicate that child poverty is a structural, persistent condition in a community rather than a temporary spike.',
  },
  {
    id: 'L3',
    layer: 'Structural',
    name: 'Wage Growth vs. Inflation Spread',
    weight: WEIGHTS.L3,
    signal: 'Leading' as const,
    unit: 'local median wage growth minus local CPI change (%)',
    source: 'BLS Occupational Employment & Wage Statistics / BLS Consumer Price Index',
    what:
      'The difference between local median wage growth and the local consumer price index change over the same period. A negative spread means prices are rising faster than wages — real purchasing power is declining even among employed households.',
    why:
      'Workers can be fully employed and still slide toward poverty if wages fail to keep pace with local costs. This slow-motion income erosion is invisible to standard unemployment figures and annual poverty snapshots, but the wage-inflation spread captures it in near-real time.',
  },
  {
    id: 'M2',
    layer: 'Structural',
    name: 'Immobility Score',
    weight: WEIGHTS.M2,
    signal: 'Structural' as const,
    unit: '0–100 scale (derived as 100 − intergenerational mobility rank)',
    source: 'Opportunity Insights — Harvard University Opportunity Atlas',
    what:
      "Derived from Harvard's Opportunity Atlas, which measures the probability that a child born to parents in the bottom income quintile will reach the top quintile as an adult. The Immobility Score inverts this figure (100 − mobility rank), so higher scores indicate lower upward mobility.",
    why:
      'In some communities the probability of upward mobility is below 5%. This structural ceiling determines whether poverty, once it arrives, becomes permanent. Areas with very low intergenerational mobility have limited capacity to recover from economic shocks — making the same level of financial stress far more likely to crystallize into generational poverty.',
  },
] as const;

// ─── Shared styles ───────────────────────────────────────────────────────────

const CARD = 'rounded-2xl border border-stone-300/70 bg-white/70 shadow-[0_1px_2px_rgba(60,50,30,0.04),0_12px_32px_-12px_rgba(60,50,30,0.08)]';

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-7">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-400 mb-1">
        {number}
      </div>
      <h2 className="font-display text-[28px] font-semibold tracking-tight text-stone-900 leading-tight">
        {title}
      </h2>
    </div>
  );
}

function LayerBadge({ layer }: { layer: string }) {
  const meta = LAYER_META[layer];
  return (
    <span
      className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded"
      style={{ color: meta.color, backgroundColor: meta.bg }}
    >
      {layer}
    </span>
  );
}

function SignalBadge({ signal }: { signal: string }) {
  const color = SIGNAL_COLOR[signal] ?? '#5c5c5c';
  return (
    <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color }}>
      {signal} indicator
    </span>
  );
}

function WeightBar({ weight, layerColor }: { weight: number; layerColor: string }) {
  const pct = (weight / 0.20) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1 rounded-full bg-stone-200">
        <div
          className="h-1 rounded-full"
          style={{ width: `${pct}%`, backgroundColor: layerColor }}
        />
      </div>
      <span className="font-mono text-[13px] font-semibold text-stone-900 tabular-nums w-8 text-right">
        {(weight * 100).toFixed(0)}%
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#faf7f2', color: '#1a1a1a', minHeight: '100vh' }}>

      {/* Navigation */}
      <nav className="sticky top-0 z-10 border-b border-stone-200 bg-[#faf7f2]/90 backdrop-blur-sm">
        <div className="max-w-[900px] mx-auto px-8 h-12 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-wider text-stone-500 hover:text-stone-900 transition-colors"
          >
            ← Dashboard
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">
            Predictive Poverty Tracker
          </span>
        </div>
      </nav>

      <div className="max-w-[900px] mx-auto px-8 py-14">

        {/* ── Page header ── */}
        <header className="mb-16 pb-10 border-b-4 border-double border-stone-800">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-stone-500 mb-3">
            Technical Reference · v1.0
          </div>
          <h1 className="font-display text-[52px] font-semibold tracking-tight leading-[0.95] text-stone-900 mb-6">
            Methodology
          </h1>
          <p className="text-[16px] text-stone-600 leading-relaxed max-w-[58ch]">
            A technical and plain-language reference for the Composite Risk Index — how it
            is constructed, what each of the eight component indicators measures, and how to
            interpret the five risk tiers.
          </p>
        </header>

        {/* ── Top-of-page data status notice ── */}
        <div
          className="rounded-xl px-5 py-3.5 mb-14 flex items-baseline gap-3"
          style={{
            backgroundColor: 'rgba(176,137,69,0.10)',
            border: '1px solid rgba(176,137,69,0.30)',
          }}
        >
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#b08945] shrink-0">
            Note
          </span>
          <p className="text-[13px] text-stone-700">
            This dashboard currently displays{' '}
            <strong className="text-stone-900">illustrative simulated data</strong> — the
            index formula and weights are real, but the indicator values are not.{' '}
            Live data feeds connect in Phase 4.{' '}
            <a href="#data-status" className="underline underline-offset-2 text-stone-500 hover:text-stone-800">
              See Section 08 for details.
            </a>
          </p>
        </div>

        {/* ── 01. What Is This ── */}
        <section className="mb-16">
          <SectionLabel number="01" title="What Is the Predictive Poverty Tracker?" />
          <div className="space-y-4 text-[15px] text-stone-700 leading-relaxed">
            <p>
              The Predictive Poverty Tracker is a public data intelligence system designed to
              identify and forecast poverty risk before it becomes entrenched. Unlike traditional
              poverty measurement tools — which rely on annual household surveys and deliver
              snapshots of conditions that already occurred — this framework is designed to
              aggregate microeconomic stress signals capable of detecting pressure{' '}
              <strong className="text-stone-900 font-semibold">
                30 to 90 days before it appears in official statistics
              </strong>.
            </p>
            <p>
              The foundational insight is that poverty does not appear suddenly. It is preceded
              by a predictable sequence of warning signals: a surge in eviction filings, a spike
              in utility disconnection notices, a rise in payday loan inquiries, a decline in
              school attendance. Research on these indicators suggests that each — independently
              and collectively — can forecast what comprehensive poverty surveys will eventually
              confirm, months later.
            </p>
            <p>
              The dashboard is designed for <strong className="text-stone-900 font-semibold">
              policymakers, nonprofit program managers, community advocates, and researchers
              </strong>{' '}
              who need to act early — before poverty crystallizes into long-term, generational
              conditions that are far more difficult and expensive to reverse.
            </p>
          </div>
        </section>

        {/* ── 02. Why Existing Data Falls Short ── */}
        <section className="mb-16">
          <SectionLabel number="02" title="Why Traditional Poverty Measurement Falls Short" />
          <div className="space-y-4 text-[15px] text-stone-700 leading-relaxed">
            <p>
              The Official Poverty Measure (OPM) — the primary federal poverty
              statistic since 1963 — counts only gross pre-tax cash income and ignores
              federal anti-poverty programs: SNAP, the Earned Income Tax Credit,
              housing vouchers, and Medicaid all go unrecognized. It uses thresholds derived
              from a 1963 food-cost survey, adjusted only for general inflation.
            </p>
            <p>
              Most critically for predictive purposes,{' '}
              <strong className="text-stone-900 font-semibold">
                the ACS and OPM are lagging indicators.
              </strong>{' '}
              Annual surveys like the American Community Survey — which underpin most
              state-level poverty estimates — reflect conditions from the prior calendar year
              and are typically published 12 to 18 months after the reference period. (Some
              federal datasets, such as monthly BLS unemployment figures, update far more
              frequently — but they measure labor market conditions rather than household
              poverty directly.) The result is that policymakers relying on comprehensive
              poverty surveys are always responding to a crisis that has already formed,
              rather than one that is still forming.
            </p>
            <p>
              The Predictive Poverty Tracker bypasses these limitations by tracking
              microeconomic stress signals at the state level — signals that move{' '}
              <em>ahead</em> of poverty, not behind it.
            </p>
          </div>
        </section>

        {/* ── 03. Four-Layer Architecture ── */}
        <section className="mb-16">
          <SectionLabel number="03" title="The Four-Layer Architecture" />
          <p className="text-[15px] text-stone-600 leading-relaxed mb-8">
            Every indicator in the framework is assigned to one of four layers. Each layer
            serves a distinct analytical purpose and triggers a different type of policy response.
          </p>
          <div className="space-y-4">
            {[
              {
                layer: 'Early Warning',
                subtitle: 'Target: 60–90 day lead time',
                description:
                  'Detect household transitions from stable to at-risk before formal poverty measurement catches them. These are the highest-priority alerts — the first moment at which financial distress becomes externally visible.',
                trigger: 'Increase case management outreach; pre-position emergency rental assistance funds; alert local nonprofit partners.',
              },
              {
                layer: 'Community Drain',
                subtitle: 'Friction indicators',
                description:
                  'Identify areas where predatory financial instruments are extracting purchasing power from residents. Payday lenders cluster in high-poverty areas, creating a feedback loop that deepens financial exclusion.',
                trigger: 'Enforce local payday lending ordinances; expand CDFI presence; launch financial counseling and credit-building programs.',
              },
              {
                layer: 'Mobility Barrier',
                subtitle: 'Rebound capacity',
                description:
                  "Measure a community's structural capacity to recover from economic shocks — the difference between temporary hardship and generational poverty. These indicators change slowly, but they set the ceiling for recovery.",
                trigger: 'Targeted broadband and transit infrastructure investment; school-based stability interventions; social bridge programs to increase economic cross-class connection.',
              },
              {
                layer: 'Structural',
                subtitle: 'Generational baseline',
                description:
                  'Long-run background conditions — wage dynamics and intergenerational mobility — that determine whether poverty, once it arrives, is likely to persist across generations.',
                trigger: 'Policy interventions at the state and federal level; workforce development programs; long-horizon community investment strategies.',
              },
            ].map(({ layer, subtitle, description, trigger }) => {
              const meta = LAYER_META[layer];
              return (
                <div
                  key={layer}
                  className={`${CARD} p-6 flex gap-5`}
                  style={{ borderLeft: `4px solid ${meta.color}` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3
                        className="font-display text-[17px] font-semibold"
                        style={{ color: meta.color }}
                      >
                        {layer}
                      </h3>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
                        {subtitle}
                      </span>
                    </div>
                    <p className="text-[14px] text-stone-700 leading-relaxed mb-3">{description}</p>
                    <div className="text-[12px] text-stone-500 leading-snug">
                      <span className="font-mono uppercase tracking-wider text-[9px] text-stone-400">
                        Recommended response:{' '}
                      </span>
                      {trigger}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 04. The Composite Risk Index ── */}
        <section className="mb-16">
          <SectionLabel number="04" title="The Composite Risk Index" />
          <div className="space-y-4 text-[15px] text-stone-700 leading-relaxed mb-8">
            <p>
              The Composite Risk Index (CRI) is a single number between 0 and 100 that
              summarizes overall poverty risk. It is calculated as a weighted sum of eight
              indicator values — each indicator multiplied by its assigned weight, then
              added together.
            </p>
            <p>
              Weights reflect the{' '}
              <strong className="text-stone-900 font-semibold">predictive power and lead time</strong>{' '}
              of each indicator.
              Leading indicators (those that signal trouble furthest in advance) receive
              higher weights. The two Early Warning indicators together account for 35% of
              the total score — the largest share of any layer.
            </p>
          </div>

          {/* Formula card */}
          <div className={`${CARD} p-7 mb-6`}>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400 mb-4">
              The formula
            </div>
            <div className="font-mono text-[13px] text-stone-800 leading-loose">
              <span className="text-stone-500">CRI =</span>
              {' '}(H1 × <strong>20%</strong>)
              {' '}+ (E1 × <strong>15%</strong>)
              {' '}+ (F2 × <strong>15%</strong>)
              {' '}+ (F4 × <strong>10%</strong>)
              <br className="hidden sm:block" />
              {'          '}+ (D1 × <strong>10%</strong>)
              {' '}+ (N2 × <strong>10%</strong>)
              {' '}+ (L3 × <strong>10%</strong>)
              {' '}+ (M2 × <strong>10%</strong>)
            </div>
            <div className="mt-5 pt-5 border-t border-stone-200 text-[13px] text-stone-600 leading-relaxed">
              <strong className="text-stone-800">Plain-English version:</strong> For each of
              the eight indicators, take the current value, multiply it by the weight for
              that indicator, and add all eight results together. The total is the CRI score.
            </div>
          </div>

          {/* Example from workbook */}
          <div className={`${CARD} p-7`}>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400 mb-4">
              Worked example — from Section D of the source workbook
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left font-mono text-[10px] uppercase tracking-wider text-stone-400 pb-2 pr-4">ID</th>
                    <th className="text-left font-mono text-[10px] uppercase tracking-wider text-stone-400 pb-2 pr-4">Indicator</th>
                    <th className="text-right font-mono text-[10px] uppercase tracking-wider text-stone-400 pb-2 pr-4">Example value</th>
                    <th className="text-right font-mono text-[10px] uppercase tracking-wider text-stone-400 pb-2 pr-4">Weight</th>
                    <th className="text-right font-mono text-[10px] uppercase tracking-wider text-stone-400 pb-2">Contribution</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 'H1', name: 'Eviction Filing Rate',          val: '3.5',  weight: '20%', contrib: '+0.70', layer: 'Early Warning' },
                    { id: 'E1', name: 'Final Disconnection Notice Rate',val: '18.0', weight: '15%', contrib: '+2.70', layer: 'Early Warning' },
                    { id: 'F2', name: 'Payday Loan Inquiry Index',      val: '45.0', weight: '15%', contrib: '+6.75', layer: 'Community Drain' },
                    { id: 'F4', name: 'Debt-in-Collections Rate',       val: '22.0', weight: '10%', contrib: '+2.20', layer: 'Community Drain' },
                    { id: 'D1', name: 'Broadband Non-Subscription Rate',val: '35.0', weight: '10%', contrib: '+3.50', layer: 'Mobility Barrier' },
                    { id: 'N2', name: 'Free & Reduced Lunch Rate',      val: '58.0', weight: '10%', contrib: '+5.80', layer: 'Mobility Barrier' },
                    { id: 'L3', name: 'Wage Growth vs. Inflation Spread',val:'−1.5', weight: '10%', contrib: '−0.15', layer: 'Structural' },
                    { id: 'M2', name: 'Immobility Score',               val: '72.0', weight: '10%', contrib: '+7.20', layer: 'Structural' },
                  ].map((row) => {
                    const meta = LAYER_META[row.layer];
                    return (
                      <tr key={row.id} className="border-b border-stone-100">
                        <td className="py-2.5 pr-4">
                          <span
                            className="font-mono text-[11px] font-semibold"
                            style={{ color: meta.color }}
                          >
                            {row.id}
                          </span>
                        </td>
                        <td className="py-2.5 pr-4 text-stone-700">{row.name}</td>
                        <td className="py-2.5 pr-4 text-right font-mono tabular-nums text-stone-600">{row.val}</td>
                        <td className="py-2.5 pr-4 text-right font-mono tabular-nums text-stone-600">{row.weight}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums font-semibold text-stone-900">{row.contrib}</td>
                      </tr>
                    );
                  })}
                  <tr className="border-t-2 border-stone-800">
                    <td colSpan={4} className="pt-3 font-display italic text-stone-700 text-[14px]">
                      Composite Risk Index
                    </td>
                    <td className="pt-3 text-right font-mono text-[17px] font-semibold text-stone-900 tabular-nums">
                      28.70
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[12px] text-stone-500 italic">
              A score of 28.70 falls in the Moderate Risk tier (21–40). Emerging stress signals
              are present but no crisis-level conditions are yet active.
            </p>
          </div>
        </section>

        {/* ── 05. The Eight Indicators ── */}
        <section className="mb-16">
          <SectionLabel number="05" title="The Eight Indicators" />
          <p className="text-[15px] text-stone-600 leading-relaxed mb-8">
            The eight indicators currently in the CRI are organized below by their layer.
            Each entry includes the plain-English definition of what the indicator measures,
            the reasoning for its inclusion, and the data source that will supply it when
            live feeds are connected.
          </p>
          <div className="space-y-5">
            {INDICATORS.map((ind) => {
              const meta = LAYER_META[ind.layer];
              return (
                <div
                  key={ind.id}
                  className={`${CARD} p-6`}
                  style={{ borderLeft: `4px solid ${meta.color}` }}
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="font-mono text-[15px] font-bold tabular-nums"
                        style={{ color: meta.color }}
                      >
                        {ind.id}
                      </span>
                      <div>
                        <h3 className="font-display text-[17px] font-semibold text-stone-900 leading-tight">
                          {ind.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <LayerBadge layer={ind.layer} />
                          <span className="text-stone-300">·</span>
                          <SignalBadge signal={ind.signal} />
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-stone-400 mb-1">Weight</div>
                      <div className="font-mono text-[20px] font-semibold text-stone-900 tabular-nums leading-none">
                        {(ind.weight * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>

                  <WeightBar weight={ind.weight} layerColor={meta.color} />

                  <div className="mt-5 grid grid-cols-1 gap-4">
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-stone-400 mb-1">
                        What it measures
                      </div>
                      <p className="text-[14px] text-stone-700 leading-relaxed">{ind.what}</p>
                    </div>
                    <div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-stone-400 mb-1">
                        Why it is in the index
                      </div>
                      <p className="text-[14px] text-stone-700 leading-relaxed">{ind.why}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-baseline gap-x-6 gap-y-1">
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400">Unit — </span>
                      <span className="font-mono text-[11px] text-stone-600">{ind.unit}</span>
                    </div>
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-stone-400">Live source — </span>
                      <span className="font-mono text-[11px] text-stone-600">{ind.source}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 06. Risk Tiers ── */}
        <section className="mb-16">
          <SectionLabel number="06" title="The Five Risk Tiers" />
          <p className="text-[15px] text-stone-600 leading-relaxed mb-8">
            Every CRI score maps to one of five risk tiers. Each tier has a specific score
            range, a plain-English risk description, and a recommended operational response
            for program managers and policymakers.
          </p>
          <div className="space-y-3">
            {TIERS.map((tier, i) => {
              const lo = i === 0 ? 0 : TIERS[i - 1].max + 1;
              return (
                <div
                  key={tier.name}
                  className={`${CARD} p-5 flex items-start gap-5`}
                >
                  <div
                    className="w-1 self-stretch rounded-full shrink-0"
                    style={{ backgroundColor: tier.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-4 mb-1">
                      <h3
                        className="font-mono text-[13px] font-semibold uppercase tracking-wider"
                        style={{ color: tier.color }}
                      >
                        {tier.name}
                      </h3>
                      <span className="font-mono text-[12px] text-stone-400 tabular-nums">
                        {lo}–{tier.max}
                      </span>
                    </div>
                    <p className="text-[14px] text-stone-700 leading-snug mb-2">{tier.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tier descriptions expanded */}
          <div className={`${CARD} p-7 mt-6`}>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400 mb-5">
              Operational guidance by tier
            </div>
            <div className="space-y-5 text-[14px] text-stone-700 leading-relaxed">
              <div>
                <strong className="font-mono text-[12px] uppercase tracking-wider" style={{ color: '#4a6d5c' }}>Low Risk (0–20)</strong>
                <p className="mt-1">Neighborhood or state conditions are stable. No immediate action required. Continue routine quarterly monitoring and maintain baseline data quality.</p>
              </div>
              <div>
                <strong className="font-mono text-[12px] uppercase tracking-wider" style={{ color: '#b08945' }}>Moderate Risk (21–40)</strong>
                <p className="mt-1">Emerging stress signals are present. Increase monitoring frequency to monthly. Alert case managers to begin outreach to at-risk households. Review emergency fund availability.</p>
              </div>
              <div>
                <strong className="font-mono text-[12px] uppercase tracking-wider" style={{ color: '#c86b3c' }}>High Risk (41–60)</strong>
                <p className="mt-1">Active early warning phase. Deploy targeted interventions now — pre-position emergency rental assistance and utility funds. Initiate case management outreach. Alert local nonprofit partners.</p>
              </div>
              <div>
                <strong className="font-mono text-[12px] uppercase tracking-wider" style={{ color: '#8b2e2a' }}>Severe Risk (61–80)</strong>
                <p className="mt-1">Poverty crystallization is underway — temporary hardship is transitioning into entrenched conditions. Emergency resource deployment required. Activate multi-agency coordination. Escalate to senior program leadership.</p>
              </div>
              <div>
                <strong className="font-mono text-[12px] uppercase tracking-wider" style={{ color: '#4a1614' }}>Crisis (81–100)</strong>
                <p className="mt-1">Systemic collapse conditions detected across multiple indicators simultaneously. Immediate multi-agency emergency response required. Escalate to city, county, or state emergency management. This tier signals that intervention alone is insufficient — structural policy change is needed.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 07. Forecasting ── */}
        <section className="mb-16">
          <SectionLabel number="07" title="Forecasting Approach" />
          <div className="space-y-4 text-[15px] text-stone-700 leading-relaxed">
            <p>
              The dashboard currently provides three forecast horizons (3-year, 5-year, and
              10-year) using a{' '}
              <strong className="text-stone-900 font-semibold">
                linear extrapolation of recent trend
              </strong>
              . A linear regression is fitted to the most recent 12 quarters of historical
              data, and projected forward. The shaded confidence band widens with the
              forecast horizon, reflecting greater uncertainty at longer time ranges.
            </p>
            <p>
              This method is transparent and auditable, but it does not account for
              seasonal cycles or non-linear dynamics. In Phase 4, the linear model will be
              replaced by a{' '}
              <strong className="text-stone-900 font-semibold">
                Seasonal ARIMA (SARIMA) model
              </strong>
              , which handles quarterly seasonality explicitly, and ultimately by a Bayesian
              Spatiotemporal Conditionally Autoregressive (CAR) model that borrows statistical
              strength across neighboring states and quantifies uncertainty more rigorously.
            </p>
          </div>
        </section>

        {/* ── 08. Data Status & Disclaimer ── */}
        <section className="mb-16" id="data-status">
          <SectionLabel number="08" title="Current Data Status" />

          {/* Disclaimer box */}
          <div
            className="rounded-2xl p-6 mb-8"
            style={{
              backgroundColor: 'rgba(176,137,69,0.10)',
              border: '1px solid rgba(176,137,69,0.30)',
            }}
          >
            <div className="font-mono text-[10px] uppercase tracking-wider text-[#b08945] mb-2">
              Important — Illustrative data only
            </div>
            <p className="text-[14px] text-stone-700 leading-relaxed">
              All indicator values currently displayed on the dashboard are{' '}
              <strong className="text-stone-900">simulated sample data</strong> generated
              algorithmically from 2023 ACS state-level poverty rates as a proxy. They are
              intended solely to demonstrate the interface, the index formula, and the
              risk-tier classification system. They do not reflect actual eviction rates,
              disconnection notice volumes, payday loan activity, or any other real-world
              indicator value for any state.{' '}
              <strong className="text-stone-900">
                No policy or programmatic decisions should be based on these figures.
              </strong>
            </p>
          </div>

          <div className="space-y-4 text-[15px] text-stone-700 leading-relaxed">
            <p>
              The simulated values are derived as follows: the ACS 2023 poverty rate for each
              state is used to position it along a normalized scale, and indicator values are
              generated around that baseline using a seeded random function — ensuring the
              dashboard renders consistently and that higher-poverty states score higher on
              the index. The CRI formula, weights, and tier boundaries are real and unchanged
              from the source workbook.
            </p>
            <p>
              Live data connections for all eight indicators are planned for Phase 2 and Phase
              4 of the project roadmap. When live data is connected, this page will be updated
              with the full source registry, update cadences, and data governance notes.
            </p>
          </div>
        </section>

        {/* ── 09. Sources ── */}
        <section className="mb-16">
          <SectionLabel number="09" title="Source Attribution" />

          {/* Currently connected */}
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-3">
            Currently connected
          </div>
          <div className={`${CARD} p-6 mb-8`}>
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left font-mono text-[10px] uppercase tracking-wider text-stone-400 pb-2 pr-6">Source</th>
                  <th className="text-left font-mono text-[10px] uppercase tracking-wider text-stone-400 pb-2">Used for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                <tr>
                  <td className="py-3 pr-6 font-semibold text-stone-800">
                    U.S. Census Bureau — American Community Survey (ACS) 2023
                  </td>
                  <td className="py-3 text-stone-600">
                    State-level poverty rates used to calibrate the simulated indicator values
                    in the current prototype
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 font-semibold text-stone-800">
                    Predictive Poverty Tracker Framework Workbook (internal)
                  </td>
                  <td className="py-3 text-stone-600">
                    CRI formula, indicator weights, tier boundaries, and all 48-indicator
                    registry definitions
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Planned sources */}
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500 mb-3">
            Planned data sources — Phase 4
          </div>
          <div className={`${CARD} p-6`}>
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left font-mono text-[10px] uppercase tracking-wider text-stone-400 pb-2 pr-6">Source</th>
                  <th className="text-left font-mono text-[10px] uppercase tracking-wider text-stone-400 pb-2">Indicator(s)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {[
                  { source: 'Eviction Lab, Princeton University', indicators: 'H1 — Eviction Filing Rate' },
                  { source: 'State Utility Providers / State Energy Departments', indicators: 'E1 — Final Disconnection Notice Rate' },
                  { source: 'Consumer Financial Protection Bureau (CFPB) / FinTech providers', indicators: 'F2 — Payday Loan Inquiry Volume; F4 — Debt-in-Collections Rate' },
                  { source: 'FCC Broadband Data Collection / U.S. Census ACS', indicators: 'D1 — Broadband Non-Subscription Rate' },
                  { source: 'National Center for Education Statistics (NCES)', indicators: 'N2 — Free & Reduced Lunch Rate' },
                  { source: 'Bureau of Labor Statistics — OES & CPI', indicators: 'L3 — Wage Growth vs. Inflation Spread' },
                  { source: 'Opportunity Insights, Harvard University — Opportunity Atlas', indicators: 'M2 — Immobility Score' },
                ].map((row) => (
                  <tr key={row.source}>
                    <td className="py-3 pr-6 text-stone-700">{row.source}</td>
                    <td className="py-3 font-mono text-[11px] text-stone-500">{row.indicators}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-5 text-[12px] text-stone-400 italic">
              Full source registry with URLs, update cadences, and data governance notes will
              be published here when live data feeds are connected.
            </p>
          </div>
        </section>

        {/* Footer nav */}
        <div className="pt-8 border-t border-stone-200 flex items-center justify-between">
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-wider text-stone-500 hover:text-stone-900 transition-colors"
          >
            ← Back to Dashboard
          </Link>
          <span className="font-mono text-[10px] text-stone-400">
            Predictive Poverty Tracker · Methodology v1.0
          </span>
        </div>

      </div>
    </div>
  );
}
