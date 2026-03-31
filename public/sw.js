// WAVMVMT World Service Worker
// Caches Three.js bundle, static assets, and pages for offline use

const CACHE_NAME = 'wavmvmt-v1'
const STATIC_ASSETS = [
  '/',
  '/world',
  '/founder',
  '/manifest.json',
]

// On install: pre-cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// On activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch strategy: 
// - Audio/images: cache-first (heavy assets, rarely change)
// - JS/CSS: stale-while-revalidate (fast loads, gets updates in bg)  
// - HTML pages: network-first with offline fallback
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET, cross-origin, and API requests
  if (request.method !== 'GET') return
  if (url.origin !== location.origin) return
  if (url.pathname.startsWith('/api/')) return

  // Audio + images: cache-first (they're huge and immutable)
  if (url.pathname.startsWith('/audio/') || url.pathname.startsWith('/images/')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached
        return fetch(request).then(response => {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone))
          return response
        })
      })
    )
    return
  }

  // Next.js static chunks: stale-while-revalidate
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then(cached => {
        const fetchPromise = fetch(request).then(response => {
          caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()))
          return response
        })
        return cached || fetchPromise
      })
    )
    return
  }

  // HTML pages: network-first with offline fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()))
        return response
      })
      .catch(() => caches.match(request).then(cached => cached || caches.match('/')))
  )
})
