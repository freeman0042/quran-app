/* ═══════════════════════════════════════════════════
   SERVICE WORKER — Al-Qurʾân PWA Premium v3
   Stratégie de cache intelligente :
   • Shell app     → Cache-first (instantané)
   • API Coran     → Network-first + fallback cache
   • Audio         → Cache après premier chargement
   ═══════════════════════════════════════════════════ */

const V           = 'quran-premium-v3';
const CACHE_SHELL = `${V}-shell`;
const CACHE_API   = `${V}-api`;
const CACHE_AUDIO = `${V}-audio`;

/* Sourates précachées au démarrage (Juz Amma + essentielles) */
const PRECACHE_SURAHS = [1, 18, 36, 55, 67, 112, 113, 114,
  78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
  90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
  101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111];

const SHELL_URLS = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;500;700&display=swap',
];

/* ── INSTALLATION ── */
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil((async () => {
    const shell = await caches.open(CACHE_SHELL);
    // Shell (best-effort)
    await Promise.allSettled(SHELL_URLS.map(url =>
      fetch(url).then(r => { if (r.ok) shell.put(url, r); }).catch(() => {})
    ));
    // API data for key surahs
    const api = await caches.open(CACHE_API);
    for (const n of PRECACHE_SURAHS) {
      try {
        const url = `https://api.alquran.cloud/v1/surah/${n}/editions/quran-uthmani,fr.hamidullah`;
        const r = await fetch(url);
        if (r.ok) await api.put(url, r);
      } catch {}
    }
    // Full French Quran for global search
    try {
      const url = 'https://api.alquran.cloud/v1/quran/fr.hamidullah';
      const r = await fetch(url);
      if (r.ok) await api.put(url, r);
    } catch {}
    // Surah metadata
    try {
      const url = 'https://api.alquran.cloud/v1/meta';
      const r = await fetch(url);
      if (r.ok) await api.put(url, r);
    } catch {}
  })());
});

/* ── ACTIVATION ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k.startsWith('quran-') && k !== CACHE_SHELL && k !== CACHE_API && k !== CACHE_AUDIO)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── FETCH ── */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Audio files → cache-then-network
  if (url.hostname === 'cdn.islamic.network' && url.pathname.includes('/audio/')) {
    event.respondWith(audioStrategy(event.request));
    return;
  }

  // Quran API → network-first with cache fallback
  if (url.hostname === 'api.alquran.cloud') {
    event.respondWith(networkFirst(event.request, CACHE_API));
    return;
  }

  // Google Fonts → stale-while-revalidate
  if (url.hostname.includes('fonts.')) {
    event.respondWith(staleWhileRevalidate(event.request, CACHE_SHELL));
    return;
  }

  // Everything else → cache-first
  event.respondWith(cacheFirst(event.request, CACHE_SHELL));
});

/* ── STRATEGIES ── */

async function cacheFirst(req, cacheName) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    return new Response('Hors-ligne — ressource non disponible', { status: 503 });
  }
}

async function networkFirst(req, cacheName) {
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    const cached = await caches.match(req);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'Hors-ligne', code: 503 }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function audioStrategy(req) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) {
      const cache = await caches.open(CACHE_AUDIO);
      // Limit audio cache to ~300 files to save storage
      const keys = await cache.keys();
      if (keys.length > 300) {
        await Promise.all(keys.slice(0, 10).map(k => cache.delete(k)));
      }
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    return new Response('Audio non disponible hors-ligne', { status: 503 });
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(req);
  const fetchPromise = fetch(req)
    .then(res => { if (res.ok) cache.put(req, res.clone()); return res; })
    .catch(() => null);
  return cached || fetchPromise;
}

/* ── MESSAGE ── */
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
