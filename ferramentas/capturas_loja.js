/* Capturas de tela para a página da Google Play (loja/capturas/). Uso: node ferramentas/capturas_loja.js
   Celular 1080×1920 e tablet 10" 1600×2560 (proporção 9:16 / 10:16, como a Play pede). */
const fs = require('fs'); const path = require('path'); const http = require('http');
const { chromium } = require('playwright');
const RAIZ = path.join(__dirname, '..'); const OUT = path.join(RAIZ, 'loja', 'capturas'); fs.mkdirSync(OUT, { recursive: true });
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html'; const f = path.join(RAIZ, p); if (!f.startsWith(RAIZ) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': TIPOS[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }).listen(8920);
const APARELHOS = { celular: { viewport: { width: 360, height: 640 }, deviceScaleFactor: 3 }, tablet: { viewport: { width: 800, height: 1280 }, deviceScaleFactor: 2 } };
(async () => {
  const b = await chromium.launch();
  for (const [nome, ap] of Object.entries(APARELHOS)) {
    const ctx = await b.newContext({ ...ap, reducedMotion: 'reduce', isMobile: true, hasTouch: true });
    const pg = await ctx.newPage();
    await pg.addInitScript(() => {
      const ss = window.speechSynthesis; if (ss) { ss.speak = (u) => setTimeout(() => { u.onend && u.onend({}); }, 5); ss.cancel = () => {}; ss.getVoices = () => []; }
      HTMLMediaElement.prototype.play = function () { setTimeout(() => this.dispatchEvent(new Event('ended')), 5); return Promise.resolve(); };
      try { window.AudioContext.prototype.decodeAudioData = function () { return Promise.reject(new Error('sem som nas capturas')); }; } catch (e) { /* */ }
    });
    const shot = async (n) => { await pg.waitForTimeout(900); await pg.screenshot({ path: path.join(OUT, `${nome}-${n}.png`) }); };
    await pg.goto('http://127.0.0.1:8920/index.html'); await pg.waitForTimeout(800);
    await shot('1-inicio');
    // perfis de exemplo, com algumas fases feitas
    await pg.evaluate(() => {
      const L = window.LB; const D = L.D; const av = ['🦊', '🐼', '🐸'];
      ['Ana', 'Theo', 'Lia'].forEach((x, i) => { const p = L.Motor.novoPerfil(x, av[i]); p.avaliacao = { pulada: true, mundoInicial: 1, blocos: [] }; L.Store.dados.perfis.push(p); });
      const p = L.Store.dados.perfis[0]; p.moedas = 140; p.xp = 620;
      for (let d = 0; d < 14; d++) { const dt = new Date(Date.now() - d * 864e5); const k = new Date(L.Motor.agora() - d * 864e5).toISOString().slice(0, 10); if (d % 4 !== 3) p.tempo[k] = (8 + ((d * 7) % 13)) * 60; }
      D.fases.filter((f) => f.mundo <= 2 || (f.mundo === 3 && Number(f.id.split('.')[1]) <= 5)).forEach((f) => { p.fases[f.id] = { estrelas: 3, dominada: true, melhor: 1, vezes: 1 }; });
      L.Store.salvar();
    });
    await pg.click('#comecar'); await pg.waitForTimeout(1500);
    await shot('2-perfis');
    await pg.click('[aria-label="perfil Ana"]'); await pg.waitForTimeout(1200);
    await shot('3-mapa');
    for (const [id, n] of [['3.10', '4-leia-e-encontre'], ['5.3', '5-trem-das-silabas'], ['4.11', '6-historia']]) {
      await pg.evaluate((id) => { const i = window.LB.D.fases.findIndex((f) => f.id === id); window.Cenas.jogarFase(i); }, id);
      await pg.waitForTimeout(id === '4.11' ? 5000 : 3500);
      await shot(n);
    }
    await pg.evaluate(() => window.Cenas.painelPais('progresso')); await shot('7-area-dos-pais');
    await ctx.close();
  }
  await b.close(); srv.close();
  console.log('Capturas em loja/capturas/');
})();
