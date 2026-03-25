'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { audioManager } from '@/lib/audioManager'
import { BEAT_TRACKS } from '@/lib/beatRadio'

/**
 * World Beat Radio — plays shuffled lo-fi beats from the Synesthesia
 * beat library while exploring the 3D world. Minimal UI: track name,
 * skip, pause. Routes through audioManager musicGain.
 */
export function WorldBeatRadio() {
  const [playing, setPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [trackName, setTrackName] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const shuffleRef = useRef<number[]>([])
  const indexRef = useRef(0)

  // Shuffle track order on mount
  useEffect(() => {
    const indices = Array.from({ length: BEAT_TRACKS.length }, (_, i) => i)
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]]
    }
    shuffleRef.current = indices
    setCurrentTrack(indices[0])
    setTrackName(BEAT_TRACKS[indices[0]].name)
  }, [])

  const playTrack = useCallback((trackIdx: number) => {
    const track = BEAT_TRACKS[trackIdx]
    if (!track) return

    // Use HTML Audio element routed through audioManager for volume control
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ''
    }

    const audio = new Audio(track.file)
    audio.crossOrigin = 'anonymous'
    audio.volume = 0.3 // Music is quieter than SFX
    audioRef.current = audio

    // Connect to audioManager if possible for master volume control
    try {
      audioManager.init()
      const ctx = audioManager.getContext()
      const musicGain = audioManager.getCategoryGain('music')
      if (ctx && musicGain) {
        const source = ctx.createMediaElementSource(audio)
        source.connect(musicGain)
      }
    } catch {
      // Fallback: audio plays through default output
    }

    audio.play().catch(() => {
      // Autoplay blocked — will play on next user interaction
      setPlaying(false)
    })

    audio.onended = () => {
      // Auto-advance to next track
      skipTrack()
    }

    setCurrentTrack(trackIdx)
    setTrackName(track.name)
    setPlaying(true)
  }, [])

  const skipTrack = useCallback(() => {
    indexRef.current = (indexRef.current + 1) % shuffleRef.current.length
    const nextIdx = shuffleRef.current[indexRef.current]
    playTrack(nextIdx)
  }, [playTrack])

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !playing) {
      // Start playing
      const idx = shuffleRef.current[indexRef.current]
      playTrack(idx)
    } else {
      // Pause
      audioRef.current.pause()
      setPlaying(false)
    }
  }, [playing, playTrack])

  // Start on first audio init (user click triggers startAudio)
  useEffect(() => {
    const onStart = () => {
      if (!playing && shuffleRef.current.length > 0) {
        // Delay music start — let construction audio establish first
        setTimeout(() => {
          const idx = shuffleRef.current[indexRef.current]
          playTrack(idx)
        }, 5000)
      }
    }
    window.addEventListener('startAudio', onStart)
    return () => {
      window.removeEventListener('startAudio', onStart)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ''
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Listen for mute toggle
  useEffect(() => {
    const onMute = (e: Event) => {
      const { muted } = (e as CustomEvent).detail
      if (audioRef.current) {
        audioRef.current.volume = muted ? 0 : 0.3
      }
    }
    window.addEventListener('audioState', onMute as EventListener)
    return () => window.removeEventListener('audioState', onMute as EventListener)
  }, [])

  return (
    <div
      className="fixed bottom-3 left-3 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full pointer-events-auto"
      style={{
        background: 'rgba(26,21,32,0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(240,198,116,0.1)',
      }}
    >
      {/* Play/pause */}
      <button
        onClick={togglePlay}
        className="text-xs cursor-pointer"
        style={{ color: playing ? '#f0c674' : 'rgba(255,220,180,0.3)' }}
        aria-label={playing ? 'Pause music' : 'Play music'}
      >
        {playing ? '⏸' : '▶'}
      </button>

      {/* Track name */}
      <span
        className="text-[0.5rem] tracking-wider max-w-[120px] truncate"
        style={{ color: 'rgba(255,220,180,0.4)' }}
      >
        {playing ? trackName : 'Beat Radio'}
      </span>

      {/* Skip */}
      {playing && (
        <button
          onClick={skipTrack}
          className="text-[0.55rem] cursor-pointer"
          style={{ color: 'rgba(255,220,180,0.3)' }}
          aria-label="Skip to next track"
        >
          ⏭
        </button>
      )}
    </div>
  )
}
