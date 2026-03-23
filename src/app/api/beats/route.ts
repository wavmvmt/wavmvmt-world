import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy route for serving beats from private Vercel Blob storage.
 * Usage: /api/beats?file=Grunge.MP3
 *
 * This allows the client to play audio from private blob storage
 * without exposing the blob token.
 */
export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get('file')

  if (!file) {
    return NextResponse.json({ error: 'Missing file parameter' }, { status: 400 })
  }

  // Sanitize — only allow files in the beats/ directory
  const safeName = file.replace(/\.\./g, '').replace(/^\//, '')

  const blobUrl = `https://znhilrrgmxwedlqs.private.blob.vercel-storage.com/beats/${encodeURIComponent(safeName)}`

  try {
    const response = await fetch(blobUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Beat not found' }, { status: 404 })
    }

    const contentType = response.headers.get('content-type') || 'audio/mpeg'
    const body = response.body

    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // cache 24h
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch beat' }, { status: 500 })
  }
}
