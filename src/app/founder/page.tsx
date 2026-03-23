import Link from 'next/link'

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  border: '1px solid rgba(240,198,116,0.12)',
  borderRadius: '16px',
  padding: '20px',
}

export default function FounderPage() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 md:py-20"
      style={{ background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)' }}>

      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>~</div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-[0.1em] mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(255,240,220,0.9)' }}>
            Shim
          </h1>
          <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: 'rgba(255,200,150,0.4)' }}>
            Saadiq Khan
          </p>
          <p className="text-xs tracking-[0.2em] uppercase" style={{ color: 'rgba(255,200,150,0.25)' }}>
            Founder · Artist · Builder
          </p>
        </div>

        {/* Arc.wav */}
        <section className="mb-8 p-5 md:p-8 rounded-2xl" style={panelStyle}>
          <h2 className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>
            Arc.wav
          </h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,220,180,0.6)' }}>
            Arc.wav is the creative engine behind WAVMVMT — a fusion of music production,
            AI development, and community building. Every beat, every line of code, every
            space designed comes through this lens of bridging art and technology.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Music Production', 'AI Development', 'Community Building', 'Sound Design',
              'Creative Direction', 'Tech Architecture'].map((skill) => (
              <span key={skill} className="text-[0.5rem] px-2 py-1 rounded-full tracking-wider"
                style={{ border: '1px solid rgba(240,198,116,0.1)', color: 'rgba(255,220,180,0.3)' }}>
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* SET Ventures */}
        <section className="mb-8 p-5 md:p-8 rounded-2xl" style={panelStyle}>
          <h2 className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>
            SET Ventures / Enterprises
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,220,180,0.6)' }}>
            Deal origination and capital markets. Connecting opportunities with capital
            across real estate, technology, and creative industries.
          </p>
        </section>

        {/* The Vision */}
        <section className="mb-8 p-5 md:p-8 rounded-2xl" style={panelStyle}>
          <h2 className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>
            The Vision
          </h2>
          <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(255,220,180,0.5)', fontFamily: "'Playfair Display', serif" }}>
            &ldquo;Full interview coming soon. We&apos;re building something that doesn&apos;t exist yet —
            a space where wellness, fitness, music, technology, and education aren&apos;t separate
            industries but one integrated experience. The world is always under construction,
            just like us.&rdquo;
          </p>
        </section>

        {/* Music */}
        <section className="mb-8 p-5 md:p-8 rounded-2xl" style={panelStyle}>
          <h2 className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>
            Music
          </h2>
          <div className="rounded-xl overflow-hidden mb-4">
            <iframe
              src="https://open.spotify.com/embed/artist/4HHt60CmwO8nAS9RFBBO9u?utm_source=generator&theme=0"
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-xl"
            />
          </div>
        </section>

        {/* Links */}
        <section className="mb-8 p-5 md:p-8 rounded-2xl text-center" style={panelStyle}>
          <h2 className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>
            Connect
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Linktree', href: 'https://linktr.ee/shim.wav' },
              { label: 'Instagram', href: 'https://instagram.com/shim.wav' },
              { label: 'Twitter/X', href: 'https://x.com/shimwav' },
              { label: 'Spotify', href: 'https://open.spotify.com/artist/4HHt60CmwO8nAS9RFBBO9u' },
              { label: 'Synesthesia', href: '/visualizer' },
            ].map((link) => (
              <a key={link.label} href={link.href}
                target={link.href.startsWith('/') ? undefined : '_blank'}
                rel={link.href.startsWith('/') ? undefined : 'noopener noreferrer'}
                className="px-4 py-2 rounded-full text-[0.55rem] tracking-[0.1em] uppercase"
                style={{ border: '1px solid rgba(240,198,116,0.2)', color: '#f0c674', textDecoration: 'none' }}>
                {link.label}
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="text-center">
          <Link href="/world" className="text-[0.55rem] inline-block"
            style={{ color: 'rgba(128,212,168,0.3)', textDecoration: 'none' }}>
            Explore the 3D World →
          </Link>
          <p className="text-[0.45rem] mt-2 italic" style={{ color: 'rgba(255,200,150,0.1)' }}>
            © 2026 WAVMVMT / Arc.wav. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
