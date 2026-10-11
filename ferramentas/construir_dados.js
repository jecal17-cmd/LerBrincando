/* Gera ../data.js a partir de fonte_dados.js + fonte_palavras.js
   Uso: node ferramentas/construir_dados.js */
const fs = require('fs');
const path = require('path');
const N = require('../nucleo.js');
const F = require('./fonte_dados.js');
const brutas = require('./fonte_palavras.js');

// 1) Ordem de ensino: unidade → índice da fase em que é introduzida
const ordem = {};
F.fases.forEach((f, i) => { f.mundo = Number(f.id.split('.')[0]); (f.novos || []).forEach((t) => { if (ordem[t] === undefined) ordem[t] = i; }); });

// 2) Banco de palavras com campos derivados
const linhas = brutas.trim().split('\n').map((l) => l.trim()).filter(Boolean);
const palavras = linhas.map((l) => {
  const [p, s, e] = l.split(/\s+/);
  const silabas = s.split('-');
  const an = N.analisar(silabas, p);
  let faseMin = -1; let ok = true;
  an.tags.forEach((t) => { if (ordem[t] === undefined) ok = false; else faseMin = Math.max(faseMin, ordem[t]); });
  return {
    p, s: silabas, e, om: N.codigoOpenMoji(e),
    g: an.tags, padrao: N.categoriaPadrao(an),
    faseMin: ok ? faseMin : null,
    mundo: ok ? F.fases[faseMin].mundo : null,
    rima: N.chaveRima(silabas), ini: N.somInicial(silabas, p)
  };
});
const porRima = {};
palavras.forEach((w) => { (porRima[w.rima] = porRima[w.rima] || []).push(w.p); });
palavras.forEach((w) => {
  w.rimas = porRima[w.rima].filter((x) => x !== w.p).slice(0, 8);
  const par = F.pares.find((x) => x.a === w.p || x.b === w.p);
  w.parMinimo = par ? { par: par.par, com: par.a === w.p ? par.b : par.a } : null;
});

const saida = Object.assign({}, F, { palavras, ordemEnsino: ordem, geradoEm: new Date().toISOString() });

// 3) Escrita: data.js (JSON legível; uma palavra por linha)
let json = JSON.stringify(saida, null, 1);
json = json.replace(/\{\n\s+"p": [\s\S]*?\n\s\s\}/g, (m) => m.replace(/\n\s*/g, ' '));
const cab = '/* Ler Brincando — data.js (GERADO por ferramentas/construir_dados.js — edite a fonte e rode o script)\n' +
  '   Banco de palavras, fases, histórias, elogios, falas e regras. Formato JSON para o gerar_audios.py ler. */\n';
fs.writeFileSync(path.join(__dirname, '..', 'data.js'), cab + 'window.DADOS = ' + json + ';\n');
fs.writeFileSync(path.join(__dirname, '..', 'data.json'), JSON.stringify(saida));
const semMundo = palavras.filter((w) => w.mundo === null).map((w) => w.p);
console.log('palavras:', palavras.length, '| fases:', F.fases.length, '| histórias:', F.historias.length);
console.log('por mundo:', JSON.stringify(palavras.reduce((a, w) => { a[w.mundo] = (a[w.mundo] || 0) + 1; return a; }, {})));
if (semMundo.length) console.log('SEM MUNDO (unidade não ensinada):', semMundo.join(', '));
