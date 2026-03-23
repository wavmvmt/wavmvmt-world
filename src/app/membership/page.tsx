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

const tiers = [
  {
    name: 'Explorer',
    price: '$79/mo',
    color: '#7eb8da',
    features: [
      'Full gym access (weight training + cardio)',
      'Group classes (yoga, meditation, mobility)',
      'Café member discount (15%)',
      'Community events access',
      'Locker room + showers',
    ],
  },
  {
    name: 'Builder',
    price: '$149/mo',
    color: '#f0c674',
    popular: true,
    features: [
      'Everything in Explorer',
      'Parkour gym unlimited access',
      'Sound bath sessions (2/week)',
      'Recovery suite (sauna, ice bath — 3/week)',
      'Studio booking (2hrs/week)',
      'Education wing classes included',
      'Priority event booking',
    ],
  },
  {
    name: 'Legend',
    price: '$249/mo',
    color: '#80d4a8',
    features: [
      'Everything in Builder',
      'Unlimited recovery suite',
      'Unlimited studio time',
      'Amphitheatre event hosting (1/month)',
      'Personal training (2 sessions/month)',
      'VIP lounge access',
      'Guest passes (2/month)',
      'Merch discount (25%)',
    ],
  },
]

export default function MembershipPage() {
  const [form, setForm] = useState({ name: '', email: '', tier: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email) return
    setSubmitting(true)
    try {
      const supabase = createClient()
      await supabase.from('membership_interest').insert({
        name: form.name,
        email: form.email,
        preferred_tier: form.tier || 'undecided',
        message: form.message || null,
        submitted_at: new Date().toISOString(),
      })
    } catch {}
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen px-4 pt-20 pb-12 md:pt-24 md:pb-20"
      style={{ background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)' }}>
      <PageNav />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-4xl font-bold tracking-[0.1em] mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(255,240,220,0.9)' }}>
            Membership
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(255,200,150,0.3)' }}>
            Presale Interest · Founding Member Pricing
          </p>
          <p className="text-sm max-w-lg mx-auto" style={{ color: 'rgba(255,220,180,0.4)' }}>
            Register your interest now for founding member pricing. Early registrants
            get locked-in rates and priority access when doors open.
          </p>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {tiers.map((tier) => (
            <div key={tier.name} className="p-5 md:p-6 relative" style={{
              ...panelStyle,
              borderColor: tier.popular ? 'rgba(240,198,116,0.3)' : 'rgba(240,198,116,0.12)',
            }}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[0.45rem] tracking-[0.15em] uppercase"
                  style={{ background: 'rgba(240,198,116,0.15)', border: '1px solid rgba(240,198,116,0.3)', color: '#f0c674' }}>
                  Most Popular
                </div>
              )}
              <div className="text-center mb-4">
                <div className="text-lg font-bold" style={{ color: tier.color, fontFamily: "'Playfair Display', serif" }}>
                  {tier.name}
                </div>
                <div className="text-2xl font-mono font-bold mt-1" style={{ color: tier.color }}>
                  {tier.price}
                </div>
                <div className="text-[0.45rem] mt-0.5" style={{ color: 'rgba(255,220,180,0.2)' }}>
                  founding member rate
                </div>
              </div>
              <div className="space-y-2">
                {tier.features.map((f) => (
                  <div key={f} className="flex items-start gap-2">
                    <span className="text-[0.5rem] mt-0.5" style={{ color: tier.color }}>◆</span>
                    <span className="text-[0.55rem]" style={{ color: 'rgba(255,220,180,0.45)' }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Interest form */}
        <div className="max-w-md mx-auto p-5 md:p-6" style={panelStyle}>
          {submitted ? (
            <div className="text-center py-6">
              <div className="text-3xl mb-3">✓</div>
              <div className="text-sm font-bold mb-2" style={{ color: '#80d4a8' }}>Interest Registered!</div>
              <p className="text-[0.6rem]" style={{ color: 'rgba(255,220,180,0.4)' }}>
                You&apos;ll be among the first to know when founding memberships go live.
                Early registrants get locked-in pricing.
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-xs tracking-[0.2em] uppercase text-center mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>
                Register Interest
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input type="text" placeholder="Name *" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(240,198,116,0.05)', border: '1px solid rgba(240,198,116,0.12)', color: 'rgba(255,220,180,0.8)' }}
                />
                <input type="email" placeholder="Email *" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(240,198,116,0.05)', border: '1px solid rgba(240,198,116,0.12)', color: 'rgba(255,220,180,0.8)' }}
                />
                <select value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(240,198,116,0.05)', border: '1px solid rgba(240,198,116,0.12)', color: 'rgba(255,220,180,0.6)' }}>
                  <option value="">Preferred tier (optional)</option>
                  <option value="explorer">Explorer — $79/mo</option>
                  <option value="builder">Builder — $149/mo</option>
                  <option value="legend">Legend — $249/mo</option>
                </select>
                <textarea placeholder="Anything else? (optional)" value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: 'rgba(240,198,116,0.05)', border: '1px solid rgba(240,198,116,0.12)', color: 'rgba(255,220,180,0.8)' }}
                />
                <button type="submit" disabled={!form.name || !form.email || submitting}
                  className="w-full py-3 rounded-xl text-sm font-bold tracking-wider uppercase cursor-pointer"
                  style={{
                    background: form.name && form.email ? 'linear-gradient(135deg, rgba(240,198,116,0.15), rgba(128,212,168,0.15))' : 'rgba(240,198,116,0.05)',
                    border: '1px solid rgba(240,198,116,0.3)',
                    color: form.name && form.email ? '#f0c674' : 'rgba(255,220,180,0.2)',
                    opacity: submitting ? 0.5 : 1,
                  }}>
                  {submitting ? 'Submitting...' : 'Register My Interest'}
                </button>
              </form>
              <p className="text-[0.45rem] text-center mt-3" style={{ color: 'rgba(255,220,180,0.15)' }}>
                No commitment. No payment required. Just first in line.
              </p>
            </>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/world" className="text-[0.55rem] px-4 py-1.5 rounded-full"
            style={{ border: '1px solid rgba(128,212,168,0.15)', color: 'rgba(128,212,168,0.3)', textDecoration: 'none' }}>
            Explore the 3D World →
          </Link>
        </div>
      </div>
    </div>
  )
}
