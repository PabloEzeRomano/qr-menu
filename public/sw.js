// QR Menu Service Worker for offline support
const CACHE_NAME = 'qr-menu-v1'
const STATIC_CACHE = 'qr-menu-static-v1'

// Skip caching in development
const IS_DEVELOPMENT = self.location.hostname === 'localhost'

// Files to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/demo-menu',
  '/auth',
  '/manifest.json',
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/webpack.js',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  if (IS_DEVELOPMENT) {
    console.log('Service Worker: Skipping cache installation in development')
    self.skipWaiting()
    return
  }

  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  if (IS_DEVELOPMENT) {
    // Clear all caches in development
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        console.log('Service Worker: Clearing all caches in development', cacheNames)
        return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
      }),
    )
    self.clients.claim()
    return
  }

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip caching in development
  if (IS_DEVELOPMENT) {
    return
  }

  // Skip non-GET requests and external URLs
  if (request.method !== 'GET' || !url.origin.includes(self.location.origin)) {
    return
  }

  // API routes - network first, then cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful GET responses for menu data
          if (
            response.ok &&
            (url.pathname.includes('/items') || url.pathname.includes('/categories'))
          ) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(request)
        }),
    )
    return
  }

  // Static assets - cache first, then network
  event.respondWith(
    caches.match(request).then((response) => {
      if (response) {
        return response
      }

      return fetch(request).then((response) => {
        // Cache successful responses
        if (response.ok) {
          const responseClone = response.clone()
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseClone)
          })
        }
        return response
      })
    }),
  )
})

// Background sync for cart data
self.addEventListener('sync', (event) => {
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCartData())
  }
})

async function syncCartData() {
  // Sync cart data when back online
  try {
    const clients = await self.clients.matchAll()
    clients.forEach((client) => {
      client.postMessage({ type: 'SYNC_CART' })
    })
  } catch (error) {
    console.error('Cart sync failed:', error)
  }
}
