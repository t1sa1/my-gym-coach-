const CACHE="mgc-v46";
const ASSETS=["./","./index.html","./styles.css","./app.js","./anatomy3d.js","./manifest.webmanifest"];
self.addEventListener("install",event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  const url=new URL(event.request.url);
  const isAppFile=url.origin===self.location.origin && (url.pathname.endsWith("/app.js")||url.pathname.endsWith("/index.html")||url.pathname.endsWith("/styles.css")||url.pathname.endsWith("/"));
  if(isAppFile){
    event.respondWith(fetch(event.request).then(response=>{
      if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
      return response;
    }).catch(()=>caches.match(event.request).then(cached=>cached||Response.error())));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});