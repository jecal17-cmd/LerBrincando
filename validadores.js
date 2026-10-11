/* ==========================================================================
   Ler Brincando — validadores.js
   Modo de autoteste (index.html?debug=1 ou Área dos Pais): V1–V12.
   Também roda no Node:  node ferramentas/testar.js
   ========================================================================== */
(function (raiz) {
  'use strict';
  const N = raiz.Nucleo || (typeof require !== 'undefined' ? require('./nucleo.js') : null);

  /** Lista de tudo que precisa existir no Banco de Áudio (espelhada no gerar_audios.py) */
  function listaAudios(D) {
    const it = new Map();
    const add = (tipo, texto, extra) => { if (!texto) return; const k = tipo + '_' + N.slug(texto); if (!it.has(k)) it.set(k, Object.assign({ tipo, texto, chave: k }, extra || {})); };
    const silabasDe = (sils) => sils.forEach((s) => add('silaba', N.maiusc(s)));
    D.palavras.forEach((w) => { add('palavra', w.p); silabasDe(w.s); });
    D.frequentes.forEach((f) => { add('palavra', f.replace(/-/g, '')); silabasDe(f.split('-')); });
    D.historias.forEach((h) => {
      add('frase', h.intro); add('frase', h.titulo);
      h.perguntas.forEach((q) => { add('frase', q.t); if (q.explica) add('frase', q.explica); });
      h.frases.forEach((fr, i) => {
        if (h.oral) { add('frase', fr.t); if (fr.rima) { fr.rima.op.forEach((p) => add('palavra', p)); add('frase', fr.rima.antes); add('palavra', fr.rima.com); } return; }
        N.tokenizarFrase(fr.t).filter((x) => x.tipo === 'palavra').forEach((tk) => { add('palavra', N.maiusc(tk.palavra)); silabasDe(tk.silabas); });
        add('hist', h.id + '_' + i, { frase: fr.t, karaoke: true });
        if (fr.lac) fr.lac.op.forEach((o) => (fr.lac.s !== undefined ? add('silaba', o) : add('fonema', o)));
      });
    });
    D.frases.forEach((fr, i) => {
      N.tokenizarFrase(fr.t).filter((x) => x.tipo === 'palavra').forEach((tk) => { add('palavra', N.maiusc(tk.palavra)); silabasDe(tk.silabas); });
      add('frasejogo', String(i), { frase: fr.t, karaoke: true });
    });
    D.tirar.forEach((m) => { add('palavra', m.de.replace(/-/g, '')); add('palavra', m.fica); if (m.modo === 'silaba') add('silaba', m.tira); });
    D.trocar.forEach((m) => { add('palavra', m.de.replace(/-/g, '')); add('silaba', m.troca); add('silaba', m.por); });
    // grade de sílabas CV de todas as consoantes simples
    ['F', 'V', 'M', 'N', 'L', 'S', 'Z', 'J', 'X', 'P', 'B', 'T', 'D', 'C', 'G'].forEach((c) => ['A', 'E', 'I', 'O', 'U'].forEach((v) => {
      if ((c === 'C' || c === 'G') && (v === 'E' || v === 'I')) return; add('silaba', c + v);
    }));
    Object.keys(D.fonemas).forEach((g) => { if (D.fonemas[g].tipo !== 'oclusiva') add('fonema', g, { continua: D.fonemas[g].tipo === 'continua' }); });
    Object.keys(D.nomesLetras).forEach((l) => add('nome', l, { fala: D.nomesLetras[l] }));
    const frases = [].concat(Object.values(D.falas), Object.values(D.instrucoes), Object.values(D.dicasTipo), Object.values(D.dicasPares), Object.values(D.dicasFonema));
    Object.values(D.regras).forEach((r) => { frases.push(r.explica, r.titulo); });
    Object.values(D.elogios).forEach((l) => l.forEach((e) => frases.push(e)));
    Object.values(D.elogiosEspecificos).forEach((l) => l.forEach((t) => t.forEach((p) => { if (!/^\{/.test(p)) frases.push(p); })));
    D.fases.forEach((f) => frases.push(f.nome));
    D.mundos.forEach((m) => frases.push(m.nome));
    D.niveis.forEach((n) => frases.push(n.nome));
    D.medalhas.forEach((m) => frases.push(m.nome));
    frases.forEach((t) => add('frase', t));
    return Array.from(it.values());
  }

  function rodar(D, criarMotor, opcoes) {
    opcoes = opcoes || {};
    const manifest = opcoes.manifest || null;
    const seeds = opcoes.seeds || 4;
    const M = criarMotor(D);
    const rel = [];
    const reg = (id, nome, ok, detalhes, extra) => rel.push(Object.assign({ id, nome, status: ok === null ? 'PENDENTE' : ok ? 'APROVADO' : 'REPROVADO', detalhes: detalhes || [] }, extra || {}));

    // ---------------- V1 Integridade silábica
    {
      const prob = [];
      D.palavras.forEach((w) => { if (w.s.join('') !== w.p) prob.push(w.p + ' ≠ ' + w.s.join('-')); });
      D.frequentes.forEach((f) => { if (!f.split('-').join('')) prob.push(f); });
      reg('V1', 'Integridade silábica', prob.length === 0, prob, { resumo: `${D.palavras.length} palavras conferidas` });
    }
    // ---------------- geração de itens em várias sementes (base para V2, V7, V9)
    const perfilBase = M.novoPerfil('teste', '🦊');
    const itensPorFase = [];
    for (let s = 1; s <= seeds; s++) {
      M.usarRng(N.rngSemente(1000 + s));
      D.fases.forEach((f, i) => { const its = M.gerarItens(i, perfilBase) || []; (itensPorFase[i] = itensPorFase[i] || []).push(...its); });
    }
    M.usarRng(Math.random);
    // ---------------- V2 Decodificabilidade das fases
    {
      const prob = []; let nPal = 0;
      D.fases.forEach((f, i) => {
        if (f.oral) return;
        itensPorFase[i].forEach((it) => (it.frasesTexto || []).forEach((t) => { const r = M.fraseDecodavel({ t }, i); nPal += r.total; if (r.pct < 0.95 || !r.excOk) prob.push(`${f.id}: frase "${N.fraseLimpa(t)}" ${(r.pct * 100).toFixed(0)}% decodificável`); }));
        itensPorFase[i].forEach((it) => (it.texto || []).forEach((p) => {
          nPal++;
          const w = M.W[p];
          const ehFreq = M.FREQ.includes(p) && M.freqEnsinadas(i);
          if (ehFreq) return;
          if (!w) { prob.push(`${f.id}: "${p}" fora do banco`); return; }
          if (!M.decodavelP(w, i)) prob.push(`${f.id}: ${p} usa ${w.g.filter((t) => !M.ensinadas(i).has(t)).join(',')} ainda não ensinado(s)`);
        }));
      });
      reg('V2', 'Decodificabilidade das fases', prob.length === 0, Array.from(new Set(prob)), { resumo: `${nPal} usos de palavras escritas verificados em ${seeds} gerações` });
    }
    // ---------------- V3 Decodificabilidade das histórias
    {
      const prob = []; const tabela = [];
      D.historias.forEach((h) => {
        const idx = D.fases.findIndex((f) => f.historia === h.id);
        if (h.oral) { tabela.push({ id: h.id, titulo: h.titulo, mundo: h.mundo, pct: null, exc: [], obs: 'história oral (sem texto escrito)' }); return; }
        let tot = 0, ok = 0; const exc = [];
        h.frases.forEach((fr) => { const r = M.fraseDecodavel(fr, idx); tot += r.total; ok += r.ok; exc.push(...r.exc); });
        const pct = tot ? ok / tot : 1;
        const excFora = exc.filter((p) => !(M.freqEnsinadas(idx) && M.FREQ.includes(N.maiusc(p))));
        tabela.push({ id: h.id, titulo: h.titulo, mundo: h.mundo, pct, exc, palavras: tot });
        if (pct < 0.95 || excFora.length) prob.push(`${h.id} (${h.titulo}): ${(pct * 100).toFixed(1)}% decodificável; exceções fora da lista: ${excFora.join(', ') || '—'}`);
        // lacunas: opções únicas e resposta presente
        h.frases.forEach((fr, i) => { if (fr.lac) { const w = fr.lac.p; const parte = fr.lac.s !== undefined ? null : w[fr.lac.l]; if (parte && parte !== fr.lac.op[0]) prob.push(`${h.id} frase ${i + 1}: lacuna inconsistente`); } });
      });
      D.frases.forEach((fr, i) => { const idx = D.fases.findIndex((f) => f.mundo === fr.m && f.tipo === 'frase'); const r = M.fraseDecodavel(fr, idx); if (r.pct < 0.95 || !r.excOk) prob.push(`Frase ${i + 1} (mundo ${fr.m}): ${(r.pct * 100).toFixed(0)}%, exceções ${r.exc.join(',')}`); });
      reg('V3', 'Decodificabilidade das histórias e frases', prob.length === 0, prob, { tabela });
    }
    // ---------------- V4 Pares mínimos
    {
      const prob = [];
      D.pares.forEach((x) => {
        const a = M.W[x.a], b = M.W[x.b];
        if (!a || !b) { prob.push(`${x.a}/${x.b}: palavra fora do banco`); return; }
        if (!a.e || !b.e) prob.push(`${x.a}/${x.b}: sem imagem`);
        const ga = N.grafemas(a.p), gb = N.grafemas(b.p);
        const dif = ga.length === gb.length ? ga.filter((g, i) => g !== gb[i]).length : 99;
        if (dif !== 1) prob.push(`${x.a}/${x.b}: diferem em ${dif === 99 ? 'tamanho' : dif} grafemas`);
      });
      reg('V4', 'Pares mínimos', prob.length === 0, prob, { resumo: `${D.pares.length} pares; ${Array.from(new Set(D.pares.map((p) => p.par))).join(', ')}` });
    }
    // ---------------- V5 Imagens
    {
      const prob = [];
      D.palavras.forEach((w) => { if (!w.e || !/^[0-9A-F]{4,5}(-[0-9A-F]{4,5})*$/.test(w.om || '')) prob.push(w.p); });
      const emojis = {}; D.palavras.forEach((w) => { (emojis[w.e] = emojis[w.e] || []).push(w.p); });
      const dup = Object.entries(emojis).filter(([, v]) => v.length > 1).map(([e, v]) => e + ' ' + v.join('/'));
      reg('V5', 'Imagens', prob.length === 0, prob.concat(dup.map((d) => 'emoji repetido: ' + d)), { resumo: `${D.palavras.length} palavras com emoji e código OpenMoji; ${dup.length} emojis repetidos` });
    }
    // ---------------- V6 Banco de elogios
    {
      const prob = []; const todas = new Set(); let dups = 0;
      Object.entries(D.elogios).forEach(([c, l]) => { if (l.length < 15) prob.push(`${c}: ${l.length} frases`); l.forEach((e) => { if (todas.has(e)) { dups++; prob.push('repetida: ' + e); } todas.add(e); }); });
      // simulação de 50 acertos seguidos: nenhuma repetição na janela de 5 (T16)
      const p = M.novoPerfil('x'); const hist = [];
      for (let k = 0; k < 50; k++) { const e = M.escolherElogio(p, 'acerto'); if (hist.slice(-5).includes(e)) prob.push('repetição na janela de 5: ' + e); hist.push(e); }
      reg('V6', 'Banco de elogios', prob.length === 0, prob, { resumo: Object.entries(D.elogios).map(([c, l]) => `${c}: ${l.length}`).join(' · ') });
    }
    // ---------------- V7 Distratores
    {
      const prob = []; let n = 0;
      itensPorFase.forEach((its, i) => its.forEach((it) => {
        if (it.ui !== 'escolha') return; n++;
        const ops = it.opcoes || [];
        const ids = ops.map((o) => o.id);
        if (ops.length < 2 || ops.length > 4) prob.push(`${D.fases[i].id}/${it.tipo}: ${ops.length} opções`);
        if (new Set(ids).size !== ids.length) prob.push(`${D.fases[i].id}/${it.tipo}: opções repetidas ${ids.join(',')}`);
        if (!ids.includes(it.certo)) prob.push(`${D.fases[i].id}/${it.tipo}: resposta ausente`);
        const imgs = ops.filter((o) => o.img).map((o) => o.img);
        if (new Set(imgs).size !== imgs.length) prob.push(`${D.fases[i].id}/${it.tipo}: imagens iguais em opções diferentes`);
        if (it.tipo === 'rima') { const c = M.W[it.certo]; ops.forEach((o) => { if (o.id !== it.certo && M.W[o.id] && M.W[o.id].rima === c.rima) prob.push(`${D.fases[i].id}: distrator também rima (${o.id})`); }); }
      }));
      reg('V7', 'Distratores', prob.length === 0, Array.from(new Set(prob)), { resumo: `${n} itens de escolha verificados` });
    }
    // ---------------- V8 Volume de conteúdo
    {
      const TIPOS = ['somInicial', 'cacaSom', 'gemeos', 'palmas', 'trem', 'fabrica', 'fatiador', 'trocaLetra', 'letraPerdida', 'ditado', 'leiaEncontre', 'memoria', 'rima', 'tracado', 'microfone', 'bingo', 'frase'];
      const usados = new Set();
      itensPorFase.forEach((its) => its.forEach((it) => usados.add(it.tipo)));
      D.fases.forEach((f) => usados.add(f.tipo));
      const presentes = TIPOS.filter((t) => usados.has(t));
      const extras = Array.from(usados).filter((t) => !TIPOS.includes(t));
      const ok = D.palavras.length >= 300 && D.fases.length >= 80 && D.historias.length >= 10 && presentes.length >= 15;
      reg('V8', 'Volume de conteúdo', ok, ok ? [] : ['abaixo do mínimo'], { resumo: `${D.palavras.length} palavras · ${D.fases.length} fases · ${D.historias.length} histórias · ${presentes.length}/17 minijogos da lista (+ ${extras.join(', ')})` });
    }
    // ---------------- V9 Sequência
    {
      const prob = [];
      const tagLetra = (l) => l;
      D.fases.forEach((f, i) => {
        const ens = M.ensinadas(i);
        (f.g || []).forEach((g) => { if (!ens.has(g)) prob.push(`${f.id}: ${g} não introduzido`); });
        if (f.regra) D.regras[f.regra].tags.forEach((t) => { if (!ens.has(t)) prob.push(`${f.id}: regra usa ${t} não introduzido`); });
        ((f.cfg && f.cfg.pares) || []).forEach((p) => { if (p !== 'todos') p.split('/').forEach((l) => { if (!ens.has(tagLetra(l))) prob.push(`${f.id}: par ${p} usa ${l} antes de ensinar`); }); });
        if (f.mundo >= 2) itensPorFase[i].forEach((it) => (it.graf || []).forEach((g) => {
          const gg = ['É', 'Ê'].includes(g) ? 'E' : ['Ó', 'Ô'].includes(g) ? 'O' : g;
          if (!ens.has(gg)) prob.push(`${f.id}/${it.tipo}: referencia ${g} antes de ser ensinado`);
        }));
      });
      reg('V9', 'Sequência', prob.length === 0, Array.from(new Set(prob)), { resumo: 'ordem de ensino: ' + Object.entries(D.ordemEnsino).sort((a, b) => a[1] - b[1]).map(([t, i]) => `${t}@${D.fases[i].id}`).join(' ') });
    }
    // ---------------- V10 Simulação de jogador
    {
      const prob = [];
      const simular = (taxa, seed, maxRepeticoes) => {
        const Mb = criarMotor(D); const r = N.rngSemente(seed); Mb.usarRng(r);
        const p = Mb.novoPerfil('bot'); let idx = 0; let jogadas = 0; let presoSemSaida = false; let andaimes = 0; let reducoes = 0; let tentativasMax = 0; const repet = {};
        while (idx < D.fases.length && jogadas < 2000) {
          if (!Mb.faseLiberada(p, idx)) { presoSemSaida = true; break; }
          const itens = Mb.gerarItens(idx, p); jogadas++;
          let ok = 0, tot = 0;
          itens.forEach((it) => {
            const contar = it.contar !== false && !it.guiado;
            if (it.ui === 'historia') { const h = D.historias.find((x) => x.id === it.historia); const nInt = h.frases.filter((f) => f.lac || f.rima).length + h.perguntas.length; for (let k = 0; k < nInt; k++) { const a = r() < taxa; Mb.registrar(p, { tipo: 'historia', hab: it.hab, contar: true, graf: [] }, { ok: a, final: true, tent: a ? 1 : 2 }); tot++; ok += a ? 1 : 0; } return; }
            if (!contar) return;
            const partes = it.multi ? (it.pares || (it.chamadas && it.chamadas.length) || 1) : 1;
            for (let k = 0; k < partes; k++) {
              // andaime: até 3 tentativas — 1ª livre, 2ª com dica e menos opções, 3ª com a resposta destacada
              // andaime: 1º erro → repete mais devagar; 2º erro → dica específica e menos opções; 3º erro → resposta destacada
              let tent = 1; let acertou = r() < taxa;
              while (!acertou && tent < 4) { tent++; andaimes++; acertou = tent === 4 ? true : r() < Math.min(0.95, taxa + 0.15 * (tent - 1)); }
              tentativasMax = Math.max(tentativasMax, tent);
              const res = Mb.registrar(p, it, { ok: tent === 1, tent, final: true, ms: 3000, assistido: tent === 4 });
              if (res.reduziu) reducoes++;
              tot++; if (tent === 1) ok++;
            }
          });
          const fim = Mb.concluirFase(p, idx, { ok, tot, total: tot });
          if (fim.dominada || p.fases[D.fases[idx].id].dominada) idx++;
          else { repet[idx] = (repet[idx] || 0) + 1; if (repet[idx] >= maxRepeticoes) break; Mb.offsetDias += 1; }
        }
        return { faseFinal: idx, jogadas, presoSemSaida, andaimes, reducoes, tentativasMax, nivelAjuste: Object.values(p.ajuste).reduce((a, x) => Math.max(a, x.nivel), 0), concluiu: idx >= D.fases.length };
      };
      const b100 = simular(1, 7, 3);
      const b50 = simular(0.5, 11, 6);
      const b90 = simular(0.9, 13, 8);
      if (!b100.concluiu) prob.push(`Bot 100% parou na fase ${D.fases[b100.faseFinal] && D.fases[b100.faseFinal].id}`);
      if (b50.presoSemSaida) prob.push('Bot 50% ficou sem fase jogável');
      if (b50.andaimes === 0 || b50.reducoes === 0) prob.push('Bot 50% não recebeu andaimes/redução de dificuldade');
      if (b50.tentativasMax > 4) prob.push('Item exigiu mais de 4 toques (3 níveis de andaime)');
      reg('V10', 'Simulação de jogador', prob.length === 0, prob, {
        resumo: `Bot 100%: concluiu ${b100.faseFinal}/${D.fases.length} fases em ${b100.jogadas} jogadas. ` +
          `Bot 90%: chegou à fase ${D.fases[b90.faseFinal] ? D.fases[b90.faseFinal].id : 'final (concluiu)'} em ${b90.jogadas} jogadas (rejogando quando < 85%). ` +
          `Bot 50%: ${b50.andaimes} andaimes, ${b50.reducoes} reduções de dificuldade (nível máx. ${b50.nivelAjuste}), máx. ${b50.tentativasMax} tentativas por item, ` +
          `parou por domínio < 85% na fase ${D.fases[b50.faseFinal] ? D.fases[b50.faseFinal].id : 'fim'} com a fase sempre rejogável e revisão oferecida (sem beco sem saída).`
      });
    }
    // ---------------- V11 Cobertura do Banco de Áudio
    {
      const lista = listaAudios(D);
      if (!manifest) reg('V11', 'Cobertura do Banco de Áudio', null, ['Banco de Áudio não instalado (pasta audio/ ausente). Rode gerar_audios.py.'], { resumo: `${lista.length} itens de áudio necessários` });
      else {
        const prob = [];
        const itens = manifest.itens || {};
        lista.forEach((x) => { if (!itens[x.chave]) prob.push('ausente: ' + x.chave); });
        Object.entries(itens).forEach(([k, v]) => {
          if (v.pico !== undefined && v.pico < -40) prob.push('silencioso: ' + k);
          if (v.lufs !== undefined && (v.lufs < -18 || v.lufs > -14)) prob.push(`volume fora de −16±2 LUFS: ${k} (${v.lufs})`);
        });
        Object.keys(D.fonemas).filter((g) => D.fonemas[g].tipo === 'continua').forEach((g) => { const k = 'fonema_' + N.slug(g); if (!itens[k] || (itens[k].ms || 0) < 600) prob.push('fonema contínuo sem versão prolongada: ' + g); });
        reg('V11', 'Cobertura do Banco de Áudio', prob.length === 0, prob.slice(0, 200), { resumo: `${lista.length} necessários · ${Object.keys(itens).length} no manifest` });
      }
    }
    // ---------------- V12 Tempos do karaokê
    {
      if (!manifest) reg('V12', 'Tempos do karaokê', null, ['Sem manifest: o karaokê usa a alternativa (uma fala por palavra/sílaba, encadeadas por onend).']);
      else {
        const prob = [];
        Object.entries(manifest.itens || {}).forEach(([k, v]) => {
          if (!v.palavras) return;
          let ant = -1;
          v.palavras.forEach((pw, i) => { if (pw.ini < ant || pw.fim <= pw.ini) prob.push(`${k}: palavra ${i} fora de ordem`); ant = pw.fim; if (pw.fim > v.ms + 5) prob.push(`${k}: palavra ${i} passa da duração`); });
          (v.silabas || []).forEach((ss, i) => { let a2 = v.palavras[i] ? v.palavras[i].ini - 1 : -1; ss.forEach((s) => { if (s.ini < a2 || s.fim <= s.ini) prob.push(`${k}: sílaba fora de ordem na palavra ${i}`); a2 = s.fim; }); });
        });
        reg('V12', 'Tempos do karaokê', prob.length === 0, prob);
      }
    }
    const ordem = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12'];
    rel.sort((a, b) => ordem.indexOf(a.id) - ordem.indexOf(b.id));
    const geral = rel.some((r) => r.status === 'REPROVADO') ? 'REPROVADO' : rel.some((r) => r.status === 'PENDENTE') ? 'APROVADO (com pendências de áudio)' : 'APROVADO';
    return { geral, data: new Date().toISOString(), relatorio: rel, itensPorFase };
  }

  const Validadores = { rodar, listaAudios };
  raiz.Validadores = Validadores;
  if (typeof module !== 'undefined' && module.exports) module.exports = Validadores;
})(typeof window !== 'undefined' ? window : globalThis);
