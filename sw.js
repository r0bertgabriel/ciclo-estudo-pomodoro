/**
 * Service Worker para PWA
 */

const CACHE_NAME = 'pomodoro-v1';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './js/app.js',
    './js/config.js',
    './js/storage.js',
    './js/timer.js',
    './js/ui.js',
    './js/notifications.js',
    './manifest.json'
];

// Instalação
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

// Ativação
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});
