'use client'

import { Html } from '@react-three/drei'
import { COLORS } from '@/lib/roomConfig'

/**
 * Membership presale billboard in the 3D world.
 * Positioned near the front desk to catch visitors.
 * Links to /membership page.
 */
export function MembershipBillboard() {
  return (
    <group position={[15, 0, 55]}>
      {/* Billboard frame */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[8, 5, 0.3]} />
        <meshLambertMaterial color={COLORS.woodDk} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 5, 0.2]}>
        <boxGeometry args={[7.2, 4.2, 0.05]} />
        <meshLambertMaterial color={0x1a1520} emissive={COLORS.gold} emissiveIntensity={0.03} />
      </mesh>

      {/* Post */}
      <mesh position={[0, 1.25, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 2.5, 6]} />
        <meshLambertMaterial color={COLORS.steel} />
      </mesh>

      {/* Content */}
      <Html position={[0, 5, 0.3]} center distanceFactor={15}>
        <a href="/membership" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '160px',
            textAlign: 'center',
            padding: '12px',
            cursor: 'pointer',
            pointerEvents: 'auto',
          }}>
            <div style={{ fontSize: '8px', letterSpacing: '0.2em', color: 'rgba(240,198,116,0.6)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Founding Member
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#f0c674', fontFamily: "'Playfair Display', serif", marginBottom: '4px' }}>
              From $79/mo
            </div>
            <div style={{ fontSize: '7px', color: 'rgba(128,212,168,0.5)', letterSpacing: '0.1em' }}>
              Register Interest →
            </div>
          </div>
        </a>
      </Html>

      {/* Spotlight on billboard */}
      <pointLight color={COLORS.gold} intensity={0.3} distance={8} position={[0, 8, 2]} />
    </group>
  )
}
