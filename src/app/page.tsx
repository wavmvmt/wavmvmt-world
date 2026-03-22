import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)' }}>

      {/* Subtle animated background dots */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 rounded-full bg-[#f0c674] animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 rounded-full bg-[#80d4a8] animate-ping" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/2 right-1/4 w-1 h-1 rounded-full bg-[#b48ead] animate-ping" style={{ animationDuration: '5s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Wave */}
        <div className="text-7xl md:text-9xl mb-6 animate-bounce" style={{
          color: '#f0c674',
          opacity: 0.3,
          fontFamily: 'var(--font-playfair), serif',
          textShadow: '0 0 60px rgba(240,198,116,0.15)',
          animationDuration: '5s',
        }}>~</div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-[0.12em] mb-3"
          style={{ fontFamily: 'var(--font-playfair), serif', color: 'rgba(255,240,220,0.9)' }}>
          WAVMVMT
        </h1>

        <p className="text-xs md:text-sm tracking-[0.4em] uppercase mb-12"
          style={{ color: 'rgba(255,200,150,0.35)' }}>
          Music · Wellness · Education · Technology · Community
        </p>

        {/* CTA */}
        <Link href="/world/login"
          className="inline-block px-10 py-4 rounded-full text-sm font-semibold tracking-[0.3em] uppercase transition-all duration-500 hover:shadow-[0_0_40px_rgba(240,198,116,0.15)]"
          style={{
            border: '1px solid rgba(240,198,116,0.3)',
            color: '#f0c674',
            background: 'transparent',
          }}>
          Enter the World
        </Link>

        <p className="mt-16 text-[0.6rem] tracking-[0.1em]" style={{ color: 'rgba(255,200,150,0.15)' }}>
          Built by Arc.wav · Built for builders
        </p>
        <p className="mt-1 text-[0.55rem] italic" style={{ color: 'rgba(255,200,150,0.1)' }}>
          The world is always under construction — just like us
        </p>
      </div>
    </div>
  )
}
