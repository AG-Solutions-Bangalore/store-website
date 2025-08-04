const CACHE_NAME = 'lohiya-store-v1';
const OFFLINE_URL = '/offline.html';


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});


self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
  self.clients.claim();
});


self.addEventListener('fetch', (event) => {
  const { request } = event;


  if (
    request.url.includes('/@vite') ||
    request.url.includes('/@react-refresh') ||
    request.url.includes('hot-update') ||
    request.url.includes('sockjs-node')
  ) {
    return;
  }

  if (request.mode === 'navigate') {

    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
  } else {

    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(request).catch(() => {
      
            return new Response('Failed to fetch resource.', {
              status: 503,
              statusText: 'Service Unavailable',
            });
          })
        );
      })
    );
  }
});
