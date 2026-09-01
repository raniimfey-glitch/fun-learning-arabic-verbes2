// Service Worker for "عَالَمُ الأَفْعَالِ" (World of Verbs) PWA
const CACHE_NAME = 'world-of-verbs-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-192.png',
  '/icon-maskable-512.png',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/og-image.png'
];

// Install Event - Pre-cache critical app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-cache warning for some non-critical assets:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up previous version caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network first for navigation with offline fallback, Stale-while-revalidate for static assets
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Ignore browser extensions or non-http(s) schemes
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 1. Navigation requests (HTML pages) -> Network first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Offline fallback
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          const indexFallback = await caches.match('/index.html');
          if (indexFallback) {
            return indexFallback;
          }
          return new Response(
            `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>عَالَمُ الأَفْعَالِ</title><style>body{font-family:system-ui,sans-serif;text-align:center;padding:40px;background:#FFFBEB;color:#78350F}h1{font-size:24px}p{font-size:18px}</style></head><body><h1>🌟 عَالَمُ الأَفْعَالِ</h1><p>أَنْتَ الآنَ فِي وَضْعِ عَدَمِ الاتِّصَالِ بِالإِنْتَرْنِت 📡</p><p>يُمْكِنُكَ اسْتِخْدَامُ التَّطْبِيقِ دُونَ حَاجَةٍ لِلشَّبَكَةِ.</p></body></html>`,
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // 2. Static assets (scripts, styles, images, fonts) -> Stale-while-revalidate / Cache-first
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Return cached or ignore
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Support manual skipWaiting trigger
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
