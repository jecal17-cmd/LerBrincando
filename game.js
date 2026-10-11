/* ==========================================================================
   Ler Brincando — game.js  (interface, áudio, cenas e minijogos)
   Depende de: nucleo.js, data.js, motor.js, validadores.js (e opcionalmente audio/manifest.js)
   ========================================================================== */
(function () {
  'use strict';
  const D = window.DADOS;
  const N = window.Nucleo;
  const Motor = window.criarMotor(D);
  const PARAMS = new URLSearchParams(location.search);
  const DEBUG = PARAMS.get('debug') === '1';
  const CHAVE_LS = 'lerBrincando.v1';
  const $ = (s, r = document) => r.querySelector(s);
  const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

  // ======================================================================
  // 1. ESTADO E ARMAZENAMENTO (localStorage)
  // ======================================================================
  const CONFIG_PADRAO = {
    voz: '', taxa: 0.85, caixa: 'alta', musica: false, volMusica: 0.5, efeitos: true, volEfeitos: 0.7, volVoz: 1,
    micConsent: false, mic: false, limiteSessaoMin: 20, limiteDiaMin: 40, altoContraste: false, menosEstimulos: false,
    karaokeContinuo: false, manterTela: false
  };
  const Store = {
    dados: null,
    carregar() {
      try { this.dados = JSON.parse(localStorage.getItem(CHAVE_LS)); } catch (e) { this.dados = null; }
      if (!this.dados || !Array.isArray(this.dados.perfis)) this.dados = { versao: 1, perfis: [], atual: null, config: {} };
      this.dados.config = Object.assign({}, CONFIG_PADRAO, this.dados.config || {});
      // completa campos novos em perfis antigos
      this.dados.perfis.forEach((p) => { const base = Motor.novoPerfil(p.nome, p.avatar); Object.keys(base).forEach((k) => { if (p[k] === undefined) p[k] = base[k]; }); Object.keys(base.stats).forEach((k) => { if (p.stats[k] === undefined) p.stats[k] = 0; }); });
      if (DEBUG) { const off = Number(sessionStorage.getItem('lbDebugDias') || 0); Motor.offsetDias = off; }
    },
    salvar() { try { localStorage.setItem(CHAVE_LS, JSON.stringify(this.dados)); } catch (e) { console.warn('Falha ao salvar', e); } },
    get cfg() { return this.dados.config; },
    get perfil() { return this.dados.perfis.find((p) => p.id === this.dados.atual) || null; }
  };
  Store.carregar();

  // ======================================================================
  // 2. UTILITÁRIOS DE INTERFACE
  // ======================================================================
  function el(tag, attrs, ...filhos) {
    const e = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
      else e.setAttribute(k, v === true ? '' : v);
    }
    filhos.flat().forEach((f) => { if (f === null || f === undefined || f === false) return; e.append(f.nodeType ? f : document.createTextNode(String(f))); });
    return e;
  }
  const app = $('#app');
  function tela(...filhos) { app.innerHTML = ''; filhos.forEach((f) => f && app.append(f)); window.scrollTo(0, 0); }
  // Formata texto conforme a configuração (letra bastão ou minúscula)
  const fmt = (t) => (Store.cfg.caixa === 'baixa' ? N.maiusc(t).toLocaleLowerCase('pt-BR') : N.maiusc(t));
  const mostrarAmbas = () => (estado.mundoAtual >= 6);
  // Imagem: OpenMoji (SVG via CDN) com emoji nativo como alternativa
  function fig(emoji, cls) {
    const span = el('span', { class: cls || 'fig', 'aria-hidden': 'true' });
    const partes = N.separarEmojis(emoji);
    partes.forEach((pt) => {
      const code = N.codigoOpenMoji(pt);
      const img = el('img', { src: `https://cdn.jsdelivr.net/npm/openmoji@16.0.0/color/svg/${code}.svg`, alt: '', draggable: 'false', loading: 'lazy' });
      img.addEventListener('error', () => { img.replaceWith(document.createTextNode(pt)); });
      span.append(img);
    });
    return span;
  }
  function toast(msg, ms = 2500) { const t = el('div', { class: 'toast', role: 'status' }, msg); document.body.append(t); setTimeout(() => t.remove(), ms); }
  function modal(conteudo, opcoes = {}) {
    return new Promise((resolve) => {
      const fundo = el('div', { class: 'modal-fundo', role: 'dialog', 'aria-modal': 'true' });
      const caixa = el('div', { class: 'modal' });
      const fechar = (v) => { fundo.remove(); resolve(v); };
      caixa.append(...[].concat(conteudo(fechar)));
      fundo.append(caixa); document.body.append(fundo);
      if (opcoes.fecharFora) fundo.addEventListener('click', (e) => { if (e.target === fundo) fechar(null); });
    });
  }
  function aplicarModos() {
    document.body.classList.toggle('alto-contraste', !!Store.cfg.altoContraste);
    document.body.classList.toggle('menos-estimulos', !!Store.cfg.menosEstimulos);
  }
  aplicarModos();
  const reduzMovimento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches || Store.cfg.menosEstimulos;

  // ======================================================================
  // 3. SERVIÇO DE ÁUDIO
  //    Banco de Áudio (Piper) → voz do navegador (Web Speech) como alternativa.
  //    Fonemas contínuos sem banco: síntese Web Audio + sílaba de apoio (nunca o nome da letra).
  // ======================================================================
  const Som = {
    ctx: null, manifest: window.AUDIO_MANIFEST || null, vozes: [], voz: null, token: 0, falando: false, cache: new Map(), avisoVoz: '',
    async desbloquear() {
      try {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.ctx.state === 'suspended') await this.ctx.resume();
        const b = this.ctx.createBuffer(1, 1, 22050); const s = this.ctx.createBufferSource(); s.buffer = b; s.connect(this.ctx.destination); s.start(0);
      } catch (e) { /* sem Web Audio */ }
      if (!this.manifest && location.protocol.startsWith('http')) {
        try { const r = await fetch('audio/manifest.json', { cache: 'no-cache' }); if (r.ok) this.manifest = await r.json(); } catch (e) { /* sem banco */ }
      }
    },
    carregarVozes() {
      if (!('speechSynthesis' in window)) return;
      const escolher = () => {
        const todas = speechSynthesis.getVoices();
        this.vozes = todas.filter((v) => /^pt/i.test(v.lang));
        const br = this.vozes.filter((v) => /pt[-_]BR/i.test(v.lang));
        const pref = Store.cfg.voz && this.vozes.find((v) => v.name === Store.cfg.voz);
        this.voz = pref || br.find((v) => /natural|neural|online/i.test(v.name)) || br.find((v) => /google/i.test(v.name)) || br[0] || this.vozes[0] || null;
        this.avisoVoz = !br.length ? (this.vozes.length ? 'Nenhuma voz pt-BR instalada: usando voz de Portugal como último recurso.' : 'Nenhuma voz em português instalada neste aparelho.') : '';
      };
      escolher();
      speechSynthesis.onvoiceschanged = escolher;
    },
    chave(seg, lento) {
      const mapa = { palavra: 'palavra', silaba: 'silaba', fonema: 'fonema', nome: 'nome', frase: 'frase', hist: 'hist', frasejogo: 'frasejogo' };
      const base = (mapa[seg.k] || 'frase') + '_' + N.slug(seg.t);
      return lento ? base + '_lento' : base;
    },
    itemBanco(seg, lento) {
      if (!this.manifest || !this.manifest.itens) return null;
      const it = lento ? (this.manifest.itens[this.chave(seg, true)] || this.manifest.itens[this.chave(seg)]) : this.manifest.itens[this.chave(seg)];
      return it || null;
    },
    origem(seg) {
      const it = this.itemBanco(seg);
      if (it) return it.origem || 'banco';
      if (seg.k === 'fonema' && D.fonemas[seg.t] && D.fonemas[seg.t].tipo === 'continua') return 'síntese + voz do navegador';
      return 'voz do navegador';
    },
    parar() { this.token++; if ('speechSynthesis' in window) speechSynthesis.cancel(); if (this.audioAtual) { this.audioAtual.pause(); this.audioAtual = null; } Musica.abaixar(false); this.falando = false; },
    /** Fala uma sequência de segmentos (interrompe o que estiver tocando) */
    async falar(segs, opc = {}) {
      this.parar();
      const meu = ++this.token;
      this.falando = true; Musica.abaixar(true);
      try {
        for (const seg of [].concat(segs)) {
          if (meu !== this.token) return false;
          await this.tocarSeg(seg, opc.lento, meu);
        }
      } finally { if (meu === this.token) { this.falando = false; Musica.abaixar(false); } }
      return true;
    },
    async tocarSeg(seg, lento, meu) {
      if (!seg) return;
      if (seg.k === 'pausa') return dormir(seg.ms);
      const it = this.itemBanco(seg, lento);
      if (it) return this.tocarArquivo('audio/' + it.arquivo, meu, lento && !this.manifest.itens[this.chave(seg, true)] ? 0.8 : 1);
      // ---- alternativa (camada 4): voz do navegador
      if (seg.k === 'fonema') {
        const f = D.fonemas[seg.t];
        if (!f) return this.tts(seg.t.toLowerCase(), lento, meu);
        if (f.tipo === 'vogal') return this.tts(f.tts, lento, meu);
        if (f.tipo === 'continua') { await Sintese.fonema(seg.t); if (meu !== this.token) return; await dormir(120); return this.tts(f.apoio.toLowerCase(), lento, meu); }
        return this.tts(f.apoio.toLowerCase(), lento, meu); // oclusiva: SEMPRE dentro da sílaba
      }
      if (seg.k === 'nome') return this.tts(D.nomesLetras[seg.t] || seg.t, lento, meu);
      if (seg.k === 'silaba' || seg.k === 'palavra') return this.tts(N.maiusc(seg.t).toLocaleLowerCase('pt-BR'), lento, meu);
      return this.tts(seg.t, lento, meu);
    },
    tocarArquivo(src, meu, taxa = 1) {
      return new Promise((resolve) => {
        let a = this.cache.get(src);
        if (!a) { a = new Audio(src); this.cache.set(src, a); }
        a.currentTime = 0; a.volume = Store.cfg.volVoz; a.playbackRate = taxa; this.audioAtual = a;
        const fim = () => { a.removeEventListener('ended', fim); a.removeEventListener('error', erro); clearTimeout(seg); resolve(); };
        const erro = () => { fim(); };
        a.addEventListener('ended', fim); a.addEventListener('error', erro);
        const seg = setTimeout(fim, 15000);
        a.play().catch(() => fim());
      });
    },
    /** Voz do navegador: fala dividida em pedaços (o Chrome corta falas longas) */
    async tts(texto, lento, meu) {
      if (!('speechSynthesis' in window) || !texto) return dormir(300);
      const pedacos = String(texto).match(/[^.!?;:]+[.!?;:]*|[.!?;:]+/g) || [texto];
      for (const p of pedacos) {
        if (meu !== undefined && meu !== this.token) return;
        await new Promise((resolve) => {
          const u = new SpeechSynthesisUtterance(p.trim());
          u.lang = (this.voz && this.voz.lang) || 'pt-BR'; if (this.voz) u.voice = this.voz;
          u.rate = Math.max(0.5, Store.cfg.taxa * (lento ? 0.72 : 1)); u.pitch = 1.05; u.volume = Store.cfg.volVoz;
          let feito = false; const fim = () => { if (!feito) { feito = true; clearTimeout(t); resolve(); } };
          u.onend = fim; u.onerror = fim;
          const t = setTimeout(fim, 1500 + p.length * 140 / u.rate);
          speechSynthesis.speak(u);
        });
      }
    },
    /** Pré-carrega os arquivos da próxima fase (o Service Worker guarda em cache) */
    preCarregar(itens) {
      if (!this.manifest || !location.protocol.startsWith('http')) return;
      const urls = new Set();
      const addSeg = (s) => { const it = this.itemBanco(s); if (it) urls.add('audio/' + it.arquivo); };
      itens.forEach((it) => { (it.pedido || []).forEach(addSeg); (it.opcoes || []).forEach((o) => o.falar && addSeg(o.falar)); if (it.palavra) addSeg({ k: 'palavra', t: it.palavra }); });
      urls.forEach((u) => fetch(u).catch(() => {}));
    }
  };
  Som.carregarVozes();

  // ---- Síntese de fonemas contínuos (alternativa quando não há Banco de Áudio)
  const Sintese = {
    ruido(ctx, dur) { const n = Math.floor(ctx.sampleRate * dur); const b = ctx.createBuffer(1, n, ctx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; const s = ctx.createBufferSource(); s.buffer = b; return s; },
    fonema(g, dur = 0.8) {
      const ctx = Som.ctx; if (!ctx) return dormir(300);
      const t0 = ctx.currentTime + 0.02; const saida = ctx.createGain(); saida.connect(ctx.destination);
      const v = Store.cfg.volVoz * 0.5;
      saida.gain.setValueAtTime(0, t0); saida.gain.linearRampToValueAtTime(v, t0 + 0.06); saida.gain.setValueAtTime(v, t0 + dur - 0.08); saida.gain.linearRampToValueAtTime(0, t0 + dur);
      const fricativa = { S: [6000, 2.5, 0.9], Z: [6000, 2.5, 0.5], F: [3500, 0.6, 0.35], V: [3500, 0.6, 0.25], X: [3000, 2, 0.8], J: [3000, 2, 0.45] }[g];
      const vozeada = ['Z', 'V', 'J', 'M', 'N', 'L', 'NH', 'LH'].includes(g);
      if (fricativa) { const r = this.ruido(ctx, dur); const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = fricativa[0]; bp.Q.value = fricativa[1]; const gg = ctx.createGain(); gg.gain.value = fricativa[2]; r.connect(bp).connect(gg).connect(saida); r.start(t0); r.stop(t0 + dur); }
      if (vozeada) {
        const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 125;
        const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = g === 'M' ? 320 : g === 'N' ? 420 : g === 'L' ? 900 : 500;
        const gg = ctx.createGain(); gg.gain.value = fricativa ? 0.35 : 0.8; o.connect(lp).connect(gg).connect(saida);
        if (g === 'L' || g === 'N') { const f2 = ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = g === 'L' ? 1200 : 1600; f2.Q.value = 4; const g2 = ctx.createGain(); g2.gain.value = 0.25; o.connect(f2).connect(g2).connect(saida); }
        o.start(t0); o.stop(t0 + dur);
      }
      return dormir(dur * 1000 + 40);
    }
  };

  // ---- Efeitos sonoros (Web Audio, ADSR, < 400 ms, sem buzina)
  const Efeito = {
    nota(freq, ini, dur, tipo = 'sine', vol = 0.25) {
      const ctx = Som.ctx; if (!ctx || !Store.cfg.efeitos) return;
      const t = ctx.currentTime + ini; const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = tipo; o.frequency.setValueAtTime(freq, t);
      const v = vol * Store.cfg.volEfeitos;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.012); g.gain.exponentialRampToValueAtTime(v * 0.6, t + dur * 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + 0.02);
    },
    tocar(nome) {
      if (!Som.ctx || !Store.cfg.efeitos) return;
      switch (nome) {
        case 'acerto': [523, 659, 784].forEach((f, i) => this.nota(f, i * 0.07, 0.18, 'triangle', 0.22)); break;
        case 'erro': this.nota(330, 0, 0.16, 'sine', 0.12); this.nota(294, 0.13, 0.2, 'sine', 0.1); break;
        case 'estrela': [1047, 1319, 1568].forEach((f, i) => this.nota(f, i * 0.05, 0.15, 'sine', 0.15)); break;
        case 'moeda': this.nota(988, 0, 0.08, 'square', 0.08); this.nota(1319, 0.07, 0.22, 'square', 0.08); break;
        case 'bau': [392, 523, 659, 784, 1047].forEach((f, i) => this.nota(f, i * 0.06, 0.2, 'triangle', 0.18)); break;
        case 'nivel': [523, 659, 784, 1047, 784, 1047].forEach((f, i) => this.nota(f, i * 0.06, 0.18, 'triangle', 0.2)); break;
        case 'pagina': { const r = Sintese.ruido(Som.ctx, 0.2); const f = Som.ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2500; const g = Som.ctx.createGain(); g.gain.setValueAtTime(0.12 * Store.cfg.volEfeitos, Som.ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, Som.ctx.currentTime + 0.2); r.connect(f).connect(g).connect(Som.ctx.destination); r.start(); break; }
        case 'palma': { const r = Sintese.ruido(Som.ctx, 0.09); const f = Som.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1400; const g = Som.ctx.createGain(); g.gain.setValueAtTime(0.5 * Store.cfg.volEfeitos, Som.ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.001, Som.ctx.currentTime + 0.09); r.connect(f).connect(g).connect(Som.ctx.destination); r.start(); break; }
        case 'clique': this.nota(880, 0, 0.05, 'sine', 0.08); break;
        default: break;
      }
    }
  };

  // ---- Música de fundo procedural (calma, opcional, com ducking quando a voz fala)
  const Musica = {
    ativo: false, ganho: null, timer: null, nivel: 1,
    iniciar() {
      if (this.ativo || !Som.ctx || !Store.cfg.musica || Store.cfg.menosEstimulos) return;
      this.ativo = true; const ctx = Som.ctx;
      this.ganho = ctx.createGain(); this.ganho.gain.value = 0.05 * Store.cfg.volMusica; this.ganho.connect(ctx.destination);
      const escala = [261.6, 293.7, 329.6, 392, 440, 523.3, 587.3]; let i = 2;
      const tocar = () => {
        if (!this.ativo) return;
        i = Math.max(0, Math.min(escala.length - 1, i + [-2, -1, 1, 2, 0][Math.floor(Math.random() * 5)]));
        const t = ctx.currentTime; const o = ctx.createOscillator(); const g = ctx.createGain(); o.type = 'sine'; o.frequency.value = escala[i];
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.6, t + 0.3); g.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
        o.connect(g).connect(this.ganho); o.start(t); o.stop(t + 1.9);
        if (Math.random() < 0.3) { const o2 = ctx.createOscillator(); const g2 = ctx.createGain(); o2.frequency.value = escala[i] / 2; g2.gain.setValueAtTime(0, t); g2.gain.linearRampToValueAtTime(0.35, t + 0.5); g2.gain.exponentialRampToValueAtTime(0.001, t + 2.6); o2.connect(g2).connect(this.ganho); o2.start(t); o2.stop(t + 2.7); }
        this.timer = setTimeout(tocar, 700 + Math.random() * 500);
      };
      tocar();
    },
    parar() { this.ativo = false; clearTimeout(this.timer); if (this.ganho) { try { this.ganho.disconnect(); } catch (e) { /* */ } this.ganho = null; } },
    abaixar(sim) { if (!this.ganho || !Som.ctx) return; const alvo = 0.05 * Store.cfg.volMusica * (sim ? 0.25 : 1); this.ganho.gain.setTargetAtTime(alvo, Som.ctx.currentTime, 0.15); }
  };

  // ---- Microfone (opcional, desligado por padrão, exige consentimento do adulto)
  const Micro = {
    Rec: window.SpeechRecognition || window.webkitSpeechRecognition || null,
    get suportado() { return !!this.Rec; },
    get ativo() { return this.suportado && Store.cfg.mic && Store.cfg.micConsent; },
    get podeGravar() { return !!(navigator.mediaDevices && window.MediaRecorder) && Store.cfg.mic && Store.cfg.micConsent; },
    ouvir(ms = 7000) {
      return new Promise((resolve) => {
        if (!this.ativo) return resolve(null);
        let r; try { r = new this.Rec(); } catch (e) { return resolve(null); }
        r.lang = 'pt-BR'; r.maxAlternatives = 10; r.interimResults = false; r.continuous = false;
        let alts = []; let feito = false;
        const fim = (v) => { if (feito) return; feito = true; clearTimeout(t); try { r.abort(); } catch (e) { /* */ } resolve(v); };
        r.onresult = (ev) => { for (const res of ev.results) for (const a of res) alts.push(a.transcript); fim(alts); };
        r.onerror = () => fim(alts.length ? alts : []); r.onend = () => fim(alts);
        const t = setTimeout(() => fim(alts), ms);
        try { Musica.abaixar(true); r.start(); } catch (e) { fim(null); }
      });
    },
    norm: (t) => N.semAcento(t || '').replace(/Ç/g, 'C').replace(/Ã/g, 'A').replace(/Õ/g, 'O').replace(/[^A-Z ]/g, ' ').replace(/\s+/g, ' ').trim(),
    lev(a, b) { const m = a.length, n = b.length; const d = Array.from({ length: m + 1 }, (_, i) => [i]); for (let j = 1; j <= n; j++) d[0][j] = j; for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; },
    /** Comparação tolerante: devolve índices das palavras reconhecidas e se passou */
    comparar(alvo, alts) {
      const palavras = this.norm(alvo).split(' ').filter(Boolean);
      const ouvidas = new Set(); (alts || []).forEach((a) => this.norm(a).split(' ').forEach((w) => ouvidas.add(w)));
      const reconhecidas = [];
      palavras.forEach((p, i) => { for (const o of ouvidas) { if (o === p || (p.length >= 4 && this.lev(o, p) <= 1) || (p.length >= 7 && this.lev(o, p) <= 2)) { reconhecidas.push(i); break; } } });
      return { reconhecidas, ok: palavras.length ? reconhecidas.length / palavras.length >= (palavras.length === 1 ? 1 : 0.6) : false };
    },
    async gravar(ms = 4000) {
      if (!this.podeGravar) return null;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const rec = new MediaRecorder(stream); const partes = [];
        rec.ondataavailable = (e) => partes.push(e.data);
        const pronto = new Promise((r) => { rec.onstop = r; });
        rec.start(); await dormir(ms); rec.stop(); await pronto; stream.getTracks().forEach((t) => t.stop());
        return URL.createObjectURL(new Blob(partes, { type: rec.mimeType || 'audio/webm' }));
      } catch (e) { return null; }
    }
  };

  // ======================================================================
  // 4. MASCOTE "LILI" (SVG original que evolui com o nível)
  // ======================================================================
  function mascote(opc = {}) {
    const p = Store.perfil;
    const nivel = opc.nivel !== undefined ? opc.nivel : (p ? Motor.nivel(p) : 0);
    const equip = (p && p.loja.equip) || {};
    const corItem = equip.cor && D.loja.find((x) => x.id === equip.cor);
    const cor = opc.cor || (corItem ? corItem.valor : '#b98a5e');
    const enfeite = D.niveis[nivel].enfeite;
    const ac = opc.acessorio !== undefined ? opc.acessorio : equip.acessorio;
    const feliz = opc.humor === 'feliz';
    const olhos = feliz ? '<path d="M38 56 q8 -9 16 0" stroke="#2b2b2b" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M66 56 q8 -9 16 0" stroke="#2b2b2b" stroke-width="4" fill="none" stroke-linecap="round"/>'
      : '<circle cx="46" cy="56" r="13" fill="#fff"/><circle cx="74" cy="56" r="13" fill="#fff"/><circle cx="47" cy="57" r="6.5" fill="#2b2b2b"/><circle cx="73" cy="57" r="6.5" fill="#2b2b2b"/><circle cx="49" cy="54" r="2.2" fill="#fff"/><circle cx="75" cy="54" r="2.2" fill="#fff"/>';
    const enf = {
      casca: '<path d="M26 100 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10 l8 -10 l8 10 l8 -10 v18 h-80 z" fill="#fffdf2" stroke="#d9cfae" stroke-width="2"/>',
      broto: '<path d="M60 26 v-12" stroke="#3c9a3c" stroke-width="4"/><ellipse cx="53" cy="13" rx="8" ry="4" fill="#5cc35c"/><ellipse cx="67" cy="13" rx="8" ry="4" fill="#5cc35c"/>',
      flor: '<g transform="translate(60 18)"><circle r="5" fill="#ffd54a"/><circle cx="0" cy="-8" r="5" fill="#ff7aa8"/><circle cx="8" cy="0" r="5" fill="#ff7aa8"/><circle cx="0" cy="8" r="5" fill="#ff7aa8"/><circle cx="-8" cy="0" r="5" fill="#ff7aa8"/><circle r="4" fill="#ffd54a"/></g>',
      chapeuExplorador: '<ellipse cx="60" cy="30" rx="34" ry="7" fill="#c8a165"/><path d="M40 30 q20 -28 40 0z" fill="#d9b27a"/><rect x="40" y="25" width="40" height="5" fill="#7a5530"/>',
      mochila: '<rect x="88" y="66" width="18" height="26" rx="5" fill="#2f6fde"/><rect x="91" y="72" width="12" height="7" rx="2" fill="#7fb0ff"/>',
      lupa: '<circle cx="98" cy="84" r="9" fill="#cfe9ff" stroke="#555" stroke-width="3"/><path d="M104 91 l8 9" stroke="#7a5530" stroke-width="5" stroke-linecap="round"/>',
      capelo: '<path d="M30 26 l30 -12 l30 12 l-30 12z" fill="#222"/><rect x="48" y="28" width="24" height="8" fill="#222"/><path d="M88 27 v14" stroke="#ffd54a" stroke-width="3"/>',
      capa: '<path d="M24 60 q-6 40 14 52 h44 q20 -12 14 -52 z" fill="#e2574c" opacity=".9"/><text x="54" y="104" font-size="14">⭐</text>'
    };
    const aces = {
      laco: '<path d="M44 30 l14 8 l-14 8z M76 30 l-14 8 l14 8z" fill="#ff5c8a"/><circle cx="60" cy="38" r="4" fill="#ff5c8a"/>',
      oculos: '<circle cx="46" cy="56" r="14" fill="none" stroke="#333" stroke-width="3"/><circle cx="74" cy="56" r="14" fill="none" stroke="#333" stroke-width="3"/><path d="M60 56 h0" stroke="#333" stroke-width="3"/>',
      cachecol: '<path d="M32 78 q28 12 56 0 v8 q-28 12 -56 0z" fill="#3fb37f"/><rect x="70" y="84" width="9" height="18" fill="#3fb37f"/>',
      chapeu: '<rect x="44" y="6" width="32" height="24" fill="#333"/><rect x="34" y="28" width="52" height="6" rx="3" fill="#333"/><rect x="44" y="22" width="32" height="4" fill="#e2574c"/>',
      coroa: '<path d="M38 32 l6 -18 l9 12 l7 -16 l7 16 l9 -12 l6 18z" fill="#ffd54a" stroke="#c9a400" stroke-width="2"/>'
    };
    const svg = `<svg viewBox="0 0 120 120" class="mascote ${opc.mini ? 'mini' : ''} ${opc.anim ? 'anim-' + opc.anim : ''}" role="img" aria-label="Lili, a corujinha">
      ${enfeite === 'capa' ? enf.capa : ''}
      <path d="M30 42 L34 16 L50 32 Z" fill="${cor}"/><path d="M90 42 L86 16 L70 32 Z" fill="${cor}"/>
      <ellipse cx="60" cy="72" rx="38" ry="40" fill="${cor}"/>
      <ellipse cx="60" cy="84" rx="24" ry="24" fill="#fff3dc"/>
      <path d="M48 80 q4 4 8 0 M56 88 q4 4 8 0 M64 80 q4 4 8 0" stroke="#e6cfa8" stroke-width="2" fill="none"/>
      <ellipse cx="24" cy="76" rx="9" ry="20" fill="${cor}" transform="rotate(12 24 76)" opacity=".85"/><ellipse cx="96" cy="76" rx="9" ry="20" fill="${cor}" transform="rotate(-12 96 76)" opacity=".85"/>
      ${olhos}<path d="M55 66 L65 66 L60 75 Z" fill="#f5a623"/>
      <path d="M46 110 l4 -6 l4 6 M66 110 l4 -6 l4 6" stroke="#f5a623" stroke-width="3" fill="none"/>
      ${enfeite !== 'capa' && enf[enfeite] ? enf[enfeite] : ''}${ac && aces[ac] ? aces[ac] : ''}</svg>`;
    const w = el('span', { html: svg }); return w.firstElementChild;
  }
  function animarMascote(anim) { const m = document.querySelector('.barra-jogo .mascote, .mascote'); if (!m || reduzMovimento()) return; m.classList.remove('anim-pula', 'anim-danca', 'anim-pensa'); void m.offsetWidth; m.classList.add('anim-' + anim); }

  // ---- Confete (implementação própria, leve)
  const Confete = {
    lancar(qtd = 80) {
      if (reduzMovimento()) return;
      const cv = $('#confete'); const ctx = cv.getContext('2d'); cv.width = innerWidth; cv.height = innerHeight;
      const cores = ['#ff5c8a', '#ffd54a', '#2f6fde', '#3fb37f', '#ff9f43', '#9f7aea'];
      const ps = Array.from({ length: qtd }, () => ({ x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight * 0.4, vx: (Math.random() - 0.5) * 12, vy: -Math.random() * 12 - 4, r: Math.random() * 6 + 4, c: cores[Math.floor(Math.random() * cores.length)], a: Math.random() * 6 }));
      let t = 0; const passo = () => {
        ctx.clearRect(0, 0, cv.width, cv.height); t++;
        ps.forEach((p) => { p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.a += 0.2; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore(); });
        if (t < 110) requestAnimationFrame(passo); else ctx.clearRect(0, 0, cv.width, cv.height);
      };
      passo();
    }
  };

  // Estado global da sessão
  const estado = { mundoAtual: 1, sessaoInicio: Date.now(), sessaoSeg: 0, pausaSugerida: false, limiteAvisado: false, emJogo: false };

  // ======================================================================
  // 5. CONTINUA NAS PARTES SEGUINTES (cenas e minijogos)
  // ======================================================================
  window.LB = { Store, Som, Efeito, Musica, Micro, Motor, D, N, el, tela, fmt, fig, toast, modal, mascote, animarMascote, Confete, estado, aplicarModos, dormir, DEBUG, $, mostrarAmbas, reduzMovimento, Sintese };
})();
