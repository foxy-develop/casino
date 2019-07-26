'use strict';

const ver = 'v1:';
const dynamicCache = "v1:dynamic";
const staticContent = [
  "",
  "img/favicon/favicon-16x16.png",
  "img/favicon/favicon-32x32.png",
  "img/favicon/favicon-96x96.png",
  "img/favicon/favicon.ico",
  "img/favicon/android-icon-36x36.png",
  "img/favicon/android-icon-48x48.png",
  "img/favicon/android-icon-72x72.png",
  "img/favicon/android-icon-96x96.png",
  "img/favicon/android-icon-144x144.png",
  "img/favicon/android-icon-192x192.png",
  "img/favicon/apple-icon-57x57.png",
  "img/favicon/apple-icon-60x60.png",
  "img/favicon/apple-icon-72x72.png",
  "img/favicon/apple-icon-76x76.png",
  "img/favicon/apple-icon-114x114.png",
  "img/favicon/apple-icon-152x152.png",
  "img/favicon/apple-icon-180x180.png",
  "img/favicon/apple-icon-precomposed.png",
  "img/favicon/ms-icon-70x70.png",
  "img/favicon/ms-icon-144x144.png",
  "img/favicon/ms-icon-150x150.png",
  "img/favicon/ms-icon-310x310.png",
  "css/main.min.css",
  "css/main.min.css.map",
  "js/main.min.js",
  "js/main.min.js.map"
];

self.addEventListener('install', event => 
  event
    .waitUntil(caches.open(ver + 'SmartApp')
    .then(cache => cache.addAll(staticContent)))
)

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.url.indexOf("browser-sync") > -1 || req.method !== "GET") {
    return;
  }
  if (req.url.startsWith("https://maps.googleapis.com")) {
   event.respondWith(
     caches.open(dynamicCache).then(cache => 
        fetch(req)
         .then((response) => {
           cache.put(req, response.clone());
           return response;
        })
    ));
  }
  event.respondWith(
    caches.match(req)
      .then(cached=> {
        const fetched = response => {
          let cacheCopy = response.clone();
          caches.open(ver + "pages").then(cache => cache.put(req, cacheCopy));
          return response;
        }
        const unavailable = () => 
          new Response("<h1>Service Unavailable</h1>", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({
              "Content-Type": "text/html"
            })
          })
        const networked = fetch(req)
          .then(fetched, unavailable)
          .catch(unavailable);

        return cached || networked;
      })
  )
})
self.addEventListener('activate', event => 
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys
      .filter(key => !key.startsWith(ver))
      .map(key => caches.delete(key))
  ))
));
