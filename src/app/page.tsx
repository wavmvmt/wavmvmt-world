'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TOTAL_SQFT } from '@/lib/roomConfig'
import { createClient } from '@/lib/supabase/client'

export default function HomePage() {
  const [emailStatus, setEmailStatus] = useState<'idle' | 'saving' | 'done'>('idle')
  const [visitorCount, setVisitorCount] = useState(0)

  useEffect(() => {
    // Fetch total visitor count from Supabase
    const supabase = createClient()
    supabase.from('world_visits').select('id', { count: 'exact', head: true }).then(({ count }) => {
      if (count) setVisitorCount(count)
    })
  }, [])

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    const input = (e.currentTarget as HTMLFormElement).querySelector('input') as HTMLInputElement
    if (!input?.value) return
    setEmailStatus('saving')
    try {
      const supabase = createClient()
      await supabase.from('email_subscribers').insert({
        email: input.value,
        source: 'landing_page',
        subscribed_at: new Date().toISOString(),
      })
    } catch {}
    setEmailStatus('done')
    input.value = ''
    setTimeout(() => setEmailStatus('idle'), 3000)
  }

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
          A New Renaissance
        </p>

        {/* Facility stats */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10">
          {[
            { value: `${(TOTAL_SQFT / 1000).toFixed(0)}K`, label: 'SQ FT' },
            { value: '13+', label: 'ROOMS' },
            { value: '$40M', label: 'BUILD' },
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

        {/* Contest teaser */}
        <div className="mt-4 px-4 py-2 rounded-full inline-block" style={{
          background: 'linear-gradient(135deg, rgba(240,198,116,0.06), rgba(128,212,168,0.06))',
          border: '1px solid rgba(240,198,116,0.12)',
        }}>
          <span className="text-[0.55rem] tracking-[0.15em]" style={{ color: 'rgba(240,198,116,0.5)' }}>
            Explore + Share = Enter to win cash prizes
          </span>
        </div>

        {/* Visitor counter */}
        {visitorCount > 0 && (
          <p className="mt-3 text-[0.5rem] font-mono" style={{ color: 'rgba(128,212,168,0.3)' }}>
            {visitorCount.toLocaleString()} visitors have explored the site
          </p>
        )}

        {/* Email capture */}
        <div className="mt-10 w-full max-w-sm mx-auto">
          <p className="text-[0.6rem] tracking-[0.2em] uppercase mb-3 text-center" style={{ color: 'rgba(255,200,150,0.25)' }}>
            Get updates on the build
          </p>
          <form onSubmit={handleEmailSubmit} className="flex gap-2">
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
              {emailStatus === 'saving' ? '...' : emailStatus === 'done' ? 'Joined!' : 'Join'}
            </button>
          </form>
        </div>

        {/* Explore more */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 md:gap-3">
          {[
            { label: '🎨 Synesthesia', href: '/visualizer' },
            { label: '~ Founder', href: '/founder' },
            { label: '📋 Business Overview', href: '/pitch' },
            { label: '🎵 Music', href: 'https://linktr.ee/shim.wav', external: true },
            { label: '📊 Stats', href: '/stats' },
          ].map((link) => (
            <a key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="px-3 py-1.5 rounded-full text-[0.5rem] md:text-[0.55rem] tracking-[0.1em] uppercase transition-all hover:border-[rgba(240,198,116,0.4)]"
              style={{
                border: '1px solid rgba(240,198,116,0.15)',
                color: 'rgba(255,220,180,0.45)',
                textDecoration: 'none',
              }}>
              {link.label}
            </a>
          ))}
        </div>

        {/* Social share */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {[
            { label: 'X / Twitter', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out @wavmvmt World — a 3D walkable construction site for a $40M wellness campus in Toronto 🏗️\n\nCreated by @shim_wav with @AnthropicAI Claude\n\nhttps://wavmvmt-world.vercel.app\n\n#WAVMVMT #BuildInPublic')}` },
            { label: 'LinkedIn', url: 'https://www.linkedin.com/sharing/share-offsite/?url=https://wavmvmt-world.vercel.app' },
            { label: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://wavmvmt-world.vercel.app')}` },
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

        <div className="mt-10 text-center">
          <p className="text-[0.6rem] tracking-[0.1em]" style={{ color: 'rgba(255,200,150,0.15)' }}>
            Created by <span style={{ color: 'rgba(240,198,116,0.3)' }}>Shim (Saadiq Khan)</span> · <span style={{ color: 'rgba(240,198,116,0.3)' }}>SET Ventures</span>
          </p>
          <p className="mt-1 text-[0.5rem] tracking-[0.1em]" style={{ color: 'rgba(255,200,150,0.1)' }}>
            Built with Claude by <span style={{ color: 'rgba(180,142,173,0.25)' }}>Anthropic</span> + <span style={{ color: 'rgba(128,212,168,0.25)' }}>Arc.wav</span>
          </p>
          <p className="mt-1 text-[0.45rem] italic" style={{ color: 'rgba(255,200,150,0.06)' }}>
            The world is always under construction — just like us · Since March 22, 2026
          </p>
        </div>
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
