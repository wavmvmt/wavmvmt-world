import { ROOMS, TOTAL_SQFT } from '@/lib/roomConfig'
import { FUNDRAISING, PHASE_2, formatCurrency } from '@/lib/fundraisingConfig'
import Link from 'next/link'

export const metadata = {
  title: 'WAVMVMT World — Project Stats',
  description: 'Full breakdown of the WAVMVMT Center: 12 rooms, 42,500 sq ft, $20M build in Toronto.',
}

export default function StatsPage() {
  const totalRoomCost = ROOMS.reduce((sum, r) => sum + r.buildCost, 0)

  return (
    <div className="min-h-screen py-12 px-6 max-w-3xl mx-auto"
      style={{ background: '#1a1520', color: 'rgba(255,240,220,0.8)' }}>

      <Link href="/" className="text-[0.6rem] tracking-widest uppercase mb-8 block"
        style={{ color: 'rgba(240,198,116,0.4)', textDecoration: 'none' }}>
        ← Back to WAVMVMT
      </Link>

      <h1 className="text-3xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: '#f0c674' }}>
        WAVMVMT Center — Full Breakdown
      </h1>
      <p className="text-sm mb-8" style={{ color: 'rgba(255,200,150,0.4)' }}>
        {FUNDRAISING.location} · {TOTAL_SQFT.toLocaleString()} sq ft · {formatCurrency(FUNDRAISING.goal)} build
      </p>

      {/* Room breakdown table */}
      <h2 className="text-lg font-bold mb-3" style={{ color: 'rgba(255,240,220,0.7)' }}>12 Rooms</h2>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-[0.7rem]">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,200,120,0.1)' }}>
              <th className="text-left py-2" style={{ color: 'rgba(255,220,180,0.4)' }}>Room</th>
              <th className="text-right py-2" style={{ color: 'rgba(255,220,180,0.4)' }}>Sq Ft</th>
              <th className="text-right py-2" style={{ color: 'rgba(255,220,180,0.4)' }}>Cost</th>
              <th className="text-right py-2" style={{ color: 'rgba(255,220,180,0.4)' }}>Build %</th>
            </tr>
          </thead>
          <tbody>
            {ROOMS.map(room => (
              <tr key={room.name} style={{ borderBottom: '1px solid rgba(255,200,120,0.05)' }}>
                <td className="py-1.5">
                  <span className="font-medium" style={{ color: `#${room.color.toString(16).padStart(6, '0')}` }}>
                    {room.name}
                  </span>
                  <br />
                  <span className="text-[0.55rem] italic" style={{ color: 'rgba(255,220,180,0.3)' }}>
                    {room.vision}
                  </span>
                </td>
                <td className="text-right font-mono" style={{ color: 'rgba(255,220,180,0.5)' }}>
                  {room.sqft.toLocaleString()}
                </td>
                <td className="text-right font-mono" style={{ color: '#f0c674' }}>
                  {formatCurrency(room.buildCost)}
                </td>
                <td className="text-right font-mono" style={{ color: room.buildPct > 0 ? '#80d4a8' : 'rgba(255,220,180,0.2)' }}>
                  {room.buildPct}%
                </td>
              </tr>
            ))}
            <tr style={{ borderTop: '2px solid rgba(255,200,120,0.15)' }}>
              <td className="py-2 font-bold">Total (rooms)</td>
              <td className="text-right font-mono font-bold">{ROOMS.reduce((s, r) => s + r.sqft, 0).toLocaleString()}</td>
              <td className="text-right font-mono font-bold" style={{ color: '#f0c674' }}>{formatCurrency(totalRoomCost)}</td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Funding */}
      <h2 className="text-lg font-bold mb-3" style={{ color: 'rgba(255,240,220,0.7)' }}>Funding</h2>
      <div className="mb-8 text-[0.7rem]">
        <div className="flex justify-between mb-1">
          <span>Phase 1: Center Build</span>
          <span className="font-mono" style={{ color: '#f0c674' }}>{formatCurrency(FUNDRAISING.goal)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Phase 2: Upper Floors</span>
          <span className="font-mono" style={{ color: 'rgba(136,192,208,0.6)' }}>{formatCurrency(PHASE_2.additionalCost)}</span>
        </div>
        <div className="flex justify-between pt-2 font-bold" style={{ borderTop: '1px solid rgba(255,200,120,0.1)' }}>
          <span>Total Vision</span>
          <span className="font-mono" style={{ color: '#f0c674' }}>{formatCurrency(FUNDRAISING.goal + PHASE_2.additionalCost)}</span>
        </div>
      </div>

      {/* Phase 2 */}
      <h2 className="text-lg font-bold mb-3" style={{ color: 'rgba(255,240,220,0.7)' }}>Phase 2: Practitioner Offices</h2>
      <p className="text-[0.7rem] mb-3" style={{ color: 'rgba(255,220,180,0.4)' }}>{PHASE_2.description}</p>
      <div className="mb-8 text-[0.65rem]">
        {PHASE_2.units.filter(u => u.type !== 'Shared amenities').map(u => (
          <div key={u.type} className="flex justify-between my-1" style={{ color: 'rgba(255,220,180,0.5)' }}>
            <span>{u.type} ({u.count} units)</span>
            <span className="font-mono" style={{ color: 'rgba(128,212,168,0.5)' }}>{u.revenue}</span>
          </div>
        ))}
        <div className="flex justify-between mt-2 pt-2 font-bold" style={{ borderTop: '1px solid rgba(255,200,120,0.1)' }}>
          <span>Projected Annual Revenue</span>
          <span className="font-mono" style={{ color: '#80d4a8' }}>{formatCurrency(PHASE_2.projectedAnnualRevenue)}/yr</span>
        </div>
      </div>

      {/* Tech */}
      <h2 className="text-lg font-bold mb-3" style={{ color: 'rgba(255,240,220,0.7)' }}>Digital Build Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          ['53+', 'Commits'],
          ['51', 'Components'],
          ['100', 'Quests'],
          ['200', 'Prizes'],
          ['17', 'Audio Files'],
          ['12', 'Interactive Rooms'],
          ['12', 'Disciplines'],
          ['1', 'Session'],
        ].map(([val, label]) => (
          <div key={label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(240,198,116,0.03)', border: '1px solid rgba(240,198,116,0.08)' }}>
            <div className="text-xl font-bold font-mono" style={{ color: '#f0c674' }}>{val}</div>
            <div className="text-[0.5rem] tracking-widest uppercase" style={{ color: 'rgba(255,200,150,0.3)' }}>{label}</div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href="/world"
          className="inline-block px-10 py-3 rounded-full text-sm tracking-widest uppercase"
          style={{ border: '1px solid rgba(240,198,116,0.3)', color: '#f0c674', textDecoration: 'none' }}>
          Enter the World
        </Link>
        <p className="mt-4 text-[0.5rem]" style={{ color: 'rgba(255,200,150,0.15)' }}>
          Built by Arc.wav · Since March 22, 2026 · Powered by Claude
        </p>
      </div>
    </div>
  )
}
