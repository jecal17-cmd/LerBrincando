/* Ler Brincando — Service Worker: funciona offline após o primeiro acesso (PWA) */
const VERSAO = 'lb-v1.1.0';
const NUCLEO = ['./', 'index.html', 'styles.css', 'nucleo.js', 'data.js', 'motor.js', 'validadores.js', 'game.js', 'minijogos.js', 'cenas.js', 'visual.js',
  'manifest.webmanifest', 'icones/icone.svg', 'icones/icone-192.png', 'icones/icone-512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSAO);
    await c.addAll(NUCLEO);
    // Banco de Áudio: se existir, guarda o manifest e todos os arquivos
    try {
      const r = await fetch('audio/manifest.json', { cache: 'no-cache' });
      if (r.ok) {
        const m = await r.clone().json(); await c.put('audio/manifest.json', r); await c.add('audio/manifest.js').catch(() => {});
        const arqs = Object.values(m.itens || {}).map((x) => 'audio/' + x.arquivo);
        for (let i = 0; i < arqs.length; i += 40) await Promise.all(arqs.slice(i, i + 40).map((u) => c.add(u).catch(() => {})));
      }
    } catch (err) { /* sem banco: o jogo usa a voz do navegador */ }
    self.skipWaiting();
  })());
});
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => { for (const k of await caches.keys()) if (k !== VERSAO) await caches.delete(k); await self.clients.claim(); })());
});
// Cache primeiro para o app e o áudio; "stale-while-revalidate" para CDN (OpenMoji, fontes)
self.addEventListener('fetch', (e) => {
  const req = e.request; if (req.method !== 'GET') return;
  e.respondWith((async () => {
    const c = await caches.open(VERSAO);
    const em = await c.match(req, { ignoreSearch: req.mode === 'navigate' });
    const rede = fetch(req).then((r) => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()).catch(() => {}); return r; }).catch(() => null);
    if (em) { if (!req.url.includes('/audio/')) e.waitUntil(rede); return em; }
    const r = await rede; if (r) return r;
    if (req.mode === 'navigate') return c.match('index.html');
    return new Response('', { status: 504 });
  })());
});
