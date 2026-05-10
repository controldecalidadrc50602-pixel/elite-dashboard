const CACHE_NAME = 'elite-dashboard-v3.5.1'; // Incrementar versión para forzar actualización
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Estrategia de Instalación: Cachear assets estáticos iniciales
self.addEventListener('install', event => {
  self.skipWaiting(); // Forzar activación inmediata
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Estrategia de Activación: Limpiar cachés antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Tomar control de las pestañas inmediatamente
  );
});

// Estrategia de Fetch: Network-First para HTML, Cache-First para el resto
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Para el HTML (index.html o navegación raíz), usar Network-First
  if (request.mode === 'navigate' || url.pathname === '/index.html' || url.pathname === '/') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request)) // Fallback al caché si no hay red
    );
    return;
  }

  // Para el resto de assets (CSS, JS, Imágenes), usar Cache-First con fallback a Red
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request).then(networkResponse => {
        // Solo cachear respuestas válidas (no 404, etc)
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, responseToCache));
        return networkResponse;
      });
    })
  );
});
