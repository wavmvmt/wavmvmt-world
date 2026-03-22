/** Achievement definitions and tracking */

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  check: (stats: PlayerStats) => boolean
}

export interface PlayerStats {
  roomsVisited: Set<string>
  totalJumps: number
  timeSpent: number // seconds
  trampolineBounces: number
  beatsPlayed: number
  bowlsPlayed: number
  skateboardRides: number
  suggestionsSubmitted: number
  droneModeUsed: boolean
  sprintDistance: number
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Visit all 12 rooms',
    icon: '🗺️',
    check: (s) => s.roomsVisited.size >= 12,
  },
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Visit your first room',
    icon: '👟',
    check: (s) => s.roomsVisited.size >= 1,
  },
  {
    id: 'curious',
    name: 'Curious',
    description: 'Visit 6 rooms',
    icon: '🔍',
    check: (s) => s.roomsVisited.size >= 6,
  },
  {
    id: 'beat-maker',
    name: 'Beat Maker',
    description: 'Play 10 beats on the pads',
    icon: '🎵',
    check: (s) => s.beatsPlayed >= 10,
  },
  {
    id: 'sound-healer',
    name: 'Sound Healer',
    description: 'Play all 7 singing bowls',
    icon: '🔔',
    check: (s) => s.bowlsPlayed >= 7,
  },
  {
    id: 'parkour-pro',
    name: 'Parkour Pro',
    description: 'Bounce on 3 trampolines',
    icon: '🤸',
    check: (s) => s.trampolineBounces >= 3,
  },
  {
    id: 'skater',
    name: 'Skater',
    description: 'Ride a skateboard',
    icon: '🛹',
    check: (s) => s.skateboardRides >= 1,
  },
  {
    id: 'bird-eye',
    name: "Bird's Eye",
    description: 'Use drone camera mode',
    icon: '🦅',
    check: (s) => s.droneModeUsed,
  },
  {
    id: 'builder',
    name: 'Builder',
    description: 'Submit a suggestion',
    icon: '🏗️',
    check: (s) => s.suggestionsSubmitted >= 1,
  },
  {
    id: 'jumper',
    name: 'High Flyer',
    description: 'Jump 50 times',
    icon: '🚀',
    check: (s) => s.totalJumps >= 50,
  },
  {
    id: 'sprinter',
    name: 'Speed Demon',
    description: 'Sprint for 500 meters',
    icon: '⚡',
    check: (s) => s.sprintDistance >= 500,
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'See the stars at night',
    icon: '🌙',
    check: (s) => s.timeSpent >= 150, // Night cycle starts at ~150s
  },
]

export function createInitialStats(): PlayerStats {
  return {
    roomsVisited: new Set(),
    totalJumps: 0,
    timeSpent: 0,
    trampolineBounces: 0,
    beatsPlayed: 0,
    bowlsPlayed: 0,
    skateboardRides: 0,
    suggestionsSubmitted: 0,
    droneModeUsed: false,
    sprintDistance: 0,
  }
}
