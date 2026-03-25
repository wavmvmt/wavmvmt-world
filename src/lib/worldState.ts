/**
 * Centralized world state — single source of truth for player position,
 * current room, session stats, and world time.
 *
 * Uses a simple observable pattern instead of Zustand to keep deps minimal.
 * Components read via getState() and subscribe via onChange().
 */

export interface WorldState {
  /** Player position in world space */
  playerX: number
  playerZ: number
  /** Current room the player is in (empty string if none) */
  currentRoom: string
  /** Is the player sprinting */
  sprinting: boolean
  /** Session start timestamp */
  sessionStart: number
  /** Rooms visited this session */
  roomsVisited: Set<string>
  /** Total interactions this session */
  interactionCount: number
  /** Audio muted */
  muted: boolean
  /** Day/night cycle progress 0-1 */
  cycleProgress: number
}

type Listener = (state: WorldState) => void

const state: WorldState = {
  playerX: 0,
  playerZ: 0,
  currentRoom: '',
  sprinting: false,
  sessionStart: Date.now(),
  roomsVisited: new Set(),
  interactionCount: 0,
  muted: false,
  cycleProgress: 0,
}

const listeners: Set<Listener> = new Set()

function notify(): void {
  listeners.forEach(fn => fn(state))
}

export const worldState = {
  getState(): Readonly<WorldState> {
    return state
  },

  updatePlayer(x: number, z: number, room: string, sprinting: boolean): void {
    state.playerX = x
    state.playerZ = z
    state.sprinting = sprinting
    if (room && room !== state.currentRoom) {
      state.currentRoom = room
      state.roomsVisited.add(room)
    } else if (!room) {
      state.currentRoom = ''
    }
    notify()
  },

  recordInteraction(): void {
    state.interactionCount++
  },

  setMuted(muted: boolean): void {
    state.muted = muted
    notify()
  },

  setCycleProgress(progress: number): void {
    state.cycleProgress = progress
  },

  getSessionDuration(): number {
    return Math.floor((Date.now() - state.sessionStart) / 1000)
  },

  getRoomsVisitedCount(): number {
    return state.roomsVisited.size
  },

  onChange(listener: Listener): () => void {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}
