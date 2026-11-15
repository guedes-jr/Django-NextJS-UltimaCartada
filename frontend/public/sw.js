const OFFLINE_CACHE_PREFIX = "ultima-cartada-offline-";
const updatedPresentation = new URL(self.location.href).searchParams.get("presentation") === "consultoria";
const CACHE_NAME = `${OFFLINE_CACHE_PREFIX}v2-${updatedPresentation ? "consultoria" : "legacy"}`;
const OFFLINE_URL = updatedPresentation ? "/offline-consultoria.html" : "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.add(OFFLINE_URL);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith(OFFLINE_CACHE_PREFIX) && name !== CACHE_NAME).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || request.mode !== "navigate" || new URL(request.url).origin !== self.location.origin) return;
  // Network-first, sem gravar resposta de página, API ou mídia no cache.
  event.respondWith(fetch(request).catch(async () => {
    const cache = await caches.open(CACHE_NAME);
    return (await cache.match(OFFLINE_URL)) || Response.error();
  }));
});
