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
  { name: 'Parkour Gym',    x: -12, z: -8,  w: 14, d: 10, h: 6,   color: COLORS.lavender, buildPct: 30 },
  { name: 'Sound Bath',     x: 12,  z: -10, w: 8,  d: 8,  h: 4,   color: COLORS.gold,     buildPct: 10 },
  { name: 'Music Studio',   x: 12,  z: 4,   w: 8,  d: 6,  h: 4,   color: COLORS.rose,     buildPct: 5 },
  { name: 'Cafe & Lounge',  x: -12, z: 6,   w: 10, d: 8,  h: 3.5, color: COLORS.sky,      buildPct: 0 },
  { name: 'Front Desk',     x: 0,   z: 16,  w: 8,  d: 4,  h: 3,   color: COLORS.sage,     buildPct: 65 },
  { name: 'Yoga Room',      x: -22, z: -4,  w: 6,  d: 6,  h: 3.5, color: COLORS.gold,     buildPct: 0 },
  { name: 'Weight Training', x: 22,  z: -4,  w: 8,  d: 7,  h: 4,   color: COLORS.sage,     buildPct: 8 },
  { name: 'Amphitheatre',   x: 0,   z: -14, w: 10, d: 6,  h: 5,   color: COLORS.rose,     buildPct: 3 },
  { name: 'Photo Studio',   x: 22,  z: 8,   w: 6,  d: 5,  h: 3.5, color: COLORS.lavender, buildPct: 0 },
  { name: 'Video Studio',   x: -22, z: 8,   w: 6,  d: 5,  h: 3.5, color: COLORS.sky,      buildPct: 0 },
]

export const WORKER_POSITIONS: [number, number][] = [
  [-10, -7], [-14, -10], [10, -9], [13, 5], [-1, 14],
  [-8, -4], [22, -6], [0, -16], [22, 9], [-22, 9],
]

export const SCAFFOLD_POSITIONS: { x: number; z: number; levels: number }[] = [
  { x: -18, z: -8, levels: 3 },
  { x: -6, z: -12, levels: 2 },
  { x: 16, z: -10, levels: 2 },
  { x: 24, z: -6, levels: 2 },
  { x: -3, z: -16, levels: 2 },
  { x: 24, z: 10, levels: 1 },
  { x: -24, z: 10, levels: 1 },
]
