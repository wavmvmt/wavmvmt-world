'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const panelStyle = {
  background: 'rgba(26,21,32,0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(240,198,116,0.2)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
}

const SITE_URL = 'https://wavmvmt-world.vercel.app'

/**
 * Frictionless share flow:
 * 1. One-tap share buttons (no registration required)
 * 2. Native Share API on mobile
 * 3. Optional registration for contest entries AFTER sharing
 * 4. Copy button as fallback
 */
export function ShareCard() {
  const [open, setOpen] = useState(false)
  const [questCount, setQuestCount] = useState(0)
  const [shareCount, setShareCount] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const check = setInterval(() => {
      const quests = JSON.parse(sessionStorage.getItem('wavmvmt_quests') || '[]')
      setQuestCount(quests.length)
    }, 5000)
    if (sessionStorage.getItem('wavmvmt_contestant')) setRegistered(true)
    return () => clearInterval(check)
  }, [])

  // Listen for share trigger from other components
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('openShare', handler)
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'x' && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement)) {
        setOpen(v => !v)
      }
    }
    window.addEventListener('keydown', keyHandler)
    return () => {
      window.removeEventListener('openShare', handler)
      window.removeEventListener('keydown', keyHandler)
    }
  }, [])

  const shareText = `I just explored WAVMVMT World — a 3D walkable construction site for a $100M+ wellness, fitness & tech campus in Toronto 🏗️

Walk through it yourself 👇
${SITE_URL}

@wavmvmt @shim.wav
#WAVMVMT #BuildInPublic`

  const shareTextTwitter = `I just explored @wavmvmt World — a 3D construction site for a $100M+ wellness & tech campus 🏗️

Walk through it: ${SITE_URL}

Built by @shim_wav with @AnthropicAI Claude
#WAVMVMT #BuildInPublic`

  function share(platform: string, url: string) {
    setShareCount(c => c + 1)
    // Log share
    try {
      const supabase = createClient()
      supabase.from('contestant_shares').insert({
        email: sessionStorage.getItem('wavmvmt_contestant') || 'anonymous',
        platform,
        counts_as_entry: true,
        shared_at: new Date().toISOString(),
      }).then(() => {})
    } catch {}
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500')
  }

  function nativeShare() {
    if (navigator.share) {
      navigator.share({
        title: 'WAVMVMT World',
        text: 'Check out this 3D walkable construction site for a $100M+ wellness campus!',
        url: SITE_URL,
      })
      setShareCount(c => c + 1)
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(SITE_URL)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleRegister() {
    if (!form.name || !form.email) return
    setSubmitting(true)
    try {
      const supabase = createClient()
      await supabase.from('contestants').insert({
        name: form.name,
        email: form.email,
        quests_completed: questCount,
        shares_count: shareCount,
        registered_at: new Date().toISOString(),
      })
      sessionStorage.setItem('wavmvmt_contestant', form.email)
      setRegistered(true)
      setShowRegister(false)
    } catch {
      setRegistered(true)
      setShowRegister(false)
    }
    setSubmitting(false)
  }

  if (!open) return null

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-auto"
      onClick={() => setOpen(false)}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Card — slides up on mobile, centered on desktop */}
      <div
        className="relative w-full max-w-md mx-0 md:mx-4 p-5 md:rounded-2xl rounded-t-2xl"
        onClick={e => e.stopPropagation()}
        style={panelStyle}
      >
        {/* Close */}
        <button onClick={() => setOpen(false)}
          className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer"
          style={{ background: 'rgba(255,220,180,0.05)', color: 'rgba(255,220,180,0.3)', fontSize: '0.8rem' }}>
          ✕
        </button>

        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-bold" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>
            Share WAVMVMT World
          </h3>
          <p className="text-[0.6rem] mt-1" style={{ color: 'rgba(255,220,180,0.4)' }}>
            Help us build the movement. Share = contest entry for cash prizes.
          </p>
        </div>

        {/* ONE-TAP SHARE — Mobile native share first */}
        {isMobile && typeof window !== 'undefined' && 'share' in navigator && (
          <button onClick={nativeShare}
            className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wider uppercase cursor-pointer mb-3 transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(240,198,116,0.15), rgba(128,212,168,0.15))',
              border: '1px solid rgba(240,198,116,0.3)',
              color: '#f0c674',
            }}>
            📤 Share Now
          </button>
        )}

        {/* Platform buttons — big, tappable */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            { name: 'X', color: '#1d9bf0', bg: 'rgba(29,155,240,0.1)', border: 'rgba(29,155,240,0.25)',
              url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTextTwitter)}` },
            { name: 'LinkedIn', color: '#0a66c2', bg: 'rgba(10,102,194,0.1)', border: 'rgba(10,102,194,0.25)',
              url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SITE_URL)}` },
            { name: 'Facebook', color: '#1877f2', bg: 'rgba(24,119,242,0.1)', border: 'rgba(24,119,242,0.25)',
              url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}&quote=${encodeURIComponent(shareText)}` },
            { name: 'Threads', color: '#fff', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.15)',
              url: `https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}` },
            { name: 'WhatsApp', color: '#25d366', bg: 'rgba(37,211,102,0.08)', border: 'rgba(37,211,102,0.2)',
              url: `https://wa.me/?text=${encodeURIComponent(shareText)}` },
            { name: 'TikTok', color: '#ff0050', bg: 'rgba(255,0,80,0.08)', border: 'rgba(255,0,80,0.2)',
              url: `https://www.tiktok.com/` },
          ].map((p) => (
            <button key={p.name} onClick={() => share(p.name.toLowerCase(), p.url)}
              className="py-2.5 rounded-xl text-[0.6rem] font-semibold tracking-wider cursor-pointer transition-all"
              style={{ border: `1px solid ${p.border}`, color: p.color, background: p.bg }}>
              {p.name}
            </button>
          ))}
        </div>

        {/* Copy link — always visible */}
        <div className="flex gap-2 mb-3">
          <button onClick={copyLink}
            className="flex-1 py-2 rounded-xl text-[0.6rem] font-medium tracking-wider cursor-pointer"
            style={{ border: '1px solid rgba(240,198,116,0.2)', color: copied ? '#80d4a8' : 'rgba(255,220,180,0.5)', background: 'rgba(240,198,116,0.05)' }}>
            {copied ? '✓ Link Copied!' : '🔗 Copy Link'}
          </button>
          <button onClick={() => { navigator.clipboard.writeText(shareText); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
            className="flex-1 py-2 rounded-xl text-[0.6rem] font-medium tracking-wider cursor-pointer"
            style={{ border: '1px solid rgba(240,198,116,0.2)', color: 'rgba(255,220,180,0.5)', background: 'rgba(240,198,116,0.05)' }}>
            📋 Copy Text
          </button>
        </div>

        {/* Tag reminder */}
        <div className="p-2 rounded-lg mb-3 text-center" style={{ background: 'rgba(240,198,116,0.04)', border: '1px solid rgba(240,198,116,0.08)' }}>
          <div className="text-[0.55rem] font-mono" style={{ color: '#f0c674' }}>
            @wavmvmt · @shim.wav · #WAVMVMT
          </div>
        </div>

        {/* Contest registration — optional, below the fold */}
        {!registered ? (
          showRegister ? (
            <div className="p-3 rounded-xl" style={{ background: 'rgba(128,212,168,0.05)', border: '1px solid rgba(128,212,168,0.15)' }}>
              <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-2" style={{ color: 'rgba(128,212,168,0.5)' }}>
                Register for cash prize draw
              </div>
              <div className="flex flex-col gap-1.5 mb-2">
                <input type="text" placeholder="Name" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="px-3 py-1.5 rounded-lg text-[0.65rem] outline-none"
                  style={{ background: 'rgba(240,198,116,0.05)', border: '1px solid rgba(240,198,116,0.12)', color: 'rgba(255,220,180,0.8)' }} />
                <input type="email" placeholder="Email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="px-3 py-1.5 rounded-lg text-[0.65rem] outline-none"
                  style={{ background: 'rgba(240,198,116,0.05)', border: '1px solid rgba(240,198,116,0.12)', color: 'rgba(255,220,180,0.8)' }} />
              </div>
              <button onClick={handleRegister} disabled={!form.name || !form.email || submitting}
                className="w-full py-2 rounded-lg text-[0.6rem] font-bold tracking-wider uppercase cursor-pointer"
                style={{ background: 'rgba(128,212,168,0.1)', border: '1px solid rgba(128,212,168,0.3)', color: '#80d4a8', opacity: submitting ? 0.5 : 1 }}>
                {submitting ? 'Entering...' : 'Enter Prize Draw'}
              </button>
            </div>
          ) : (
            <button onClick={() => setShowRegister(true)}
              className="w-full py-2 rounded-xl text-[0.5rem] tracking-wider uppercase cursor-pointer"
              style={{ border: '1px solid rgba(128,212,168,0.1)', color: 'rgba(128,212,168,0.3)' }}>
              🎁 Register for cash prize draw (optional)
            </button>
          )
        ) : (
          <div className="text-center py-1">
            <span className="text-[0.55rem]" style={{ color: '#80d4a8' }}>✓ Registered · {shareCount} shares this session</span>
          </div>
        )}
      </div>
    </div>
  )
}
