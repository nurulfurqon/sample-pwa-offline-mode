var cacheName = 'cache-sheetup'
var filesToCache = [
  '/',
  '/index.html',
  '/js/jquery.min.js',
  '/js/app.js',
  '/css/style.css',
  '/images/logo.png',
  '/images/error.png'
]

// install service worker
self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install')
  e.waitUntil(
      caches.open(cacheName).then(function (cache) {
        console.log('[ServiceWorker] Caching app shell')
        return cache.addAll(filesToCache)
      })
  )
})

// activate service worker
self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate')
  e.waitUntil(
      caches.keys().then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== cacheName) {
            console.log('[ServiceWorker] Removing old cache', key)
            return caches.delete(key)
          }
        }))
      })
  )
})

/* self.addEventListener('fetch', function (event) {
  console.log('ServiceWorker Fecth', event.request)
  event.respondWith(
    new Response('<h1>Hello World</h1>', {
      headers: {
        'Content-Type': 'text/html'
      }
    })
  )
}) */

self.addEventListener('fetch', function (e) {
  console.log('[ServiceWorker] Fetch', e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request)
    })
  )
})

// shell application from cache
/* self.addEventListener('fetch', function (e) {
  console.log('[ServiceWorker] Fetch', e.request.url)
  var dataUrl = 'https://jsonplaceholder.typicode.com/posts'
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      caches.open(dataCacheName).then(function (cache) {
        return fetch(e.request).then(function (response) {
          cache.put(e.request.url, response.clone())
          return response
        })
      })
    )
  } else {
    e.respondWith(
      caches.match(e.request).then(function (response) {
        return response || fetch(e.request)
      })
    )
  }
}) */
