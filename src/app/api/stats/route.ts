import { NextResponse } from 'next/server'

/**
 * Public stats API — returns visitor count, room stats, build progress.
 * Cached for 60s to reduce Supabase load.
 * Used by landing page and HUD components.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json({
      visitors: 0,
      rooms: 13,
      quests: 100,
      buildProgress: 10,
    })
  }

  try {
    // Fetch visitor count
    const visitRes = await fetch(`${url}/rest/v1/world_visits?select=id&limit=1`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Prefer': 'count=exact',
        'Range': '0-0',
      },
    })

    const contentRange = visitRes.headers.get('content-range')
    const visitors = contentRange ? parseInt(contentRange.split('/')[1] || '0') : 0

    return NextResponse.json({
      visitors,
      rooms: 13,
      quests: 100,
      buildProgress: 10,
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    })
  } catch {
    return NextResponse.json({
      visitors: 0,
      rooms: 13,
      quests: 100,
      buildProgress: 10,
    })
  }
}
