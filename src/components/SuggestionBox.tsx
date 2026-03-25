'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { sanitizeText, rateLimit } from '@/lib/sanitize'

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,200,120,0.12)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
}

/**
 * Suggestion box — visitors can leave ideas for what they'd want
 * to see in the space (virtual and real life).
 * Saves to Supabase `suggestions` table (created on first use).
 */
export function SuggestionBox() {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  async function handleSubmit() {
    if (!text.trim()) return
    if (!rateLimit('suggestion', 10000)) return // 10s cooldown
    setSending(true)

    const cleanText = sanitizeText(text, 500)
    const cleanName = sanitizeText(name, 50) || 'Anonymous'

    try {
      const supabase = createClient()
      await supabase.from('suggestions').insert({
        text: cleanText,
        name: cleanName,
        created_at: new Date().toISOString(),
      })
    } catch {
      // Table might not exist yet — store locally as fallback
      const existing = JSON.parse(localStorage.getItem('wavmvmt_suggestions') || '[]')
      existing.push({ text: text.trim(), name: name.trim() || 'Anonymous', time: Date.now() })
      localStorage.setItem('wavmvmt_suggestions', JSON.stringify(existing))
    }

    setSubmitted(true)
    setSending(false)
    setText('')
    setName('')
    setTimeout(() => { setSubmitted(false); setOpen(false) }, 3000)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 md:bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:bottom-24 md:left-5 pointer-events-auto px-4 py-2 rounded-xl text-[0.6rem] tracking-[0.15em] uppercase cursor-pointer z-10"
        style={{ ...panelStyle, color: 'rgba(255,220,180,0.4)' }}
      >
        Leave a Suggestion
      </button>
    )
  }

  return (
    <div className="fixed bottom-20 md:bottom-24 left-3 md:left-5 right-3 md:right-auto md:w-72 pointer-events-auto z-30 p-4 rounded-2xl" style={panelStyle}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-[0.6rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,220,180,0.4)' }}>
          Suggestion Box
        </span>
        <button onClick={() => setOpen(false)} className="text-[0.6rem] cursor-pointer" style={{ color: 'rgba(255,220,180,0.3)' }}>×</button>
      </div>

      {submitted ? (
        <p className="text-sm text-center py-4" style={{ color: '#80d4a8' }}>
          Thanks! Your idea has been noted.
        </p>
      ) : (
        <>
          <p className="text-[0.55rem] mb-3" style={{ color: 'rgba(255,220,180,0.3)' }}>
            What would you want to see in the WAVMVMT Center? Virtual or real life — all ideas welcome.
          </p>
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full py-2 px-3 rounded-xl text-[0.7rem] mb-2 outline-none"
            style={{
              background: 'rgba(240,198,116,0.05)',
              border: '1px solid rgba(240,198,116,0.1)',
              color: 'rgba(255,240,220,0.7)',
            }}
          />
          <textarea
            placeholder="Your idea or suggestion..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full py-2 px-3 rounded-xl text-[0.7rem] mb-2 outline-none resize-none"
            style={{
              background: 'rgba(240,198,116,0.05)',
              border: '1px solid rgba(240,198,116,0.1)',
              color: 'rgba(255,240,220,0.7)',
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || sending}
            className="w-full py-2 rounded-xl text-[0.65rem] font-medium tracking-wider uppercase cursor-pointer disabled:opacity-40"
            style={{
              border: '1px solid rgba(240,198,116,0.3)',
              color: '#f0c674',
              background: 'rgba(240,198,116,0.08)',
            }}
          >
            {sending ? 'Sending...' : 'Submit Idea'}
          </button>
        </>
      )}
    </div>
  )
}
