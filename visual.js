/* ==========================================================================
   Ler Brincando — visual.js  (v1.2)
   Cenários ilustrados em SVG (um por mundo), trilha sinuosa do mapa.
   Tudo vetorial e leve: nada de imagens externas.
   ========================================================================== */
(function () {
  'use strict';
  const R = (min, max, i) => min + ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1 * (max - min);
  function nuvens(cor = '#fff', op = 0.9, y0 = 60) {
    let s = '';
    for (let i = 0; i < 4; i++) {
      const x = R(10, 360, i + 1), y = y0 + R(0, 90, i + 7), k = R(0.7, 1.3, i + 3);
      s += `<g opacity="${op}" transform="translate(${x} ${y}) scale(${k})" class="nuvem n${i}"><ellipse cx="0" cy="0" rx="30" ry="14" fill="${cor}"/><ellipse cx="18" cy="-8" rx="20" ry="14" fill="${cor}"/><ellipse cx="-16" cy="-5" rx="16" ry="11" fill="${cor}"/></g>`;
    }
    return s;
  }
  const sol = (x, y, r, cor = '#ffd54a') => `<g class="sol"><circle cx="${x}" cy="${y}" r="${r * 1.7}" fill="${cor}" opacity=".25"/><circle cx="${x}" cy="${y}" r="${r}" fill="${cor}"/></g>`;
  const ceu = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="800" fill="url(#${id})"/>`;
  const colina = (y, amp, cor, fase = 0) => { let d = `M0 ${y}`; for (let x = 0; x <= 400; x += 20) d += ` L${x} ${(y + Math.sin((x / 400) * Math.PI * 2 + fase) * amp).toFixed(1)}`; return `<path d="${d} L400 800 L0 800Z" fill="${cor}"/>`; };
  const flores = (y0, n, cores) => { let s = ''; for (let i = 0; i < n; i++) { const x = R(5, 395, i + 11), y = y0 + R(0, 180, i + 5), c = cores[i % cores.length]; s += `<g transform="translate(${x} ${y})"><circle r="4.5" fill="${c}"/><circle r="1.8" fill="#fff6a8"/></g>`; } return s; };
  const pinheiro = (x, y, h, cor) => `<path d="M${x} ${y - h} L${x - h * 0.38} ${y - h * 0.35} L${x - h * 0.2} ${y - h * 0.35} L${x - h * 0.45} ${y} L${x + h * 0.45} ${y} L${x + h * 0.2} ${y - h * 0.35} L${x + h * 0.38} ${y - h * 0.35}Z" fill="${cor}"/><rect x="${x - h * 0.05}" y="${y}" width="${h * 0.1}" height="${h * 0.12}" fill="#6b4a2b"/>`;
  const CENARIOS = {
    1: () => ceu('g1', '#8fdcff', '#d9f6ff') + sol(320, 110, 34) + nuvens() +
      `<path d="M0 470 Q100 450 200 470 T400 470 V800 H0Z" fill="#41b8e6"/><path d="M0 500 Q100 480 200 500 T400 500 V800 H0Z" fill="#2aa3d6" class="onda"/>` +
      `<path d="M0 600 Q120 560 240 590 T400 580 V800 H0Z" fill="#ffe3a3"/><path d="M0 650 Q140 620 260 640 T400 630 V800 H0Z" fill="#ffd27d"/>` +
      `<g transform="translate(60 600)"><path d="M0 0 Q8 -80 22 -150" stroke="#9b6a3c" stroke-width="10" fill="none" stroke-linecap="round"/><g transform="translate(22 -150)" fill="#3aa856"><path d="M0 0 Q-50 -10 -70 25 Q-35 0 0 0Z"/><path d="M0 0 Q50 -15 72 20 Q35 -2 0 0Z"/><path d="M0 0 Q-20 -45 -55 -50 Q-15 -30 0 0Z"/><path d="M0 0 Q25 -45 60 -45 Q20 -25 0 0Z"/></g></g>`,
    2: () => ceu('g2', '#9fe3ff', '#f2fff0') + sol(70, 100, 30) + nuvens('#fff', 0.95, 70) +
      colina(440, 25, '#b9ec94', 0.5) + colina(520, 30, '#8fd96b', 2) + colina(620, 22, '#6cc552', 4) + flores(470, 40, ['#ff7aa8', '#ffd54a', '#ffffff', '#b38cff', '#ff9f43']),
    3: () => ceu('g3', '#bfe8c4', '#5ea56b') + nuvens('#eaffef', 0.6, 40) +
      Array.from({ length: 9 }, (_, i) => pinheiro(R(0, 400, i + 21), 470 + R(-30, 20, i), R(130, 190, i + 2), '#3f8f55')).join('') + colina(500, 14, '#4f9a5c', 1) +
      Array.from({ length: 8 }, (_, i) => pinheiro(R(0, 400, i + 41), 640 + R(-20, 30, i), R(140, 210, i + 9), '#2d6e40')).join('') + colina(690, 10, '#2c6a3d', 3) +
      Array.from({ length: 14 }, (_, i) => `<circle cx="${R(0, 400, i + 61)}" cy="${R(250, 700, i + 71)}" r="2.5" fill="#fff9a8" class="vagalume" style="animation-delay:${(i % 5) * 0.6}s"/>`).join(''),
    4: () => ceu('g4', '#a9b8f0', '#f2f4ff') + sol(300, 90, 26, '#fff3c4') + nuvens('#ffffff', 0.85, 140) +
      `<path d="M-20 560 L90 300 L200 560Z" fill="#8d8fc9"/><path d="M90 300 L60 370 L80 360 L95 380 L112 352 L125 365Z" fill="#fff"/>` +
      `<path d="M120 580 L270 230 L420 580Z" fill="#7577b8"/><path d="M270 230 L232 318 L258 300 L275 326 L292 296 L310 318Z" fill="#fff"/>` +
      `<path d="M250 600 L360 380 L470 600Z" fill="#9a9ad6"/><path d="M360 380 L338 425 L357 418 L372 433 L385 420Z" fill="#fff"/>` + colina(590, 18, '#d9def7', 1) + colina(660, 14, '#c3c9ef', 3),
    5: () => ceu('g5', '#8fd3f5', '#e6f9ff') + sol(70, 90, 28) + nuvens() + colina(420, 20, '#a6e08a', 0.3) + colina(470, 16, '#8bd06f', 2.2) +
      `<path d="M150 470 C120 540 280 560 220 640 C170 700 320 740 300 800 L410 800 L410 470Z" fill="#57b9ea"/><path d="M175 480 C150 545 300 565 245 640 C200 700 340 740 330 800" stroke="#bfeaff" stroke-width="4" fill="none" stroke-dasharray="14 18" class="corrente"/>` +
      `<path d="M0 455 L400 435" stroke="#7a5530" stroke-width="5"/><path d="M0 463 L400 443" stroke="#7a5530" stroke-width="5"/>` +
      Array.from({ length: 21 }, (_, i) => `<rect x="${i * 20}" y="${451 - i}" width="6" height="16" fill="#a9784a"/>`).join(''),
    6: () => ceu('g6', '#2c2350', '#5b4797') +
      Array.from({ length: 10 }, (_, i) => { const x = i * 42 + 5, h = R(50, 140, i + 5); return `<path d="M${x} 0 L${x + 36} 0 L${x + 18} ${h}Z" fill="#3b2f68"/>`; }).join('') +
      colina(600, 20, '#3b2f68', 1) + colina(680, 16, '#2a2150', 2.5) +
      Array.from({ length: 9 }, (_, i) => { const x = R(10, 380, i + 31), y = R(560, 760, i + 17), s = R(0.7, 1.4, i + 3), c = ['#7ef2ff', '#ff8ef0', '#b6ff8e', '#ffe27a'][i % 4]; return `<g transform="translate(${x} ${y}) scale(${s})" class="cristal" style="animation-delay:${i * 0.4}s"><path d="M0 -40 L12 -10 L6 0 L-6 0 L-12 -10Z" fill="${c}" opacity=".9"/><path d="M0 -40 L4 -10 L0 0Z" fill="#fff" opacity=".6"/></g>`; }).join('') +
      Array.from({ length: 30 }, (_, i) => `<circle cx="${R(0, 400, i + 91)}" cy="${R(150, 550, i + 93)}" r="${R(0.8, 2.2, i)}" fill="#fff" opacity=".7" class="brilha" style="animation-delay:${(i % 6) * 0.5}s"/>`).join(''),
    7: () => ceu('g7', '#ffb8a8', '#ffeede') + sol(80, 150, 40, '#ffe08a') + nuvens('#fff4ef', 0.9, 60) + colina(560, 18, '#9bd47a', 1.2) +
      `<g transform="translate(200 560)" fill="#cfa6e6"><rect x="-110" y="-160" width="220" height="160"/><rect x="-150" y="-230" width="60" height="230"/><rect x="90" y="-230" width="60" height="230"/><rect x="-35" y="-280" width="70" height="280"/>` +
      `<path d="M-160 -230 L-120 -290 L-80 -230Z M80 -230 L120 -290 L160 -230Z M-45 -280 L0 -350 L45 -280Z" fill="#9a6fc9"/>` +
      Array.from({ length: 6 }, (_, i) => `<rect x="${-105 + i * 38}" y="-178" width="22" height="18" fill="#cfa6e6"/>`).join('') +
      `<path d="M-25 0 L-25 -60 Q0 -95 25 -60 L25 0Z" fill="#7a4e2a"/><rect x="-130" y="-190" width="20" height="30" rx="10" fill="#ffe28a"/><rect x="110" y="-190" width="20" height="30" rx="10" fill="#ffe28a"/><rect x="-10" y="-240" width="20" height="30" rx="10" fill="#ffe28a"/>` +
      `<path d="M0 -350 L0 -390 L30 -380 L0 -370" fill="#e2574c" stroke="#7a4e2a" stroke-width="3"/></g>` + colina(650, 14, '#7cc25c', 3),
    8: () => ceu('g8', '#f5d9a8', '#fff6e4') +
      Array.from({ length: 6 }, (_, r) => {
        const y = 120 + r * 110; let s = `<rect x="0" y="${y + 70}" width="400" height="12" fill="#a8743f"/>`; let x = 6; let i = 0;
        while (x < 395) { const w = R(14, 26, r * 40 + i), h = R(45, 70, r * 33 + i); const c = ['#e2574c', '#2f6fde', '#3fb37f', '#ffb020', '#9f7aea', '#ff7aa8'][(r + i) % 6]; s += `<rect x="${x}" y="${y + 70 - h}" width="${w}" height="${h}" rx="2" fill="${c}" opacity=".75"/><rect x="${x + 3}" y="${y + 74 - h}" width="${w - 6}" height="3" fill="#fff" opacity=".5"/>`; x += w + 2; i++; }
        return s;
      }).join('') + `<rect width="400" height="800" fill="#fff6e4" opacity=".35"/>`
  };
  const enquadre = () => (innerWidth > innerHeight * 1.1 ? 'xMidYMid slice' : 'xMidYMax slice'); // paisagem: horizonte; retrato: chão
  function cenario(mundo) { return `<svg viewBox="0 0 400 800" preserveAspectRatio="${enquadre()}" aria-hidden="true">${(CENARIOS[mundo] || CENARIOS[1])()}</svg>`; }
  addEventListener('resize', () => { const sv = document.querySelector('#cenario svg'); if (sv) sv.setAttribute('preserveAspectRatio', enquadre()); });
  let atual = 0;
  function aplicarCenario(mundo, modo) {
    const c = document.getElementById('cenario'); if (!c) return;
    if (atual !== mundo) { c.innerHTML = cenario(mundo); atual = mundo; }
    c.dataset.modo = modo || 'mapa';
    document.body.dataset.mundo = String(mundo);
    document.body.dataset.tela = modo || 'mapa';
  }
  function trilha(n, largura) {
    const passo = largura < 500 ? 118 : 128;
    const altura = 140 + n * passo;
    const amp = Math.min(largura * 0.28, 260);
    const cx = largura / 2; const pts = [];
    for (let i = 0; i < n; i++) pts.push({ x: cx + Math.sin(i * 1.05 + 0.4) * amp, y: altura - 90 - i * passo });
    let d = `M${pts[0].x} ${pts[0].y + 60} L${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < n; i++) { const a = pts[i - 1], b = pts[i]; const my = (a.y + b.y) / 2; d += ` C${a.x} ${my} ${b.x} ${my} ${b.x} ${b.y}`; }
    return { pts, d, altura };
  }
  window.Visual = { cenario, aplicarCenario, trilha };
})();
