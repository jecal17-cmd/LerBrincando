/* ==========================================================================
   Ler Brincando — motor.js
   Motor pedagógico SEM DOM: geração de itens por fase (alimentado por dados),
   decodificabilidade, revisão espaçada (Leitner), domínio, adaptatividade,
   elogios, recompensas e avaliação inicial. Roda no navegador e no Node (bots).
   ========================================================================== */
(function (raiz) {
  'use strict';
  const N = raiz.Nucleo || (typeof require !== 'undefined' ? require('./nucleo.js') : null);
  const DIA = 864e5;
  const INTERVALOS = [0, 1, 2, 4, 7]; // caixas de Leitner 1..4 → dias
  const VOGAIS5 = ['A', 'E', 'I', 'O', 'U'];
  const CONS_SIMPLES = ['F', 'V', 'M', 'N', 'L', 'S', 'Z', 'J', 'X', 'P', 'B', 'T', 'D', 'C', 'G'];
  const TIPOS_ESCOLHA_SIMPLES = ['rima', 'palmas', 'somInicial', 'somFinal', 'juntar', 'cacaSom', 'abertoFechado', 'nomeSom', 'leiaEncontre',
    'gemeos', 'letraPerdida', 'fabrica', 'trocaLetra', 'frase', 'escrita', 'somS', 'tirar', 'trocar'];

  function criarMotor(D) {
    const M = {};
    M.D = D;
    M.offsetDias = 0;
    M.agora = () => Date.now() + M.offsetDias * DIA;
    M.hoje = () => new Date(M.agora()).toISOString().slice(0, 10);

    // ------------------------------------------------------------ índices
    const W = {}; D.palavras.forEach((w) => { W[w.p] = w; });
    M.W = W;
    D.fases.forEach((f, i) => { f.idx = i; f.mundo = Number(f.id.split('.')[0]); });
    const ensinadas = [];
    { const acc = new Set(); D.fases.forEach((f, i) => { (f.novos || []).forEach((t) => acc.add(t)); ensinadas[i] = new Set(acc); }); }
    M.ensinadas = (idx) => ensinadas[Math.max(0, Math.min(idx, ensinadas.length - 1))];
    M.decodavel = (silabas, idx, palavra) => {
      const an = N.analisar(silabas, palavra);
      const ens = M.ensinadas(idx);
      return an.tags.every((t) => ens.has(t));
    };
    M.decodavelP = (w, idx) => w && w.faseMin !== null && w.faseMin <= idx;
    const cacheDec = {};
    M.dec = (idx) => cacheDec[idx] || (cacheDec[idx] = D.palavras.filter((w) => M.decodavelP(w, idx)));
    const FREQ = D.frequentes.map((f) => f.replace(/-/g, ''));
    M.FREQ = FREQ;
    M.freqEnsinadas = (idx) => M.ensinadas(idx).has('FREQ');
    M.tagsMundo = (mundo) => { let u = -1; D.fases.forEach((f, i) => { if (f.mundo === mundo) u = i; }); return u; };

    // ------------------------------------------------------------ aleatoriedade
    let rng = Math.random;
    M.usarRng = (r) => { rng = r || Math.random; };
    const R = () => rng();
    const escolher = (a) => a[Math.floor(R() * a.length)];
    const embaralhar = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
    const amostra = (a, n) => embaralhar(a).slice(0, n);
    M.embaralhar = embaralhar; M.escolher = escolher;

    // ------------------------------------------------------------ segmentos de áudio
    const S = {
      f: (t) => ({ k: 'frase', t }), fala: (k) => ({ k: 'frase', t: D.falas[k] || k }),
      p: (t) => ({ k: 'palavra', t }), s: (t) => ({ k: 'silaba', t }), fon: (t) => ({ k: 'fonema', t }),
      nome: (t) => ({ k: 'nome', t }), pausa: (ms) => ({ k: 'pausa', ms })
    };
    M.S = S;

    // ------------------------------------------------------------ adaptatividade
    function nOpc(perfil, tipo, padrao) {
      const nv = (perfil && perfil.ajuste && perfil.ajuste[tipo] && perfil.ajuste[tipo].nivel) || 0;
      return Math.max(2, Math.min(4, padrao - nv));
    }
    M.nivelApoio = (perfil, tipo) => (perfil && perfil.ajuste && perfil.ajuste[tipo] && perfil.ajuste[tipo].nivel) || 0;

    // ------------------------------------------------------------ opções de imagem
    function opcoesImagem(certa, candidatos, n, filtro) {
      const vistos = new Set([certa.e]);
      const pool = embaralhar(candidatos.filter((w) => w.p !== certa.p && (!filtro || filtro(w))));
      const ops = [certa];
      for (const w of pool) { if (ops.length >= n) break; if (vistos.has(w.e)) continue; vistos.add(w.e); ops.push(w); }
      return embaralhar(ops).map((w) => ({ id: w.p, img: w.e, falar: S.p(w.p), g: w.ini }));
    }
    M.opcoesImagem = opcoesImagem;
    const semA = N.semAcento;

    // ------------------------------------------------------------ utilidades de sílabas
    function silabasCV(idx) {
      const ens = M.ensinadas(idx);
      const cons = CONS_SIMPLES.filter((c) => ens.has(c));
      const vog = VOGAIS5.filter((v) => ens.has(v));
      const out = [];
      cons.forEach((c) => vog.forEach((v) => { if ((c === 'C' || c === 'G') && (v === 'E' || v === 'I')) return; out.push({ s: c + v, c, v }); }));
      return out;
    }
    M.silabasCV = silabasCV;
    function letrasTeclado(idx) {
      const ens = M.ensinadas(idx);
      const L = [];
      VOGAIS5.forEach((v) => { if (ens.has(v)) L.push(v); });
      CONS_SIMPLES.forEach((c) => { if (ens.has(c)) L.push(c); });
      if (ens.has('R_FRACO')) L.push('R');
      if (ens.has('Ç')) L.push('Ç');
      if (ens.has('H') || ens.has('CH') || ens.has('LH') || ens.has('NH')) L.push('H');
      if (ens.has('QU')) L.push('Q');
      const ac = [];
      if (ens.has('A')) ac.push('Á', 'Â'); if (ens.has('E')) ac.push('É', 'Ê'); if (ens.has('I')) ac.push('Í');
      if (ens.has('O')) ac.push('Ó', 'Ô'); if (ens.has('U')) ac.push('Ú'); if (ens.has('Ã')) ac.push('Ã'); if (ens.has('ÃO')) ac.push('Õ');
      return { letras: L, acentos: ac };
    }
    M.letrasTeclado = letrasTeclado;

    // Palavras "do momento": priorizam as unidades mais recentes
    function palavrasFoco(idx, filtro) {
      const pool = M.dec(idx).filter((w) => !filtro || filtro(w));
      const f = D.fases[idx];
      const recentes = pool.filter((w) => w.faseMin !== null && D.fases[w.faseMin].mundo === f.mundo);
      return (recentes.length >= 6 && R() < 0.6) ? recentes : pool;
    }

    // ------------------------------------------------------------ GERADORES DE ITENS
    const G = {};
    const base = (f, tipo, extra) => Object.assign({ tipo, hab: 'f:' + f.id, contar: true, graf: [], texto: [] }, extra);

    G.rima = (f, ctx, o = {}) => {
      const pool = D.palavras.filter((w) => w.rimas.length > 0);
      let T = o.foco && W[o.foco] && W[o.foco].rimas.length ? W[o.foco] : escolher(pool);
      const C = W[escolher(T.rimas)];
      const ult = semA(T.s[T.s.length - 1]);
      const opc = opcoesImagem(C, D.palavras, nOpc(ctx.perfil, 'rima', 3), (w) => w.rima !== T.rima && semA(w.s[w.s.length - 1]) !== ult && w.p !== T.p);
      return base(f, 'rima', { ui: 'escolha', instr: 'rima', chave: 'r:' + T.p, pedido: [S.fala('rimaCom'), S.p(T.p)], visor: { img: T.e, fala: T.p }, opcoes: opc, certo: C.p, oral: true });
    };
    G.palmas = (f, ctx, o = {}) => {
      const cfg = (f.cfg && f.cfg.max) ? f.cfg : { min: 1, max: 4 };
      const pool = D.palavras.filter((w) => w.s.length >= cfg.min && w.s.length <= cfg.max);
      const T = o.foco && W[o.foco] ? W[o.foco] : escolher(pool);
      return base(f, 'palmas', { ui: 'palmas', instr: 'palmas', chave: 'c:' + T.p, pedido: [S.fala('contePalmas'), S.p(T.p)], visor: { img: T.e, fala: T.p }, palavra: T.p, silabas: T.s, certo: T.s.length, oral: true });
    };
    G.somInicial = (f, ctx, o = {}) => {
      const modo = o.modo || (f.cfg && f.cfg.modo) || (o.g ? 'som' : 'silaba');
      if (modo === 'silaba') {
        const ini = (w) => semA(w.s[0]);
        let T, C, tent = 0;
        do {
          T = o.foco && W[o.foco] && tent === 0 ? W[o.foco] : escolher(D.palavras);
          const cands = D.palavras.filter((w) => w.p !== T.p && ini(w) === ini(T) && w.e !== T.e);
          C = cands.length ? escolher(cands) : null; tent++;
        } while (!C && tent < 50);
        const opc = opcoesImagem(C, D.palavras, nOpc(ctx.perfil, 'somInicial', 3), (w) => ini(w) !== ini(T) && semA(w.p)[0] !== semA(T.p)[0] && w.p !== T.p);
        return base(f, 'somInicial', { ui: 'escolha', instr: 'somInicialSilaba', chave: 'i:' + T.p, pedido: [S.fala('comecaComo'), S.p(T.p)], visor: { img: T.e, fala: T.p }, opcoes: opc, certo: C.p, oral: true });
      }
      // modo "som": alvo = unidade sonora g
      const g = o.g;
      const casa = (w) => w.ini === g || (g === 'E' && (w.ini === 'É' || w.ini === 'Ê')) || (g === 'O' && (w.ini === 'Ó' || w.ini === 'Ô'));
      const certos = D.palavras.filter(casa);
      if (!certos.length) return null;
      const C = escolher(certos);
      const parc = D.parceiro[g];
      const ensF = M.ensinadas(f.idx);
      const opc = opcoesImagem(C, D.palavras, nOpc(ctx.perfil, 'somInicial', 3), (w) => w.ini && !casa(w) && (w.ini !== 'H') && !(parc && w.ini === parc && !ensF.has(parc)));
      // se o parceiro (par mínimo) existe e já foi ensinado, garante um distrator do par
      if (parc && M.ensinadas(f.idx).has(parc) && opc.length >= 3) {
        const dp = D.palavras.filter((w) => w.ini === parc && !opc.find((x) => x.id === w.p));
        if (dp.length) { const w = escolher(dp); const k = opc.findIndex((x) => x.id !== C.p); opc[k] = { id: w.p, img: w.e, falar: S.p(w.p), g: w.ini }; }
      }
      return base(f, 'somInicial', { ui: 'escolha', instr: 'somInicialSom', chave: 'g:' + g, graf: [g], alvoG: g, pedido: [S.fala('qualSom'), S.fon(g)], visor: { letra: g, falaFonema: g }, opcoes: opc, certo: C.p, oral: true, elogio: { tipo: 'som', som: g, palavra: C.p } });
    };
    G.somFinal = (f, ctx, o = {}) => {
      const fim = (w) => semA(w.s[w.s.length - 1]);
      let T, C, tent = 0;
      do {
        T = escolher(D.palavras.filter((w) => w.s.length >= 2));
        const c = D.palavras.filter((w) => w.p !== T.p && fim(w) === fim(T) && w.rima !== T.rima);
        C = c.length ? escolher(c) : null; tent++;
      } while (!C && tent < 80);
      const opc = opcoesImagem(C, D.palavras, nOpc(ctx.perfil, 'somFinal', 3), (w) => fim(w) !== fim(T) && w.p !== T.p);
      return base(f, 'somFinal', { ui: 'escolha', instr: 'somFinal', chave: 'fi:' + T.p, pedido: [S.fala('terminaComo'), S.p(T.p)], visor: { img: T.e, fala: T.p }, opcoes: opc, certo: C.p, oral: true });
    };
    G.juntar = (f, ctx, o = {}) => {
      const T = o.foco && W[o.foco] ? W[o.foco] : escolher(D.palavras.filter((w) => w.s.length >= 2 && w.s.length <= 4));
      const ped = []; T.s.forEach((s, i) => { if (i) ped.push(S.pausa(500)); ped.push(S.s(s)); });
      const opc = opcoesImagem(T, D.palavras, nOpc(ctx.perfil, 'juntar', 3), (w) => w.p !== T.p);
      return base(f, 'juntar', { ui: 'escolha', instr: 'juntar', chave: 'p:' + T.p, pedido: ped, visor: { pecasSom: T.s.length }, opcoes: opc, certo: T.p, oral: true, elogio: { tipo: 'juntar', palavra: T.p } });
    };
    G.tirar = (f, ctx, o = {}) => {
      const m = o.foco ? (D.tirar.find((x) => x.de === o.foco) || escolher(D.tirar)) : escolher(D.tirar);
      const fica = W[m.fica];
      const de = m.de.replace(/-/g, '');
      const opc = opcoesImagem(fica, D.palavras, nOpc(ctx.perfil, 'tirar', 3), (w) => w.p !== de);
      const ped = [S.fala('fale'), S.p(de), m.modo === 'som' ? S.fala('semSom') : S.fala('sem'), m.modo === 'som' ? S.fon(m.tira) : S.s(m.tira)];
      return base(f, 'tirar', { ui: 'escolha', instr: 'tirar', chave: 'm:' + m.de, pedido: ped, visor: { img: W[de] ? W[de].e : '🪄', fala: de }, opcoes: opc, certo: fica.p, oral: true });
    };
    G.trocar = (f, ctx, o = {}) => {
      const m = escolher(D.trocar);
      const fica = W[m.fica]; const de = m.de.replace(/-/g, '');
      const opc = opcoesImagem(fica, D.palavras, nOpc(ctx.perfil, 'trocar', 3), (w) => w.p !== de);
      if (W[de] && !opc.find((x) => x.id === de) && opc.length > 2) { const k = opc.findIndex((x) => x.id !== fica.p); opc[k] = { id: de, img: W[de].e, falar: S.p(de) }; }
      const ped = [S.fala('troque'), S.s(m.troca), S.fala('por'), S.s(m.por), S.fala('em'), S.p(de)];
      return base(f, 'trocar', { ui: 'escolha', instr: 'trocar', chave: 'm:' + m.de, pedido: ped, visor: { img: W[de] ? W[de].e : '🔄', fala: de }, opcoes: opc, certo: fica.p, oral: true });
    };
    G.memoria = (f, ctx) => {
      const modo = (f.cfg && f.cfg.modo) || 'palavra';
      const nPares = Math.max(3, 4 - M.nivelApoio(ctx.perfil, 'memoria'));
      const cartas = []; const texto = [];
      if (modo === 'rima') {
        const grupos = {}; D.palavras.forEach((w) => { (grupos[w.rima] = grupos[w.rima] || []).push(w); });
        const ok = embaralhar(Object.values(grupos).filter((g) => g.length >= 2)).slice(0, nPares);
        ok.forEach((g, i) => { const [a, b] = amostra(g, 2); cartas.push({ id: 'a' + i, par: i, img: a.e, fala: a.p }, { id: 'b' + i, par: i, img: b.e, fala: b.p }); });
      } else {
        const ws = amostra(palavrasFoco(f.idx, (w) => w.p.length <= 7), nPares);
        ws.forEach((w, i) => { cartas.push({ id: 'a' + i, par: i, txt: w.p, silabas: w.s }, { id: 'b' + i, par: i, img: w.e, fala: w.p }); texto.push(w.p); });
      }
      return base(f, 'memoria', { ui: 'memoria', instr: modo === 'rima' ? 'memoriaRima' : 'memoria', chave: null, cartas: embaralhar(cartas), pares: cartas.length / 2, texto, oral: modo === 'rima', multi: true });
    };
    G.cacaSom = (f, ctx, o = {}) => {
      const ens = M.ensinadas(f.idx);
      let modo = o.modo || (f.cfg && f.cfg.modo);
      const vog = VOGAIS5.filter((v) => ens.has(v));
      const cvs = silabasCV(f.idx);
      if (!modo) modo = cvs.length >= 3 ? 'silaba' : 'vogal';
      const n = nOpc(ctx.perfil, 'cacaSom', o.n || 4);
      if (modo === 'vogal' || modo === 'letra') {
        let alvo = o.g || escolher(vog);
        let lista = modo === 'vogal' ? vog.slice() : [];
        if (o.nasal) lista = ['A', 'Ã'];
        if (modo === 'letra') lista = [alvo].concat(CONS_SIMPLES.filter((c) => ens.has(c) && c !== alvo));
        if (lista.length < 2) return null;
        const parc = D.parceiro[alvo];
        let ops = [alvo];
        if (parc && lista.includes(parc)) ops.push(parc);
        embaralhar(lista).forEach((l) => { if (ops.length < n && !ops.includes(l)) ops.push(l); });
        return base(f, 'cacaSom', { ui: 'escolha', instr: modo === 'vogal' ? 'cacaSomVogal' : 'cacaSomLetra', chave: 'g:' + alvo, graf: [alvo], alvoG: alvo,
          pedido: [S.fon(alvo)], visor: { icone: '👂' }, opcoes: embaralhar(ops).map((l) => ({ id: l, txt: l, g: l, falar: S.fon(l) })), certo: alvo, elogio: { tipo: 'som', som: alvo } });
      }
      // modo sílaba
      let pool = cvs;
      if (o.g) pool = cvs.filter((x) => x.c === o.g);
      if (o.foco) { const fx = cvs.find((x) => x.s === o.foco); if (fx) pool = [fx]; }
      if (!pool.length) return null;
      const alvo = escolher(pool);
      const ops = [alvo.s];
      const add = (s) => { if (s && ops.length < n && !ops.includes(s) && cvs.find((x) => x.s === s)) ops.push(s); };
      const parc = o.par || D.parceiro[alvo.c];
      if (parc && ens.has(parc)) add(parc + alvo.v);
      add(alvo.c + escolher(VOGAIS5.filter((v) => v !== alvo.v && ens.has(v))));
      embaralhar(cvs).forEach((x) => add(x.s));
      // poucas sílabas ensinadas (início do Mundo 3): completa com vogais sozinhas
      embaralhar(VOGAIS5.filter((v) => ens.has(v))).forEach((v) => { if (ops.length < Math.min(n, 3) && !ops.includes(v)) ops.push(v); });
      if (ops.length < 2) return null;
      return base(f, 'cacaSom', { ui: 'escolha', instr: 'cacaSomSilaba', chave: 's:' + alvo.s, graf: [alvo.c], alvoG: alvo.c, par: parc && ens.has(parc) ? D.parDe[alvo.c] : null,
        pedido: [S.s(alvo.s)], visor: { icone: '👂' }, opcoes: embaralhar(ops).map((s) => ({ id: s, txt: s, g: s.length > 1 ? s[0] : s, falar: S.s(s) })), certo: alvo.s, texto: [], elogio: { tipo: 'silaba', silaba: alvo.s } });
    };
    G.abertoFechado = (f, ctx) => {
      const it = escolher(D.abertoFechado);
      const w = W[it.p];
      const ehE = it.v === 'É' || it.v === 'Ê';
      const ops = ehE ? [{ id: 'É', txt: 'É', sub: '😮 aberta', g: 'É', falar: S.fon('É') }, { id: 'Ê', txt: 'Ê', sub: '🙂 fechada', g: 'Ê', falar: S.fon('Ê') }]
        : [{ id: 'Ó', txt: 'Ó', sub: '😮 aberta', g: 'Ó', falar: S.fon('Ó') }, { id: 'Ô', txt: 'Ô', sub: '🙂 fechada', g: 'Ô', falar: S.fon('Ô') }];
      return base(f, 'abertoFechado', { ui: 'escolha', instr: 'abertoFechado', chave: 'v:' + it.p, graf: [ehE ? 'E' : 'O'], alvoG: it.v, par: ehE ? 'É/Ê' : 'Ó/Ô',
        pedido: [S.fala('boca'), S.p(it.p)], visor: { img: w.e, fala: w.p }, opcoes: ops, certo: it.v, oral: true });
    };
    G.tracado = (f, ctx, o = {}) => {
      const L = o.g || escolher((f.cfg && f.cfg.letras) || ['A']);
      return base(f, 'tracado', { ui: 'tracado', instr: 'tracado', chave: 't:' + L, graf: [L], letra: L, pedido: [S.fon(L)] });
    };
    G.bingo = (f, ctx) => {
      const modo = (f.cfg && f.cfg.modo) || 'silaba';
      const ens = M.ensinadas(f.idx);
      let celulas;
      if (modo === 'vogal') celulas = VOGAIS5.filter((v) => ens.has(v)).concat(ens.has('Ã') ? ['Ã'] : []);
      else celulas = amostra(silabasCV(f.idx).map((x) => x.s), 9);
      const chamadas = amostra(celulas, Math.min(f.n || 6, celulas.length));
      return base(f, 'bingo', { ui: 'bingo', instr: 'bingo', chave: null, celulas: embaralhar(celulas), chamadas, modo, multi: true });
    };
    G.nomeSom = (f, ctx) => {
      const ens = M.ensinadas(f.idx);
      const letras = ['F', 'V', 'M', 'N', 'L', 'S', 'Z', 'J', 'X'].filter((c) => ens.has(c));
      const L = escolher(letras);
      const ehNome = R() < 0.5;
      return base(f, 'nomeSom', { ui: 'escolha', instr: 'nomeSom', chave: 'ns:' + L, graf: [L], pedido: [ehNome ? S.nome(L) : S.fon(L)], visor: { letra: L },
        opcoes: [{ id: 'nome', txt: '🔤', sub: 'NOME' }, { id: 'som', txt: '🔊', sub: 'SOM' }], certo: ehNome ? 'nome' : 'som', alvoLetra: L });
    };
    G.leiaEncontre = (f, ctx, o = {}) => {
      let T = o.foco && W[o.foco] && M.decodavelP(W[o.foco], f.idx) ? W[o.foco] : null;
      if (!T) { const pool = palavrasFoco(f.idx, o.filtro); if (!pool.length) return null; T = escolher(pool); }
      const n = nOpc(ctx.perfil, 'leiaEncontre', f.mundo <= 3 ? 3 : 4);
      const prim = semA(T.s[0]);
      const parecidas = D.palavras.filter((w) => w.p !== T.p && (semA(w.s[0]) === prim || w.p.length === T.p.length || w.p[0] === T.p[0]));
      let opc = opcoesImagem(T, parecidas.length >= n - 1 ? parecidas : D.palavras, n);
      if (opc.length < n) opc = opcoesImagem(T, D.palavras, n);
      return base(f, 'leiaEncontre', { ui: 'escolha', instr: 'leiaEncontre', chave: 'p:' + T.p, graf: T.g.slice(), pedido: [], semAudioPalavra: true,
        visor: { palavra: T.p, silabas: T.s }, opcoes: opc, certo: T.p, texto: [T.p], elogio: { tipo: 'leitura', palavra: T.p }, leitura: true });
    };
    M.paresDisponiveis = (idx, filtro) => D.pares.filter((x) => (!filtro || filtro.includes('todos') || filtro.includes(x.par)) && W[x.a] && W[x.b] && M.decodavelP(W[x.a], idx) && M.decodavelP(W[x.b], idx));
    G.gemeos = (f, ctx, o = {}) => {
      const filtro = o.pares || (f.cfg && f.cfg.pares) || ['todos'];
      let disp = M.paresDisponiveis(f.idx, filtro);
      if (o.foco) { const fx = disp.filter((x) => x.par === o.foco || x.a === o.foco || x.b === o.foco); if (fx.length) disp = fx; }
      if (!disp.length) return null;
      const pr = escolher(disp);
      const alvo = R() < 0.5 ? W[pr.a] : W[pr.b];
      const outro = alvo.p === pr.a ? W[pr.b] : W[pr.a];
      const [la, lb] = pr.par.split('/');
      const gAlvo = N.grafemas(alvo.p).find((x, i) => x !== N.grafemas(outro.p)[i]);
      const gOutro = N.grafemas(outro.p).find((x, i) => x !== N.grafemas(alvo.p)[i]);
      const mapG = (x) => (x === 'Ç' || x === 'SS' ? 'S' : x === 'CH' ? 'X' : x);
      const ops = embaralhar([alvo, outro]).map((w) => ({ id: w.p, img: w.e, txt: w.p, silabas: w.s, g: mapG(w === alvo ? gAlvo : gOutro), falar: S.p(w.p) }));
      return base(f, 'gemeos', { ui: 'escolha', instr: 'gemeos', chave: 'par:' + pr.par + ':' + alvo.p, graf: [la, lb], alvoG: mapG(gAlvo), par: pr.par,
        pedido: [S.fala('qualPalavraOuviu'), S.p(alvo.p)], visor: { icone: '👯' }, opcoes: ops, certo: alvo.p, texto: [alvo.p, outro.p], elogio: { tipo: 'par', palavra: alvo.p } });
    };
    // posições de consoantes simples (que têm par) dentro da palavra
    function posicoesPar(w, idx) {
      const ens = M.ensinadas(idx); const out = []; let pos = 0;
      w.s.forEach((sil, i) => {
        const an = N.analisar([sil], w.p);
        const c0 = sil[0];
        const simples = c0 && !N.ehVogal(c0) && CONS_SIMPLES.includes(c0) && (sil[1] && N.ehVogal(sil[1]));
        const tagOk = simples && an.tags.includes(c0) && !(c0 === 'S' && i > 0 && N.ehVogal(w.s[i - 1].slice(-1)));
        const par = D.parceiro[c0];
        if (tagOk && par && ens.has(par) && !(i > 0 && w.s[i - 1].slice(-1) === c0)) out.push({ pos, letra: c0, par });
        pos += sil.length;
      });
      return out;
    }
    const UNIDADES_REGRA = [
      { re: /CH/, op: ['CH', 'X'], t: 'CH' }, { re: /LH/, op: ['LH', 'LI'], t: 'LH' }, { re: /NH/, op: ['NH', 'NI'], t: 'NH' },
      { re: /RR/, op: ['RR', 'R'], t: 'RR' }, { re: /SS/, op: ['SS', 'Ç'], t: 'SS' }, { re: /Ç/, op: ['Ç', 'SS'], t: 'Ç' },
      { re: /QU(?=[EIÉÊÍ])/, op: ['QU', 'C'], t: 'QU' }, { re: /GU(?=[EIÉÊÍ])/, op: ['GU', 'G'], t: 'GU' }, { re: /G(?=[EIÉÊÍ])/, op: ['G', 'J'], t: 'G_SUAVE' },
      { re: /C(?=[EIÉÊÍ])/, op: ['C', 'S'], t: 'C_SUAVE' }
    ];
    G.letraPerdida = (f, ctx, o = {}) => {
      const modo = o.modo || (f.cfg && f.cfg.modo) || 'par';
      const n = nOpc(ctx.perfil, 'letraPerdida', 3);
      if (modo === 'regra') {
        const ens = M.ensinadas(f.idx);
        const unidades = UNIDADES_REGRA.filter((u) => ens.has(u.t));
        const cands = [];
        M.dec(f.idx).forEach((w) => unidades.forEach((u) => { const m = u.re.exec(w.p); if (m && w.g.includes(u.t)) cands.push({ w, u, pos: m.index }); }));
        if (!cands.length) return null;
        const c = escolher(cands);
        const ops = c.u.op.slice(0, Math.max(2, n)).map((x) => ({ id: x, txt: x }));
        return base(f, 'letraPerdida', { ui: 'escolha', instr: 'letraPerdidaRegra', chave: 'e:' + c.w.p, graf: [c.u.t], pedido: [S.p(c.w.p)],
          visor: { img: c.w.e, lacuna: { palavra: c.w.p, pos: c.pos, tam: c.u.op[0].length } }, opcoes: embaralhar(ops), certo: c.u.op[0], texto: [c.w.p], elogio: { tipo: 'escrita', palavra: c.w.p } });
      }
      const forcar = o.opcoes; // ex.: ['R','L'] para a regra do R fraco
      const cands = [];
      M.dec(f.idx).filter((w) => !o.filtro || o.filtro(w)).forEach((w) => {
        if (forcar) {
          let pos = 0; w.s.forEach((sil, i) => { if (sil[0] === forcar[0] && i > 0 && N.ehVogal(w.s[i - 1].slice(-1)) && N.ehVogal(sil[1] || '')) cands.push({ w, pos, letra: forcar[0], par: forcar[1] }); pos += sil.length; });
        } else posicoesPar(w, f.idx).forEach((p) => cands.push(Object.assign({ w }, p)));
      });
      if (!cands.length) return null;
      const c = escolher(cands);
      const ens = M.ensinadas(f.idx);
      const ops = [c.letra, c.par];
      embaralhar(CONS_SIMPLES.filter((x) => ens.has(x))).forEach((x) => { if (ops.length < n && !ops.includes(x)) ops.push(x); });
      return base(f, 'letraPerdida', { ui: 'escolha', instr: 'letraPerdida', chave: 'lp:' + c.w.p, graf: [o.grafTag || c.letra], alvoG: c.letra, par: D.parDe[c.letra],
        pedido: [S.p(c.w.p)], visor: { img: c.w.e, lacuna: { palavra: c.w.p, pos: c.pos, tam: 1 } }, opcoes: embaralhar(ops).map((x) => ({ id: x, txt: x, g: x, falar: S.fon(x) })), certo: c.letra, texto: [c.w.p], elogio: { tipo: 'som', som: c.letra, palavra: c.w.p } });
    };
    // ---- transformações de erro para "escolha a escrita certa"
    const TRANSF = {
      semCoda: (w) => { const s = w.s.slice(); for (let i = 0; i < s.length; i++) { if (/[AEIOUÁÉÍÓÚÂÊÔ][SZRL]$/.test(s[i]) && !(s[i + 1] && s[i + 1][0] === s[i].slice(-1))) { s[i] = s[i].slice(0, -1); return s.join(''); } } return null; },
      trocaSZ: (w) => { const s = w.s.slice(); for (let i = 0; i < s.length; i++) { if (/[AEIOUÁÉÍÓÚÂÊÔ][SZ]$/.test(s[i]) && !(s[i + 1] && s[i + 1][0] === 'S')) { s[i] = s[i].slice(0, -1) + (s[i].endsWith('S') ? 'Z' : 'S'); return s.join(''); } } return null; },
      LporU: (w) => { const s = w.s.slice(); for (let i = 0; i < s.length; i++) if (/L$/.test(s[i]) && s[i].length > 1) { s[i] = s[i].slice(0, -1) + 'U'; return s.join(''); } return null; },
      semNasal: (w) => { const s = w.s.slice(); for (let i = 0; i < s.length; i++) if (/[AEIOUÂÊ][MN]$/.test(s[i])) { s[i] = s[i].slice(0, -1); return s.join(''); } return null; },
      trocaMN: (w) => { const s = w.s.slice(); for (let i = 0; i < s.length; i++) if (/[AEIOUÂÊ][MN]$/.test(s[i])) { s[i] = s[i].slice(0, -1) + (s[i].endsWith('M') ? 'N' : 'M'); return s.join(''); } return null; },
      semTil: (w) => (w.p.includes('Ã') ? w.p.replace('Ã', 'A') : null),
      AOporAM: (w) => (/ÃO$/.test(w.p) ? w.p.replace(/ÃO$/, 'AM') : null),
      semCCV2: (w) => { const s = w.s.slice(); for (let i = 0; i < s.length; i++) if (/^[PBTDCGFV][RL][AEIOUÁÉÍÓÚÂÊÔ]/.test(s[i])) { s[i] = s[i][0] + s[i].slice(2); return s.join(''); } return null; },
      metatese: (w) => { const s = w.s.slice(); for (let i = 0; i < s.length; i++) { const m = /^([PBTDCGFV])([RL])([AEIOUÁÉÍÓÚÂÊÔ])$/.exec(s[i]); if (m) { s[i] = m[1] + m[3] + m[2]; return s.join(''); } } return null; },
      CHporX: (w) => (w.p.includes('CH') ? w.p.replace('CH', 'X') : null),
      LHporLI: (w) => (w.p.includes('LH') ? w.p.replace('LH', 'LI') : null), NHporNI: (w) => (w.p.includes('NH') ? w.p.replace('NH', 'NI') : null),
      trocaLHNH: (w) => (w.p.includes('LH') ? w.p.replace('LH', 'NH') : w.p.includes('NH') ? w.p.replace('NH', 'LH') : null),
      RRporR: (w) => (w.p.includes('RR') ? w.p.replace('RR', 'R') : null), RporRR: (w) => (/^R/.test(w.p) ? 'R' + w.p : null),
      'ÇporSS': (w) => (w.p.includes('Ç') ? w.p.replace('Ç', 'SS') : null), 'SSporÇ': (w) => (w.p.includes('SS') ? w.p.replace('SS', 'Ç') : null),
      SSporS: (w) => (w.p.includes('SS') ? w.p.replace('SS', 'S') : null), CporS: (w) => (/C(?=[EIÉÊÍ])/.test(w.p) ? w.p.replace(/C(?=[EIÉÊÍ])/, 'S') : null),
      QUporC: (w) => (/QU(?=[EIÉÊÍ])/.test(w.p) ? w.p.replace(/QU(?=[EIÉÊÍ])/, 'C') : null), QUporQ: (w) => (w.p.includes('QU') ? w.p.replace('QU', 'Q') : null),
      GUporG: (w) => (/GU(?=[EIÉÊÍ])/.test(w.p) ? w.p.replace(/GU(?=[EIÉÊÍ])/, 'G') : null), GporJ: (w) => (/G(?=[EIÉÊÍ])/.test(w.p) ? w.p.replace(/G(?=[EIÉÊÍ])/, 'J') : null),
      semH: (w) => (/^H/.test(w.p) ? w.p.slice(1) : null), XporCS: (w) => (w.g.includes('X_VARIOS') ? w.p.replace('X', 'CS') : null)
    };
    M.TRANSF = TRANSF;
    G.escrita = (f, ctx, o = {}) => {
      const ens = M.ensinadas(f.idx);
      const regras = o.regra ? [D.regras[o.regra]] : Object.values(D.regras).filter((r) => r.erros && r.tags.every((t) => ens.has(t)));
      if (!regras.length) return null;
      const n = nOpc(ctx.perfil, 'escrita', 3);
      for (let tent = 0; tent < 40; tent++) {
        const r = escolher(regras);
        const pool = M.dec(f.idx).filter((w) => r.tags.some((t) => w.g.includes(t)));
        if (!pool.length) continue;
        const w = o.foco && W[o.foco] && pool.includes(W[o.foco]) && tent === 0 ? W[o.foco] : escolher(pool);
        const erradas = [];
        r.erros.forEach((e) => { const x = TRANSF[e](w); if (x && x !== w.p && !erradas.includes(x) && !W[x] && !FREQ.includes(x)) erradas.push(x); });
        if (!erradas.length) continue;
        const ops = [w.p].concat(erradas.slice(0, n - 1));
        return base(f, 'escrita', { ui: 'escolha', instr: 'escrita', chave: 'e:' + w.p, graf: r.tags.filter((t) => w.g.includes(t)), regra: Object.keys(D.regras).find((k) => D.regras[k] === r),
          pedido: [S.p(w.p)], visor: { img: w.e, fala: w.p }, opcoes: embaralhar(ops).map((x) => ({ id: x, txt: x })), certo: w.p, texto: [w.p], elogio: { tipo: 'escrita', palavra: w.p } });
      }
      return null;
    };
    G.somS = (f, ctx) => {
      const pool = M.dec(f.idx).filter((w) => (w.g.includes('S') !== w.g.includes('S_Z')) && /S/.test(w.p) && !w.g.includes('CODA_S') && !w.g.includes('SS'));
      const w = escolher(pool);
      const z = w.g.includes('S_Z');
      return base(f, 'somS', { ui: 'escolha', instr: 'somS', chave: 'sz:' + w.p, graf: ['S_Z'], alvoG: z ? 'Z' : 'S', par: 'S/Z', pedido: [S.p(w.p)],
        visor: { palavra: w.p, silabas: w.s, destaque: 'S', img: w.e }, opcoes: [{ id: 'S', txt: '🐍 S', sub: 'sss', g: 'S', falar: S.fon('S') }, { id: 'Z', txt: '🐝 Z', sub: 'zzz', g: 'Z', falar: S.fon('Z') }],
        certo: z ? 'Z' : 'S', texto: [w.p] });
    };
    G.fabrica = (f, ctx, o = {}) => {
      const pool = palavrasFoco(f.idx, (w) => w.s.length >= 2 && w.s.length <= 3);
      const T = o.foco && W[o.foco] ? W[o.foco] : escolher(pool);
      const opc = opcoesImagem(T, D.palavras, nOpc(ctx.perfil, 'fabrica', 3), (w) => w.p !== T.p);
      return base(f, 'fabrica', { ui: 'escolha', instr: 'fabrica', chave: 'p:' + T.p, graf: T.g.slice(), pedido: [], visor: { blocos: T.s }, opcoes: opc, certo: T.p, texto: [T.p], elogio: { tipo: 'juntar', palavra: T.p }, leitura: true });
    };
    G.trem = (f, ctx, o = {}) => {
      const complexa = f.mundo >= 6;
      let pool = palavrasFoco(f.idx, (w) => w.s.length >= 2 && w.s.length <= 4 && (!complexa || w.padrao.some((p) => p !== 'CV')));
      if (!pool.length) pool = M.dec(f.idx).filter((w) => w.s.length >= 2);
      const T = o.foco && W[o.foco] ? W[o.foco] : escolher(pool);
      const pecas = T.s.map((s, i) => ({ id: 'p' + i, s }));
      if (M.nivelApoio(ctx.perfil, 'trem') === 0 && f.mundo >= 6) {
        const outra = escolher(M.dec(f.idx).filter((w) => w.p !== T.p)); const s = escolher(outra.s);
        if (!T.s.includes(s)) pecas.push({ id: 'x', s, distrator: true });
      }
      return base(f, 'trem', { ui: 'trem', instr: 'trem', chave: 'p:' + T.p, graf: T.g.slice(), pedido: [S.p(T.p)], visor: { img: T.e }, palavra: T.p, silabas: T.s, pecas: embaralhar(pecas), texto: [T.p], elogio: { tipo: 'juntar', palavra: T.p } });
    };
    G.fatiador = (f, ctx, o = {}) => {
      const pool = palavrasFoco(f.idx, (w) => w.s.length >= 2 && w.s.length <= 4 && w.p.length >= 4 && w.p.length <= 7);
      const T = o.foco && W[o.foco] ? W[o.foco] : escolher(pool);
      const cortes = []; let acc = 0; T.s.slice(0, -1).forEach((s) => { acc += s.length; cortes.push(acc); });
      return base(f, 'fatiador', { ui: 'fatiar', instr: 'fatiador', chave: 'c:' + T.p, graf: T.g.slice(), pedido: [S.p(T.p)], visor: { img: T.e }, palavra: T.p, silabas: T.s, cortes, texto: [T.p] });
    };
    G.freq = (f, ctx, o = {}) => {
      const alvo = o.foco && FREQ.includes(o.foco) ? o.foco : escolher(FREQ);
      const n = nOpc(ctx.perfil, 'freq', 3);
      const ops = [alvo].concat(amostra(FREQ.filter((x) => x !== alvo && x.length !== alvo.length - 99), n - 1));
      return base(f, 'freq', { ui: 'escolha', instr: 'freq', chave: 'fq:' + alvo, graf: ['FREQ'], pedido: [S.p(alvo)], visor: { icone: '✨' }, opcoes: embaralhar(ops).map((x) => ({ id: x, txt: x })), certo: alvo, texto: ops.slice() });
    };
    G.ditado = (f, ctx, o = {}) => {
      const pool = palavrasFoco(f.idx, (w) => w.p.length <= (f.mundo <= 5 ? 6 : 8));
      const T = o.foco && W[o.foco] ? W[o.foco] : escolher(pool);
      const tec = letrasTeclado(f.idx);
      return base(f, 'ditado', { ui: 'ditado', instr: 'ditado', chave: 'd:' + T.p, graf: T.g.slice(), pedido: [S.p(T.p)], visor: { img: T.e }, palavra: T.p, silabas: T.s, teclado: tec, texto: [T.p], elogio: { tipo: 'escrita', palavra: T.p } });
    };
    // pares de palavras que diferem em UMA letra (para a Troca-Letra Mágica)
    let cacheTroca = null;
    function paresTroca() {
      if (cacheTroca) return cacheTroca;
      cacheTroca = [];
      const ws = D.palavras;
      for (let i = 0; i < ws.length; i++) for (let j = 0; j < ws.length; j++) {
        if (i === j) continue; const a = ws[i].p, b = ws[j].p;
        if (a.length !== b.length || a.length > 6) continue;
        let dif = -1, n = 0; for (let k = 0; k < a.length; k++) if (a[k] !== b[k]) { n++; dif = k; }
        if (n === 1 && /[A-Z]/.test(a[dif]) && /[A-Z]/.test(b[dif])) cacheTroca.push({ a: ws[i], b: ws[j], pos: dif });
      }
      return cacheTroca;
    }
    M.paresTroca = paresTroca;
    G.trocaLetra = (f, ctx) => {
      const disp = paresTroca().filter((x) => M.decodavelP(x.a, f.idx) && M.decodavelP(x.b, f.idx));
      if (!disp.length) return null;
      const t = escolher(disp);
      const nova = t.b.p[t.pos];
      const opc = opcoesImagem(t.b, D.palavras, nOpc(ctx.perfil, 'trocaLetra', 3), (w) => w.p !== t.a.p);
      if (opc.length > 2 && !opc.find((x) => x.id === t.a.p)) { const k = opc.findIndex((x) => x.id !== t.b.p); opc[k] = { id: t.a.p, img: t.a.e, falar: S.p(t.a.p) }; }
      return base(f, 'trocaLetra', { ui: 'escolha', instr: 'trocaLetra', chave: 'p:' + t.b.p, graf: t.b.g.slice(), pedido: [],
        visor: { palavra: t.a.p, silabas: t.a.s, img: t.a.e, troca: { pos: t.pos, nova } }, opcoes: opc, certo: t.b.p, texto: [t.a.p], elogio: { tipo: 'leitura', palavra: t.b.p }, leitura: true });
    };
    M.fraseDecodavel = (fr, idx) => {
      const toks = N.tokenizarFrase(fr.t).filter((x) => x.tipo === 'palavra');
      const ens = M.ensinadas(idx);
      let ok = 0; const exc = [];
      toks.forEach((tk) => { if (M.decodavel(tk.silabas, idx, tk.palavra)) ok++; else exc.push(tk.palavra); });
      const excOk = exc.every((p) => ens.has('FREQ') && FREQ.includes(N.maiusc(p)));
      return { total: toks.length, ok, exc, pct: toks.length ? ok / toks.length : 1, excOk };
    };
    G.frase = (f, ctx, o = {}) => {
      const pool = D.frases.map((x, i) => Object.assign({ i }, x)).filter((x) => x.m <= f.mundo && M.fraseDecodavel(x, f.idx).excOk && M.fraseDecodavel(x, f.idx).pct >= 0.95);
      if (!pool.length) return null;
      const fr = o.foco !== undefined && pool.find((x) => x.i === o.foco) ? pool.find((x) => x.i === o.foco) : escolher(pool);
      const n = nOpc(ctx.perfil, 'frase', 3);
      const ops = [fr.img].concat(fr.d.slice(0, n - 1));
      const toks = N.tokenizarFrase(fr.t);
      return base(f, 'frase', { ui: 'escolha', instr: 'frase', chave: 'fr:' + fr.i, graf: [], pedido: [], visor: { frase: fr.t }, opcoes: embaralhar(ops).map((x, k) => ({ id: x, img: x, cena: true })), certo: fr.img,
        texto: [], frasesTexto: [fr.t], leitura: true, fraseTexto: fr.t });
    };
    G.microfone = (f, ctx) => {
      const modo = (f.cfg && f.cfg.modo) || 'palavra';
      if (modo === 'frase') {
        const pool = D.frases.filter((x) => x.m <= f.mundo && M.fraseDecodavel(x, f.idx).pct >= 0.95 && M.fraseDecodavel(x, f.idx).excOk);
        const fr = escolher(pool);
        return base(f, 'microfone', { ui: 'micro', instr: 'microfone', chave: null, alvo: N.fraseLimpa(fr.t), frase: fr.t, texto: [], frasesTexto: [fr.t], contar: false });
      }
      const w = escolher(palavrasFoco(f.idx));
      return base(f, 'microfone', { ui: 'micro', instr: 'microfone', chave: null, alvo: w.p, silabas: w.s, img: w.e, texto: [w.p], contar: false });
    };
    // Itens de apresentação
    G.mostraSom = (f, g) => ({ ui: 'mostra', tipo: 'licao', hab: 'f:' + f.id, contar: false, g, nome: D.nomesLetras[g] || g, dica: D.dicasFonema[g], exemplos: (D.exemplosSom[g] || []).filter((p) => W[p]), fonema: D.fonemas[g], graf: [], texto: [] });
    G.mostraRegra = (f, chave) => {
      const r = D.regras[chave];
      const ex = r.exemplos.filter((p) => W[p] && M.decodavelP(W[p], f.idx));
      const ct = r.contra.filter((p) => W[p] && M.decodavelP(W[p], f.idx));
      return { ui: 'regraMostra', tipo: 'regra', hab: 'f:' + f.id, contar: false, regra: chave, titulo: r.titulo, explica: r.explica, exemplos: ex.slice(0, 5), contra: ct.slice(0, 3), graf: [], texto: ex.slice(0, 5).concat(ct.slice(0, 3)) };
    };
    G.mostraFreq = (f) => ({ ui: 'freqMostra', tipo: 'freq', hab: 'f:' + f.id, contar: false, palavras: D.frequentes.slice(), graf: [], texto: FREQ.slice() });

    // ------------------------------------------------------------ LIÇÃO (Eu mostro → Fazemos juntos → Agora é você)
    function itensDoSom(f, ctx, g, guiado) {
      const ehVog = VOGAIS5.includes(g) || g === 'Ã';
      const ens = M.ensinadas(f.idx);
      const tem = D.palavras.some((w) => w.ini === g || (g === 'E' && /[ÉÊ]/.test(w.ini || '')) || (g === 'O' && /[ÓÔ]/.test(w.ini || '')));
      const op = [];
      if (tem && g !== 'Ã') op.push(() => G.somInicial(f, ctx, { modo: 'som', g, guiado }));
      if (ehVog) {
        if (g === 'Ã') op.push(() => G.cacaSom(f, ctx, { modo: 'vogal', nasal: true, g: R() < 0.6 ? 'Ã' : 'A' }));
        else if (VOGAIS5.filter((v) => ens.has(v)).length >= 2) op.push(() => G.cacaSom(f, ctx, { modo: 'vogal', g }));
      } else {
        op.push(() => G.cacaSom(f, ctx, { modo: 'silaba', g, par: f.cfg && f.cfg.par }));
        if (D.fonemas[g] && D.fonemas[g].tipo === 'continua' && CONS_SIMPLES.filter((c) => ens.has(c)).length >= 2) op.push(() => G.cacaSom(f, ctx, { modo: 'letra', g }));
      }
      for (let k = 0; k < 10; k++) { const it = escolher(op)(); if (it) { if (it.alvoG === undefined) it.alvoG = g; return it; } }
      return null;
    }
    G.licao = (f, ctx) => {
      const itens = []; const gs = f.g;
      gs.forEach((g) => itens.push(G.mostraSom(f, g)));
      gs.forEach((g) => { for (let k = 0; k < (gs.length > 1 ? 1 : 2); k++) { const it = itensDoSom(f, ctx, g, true); if (it) { it.guiado = true; it.contar = false; itens.push(it); } } });
      const ind = [];
      for (let k = 0; k < f.n; k++) { const it = itensDoSom(f, ctx, gs[k % gs.length], false); if (it) ind.push(it); }
      itens.push({ ui: 'marco', tipo: 'licao', texto: [], graf: [], contar: false, fala: 'agoraVoce', hab: 'f:' + f.id });
      itens.push.apply(itens, misturarRevisao(f, ctx, ind));
      gs.forEach((g) => { if (TRACOS_LETRAS.includes(g)) { const t = G.tracado(f, ctx, { g }); itens.push(t); } });
      return itens;
    };
    const TRACOS_LETRAS = ['A', 'E', 'I', 'O', 'U', 'F', 'V', 'M', 'N', 'L', 'S', 'Z', 'J', 'X', 'P', 'B', 'T', 'D', 'C', 'G'];
    M.TRACOS_LETRAS = TRACOS_LETRAS;

    // ------------------------------------------------------------ REGRA
    G.regra = (f, ctx) => {
      const r = D.regras[f.regra];
      const itens = [G.mostraRegra(f, f.regra)];
      const ind = [];
      for (let k = 0; k < f.n * 3 && ind.length < f.n; k++) {
        const tipo = r.itens[k % r.itens.length];
        let it = null;
        const filtro = (w) => r.tags.some((t) => w.g.includes(t));
        if (tipo === 'somS') it = G.somS(f, ctx);
        else if (tipo === 'leia') it = G.leiaEncontre(f, ctx, { filtro });
        else if (tipo === 'escrita') it = G.escrita(f, ctx, { regra: f.regra });
        else if (tipo === 'perdida') it = G.letraPerdida(f, ctx, { opcoes: r.opcoesPerdida, filtro, grafTag: r.tags[0] });
        if (it) ind.push(it);
      }
      return itens.concat(misturarRevisao(f, ctx, ind));
    };

    // ------------------------------------------------------------ GUARDIÃO
    G.guardiao = (f, ctx) => {
      const mix = embaralhar(f.cfg.mix);
      const ens = M.ensinadas(f.idx);
      const ind = [];
      for (let k = 0; ind.length < f.n && k < f.n * 4; k++) {
        const tipo = mix[k % mix.length];
        let it = null;
        if (tipo === 'somInicial') {
          if (f.mundo === 1) it = G.somInicial(f, ctx, { modo: 'silaba' });
          else { const gs = VOGAIS5.concat(CONS_SIMPLES).filter((g) => ens.has(g) && D.palavras.some((w) => w.ini === g)); it = G.somInicial(f, ctx, { modo: 'som', g: escolher(gs) }); }
        } else if (tipo === 'cacaSom') it = G.cacaSom(f, ctx, { modo: silabasCV(f.idx).length >= 3 ? 'silaba' : 'vogal' });
        else if (tipo === 'palmas') it = G.palmas({ id: f.id, idx: f.idx, mundo: f.mundo, cfg: { min: 1, max: 4 } }, ctx);
        else if (tipo === 'fatiador') it = G.fatiador(f, ctx);
        else if (G[tipo]) it = G[tipo](f, ctx, {});
        if (it) ind.push(it);
      }
      return ind;
    };

    // ------------------------------------------------------------ REVISÃO ESPAÇADA + INTERCALADA
    function itemRevisao(f, ctx, chave, entrada) {
      const [pref, ...resto] = chave.split(':');
      const v = resto.join(':');
      const fOrig = D.fases[entrada.fase] || f;
      const fx = Object.assign({}, f, { cfg: fOrig.cfg });
      switch (pref) {
        case 'p': return (f.mundo >= 3 && W[v] && M.decodavelP(W[v], f.idx)) ? G.leiaEncontre(fx, ctx, { foco: v }) : (W[v] ? G.juntar(fx, ctx, { foco: v }) : null);
        case 'g': return VOGAIS5.includes(v) ? G.cacaSom(fx, ctx, { modo: 'vogal', g: v }) : (CONS_SIMPLES.includes(v) ? G.cacaSom(fx, ctx, { modo: 'silaba', g: v }) : null);
        case 's': return G.cacaSom(fx, ctx, { modo: 'silaba', foco: v });
        case 'par': return G.gemeos(fx, ctx, { foco: resto[0], pares: ['todos'] });
        case 'r': return G.rima(fx, ctx, { foco: v });
        case 'c': return G.palmas(Object.assign({}, fx, { cfg: { min: 1, max: 5 } }), ctx, { foco: v });
        case 'e': return W[v] ? G.escrita(fx, ctx, { foco: v }) : null;
        case 'fr': return G.frase(fx, ctx, { foco: Number(v) });
        case 'm': return G.tirar(fx, ctx, { foco: v });
        case 'fq': return M.freqEnsinadas(f.idx) ? G.freq(fx, ctx, { foco: v }) : null;
        case 'd': return W[v] && M.decodavelP(W[v], f.idx) ? G.ditado(fx, ctx, { foco: v }) : null;
        case 'lp': return W[v] ? G.leiaEncontre(fx, ctx, { foco: v }) : null;
        default: return null;
      }
    }
    function misturarRevisao(f, ctx, itens) {
      if (f.idx === 0 || !itens.length) return itens;
      const nRev = Math.max(1, Math.round(itens.length * 0.25));
      const perfil = ctx.perfil;
      const rev = [];
      // 1) itens vencidos no Leitner (prioriza os com mais erros)
      if (perfil && perfil.leit) {
        const agora = M.agora();
        const venc = Object.entries(perfil.leit).filter(([c, e]) => e.prox <= agora && e.fase < f.idx)
          .sort((a, b) => (b[1].erros - a[1].erros) || (a[1].prox - b[1].prox));
        for (const [c, e] of venc) { if (rev.length >= nRev) break; const it = itemRevisao(f, ctx, c, e); if (it) { it.revisao = true; it.hab = 'f:' + f.id; rev.push(it); } }
      }
      // 2) intercalação com fases anteriores
      const anteriores = D.fases.slice(Math.max(0, f.idx - 8), f.idx).filter((x) => TIPOS_ESCOLHA_SIMPLES.includes(x.tipo) || x.tipo === 'licao' || x.tipo === 'regra');
      for (let k = 0; rev.length < nRev && k < 12 && anteriores.length; k++) {
        const fa = escolher(anteriores);
        const fx = Object.assign({}, f, { cfg: fa.cfg });
        let it = null;
        if (fa.tipo === 'licao') it = itensDoSom(fx, ctx, escolher(fa.g), false);
        else if (fa.tipo === 'regra') { const r = D.regras[fa.regra]; it = r.erros ? G.escrita(fx, ctx, { regra: fa.regra }) : G.leiaEncontre(fx, ctx, { filtro: (w) => r.tags.some((t) => w.g.includes(t)) }); }
        else if (G[fa.tipo]) it = G[fa.tipo](fx, ctx, {});
        if (it) { it.revisao = true; it.hab = 'f:' + f.id; rev.push(it); }
      }
      // 3) item extra adaptativo do par mínimo mais confundido
      if (perfil && perfil.conf) {
        const [pior] = Object.entries(perfil.conf).sort((a, b) => b[1] - a[1]);
        if (pior && pior[1] >= 3) {
          const it = G.gemeos(f, ctx, { pares: [pior[0]] }) || (() => { const [a] = pior[0].split('/'); return CONS_SIMPLES.includes(a) && M.ensinadas(f.idx).has(a) ? G.cacaSom(f, ctx, { modo: 'silaba', g: a }) : null; })();
          if (it) { it.extraPar = true; it.revisao = true; it.hab = 'f:' + f.id; rev.push(it); }
        }
      }
      const out = itens.slice();
      rev.forEach((it) => { const pos = 1 + Math.floor(R() * out.length); out.splice(pos, 0, it); });
      return out;
    }
    M.misturarRevisao = misturarRevisao;

    // ------------------------------------------------------------ GERAR ITENS DA FASE
    M.gerarItens = (idx, perfil) => {
      const f = D.fases[idx];
      const ctx = { perfil };
      if (f.tipo === 'historia') return [{ ui: 'historia', tipo: 'historia', hab: 'f:' + f.id, historia: f.historia, contar: false, texto: [] }];
      if (f.tipo === 'licao') return G.licao(f, ctx);
      if (f.tipo === 'regra') return G.regra(f, ctx);
      if (f.tipo === 'guardiao') return misturarRevisao(f, ctx, G.guardiao(f, ctx));
      if (f.tipo === 'freq') {
        const it = [G.mostraFreq(f)]; const ind = [];
        for (let k = 0; k < f.n; k++) ind.push(G.freq(f, ctx));
        return it.concat(misturarRevisao(f, ctx, ind));
      }
      if (f.tipo === 'memoria' || f.tipo === 'bingo') return [G[f.tipo](f, ctx)];
      const ind = [];
      for (let k = 0; k < f.n * 3 && ind.length < f.n; k++) { const it = G[f.tipo](f, ctx, {}); if (it) ind.push(it); }
      if (f.tipo === 'microfone' || f.tipo === 'tracado') return ind;
      return misturarRevisao(f, ctx, ind);
    };
    M.G = G;
    M.itensDoSom = itensDoSom;
    /** Revisão rápida (oferecida quando o domínio fica abaixo de 85%) */
    M.revisaoRapida = (idx, perfil) => {
      if (idx <= 0) return [];
      const f = D.fases[idx]; const out = [];
      for (let k = 0; k < 12 && out.length < 6; k++) {
        const r = misturarRevisao(f, { perfil }, [{ ui: 'nada' }, { ui: 'nada' }, { ui: 'nada' }, { ui: 'nada' }]).filter((x) => x.ui !== 'nada');
        r.forEach((x) => { x.hab = 'revisao'; out.push(x); });
      }
      return out.slice(0, 6);
    };

    // ------------------------------------------------------------ PERFIL / PROGRESSO
    M.novoPerfil = (nome, avatar) => ({
      id: 'p' + Math.floor(Math.random() * 1e9).toString(36), nome: nome || 'Criança', avatar: avatar || '🦊', criado: M.agora(),
      xp: 0, moedas: 20, fases: {}, liberadas: [], hab: {}, habTipo: {}, graf: {}, conf: {}, confDir: {}, leit: {}, album: {}, medalhas: {},
      stats: { pares: 0, historias: 0, aposErro: 0, ditados: 0, leituras: 0, tresEstrelas: 0, figurinhas: 0, micro: 0, tracos: 0, mundos: 0 },
      tempo: {}, bau: null, loja: { itens: [], equip: {} }, avaliacao: null, demos: {}, ajuste: {}, tr: {}, ultElogios: [], certificados: [], sessaoSeq: 0, historicoFases: []
    });
    const ult10 = (arr, v, n = 10) => { arr.push(v); while (arr.length > n) arr.shift(); return arr; };
    M.registrar = (perfil, item, r) => {
      const out = { categoria: null, novaFigurinha: null, reduziu: false, somNovo: false };
      const ok = !!r.ok;
      if (item.guiado || item.contar === false) { if (r.final) perfil.xp += 2; return out; }
      ult10(perfil.hab[item.hab] = perfil.hab[item.hab] || [], ok ? 1 : 0);
      ult10(perfil.habTipo[item.tipo] = perfil.habTipo[item.tipo] || [], ok ? 1 : 0);
      (item.graf || []).forEach((g) => {
        const st = perfil.graf[g] = perfil.graf[g] || { ult: [], ok: 0, tot: 0 };
        if (ok && st.ok === 0) out.somNovo = true;
        ult10(st.ult, ok ? 1 : 0); st.tot++; if (ok) st.ok++;
      });
      if (ok && r.ms) ult10(perfil.tr[item.tipo] = perfil.tr[item.tipo] || [], r.ms, 20);
      // Leitner
      if (item.chave) {
        const agora = M.agora();
        let e = perfil.leit[item.chave];
        if (!e) e = perfil.leit[item.chave] = { cx: ok ? 1 : 1, prox: agora + DIA, erros: 0, fase: D.fases.findIndex((x) => 'f:' + x.id === item.hab) };
        else if (ok) { if (agora >= e.prox) { e.cx = Math.min(4, e.cx + 1); e.prox = agora + INTERVALOS[e.cx] * DIA; } }
        if (!ok) { e.cx = 1; e.prox = agora + DIA; e.erros++; }
      }
      // pares mínimos
      if (item.par) {
        if (ok) perfil.stats.pares++;
        else if (r.escolhido && r.escolhido.g && item.alvoG && D.parceiro[item.alvoG] === r.escolhido.g) {
          perfil.conf[item.par] = (perfil.conf[item.par] || 0) + 1;
          const k = item.alvoG + '→' + r.escolhido.g; perfil.confDir[k] = (perfil.confDir[k] || 0) + 1;
        }
      }
      // adaptatividade por tipo de minijogo
      const aj = perfil.ajuste[item.tipo] = perfil.ajuste[item.tipo] || { nivel: 0, errSeq: 0, okSeq: 0 };
      if (!ok) { aj.errSeq++; aj.okSeq = 0; if (aj.errSeq >= 3) { aj.nivel = Math.min(2, aj.nivel + 1); aj.errSeq = 0; out.reduziu = true; } }
      else { aj.okSeq++; aj.errSeq = 0; if (aj.okSeq >= 5 && (!r.ms || r.ms < 8000)) { aj.nivel = Math.max(0, aj.nivel - 1); aj.okSeq = 0; } }
      // sequência e XP
      perfil.sessaoSeq = ok ? perfil.sessaoSeq + 1 : 0;
      perfil.xp += ok ? 10 : (r.tent && r.tent <= 2 ? 5 : 3);
      if (!ok && r.final && r.tent > 1 && !r.assistido) perfil.stats.aposErro++;
      if (ok && item.leitura) perfil.stats.leituras++;
      if (ok && item.tipo === 'ditado') perfil.stats.ditados++;
      if (item.tipo === 'tracado' && r.final) perfil.stats.tracos++;
      // álbum de figurinhas (palavra lida/escrita certa 2 vezes)
      if (ok && item.texto && item.texto.length && item.chave && /^(p|d|e):/.test(item.chave)) {
        const p = item.chave.split(':')[1];
        if (W[p]) { perfil.album[p] = (perfil.album[p] || 0) + 1; if (perfil.album[p] === 2) { out.novaFigurinha = p; perfil.stats.figurinhas = Object.values(perfil.album).filter((x) => x >= 2).length; } }
      }
      // categoria do elogio
      const s = perfil.sessaoSeq;
      if (ok) out.categoria = s === 10 ? 'sequencia10' : s === 5 ? 'sequencia5' : s === 3 ? 'sequencia3' : out.somNovo ? 'somNovo' : 'acerto';
      else if (r.final && r.tent > 1 && !r.assistido) out.categoria = 'aposErro';
      else if (r.final) out.categoria = 'acerto';
      return out;
    };
    M.escolherElogio = (perfil, cat) => {
      const lista = D.elogios[cat] || D.elogios.acerto;
      const janela = perfil.ultElogios || (perfil.ultElogios = []);
      const disp = lista.filter((x) => !janela.includes(x));
      const e = escolher(disp.length ? disp : lista);
      janela.push(e); while (janela.length > 5) janela.shift();
      return e;
    };
    M.elogioEspecifico = (item) => {
      if (!item.elogio) return null;
      const tpl = D.elogiosEspecificos[item.elogio.tipo];
      if (!tpl) return null;
      const t = escolher(tpl);
      const segs = [];
      for (const parte of t) {
        if (parte === '{som}') { if (!item.elogio.som) return null; segs.push(S.fon(item.elogio.som)); }
        else if (parte === '{palavra}') { if (!item.elogio.palavra) return null; segs.push(S.p(item.elogio.palavra)); }
        else if (parte === '{silaba}') { if (!item.elogio.silaba) return null; segs.push(S.s(item.elogio.silaba)); }
        else segs.push(S.f(parte));
      }
      return segs;
    };
    M.dominioHab = (perfil, hab) => { const a = perfil.hab[hab] || []; return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0; };
    M.faseLiberada = (perfil, idx) => {
      if (idx === 0) return true;
      const f = D.fases[idx];
      if (perfil.liberadas.includes(f.id)) return true;
      const ant = perfil.fases[D.fases[idx - 1].id];
      return !!(ant && ant.dominada);
    };
    M.concluirFase = (perfil, idx, res) => {
      const f = D.fases[idx];
      const prec = res.total ? res.ok / res.total : 1;
      const estrelas = f.semDominio ? (prec >= 0.95 ? 3 : prec >= 0.7 ? 2 : 1) : (prec >= 0.95 ? 3 : prec >= 0.85 ? 2 : 1);
      const dom = f.semDominio ? true : (prec >= 0.85 && M.dominioHab(perfil, 'f:' + f.id) >= 0.85);
      const reg = perfil.fases[f.id] = perfil.fases[f.id] || { estrelas: 0, jogos: 0, dominada: false, melhor: 0 };
      const primeiraVezDominada = dom && !reg.dominada;
      const tinha3 = reg.estrelas === 3;
      reg.jogos++; reg.melhor = Math.max(reg.melhor, prec); reg.estrelas = Math.max(reg.estrelas, estrelas); reg.dominada = reg.dominada || dom; reg.ultima = M.agora();
      if (estrelas === 3 && !tinha3) perfil.stats.tresEstrelas++;
      // recompensas ligadas ao domínio (não ao tempo de jogo)
      let moedas = estrelas * 3 + (primeiraVezDominada ? 10 : 0);
      perfil.moedas += moedas; perfil.xp += 15 * estrelas;
      let mundoConcluido = false;
      if (f.tipo === 'guardiao' && primeiraVezDominada) { mundoConcluido = true; perfil.stats.mundos++; perfil.certificados.push({ mundo: f.mundo, data: M.agora() }); perfil.moedas += 30; moedas += 30; }
      if (f.tipo === 'historia') perfil.stats.historias++;
      perfil.historicoFases.push({ id: f.id, prec, data: M.agora(), estrelas });
      if (perfil.historicoFases.length > 400) perfil.historicoFases.shift();
      const proxLib = idx + 1 < D.fases.length && M.faseLiberada(perfil, idx + 1);
      // sinal de alerta: 3 tentativas < 60%
      const tent = perfil.historicoFases.filter((h) => h.id === f.id).slice(-3);
      const alerta = tent.length === 3 && tent.every((h) => h.prec < 0.6);
      return { estrelas, prec, dominada: dom, liberouProxima: primeiraVezDominada && proxLib, moedas, mundoConcluido, alerta, perfeita: prec === 1 && res.total > 0 };
    };
    M.nivel = (perfil) => { let n = 0; D.niveis.forEach((x, i) => { if (perfil.xp >= x.xp) n = i; }); return n; };
    M.mapaCalor = (perfil) => {
      const unidades = [];
      D.fases.forEach((f) => (f.novos || []).forEach((t) => { if (t !== 'FREQ' && !unidades.includes(t)) unidades.push(t); }));
      return unidades.map((u) => {
        const st = perfil.graf[u];
        const ult = st ? st.ult : [];
        const p = ult.length ? ult.reduce((a, b) => a + b, 0) / ult.length : null;
        const estado = p === null ? 'novo' : (p >= 0.85 && ult.length >= 5) ? 'domina' : p >= 0.6 ? 'progresso' : 'dificuldade';
        return { u, p, n: st ? st.tot : 0, estado };
      });
    };
    M.verificarMedalhas = (perfil) => {
      const novas = [];
      D.medalhas.forEach((m) => { if (!perfil.medalhas[m.id] && (perfil.stats[m.stat] || 0) >= m.meta) { perfil.medalhas[m.id] = M.agora(); novas.push(m); } });
      return novas;
    };
    M.abrirBau = (perfil) => {
      const hoje = M.hoje();
      if (perfil.bau === hoje) return null;
      perfil.bau = hoje; const m = 15 + Math.floor(R() * 16); perfil.moedas += m; return m;
    };

    // ------------------------------------------------------------ AVALIAÇÃO INICIAL (≈5 min)
    M.itensAvaliacao = () => {
      const f0 = Object.assign({}, D.fases[0], { idx: 0 });
      const fV = Object.assign({}, D.fases[D.fases.findIndex((x) => x.id === '2.10')]);
      const fS = Object.assign({}, D.fases[D.fases.findIndex((x) => x.id === '4.6')]);
      const ctx = { perfil: null };
      const it = [];
      for (let k = 0; k < 3; k++) it.push(Object.assign(G.somInicial(f0, ctx, { modo: 'silaba' }), { bloco: 'cf' }));
      for (let k = 0; k < 2; k++) it.push(Object.assign(G.palmas(Object.assign({}, f0, { cfg: { min: 1, max: 4 } }), ctx), { bloco: 'cf' }));
      const vs = embaralhar(VOGAIS5).slice(0, 4);
      vs.forEach((v) => it.push(Object.assign(G.cacaSom(fV, ctx, { modo: 'vogal', g: v, n: 4 }), { bloco: 'vogais' })));
      ['MA', 'FO', 'LU', 'VE'].forEach((s) => it.push(Object.assign(G.cacaSom(D.fases[D.fases.findIndex((x) => x.id === '3.10')], ctx, { modo: 'silaba', foco: s, n: 3 }), { bloco: 'silabas' })));
      ['BOLA', 'MALA'].forEach((p) => it.push(Object.assign(G.leiaEncontre(fS, ctx, { foco: p }), { bloco: 'palavras' })));
      it.forEach((x) => { x.hab = 'avaliacao'; x.avaliacao = true; });
      return it;
    };
    M.posicionar = (perfil, resultados) => {
      const sc = {}; const tot = {};
      resultados.forEach((r) => { tot[r.bloco] = (tot[r.bloco] || 0) + 1; sc[r.bloco] = (sc[r.bloco] || 0) + (r.ok ? 1 : 0); });
      const p = (b) => (tot[b] ? sc[b] / tot[b] : 0);
      let mundo = 1;
      if (p('cf') >= 0.8) { mundo = 2; if (p('vogais') >= 0.75) { mundo = 3; if (p('silabas') >= 0.75 && p('palavras') >= 1) mundo = 4; } }
      const primeiraDoMundo = D.fases.findIndex((f) => f.mundo === mundo);
      for (let i = 0; i <= primeiraDoMundo; i++) if (!perfil.liberadas.includes(D.fases[i].id)) perfil.liberadas.push(D.fases[i].id);
      perfil.avaliacao = { data: M.agora(), blocos: Object.keys(tot).map((b) => ({ bloco: b, acertos: sc[b], total: tot[b] })), mundoInicial: mundo };
      return perfil.avaliacao;
    };
    return M;
  }

  raiz.criarMotor = criarMotor;
  if (typeof module !== 'undefined' && module.exports) module.exports = criarMotor;
})(typeof window !== 'undefined' ? window : globalThis);
