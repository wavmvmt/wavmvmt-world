// Update these numbers as capital gets raised
// This drives the fundraising display in the 3D world HUD

export type PhaseStatus = 'completed' | 'active' | 'pending'

export const FUNDRAISING = {
  goal: 35_000_000,       // $35M Phase 1 — wellness center buildout
  raised: 0,              // Current amount raised — update as deals close
  currency: 'USD',
  location: 'Toronto, ON',
  milestones: [
    { amount: 500_000,    label: 'Seed round closed',              reached: false },
    { amount: 1_500_000,  label: 'Site secured',                   reached: false },
    { amount: 3_000_000,  label: 'Architectural plans final',      reached: false },
    { amount: 5_000_000,  label: 'Construction begins',            reached: false },
    { amount: 8_000_000,  label: 'Structure complete',             reached: false },
    { amount: 12_000_000, label: 'Interior buildout',              reached: false },
    { amount: 16_000_000, label: 'Equipment & tech installed',     reached: false },
    { amount: 20_000_000, label: 'Doors open',                     reached: false },
    { amount: 25_000_000, label: 'Phase 1 fully operational',      reached: false },
    { amount: 30_000_000, label: 'Expansion planning',             reached: false },
    { amount: 35_000_000, label: 'Phase 1 complete + reserves',    reached: false },
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

// Phase 2: Vertical expansion — practitioner offices above the center
// Separate funding round, requires rezoning approval
export const PHASE_2 = {
  name: 'Vertical Build — Condos + Practitioner Offices',
  additionalCost: 46_000_000,  // $46M for residential + commercial upper floors
  additionalSqft: 80_000,      // ~80K sq ft (condos + offices + common areas)
  status: 'vision' as const,   // vision | planning | approved | funded | building
  description: 'Soundproofed upper floors housing wellness practitioners, creating a full-spectrum health ecosystem under one roof.',
  requirements: [
    'Municipal rezoning approval (mixed-use)',
    'Structural engineering for vertical load',
    'Acoustic isolation between floors (STC 65+)',
    'Vibration dampening from gym/amphitheatre below',
    'Separate HVAC per floor',
    'Elevator + accessible stairwell',
  ],
  units: [
    { type: 'Massage Therapy',       count: 6, sqft: 250, revenue: '$3,600/mo each' },
    { type: 'Chiropractic',          count: 3, sqft: 400, revenue: '$5,500/mo each' },
    { type: 'Acupuncture',           count: 3, sqft: 250, revenue: '$3,200/mo each' },
    { type: 'Psychology / Therapy',  count: 8, sqft: 200, revenue: '$2,800/mo each' },
    { type: 'Counselling',           count: 4, sqft: 200, revenue: '$2,400/mo each' },
    { type: 'Peer Support',          count: 2, sqft: 300, revenue: '$1,800/mo each' },
    { type: 'Naturopathy',           count: 2, sqft: 350, revenue: '$4,000/mo each' },
    { type: 'Physiotherapy',         count: 3, sqft: 400, revenue: '$5,000/mo each' },
    { type: 'Shared amenities',      count: 1, sqft: 3150, revenue: 'Common' },
  ],
  projectedMonthlyRevenue: 105_000, // ~$105K/mo from unit rentals
  projectedAnnualRevenue: 1_260_000, // ~$1.26M/yr
  tenantPerks: [
    'Discounted WAVMVMT Center access (all facilities)',
    'Priority room & studio booking',
    'Monthly wellness credits ($200 value)',
    'Free community events & workshops',
    'Cross-referral network with other practitioners',
    'Shared waiting area & reception services',
  ],
}

// Phase 3: Outdoor Campus
export const PHASE_3 = {
  name: 'Outdoor Campus',
  additionalCost: 21_000_000,  // $21M — retractable roof is expensive
  status: 'vision' as const,
  description: 'Retractable-roof sports field, skatepark, outdoor training, and parking garage with rooftop terrace.',
  components: [
    { name: 'Retractable-Roof Field', cost: 3_500_000, features: ['Soccer/football', 'Modular tent system', 'LED lighting', 'All-weather turf'] },
    { name: 'Skatepark', cost: 1_200_000, features: ['Bowl section', 'Street section', 'Night lighting', 'Spectator seating'] },
    { name: 'Parking Garage', cost: 2_800_000, features: ['200 spots (3 levels)', 'Rooftop terrace', 'EV charging (20)', 'Ground floor retail'] },
    { name: 'Outdoor Training', cost: 500_000, features: ['Calisthenics rigs', 'Sprint track', 'Agility course'] },
  ],
}

// Education & Skills Programming (runs in Education Wing)
export const EDUCATION_PROGRAMS = {
  categories: [
    {
      name: 'Business & Entrepreneurship',
      classes: ['Startup Fundamentals', 'Pitch Practice Lab', 'Business Plan Workshop', 'Marketing 101', 'Sales & Negotiation'],
    },
    {
      name: 'Financial Literacy',
      classes: ['Budgeting & Saving', 'Investing Basics', 'Tax Planning', 'Credit Building', 'Real Estate Fundamentals'],
    },
    {
      name: 'Tech & AI',
      classes: ['Intro to Coding (Python)', 'Web Development Bootcamp', 'AI & Machine Learning', 'App Development', 'Cybersecurity Basics'],
    },
    {
      name: 'Creative Skills',
      classes: ['Music Production', 'Video Editing', 'Graphic Design', 'Photography', 'Content Creation'],
    },
    {
      name: 'Life Skills',
      classes: ['Mental Health & EQ', 'Nutrition & Meal Prep', 'Public Speaking', 'Leadership', 'Time Management'],
    },
  ],
}

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`
  return `$${amount}`
}
