'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { audioManager } from '@/lib/audioManager'

const LOOPS = {
  construction: '/audio/construction_loop.ogg',
  machine: '/audio/machine_loop.ogg',
  ambient: '/audio/ambient_01.ogg',
}

const SFX = {
  hits: ['/audio/hit_01.ogg', '/audio/hit_02.ogg', '/audio/hit_03.ogg'],
  metalHits: ['/audio/metal_hit_01.ogg', '/audio/metal_hit_02.ogg'],
  woodHits: ['/audio/wood_hit_01.ogg', '/audio/wood_hit_02.ogg'],
  metal: ['/audio/metal_01.ogg', '/audio/metal_02.ogg'],
  stones: ['/audio/stones_01.ogg'],
}

const FOOTSTEPS = ['/audio/footstep_01.ogg', '/audio/footstep_02.ogg']

export function AmbientAudio() {
  const startedRef = useRef(false)
  const nextEventRef = useRef(0)
  const loopsStartedRef = useRef(false)

  const startLoops = useCallback(async () => {
    if (loopsStartedRef.current) return
    loopsStartedRef.current = true

    await audioManager.playLoop(LOOPS.construction, 'ambient', 0.35)
    await audioManager.playLoop(LOOPS.machine, 'ambient', 0.15)
    await audioManager.playLoop(LOOPS.ambient, 'ambient', 0.2)
  }, [])

  const initAudio = useCallback(() => {
    if (startedRef.current) return
    startedRef.current = true

    audioManager.init()
    startLoops()

    // Pre-load SFX
    Object.values(SFX).flat().forEach(url => audioManager.loadBuffer(url))
    FOOTSTEPS.forEach(url => audioManager.loadBuffer(url))
  }, [startLoops])

  useEffect(() => {
    const start = () => {
      initAudio()
      cleanup()
    }
    const cleanup = () => {
      window.removeEventListener('click', start)
      window.removeEventListener('touchstart', start)
      window.removeEventListener('startAudio', start)
    }
    window.addEventListener('click', start)
    window.addEventListener('touchstart', start)
    window.addEventListener('startAudio', start)

    const onToggleMute = () => {
      const muted = audioManager.toggleMute()
      window.dispatchEvent(new CustomEvent('audioState', { detail: { muted } }))
    }
    window.addEventListener('toggleAudio', onToggleMute)

    const onSetVolume = (e: Event) => {
      const { volume } = (e as CustomEvent).detail
      audioManager.setMasterVolume(volume)
    }
    window.addEventListener('setVolume', onSetVolume as EventListener)

    const onFootstep = () => {
      const url = FOOTSTEPS[Math.floor(Math.random() * FOOTSTEPS.length)]
      audioManager.playOneShot(url, 'sfx', 0.2 + Math.random() * 0.1)
    }
    window.addEventListener('playFootstep', onFootstep)

    return () => {
      cleanup()
      window.removeEventListener('playFootstep', onFootstep)
      window.removeEventListener('toggleAudio', onToggleMute)
      window.removeEventListener('setVolume', onSetVolume as EventListener)
    }
  }, [initAudio])

  const _fsAudio = useRef(0)
  useFrame(() => {
    _fsAudio.current = (_fsAudio.current + 1) % 30  // Check audio events at ~2fps max
    if (_fsAudio.current !== 0) return
    const ctx = audioManager.getContext()
    if (!ctx) return

    const now = ctx.currentTime
    if (now < nextEventRef.current) return
    nextEventRef.current = now + 1.5 + Math.random() * 2.5

    const type = Math.random()
    if (type < 0.3) {
      const url = SFX.hits[Math.floor(Math.random() * SFX.hits.length)]
      audioManager.playOneShot(url, 'sfx', 0.25 + Math.random() * 0.15)
    } else if (type < 0.5) {
      const url = SFX.metalHits[Math.floor(Math.random() * SFX.metalHits.length)]
      audioManager.playOneShot(url, 'sfx', 0.2 + Math.random() * 0.1)
    } else if (type < 0.65) {
      const url = SFX.woodHits[Math.floor(Math.random() * SFX.woodHits.length)]
      audioManager.playOneShot(url, 'sfx', 0.25 + Math.random() * 0.1)
    } else if (type < 0.8) {
      const url = SFX.metal[Math.floor(Math.random() * SFX.metal.length)]
      audioManager.playOneShot(url, 'sfx', 0.15 + Math.random() * 0.1)
    } else {
      audioManager.playOneShot(SFX.stones[0], 'sfx', 0.2)
    }
  })

  return null
}
