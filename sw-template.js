/* Bookmark service worker — generated into dist/sw.js by vite.config.js.
   __PRECACHE__ / __VERSION__ are filled in at build time. */
const VERSION = '__VERSION__'
const CACHE = `bookmark-${VERSION}`
const FONT_CACHE = 'bookmark-fonts'
const PRECACHE = __PRECACHE__

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k.startsWith('bookmark-') && k !== CACHE && k !== FONT_CACHE).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)

  // Google Fonts: serve cached copy instantly, refresh in background
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(req))
    return
  }

  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return // live NESCO data is never cached

  // Any page URL (/prepaid, /invoice …): network first, offline -> cached app shell
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('/')))
    return
  }

  event.respondWith(cacheFirst(req))
})

async function cacheFirst(req) {
  const cached = await caches.match(req)
  if (cached) return cached
  const res = await fetch(req)
  if (res.ok) (await caches.open(CACHE)).put(req, res.clone())
  return res
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(FONT_CACHE)
  const cached = await cache.match(req)
  const network = fetch(req)
    .then((res) => {
      if (res.ok || res.type === 'opaque') cache.put(req, res.clone())
      return res
    })
    .catch(() => cached)
  return cached || network
}
