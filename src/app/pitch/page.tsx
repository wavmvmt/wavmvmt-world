import Link from 'next/link'

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(240,198,116,0.12)',
}

export default function PitchPage() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 md:py-20"
      style={{ background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)' }}>

      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-5xl mb-2" style={{ color: '#f0c674', fontFamily: "'Playfair Display', serif" }}>~W</div>
          <h1 className="text-2xl md:text-4xl font-bold tracking-[0.15em] mb-2"
            style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(255,240,220,0.9)' }}>
            WAVMVMT
          </h1>
          <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(255,200,150,0.3)' }}>
            The First App for the Whole Person
          </p>
        </div>

        {/* Vision */}
        <section className="mb-8 p-5 md:p-8 rounded-2xl" style={panelStyle}>
          <h2 className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>Vision</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,220,180,0.6)' }}>
            WAVMVMT is building a global network of wellness, fitness, music, tech, and education centers.
            Each location combines world-class facilities with community-driven programming —
            parkour gyms, sound baths, music studios, recovery suites, cafés, amphitheatres,
            and education wings — all under one roof.
          </p>
        </section>

        {/* What We&apos;re Building */}
        <section className="mb-8 p-5 md:p-8 rounded-2xl" style={panelStyle}>
          <h2 className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>Facilities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              'Parkour Gym', 'Sound Bath', 'Music Studio', 'Weight Training',
              'Recovery Suite', 'Spa & Wellness', 'Yoga Room', 'Amphitheatre',
              'Café & Lounge', 'Education Wing', 'Photo Studio', 'Video Studio',
              'Front Desk', 'Sports Field', 'Skatepark', 'Rooftop Terrace',
            ].map((name) => (
              <div key={name} className="px-3 py-2 rounded-lg text-[0.6rem] tracking-wider"
                style={{ background: 'rgba(240,198,116,0.04)', border: '1px solid rgba(240,198,116,0.08)', color: 'rgba(255,220,180,0.4)' }}>
                {name}
              </div>
            ))}
          </div>
        </section>

        {/* Revenue Model — high level only */}
        <section className="mb-8 p-5 md:p-8 rounded-2xl" style={panelStyle}>
          <h2 className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>Revenue Streams</h2>
          <div className="space-y-2">
            {[
              'Memberships & Day Passes',
              'Class & Workshop Fees',
              'Studio Rental (Music, Photo, Video)',
              'Café & Retail',
              'Event Hosting & Private Bookings',
              'Practitioner Rental (Phase 2 — Upper Floors)',
              'Corporate Wellness Programs',
              'Digital Membership Platform',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="text-[0.5rem]" style={{ color: '#80d4a8' }}>◆</span>
                <span className="text-[0.6rem]" style={{ color: 'rgba(255,220,180,0.5)' }}>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Phase 2 — Upper Floors */}
        <section className="mb-8 p-5 md:p-8 rounded-2xl" style={panelStyle}>
          <h2 className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>Phase 2 · Upper Floors</h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,220,180,0.5)' }}>
            Soundproofed upper floors housing wellness practitioners — creating a
            full-spectrum health ecosystem under one roof.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {['Massage Therapy', 'Chiropractic', 'Acupuncture', 'Psychology / Counselling',
              'Physiotherapy', 'Naturopathy', 'Nutrition', 'Peer Support'].map((item) => (
              <div key={item} className="text-[0.55rem] px-2 py-1 rounded"
                style={{ color: 'rgba(255,220,180,0.3)', background: 'rgba(128,212,168,0.04)' }}>
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* Global Vision */}
        <section className="mb-8 p-5 md:p-8 rounded-2xl" style={panelStyle}>
          <h2 className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>Global Expansion</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,220,180,0.5)' }}>
            Starting in Toronto, with plans to expand to every major city worldwide.
            Each location adapts to its community while maintaining the WAVMVMT standard.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Toronto 🟢', 'New York', 'Los Angeles', 'London', 'Dubai', 'Tokyo', 'Sydney', 'Miami'].map((city) => (
              <span key={city} className="text-[0.5rem] px-2 py-0.5 rounded-full"
                style={{ border: '1px solid rgba(240,198,116,0.08)', color: city.includes('🟢') ? '#f0c674' : 'rgba(255,220,180,0.2)' }}>
                {city}
              </span>
            ))}
          </div>
        </section>

        {/* Contact / CTA */}
        <section className="mb-8 p-5 md:p-8 rounded-2xl text-center" style={panelStyle}>
          <h2 className="text-xs tracking-[0.25em] uppercase mb-3" style={{ color: 'rgba(240,198,116,0.5)' }}>Interested?</h2>
          <p className="text-[0.65rem] mb-4" style={{ color: 'rgba(255,220,180,0.4)' }}>
            For detailed financials and investment opportunities, reach out directly.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://instagram.com/shim.wav" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 rounded-full text-[0.55rem] tracking-[0.1em] uppercase"
              style={{ border: '1px solid rgba(240,198,116,0.2)', color: '#f0c674', textDecoration: 'none' }}>
              Instagram
            </a>
            <a href="https://x.com/shimwav" target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 rounded-full text-[0.55rem] tracking-[0.1em] uppercase"
              style={{ border: '1px solid rgba(240,198,116,0.2)', color: '#f0c674', textDecoration: 'none' }}>
              Twitter/X
            </a>
            <Link href="/world"
              className="px-4 py-2 rounded-full text-[0.55rem] tracking-[0.1em] uppercase"
              style={{ border: '1px solid rgba(128,212,168,0.2)', color: '#80d4a8', textDecoration: 'none' }}>
              Explore the 3D World →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[0.5rem] italic" style={{ color: 'rgba(255,200,150,0.1)' }}>
            Built by Arc.wav · The world is always under construction — just like us
          </p>
          <Link href="/world" className="text-[0.5rem] mt-2 inline-block"
            style={{ color: 'rgba(240,198,116,0.2)', textDecoration: 'none' }}>
            ← Back to World
          </Link>
        </div>
      </div>
    </div>
  )
}
