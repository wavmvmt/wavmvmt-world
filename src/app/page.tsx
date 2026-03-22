'use client'

import Link from 'next/link'
import { TOTAL_SQFT } from '@/lib/roomConfig'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)' }}>

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="absolute rounded-full"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              background: ['rgba(240,198,116,0.12)', 'rgba(128,212,168,0.1)', 'rgba(180,142,173,0.1)'][i % 3],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-up ${10 + Math.random() * 15}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Concentric rings */}
      <div className="absolute opacity-[0.02]">
        {[150, 280, 420].map((size, i) => (
          <div key={i} className="absolute rounded-full border"
            style={{
              width: size, height: size,
              top: `calc(50% - ${size / 2}px)`,
              left: `calc(50% - ${size / 2}px)`,
              borderColor: 'rgba(240,198,116,0.3)',
              animation: `pulse-ring ${5 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.8}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        {/* Wave symbol */}
        <div className="text-7xl md:text-[8rem] mb-4" style={{
          color: '#f0c674',
          opacity: 0.3,
          fontFamily: 'var(--font-playfair), serif',
          textShadow: '0 0 60px rgba(240,198,116,0.15)',
          animation: 'gentle-float 6s ease-in-out infinite',
        }}>~</div>

        {/* Title */}
        <h1 className="text-4xl md:text-7xl font-bold tracking-[0.12em] mb-3"
          style={{ fontFamily: 'var(--font-playfair), serif', color: 'rgba(255,240,220,0.9)' }}>
          WAVMVMT
        </h1>

        <p className="text-xs md:text-sm tracking-[0.35em] uppercase mb-4"
          style={{ color: 'rgba(255,200,150,0.4)' }}>
          The First App for the Whole Person
        </p>

        {/* Facility stats */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
          {[
            { value: `${(TOTAL_SQFT / 1000).toFixed(0)}K`, label: 'SQ FT' },
            { value: '12', label: 'ROOMS' },
            { value: '$20M', label: 'BUILD' },
            { value: 'Toronto', label: 'LOCATION' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-lg md:text-2xl font-bold font-mono" style={{ color: '#f0c674' }}>
                {stat.value}
              </div>
              <div className="text-[0.5rem] md:text-[0.6rem] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,200,150,0.25)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Pillars */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {['Music', 'Wellness', 'Fitness', 'Education', 'Technology', 'Community'].map((pillar) => (
            <span key={pillar} className="px-3 py-1 rounded-full text-[0.6rem] md:text-[0.65rem] tracking-[0.2em] uppercase"
              style={{
                border: '1px solid rgba(240,198,116,0.12)',
                color: 'rgba(255,220,180,0.35)',
              }}>
              {pillar}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link href="/world"
          className="inline-block px-10 md:px-14 py-4 rounded-full text-sm font-semibold tracking-[0.3em] uppercase transition-all duration-500 hover:shadow-[0_0_40px_rgba(240,198,116,0.15)] hover:border-[rgba(240,198,116,0.5)]"
          style={{
            border: '1px solid rgba(240,198,116,0.3)',
            color: '#f0c674',
            background: 'transparent',
          }}>
          Enter the World
        </Link>

        <p className="mt-4 text-[0.55rem] tracking-[0.15em]" style={{ color: 'rgba(255,200,150,0.2)' }}>
          Walk through our digital construction site
        </p>

        {/* Email capture */}
        <div className="mt-10 w-full max-w-sm mx-auto">
          <p className="text-[0.6rem] tracking-[0.2em] uppercase mb-3 text-center" style={{ color: 'rgba(255,200,150,0.25)' }}>
            Get updates on the build
          </p>
          <form onSubmit={(e) => {
            e.preventDefault()
            const input = e.currentTarget.querySelector('input') as HTMLInputElement
            if (input?.value) {
              // TODO: connect to Supabase or email service
              alert('Thanks! We\'ll keep you posted on the build.')
              input.value = ''
            }
          }} className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 py-2.5 px-4 rounded-full text-sm outline-none"
              style={{
                background: 'rgba(240,198,116,0.05)',
                border: '1px solid rgba(240,198,116,0.15)',
                color: 'rgba(255,240,220,0.8)',
              }}
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full text-sm font-medium tracking-wider uppercase"
              style={{
                border: '1px solid rgba(240,198,116,0.3)',
                color: '#f0c674',
                background: 'rgba(240,198,116,0.08)',
                cursor: 'pointer',
              }}
            >
              Join
            </button>
          </form>
        </div>

        {/* Social share */}
        <div className="mt-8 flex gap-4 justify-center">
          {[
            { label: 'X', url: 'https://twitter.com/intent/tweet?text=Check%20out%20WAVMVMT%20World%20%E2%80%94%20a%203D%20construction%20site%20for%20the%20future%20of%20wellness&url=https://wavmvmt-world.vercel.app' },
            { label: 'LinkedIn', url: 'https://www.linkedin.com/sharing/share-offsite/?url=https://wavmvmt-world.vercel.app' },
          ].map((social) => (
            <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-full text-[0.55rem] tracking-[0.2em] uppercase transition-all"
              style={{
                border: '1px solid rgba(240,198,116,0.1)',
                color: 'rgba(255,220,180,0.3)',
                textDecoration: 'none',
              }}>
              Share on {social.label}
            </a>
          ))}
        </div>

        <p className="mt-10 text-[0.6rem] tracking-[0.1em]" style={{ color: 'rgba(255,200,150,0.12)' }}>
          Built by Arc.wav · Built for builders
        </p>
        <p className="mt-1 text-[0.5rem] italic" style={{ color: 'rgba(255,200,150,0.08)' }}>
          The world is always under construction — just like us
        </p>
      </div>

      <style jsx>{`
        @keyframes float-up {
          0% { transform: translateY(100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-20px); opacity: 0; }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.6; }
        }
        @keyframes gentle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
