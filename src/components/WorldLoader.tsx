'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { SplashScreen } from './SplashScreen'
import { LoadingScreen } from './LoadingScreen'
import { SceneErrorBoundary } from './SceneErrorBoundary'

const World3D = dynamic(() => import('@/components/World3D'), { ssr: false })

export default function WorldLoader() {
  const [phase, setPhase] = useState<'splash' | 'loading' | 'world'>('splash')

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
