'use client'

import { useState, useEffect } from 'react'
import { ROOMS, TOTAL_SQFT } from '@/lib/roomConfig'
import { FUNDRAISING, PHASE_2, formatCurrency } from '@/lib/fundraisingConfig'

const panelStyle = {
  background: 'rgba(10,8,18,0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(128,212,168,0.2)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
}

/**
 * Investor View Mode — press I to toggle.
 * Overlays financial data, ROI projections, and business metrics
 * on top of the 3D world. Same world, investor perspective.
 */
export function InvestorView() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'i' && !e.ctrlKey && !e.metaKey) setActive(v => !v)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  if (!active) return null

  const totalRoomCost = ROOMS.reduce((s, r) => s + r.buildCost, 0)
  const landAndCommon = FUNDRAISING.goal - totalRoomCost
  const totalInvestment = FUNDRAISING.goal + PHASE_2.additionalCost

  // Revenue projections (estimated)
  const membershipRevenue = 3_600_000 // ~3000 members × $100/mo avg
  const studioBookings = 480_000 // studio rentals
  const cafeRevenue = 360_000
  const eventRevenue = 240_000
  const phase2Revenue = PHASE_2.projectedAnnualRevenue
  const totalAnnualRevenue = membershipRevenue + studioBookings + cafeRevenue + eventRevenue + phase2Revenue

  return (
    <div className="fixed inset-0 z-35 pointer-events-none">
      {/* Header */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full"
        style={{ background: 'rgba(128,212,168,0.1)', border: '1px solid rgba(128,212,168,0.3)' }}>
        <span className="text-[0.6rem] tracking-[0.3em] uppercase font-mono" style={{ color: '#80d4a8' }}>
          Investor View · Press I to exit
        </span>
      </div>

      {/* Left panel — Investment Summary */}
      <div className="absolute top-24 left-3 md:left-5 p-4 rounded-2xl w-[260px] pointer-events-auto max-h-[70vh] overflow-y-auto" style={panelStyle}>
        <div className="text-[0.55rem] tracking-[0.25em] uppercase mb-3" style={{ color: 'rgba(128,212,168,0.5)' }}>
          Investment Summary
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            ['Total Investment', formatCurrency(totalInvestment)],
            ['Facility Size', `${(TOTAL_SQFT / 1000).toFixed(0)}K sqft`],
            ['Cost/sqft', `$${Math.round(FUNDRAISING.goal / TOTAL_SQFT)}`],
            ['Rooms', '12'],
          ].map(([label, value]) => (
            <div key={label} className="p-2 rounded-lg" style={{ background: 'rgba(128,212,168,0.05)' }}>
              <div className="text-[0.45rem] uppercase tracking-wider" style={{ color: 'rgba(128,212,168,0.35)' }}>{label}</div>
              <div className="text-sm font-bold font-mono" style={{ color: '#80d4a8' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Cost breakdown */}
        <div className="text-[0.5rem] tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(128,212,168,0.35)' }}>
          Cost Breakdown
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-[0.55rem] mb-1">
            <span style={{ color: 'rgba(255,220,180,0.5)' }}>Room buildout</span>
            <span className="font-mono" style={{ color: '#80d4a8' }}>{formatCurrency(totalRoomCost)}</span>
          </div>
          <div className="flex justify-between text-[0.55rem] mb-1">
            <span style={{ color: 'rgba(255,220,180,0.5)' }}>Land + common</span>
            <span className="font-mono" style={{ color: '#80d4a8' }}>{formatCurrency(landAndCommon)}</span>
          </div>
          <div className="flex justify-between text-[0.55rem] mb-1">
            <span style={{ color: 'rgba(255,220,180,0.5)' }}>Phase 2 (upper)</span>
            <span className="font-mono" style={{ color: 'rgba(136,192,208,0.6)' }}>{formatCurrency(PHASE_2.additionalCost)}</span>
          </div>
          <div className="flex justify-between text-[0.55rem] pt-1 font-bold" style={{ borderTop: '1px solid rgba(128,212,168,0.1)' }}>
            <span style={{ color: 'rgba(255,220,180,0.7)' }}>Total</span>
            <span className="font-mono" style={{ color: '#f0c674' }}>{formatCurrency(totalInvestment)}</span>
          </div>
        </div>

        {/* Revenue projections */}
        <div className="text-[0.5rem] tracking-[0.2em] uppercase mb-2 mt-3" style={{ color: 'rgba(128,212,168,0.35)' }}>
          Annual Revenue (Projected)
        </div>
        {[
          ['Memberships (~3K members)', membershipRevenue],
          ['Studio bookings', studioBookings],
          ['Cafe & retail', cafeRevenue],
          ['Events & rentals', eventRevenue],
          ['Phase 2 unit rentals', phase2Revenue],
        ].map(([label, amount]) => (
          <div key={label as string} className="flex justify-between text-[0.55rem] mb-1">
            <span style={{ color: 'rgba(255,220,180,0.4)' }}>{label}</span>
            <span className="font-mono" style={{ color: '#80d4a8' }}>{formatCurrency(amount as number)}</span>
          </div>
        ))}
        <div className="flex justify-between text-[0.55rem] pt-1 font-bold" style={{ borderTop: '1px solid rgba(128,212,168,0.1)' }}>
          <span style={{ color: 'rgba(255,220,180,0.7)' }}>Total annual</span>
          <span className="font-mono" style={{ color: '#f0c674' }}>{formatCurrency(totalAnnualRevenue)}</span>
        </div>

        {/* ROI */}
        <div className="mt-3 p-3 rounded-xl text-center" style={{ background: 'rgba(128,212,168,0.08)', border: '1px solid rgba(128,212,168,0.15)' }}>
          <div className="text-[0.45rem] uppercase tracking-wider" style={{ color: 'rgba(128,212,168,0.4)' }}>Simple ROI (Annual)</div>
          <div className="text-2xl font-bold font-mono" style={{ color: '#80d4a8' }}>
            {((totalAnnualRevenue / totalInvestment) * 100).toFixed(1)}%
          </div>
          <div className="text-[0.45rem]" style={{ color: 'rgba(128,212,168,0.3)' }}>
            Payback: ~{(totalInvestment / totalAnnualRevenue).toFixed(1)} years
          </div>
        </div>
      </div>

      {/* Right panel — Room-by-room ROI */}
      <div className="absolute top-24 right-3 md:right-5 p-4 rounded-2xl w-[240px] pointer-events-auto max-h-[60vh] overflow-y-auto" style={panelStyle}>
        <div className="text-[0.55rem] tracking-[0.25em] uppercase mb-3" style={{ color: 'rgba(128,212,168,0.5)' }}>
          Room Investment
        </div>
        {ROOMS.map(room => (
          <div key={room.name} className="mb-2 pb-2" style={{ borderBottom: '1px solid rgba(128,212,168,0.05)' }}>
            <div className="flex justify-between">
              <span className="text-[0.55rem] font-medium" style={{ color: `#${room.color.toString(16).padStart(6, '0')}` }}>
                {room.name}
              </span>
              <span className="text-[0.5rem] font-mono" style={{ color: '#80d4a8' }}>
                {formatCurrency(room.buildCost)}
              </span>
            </div>
            <div className="flex justify-between text-[0.45rem]">
              <span style={{ color: 'rgba(255,220,180,0.25)' }}>{room.sqft.toLocaleString()} sqft</span>
              <span style={{ color: 'rgba(255,220,180,0.25)' }}>
                ${Math.round(room.buildCost / room.sqft)}/sqft
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
