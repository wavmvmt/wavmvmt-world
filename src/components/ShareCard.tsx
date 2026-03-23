'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const inputStyle = {
  background: 'rgba(240,198,116,0.05)',
  border: '1px solid rgba(240,198,116,0.15)',
  color: 'rgba(255,220,180,0.8)',
  borderRadius: '10px',
  padding: '8px 12px',
  fontSize: '0.7rem',
  width: '100%',
  outline: 'none',
  fontFamily: "'DM Sans', sans-serif",
}

/**
 * Share card with contestant registration.
 * Step 1: Enter name, email, phone, location
 * Step 2: Social share buttons unlock + entry confirmed
 */
export function ShareCard() {
  const [open, setOpen] = useState(false)
  const [questCount, setQuestCount] = useState(0)
  const [step, setStep] = useState<'register' | 'share'>('register')
  const [form, setForm] = useState({ name: '', email: '', phone: '', location: '' })
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const check = setInterval(() => {
      const quests = JSON.parse(sessionStorage.getItem('wavmvmt_quests') || '[]')
      setQuestCount(quests.length)
    }, 3000)
    return () => clearInterval(check)
  }, [])

  // Check if already registered this session
  useEffect(() => {
    if (sessionStorage.getItem('wavmvmt_contestant')) {
      setStep('share')
    }
  }, [])

  const shareText = `I just explored WAVMVMT World — a 3D construction site for a $40M wellness + fitness + arts + tech campus in Toronto!\n\n🏗️ ${questCount}/100 quests completed\n🎵 Music studio, sound bath, amphitheatre\n🏋️ Parkour gym, weight training, recovery suite\n📚 Education wing: business, coding, AI classes\n🛹 Skatepark, sports field, rooftop terrace\n\n13 rooms + outdoor campus + upper floor practitioner offices\n\nWalk through it yourself: https://wavmvmt-world.vercel.app\n\n#WAVMVMT #BuildInPublic #WellnessTech`

  async function handleRegister() {
    if (!form.name || !form.email) return
    setSubmitting(true)
    try {
      const supabase = createClient()
      await supabase.from('contestants').insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        location: form.location || null,
        quests_completed: questCount,
        registered_at: new Date().toISOString(),
      })
      sessionStorage.setItem('wavmvmt_contestant', form.email)
      setStep('share')
    } catch {
      // Still let them share even if DB fails
      setStep('share')
    }
    setSubmitting(false)
  }

  function handleShare(url: string) {
    // Log the share event
    try {
      const supabase = createClient()
      supabase.from('contestant_shares').insert({
        email: form.email || sessionStorage.getItem('wavmvmt_contestant') || 'unknown',
        platform: url.includes('twitter') ? 'twitter' : url.includes('linkedin') ? 'linkedin' : url.includes('facebook') ? 'facebook' : url.includes('wa.me') ? 'whatsapp' : 'other',
        shared_at: new Date().toISOString(),
      }).then(() => {})
    } catch {}
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'x' && !e.ctrlKey && !e.metaKey) setOpen(v => !v)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 pointer-events-auto"
      onClick={() => setOpen(false)}>
      <div className="max-w-sm mx-4 p-5 rounded-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(26,21,32,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(240,198,116,0.2)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        }}>

        {step === 'register' ? (
          <>
            {/* STEP 1: Registration */}
            <h3 className="text-sm font-bold mb-1" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>
              Share & Win Cash Prizes
            </h3>
            <p className="text-[0.55rem] mb-3" style={{ color: 'rgba(255,220,180,0.4)' }}>
              Enter your details to unlock sharing & enter the cash prize giveaway. Early sharers earn more entries.
            </p>

            {/* Contest info */}
            <div className="p-2.5 rounded-xl mb-3" style={{
              background: 'linear-gradient(135deg, rgba(240,198,116,0.08), rgba(128,212,168,0.08))',
              border: '1px solid rgba(240,198,116,0.12)',
            }}>
              <div className="text-[0.5rem]" style={{ color: 'rgba(255,220,180,0.5)' }}>
                Prizes awarded at first successful funding round and at grand opening. The earlier you share, the more entries you earn. Multiple shares = multiple entries.
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-3">
              <input
                type="text"
                placeholder="Your name *"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={inputStyle}
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="City / Location (optional)"
                value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                style={inputStyle}
              />
            </div>

            <button
              onClick={handleRegister}
              disabled={!form.name || !form.email || submitting}
              className="w-full py-2.5 rounded-xl text-[0.7rem] font-bold tracking-wider uppercase cursor-pointer transition-all"
              style={{
                background: form.name && form.email ? 'linear-gradient(135deg, rgba(240,198,116,0.2), rgba(128,212,168,0.2))' : 'rgba(240,198,116,0.05)',
                border: '1px solid rgba(240,198,116,0.3)',
                color: form.name && form.email ? '#f0c674' : 'rgba(255,220,180,0.25)',
                opacity: submitting ? 0.5 : 1,
              }}>
              {submitting ? 'Entering...' : 'Enter & Unlock Sharing'}
            </button>
          </>
        ) : (
          <>
            {/* STEP 2: Share buttons */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm" style={{ color: '#80d4a8' }}>✓</span>
              <h3 className="text-sm font-bold" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>
                You&apos;re Entered!
              </h3>
            </div>
            <p className="text-[0.55rem] mb-3" style={{ color: 'rgba(255,220,180,0.4)' }}>
              Now share to earn more entries. Each share on a different platform = another entry.
            </p>

            {/* Preview card */}
            <div className="p-2.5 rounded-xl mb-3" style={{ background: 'rgba(240,198,116,0.05)', border: '1px solid rgba(240,198,116,0.1)' }}>
              <pre className="text-[0.5rem] whitespace-pre-wrap" style={{ color: 'rgba(255,220,180,0.5)', fontFamily: "'DM Sans', sans-serif" }}>
                {shareText}
              </pre>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button onClick={() => handleShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`)}
                className="py-2 rounded-xl text-[0.6rem] font-medium tracking-wider uppercase cursor-pointer"
                style={{ border: '1px solid rgba(29,155,240,0.3)', color: '#1d9bf0', background: 'rgba(29,155,240,0.08)' }}>
                Post to X (+1 entry)
              </button>
              <button onClick={() => handleShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://wavmvmt-world.vercel.app')}`)}
                className="py-2 rounded-xl text-[0.6rem] font-medium tracking-wider uppercase cursor-pointer"
                style={{ border: '1px solid rgba(10,102,194,0.3)', color: '#0a66c2', background: 'rgba(10,102,194,0.08)' }}>
                LinkedIn (+1 entry)
              </button>
              <button onClick={() => handleShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://wavmvmt-world.vercel.app')}&quote=${encodeURIComponent(shareText)}`)}
                className="py-2 rounded-xl text-[0.6rem] font-medium tracking-wider uppercase cursor-pointer"
                style={{ border: '1px solid rgba(24,119,242,0.3)', color: '#1877f2', background: 'rgba(24,119,242,0.08)' }}>
                Facebook (+1 entry)
              </button>
              <button onClick={() => handleShare(`https://wa.me/?text=${encodeURIComponent(shareText)}`)}
                className="py-2 rounded-xl text-[0.6rem] font-medium tracking-wider uppercase cursor-pointer"
                style={{ border: '1px solid rgba(37,211,102,0.3)', color: '#25d366', background: 'rgba(37,211,102,0.08)' }}>
                WhatsApp (+1 entry)
              </button>
            </div>

            <div className="flex gap-2">
              <button onClick={copyToClipboard}
                className="flex-1 py-2 rounded-xl text-[0.6rem] font-medium tracking-wider uppercase cursor-pointer"
                style={{ border: '1px solid rgba(240,198,116,0.3)', color: copied ? '#80d4a8' : '#f0c674', background: 'rgba(240,198,116,0.08)' }}>
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
              <button onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'WAVMVMT World', text: shareText, url: 'https://wavmvmt-world.vercel.app' })
                }
              }}
                className="flex-1 py-2 rounded-xl text-[0.6rem] font-medium tracking-wider uppercase cursor-pointer"
                style={{ border: '1px solid rgba(128,212,168,0.3)', color: '#80d4a8', background: 'rgba(128,212,168,0.08)' }}>
                Share (Native)
              </button>
            </div>
          </>
        )}

        <p className="text-[0.45rem] text-center mt-3" style={{ color: 'rgba(255,220,180,0.2)' }}>
          Press X to close
        </p>
      </div>
    </div>
  )
}
