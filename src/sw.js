// Guarda la página y sus librerías en el navegador para que abra sin internet.
// Los modelos de voz no pasan por aquí. Los guarda la propia librería de transcripción.
const PAGE = 'pagina-v1';
const LIBS = 'librerias-v1';
const LIB_HOSTS = ['cdn.jsdelivr.net', 'cdnjs.cloudflare.com'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(PAGE).then(c => c.addAll(['./'])).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const k of await caches.keys()){
      if ((k.startsWith('pagina-') && k !== PAGE) || (k.startsWith('librerias-') && k !== LIBS)) await caches.delete(k);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin){
    // la página: primero internet para recibir cambios, si no hay conexión la copia guardada
    if (req.mode === 'navigate') event.respondWith(pageFirstNetwork(req));
    return;
  }
  // librerías con versión fija: primero la copia guardada
  if (LIB_HOSTS.includes(url.hostname)) event.respondWith(libFirstCache(req));
});

async function pageFirstNetwork(req){
  const c = await caches.open(PAGE);
  try {
    const res = await fetch(req);
    if (res.ok) c.put('./', res.clone()).catch(() => {});
    return res;
  } catch(e){
    const hit = await c.match('./');
    if (hit) return hit;
    throw e;
  }
}

async function libFirstCache(req){
  const c = await caches.open(LIBS);
  const hit = await c.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok || res.type === 'opaque') c.put(req, res.clone()).catch(() => {});
  return res;
}
