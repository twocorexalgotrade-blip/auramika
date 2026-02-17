const CACHE_NAME = 'swarna-setu-mobile-v2';
const ASSETS_TO_CACHE = [
    '/mobile/',
    '/mobile/index.html',
    '/mobile/styles.css',
    '/mobile/script.js',
    '/mobile/ar-styles.css',
    '/mobile/assets/f1.webp',
    '/mobile/assets/f2.webp',
    '/mobile/assets/f3.webp',
    '/mobile/assets/f4.webp',
    '/mobile/assets/f5.webp',
    '/mobile/assets/f6.webp',
    '/mobile/assets/7.webp',
    '/mobile/assets/8.webp',
    '/mobile/assets/9.webp',
    'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=Cormorant+Garamond:wght@300;400;500;600&family=Lato:wght@300;400;700&family=Montserrat:wght@300;400;500&display=swap'
];

// Install Event - Pre-cache critical assets
self.addEventListener('install', (event) => {
    console.log('👷 Service Worker: Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('📦 Service Worker: Caching Files');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('👷 Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('🧹 Service Worker: Clearing Old Cache', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch Event - Serve from Cache, then Network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests regarding MediaPipe or APIs for now to avoid CORS issues in simple implementation
    if (event.request.url.startsWith('http') && !event.request.url.includes(self.location.origin) && !event.request.url.includes('fonts.')) {
        return;
    }

    // API calls should not be cached by SW default strategy (or specific strategy needed)
    if (event.request.url.includes('/api/')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response; // Return cached response
            }
            return fetch(event.request).then((networkResponse) => {
                // Optional: Cache new requests dynamically? 
                // For now, let's keep it simple and only cache what we defined + rely on browser cache for others.
                return networkResponse;
            });
        })
    );
});
