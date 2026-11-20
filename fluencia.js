/* ==========================================================================
   Ler Brincando — fluencia.js  (medidor de fluência leitora, melhoria 6)
   Teste de 1 minuto mediado pelo adulto, como nas avaliações de fluência das redes:
   a criança lê em voz alta; o adulto toca nas palavras erradas ou puladas e, no fim,
   na última palavra lida. Resultado: palavras corretas por minuto (PCPM) e precisão.
   O reconhecimento automático de fala não é confiável com vozes infantis (e não existe
   no app Android), por isso a correção é do adulto. A gravação é opcional e fica só no aparelho.
   ========================================================================== */
(function (raiz) {
  'use strict';
  /** Cálculo puro (também usado nos testes do Node) */
  function calcular(r) {
    const seg = Math.max(1, Math.round(r.seg || 0)); const lidas = Math.max(0, r.lidas | 0);
    const erros = Math.min(lidas, Math.max(0, r.erros | 0)); const corretas = lidas - erros;
    return { lidas, erros, seg, corretas, pcpm: Math.round(corretas * 60 / seg), precisao: lidas ? Math.round(corretas / lidas * 100) : 0 };
  }
  /** Palavras do texto (pontuação fica grudada na palavra; travessões soltos não contam) */
  function palavrasDoTexto(frases, limpar) {
    const out = [];
    frases.forEach((f) => limpar(f).split(/\s+/).forEach((w) => { if (/[A-Za-zÀ-ÿ]/.test(w)) out.push(w); }));
    return out;
  }
  const API = { calcular, palavrasDoTexto, DURACAO: 60 };
  if (typeof module !== 'undefined' && module.exports) { module.exports = API; return; }
  raiz.Fluencia = API;
  const LB = raiz.LB; if (!LB) return;
  const { Store, Som, Motor, D, N, el, tela, fmt, toast, modal, dormir } = LB;

  const textos = () => D.historias.filter((h) => !h.oral && h.mundo >= 3).map((h) => ({ id: h.id, titulo: h.titulo, mundo: h.mundo, palavras: palavrasDoTexto(h.frases.map((x) => x.t), N.fraseLimpa) }));
  const mundoAtual = (p) => { for (let i = 0; i < D.fases.length; i++) { const r = p.fases[D.fases[i].id]; if (Motor.faseLiberada(p, i) && !(r && r.dominada)) return D.fases[i].mundo; } return D.mundos.length; };
  const podeGravar = () => !!(navigator.mediaDevices && raiz.MediaRecorder) && Store.cfg.micConsent;
  let ultimaGravacao = null;

  /** Aba "📈 Fluência" da Área dos Pais */
  function aba(c) {
    const p = Store.perfil;
    if (!p) { c.append(el('p', null, 'Escolha uma criança primeiro.')); return; }
    const lista = textos(); const m = mundoAtual(p);
    const sugerido = lista.filter((t) => t.mundo <= Math.max(3, m)).slice(-1)[0] || lista[0];
    const sel = el('select', { 'aria-label': 'texto' }, ...lista.map((t) => el('option', { value: t.id, selected: t.id === sugerido.id }, `${t.titulo} (Mundo ${t.mundo}, ${t.palavras.length} palavras)${t.id === sugerido.id ? ' ⭐ sugerido' : ''}`)));
    const gravar = el('input', { type: 'checkbox', disabled: !podeGravar() });
    c.append(el('h3', null, `📈 Fluência leitora de ${p.nome}`),
      el('p', null, 'Um teste de 1 minuto: a criança lê o texto em voz alta e você marca os erros. O resultado é o número de ', el('b', null, 'palavras corretas por minuto'), ' (PCPM). Repita a cada 2 a 4 semanas, sempre com um texto do nível da criança, e acompanhe a evolução.'),
      el('label', { class: 'linha' }, 'Texto: ', sel),
      el('label', { class: 'linha' }, gravar, podeGravar() ? 'Gravar a leitura para ouvir depois (fica só neste aparelho)' : 'Gravar a leitura (autorize o microfone em ⚙️ Configurações)'),
      el('button', { class: 'btn pri', type: 'button', onclick: () => instrucoes(lista.find((t) => t.id === sel.value), gravar.checked) }, '▶ Começar o teste'));
    historico(c, p);
  }
  function historico(c, p) {
    const h = (p.fluencia || []).slice().reverse();
    c.append(el('h3', null, '🗂️ Resultados anteriores'));
    if (!h.length) { c.append(el('p', null, 'Ainda não há testes. O primeiro resultado vira o ponto de partida.')); return; }
    const max = Math.max(30, ...h.map((x) => x.pcpm));
    const graf = el('div', { class: 'barras barras-fluencia', 'aria-label': 'palavras corretas por minuto ao longo do tempo' });
    h.slice(0, 12).reverse().forEach((x) => graf.append(el('div', { style: { height: Math.max(4, x.pcpm / max * 100) + '%' }, title: `${new Date(x.data).toLocaleDateString('pt-BR')}: ${x.pcpm} PCPM` }, el('span', null, String(x.pcpm)))));
    const t = el('table', null, el('tr', null, el('th', null, 'Data'), el('th', null, 'Texto'), el('th', null, 'PCPM'), el('th', null, 'Precisão'), el('th', null, 'Lidas/erros')));
    h.forEach((x) => t.append(el('tr', null, el('td', null, new Date(x.data).toLocaleDateString('pt-BR')), el('td', null, x.titulo), el('td', null, el('b', null, String(x.pcpm))), el('td', null, x.precisao + '%'), el('td', null, `${x.lidas}/${x.erros} em ${x.seg}s`))));
    const prim = h[h.length - 1], ult = h[0];
    c.append(graf, h.length > 1 ? el('p', null, `Evolução: de ${prim.pcpm} para ${ult.pcpm} PCPM (${ult.pcpm - prim.pcpm >= 0 ? '+' : ''}${ult.pcpm - prim.pcpm}).`) : null, t,
      el('p', { class: 'dica-pequena' }, 'Compare a criança com ela mesma. A precisão importa tanto quanto a velocidade: abaixo de 90%, priorize as fases de decodificação antes de pedir mais rapidez.'));
  }
  async function instrucoes(texto, gravar) {
    const ok = await modal((fechar) => [el('h2', null, '📈 Como fazer o teste'), el('ol', { style: { textAlign: 'left' } },
      el('li', null, 'Sente ao lado da criança, num lugar calmo. Diga: "Leia em voz alta, do seu jeito. Se não souber uma palavra, pule".'),
      el('li', null, 'Toque em ▶ Começar: o relógio conta 1 minuto.'),
      el('li', null, 'Toque nas palavras que ela errar ou pular (ficam vermelhas). Autocorreção não é erro: toque de novo para desfazer.'),
      el('li', null, 'Quando o tempo acabar, toque na última palavra que ela leu. Se terminar antes, toque em "Terminou".')),
      el('div', { class: 'acoes' }, el('button', { class: 'btn', type: 'button', onclick: () => fechar(false) }, 'Cancelar'), el('button', { class: 'btn pri', type: 'button', onclick: () => fechar(true) }, 'Entendi'))]);
    if (ok) teste(texto, gravar);
  }
  async function teste(texto, gravar) {
    Som.parar();
    const p = Store.perfil; const n = texto.palavras.length;
    const erros = new Set(); let ultima = null; let fase = 'pronto'; let inicio = 0; let segUsados = 0; let timer = null;
    let gravador = null, stream = null; const partes = [];
    const relogio = el('span', { class: 'pilula relogio' }, '⏱️ 60 s');
    const aviso = el('div', { class: 'aviso aviso-fluencia' }, 'Toque em ▶ Começar quando a criança estiver pronta.');
    const btIni = el('button', { class: 'btn pri', type: 'button' }, '▶ Começar');
    const btFim = el('button', { class: 'btn', type: 'button', disabled: true }, '🏁 Terminou');
    const btSair = el('button', { class: 'btn redondo', type: 'button', 'aria-label': 'cancelar o teste' }, '✖');
    const caixa = el('div', { class: 'texto-fluencia' });
    const bts = texto.palavras.map((w, i) => { const b = el('button', { class: 'pal', type: 'button' }, fmt(w)); b.onclick = () => tocar(i); caixa.append(b, ' '); return b; });
    tela(el('div', { class: 'painel teste-fluencia' }, el('div', { class: 'hud cab-painel' }, btSair, relogio, el('span', { class: 'esp' }), btIni, btFim), el('h3', { class: 'titulo-fluencia' }, '📖 ', texto.titulo), aviso, caixa));
    const pararGravacao = async () => { if (gravador && gravador.state !== 'inactive') { const pronto = new Promise((r) => { gravador.onstop = r; }); gravador.stop(); await pronto; } if (stream) stream.getTracks().forEach((t) => t.stop());
      if (partes.length) { if (ultimaGravacao) URL.revokeObjectURL(ultimaGravacao); ultimaGravacao = URL.createObjectURL(new Blob(partes, { type: (gravador && gravador.mimeType) || 'audio/webm' })); } };
    btSair.onclick = async () => { clearInterval(timer); await pararGravacao(); raiz.Cenas.painelPais('fluencia'); };
    btIni.onclick = async () => {
      btIni.disabled = true;
      if (gravar && podeGravar()) { try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); gravador = new MediaRecorder(stream); gravador.ondataavailable = (e) => partes.push(e.data); gravador.start(); } catch (e) { toast('Não deu para usar o microfone: o teste segue sem gravação.'); } }
      for (const k of [3, 2, 1]) { aviso.textContent = `Começa em ${k}...`; await dormir(800); }
      fase = 'lendo'; inicio = Date.now(); btIni.remove(); btFim.disabled = false; caixa.classList.add('ativo');
      aviso.textContent = 'Toque nas palavras erradas ou puladas.';
      timer = setInterval(() => { const r = Math.max(0, 60 - Math.floor((Date.now() - inicio) / 1000)); relogio.textContent = `⏱️ ${r} s`; if (r <= 0) acabouTempo(); }, 250);
    };
    const acabouTempo = async () => {
      clearInterval(timer); segUsados = 60; fase = 'ultima'; await pararGravacao();
      LB.Efeito.tocar('estrela'); relogio.textContent = '⏱️ 0 s'; btFim.remove();
      aviso.textContent = '⏰ Tempo! Agora toque na ÚLTIMA palavra que a criança leu.'; aviso.classList.add('destaque');
    };
    btFim.onclick = async () => {
      if (fase !== 'lendo') return;
      clearInterval(timer); segUsados = Math.max(1, Math.round((Date.now() - inicio) / 1000)); await pararGravacao();
      fase = 'ultima'; btFim.remove(); aviso.classList.add('destaque');
      aviso.textContent = `Terminou em ${segUsados} s. Toque na última palavra lida (ou`; aviso.append(' ', el('button', { class: 'btn mini', type: 'button', onclick: () => concluir(n - 1) }, 'leu tudo'), ').');
    };
    function tocar(i) {
      if (fase === 'lendo') { if (erros.has(i)) erros.delete(i); else erros.add(i); bts[i].classList.toggle('erro', erros.has(i)); }
      else if (fase === 'ultima') concluir(i);
    }
    function concluir(i) {
      ultima = i; fase = 'fim';
      bts.forEach((b, k) => b.classList.toggle('depois', k > ultima));
      const r = calcular({ lidas: ultima + 1, erros: [...erros].filter((k) => k <= ultima).length, seg: segUsados || 60 });
      const reg = Object.assign({ data: Motor.agora(), texto: texto.id, titulo: texto.titulo }, r);
      (p.fluencia = p.fluencia || []).push(reg); if (p.fluencia.length > 60) p.fluencia.shift();
      Store.salvar();
      if (raiz.Analitica) raiz.Analitica.registrar('fluencia_feita', { pcpm: r.pcpm, precisao: r.precisao, mundo: texto.mundo });
      if (raiz.Turma && raiz.Turma.dados) raiz.Turma.sincronizar(true);
      resultado(reg);
    }
    async function resultado(reg) {
      const ant = (p.fluencia || []).slice(-2, -1)[0];
      await modal((fechar) => [el('h2', null, '📈 Resultado'), el('div', { class: 'num-grande' }, String(reg.pcpm)), el('p', null, 'palavras corretas por minuto'),
        el('p', null, `${reg.lidas} palavras lidas, ${reg.erros} ${reg.erros === 1 ? 'erro' : 'erros'}, em ${reg.seg} s · precisão ${reg.precisao}%.`),
        ant ? el('p', null, `No teste anterior: ${ant.pcpm} PCPM (${reg.pcpm - ant.pcpm >= 0 ? '+' : ''}${reg.pcpm - ant.pcpm}).`) : el('p', null, 'Este é o ponto de partida. Repita daqui a 2 a 4 semanas.'),
        ultimaGravacao ? el('audio', { controls: true, src: ultimaGravacao, style: { width: '100%' } }) : null,
        el('button', { class: 'btn pri', type: 'button', onclick: () => fechar() }, 'OK')]);
      raiz.Cenas.painelPais('fluencia');
    }
  }
  API.aba = aba; API.textos = textos;
})(typeof window !== 'undefined' ? window : globalThis);
