/* ==========================================================================
   Ler Brincando — minijogos.js
   Renderizadores de cada tipo de item. Cada um devolve uma lista de resultados
   [{ ok, tent, ms, escolhido, assistido, final }] (ok = acertou de primeira).
   Andaime em 3 níveis: 1º erro → repete mais devagar; 2º erro → dica específica
   e menos opções; 3º erro → resposta destacada para a criança tocar.
   ========================================================================== */
(function () {
  'use strict';
  const { Store, Som, Efeito, Micro, Motor, D, N, el, fmt, fig, mascote, animarMascote, dormir, estado, mostrarAmbas, toast } = window.LB;
  const S = Motor.S;
  const MJ = {};

  // ------------------------------------------------------------ utilidades
  /** Espera algo acontecer, mas aborta se a criança sair da fase */
  function aguardar(ctx, registrar) {
    return new Promise((res, rej) => {
      if (ctx.sinal.aborted) return rej(new Error('abortado'));
      ctx.sinal.addEventListener('abort', () => rej(new Error('abortado')), { once: true });
      registrar(res);
    });
  }
  const falar = (segs, opc) => Som.falar(segs, opc);
  /** Palavra em "chips" de sílaba: tocar na sílaba fala a sílaba */
  function palavraChips(silabas, opc = {}) {
    const box = el('div', { class: 'palavra', role: 'group', 'aria-label': 'palavra' });
    let pos = 0;
    silabas.forEach((s, i) => {
      const chip = el('button', { class: 'chip', type: 'button', 'aria-label': 'sílaba ' + s });
      [...s].forEach((ch, k) => {
        const p = pos + k;
        let span = el('span', null, fmt(ch));
        if (opc.destaque && N.maiusc(ch) === opc.destaque) span.className = 'dest';
        if (opc.troca && opc.troca.pos === p) span.className = 'troca';
        chip.append(span);
      });
      chip.addEventListener('click', (e) => { e.stopPropagation(); Efeito.tocar('clique'); falar([S.s(s)]); chip.classList.add('on'); setTimeout(() => chip.classList.remove('on'), 600); });
      box.append(chip); pos += s.length;
    });
    if (opc.ambas !== false && mostrarAmbas() && Store.cfg.caixa !== 'baixa') box.append(el('div', { class: 'minus' }, silabas.join('').toLocaleLowerCase('pt-BR')));
    return box;
  }
  MJ.palavraChips = palavraChips;
  function letraGrande(g, falarAoTocar = true) {
    const b = el('button', { class: 'letra-grande', type: 'button', 'aria-label': 'letra ' + g }, fmt(g));
    if (Store.cfg.caixa !== 'baixa' && g.length === 1) b.append(el('small', null, g.toLocaleLowerCase('pt-BR')));
    if (falarAoTocar) b.addEventListener('click', () => falar([S.fon(g)]));
    return b;
  }
  function visorEl(item, ctx) {
    const v = item.visor || {}; const box = el('div', { class: 'visor' });
    if (v.img && !v.palavra) {
      const f = el('button', { class: 'figura btn', type: 'button', 'aria-label': 'figura', style: { background: 'transparent', boxShadow: 'none' } }, fig(v.img));
      f.addEventListener('click', () => (v.fala ? falar([S.p(v.fala)]) : ctx.falarPedido()));
      box.append(f);
    }
    if (v.letra) box.append(letraGrande(v.letra, !!v.falaFonema));
    if (v.icone) { const b = el('button', { class: 'figura btn', type: 'button', 'aria-label': 'ouvir de novo', style: { background: 'transparent', boxShadow: 'none' } }, v.icone); b.addEventListener('click', () => ctx.falarPedido()); box.append(b); }
    if (v.palavra) {
      if (v.troca) {
        const linha = el('div', { class: 'acoes' });
        if (v.img) linha.append(fig(v.img, 'figura'));
        box.append(linha);
      } else if (v.img) box.append(fig(v.img, 'figura'));
      box.append(palavraChips(v.silabas, { destaque: v.destaque, troca: v.troca }));
      if (v.troca) {
        const antiga = v.palavra[v.troca.pos];
        box.append(el('div', { class: 'acoes', style: { alignItems: 'center', fontSize: '2rem', fontWeight: 700 } }, el('span', { class: 'chip' }, fmt(antiga)), '➡️', letraGrande(v.troca.nova)));
      }
    }
    if (v.lacuna) {
      if (v.img) box.append(fig(v.img, 'figura'));
      const p = v.lacuna.palavra; const w = el('div', { class: 'palavra' });
      w.append(el('span', { class: 'chip' }, fmt(p.slice(0, v.lacuna.pos)) || '\u00a0'));
      const lac = el('span', { class: 'chip lacuna-chip' }, el('span', { class: 'lacuna' }, '_'.repeat(v.lacuna.tam)));
      w.append(lac);
      const fim = p.slice(v.lacuna.pos + v.lacuna.tam);
      if (fim) w.append(el('span', { class: 'chip' }, fmt(fim)));
      box.append(w); ctx.lacunaEl = lac;
    }
    if (v.blocos) {
      const linha = el('div', { class: 'palavra' });
      v.blocos.forEach((s) => { const c = el('button', { class: 'chip', type: 'button' }, fmt(s)); c.addEventListener('click', () => falar([S.s(s)])); linha.append(c); });
      const juntar = el('button', { class: 'btn mini', type: 'button' }, '🔗 ', D.falas.juntar);
      juntar.addEventListener('click', async () => {
        linha.style.gap = '0'; linha.querySelectorAll('.chip').forEach((c) => { c.classList.add('on'); });
        for (const s of v.blocos) await falar([S.s(s)]);
        linha.querySelectorAll('.chip').forEach((c) => c.classList.remove('on'));
      });
      box.append(linha, juntar);
    }
    if (v.frase) box.append(fraseLeitura(v.frase));
    return box;
  }
  /** Frase para leitura com sílabas tocáveis (sem áudio automático) */
  function fraseLeitura(texto) {
    const box = el('div', { class: 'texto-hist' });
    N.tokenizarFrase(texto).forEach((tk) => {
      if (tk.tipo === 'pont') { if (tk.texto.trim()) (box.lastChild && box.lastChild.classList && box.lastChild.classList.contains('pal-h') ? box.lastChild : box).append(el('span', { 'aria-hidden': 'true' }, tk.texto.trim())); return; }
      const b = el('span', { class: 'pal-h' });
      tk.silabas.forEach((s) => { const sp = el('span', { class: 'sil', role: 'button', tabindex: '0' }, fmt(s)); sp.addEventListener('click', () => { falar([S.s(s)]); sp.classList.add('on'); setTimeout(() => sp.classList.remove('on'), 500); }); b.append(sp); });
      box.append(b);
    });
    return box;
  }
  function opcaoEl(o) {
    const b = el('button', { class: 'opcao', type: 'button', 'data-id': o.id, 'aria-label': o.txt ? 'opção ' + o.txt : 'opção' });
    if (o.cena) b.append(fig(o.img, 'cena'));
    else if (o.img) b.append(fig(o.img));
    if (o.txt) b.append(el('span', { class: 'txt' }, o.silabas ? fmt(o.txt) : (o.txt.length <= 3 || /^[A-ZÀ-Ú🐍🐝 ]+$/.test(o.txt) ? fmt(o.txt) : o.txt)));
    if (o.sub) b.append(el('span', { class: 'sub' }, o.sub));
    return b;
  }
  /** Mãozinha animada (demonstração na primeira vez) */
  async function mostrarMao(alvo) {
    if (!alvo) return;
    const r = alvo.getBoundingClientRect();
    const mao = el('div', { class: 'mao', 'aria-hidden': 'true' }, '👆');
    mao.style.left = (innerWidth / 2) + 'px'; mao.style.top = (innerHeight - 80) + 'px';
    document.body.append(mao); await dormir(50);
    mao.style.left = (r.left + r.width / 2 - 20) + 'px'; mao.style.top = (r.top + r.height / 2) + 'px';
    await dormir(1000); alvo.classList.add('destaque'); await dormir(700); alvo.classList.remove('destaque'); mao.remove();
  }
  MJ.mostrarMao = mostrarMao;

  /** Dica específica (andaime nível 2): par mínimo, regra ou dica do tipo */
  async function dicaEspecifica(item, escolhido) {
    const segs = [];
    let par = null;
    if (escolhido && escolhido.g && item.alvoG && D.parceiro[item.alvoG] === escolhido.g) par = D.parDe[item.alvoG] || item.par;
    if (!par && item.par && escolhido && escolhido.g) par = item.par;
    if (escolhido && escolhido.falar && item.tipo !== 'leiaEncontre' && item.tipo !== 'frase') segs.push(escolhido.falar, S.pausa(300));
    if (par && D.dicasPares[par]) {
      segs.push(S.f(D.dicasPares[par]));
      if (item.tipo === 'gemeos') { segs.push(S.pausa(300), S.p(item.certo)); }
      else if (item.alvoG && escolhido.g && escolhido.g.length <= 2) segs.push(S.pausa(300), S.fon(item.alvoG), S.pausa(300), S.fon(escolhido.g));
    } else if (item.regra && D.regras[item.regra]) segs.push(S.f(D.regras[item.regra].explica));
    else segs.push(S.f(D.dicasTipo[item.tipo] || D.falas.tenteNovo));
    await falar(segs);
  }
  MJ.dicaEspecifica = dicaEspecifica;

  // ======================================================================
  // ESCOLHA (a maioria dos minijogos)
  // ======================================================================
  MJ.escolha = async (item, ctx) => {
    const palco = ctx.palco;
    const visor = visorEl(item, ctx);
    const grade = el('div', { class: 'opcoes', role: 'group', 'aria-label': 'opções' });
    const botoes = item.opcoes.map((o) => { const b = opcaoEl(o); grade.append(b); return { o, b }; });
    if (botoes.length === 2) grade.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
    palco.append(visor, grade);
    const certoBtn = botoes.find((x) => x.o.id === item.certo).b;
    estado.esperado = item.certo; // gancho para testes automatizados
    // apoio de áudio extra quando o nível de ajuste está alto
    const apoio = Motor.nivelApoio(Store.perfil, item.tipo);
    if (item.guiado || ctx.demo) {
      if (ctx.demo) { await falar([S.fala('demo')]); await mostrarMao(certoBtn); }
      certoBtn.classList.add('destaque');
      await falar([S.fala('jogoJuntoToque')]);
    }
    const esperarToque = () => aguardar(ctx, (res) => botoes.forEach(({ o, b }) => { b.onclick = () => res(o); }));
    let proximo = esperarToque(); // a criança pode tocar a qualquer momento (o toque interrompe a fala)
    (async () => {
      await ctx.falarPedido();
      if (apoio >= 2 && !item.semAudioPalavra) for (const x of botoes) if (x.o.falar && !x.o.cena && !ctx.respondeu) { x.b.classList.add('destaque'); await falar([x.o.falar]); x.b.classList.remove('destaque'); }
    })().catch(() => {});
    const t0 = performance.now();
    let tent = 0, primeiroErro = null, assistido = false;
    for (;;) {
      const o = await proximo; ctx.respondeu = true; Som.parar(); botoes.forEach((x) => x.b.classList.remove('destaque'));
      if (tent >= 2) certoBtn.classList.add('destaque');
      proximo = null;
      tent++;
      const b = botoes.find((x) => x.o === o).b;
      if (o.id === item.certo) { b.classList.remove('destaque'); b.classList.add('certa'); Efeito.tocar('acerto'); if (ctx.lacunaEl) { ctx.lacunaEl.firstChild.textContent = fmt(o.txt || ''); ctx.lacunaEl.firstChild.classList.add('preenchida'); } break; }
      if (!primeiroErro) primeiroErro = o;
      Efeito.tocar('erro'); animarMascote('pensa');
      // com 2 opções (pares mínimos) a errada continua tocável, senão o andaime pularia direto para a resposta
      if (botoes.length > 2) b.classList.add('errada'); else { b.classList.add('apagada'); setTimeout(() => b.classList.remove('apagada'), 1200); }
      if (item.avaliacao) { certoBtn.classList.add('certa'); await falar([S.fala('avaliacaoObrigado')]); return [{ ok: false, tent, ms: performance.now() - t0, escolhido: o, final: true }]; }
      const restantes = botoes.filter((x) => !x.b.classList.contains('errada') && x.o.id !== item.certo);
      if (tent === 1) { await falar([S.fala('escuteDevagar')]); await ctx.falarPedido(true); }
      else if (tent === 2) { await dicaEspecifica(item, o); if (restantes.length > 1) restantes[0].b.classList.add('errada'); }
      else { assistido = true; certoBtn.classList.add('destaque'); botoes.forEach((x) => { if (x.b !== certoBtn) x.b.classList.add('apagada'); }); await falar([S.fala('toqueAqui')]); }
      proximo = esperarToque();
    }
    return [{ ok: tent === 1 && !item.guiado && !ctx.demo, tent, ms: performance.now() - t0, escolhido: primeiroErro, assistido, final: true }];
  };

  // ======================================================================
  // BATE-PALMAS (contar sílabas tocando no tambor)
  // ======================================================================
  MJ.palmas = async (item, ctx) => {
    const visor = visorEl(item, ctx);
    const pontos = el('div', { class: 'pontos', 'aria-live': 'polite' });
    const tambor = el('button', { class: 'tambor', type: 'button', 'aria-label': 'tambor: toque uma vez para cada pedacinho' }, '🥁');
    const limpar = el('button', { class: 'btn mini', type: 'button', 'aria-label': 'apagar' }, '↺');
    const pronto = el('button', { class: 'btn ok grande', type: 'button' }, '✔ ', D.falas.pronto);
    ctx.palco.append(visor, pontos, tambor, el('div', { class: 'acoes' }, limpar, pronto));
    let n = 0;
    tambor.onclick = () => { if (n >= 8) return; n++; Efeito.tocar('palma'); pontos.append(el('i')); };
    limpar.onclick = () => { n = 0; pontos.innerHTML = ''; };
    if (ctx.demo) { await falar([S.fala('demo')]); await mostrarMao(tambor); }
    let espera = aguardar(ctx, (res) => { pronto.onclick = res; });
    ctx.falarPedido();
    const t0 = performance.now(); let tent = 0; let assistido = false;
    for (;;) {
      await espera; Som.parar();
      espera = null;
      tent++;
      if (n === item.certo) { Efeito.tocar('acerto'); break; }
      Efeito.tocar('erro');
      if (item.avaliacao) return [{ ok: false, tent, ms: performance.now() - t0, final: true }];
      if (tent === 1) { await falar([S.fala('escuteDevagar')]); await falar([S.p(item.palavra)], { lento: true }); }
      else if (tent === 2) {
        await falar([S.f(D.dicasTipo.palmas)]); pontos.innerHTML = '';
        for (const s of item.silabas) { Efeito.tocar('palma'); pontos.append(el('i', { class: 'demo' })); await falar([S.s(s)]); }
        await dormir(400); pontos.innerHTML = ''; await falar([S.fala('agoraVoce')]);
      } else { assistido = true; pontos.innerHTML = ''; for (let k = 0; k < item.certo; k++) pontos.append(el('i', { class: 'demo' })); n = item.certo; await falar([S.fala('toqueAqui')]); }
      if (!assistido) { n = 0; pontos.innerHTML = ''; }
      espera = aguardar(ctx, (res) => { pronto.onclick = res; });
    }
    // reforço: fala a palavra batendo as palmas
    for (const s of item.silabas) { Efeito.tocar('palma'); await falar([S.s(s)]); }
    return [{ ok: tent === 1 && !ctx.demo, tent, ms: performance.now() - t0, assistido, final: true }];
  };

  // ======================================================================
  // TREM DAS SÍLABAS (arrastar com Pointer Events + alternativa tocar→tocar)
  // ======================================================================
  MJ.trem = async (item, ctx) => {
    const visor = visorEl(item, ctx);
    const trem = el('div', { class: 'trem', 'aria-label': 'trem' });
    trem.append(el('div', { class: 'vagao loco', 'aria-hidden': 'true' }, '🚂'));
    const vagoes = item.silabas.map((s, i) => { const v = el('button', { class: 'vagao', type: 'button', 'data-i': i, 'aria-label': 'vagão ' + (i + 1) }); trem.append(v); return v; });
    const pecasBox = el('div', { class: 'pecas' });
    const pecas = item.pecas.map((p) => { const b = el('button', { class: 'peca', type: 'button', 'data-id': p.id }, fmt(p.s)); b._p = p; pecasBox.append(b); return b; });
    const ouvir = el('button', { class: 'btn mini', type: 'button', 'aria-label': 'ouvir' }, '🔊');
    ouvir.onclick = () => ctx.falarPedido();
    ctx.palco.append(visor, trem, pecasBox, el('div', { class: 'acoes' }, ouvir));
    const ocupado = new Map(); // vagão → peça
    let selecionada = null;
    const colocar = (peca, vagao) => {
      if (ocupado.has(vagao)) { const antiga = ocupado.get(vagao); pecasBox.append(antiga); ocupado.delete(vagao); }
      for (const [v, p] of ocupado) if (p === peca) ocupado.delete(v);
      vagao.innerHTML = ''; vagao.append(peca); ocupado.set(vagao, peca); peca.classList.remove('sel'); selecionada = null;
      Efeito.tocar('clique'); falar([S.s(peca._p.s)]);
    };
    let resolverCheio = null;
    const verificarCheio = () => { if (ocupado.size === vagoes.length && resolverCheio) { const r = resolverCheio; resolverCheio = null; r(); } };
    pecas.forEach((peca) => {
      // tocar para selecionar
      peca.addEventListener('click', () => {
        if (peca._arrastou) { peca._arrastou = false; return; }
        if (peca.parentElement.classList.contains('vagao')) { const v = peca.parentElement; ocupado.delete(v); pecasBox.append(peca); return; }
        pecas.forEach((p) => p.classList.remove('sel')); selecionada = peca; peca.classList.add('sel'); falar([S.s(peca._p.s)]);
      });
      // arrastar (toque e mouse)
      peca.addEventListener('pointerdown', (e) => {
        const ini = { x: e.clientX, y: e.clientY }; let clone = null;
        peca.setPointerCapture(e.pointerId);
        const mover = (ev) => {
          if (!clone && Math.hypot(ev.clientX - ini.x, ev.clientY - ini.y) > 10) { clone = peca.cloneNode(true); clone.classList.add('arrastando'); document.body.append(clone); }
          if (clone) { clone.style.left = (ev.clientX - 36) + 'px'; clone.style.top = (ev.clientY - 36) + 'px'; vagoes.forEach((v) => { const r = v.getBoundingClientRect(); v.classList.toggle('alvo', ev.clientX > r.left && ev.clientX < r.right && ev.clientY > r.top && ev.clientY < r.bottom); }); }
        };
        const soltar = (ev) => {
          peca.removeEventListener('pointermove', mover); peca.removeEventListener('pointerup', soltar); peca.removeEventListener('pointercancel', soltar);
          if (clone) {
            clone.remove(); peca._arrastou = true;
            const v = vagoes.find((x) => x.classList.contains('alvo')); vagoes.forEach((x) => x.classList.remove('alvo'));
            if (v) { colocar(peca, v); verificarCheio(); }
          }
        };
        peca.addEventListener('pointermove', mover); peca.addEventListener('pointerup', soltar); peca.addEventListener('pointercancel', soltar);
      });
    });
    vagoes.forEach((v) => v.addEventListener('click', () => { if (selecionada) { colocar(selecionada, v); verificarCheio(); } }));
    if (ctx.demo) { await falar([S.fala('demo')]); await mostrarMao(pecas[0]); }
    ctx.falarPedido();
    const t0 = performance.now(); let tent = 0; let assistido = false;
    for (;;) {
      await aguardar(ctx, (res) => { resolverCheio = res; verificarCheio(); });
      Som.parar();
      tent++;
      const resposta = vagoes.map((v) => ocupado.get(v)._p.s);
      if (resposta.join('|') === item.silabas.join('|')) { Efeito.tocar('acerto'); vagoes.forEach((v) => v.classList.add('certa')); break; }
      Efeito.tocar('erro');
      vagoes.forEach((v, i) => { if (ocupado.get(v)._p.s !== item.silabas[i]) { v.classList.add('erro'); const p = ocupado.get(v); ocupado.delete(v); pecasBox.append(p); setTimeout(() => v.classList.remove('erro'), 500); } });
      if (tent === 1) { await falar([S.fala('escuteDevagar')]); await falar([S.p(item.palavra)], { lento: true }); }
      else if (tent === 2) { await falar([S.f(D.dicasTipo.trem)]); for (const s of item.silabas) await falar([S.s(s)]); }
      else {
        assistido = true; await falar([S.fala('juntosVamos')]);
        vagoes.forEach((v, i) => { if (!ocupado.has(v)) { const p = pecas.find((x) => x._p.s === item.silabas[i] && !x.parentElement.classList.contains('vagao')); if (p) colocar(p, v); } });
      }
    }
    await falar([S.p(item.palavra)]);
    return [{ ok: tent === 1 && !ctx.demo, tent, ms: performance.now() - t0, assistido, final: true }];
  };

  // ======================================================================
  // FATIADOR (separar em sílabas tocando nos pontos de corte)
  // ======================================================================
  MJ.fatiar = async (item, ctx) => {
    const visor = visorEl(item, ctx);
    const fat = el('div', { class: 'fatias', role: 'group', 'aria-label': 'palavra para cortar' });
    const cortes = [];
    [...item.palavra].forEach((ch, i) => {
      fat.append(el('span', { class: 'let' }, fmt(ch)));
      if (i < item.palavra.length - 1) { const c = el('button', { class: 'corte', type: 'button', 'data-pos': i + 1, 'aria-label': 'cortar aqui' }); c.onclick = () => { c.classList.toggle('on'); Efeito.tocar('clique'); }; fat.append(c); cortes.push(c); }
    });
    const pronto = el('button', { class: 'btn ok grande', type: 'button' }, '✔ ', D.falas.pronto);
    const ouvir = el('button', { class: 'btn mini', type: 'button', 'aria-label': 'ouvir' }, '🔊'); ouvir.onclick = () => ctx.falarPedido();
    ctx.palco.append(visor, fat, el('div', { class: 'acoes' }, ouvir, pronto));
    if (ctx.demo) { await falar([S.fala('demo')]); await mostrarMao(cortes[item.cortes[0] - 1]); }
    let espera = aguardar(ctx, (res) => { pronto.onclick = res; });
    ctx.falarPedido();
    const t0 = performance.now(); let tent = 0; let assistido = false;
    for (;;) {
      await espera; Som.parar();
      espera = aguardar(ctx, (res) => { pronto.onclick = res; });
      tent++;
      const marcados = cortes.filter((c) => c.classList.contains('on')).map((c) => Number(c.dataset.pos));
      if (marcados.join(',') === item.cortes.join(',')) { Efeito.tocar('acerto'); break; }
      Efeito.tocar('erro');
      if (tent === 1) { await falar([S.fala('escuteDevagar')]); for (const s of item.silabas) { Efeito.tocar('palma'); await falar([S.s(s)]); } }
      else if (tent === 2) { await falar([S.f(D.dicasTipo.fatiador)]); cortes.forEach((c) => c.classList.toggle('dica', item.cortes.includes(Number(c.dataset.pos)))); }
      else { assistido = true; cortes.forEach((c) => c.classList.toggle('on', item.cortes.includes(Number(c.dataset.pos)))); await falar([S.fala('fatiasCertas')]); }
    }
    for (const s of item.silabas) { Efeito.tocar('palma'); await falar([S.s(s)]); }
    return [{ ok: tent === 1 && !ctx.demo, tent, ms: performance.now() - t0, assistido, final: true }];
  };

  // ======================================================================
  // DITADO MÁGICO (teclado com letras liberadas progressivamente)
  // ======================================================================
  MJ.ditado = async (item, ctx) => {
    const visor = visorEl(item, ctx);
    const alvo = item.palavra;
    const caixas = el('div', { class: 'caixas', 'aria-live': 'polite' });
    const modelo = el('div', { class: 'modelo oculto' });
    let digitado = [];
    const desenhar = (marcas) => { caixas.innerHTML = ''; for (let i = 0; i < Math.max(alvo.length, digitado.length); i++) caixas.append(el('div', { class: 'caixa' + (marcas ? (marcas[i] ? ' ok' : ' no') : '') }, digitado[i] ? fmt(digitado[i]) : '')); };
    desenhar();
    const tec = el('div', { class: 'teclado', role: 'group', 'aria-label': 'teclado' });
    const tecla = (t, cls, acao, rot) => { const b = el('button', { class: 'tecla ' + (cls || ''), type: 'button', 'aria-label': rot || 'letra ' + t }, t); b.onclick = acao; tec.append(b); };
    item.teclado.letras.forEach((l) => tecla(fmt(l), '', () => { if (digitado.length < alvo.length + 2) { digitado.push(l); desenhar(); const f = D.fonemas[l]; if (f && f.tipo !== 'oclusiva') falar([S.fon(l)]); else Efeito.tocar('clique'); } }));
    item.teclado.acentos.forEach((l) => tecla(fmt(l), 'acento', () => { if (digitado.length < alvo.length + 2) { digitado.push(l); desenhar(); Efeito.tocar('clique'); } }));
    tecla('⌫', 'esp', () => { digitado.pop(); desenhar(); }, 'apagar');
    const pronto = el('button', { class: 'tecla esp', type: 'button', 'aria-label': 'pronto' }, '✔'); tec.append(pronto);
    const ouvir = el('button', { class: 'btn mini', type: 'button', 'aria-label': 'ouvir' }, '🔊'); ouvir.onclick = () => ctx.falarPedido();
    const lento = el('button', { class: 'btn mini', type: 'button', 'aria-label': 'ouvir devagar' }, '🐢'); lento.onclick = () => ctx.falarPedido(true);
    ctx.palco.append(visor, el('div', { class: 'acoes' }, ouvir, lento), modelo, caixas, tec);
    if (ctx.demo) { await falar([S.fala('demo')]); await mostrarMao(tec.firstChild); }
    let espera = aguardar(ctx, (res) => { pronto.onclick = res; });
    ctx.falarPedido();
    const t0 = performance.now(); let tent = 0; let assistido = false;
    for (;;) {
      await espera; Som.parar();
      espera = aguardar(ctx, (res) => { pronto.onclick = res; });
      if (!digitado.length) continue;
      tent++;
      const resp = digitado.join('');
      if (resp === alvo || N.semAcento(resp) === N.semAcento(alvo)) {
        Efeito.tocar('acerto'); digitado = [...alvo]; desenhar(alvo.split('').map(() => true));
        if (resp !== alvo) await falar([S.f('Isso! Só não esqueça o acento.')]);
        break;
      }
      Efeito.tocar('erro');
      desenhar(alvo.split('').map((c, i) => digitado[i] && N.semAcento(digitado[i]) === N.semAcento(c)));
      if (tent === 1) { await falar([S.fala('escuteDevagar')]); for (const s of item.silabas) await falar([S.s(s)], { lento: true }); }
      else if (tent === 2) { await falar([S.f(D.dicasTipo.ditado)]); modelo.classList.remove('oculto'); modelo.textContent = item.silabas.map((s, i) => (i === 0 ? fmt(s[0]) + '_'.repeat(s.length - 1) : '_'.repeat(s.length))).join(' - '); }
      else { assistido = true; modelo.classList.remove('oculto'); modelo.textContent = fmt(item.silabas.join('-')); await falar([S.fala('escrevaCopie')]); }
      digitado = digitado.filter((c, i) => alvo[i] && N.semAcento(c) === N.semAcento(alvo[i]) && digitado.slice(0, i).every((x, k) => N.semAcento(x) === N.semAcento(alvo[k])));
      desenhar();
    }
    await falar([S.p(alvo)]);
    return [{ ok: tent === 1 && !ctx.demo, tent, ms: performance.now() - t0, assistido, final: true }];
  };

  // ======================================================================
  // MEMÓRIA SOM-IMAGEM (cada par vira um resultado)
  // ======================================================================
  MJ.memoria = async (item, ctx) => {
    const grade = el('div', { class: 'memoria' });
    const erros = new Map();
    const resultados = [];
    let abertas = [];
    let feitos = 0;
    const cartas = item.cartas.map((c) => {
      const b = el('button', { class: 'carta', type: 'button', 'aria-label': 'carta virada' }, '🦉'); b._c = c; grade.append(b); return b;
    });
    ctx.palco.append(grade);
    await ctx.falarPedido();
    const t0 = performance.now();
    await aguardar(ctx, (res) => {
      cartas.forEach((b) => {
        b.onclick = async () => {
          if (b.classList.contains('virada') || b.classList.contains('feita') || abertas.length >= 2) return;
          b.classList.add('virada'); b.innerHTML = '';
          if (b._c.img) { b.append(fig(b._c.img)); falar([S.p(b._c.fala)]); } else { b.append(el('span', null, fmt(b._c.txt))); Efeito.tocar('pagina'); }
          abertas.push(b);
          if (abertas.length === 2) {
            const [a, c] = abertas;
            if (a._c.par === c._c.par) {
              await dormir(300); a.classList.add('feita'); c.classList.add('feita'); Efeito.tocar('acerto'); feitos++;
              const ok = !erros.get(a) && !erros.get(c);
              resultados.push({ ok, tent: ok ? 1 : 2, ms: performance.now() - t0, final: true, parte: a._c.par });
              ctx.registrarParcial(resultados[resultados.length - 1], a._c.txt || a._c.fala);
              abertas = [];
              if (feitos === item.pares) res();
            } else {
              erros.set(a, (erros.get(a) || 0) + 1); erros.set(c, (erros.get(c) || 0) + 1);
              await dormir(1100); [a, c].forEach((x) => { x.classList.remove('virada'); x.innerHTML = '🦉'; }); abertas = [];
            }
          }
        };
      });
    });
    return resultados.map((r) => Object.assign(r, { jaRegistrado: true }));
  };

  // ======================================================================
  // TRAÇADO MÁGICO (canvas com guia, setas e verificação da direção)
  // ======================================================================
  const arco = (cx, cy, rx, ry, a0, a1, n = 14) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });
  const TRACOS = {
    A: [[[50, 10], [16, 90]], [[50, 10], [84, 90]], [[30, 62], [70, 62]]],
    E: [[[28, 10], [28, 90]], [[28, 10], [74, 10]], [[28, 50], [66, 50]], [[28, 90], [74, 90]]],
    I: [[[50, 10], [50, 90]]],
    O: [arco(50, 50, 32, 40, -90, -450, 24)],
    U: [[[26, 10], [26, 60]].concat(arco(50, 62, 24, 28, 180, 0, 12)).concat([[74, 60], [74, 10]])],
    F: [[[30, 10], [30, 90]], [[30, 10], [74, 10]], [[30, 50], [64, 50]]],
    V: [[[20, 10], [50, 90], [80, 10]]],
    M: [[[20, 90], [20, 10], [50, 62], [80, 10], [80, 90]]],
    N: [[[25, 90], [25, 10], [75, 90], [75, 10]]],
    L: [[[30, 10], [30, 90], [74, 90]]],
    S: [[[74, 20], [62, 11], [46, 10], [32, 16], [27, 28], [33, 40], [50, 48], [67, 56], [74, 68], [70, 82], [55, 90], [38, 89], [26, 80]]],
    Z: [[[22, 10], [78, 10], [22, 90], [78, 90]]],
    J: [[[66, 10], [66, 66]].concat(arco(48, 66, 18, 22, 0, 180, 10))],
    X: [[[22, 10], [78, 90]], [[78, 10], [22, 90]]],
    P: [[[28, 10], [28, 90]], [[28, 10], [52, 10]].concat(arco(52, 30, 20, 20, -90, 90, 10)).concat([[28, 50]])],
    B: [[[28, 10], [28, 90]], [[28, 10], [50, 10]].concat(arco(50, 29, 18, 19, -90, 90, 10)).concat([[28, 48]]), [[28, 48], [52, 48]].concat(arco(52, 69, 22, 21, -90, 90, 10)).concat([[28, 90]])],
    T: [[[15, 10], [85, 10]], [[50, 10], [50, 90]]],
    D: [[[28, 10], [28, 90]], [[28, 10], [44, 10]].concat(arco(44, 50, 32, 40, -90, 90, 16)).concat([[28, 90]])],
    C: [arco(52, 50, 30, 40, -40, -320, 20)],
    G: [arco(52, 50, 30, 40, -40, -320, 20), [[56, 56], [82, 56], [82, 82]]]
  };
  MJ.TRACOS = TRACOS;
  function reamostrar(pts, n = 24) {
    if (pts.length < 2) return Array(n).fill(pts[0] || [0, 0]);
    const seg = []; let tot = 0;
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); tot += d; }
    const out = []; let i = 0, acc = 0;
    for (let k = 0; k < n; k++) {
      const alvo = tot * k / (n - 1);
      while (i < seg.length - 1 && acc + seg[i] < alvo) { acc += seg[i]; i++; }
      const t = seg[i] ? (alvo - acc) / seg[i] : 0;
      out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t]);
    }
    return out;
  }
  /** Verifica um traço: início, fim (direção) e forma */
  function confere(usuario, guia) {
    const u = reamostrar(usuario), g = reamostrar(guia);
    const d0 = Math.hypot(u[0][0] - g[0][0], u[0][1] - g[0][1]);
    const d1 = Math.hypot(u[u.length - 1][0] - g[g.length - 1][0], u[u.length - 1][1] - g[g.length - 1][1]);
    const media = u.reduce((a, p, i) => a + Math.hypot(p[0] - g[i][0], p[1] - g[i][1]), 0) / u.length;
    const inv = Math.hypot(u[0][0] - g[g.length - 1][0], u[0][1] - g[g.length - 1][1]) < 20 && Math.hypot(u[u.length - 1][0] - g[0][0], u[u.length - 1][1] - g[0][1]) < 20;
    return { ok: d0 < 22 && d1 < 24 && media < 17, invertido: inv };
  }
  MJ.confereTraco = confere;
  MJ.tracado = async (item, ctx) => {
    const L = item.letra; const guias = TRACOS[L] || TRACOS.I;
    const wrap = el('div', { class: 'tracado-wrap' }); const cv = el('canvas', { 'aria-label': 'área para traçar a letra ' + L, role: 'img' }); wrap.append(cv);
    const apagar = el('button', { class: 'btn mini', type: 'button', 'aria-label': 'apagar' }, '↺');
    const som = el('button', { class: 'btn mini', type: 'button', 'aria-label': 'ouvir o som' }, '🔊'); som.onclick = () => falar([S.fon(L)]);
    ctx.palco.append(el('div', { class: 'rotulo-etapa' }, '✍️ ', fmt(L)), wrap, el('div', { class: 'acoes' }, som, apagar));
    const g2 = cv.getContext('2d'); let W = 0;
    const feitos = new Set(); let atual = null; let dicaAnim = -1;
    const P = (p) => [p[0] / 100 * W, p[1] / 100 * W];
    function desenhar() {
      const r = cv.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1; W = r.width; cv.width = W * dpr; cv.height = W * dpr; g2.setTransform(dpr, 0, 0, dpr, 0, 0);
      g2.clearRect(0, 0, W, W); g2.lineCap = 'round'; g2.lineJoin = 'round';
      guias.forEach((gs, i) => {
        g2.strokeStyle = feitos.has(i) ? '#7ad39a' : '#d9e2f5'; g2.lineWidth = W * 0.1; g2.beginPath(); gs.forEach((p, k) => { const [x, y] = P(p); k ? g2.lineTo(x, y) : g2.moveTo(x, y); }); g2.stroke();
        if (!feitos.has(i)) {
          g2.setLineDash([W * 0.02, W * 0.03]); g2.strokeStyle = '#9fb0d6'; g2.lineWidth = 2; g2.beginPath(); gs.forEach((p, k) => { const [x, y] = P(p); k ? g2.lineTo(x, y) : g2.moveTo(x, y); }); g2.stroke(); g2.setLineDash([]);
          const rs = reamostrar(gs, 20); const a = P(rs[12]), b = P(rs[14]); const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
          g2.fillStyle = '#2f6fde'; g2.save(); g2.translate(b[0], b[1]); g2.rotate(ang); g2.beginPath(); g2.moveTo(10, 0); g2.lineTo(-8, -8); g2.lineTo(-8, 8); g2.fill(); g2.restore();
          const [sx, sy] = P(gs[0]); g2.fillStyle = '#1f9d55'; g2.beginPath(); g2.arc(sx, sy, W * 0.04, 0, 7); g2.fill();
          g2.fillStyle = '#fff'; g2.font = `bold ${W * 0.045}px sans-serif`; g2.textAlign = 'center'; g2.textBaseline = 'middle'; g2.fillText(String(i + 1), sx, sy);
        }
      });
      if (dicaAnim >= 0) { const [x, y] = P(dicaAnim.p || [0, 0]); g2.fillStyle = '#ffd54a'; g2.beginPath(); g2.arc(x, y, W * 0.05, 0, 7); g2.fill(); }
      if (atual && atual.length > 1) { g2.strokeStyle = '#2f6fde'; g2.lineWidth = W * 0.06; g2.beginPath(); atual.forEach((p, k) => { const [x, y] = P(p); k ? g2.lineTo(x, y) : g2.moveTo(x, y); }); g2.stroke(); }
    }
    requestAnimationFrame(desenhar);
    const onResize = () => desenhar(); window.addEventListener('resize', onResize);
    apagar.onclick = () => { feitos.clear(); atual = null; desenhar(); };
    const pos = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100]; };
    ctx.falarPedido().then(() => falar([S.f(D.instrucoes.tracado)]));
    const t0 = performance.now(); let tent = 0; let assistido = false;
    async function dica(i) {
      const rs = reamostrar(guias[i], 30);
      for (const p of rs) { dicaAnim = { p }; desenhar(); await dormir(35); }
      dicaAnim = -1; desenhar();
    }
    await aguardar(ctx, (res) => {
      cv.onpointerdown = (e) => { cv.setPointerCapture(e.pointerId); atual = [pos(e)]; desenhar(); };
      cv.onpointermove = (e) => { if (atual) { atual.push(pos(e)); desenhar(); } };
      cv.onpointerup = async () => {
        if (!atual) return; const tr = atual; atual = null;
        if (tr.length < 4) { desenhar(); return; }
        const pend = guias.map((g, i) => i).filter((i) => !feitos.has(i));
        const achou = pend.find((i) => confere(tr, guias[i]).ok);
        if (achou !== undefined) { feitos.add(achou); Efeito.tocar('estrela'); desenhar(); if (feitos.size === guias.length) { window.removeEventListener('resize', onResize); res(); } return; }
        tent++; Efeito.tocar('erro'); desenhar();
        const inv = pend.some((i) => confere(tr, guias[i]).invertido);
        if (inv) await falar([S.f('Quase! Comece no pontinho verde e siga a seta.')]);
        else if (tent === 1) await falar([S.f('Siga o caminho cinza, devagar.')]);
        if (tent >= 2) await dica(pend[0]);
        if (tent >= 3) { assistido = true; feitos.add(pend[0]); desenhar(); if (feitos.size === guias.length) { window.removeEventListener('resize', onResize); res(); } }
      };
    });
    await falar([S.fon(L)]);
    return [{ ok: tent === 0, tent: tent + 1, ms: performance.now() - t0, assistido, final: true }];
  };

  // ======================================================================
  // BINGO DE SÍLABAS / VOGAIS (cada chamada vira um resultado)
  // ======================================================================
  MJ.bingo = async (item, ctx) => {
    const cartela = el('div', { class: 'cartela', role: 'group', 'aria-label': 'cartela de bingo' });
    if (item.celulas.length <= 6) cartela.style.gridTemplateColumns = 'repeat(3, 1fr)';
    const cels = item.celulas.map((c) => { const b = el('button', { class: 'cel', type: 'button', 'aria-label': 'casa ' + c }, fmt(c)); b._c = c; cartela.append(b); return b; });
    const ouvir = el('button', { class: 'btn mini', type: 'button', 'aria-label': 'ouvir de novo' }, '🔊');
    ctx.palco.append(el('div', { class: 'rotulo-etapa' }, '🎱 Bingo'), cartela, el('div', { class: 'acoes' }, ouvir));
    await falar([S.f(D.instrucoes.bingo)]);
    const resultados = [];
    for (const ch of item.chamadas) {
      const seg = item.modo === 'vogal' ? S.fon(ch) : S.s(ch);
      ouvir.onclick = () => falar([S.fala('bingoMarque'), seg]); estado.esperado = ch;
      let espera = aguardar(ctx, (res) => cels.forEach((c) => { c.onclick = () => res(c); }));
      falar([S.fala('bingoMarque'), seg]);
      const t0 = performance.now(); let tent = 0; let assistido = false;
      for (;;) {
        const b = await espera; Som.parar();
        espera = aguardar(ctx, (res) => cels.forEach((c) => { c.onclick = () => res(c); }));
        if (b.classList.contains('marcada')) continue;
        tent++;
        if (b._c === ch) { b.classList.add('marcada'); b.classList.remove('destaque'); Efeito.tocar('acerto'); break; }
        Efeito.tocar('erro');
        if (tent === 1) await falar([S.fala('escuteDevagar'), seg], { lento: true });
        else if (tent === 2) await dicaEspecifica({ tipo: 'bingo', alvoG: item.modo === 'vogal' ? ch : ch[0] }, { g: item.modo === 'vogal' ? b._c : b._c[0] });
        else { assistido = true; const c = cels.find((x) => x._c === ch); c.classList.add('destaque'); await falar([S.fala('toqueAqui')]); }
      }
      const r = { ok: tent === 1, tent, ms: performance.now() - t0, assistido, final: true };
      resultados.push(r); ctx.registrarParcial(r, ch, { chave: (item.modo === 'vogal' ? 'g:' : 's:') + ch, graf: [item.modo === 'vogal' ? ch : (ch.length > 1 ? ch[0] : ch)] });
    }
    await falar([S.fala('parabensBingo')]);
    return resultados.map((r) => Object.assign(r, { jaRegistrado: true }));
  };

  // ======================================================================
  // MICROFONE MÁGICO (nunca bloqueia o avanço)
  // ======================================================================
  MJ.micro = async (item, ctx) => {
    const alvoEl = item.frase ? fraseLeitura(item.frase) : el('div', { class: 'visor' }, item.img ? fig(item.img, 'figura') : null, palavraChips(item.silabas));
    const status = el('div', { class: 'bolha', 'aria-live': 'polite' }, item.frase ? '📖' : '🔤');
    const acoes = el('div', { class: 'acoes' });
    ctx.palco.append(alvoEl, status, acoes);
    const modelo = el('button', { class: 'btn', type: 'button' }, '🔊 ', 'Modelo');
    modelo.onclick = () => (item.frase ? falar([S.f(N.fraseLimpa(item.frase))]) : falar([S.p(item.alvo)]));
    let tentativas = 0;
    const btnMic = el('button', { class: 'btn pri grande', type: 'button', 'aria-label': 'ler no microfone' }, '🎤 ', 'Ler');
    const btnVoz = el('button', { class: 'btn', type: 'button' }, '🎙️ ', 'Ouça sua voz');
    const adulto = el('button', { class: 'btn ok', type: 'button' }, '✔️ ', 'Um adulto ouviu e confirma');
    const pular = el('button', { class: 'btn', type: 'button' }, '⏭️ ', 'Pular');
    await falar([S.f(Micro.ativo ? D.falas.euLeio : 'Leia em voz alta para um adulto ouvir.')]);
    if (Micro.ativo) acoes.append(btnMic); else acoes.append(adulto, pular);
    if (Micro.podeGravar) acoes.append(btnVoz);
    btnVoz.onclick = async () => { status.textContent = '🎙️ Gravando... leia agora!'; const url = await Micro.gravar(4000); if (url) { status.textContent = '🔊 Sua voz:'; await falar([S.fala('ouvirSuaVoz')]); const a = new Audio(url); await a.play().catch(() => {}); await new Promise((r) => { a.onended = r; setTimeout(r, 5000); }); status.textContent = '🔊 Agora o modelo:'; modelo.click(); } else status.textContent = 'Não foi possível gravar.'; };
    const r = await aguardar(ctx, (res) => {
      adulto.onclick = () => res({ ok: true, adulto: true }); pular.onclick = () => res({ ok: false, pulou: true });
      btnMic.onclick = async () => {
        btnMic.disabled = true; status.textContent = '👂 Ouvindo...';
        const alts = await Micro.ouvir();
        btnMic.disabled = false;
        const cmp = Micro.comparar(item.alvo, alts || []);
        if (item.frase) alvoEl.querySelectorAll('.pal-h').forEach((p, i) => p.classList.toggle('lida', cmp.reconhecidas.includes(i)));
        if (cmp.ok) { status.textContent = '✅ ' + D.falas.microOuvi; Efeito.tocar('acerto'); await falar([S.fala('microOuvi')]); res({ ok: true }); return; }
        tentativas++; status.textContent = '🤔 ' + D.falas.microNaoEntendi;
        await falar([S.fala('microNaoEntendi')]);
        if (tentativas === 1) acoes.append(modelo);
        if (tentativas >= 2 && !adulto.isConnected) { acoes.append(adulto, pular); await falar([S.fala('adultoConfirma')]); }
      };
    });
    if (r.ok) Store.perfil.stats.micro++;
    if (!acoes.contains(modelo)) acoes.append(modelo);
    return [{ ok: r.ok, tent: tentativas + 1, final: true, adulto: !!r.adulto, pulou: !!r.pulou }];
  };

  // ======================================================================
  // APRESENTAÇÕES: Eu mostro (som), Descoberta (regra), Palavras mágicas, Marco
  // ======================================================================
  MJ.mostra = async (item, ctx) => {
    const g = item.g; const f = item.fonema || {};
    const dica = el('div', { class: 'bolha' }, item.dica || '');
    const ex = el('div', { class: 'acoes' });
    (item.exemplos || []).forEach((p) => { const w = Motor.W[p]; const b = el('button', { class: 'opcao', type: 'button', style: { minWidth: '110px' }, 'aria-label': 'exemplo' }, fig(w.e)); b.onclick = () => falar([S.p(p)]); ex.append(b); });
    const cont = el('button', { class: 'btn pri grande', type: 'button' }, '▶ Continuar');
    const denovo = el('button', { class: 'btn', type: 'button', 'aria-label': 'ouvir de novo' }, '🔊');
    ctx.palco.append(el('div', { class: 'rotulo-etapa' }, '👀 ', D.falas.euMostro), letraGrande(g), dica, ex, el('div', { class: 'acoes' }, denovo, cont));
    const apresentar = async () => {
      const segs = [S.fala('euMostro')];
      if (f.tipo === 'vogal') segs.push(S.f('Esta é a letra'), S.nome(g.replace(/[ÉÊ]/, 'E').replace(/[ÓÔ]/, 'O').replace('Ã', 'A')), S.f(g === 'Ã' ? 'com um chapeuzinho, o til. O som dela é' : 'O som dela é'), S.fon(g));
      else segs.push(S.fala('nomeLetra'), S.nome(g), S.fala('masSom'), S.fon(g));
      if (item.dica) segs.push(S.pausa(300), S.f(item.dica));
      await falar(segs);
      if (item.exemplos.length) { const s2 = [S.fala('exemplos')]; item.exemplos.forEach((p) => s2.push(S.pausa(250), S.p(p))); await falar(s2); }
    };
    denovo.onclick = apresentar;
    await apresentar();
    await aguardar(ctx, (res) => { cont.onclick = res; });
    return [];
  };
  MJ.regraMostra = async (item, ctx) => {
    const lista = (arr, titulo) => { const box = el('div', { class: 'grade', style: { width: '100%' } }); arr.forEach((p) => { const w = Motor.W[p]; const b = el('div', { class: 'figurinha' }, fig(w.e), palavraChips(w.s, { ambas: false })); box.append(b); }); return el('div', { style: { width: '100%' } }, el('h3', null, titulo), box); };
    const cont = el('button', { class: 'btn pri grande', type: 'button' }, '▶ Continuar');
    const denovo = el('button', { class: 'btn', type: 'button', 'aria-label': 'ouvir de novo' }, '🔊');
    ctx.palco.append(el('div', { class: 'rotulo-etapa' }, '💡 ', D.falas.regraDescoberta, ' ', item.titulo), el('div', { class: 'bolha' }, item.explica));
    if (item.exemplos.length) ctx.palco.append(lista(item.exemplos, '✅'));
    if (item.contra.length) ctx.palco.append(lista(item.contra, '↔️'));
    ctx.palco.append(el('div', { class: 'acoes' }, denovo, cont));
    const apresentar = async () => {
      const segs = [S.fala('regraDescoberta'), S.f(item.explica)];
      if (item.exemplos.length) { segs.push(S.fala('exemplosRegra')); item.exemplos.forEach((p) => segs.push(S.pausa(200), S.p(p))); }
      if (item.contra.length) { segs.push(S.fala('contraRegra')); item.contra.forEach((p) => segs.push(S.pausa(200), S.p(p))); }
      await falar(segs);
    };
    denovo.onclick = apresentar;
    await apresentar();
    await aguardar(ctx, (res) => { cont.onclick = res; });
    return [];
  };
  MJ.freqMostra = async (item, ctx) => {
    const box = el('div', { class: 'acoes' });
    item.palavras.forEach((p) => { const w = p.replace(/-/g, ''); const b = el('button', { class: 'opcao', type: 'button', style: { minWidth: '120px', minHeight: '80px' } }, el('span', { class: 'txt' }, fmt(w))); b.onclick = () => falar([S.p(w)]); box.append(b); });
    const cont = el('button', { class: 'btn pri grande', type: 'button' }, '▶ Continuar');
    ctx.palco.append(el('div', { class: 'rotulo-etapa' }, '✨ Palavras mágicas'), el('div', { class: 'bolha' }, D.falas.freqIntro), box, cont);
    await falar([S.fala('freqIntro')]);
    for (const p of item.palavras) { const w = p.replace(/-/g, ''); const b = [...box.children].find((x) => x.textContent === fmt(w)); if (b) b.classList.add('destaque'); await falar([S.p(w)]); if (b) b.classList.remove('destaque'); }
    await aguardar(ctx, (res) => { cont.onclick = res; });
    return [];
  };
  MJ.marco = async (item, ctx) => {
    ctx.palco.append(mascote({ anim: 'pula' }), el('div', { class: 'rotulo-etapa', style: { fontSize: '1.6em' } }, '⭐ ', D.falas.agoraVoce));
    await falar([S.fala(item.fala || 'agoraVoce')]);
    await dormir(400);
    return [];
  };

  // ======================================================================
  // HISTÓRIAS INTERATIVAS (karaokê por palavra e por sílaba)
  // ======================================================================
  /** Destaca cada palavra durante a narração.
      1) Banco de Áudio com tempos (manifest) → 2) boundary (opcional) → 3) uma fala por palavra (onend) */
  async function karaoke(chaveAudio, botoes, tokens, ctx, opc = {}) {
    const it = Som.itemBanco({ k: chaveAudio.k, t: chaveAudio.t }, opc.lento);
    const limpar = () => botoes.forEach((b) => b.classList.remove('on'));
    if (it && it.palavras && it.palavras.length === botoes.length) {
      const a = new Audio('audio/' + it.arquivo); a.volume = Store.cfg.volVoz;
      let raf; const passo = () => { const t = a.currentTime * 1000; botoes.forEach((b, i) => { const pw = it.palavras[i]; b.classList.toggle('on', t >= pw.ini && t < pw.fim); if (t >= pw.fim) b.classList.add('lida'); }); raf = requestAnimationFrame(passo); };
      Som.parar(); await a.play().catch(() => {}); passo();
      await new Promise((r) => { a.onended = r; a.onerror = r; ctx.sinal.addEventListener('abort', () => { a.pause(); r(); }, { once: true }); });
      cancelAnimationFrame(raf); limpar(); return;
    }
    if (Store.cfg.karaokeContinuo && 'speechSynthesis' in window && !opc.lento) {
      const ok = await karaokeBoundary(tokens, botoes, ctx);
      if (ok) return;
    }
    for (let i = 0; i < botoes.length; i++) {
      if (ctx.sinal.aborted) return;
      limpar(); botoes[i].classList.add('on');
      await falar([S.p(tokens[i].palavra)], { lento: opc.lento });
      botoes[i].classList.add('lida');
    }
    limpar();
  }
  function karaokeBoundary(tokens, botoes, ctx) {
    return new Promise((resolve) => {
      Som.parar();
      const texto = tokens.map((t) => t.palavra.toLocaleLowerCase('pt-BR')).join(' ');
      const inicios = []; let p = 0; tokens.forEach((t) => { inicios.push(p); p += t.palavra.length + 1; });
      const u = new SpeechSynthesisUtterance(texto); u.lang = 'pt-BR'; if (Som.voz) u.voice = Som.voz; u.rate = Store.cfg.taxa;
      let recebeu = false; let fim = false;
      u.onboundary = (e) => { recebeu = true; let i = inicios.findIndex((x, k) => e.charIndex >= x && (k === inicios.length - 1 || e.charIndex < inicios[k + 1])); botoes.forEach((b, k) => { b.classList.toggle('on', k === i); if (k < i) b.classList.add('lida'); }); };
      u.onend = () => { fim = true; botoes.forEach((b) => { b.classList.remove('on'); b.classList.add('lida'); }); resolve(true); };
      u.onerror = () => { if (!fim) resolve(false); };
      speechSynthesis.speak(u);
      setTimeout(() => { if (!recebeu && !fim) { speechSynthesis.cancel(); resolve(false); } }, 1500); // sem boundary (Android/Safari) → alternativa
      ctx.sinal.addEventListener('abort', () => { speechSynthesis.cancel(); resolve(true); }, { once: true });
    });
  }
  /** Lê a palavra sílaba por sílaba: BO-la → bo-LA → BOLA */
  async function silabaPorSilaba(btn, silabas, palavra, ctx) {
    const sp = [...btn.querySelectorAll('.sil')];
    for (let i = 0; i < sp.length; i++) { if (ctx.sinal.aborted) return; sp.forEach((x) => x.classList.remove('on')); sp[i].classList.add('on'); await falar([S.s(silabas[i])], { lento: true }); }
    sp.forEach((x) => x.classList.remove('on')); btn.classList.add('on'); await falar([S.p(palavra)]); btn.classList.remove('on');
  }
  MJ.historia = async (item, ctx) => {
    const h = D.historias.find((x) => x.id === item.historia);
    const resultados = [];
    const cena = el('div', { class: 'cena-hist', style: { background: h.cena.cor } }, el('div', { class: 'fundo', 'aria-hidden': 'true' }, h.cena.fundo), el('div', { class: 'atores' }));
    const texto = el('div', { class: 'texto-hist', 'aria-live': 'polite' });
    const interacao = el('div', { class: 'opcoes' });
    const acoes = el('div', { class: 'acoes' });
    const titulo = el('div', { class: 'rotulo-etapa' }, '📖 ', h.titulo);
    ctx.palco.append(titulo, cena, texto, interacao, acoes);
    const atores = cena.querySelector('.atores');
    const mostrarCena = (img) => { atores.innerHTML = ''; N.separarEmojis(img).forEach((e) => atores.append(fig(e, 'fig'))); Efeito.tocar('pagina'); };
    mostrarCena(h.cena.fundo);
    await falar([S.f(h.titulo), S.pausa(300), S.f(h.intro)]);
    const escolherComAndaime = async (ops, certo, pedido, extra = {}) => {
      interacao.innerHTML = '';
      const bts = ops.map((o) => { const b = el('button', { class: 'opcao', type: 'button' }); if (o.img) b.append(fig(o.img, o.cena ? 'cena' : 'fig')); if (o.txt) b.append(el('span', { class: 'txt' }, fmt(o.txt))); interacao.append(b); return { o, b }; });
      interacao.style.gridTemplateColumns = `repeat(${Math.min(ops.length, 3)}, minmax(0, 1fr))`;
      estado.esperado = certo;
      const esperar = () => aguardar(ctx, (res) => bts.forEach(({ o, b }) => { b.onclick = () => res(o); }));
      let espera = esperar();
      falar(pedido);
      const t0 = performance.now(); let tent = 0; let assist = false; let primeiro = null;
      for (;;) {
        const o = await espera; Som.parar(); espera = esperar();
        tent++; const b = bts.find((x) => x.o === o).b;
        if (o.id === certo) { b.classList.add('certa'); Efeito.tocar('acerto'); break; }
        if (!primeiro) primeiro = o;
        Efeito.tocar('erro'); if (bts.length > 2) b.classList.add('errada'); else { b.classList.add('apagada'); setTimeout(() => b.classList.remove('apagada'), 1200); }
        if (tent === 1) await falar(pedido, { lento: true });
        else if (tent === 2) await falar(extra.dica || [S.fala('dicaVem'), S.f(D.falas.tenteNovo)]);
        else { assist = true; bts.find((x) => x.o.id === certo).b.classList.add('destaque'); await falar([S.fala('toqueAqui')]); }
      }
      const r = { ok: tent === 1, tent, ms: performance.now() - t0, assistido: assist, escolhido: primeiro, final: true };
      resultados.push(r); ctx.registrarParcial(r, null, extra.reg || {});
      await dormir(300); interacao.innerHTML = '';
      return r;
    };
    for (let i = 0; i < h.frases.length; i++) {
      const fr = h.frases[i];
      ctx.progresso((i + 1) / (h.frases.length + h.perguntas.length + 1));
      mostrarCena(fr.img); texto.innerHTML = ''; acoes.innerHTML = '';
      if (h.oral) {
        texto.append(el('span', { 'aria-hidden': 'true' }, '🎧'));
        if (fr.rima) {
          await falar([S.f(fr.rima.antes)]);
          const ops = M_embaralhar(fr.rima.op).map((p) => ({ id: p, img: Motor.W[p].e }));
          await escolherComAndaime(ops, fr.rima.op[0], [S.fala('qualRimaCom'), S.p(fr.rima.com)], { dica: [S.f(D.dicasTipo.rima), S.p(fr.rima.com)] });
        }
        await falar([S.f(fr.t)]);
      } else {
        const tokens = N.tokenizarFrase(fr.t);
        const palavras = tokens.filter((t) => t.tipo === 'palavra');
        const botoes = [];
        let lacBtn = null, lacTok = null;
        tokens.forEach((tk) => {
          if (tk.tipo === 'pont') { const t = tk.texto.trim(); if (!t) return; if (/^[.,!?;:…]+$/.test(t) && botoes.length && texto.lastChild === botoes[botoes.length - 1]) botoes[botoes.length - 1].append(el('span', { class: 'pont' }, t)); else texto.append(el('span', null, t)); return; }
          const b = el('button', { class: 'pal-h', type: 'button' });
          const ehLac = fr.lac && !lacBtn && N.maiusc(tk.palavra) === fr.lac.p;
          if (ehLac) {
            lacBtn = b; lacTok = tk;
            let ini, tam; if (fr.lac.s !== undefined) { ini = tk.silabas.slice(0, fr.lac.s).join('').length; tam = tk.silabas[fr.lac.s].length; } else { ini = fr.lac.l; tam = 1; }
            b.append(el('span', null, fmt(tk.palavra.slice(0, ini))), el('span', { class: 'lacuna' }, '_'.repeat(tam)), el('span', null, fmt(tk.palavra.slice(ini + tam))));
          } else tk.silabas.forEach((s) => b.append(el('span', { class: 'sil' }, fmt(s))));
          if (mostrarAmbas() && Store.cfg.caixa !== 'baixa') b.append(el('span', { class: 'mi' }, tk.palavra.toLocaleLowerCase('pt-BR')));
          b.onclick = () => { if (b === lacBtn && b.querySelector('.lacuna')) return; silabaPorSilaba(b, tk.silabas, tk.palavra, ctx); };
          texto.append(b); botoes.push(b);
        });
        const refazLac = () => { if (!lacBtn) return; const pont = lacBtn.querySelector('.pont'); lacBtn.innerHTML = ''; if (pont) setTimeout(() => lacBtn.append(pont), 0); lacTok.silabas.forEach((s) => lacBtn.append(el('span', { class: 'sil' }, fmt(s)))); if (mostrarAmbas() && Store.cfg.caixa !== 'baixa') lacBtn.append(el('span', { class: 'mi' }, lacTok.palavra.toLocaleLowerCase('pt-BR'))); };
        if (fr.lac) {
          const certo = fr.lac.op[0];
          const ops = M_embaralhar(fr.lac.op).map((x) => ({ id: x, txt: x }));
          const ehLetra = fr.lac.s === undefined;
          const parLetra = ehLetra ? D.parDe[certo] : D.parDe[certo[0]];
          const dica = parLetra && D.dicasPares[parLetra] && fr.lac.op.some((o) => D.parceiro[ehLetra ? certo : certo[0]] === (ehLetra ? o : o[0])) ? [S.f(D.dicasPares[parLetra]), S.p(fr.lac.p)] : [S.fala('dicaVem'), S.p(fr.lac.p)];
          await escolherComAndaime(ops, certo, [S.fala('historiaLacuna'), S.p(fr.lac.p)], { dica, reg: { graf: [] } });
          refazLac();
        }
        const lerTudo = async (lento) => { await karaoke({ k: 'hist', t: h.id + '_' + i }, botoes, palavras, ctx, { lento }); };
        await lerTudo(false);
        if (lacBtn) { await falar([S.fala('silabaPorSilaba')]); await silabaPorSilaba(lacBtn, lacTok.silabas, lacTok.palavra, ctx); }
        const bLer = el('button', { class: 'btn', type: 'button', 'aria-label': 'ler de novo' }, '🔊');
        const bLento = el('button', { class: 'btn', type: 'button', 'aria-label': 'ler sílaba por sílaba' }, '🐢');
        bLer.onclick = () => lerTudo(false);
        bLento.onclick = async () => { for (let k = 0; k < botoes.length; k++) { if (ctx.sinal.aborted) return; await silabaPorSilaba(botoes[k], palavras[k].silabas, palavras[k].palavra, ctx); botoes[k].classList.add('lida'); } };
        acoes.append(bLer, bLento);
        if (Micro.ativo) {
          const bMic = el('button', { class: 'btn pri', type: 'button', 'aria-label': 'eu leio' }, '🎤 Eu leio!'); let tentMic = 0;
          bMic.onclick = async () => {
            botoes.forEach((b) => b.classList.remove('lida')); await falar([S.fala('euLeio')]);
            const alts = await Micro.ouvir(9000); const cmp = Micro.comparar(N.fraseLimpa(fr.t), alts || []);
            botoes.forEach((b, k) => b.classList.toggle('lida', cmp.reconhecidas.includes(k)));
            if (cmp.ok) { Efeito.tocar('acerto'); Store.perfil.stats.micro++; await falar([S.fala('microOuvi')]); }
            else { tentMic++; await falar([S.fala(tentMic >= 2 ? 'adultoConfirma' : 'microNaoEntendi')]); }
          };
          acoes.append(bMic);
        }
      }
      const prox = el('button', { class: 'btn pri grande', type: 'button' }, '▶');
      prox.setAttribute('aria-label', 'próxima'); acoes.append(prox);
      await aguardar(ctx, (res) => { prox.onclick = res; });
      Som.parar();
    }
    // perguntas de compreensão (com imagens)
    texto.innerHTML = ''; acoes.innerHTML = '';
    for (let k = 0; k < h.perguntas.length; k++) {
      const q = h.perguntas[k];
      ctx.progresso((h.frases.length + k + 1) / (h.frases.length + h.perguntas.length + 1));
      mostrarCena('❓'); texto.textContent = '🤔';
      const ops = M_embaralhar(q.op.map((e, i) => ({ id: String(i), img: e })));
      const pedido = [S.fala('historiaPergunta'), q.inf ? S.fala('perguntaInferencia') : S.pausa(10), S.f(q.t)];
      await escolherComAndaime(ops, String(q.c), pedido, { dica: q.explica ? [S.fala('dicaVem'), S.f(q.explica)] : [S.fala('ouvirDeNovo'), S.f(q.t)] });
      if (q.explica) await falar([S.f(q.explica)]);
    }
    mostrarCena('🎉'); texto.textContent = '⭐';
    await falar([S.fala('historiaFim')]);
    return resultados.map((r) => Object.assign(r, { jaRegistrado: true }));
  };
  const M_embaralhar = (a) => Motor.embaralhar(a);

  window.MJ = MJ;
})();
