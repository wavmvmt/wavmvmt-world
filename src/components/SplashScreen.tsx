'use client'

import { useState, useEffect } from 'react'

export function SplashScreen({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<'intro' | 'ready' | 'fading'>('intro')

  useEffect(() => {
    const timer = setTimeout(() => setPhase('ready'), 1500)
    return () => clearTimeout(timer)
  }, [])

  function handleEnter() {
    setPhase('fading')
    // Trigger audio start — browser requires user gesture
    window.dispatchEvent(new CustomEvent('startAudio'))
    setTimeout(onEnter, 1200)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-[1200ms]"
      style={{
        opacity: phase === 'fading' ? 0 : 1,
        pointerEvents: phase === 'fading' ? 'none' : 'auto',
        background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)',
      }}
    >
      {/* Animated dust particles behind everything */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              background: 'rgba(240,198,116,0.15)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-up ${8 + Math.random() * 12}s linear infinite`,
              animationDelay: `${Math.random() * 8}s`,
            }}
          />
        ))}
      </div>

      {/* Concentric rings — construction target */}
      <div className="absolute opacity-[0.03]">
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
        {/* Wave */}
        <div
          className="text-8xl md:text-[10rem] mb-2 transition-all duration-[2s]"
          style={{
            color: '#f0c674',
            opacity: phase === 'intro' ? 0 : 0.4,
            fontFamily: "'Playfair Display', serif",
            textShadow: '0 0 60px rgba(240,198,116,0.2)',
            transform: phase === 'intro' ? 'translateY(20px)' : 'translateY(0)',
          }}
        >
          ~
        </div>

        {/* Title */}
        <h1
          className="text-3xl md:text-5xl font-bold tracking-[0.15em] mb-2 transition-all duration-[2s] delay-300"
          style={{
            fontFamily: "'Playfair Display', serif",
            color: 'rgba(255,240,220,0.9)',
            opacity: phase === 'intro' ? 0 : 1,
            transform: phase === 'intro' ? 'translateY(15px)' : 'translateY(0)',
          }}
        >
          WAVMVMT WORLD
        </h1>

        <p
          className="text-xs tracking-[0.4em] uppercase mb-1 transition-all duration-[2s] delay-500"
          style={{
            color: 'rgba(255,200,150,0.35)',
            opacity: phase === 'intro' ? 0 : 1,
          }}
        >
          Under Construction
        </p>

        {/* Quick stats */}
        <div
          className="flex gap-5 justify-center mb-6 transition-all duration-[2s] delay-600"
          style={{ opacity: phase === 'intro' ? 0 : 1 }}
        >
          {[
            ['$40M', 'vision'],
            ['13+', 'rooms'],
            ['100', 'quests'],
          ].map(([val, label]) => (
            <div key={label} className="text-center">
              <div className="text-lg font-bold font-mono" style={{ color: '#f0c674' }}>{val}</div>
              <div className="text-[0.45rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,200,150,0.2)' }}>{label}</div>
            </div>
          ))}
        </div>

        <p
          className="text-[0.6rem] tracking-[0.2em] mb-4 transition-all duration-[2s] delay-700"
          style={{
            color: 'rgba(255,200,150,0.2)',
            opacity: phase === 'intro' ? 0 : 1,
          }}
        >
          Toronto, ON · Wellness · Fitness · Music · Tech · Education
        </p>

        {/* Contest teaser */}
        <div
          className="mb-8 px-4 py-1.5 rounded-full inline-block transition-all duration-[2s] delay-800"
          style={{
            background: 'linear-gradient(135deg, rgba(240,198,116,0.05), rgba(128,212,168,0.05))',
            border: '1px solid rgba(240,198,116,0.1)',
            opacity: phase === 'intro' ? 0 : 1,
          }}
        >
          <span className="text-[0.5rem] tracking-[0.12em]" style={{ color: 'rgba(240,198,116,0.4)' }}>
            Explore + Share = Enter to win cash prizes
          </span>
        </div>

        {/* Enter button */}
        <button
          onClick={handleEnter}
          className="px-12 py-4 rounded-full text-sm font-semibold tracking-[0.35em] uppercase transition-all duration-500 cursor-pointer"
          style={{
            border: '1px solid rgba(240,198,116,0.3)',
            color: '#f0c674',
            background: 'transparent',
            opacity: phase === 'ready' ? 1 : 0,
            transform: phase === 'ready' ? 'translateY(0)' : 'translateY(10px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(240,198,116,0.08)'
            e.currentTarget.style.borderColor = 'rgba(240,198,116,0.5)'
            e.currentTarget.style.boxShadow = '0 0 40px rgba(240,198,116,0.12)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'rgba(240,198,116,0.3)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Enter the Site
        </button>

        {/* Quick links — business plan, music, socials */}
        <div
          className="mt-6 flex flex-wrap justify-center gap-3 transition-all duration-[2s] delay-900"
          style={{ opacity: phase === 'ready' ? 1 : 0 }}
        >
          {[
            { label: 'Synesthesia', href: '/visualizer', icon: '🎨' },
            { label: 'The Founder', href: '/founder', icon: '~' },
            { label: 'Business Overview', href: '/pitch', icon: '📋' },
            { label: 'Music & Links', href: 'https://linktr.ee/shim.wav', icon: '🎵', external: true },
            { label: 'Instagram', href: 'https://instagram.com/shim.wav', icon: '📸', external: true },
            { label: 'Twitter/X', href: 'https://x.com/shimwav', icon: '𝕏', external: true },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="px-3 py-1.5 rounded-full text-[0.55rem] tracking-[0.1em] uppercase transition-all hover:border-[rgba(240,198,116,0.5)]"
              style={{
                border: '1px solid rgba(240,198,116,0.2)',
                color: 'rgba(255,220,180,0.55)',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(240,198,116,0.06)'
                e.currentTarget.style.color = 'rgba(255,220,180,0.6)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'rgba(255,220,180,0.35)'
              }}
            >
              <span className="mr-1">{link.icon}</span>{link.label}
            </a>
          ))}
        </div>

        {/* Controls hint */}
        <div
          className="mt-5 transition-all duration-[2s] delay-1000"
          style={{ opacity: phase === 'ready' ? 0.4 : 0 }}
        >
          <p className="text-[0.65rem] tracking-[0.1em] hidden md:block" style={{ color: 'rgba(255,220,180,0.4)' }}>
            WASD to move · Mouse to look · Space to jump
          </p>
          <p className="text-[0.65rem] tracking-[0.1em] md:hidden" style={{ color: 'rgba(255,220,180,0.4)' }}>
            Touch controls · Joystick to move · Swipe to look
          </p>
        </div>
      </div>

      {/* Bottom tagline */}
      <div className="absolute bottom-8 text-center transition-all duration-[2s] delay-1000"
        style={{ opacity: phase === 'ready' ? 1 : 0 }}>
        <p className="text-[0.6rem]" style={{ color: 'rgba(255,200,150,0.3)' }}>
          Built by Arc.wav · Powered by Claude (Anthropic) · Planning by Intrinzic.wav
        </p>
        <p className="text-[0.5rem] italic mt-1" style={{ color: 'rgba(255,200,150,0.2)' }}>
          The world is always under construction — just like us
        </p>
      </div>

      <style jsx>{`
        @keyframes float-up {
          0% { transform: translateY(100vh) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-20px) translateX(${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 40}px); opacity: 0; }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
