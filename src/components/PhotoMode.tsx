'use client'

import { useState, useEffect, useCallback } from 'react'

const panelStyle = {
  background: 'rgba(26,21,32,0.9)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,200,120,0.12)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
}

/**
 * Photo mode — press P to capture a screenshot of the 3D scene.
 * Shows the captured image with share/download options.
 */
export function PhotoMode() {
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [flash, setFlash] = useState(false)

  const capture = useCallback(() => {
    // Find the R3F canvas
    const canvas = document.querySelector('canvas')
    if (!canvas) return

    // Flash effect
    setFlash(true)
    setTimeout(() => setFlash(false), 200)

    // Capture
    const dataUrl = canvas.toDataURL('image/png')
    setScreenshot(dataUrl)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'p' && !e.ctrlKey && !e.metaKey) capture()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [capture])

  return (
    <>
      {/* Camera flash overlay */}
      {flash && (
        <div className="fixed inset-0 z-50 bg-white pointer-events-none" style={{ opacity: 0.7, transition: 'opacity 0.2s' }} />
      )}

      {/* Screenshot preview */}
      {screenshot && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 pointer-events-auto">
          <div className="max-w-lg w-full mx-4 rounded-2xl overflow-hidden" style={panelStyle}>
            {/* Preview */}
            <img src={screenshot} alt="Screenshot" className="w-full" />

            {/* Actions */}
            <div className="p-4 flex gap-3">
              <a
                href={screenshot}
                download="wavmvmt-world.png"
                className="flex-1 py-2 rounded-xl text-center text-[0.65rem] font-medium tracking-wider uppercase"
                style={{
                  border: '1px solid rgba(240,198,116,0.3)',
                  color: '#f0c674',
                  background: 'rgba(240,198,116,0.08)',
                  textDecoration: 'none',
                }}
              >
                Download
              </a>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'WAVMVMT World',
                      text: 'Check out the WAVMVMT Center construction site!',
                      url: 'https://wavmvmt-world.vercel.app',
                    })
                  } else {
                    navigator.clipboard.writeText('https://wavmvmt-world.vercel.app')
                    alert('Link copied!')
                  }
                }}
                className="flex-1 py-2 rounded-xl text-[0.65rem] font-medium tracking-wider uppercase cursor-pointer"
                style={{
                  border: '1px solid rgba(128,212,168,0.3)',
                  color: '#80d4a8',
                  background: 'rgba(128,212,168,0.08)',
                }}
              >
                Share
              </button>
              <button
                onClick={() => setScreenshot(null)}
                className="px-4 py-2 rounded-xl text-[0.65rem] cursor-pointer"
                style={{ color: 'rgba(255,220,180,0.4)', border: '1px solid rgba(255,200,120,0.1)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
