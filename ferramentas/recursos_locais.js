/* Recursos locais do jogo, para o site e o app Android funcionarem sem internet:
   1) refaz figuras/lista.json (todas as figuras próprias, que o service worker guarda offline);
   2) copia as fontes Andika e Baloo 2 para fontes/ (só quando o node_modules tem os pacotes).
   Uso:  node ferramentas/recursos_locais.js                       (só a lista de figuras)
         npm install --no-save @fontsource/andika@5.3.0 @fontsource/baloo-2@5.3.0
         node ferramentas/recursos_locais.js [pasta node_modules]    (lista + fontes)
   Rode de novo sempre que acrescentar figuras. O jogo não usa mais OpenMoji. */
const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..');
const NM = path.resolve(process.argv[2] || path.join(RAIZ, 'node_modules'));

// 1) lista de figuras
const FIG = path.join(RAIZ, 'figuras');
const figs = [];
for (const d of fs.readdirSync(FIG, { withFileTypes: true })) {
  if (d.isDirectory()) for (const f of fs.readdirSync(path.join(FIG, d.name))) if (f.endsWith('.webp')) figs.push(d.name + '/' + f);
}
figs.sort();
fs.writeFileSync(path.join(FIG, 'lista.json'), JSON.stringify(figs).replace(/","/g, '", "') + '\n');
console.log(`Figuras: ${figs.length} em figuras/lista.json`);

// 2) fontes
if (!fs.existsSync(path.join(NM, '@fontsource', 'andika'))) { console.log('Fontes: pacotes @fontsource não instalados, fontes/ mantida como está.'); process.exit(0); }
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
console.log('Fontes: fontes/fontes.css');
