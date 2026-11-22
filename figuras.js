// Figuras próprias do jogo (estilo 3D brilhante, iguais ao ícone da Lili).
// Pasta figuras/ — recortadas das folhas com ferramentas/recortar_figuras.py.
// Onde não há figura própria, o jogo continua usando OpenMoji (imagens/).
(function () {
  'use strict';
  const B = 'figuras/';
  // Palavras: código OpenMoji → arquivo (mesmo nome)
  const PALAVRAS = [
    '1FA80', '1F426', '1F95A', '1F347', '1F475', '1F474', '1F931', '1F9E6', '1F9F2', '1F467', '1F466', '1F6A2',
    '2744', '1F9CD', '1F319', '1F991', '1F31E', '1F337', '1F345', '1F34C', '1F34D', '1F36C', '1F372', '1F373',
    '1F382', '1F3B2', '1F3B5', '1F3B9', '1F3CD', '1F3D8', '1F3EC', '1F402', '1F40B', '1F410', '1F417', '1F41F',
    '1F42B', '1F438', '1F43A', '1F444', '1F462', '1F468', '1F469', '1F476', '1F487', '1F4E6', '1F4F7', '1F50C',
    '1F50D', '1F512', '1F514', '1F56F', '1F5D1', '1F5F3', '1F5FA', '1F6CB', '1F6CF', '1F6F4', '1F6F6', '1F951',
    '1F952', '1F954', '1F957', '1F95B', '1F986', '1F98C', '1F9A3', '1F9B6', '1F9DA', '1F9E2', '1F9E4', '1F9F0',
    '1F9F1', '1F9F3', '1F9F6', '1F9FC', '1FA79', '1FA81', '1FA86', '1FA99', '1FA9F', '1FAB5', '1FAB6', '1FACF',
    '1FAD2', '1FAD6', '1FAD9', '260E', '2615', '261D', '26BD', '27A1', '1F425', '1F43E', '1F45E', '1F6E9',
    '1F309', '1F30A', '1F30B', '1F331', '1F333', '1F334', '1F336', '1F344', '1F348', '1F34A', '1F34B', '1F350',
    '1F353', '1F35E', '1F366', '1F36A', '1F36D', '1F36E', '1F36F', '1F374', '1F37F', '1F388', '1F3AD', '1F3AE',
    '1F3B6', '1F3B8', '1F3D4', '1F3E0', '1F3EB', '1F3F0', '1F3F8', '1F403', '1F404', '1F409', '1F40A', '1F40C',
    '1F40D', '1F412', '1F413', '1F418', '1F419', '1F41C', '1F422', '1F428', '1F431', '1F434', '1F437', '1F43B',
    '1F43C', '1F443', '1F445', '1F451', '1F453', '1F454', '1F455', '1F457', '1F45C', '1F45F', '1F47B', '1F47C',
    '1F48C', '1F48D', '1F4A1', '1F4A7', '1F4BB', '1F4C4', '1F4CE', '1F4F0', '1F4FA', '1F518', '1F525', '1F526',
    '1F528', '1F52A', '1F54A', '1F58A', '1F5E1', '1F68C', '1F6A9', '1F6AA', '1F6B0', '1F6D6', '1F6E1', '1F6FC',
    '1F941', '1F945', '1F95C', '1F964', '1F965', '1F966', '1F967', '1F969', '1F96D', '1F977', '1F981', '1F982',
    '1F983', '1F984', '1F988', '1F989', '1F98B', '1F98D', '1F98E', '1F990', '1F998', '1F99A', '1F99C', '1F99D',
    '1F9AB', '1F9AD', '1F9B5', '1F9B7', '1F9C2', '1F9C3', '1F9D9', '1F9DB', '1F9DC', '1F9DF', '1F9F4', '1F9FD',
    '1FA91', '1FA9C', '1FAA2', '1FAA3', '1FAA5', '1FAAE', '1FAB0', '1FAB2', '1FAB3', '1FAB4', '1FABC', '1FABF',
    '1FAD1', '1FAD8', '2600', '2601', '2604', '26F5', '2702', '2708', '2709', '270B', '270F', '2B50'
  ];
  // 1ª leva (16): IOIÔ AVE OVO UVA VOVÓ VOVÔ MAMÃE MEIA ÍMÃ MENINA MENINO NAVIO NEVE FILA LUA LULA; 2ª leva (80) e 3ª leva (144): ver figuras/palavras
  // Figuras desenhadas para o sentido da palavra no jogo, diferente do emoji usado nas histórias
  // (BICO = cabeça de pássaro com bico, nas histórias 🐥 é o pintinho; PATA = a pata, fêmea do pato, nas histórias 🐾 é pegada)
  const SO_PALAVRA = ['1F425', '1F43E'];
  // Ícones da interface que aparecem como texto (botões, placas, avisos)
  const UI = {
    '🔊': 'ouvir', '🐢': 'devagar', '🔒': 'cadeado', '⭐': 'estrela', '🪙': 'moeda', '🎁': 'presente',
    '🛟': 'ajuda', '⏩': 'adiantar', '🥁': 'tambor', '✅': 'certo', '🎤': 'microfone', '🗺️': 'mapa',
    '📖': 'livro', '🏆': 'trofeu', '💡': 'dica', '🏠': 'casa'
  };
  const AVATARES = {
    '🦊': 'raposa', '🐼': 'panda', '🐯': 'tigre', '🐸': 'sapo', '🦄': 'unicornio', '🐙': 'polvo',
    '🐵': 'macaco', '🐰': 'coelho', '🐻': 'urso', '🐨': 'coala', '🦁': 'leao', '🐧': 'pinguim'
  };
  const TEXTO = {};
  Object.entries(UI).forEach(([e, n]) => { TEXTO[e] = B + 'ui/' + n + '.webp'; });
  Object.entries(AVATARES).forEach(([e, n]) => { TEXTO[e] = B + 'avatares/' + n + '.webp'; });
  // aceita o emoji com ou sem o seletor de variação (FE0F)
  Object.keys(TEXTO).forEach((e) => { const s = e.replace(/️/g, ''); if (s !== e) TEXTO[s] = TEXTO[e]; });

  const img = (src, cls) => { const i = document.createElement('img'); i.src = src; i.alt = ''; i.draggable = false; i.className = cls || 'ico-fig'; i.decoding = 'async'; return i; };

  // Troca emojis de texto por figuras dentro de um elemento (ignora SVG, campos e áreas marcadas)
  const chaves = Object.keys(TEXTO).sort((a, b) => b.length - a.length).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const RE = new RegExp('(' + chaves.join('|') + ')️?', 'gu');
  function trocarTexto(raiz) {
    if (!raiz || !raiz.ownerDocument && raiz !== document) return;
    const andar = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        const p = n.parentElement;
        if (!p || p.closest('svg, textarea, input, script, style, [data-sem-fig], .emoji-nativo')) return NodeFilter.FILTER_REJECT;
        RE.lastIndex = 0; return RE.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    const nos = []; let n; while ((n = andar.nextNode())) nos.push(n);
    nos.forEach((no) => {
      const frag = document.createDocumentFragment(); let i = 0; const t = no.nodeValue; RE.lastIndex = 0; let m;
      while ((m = RE.exec(t))) {
        if (m.index > i) frag.append(t.slice(i, m.index));
        const e = m[1]; frag.append(img(TEXTO[e] || TEXTO[e.replace(/️/g, '')]));
        i = m.index + m[0].length;
      }
      if (i < t.length) frag.append(t.slice(i));
      no.replaceWith(frag);
    });
  }
  let obs = null;
  function observar() {
    if (obs || !window.MutationObserver) return;
    obs = new MutationObserver((lista) => { lista.forEach((r) => r.addedNodes.forEach((n) => { if (n.nodeType === 1) trocarTexto(n); else if (n.nodeType === 3 && n.parentElement) trocarTexto(n.parentElement); })); });
    obs.observe(document.body, { childList: true, subtree: true });
    trocarTexto(document.body);
  }

  // Lili: pose conforme o humor/animação
  function poseLili(opc) {
    if (opc.pose) return opc.pose;
    if (opc.anim === 'pensa') return 'pensa';
    if (opc.humor === 'feliz') return (opc.anim === 'danca' || opc.anim === 'pula') ? 'comemora' : 'feliz';
    if (opc.mini) return 'aponta';
    return 'acena';
  }
  // diferença de matiz entre a cor escolhida na Lojinha e o dourado original
  function giroCor(hex) {
    if (!hex) return 0;
    const n = parseInt(hex.slice(1), 16); const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b); if (mx === mn) return 0;
    let h = mx === r ? (g - b) / (mx - mn) : mx === g ? 2 + (b - r) / (mx - mn) : 4 + (r - g) / (mx - mn);
    h = (h * 60 + 360) % 360; return Math.round(h - 40);
  }

  window.Figuras = {
    ativo: true,
    // emCena = figura montada com vários emojis (histórias): aí as figuras que só valem para a palavra ficam de fora
    palavra: (code, emCena) => (PALAVRAS.includes(code) && !(emCena && SO_PALAVRA.includes(code)) ? B + 'palavras/' + code + '.webp' : null),
    mundo: (id) => B + 'mundos/mundo' + id + '.webp',
    bau: B + 'mundos/bau.webp',
    medalha: (id) => B + 'medalhas/' + id + '.webp',
    loja: (id) => (/^(laco|oculos|cachecol|chapeu|coroa|mapaPorDoSol|mapaOceano|mapaDoce)$/.test(id) ? B + 'loja/' + id + '.webp' : null),
    enfeite: (nome) => B + 'loja/' + nome + '.webp',
    lili: (pose) => B + 'lili/' + pose + '.webp',
    ui: (nome) => B + 'ui/' + nome + '.webp',
    img, trocarTexto, observar, poseLili, giroCor,
    lista() { // para o service worker guardar offline
      const l = PALAVRAS.map((c) => 'palavras/' + c);
      Object.values(UI).forEach((n) => l.push('ui/' + n)); Object.values(AVATARES).forEach((n) => l.push('avatares/' + n));
      ['ouvidoOuro', 'contador', 'persistente', 'escritor', 'leitor', 'estrelas', 'colecionador', 'voz', 'tracos', 'mundo1', 'mundo4', 'superLeitor'].forEach((n) => l.push('medalhas/' + n));
      ['casca', 'broto', 'flor', 'chapeuExplorador', 'mochila', 'lupa', 'capelo', 'capa', 'laco', 'oculos', 'cachecol', 'chapeu', 'coroa', 'mapaPorDoSol', 'mapaOceano', 'mapaDoce'].forEach((n) => l.push('loja/' + n));
      [1, 2, 3, 4, 5, 6, 7, 8].forEach((n) => l.push('mundos/mundo' + n)); l.push('mundos/bau');
      ['acena', 'fala', 'feliz', 'comemora', 'ideia', 'pensa', 'aponta', 'le', 'dorme'].forEach((n) => l.push('lili/' + n));
      return l.map((x) => B + x + '.webp');
    }
  };
})();
