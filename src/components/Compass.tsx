'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * Compass showing player facing direction.
 * Small, sits above minimap area on desktop.
 */
export function Compass() {
  const [angle, setAngle] = useState(0)
  const yawRef = useRef(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (e.movementX) yawRef.current -= e.movementX * 0.002
    }
    window.addEventListener('mousemove', onMove)

    const interval = setInterval(() => {
      setAngle(yawRef.current)
    }, 100)

    return () => {
      window.removeEventListener('mousemove', onMove)
      clearInterval(interval)
    }
  }, [])

  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const dirIdx = Math.round(((angle * 180 / Math.PI % 360) + 360) % 360 / 45) % 8
  const dir = directions[dirIdx]

  return (
    <div className="fixed bottom-[170px] md:bottom-[155px] left-[42px] md:left-[50px] z-10 pointer-events-none">
      <div className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(26,21,32,0.6)',
          border: '1px solid rgba(255,200,120,0.1)',
        }}>
        <div className="text-[0.5rem] font-mono font-bold" style={{
          color: dir === 'N' ? '#f0c674' : 'rgba(255,220,180,0.35)',
          transform: `rotate(${-angle}rad)`,
        }}>
          {dir}
        </div>
      </div>
    </div>
  )
}
