const CACHE_NAME = 'astinenza-v3';

// Solo i file locali essenziali per l'app e l'installazione offline
const localAssets = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. Installazione: cache dei soli file locali (nessun blocco da CDN esterne)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(localAssets);
    })
  );
  self.skipWaiting();
});

// 2. Attivazione: pulizia delle vecchie cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch: serve i file locali dalla cache, per il resto usa la rete
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        // Fallback silenzioso se offline per risorse non cachate
      });
    })
  );
});
