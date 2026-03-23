import { ImageResponse } from 'next/og'
import { ROOMS, TOTAL_SQFT } from '@/lib/roomConfig'

export const runtime = 'edge'
export const alt = 'WAVMVMT World — Walk the Construction Site'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const totalCost = ROOMS.reduce((s, r) => s + r.buildCost, 0)

  return new ImageResponse(
    (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)',
        fontFamily: 'serif',
      }}>
        {/* Wave */}
        <div style={{ fontSize: 120, color: '#f0c674', opacity: 0.3, marginBottom: -20 }}>~</div>

        {/* Title */}
        <div style={{ fontSize: 64, fontWeight: 700, color: 'rgba(255,240,220,0.9)', letterSpacing: '0.1em', marginBottom: 8 }}>
          WAVMVMT WORLD
        </div>

        <div style={{ fontSize: 16, letterSpacing: '0.4em', color: 'rgba(255,200,150,0.4)', textTransform: 'uppercase', marginBottom: 40 }}>
          Walk the Construction Site
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 60 }}>
          {[
            { value: `${(TOTAL_SQFT / 1000).toFixed(0)}K`, label: 'SQ FT' },
            { value: '13', label: 'ROOMS' },
            { value: '$40M', label: 'BUILD' },
            { value: '100', label: 'QUESTS' },
            { value: 'Toronto', label: 'LOCATION' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#f0c674', fontFamily: 'monospace' }}>{stat.value}</div>
              <div style={{ fontSize: 11, letterSpacing: '0.3em', color: 'rgba(255,200,150,0.3)', textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div style={{ position: 'absolute', bottom: 30, fontSize: 12, color: 'rgba(255,200,150,0.15)' }}>
          Built by Arc.wav · The world is always under construction — just like us
        </div>
      </div>
    ),
    { ...size }
  )
}
