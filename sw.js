/*
 * Service worker: la calculadora no necesita red, así que todo el "app shell"
 * se precachea en la instalación y se sirve cache-first.
 *
 * Para publicar una versión nueva: subí CACHE_VERSION. El SW nuevo se instala,
 * descarta las cachés viejas al activarse y toma el control de las pestañas abiertas.
 */
const CACHE_VERSION = 'v3';
const CACHE_NAME = `dnd-attack-${CACHE_VERSION}`;

const APP_SHELL = [
    './',
    './index.html',
    './styles.css',
    './engine.js',
    './profiles-io.js',
    './calculator.js',
    './manifest.webmanifest',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-maskable-512.png',
    './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(k => k.startsWith('dnd-attack-') && k !== CACHE_NAME).map(k => caches.delete(k))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return; // sólo recursos propios

    event.respondWith(
        caches.match(request, { ignoreSearch: true }).then(cached => {
            if (cached) return cached;
            return fetch(request)
                .then(response => {
                    // Guardar lo que falte (p. ej. un recurso nuevo no listado)
                    if (response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
                    }
                    return response;
                })
                .catch(() => {
                    // Sin red y sin caché: para navegaciones, devolver la app
                    if (request.mode === 'navigate') return caches.match('./index.html');
                    return Response.error();
                });
        })
    );
});
