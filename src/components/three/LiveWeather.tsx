'use client'

import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { COLORS } from '@/lib/roomConfig'

/**
 * Live weather system synced to Toronto's actual time of day.
 *
 * - Dawn/sunrise: warm golden light, orange sky tint
 * - Day: bright, blue-white ambient
 * - Sunset: deep amber, long shadows
 * - Night: cool blue moonlight, stars visible
 *
 * Also displays current Toronto time in the HUD.
 */

function getTorontoTime(): { hour: number; minute: number; timeString: string; period: string } {
  const now = new Date()
  // Convert to Toronto time (EST/EDT)
  const torontoTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Toronto' }))
  const hour = torontoTime.getHours()
  const minute = torontoTime.getMinutes()
  const h12 = hour % 12 || 12
  const ampm = hour < 12 ? 'AM' : 'PM'

  let period = 'night'
  if (hour >= 6 && hour < 8) period = 'dawn'
  else if (hour >= 8 && hour < 17) period = 'day'
  else if (hour >= 17 && hour < 20) period = 'sunset'

  return {
    hour,
    minute,
    timeString: `${h12}:${minute.toString().padStart(2, '0')} ${ampm}`,
    period,
  }
}

const PERIOD_COLORS = {
  dawn: { ambient: 0xffd4a0, intensity: 0.4, fog: 0x2a1f35 },
  day: { ambient: 0xfff5e6, intensity: 0.6, fog: 0x1f2a3a },
  sunset: { ambient: 0xff9050, intensity: 0.35, fog: 0x2a1520 },
  night: { ambient: 0x4060a0, intensity: 0.15, fog: 0x0a0810 },
}

export function LiveWeather() {
  const lightRef = useRef<THREE.DirectionalLight>(null)
  const [time, setTime] = useState(getTorontoTime())

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => setTime(getTorontoTime()), 60000)
    return () => clearInterval(interval)
  }, [])

  useFrame(() => {
    if (!lightRef.current) return

    const colors = PERIOD_COLORS[time.period as keyof typeof PERIOD_COLORS]

    // Smoothly transition light
    lightRef.current.color.lerp(new THREE.Color(colors.ambient), 0.01)
    lightRef.current.intensity += (colors.intensity - lightRef.current.intensity) * 0.01

    // Sun/moon position based on hour
    const sunAngle = ((time.hour - 6) / 12) * Math.PI // 6am = horizon, noon = top
    const sunY = Math.sin(sunAngle) * 80 + 20
    const sunX = Math.cos(sunAngle) * 100
    lightRef.current.position.set(sunX, Math.max(sunY, 5), -50)
  })

  return (
    <group>
      <directionalLight
        ref={lightRef}
        intensity={0.5}
        position={[60, 60, -50]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Toronto time display — floating above entrance */}
      <Html position={[0, 15, 75]} center distanceFactor={40}>
        <div style={{
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          <div style={{
            fontSize: '12px',
            fontFamily: 'monospace',
            color: time.period === 'night' ? 'rgba(100,150,220,0.4)' : 'rgba(240,198,116,0.4)',
            letterSpacing: '0.2em',
          }}>
            {time.timeString}
          </div>
          <div style={{
            fontSize: '7px',
            color: 'rgba(255,220,180,0.15)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            Toronto · Live
          </div>
        </div>
      </Html>
    </group>
  )
}
