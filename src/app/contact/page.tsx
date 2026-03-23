import Link from 'next/link'
import { PageNav } from '@/components/PageNav'

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  border: '1px solid rgba(240,198,116,0.12)',
  borderRadius: '16px',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen px-4 pt-20 pb-12 md:pt-24 md:pb-20"
      style={{ background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)' }}>
      <PageNav />

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-4xl font-bold tracking-[0.1em] mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(255,240,220,0.9)' }}>
            Get in Touch
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,220,180,0.4)' }}>
            Whether you want to invest, collaborate, join the team, or just say hey.
          </p>
        </div>

        {/* Primary contact */}
        <section className="mb-6 p-5 md:p-6 text-center" style={panelStyle}>
          <div className="text-lg font-mono mb-2" style={{ color: '#f0c674' }}>
            wavmvmt@gmail.com
          </div>
          <p className="text-[0.6rem]" style={{ color: 'rgba(255,220,180,0.3)' }}>
            For all inquiries — investment, partnerships, media, general questions
          </p>
        </section>

        {/* Quick links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Investment Inquiry', href: '/tour', desc: 'Book a virtual tour' },
            { label: 'Membership', href: '/membership', desc: 'Register interest' },
            { label: 'Business Overview', href: '/pitch', desc: 'See the vision' },
            { label: 'Financial Projections', href: '/projections', desc: 'View the numbers' },
            { label: 'Vision Gallery', href: '/gallery', desc: 'Architectural renders' },
            { label: 'Explore 3D World', href: '/world', desc: 'Walk the site' },
          ].map((link) => (
            <Link key={link.label} href={link.href} className="p-4 rounded-xl text-center transition-all hover:border-[rgba(240,198,116,0.25)]"
              style={{ ...panelStyle, textDecoration: 'none' }}>
              <div className="text-[0.6rem] font-bold mb-1" style={{ color: '#f0c674' }}>{link.label}</div>
              <div className="text-[0.45rem]" style={{ color: 'rgba(255,220,180,0.25)' }}>{link.desc}</div>
            </Link>
          ))}
        </div>

        {/* Socials */}
        <section className="p-5 md:p-6 text-center" style={panelStyle}>
          <div className="text-[0.5rem] tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(240,198,116,0.4)' }}>
            Follow the Build
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Instagram', href: 'https://instagram.com/shim.wav' },
              { label: 'Twitter/X', href: 'https://x.com/shimwav' },
              { label: 'Spotify', href: 'https://open.spotify.com/artist/4HHt60CmwO8nAS9RFBBO9u' },
              { label: 'Linktree', href: 'https://linktr.ee/shim.wav' },
            ].map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 rounded-full text-[0.55rem] tracking-[0.1em] uppercase transition-all"
                style={{ border: '1px solid rgba(240,198,116,0.15)', color: 'rgba(255,220,180,0.4)', textDecoration: 'none' }}>
                {s.label}
              </a>
            ))}
          </div>
        </section>

        <div className="text-center mt-6">
          <p className="text-[0.45rem] italic" style={{ color: 'rgba(255,200,150,0.1)' }}>
            Toronto, ON · A New Renaissance
          </p>
        </div>
      </div>
    </div>
  )
}
