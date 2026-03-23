'use client'

import Link from 'next/link'

/**
 * Sticky navigation bar for all sub-pages.
 * Always visible, always accessible. One tap to get home.
 */
export function PageNav({ current }: { current?: string }) {
  const links = [
    { label: 'Home', href: '/' },
    { label: 'Enter World', href: '/world' },
    { label: 'Synesthesia', href: '/visualizer' },
    { label: 'Founder', href: '/founder' },
    { label: 'Pitch', href: '/pitch' },
    { label: 'Membership', href: '/membership' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Tour', href: '/tour' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
      style={{
        background: 'rgba(26,21,32,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(240,198,116,0.08)',
      }}>
      {/* Logo / Home */}
      <Link href="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
        <span className="text-lg" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>~W</span>
        <span className="text-[0.55rem] tracking-[0.2em] uppercase hidden md:inline" style={{ color: 'rgba(255,220,180,0.3)' }}>
          WAVMVMT
        </span>
      </Link>

      {/* Page links */}
      <div className="flex items-center gap-1 md:gap-2">
        {links.map((link) => (
          <Link key={link.href} href={link.href}
            className="px-2 md:px-3 py-1 rounded-full text-[0.45rem] md:text-[0.5rem] tracking-[0.1em] uppercase transition-all"
            style={{
              color: current === link.label ? '#f0c674' : 'rgba(255,220,180,0.3)',
              background: current === link.label ? 'rgba(240,198,116,0.08)' : 'transparent',
              border: current === link.label ? '1px solid rgba(240,198,116,0.15)' : '1px solid transparent',
              textDecoration: 'none',
            }}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
