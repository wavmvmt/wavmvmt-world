export interface RoomDef {
  name: string
  x: number
  z: number
  w: number
  d: number
  h: number
  color: number
  buildPct: number
  /** Real-world square footage */
  sqft: number
  /** What this room will contain IRL */
  features: string[]
  /** One-line vision statement */
  vision: string
  /** Estimated buildout cost for this room */
  buildCost: number
}

export const COLORS = {
  bg: 0x1a1520,
  floor: 0x1e1a28,
  concrete: 0x342e3d,
  steel: 0x5a5060,
  copper: 0x8a6048,
  woodDk: 0x5a3a20,
  woodLt: 0x8a6a3a,
  gold: 0xf0c674,
  amber: 0xe8a050,
  rose: 0xe8a0bf,
  lavender: 0xb48ead,
  sage: 0x80d4a8,
  sky: 0x88c0d0,
  cream: 0xfff0d8,
  outline: 0x2a2030,
} as const

export const SKIN_TONES = [0xf5d0a8, 0xd4a070, 0xa06830, 0x804820, 0xf0c898, 0xc08048]

export const WORKER_DATA = [
  { name: 'Rico', hat: COLORS.amber },
  { name: 'Jun', hat: COLORS.sky },
  { name: 'Aisha', hat: COLORS.gold },
  { name: 'Marco', hat: COLORS.sage },
  { name: 'Kira', hat: COLORS.lavender },
  { name: 'Dev', hat: COLORS.rose },
] as const

export const ROOMS: RoomDef[] = [
  {
    name: 'Parkour Gym', x: -100, z: -80, w: 130, d: 100, h: 40,
    color: COLORS.lavender, buildPct: 30, sqft: 8000,
    vision: 'The largest urban parkour facility in Canada', buildCost: 2_800_000,
    features: ['Multi-level obstacle courses', 'Wall-run zones (20ft)', 'Vault boxes & precision trainers', 'Olympic foam pit', 'Trampoline grid', 'Bouldering wall'],
  },
  {
    name: 'Sound Bath', x: 110, z: -90, w: 85, d: 85, h: 32,
    color: COLORS.gold, buildPct: 10, sqft: 3000,
    vision: 'A temple of frequency and healing vibration', buildCost: 850_000,
    features: ['12 crystal singing bowls', '20 heated meditation mats', 'Acoustic treatment (NRC 0.95)', 'Binaural beat system', 'Chromotherapy lighting', 'Float-grade silence'],
  },
  {
    name: 'Music Studio', x: 110, z: 50, w: 85, d: 60, h: 28,
    color: COLORS.rose, buildPct: 5, sqft: 2500,
    vision: 'Professional recording accessible to every creator', buildCost: 1_200_000,
    features: ['3 isolation booths', '48-channel mixing console', 'Vocal booth with Neumann U87', 'Beat lab with MPC/Push', 'Dolby Atmos monitoring', 'AI-assisted mastering suite'],
  },
  {
    name: 'Cafe & Lounge', x: -105, z: 55, w: 100, d: 75, h: 24,
    color: COLORS.sky, buildPct: 3, sqft: 3500,
    vision: 'Where community happens between sessions', buildCost: 950_000,
    features: ['Full espresso bar & kitchen', '40-seat lounge area', 'Merch display wall', 'Community event board', 'Co-working nooks', 'Smoothie & juice bar'],
  },
  {
    name: 'Front Desk', x: 0, z: 130, w: 70, d: 40, h: 20,
    color: COLORS.sage, buildPct: 65, sqft: 1500,
    vision: 'Your first impression of the WAVMVMT experience', buildCost: 400_000,
    features: ['Curved reception desk', 'Self-check-in kiosks', 'Digital directory screen', 'Retail display', 'Welcome lounge', 'Member card system'],
  },
  {
    name: 'Yoga Room', x: -190, z: -35, w: 60, d: 60, h: 24,
    color: COLORS.gold, buildPct: 3, sqft: 2000,
    vision: 'Mind-body connection in a sacred space', buildCost: 600_000,
    features: ['Heated bamboo floor', 'Full mirror wall', '30 premium yoga mats', 'Aerial silks rigging', 'Sound system for flow', 'Natural light panels'],
  },
  {
    name: 'Weight Training', x: 190, z: -35, w: 75, d: 70, h: 28,
    color: COLORS.sage, buildPct: 8, sqft: 4000,
    vision: 'Strength training that moves with you', buildCost: 1_500_000,
    features: ['8 squat/power racks', 'Olympic lifting platforms', 'Full dumbbell wall (5-150 lb)', 'Cable crossover stations', 'Cardio deck (treads, bikes, rowers)', 'Stretching & mobility zone'],
  },
  {
    name: 'Amphitheatre', x: 0, z: -105, w: 100, d: 70, h: 35,
    color: COLORS.rose, buildPct: 3, sqft: 3500,
    vision: 'Where performances, talks, and screenings unite', buildCost: 1_800_000,
    features: ['200-seat tiered seating', 'Full stage (35ft wide)', 'Professional PA & monitoring', 'Theatrical lighting rig', 'Green room backstage', '4K projection system'],
  },
  {
    name: 'Photo Studio', x: 190, z: 70, w: 60, d: 55, h: 24,
    color: COLORS.lavender, buildPct: 2, sqft: 1500,
    vision: 'Visual storytelling made accessible', buildCost: 500_000,
    features: ['2 shooting bays', 'Cyclorama wall (white/green)', 'Professional lighting kits', 'Backdrop system (12 options)', 'Tethered shooting station', 'Client review area'],
  },
  {
    name: 'Video Studio', x: -190, z: 70, w: 60, d: 55, h: 24,
    color: COLORS.sky, buildPct: 2, sqft: 2000,
    vision: 'Broadcast-ready content from day one', buildCost: 650_000,
    features: ['Sound stage (20x15ft)', 'Green screen wall', 'Editing suite (3 stations)', 'Live streaming setup', 'Teleprompter system', 'Podcast recording booth'],
  },
  {
    name: 'Recovery Suite', x: -100, z: -190, w: 100, d: 70, h: 24,
    color: COLORS.sky, buildPct: 2, sqft: 4000,
    vision: 'Where performance meets restoration', buildCost: 1_400_000,
    features: ['Finnish sauna (180°F)', 'Cold plunge pool (39°F)', 'Ice bath stations', 'Steam room', 'Infrared sauna pods', 'Contrast therapy circuit'],
  },
  {
    name: 'Spa & Wellness', x: 100, z: -190, w: 80, d: 60, h: 22,
    color: COLORS.cream, buildPct: 2, sqft: 2500,
    vision: 'Intentional rest as a practice', buildCost: 900_000,
    features: ['Massage therapy rooms (4)', 'Cryotherapy chamber', 'Compression therapy', 'Salt room / halotherapy', 'Relaxation lounge', 'Aromatherapy steam'],
  },
  {
    name: 'Education Wing', x: 0, z: 200, w: 120, d: 70, h: 26,
    color: COLORS.gold, buildPct: 0, sqft: 4000,
    vision: 'Essential skills for the whole person — business, tech, and life', buildCost: 1_100_000,
    features: ['2 classrooms (30-seat)', 'Computer lab (20 stations)', 'Workshop/maker space', 'Presentation stage', 'Mentorship lounge', 'Digital schedule board'],
  },
]

/** Outdoor campus rooms (Phase 2 — shown as exterior zone) */
export const OUTDOOR_ZONES = [
  {
    name: 'Sports Field', x: 0, z: -320, w: 160, d: 100, h: 0,
    color: COLORS.sage, buildPct: 0,
    vision: 'Retractable-roof multi-sport field — open in summer, covered in winter',
    features: ['Soccer/football pitch', 'Modular retractable tent roof', 'LED field lighting', 'Spectator seating (200)', 'All-weather turf surface'],
  },
  {
    name: 'Skatepark', x: -140, z: -320, w: 80, d: 70, h: 0,
    color: COLORS.lavender, buildPct: 0,
    vision: 'Bowl and street — skate culture meets community',
    features: ['Bowl section (6ft deep)', 'Street section (rails, ledges, stairs)', 'Spectator seating', 'Night lighting', 'Connected to Amphitheatre viewing'],
  },
  {
    name: 'Parking Garage', x: 160, z: -320, w: 70, d: 80, h: 30,
    color: COLORS.steel, buildPct: 0,
    vision: 'Multi-level parking with rooftop terrace connected to main building',
    features: ['3-level parking (200 spots)', 'Rooftop terrace bar & lounge', 'EV charging stations (20)', 'Ground floor retail space', 'Skybridge to main building'],
  },
  {
    name: 'Outdoor Training', x: 140, z: -280, w: 60, d: 50, h: 0,
    color: COLORS.amber, buildPct: 0,
    vision: 'Train under the sky — calisthenics, sprints, and agility',
    features: ['Calisthenics bars & rigs', 'Sprint track (100m)', 'Agility course', 'Pull-up stations', 'Connected to indoor Parkour Gym'],
  },
]

/** Total facility square footage */
export const TOTAL_SQFT = ROOMS.reduce((sum, r) => sum + r.sqft, 0) + 5000 // +5000 for common areas, corridors, mechanical, bathrooms, locker rooms

export const WORKER_POSITIONS: [number, number][] = [
  [-75, -50], [-100, -75], [75, -70], [95, 35], [-5, 120],
  [-60, -25], [155, -35], [0, -95], [155, 65], [-155, 65],
  [-35, -85], [35, -60], [-125, 50], [125, -12], [0, 25],
  [-160, -30], [160, -30], [-160, 65], [160, 65], [0, -60],
  [-50, 80], [50, 80], [-130, -60], [130, -60], [0, 60],
  [-100, -170], [100, -170], [-80, -190], [80, -190],
]

export const SCAFFOLD_POSITIONS: { x: number; z: number; levels: number }[] = [
  { x: -125, z: -60, levels: 6 },
  { x: -35, z: -85, levels: 5 },
  { x: 110, z: -75, levels: 5 },
  { x: 175, z: -45, levels: 5 },
  { x: -20, z: -110, levels: 5 },
  { x: 175, z: 75, levels: 4 },
  { x: -175, z: 75, levels: 4 },
  { x: 50, z: 115, levels: 3 },
  { x: -50, z: 115, levels: 3 },
  { x: -175, z: -20, levels: 4 },
  { x: 175, z: -20, levels: 4 },
  { x: 0, z: 0, levels: 3 },
  { x: -120, z: -180, levels: 4 },
  { x: 120, z: -180, levels: 3 },
]
