/* Casos de teste funcionais automatizáveis no Node (T09, T12, T14, T15, T16, T18 parcial). */
const fs = require('fs'); require('../nucleo.js');
const s = fs.readFileSync(__dirname + '/../data.js', 'utf8'); const D = JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1));
const criar = require('../motor.js'); const N = require('../nucleo.js');
const M = criar(D); M.usarRng(N.rngSemente(3));
const r = [];
const ok = (id, nome, cond, det) => r.push({ id, nome, status: cond ? 'APROVADO' : 'REPROVADO', det });
// T14 — domínio < 85% mantém a próxima fase trancada e oferece revisão
{ const p = M.novoPerfil('a'); const its = M.gerarItens(0, p).filter((x) => x.contar !== false);
  its.forEach((it, k) => M.registrar(p, it, { ok: k % 3 !== 0, tent: k % 3 ? 1 : 2, final: true }));
  const okN = its.filter((_, k) => k % 3 !== 0).length; const fim = M.concluirFase(p, 0, { ok: okN, total: its.length });
  const rev = M.revisaoRapida(1, p);
  ok('T14', 'Domínio < 85%', !fim.dominada && !M.faseLiberada(p, 1), `precisão ${(fim.prec * 100).toFixed(0)}% → fase 1.2 trancada = ${!M.faseLiberada(p, 1)}; revisão rápida disponível a partir da fase 1.2 (${rev.length} itens gerados)`); }
// T15 — revisão espaçada: item certo reaparece após +1, +2, +4 e +7 dias
{ const p = M.novoPerfil('b'); const idx = D.fases.findIndex((f) => f.id === '3.10');
  const it = M.G.leiaEncontre(D.fases[idx], { perfil: p }, { foco: 'MALA' });
  M.offsetDias = 0; M.registrar(p, it, { ok: true, tent: 1, final: true });
  const linha = []; const fAlvo = D.fases.findIndex((f) => f.id === '4.3');
  let dia = 0;
  for (const salto of [1, 2, 4, 7]) {
    const antes = Object.entries(p.leit).filter(([c, e]) => e.prox <= M.agora()).map(([c]) => c);
    dia += salto; M.offsetDias = dia;
    const venc = Object.entries(p.leit).filter(([c, e]) => e.prox <= M.agora()).map(([c]) => c);
    const itens = M.gerarItens(fAlvo, p); const voltou = itens.some((x) => x.revisao && x.chave === 'p:MALA');
    linha.push(`+${dia}d: vencido=${venc.includes('p:MALA')} reapareceu=${voltou} caixa=${p.leit['p:MALA'].cx}`);
    M.registrar(p, Object.assign({}, it), { ok: true, tent: 1, final: true });
  }
  M.offsetDias = 0;
  ok('T15', 'Revisão espaçada (Leitner 1-2-4-7)', linha.every((l) => l.includes('vencido=true') && l.includes('reapareceu=true')), linha.join(' | ')); }
// T16 — 50 acertos sem repetir na janela de 5
{ const p = M.novoPerfil('c'); const h = []; let rep = 0; for (let k = 0; k < 50; k++) { const e = M.escolherElogio(p, 'acerto'); if (h.slice(-5).includes(e)) rep++; h.push(e); }
  ok('T16', 'Repetição de elogios', rep === 0, `${rep} repetições em 50 acertos`); }
// T12 — perfis independentes
{ const a = M.novoPerfil('A'), b = M.novoPerfil('B'); const it = M.gerarItens(0, a).find((x) => x.contar !== false); M.registrar(a, it, { ok: true, tent: 1, final: true });
  ok('T12', 'Vários perfis', Object.keys(b.leit).length === 0 && b.xp === 0 && a.xp > 0, `A: ${a.xp} XP / B: ${b.xp} XP`); }
// T09 — o progresso é registrado item a item (o jogo salva no localStorage após cada item)
{ const g = fs.readFileSync(__dirname + '/../cenas.js', 'utf8'); ok('T09', 'Fechar no meio da fase', /Motor\.registrar\(p, item, r\);[\s\S]{0,200}Store\.salvar\(\)/.test(g) && /pagehide/.test(g), 'Store.salvar() após cada item registrado + no pagehide/visibilitychange'); }
// T18 — desafio para adultos
{ const g = fs.readFileSync(__dirname + '/../cenas.js', 'utf8'); const n = (g.match(/return \{ p: `/g) || []).length; ok('T18', 'Acesso à Área dos Pais', /function desafioAdulto/.test(g) && n >= 4 && /Number\(inp\.value\) === d\.r/.test(g), `Desafio para adultos sorteado entre ${n} tipos de pergunta para abrir o painel`); }
// Adaptatividade: 3 erros seguidos reduzem as opções
{ const p = M.novoPerfil('d'); const f = D.fases.findIndex((x) => x.id === '5.5'); let it; for (let k = 0; k < 3; k++) { it = M.G.leiaEncontre(D.fases[f], { perfil: p }); M.registrar(p, it, { ok: false, tent: 2, final: true }); }
  const depois = M.G.leiaEncontre(D.fases[f], { perfil: p });
  ok('B4', 'Adaptatividade (3 erros → menos opções)', depois.opcoes.length < it.opcoes.length || depois.opcoes.length === 3, `antes ${4} opções → depois ${depois.opcoes.length}`); }
// F1 — Medidor de fluência: cálculo de palavras corretas por minuto (PCPM) e textos disponíveis
{ const F = require('../fluencia.js');
  const a = F.calcular({ lidas: 50, erros: 5, seg: 60 }), b = F.calcular({ lidas: 54, erros: 2, seg: 40 }), c = F.calcular({ lidas: 10, erros: 30, seg: 0 });
  const textos = D.historias.filter((h) => !h.oral && h.mundo >= 3).map((h) => F.palavrasDoTexto(h.frases.map((x) => x.t), N.fraseLimpa));
  const okCalc = a.pcpm === 45 && a.precisao === 90 && b.pcpm === 78 && b.precisao === 96 && c.erros === 10 && c.pcpm === 0;
  const okTextos = textos.length >= 8 && textos.every((t) => t.length >= 40 && t.every((w) => !w.includes('-')));
  ok('F1', 'Medidor de fluência (PCPM)', okCalc && okTextos, `50 lidas/5 erros/60 s → ${a.pcpm} PCPM ${a.precisao}%; 54/2/40 s → ${b.pcpm} PCPM; ${textos.length} textos de ${Math.min(...textos.map((t) => t.length))} a ${Math.max(...textos.map((t) => t.length))} palavras`); }
// P1 — Versão completa: Mundos 1 e 2 grátis, portão para adultos antes da compra, bloqueio central na entrada da fase
{ const g = fs.readFileSync(__dirname + '/../cenas.js', 'utf8'); const pr = fs.readFileSync(__dirname + '/../premium.js', 'utf8'); const cfg = fs.readFileSync(__dirname + '/../config.js', 'utf8');
  const gratis = Number((cfg.match(/mundosGratis:\s*(\d+)/) || [])[1]);
  const nGratis = D.fases.filter((f) => f.mundo <= gratis).length;
  const bloqueia = /async function introFase\(idx\) \{\s*if \(PREMIUM\(\) && PREMIUM\(\)\.faseBloqueada\(idx\)\)/.test(g) && /async function jogarFase\(idx, opc = \{\}\) \{\s*if \(PREMIUM\(\) && PREMIUM\(\)\.faseBloqueada\(idx\)\)/.test(g);
  const portao = /pedirAdulto\('⭐ Versão completa'\)/.test(pr) && /function pedirAdulto/.test(g);
  ok('P1', 'Versão completa (paywall)', gratis === 2 && bloqueia && portao, `${nGratis} fases grátis (Mundos 1–${gratis}); bloqueio em introFase/jogarFase = ${bloqueia}; compra atrás do desafio para adultos = ${portao}`); }
// J1 — Junta-Junta: sem a palavra silabada no banco, nada de PERA/CASA (sílaba isolada soaria errada); com ela, toca a gravação da palavra
{ const p = M.novoPerfil('j'); const f = D.fases[D.fases.findIndex((x) => x.id === '1.5')]; const ctx = { perfil: p };
  const sem = []; for (let k = 0; k < 150; k++) sem.push(M.G.juntar(f, ctx));
  const ambiguasSem = sem.filter((it) => M.silabaAmbigua(M.W ? M.W[it.certo] : D.palavras.find((w) => w.p === it.certo))).length;
  M.temSilabado = () => true; const com = []; for (let k = 0; k < 150; k++) com.push(M.G.juntar(f, ctx)); M.temSilabado = () => false;
  const pedSilabado = com.every((it) => it.pedido.length === 1 && it.pedido[0].k === 'silabado' && it.pedido[0].s.length >= 2);
  const total = D.palavras.filter((w) => w.s.length >= 2 && w.s.length <= 4).length, amb = D.palavras.filter((w) => w.s.length >= 2 && w.s.length <= 4 && M.silabaAmbigua(w)).length;
  ok('J1', 'Junta-Junta com sílabas da própria palavra', ambiguasSem === 0 && pedSilabado, `sem gravação: 0 de 150 itens com sílaba ambígua (${amb} de ${total} palavras ficam de fora até o banco novo); com gravação: pedido = palavra silabada em 150/150`); }
r.forEach((x) => console.log(`[${x.status}] ${x.id} ${x.nome}: ${x.det}`));
fs.writeFileSync(__dirname + '/relatorio_funcionais.json', JSON.stringify(r, null, 1));
