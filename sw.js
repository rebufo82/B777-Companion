const CACHE="b777-shell-v1";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=>k===CACHE?0:caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin)return;        // model weights (HF CDN) & esm.run pass through
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
    if(resp&&resp.ok){const cp=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}return resp;
  }).catch(()=>caches.match("./index.html"))));});