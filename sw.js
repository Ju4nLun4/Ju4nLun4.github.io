// sw.js

// Nombres de los cachés
const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
    '/', // Página principal
    '/index.html', // Si tienes archivos específicos que quieres cachear
    '/styles.css', // Tu archivo CSS
    '/script.js', // Tu archivo JS
    '/imagen_escuela.jpg', // Cualquier imagen que se necesite offline
    '/icon-192x192.png', // Icono de tu PWA
    '/icon-512x512.png', // Otro icono de la PWA
];

// Instalación del Service Worker y caching de archivos
self.addEventListener('install', (event) => {
    console.log('Service Worker instalado');
    // Durante la instalación, cacheamos los recursos
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Archivos cacheados');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activación del Service Worker y limpieza de cachés viejos
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName); // Limpiar cachés antiguos
                    }
                })
            );
        })
    );
    console.log('Service Worker activado');
});

// Responder a las solicitudes con los archivos en caché
self.addEventListener('fetch', (event) => {
    console.log('Fetch interceptado para:', event.request.url);
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Si se encuentra una respuesta en caché, devolverla
            if (cachedResponse) {
                return cachedResponse;
            }
            // Si no, hacer una solicitud de red
            return fetch(event.request);
        })
    );
});
