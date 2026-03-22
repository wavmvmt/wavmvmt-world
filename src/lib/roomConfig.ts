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
  { name: 'Parkour Gym',     x: -35, z: -25, w: 40, d: 30, h: 14,  color: COLORS.lavender, buildPct: 30 },
  { name: 'Sound Bath',      x: 35,  z: -30, w: 24, d: 24, h: 10,  color: COLORS.gold,     buildPct: 10 },
  { name: 'Music Studio',    x: 35,  z: 12,  w: 24, d: 18, h: 10,  color: COLORS.rose,     buildPct: 5 },
  { name: 'Cafe & Lounge',   x: -35, z: 18,  w: 30, d: 24, h: 8,   color: COLORS.sky,      buildPct: 0 },
  { name: 'Front Desk',      x: 0,   z: 50,  w: 24, d: 12, h: 7,   color: COLORS.sage,     buildPct: 65 },
  { name: 'Yoga Room',       x: -65, z: -12, w: 18, d: 18, h: 8,   color: COLORS.gold,     buildPct: 0 },
  { name: 'Weight Training',  x: 65,  z: -12, w: 24, d: 20, h: 10,  color: COLORS.sage,     buildPct: 8 },
  { name: 'Amphitheatre',    x: 0,   z: -40, w: 30, d: 20, h: 12,  color: COLORS.rose,     buildPct: 3 },
  { name: 'Photo Studio',    x: 65,  z: 24,  w: 18, d: 16, h: 8,   color: COLORS.lavender, buildPct: 0 },
  { name: 'Video Studio',    x: -65, z: 24,  w: 18, d: 16, h: 8,   color: COLORS.sky,      buildPct: 0 },
]

export const WORKER_POSITIONS: [number, number][] = [
  [-30, -20], [-40, -30], [30, -28], [38, 14], [-2, 48],
  [-25, -10], [62, -15], [0, -38], [62, 26], [-62, 26],
  [-15, -35], [15, -25], [-50, 20], [50, -5], [0, 10],
]

export const SCAFFOLD_POSITIONS: { x: number; z: number; levels: number }[] = [
  { x: -50, z: -25, levels: 4 },
  { x: -15, z: -35, levels: 3 },
  { x: 45, z: -30, levels: 3 },
  { x: 70, z: -18, levels: 3 },
  { x: -8, z: -45, levels: 3 },
  { x: 70, z: 30, levels: 2 },
  { x: -70, z: 30, levels: 2 },
  { x: 20, z: 45, levels: 2 },
  { x: -20, z: 45, levels: 2 },
]
