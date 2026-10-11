/* Roda os validadores V1–V12 no Node e grava o relatório.  Uso: node ferramentas/testar.js [manifest.json] */
const fs = require('fs'); const path = require('path');
global.window = undefined;
require('../nucleo.js');
const src = fs.readFileSync(path.join(__dirname, '..', 'data.js'), 'utf8');
const D = JSON.parse(src.slice(src.indexOf('{'), src.lastIndexOf('}') + 1));
const criarMotor = require('../motor.js');
const V = require('../validadores.js');
let manifest = null;
const mp = process.argv[2] || path.join(__dirname, '..', 'audio', 'manifest.json');
if (fs.existsSync(mp)) manifest = JSON.parse(fs.readFileSync(mp, 'utf8'));
const t0 = Date.now();
const r = V.rodar(D, criarMotor, { manifest, seeds: 4 });
console.log('RESULTADO GERAL:', r.geral, `(${Date.now() - t0} ms)`);
r.relatorio.forEach((x) => {
  console.log(`\n[${x.status}] ${x.id} ${x.nome}${x.resumo ? ' — ' + x.resumo : ''}`);
  x.detalhes.slice(0, 15).forEach((d) => console.log('   · ' + d));
  if (x.detalhes.length > 15) console.log(`   … +${x.detalhes.length - 15}`);
  if (x.tabela) x.tabela.forEach((t) => console.log(`   ${t.id} M${t.mundo} ${t.titulo}: ${t.pct === null ? t.obs : (t.pct * 100).toFixed(1) + '% (' + t.palavras + ' palavras; exceções: ' + (t.exc.join(', ') || '—') + ')'}`));
});
fs.writeFileSync(path.join(__dirname, 'relatorio_validadores.json'), JSON.stringify({ geral: r.geral, data: r.data, relatorio: r.relatorio }, null, 1));
