import { ImageResponse } from 'next/og'
import { TOTAL_SQFT } from '@/lib/roomConfig'

export const runtime = 'edge'
export const alt = 'WAVMVMT World — A New Renaissance'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
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
        position: 'relative',
      }}>
        {/* Subtle grid pattern */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'linear-gradient(rgba(240,198,116,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(240,198,116,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Decorative circles */}
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          border: '1px solid rgba(240,198,116,0.06)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        }} />
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          border: '1px solid rgba(240,198,116,0.03)',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        }} />

        {/* Wave */}
        <div style={{ fontSize: 100, color: '#f0c674', opacity: 0.25, marginBottom: -15, display: 'flex' }}>~</div>

        {/* Title */}
        <div style={{
          fontSize: 72, fontWeight: 700, color: 'rgba(255,240,220,0.9)',
          letterSpacing: '0.12em', marginBottom: 4, display: 'flex',
        }}>
          WAVMVMT
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 18, letterSpacing: '0.4em', color: 'rgba(255,200,150,0.35)',
          textTransform: 'uppercase', marginBottom: 12, display: 'flex',
        }}>
          A New Renaissance
        </div>

        {/* Pillars */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 30 }}>
          {['Wellness', 'Fitness', 'Music', 'Tech', 'Education'].map((p) => (
            <div key={p} style={{
              fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'rgba(255,220,180,0.25)', padding: '4px 12px',
              border: '1px solid rgba(240,198,116,0.08)', borderRadius: 20,
              display: 'flex',
            }}>
              {p}
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 50 }}>
          {[
            { value: `${(TOTAL_SQFT / 1000).toFixed(0)}K`, label: 'SQ FT' },
            { value: '13+', label: 'ROOMS' },
            { value: '$100M+', label: 'VISION' },
            { value: 'Toronto', label: 'LAUNCH' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#f0c674', fontFamily: 'monospace', display: 'flex' }}>{stat.value}</div>
              <div style={{ fontSize: 10, letterSpacing: '0.3em', color: 'rgba(255,200,150,0.25)', textTransform: 'uppercase', display: 'flex' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
          background: 'rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontSize: 12, color: 'rgba(240,198,116,0.4)', letterSpacing: '0.1em', display: 'flex' }}>
            wavmvmt-world.vercel.app
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,200,150,0.15)', display: 'flex' }}>
            Built by Arc.wav · Powered by Claude
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
