export interface RoomDef {
  name: string
  x: number
  z: number
  w: number
  d: number
  h: number
  color: number
  buildPct: number
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
  { name: 'Parkour Gym',     x: -100, z: -80,  w: 130, d: 100, h: 40,  color: COLORS.lavender, buildPct: 30 },
  { name: 'Sound Bath',      x: 110,  z: -90,  w: 85,  d: 85,  h: 32,  color: COLORS.gold,     buildPct: 10 },
  { name: 'Music Studio',    x: 110,  z: 50,   w: 85,  d: 60,  h: 28,  color: COLORS.rose,     buildPct: 5 },
  { name: 'Cafe & Lounge',   x: -105, z: 55,   w: 100, d: 75,  h: 24,  color: COLORS.sky,      buildPct: 0 },
  { name: 'Front Desk',      x: 0,    z: 130,  w: 70,  d: 40,  h: 20,  color: COLORS.sage,     buildPct: 65 },
  { name: 'Yoga Room',       x: -190, z: -35,  w: 60,  d: 60,  h: 24,  color: COLORS.gold,     buildPct: 0 },
  { name: 'Weight Training', x: 190,  z: -35,  w: 75,  d: 70,  h: 28,  color: COLORS.sage,     buildPct: 8 },
  { name: 'Amphitheatre',    x: 0,    z: -105, w: 100, d: 70,  h: 35,  color: COLORS.rose,     buildPct: 3 },
  { name: 'Photo Studio',    x: 190,  z: 70,   w: 60,  d: 55,  h: 24,  color: COLORS.lavender, buildPct: 0 },
  { name: 'Video Studio',    x: -190, z: 70,   w: 60,  d: 55,  h: 24,  color: COLORS.sky,      buildPct: 0 },
]

export const WORKER_POSITIONS: [number, number][] = [
  [-75, -50], [-100, -75], [75, -70], [95, 35], [-5, 120],
  [-60, -25], [155, -35], [0, -95], [155, 65], [-155, 65],
  [-35, -85], [35, -60], [-125, 50], [125, -12], [0, 25],
  [-160, -30], [160, -30], [-160, 65], [160, 65], [0, -60],
  [-50, 80], [50, 80], [-130, -60], [130, -60], [0, 60],
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
]
