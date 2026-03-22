'use client'

import dynamic from 'next/dynamic'

const World3D = dynamic(() => import('@/components/World3D'), { ssr: false })

export default function WorldLoader() {
  return <World3D />
}
