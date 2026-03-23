import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

/**
 * POST /api/track — log a visitor event
 * Body: { event: string, data: any, sessionId: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { event, data, sessionId } = body

    if (event === 'quest_complete') {
      await getSupabase()?.from('visitor_log').update({
        quests_completed: data.count,
      }).eq('session_id', sessionId)
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}

/**
 * GET /api/track — get aggregate stats
 */
export async function GET() {
  try {
    const sb = getSupabase()
    if (!sb) return NextResponse.json({ visitors: 0, suggestions: 0, roulette: 0 })

    const { count } = await sb
      .from('visitor_log')
      .select('*', { count: 'exact', head: true })

    const { count: suggestionCount } = await sb
      .from('suggestions')
      .select('*', { count: 'exact', head: true })

    const { count: rouletteCount } = await sb
      .from('roulette_entries')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      totalVisitors: count || 0,
      totalSuggestions: suggestionCount || 0,
      rouletteEntries: rouletteCount || 0,
    })
  } catch {
    return NextResponse.json({ totalVisitors: 0, totalSuggestions: 0, rouletteEntries: 0 })
  }
}
