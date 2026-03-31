'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { trackEvent } from '@/lib/analytics'

const panelStyle = {
  background: 'rgba(26,21,32,0.9)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,200,120,0.12)',
  boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
}

/**
 * Photo mode — press P to capture a screenshot of the 3D scene.
 * Uses canvas.toBlob for better quality. Shows room name in share text.
 */
export function PhotoMode() {
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [flash, setFlash] = useState(false)
  const currentRoom = useRef('')
  const blobRef = useRef<Blob | null>(null)

  useEffect(() => {
    const onMove = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail.room) currentRoom.current = detail.room
    }
    window.addEventListener('playerMove', onMove as EventListener)
    return () => window.removeEventListener('playerMove', onMove as EventListener)
  }, [])

  const capture = useCallback(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return

    setFlash(true)
    setTimeout(() => setFlash(false), 200)
    trackEvent('screenshot_taken', { room: currentRoom.current || 'unknown' })

    // Use toBlob for better quality, fallback to toDataURL
    canvas.toBlob((blob) => {
      if (blob) {
        blobRef.current = blob
        const url = URL.createObjectURL(blob)
        setScreenshot(url)
      } else {
        const dataUrl = canvas.toDataURL('image/png')
        setScreenshot(dataUrl)
      }
    }, 'image/png')
  }, [])

  const download = useCallback(() => {
    if (!screenshot) return
    const a = document.createElement('a')
    a.href = screenshot
    a.download = `wavmvmt-world${currentRoom.current ? '-' + currentRoom.current.toLowerCase().replace(/\s+/g, '-') : ''}.webp`
    a.click()
  }, [screenshot])

  const shareScreenshot = useCallback(async () => {
    const roomText = currentRoom.current ? ` at the ${currentRoom.current}` : ''
    const text = `Exploring WAVMVMT World${roomText} — a $100M+ wellness campus being built in Toronto 🏗️\n\nhttps://wavmvmt-world.vercel.app`

    if (navigator.share && blobRef.current) {
      try {
        const file = new File([blobRef.current], 'wavmvmt-world.webp', { type: 'image/png' })
        await navigator.share({
          title: 'WAVMVMT World',
          text,
          files: [file],
        })
        return
      } catch {
        // Fallback below
      }
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'WAVMVMT World',
          text,
          url: 'https://wavmvmt-world.vercel.app',
        })
        return
      } catch {
        // Fallback below
      }
    }

    // Copy link fallback
    await navigator.clipboard.writeText('https://wavmvmt-world.vercel.app')
    window.dispatchEvent(new CustomEvent('openShare'))
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'p' && !e.ctrlKey && !e.metaKey && !(e.target instanceof HTMLInputElement)) capture()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [capture])

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      if (screenshot && screenshot.startsWith('blob:')) {
        URL.revokeObjectURL(screenshot)
      }
    }
  }, [screenshot])

  return (
    <>
      {flash && (
        <div className="fixed inset-0 z-50 bg-white pointer-events-none" style={{ opacity: 0.7, transition: 'opacity 0.2s' }} />
      )}

      {screenshot && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 pointer-events-auto"
          onClick={() => setScreenshot(null)}>
          <div className="max-w-lg w-full mx-4 rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()} style={panelStyle}>
            <img src={screenshot} alt="WAVMVMT World screenshot" className="w-full" />

            {currentRoom.current && (
              <div className="px-4 pt-3 text-[0.6rem] tracking-wider" style={{ color: 'rgba(240,198,116,0.5)' }}>
                📍 {currentRoom.current}
              </div>
            )}

            <div className="p-4 flex gap-3">
              <button
                onClick={download}
                className="flex-1 py-2 rounded-xl text-center text-[0.65rem] font-medium tracking-wider uppercase cursor-pointer"
                style={{
                  border: '1px solid rgba(240,198,116,0.3)',
                  color: '#f0c674',
                  background: 'rgba(240,198,116,0.08)',
                }}
              >
                Download
              </button>
              <button
                onClick={shareScreenshot}
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
