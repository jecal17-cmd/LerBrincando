/* ==========================================================================
   Ler Brincando — nucleo.js
   Núcleo linguístico (sem DOM): análise de grafemas, tonicidade, rimas,
   decodificabilidade e utilitários compartilhados (navegador e Node).
   ========================================================================== */
(function (raiz) {
  'use strict';

  const VOGAIS = 'AEIOUÁÉÍÓÚÂÊÔÃÕÀ';
  const BASE = { 'Á': 'A', 'Â': 'A', 'À': 'A', 'Ã': 'A', 'É': 'E', 'Ê': 'E', 'Í': 'I', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ú': 'U' };
  const ACENTO_TONICO = /[ÁÉÍÓÚÂÊÔ]/;

  // Palavras em que o X NÃO tem som de "ch" (X com vários sons — só apresentação)
  const X_VARIOS = new Set(['TÁXI', 'EXAME', 'PRÓXIMO', 'TÓRAX']);

  const ehVogal = (c) => !!c && VOGAIS.includes(c);
  const ehEI = (c) => !!c && 'EIÉÊÍ'.includes(c);
  const base = (c) => BASE[c] || c;
  const maiusc = (t) => (t || '').toLocaleUpperCase('pt-BR');

  /**
   * Analisa uma palavra já separada em sílabas (separação MANUAL).
   * Devolve as "unidades de ensino" (tags) que a criança precisa conhecer
   * para decodificar a palavra. Ex.: CA-SA → C, A, S_Z
   */
  function analisar(silabas, palavraOriginal) {
    const tags = new Set();
    const padroes = [];
    const S = silabas.map(maiusc);
    const palavra = maiusc(palavraOriginal || S.join(''));
    for (let i = 0; i < S.length; i++) {
      let s = S[i];
      const ant = S[i - 1] || '';
      const prox = S[i + 1] || '';
      let pad = '';
      // RR e SS são separados na divisão silábica (CAR-RO, OS-SO): tratamos como dígrafo
      let inicioDuplo = false;
      if (s.endsWith('R') && prox.startsWith('R')) { s = s.slice(0, -1); tags.add('RR'); }
      if (s.endsWith('S') && prox.startsWith('S')) { s = s.slice(0, -1); tags.add('SS'); }
      if (s.startsWith('R') && ant.endsWith('R')) { s = s.slice(1); inicioDuplo = true; pad += 'C'; }
      if (s.startsWith('S') && ant.endsWith('S')) { s = s.slice(1); inicioDuplo = true; pad += 'C'; }
      let j = 0;
      if (i === 0 && s[0] === 'H') { tags.add('H'); j = 1; }
      // ---- ataque (início da sílaba)
      if (!inicioDuplo && j < s.length && !ehVogal(s[j])) {
        const c0 = s[j], c1 = s[j + 1], c2 = s[j + 2];
        const dupla = c0 + (c1 || '');
        if (dupla === 'CH' || dupla === 'LH' || dupla === 'NH') { tags.add(dupla); j += 2; pad += 'C'; }
        else if (c0 === 'Q' && c1 === 'U') { tags.add('QU'); j += 2; pad += 'C'; }
        else if (c0 === 'G' && c1 === 'U' && ehEI(c2)) { tags.add('GU'); j += 2; pad += 'C'; }
        else if ('PBTDCGFV'.includes(c0) && c1 && 'RL'.includes(c1) && ehVogal(c2)) {
          tags.add('CCV'); tags.add(c0); tags.add(c1 === 'R' ? 'R_FRACO' : 'L'); j += 2; pad += 'CC';
        } else {
          switch (c0) {
            case 'C': tags.add(ehEI(c1) ? 'C_SUAVE' : 'C'); break;
            case 'G': tags.add(ehEI(c1) ? 'G_SUAVE' : 'G'); break;
            case 'Ç': tags.add('Ç'); break;
            case 'R': tags.add((i === 0 || /[NLS]$/.test(ant)) ? 'R_FORTE' : 'R_FRACO'); break;
            case 'S': tags.add((i > 0 && ehVogal(ant.slice(-1))) ? 'S_Z' : 'S'); break;
            case 'X': tags.add(X_VARIOS.has(palavra) ? 'X_VARIOS' : 'X'); break;
            default:
              if ('ZFVMNLJPBTD'.includes(c0)) tags.add(c0); else tags.add('?' + c0);
          }
          j += 1; pad += 'C';
        }
      }
      // ---- núcleo (vogais e semivogais)
      let nv = 0;
      while (j < s.length && ehVogal(s[j])) {
        tags.add(base(s[j]));
        if (s[j] === 'Ã' || s[j] === 'Õ') tags.add('Ã');
        j++; nv++;
      }
      if (/ÃO|ÕE/.test(s)) tags.add('ÃO');
      pad += nv > 1 ? 'VV' : (nv === 1 ? 'V' : '');
      // ---- coda (fim da sílaba)
      for (; j < s.length; j++) {
        const c = s[j];
        if (c === 'M' || c === 'N') tags.add('NASAL');
        else if (c === 'S') tags.add('CODA_S');
        else if (c === 'R') tags.add('CODA_R');
        else if (c === 'L') tags.add('CODA_L');
        else if (c === 'Z') tags.add('CODA_Z');
        else if (c === 'X') tags.add('X_VARIOS');
        else tags.add('?coda' + c);
        pad += 'C';
      }
      padroes.push(pad);
    }
    return { tags: Array.from(tags), padroes };
  }

  /** Categoria de padrão silábico da palavra (para o banco de palavras) */
  function categoriaPadrao(an) {
    const t = new Set(an.tags);
    const cat = [];
    if (['CH', 'LH', 'NH', 'RR', 'SS', 'QU', 'GU'].some((d) => t.has(d))) cat.push('dígrafo');
    if (t.has('CCV')) cat.push('CCV');
    if (['CODA_S', 'CODA_R', 'CODA_L', 'CODA_Z'].some((d) => t.has(d))) cat.push('CVC');
    if (t.has('NASAL') || t.has('ÃO') || t.has('Ã')) cat.push('nasal');
    if (['Ç', 'C_SUAVE', 'G_SUAVE', 'R_FORTE', 'S_Z', 'H', 'X_VARIOS'].some((d) => t.has(d))) cat.push('regra');
    if (!cat.length) cat.push('CV');
    return cat;
  }

  /** Índice da sílaba tônica (regras de acentuação do português) */
  function tonica(silabas) {
    const S = silabas.map(maiusc);
    for (let i = 0; i < S.length; i++) if (ACENTO_TONICO.test(S[i])) return i;
    for (let i = 0; i < S.length; i++) if (/[ÃÕ]/.test(S[i])) return i;
    if (S.length === 1) return 0;
    const fim = S.join('');
    if (/(A|E|O|AS|ES|OS|AM|EM|ENS)$/.test(fim)) return S.length - 2;
    return S.length - 1;
  }

  const semAcento = (t) => maiusc(t).replace(/[ÁÂÀ]/g, 'A').replace(/[ÉÊ]/g, 'E').replace(/Í/g, 'I').replace(/[ÓÔ]/g, 'O').replace(/Ú/g, 'U');

  /** Chave de rima: da vogal tônica até o fim (GATO → ATO, LEÃO → ÃO) */
  function chaveRima(silabas) {
    const S = silabas.map(maiusc);
    const t = tonica(S);
    let s = S[t];
    let k = 0;
    while (k < s.length && !ehVogal(s[k])) k++;
    // QU/GU: o U não conta como vogal da rima
    if (/^(QU|GU)/.test(s) && ehEI(s[2])) k = 2;
    return semAcento(s.slice(k) + S.slice(t + 1).join('')).replace(/[^A-ZÃÕÇ]/g, '');
  }

  /** Primeiro som da palavra (para "Qual som começa?"). null = não usar */
  function somInicial(silabas, palavra) {
    const an = analisar([silabas[0]], palavra);
    const s0 = maiusc(silabas[0]);
    const P = maiusc(palavra || silabas.join(''));
    if (s0[0] === 'H') return 'H';
    if (ehVogal(s0[0])) {
      // vogal nasalizada no início (AN-JO, ON-ÇA, ÔNIBUS) não serve para treinar a vogal oral
      if (/[MN]$/.test(s0) || /^[ÔÂ]N/.test(P)) return null;
      // E inicial seguido de S/X soa "i" no português do Brasil (ESCOLA → "iscola")
      if (/^E[SX]/.test(P)) return null;
      const v = s0[0];
      if (v === 'É') return 'É'; if (v === 'Ê') return 'Ê';
      if (v === 'Ó') return 'Ó'; if (v === 'Ô') return 'Ô';
      return base(v);
    }
    const ordem = ['CH', 'LH', 'NH', 'QU', 'GU', 'Ç', 'C_SUAVE', 'G_SUAVE', 'R_FORTE', 'S', 'X'];
    for (const o of ordem) if (an.tags.includes(o)) return o;
    const c = s0[0];
    if (c === 'C' || c === 'G') return c;
    return c;
  }

  /** Tokeniza em grafemas (dígrafos juntos, sem acento) — usado no validador de pares mínimos */
  function grafemas(palavra) {
    const P = semAcento(palavra);
    const out = [];
    for (let i = 0; i < P.length; i++) {
      const d = P.substr(i, 2);
      if (['CH', 'LH', 'NH', 'RR', 'SS', 'QU', 'GU'].includes(d)) { out.push(d); i++; } else out.push(P[i]);
    }
    return out;
  }

  /** Normaliza texto para nome de arquivo do Banco de Áudio (igual ao gerar_audios.py) */
  function slug(texto) {
    const mapa = { 'á': 'a1', 'â': 'a2', 'ã': 'a3', 'à': 'a4', 'é': 'e1', 'ê': 'e2', 'í': 'i1', 'ó': 'o1', 'ô': 'o2', 'õ': 'o3', 'ú': 'u1', 'ç': 'c1', 'ü': 'u2' };
    let t = (texto || '').toLocaleLowerCase('pt-BR');
    let s = '';
    for (const ch of t) s += mapa[ch] !== undefined ? mapa[ch] : ch;
    s = s.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    if (s.length > 40) {
      let h = 5381;
      for (let i = 0; i < texto.length; i++) h = ((h * 33) + texto.charCodeAt(i)) >>> 0;
      s = s.slice(0, 30).replace(/_+$/, '') + '_' + h.toString(16);
    }
    return s || 'vazio';
  }

  /** Código OpenMoji de um emoji (ex.: 🐱 → 1F431) */
  function codigoOpenMoji(emoji) {
    return Array.from(emoji).map((c) => c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')).filter((h) => h !== 'FE0F').join('-');
  }

  /** Divide um texto em "grafemas visuais" (emojis compostos ficam juntos) */
  function separarEmojis(txt) {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
      return Array.from(new Intl.Segmenter('pt', { granularity: 'grapheme' }).segment(txt)).map((x) => x.segment).filter((x) => x.trim());
    }
    return Array.from(txt).filter((x) => x.trim() && x !== '\uFE0F');
  }

  /** Tokeniza uma frase escrita com hífens silábicos: "O MA-CA-CO PU-LA." */
  function tokenizarFrase(texto) {
    const tokens = [];
    const re = /([A-ZÁÉÍÓÚÂÊÔÃÕÀÇa-záéíóúâêôãõàç]+(?:-[A-ZÁÉÍÓÚÂÊÔÃÕÀÇa-záéíóúâêôãõàç]+)*)|([^A-ZÁÉÍÓÚÂÊÔÃÕÀÇa-záéíóúâêôãõàç]+)/g;
    let m;
    while ((m = re.exec(texto))) {
      if (m[1]) {
        const silabas = m[1].split('-');
        tokens.push({ tipo: 'palavra', silabas, palavra: silabas.join('') });
      } else tokens.push({ tipo: 'pont', texto: m[2] });
    }
    return tokens;
  }

  const fraseLimpa = (texto) => texto.replace(/-/g, '');

  /** Gerador pseudoaleatório com semente (reprodutível nos testes) */
  function rngSemente(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const Nucleo = {
    VOGAIS, ehVogal, base, maiusc, semAcento, analisar, categoriaPadrao, tonica, chaveRima,
    somInicial, grafemas, slug, codigoOpenMoji, separarEmojis, tokenizarFrase, fraseLimpa, rngSemente, X_VARIOS
  };
  raiz.Nucleo = Nucleo;
  if (typeof module !== 'undefined' && module.exports) module.exports = Nucleo;
})(typeof window !== 'undefined' ? window : globalThis);
