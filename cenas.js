/* ==========================================================================
   Ler Brincando — cenas.js  (gerenciador de cenas e executor de fases)
   ========================================================================== */
(function () {
  'use strict';
  const LB = window.LB; const MJ = window.MJ;
  const { Store, Som, Efeito, Musica, Micro, Motor, D, N, el, tela, fmt, fig, toast, modal, mascote, animarMascote, Confete, estado, aplicarModos, dormir, DEBUG } = LB;
  const S = Motor.S;
  const falar = (s, o) => Som.falar(s, o);
  const ICONES = { rima: '🎵', palmas: '👏', somInicial: '🔤', somFinal: '🔚', juntar: '🧩', tirar: '🪄', trocar: '🔄', memoria: '🃏', licao: '🔊', cacaSom: '👂', tracado: '✍️', abertoFechado: '😮', bingo: '🎱', historia: '📖', guardiao: '🛡️', nomeSom: '🔤', leiaEncontre: '👀', gemeos: '👯', letraPerdida: '❓', regra: '💡', fabrica: '🏭', trem: '🚂', fatiador: '✂️', freq: '✨', ditado: '✍️', trocaLetra: '🪄', frase: '📜', microfone: '🎤' };
  const hoje = () => Motor.hoje();

  // ======================================================================
  // INÍCIO — "Toque para começar" (desbloqueia o áudio no iOS/Safari)
  // ======================================================================
  function inicio() {
    const t = el('div', { class: 'tela-inicio' },
      el('div', null, mascote({ nivel: 0, humor: 'feliz', anim: 'pula' })),
      el('h1', { class: 'logo' }, 'Ler ', el('span', null, 'Brincando')),
      el('button', { class: 'btn pri grande toque', type: 'button', id: 'comecar' }, '▶ ', D.falas.tocarParaComecar),
      el('button', { class: 'btn mini', type: 'button', id: 'sobre', 'aria-label': 'sobre' }, 'ℹ️ Sobre'));
    tela(t);
    $('#comecar').addEventListener('click', () => {
      // desbloqueio síncrono dentro do gesto (exigência do iOS)
      const bv = Som.itemBanco({ k: 'frase', t: D.falas.boasVindas });
      if (bv) { const a = new Audio('audio/' + bv.arquivo); a.play().catch(() => {}); }
      else if ('speechSynthesis' in window) { const u = new SpeechSynthesisUtterance(D.falas.boasVindas); u.lang = 'pt-BR'; if (Som.voz) u.voice = Som.voz; u.rate = Store.cfg.taxa; speechSynthesis.speak(u); }
      Som.desbloquear().then(() => { Musica.iniciar(); manterTela(); });
      iniciarRelogio();
      setTimeout(() => perfis(), bv ? 2600 : 2400);
    }, { once: true });
    $('#sobre').onclick = () => sobreModal();
  }
  const $ = (s) => document.querySelector(s);

  // ======================================================================
  // PERFIS (até 4 crianças)
  // ======================================================================
  function perfis() {
    const ps = Store.dados.perfis;
    if (!ps.length) return criarPerfil();
    const grade = el('div', { class: 'grade', style: { maxWidth: '760px', margin: '0 auto', width: '100%' } });
    ps.forEach((p) => {
      const b = el('button', { class: 'opcao', type: 'button', 'aria-label': 'perfil ' + p.nome }, el('span', { class: 'fig' }, p.avatar), el('span', { class: 'txt' }, p.nome));
      b.onclick = () => { Store.dados.atual = p.id; Store.salvar(); if (!p.avaliacao) avaliacaoInicial(); else mapa(); };
      grade.append(b);
    });
    if (ps.length < 4) { const b = el('button', { class: 'opcao', type: 'button', 'aria-label': 'nova criança' }, el('span', { class: 'fig' }, '➕')); b.onclick = criarPerfil; grade.append(b); }
    tela(el('div', { class: 'tela-inicio' }, el('div', { class: 'mascote-bolha' }, mascote({}), el('div', { class: 'bolha' }, D.falas.escolhaPerfil)), grade,
      el('button', { class: 'btn mini', type: 'button', onclick: () => portaoPais() }, '👪 Área dos Pais')));
    falar([S.fala('escolhaPerfil')]);
  }
  function criarPerfil() {
    let avatar = D.avatares[0];
    const nome = el('input', { type: 'text', maxlength: '20', placeholder: 'Nome da criança (um adulto digita)', 'aria-label': 'nome da criança' });
    const avs = el('div', { class: 'acoes' });
    D.avatares.forEach((a) => { const b = el('button', { class: 'btn redondo', type: 'button', 'aria-label': 'avatar ' + a }, a); b.onclick = () => { avatar = a; avs.querySelectorAll('button').forEach((x) => x.classList.remove('pri')); b.classList.add('pri'); falar([S.fala('bomTrabalho')]); }; avs.append(b); });
    avs.firstChild.classList.add('pri');
    const ok = el('button', { class: 'btn pri grande', type: 'button' }, '✔ Criar');
    const pularAv = el('label', { class: 'linha' }, el('input', { type: 'checkbox', id: 'pularAv' }), 'Pular a avaliação inicial (começar do Mundo 1)');
    ok.onclick = () => {
      if (Store.dados.perfis.length >= 4) { toast('Limite de 4 perfis.'); return; }
      const p = Motor.novoPerfil(nome.value.trim() || 'Leitor', avatar);
      Store.dados.perfis.push(p); Store.dados.atual = p.id; Store.salvar();
      if (pularAv.querySelector('input').checked) { p.avaliacao = { data: Motor.agora(), blocos: [], mundoInicial: 1, pulada: true }; Store.salvar(); mapa(); } else avaliacaoInicial();
    };
    tela(el('div', { class: 'painel' }, el('h2', null, '👋 Nova criança'), el('p', null, 'Um adulto digita o nome. A criança escolhe a figura.'), nome, el('h3', null, 'Figura'), avs, pularAv, el('div', { class: 'acoes' }, ok, Store.dados.perfis.length ? el('button', { class: 'btn', type: 'button', onclick: perfis }, 'Voltar') : null)));
  }

  // ======================================================================
  // AVALIAÇÃO INICIAL LÚDICA (≈ 5 min)
  // ======================================================================
  async function avaliacaoInicial() {
    const p = Store.perfil;
    const itens = Motor.itensAvaliacao();
    const ctrl = new AbortController();
    const palco = el('div', { class: 'palco' }); const barra = el('div', { class: 'progresso' }, el('i'));
    const sair = el('button', { class: 'btn redondo', type: 'button', 'aria-label': 'sair' }, '✖');
    sair.onclick = () => { ctrl.abort(); Som.parar(); perfis(); };
    tela(el('div', { class: 'jogo' }, el('div', { class: 'barra-jogo' }, sair, barra, mascote({ mini: true })), palco));
    palco.append(mascote({ anim: 'pula' }), el('div', { class: 'bolha' }, D.falas.avaliacaoIntro));
    await falar([S.fala('avaliacaoIntro')]);
    const resultados = [];
    try {
      for (let i = 0; i < itens.length; i++) {
        const it = itens[i]; barra.firstChild.style.width = (i / itens.length * 100) + '%';
        palco.innerHTML = '';
        const ctx = { palco, sinal: ctrl.signal, falarPedido: (l) => falar([S.f(D.instrucoes[it.instr] || '')].concat(it.pedido), { lento: l }), registrarParcial: () => {}, progresso: () => {} };
        const r = await MJ[it.ui](it, ctx);
        resultados.push({ bloco: it.bloco, ok: r[0] && r[0].ok });
        Efeito.tocar('estrela'); await dormir(300);
      }
    } catch (e) { return; }
    const av = Motor.posicionar(p, resultados); Store.salvar();
    palco.innerHTML = '';
    palco.append(mascote({ humor: 'feliz', anim: 'danca' }), el('div', { class: 'bolha' }, D.falas.avaliacaoFim), el('button', { class: 'btn pri grande', type: 'button', onclick: mapa }, '🗺️ ', 'Mapa'));
    Confete.lancar(60); await falar([S.fala('avaliacaoFim')]);
    estado.mundoAtual = av.mundoInicial;
  }

  // ======================================================================
  // MAPA DE AVENTURA (8 mundos)
  // ======================================================================
  function hud() {
    const p = Store.perfil; const nv = Motor.nivel(p);
    const bauDisp = p.bau !== hoje();
    const menu = async () => {
      const acao = await modal((fechar) => [el('h2', null, '☰ Menu'), el('div', { class: 'grade', style: { width: '100%' } },
        ...[['loja', '🏪', 'Lojinha'], ['album', '📒', 'Álbum'], ['medalhas', '🏅', 'Medalhas'], ['tela', '⛶', 'Tela cheia'], ['pais', '👪', 'Pais'], ['perfis', '🔄', 'Trocar criança']]
          .map(([id, e, n]) => el('button', { class: 'figurinha', type: 'button', onclick: () => fechar(id) }, el('div', { class: 'fig' }, e), n))),
        el('button', { class: 'btn', type: 'button', onclick: () => fechar(null) }, '✖')], { fecharFora: true });
      ({ loja, album, medalhas, tela: telaCheia, pais: portaoPais, perfis })[acao] && ({ loja, album, medalhas, tela: telaCheia, pais: portaoPais, perfis })[acao]();
    };
    const h = el('div', { class: 'hud' },
      el('button', { class: 'pilula', type: 'button', 'aria-label': 'trocar de perfil: ' + p.nome, onclick: perfis }, el('span', { class: 'avatar' }, p.avatar), el('span', { class: 'nome-hud' }, p.nome)),
      el('span', { class: 'pilula', title: 'Nível de leitor', 'aria-label': 'nível ' + D.niveis[nv].nome }, '🌱 ', el('span', { class: 'nome-hud' }, D.niveis[nv].nome)),
      el('span', { class: 'pilula', 'aria-label': 'moedas' }, '🪙 ', String(p.moedas)),
      el('span', { class: 'esp' }),
      bauDisp ? el('button', { class: 'btn redondo', type: 'button', 'aria-label': 'baú diário', onclick: abrirBau }, '🎁') : null,
      el('button', { class: 'btn redondo', type: 'button', 'aria-label': 'menu: loja, álbum, medalhas, pais', onclick: menu }, '☰'),
      DEBUG ? el('button', { class: 'btn redondo', type: 'button', 'aria-label': 'depuração', onclick: () => painelPais('autoteste') }, '🐞') : null);
    return h;
  }
  function proximaFase(p) { for (let i = 0; i < D.fases.length; i++) { const r = p.fases[D.fases[i].id]; if (Motor.faseLiberada(p, i) && !(r && r.dominada)) return i; } return D.fases.length - 1; }
  function mapa(mundoSel) {
    estado.emJogo = false; Som.parar();
    const p = Store.perfil; if (!p) return perfis();
    const prox = proximaFase(p);
    const mundo = mundoSel || estado.mundoSel || D.fases[prox].mundo;
    estado.mundoSel = mundo; estado.mundoAtual = mundo;
    const m = D.mundos[mundo - 1];
    const equipMapa = p.loja.equip.mapa && D.loja.find((x) => x.id === p.loja.equip.mapa);
    const abas = el('div', { class: 'mundos-abas', role: 'tablist' });
    D.mundos.forEach((mm) => {
      const primeira = D.fases.findIndex((f) => f.mundo === mm.id);
      const lib = Motor.faseLiberada(p, primeira);
      const b = el('button', { class: 'aba-mundo', role: 'tab', type: 'button', 'aria-selected': String(mm.id === mundo), 'aria-label': 'mundo ' + mm.nome }, (lib ? N.separarEmojis(mm.deco)[0] : '🔒') + ' ' + mm.id);
      b.onclick = () => { if (!lib) { falar([S.fala('trancada')]); return; } mapa(mm.id); };
      abas.append(b);
    });
    const trilha = el('div', { class: 'trilha' });
    D.fases.forEach((f, i) => {
      if (f.mundo !== mundo) return;
      const lib = Motor.faseLiberada(p, i); const reg = p.fases[f.id];
      const est = reg ? '⭐'.repeat(reg.estrelas) + '☆'.repeat(3 - reg.estrelas) : '';
      const b = el('button', { class: `no-fase ${lib ? '' : 'trancada'} ${i === prox ? 'proxima' : ''} ${f.tipo === 'guardiao' ? 'guardiao' : ''} ${f.tipo === 'historia' ? 'historia' : ''}`, type: 'button', 'aria-label': `fase ${f.id}: ${f.nome}${lib ? '' : ' (trancada)'}` },
        el('span', { class: 'num' }, f.id), el('span', { class: 'ico' }, lib ? ICONES[f.tipo] || '⭐' : '🔒'), est ? el('span', { class: 'est' }, est) : null);
      b.onclick = () => { if (!lib) { falar([S.fala('trancada')]); return; } introFase(i); };
      trilha.append(b);
    });
    const mp = el('div', { class: 'mapa', style: { '--c1': m.cor1, '--c2': m.cor2 } });
    if (equipMapa) mp.style.background = equipMapa.valor;
    mp.append(abas, el('div', { class: 'cab-mundo' }, el('div', { class: 'deco', 'aria-hidden': 'true' }, m.deco), el('h2', null, `${m.id}. ${m.nome}`), el('div', { class: 'mascote-bolha', style: { justifyContent: 'center' } }, mascote({ mini: true }), el('span', { class: 'bolha' }, m.conteudo))), trilha);
    tela(hud(), mp);
    document.documentElement.style.setProperty('--c1', m.cor1); document.documentElement.style.setProperty('--c2', m.cor2);
    falar([S.f(m.nome), S.pausa(200), S.fala('mapa')]);
  }

  // ======================================================================
  // INTRODUÇÃO DA FASE + EXECUTOR
  // ======================================================================
  async function introFase(idx) {
    const f = D.fases[idx];
    const comecar = el('button', { class: 'btn pri grande', type: 'button' }, '▶ Começar');
    const voltar = el('button', { class: 'btn', type: 'button', onclick: () => mapa() }, '🗺️');
    tela(el('div', { class: 'resultado' }, el('div', { style: { fontSize: '4rem' } }, ICONES[f.tipo] || '⭐'), el('h2', null, `${f.id} · ${f.nome}`), mascote({ anim: 'pula' }), el('div', { class: 'acoes' }, voltar, comecar)));
    const instr = D.instrucoes[f.tipo] || D.instrucoes[f.tipo + 'Silaba'] || '';
    falar([S.f(f.nome), S.pausa(200), S.f(instr)]);
    comecar.onclick = () => { Som.parar(); jogarFase(idx); };
  }
  function instrucaoDoItem(it) { return D.instrucoes[it.instr] || D.instrucoes[it.tipo] || ''; }

  async function jogarFase(idx, opc = {}) {
    const f = D.fases[idx]; const p = Store.perfil;
    estado.mundoAtual = f.mundo; estado.emJogo = true;
    let itens = opc.itens || Motor.gerarItens(idx, p);
    Som.preCarregar(itens);
    if (idx + 1 < D.fases.length) setTimeout(() => { try { Som.preCarregar(Motor.gerarItens(idx + 1, p)); } catch (e) { /* */ } }, 3000);
    const ctrl = new AbortController();
    const barra = el('div', { class: 'progresso', role: 'progressbar', 'aria-label': 'progresso da fase' }, el('i'));
    const sair = el('button', { class: 'btn redondo', type: 'button', 'aria-label': 'sair da fase' }, '✖');
    const ouvir = el('button', { class: 'btn redondo', type: 'button', 'aria-label': 'ouvir de novo' }, '🔊');
    const lento = el('button', { class: 'btn redondo', type: 'button', 'aria-label': 'ouvir devagar' }, '🐢');
    const palco = el('div', { class: 'palco' });
    tela(el('div', { class: 'jogo' }, el('div', { class: 'barra-jogo' }, sair, barra, ouvir, lento, mascote({ mini: true })), palco));
    sair.onclick = () => { ctrl.abort(); Som.parar(); Store.salvar(); mapa(); };
    let ok = 0, tot = 0; let instrFalada = new Set(); const repetidos = new Set();
    const demoPendente = !opc.revisao && !p.demos[f.tipo] && !['licao', 'regra', 'historia', 'guardiao', 'freq'].includes(f.tipo);
    let demoFeita = false;
    const nivelAntes = Motor.nivel(p);
    const progresso = (x) => { barra.firstChild.style.width = Math.round(x * 100) + '%'; };
    const registrar = async (item, r, foco) => {
      if (r.jaRegistrado) return;
      const out = Motor.registrar(p, item, r);
      const conta = item.contar !== false && !item.guiado && !r.demo;
      if (conta) { tot++; if (r.ok) ok++; }
      Store.salvar();
      if (!r.final) return;
      // feedback multimodal: voz + mascote + efeito + confete proporcional
      let segs = null;
      if (out.categoria && conta) {
        const esp = item.elogio && Math.random() < 0.5 ? Motor.elogioEspecifico(Object.assign({}, item, foco ? { elogio: Object.assign({}, item.elogio, { palavra: foco }) } : {})) : null;
        segs = esp || [S.f(Motor.escolherElogio(p, out.categoria))];
        if (out.categoria.startsWith('sequencia')) Confete.lancar(out.categoria === 'sequencia10' ? 160 : out.categoria === 'sequencia5' ? 90 : 40);
      } else if (r.ok || r.tent) segs = [S.f(Motor.escolherElogio(p, 'acerto'))];
      animarMascote(out.categoria && out.categoria.startsWith('sequencia') ? 'danca' : 'pula');
      if (segs) await falar(segs);
      if (out.novaFigurinha) { Efeito.tocar('estrela'); toast('📒 ' + D.falas.figurinha + ' ' + out.novaFigurinha); }
      if (out.reduziu) await falar([S.fala('reduzindo')]);
    };
    const ctxBase = (item) => ({
      palco, sinal: ctrl.signal, demo: false,
      falarPedido: (l) => {
        const segs = [];
        const ins = instrucaoDoItem(item);
        if (ins && (!instrFalada.has(item.instr || item.tipo) || !(item.pedido && item.pedido.length))) { segs.push(S.f(ins)); instrFalada.add(item.instr || item.tipo); }
        return falar(segs.concat(item.pedido || []), { lento: l });
      },
      registrarParcial: (r, foco, extra) => { const it2 = Object.assign({}, item, extra || {}); if (extra && extra.chave === undefined && item.ui === 'historia') it2.chave = null; return registrar(it2, Object.assign({}, r), foco); },
      progresso
    });
    try {
      for (let i = 0; i < itens.length; i++) {
        const item = itens[i];
        estado.itemAtual = item; estado.esperado = null; estado.itemSeq = (estado.itemSeq || 0) + 1;
        palco.innerHTML = ''; progresso(i / itens.length);
        const ctx = ctxBase(item);
        if (demoPendente && !demoFeita && item.contar !== false && !item.guiado && ['escolha', 'palmas', 'trem', 'fatiar', 'ditado'].includes(item.ui)) { ctx.demo = true; demoFeita = true; }
        ouvir.onclick = () => ctx.falarPedido(); lento.onclick = () => ctx.falarPedido(true);
        if (item.revisao) palco.append(el('div', { class: 'rotulo-etapa' }, '🔁 Revisão'));
        if (item.guiado && !palco.dataset.juntos) palco.append(el('div', { class: 'rotulo-etapa' }, '🤝 ', D.falas.fazemosJuntos));
        if (item.guiado && i > 0 && !itens[i - 1].guiado) await falar([S.fala('fazemosJuntos')]);
        const res = await MJ[item.ui](item, ctx);
        for (const r of res) { if (ctx.demo) r.demo = true; await registrar(item, r); }
        if (ctx.demo) { p.demos[f.tipo] = true; await falar([S.fala('demoAgora')]); }
        // o item errado volta mais tarde na mesma fase
        const errou = res.some((r) => r.tent > 1);
        if (errou && item.contar !== false && !item.guiado && !item.multi && !repetidos.has(item) && item.ui === 'escolha') {
          repetidos.add(item); const copia = Object.assign({}, item, { opcoes: Motor.embaralhar(item.opcoes), revisao: true, repetido: true });
          repetidos.add(copia); itens.splice(Math.min(itens.length, i + 3), 0, copia);
        }
        await dormir(250);
      }
    } catch (e) {
      if (e && e.message === 'abortado') return;
      console.error(e); toast('Ops! Algo deu errado. Voltando ao mapa.'); Store.salvar(); return mapa();
    }
    progresso(1);
    if (opc.revisao) { Store.salvar(); toast('🔁 Revisão concluída!'); return mapa(); }
    const fim = Motor.concluirFase(p, idx, { ok, total: tot });
    const novas = Motor.verificarMedalhas(p);
    Store.salvar();
    resultadoFase(idx, fim, novas, Motor.nivel(p) > nivelAntes);
  }

  async function resultadoFase(idx, fim, novas, subiu) {
    const f = D.fases[idx]; const p = Store.perfil;
    const est = el('div', { class: 'estrelas', 'aria-label': `${fim.estrelas} estrelas` });
    for (let k = 1; k <= 3; k++) est.append(el('span', { class: k <= fim.estrelas ? '' : 'apagada' }, '⭐'));
    const acoes = el('div', { class: 'acoes' });
    acoes.append(el('button', { class: 'btn', type: 'button', onclick: () => mapa() }, '🗺️ Mapa'), el('button', { class: 'btn', type: 'button', onclick: () => jogarFase(idx) }, '🔁 Jogar de novo'));
    if (!fim.dominada) acoes.append(el('button', { class: 'btn', type: 'button', onclick: () => { const it = Motor.revisaoRapida(idx, p); if (it.length) jogarFase(idx, { itens: it, revisao: true }); else jogarFase(idx); } }, '🧠 Revisão'));
    if (idx + 1 < D.fases.length && Motor.faseLiberada(p, idx + 1)) acoes.append(el('button', { class: 'btn pri grande', type: 'button', onclick: () => introFase(idx + 1) }, '▶ Próxima'));
    const msgs = [];
    if (f.tipo !== 'historia' && f.tipo !== 'microfone') msgs.push(el('div', { class: 'pilula' }, `🎯 ${Math.round(fim.prec * 100)}% de acertos`));
    msgs.push(el('div', { class: 'pilula' }, `🪙 +${fim.moedas}`));
    // conquistas aparecem na própria tela (sem janelas que atrapalham a próxima fase)
    const conquistas = el('div', { class: 'acoes' });
    if (subiu) conquistas.append(el('div', { class: 'pilula' }, '⬆️ ', D.falas.novoNivel, ' ', D.niveis[Motor.nivel(p)].nome));
    novas.forEach((m) => conquistas.append(el('div', { class: 'pilula' }, m.emoji, ' ', m.nome)));
    if (fim.mundoConcluido) conquistas.append(el('button', { class: 'btn', type: 'button', onclick: () => certificado(f.mundo) }, '🎓 Certificado do Mundo ' + f.mundo));
    tela(el('div', { class: 'resultado' }, el('h2', null, D.falas.faseFim), est, mascote({ humor: 'feliz', anim: 'danca' }), el('div', { class: 'acoes' }, ...msgs), conquistas, acoes));
    Efeito.tocar('estrela'); setTimeout(() => Efeito.tocar(subiu ? 'nivel' : 'moeda'), 400);
    Confete.lancar(fim.estrelas * 40 + (subiu || fim.mundoConcluido ? 80 : 0));
    const segs = [S.fala('faseFim')];
    if (fim.perfeita) segs.push(S.f(Motor.escolherElogio(p, 'fasePerfeita')));
    if (fim.mundoConcluido) segs.push(S.f(Motor.escolherElogio(p, 'mundoConcluido')));
    if (subiu) segs.push(S.fala('novoNivel'), S.f(D.niveis[Motor.nivel(p)].nome));
    novas.forEach((m) => segs.push(S.fala('medalha'), S.f(m.nome)));
    if (fim.liberouProxima) segs.push(S.fala('faseLiberada'));
    else if (!fim.dominada) segs.push(S.fala('treinarMais'), S.fala('revisaoOferecida'));
    falar(segs);
    if (fim.alerta && idx > 0) toast('💡 Sugestão: volte uma fase para treinar. Os pais podem ver detalhes no painel.', 5000);
  }

  // ======================================================================
  // BAÚ, LOJA, ÁLBUM, MEDALHAS, CERTIFICADO
  // ======================================================================
  async function abrirBau() {
    const p = Store.perfil; const m = Motor.abrirBau(p); Store.salvar();
    if (m === null) { falar([S.fala('bauJaAberto')]); return; }
    Efeito.tocar('bau'); Confete.lancar(80);
    falar([S.fala('bau')]);
    await modal((fechar) => [el('div', { style: { fontSize: '5rem' } }, '🎁'), el('h2', null, `+${m} 🪙`), el('p', null, D.falas.bau), el('button', { class: 'btn pri', type: 'button', onclick: () => fechar() }, 'OK')]);
    mapa();
  }
  function loja() {
    const p = Store.perfil;
    const prev = el('div', null, mascote({}));
    const grade = el('div', { class: 'grade' });
    const desenhar = () => {
      grade.innerHTML = ''; prev.innerHTML = ''; prev.append(mascote({}));
      D.loja.forEach((it) => {
        const tem = p.loja.itens.includes(it.id); const equip = p.loja.equip[it.tipo === 'acessorio' ? 'acessorio' : it.tipo] === it.id;
        const b = el('button', { class: 'figurinha', type: 'button', 'aria-label': it.nome }, el('div', { class: 'fig' }, it.emoji), it.nome, el('div', null, tem ? (equip ? '✅ usando' : 'usar') : `🪙 ${it.preco}`));
        b.onclick = () => {
          const campo = it.tipo === 'acessorio' ? 'acessorio' : it.tipo;
          if (!tem) { if (p.moedas < it.preco) { toast('Faltam moedas! Jogue mais fases. 🪙'); return; } p.moedas -= it.preco; p.loja.itens.push(it.id); Efeito.tocar('moeda'); }
          p.loja.equip[campo] = p.loja.equip[campo] === it.id && tem ? null : it.id; Store.salvar(); desenhar();
        };
        grade.append(b);
      });
    };
    desenhar();
    tela(hud(), el('div', { class: 'painel' }, el('h2', null, '🏪 Lojinha'), el('p', null, 'Use suas moedas para enfeitar a Lili e o mapa. Sem compras de verdade!'), prev, grade, el('button', { class: 'btn', type: 'button', onclick: () => mapa() }, '🗺️ Voltar')));
  }
  function album() {
    const p = Store.perfil;
    const grade = el('div', { class: 'grade' });
    const ganhas = Object.keys(p.album).filter((k) => p.album[k] >= 2);
    D.palavras.forEach((w) => {
      if (ganhas.includes(w.p)) { const b = el('button', { class: 'figurinha', type: 'button', 'aria-label': w.p }, fig(w.e), fmt(w.p)); b.onclick = () => falar([S.p(w.p)]); grade.append(b); }
    });
    const faltam = D.palavras.length - ganhas.length;
    for (let k = 0; k < Math.min(12, faltam); k++) grade.append(el('div', { class: 'figurinha vazia', 'aria-hidden': 'true' }, el('div', { class: 'fig' }, '❔'), '...'));
    tela(hud(), el('div', { class: 'painel' }, el('h2', null, `📒 Álbum de Figurinhas (${ganhas.length}/${D.palavras.length})`), el('p', null, 'Cada palavra que você lê ou escreve certinho duas vezes vira figurinha. Toque para ouvir!'), grade, el('button', { class: 'btn', type: 'button', onclick: () => mapa() }, '🗺️ Voltar')));
  }
  function medalhas() {
    const p = Store.perfil;
    const lista = el('div', { class: 'grade' });
    D.medalhas.forEach((m) => {
      const v = p.stats[m.stat] || 0; const tem = !!p.medalhas[m.id];
      lista.append(el('div', { class: 'figurinha' + (tem ? '' : ' vazia') }, el('div', { class: 'fig' }, tem ? m.emoji : '🔒'), m.nome, el('div', { style: { fontSize: '.8em', fontWeight: 400 } }, m.desc), el('progress', { max: m.meta, value: Math.min(v, m.meta), 'aria-label': 'progresso' })));
    });
    const certs = el('div', { class: 'acoes' });
    (p.certificados || []).forEach((c) => certs.append(el('button', { class: 'btn', type: 'button', onclick: () => certificado(c.mundo) }, `🎓 Mundo ${c.mundo}`)));
    tela(hud(), el('div', { class: 'painel' }, el('h2', null, '🏅 Medalhas'), lista, el('h2', null, '🎓 Certificados'), certs.children.length ? certs : el('p', null, 'Termine o Desafio do Guardião de um mundo para ganhar o certificado.'), el('button', { class: 'btn', type: 'button', onclick: () => mapa() }, '🗺️ Voltar')));
  }
  function certificado(mundo) {
    const p = Store.perfil; const m = D.mundos[mundo - 1];
    const w = window.open('', '_blank');
    const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Certificado</title><style>body{font-family:Andika,system-ui,sans-serif;text-align:center;padding:40px;border:14px double #2f6fde;margin:20px;border-radius:24px}h1{color:#1d4fb0;font-size:44px;margin:.2em}h2{font-size:34px}p{font-size:22px}.e{font-size:60px}</style></head><body>
      <div class="e">${m.deco}</div><h1>Certificado de Leitura</h1><p>Certificamos que</p><h2>${p.nome.replace(/[<>&]/g, '')}</h2>
      <p>concluiu com muito esforço o mundo <b>${m.id}. ${m.nome}</b><br>(${m.conteudo}) no jogo <b>Ler Brincando</b>.</p>
      <div style="width:160px;margin:0 auto">${mascote({ humor: 'feliz' }).outerHTML}</div><p>${new Date().toLocaleDateString('pt-BR')}</p><p>_____________________________<br>Assinatura do adulto</p>
      <script>setTimeout(function(){window.print()},500)<\/script></body></html>`;
    if (w) { w.document.write(html); w.document.close(); } else toast('Permita janelas pop-up para imprimir.');
  }

  // ======================================================================
  // ÁREA DOS PAIS (protegida por desafio para adultos)
  // ======================================================================
  async function portaoPais() {
    const a = 6 + Math.floor(Math.random() * 4), b = 6 + Math.floor(Math.random() * 4);
    const ok = await modal((fechar) => {
      const inp = el('input', { type: 'number', inputmode: 'numeric', 'aria-label': 'resposta' });
      const confirmar = () => fechar(Number(inp.value) === a * b);
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') confirmar(); });
      setTimeout(() => inp.focus(), 50);
      return [el('h2', null, '👪 Área dos Pais'), el('p', null, `Para adultos: quanto é ${a} × ${b}?`), inp, el('div', { class: 'acoes' }, el('button', { class: 'btn', type: 'button', onclick: () => fechar(false) }, 'Cancelar'), el('button', { class: 'btn pri', type: 'button', onclick: confirmar }, 'Entrar'))];
    });
    if (ok) painelPais(); else if (ok === false) toast('Resposta incorreta.');
  }
  function painelPais(abaInicial) {
    Som.parar(); estado.emJogo = false;
    const abas = [['progresso', '📊 Progresso'], ['config', '⚙️ Configurações'], ['audio', '🔊 Banco de Áudio'], ['dados', '👥 Perfis e dados'], ['autoteste', '🧪 Autoteste'], ['sobre', 'ℹ️ Sobre']];
    let atual = abaInicial || 'progresso';
    const corpo = el('div');
    const barra = el('div', { class: 'abas', role: 'tablist' });
    const desenhar = () => {
      barra.innerHTML = ''; abas.forEach(([id, nome]) => { const b = el('button', { type: 'button', role: 'tab', 'aria-selected': String(id === atual) }, nome); b.onclick = () => { atual = id; desenhar(); }; barra.append(b); });
      corpo.innerHTML = ''; ({ progresso: abaProgresso, config: abaConfig, audio: abaAudio, dados: abaDados, autoteste: abaAutoteste, sobre: abaSobre })[atual](corpo);
    };
    desenhar();
    tela(el('div', { class: 'painel' }, el('div', { class: 'hud' }, el('h2', { style: { margin: 0 } }, '👪 Área dos Pais'), el('span', { class: 'esp' }), el('button', { class: 'btn', type: 'button', onclick: () => (Store.perfil ? mapa() : perfis()) }, '✖ Sair')), barra, corpo));
  }
  function abaProgresso(c) {
    const p = Store.perfil;
    if (!p) { c.append(el('p', null, 'Nenhum perfil selecionado.')); return; }
    const sel = el('select', { 'aria-label': 'perfil' }); Store.dados.perfis.forEach((x) => sel.append(el('option', { value: x.id, selected: x.id === p.id }, x.avatar + ' ' + x.nome)));
    sel.onchange = () => { Store.dados.atual = sel.value; Store.salvar(); c.innerHTML = ''; abaProgresso(c); };
    c.append(el('label', { class: 'linha' }, 'Criança: ', sel));
    // tempo por dia (14 dias)
    const barras = el('div', { class: 'barras', 'aria-label': 'minutos por dia' });
    let max = 1; const dias = []; for (let k = 13; k >= 0; k--) { const d = new Date(Motor.agora() - k * 864e5).toISOString().slice(0, 10); const v = Math.round((p.tempo[d] || 0) / 60); dias.push([d, v]); max = Math.max(max, v); }
    dias.forEach(([d, v]) => barras.append(el('div', { style: { height: Math.max(2, v / max * 100) + '%' }, title: `${d}: ${v} min` }, el('span', null, d.slice(8)))));
    const concl = Object.values(p.fases).filter((x) => x.dominada).length;
    const estr = Object.values(p.fases).reduce((a, x) => a + x.estrelas, 0);
    c.append(el('h3', null, '⏱️ Minutos por dia (últimos 14 dias)'), barras, el('p', { style: { marginTop: '1.6em' } }, `Fases concluídas com domínio: ${concl}/${D.fases.length} · Estrelas: ${estr} · Nível: ${D.niveis[Motor.nivel(p)].nome} (${p.xp} XP) · Moedas: ${p.moedas}`));
    // mapa de calor
    const calor = el('div', { class: 'calor' });
    Motor.mapaCalor(p).forEach((u) => calor.append(el('div', { class: 'c-' + u.estado, title: `${u.u}: ${u.p === null ? 'sem dados' : Math.round(u.p * 100) + '% nas últimas tentativas'} (${u.n})` }, u.u.replace('_', ' '), el('br'), u.p === null ? '—' : Math.round(u.p * 100) + '%')));
    c.append(el('h3', null, '🔥 Mapa de calor dos sons e regras'), el('p', null, '🟩 domina (≥ 85% nas últimas 10) · 🟨 em progresso · 🟥 com dificuldade (< 60%) · ⬜ ainda não praticado'), calor);
    // pares confundidos
    const conf = Object.entries(p.confDir || {}).sort((a, b) => b[1] - a[1]);
    c.append(el('h3', null, '👯 Pares mínimos mais confundidos'), conf.length ? el('ul', null, ...conf.slice(0, 8).map(([k, v]) => el('li', null, `${k.replace('→', ' foi trocado por ')}: ${v}×`))) : el('p', null, 'Nenhuma confusão registrada.'));
    // tempo médio de resposta (automatização)
    const tr = Object.entries(p.tr || {}).map(([t, arr]) => [t, arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length / 100) / 10 : 0]);
    c.append(el('h3', null, '⚡ Tempo médio de resposta (acertos) — queda indica automatização'), tr.length ? el('ul', null, ...tr.map(([t, s]) => el('li', null, `${t}: ${s} s`))) : el('p', null, 'Sem dados ainda.'));
    // revisão espaçada
    const cx = [0, 0, 0, 0, 0]; let venc = 0; Object.values(p.leit).forEach((e) => { cx[e.cx]++; if (e.prox <= Motor.agora()) venc++; });
    c.append(el('h3', null, '🗂️ Revisão espaçada (caixas de Leitner: 1, 2, 4 e 7 dias)'), el('p', null, `Caixa 1: ${cx[1]} · Caixa 2: ${cx[2]} · Caixa 3: ${cx[3]} · Caixa 4: ${cx[4]} · Vencidos hoje: ${venc}`));
    // álbum
    const alb = Object.keys(p.album).filter((k) => p.album[k] >= 2);
    c.append(el('h3', null, `📒 Palavras do álbum (${alb.length})`), el('p', null, alb.join(', ') || '—'));
    // sinais de alerta
    const alertas = [];
    const porFase = {}; p.historicoFases.forEach((h) => { (porFase[h.id] = porFase[h.id] || []).push(h.prec); });
    Object.entries(porFase).forEach(([id, arr]) => { const u = arr.slice(-3); if (u.length === 3 && u.every((x) => x < 0.6)) alertas.push(`Fase ${id}: acerto < 60% em 3 sessões seguidas → revise o conteúdo anterior e o áudio.`); });
    Object.entries(p.conf || {}).forEach(([par, v]) => { if (v >= 6) alertas.push(`Confusão persistente ${par} (${v}×): reforce com o fonema prolongado, a versão lenta 🐢 e a dica articulatória diante do espelho. Se continuar, considere avaliação fonoaudiológica.`); });
    const rapidos = (p.tr.leiaEncontre || []).filter((ms) => ms < 1200).length;
    if (rapidos >= 8) alertas.push('Muitas respostas muito rápidas em "Leia e Encontre": possível escolha ao acaso. Reduza opções (o jogo já ajusta) e incentive a leitura em voz alta.');
    c.append(el('h3', null, '🚦 Sinais de alerta'), alertas.length ? el('ul', null, ...alertas.map((a) => el('li', null, a))) : el('p', null, 'Nenhum sinal de alerta.'));
    // avaliação inicial
    const av = p.avaliacao;
    c.append(el('h3', null, '🧭 Relatório da avaliação inicial'), av ? el('div', null, el('p', null, av.pulada ? 'Avaliação pulada pelo adulto.' : `Realizada em ${new Date(av.data).toLocaleDateString('pt-BR')}. Começo sugerido: Mundo ${av.mundoInicial}.`), el('ul', null, ...(av.blocos || []).map((b) => el('li', null, `${({ cf: 'Consciência fonológica (som inicial e sílabas)', vogais: 'Som das vogais', silabas: 'Leitura de sílabas simples', palavras: 'Leitura de palavras' })[b.bloco] || b.bloco}: ${b.acertos}/${b.total}`)))) : el('p', null, 'Ainda não realizada.'));
    c.append(el('button', { class: 'btn', type: 'button', onclick: () => { avaliacaoInicial(); } }, '🔁 Refazer a avaliação inicial'));
  }
  function abaConfig(c) {
    const cfg = Store.cfg;
    const salvar = () => { Store.salvar(); aplicarModos(); };
    const chk = (campo, rotulo, extra) => { const i = el('input', { type: 'checkbox' }); i.checked = !!cfg[campo]; i.onchange = () => { cfg[campo] = i.checked; salvar(); if (extra) extra(i.checked); }; return el('label', { class: 'linha' }, i, rotulo); };
    const faixa = (campo, rotulo, min, max, passo) => { const i = el('input', { type: 'range', min, max, step: passo, value: cfg[campo], 'aria-label': rotulo }); const v = el('span', null, String(cfg[campo])); i.oninput = () => { cfg[campo] = Number(i.value); v.textContent = i.value; salvar(); }; return el('label', { class: 'linha' }, rotulo, i, v); };
    // voz
    const sel = el('select', { 'aria-label': 'voz' }); sel.append(el('option', { value: '' }, 'Automática (melhor disponível)'));
    Som.vozes.forEach((v) => sel.append(el('option', { value: v.name, selected: v.name === cfg.voz }, `${v.name} (${v.lang})`)));
    sel.onchange = () => { cfg.voz = sel.value; salvar(); Som.carregarVozes(); };
    const testar = el('button', { class: 'btn mini', type: 'button' }, '▶ Testar'); testar.onclick = () => Som.falar([S.f('Oi! Eu sou a Lili. Vamos ler brincando?')]);
    c.append(el('h3', null, '🗣️ Voz'), Som.avisoVoz ? el('p', { class: 'aviso' }, '⚠️ ', Som.avisoVoz) : null,
      el('p', null, Som.manifest ? '✅ Banco de Áudio instalado: os sons principais vêm do banco. A voz abaixo só é usada para textos fora do banco.' : '⚠️ Banco de Áudio não encontrado: o jogo usa a voz do navegador e a síntese dos fonemas contínuos.'),
      el('label', { class: 'linha' }, 'Voz do navegador: ', sel, testar), faixa('taxa', 'Velocidade da fala', 0.6, 1.1, 0.05), faixa('volVoz', 'Volume da voz', 0.2, 1, 0.1),
      chk('karaokeContinuo', 'Karaokê contínuo (usa evento boundary quando o navegador suporta; senão, uma fala por palavra)'));
    c.append(el('h3', null, '🔤 Letras'), el('label', { class: 'linha' }, 'Tipo de letra: ', (() => { const s = el('select', { 'aria-label': 'tipo de letra' }, el('option', { value: 'alta', selected: cfg.caixa === 'alta' }, 'LETRA BASTÃO (CAIXA ALTA)'), el('option', { value: 'baixa', selected: cfg.caixa === 'baixa' }, 'minúsculas')); s.onchange = () => { cfg.caixa = s.value; salvar(); }; return s; })()), el('p', null, 'A partir do Mundo 6, as duas formas aparecem lado a lado.'));
    c.append(el('h3', null, '🎵 Sons'), chk('musica', 'Música de fundo (calma; abaixa quando a voz fala)', (v) => (v ? (Som.desbloquear(), Musica.iniciar()) : Musica.parar())), faixa('volMusica', 'Volume da música', 0, 1, 0.1), chk('efeitos', 'Efeitos sonoros'), faixa('volEfeitos', 'Volume dos efeitos', 0, 1, 0.1));
    // microfone
    const micBox = el('div');
    if (!Micro.suportado) micBox.append(el('p', { class: 'aviso' }, 'Este navegador não oferece reconhecimento de fala (o Firefox não tem; o Safari é parcial). O recurso fica oculto e as fases de leitura em voz alta usam a confirmação do adulto.'));
    else {
      micBox.append(el('p', { class: 'aviso' }, '🔒 Privacidade: o reconhecimento de fala do navegador pode enviar o áudio para servidores do fornecedor (Google, Microsoft ou Apple). O jogo não envia nada para servidores próprios. A gravação "Ouça sua voz" fica só no aparelho.'),
        chk('micConsent', 'Sou o adulto responsável e autorizo o uso do microfone', (v) => { if (!v) { cfg.mic = false; salvar(); c.innerHTML = ''; abaConfig(c); } }),
        chk('mic', 'Ativar o microfone nas atividades de leitura em voz alta', (v) => { if (v && !cfg.micConsent) { cfg.mic = false; salvar(); toast('Marque primeiro a autorização do adulto.'); c.innerHTML = ''; abaConfig(c); } }));
    }
    c.append(el('h3', null, '🎤 Microfone (desligado por padrão)'), micBox);
    c.append(el('h3', null, '⏳ Tempo'), faixa('limiteSessaoMin', 'Sugerir pausa após (min)', 10, 40, 5), faixa('limiteDiaMin', 'Limite diário sugerido (min)', 10, 90, 5), chk('manterTela', 'Manter a tela ligada durante o jogo (Wake Lock)', () => manterTela()));
    c.append(el('h3', null, '♿ Acessibilidade'), chk('altoContraste', 'Modo de alto contraste'), chk('menosEstimulos', 'Menos estímulos visuais (sem animações, decorações e confete)'));
    // liberar fases
    const p = Store.perfil;
    if (p) {
      const s = el('select', { 'aria-label': 'fase' }); D.fases.forEach((f) => s.append(el('option', { value: f.id }, `${f.id} — ${f.nome}`)));
      const lib = el('button', { class: 'btn mini', type: 'button' }, '🔓 Liberar até esta fase');
      lib.onclick = () => { const alvo = D.fases.findIndex((f) => f.id === s.value); for (let i = 0; i <= alvo; i++) if (!p.liberadas.includes(D.fases[i].id)) p.liberadas.push(D.fases[i].id); Store.salvar(); toast('Fases liberadas.'); };
      c.append(el('h3', null, '🔓 Liberar fases manualmente'), el('label', { class: 'linha' }, s, lib));
    }
  }
  function abaAudio(c) {
    const lista = window.Validadores.listaAudios(D);
    const man = Som.manifest;
    const tem = man ? lista.filter((x) => man.itens[x.chave]).length : 0;
    c.append(el('h3', null, '🔊 Banco de Áudio'),
      el('p', null, man ? `Banco instalado (gerado em ${man.gerado || '?'}, voz: ${man.voz || '?'}). Cobertura: ${tem}/${lista.length} itens.` : `Banco ausente. ${lista.length} itens seriam gerados. Siga o LEIAME.md (gerar_audios.py) para criar a pasta audio/.`),
      el('p', null, 'Origem de cada som: banco (Piper), recorte (fonema recortado da sílaba gerada), wikimedia (gravação IPA), síntese + voz do navegador (alternativa).'));
    const busca = el('input', { type: 'text', placeholder: 'Buscar texto (ex.: BOLA, MA, M)', 'aria-label': 'buscar áudio' });
    const res = el('table');
    const tipoSeg = { palavra: 'palavra', silaba: 'silaba', fonema: 'fonema', nome: 'nome', frase: 'frase', hist: 'hist', frasejogo: 'frasejogo' };
    const atualizar = () => {
      res.innerHTML = ''; res.append(el('tr', null, el('th', null, 'Tipo'), el('th', null, 'Texto'), el('th', null, 'Origem'), el('th', null, '')));
      const q = N.maiusc(busca.value.trim());
      lista.filter((x) => !q || N.maiusc(x.texto).includes(q)).slice(0, 60).forEach((x) => {
        const seg = { k: tipoSeg[x.tipo], t: x.texto };
        const b = el('button', { class: 'btn mini', type: 'button', 'aria-label': 'ouvir' }, '▶');
        b.onclick = () => (x.tipo === 'hist' || x.tipo === 'frasejogo' ? (Som.itemBanco(seg) ? Som.falar([seg]) : Som.falar([S.f(N.fraseLimpa(x.frase))])) : Som.falar([seg]));
        res.append(el('tr', null, el('td', null, x.tipo), el('td', null, x.frase ? N.fraseLimpa(x.frase) : x.texto), el('td', null, Som.origem(seg)), el('td', null, b)));
      });
    };
    busca.oninput = atualizar; atualizar();
    c.append(busca, res);
    if (man && man.atribuicoes && man.atribuicoes.length) c.append(el('h3', null, 'Atribuições (Wikimedia Commons)'), el('ul', null, ...man.atribuicoes.map((a) => el('li', null, `${a.fonema}: ${a.arquivo} — ${a.autor || ''} — ${a.licenca} (${a.url})`))));
  }
  function abaDados(c) {
    const ul = el('div', { class: 'grade' });
    Store.dados.perfis.forEach((p) => {
      const ren = el('button', { class: 'btn mini', type: 'button' }, '✏️'); ren.onclick = () => { const n = prompt('Novo nome:', p.nome); if (n) { p.nome = n.slice(0, 20); Store.salvar(); c.innerHTML = ''; abaDados(c); } };
      const del = el('button', { class: 'btn mini', type: 'button' }, '🗑️'); del.onclick = () => { if (confirm(`Apagar o perfil ${p.nome}? Isso não pode ser desfeito.`)) { Store.dados.perfis = Store.dados.perfis.filter((x) => x !== p); if (Store.dados.atual === p.id) Store.dados.atual = null; Store.salvar(); c.innerHTML = ''; abaDados(c); } };
      ul.append(el('div', { class: 'figurinha' }, el('div', { class: 'fig' }, p.avatar), p.nome, el('div', null, ren, del)));
    });
    const novo = el('button', { class: 'btn', type: 'button', disabled: Store.dados.perfis.length >= 4 }, '➕ Nova criança'); novo.onclick = criarPerfil;
    const exp = el('button', { class: 'btn', type: 'button' }, '⬇️ Exportar progresso (JSON)');
    exp.onclick = () => { const blob = new Blob([JSON.stringify(Store.dados, null, 1)], { type: 'application/json' }); const a = el('a', { href: URL.createObjectURL(blob), download: `ler-brincando-${hoje()}.json` }); document.body.append(a); a.click(); a.remove(); };
    const arq = el('input', { type: 'file', accept: 'application/json,.json', 'aria-label': 'arquivo para importar' });
    arq.onchange = async () => { try { const d = JSON.parse(await arq.files[0].text()); if (!Array.isArray(d.perfis)) throw new Error('formato'); localStorage.setItem('lerBrincando.v1', JSON.stringify(d)); Store.carregar(); aplicarModos(); toast('Progresso importado!'); c.innerHTML = ''; abaDados(c); } catch (e) { toast('Arquivo inválido.'); } };
    const zerar = el('button', { class: 'btn', type: 'button' }, '⚠️ Zerar todos os dados');
    zerar.onclick = () => { if (confirm('Apagar TODOS os perfis e configurações deste aparelho?')) { localStorage.removeItem('lerBrincando.v1'); Store.carregar(); toast('Dados apagados.'); perfis(); } };
    c.append(el('h3', null, '👥 Perfis (até 4)'), ul, novo, el('h3', null, '💾 Backup'), el('div', { class: 'acoes', style: { justifyContent: 'flex-start' } }, exp), el('label', { class: 'linha' }, '⬆️ Importar: ', arq), el('h3', null, 'Zerar'), zerar);
  }
  function abaAutoteste(c) {
    const out = el('div');
    const rodar = el('button', { class: 'btn pri', type: 'button' }, '▶ Rodar validadores V1–V12');
    rodar.onclick = async () => {
      out.innerHTML = '⏳ Rodando...'; await dormir(50);
      const r = window.Validadores.rodar(D, window.criarMotor, { manifest: Som.manifest, seeds: 3 });
      out.innerHTML = '';
      out.append(el('h3', { class: r.geral.startsWith('APROVADO') ? 'APROVADO' : 'REPROVADO' }, 'Resultado geral: ' + r.geral));
      const t = el('table'); t.append(el('tr', null, el('th', null, 'ID'), el('th', null, 'Validador'), el('th', null, 'Status'), el('th', null, 'Detalhes')));
      r.relatorio.forEach((x) => t.append(el('tr', null, el('td', null, x.id), el('td', null, x.nome), el('td', { class: x.status }, x.status), el('td', null, x.resumo || '', x.detalhes.length ? el('details', null, el('summary', null, `${x.detalhes.length} item(ns)`), el('ul', null, ...x.detalhes.slice(0, 50).map((d) => el('li', null, d)))) : null))));
      out.append(t);
      // teste de carregamento das imagens OpenMoji (amostra)
      const amostra = D.palavras.slice(0, 40); let falhas = 0; let feitos = 0;
      const pi = el('p', null, 'Testando imagens OpenMoji (amostra de 40)...'); out.append(pi);
      amostra.forEach((w) => { const im = new Image(); im.onload = im.onerror = (e) => { feitos++; if (e.type === 'error') falhas++; if (feitos === amostra.length) pi.textContent = `Imagens OpenMoji: ${amostra.length - falhas}/${amostra.length} carregaram (as que falharem usam o emoji nativo).`; }; im.src = `https://cdn.jsdelivr.net/npm/openmoji@16.0.0/color/svg/${w.om}.svg`; });
    };
    // simulação de data (T15)
    const dias = el('span', null, String(Motor.offsetDias));
    const mudar = (d) => { Motor.offsetDias += d; sessionStorage.setItem('lbDebugDias', String(Motor.offsetDias)); dias.textContent = String(Motor.offsetDias); };
    c.append(el('h3', null, '🧪 Autoteste do conteúdo'), el('p', null, 'Valida integridade silábica, decodificabilidade, pares mínimos, imagens, elogios, distratores, volume, sequência, simulação de jogador (bots) e o Banco de Áudio.'), rodar, out,
      el('h3', null, '📅 Simular data (teste da revisão espaçada)'), el('p', null, 'Avance o relógio do jogo para ver os itens voltarem nas caixas de Leitner.'),
      el('div', { class: 'acoes', style: { justifyContent: 'flex-start' } }, ...[1, 2, 4, 7].map((d) => el('button', { class: 'btn mini', type: 'button', onclick: () => mudar(d) }, `+${d} dia(s)`)), el('button', { class: 'btn mini', type: 'button', onclick: () => mudar(-Motor.offsetDias) }, 'Hoje'), el('span', null, 'Deslocamento: '), dias));
    if (DEBUG) rodar.click();
  }
  function abaSobre(c) {
    c.append(el('h3', null, 'Ler Brincando ' + D.versao), el('p', null, 'Jogo de alfabetização pelo método fônico sistemático e explícito, com consciência fonológica. Sem anúncios, sem compras, sem rastreadores. O progresso fica só neste aparelho.'),
      el('h3', null, 'Créditos e licenças'), el('ul', null, ...D.creditos.map((x) => el('li', null, x))),
      el('h3', null, 'Registro de alterações'), el('ul', null, ...D.changelog.map((x) => el('li', null, x))));
  }
  function sobreModal() { modal((fechar) => { const d = el('div', { style: { textAlign: 'left' } }); abaSobre(d); return [d, el('button', { class: 'btn pri', type: 'button', onclick: () => fechar() }, 'OK')]; }, { fecharFora: true }); }

  // ======================================================================
  // TEMPO DE TELA, PAUSA, TELA CHEIA, WAKE LOCK, SERVICE WORKER
  // ======================================================================
  let relogio = null;
  function iniciarRelogio() {
    if (relogio) return;
    relogio = setInterval(async () => {
      const p = Store.perfil; if (!p || document.visibilityState !== 'visible') return;
      p.tempo[hoje()] = (p.tempo[hoje()] || 0) + 10; estado.sessaoSeg += 10;
      if (estado.sessaoSeg % 60 === 0) Store.salvar();
      if (!estado.pausaSugerida && estado.sessaoSeg >= Store.cfg.limiteSessaoMin * 60) {
        estado.pausaSugerida = true; Som.falar([S.fala('pausa')]);
        await modal((fechar) => [mascote({ humor: 'feliz', anim: 'pula' }), el('h2', null, '😴 Hora de uma pausa?'), el('p', null, D.falas.pausa), el('button', { class: 'btn pri', type: 'button', onclick: () => fechar() }, 'OK')]);
      }
      if (!estado.limiteAvisado && (p.tempo[hoje()] || 0) >= Store.cfg.limiteDiaMin * 60) {
        estado.limiteAvisado = true; Som.falar([S.fala('limiteDia')]);
        await modal((fechar) => [mascote({ humor: 'feliz' }), el('h2', null, '🌙 Por hoje está ótimo!'), el('p', null, D.falas.limiteDia), el('button', { class: 'btn', type: 'button', onclick: () => fechar() }, 'Continuar (adulto)')]);
      }
    }, 10000);
  }
  function telaCheia() { const d = document.documentElement; if (!document.fullscreenElement) (d.requestFullscreen || d.webkitRequestFullscreen || (() => {})).call(d); else (document.exitFullscreen || (() => {})).call(document); }
  let wake = null;
  async function manterTela() {
    try { if (Store.cfg.manterTela && 'wakeLock' in navigator) { wake = await navigator.wakeLock.request('screen'); } else if (wake) { await wake.release(); wake = null; } } catch (e) { /* sem suporte */ }
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && Store.cfg.manterTela) manterTela(); if (document.visibilityState === 'hidden') Store.salvar(); });
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
  window.addEventListener('pagehide', () => Store.salvar());
  // impede zoom acidental por duplo toque e gesto de pinça no iOS
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  let ultimoToque = 0; document.addEventListener('touchend', (e) => { const t = Date.now(); if (t - ultimoToque < 300 && e.target.closest('button')) e.preventDefault(); ultimoToque = t; }, { passive: false });

  window.Cenas = { inicio, perfis, mapa, jogarFase, introFase, painelPais, portaoPais, avaliacaoInicial };
  inicio();
})();
