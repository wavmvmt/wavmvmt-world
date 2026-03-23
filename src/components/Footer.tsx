import Link from 'next/link'

/**
 * Consistent footer across all pages.
 * Shows navigation, social links, and credits.
 */
export function Footer() {
  return (
    <footer className="mt-12 pt-8 pb-6 px-4"
      style={{ borderTop: '1px solid rgba(240,198,116,0.06)' }}>
      <div className="max-w-4xl mx-auto">
        {/* Logo + tagline */}
        <div className="text-center mb-6">
          <div className="text-2xl mb-1" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif", opacity: 0.4 }}>~W</div>
          <div className="text-[0.45rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(255,220,180,0.15)' }}>
            A New Renaissance · Toronto
          </div>
        </div>

        {/* Link grid */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-6 max-w-lg mx-auto">
          {[
            { label: 'Enter World', href: '/world' },
            { label: 'Synesthesia', href: '/visualizer' },
            { label: 'Founder', href: '/founder' },
            { label: 'Business', href: '/pitch' },
            { label: 'Gallery', href: '/gallery' },
            { label: 'Membership', href: '/membership' },
            { label: 'Book Tour', href: '/tour' },
            { label: 'Contact', href: '/contact' },
          ].map((link) => (
            <Link key={link.label} href={link.href}
              className="text-center text-[0.5rem] py-1 transition-all"
              style={{ color: 'rgba(255,220,180,0.2)', textDecoration: 'none' }}>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Social */}
        <div className="flex justify-center gap-4 mb-4">
          {[
            { label: 'IG', href: 'https://instagram.com/shim.wav' },
            { label: 'X', href: 'https://x.com/shimwav' },
            { label: '♫', href: 'https://open.spotify.com/artist/4HHt60CmwO8nAS9RFBBO9u' },
            { label: '✉', href: 'mailto:wavmvmt@gmail.com' },
          ].map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              className="text-[0.5rem]" style={{ color: 'rgba(255,220,180,0.15)', textDecoration: 'none' }}>
              {s.label}
            </a>
          ))}
        </div>

        {/* Credits */}
        <div className="text-center">
          <p className="text-[0.45rem]" style={{ color: 'rgba(255,200,150,0.12)' }}>
            Built by Arc.wav · Powered by Claude (Anthropic) · Planning by Intrinzic.wav
          </p>
          <p className="text-[0.4rem] mt-1" style={{ color: 'rgba(255,200,150,0.08)' }}>
            © 2026 WAVMVMT / Arc.wav. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
