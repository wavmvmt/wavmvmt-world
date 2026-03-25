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
import { RoomAmbience } from './RoomAmbience'
import { RoomProximityGlow } from './RoomProximityGlow'
import { GlobalExpansionGlobe } from './GlobalExpansionGlobe'
import { WarehouseEntrance } from './WarehouseEntrance'
import { LiveWeather } from './LiveWeather'
import { FootprintHeatmap } from './FootprintHeatmap'
import { ConstructionCrane } from './ConstructionCrane'
import { MembershipBillboard } from './MembershipBillboard'
import { CinematicUpgrade } from './CinematicUpgrade'
import { AuroraSky } from './AuroraSky'
import { HolographicSigns } from './HolographicSigns'
import { AtmosphericEffects } from './AtmosphericEffects'
import { UltimateVisuals } from './UltimateVisuals'
import { ReflectiveElements } from './ReflectiveElements'
import { EnergyConduits } from './EnergyConduits'
import { InspirationalQuotes } from './InspirationalQuotes'
import { RoomFloorGlow } from './RoomFloorGlow'
import { FloorDetail } from './FloorDetail'
import { RoomInteriorLights } from './RoomInteriorLights'
import { StringLights } from './StringLights'
import { CeilingDetail } from './CeilingDetail'
import { EntranceArch } from './EntranceArch'
import { FogLayers } from './FogLayers'
import { DustClouds } from './DustClouds'
import { GroundDetails } from './GroundDetails'
import { WallDetail } from './WallDetail'
import { RoomWallSections } from './RoomWallSections'
import { ConstructionBanner } from './ConstructionBanner'
import { SafetySigns } from './SafetySigns'
import { RoomProgressRings } from './RoomProgressRings'
import { RoomParticles } from './RoomParticles'

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
      <Workers />
      <AmbientAudio />
      <DustMotes />
      <AnimatedDoors />
      <LightShafts />
      <Signage />
      <NightSky />

      {/* Room interactions — lightweight, essential */}
      <BeatPads />
      <SoundBathBowls />
      <RoomInteractions />
      <StageSpotlight />

      {/* Quest navigation — lightweight */}
      <QuestPath />
      <GuideDog />

      {/* Room floor glow + floor markings — lightweight, always render */}
      <RoomFloorGlow />
      <FloorDetail />
      <EntranceArch />
      <FogLayers />
      <ConstructionBanner />

      {/* Audio — no visual cost */}
      <CafeAmbient />
      <BirdSounds />
      <RoomAmbience />
      <RoomProximityGlow />

      {/* Confetti + drone — event-driven, zero cost when idle */}
      <Confetti />
      <DroneCamera />
      <IntroFlyover />

      {/* === MEDIUM + HIGH (enableDecorations / enableParticles) === */}
      {perf.enableRoomIcons && <RoomIcons />}
      {perf.enableDecorations && <NPCCoaches />}
      {perf.enableDecorations && <DemoScreens />}
      {perf.enableDecorations && <RoomProgressRings />}
      {perf.enableTrail && <PlayerTrail />}
      {perf.enableParticles && <Sparks />}
      {perf.enableParticles && <RoomParticles />}
      {perf.enableDecorations && <PhaseProps />}
      {perf.enableDecorations && <Decorations />}
      {perf.enableDecorations && <BulletinBoard />}
      {perf.enableDecorations && <SiteClock />}
      {perf.enableDecorations && <Skateboards />}
      {perf.enableDecorations && <ParkourTrampolines />}
      {perf.enableDecorations && <RemainingRoomFX />}
      {perf.enableDecorations && <ConstructionEquipment />}
      {perf.enableDecorations && <ConstructionProps />}
      {perf.enableDecorations && <MultiplayerPresence />}
      {perf.enableDecorations && <WarehouseEntrance />}
      {perf.enableDecorations && <RoomInteriorLights />}
      {perf.enableDecorations && <StringLights />}
      {perf.enableDecorations && <DustClouds />}
      {perf.enableDecorations && <CeilingDetail />}
      {perf.enableDecorations && <GroundDetails />}
      {perf.enableDecorations && <WallDetail />}
      {perf.enableDecorations && <RoomWallSections />}
      {perf.enableDecorations && <SafetySigns />}

      {/* === HIGH ONLY === */}
      {perf.enableCeilingFans && <CeilingFans />}
      {perf.enableOutdoor && <Fireflies />}
      {perf.enableOutdoor && <RainEffect />}
      {perf.enableOutdoor && <OutdoorZone />}
      {perf.enableOutdoor && <ExteriorDetails />}
      {perf.enableOutdoor && <GlobalExpansionGlobe />}
      {perf.enableWeather && <LiveWeather />}
      {perf.enableOutdoor && <FootprintHeatmap />}
      {perf.enableOutdoor && <InspirationalQuotes />}
      {perf.enableOutdoor && <MembershipBillboard />}
      {perf.enableOutdoor && <FloorMarkings />}
      {perf.enableOutdoor && <CinematicUpgrade />}
      {perf.enableOutdoor && <AuroraSky />}
      {perf.enableOutdoor && <HolographicSigns />}
      {perf.enableOutdoor && <AtmosphericEffects />}
      {perf.enableOutdoor && <UltimateVisuals />}
      {perf.enableOutdoor && <ReflectiveElements />}
      {perf.enableOutdoor && <EnergyConduits />}
      {perf.enableOutdoor && (
        <>
          <ConstructionCrane position={[-110, 0, -80]} />
          <ConstructionCrane position={[120, 0, -200]} />
        </>
      )}
    </>
  )
}
