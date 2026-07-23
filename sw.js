/* Service Worker - לדעת עוד
   חשוב: בכל עדכון תוכן משמעותי למשחק (שאלות חדשות, קלפים חדשים, תיקוני עיצוב)
   יש להעלות את מספר הגרסה כאן (CACHE_NAME) כדי שהמשתמשים יקבלו את הגרסה החדשה. */
const CACHE_NAME = 'ladat-od-cache-v28';

const ASSETS = [
  './',
  './ladat-od.html',
  './manifest.json',
  './tando-logo.png',
  './ladat-od.jpg',
  './token-car.png',
  './token-icecream.png',
  './token-flowers.png',
  './token-boat.png',
  './token-protection.png',
  './token-smile.png',
  './token-animal.png',
  './token-rocket.png',
  './splash-main.jpg',
  './past.jpg',
  './present.jpg',
  './future.jpg',
  './task.jpg',
  './joker.jpg',
  './free_choice.jpg',
  './past_dice.jpg',
  './present_dice.jpg',
  './future_dice.jpg',
  './task_dice.jpg',
  './joker_dice.jpg',
  './free_choice_dice.jpg',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* stale-while-revalidate: מגיש מיד מהמטמון (כולל אופליין), ומרענן ברקע מהרשת */
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
