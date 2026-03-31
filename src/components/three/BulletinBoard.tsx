'use client'

import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { COLORS } from '@/lib/roomConfig'

/**
 * Construction site bulletin board — near Front Desk.
 * Shows project info, safety reminders, and fun notes.
 */
function BulletinBoardInner() {
  const notes = [
    { text: 'SAFETY FIRST', color: '#ff6600', size: '11px', rotate: '-2deg' },
    { text: 'Hard hats required\nbeyond this point', color: 'rgba(255,220,180,0.5)', size: '7px', rotate: '1deg' },
    { text: '☕ Coffee at the Cafe\n→ that way', color: 'rgba(136,192,208,0.6)', size: '7px', rotate: '-1deg' },
    { text: 'GRAND OPENING\nCOMING SOON', color: '#f0c674', size: '9px', rotate: '3deg' },
    { text: '🎵 Music Studio\nNOW HIRING\nbeat makers', color: 'rgba(232,160,191,0.6)', size: '7px', rotate: '-3deg' },
    { text: 'Lost: One left boot\nContact: Rico', color: 'rgba(255,220,180,0.3)', size: '6px', rotate: '2deg' },
    { text: '42,500 SQ FT\nof possibility', color: 'rgba(240,198,116,0.5)', size: '8px', rotate: '-1deg' },
  ]

  return (
    <group position={[15, 4, 125]}>
      {/* Board */}
      <mesh>
        <boxGeometry args={[6, 4, 0.2]} />
        <meshLambertMaterial color={0x6a5030} />
      </mesh>
      {/* Frame */}
      <lineSegments position={[0, 0, 0.11]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(6, 4)]} />
        <lineBasicMaterial color={COLORS.woodDk} />
      </lineSegments>
      {/* Cork background */}
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[5.6, 3.6]} />
        <meshLambertMaterial color={0xc8a060} side={THREE.DoubleSide} />
      </mesh>
      {/* Title */}
      <Html position={[0, 2.3, 0.15]} center distanceFactor={12}>
        <div style={{
          color: '#f0c674',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}>
          Site Bulletin
        </div>
      </Html>
      {/* Notes */}
      <Html position={[0, 0, 0.15]} center distanceFactor={10}>
        <div style={{
          width: '200px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          {notes.map((note, i) => (
            <div key={i} style={{
              background: 'rgba(255,250,220,0.85)',
              padding: '4px 6px',
              borderRadius: '2px',
              fontSize: note.size,
              color: note.color,
              fontFamily: "'DM Sans', sans-serif",
              transform: `rotate(${note.rotate})`,
              whiteSpace: 'pre-line',
              boxShadow: '1px 1px 3px rgba(0,0,0,0.2)',
              maxWidth: '90px',
              lineHeight: 1.3,
            }}>
              {note.text}
            </div>
          ))}
        </div>
      </Html>
      {/* Push pins */}
      {[[-2, 1.2], [1.5, 1.5], [-1, -0.8], [2, -0.5], [0, 0.5]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.15]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshBasicMaterial color={[0xff4444, 0x4444ff, 0x44ff44, 0xffff44, 0xff44ff][i]} />
        </mesh>
      ))}
    </group>
  )
}

import * as _React from 'react'
// Distance-culled export
export function BulletinBoard() {
  const [visible, setVisible] = _React.useState(false)
  _React.useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800)
    const onMove = (e: Event) => {
      const { x, z } = (e as CustomEvent).detail
      const inRange = x > -210 && x < 210 && z > -210 && z < 210
      setVisible(inRange)
    }
    window.addEventListener('playerMove', onMove as EventListener)
    return () => { clearTimeout(t); window.removeEventListener('playerMove', onMove as EventListener) }
  }, [])
  return visible ? <BulletinBoardInner /> : null
}
