import Link from 'next/link'

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  border: '1px solid rgba(240,198,116,0.12)',
  borderRadius: '16px',
}

const sectionTitle = "text-[0.55rem] tracking-[0.25em] uppercase mb-4"
const bodyText = "text-sm leading-relaxed"

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
          <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: 'rgba(255,200,150,0.25)' }}>
            Artist · Ecosystem Builder · Systems Architect
          </p>
          <p className="text-[0.65rem] italic max-w-lg mx-auto" style={{ color: 'rgba(255,200,150,0.3)', fontFamily: "'Playfair Display', serif" }}>
            &ldquo;Everything is energy. Everything is movement.&rdquo;
          </p>
        </div>

        {/* Core Identity */}
        <section className="mb-8 p-5 md:p-8" style={panelStyle}>
          <h2 className={sectionTitle} style={{ color: 'rgba(240,198,116,0.5)' }}>The Core</h2>
          <p className={bodyText} style={{ color: 'rgba(255,220,180,0.6)' }}>
            Some people hear music. Shim feels it — every kick drum lands in the gut,
            every snare hits the chest, every hi-hat dissolves into the air above the head.
            This isn&apos;t metaphor. It&apos;s how reality is experienced — through frequency,
            through vibration, through the body as instrument.
          </p>
          <p className="text-sm leading-relaxed mt-3" style={{ color: 'rgba(255,220,180,0.5)' }}>
            That awareness became the foundation for everything being built: spaces where
            sound heals, movement liberates, technology empowers, and community transforms.
            Where the line between art and architecture dissolves. Where a gym is also a
            studio is also a school is also a sanctuary.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { label: 'shim.wav', desc: 'The Artist' },
              { label: 'WAVMVMT', desc: 'The System' },
              { label: 'Arc.wav', desc: 'The Engine' },
              { label: 'SET Ventures', desc: 'The Capital' },
            ].map((item) => (
              <div key={item.label} className="px-3 py-2 rounded-xl"
                style={{ background: 'rgba(240,198,116,0.04)', border: '1px solid rgba(240,198,116,0.08)' }}>
                <div className="text-xs font-bold" style={{ color: '#f0c674' }}>{item.label}</div>
                <div className="text-[0.5rem]" style={{ color: 'rgba(255,220,180,0.3)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* The Journey */}
        <section className="mb-8 p-5 md:p-8" style={panelStyle}>
          <h2 className={sectionTitle} style={{ color: 'rgba(240,198,116,0.5)' }}>The Journey</h2>

          {/* Timeline */}
          <div className="space-y-6">
            <div className="border-l-2 pl-4" style={{ borderColor: 'rgba(240,198,116,0.15)' }}>
              <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-1" style={{ color: 'rgba(128,212,168,0.4)' }}>Foundation</div>
              <p className={bodyText} style={{ color: 'rgba(255,220,180,0.5)' }}>
                The body learned first. Parkour became the mother tongue — walls became
                launchpads, railings became instruments, the city became a canvas. While
                studying nursing, helped build a renowned parkour facility from raw space
                into something alive. That process planted the seed: creating physical
                environments where people discover what they&apos;re capable of.
              </p>
              <p className="text-sm leading-relaxed mt-2" style={{ color: 'rgba(255,220,180,0.4)' }}>
                Then a choice. Medicine heals one body at a time. But what if you could build
                something that heals thousands — emotionally, financially, spiritually, physically —
                all at once? Nursing school ended. The real work began.
              </p>
            </div>

            <div className="border-l-2 pl-4" style={{ borderColor: 'rgba(240,198,116,0.15)' }}>
              <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-1" style={{ color: 'rgba(128,212,168,0.4)' }}>Music Awakening</div>
              <p className={bodyText} style={{ color: 'rgba(255,220,180,0.5)' }}>
                Sound became the second language. Studio sessions, collaborations, late nights
                translating feeling into frequency. The music refused to stay in one genre —
                rap bled into rock, rock dissolved into something experimental, because
                authentic expression doesn&apos;t respect borders. Every track became a
                transmission, not just a song.
              </p>
            </div>

            <div className="border-l-2 pl-4" style={{ borderColor: 'rgba(240,198,116,0.15)' }}>
              <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-1" style={{ color: 'rgba(128,212,168,0.4)' }}>Crystallization</div>
              <p className={bodyText} style={{ color: 'rgba(255,220,180,0.5)' }}>
                One truth emerged from the noise: everything is energy. Everything is movement.
                Parkour, music, wellness, community — they were never separate things. They
                were always one system viewed from different angles. WAVMVMT wasn&apos;t invented.
                It was recognized.
              </p>
            </div>

            <div className="border-l-2 pl-4" style={{ borderColor: 'rgba(240,198,116,0.15)' }}>
              <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-1" style={{ color: 'rgba(225,48,108,0.4)' }}>Resistance</div>
              <p className={bodyText} style={{ color: 'rgba(255,220,180,0.5)' }}>
                Builders attract friction. Industries not designed for creators. Systems that
                extract more than they return. Every wall became a wall-run. Every closed
                door became a vault. The parkour philosophy held: when the path doesn&apos;t
                exist, you create it. When the system doesn&apos;t serve you, you build a new one.
              </p>
            </div>

            <div className="border-l-2 pl-4" style={{ borderColor: 'rgba(240,198,116,0.3)' }}>
              <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-1" style={{ color: '#f0c674' }}>Now</div>
              <p className={bodyText} style={{ color: 'rgba(255,220,180,0.6)' }}>
                The blueprint is drawn. The team is assembled. The capital is in motion.
                WAVMVMT is becoming real — not as a brand, but as infrastructure for
                human development. A global system where every room, every frequency,
                every interaction is designed to elevate consciousness and unlock potential.
                What needs to be built hasn&apos;t been built. Until now.
              </p>
            </div>
          </div>
        </section>

        {/* Parkour Philosophy */}
        <section className="mb-8 p-5 md:p-8" style={panelStyle}>
          <h2 className={sectionTitle} style={{ color: 'rgba(240,198,116,0.5)' }}>Parkour as Philosophy</h2>
          <p className={bodyText} style={{ color: 'rgba(255,220,180,0.5)' }}>
            Before there was music, before there was business, there was the body
            in motion. Parkour taught the fundamental lesson: obstacles are invitations.
            Every wall is a question — and the answer is always movement.
          </p>
          <p className="text-sm leading-relaxed mt-3 italic" style={{ color: 'rgba(255,220,180,0.4)', fontFamily: "'Playfair Display', serif" }}>
            WAVMVMT is parkour philosophy scaled to civilization: move through obstacles,
            adapt to terrain, flow through resistance, create paths where none existed before.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
            {['Freedom', 'Flow State', 'Risk Mastery', 'Body Intelligence', 'Adaptation'].map((v) => (
              <div key={v} className="text-center py-2 rounded-lg text-[0.5rem] tracking-wider uppercase"
                style={{ background: 'rgba(240,198,116,0.04)', color: 'rgba(255,220,180,0.35)' }}>
                {v}
              </div>
            ))}
          </div>
        </section>

        {/* Music */}
        <section className="mb-8 p-5 md:p-8" style={panelStyle}>
          <h2 className={sectionTitle} style={{ color: 'rgba(240,198,116,0.5)' }}>The Music</h2>
          <p className={bodyText} style={{ color: 'rgba(255,220,180,0.5)' }}>
            The sound doesn&apos;t ask permission to cross genres. Rap bleeds into rock,
            rock dissolves into something unnamed, because real feeling refuses to be
            categorized. Every track is a frequency transmission — designed to land in
            the body before it reaches the mind. The goal was never streams or charts.
            The goal is transformation through vibration.
          </p>
          <div className="rounded-xl overflow-hidden mt-4">
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

        {/* Business Ventures */}
        <section className="mb-8 p-5 md:p-8" style={panelStyle}>
          <h2 className={sectionTitle} style={{ color: 'rgba(240,198,116,0.5)' }}>Active Ventures</h2>
          <div className="space-y-4">
            <div className="border-l-2 pl-4" style={{ borderColor: 'rgba(240,198,116,0.15)' }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold" style={{ color: '#f0c674' }}>Varunex Capital Advisory & Jupiter Digital Strategies</span>
              </div>
              <p className="text-[0.6rem] mb-1.5" style={{ color: 'rgba(255,220,180,0.4)' }}>
                Working with{' '}
                <a href="https://www.linkedin.com/in/nicholas-patterson-651053151/" target="_blank" rel="noopener noreferrer" style={{ color: '#f0c674', textDecoration: 'none' }}>Nick Patterson</a>
                {' '}on capital advisory. Actively working with developers
                in the 8-12 figure deal range with projects currently in motion at that level.
              </p>
            </div>
            <div className="border-l-2 pl-4" style={{ borderColor: 'rgba(240,198,116,0.15)' }}>
              <div className="text-xs font-bold mb-1" style={{ color: '#f0c674' }}>SET Ventures / Enterprises</div>
              <p className="text-[0.6rem] mb-1.5" style={{ color: 'rgba(255,220,180,0.4)' }}>
                VP of Origination (SET Ventures) and SDR/BDR (SET Marketing). Working with{' '}
                <a href="https://www.linkedin.com/in/thechrismarchese/" target="_blank" rel="noopener noreferrer" style={{ color: '#f0c674', textDecoration: 'none' }}>Chris Marchese</a>
                {' '}and{' '}
                <a href="https://www.linkedin.com/in/tylerjamesferguson/" target="_blank" rel="noopener noreferrer" style={{ color: '#f0c674', textDecoration: 'none' }}>Tyler Ferguson</a>
                . Deal origination, capital markets, marketing, and enterprise solutions.
              </p>
              <div className="flex gap-2">
                <a href="https://www.instagram.com/thechrismarchese/" target="_blank" rel="noopener noreferrer"
                  className="text-[0.45rem] px-2 py-0.5 rounded-full" style={{ border: '1px solid rgba(225,48,108,0.15)', color: 'rgba(225,48,108,0.5)', textDecoration: 'none' }}>
                  Chris IG
                </a>
              </div>
            </div>
            <div className="border-l-2 pl-4" style={{ borderColor: 'rgba(240,198,116,0.15)' }}>
              <div className="text-xs font-bold mb-1" style={{ color: '#f0c674' }}>
                <a href="https://contrabandbeautycbd.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#f0c674', textDecoration: 'none' }}>Contraband Beauty</a>
              </div>
              <p className="text-[0.6rem]" style={{ color: 'rgba(255,220,180,0.4)' }}>
                Creative Director alongside Kim Allegra. Brand direction, visual identity, creative strategy,
                and built the{' '}
                <a href="https://contrabandbeautycbd.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#80d4a8', textDecoration: 'none' }}>website</a>.
              </p>
            </div>
            <div className="border-l-2 pl-4" style={{ borderColor: 'rgba(240,198,116,0.15)' }}>
              <div className="text-xs font-bold mb-1" style={{ color: '#f0c674' }}>
                <a href="https://www.instagram.com/sarahradamsofficial/" target="_blank" rel="noopener noreferrer" style={{ color: '#f0c674', textDecoration: 'none' }}>Sarah R Adams</a>
              </div>
              <p className="text-[0.6rem]" style={{ color: 'rgba(255,220,180,0.4)' }}>
                Creative Director &amp; Executive Assistant. Strategic support and creative operations.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-8 p-5 md:p-8" style={panelStyle}>
          <h2 className={sectionTitle} style={{ color: 'rgba(240,198,116,0.5)' }}>WAVMVMT Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'Shim', role: 'Founder / Visionary', link: 'https://instagram.com/shim.wav' },
              { name: 'Cody Haze', role: 'Photographer & Creative Director', link: 'https://www.instagram.com/codyhaze/' },
              { name: 'Nathan', role: 'Team', link: '' },
              { name: 'Marvin', role: 'Team', link: '' },
              { name: 'Gra', role: 'Team', link: '' },
            ].map((member) => (
              <div key={member.name} className="p-3 rounded-xl text-center"
                style={{ background: 'rgba(240,198,116,0.03)', border: '1px solid rgba(240,198,116,0.08)' }}>
                {member.link ? (
                  <a href={member.link} target="_blank" rel="noopener noreferrer"
                    className="text-xs font-bold mb-0.5 block" style={{ color: 'rgba(255,220,180,0.6)', textDecoration: 'none' }}>
                    {member.name}
                  </a>
                ) : (
                  <div className="text-xs font-bold mb-0.5" style={{ color: 'rgba(255,220,180,0.6)' }}>{member.name}</div>
                )}
                <div className="text-[0.45rem] tracking-wider uppercase" style={{ color: 'rgba(255,220,180,0.25)' }}>{member.role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* The Ecosystem */}
        <section className="mb-8 p-5 md:p-8" style={panelStyle}>
          <h2 className={sectionTitle} style={{ color: 'rgba(240,198,116,0.5)' }}>The Ecosystem</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,220,180,0.5)' }}>
            An interconnected system where every element strengthens every other element.
            The music fills the spaces. The spaces host the events. The events build the
            community. The community sustains the ecosystem. Nothing exists in isolation.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { name: 'Music & Streaming', icon: '🎶' },
              { name: 'Events & Tours', icon: '🎪' },
              { name: 'Content Creation', icon: '🎥' },
              { name: 'WAVMVMT Centers', icon: '🏢' },
              { name: 'Memberships', icon: '🏋️' },
              { name: 'Studio Services', icon: '🎧' },
              { name: 'Merch & Fashion', icon: '👕' },
              { name: 'Food & Wellness', icon: '🥤' },
              { name: 'Education & Tech', icon: '🧠' },
              { name: 'Deal Origination', icon: '💰' },
              { name: 'AI & Synesthesia', icon: '🤖' },
              { name: 'Global Expansion', icon: '🌍' },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ background: 'rgba(240,198,116,0.03)', border: '1px solid rgba(240,198,116,0.06)' }}>
                <span className="text-sm">{item.icon}</span>
                <span className="text-[0.55rem] tracking-wider" style={{ color: 'rgba(255,220,180,0.4)' }}>{item.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* The Mission */}
        <section className="mb-8 p-5 md:p-8 text-center" style={panelStyle}>
          <h2 className={sectionTitle} style={{ color: 'rgba(240,198,116,0.5)' }}>The Mission</h2>
          <p className="text-lg italic mb-4" style={{ color: 'rgba(255,220,180,0.6)', fontFamily: "'Playfair Display', serif" }}>
            Change people&apos;s lives at scale.
          </p>
          <p className={bodyText} style={{ color: 'rgba(255,220,180,0.4)' }}>
            Through energy. Through music. Through movement. Through money. Through community.
          </p>
          <div className="mt-6 px-4 py-3 rounded-xl inline-block"
            style={{ background: 'rgba(240,198,116,0.04)', border: '1px solid rgba(240,198,116,0.1)' }}>
            <p className="text-[0.6rem] italic" style={{ color: 'rgba(255,220,180,0.3)' }}>
              &ldquo;You&apos;re not confused. You&apos;re early. What you&apos;re trying to build
              is a new type of ecosystem that blends creator economy, wellness, experiences,
              finance, and technology. That&apos;s why it feels overwhelming sometimes.&rdquo;
            </p>
          </div>
        </section>

        {/* Connect */}
        <section className="mb-8 p-5 md:p-8 text-center" style={panelStyle}>
          <h2 className={sectionTitle} style={{ color: 'rgba(240,198,116,0.5)' }}>Connect</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Linktree', href: 'https://linktr.ee/shim.wav' },
              { label: 'Instagram', href: 'https://instagram.com/shim.wav' },
              { label: 'Twitter/X', href: 'https://x.com/shimwav' },
              { label: 'Spotify', href: 'https://open.spotify.com/artist/4HHt60CmwO8nAS9RFBBO9u' },
              { label: 'Synesthesia', href: '/visualizer' },
              { label: 'Explore the World', href: '/world' },
            ].map((link) => (
              <a key={link.label} href={link.href}
                target={link.href.startsWith('/') ? undefined : '_blank'}
                rel={link.href.startsWith('/') ? undefined : 'noopener noreferrer'}
                className="px-4 py-2 rounded-full text-[0.55rem] tracking-[0.1em] uppercase transition-all hover:border-[rgba(240,198,116,0.4)]"
                style={{
                  border: `1px solid ${link.label === 'Explore the World' ? 'rgba(128,212,168,0.2)' : 'rgba(240,198,116,0.2)'}`,
                  color: link.label === 'Explore the World' ? '#80d4a8' : '#f0c674',
                  textDecoration: 'none',
                }}>
                {link.label}
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[0.5rem]" style={{ color: 'rgba(255,200,150,0.15)' }}>
            Full interview coming soon.
          </p>
          <p className="text-[0.45rem] mt-1 italic" style={{ color: 'rgba(255,200,150,0.1)' }}>
            © 2026 WAVMVMT / Arc.wav. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
