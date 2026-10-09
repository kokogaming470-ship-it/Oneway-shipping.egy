/* OneWay v.19.3 beta - keeps the site opening when the ISP resets the connection */
const C='oneway-v193b';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.add(new Request('/',{cache:'reload'}))).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET'||r.mode!=='navigate'||new URL(r.url).origin!==location.origin)return;
 e.respondWith((async()=>{
  const c=await caches.open(C);
  try{
   const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),6000);
   const n=await fetch(r,{signal:ctl.signal,cache:'no-store'});clearTimeout(t);
   if(n&&n.ok)c.put('/',n.clone());
   return n;
  }catch(err){
   const m=await c.match('/');
   if(m)return m;
   throw err;
  }
 })());
});
