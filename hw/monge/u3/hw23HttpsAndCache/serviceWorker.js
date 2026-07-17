const CACHE_NAME = 'universities-cache';

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return fetch(event.request)
                .then(networkResponse => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                })
                .catch(() => caches.match(event.request));
        })
    );
});