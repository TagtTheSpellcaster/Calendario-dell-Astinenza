const CACHE_NAME = 'astinenza-cache-v1';

// Lista delle risorse da memorizzare per l'uso offline
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// 1. Installazione: memorizza le risorse nella cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache).catch((err) => {
        console.log('Errore durante il caching di alcune risorse esterne:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Attivazione: pulisce le vecchie versioni della cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().keys ? caches.keys() : caches.keys().then((keys) => {
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

// 3. Fetch: Intercetta le richieste di rete (REQUISITO OBBLIGATORIO PER LA PWA)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Restituisce la risorsa in cache se esiste, altrimenti la scarica dalla rete
      return cachedResponse || fetch(event.request);
    })
  );
});
