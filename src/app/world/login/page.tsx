'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const PROVIDERS = [
  { id: 'google' as const, label: 'Continue with Google', icon: '🔵', color: 'rgba(128,212,168,0.15)', border: 'rgba(128,212,168,0.3)' },
  { id: 'discord' as const, label: 'Continue with Discord', icon: '🟣', color: 'rgba(180,142,173,0.15)', border: 'rgba(180,142,173,0.3)' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const supabase = createClient()

  async function loginWithProvider(provider: 'google' | 'discord') {
    setLoading(provider)
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  async function loginWithEmail() {
    if (!email) return
    setLoading('email')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (!error) setEmailSent(true)
    setLoading(null)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)' }}>

      {/* Floating wave */}
      <div className="text-6xl md:text-8xl animate-bounce" style={{
        color: '#f0c674', opacity: 0.4, fontFamily: "'Playfair Display', serif",
        textShadow: '0 0 40px rgba(240,198,116,0.2)', animationDuration: '5s'
      }}>~</div>

      {/* Title */}
      <h1 className="text-2xl md:text-4xl font-bold mt-4 tracking-widest"
        style={{ color: 'rgba(255,240,220,0.9)', fontFamily: "'Playfair Display', serif" }}>
        WAVMVMT WORLD
      </h1>
      <p className="text-xs tracking-[0.35em] uppercase mt-2" style={{ color: 'rgba(255,200,150,0.35)' }}>
        Under Construction
      </p>

      {/* Auth card */}
      <div className="mt-10 w-full max-w-sm px-6">
        <div className="rounded-2xl p-6 space-y-3"
          style={{
            background: 'rgba(26,21,32,0.75)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,200,120,0.12)',
            boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
          }}>

          {/* Social providers */}
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => loginWithProvider(p.id)}
              disabled={loading !== null}
              className="w-full py-3 px-4 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer disabled:opacity-50"
              style={{
                background: p.color,
                border: `1px solid ${p.border}`,
                color: 'rgba(255,240,220,0.85)',
              }}
            >
              {p.icon} {loading === p.id ? 'Redirecting...' : p.label}
            </button>
          ))}

          {/* Divider */}
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,200,120,0.1)' }} />
            <span className="text-xs" style={{ color: 'rgba(255,200,150,0.3)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,200,120,0.1)' }} />
          </div>

          {/* Email magic link */}
          {emailSent ? (
            <p className="text-center text-sm py-3" style={{ color: '#80d4a8' }}>
              Check your email for the magic link ✨
            </p>
          ) : (
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loginWithEmail()}
                className="flex-1 py-2.5 px-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'rgba(240,198,116,0.05)',
                  border: '1px solid rgba(240,198,116,0.15)',
                  color: 'rgba(255,240,220,0.85)',
                }}
              />
              <button
                onClick={loginWithEmail}
                disabled={loading !== null || !email}
                className="py-2.5 px-4 rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-50"
                style={{
                  border: '1px solid rgba(240,198,116,0.3)',
                  color: '#f0c674',
                  background: 'rgba(240,198,116,0.08)',
                }}
              >
                {loading === 'email' ? '...' : '→'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs" style={{ color: 'rgba(255,200,150,0.12)', fontStyle: 'italic' }}>
        Built by Arc.wav · Built for builders · The world is always under construction — just like us
      </p>
    </div>
  )
}
