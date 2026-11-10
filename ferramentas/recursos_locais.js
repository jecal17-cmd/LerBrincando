/* Copia para o projeto as imagens OpenMoji usadas pelo jogo (imagens/) e as fontes Andika e Baloo 2 (fontes/),
   para o site e o app Android funcionarem sem internet.
   Uso:  npm install --no-save openmoji@16.0.0 @fontsource/andika@5.3.0 @fontsource/baloo-2@5.3.0
         node ferramentas/recursos_locais.js [pasta node_modules]
   Rode de novo sempre que acrescentar palavras ou emojis novos. */
const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..');
const NM = path.resolve(process.argv[2] || path.join(RAIZ, 'node_modules'));
const N = require('../nucleo.js');

// 1) todos os emojis que aparecem nos dados e nas telas
const fontes = ['data.js', 'game.js', 'minijogos.js', 'cenas.js', 'visual.js', 'motor.js'].map((f) => fs.readFileSync(path.join(RAIZ, f), 'utf8')).join('\n');
const seg = new Intl.Segmenter('pt', { granularity: 'grapheme' });
const emojis = new Set();
for (const { segment } of seg.segment(fontes)) if (/\p{Extended_Pictographic}|\p{Regional_Indicator}/u.test(segment)) emojis.add(segment);
const destImg = path.join(RAIZ, 'imagens');
fs.mkdirSync(destImg, { recursive: true });
const origem = path.join(NM, 'openmoji', 'color', 'svg');
let copiados = 0; const faltam = [];
for (const e of emojis) {
  const code = N.codigoOpenMoji(e);
  const src = path.join(origem, code + '.svg');
  if (fs.existsSync(src)) { fs.copyFileSync(src, path.join(destImg, code + '.svg')); copiados++; } else faltam.push(e + ' ' + code);
}
fs.writeFileSync(path.join(destImg, 'lista.json'), JSON.stringify(fs.readdirSync(destImg).filter((f) => f.endsWith('.svg')).sort()));
fs.writeFileSync(path.join(destImg, 'LEIA-ME.txt'), 'Imagens OpenMoji 16 (https://openmoji.org), licença CC BY-SA 4.0.\nGeradas por ferramentas/recursos_locais.js — só os emojis usados pelo jogo.\n');

// 2) fontes
const destFonte = path.join(RAIZ, 'fontes');
fs.mkdirSync(destFonte, { recursive: true });
const pesos = [['andika', 'Andika', [400, 700]], ['baloo-2', 'Baloo 2', [500, 700, 800]]];
let css = '/* Fontes locais (SIL Open Font License 1.1) — geradas por ferramentas/recursos_locais.js */\n';
for (const [pac, familia, ps] of pesos) for (const p of ps) {
  const arq = `${pac}-latin-${p}-normal.woff2`;
  fs.copyFileSync(path.join(NM, '@fontsource', pac, 'files', arq), path.join(destFonte, arq));
  css += `@font-face { font-family: '${familia}'; font-style: normal; font-weight: ${p}; font-display: swap; src: url('${arq}') format('woff2'); }\n`;
}
fs.writeFileSync(path.join(destFonte, 'fontes.css'), css);
fs.copyFileSync(path.join(NM, '@fontsource', 'andika', 'LICENSE'), path.join(destFonte, 'OFL-andika.txt'));
fs.copyFileSync(path.join(NM, '@fontsource', 'baloo-2', 'LICENSE'), path.join(destFonte, 'OFL-baloo-2.txt'));
console.log(`Imagens: ${copiados} copiadas de ${emojis.size} emojis.` + (faltam.length ? ` Sem OpenMoji (usam Twemoji/emoji nativo): ${faltam.join(', ')}` : ''));
console.log('Fontes: fontes/fontes.css');
