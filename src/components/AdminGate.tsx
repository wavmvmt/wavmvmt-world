'use client'

import { useState, useEffect } from 'react'
import { AdminDashboard } from './AdminDashboard'

// SHA-256 hash of the admin PIN — never store plaintext
// To change PIN: run `echo -n "YOUR_PIN" | shasum -a 256` in terminal
// Current PIN hash is for "wavmvmt2026"
const PIN_HASH = '3386073425c71093534313aec3d445b250696aea416398bb39ba471d8a048ecb'

async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(pin)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

interface Props {
  contestants: any[]
  shares: any[]
  visits: any[]
  userEmail: string
}

/**
 * Two-layer admin security:
 * 1. Email whitelist (server-side, checked in page.tsx)
 * 2. PIN entry (client-side, hashed comparison)
 */
export function AdminGate({ contestants, shares, visits, userEmail }: Props) {
  const [unlocked, setUnlocked] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(false)

  async function checkPin() {
    setChecking(true)
    setError(false)
    const hash = await hashPin(pin)
    if (hash === PIN_HASH) {
      setUnlocked(true)
      sessionStorage.setItem('admin_unlocked', 'true')
    } else {
      setError(true)
      setPin('')
    }
    setChecking(false)
  }

  // Check if already unlocked this session
  useEffect(() => {
    if (sessionStorage.getItem('admin_unlocked') === 'true') {
      setUnlocked(true)
    }
  }, [])

  if (unlocked) {
    return <AdminDashboard contestants={contestants} shares={shares} visits={visits} userEmail={userEmail} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)' }}>
      <div className="max-w-xs w-full mx-4 p-6 rounded-2xl text-center"
        style={{
          background: 'rgba(26,21,32,0.9)',
          border: '1px solid rgba(240,198,116,0.15)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
        }}>
        <div className="text-3xl mb-2" style={{ color: '#f0c674' }}>🔒</div>
        <h2 className="text-sm font-bold mb-1" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>
          Admin Access
        </h2>
        <p className="text-[0.55rem] mb-4" style={{ color: 'rgba(255,220,180,0.3)' }}>
          Verified as {userEmail}. Enter PIN to continue.
        </p>

        <input
          type="password"
          value={pin}
          onChange={e => { setPin(e.target.value); setError(false) }}
          onKeyDown={e => e.key === 'Enter' && pin && checkPin()}
          placeholder="Enter admin PIN"
          autoFocus
          className="w-full px-4 py-3 rounded-xl text-center text-sm tracking-[0.3em] outline-none mb-3"
          style={{
            background: 'rgba(240,198,116,0.05)',
            border: `1px solid ${error ? 'rgba(225,48,108,0.4)' : 'rgba(240,198,116,0.15)'}`,
            color: 'rgba(255,220,180,0.8)',
            fontFamily: 'monospace',
          }}
        />

        {error && (
          <p className="text-[0.55rem] mb-2" style={{ color: '#e1306c' }}>
            Incorrect PIN. Try again.
          </p>
        )}

        <button
          onClick={checkPin}
          disabled={!pin || checking}
          className="w-full py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase cursor-pointer transition-all"
          style={{
            background: pin ? 'rgba(240,198,116,0.1)' : 'transparent',
            border: '1px solid rgba(240,198,116,0.25)',
            color: pin ? '#f0c674' : 'rgba(255,220,180,0.2)',
            opacity: checking ? 0.5 : 1,
          }}>
          {checking ? 'Checking...' : 'Unlock'}
        </button>
      </div>
    </div>
  )
}
