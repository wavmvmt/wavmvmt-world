'use client'

import { useState, useEffect } from 'react'

/**
 * Fullscreen toggle button — bottom-right area.
 * Press F11 or click button to toggle.
 */
export function FullscreenToggle() {
  const [isFS, setIsFS] = useState(false)

  useEffect(() => {
    const onChange = () => setIsFS(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  function toggle() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  }

  return (
    <button
      onClick={toggle}
      className="fixed top-3 md:top-5 right-[70px] md:right-[80px] pointer-events-auto z-20 px-2 py-1.5 rounded-xl text-[0.55rem] cursor-pointer"
      style={{
        background: 'rgba(26,21,32,0.75)',
        border: '1px solid rgba(255,200,120,0.12)',
        color: 'rgba(255,220,180,0.4)',
      }}
      title={isFS ? 'Exit Fullscreen' : 'Fullscreen'}
    >
      {isFS ? '◱' : '◳'}
    </button>
  )
}
