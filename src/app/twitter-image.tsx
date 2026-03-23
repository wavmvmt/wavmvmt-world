import { ImageResponse } from 'next/og'
import { TOTAL_SQFT } from '@/lib/roomConfig'

export const runtime = 'edge'
export const alt = 'WAVMVMT World'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #1a1520, #2a1f35, #1a2030)',
        fontFamily: 'serif',
      }}>
        <div style={{ fontSize: 100, color: '#f0c674', opacity: 0.3, marginBottom: -10 }}>~</div>
        <div style={{ fontSize: 56, fontWeight: 700, color: 'rgba(255,240,220,0.9)', letterSpacing: '0.12em' }}>WAVMVMT WORLD</div>
        <div style={{ fontSize: 18, letterSpacing: '0.35em', color: 'rgba(255,200,150,0.4)', textTransform: 'uppercase', marginTop: 8, marginBottom: 30 }}>
          Walk the $100M+ Campus Construction Site in 3D
        </div>
        <div style={{ display: 'flex', gap: 50 }}>
          {[
            [`${(TOTAL_SQFT / 1000).toFixed(0)}K sqft`, '12 Rooms', '100 Quests', '200 Prizes', 'Toronto ON'],
          ][0].map((s) => (
            <div key={s} style={{ fontSize: 16, color: 'rgba(240,198,116,0.5)', letterSpacing: '0.15em' }}>{s}</div>
          ))}
        </div>
        <div style={{ position: 'absolute', bottom: 25, fontSize: 13, color: 'rgba(255,200,150,0.12)' }}>
          wavmvmt-world.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
