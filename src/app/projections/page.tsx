import Link from 'next/link'
import { PageNav } from '@/components/PageNav'
import { FUNDRAISING, PHASE_2, PHASE_3 } from '@/lib/fundraisingConfig'

// ROUGH NUMBERS — need proper financial modeling
// Toronto construction costs: $250-500/sqft depending on finish level
// Condo construction: $350-600/sqft
// Commercial fit-out: $150-400/sqft

const phases = [
  {
    name: 'Phase 1 · Wellness Center',
    sqft: 46500,
    costPerSqft: 430,
    items: [
      { name: 'Land Acquisition / Lease', cost: 5000000 },
      { name: 'Base Building Construction', cost: 12000000 },
      { name: 'Interior Fit-Out (13 rooms)', cost: 6500000 },
      { name: 'Specialized Equipment', cost: 3500000 },
      { name: 'Technology & Systems', cost: 1500000 },
      { name: 'Permits, Legal, Professional Fees', cost: 1200000 },
      { name: 'Working Capital (6 months)', cost: 1800000 },
      { name: 'Contingency (10%)', cost: 3150000 },
    ],
  },
  {
    name: 'Phase 2 · Vertical Build (Condos + Offices)',
    sqft: 80000,
    costPerSqft: 450,
    items: [
      { name: 'Structural Engineering & Reinforcement', cost: 4000000 },
      { name: 'Residential Units (est. 40-60 units)', cost: 24000000 },
      { name: 'Soundproofing & Acoustic Treatment', cost: 3000000 },
      { name: 'Vibration Dampening Systems', cost: 1500000 },
      { name: 'Practitioner Office Suites (20 units)', cost: 5000000 },
      { name: 'Common Areas & Hallways', cost: 2000000 },
      { name: 'Elevator Systems', cost: 1800000 },
      { name: 'Permits & Zoning', cost: 800000 },
      { name: 'Contingency (10%)', cost: 4200000 },
    ],
  },
  {
    name: 'Phase 3 · Outdoor Campus',
    sqft: 35000,
    costPerSqft: 280,
    items: [
      { name: 'Multi-Sport Field (turf + drainage)', cost: 2500000 },
      { name: 'Retractable Roof System', cost: 4500000 },
      { name: 'Skatepark (bowl + street)', cost: 1800000 },
      { name: 'Parking Garage (3 levels, 200 spots)', cost: 6000000 },
      { name: 'Rooftop Terrace Build-Out', cost: 1500000 },
      { name: 'Outdoor Training Area', cost: 800000 },
      { name: 'Dog Park (heated, covered)', cost: 600000 },
      { name: 'EV Charging Stations (20)', cost: 400000 },
      { name: 'Landscaping & Lighting', cost: 1200000 },
      { name: 'Contingency (10%)', cost: 1930000 },
    ],
  },
  {
    name: 'Energy & Sustainability',
    sqft: 0,
    costPerSqft: 0,
    items: [
      { name: 'Solar Panel Array (parking roof)', cost: 800000 },
      { name: 'Smart Glass Windows', cost: 1200000 },
      { name: 'Geothermal System', cost: 600000 },
      { name: 'LED Lighting (full building)', cost: 300000 },
      { name: 'Water Recovery System', cost: 250000 },
      { name: 'Energy Management Software', cost: 100000 },
    ],
  },
]

const revenue = [
  { name: 'Memberships (500 members × $150/mo)', monthly: 75000, annual: 900000 },
  { name: 'Day Passes (50/day × $25)', monthly: 37500, annual: 450000 },
  { name: 'Class & Workshop Fees', monthly: 25000, annual: 300000 },
  { name: 'Studio Rental (Music/Photo/Video)', monthly: 15000, annual: 180000 },
  { name: 'Café & Retail', monthly: 20000, annual: 240000 },
  { name: 'Event Hosting & Private Bookings', monthly: 12000, annual: 144000 },
  { name: 'Corporate Wellness Programs', monthly: 10000, annual: 120000 },
  { name: 'Practitioner Rent (20 × $2500/mo)', monthly: 50000, annual: 600000 },
  { name: 'Condo Presales Revenue', monthly: 0, annual: 0, note: 'One-time: est. $30-50M' },
  { name: 'Parking Revenue', monthly: 8000, annual: 96000 },
  { name: 'Rooftop Event Venue', monthly: 6000, annual: 72000 },
]

function formatM(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${n}`
}

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  border: '1px solid rgba(240,198,116,0.12)',
  borderRadius: '16px',
}

export default function ProjectionsPage() {
  const grandTotal = phases.reduce((sum, p) => sum + p.items.reduce((s, i) => s + i.cost, 0), 0)
  const totalMonthly = revenue.reduce((s, r) => s + r.monthly, 0)
  const totalAnnual = revenue.reduce((s, r) => s + r.annual, 0)

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-20 pb-12 md:pt-24 md:pb-20"
      style={{ background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)' }}>
      <PageNav />

      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-4xl font-bold tracking-[0.1em] mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(255,240,220,0.9)' }}>
            Financial Projections
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(255,200,150,0.3)' }}>
            Rough Estimates · Subject to Site & Market Conditions
          </p>
          <div className="text-3xl font-mono font-bold" style={{ color: '#f0c674' }}>
            {formatM(grandTotal)} Total Build
          </div>
        </div>

        {/* Phase breakdowns */}
        {phases.map((phase) => {
          const phaseTotal = phase.items.reduce((s, i) => s + i.cost, 0)
          return (
            <section key={phase.name} className="mb-6 p-5 md:p-6" style={panelStyle}>
              <div className="flex justify-between items-baseline mb-4">
                <h2 className="text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(240,198,116,0.5)' }}>
                  {phase.name}
                </h2>
                <span className="text-lg font-mono font-bold" style={{ color: '#f0c674' }}>
                  {formatM(phaseTotal)}
                </span>
              </div>
              {phase.sqft > 0 && (
                <p className="text-[0.5rem] mb-3" style={{ color: 'rgba(255,220,180,0.2)' }}>
                  ~{phase.sqft.toLocaleString()} sqft · ~${phase.costPerSqft}/sqft avg
                </p>
              )}
              <div className="space-y-1.5">
                {phase.items.map((item) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <span className="text-[0.6rem]" style={{ color: 'rgba(255,220,180,0.45)' }}>{item.name}</span>
                    <span className="text-[0.6rem] font-mono" style={{ color: 'rgba(255,220,180,0.6)' }}>
                      {formatM(item.cost)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )
        })}

        {/* Revenue projections */}
        <section className="mb-6 p-5 md:p-6" style={panelStyle}>
          <div className="flex justify-between items-baseline mb-4">
            <h2 className="text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(128,212,168,0.5)' }}>
              Projected Revenue (at capacity)
            </h2>
            <span className="text-lg font-mono font-bold" style={{ color: '#80d4a8' }}>
              {formatM(totalAnnual)}/yr
            </span>
          </div>
          <p className="text-[0.5rem] mb-3" style={{ color: 'rgba(255,220,180,0.2)' }}>
            Monthly: {formatM(totalMonthly)} · Excludes condo presale revenue
          </p>
          <div className="space-y-1.5">
            {revenue.map((r) => (
              <div key={r.name} className="flex justify-between items-center">
                <span className="text-[0.6rem]" style={{ color: 'rgba(255,220,180,0.45)' }}>{r.name}</span>
                <span className="text-[0.6rem] font-mono" style={{ color: r.note ? 'rgba(240,198,116,0.4)' : 'rgba(128,212,168,0.6)' }}>
                  {r.note || `${formatM(r.annual)}/yr`}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* NOI & Stabilization */}
        <section className="mb-6 p-5 md:p-6" style={panelStyle}>
          <h2 className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>
            Net Operating Income & Stabilization
          </h2>

          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: '#f0c674' }}>Stabilization Period</div>
              <p className="text-[0.6rem] leading-relaxed" style={{ color: 'rgba(255,220,180,0.4)' }}>
                Estimated 18-24 months from doors open to full operational capacity.
                Month 1-6: ramp-up phase (30-50% capacity). Month 6-12: growth phase
                (50-75%). Month 12-24: stabilization (75-95%). Full capacity target by
                end of Year 2.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { period: 'Year 1', revenue: '$1.5M', expenses: '$1.8M', noi: '-$300K', note: 'Ramp-up', color: '#e1306c' },
                { period: 'Year 2', revenue: '$2.5M', expenses: '$1.9M', noi: '$600K', note: 'Stabilizing', color: '#f0c674' },
                { period: 'Year 3+', revenue: '$3.1M', expenses: '$2.0M', noi: '$1.1M', note: 'Stabilized', color: '#80d4a8' },
              ].map((yr) => (
                <div key={yr.period} className="p-3 rounded-xl" style={{ background: 'rgba(240,198,116,0.03)', border: '1px solid rgba(240,198,116,0.06)' }}>
                  <div className="text-xs font-bold mb-1" style={{ color: yr.color }}>{yr.period}</div>
                  <div className="text-[0.5rem] mb-0.5" style={{ color: 'rgba(255,220,180,0.3)' }}>Revenue: {yr.revenue}</div>
                  <div className="text-[0.5rem] mb-0.5" style={{ color: 'rgba(255,220,180,0.3)' }}>Expenses: {yr.expenses}</div>
                  <div className="text-[0.55rem] font-mono font-bold" style={{ color: yr.color }}>NOI: {yr.noi}</div>
                  <div className="text-[0.4rem] mt-1" style={{ color: 'rgba(255,220,180,0.2)' }}>{yr.note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Operating Expenses */}
        <section className="mb-6 p-5 md:p-6" style={panelStyle}>
          <div className="flex justify-between items-baseline mb-4">
            <h2 className="text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(225,48,108,0.5)' }}>
              Estimated Annual Operating Expenses
            </h2>
            <span className="text-lg font-mono font-bold" style={{ color: '#e1306c' }}>
              ~$2.0M/yr
            </span>
          </div>
          <div className="space-y-1.5">
            {[
              { name: 'Staff & Payroll (40+ employees)', cost: '$850K' },
              { name: 'Lease / Mortgage Payments', cost: '$400K' },
              { name: 'Utilities & Maintenance', cost: '$200K' },
              { name: 'Insurance', cost: '$120K' },
              { name: 'Marketing & Content', cost: '$100K' },
              { name: 'Technology & Software', cost: '$80K' },
              { name: 'Supplies & Equipment Replacement', cost: '$100K' },
              { name: 'Professional Services (Legal, Accounting)', cost: '$75K' },
              { name: 'Contingency (5%)', cost: '$95K' },
            ].map((item) => (
              <div key={item.name} className="flex justify-between items-center">
                <span className="text-[0.6rem]" style={{ color: 'rgba(255,220,180,0.45)' }}>{item.name}</span>
                <span className="text-[0.6rem] font-mono" style={{ color: 'rgba(225,48,108,0.5)' }}>{item.cost}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Investor Returns */}
        <section className="mb-6 p-5 md:p-6" style={panelStyle}>
          <h2 className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>
            Projected Investor Returns
          </h2>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: '#f0c674' }}>Phase 1 — Wellness Center</div>
              <p className="text-[0.6rem] leading-relaxed" style={{ color: 'rgba(255,220,180,0.4)' }}>
                Stabilized NOI of ~$1.1M/yr on $35M investment = ~3.1% cap rate on operations alone.
                Combined with brand value growth, membership equity, and IP development, total
                returns projected at 8-12% annually once stabilized.
              </p>
            </div>
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: '#80d4a8' }}>Phase 2 — Condo Presales</div>
              <p className="text-[0.6rem] leading-relaxed" style={{ color: 'rgba(255,220,180,0.4)' }}>
                Estimated $30-50M in presale revenue from 40-60 residential units.
                At $46M construction cost, presales alone could recover the entire
                vertical build investment, with practitioner office rentals ($600K/yr)
                providing ongoing returns.
              </p>
            </div>
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: '#7eb8da' }}>Full Vision — Combined Returns</div>
              <p className="text-[0.6rem] leading-relaxed" style={{ color: 'rgba(255,220,180,0.4)' }}>
                Operations ($1.1M NOI) + Practitioner Rent ($600K) + Parking/Events ($170K)
                = ~$1.87M annual recurring income. Condo presales provide one-time capital
                recovery. Global expansion (licensing model) creates exponential upside.
              </p>
            </div>
          </div>
        </section>

        {/* Key metrics */}
        <section className="mb-6 p-5 md:p-6" style={panelStyle}>
          <h2 className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>
            Key Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Build Cost', value: formatM(grandTotal), color: '#f0c674' },
              { label: 'Annual Revenue', value: formatM(totalAnnual), color: '#80d4a8' },
              { label: 'Monthly Revenue', value: formatM(totalMonthly), color: '#80d4a8' },
              { label: 'Payback Period', value: `~${Math.ceil(grandTotal / totalAnnual)} yrs`, color: '#7eb8da' },
              { label: 'Condo Presale', value: '$30-50M', color: '#f0c674' },
              { label: 'Net After Presale', value: 'Positive', color: '#80d4a8' },
              { label: 'Practitioner Rev', value: `${formatM(600000)}/yr`, color: '#80d4a8' },
              { label: 'Break-Even Members', value: '~350', color: '#7eb8da' },
            ].map((m) => (
              <div key={m.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(240,198,116,0.03)' }}>
                <div className="text-lg font-mono font-bold" style={{ color: m.color }}>{m.value}</div>
                <div className="text-[0.45rem] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(255,220,180,0.25)' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(225,48,108,0.03)', border: '1px solid rgba(225,48,108,0.1)' }}>
          <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-2 text-center" style={{ color: 'rgba(225,48,108,0.4)' }}>
            Important Disclaimer
          </div>
          <p className="text-[0.55rem] text-center leading-relaxed" style={{ color: 'rgba(255,220,180,0.3)' }}>
            All numbers presented are rough preliminary estimates currently being refined.
            These projections are for planning and discussion purposes only and should not be
            considered financial advice. Actual costs, revenues, and returns will depend on
            site selection, market conditions, construction timelines, zoning approvals,
            financing terms, and detailed architectural plans. Professional financial modeling,
            legal review, and due diligence are required before any investment decisions.
            Numbers are actively being updated as the project progresses.
          </p>
        </div>
        <div className="text-center">
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/pitch" className="text-[0.55rem] px-4 py-1.5 rounded-full"
              style={{ border: '1px solid rgba(240,198,116,0.15)', color: 'rgba(255,220,180,0.3)', textDecoration: 'none' }}>
              ← Business Overview
            </Link>
            <Link href="/world" className="text-[0.55rem] px-4 py-1.5 rounded-full"
              style={{ border: '1px solid rgba(128,212,168,0.15)', color: 'rgba(128,212,168,0.3)', textDecoration: 'none' }}>
              Explore the World →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
