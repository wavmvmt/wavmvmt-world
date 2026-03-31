'use client'

/**
 * SceneContentLow — The Roblox mode.
 *
 * Roblox targets smooth 30fps on 5-year-old phones with:
 *   - Flat MeshBasicMaterial only (zero lighting shader cost)
 *   - ~10-20 draw calls total
 *   - No particles, no Html, no post-processing
 *   - No animated decorations
 *   - 1 ambient + 1 directional light maximum
 *   - 30fps hard frame cap
 *
 * This completely replaces SceneContent when quality = 'low'.
 * The Player, PotatoWarehouse, audio, and essential interactions only.
 */

import { Suspense } from 'react'
import { Player } from './Player'
import { PotatoWarehouse } from './PotatoWarehouse'
import { AmbientAudio } from './AmbientAudio'
import { RoomInteractions } from './RoomInteractions'
import { QuestPath } from './QuestPath'
import { Confetti } from './Confetti'
import { IntroFlyover } from './IntroFlyover'
import { AnimatedDoors } from './AnimatedDoors'

/**
 * SceneContentLow is a fully stripped scene:
 * - PotatoWarehouse: 15 draw calls (vs 80+ for full Warehouse)
 * - Player: 11 draw calls (always needed)
 * - AnimatedDoors: kept for navigation clarity
 * - Audio: zero visual cost
 * - RoomInteractions: needed for quest completions
 * - QuestPath: lightweight guide dots
 * - Confetti: zero cost when idle
 * - IntroFlyover: camera only, zero geometry
 * 
 * TOTAL: ~30 draw calls (Roblox-comparable)
 * vs ~400+ draw calls in medium/high
 */
export function SceneContentLow() {
  return (
    <>
      {/* Core scene — flat shaded warehouse */}
      <PotatoWarehouse />

      {/* Player — always needed */}
      <Player />

      {/* Doors — critical for navigation */}
      <AnimatedDoors />

      {/* Audio — zero visual cost */}
      <AmbientAudio />

      {/* Interactions + quests */}
      <RoomInteractions />
      <QuestPath />

      {/* Event-driven zero-cost */}
      <Confetti />
      <IntroFlyover />
    </>
  )
}
