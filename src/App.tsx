import { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ValueMode = 'single' | 'range'

interface AppState {
  setupFee: string
  pricePerReply: string
  responses: string
  bookRate1: string
  showupRate1: string
  bookRate2: string
  showupRate2: string
  closeRate: string
  valueMode: ValueMode
  premium: string
  commission: string
  tenure: string
  premiumMin: string
  premiumMax: string
  commissionMin: string
  commissionMax: string
  tenureMin: string
  tenureMax: string
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function parseNum(s: string, fallback: number): number {
  const n = parseFloat(s)
  return isNaN(n) || n < 0 ? fallback : n
}

function fmtMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${Math.round(n).toLocaleString('en-US')}`
  return `$${Math.round(n)}`
}

function fmtCount(n: number): string {
  return Math.floor(n).toString()
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-800">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
          {title}
        </span>
      </div>
      <div className="p-4 space-y-3">{children}</div>
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  prefix?: string
  suffix?: string
  placeholder?: string
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm text-slate-400 flex-1 leading-tight">{label}</label>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {prefix && <span className="text-sm text-slate-500 select-none">{prefix}</span>}
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-sm text-white text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-600"
        />
        {suffix && <span className="text-sm text-slate-500 select-none">{suffix}</span>}
      </div>
    </div>
  )
}

function RangeField({
  label,
  minVal,
  maxVal,
  onMinChange,
  onMaxChange,
  prefix,
  suffix,
}: {
  label: string
  minVal: string
  maxVal: string
  onMinChange: (v: string) => void
  onMaxChange: (v: string) => void
  prefix?: string
  suffix?: string
}) {
  const inputCls =
    'flex-1 min-w-0 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-sm text-white text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-600'

  return (
    <div className="space-y-1.5">
      <span className="text-sm text-slate-400">{label}</span>
      <div className="flex items-center gap-1.5">
        {prefix && <span className="text-sm text-slate-500 select-none">{prefix}</span>}
        <input
          type="number"
          value={minVal}
          onChange={e => onMinChange(e.target.value)}
          placeholder="Min"
          className={inputCls}
        />
        <span className="text-slate-600 select-none">–</span>
        {prefix && <span className="text-sm text-slate-500 select-none">{prefix}</span>}
        <input
          type="number"
          value={maxVal}
          onChange={e => onMaxChange(e.target.value)}
          placeholder="Max"
          className={inputCls}
        />
        {suffix && <span className="text-sm text-slate-500 select-none">{suffix}</span>}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  variant = 'default',
}: {
  label: string
  value: string
  variant?: 'default' | 'success' | 'info'
}) {
  const valueColor =
    variant === 'success'
      ? 'text-emerald-400'
      : variant === 'info'
        ? 'text-blue-400'
        : 'text-white'

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 min-w-0">
      <div className={`text-2xl font-bold tabular-nums leading-none break-all ${valueColor}`}>
        {value}
      </div>
      <div className="text-xs text-slate-500 mt-1.5 leading-tight">{label}</div>
    </div>
  )
}

interface FunnelStage {
  name: string
  count: number
  rate: string
  isLast: boolean
}

function FunnelViz({ stages }: { stages: FunnelStage[] }) {
  const maxCount = stages[0]?.count ?? 1

  return (
    <div className="space-y-2">
      {stages.map(stage => {
        const pct = maxCount > 0 ? Math.max((stage.count / maxCount) * 100, 0) : 0
        return (
          <div key={stage.name} className="flex items-center gap-3">
            <div className="w-40 flex-shrink-0 text-xs text-slate-400 leading-tight">
              {stage.name}
            </div>
            <div className="flex-1 relative h-8 bg-slate-800 rounded-lg overflow-hidden border border-slate-700/50">
              <div
                className={`h-full transition-all duration-500 ease-out ${
                  stage.isLast ? 'bg-emerald-700' : 'bg-blue-800'
                }`}
                style={{ width: `${pct}%` }}
              />
              <div className="absolute inset-0 flex items-center px-3">
                <span
                  className={`text-sm font-semibold ${
                    stage.isLast ? 'text-emerald-300' : 'text-slate-200'
                  }`}
                >
                  {fmtCount(stage.count)}
                </span>
              </div>
            </div>
            <div className="w-12 flex-shrink-0 text-right text-xs text-slate-500 tabular-nums">
              {stage.rate}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Defaults & App ───────────────────────────────────────────────────────────

const DEFAULTS: AppState = {
  setupFee: '3000',
  pricePerReply: '150',
  responses: '',
  bookRate1: '',
  showupRate1: '',
  bookRate2: '',
  showupRate2: '',
  closeRate: '',
  valueMode: 'single',
  premium: '',
  commission: '',
  tenure: '',
  premiumMin: '',
  premiumMax: '',
  commissionMin: '',
  commissionMax: '',
  tenureMin: '',
  tenureMax: '',
}

export default function App() {
  const [s, setS] = useState<AppState>(DEFAULTS)

  function set<K extends keyof AppState>(key: K) {
    return (value: AppState[K]) => setS(prev => ({ ...prev, [key]: value }))
  }

  // ─── Funnel math ───────────────────────────────────────────────────────────
  const r = Math.max(0, parseNum(s.responses, 0))
  const booked1 = r * (parseNum(s.bookRate1, 0) / 100)
  const attended1 = booked1 * (parseNum(s.showupRate1, 0) / 100)
  const booked2 = attended1 * (parseNum(s.bookRate2, 0) / 100)
  const attended2 = booked2 * (parseNum(s.showupRate2, 0) / 100)
  const customers = attended2 * (parseNum(s.closeRate, 0) / 100)

  const repliesPerClient = customers > 0.001 ? r / customers : 0
  const cac = repliesPerClient * parseNum(s.pricePerReply, 150)
  const efficiency = r > 0 && customers > 0.001 ? (customers / r) * 100 : 0

  // ─── LTV math ──────────────────────────────────────────────────────────────
  const hasClientData =
    s.valueMode === 'single'
      ? s.premium !== '' && s.commission !== '' && s.tenure !== '' && parseNum(s.premium, 0) > 0
      : s.premiumMin !== '' && s.premiumMax !== '' && s.commissionMin !== '' &&
        s.commissionMax !== '' && s.tenureMin !== '' && s.tenureMax !== '' &&
        parseNum(s.premiumMin, 0) > 0 && parseNum(s.premiumMax, 0) > 0

  let ltvDisplay = '—'
  let ltvRatioDisplay = '—'
  let tenureDisplay = ''

  if (hasClientData) {
    if (s.valueMode === 'single') {
      const p = parseNum(s.premium, 0)
      const c = parseNum(s.commission, 15) / 100
      const t = parseNum(s.tenure, 3)
      const ltv = p * c * t
      ltvDisplay = fmtMoney(ltv)
      ltvRatioDisplay = cac > 0 ? `${(ltv / cac).toFixed(1)}x` : '—'
      tenureDisplay = `${t} yr${t !== 1 ? 's' : ''}`
    } else {
      const pMin = parseNum(s.premiumMin, 0)
      const pMax = parseNum(s.premiumMax, 0)
      const cMin = parseNum(s.commissionMin, 10) / 100
      const cMax = parseNum(s.commissionMax, 20) / 100
      const tMin = parseNum(s.tenureMin, 2)
      const tMax = parseNum(s.tenureMax, 5)
      const ltvMin = pMin * cMin * tMin
      const ltvMax = pMax * cMax * tMax
      ltvDisplay = `${fmtMoney(ltvMin)} – ${fmtMoney(ltvMax)}`
      ltvRatioDisplay = cac > 0 ? `${(ltvMin / cac).toFixed(1)}x – ${(ltvMax / cac).toFixed(1)}x` : '—'
      tenureDisplay = `${tMin}–${tMax} yrs`
    }
  }

  const funnelStages: FunnelStage[] = [
    { name: 'Positive Responses', count: r, rate: '—', isLast: false },
    { name: '1st Call Booked', count: booked1, rate: `${parseNum(s.bookRate1, 80)}%`, isLast: false },
    { name: '1st Call Attended', count: attended1, rate: `${parseNum(s.showupRate1, 80)}%`, isLast: false },
    { name: '2nd Call Booked', count: booked2, rate: `${parseNum(s.bookRate2, 100)}%`, isLast: false },
    { name: '2nd Call Attended', count: attended2, rate: `${parseNum(s.showupRate2, 70)}%`, isLast: false },
    { name: 'Clients Closed', count: customers, rate: `${parseNum(s.closeRate, 50)}%`, isLast: true },
  ]

  const hasResult = customers >= 0.01
  const hasFullResult = hasResult && hasClientData

  const closingText = (() => {
    if (!hasResult) return 'Adjust the inputs on the left to see your ROI projection.'
    if (!hasClientData)
      return `You get 1 new client for every ${fmtCount(repliesPerClient)} replies at a cost of ${fmtMoney(cac)} per client. Enter client value details on the left to see the full ROI statement.`
    return `You are paying ${fmtMoney(cac)} today to get ${ltvDisplay} within the next ${tenureDisplay}. Is that a deal that would make sense to make?`
  })()

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans antialiased">
      {/* ── Header ── */}
      <header className="border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-base font-semibold text-white leading-none">
              Cold Email ROI Calculator
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Performance-based lead generation · Insurance brokerage · $3,000 setup + $150 per positive reply
            </p>
          </div>
          <button
            onClick={() => setS(DEFAULTS)}
            className="text-xs text-slate-500 hover:text-slate-300 border border-slate-700 hover:border-slate-600 rounded-lg px-3 py-1.5 transition-colors flex-shrink-0"
          >
            Reset to defaults
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 items-start">

          {/* ════ INPUTS ════ */}
          <aside className="space-y-4 lg:sticky lg:top-[73px]">
            <Section title="Pricing & Volume">
              <InputField
                label="Setup fee (one-time, upfront)"
                value={s.setupFee}
                onChange={set('setupFee')}
                prefix="$"
              />
              <InputField
                label="Price per positive reply"
                value={s.pricePerReply}
                onChange={set('pricePerReply')}
                prefix="$"
              />
              <InputField
                label="Positive responses to model"
                value={s.responses}
                onChange={set('responses')}
              />
            </Section>

            <Section title="Conversion Funnel">
              <InputField
                label="1st call book rate"
                value={s.bookRate1}
                onChange={set('bookRate1')}
                suffix="%"
              />
              <InputField
                label="1st call show-up rate"
                value={s.showupRate1}
                onChange={set('showupRate1')}
                suffix="%"
              />
              <div className="!mt-4 pt-3 border-t border-slate-800/80">
                <InputField
                  label="2nd call book rate"
                  value={s.bookRate2}
                  onChange={set('bookRate2')}
                  suffix="%"
                />
              </div>
              <InputField
                label="2nd call show-up rate"
                value={s.showupRate2}
                onChange={set('showupRate2')}
                suffix="%"
              />
              <InputField
                label="Close rate"
                value={s.closeRate}
                onChange={set('closeRate')}
                suffix="%"
              />
            </Section>

            <Section title="Client Value">
              <div className="flex gap-2">
                {(['single', 'range'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => set('valueMode')(mode)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      s.valueMode === mode
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-300 border border-slate-700'
                    }`}
                  >
                    {mode === 'single' ? 'Single value' : 'Range'}
                  </button>
                ))}
              </div>

              {s.valueMode === 'single' ? (
                <div className="space-y-3">
                  <InputField
                    label="Avg client premium"
                    value={s.premium}
                    onChange={set('premium')}
                    prefix="$"
                  />
                  <InputField
                    label="Avg commission rate"
                    value={s.commission}
                    onChange={set('commission')}
                    suffix="%"
                  />
                  <InputField
                    label="Avg client tenure"
                    value={s.tenure}
                    onChange={set('tenure')}
                    suffix="yrs"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <RangeField
                    label="Avg client premium"
                    minVal={s.premiumMin}
                    maxVal={s.premiumMax}
                    onMinChange={set('premiumMin')}
                    onMaxChange={set('premiumMax')}
                    prefix="$"
                  />
                  <RangeField
                    label="Avg commission rate"
                    minVal={s.commissionMin}
                    maxVal={s.commissionMax}
                    onMinChange={set('commissionMin')}
                    onMaxChange={set('commissionMax')}
                    suffix="%"
                  />
                  <RangeField
                    label="Avg client tenure"
                    minVal={s.tenureMin}
                    maxVal={s.tenureMax}
                    onMinChange={set('tenureMin')}
                    onMaxChange={set('tenureMax')}
                    suffix="yrs"
                  />
                </div>
              )}

              <div className="!mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-600 leading-relaxed">
                LTV = premium × commission % × tenure
              </div>
            </Section>
          </aside>

          {/* ════ OUTPUTS ════ */}
          <div className="space-y-6">
            {/* Stats grid */}
            <div>
              <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Results
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard
                  label="New Clients"
                  value={hasResult ? fmtCount(customers) : '—'}
                  variant={hasResult ? 'success' : 'default'}
                />
                <StatCard
                  label="Replies per New Client"
                  value={repliesPerClient > 0 ? fmtCount(repliesPerClient) : '—'}
                />
                <StatCard
                  label="Cost per Client (CAC)"
                  value={cac > 0 ? fmtMoney(cac) : '—'}
                  variant={cac > 0 ? 'info' : 'default'}
                />
                <StatCard
                  label="Client LTV"
                  value={ltvDisplay}
                  variant={hasClientData ? 'success' : 'default'}
                />
                <StatCard
                  label="LTV : CAC"
                  value={ltvRatioDisplay}
                  variant={hasClientData && cac > 0 ? 'success' : 'default'}
                />
                <StatCard
                  label="Funnel Efficiency"
                  value={efficiency > 0 ? `${efficiency.toFixed(1)}%` : '—'}
                />
              </div>
            </div>

            {/* Closing statement — the "money shot" of the sales call */}
            <div
              className={`rounded-xl border p-5 transition-colors ${
                hasFullResult
                  ? 'bg-emerald-950/50 border-emerald-800/60'
                  : 'bg-blue-950/30 border-blue-900/50'
              }`}
            >
              <div
                className={`text-[10px] font-bold uppercase tracking-widest mb-2.5 ${
                  hasFullResult ? 'text-emerald-400' : 'text-blue-500'
                }`}
              >
                The Close
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">{closingText}</p>
            </div>

            {/* Funnel visualization */}
            <div>
              <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Pipeline Funnel
              </h2>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <FunnelViz stages={funnelStages} />
              </div>
            </div>

            {/* Breakdown table */}
            <div>
              <h2 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Pipeline Breakdown
              </h2>
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500 font-normal">Stage</th>
                      <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500 font-normal">People</th>
                      <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500 font-normal">Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {funnelStages.map((stage, i) => (
                      <tr
                        key={stage.name}
                        className={`border-b border-slate-800/50 last:border-0 ${
                          stage.isLast
                            ? 'bg-emerald-950/40'
                            : i % 2 === 1
                              ? 'bg-slate-800/20'
                              : ''
                        }`}
                      >
                        <td
                          className={`px-4 py-2.5 ${
                            stage.isLast ? 'text-emerald-400 font-medium' : 'text-slate-300'
                          }`}
                        >
                          {stage.name}
                        </td>
                        <td
                          className={`px-4 py-2.5 text-right tabular-nums font-medium ${
                            stage.isLast ? 'text-emerald-400' : 'text-white'
                          }`}
                        >
                          {fmtCount(stage.count)}
                        </td>
                        <td className="px-4 py-2.5 text-right text-slate-500 tabular-nums">
                          {stage.rate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800/60 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <p className="text-xs text-slate-700">
            Cold Email ROI Calculator · Performance-based · Insurance brokerage
          </p>
        </div>
      </footer>
    </div>
  )
}
