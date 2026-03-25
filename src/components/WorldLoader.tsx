'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { SplashScreen } from './SplashScreen'
import { LoadingScreen } from './LoadingScreen'
import { SceneErrorBoundary } from './SceneErrorBoundary'

const World3D = dynamic(() => import('@/components/World3D'), { ssr: false })

export default function WorldLoader() {
  const [phase, setPhase] = useState<'splash' | 'loading' | 'world' | 'timeout'>('splash')

  // 15s loading timeout fallback
  useEffect(() => {
    if (phase !== 'loading') return
    const timer = setTimeout(() => {
      if (phase === 'loading') setPhase('world') // Force through to world
    }, 15000)
    return () => clearTimeout(timer)
  }, [phase])

  if (phase === 'timeout') {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center"
        style={{ background: '#1a1520' }}>
        <div className="text-4xl mb-4" style={{ color: '#f0c674', opacity: 0.3 }}>~</div>
        <h2 className="text-lg font-bold mb-2" style={{ color: 'rgba(255,240,220,0.8)' }}>
          Loading is taking longer than expected
        </h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(255,200,150,0.4)' }}>
          Your connection may be slow, or the scene is complex for this device.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 rounded-full text-sm tracking-widest uppercase cursor-pointer"
          style={{ border: '1px solid rgba(240,198,116,0.3)', color: '#f0c674', background: 'transparent' }}
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <SceneErrorBoundary>
      {phase === 'splash' && (
        <SplashScreen onEnter={() => {
          window.dispatchEvent(new CustomEvent('startAudio'))
          setPhase('loading')
        }} />
      )}
      {phase === 'loading' && (
        <LoadingScreen onLoaded={() => setPhase('world')} />
      )}
      {(phase === 'loading' || phase === 'world') && (
        <div style={{ opacity: phase === 'world' ? 1 : 0, transition: 'opacity 0.8s ease-in' }}>
          <World3D />
        </div>
      )}
    </SceneErrorBoundary>
  )
}
