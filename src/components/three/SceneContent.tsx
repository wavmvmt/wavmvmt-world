'use client'

/**
 * All 3D scene content grouped in one component.
 * Keeps World3D clean and makes it easy to add/remove scene elements.
 */

import { Warehouse } from './Warehouse'
import { Workers } from './Workers'
import { DustMotes } from './DustMotes'
import { Sparks } from './Sparks'
import { LightShafts } from './LightShafts'
import { Signage } from './Signage'
import { RoomInteriors } from './RoomInteriors'
import { Player } from './Player'
import { ConstructionEquipment } from './ConstructionEquipment'
import { ConstructionProps } from './ConstructionProps'
import { AmbientAudio } from './AmbientAudio'
import { BeatPads } from './BeatPads'
import { SoundBathBowls } from './SoundBathBowls'
import { RoomInteractions } from './RoomInteractions'
import { RemainingRoomFX } from './RemainingRoomFX'
import { Confetti } from './Confetti'
import { DroneCamera } from './DroneCamera'
import { ParkourTrampolines } from './ParkourTrampoline'
import { PhaseProps } from './PhaseProps'
import { Skateboards } from './Skateboard'
import { StageSpotlight } from './StageSpotlight'
import { MultiplayerPresence } from './MultiplayerPresence'
import { NightSky } from './NightSky'
import { Fireflies } from './Fireflies'
import { Decorations } from './Decorations'
import { IntroFlyover } from './IntroFlyover'
import { RainEffect } from './RainEffect'
import { AnimatedDoors } from './AnimatedDoors'
import { RoomIcons } from './RoomIcons'
import { PlayerTrail } from './PlayerTrail'
import { CafeAmbient } from './CafeAmbient'
import { BulletinBoard } from './BulletinBoard'
import { BirdSounds } from './BirdSounds'
import { CeilingFans } from './CeilingFans'
import { SiteClock } from './SiteClock'

export function SceneContent() {
  return (
    <>
      {/* Sky & atmosphere */}
      <NightSky />
      <Fireflies />
      <RainEffect />
      <DustMotes />

      {/* Warehouse structure */}
      <Warehouse />
      <LightShafts />
      <Signage />
      <Decorations />

      {/* Room content */}
      <RoomInteriors />
      <BeatPads />
      <SoundBathBowls />
      <RoomInteractions />
      <RemainingRoomFX />
      <StageSpotlight />

      {/* Characters & vehicles */}
      <Workers />
      <Player />
      <Skateboards />
      <MultiplayerPresence />

      {/* Construction site */}
      <ConstructionEquipment />
      <ConstructionProps />
      <PhaseProps />
      <Sparks />
      <ParkourTrampolines />

      {/* Room markers */}
      <AnimatedDoors />
      <RoomIcons />

      {/* Player effects */}
      <PlayerTrail />

      {/* Effects & systems */}
      <CafeAmbient />
      <BulletinBoard />
      <BirdSounds />
      <CeilingFans />
      <SiteClock />
      <Confetti />
      <DroneCamera />
      <IntroFlyover />
      <AmbientAudio />
    </>
  )
}
