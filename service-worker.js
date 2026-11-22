
const CACHE_NAME = "charcheez-v2";

const FILES_TO_CACHE = [
  "/charcheez-order-app/",
  "/charcheez-order-app/index.html",
  "/charcheez-order-app/icon-192.png",
  "/charcheez-order-app/icon-512.png"
];

self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // فایل HTML همیشه از سرور بررسی شود تا نسخه جدید نمایش داده شود.
  if (url.pathname === "/charcheez-order-app/" ||
      url.pathname === "/charcheez-order-app/index.html") {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
