'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Contestant {
  id?: string
  name: string
  email: string
  phone?: string
  location?: string
  quests_completed?: number
  shares_count?: number
  registered_at: string
}

interface Share {
  id?: string
  email: string
  platform: string
  counts_as_entry: boolean
  shared_at: string
}

interface Visit {
  id?: string
  visited_at: string
  user_agent?: string
}

const cardStyle = {
  background: 'rgba(26,21,32,0.85)',
  border: '1px solid rgba(240,198,116,0.12)',
  borderRadius: '16px',
  padding: '20px',
}

export function AdminDashboard({ contestants, shares, visits, userEmail }: {
  contestants: Contestant[]
  shares: Share[]
  visits: Visit[]
  userEmail: string
}) {
  const [tab, setTab] = useState<'overview' | 'contestants' | 'shares' | 'visits'>('overview')

  // Metrics
  const totalContestants = contestants.length
  const totalShares = shares.length
  const socialShares = shares.filter(s => s.counts_as_entry).length
  const totalVisits = visits.length

  // Platform breakdown
  const platformCounts: Record<string, number> = {}
  shares.forEach(s => {
    platformCounts[s.platform] = (platformCounts[s.platform] || 0) + 1
  })

  // Recent activity (last 24h)
  const now = Date.now()
  const last24h = (items: { registered_at?: string; shared_at?: string; visited_at?: string }[]) =>
    items.filter(i => {
      const t = i.registered_at || i.shared_at || i.visited_at || ''
      return now - new Date(t).getTime() < 86400000
    }).length

  const tabs = [
    { key: 'overview' as const, label: 'Overview' },
    { key: 'contestants' as const, label: `Contestants (${totalContestants})` },
    { key: 'shares' as const, label: `Shares (${totalShares})` },
    { key: 'visits' as const, label: `Visits (${totalVisits})` },
  ]

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>
              WAVMVMT Admin
            </h1>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,220,180,0.3)' }}>
              Logged in as {userEmail}
            </p>
          </div>
          <Link href="/world" className="text-xs px-4 py-2 rounded-xl"
            style={{ border: '1px solid rgba(240,198,116,0.2)', color: 'rgba(255,220,180,0.4)', textDecoration: 'none' }}>
            ← Back to World
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-4 py-2 rounded-xl text-xs tracking-wider cursor-pointer transition-all"
              style={{
                background: tab === t.key ? 'rgba(240,198,116,0.1)' : 'transparent',
                border: `1px solid ${tab === t.key ? 'rgba(240,198,116,0.3)' : 'rgba(240,198,116,0.08)'}`,
                color: tab === t.key ? '#f0c674' : 'rgba(255,220,180,0.4)',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <>
            {/* Metric cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Contestants', value: totalContestants, sub: `${last24h(contestants)} last 24h`, color: '#f0c674' },
                { label: 'Total Shares', value: totalShares, sub: `${socialShares} contest entries`, color: '#80d4a8' },
                { label: 'Site Visits', value: totalVisits, sub: `${last24h(visits)} last 24h`, color: '#7eb8da' },
                { label: 'Conversion', value: totalVisits > 0 ? `${Math.round((totalContestants / totalVisits) * 100)}%` : '—', sub: 'visitor → contestant', color: '#e1306c' },
              ].map(m => (
                <div key={m.label} style={cardStyle}>
                  <div className="text-[0.55rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(255,220,180,0.3)' }}>
                    {m.label}
                  </div>
                  <div className="text-2xl font-bold font-mono" style={{ color: m.color }}>
                    {m.value}
                  </div>
                  <div className="text-[0.5rem] mt-1" style={{ color: 'rgba(255,220,180,0.25)' }}>
                    {m.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Platform breakdown */}
            <div style={cardStyle} className="mb-6">
              <div className="text-[0.55rem] tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(255,220,180,0.3)' }}>
                Shares by Platform
              </div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {Object.entries(platformCounts).sort((a, b) => b[1] - a[1]).map(([platform, count]) => (
                  <div key={platform} className="text-center">
                    <div className="text-lg font-bold font-mono" style={{ color: '#f0c674' }}>{count}</div>
                    <div className="text-[0.5rem] uppercase tracking-wider" style={{ color: 'rgba(255,220,180,0.3)' }}>
                      {platform}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent contestants */}
            <div style={cardStyle}>
              <div className="text-[0.55rem] tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(255,220,180,0.3)' }}>
                Recent Contestants
              </div>
              <div className="space-y-2">
                {contestants.slice(0, 10).map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: 'rgba(255,220,180,0.05)' }}>
                    <div>
                      <span className="text-xs font-medium" style={{ color: 'rgba(255,220,180,0.7)' }}>{c.name}</span>
                      <span className="text-[0.5rem] ml-2" style={{ color: 'rgba(255,220,180,0.25)' }}>{c.email}</span>
                    </div>
                    <div className="text-[0.5rem]" style={{ color: 'rgba(255,220,180,0.2)' }}>
                      {new Date(c.registered_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Contestants table */}
        {tab === 'contestants' && (
          <div style={cardStyle}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    {['Name', 'Email', 'Phone', 'Location', 'Quests', 'Shares', 'Registered'].map(h => (
                      <th key={h} className="text-[0.5rem] tracking-[0.15em] uppercase pb-3 pr-4" style={{ color: 'rgba(255,220,180,0.3)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {contestants.map((c, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: 'rgba(255,220,180,0.05)' }}>
                      <td className="py-2 pr-4 text-xs" style={{ color: 'rgba(255,220,180,0.7)' }}>{c.name}</td>
                      <td className="py-2 pr-4 text-xs font-mono" style={{ color: 'rgba(255,220,180,0.5)' }}>{c.email}</td>
                      <td className="py-2 pr-4 text-xs" style={{ color: 'rgba(255,220,180,0.3)' }}>{c.phone || '—'}</td>
                      <td className="py-2 pr-4 text-xs" style={{ color: 'rgba(255,220,180,0.3)' }}>{c.location || '—'}</td>
                      <td className="py-2 pr-4 text-xs font-mono" style={{ color: '#80d4a8' }}>{c.quests_completed || 0}</td>
                      <td className="py-2 pr-4 text-xs font-mono" style={{ color: '#f0c674' }}>{c.shares_count || 0}</td>
                      <td className="py-2 text-[0.5rem]" style={{ color: 'rgba(255,220,180,0.2)' }}>
                        {new Date(c.registered_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {contestants.length === 0 && (
              <p className="text-center py-8 text-xs" style={{ color: 'rgba(255,220,180,0.2)' }}>No contestants yet</p>
            )}
          </div>
        )}

        {/* Shares table */}
        {tab === 'shares' && (
          <div style={cardStyle}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    {['Email', 'Platform', 'Contest Entry', 'Time'].map(h => (
                      <th key={h} className="text-[0.5rem] tracking-[0.15em] uppercase pb-3 pr-4" style={{ color: 'rgba(255,220,180,0.3)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shares.map((s, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: 'rgba(255,220,180,0.05)' }}>
                      <td className="py-2 pr-4 text-xs font-mono" style={{ color: 'rgba(255,220,180,0.5)' }}>{s.email}</td>
                      <td className="py-2 pr-4 text-xs uppercase" style={{ color: '#f0c674' }}>{s.platform}</td>
                      <td className="py-2 pr-4 text-xs" style={{ color: s.counts_as_entry ? '#80d4a8' : 'rgba(255,220,180,0.2)' }}>
                        {s.counts_as_entry ? '✓ Yes' : 'No'}
                      </td>
                      <td className="py-2 text-[0.5rem]" style={{ color: 'rgba(255,220,180,0.2)' }}>
                        {new Date(s.shared_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {shares.length === 0 && (
              <p className="text-center py-8 text-xs" style={{ color: 'rgba(255,220,180,0.2)' }}>No shares yet</p>
            )}
          </div>
        )}

        {/* Visits */}
        {tab === 'visits' && (
          <div style={cardStyle}>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,220,180,0.4)' }}>
              Recent {visits.length} visits (stored in Supabase world_visits table)
            </p>
            <div className="space-y-1">
              {visits.map((v, i) => (
                <div key={i} className="flex justify-between py-1 border-b" style={{ borderColor: 'rgba(255,220,180,0.03)' }}>
                  <span className="text-[0.5rem]" style={{ color: 'rgba(255,220,180,0.2)' }}>
                    {new Date(v.visited_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            {visits.length === 0 && (
              <p className="text-center py-8 text-xs" style={{ color: 'rgba(255,220,180,0.2)' }}>No visits tracked yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
