/**
 * Typed event definitions for all CustomEvents used in WAVMVMT World.
 * Components communicate via window.dispatchEvent(new CustomEvent(...)).
 *
 * This file documents the contract — what events exist and their payloads.
 */

export interface WorldEvents {
  /** Player position update — fired every frame by Player.tsx */
  playerMove: { x: number; z: number; room: string }

  /** Footstep sound request — fired by Player.tsx when walking */
  playFootstep: undefined

  /** Room interaction — fired when player presses E near a room */
  roomInteract: { room: string }

  /** Audio system commands */
  startAudio: undefined
  toggleAudio: undefined
  setVolume: { volume: number }
  audioState: { muted: boolean }

  /** Touch controls — fired by mobile joystick */
  touchLook: { dx: number; dy: number }

  /** Vehicle/special movement */
  speedOverride: { speed: number }
  boostJump: { force: number }

  /** UI triggers */
  openShare: undefined
  takeScreenshot: undefined
  requestRendererStats: undefined
  rendererStats: {
    drawCalls: number
    triangles: number
    points: number
    lines: number
    geometries: number
    textures: number
  }
}

/** Type-safe event dispatcher */
export function emitEvent<K extends keyof WorldEvents>(
  name: K,
  ...args: WorldEvents[K] extends undefined ? [] : [WorldEvents[K]]
): void {
  const detail = args[0]
  window.dispatchEvent(new CustomEvent(name, detail !== undefined ? { detail } : undefined))
}
