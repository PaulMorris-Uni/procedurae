/* Service worker : met l'application en cache pour un usage hors connexion. Changer VERSION à chaque mise à jour du contenu.
   Version compatible avec Initium (même origine paulmorris-uni.github.io) : ne touche qu'aux caches commençant par "apc-". */
const PREFIX = "apc-";
const VERSION = PREFIX + "v37";
const FILES = ["./", "index.html", "manifest.json", "cours.js", "data.js", "doctrine.js", "sujets.js", "app.js", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith(PREFIX) && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(VERSION).then(cache => cache.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok && (new URL(e.request.url).origin === location.origin || e.request.url.includes("fonts.g"))) {
      cache.put(e.request, res.clone());
    }
    return res;
  }).catch(() => cache.match("index.html")))));
});
