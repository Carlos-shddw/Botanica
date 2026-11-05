const CACHE_VERSION = 'v2.7.0';
const SCOPE_URL = self.registration.scope;
const SCOPE_PATH = new URL(SCOPE_URL).pathname;
const SCOPE_NAME = SCOPE_PATH.split('/').filter(Boolean).join('-') || 'root';
const CACHE_PREFIX = `floricultura-${SCOPE_NAME.toLowerCase()}`;
const STATIC_CACHE = `${CACHE_PREFIX}-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `${CACHE_PREFIX}-dynamic-${CACHE_VERSION}`;
const OFFLINE_URL = new URL('pages/offline.html', SCOPE_URL).href;

const APP_SHELL_PATHS = [
  '',
  'index.html',
  'pages/offline.html',
  'pages/sobre.html',
  'manifest.json',
  'assets/images/icons/favicon.svg',
  'assets/images/icons/icon.svg',
  'assets/images/icons/icon-maskable.svg',
  'assets/images/icons/background.jpg',
  'assets/images/plants/monstera.jpg',
  'assets/images/plants/zamioculca.jpg',
  'assets/images/plants/sansevieria.jpg',
  'assets/images/plants/calathea.jpg',
  'assets/images/plants/jiboia.jpg',
  'assets/images/plants/planta-aranha.jpg',
  'assets/images/plants/ficus-lira.jpg',
  'assets/images/plants/palmeira-sala.jpg',
  'assets/images/plants/aloe-vera.jpg',
  'assets/css/styles.css',
  'assets/css/auth.css',
  'assets/css/catalog.css',
  'assets/css/components/header.css',
  'assets/css/components/cards.css',
  'assets/js/app.js',
  'assets/js/db.js',
  'assets/js/modules/api.js',
  'assets/js/modules/catalog.js',
  'assets/js/modules/ui.js',
  'assets/js/modules/utils.js'
];

const APP_SHELL = APP_SHELL_PATHS.map((path) => new URL(path, SCOPE_URL).href);

function isInScope(url) {
  return url.origin === self.location.origin && url.pathname.startsWith(SCOPE_PATH);
}

async function cacheResponse(cacheName, request, response) {
  if (!response || response.status !== 200 || response.type === 'opaque') return;

  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  } catch (error) {
    console.error(`[SW] Falha ao guardar ${request.url} na cache ${cacheName}:`, error);
  }
}

async function getCachedResponse(request) {
  const staticCache = await caches.open(STATIC_CACHE);
  const staticResponse = await staticCache.match(request);
  if (staticResponse) return staticResponse;

  const dynamicCache = await caches.open(DYNAMIC_CACHE);
  return dynamicCache.match(request);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => {
        console.log('[SW] App Shell pré-carregado com sucesso.');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Falha ao pré-carregar o App Shell:', error);
        throw error;
      })
  );
});

self.addEventListener('activate', (event) => {
  const legacyCaches = new Set([
    'floricultura-static-v1.0.0',
    'floricultura-dynamic-v1.0.0'
  ]);

  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.map((key) => {
          const isAppCache = key.startsWith(`${CACHE_PREFIX}-`) || legacyCaches.has(key);
          if (isAppCache && key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            return caches.delete(key);
          }
          return undefined;
        })
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  if (request.method !== 'GET' || !isInScope(requestUrl)) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) await cacheResponse(DYNAMIC_CACHE, request, response);
        return response;
      } catch (error) {
        const cachedPage = await getCachedResponse(request);
        if (cachedPage) return cachedPage;

        const offlinePage = await caches.match(OFFLINE_URL);
        if (offlinePage) return offlinePage;

        throw error;
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cachedResponse = await getCachedResponse(request);
    if (cachedResponse) return cachedResponse;

    const response = await fetch(request);
    if (response.ok) await cacheResponse(DYNAMIC_CACHE, request, response);
    return response;
  })());
});
