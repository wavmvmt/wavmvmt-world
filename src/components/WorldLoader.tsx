'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { SplashScreen } from './SplashScreen'

const World3D = dynamic(() => import('@/components/World3D'), { ssr: false })

export default function WorldLoader() {
  const [entered, setEntered] = useState(false)

  return (
    <>
      {!entered && <SplashScreen onEnter={() => setEntered(true)} />}
      <World3D />
    </>
  )
}
