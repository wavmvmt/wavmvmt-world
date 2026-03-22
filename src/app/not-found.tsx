import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(160deg, #1a1520 0%, #2a1f35 30%, #1f2a3a 60%, #1a2030 100%)' }}>
      <div className="text-7xl mb-4" style={{ color: '#f0c674', opacity: 0.3, fontFamily: "'Playfair Display', serif" }}>~</div>
      <h1 className="text-3xl font-bold mb-2" style={{ color: 'rgba(255,240,220,0.8)', fontFamily: "'Playfair Display', serif" }}>
        Room Not Found
      </h1>
      <p className="text-sm mb-8" style={{ color: 'rgba(255,200,150,0.4)' }}>
        This part of the warehouse hasn&apos;t been built yet.
      </p>
      <Link href="/world"
        className="px-8 py-3 rounded-full text-sm tracking-widest uppercase"
        style={{
          border: '1px solid rgba(240,198,116,0.3)',
          color: '#f0c674',
          textDecoration: 'none',
        }}>
        Back to the Site
      </Link>
    </div>
  )
}
