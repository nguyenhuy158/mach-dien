// Service worker for offline caching
const CACHE = 'machdien-v1'
const ASSETS = ['/', '/index.html', '/manifest.json', '/brand/logo-icon.svg']

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()))
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  const { request } = e
  if (request.method !== 'GET') return
  // Network-first for HTML, cache-first for static assets
  const isHtml = request.headers.get('accept')?.includes('text/html')
  if (isHtml) {
    e.respondWith(
      fetch(request)
        .then(res => {
          const copy = res.clone()
          caches.open(CACHE).then(c => c.put(request, copy))
          return res
        })
        .catch(() => caches.match(request).then(r => r || caches.match('/index.html')))
    )
  } else {
    e.respondWith(
      caches.match(request).then(cached =>
        cached || fetch(request).then(res => {
          if (res.ok && (request.url.startsWith(self.location.origin))) {
            const copy = res.clone()
            caches.open(CACHE).then(c => c.put(request, copy))
          }
          return res
        })
      )
    )
  }
})
