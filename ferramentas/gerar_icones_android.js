/* Gera os ícones e a tela de abertura do app Android a partir de icones/icone.svg (a corujinha Lili).
   ATENÇÃO: desde a v1.3.1 o ícone do app vem da arte icones/arte-icone.png, gerada com
   python ferramentas/gerar_icones_arte.py icones/arte-icone.png android/app/src/main/res --cor '#7FD6F5' --web icones/icone-192.png icones/icone-512.png --loja loja/icone-512.png
   Enquanto essa arte existir, este script só gera a imagem de destaque da loja (loja/destaque-1024x500.png).
   Também gera as imagens da loja: ícone 512×512 e imagem de destaque 1024×500 (loja/).
   Uso: node ferramentas/gerar_icones_android.js   (precisa do Playwright com Chromium) */
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const RAIZ = path.join(__dirname, '..');
const RES = path.join(RAIZ, 'android', 'app', 'src', 'main', 'res');
const svg = fs.readFileSync(path.join(RAIZ, 'icones', 'icone.svg'), 'utf8');
const corpo = svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const defs = (corpo.match(/<defs>[\s\S]*?<\/defs>/) || [''])[0];
const coruja = corpo.replace(defs, '').replace(/<rect[^>]*\/>/, ''); // sem o fundo
const FUNDO = '#7fd6f5';
const lado = (s, conteudo, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="${s}" height="${s}">${defs}${extra}${conteudo}</svg>`;
const centro = (esc) => `<g transform="translate(60 60) scale(${esc}) translate(-60 -64)">${coruja}</g>`;
const DENS = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };

(async () => {
  const b = await chromium.launch(); const pg = await b.newPage();
  const png = async (html, w, h, arq) => {
    await pg.setViewportSize({ width: w, height: h });
    await pg.setContent(`<html><body style="margin:0;background:transparent">${html}</body></html>`);
    fs.mkdirSync(path.dirname(arq), { recursive: true });
    await pg.screenshot({ path: arq, omitBackground: true, clip: { x: 0, y: 0, width: w, height: h } });
  };
  const ARTE = fs.existsSync(path.join(RAIZ, 'icones', 'arte-icone.png'));
  if (!ARTE) for (const [d, k] of Object.entries(DENS)) {
    const dir = path.join(RES, 'mipmap-' + d);
    await png(lado(108 * k, centro(0.75)), 108 * k, 108 * k, path.join(dir, 'ic_launcher_foreground.png'));
    await png(lado(48 * k, `<rect width="120" height="120" rx="26" fill="url(#f)"/>` + centro(0.95)), 48 * k, 48 * k, path.join(dir, 'ic_launcher.png'));
    await png(lado(48 * k, `<circle cx="60" cy="60" r="60" fill="url(#f)"/>` + centro(0.85)), 48 * k, 48 * k, path.join(dir, 'ic_launcher_round.png'));
  }
  // tela de abertura: coruja no centro sobre o azul do jogo, em todos os tamanhos que o modelo do Capacitor usa
  if (!ARTE) for (const arq of fs.readdirSync(RES).filter((x) => x.startsWith('drawable')).map((x) => path.join(RES, x, 'splash.png')).filter(fs.existsSync)) {
    const { w, h } = await pg.evaluate(async (src) => { const i = new Image(); i.src = src; await i.decode(); return { w: i.naturalWidth, h: i.naturalHeight }; }, 'data:image/png;base64,' + fs.readFileSync(arq).toString('base64'));
    const s = Math.round(Math.min(w, h) * 0.42);
    await png(`<div style="width:${w}px;height:${h}px;background:${FUNDO};display:grid;place-items:center">${lado(s, centro(1))}</div>`, w, h, arq);
  }
  // loja (Google Play): ícone 512×512 sem transparência e imagem de destaque 1024×500
  const LOJA = path.join(RAIZ, 'loja'); fs.mkdirSync(LOJA, { recursive: true });
  if (!ARTE) await png(lado(512, `<rect width="120" height="120" fill="url(#f)"/>` + centro(0.95)), 512, 512, path.join(LOJA, 'icone-512.png'));
  const destaque = `<div style="width:1024px;height:500px;background:linear-gradient(180deg,#8fdcff,#5b8cff);display:flex;align-items:center;gap:36px;padding:0 60px;box-sizing:border-box;font-family:'Baloo 2',sans-serif;color:#fff">
    ${lado(300, centro(1.1))}
    <div><div style="font-size:96px;font-weight:800;line-height:1;white-space:nowrap;text-shadow:0 6px 0 rgba(0,0,0,.15)">Ler Brincando</div>
    <div style="font-size:34px;font-weight:700;margin-top:14px;line-height:1.25">Aprender a ler pelo som das letras<br>para crianças de 5 a 7 anos</div></div></div>`;
  const fonte = (p) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(RAIZ, 'fontes', `baloo-2-latin-${p}-normal.woff2`)).toString('base64');
  await pg.setContent(`<html><head><style>@font-face{font-family:'Baloo 2';font-weight:800;src:url('${fonte(800)}')}@font-face{font-family:'Baloo 2';font-weight:700;src:url('${fonte(700)}')}</style></head><body style="margin:0">${destaque}</body></html>`);
  await pg.setViewportSize({ width: 1024, height: 500 }); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(200);
  await pg.screenshot({ path: path.join(LOJA, 'destaque-1024x500.png') });
  await b.close();
  if (!ARTE) fs.writeFileSync(path.join(RES, 'values', 'ic_launcher_background.xml'), `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">${FUNDO.toUpperCase()}</color>\n</resources>\n`);
  console.log('Ícones, tela de abertura e imagens da loja gerados.');
})();
