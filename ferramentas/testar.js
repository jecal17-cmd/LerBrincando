/* Roda os validadores V1–V12 no Node e grava o relatório.  Uso: node ferramentas/testar.js [manifest.json] */
const fs = require('fs'); const path = require('path');
global.window = undefined;
const N = require('../nucleo.js');
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

// Figuras: toda palavra precisa ter a figura própria (o jogo não usa mais OpenMoji).
// Emojis das histórias e frases sem figura própria aparecem como emoji do aparelho (só aviso).
{
  const RAIZ = path.join(__dirname, '..');
  const ok = (rel) => fs.existsSync(path.join(RAIZ, rel));
  const semFig = D.palavras.filter((w) => !ok('figuras/palavras/' + w.cod + '.webp')).map((w) => w.p + ' ' + w.e);
  const cenaSrc = fs.readFileSync(path.join(RAIZ, 'figuras.js'), 'utf8');
  const lista = (nome) => ((cenaSrc.match(new RegExp('const ' + nome + ' = \\[([\\s\\S]*?)\\];')) || [])[1] || '').match(/'[0-9A-F-]+'/g) || [];
  const cenas = new Set(lista('CENAS').map((x) => x.slice(1, -1)));
  const palavras = new Set(lista('PALAVRAS').map((x) => x.slice(1, -1)));
  const so = new Set(lista('SO_PALAVRA').map((x) => x.slice(1, -1)));
  const apelidos = new Set(((cenaSrc.match(/const APELIDO = \{([^}]*)\}/) || [])[1] || '').match(/'[0-9A-F-]+'(?=:)/g)?.map((x) => x.slice(1, -1)) || []);
  const faltaArquivoCena = [...cenas].filter((c) => !ok('figuras/cenas/' + c + '.webp'));
  const usados = new Set();
  const juntar = (txt) => N.separarEmojis(txt || '').forEach((e) => usados.add(e));
  D.frases.forEach((f) => { juntar(f.img); (f.d || []).forEach(juntar); });
  D.historias.forEach((h) => { juntar(h.cena.fundo); h.frases.forEach((x) => juntar(x.img)); (h.perguntas || []).forEach((p) => (p.op || []).forEach(juntar)); });
  const semCena = [...usados].filter((e) => { const c = N.codigoEmoji(e); return !cenas.has(c) && !apelidos.has(c) && !(palavras.has(c) && !so.has(c)); });
  console.log(`\n[${semFig.length || faltaArquivoCena.length ? 'REPROVADO' : 'APROVADO'}] FIG Figuras próprias — ${D.palavras.length - semFig.length}/${D.palavras.length} palavras com figura; ${cenas.size} figuras de cena`);
  semFig.concat(faltaArquivoCena.map((c) => 'sem arquivo figuras/cenas/' + c + '.webp')).forEach((d) => console.log('   · ' + d));
  if (semCena.length) console.log(`   aviso: ${semCena.length} emojis de histórias/frases ainda sem figura própria (aparecem como emoji do aparelho): ${semCena.join(' ')}`);
  if (semFig.length || faltaArquivoCena.length) process.exitCode = 1;
}
