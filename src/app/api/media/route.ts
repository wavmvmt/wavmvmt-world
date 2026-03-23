import { NextRequest, NextResponse } from 'next/server'

/**
 * Proxy route for serving media from private Vercel Blob storage.
 * Usage: /api/media?file=november%2025th%20beat%201%20landscape.mov
 */
export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get('file')

  if (!file) {
    return NextResponse.json({ error: 'Missing file parameter' }, { status: 400 })
  }

  const safeName = file.replace(/\.\./g, '').replace(/^\//, '')
  const blobUrl = `https://znhilrrgmxwedlqs.private.blob.vercel-storage.com/${safeName}`

  try {
    const response = await fetch(blobUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const body = response.body

    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=604800', // cache 7 days
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
