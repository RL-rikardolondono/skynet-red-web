// SKYNET · guarda la app para abrir rápido. Los datos (/api/) nunca se guardan aquí.
const CACHE='skynet-red-v46';
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/','/manifest.webmanifest','/icono-192.png','/icono-512.png'])));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE&&x!=='skynet-ia').map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.startsWith('/api/')||u.pathname==='/health')return;
 // El revisor de fotos con IA pesa varios MB: se descarga una sola vez y queda guardado
 if(u.pathname.startsWith('/ia/'))return e.respondWith(caches.open('skynet-ia').then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(x=>{if(x.ok)c.put(e.request,x.clone());return x}))));
 e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('/'))))});
// Avisos al celular
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch(x){d={b:e.data&&e.data.text()}}
 e.waitUntil(self.registration.showNotification(d.t||'SKYNET',{body:d.b||'Tienes un aviso nuevo',icon:'/icono-192.png',badge:'/icono-192.png',data:{ir:d.ir||''},tag:'skynet-aviso',renotify:true}))});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if('focus' in c)return c.focus()}return clients.openWindow('/')}))});
