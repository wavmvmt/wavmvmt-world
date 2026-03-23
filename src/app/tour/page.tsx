'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PageNav } from '@/components/PageNav'
import { createClient } from '@/lib/supabase/client'

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  border: '1px solid rgba(240,198,116,0.12)',
  borderRadius: '16px',
}

export default function TourPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: 'virtual', date: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email) return
    setSubmitting(true)
    try {
      const supabase = createClient()
      await supabase.from('tour_bookings').insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        tour_type: form.type,
        preferred_date: form.date || null,
        message: form.message || null,
        submitted_at: new Date().toISOString(),
        status: 'pending',
      })
    } catch {}
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-12 md:pt-24 md:pb-20"
      style={{ background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)' }}>
      <PageNav />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-4xl font-bold tracking-[0.1em] mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(255,240,220,0.9)' }}>
            Book a Tour
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(255,200,150,0.3)' }}>
            See the Vision Up Close
          </p>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,220,180,0.4)' }}>
            Whether you&apos;re a potential investor, future member, or just curious — we&apos;d love to walk you through what we&apos;re building.
          </p>
        </div>

        {/* Tour types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-5" style={{
            ...panelStyle,
            borderColor: form.type === 'virtual' ? 'rgba(128,212,168,0.3)' : 'rgba(240,198,116,0.12)',
            cursor: 'pointer',
          }} onClick={() => setForm(f => ({ ...f, type: 'virtual' }))}>
            <div className="text-2xl mb-2">🖥️</div>
            <div className="text-sm font-bold mb-1" style={{ color: form.type === 'virtual' ? '#80d4a8' : 'rgba(255,220,180,0.6)' }}>
              Virtual Tour
            </div>
            <p className="text-[0.6rem]" style={{ color: 'rgba(255,220,180,0.35)' }}>
              30-minute video call walking through the 3D world, architectural renders, business plan, and Q&A. Available now.
            </p>
          </div>
          <div className="p-5" style={{
            ...panelStyle,
            borderColor: form.type === 'site' ? 'rgba(240,198,116,0.3)' : 'rgba(240,198,116,0.12)',
            cursor: 'pointer',
          }} onClick={() => setForm(f => ({ ...f, type: 'site' }))}>
            <div className="text-2xl mb-2">🏗️</div>
            <div className="text-sm font-bold mb-1" style={{ color: form.type === 'site' ? '#f0c674' : 'rgba(255,220,180,0.6)' }}>
              Site Visit
            </div>
            <p className="text-[0.6rem]" style={{ color: 'rgba(255,220,180,0.35)' }}>
              In-person walkthrough of potential sites in Toronto. Available once site selection is finalized. Register interest now.
            </p>
          </div>
        </div>

        {/* Booking form */}
        <div className="p-5 md:p-6" style={panelStyle}>
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-3">✓</div>
              <div className="text-sm font-bold mb-2" style={{ color: '#80d4a8' }}>Tour Request Received!</div>
              <p className="text-[0.6rem]" style={{ color: 'rgba(255,220,180,0.4)' }}>
                We&apos;ll reach out within 48 hours to schedule your {form.type === 'virtual' ? 'virtual tour' : 'site visit'}.
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-xs tracking-[0.2em] uppercase text-center mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>
                Request a {form.type === 'virtual' ? 'Virtual Tour' : 'Site Visit'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text" placeholder="Name *" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(240,198,116,0.05)', border: '1px solid rgba(240,198,116,0.12)', color: 'rgba(255,220,180,0.8)' }} />
                <input type="email" placeholder="Email *" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(240,198,116,0.05)', border: '1px solid rgba(240,198,116,0.12)', color: 'rgba(255,220,180,0.8)' }} />
                <input type="tel" placeholder="Phone (optional)" value={form.phone}
                  onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(240,198,116,0.05)', border: '1px solid rgba(240,198,116,0.12)', color: 'rgba(255,220,180,0.8)' }} />
                <input type="date" value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(240,198,116,0.05)', border: '1px solid rgba(240,198,116,0.12)', color: 'rgba(255,220,180,0.6)' }} />
                <textarea placeholder="What are you most interested in? (optional)" value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: 'rgba(240,198,116,0.05)', border: '1px solid rgba(240,198,116,0.12)', color: 'rgba(255,220,180,0.8)' }} />
                <button type="submit" disabled={!form.name || !form.email || submitting}
                  className="w-full py-3 rounded-xl text-sm font-bold tracking-wider uppercase cursor-pointer"
                  style={{
                    background: form.name && form.email ? 'linear-gradient(135deg, rgba(240,198,116,0.15), rgba(128,212,168,0.15))' : 'rgba(240,198,116,0.05)',
                    border: '1px solid rgba(240,198,116,0.3)',
                    color: form.name && form.email ? '#f0c674' : 'rgba(255,220,180,0.2)',
                    opacity: submitting ? 0.5 : 1,
                  }}>
                  {submitting ? 'Submitting...' : 'Request Tour'}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="text-center mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/membership" className="text-[0.55rem] px-4 py-1.5 rounded-full"
            style={{ border: '1px solid rgba(240,198,116,0.15)', color: 'rgba(255,220,180,0.3)', textDecoration: 'none' }}>
            Membership →
          </Link>
          <Link href="/world" className="text-[0.55rem] px-4 py-1.5 rounded-full"
            style={{ border: '1px solid rgba(128,212,168,0.15)', color: 'rgba(128,212,168,0.3)', textDecoration: 'none' }}>
            Explore 3D World →
          </Link>
        </div>
      </div>
    </div>
  )
}
