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
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: 'rgba(255,200,150,0.3)' }}>
            A New Renaissance
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-2">
            {['Freedom Through Expression', 'Elevating Consciousness', 'Community'].map((val) => (
              <span key={val} className="text-[0.5rem] tracking-[0.15em] uppercase px-3 py-1 rounded-full"
                style={{ border: '1px solid rgba(240,198,116,0.1)', color: 'rgba(255,200,150,0.25)' }}>
                {val}
              </span>
            ))}
          </div>
          <p className="text-[0.65rem] italic max-w-md mx-auto" style={{ color: 'rgba(255,200,150,0.2)', fontFamily: "'Playfair Display', serif" }}>
            &ldquo;We don&apos;t build spaces. We build the conditions for people to become who they were meant to be.&rdquo;
          </p>
        </div>

        {/* Vision */}
        <section className="mb-8 p-5 md:p-8 rounded-2xl" style={panelStyle}>
          <h2 className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>Vision</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,220,180,0.6)' }}>
            WAVMVMT is building a global network of spaces where wellness, fitness, music,
            technology, and education converge under one roof. Not a gym. Not a studio.
            Not a school. All of it — designed for the whole person. A place where you
            train your body, expand your mind, create your art, and find your people.
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

        {/* Phase 2 — Vertical Build */}
        <section className="mb-8 p-5 md:p-8 rounded-2xl" style={panelStyle}>
          <h2 className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>Phase 2 · Vertical Build</h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,220,180,0.5)' }}>
            Soundproofed upper floors with premium residential units and wellness
            practitioner offices — creating a full live-work-wellness ecosystem.
            Subject to zoning approval.
          </p>

          <div className="mb-3">
            <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-1.5" style={{ color: 'rgba(240,198,116,0.35)' }}>
              Residential Units
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Premium Condos', 'Presale Opportunities', 'Acoustically Treated', 'Vibration-Dampened Floors',
                'Rooftop Access', 'Wellness Amenities Included'].map((item) => (
                <div key={item} className="text-[0.55rem] px-2 py-1 rounded"
                  style={{ color: 'rgba(255,220,180,0.3)', background: 'rgba(240,198,116,0.04)' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-1.5" style={{ color: 'rgba(128,212,168,0.35)' }}>
              Practitioner Offices
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['Massage Therapy', 'Chiropractic', 'Acupuncture', 'Psychology / Counselling',
                'Physiotherapy', 'Naturopathy', 'Nutrition', 'Peer Support'].map((item) => (
                <div key={item} className="text-[0.55rem] px-2 py-1 rounded"
                  style={{ color: 'rgba(255,220,180,0.3)', background: 'rgba(128,212,168,0.04)' }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Phase 2 — Why It Works */}
        <section className="mb-8 p-5 md:p-8 rounded-2xl" style={panelStyle}>
          <h2 className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>Why the Vertical Build Changes Everything</h2>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: '#f0c674' }}>Condo Presales Pay Back the Investment</div>
              <p className="text-[0.6rem] leading-relaxed" style={{ color: 'rgba(255,220,180,0.4)' }}>
                Premium residential units above the wellness center create immediate capital recovery
                through presale commitments. Buyers get soundproofed, acoustically treated condos with
                vibration-dampened floors — plus built-in access to the entire wellness facility below.
                Living above a world-class fitness, music, and wellness center is a lifestyle proposition
                no other development offers.
              </p>
            </div>
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: '#80d4a8' }}>Practitioner Offices = Stable Recurring Revenue</div>
              <p className="text-[0.6rem] leading-relaxed" style={{ color: 'rgba(255,220,180,0.4)' }}>
                Medical and wellness practitioners (massage therapy, chiropractic, acupuncture,
                psychology, physiotherapy) pay monthly rent for soundproofed office suites. This creates
                stable, predictable income independent of membership fluctuations. Their presence also
                creates a full-spectrum health ecosystem — members can access everything from a workout
                to a therapy session to a chiropractic adjustment without leaving the building.
              </p>
            </div>
          </div>
        </section>

        {/* Phase 3 — Outdoor Campus */}
        <section className="mb-8 p-5 md:p-8 rounded-2xl" style={panelStyle}>
          <h2 className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>Phase 3 · Outdoor Campus</h2>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: '#f0c674' }}>Retractable-Roof Sports Field</div>
              <p className="text-[0.6rem] leading-relaxed" style={{ color: 'rgba(255,220,180,0.4)' }}>
                Multi-sport field (soccer, football, ultimate frisbee) with a modular retractable roof
                system — open in summer for natural air and sunlight, covered in winter for year-round
                play. LED field lighting enables night sessions. This transforms a seasonal asset into
                a 12-month revenue generator and community hub. Corporate leagues, youth programs,
                weekend tournaments — the field pays for itself.
              </p>
            </div>
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: '#f0c674' }}>Skatepark</div>
              <p className="text-[0.6rem] leading-relaxed" style={{ color: 'rgba(255,220,180,0.4)' }}>
                Bowl section plus street section with spectator seating. Skateboarding culture
                aligns perfectly with the WAVMVMT philosophy — freedom, creativity, flow, community.
                Connects with the indoor parkour gym to create a full movement campus. Hosts
                competitions, lessons, and community sessions.
              </p>
            </div>
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: '#f0c674' }}>Parking Garage + Rooftop Terrace</div>
              <p className="text-[0.6rem] leading-relaxed" style={{ color: 'rgba(255,220,180,0.4)' }}>
                Multi-level parking structure solves the practical need for member and visitor parking,
                with EV charging stations for sustainability. The rooftop terrace connects directly
                to the main building — creating an elevated outdoor social space for events, sunset
                yoga sessions, rooftop concerts, and private gatherings. The terrace transforms dead
                rooftop space into a premium venue that generates event revenue and increases the
                overall property value.
              </p>
            </div>
            <div>
              <div className="text-xs font-bold mb-1" style={{ color: '#f0c674' }}>Outdoor Training Area</div>
              <p className="text-[0.6rem] leading-relaxed" style={{ color: 'rgba(255,220,180,0.4)' }}>
                Calisthenics bars, rigs, sprint track, and agility course connected to the indoor
                parkour gym. Takes the training experience outside when weather permits, expanding
                capacity without expanding the building footprint. Fresh air training is a major
                draw for members who want variety in their routine.
              </p>
            </div>
          </div>
        </section>

        {/* Energy & Sustainability */}
        <section className="mb-8 p-5 md:p-8 rounded-2xl" style={panelStyle}>
          <h2 className="text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(240,198,116,0.5)' }}>Energy & Sustainability</h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,220,180,0.5)' }}>
            Designed with sustainability at the core — reducing operating costs while
            aligning with the wellness mission.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Solar Panels', desc: 'Rooftop solar on parking garage reduces energy costs' },
              { name: 'EV Charging', desc: 'Electric vehicle stations attract eco-conscious members' },
              { name: 'Smart Glass', desc: 'Electrochromic windows — tint on demand, reduce cooling costs' },
              { name: 'Geothermal Potential', desc: 'Geothermal system for sauna/cold plunge efficiency' },
              { name: 'LED Throughout', desc: 'Full LED lighting reduces energy consumption 75%' },
              { name: 'Water Recovery', desc: 'Greywater recycling for landscaping and cooling' },
            ].map((item) => (
              <div key={item.name} className="px-3 py-2 rounded-lg"
                style={{ background: 'rgba(128,212,168,0.04)', border: '1px solid rgba(128,212,168,0.08)' }}>
                <div className="text-[0.55rem] font-bold mb-0.5" style={{ color: 'rgba(128,212,168,0.5)' }}>{item.name}</div>
                <div className="text-[0.45rem]" style={{ color: 'rgba(255,220,180,0.3)' }}>{item.desc}</div>
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
