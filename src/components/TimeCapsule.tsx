'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const panelStyle = {
  background: 'rgba(26,21,32,0.92)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(240,198,116,0.2)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
}

/**
 * Time Capsule — visitors write a message that gets "buried" in the construction.
 * Messages go to a moderation queue (Supabase) — Shim approves before they show.
 * When the real center opens, approved messages get printed on a physical wall.
 */
export function TimeCapsule() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  async function handleSubmit() {
    if (!message.trim()) return
    setSending(true)

    try {
      const supabase = createClient()
      await supabase.from('suggestions').insert({
        text: `[TIME CAPSULE] ${message.trim()}`,
        name: name.trim() || 'Anonymous Builder',
      })
    } catch {
      // Fallback to localStorage
      const existing = JSON.parse(localStorage.getItem('wavmvmt_capsule') || '[]')
      existing.push({ name: name.trim() || 'Anonymous Builder', message: message.trim(), time: Date.now() })
      localStorage.setItem('wavmvmt_capsule', JSON.stringify(existing))
    }

    setSending(false)
    setSubmitted(true)
    setMessage('')
    setName('')
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)}
        className="fixed bottom-8 md:bottom-72 left-3 md:left-5 pointer-events-auto px-3 py-2 rounded-xl text-[0.55rem] tracking-wider uppercase cursor-pointer z-10"
        style={{
          background: 'rgba(26,21,32,0.75)',
          border: '1px solid rgba(240,198,116,0.15)',
          color: 'rgba(240,198,116,0.4)',
        }}>
        Time Capsule
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 pointer-events-auto"
      onClick={() => setOpen(false)}>
      <div className="max-w-sm mx-4 p-6 rounded-2xl" style={panelStyle}
        onClick={e => e.stopPropagation()}>

        {submitted ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">💎</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>
              Message Buried
            </h3>
            <p className="text-[0.65rem] mb-2" style={{ color: 'rgba(255,220,180,0.6)' }}>
              Your message has been sealed in the WAVMVMT time capsule. When the center opens, approved messages will be displayed on a physical wall inside the building.
            </p>
            <p className="text-[0.5rem]" style={{ color: 'rgba(255,220,180,0.25)' }}>
              All messages are reviewed before display.
            </p>
            <button onClick={() => { setOpen(false); setSubmitted(false) }}
              className="mt-4 px-6 py-2 rounded-full text-[0.65rem] tracking-wider uppercase cursor-pointer"
              style={{ border: '1px solid rgba(240,198,116,0.3)', color: '#f0c674' }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <div className="text-3xl mb-2">🕰️</div>
              <h3 className="text-lg font-bold" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>
                Time Capsule
              </h3>
              <p className="text-[0.6rem] mt-1" style={{ color: 'rgba(255,220,180,0.4)' }}>
                Leave a message for the future. When the WAVMVMT Center opens, approved messages will be printed and displayed on a physical wall inside the building.
              </p>
            </div>

            <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
              className="w-full py-2.5 px-4 rounded-xl text-sm mb-2 outline-none"
              style={{ background: 'rgba(240,198,116,0.05)', border: '1px solid rgba(240,198,116,0.15)', color: 'rgba(255,240,220,0.8)' }} />

            <textarea placeholder="Your message to the future..." value={message} onChange={e => setMessage(e.target.value)}
              rows={3} maxLength={280}
              className="w-full py-2.5 px-4 rounded-xl text-sm mb-1 outline-none resize-none"
              style={{ background: 'rgba(240,198,116,0.05)', border: '1px solid rgba(240,198,116,0.15)', color: 'rgba(255,240,220,0.8)' }} />

            <div className="flex justify-between mb-3">
              <span className="text-[0.45rem]" style={{ color: 'rgba(255,220,180,0.2)' }}>{message.length}/280</span>
              <span className="text-[0.45rem]" style={{ color: 'rgba(255,220,180,0.2)' }}>All messages reviewed before display</span>
            </div>

            <button onClick={handleSubmit} disabled={!message.trim() || sending}
              className="w-full py-3 rounded-xl text-sm font-medium tracking-wider uppercase cursor-pointer disabled:opacity-40"
              style={{
                background: 'linear-gradient(135deg, rgba(240,198,116,0.15), rgba(128,212,168,0.15))',
                border: '1px solid rgba(240,198,116,0.3)',
                color: '#f0c674',
              }}>
              {sending ? 'Sealing...' : 'Bury in the Capsule'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
