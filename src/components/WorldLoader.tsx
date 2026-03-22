'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { SplashScreen } from './SplashScreen'
import { SceneErrorBoundary } from './SceneErrorBoundary'

const World3D = dynamic(() => import('@/components/World3D'), { ssr: false })

export default function WorldLoader() {
  const [entered, setEntered] = useState(false)

  return (
    <SceneErrorBoundary>
      {!entered && <SplashScreen onEnter={() => setEntered(true)} />}
      <World3D />
    </SceneErrorBoundary>
  )
}
