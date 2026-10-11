/* Fonte de dados do Ler Brincando (editável). Rode:  node ferramentas/construir_dados.js
   para gerar data.js (JSON) com os campos derivados e verificados. */
module.exports = {
  versao: '1.1.0',

  // ------------------------------------------------------------------ MUNDOS
  mundos: [
    { id: 1, nome: 'Ilha dos Sons', tema: 'praia', cor1: '#7fd6f5', cor2: '#ffe8a3', deco: '🏝️🌊🐚🦀☀️', conteudo: 'Consciência fonológica (sem letras)' },
    { id: 2, nome: 'Vale das Vogais', tema: 'campo florido', cor1: '#b8f0a8', cor2: '#fff5c2', deco: '🌼🌷🦋🌻🐝', conteudo: 'Vogais A, E, I, O, U, abertas/fechadas e Ã' },
    { id: 3, nome: 'Floresta Sussurrante', tema: 'floresta', cor1: '#7cc489', cor2: '#d8f3c9', deco: '🌳🍄🦉🌲🐿️', conteudo: 'Consoantes contínuas F V M N L S Z J X + sílabas' },
    { id: 4, nome: 'Montanha dos Gêmeos', tema: 'montanha', cor1: '#a9b8e8', cor2: '#eef1ff', deco: '⛰️🏔️🐐🦅❄️', conteudo: 'Oclusivas P B T D C G + pares mínimos' },
    { id: 5, nome: 'Rio das Palavras', tema: 'rio com trem', cor1: '#79c7e8', cor2: '#d6f6ff', deco: '🚂🏞️🐟🛶🌉', conteudo: 'Palavras com sílabas simples (CV)' },
    { id: 6, nome: 'Caverna dos Cristais', tema: 'caverna', cor1: '#b49be0', cor2: '#efe6ff', deco: '💎🔦🦇🪨✨', conteudo: 'Sílabas complexas (CVC, CCV) e nasais' },
    { id: 7, nome: 'Castelo das Regras', tema: 'castelo', cor1: '#f2a7a7', cor2: '#fff0e6', deco: '🏰🛡️👑🐉🗝️', conteudo: 'Dígrafos e regras contextuais' },
    { id: 8, nome: 'Biblioteca Encantada', tema: 'biblioteca', cor1: '#e8c07a', cor2: '#fff6e0', deco: '📚🕯️🦉📖✨', conteudo: 'Histórias, fluência e compreensão' }
  ],

  // ------------------------------------------------------------------ FASES (93)
  // tipo = minijogo; novos = unidades ensinadas na fase; oral = sem palavras escritas
  fases: [
    { id: '1.1', nome: 'Rima Maluca', tipo: 'rima', n: 8, oral: true },
    { id: '1.2', nome: 'Bate-Palmas', tipo: 'palmas', n: 8, oral: true, cfg: { min: 1, max: 3 } },
    { id: '1.3', nome: 'Começa Igual', tipo: 'somInicial', n: 8, oral: true, cfg: { modo: 'silaba' } },
    { id: '1.4', nome: 'Termina Igual', tipo: 'somFinal', n: 8, oral: true },
    { id: '1.5', nome: 'Junta-Junta', tipo: 'juntar', n: 8, oral: true },
    { id: '1.6', nome: 'Bate-Palmas Gigante', tipo: 'palmas', n: 8, oral: true, cfg: { min: 2, max: 5 } },
    { id: '1.7', nome: 'Some-Some', tipo: 'tirar', n: 7, oral: true },
    { id: '1.8', nome: 'Troca-Troca', tipo: 'trocar', n: 8, oral: true },
    { id: '1.9', nome: 'Memória das Rimas', tipo: 'memoria', n: 4, oral: true, cfg: { modo: 'rima' } },
    { id: '1.10', nome: 'História: O Gato de Sapato', tipo: 'historia', historia: 'h1', oral: true, semDominio: true },
    { id: '1.11', nome: 'Desafio do Guardião da Ilha', tipo: 'guardiao', n: 10, oral: true, cfg: { mix: ['rima', 'palmas', 'somInicial', 'somFinal', 'juntar', 'tirar', 'trocar'] } },

    { id: '2.1', nome: 'O som do A', tipo: 'licao', g: ['A'], novos: ['A'], n: 7 },
    { id: '2.2', nome: 'O som do E', tipo: 'licao', g: ['E'], novos: ['E'], n: 7 },
    { id: '2.3', nome: 'O som do I', tipo: 'licao', g: ['I'], novos: ['I'], n: 7 },
    { id: '2.4', nome: 'O som do O', tipo: 'licao', g: ['O'], novos: ['O'], n: 7 },
    { id: '2.5', nome: 'O som do U', tipo: 'licao', g: ['U'], novos: ['U'], n: 7 },
    { id: '2.6', nome: 'Caça às Vogais', tipo: 'cacaSom', n: 8, cfg: { modo: 'vogal' } },
    { id: '2.7', nome: 'Traçado Mágico das Vogais', tipo: 'tracado', n: 5, cfg: { letras: ['A', 'E', 'I', 'O', 'U'] } },
    { id: '2.8', nome: 'O som do Ã', tipo: 'licao', g: ['Ã'], novos: ['Ã'], n: 6 },
    { id: '2.9', nome: 'Boca Aberta, Boca Fechada', tipo: 'abertoFechado', n: 8 },
    { id: '2.10', nome: 'Bingo das Vogais', tipo: 'bingo', n: 6, cfg: { modo: 'vogal' } },
    { id: '2.11', nome: 'História: Oi, Ioiô!', tipo: 'historia', historia: 'h2', semDominio: true },
    { id: '2.12', nome: 'Desafio do Guardião do Vale', tipo: 'guardiao', n: 10, cfg: { mix: ['cacaSom', 'somInicial', 'abertoFechado', 'rima', 'palmas'] } },

    { id: '3.1', nome: 'O som do F', tipo: 'licao', g: ['F'], novos: ['F'], n: 8 },
    { id: '3.2', nome: 'O som do V', tipo: 'licao', g: ['V'], novos: ['V'], n: 8, cfg: { par: 'F' } },
    { id: '3.3', nome: 'O som do M', tipo: 'licao', g: ['M'], novos: ['M'], n: 8 },
    { id: '3.4', nome: 'O som do N', tipo: 'licao', g: ['N'], novos: ['N'], n: 8, cfg: { par: 'M' } },
    { id: '3.5', nome: 'Nome ou Som?', tipo: 'nomeSom', n: 8 },
    { id: '3.6', nome: 'O som do L', tipo: 'licao', g: ['L'], novos: ['L'], n: 8 },
    { id: '3.7', nome: 'Os sons do S e do Z', tipo: 'licao', g: ['S', 'Z'], novos: ['S', 'Z'], n: 8, cfg: { par: 'S' } },
    { id: '3.8', nome: 'Os sons do J e do X', tipo: 'licao', g: ['J', 'X'], novos: ['J', 'X'], n: 8, cfg: { par: 'X' } },
    { id: '3.9', nome: 'Bingo de Sílabas', tipo: 'bingo', n: 6, cfg: { modo: 'silaba' } },
    { id: '3.10', nome: 'Leia e Encontre', tipo: 'leiaEncontre', n: 8 },
    { id: '3.11', nome: 'História: A Mala da Vovó', tipo: 'historia', historia: 'h3', semDominio: true },
    { id: '3.12', nome: 'Desafio do Guardião da Floresta', tipo: 'guardiao', n: 10, cfg: { mix: ['cacaSom', 'leiaEncontre', 'somInicial', 'nomeSom'] } },

    { id: '4.1', nome: 'O som do P', tipo: 'licao', g: ['P'], novos: ['P'], n: 8 },
    { id: '4.2', nome: 'O som do B', tipo: 'licao', g: ['B'], novos: ['B'], n: 8, cfg: { par: 'P' } },
    { id: '4.3', nome: 'O som do T', tipo: 'licao', g: ['T'], novos: ['T'], n: 8 },
    { id: '4.4', nome: 'O som do D', tipo: 'licao', g: ['D'], novos: ['D'], n: 8, cfg: { par: 'T' } },
    { id: '4.5', nome: 'O som do C', tipo: 'licao', g: ['C'], novos: ['C'], n: 8 },
    { id: '4.6', nome: 'O som do G', tipo: 'licao', g: ['G'], novos: ['G'], n: 8, cfg: { par: 'C' } },
    { id: '4.7', nome: 'Gêmeos Diferentes: P e B', tipo: 'gemeos', n: 8, cfg: { pares: ['P/B'] } },
    { id: '4.8', nome: 'Gêmeos Diferentes: T e D', tipo: 'gemeos', n: 8, cfg: { pares: ['T/D'] } },
    { id: '4.9', nome: 'Gêmeos Diferentes: F/V e C/G', tipo: 'gemeos', n: 8, cfg: { pares: ['F/V', 'C/G'] } },
    { id: '4.10', nome: 'Letra Perdida', tipo: 'letraPerdida', n: 8 },
    { id: '4.11', nome: 'História: A Pipa do Macaco', tipo: 'historia', historia: 'h4', semDominio: true },
    { id: '4.12', nome: 'Desafio do Guardião da Montanha', tipo: 'guardiao', n: 10, cfg: { mix: ['gemeos', 'letraPerdida', 'cacaSom', 'leiaEncontre'] } },

    { id: '5.1', nome: 'Descoberta: S com som de Z', tipo: 'regra', regra: 'S_Z', novos: ['S_Z'], n: 8 },
    { id: '5.2', nome: 'Fábrica de Palavras', tipo: 'fabrica', n: 8 },
    { id: '5.3', nome: 'Trem das Sílabas', tipo: 'trem', n: 6 },
    { id: '5.4', nome: 'Fatiador', tipo: 'fatiador', n: 6 },
    { id: '5.5', nome: 'Leia e Encontre', tipo: 'leiaEncontre', n: 8 },
    { id: '5.6', nome: 'Palavras Mágicas', tipo: 'freq', novos: ['FREQ'], n: 8 },
    { id: '5.7', nome: 'Ditado Mágico', tipo: 'ditado', n: 6 },
    { id: '5.8', nome: 'Troca-Letra Mágica', tipo: 'trocaLetra', n: 8 },
    { id: '5.9', nome: 'Memória Som-Imagem', tipo: 'memoria', n: 4, cfg: { modo: 'palavra' } },
    { id: '5.10', nome: 'Leitura de Frase', tipo: 'frase', n: 6 },
    { id: '5.11', nome: 'História: O Sapo na Sopa', tipo: 'historia', historia: 'h5', semDominio: true },
    { id: '5.12', nome: 'Desafio do Guardião do Rio', tipo: 'guardiao', n: 10, cfg: { mix: ['leiaEncontre', 'fabrica', 'gemeos', 'letraPerdida', 'trocaLetra', 'frase'] } },

    { id: '6.1', nome: 'Descoberta: R fraquinho', tipo: 'regra', regra: 'R_FRACO', novos: ['R_FRACO'], n: 8 },
    { id: '6.2', nome: 'Descoberta: S e Z no fim da sílaba', tipo: 'regra', regra: 'CODA_S', novos: ['CODA_S', 'CODA_Z'], n: 8 },
    { id: '6.3', nome: 'Descoberta: R no fim da sílaba', tipo: 'regra', regra: 'CODA_R', novos: ['CODA_R'], n: 8 },
    { id: '6.4', nome: 'Descoberta: L no fim da sílaba', tipo: 'regra', regra: 'CODA_L', novos: ['CODA_L'], n: 8 },
    { id: '6.5', nome: 'Descoberta: M e N nasais', tipo: 'regra', regra: 'NASAL', novos: ['NASAL'], n: 8 },
    { id: '6.6', nome: 'Descoberta: o som ÃO', tipo: 'regra', regra: 'ÃO', novos: ['ÃO'], n: 8 },
    { id: '6.7', nome: 'Descoberta: consoantes juntinhas', tipo: 'regra', regra: 'CCV', novos: ['CCV'], n: 8 },
    { id: '6.8', nome: 'Trem dos Cristais', tipo: 'trem', n: 6 },
    { id: '6.9', nome: 'Ditado dos Cristais', tipo: 'ditado', n: 6 },
    { id: '6.10', nome: 'Microfone Mágico', tipo: 'microfone', n: 6, semDominio: true, cfg: { modo: 'palavra' } },
    { id: '6.11', nome: 'História: O Dragão e a Flor', tipo: 'historia', historia: 'h6', semDominio: true },
    { id: '6.12', nome: 'Desafio do Guardião da Caverna', tipo: 'guardiao', n: 10, cfg: { mix: ['leiaEncontre', 'escrita', 'gemeos', 'fatiador', 'trocaLetra'] } },

    { id: '7.1', nome: 'Regra: CH', tipo: 'regra', regra: 'CH', novos: ['CH'], n: 8 },
    { id: '7.2', nome: 'Regra: LH e NH', tipo: 'regra', regra: 'LH_NH', novos: ['LH', 'NH'], n: 8 },
    { id: '7.3', nome: 'Regra: R forte e RR', tipo: 'regra', regra: 'R_FORTE', novos: ['R_FORTE', 'RR'], n: 8 },
    { id: '7.4', nome: 'Regra: Ç, SS e C com som de S', tipo: 'regra', regra: 'SOM_S', novos: ['Ç', 'C_SUAVE', 'SS'], n: 8 },
    { id: '7.5', nome: 'Regra: QU e GU', tipo: 'regra', regra: 'QU_GU', novos: ['QU', 'GU'], n: 8 },
    { id: '7.6', nome: 'Regra: G com som de J', tipo: 'regra', regra: 'G_SUAVE', novos: ['G_SUAVE'], n: 8 },
    { id: '7.7', nome: 'Regra: H mudo e X mágico', tipo: 'regra', regra: 'H_X', novos: ['H', 'X_VARIOS'], n: 6 },
    { id: '7.8', nome: 'Gêmeos do Castelo: S/Z e X/J', tipo: 'gemeos', n: 8, cfg: { pares: ['S/Z', 'X/J'] } },
    { id: '7.9', nome: 'Letra Perdida das Regras', tipo: 'letraPerdida', n: 8, cfg: { modo: 'regra' } },
    { id: '7.10', nome: 'Ditado do Castelo', tipo: 'ditado', n: 6 },
    { id: '7.11', nome: 'História: A Chave do Castelo', tipo: 'historia', historia: 'h7', semDominio: true },
    { id: '7.12', nome: 'Desafio do Guardião do Castelo', tipo: 'guardiao', n: 10, cfg: { mix: ['escrita', 'letraPerdida', 'gemeos', 'leiaEncontre', 'trocaLetra'] } },

    { id: '8.1', nome: 'Leitura de Frases', tipo: 'frase', n: 6 },
    { id: '8.2', nome: 'História: O Robô que Queria Dançar', tipo: 'historia', historia: 'h8a', semDominio: true },
    { id: '8.3', nome: 'Microfone Mágico: Eu Leio!', tipo: 'microfone', n: 5, semDominio: true, cfg: { modo: 'frase' } },
    { id: '8.4', nome: 'História: A Tartaruga Apressada', tipo: 'historia', historia: 'h8b', semDominio: true },
    { id: '8.5', nome: 'Todos os Gêmeos', tipo: 'gemeos', n: 8, cfg: { pares: ['todos'] } },
    { id: '8.6', nome: 'História: O Ninho no Telhado', tipo: 'historia', historia: 'h8c', semDominio: true },
    { id: '8.7', nome: 'Frases Divertidas', tipo: 'frase', n: 6 },
    { id: '8.8', nome: 'História: Lili e a Biblioteca Encantada', tipo: 'historia', historia: 'h8d', semDominio: true },
    { id: '8.9', nome: 'Grande Ditado', tipo: 'ditado', n: 6 },
    { id: '8.10', nome: 'Desafio Final do Guardião da Biblioteca', tipo: 'guardiao', n: 10, cfg: { mix: ['frase', 'escrita', 'gemeos', 'leiaEncontre', 'trocaLetra', 'letraPerdida'] } }
  ],

  // ------------------------------------------------------------------ PARES MÍNIMOS
  pares: [
    { par: 'P/B', a: 'POTE', b: 'BOTE' }, { par: 'P/B', a: 'PICO', b: 'BICO' }, { par: 'P/B', a: 'PAU', b: 'BAÚ' },
    { par: 'T/D', a: 'TIA', b: 'DIA' }, { par: 'T/D', a: 'GATO', b: 'GADO' },
    { par: 'F/V', a: 'FACA', b: 'VACA' }, { par: 'F/V', a: 'FOTO', b: 'VOTO' }, { par: 'F/V', a: 'FILA', b: 'VILA' },
    { par: 'C/G', a: 'COLA', b: 'GOLA' }, { par: 'C/G', a: 'CALO', b: 'GALO' },
    { par: 'S/Z', a: 'CAÇA', b: 'CASA' }, { par: 'S/Z', a: 'ROÇA', b: 'ROSA' },
    { par: 'X/J', a: 'QUEIXO', b: 'QUEIJO' }, { par: 'X/J', a: 'CHATO', b: 'JATO' }
  ],
  // letra → par (para dicas e distratores)
  parDe: { P: 'P/B', B: 'P/B', T: 'T/D', D: 'T/D', F: 'F/V', V: 'F/V', C: 'C/G', G: 'C/G', S: 'S/Z', Z: 'S/Z', X: 'X/J', J: 'X/J', M: 'M/N', N: 'M/N', L: 'L/R', R: 'L/R' },
  parceiro: { P: 'B', B: 'P', T: 'D', D: 'T', F: 'V', V: 'F', C: 'G', G: 'C', S: 'Z', Z: 'S', X: 'J', J: 'X', M: 'N', N: 'M', L: 'R', R: 'L', A: 'Ã', 'Ã': 'A', 'É': 'Ê', 'Ê': 'É', 'Ó': 'Ô', 'Ô': 'Ó' },
  dicasPares: {
    'P/B': 'P é só um sopro, sem barulho na garganta. No B a garganta vibra. Põe a mão no pescoço e sente!',
    'T/D': 'No T a língua bate atrás dos dentes e solta só um sopro. No D a garganta vibra. Mão no pescoço: no D ele treme!',
    'F/V': 'No F sai só um ventinho: fff. No V a garganta vibra: vvv, parece um zumbido. Põe a mão no pescoço!',
    'C/G': 'No C de CASA, o fundo da língua bate lá atrás e sai um sopro. No G de GATO, a garganta vibra.',
    'S/Z': 'O S é uma cobrinha: sss, sem vibrar. O Z é uma abelha: zzz, a garganta vibra!',
    'X/J': 'O X e o CH são o som do silêncio: xxx, sem vibrar. O J vibra a garganta: jjj.',
    'M/N': 'No M os lábios ficam fechados: mmm. No N a boca fica aberta e a língua encosta atrás dos dentes: nnn.',
    'L/R': 'No L a língua encosta e fica lá: lll. No R fraquinho a língua só dá uma batidinha rápida.',
    'A/Ã': 'No Ã o som sai também pelo nariz. Tampe o nariz e sinta a diferença!',
    'É/Ê': 'No É a boca abre bastante, como em CAFÉ. No Ê a boca abre menos, como em BEBÊ.',
    'Ó/Ô': 'No Ó a boca fica redonda e bem aberta, como em VOVÓ. No Ô fica redondinha e mais fechada, como em VOVÔ.'
  },

  // ------------------------------------------------------------------ LETRAS E FONEMAS
  nomesLetras: { A: 'á', B: 'bê', C: 'cê', D: 'dê', E: 'é', F: 'éfe', G: 'gê', H: 'agá', I: 'i', J: 'jota', L: 'éle', M: 'ême', N: 'êne', O: 'ó', P: 'pê', Q: 'quê', R: 'érre', S: 'ésse', T: 'tê', U: 'u', V: 'vê', X: 'xis', Z: 'zê' },
  fonemas: {
    A: { tipo: 'vogal', tts: 'á', ipa: 'a' }, E: { tipo: 'vogal', tts: 'ê', ipa: 'e' }, 'É': { tipo: 'vogal', tts: 'é', ipa: 'ɛ' }, 'Ê': { tipo: 'vogal', tts: 'ê', ipa: 'e' },
    I: { tipo: 'vogal', tts: 'í', ipa: 'i' }, O: { tipo: 'vogal', tts: 'ô', ipa: 'o' }, 'Ó': { tipo: 'vogal', tts: 'ó', ipa: 'ɔ' }, 'Ô': { tipo: 'vogal', tts: 'ô', ipa: 'o' },
    U: { tipo: 'vogal', tts: 'ú', ipa: 'u' }, 'Ã': { tipo: 'vogal', tts: 'ã', ipa: 'ɐ̃' },
    F: { tipo: 'continua', apoio: 'FA', ipa: 'f' }, V: { tipo: 'continua', apoio: 'VA', ipa: 'v' }, M: { tipo: 'continua', apoio: 'MA', ipa: 'm' },
    N: { tipo: 'continua', apoio: 'NA', ipa: 'n' }, L: { tipo: 'continua', apoio: 'LA', ipa: 'l' }, S: { tipo: 'continua', apoio: 'SA', ipa: 's' },
    Z: { tipo: 'continua', apoio: 'ZA', ipa: 'z' }, J: { tipo: 'continua', apoio: 'JA', ipa: 'ʒ' }, X: { tipo: 'continua', apoio: 'XA', ipa: 'ʃ' },
    NH: { tipo: 'continua', apoio: 'NHA', ipa: 'ɲ' }, LH: { tipo: 'continua', apoio: 'LHA', ipa: 'ʎ' },
    P: { tipo: 'oclusiva', apoio: 'PA' }, B: { tipo: 'oclusiva', apoio: 'BA' }, T: { tipo: 'oclusiva', apoio: 'TA' },
    D: { tipo: 'oclusiva', apoio: 'DA' }, C: { tipo: 'oclusiva', apoio: 'CA' }, G: { tipo: 'oclusiva', apoio: 'GA' }
  },
  dicasFonema: {
    A: 'Abra bem a boca, como quem vai morder uma maçã: aaa!',
    E: 'Sorria um pouquinho e fale: êee. Abrindo mais a boca, vira É, como em CAFÉ.',
    I: 'Faça um sorriso bem grande: iii!',
    O: 'Faça a boca redondinha: ôoo. Abrindo mais, vira Ó, como em VOVÓ.',
    U: 'Faça biquinho, como quem vai mandar um beijo: uuu!',
    'Ã': 'O Ã sai também pelo nariz! Tampe o nariz e sinta: ã.',
    F: 'Encoste os dentes de cima no lábio de baixo e sopre um ventinho: fff.',
    V: 'Igual ao F, mas com a garganta vibrando: vvv. Põe a mão no pescoço!',
    M: 'Feche os lábios e cantarole, como quando a comida está gostosa: mmm.',
    N: 'Encoste a língua atrás dos dentes de cima e cantarole: nnn.',
    L: 'Encoste a pontinha da língua atrás dos dentes de cima: lll.',
    S: 'Dentes quase fechados, sopre como uma cobrinha: sss.',
    Z: 'Como o S, mas com a garganta vibrando, igual a uma abelha: zzz.',
    J: 'Faça biquinho e vibre a garganta: jjj.',
    X: 'Faça biquinho e peça silêncio: xxx.',
    P: 'Feche os lábios e solte um soprinho, sem vibrar a garganta: PA!',
    B: 'Feche os lábios e solte com a garganta vibrando: BA! Põe a mão no pescoço.',
    T: 'A ponta da língua bate atrás dos dentes e solta um soprinho: TA!',
    D: 'A língua bate atrás dos dentes, com a garganta vibrando: DA!',
    C: 'O fundo da língua bate lá atrás, sem vibrar: CA, como em CASA.',
    G: 'O fundo da língua bate lá atrás, com a garganta vibrando: GA, como em GATO.'
  },
  // Exemplos (imagens) mostrados no "Eu mostro" de cada som
  exemplosSom: {
    A: ['ABELHA', 'AVIÃO', 'ABACAXI'], E: ['ELEFANTE', 'ERVILHA', 'BEBÊ'], I: ['ILHA', 'IGREJA', 'ÍMÃ'], O: ['OVO', 'OVELHA', 'ÓCULOS'],
    U: ['UVA', 'URSO', 'UNICÓRNIO'], 'Ã': ['MAÇÃ', 'ÍMÃ', 'MAMÃE'],
    F: ['FACA', 'FOCA', 'FOGO'], V: ['VACA', 'VELA', 'VASO'], M: ['MACACO', 'MALA', 'MOTO'], N: ['NAVIO', 'NEVE', 'NUVEM'],
    L: ['LUA', 'LUVA', 'LEÃO'], S: ['SAPO', 'SOL', 'SINO'], Z: ['ZEBRA', 'ZUMBI'], J: ['JANELA', 'JACARÉ', 'JAVALI'],
    X: ['LIXO', 'PEIXE', 'CAIXA'], P: ['PATO', 'PIPA', 'PERA'], B: ['BOLA', 'BOTA', 'BOLO'], T: ['TOMATE', 'TIA', 'TIJOLO'],
    D: ['DADO', 'DEDO', 'DENTE'], C: ['CASA', 'COCO', 'COPO'], G: ['GATO', 'GALO', 'GOTA']
  },

  // ------------------------------------------------------------------ REGRAS (descobertas com exemplo e contraexemplo)
  regras: {
    S_Z: { titulo: 'S com som de Z', tags: ['S_Z'], itens: ['somS', 'leia'],
      explica: 'Descoberta! Quando o S fica entre duas vogais, ele faz som de Z, como em CASA. No começo da palavra, ele faz som de S, como em SAPO.',
      exemplos: ['CASA', 'VASO', 'CAMISA', 'MÚSICA', 'MEDUSA', 'BESOURO', 'TESOURA'], contra: ['SAPO', 'SOFÁ', 'SINO', 'SUCO', 'SOPA'] },
    R_FRACO: { titulo: 'R fraquinho', tags: ['R_FRACO'], itens: ['perdida', 'leia'], opcoesPerdida: ['R', 'L'],
      explica: 'Quando o R fica entre duas vogais, a língua só dá uma batidinha: é o R fraco, como em PERA e CORUJA.',
      exemplos: ['PERA', 'CORUJA', 'BARATA', 'PERU', 'PIRULITO', 'JACARÉ', 'GORILA', 'MÁSCARA'], contra: [] },
    CODA_S: { titulo: 'S e Z no fim da sílaba', tags: ['CODA_S', 'CODA_Z'], itens: ['escrita', 'leia'], erros: ['semCoda', 'trocaSZ'],
      explica: 'O S também pode fechar a sílaba, no finalzinho: LÁ-PIS, ES-CO-LA, MOS-CA. E o Z aparece no fim de algumas palavras, como NA-RIZ.',
      exemplos: ['LÁPIS', 'ESCOLA', 'MOSCA', 'CESTA', 'NARIZ', 'ÔNIBUS', 'ESCOVA', 'TÊNIS', 'ESCADA'], contra: ['LUPA', 'BOTA'] },
    CODA_R: { titulo: 'R no fim da sílaba', tags: ['CODA_R'], itens: ['escrita', 'leia'], erros: ['semCoda'],
      explica: 'O R pode fechar a sílaba: POR-TA, MAR, GAR-FO. Se a gente esquece o R, a palavra muda!',
      exemplos: ['PORTA', 'MAR', 'GARFO', 'PORCO', 'CARTA', 'URSO', 'TORTA', 'CORDA', 'PERNA'], contra: ['POTE', 'GATO'] },
    CODA_L: { titulo: 'L no fim da sílaba', tags: ['CODA_L'], itens: ['escrita', 'leia'], erros: ['LporU', 'semCoda'],
      explica: 'No fim da sílaba, o L soa parecido com U, mas escrevemos L: SOL, MEL, PAPEL. Que truque!',
      exemplos: ['SOL', 'MEL', 'ANEL', 'PAPEL', 'BALDE', 'POLVO', 'BOLSA', 'SAL', 'GOL'], contra: ['BOLO', 'MALA'] },
    NASAL: { titulo: 'M e N que deixam a vogal nasal', tags: ['NASAL'], itens: ['escrita', 'leia'], erros: ['semNasal', 'trocaMN'],
      explica: 'Quando o M ou o N fecham a sílaba, o som da vogal sai pelo nariz: PAN-DA, PEN-TE, PON-TE. Antes de P e de B, usamos sempre M: TAM-BOR, POM-BO.',
      exemplos: ['PANDA', 'PENTE', 'PONTE', 'MANGA', 'TAMBOR', 'POMBO', 'LÂMPADA', 'DENTE', 'NUVEM', 'TREM', 'PIMENTA'], contra: ['PATO', 'BODE'] },
    'ÃO': { titulo: 'O som ÃO', tags: ['ÃO'], itens: ['escrita', 'leia'], erros: ['semTil', 'AOporAM'],
      explica: 'Quando o til fica em cima do A e vem o O, fazemos ÃO, como em PÃO, MÃO e LEÃO.',
      exemplos: ['PÃO', 'MÃO', 'LEÃO', 'BALÃO', 'LIMÃO', 'FEIJÃO', 'BOTÃO', 'AVIÃO', 'MELÃO', 'VULCÃO', 'PAVÃO'], contra: ['MAÇÃ', 'ÍMÃ'] },
    CCV: { titulo: 'Duas consoantes juntinhas', tags: ['CCV'], itens: ['escrita', 'leia'], erros: ['semCCV2', 'metatese'],
      explica: 'Às vezes duas consoantes ficam juntinhas antes da vogal: PRA-TO, FLOR, LI-VRO. Falamos as duas bem rapidinho!',
      exemplos: ['PRATO', 'FLOR', 'LIVRO', 'ZEBRA', 'TIGRE', 'GLOBO', 'COBRA', 'CLIPE', 'PEDRA', 'GRILO', 'TREM', 'PLANETA', 'TRATOR'], contra: ['PATO', 'FOGO'] },
    CH: { titulo: 'CH: o som do silêncio', tags: ['CH'], itens: ['escrita', 'leia'], erros: ['CHporX'],
      explica: 'C e H juntinhos fazem um som novo: xxx, como em CHAVE e CHUVA. O X também faz esse som em LIXO e PEIXE. Para saber qual usar, a gente vai conhecendo as palavras!',
      exemplos: ['CHAVE', 'CHUVA', 'CHAPÉU', 'MOCHILA', 'MACHADO', 'CHÁ', 'CONCHA', 'CHOCOLATE'], contra: ['LIXO', 'PEIXE', 'CAIXA', 'BRUXA'] },
    LH_NH: { titulo: 'LH e NH', tags: ['LH', 'NH'], itens: ['escrita', 'leia'], erros: ['LHporLI', 'NHporNI', 'trocaLHNH'],
      explica: 'L com H faz lhe, como em FOLHA. N com H faz nhe, como em NINHO. Não é LI nem NI!',
      exemplos: ['FOLHA', 'ABELHA', 'MILHO', 'OVELHA', 'ESPELHO', 'NINHO', 'GALINHA', 'ARANHA', 'CASTANHA', 'MONTANHA'], contra: ['FILA', 'MENINO'] },
    R_FORTE: { titulo: 'R forte e RR', tags: ['R_FORTE', 'RR'], itens: ['escrita', 'leia'], erros: ['RRporR', 'RporRR'],
      explica: 'No começo da palavra o R é forte: RATO, RODA. No meio, entre vogais, para ficar forte escrevemos dois R: CARRO, TERRA. Com um R só, fica fraquinho, como em PERA.',
      exemplos: ['RATO', 'RODA', 'RIO', 'REI', 'CARRO', 'TERRA', 'BARRACA', 'GARRAFA', 'RAPOSA'], contra: ['PERA', 'BARATA', 'CORUJA'] },
    SOM_S: { titulo: 'Muitos jeitos de escrever o som de S', tags: ['Ç', 'C_SUAVE', 'SS'], itens: ['escrita', 'leia'], erros: ['ÇporSS', 'SSporÇ', 'SSporS', 'CporS'],
      explica: 'O som sss pode ser escrito com S, com SS, com Ç e com C antes de E e I: SOPA, OSSO, MAÇÃ, CEBOLA. Atenção: um S sozinho entre vogais vira Z, como em CASA!',
      exemplos: ['MAÇÃ', 'BRAÇO', 'LAÇO', 'ONÇA', 'OSSO', 'PÊSSEGO', 'VASSOURA', 'CEBOLA', 'CEREJA', 'CIRCO', 'CENOURA'], contra: ['CASA', 'VASO'] },
    QU_GU: { titulo: 'QU e GU', tags: ['QU', 'GU'], itens: ['escrita', 'leia'], erros: ['QUporC', 'QUporQ', 'GUporG'],
      explica: 'Para fazer o som de C antes de E e de I, usamos QU: QUEIJO, ESQUILO. Para o som de G antes de E e de I, usamos GU: FOGUETE. O U fica quietinho! Com A, o U aparece: QUADRO.',
      exemplos: ['QUEIJO', 'ESQUILO', 'MOSQUITO', 'PANQUECA', 'QUADRO', 'FOGUETE', 'CARANGUEJO', 'ROSQUINHA', 'PREGUIÇA'], contra: ['CASA', 'GATO'] },
    G_SUAVE: { titulo: 'G com som de J', tags: ['G_SUAVE'], itens: ['escrita', 'leia'], erros: ['GporJ'],
      explica: 'Antes de E e de I, o G faz som de J: GELO, GIRAFA. Antes de A, O e U, faz o som de G: GATO, GOTA.',
      exemplos: ['GELO', 'GIRAFA', 'GIRASSOL', 'RELÓGIO', 'GÊNIO', 'IGREJA'], contra: ['GATO', 'GOTA', 'GOLA'] },
    H_X: { titulo: 'H mudo e X mágico', tags: ['H', 'X_VARIOS'], itens: ['escrita', 'leia'], erros: ['semH', 'XporCS'],
      explica: 'O H no começo da palavra não faz som nenhum: HOSPITAL, HIPOPÓTAMO. E o X é um mágico: faz xxx em LIXO, faz ks em TÁXI, e ainda tem outros sons!',
      exemplos: ['HOSPITAL', 'HIPOPÓTAMO', 'TÁXI', 'LIXO', 'PEIXE'], contra: ['OSSO', 'OVO'] }
  },

  // ------------------------------------------------------------------ PALAVRAS FREQUENTES (ensinadas explicitamente em 5.6)
  frequentes: ['NÃO', 'UM', 'COM', 'QUE', 'EM', 'TEM', 'SÃO', 'ES-TÁ', 'PA-RA', 'A-QUI'],

  // ------------------------------------------------------------------ MANIPULAÇÕES ORAIS (Mundo 1)
  tirar: [
    { de: 'SA-PA-TO', tira: 'SA', modo: 'silaba', fica: 'PATO' },
    { de: 'ES-CO-LA', tira: 'ES', modo: 'silaba', fica: 'COLA' },
    { de: 'LI-MÃO', tira: 'LI', modo: 'silaba', fica: 'MÃO' },
    { de: 'LU-VA', tira: 'L', modo: 'som', fica: 'UVA' },
    { de: 'FO-CA', tira: 'F', modo: 'som', fica: 'OCA' },
    { de: 'CHA-VE', tira: 'X', modo: 'som', fica: 'AVE' },
    { de: 'NO-VO', tira: 'N', modo: 'som', fica: 'OVO' }
  ],
  trocar: [
    { de: 'GA-TO', troca: 'GA', por: 'PA', fica: 'PATO' }, { de: 'CA-SA', troca: 'SA', por: 'MA', fica: 'CAMA' },
    { de: 'VA-CA', troca: 'VA', por: 'FA', fica: 'FACA' }, { de: 'BO-LO', troca: 'LO', por: 'LA', fica: 'BOLA' },
    { de: 'MA-LA', troca: 'MA', por: 'BA', fica: 'BALA' }, { de: 'DA-DO', troca: 'DA', por: 'GA', fica: 'GADO' },
    { de: 'TI-A', troca: 'TI', por: 'DI', fica: 'DIA' }, { de: 'FO-TO', troca: 'FO', por: 'VO', fica: 'VOTO' },
    { de: 'BO-TE', troca: 'BO', por: 'PO', fica: 'POTE' }, { de: 'PA-TO', troca: 'TO', por: 'TA', fica: 'PATA' }
  ],
  abertoFechado: [
    { p: 'CAFÉ', v: 'É' }, { p: 'PÉ', v: 'É' }, { p: 'BONÉ', v: 'É' }, { p: 'JACARÉ', v: 'É' }, { p: 'CHAPÉU', v: 'É' }, { p: 'TROFÉU', v: 'É' },
    { p: 'BEBÊ', v: 'Ê' }, { p: 'PÊSSEGO', v: 'Ê' }, { p: 'TÊNIS', v: 'Ê' },
    { p: 'VOVÓ', v: 'Ó' }, { p: 'TRENÓ', v: 'Ó' }, { p: 'ÓCULOS', v: 'Ó' },
    { p: 'VOVÔ', v: 'Ô' }, { p: 'ROBÔ', v: 'Ô' }, { p: 'METRÔ', v: 'Ô' }, { p: 'IOIÔ', v: 'Ô' }
  ],

  // ------------------------------------------------------------------ FRASES (Leitura de Frase) — imagens: certa + 2 distratoras
  frases: [
    { m: 5, t: 'O GA-TO BE-BE LEI-TE.', img: '🐱🥛', d: ['🐶🥛', '🐱⚽'] },
    { m: 5, t: 'A VA-CA VÊ A BO-LA.', img: '🐄⚽', d: ['🐄🍎', '🐐⚽'] },
    { m: 5, t: 'O MA-CA-CO CO-ME BA-NA-NA.', img: '🐒🍌', d: ['🐒🍎', '🐸🍌'] },
    { m: 5, t: 'O SA-PO PU-LA NA CA-SA.', img: '🐸🏠', d: ['🐸🚗', '🐒🏠'] },
    { m: 5, t: 'A ME-NI-NA PE-GA A PI-PA.', img: '👧🪁', d: ['👦🪁', '👧⚽'] },
    { m: 5, t: 'O PA-TO VAI NO BO-TE.', img: '🦆🛶', d: ['🦆🏠', '🐓🛶'] },
    { m: 5, t: 'A VO-VÓ CO-ME BO-LO.', img: '👵🎂', d: ['👴🎂', '👵🍲'] },
    { m: 5, t: 'O BE-BÊ VÊ A LU-A.', img: '👶🌙', d: ['👶🌞', '👴🌙'] },
    { m: 8, t: 'O DRA-GÃO VO-A SO-BRE O CAS-TE-LO.', img: '🐉🏰', d: ['🐉🌊', '🐦🏰'] },
    { m: 8, t: 'A GA-LI-NHA CHO-CA TRÊS O-VOS.', img: '🐔🥚🥚🥚', d: ['🐔🥚', '🦆🥚🥚🥚'] },
    { m: 8, t: 'O PA-LHA-ÇO TEM UM NA-RIZ VER-ME-LHO.', img: '🤡🔴', d: ['🤡🔵', '👸🔴'] },
    { m: 8, t: 'A RA-I-NHA PER-DEU A CO-RO-A.', img: '👸❓👑', d: ['🤴👑', '👸🔑'] },
    { m: 8, t: 'O CA-CHOR-RO COR-RE A-TRÁS DA BO-LA.', img: '🐶⚽', d: ['🐱⚽', '🐶🦴'] },
    { m: 8, t: 'CHO-VE MUI-TO NA PRAI-A.', img: '🌧️🏖️', d: ['☀️🏖️', '🌧️🏰'] },
    { m: 8, t: 'O ES-QUI-LO GUAR-DA CAS-TA-NHAS.', img: '🐿️🌰', d: ['🐿️🍎', '🐭🌰'] },
    { m: 8, t: 'O GI-RAS-SOL O-LHA PA-RA O SOL.', img: '🌻☀️', d: ['🌻🌙', '🌹☀️'] }
  ],

  // ------------------------------------------------------------------ HISTÓRIAS (texto com hífens silábicos)
  historias: [
    { id: 'h1', mundo: 1, oral: true, titulo: 'O Gato de Sapato', cena: { fundo: '🏝️', cor: '#bfeaf7' },
      intro: 'Escute a história e me ajude a achar as rimas!',
      frases: [
        { t: 'Na ilha mora um gato que usa sapato.', img: '🐱👞' },
        { t: 'O gato de sapato tem um amigo: o pato!', img: '🐱🦆', rima: { op: ['PATO', 'CACHORRO', 'SAPO'], antes: 'O gato de sapato tem um amigo: o...', com: 'GATO' } },
        { t: 'O pato leva a bola para a escola.', img: '🦆⚽🏫', rima: { op: ['ESCOLA', 'ÁRVORE', 'CARRO'], antes: 'O pato leva a bola para a...', com: 'BOLA' } },
        { t: 'Na escola tem janela, e na janela tem uma vela.', img: '🪟🕯️', rima: { op: ['VELA', 'LUA', 'BOLO'], antes: 'Na escola tem janela, e na janela tem uma...', com: 'JANELA' } },
        { t: 'Lá vem o leão, tocando violão.', img: '🦁🎸', rima: { op: ['VIOLÃO', 'TAMBOR', 'PIANO'], antes: 'Lá vem o leão, tocando...', com: 'LEÃO' } },
        { t: 'Todo mundo dança na festa da ilha, até a ervilha!', img: '🎉🫛', rima: { op: ['ERVILHA', 'BANANA', 'MAÇÃ'], antes: 'Todo mundo dança na festa da ilha, até a...', com: 'ILHA' } },
        { t: 'Que festa animada! Fim.', img: '🎶🌞' }
      ],
      perguntas: [
        { t: 'Quem usa sapato?', op: ['🐱', '🦆', '🦁'], c: 0 },
        { t: 'Quem toca violão?', op: ['🦁', '🐱', '🦆'], c: 0 },
        { t: 'Como os bichos estavam na festa?', op: ['😀', '😢', '😴'], c: 0, inf: true }
      ] },
    { id: 'h2', mundo: 2, titulo: 'Oi, Ioiô!', cena: { fundo: '🌼', cor: '#e4f8d2' },
      intro: 'Dois pintinhos estão passeando no vale e encontram uma coisa redonda. Vamos ler o que eles falam!',
      frases: [
        { t: 'OI!', img: '🐤' },
        { t: 'OI, OI!', img: '🐤🐥' },
        { t: 'Ô, É O I-O-I-Ô!', img: '🐤🪀', lac: { p: 'IOIÔ', l: 1, op: ['O', 'A'] } },
        { t: 'UI! AI, AI, AI!', img: '🪀🐥', lac: { p: 'UI', l: 1, op: ['I', 'U'] } },
        { t: 'U-AU!', img: '🐤🐥✨', lac: { p: 'UAU', l: 1, op: ['A', 'E'] } },
        { t: 'É O I-O-I-Ô! É!', img: '🐤🪀🐥' }
      ],
      perguntas: [
        { t: 'O que os pintinhos encontraram?', op: ['🪀', '⚽', '🍎'], c: 0 },
        { t: 'Como o pintinho ficou quando o ioiô bateu nele?', op: ['😣', '😀', '😴'], c: 0, inf: true }
      ] },
    { id: 'h3', mundo: 3, titulo: 'A Mala da Vovó', cena: { fundo: '🌳', cor: '#dff3d6' },
      intro: 'A vovó vai fazer uma viagem. Vamos ler juntos!',
      frases: [
        { t: 'A VO-VÓ VAI À VI-LA.', img: '👵🏘️' },
        { t: 'E-LA LE-VA U-MA MA-LA.', img: '👵🧳', lac: { p: 'MALA', s: 1, op: ['LA', 'NA'] } },
        { t: 'NA MA-LA, A VO-VÓ LE-VA U-VA E O-VO.', img: '🧳🍇🥚', lac: { p: 'UVA', l: 1, op: ['V', 'F'] } },
        { t: 'O ME-NI-NO VÊ A MA-LA.', img: '👦🧳' },
        { t: 'A MA-LA SE ME-XE!', img: '🧳❗', lac: { p: 'MEXE', s: 1, op: ['XE', 'JE'] } },
        { t: 'É A LI-LI!', img: '🦉🧳' },
        { t: 'LI-LI VIU A U-VA NA MA-LA.', img: '🦉🍇' },
        { t: 'A VO-VÓ FA-LA: — LI-LI, SAI, SAI!', img: '👵🦉' },
        { t: 'LI-LI SAI E VAI À JA-NE-LA.', img: '🦉🪟', lac: { p: 'JANELA', s: 0, op: ['JA', 'XA'] } },
        { t: 'NA JA-NE-LA, LI-LI VÊ A LU-A.', img: '🪟🦉🌙', lac: { p: 'LUA', s: 0, op: ['LU', 'NU'] } }
      ],
      perguntas: [
        { t: 'O que a vovó levou?', op: ['🧳', '🎒', '📦'], c: 0 },
        { t: 'Quem fez a mala se mexer?', op: ['🦉', '🐱', '🐶'], c: 0, inf: true },
        { t: 'Para onde a Lili foi no final?', op: ['🪟', '🚪', '🌳'], c: 0 }
      ] },
    { id: 'h4', mundo: 4, titulo: 'A Pipa do Macaco', cena: { fundo: '⛰️', cor: '#e6ebff' },
      intro: 'Na montanha venta muito. O macaco tem uma pipa. Vamos ler!',
      frases: [
        { t: 'O MA-CA-CO PE-GA A PI-PA.', img: '🐒🪁', lac: { p: 'PIPA', s: 1, op: ['PA', 'BA'] } },
        { t: 'A PI-PA É BO-NI-TA.', img: '🪁✨' },
        { t: 'A PI-PA SO-BE, SO-BE...', img: '🪁☁️' },
        { t: 'O PA-TO VÊ A PI-PA DO MA-CA-CO.', img: '🦆🪁', lac: { p: 'PATO', l: 0, op: ['P', 'B'] } },
        { t: '— DÁ A PI-PA, MA-CA-CO!', img: '🦆🐒' },
        { t: 'O MA-CA-CO DÁ A PI-PA AO PA-TO.', img: '🐒🪁🦆' },
        { t: 'O-PA! A PI-PA CAI NO LA-GO.', img: '🪁🏞️', lac: { p: 'LAGO', s: 1, op: ['GO', 'CO'] } },
        { t: 'O BO-DE VÊ E PE-GA A PI-PA.', img: '🐐🪁', lac: { p: 'BODE', s: 1, op: ['DE', 'TE'] } },
        { t: 'VI-VA! A PI-PA VO-A DE NO-VO!', img: '🪁🎉' }
      ],
      perguntas: [
        { t: 'Quem pegou a pipa primeiro?', op: ['🐒', '🦆', '🐐'], c: 0 },
        { t: 'Onde a pipa caiu?', op: ['🏞️', '🌳', '🏠'], c: 0 },
        { t: 'Quem ajudou a pipa a voar de novo?', op: ['🐐', '🐒', '🐄'], c: 0, inf: true }
      ] },
    { id: 'h5', mundo: 5, titulo: 'O Sapo na Sopa', cena: { fundo: '🏠', cor: '#d6f6ff' },
      intro: 'Um sapo bem pulador entrou na casa da vovó. Vamos ler!',
      frases: [
        { t: 'O SA-PO PU-LA NA CA-SA DA VO-VÓ.', img: '🐸🏠', lac: { p: 'CASA', s: 1, op: ['SA', 'ZA'] } },
        { t: 'A VO-VÓ NÃO VÊ O SA-PO.', img: '👵🐸' },
        { t: 'O SA-PO PU-LA NA ME-SA.', img: '🐸🪑', lac: { p: 'SAPO', s: 1, op: ['PO', 'BO'] } },
        { t: 'NA ME-SA, FI-CA A SO-PA.', img: '🍲' },
        { t: 'O-PA! O SA-PO CAI NA SO-PA!', img: '🐸🍲💦', lac: { p: 'SOPA', s: 1, op: ['PA', 'BA'] } },
        { t: 'A VO-VÓ VÊ O SA-PO: — QUE SA-PO MA-LU-CO!', img: '👵😲🐸' },
        { t: 'O SA-PO PU-LA DA SO-PA E SAI PE-LA JA-NE-LA.', img: '🐸🪟' },
        { t: 'A VO-VÓ FA-LA: — VAI, SA-PO, VAI!', img: '👵👋🐸', lac: { p: 'VAI', l: 0, op: ['V', 'F'] } }
      ],
      perguntas: [
        { t: 'Onde o sapo caiu?', op: ['🍲', '🛁', '🏞️'], c: 0 },
        { t: 'Quem não viu o sapo no começo?', op: ['👵', '🐱', '👦'], c: 0 },
        { t: 'Como a vovó ficou quando viu o sapo na sopa?', op: ['😲', '😴', '😢'], c: 0, inf: true }
      ] },
    { id: 'h6', mundo: 6, titulo: 'O Dragão e a Flor', cena: { fundo: '⛰️', cor: '#efe6ff' },
      intro: 'No alto do monte mora um dragão diferente. Vamos ler!',
      frases: [
        { t: 'NO AL-TO DO MON-TE MO-RA UM DRA-GÃO.', img: '⛰️🐉', lac: { p: 'MONTE', l: 2, op: ['N', 'M'] } },
        { t: 'O DRA-GÃO SOL-TA FO-GO PE-LO NA-RIZ.', img: '🐉🔥', lac: { p: 'NARIZ', l: 4, op: ['Z', 'S'] } },
        { t: 'UM DI-A, O DRA-GÃO VÊ U-MA FLOR.', img: '🐉🌸', lac: { p: 'FLOR', l: 1, op: ['L', 'R'] } },
        { t: 'A FLOR É A-MA-RE-LA E TEM PER-FU-ME.', img: '🌼' },
        { t: 'O DRA-GÃO FA-LA: — QUE FLOR BO-NI-TA!', img: '🐉😍🌼' },
        { t: 'MAS O FO-GO PO-DE SE-CAR A FLOR.', img: '🔥🥀' },
        { t: 'EN-TÃO O DRA-GÃO TEM U-MA I-DEI-A.', img: '🐉💡' },
        { t: 'E-LE PE-GA Á-GUA NO BAL-DE.', img: '🐉🪣💧', lac: { p: 'BALDE', s: 1, op: ['DE', 'TE'] } },
        { t: 'O DRA-GÃO DÁ Á-GUA À FLOR.', img: '🐉💧🌼' },
        { t: 'A FLOR FI-CA LIN-DA E O DRA-GÃO FI-CA CON-TEN-TE.', img: '🌼🐉😊' }
      ],
      perguntas: [
        { t: 'Onde mora o dragão?', op: ['⛰️', '🌊', '🏠'], c: 0 },
        { t: 'O que o dragão deu para a flor?', op: ['💧', '🔥', '🍎'], c: 0 },
        { t: 'Por que o dragão não soltou fogo na flor?', op: ['🥀', '🎂', '⚽'], c: 0, inf: true, explica: 'Porque o fogo podia secar a flor.' }
      ] },
    { id: 'h7', mundo: 7, titulo: 'A Chave do Castelo', cena: { fundo: '🏰', cor: '#fff0e6' },
      intro: 'No castelo, a rainha tem um problema. Vamos ler e descobrir!',
      frases: [
        { t: 'NO CAS-TE-LO MO-RA A RA-I-NHA HE-LE-NA.', img: '🏰👸', lac: { p: 'RAINHA', s: 2, op: ['NHA', 'LHA'] } },
        { t: 'U-MA MA-NHÃ, A RA-I-NHA PER-DEU A CHA-VE.', img: '👸❓🔑', lac: { p: 'CHAVE', s: 0, op: ['CHA', 'JA'] } },
        { t: '— QUEM PE-GOU MI-NHA CHA-VE?', img: '👸😟' },
        { t: 'O GA-TO O-LHOU NA JA-NE-LA.', img: '🐱🪟' },
        { t: 'O CA-CHOR-RO PRO-CU-ROU NO JAR-DIM.', img: '🐶🌷', lac: { p: 'CACHORRO', s: 2, op: ['RO', 'LO'] } },
        { t: 'A GA-LI-NHA A-CHOU A CHA-VE NO NI-NHO!', img: '🐔🔑🪺', lac: { p: 'NINHO', s: 1, op: ['NHO', 'LHO'] } },
        { t: 'A RA-I-NHA FI-COU MUI-TO FE-LIZ.', img: '👸😄' },
        { t: 'E-LA DEU U-MA FES-TA COM QUEI-JO E SU-CO.', img: '🎉🧀🧃', lac: { p: 'QUEIJO', s: 1, op: ['JO', 'XO'] } },
        { t: 'E A GA-LI-NHA GA-NHOU UM CHA-PÉU NO-VO!', img: '🐔👒' }
      ],
      perguntas: [
        { t: 'O que a rainha perdeu?', op: ['🔑', '👑', '👒'], c: 0 },
        { t: 'Quem achou a chave?', op: ['🐔', '🐱', '🐶'], c: 0 },
        { t: 'Por que a galinha ganhou um chapéu?', op: ['🔑', '🌧️', '🎂'], c: 0, inf: true, explica: 'Porque ela achou a chave da rainha.' }
      ] },
    { id: 'h8a', mundo: 8, titulo: 'O Robô que Queria Dançar', cena: { fundo: '🏭', cor: '#fff6e0' },
      intro: 'Era uma vez um robô que tinha um sonho. Vamos ler!',
      frases: [
        { t: 'NA FÁ-BRI-CA HA-VI-A UM RO-BÔ CHA-MA-DO TI-CO.', img: '🏭🤖' },
        { t: 'TI-CO QUE-RI-A MUI-TO DAN-ÇAR.', img: '🤖💃', lac: { p: 'DANÇAR', s: 1, op: ['ÇAR', 'SSAR'] } },
        { t: 'MAS SEU PÉ FA-ZI-A UM BA-RU-LHÃO.', img: '🤖🦶🔊' },
        { t: 'A ME-NI-NA LU-Í-SA PAS-SOU Ó-LE-O NO PÉ DO RO-BÔ.', img: '👧🛢️🤖', lac: { p: 'LUÍSA', s: 2, op: ['SA', 'ÇA'] } },
        { t: 'A-GO-RA O PÉ NÃO FAZ BA-RU-LHO.', img: '🤖🤫' },
        { t: 'TI-CO DAN-ÇOU, PU-LOU E GI-ROU.', img: '🤖🕺', lac: { p: 'GIROU', s: 0, op: ['GI', 'JI'] } },
        { t: 'TO-DOS BA-TE-RAM PAL-MAS PA-RA O RO-BÔ.', img: '👏🤖👏' },
        { t: '— O-BRI-GA-DO, LU-Í-SA! — DIS-SE TI-CO.', img: '🤖❤️👧', lac: { p: 'DISSE', s: 1, op: ['SE', 'CE'] } }
      ],
      perguntas: [
        { t: 'O que o robô queria fazer?', op: ['💃', '😴', '🍽️'], c: 0 },
        { t: 'Quem ajudou o robô?', op: ['👧', '👴', '🐶'], c: 0 },
        { t: 'Por que o pé do robô fazia barulho?', op: ['🛢️', '🌧️', '🔥'], c: 0, inf: true, explica: 'Faltava óleo no pé do robô.' }
      ] },
    { id: 'h8b', mundo: 8, titulo: 'A Tartaruga Apressada', cena: { fundo: '🌳', cor: '#fff6e0' },
      intro: 'A tartaruga foi convidada para uma festa. Vamos ler!',
      frases: [
        { t: 'A TAR-TA-RU-GA TE-CA QUE-RI-A CHE-GAR CE-DO NA FES-TA.', img: '🐢🎉', lac: { p: 'CEDO', s: 0, op: ['CE', 'SE'] } },
        { t: 'E-LA SA-IU DE CA-SA BEM CE-DI-NHO.', img: '🐢🏠🌅' },
        { t: 'NO CA-MI-NHO, E-LA VIU UM CO-E-LHO.', img: '🐢🐰', lac: { p: 'COELHO', s: 2, op: ['LHO', 'LIO'] } },
        { t: '— VEM DE CAR-RO, TE-CA? — PER-GUN-TOU O CO-E-LHO.', img: '🐰🚗' },
        { t: '— NÃO, VOU DE-VA-GAR E SEM PRES-SA.', img: '🐢🙂', lac: { p: 'PRESSA', s: 1, op: ['SA', 'ÇA'] } },
        { t: 'A TAR-TA-RU-GA AN-DOU, AN-DOU E AN-DOU.', img: '🐢👣' },
        { t: 'QUAN-DO CHE-GOU, A FES-TA JÁ TI-NHA A-CA-BA-DO...', img: '🐢😮🎈' },
        { t: 'MAS TO-DOS GUAR-DA-RAM UM PE-DA-ÇO DE BO-LO PA-RA E-LA!', img: '🎂🐢😄', lac: { p: 'PEDAÇO', s: 2, op: ['ÇO', 'SO'] } }
      ],
      perguntas: [
        { t: 'Quem queria chegar cedo na festa?', op: ['🐢', '🐰', '🐱'], c: 0 },
        { t: 'O que guardaram para a tartaruga?', op: ['🎂', '🍎', '🧃'], c: 0 },
        { t: 'Como a tartaruga ficou no final?', op: ['😄', '😠', '😴'], c: 0, inf: true }
      ] },
    { id: 'h8c', mundo: 8, titulo: 'O Ninho no Telhado', cena: { fundo: '🏫', cor: '#fff6e0' },
      intro: 'No telhado da escola aconteceu uma coisa especial. Vamos ler!',
      frases: [
        { t: 'NO TE-LHA-DO DA ES-CO-LA HÁ UM NI-NHO.', img: '🏫🪺', lac: { p: 'TELHADO', s: 1, op: ['LHA', 'NHA'] } },
        { t: 'NO NI-NHO HÁ TRÊS O-VI-NHOS A-ZUIS.', img: '🪺🥚🥚🥚' },
        { t: 'A MA-MÃE PÁS-SA-RO CHO-CA OS O-VOS.', img: '🐦🪺', lac: { p: 'CHOCA', s: 0, op: ['CHO', 'JO'] } },
        { t: 'UM DI-A, UM O-VO RA-CHOU.', img: '🥚⚡' },
        { t: 'SA-IU UM FI-LHO-TE FE-I-NHO E SEM PE-NAS.', img: '🐣' },
        { t: 'AS CRI-AN-ÇAS O-LHA-RAM PE-LA JA-NE-LA.', img: '👧👦🪟', lac: { p: 'JANELA', s: 0, op: ['JA', 'GA'] } },
        { t: 'A MA-MÃE LE-VOU MI-NHO-CA PA-RA O FI-LHO-TE.', img: '🐦🪱🐣' },
        { t: 'LO-GO O FI-LHO-TE GA-NHOU PE-NAS E VO-OU!', img: '🐤✨🕊️', lac: { p: 'PENAS', s: 0, op: ['PE', 'BE'] } }
      ],
      perguntas: [
        { t: 'Onde estava o ninho?', op: ['🏫', '🌳', '🚗'], c: 0 },
        { t: 'O que a mamãe levou para o filhote?', op: ['🪱', '🍎', '🧀'], c: 0 },
        { t: 'O que o filhote aprendeu a fazer no final?', op: ['🕊️', '🥚', '😴'], c: 0, inf: true }
      ] },
    { id: 'h8d', mundo: 8, titulo: 'Lili e a Biblioteca Encantada', cena: { fundo: '📚', cor: '#fff6e0' },
      intro: 'Esta é a história da nossa amiga Lili. Vamos ler!',
      frases: [
        { t: 'LI-LI É U-MA CO-RU-JI-NHA QUE A-DO-RA LER.', img: '🦉📖' },
        { t: 'NA BI-BLI-O-TE-CA, OS LI-VROS FA-LAM!', img: '📚🗣️', lac: { p: 'LIVROS', s: 1, op: ['VROS', 'VOS'] } },
        { t: 'UM LI-VRO CON-TA HIS-TÓ-RI-A DE PI-RA-TA.', img: '📖🏴' },
        { t: 'OU-TRO LI-VRO CAN-TA U-MA CAN-ÇÃO.', img: '📖🎵', lac: { p: 'CANÇÃO', s: 1, op: ['ÇÃO', 'SÃO'] } },
        { t: 'O LI-VRO MAIS VE-LHO SE-GU-RA U-MA CHA-VE DOU-RA-DA.', img: '📕🔑' },
        { t: 'A CHA-VE A-BRE U-MA POR-TA MÁ-GI-CA.', img: '🔑🚪✨', lac: { p: 'MÁGICA', s: 1, op: ['GI', 'JI'] } },
        { t: 'A-TRÁS DA POR-TA HÁ MIL PA-LA-VRAS NO-VAS.', img: '🚪🔤✨' },
        { t: 'LI-LI LÊ TO-DAS E FI-CA SU-PER FE-LIZ!', img: '🦉😄' },
        { t: 'E VO-CÊ? QUAL PA-LA-VRA VAI LER HO-JE?', img: '🦉❓📖', lac: { p: 'PALAVRA', s: 2, op: ['VRA', 'VA'] } }
      ],
      perguntas: [
        { t: 'Quem adora ler?', op: ['🦉', '🐱', '🐶'], c: 0 },
        { t: 'O que a chave abre?', op: ['🚪', '📦', '🚗'], c: 0 },
        { t: 'Como a Lili se sente quando lê?', op: ['😄', '😢', '😠'], c: 0, inf: true }
      ] }
  ],

  // ------------------------------------------------------------------ ELOGIOS (≥ 15 por categoria; esforço e estratégia)
  elogios: {
    acerto: ['Isso!', 'Muito bem!', 'Mandou bem!', 'Acertou!', 'Boa!', 'Show!', 'Perfeito!', 'Que legal!', 'Certinho!', 'É isso aí!',
      'Você conseguiu!', 'Excelente!', 'Uau, muito bom!', 'Arrasou!', 'Que orelha atenta!', 'Você prestou atenção!', 'Caprichou!',
      'Bem pensado!', 'Olhou com cuidado, hein!', 'Ótima escolha!'],
    sequencia3: ['Três seguidas! Você está esquentando!', 'Três acertos! Que ritmo bom!', 'Olha só, três de uma vez!',
      'Três em sequência, continue assim!', 'Você está no embalo!', 'Três seguidinhas, que atenção!', 'Trio perfeito!',
      'Que foco! Três seguidas!', 'Seu ouvido está afiado!', 'Três! A Lili está batendo as asas!', 'Lindo! Três certinhas!',
      'Seguiu firme: três acertos!', 'Três estrelinhas brilhando!', 'Que sequência bonita!', 'Uma, duas, três! Demais!'],
    sequencia5: ['Cinco seguidas! Você está pegando fogo! 🔥', 'Cinco acertos! Que treino caprichado!', 'Cinco de cinco! Uau!',
      'Você está voando! Cinco seguidas!', 'Cinco! A Lili até deu uma cambalhota!', 'Que concentração! Cinco seguidas!',
      'Cinco acertos: seu esforço está aparecendo!', 'Uma mão inteira de acertos!', 'Cinco seguidas! Que ouvido de ouro!',
      'Você está mandando muito bem: cinco!', 'Cinco! Você escuta com muita atenção!', 'Que sequência incrível: cinco!',
      'Cinco acertos! Continue nesse ritmo!', 'Cinco! Você está lendo cada vez melhor!', 'Cinco seguidas, que orgulho!'],
    sequencia10: ['Dez seguidas! Isso é incrível!', 'Dez acertos! Você é uma estrela da leitura!', 'Dez! A Lili está dançando de alegria!',
      'Dez seguidas! Todo esse treino valeu a pena!', 'Dez de uma vez! Que dedicação!', 'Uau! Dez acertos seguidos!',
      'Dez! Você está virando um super leitor!', 'Dez seguidas! Que atenção maravilhosa!', 'As duas mãos cheias de acertos!',
      'Dez! Isso merece uma festa!', 'Dez seguidas! Você não para de crescer!', 'Dez! Cada som no lugar certo!',
      'Que sequência gigante: dez!', 'Dez! Você trabalhou muito bem!', 'Dez acertos! Pode comemorar!'],
    aposErro: ['Você tentou de novo e conseguiu! Isso é de quem não desiste!', 'Errar faz parte. E você conseguiu!',
      'Viu só? Tentando de novo, deu certo!', 'Você escutou de novo e acertou!', 'Que persistência bonita!',
      'Você não desistiu, e olha só!', 'Tentou, pensou e acertou!', 'É assim que a gente aprende: tentando de novo!',
      'Você corrigiu sozinho o caminho!', 'Muito bem! Você usou a dica direitinho!', 'Que coragem de tentar outra vez!',
      'Acertou depois de pensar com calma!', 'Isso! Prestou atenção na dica!', 'Você aprendeu com o erro, que demais!',
      'Insistiu e conseguiu! Parabéns!'],
    somNovo: ['Primeira vez com esse som! Que conquista!', 'Você aprendeu um som novo!', 'Um som novo no seu tesouro!',
      'Olha só: som novo descoberto!', 'Mais um som para a sua coleção!', 'Você conheceu um amigo novo: um som!',
      'Esse som agora é seu!', 'Que descoberta! Um som novinho!', 'Seu ouvido aprendeu algo novo!',
      'Som novo desbloqueado!', 'A Lili anotou: você já sabe esse som!', 'Mais uma chave para abrir as palavras!',
      'Você está aprendendo os sons um por um!', 'Agora você conhece mais um som!', 'Que bom! Um som novo na mochila!'],
    fasePerfeita: ['Fase perfeita! Três estrelas!', 'Nenhum erro! Que capricho!', 'Fase completinha, sem errar!',
      'Três estrelas! Você caprichou muito!', 'Perfeito do começo ao fim!', 'Que fase linda! Tudo certo!',
      'Você mandou muito bem na fase toda!', 'Fase perfeita! A Lili está orgulhosa!', 'Brilhou do início ao fim!',
      'Todas certas! Que atenção!', 'Fase de ouro!', 'Três estrelas brilhantes para você!',
      'Você treinou e ficou craque nesta fase!', 'Perfeito! Seu esforço deu resultado!', 'Que demais! Fase sem nenhum erro!'],
    mundoConcluido: ['Você completou o mundo inteiro!', 'Mundo conquistado! Parabéns!', 'O Guardião ficou impressionado!',
      'Um mundo inteirinho! Que aventura!', 'Você chegou ao fim deste mundo!', 'Viva! Um mundo novo vai se abrir!',
      'Você é um verdadeiro explorador das letras!', 'Mundo completo! Seu certificado está pronto!',
      'Que jornada! Mundo concluído!', 'A Lili vai fazer uma festa para você!', 'Mais um mundo no seu mapa!',
      'Você treinou muito e conseguiu!', 'Mundo vencido com esforço e atenção!', 'Que conquista enorme!',
      'Parabéns! O próximo mundo espera por você!']
  },
  // Elogios específicos: citam o som / a palavra
  elogiosEspecificos: {
    som: [['Você ouviu o som', '{som}', 'de', '{palavra}'], ['Isso! Você encontrou o som', '{som}']],
    silaba: [['Isso! É', '{silaba}', 'de', '{palavra}'], ['Você reconheceu a sílaba', '{silaba}']],
    leitura: [['Você leu', '{palavra}', 'juntando os sons!'], ['Isso! Está escrito', '{palavra}']],
    escrita: [['Você escreveu', '{palavra}', 'letra por letra!']],
    juntar: [['Você juntou as sílabas e formou', '{palavra}']],
    par: [['Você ouviu a diferença: é', '{palavra}']]
  },

  // ------------------------------------------------------------------ FALAS (todas faladas; vão para o Banco de Áudio)
  falas: {
    tocarParaComecar: 'Toque para começar!',
    boasVindas: 'Oi! Eu sou a Lili, a corujinha. Vamos ler brincando?',
    escolhaPerfil: 'Toque na sua figura para começar.',
    mapa: 'Escolha uma fase no mapa. Toque na bolinha que está brilhando.',
    euMostro: 'Eu mostro!', fazemosJuntos: 'Agora vamos fazer juntos!', agoraVoce: 'Agora é você!',
    nomeLetra: 'O nome desta letra é', masSom: 'mas o som que ela faz é', escuteSom: 'Escute o som:',
    exemplos: 'Escute palavras com esse som:', traceLetra: 'Agora trace a letra com o dedo, seguindo as setas.',
    toqueAqui: 'É esta aqui. Toque nela.', tenteNovo: 'Quase! Vamos tentar de novo?', escuteDevagar: 'Escute de novo, bem devagar.',
    jogoJuntoToque: 'Vamos juntos: toque na que está brilhando.',
    faseFim: 'Fase concluída!', faseLiberada: 'Você liberou a próxima fase!', treinarMais: 'Vamos treinar mais um pouquinho esta fase? Você está quase lá!',
    revisaoOferecida: 'Que tal uma revisão rapidinha para ficar ainda melhor?',
    pausa: 'Você já brincou bastante! Que tal descansar os olhinhos e beber uma água?', limiteDia: 'Por hoje já está ótimo! Amanhã a gente brinca mais.',
    bau: 'Um presente para você! Volte outro dia para abrir outro baú.', bauJaAberto: 'O baú de hoje já foi aberto. Amanhã tem mais!',
    novoNivel: 'Você subiu de nível!', medalha: 'Você ganhou uma medalha!', figurinha: 'Figurinha nova no álbum!',
    avaliacaoIntro: 'Vamos brincar de descobrir o que você já sabe? Não tem certo nem errado, é só uma brincadeira.',
    avaliacaoFim: 'Pronto! Agora eu já sei por onde a gente começa.',
    historiaLer: 'Escute e acompanhe a leitura.', historiaLacuna: 'Escute a palavra. Qual pedacinho completa?', historiaPergunta: 'Agora me conta:',
    historiaFim: 'Fim da história! Que leitura bonita!', euLeio: 'Agora é a sua vez de ler. Toque no microfone.',
    adultoConfirma: 'Um adulto ouviu? Ele pode confirmar.', microOuvi: 'Ouvi você ler!', microNaoEntendi: 'Não consegui ouvir direitinho. Vamos tentar de novo?',
    ouvirSuaVoz: 'Escute a sua voz.', modelo: 'Escute como fica:', pronto: 'Pronto', juntar: 'Juntar',
    nome: 'nome', som: 'som', sim: 'sim', naoSom: 'não',
    regraDescoberta: 'Descoberta!', exemplosRegra: 'Veja estas palavras:', contraRegra: 'Agora veja estas, que são diferentes:',
    freqIntro: 'Estas são palavras mágicas. Elas aparecem muito nas histórias. Vamos aprender a reconhecer de uma vez!',
    sobreSom: 'O S aqui faz som de', cobrinha: 'cobrinha, sss', abelha: 'abelha, zzz',
    nomeOuSom: 'Isso foi o nome ou o som da letra?',
    demo: 'Olha como se joga!', demoAgora: 'Agora é com você!',
    fale: 'Fale', sem: 'sem o', semSom: 'sem o som', troque: 'Troque', por: 'por', em: 'em',
    contePalmas: 'Quantos pedacinhos tem', comecaComo: 'Qual começa igual a', terminaComo: 'Qual termina igual a', rimaCom: 'Qual rima com',
    qualSom: 'Qual figura começa com o som', qualLetra: 'Qual letra faz o som', qualSilaba: 'Toque na sílaba',
    eaPalavra: 'e a palavra', boca: 'A boca fica aberta ou fechada em', escreva: 'Escreva', complete: 'Complete', qualPalavraOuviu: 'Qual palavra você ouviu?',
    bingoMarque: 'Marque', parabensBingo: 'Bingo! Cartela completa!', formaPalavra: 'Que palavra se formou?', leiaQual: 'Leia e toque na figura certa.',
    ouvirModelo: 'Escute o modelo', qualRimaCom: 'Qual figura rima com', escutePalavra: 'Escute a palavra:', comoFica: 'Agora a frase inteira:', silabaPorSilaba: 'Vamos ler sílaba por sílaba.', avaliacaoObrigado: 'Obrigado!', vamosVer: 'Vamos ver o mapa!', ouvirDeNovo: 'Escute de novo.', faltouPouco: 'Faltou pouquinho!', dicaVem: 'Vou te dar uma dica.', juntosVamos: 'Vamos juntos!', escrevaCopie: 'Olhe o modelo e escreva igual.', fatiasCertas: 'Veja onde cortar.', trancada: 'Esta fase ainda está trancada. Termine a fase anterior primeiro.', bingo: 'Bingo!', perguntaInferencia: 'Pense bem:', reduzindo: 'Vou deixar mais fácil para você.', bomTrabalho: 'Bom trabalho!', moedas: 'Você ganhou moedas!'
  },
  // Instruções de cada minijogo (faladas)
  instrucoes: {
    rima: 'Escute a palavra. Toque na figura que rima com ela.',
    palmas: 'Escute a palavra. Toque no tambor uma vez para cada pedacinho. Depois toque em pronto.',
    somInicialSilaba: 'Escute a palavra. Qual figura começa com o mesmo pedacinho?',
    somInicialSom: 'Escute o som. Qual figura começa com esse som?',
    somFinal: 'Escute a palavra. Qual figura termina com o mesmo pedacinho?',
    juntar: 'Escute os pedacinhos e junte na cabeça. Qual figura é?',
    tirar: 'Vamos fazer mágica: tire um pedacinho da palavra. Qual figura sobrou?',
    trocar: 'Troque um pedacinho da palavra. Qual figura apareceu?',
    memoria: 'Vire as cartas e encontre os pares.', memoriaRima: 'Vire as cartas e encontre as figuras que rimam.',
    cacaSomVogal: 'Escute o som. Toque na letra que faz esse som.', cacaSomSilaba: 'Escute. Toque na sílaba que você ouviu.',
    cacaSomLetra: 'Escute o som. Qual letra faz esse som?', abertoFechado: 'Escute a palavra. A boca fica aberta ou mais fechada?',
    tracado: 'Passe o dedo seguindo as setas para escrever a letra.', bingo: 'Bingo! Escute e marque na sua cartela.',
    nomeSom: 'Escute. Isso foi o nome da letra ou o som da letra?',
    leiaEncontre: 'Leia a palavra. Se precisar, toque nos pedacinhos para ouvir. Qual é a figura?',
    gemeos: 'Escute com atenção. Qual destas palavras você ouviu?', letraPerdida: 'Escute a palavra. Qual letra está faltando?',
    letraPerdidaRegra: 'Escute a palavra. O que está faltando?', somS: 'Leia a palavra. O S faz som de cobrinha ou de abelha?',
    escrita: 'Escute a palavra. Qual é o jeito certo de escrever?', fabrica: 'Toque nas sílabas para ouvir. Junte e descubra a palavra.',
    trem: 'Coloque as sílabas nos vagões, na ordem certa, para formar a palavra.', fatiador: 'Corte a palavra em sílabas. Toque nos espaços entre as letras e depois em pronto.',
    freq: 'Escute a palavra mágica. Toque nela.', ditado: 'Escute a palavra e escreva com as letras.',
    trocaLetra: 'Troque a letra marcada pela letra nova. Que palavra virou?', frase: 'Leia a frase. Toque na figura que mostra a frase.',
    microfone: 'Leia em voz alta. Toque no microfone e fale.', historia: 'Vamos ler uma história juntos!',
    guardiao: 'O Guardião quer ver tudo o que você aprendeu. Vamos lá!', licao: 'Vamos conhecer um som novo!', regra: 'Vamos fazer uma descoberta!',
    avaliacao: 'Vamos brincar de descobrir o que você já sabe.'
  },
  // Dicas por tipo de minijogo (andaime nível 1 quando não há par mínimo envolvido)
  dicasTipo: {
    rima: 'Escute o finalzinho. Palavras que rimam terminam igual.', palmas: 'Fale a palavra devagar e bata uma palma em cada pedacinho.',
    somInicial: 'Escute bem o comecinho da palavra.', somFinal: 'Escute bem o finalzinho da palavra.', juntar: 'Fale os pedacinhos bem juntinhos, mais rápido.',
    tirar: 'Fale a palavra sem aquele pedacinho, bem devagar.', trocar: 'Fale a palavra trocando o pedacinho.',
    cacaSom: 'Escute de novo, bem devagar, e olhe a boca da Lili.', abertoFechado: 'Repare se a boca abre muito ou pouco.',
    nomeSom: 'O nome é como a letra se chama. O som é o barulhinho que ela faz dentro da palavra.',
    leiaEncontre: 'Toque em cada sílaba para ouvir e depois junte os sons.', gemeos: 'As duas palavras são quase iguais. Escute só o primeiro som.',
    letraPerdida: 'Fale a palavra devagar e preste atenção no som que falta.', somS: 'Veja se o S está entre duas vogais.',
    escrita: 'Lembre da descoberta que a gente fez!', fabrica: 'Toque em cada sílaba e fale juntinho.', trem: 'Fale a palavra devagar: qual pedacinho vem primeiro?',
    fatiador: 'Bata palmas falando a palavra. Cada palma é um pedaço.', freq: 'Olhe a primeira letra e o tamanho da palavra.',
    ditado: 'Fale a palavra bem devagar e escute cada som.', trocaLetra: 'Troque só a letra marcada e leia de novo.',
    frase: 'Leia palavra por palavra. Toque nas sílabas se precisar.', bingo: 'Escute de novo e procure com calma.', memoria: 'Tente lembrar onde estava cada carta.'
  },

  // ------------------------------------------------------------------ EVOLUÇÃO / LOJA / MEDALHAS
  niveis: [
    { nome: 'Semente', xp: 0, enfeite: 'casca' }, { nome: 'Broto', xp: 150, enfeite: 'broto' }, { nome: 'Florzinha', xp: 400, enfeite: 'flor' },
    { nome: 'Explorador(a)', xp: 800, enfeite: 'chapeuExplorador' }, { nome: 'Aventureiro(a)', xp: 1400, enfeite: 'mochila' },
    { nome: 'Detetive das Letras', xp: 2200, enfeite: 'lupa' }, { nome: 'Mestre das Sílabas', xp: 3200, enfeite: 'capelo' },
    { nome: 'Super Leitor(a)', xp: 4500, enfeite: 'capa' }
  ],
  loja: [
    { id: 'laco', nome: 'Laço', emoji: '🎀', preco: 30, tipo: 'acessorio' }, { id: 'oculos', nome: 'Óculos', emoji: '👓', preco: 40, tipo: 'acessorio' },
    { id: 'cachecol', nome: 'Cachecol', emoji: '🧣', preco: 50, tipo: 'acessorio' }, { id: 'chapeu', nome: 'Chapéu', emoji: '🎩', preco: 60, tipo: 'acessorio' },
    { id: 'coroa', nome: 'Coroa', emoji: '👑', preco: 120, tipo: 'acessorio' },
    { id: 'corAzul', nome: 'Lili azul', emoji: '💙', preco: 50, tipo: 'cor', valor: '#6fa8dc' }, { id: 'corRosa', nome: 'Lili rosa', emoji: '💗', preco: 50, tipo: 'cor', valor: '#f4a6c6' },
    { id: 'corVerde', nome: 'Lili verde', emoji: '💚', preco: 50, tipo: 'cor', valor: '#93d38f' },
    { id: 'mapaPorDoSol', nome: 'Mapa pôr do sol', emoji: '🌅', preco: 40, tipo: 'mapa', valor: 'linear-gradient(160deg,#ffb88c,#ffd6a5)' },
    { id: 'mapaOceano', nome: 'Mapa oceano', emoji: '🌊', preco: 40, tipo: 'mapa', valor: 'linear-gradient(160deg,#4facfe,#a8edea)' },
    { id: 'mapaDoce', nome: 'Mapa doce', emoji: '🍭', preco: 40, tipo: 'mapa', valor: 'linear-gradient(160deg,#fbc2eb,#a6c1ee)' }
  ],
  medalhas: [
    { id: 'ouvidoOuro', nome: 'Ouvido de Ouro', emoji: '👂', desc: '20 pares mínimos certos', stat: 'pares', meta: 20 },
    { id: 'contador', nome: 'Contador de Histórias', emoji: '📚', desc: '5 histórias lidas', stat: 'historias', meta: 5 },
    { id: 'persistente', nome: 'Não Desisto!', emoji: '💪', desc: '10 acertos depois de errar', stat: 'aposErro', meta: 10 },
    { id: 'escritor', nome: 'Escritor Mágico', emoji: '✍️', desc: '10 ditados certos', stat: 'ditados', meta: 10 },
    { id: 'leitor', nome: 'Olho de Leitor', emoji: '👀', desc: '20 palavras lidas sozinho', stat: 'leituras', meta: 20 },
    { id: 'estrelas', nome: 'Chuva de Estrelas', emoji: '🌟', desc: '10 fases com 3 estrelas', stat: 'tresEstrelas', meta: 10 },
    { id: 'colecionador', nome: 'Colecionador', emoji: '📒', desc: '30 figurinhas no álbum', stat: 'figurinhas', meta: 30 },
    { id: 'voz', nome: 'Voz de Leitor', emoji: '🎤', desc: '10 leituras em voz alta', stat: 'micro', meta: 10 },
    { id: 'tracos', nome: 'Mão Mágica', emoji: '🪄', desc: '10 letras traçadas', stat: 'tracos', meta: 10 },
    { id: 'mundo1', nome: 'Rei da Ilha', emoji: '🏝️', desc: 'Concluir o Mundo 1', stat: 'mundos', meta: 1 },
    { id: 'mundo4', nome: 'Alpinista', emoji: '🏔️', desc: 'Concluir 4 mundos', stat: 'mundos', meta: 4 },
    { id: 'superLeitor', nome: 'Super Leitor', emoji: '🦸', desc: 'Concluir os 8 mundos', stat: 'mundos', meta: 8 }
  ],
  avatares: ['🦊', '🐼', '🐯', '🐸', '🦄', '🐙', '🐵', '🐰', '🐻', '🐨', '🦁', '🐧'],

  // ------------------------------------------------------------------ CRÉDITOS / LICENÇAS / CHANGELOG
  creditos: [
    'Imagens: OpenMoji — o projeto de emojis de código aberto (https://openmoji.org), licença CC BY-SA 4.0. Emojis nativos do sistema são usados como alternativa.',
    'Fonte: Andika (SIL International), SIL Open Font License 1.1, via Google Fonts. Alternativa: fonte do sistema.',
    'Vozes do Banco de Áudio (v1.1): vozes neurais Microsoft (pt-BR Francisca/Thalita/Antonio) geradas com a biblioteca livre edge-tts (licença GPL-3.0/LGPL), ou Kokoro-82M (Apache-2.0, voz pf_dora) para geração offline. Para uso comercial, gere com Azure Speech ou Kokoro.',
    'Fontes: Baloo 2 (Ek Type) e Andika (SIL), ambas SIL Open Font License 1.1, via Google Fonts.',
    'Voz alternativa: Piper TTS (Rhasspy/Open Home Foundation, licença MIT) com o modelo pt_BR-faber-medium. Confira a licença do modelo baixado no arquivo .onnx.json/MODEL_CARD e registre aqui.',
    'Fonemas alternativos (opcional): gravações do Alfabeto Fonético Internacional no Wikimedia Commons — a atribuição de cada arquivo usado aparece no painel do Banco de Áudio (licenças variam por arquivo).',
    'Efeitos sonoros, música e confete: gerados pelo próprio jogo (Web Audio API e canvas), sem arquivos externos.',
    'Personagens, histórias e textos: originais, criados para este jogo.'
  ],
  changelog: [
    '1.1.0 — Visual novo (cenários ilustrados por mundo, trilha sinuosa no mapa, botões 3D, fonte Baloo 2); áudio mais natural: escolha automática da voz neural do navegador, velocidade natural, frases faladas de uma vez (sem picotar), karaokê com a frase inteira, fonema alongado; gerador do Banco de Áudio com vozes neurais Microsoft (edge-tts) e Kokoro offline, com amostra para comparar vozes.',
    '1.0.0 — Primeira versão: 8 mundos, 93 fases, 363 palavras, 11 histórias, 17 minijogos, Área dos Pais, autoteste V1–V12.'
  ]
};
