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
            Artist · Ecosystem Builder · Frequency-Based Creator
          </p>
          <p className="text-[0.65rem] italic max-w-lg mx-auto" style={{ color: 'rgba(255,200,150,0.3)', fontFamily: "'Playfair Display', serif" }}>
            &ldquo;Everything is energy. Everything is movement.&rdquo;
          </p>
        </div>

        {/* Core Identity */}
        <section className="mb-8 p-5 md:p-8" style={panelStyle}>
          <h2 className={sectionTitle} style={{ color: 'rgba(240,198,116,0.5)' }}>The Core</h2>
          <p className={bodyText} style={{ color: 'rgba(255,220,180,0.6)' }}>
            Not just an artist who makes music. Not just an entrepreneur who builds businesses.
            A frequency-based creator merging music, movement, money, healing, and technology
            into one unified system. Someone who experiences reality through vibration —
            who feels every kick drum in the gut and every hi-hat in the air above.
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
                Parkour became the first language of freedom — movement as expression,
                control, discipline, and flow. Helped build a major parkour facility
                from the ground up, learning what it takes to create physical spaces
                where people transform. Was in nursing school studying to heal people
                through medicine — but realized the impact could be bigger. Dropped out
                to go all in on a vision: heal through lifestyle, creativity, movement,
                and community. Not just physical health — emotional, financial, and
                spiritual empowerment, all in the same scope.
              </p>
            </div>

            <div className="border-l-2 pl-4" style={{ borderColor: 'rgba(240,198,116,0.15)' }}>
              <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-1" style={{ color: 'rgba(128,212,168,0.4)' }}>Music Awakening</div>
              <p className={bodyText} style={{ color: 'rgba(255,220,180,0.5)' }}>
                Transition into music and studio life. Real sessions, real collaborations,
                real songs. Learning how to translate energy into sound. Genre-blending —
                rap, rock, experimental — because the feeling doesn&apos;t fit in one box.
              </p>
            </div>

            <div className="border-l-2 pl-4" style={{ borderColor: 'rgba(240,198,116,0.15)' }}>
              <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-1" style={{ color: 'rgba(128,212,168,0.4)' }}>Transformation</div>
              <p className={bodyText} style={{ color: 'rgba(255,220,180,0.5)' }}>
                The realization crystallized: parkour, music, wellness, community —
                they&apos;re all the same thing. Movement through obstacles. Adapting. Flowing.
                Creating paths where none exist. WAVMVMT became one unified idea.
              </p>
            </div>

            <div className="border-l-2 pl-4" style={{ borderColor: 'rgba(240,198,116,0.15)' }}>
              <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-1" style={{ color: 'rgba(225,48,108,0.4)' }}>Hardships & Growth</div>
              <p className={bodyText} style={{ color: 'rgba(255,220,180,0.5)' }}>
                Every builder faces resistance. The challenges along the way — navigating
                industries not designed for creators, learning hard lessons about ownership
                and control — became fuel. Each obstacle forced a level-up. Each setback
                reinforced the conviction: build it yourself, build it better, build it for everyone.
              </p>
            </div>

            <div className="border-l-2 pl-4" style={{ borderColor: 'rgba(240,198,116,0.3)' }}>
              <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-1" style={{ color: '#f0c674' }}>Now</div>
              <p className={bodyText} style={{ color: 'rgba(255,220,180,0.6)' }}>
                Reclaiming the narrative. Building WAVMVMT as a global system.
                Creating content daily. Preparing tours and investor decks.
                Designing an ecosystem that doesn&apos;t exist yet — because
                what needs to be built hasn&apos;t been built.
              </p>
            </div>
          </div>
        </section>

        {/* Parkour Philosophy */}
        <section className="mb-8 p-5 md:p-8" style={panelStyle}>
          <h2 className={sectionTitle} style={{ color: 'rgba(240,198,116,0.5)' }}>Parkour as Philosophy</h2>
          <p className={bodyText} style={{ color: 'rgba(255,220,180,0.5)' }}>
            Parkour isn&apos;t just a skill. It&apos;s the blueprint for everything.
            Freedom. Flow state. Risk mastery. Body intelligence. Environmental awareness.
          </p>
          <p className="text-sm leading-relaxed mt-3 italic" style={{ color: 'rgba(255,220,180,0.4)', fontFamily: "'Playfair Display', serif" }}>
            WAVMVMT is parkour philosophy applied to life: move through obstacles,
            adapt, flow, create paths where none exist.
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
            Genre-blending. Emotional, spiritual, raw. Rap, rock, experimental — because the
            feeling doesn&apos;t fit in one box. Every song is a frequency transmission designed to
            heal, activate, and shift consciousness. Not just performances — transformation experiences.
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

        {/* The Ecosystem */}
        <section className="mb-8 p-5 md:p-8" style={panelStyle}>
          <h2 className={sectionTitle} style={{ color: 'rgba(240,198,116,0.5)' }}>The Ecosystem</h2>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,220,180,0.5)' }}>
            Not one income stream. Not one platform. A full ecosystem where
            every piece feeds every other piece.
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
