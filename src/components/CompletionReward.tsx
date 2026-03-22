'use client'

import { useState, useEffect } from 'react'
import { ACHIEVEMENTS } from '@/lib/achievements'

const panelStyle = {
  background: 'rgba(26,21,32,0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(240,198,116,0.3)',
  boxShadow: '0 8px 60px rgba(240,198,116,0.1)',
}

/**
 * Shows when player completes ALL achievements (100%).
 * Offers entry into the membership roulette / prize draw.
 */
export function CompletionReward() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    // Check if already entered
    if (sessionStorage.getItem('wavmvmt_roulette_entered')) return

    // Monitor achievements
    const check = () => {
      const saved = JSON.parse(sessionStorage.getItem('wavmvmt_achievements') || '[]') as string[]
      if (saved.length >= ACHIEVEMENTS.length) {
        setShow(true)
        // Trigger confetti!
        window.dispatchEvent(new CustomEvent('celebrate'))
        setTimeout(() => window.dispatchEvent(new CustomEvent('celebrate')), 1000)
        setTimeout(() => window.dispatchEvent(new CustomEvent('celebrate')), 2000)
      }
    }

    const interval = setInterval(check, 5000)
    return () => clearInterval(interval)
  }, [])

  async function handleEnter() {
    if (!email.trim()) return
    // Save entry
    sessionStorage.setItem('wavmvmt_roulette_entered', 'true')
    sessionStorage.setItem('wavmvmt_roulette_email', email.trim())

    // Try to save to Supabase
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await supabase.from('roulette_entries').insert({
        email: email.trim(),
        achievements: JSON.parse(sessionStorage.getItem('wavmvmt_achievements') || '[]'),
        created_at: new Date().toISOString(),
      })
    } catch {
      // Fallback: localStorage only
    }

    setEntered(true)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 pointer-events-auto">
      <div className="max-w-md mx-4 p-8 rounded-3xl text-center" style={panelStyle}>
        {entered ? (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>
              You&apos;re In!
            </h2>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,220,180,0.7)' }}>
              You&apos;ve been entered into the WAVMVMT Membership Roulette.
              Winners receive prizes including a free 1-year membership.
            </p>
            <p className="text-[0.6rem]" style={{ color: 'rgba(255,220,180,0.3)' }}>
              We&apos;ll email you when winners are drawn. Thank you for exploring!
            </p>
            <button onClick={() => setShow(false)}
              className="mt-6 px-8 py-3 rounded-full text-sm tracking-widest uppercase cursor-pointer"
              style={{ border: '1px solid rgba(240,198,116,0.3)', color: '#f0c674', background: 'transparent' }}>
              Continue Exploring
            </button>
          </>
        ) : (
          <>
            <div className="text-5xl mb-2">🏆</div>
            <h2 className="text-xl font-bold mb-1" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>
              100% Complete!
            </h2>
            <p className="text-[0.6rem] tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(128,212,168,0.6)' }}>
              All {ACHIEVEMENTS.length} achievements unlocked
            </p>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,220,180,0.7)' }}>
              You&apos;ve explored every corner of WAVMVMT World.
              Enter your email for a chance to win:
            </p>

            {/* Prize list */}
            <div className="mb-6 text-left px-4">
              {[
                ['🥇', '5 Winners', 'Free 1-year membership ($2,400 value)'],
                ['🥈', '15 Winners', 'Free 3-month membership ($720 value)'],
                ['🥉', '30 Winners', 'Free 1-month membership ($240 value)'],
                ['🎟️', '50 Winners', 'Free week pass + WAVMVMT merch pack'],
                ['⭐', '100 Winners', 'Free day pass + exclusive sticker'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="flex items-center gap-3 my-2">
                  <span className="text-lg">{icon}</span>
                  <div>
                    <span className="text-[0.65rem] font-bold" style={{ color: '#f0c674' }}>{title}</span>
                    <span className="text-[0.6rem] ml-2" style={{ color: 'rgba(255,220,180,0.4)' }}>{desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleEnter()}
                className="flex-1 py-3 px-4 rounded-full text-sm outline-none"
                style={{
                  background: 'rgba(240,198,116,0.05)',
                  border: '1px solid rgba(240,198,116,0.2)',
                  color: 'rgba(255,240,220,0.8)',
                }}
              />
              <button onClick={handleEnter}
                className="px-6 py-3 rounded-full text-sm font-bold tracking-wider uppercase cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(240,198,116,0.2), rgba(128,212,168,0.2))',
                  border: '1px solid rgba(240,198,116,0.4)',
                  color: '#f0c674',
                }}>
                Enter
              </button>
            </div>

            <button onClick={() => setShow(false)}
              className="mt-4 text-[0.55rem] cursor-pointer" style={{ color: 'rgba(255,220,180,0.25)' }}>
              Maybe later
            </button>
          </>
        )}
      </div>
    </div>
  )
}
