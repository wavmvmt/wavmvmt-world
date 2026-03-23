import Link from 'next/link'
import { PageNav } from '@/components/PageNav'

const panelStyle = {
  background: 'rgba(26,21,32,0.85)',
  border: '1px solid rgba(240,198,116,0.12)',
  borderRadius: '16px',
}

const sectionTitle = "text-[0.55rem] tracking-[0.25em] uppercase mb-4"
const bodyText = "text-sm leading-relaxed"

export default function FounderPage() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-20 pb-12 md:pt-24 md:pb-20"
      style={{ background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)' }}>
      <PageNav current="Founder" />

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
            There&apos;s a way of moving through the world where everything speaks in frequency.
            A kick drum lives in the belly. A melody rests across the shoulders. A hi-hat
            floats somewhere just above the crown. When you experience reality this way,
            the boundaries between disciplines start to soften — music becomes movement,
            movement becomes healing, healing becomes community.
          </p>
          <p className="text-sm leading-relaxed mt-3" style={{ color: 'rgba(255,220,180,0.5)' }}>
            That softening is where WAVMVMT lives. It&apos;s the space between categories —
            where a studio is also a sanctuary, where a gym session becomes a spiritual
            practice, where technology serves something deeply human.
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
                The body learned first. Parkour became the original discipline — training
                the eye to see opportunity in structure, the mind to commit before certainty
                arrives. While studying nursing, helped build a renowned parkour facility
                from raw space into a thriving community. That experience revealed
                something essential: the power of designing environments that change
                how people relate to their own potential.
              </p>
              <p className="text-sm leading-relaxed mt-2" style={{ color: 'rgba(255,220,180,0.4)' }}>
                Nursing school offered one path to healing — one patient, one condition
                at a time. The deeper question emerged: what if you could architect spaces
                that heal at scale? Emotionally, financially, spiritually, physically —
                all within the same walls. That question ended one chapter and opened another.
              </p>
            </div>

            <div className="border-l-2 pl-4" style={{ borderColor: 'rgba(240,198,116,0.15)' }}>
              <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-1" style={{ color: 'rgba(128,212,168,0.4)' }}>Music Awakening</div>
              <p className={bodyText} style={{ color: 'rgba(255,220,180,0.5)' }}>
                Then sound opened up. Studio sessions, collaborations, long nights where
                feeling found its way into frequency. The music never settled into one
                lane — it moved the way it needed to, somewhere between rap, rock, and
                places that don&apos;t have names yet. The studio became a second home,
                and every session was practice in translating the intangible.
              </p>
            </div>

            <div className="border-l-2 pl-4" style={{ borderColor: 'rgba(240,198,116,0.15)' }}>
              <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-1" style={{ color: 'rgba(128,212,168,0.4)' }}>Clarity</div>
              <p className={bodyText} style={{ color: 'rgba(255,220,180,0.5)' }}>
                Somewhere along the way, the pieces stopped being separate. Movement,
                music, wellness, community — they&apos;d always been one thing, just seen from
                different angles. That recognition was quiet but certain. WAVMVMT wasn&apos;t
                something that needed to be invented. It was something that needed to be
                given a name.
              </p>
            </div>

            <div className="border-l-2 pl-4" style={{ borderColor: 'rgba(240,198,116,0.15)' }}>
              <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-1" style={{ color: 'rgba(225,48,108,0.4)' }}>Resistance</div>
              <p className={bodyText} style={{ color: 'rgba(255,220,180,0.5)' }}>
                Growth rarely arrives gently. There were seasons that demanded a harder
                kind of learning — about ownership, about sovereignty, about what it means
                to build on your own terms. Those chapters weren&apos;t easy, but they were
                clarifying. They sharpened the conviction that the most meaningful work
                is building infrastructure that serves the people who need it most.
              </p>
            </div>

            <div className="border-l-2 pl-4" style={{ borderColor: 'rgba(240,198,116,0.3)' }}>
              <div className="text-[0.5rem] tracking-[0.15em] uppercase mb-1" style={{ color: '#f0c674' }}>Now</div>
              <p className={bodyText} style={{ color: 'rgba(255,220,180,0.6)' }}>
                The vision is clear. The people are here. The work is underway.
                WAVMVMT is becoming real — not as a brand, but as living infrastructure
                where people come to grow, create, heal, and connect. A space that
                meets you wherever you are and invites you somewhere further.
              </p>
            </div>
          </div>
        </section>

        {/* Parkour Philosophy */}
        <section className="mb-8 p-5 md:p-8" style={panelStyle}>
          <h2 className={sectionTitle} style={{ color: 'rgba(240,198,116,0.5)' }}>Parkour as Philosophy</h2>
          <p className={bodyText} style={{ color: 'rgba(255,220,180,0.5)' }}>
            Before the music, before the business — the body in motion. Parkour
            was the first discipline, and it remains the deepest. It teaches you to
            read environments differently, to see possibility where others see
            limitation, to trust the process of committing fully to a movement
            before you know where it lands.
          </p>
          <p className="text-sm leading-relaxed mt-3 italic" style={{ color: 'rgba(255,220,180,0.4)', fontFamily: "'Playfair Display', serif" }}>
            WAVMVMT carries that philosophy into everything — read the terrain,
            commit to the movement, trust the process.
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
            The music moves the way it needs to — somewhere between rap, rock, and
            territory that hasn&apos;t been mapped yet. It&apos;s built to land in the body
            first, to be felt before it&apos;s understood. The work isn&apos;t about fitting
            into a genre. It&apos;s about being honest enough that the genre finds you.
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

        {/* Self-Taught Builder */}
        <section className="mb-8 p-5 md:p-8" style={panelStyle}>
          <h2 className={sectionTitle} style={{ color: 'rgba(240,198,116,0.5)' }}>On Building</h2>
          <p className={bodyText} style={{ color: 'rgba(255,220,180,0.5)' }}>
            Serious web design started only last year. Coding and systems architecture
            even more recently. But the thinking was always there — patterns from
            music production, spatial awareness from parkour, operational instincts
            from deal-making — all converging into a new kind of literacy. The technical
            skills arrived when they were needed, shaped by everything that came before.
          </p>
          <p className="text-sm leading-relaxed mt-3" style={{ color: 'rgba(255,220,180,0.4)' }}>
            This entire project — the 3D world you&apos;re walking through, the synesthesia
            visualizer, the systems holding it all together — was built by bringing
            processes and thinking from every discipline into one practice. Proof that
            the most interesting builders are the ones who arrive from unexpected directions.
            Built with Claude Code and Arc.wav — proving that the right tools in
            the right hands can bring any vision to life.
          </p>
        </section>

        {/* Dedication */}
        <section className="mb-8 p-5 md:p-8 text-center" style={panelStyle}>
          <h2 className={sectionTitle} style={{ color: 'rgba(240,198,116,0.5)' }}>Dedication</h2>
          <p className="text-sm leading-relaxed italic" style={{ color: 'rgba(255,220,180,0.5)', fontFamily: "'Playfair Display', serif" }}>
            For my family and my friends — I love you more than words will ever carry.
            You showed me what support looks like when it&apos;s real. What love feels like
            when it doesn&apos;t ask for anything back. What faith means when the vision
            is still just a feeling in your chest and nothing on paper yet.
            Everything I build, I build because of you.
          </p>
          <p className="text-sm leading-relaxed mt-4" style={{ color: 'rgba(255,220,180,0.45)' }}>
            And for my niece and nephew — this is for you. I want you to grow up
            in a world where someone who looks like you, who comes from where you
            come from, built something beautiful with their bare hands and refused
            to stop. I want you to see this and know, deeply and without question,
            that the size of your dreams is allowed. That the things you imagine
            late at night when no one&apos;s watching — those are the things worth
            building. That the world will try to make your vision smaller. Don&apos;t
            let it. I didn&apos;t.
          </p>
          <p className="text-sm leading-relaxed italic mt-3" style={{ color: 'rgba(255,220,180,0.4)', fontFamily: "'Playfair Display', serif" }}>
            For every kid sitting somewhere right now with a dream that feels
            too big and a room that feels too small — keep going. The room is
            about to get a lot bigger.
          </p>
          <p className="text-sm leading-relaxed mt-4" style={{ color: 'rgba(255,220,180,0.3)' }}>
            This space exists because the science is clear and the heart knows
            what the research confirms: when you develop the whole person —
            body, mind, spirit, community — everything transforms. Flow states,
            environment design, recovery physiology, the neuroscience of
            belonging. It all points to the same truth. We grow best when we
            grow together, in spaces designed for exactly that.
          </p>
        </section>

        {/* Apollo */}
        <section className="mb-8 p-5 md:p-8" style={panelStyle}>
          <h2 className={sectionTitle} style={{ color: 'rgba(240,198,116,0.5)' }}>Apollo 🐕</h2>
          <p className="text-[0.5rem] tracking-[0.15em] uppercase mb-2" style={{ color: 'rgba(128,212,168,0.35)' }}>
            Founder &amp; CEO, Dog Park Division · Head Consultant
          </p>
          <p className={bodyText} style={{ color: 'rgba(255,220,180,0.5)' }}>
            Found wandering the streets as a little pup — like he hopped a portal
            between dimensions specifically for this. A soul that showed up
            exactly when and where it was supposed to. He brought fun, play,
            energy, and love back into life in a way that reminded everything
            what those things feel like when they&apos;re real and unconditional.
            Now he&apos;s co-pilot on every adventure, every site visit, every new city.
            The plan is simple — tour him around the world, let him play on every
            site we build, make friends in every country. He loves meeting people,
            and people love meeting him.
          </p>
          <p className="text-sm leading-relaxed mt-3" style={{ color: 'rgba(255,220,180,0.4)' }}>
            Every WAVMVMT location will have thoughtfully designed dog-friendly
            spaces — covered and heated parks for winter, smart seating where
            owners can watch from a nearby café while their dogs play comfortably.
            Because wellness extends to every member of the family.
          </p>
        </section>

        {/* Special Thanks */}
        <section className="mb-8 p-5 md:p-8 text-center" style={panelStyle}>
          <h2 className={sectionTitle} style={{ color: 'rgba(240,198,116,0.5)' }}>Special Thanks</h2>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'rgba(255,220,180,0.4)' }}>
            To everyone who believed early, showed up consistently, and helped
            shape this vision through their presence, energy, and truth.
            You know who you are. More acknowledgments coming soon.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,220,180,0.35)' }}>
            Special recognition to Dan Iaboni and Monkey Vault, and Trevor de Groot
            and PlayProject — for being huge inspirations in this vision. Watching
            them build their spaces from nothing into something alive, and having the
            honour to help build parts of those gyms, planted the seed for everything
            WAVMVMT is becoming. The blueprint was learned by being in the room
            while it was being built.
          </p>
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
