const CACHE_NAME = 'devmate-cache-v2';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide-static@0.358.0/icons/terminal.svg'
];

// Install event: Cache the "App Shell" immediately
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate worker immediately
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache, installing app shell');
      // Attempt to cache critical assets. 
      // Note: External CDN links must be available for this to succeed.
      return cache.addAll(URLS_TO_CACHE).catch(err => {
        console.error('Failed to cache app shell:', err);
      });
    })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => clients.claim()) // Take control of all clients immediately
  );
});

// Fetch event: Network first for API, Cache first for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. API Calls: Always Network Only
  if (url.hostname.includes('googleapis.com') || url.hostname.includes('gstatic.com')) {
    return; 
  }

  // 2. Static Assets: Cache First Strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // Verify valid response
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
            return networkResponse;
          }

          // Cache the new resource (Runtime Caching)
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Fallback logic could go here
          // console.log('Fetch failed, resource not in cache');
        });
    })
  );
});