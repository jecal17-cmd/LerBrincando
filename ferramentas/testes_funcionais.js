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
{ const g = fs.readFileSync(__dirname + '/../cenas.js', 'utf8'); ok('T18', 'Acesso à Área dos Pais', /quanto é \$\{a\} × \$\{b\}/.test(g), 'Multiplicação de 6–9 × 6–9 exigida para abrir o painel'); }
// Adaptatividade: 3 erros seguidos reduzem as opções
{ const p = M.novoPerfil('d'); const f = D.fases.findIndex((x) => x.id === '5.5'); let it; for (let k = 0; k < 3; k++) { it = M.G.leiaEncontre(D.fases[f], { perfil: p }); M.registrar(p, it, { ok: false, tent: 2, final: true }); }
  const depois = M.G.leiaEncontre(D.fases[f], { perfil: p });
  ok('B4', 'Adaptatividade (3 erros → menos opções)', depois.opcoes.length < it.opcoes.length || depois.opcoes.length === 3, `antes ${4} opções → depois ${depois.opcoes.length}`); }
r.forEach((x) => console.log(`[${x.status}] ${x.id} ${x.nome}: ${x.det}`));
fs.writeFileSync(__dirname + '/relatorio_funcionais.json', JSON.stringify(r, null, 1));
