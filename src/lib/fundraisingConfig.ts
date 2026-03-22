// Update these numbers as capital gets raised
// This drives the fundraising display in the 3D world HUD

export type PhaseStatus = 'completed' | 'active' | 'pending'

export const FUNDRAISING = {
  goal: 20_000_000,       // $20M flagship WAVMVMT Center — no compromises
  raised: 0,              // Current amount raised — update as deals close
  currency: 'USD',
  location: 'Toronto, ON',
  milestones: [
    { amount: 500_000,    label: 'Seed round closed',          reached: false },
    { amount: 1_500_000,  label: 'Site secured',               reached: false },
    { amount: 3_000_000,  label: 'Architectural plans final',  reached: false },
    { amount: 5_000_000,  label: 'Construction begins',        reached: false },
    { amount: 8_000_000,  label: 'Structure complete',         reached: false },
    { amount: 12_000_000, label: 'Interior buildout',          reached: false },
    { amount: 16_000_000, label: 'Equipment & tech installed', reached: false },
    { amount: 20_000_000, label: 'Doors open',                 reached: false },
  ],
  // Real-world construction phases
  phases: [
    { name: 'Site Selection',       status: 'active' as PhaseStatus,    pct: 40 },
    { name: 'Land Acquisition',     status: 'pending' as PhaseStatus,   pct: 0 },
    { name: 'Design & Permits',     status: 'pending' as PhaseStatus,   pct: 0 },
    { name: 'Foundation',           status: 'pending' as PhaseStatus,   pct: 0 },
    { name: 'Structure',            status: 'pending' as PhaseStatus,   pct: 0 },
    { name: 'Interior',             status: 'pending' as PhaseStatus,   pct: 0 },
    { name: 'Equipment & Tech',     status: 'pending' as PhaseStatus,   pct: 0 },
    { name: 'Grand Opening',        status: 'pending' as PhaseStatus,   pct: 0 },
  ],
}

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}
