'use client'

import { usePathname } from 'next/navigation'

/**
 * VideoBackground — the water droplet reactive video plays behind all pages
 * except the 3D world (which has its own Three.js scene as background).
 *
 * Renders as a fixed layer under all content.
 * Uses mix-blend-mode: screen so it composites beautifully with dark page bg.
 */
export function VideoBackground() {
  const pathname = usePathname()

  // Don't render behind the 3D world — it has its own Three.js canvas
  if (pathname?.startsWith('/world')) return null

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: 0.55,
          mixBlendMode: 'screen',
        }}
      >
        <source src="/api/media?file=november%2025th%20beat%201%20landscape.mov" type="video/mp4" />
      </video>
      {/* Subtle radial vignette — darkens edges so text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(26,21,32,0.0) 0%, rgba(26,21,32,0.5) 100%)',
        }}
      />
    </div>
  )
}
