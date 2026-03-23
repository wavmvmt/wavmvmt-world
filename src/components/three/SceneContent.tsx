'use client'

/**
 * All 3D scene content with performance-adaptive rendering.
 * Low-end devices get a stripped-down version that still looks good.
 */

import { useMemo } from 'react'
import { detectPerformanceLevel, getPerfSettings } from '@/lib/performanceMode'

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
import { FloorMarkings } from './FloorMarkings'
import { NPCCoaches } from './NPCCoaches'
import { DemoScreens } from './DemoScreens'
import { QuestPath } from './QuestPath'
import { OutdoorZone } from './OutdoorZone'
import { ExteriorDetails } from './ExteriorDetails'
import { GuideDog } from './GuideDog'

export function SceneContent() {
  const perf = useMemo(() => {
    const level = detectPerformanceLevel()
    return getPerfSettings(level)
  }, [])

  return (
    <>
      {/* === ALWAYS RENDERED (core experience) === */}
      <Warehouse />
      <Player />
      <RoomInteriors />
      <DustMotes />
      <AnimatedDoors />

      {/* Room interactions — lightweight, essential */}
      <BeatPads />
      <SoundBathBowls />
      <RoomInteractions />
      <StageSpotlight />

      {/* Workers — count controlled by perf */}
      <Workers />

      {/* NPCs, screens, quest navigation */}
      <NPCCoaches />
      <DemoScreens />
      <QuestPath />
      <GuideDog />

      {/* Audio — no visual cost */}
      <AmbientAudio />
      <CafeAmbient />
      <BirdSounds />

      {/* Confetti + drone — event-driven, zero cost when idle */}
      <Confetti />
      <DroneCamera />
      <IntroFlyover />

      {/* === MEDIUM + HIGH === */}
      {perf.enableRoomIcons && <RoomIcons />}
      {perf.enableTrail && <PlayerTrail />}

      <Signage />
      <LightShafts />
      <NightSky />
      <ConstructionEquipment />
      <ConstructionProps />
      <PhaseProps />
      <Sparks />
      <ParkourTrampolines />
      <Skateboards />
      <MultiplayerPresence />
      <RemainingRoomFX />
      <Decorations />
      <BulletinBoard />
      <SiteClock />
      <FloorMarkings />

      {/* === HIGH ONLY === */}
      {perf.enableCeilingFans && <CeilingFans />}
      <Fireflies />
      <RainEffect />
      <OutdoorZone />
      <ExteriorDetails />
    </>
  )
}
