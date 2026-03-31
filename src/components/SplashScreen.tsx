'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { trackEvent } from '@/lib/analytics'
import { BEAT_TRACKS } from '@/lib/beatRadio'

// The video that plays behind the splash is "November 25th Beat 1" —
// pick the matching beat track so the play button plays the same music
const SPLASH_BEAT = BEAT_TRACKS.find(t => t.name.toLowerCase().includes('november') || t.name.toLowerCase().includes('nov')) ?? BEAT_TRACKS[0]

export function SplashScreen({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<'intro' | 'ready' | 'fading'>('intro')
  const [visitors, setVisitors] = useState(0)
  const [videoMuted, setVideoMuted] = useState(true)
  const [beatPlaying, setBeatPlaying] = useState(false)
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null)
  const [installed, setInstalled] = useState(false)
  const [beatTrackIdx, setBeatTrackIdx] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const beatRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Capture PWA install prompt
    const onInstallPrompt = (e: Event) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', onInstallPrompt)
    window.addEventListener('appinstalled', () => setInstalled(true))
    const timer = setTimeout(() => setPhase('ready'), 1500)
    const supabase = createClient()
    supabase.from('world_visits').select('id', { count: 'exact', head: true }).then(({ count }) => {
      if (count) setVisitors(count)
    })
    // Pre-create audio element
    const audio = new Audio()
    audio.preload = 'none'
    audio.onended = () => {
      // Auto-advance to next track
      setBeatTrackIdx(i => (i + 1) % BEAT_TRACKS.length)
    }
    beatRef.current = audio
    return () => {
      clearTimeout(timer)
      audio.pause()
      audio.src = ''
    }
  }, [])

  // When track index changes while playing, load + play new track
  useEffect(() => {
    if (!beatPlaying || !beatRef.current) return
    const track = BEAT_TRACKS[beatTrackIdx]
    beatRef.current.src = track.file
    beatRef.current.play().catch(() => setBeatPlaying(false))
  }, [beatTrackIdx, beatPlaying])

  function toggleBeat() {
    if (!beatRef.current) return
    if (beatPlaying) {
      beatRef.current.pause()
      setBeatPlaying(false)
    } else {
      const track = BEAT_TRACKS[beatTrackIdx]
      beatRef.current.src = track.file
      beatRef.current.play().then(() => setBeatPlaying(true)).catch(() => {})
    }
  }

  function skipBeat() {
    setBeatTrackIdx(i => (i + 1) % BEAT_TRACKS.length)
  }

  function handleEnter() {
    setPhase('fading')
    trackEvent('world_enter')
    // If beat is playing, pass it to the world audio system
    if (beatRef.current && beatPlaying) {
      beatRef.current.pause()
    }
    window.dispatchEvent(new CustomEvent('startAudio'))
    setTimeout(onEnter, 1200)
  }

  function toggleVideo() {
    const newMuted = !videoMuted
    setVideoMuted(newMuted)
    if (videoRef.current) {
      videoRef.current.muted = newMuted
      if (!newMuted) videoRef.current.play().catch(() => {})
    }
  }

  const currentTrack = BEAT_TRACKS[beatTrackIdx]

  return (
    <div
      role="dialog"
      aria-label="WAVMVMT World splash screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-[1200ms]"
      style={{
        opacity: phase === 'fading' ? 0 : 1,
        pointerEvents: phase === 'fading' ? 'none' : 'auto',
        background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)',
      }}
    >
      {/* Background video — full brightness, just blend-mode softened */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted={videoMuted}
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.65, mixBlendMode: 'screen' }}
      >
        <source src="/api/media?file=november%2025th%20beat%201%20landscape.mov" type="video/mp4" />
      </video>

      {/* Soft dark vignette — much lighter than before so video shows through */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, rgba(26,21,32,0.1) 0%, rgba(26,21,32,0.55) 100%)',
      }} />

      {/* Top-right controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        {/* Video sound toggle */}
        <button
          onClick={toggleVideo}
          className="px-3 py-1.5 rounded-full text-[0.5rem] tracking-wider uppercase cursor-pointer pointer-events-auto transition-all"
          style={{
            background: 'rgba(26,21,32,0.6)',
            border: `1px solid ${videoMuted ? 'rgba(240,198,116,0.15)' : 'rgba(240,198,116,0.4)'}`,
            color: videoMuted ? 'rgba(255,220,180,0.3)' : '#f0c674',
            backdropFilter: 'blur(10px)',
          }}
        >
          {videoMuted ? '🔇 Video' : '🔊 Video'}
        </button>
      </div>

      {/* Beat player — bottom-left, appears when ready */}
      <div
        className="absolute bottom-20 left-1/2 z-10 transition-all duration-[1.5s]"
        style={{
          opacity: phase === 'ready' ? 1 : 0,
          transform: `translateX(-50%) translateY(${phase === 'ready' ? '0' : '12px'})`,
          transitionDelay: '1.1s',
        }}
      >
        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl"
          style={{
            background: 'rgba(26,21,32,0.7)',
            border: `1px solid ${beatPlaying ? 'rgba(240,198,116,0.4)' : 'rgba(240,198,116,0.15)'}`,
            backdropFilter: 'blur(16px)',
            boxShadow: beatPlaying ? '0 0 24px rgba(240,198,116,0.12)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          {/* Play/pause */}
          <button
            onClick={toggleBeat}
            className="cursor-pointer transition-all"
            style={{
              width: 32, height: 32,
              borderRadius: '50%',
              border: `1.5px solid ${beatPlaying ? '#f0c674' : 'rgba(240,198,116,0.4)'}`,
              background: beatPlaying ? 'rgba(240,198,116,0.12)' : 'transparent',
              color: beatPlaying ? '#f0c674' : 'rgba(255,220,180,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px',
            }}
          >
            {beatPlaying ? '⏸' : '▶'}
          </button>

          {/* Track info */}
          <div style={{ minWidth: 120, maxWidth: 160 }}>
            <div style={{
              color: beatPlaying ? 'rgba(240,198,116,0.9)' : 'rgba(255,220,180,0.4)',
              fontSize: '0.55rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'color 0.3s',
            }}>
              {beatPlaying ? currentTrack.name : 'Preview a Beat'}
            </div>
            <div style={{ color: 'rgba(255,200,150,0.25)', fontSize: '0.45rem', letterSpacing: '0.1em', marginTop: 1 }}>
              {beatPlaying ? '♪ shim.wav' : 'tap to play'}
            </div>
          </div>

          {/* Skip */}
          {beatPlaying && (
            <button
              onClick={skipBeat}
              className="cursor-pointer"
              style={{
                color: 'rgba(255,220,180,0.35)',
                fontSize: '10px',
                border: 'none',
                background: 'none',
                padding: '4px',
              }}
            >
              ⏭
            </button>
          )}

          {/* Equalizer bars animation when playing */}
          {beatPlaying && (
            <div className="flex items-end gap-[2px]" style={{ height: 14 }}>
              {[0.6, 1, 0.7, 0.9, 0.5].map((h, i) => (
                <div key={i} style={{
                  width: 2,
                  height: `${h * 14}px`,
                  background: '#f0c674',
                  opacity: 0.7,
                  borderRadius: 1,
                  animation: `eq-bar ${0.4 + i * 0.1}s ease-in-out infinite alternate`,
                  animationDelay: `${i * 0.08}s`,
                }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Concentric rings */}
      <div className="absolute opacity-[0.04]">
        {[120, 200, 300, 420].map((size, i) => (
          <div
            key={i}
            className="absolute rounded-full border"
            style={{
              width: size, height: size,
              top: `calc(50% - ${size / 2}px)`,
              left: `calc(50% - ${size / 2}px)`,
              borderColor: 'rgba(240,198,116,0.3)',
              animation: `pulse-ring ${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <div
          className="text-8xl md:text-[10rem] mb-2 transition-all duration-[2s]"
          style={{
            color: '#f0c674',
            opacity: phase === 'intro' ? 0 : 0.5,
            fontFamily: "'Playfair Display', serif",
            textShadow: '0 0 80px rgba(240,198,116,0.35)',
            transform: phase === 'intro' ? 'translateY(20px)' : 'translateY(0)',
          }}
        >~</div>

        <h1
          className="text-3xl md:text-5xl font-bold tracking-[0.15em] mb-2 transition-all duration-[2s] delay-300"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: 'rgba(255,240,220,0.95)',
            opacity: phase === 'intro' ? 0 : 1,
            transform: phase === 'intro' ? 'translateY(15px)' : 'translateY(0)',
            textShadow: '0 2px 40px rgba(0,0,0,0.6)',
          }}
        >WAVMVMT WORLD</h1>

        <p className="text-xs tracking-[0.4em] uppercase mb-1 transition-all duration-[2s] delay-500"
          style={{ color: 'rgba(255,200,150,0.5)', opacity: phase === 'intro' ? 0 : 1 }}>
          Under Construction
        </p>

        <div className="flex gap-5 justify-center mb-6 transition-all duration-[2s] delay-600"
          style={{ opacity: phase === 'intro' ? 0 : 1 }}>
          {[
            ['$100M+', 'vision'],
            ['13+', 'rooms'],
            ['100', 'quests'],
            ...(visitors > 0 ? [[visitors.toLocaleString(), 'visitors']] : []),
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="text-lg font-bold font-mono" style={{ color: '#f0c674' }}>{val}</div>
              <div className="text-[0.45rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,200,150,0.3)' }}>{label}</div>
            </div>
          ))}
        </div>

        <p className="text-[0.6rem] tracking-[0.2em] mb-4 transition-all duration-[2s] delay-700"
          style={{ color: 'rgba(255,200,150,0.35)', opacity: phase === 'intro' ? 0 : 1 }}>
          Toronto, ON · Wellness · Fitness · Music · Tech · Education
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-4 transition-all duration-[2s] delay-750"
          style={{ opacity: phase === 'intro' ? 0 : 1 }}>
          {['Freedom Through Expression', 'Elevating Consciousness', 'Community'].map((p) => (
            <span key={p} className="text-[0.4rem] md:text-[0.45rem] tracking-[0.12em] uppercase px-2 py-0.5 rounded-full"
              style={{ border: '1px solid rgba(240,198,116,0.12)', color: 'rgba(255,200,150,0.35)' }}>{p}</span>
          ))}
        </div>

        <div className="mb-8 px-4 py-1.5 rounded-full inline-block transition-all duration-[2s] delay-800"
          style={{
            background: 'linear-gradient(135deg, rgba(240,198,116,0.07), rgba(128,212,168,0.07))',
            border: '1px solid rgba(240,198,116,0.15)',
            opacity: phase === 'intro' ? 0 : 1,
          }}>
          <span className="text-[0.5rem] tracking-[0.12em]" style={{ color: 'rgba(240,198,116,0.55)' }}>
            Explore + Share = Enter to win cash prizes
          </span>
        </div>

        <button
          onClick={handleEnter}
          autoFocus
          aria-label="Enter the WAVMVMT World 3D experience"
          className="px-12 py-4 rounded-full text-sm font-semibold tracking-[0.35em] uppercase transition-all duration-500 cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-[#f0c674]"
          style={{
            border: '1px solid rgba(240,198,116,0.3)',
            color: '#f0c674',
            background: 'transparent',
            opacity: phase === 'ready' ? 1 : 0,
            transform: phase === 'ready' ? 'translateY(0)' : 'translateY(10px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(240,198,116,0.1)'
            e.currentTarget.style.borderColor = 'rgba(240,198,116,0.6)'
            e.currentTarget.style.boxShadow = '0 0 40px rgba(240,198,116,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(240,198,116,0.3)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Enter the Site
        </button>

        <div className="mt-6 flex flex-wrap justify-center gap-2 md:gap-3"
          style={{ opacity: phase === 'ready' ? 1 : 0, transition: 'opacity 1.5s ease', transitionDelay: '0.9s' }}>
          {[
            { label: 'Synesthesia', href: '/visualizer', icon: '🎨' },
            { label: 'The Founder', href: '/founder', icon: '~' },
            { label: 'Business Overview', href: '/pitch', icon: '📋' },
            { label: 'Music & Links', href: 'https://linktr.ee/shim.wav', icon: '🎵', external: true },
            { label: 'Instagram', href: 'https://instagram.com/shim.wav', icon: '📸', external: true },
            { label: 'Twitter/X', href: 'https://x.com/shimwav', icon: '𝕏', external: true },
          ].map((link) => (
            <a key={link.label} href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="px-3 py-1.5 rounded-full text-[0.55rem] tracking-[0.1em] uppercase transition-all"
              style={{ border: '1px solid rgba(240,198,116,0.2)', color: 'rgba(255,220,180,0.55)', textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(240,198,116,0.08)'; e.currentTarget.style.borderColor = 'rgba(240,198,116,0.4)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(240,198,116,0.2)' }}
            >
              <span className="mr-1">{link.icon}</span>{link.label}
            </a>
          ))}
        </div>

        <div className="mt-5 transition-all duration-[2s] delay-1000" style={{ opacity: phase === 'ready' ? 0.4 : 0 }}>
          <p className="text-[0.65rem] tracking-[0.1em] hidden md:block" style={{ color: 'rgba(255,220,180,0.4)' }}>
            WASD to move · Mouse to look · Space to jump
          </p>
          <p className="text-[0.65rem] tracking-[0.1em] md:hidden" style={{ color: 'rgba(255,220,180,0.4)' }}>
            Touch controls · Joystick to move · Swipe to look
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 text-center transition-all duration-[2s] delay-1000" style={{ opacity: phase === 'ready' ? 1 : 0 }}>
        <p className="text-[0.6rem]" style={{ color: 'rgba(255,200,150,0.3)' }}>
          Built by Arc.wav · Powered by Claude (Anthropic) · Planning by Intrinzic.wav
        </p>
        <p className="text-[0.5rem] italic mt-1" style={{ color: 'rgba(255,200,150,0.2)' }}>
          The world is always under construction — just like us
        </p>
      </div>

      <style jsx>{`
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.6; }
        }
        @keyframes eq-bar {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  )
}
