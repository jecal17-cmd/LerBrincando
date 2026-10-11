/* Ler Brincando — data.js (GERADO por ferramentas/construir_dados.js — edite a fonte e rode o script)
   Banco de palavras, fases, histórias, elogios, falas e regras. Formato JSON para o gerar_audios.py ler. */
window.DADOS = {
 "versao": "1.2.0",
 "mundos": [
  {
   "id": 1,
   "nome": "Ilha dos Sons",
   "tema": "praia",
   "cor1": "#7fd6f5",
   "cor2": "#ffe8a3",
   "deco": "🏝️🌊🐚🦀☀️",
   "conteudo": "Consciência fonológica (sem letras)"
  },
  {
   "id": 2,
   "nome": "Vale das Vogais",
   "tema": "campo florido",
   "cor1": "#b8f0a8",
   "cor2": "#fff5c2",
   "deco": "🌼🌷🦋🌻🐝",
   "conteudo": "Vogais A, E, I, O, U, abertas/fechadas e Ã"
  },
  {
   "id": 3,
   "nome": "Floresta Sussurrante",
   "tema": "floresta",
   "cor1": "#7cc489",
   "cor2": "#d8f3c9",
   "deco": "🌳🍄🦉🌲🐿️",
   "conteudo": "Consoantes contínuas F V M N L S Z J X + sílabas"
  },
  {
   "id": 4,
   "nome": "Montanha dos Gêmeos",
   "tema": "montanha",
   "cor1": "#a9b8e8",
   "cor2": "#eef1ff",
   "deco": "⛰️🏔️🐐🦅❄️",
   "conteudo": "Oclusivas P B T D C G + pares mínimos"
  },
  {
   "id": 5,
   "nome": "Rio das Palavras",
   "tema": "rio com trem",
   "cor1": "#79c7e8",
   "cor2": "#d6f6ff",
   "deco": "🚂🏞️🐟🛶🌉",
   "conteudo": "Palavras com sílabas simples (CV)"
  },
  {
   "id": 6,
   "nome": "Caverna dos Cristais",
   "tema": "caverna",
   "cor1": "#b49be0",
   "cor2": "#efe6ff",
   "deco": "💎🔦🦇🪨✨",
   "conteudo": "Sílabas complexas (CVC, CCV) e nasais"
  },
  {
   "id": 7,
   "nome": "Castelo das Regras",
   "tema": "castelo",
   "cor1": "#f2a7a7",
   "cor2": "#fff0e6",
   "deco": "🏰🛡️👑🐉🗝️",
   "conteudo": "Dígrafos e regras contextuais"
  },
  {
   "id": 8,
   "nome": "Biblioteca Encantada",
   "tema": "biblioteca",
   "cor1": "#e8c07a",
   "cor2": "#fff6e0",
   "deco": "📚🕯️🦉📖✨",
   "conteudo": "Histórias, fluência e compreensão"
  }
 ],
 "fases": [
  {
   "id": "1.1",
   "nome": "Rima Maluca",
   "tipo": "rima",
   "n": 8,
   "oral": true,
   "mundo": 1
  },
  {
   "id": "1.2",
   "nome": "Bate-Palmas",
   "tipo": "palmas",
   "n": 8,
   "oral": true,
   "cfg": {
    "min": 1,
    "max": 3
   },
   "mundo": 1
  },
  {
   "id": "1.3",
   "nome": "Começa Igual",
   "tipo": "somInicial",
   "n": 8,
   "oral": true,
   "cfg": {
    "modo": "silaba"
   },
   "mundo": 1
  },
  {
   "id": "1.4",
   "nome": "Termina Igual",
   "tipo": "somFinal",
   "n": 8,
   "oral": true,
   "mundo": 1
  },
  {
   "id": "1.5",
   "nome": "Junta-Junta",
   "tipo": "juntar",
   "n": 8,
   "oral": true,
   "mundo": 1
  },
  {
   "id": "1.6",
   "nome": "Bate-Palmas Gigante",
   "tipo": "palmas",
   "n": 8,
   "oral": true,
   "cfg": {
    "min": 2,
    "max": 5
   },
   "mundo": 1
  },
  {
   "id": "1.7",
   "nome": "Some-Some",
   "tipo": "tirar",
   "n": 7,
   "oral": true,
   "mundo": 1
  },
  {
   "id": "1.8",
   "nome": "Troca-Troca",
   "tipo": "trocar",
   "n": 8,
   "oral": true,
   "mundo": 1
  },
  {
   "id": "1.9",
   "nome": "Memória das Rimas",
   "tipo": "memoria",
   "n": 4,
   "oral": true,
   "cfg": {
    "modo": "rima"
   },
   "mundo": 1
  },
  {
   "id": "1.10",
   "nome": "História: O Gato de Sapato",
   "tipo": "historia",
   "historia": "h1",
   "oral": true,
   "semDominio": true,
   "mundo": 1
  },
  {
   "id": "1.11",
   "nome": "Desafio do Guardião da Ilha",
   "tipo": "guardiao",
   "n": 10,
   "oral": true,
   "cfg": {
    "mix": [
     "rima",
     "palmas",
     "somInicial",
     "somFinal",
     "juntar",
     "tirar",
     "trocar"
    ]
   },
   "mundo": 1
  },
  {
   "id": "2.1",
   "nome": "O som do A",
   "tipo": "licao",
   "g": [
    "A"
   ],
   "novos": [
    "A"
   ],
   "n": 7,
   "mundo": 2
  },
  {
   "id": "2.2",
   "nome": "O som do E",
   "tipo": "licao",
   "g": [
    "E"
   ],
   "novos": [
    "E"
   ],
   "n": 7,
   "mundo": 2
  },
  {
   "id": "2.3",
   "nome": "O som do I",
   "tipo": "licao",
   "g": [
    "I"
   ],
   "novos": [
    "I"
   ],
   "n": 7,
   "mundo": 2
  },
  {
   "id": "2.4",
   "nome": "O som do O",
   "tipo": "licao",
   "g": [
    "O"
   ],
   "novos": [
    "O"
   ],
   "n": 7,
   "mundo": 2
  },
  {
   "id": "2.5",
   "nome": "O som do U",
   "tipo": "licao",
   "g": [
    "U"
   ],
   "novos": [
    "U"
   ],
   "n": 7,
   "mundo": 2
  },
  {
   "id": "2.6",
   "nome": "Caça às Vogais",
   "tipo": "cacaSom",
   "n": 8,
   "cfg": {
    "modo": "vogal"
   },
   "mundo": 2
  },
  {
   "id": "2.7",
   "nome": "Traçado Mágico das Vogais",
   "tipo": "tracado",
   "n": 5,
   "cfg": {
    "letras": [
     "A",
     "E",
     "I",
     "O",
     "U"
    ]
   },
   "mundo": 2
  },
  {
   "id": "2.8",
   "nome": "O som do Ã",
   "tipo": "licao",
   "g": [
    "Ã"
   ],
   "novos": [
    "Ã"
   ],
   "n": 6,
   "mundo": 2
  },
  {
   "id": "2.9",
   "nome": "Boca Aberta, Boca Fechada",
   "tipo": "abertoFechado",
   "n": 8,
   "mundo": 2
  },
  {
   "id": "2.10",
   "nome": "Bingo das Vogais",
   "tipo": "bingo",
   "n": 6,
   "cfg": {
    "modo": "vogal"
   },
   "mundo": 2
  },
  {
   "id": "2.11",
   "nome": "História: Oi, Ioiô!",
   "tipo": "historia",
   "historia": "h2",
   "semDominio": true,
   "mundo": 2
  },
  {
   "id": "2.12",
   "nome": "Desafio do Guardião do Vale",
   "tipo": "guardiao",
   "n": 10,
   "cfg": {
    "mix": [
     "cacaSom",
     "somInicial",
     "abertoFechado",
     "rima",
     "palmas"
    ]
   },
   "mundo": 2
  },
  {
   "id": "3.1",
   "nome": "O som do F",
   "tipo": "licao",
   "g": [
    "F"
   ],
   "novos": [
    "F"
   ],
   "n": 8,
   "mundo": 3
  },
  {
   "id": "3.2",
   "nome": "O som do V",
   "tipo": "licao",
   "g": [
    "V"
   ],
   "novos": [
    "V"
   ],
   "n": 8,
   "cfg": {
    "par": "F"
   },
   "mundo": 3
  },
  {
   "id": "3.3",
   "nome": "O som do M",
   "tipo": "licao",
   "g": [
    "M"
   ],
   "novos": [
    "M"
   ],
   "n": 8,
   "mundo": 3
  },
  {
   "id": "3.4",
   "nome": "O som do N",
   "tipo": "licao",
   "g": [
    "N"
   ],
   "novos": [
    "N"
   ],
   "n": 8,
   "cfg": {
    "par": "M"
   },
   "mundo": 3
  },
  {
   "id": "3.5",
   "nome": "Nome ou Som?",
   "tipo": "nomeSom",
   "n": 8,
   "mundo": 3
  },
  {
   "id": "3.6",
   "nome": "O som do L",
   "tipo": "licao",
   "g": [
    "L"
   ],
   "novos": [
    "L"
   ],
   "n": 8,
   "mundo": 3
  },
  {
   "id": "3.7",
   "nome": "Os sons do S e do Z",
   "tipo": "licao",
   "g": [
    "S",
    "Z"
   ],
   "novos": [
    "S",
    "Z"
   ],
   "n": 8,
   "cfg": {
    "par": "S"
   },
   "mundo": 3
  },
  {
   "id": "3.8",
   "nome": "Os sons do J e do X",
   "tipo": "licao",
   "g": [
    "J",
    "X"
   ],
   "novos": [
    "J",
    "X"
   ],
   "n": 8,
   "cfg": {
    "par": "X"
   },
   "mundo": 3
  },
  {
   "id": "3.9",
   "nome": "Bingo de Sílabas",
   "tipo": "bingo",
   "n": 6,
   "cfg": {
    "modo": "silaba"
   },
   "mundo": 3
  },
  {
   "id": "3.10",
   "nome": "Leia e Encontre",
   "tipo": "leiaEncontre",
   "n": 8,
   "mundo": 3
  },
  {
   "id": "3.11",
   "nome": "História: A Mala da Vovó",
   "tipo": "historia",
   "historia": "h3",
   "semDominio": true,
   "mundo": 3
  },
  {
   "id": "3.12",
   "nome": "Desafio do Guardião da Floresta",
   "tipo": "guardiao",
   "n": 10,
   "cfg": {
    "mix": [
     "cacaSom",
     "leiaEncontre",
     "somInicial",
     "nomeSom"
    ]
   },
   "mundo": 3
  },
  {
   "id": "4.1",
   "nome": "O som do P",
   "tipo": "licao",
   "g": [
    "P"
   ],
   "novos": [
    "P"
   ],
   "n": 8,
   "mundo": 4
  },
  {
   "id": "4.2",
   "nome": "O som do B",
   "tipo": "licao",
   "g": [
    "B"
   ],
   "novos": [
    "B"
   ],
   "n": 8,
   "cfg": {
    "par": "P"
   },
   "mundo": 4
  },
  {
   "id": "4.3",
   "nome": "O som do T",
   "tipo": "licao",
   "g": [
    "T"
   ],
   "novos": [
    "T"
   ],
   "n": 8,
   "mundo": 4
  },
  {
   "id": "4.4",
   "nome": "O som do D",
   "tipo": "licao",
   "g": [
    "D"
   ],
   "novos": [
    "D"
   ],
   "n": 8,
   "cfg": {
    "par": "T"
   },
   "mundo": 4
  },
  {
   "id": "4.5",
   "nome": "O som do C",
   "tipo": "licao",
   "g": [
    "C"
   ],
   "novos": [
    "C"
   ],
   "n": 8,
   "mundo": 4
  },
  {
   "id": "4.6",
   "nome": "O som do G",
   "tipo": "licao",
   "g": [
    "G"
   ],
   "novos": [
    "G"
   ],
   "n": 8,
   "cfg": {
    "par": "C"
   },
   "mundo": 4
  },
  {
   "id": "4.7",
   "nome": "Gêmeos Diferentes: P e B",
   "tipo": "gemeos",
   "n": 8,
   "cfg": {
    "pares": [
     "P/B"
    ]
   },
   "mundo": 4
  },
  {
   "id": "4.8",
   "nome": "Gêmeos Diferentes: T e D",
   "tipo": "gemeos",
   "n": 8,
   "cfg": {
    "pares": [
     "T/D"
    ]
   },
   "mundo": 4
  },
  {
   "id": "4.9",
   "nome": "Gêmeos Diferentes: F/V e C/G",
   "tipo": "gemeos",
   "n": 8,
   "cfg": {
    "pares": [
     "F/V",
     "C/G"
    ]
   },
   "mundo": 4
  },
  {
   "id": "4.10",
   "nome": "Letra Perdida",
   "tipo": "letraPerdida",
   "n": 8,
   "mundo": 4
  },
  {
   "id": "4.11",
   "nome": "História: A Pipa do Macaco",
   "tipo": "historia",
   "historia": "h4",
   "semDominio": true,
   "mundo": 4
  },
  {
   "id": "4.12",
   "nome": "Desafio do Guardião da Montanha",
   "tipo": "guardiao",
   "n": 10,
   "cfg": {
    "mix": [
     "gemeos",
     "letraPerdida",
     "cacaSom",
     "leiaEncontre"
    ]
   },
   "mundo": 4
  },
  {
   "id": "5.1",
   "nome": "Descoberta: S com som de Z",
   "tipo": "regra",
   "regra": "S_Z",
   "novos": [
    "S_Z"
   ],
   "n": 8,
   "mundo": 5
  },
  {
   "id": "5.2",
   "nome": "Fábrica de Palavras",
   "tipo": "fabrica",
   "n": 8,
   "mundo": 5
  },
  {
   "id": "5.3",
   "nome": "Trem das Sílabas",
   "tipo": "trem",
   "n": 6,
   "mundo": 5
  },
  {
   "id": "5.4",
   "nome": "Fatiador",
   "tipo": "fatiador",
   "n": 6,
   "mundo": 5
  },
  {
   "id": "5.5",
   "nome": "Leia e Encontre",
   "tipo": "leiaEncontre",
   "n": 8,
   "mundo": 5
  },
  {
   "id": "5.6",
   "nome": "Palavras Mágicas",
   "tipo": "freq",
   "novos": [
    "FREQ"
   ],
   "n": 8,
   "mundo": 5
  },
  {
   "id": "5.7",
   "nome": "Ditado Mágico",
   "tipo": "ditado",
   "n": 6,
   "mundo": 5
  },
  {
   "id": "5.8",
   "nome": "Troca-Letra Mágica",
   "tipo": "trocaLetra",
   "n": 8,
   "mundo": 5
  },
  {
   "id": "5.9",
   "nome": "Memória Som-Imagem",
   "tipo": "memoria",
   "n": 4,
   "cfg": {
    "modo": "palavra"
   },
   "mundo": 5
  },
  {
   "id": "5.10",
   "nome": "Leitura de Frase",
   "tipo": "frase",
   "n": 6,
   "mundo": 5
  },
  {
   "id": "5.11",
   "nome": "História: O Sapo na Sopa",
   "tipo": "historia",
   "historia": "h5",
   "semDominio": true,
   "mundo": 5
  },
  {
   "id": "5.12",
   "nome": "Desafio do Guardião do Rio",
   "tipo": "guardiao",
   "n": 10,
   "cfg": {
    "mix": [
     "leiaEncontre",
     "fabrica",
     "gemeos",
     "letraPerdida",
     "trocaLetra",
     "frase"
    ]
   },
   "mundo": 5
  },
  {
   "id": "6.1",
   "nome": "Descoberta: R fraquinho",
   "tipo": "regra",
   "regra": "R_FRACO",
   "novos": [
    "R_FRACO"
   ],
   "n": 8,
   "mundo": 6
  },
  {
   "id": "6.2",
   "nome": "Descoberta: S e Z no fim da sílaba",
   "tipo": "regra",
   "regra": "CODA_S",
   "novos": [
    "CODA_S",
    "CODA_Z"
   ],
   "n": 8,
   "mundo": 6
  },
  {
   "id": "6.3",
   "nome": "Descoberta: R no fim da sílaba",
   "tipo": "regra",
   "regra": "CODA_R",
   "novos": [
    "CODA_R"
   ],
   "n": 8,
   "mundo": 6
  },
  {
   "id": "6.4",
   "nome": "Descoberta: L no fim da sílaba",
   "tipo": "regra",
   "regra": "CODA_L",
   "novos": [
    "CODA_L"
   ],
   "n": 8,
   "mundo": 6
  },
  {
   "id": "6.5",
   "nome": "Descoberta: M e N nasais",
   "tipo": "regra",
   "regra": "NASAL",
   "novos": [
    "NASAL"
   ],
   "n": 8,
   "mundo": 6
  },
  {
   "id": "6.6",
   "nome": "Descoberta: o som ÃO",
   "tipo": "regra",
   "regra": "ÃO",
   "novos": [
    "ÃO"
   ],
   "n": 8,
   "mundo": 6
  },
  {
   "id": "6.7",
   "nome": "Descoberta: consoantes juntinhas",
   "tipo": "regra",
   "regra": "CCV",
   "novos": [
    "CCV"
   ],
   "n": 8,
   "mundo": 6
  },
  {
   "id": "6.8",
   "nome": "Trem dos Cristais",
   "tipo": "trem",
   "n": 6,
   "mundo": 6
  },
  {
   "id": "6.9",
   "nome": "Ditado dos Cristais",
   "tipo": "ditado",
   "n": 6,
   "mundo": 6
  },
  {
   "id": "6.10",
   "nome": "Microfone Mágico",
   "tipo": "microfone",
   "n": 6,
   "semDominio": true,
   "cfg": {
    "modo": "palavra"
   },
   "mundo": 6
  },
  {
   "id": "6.11",
   "nome": "História: O Dragão e a Flor",
   "tipo": "historia",
   "historia": "h6",
   "semDominio": true,
   "mundo": 6
  },
  {
   "id": "6.12",
   "nome": "Desafio do Guardião da Caverna",
   "tipo": "guardiao",
   "n": 10,
   "cfg": {
    "mix": [
     "leiaEncontre",
     "escrita",
     "gemeos",
     "fatiador",
     "trocaLetra"
    ]
   },
   "mundo": 6
  },
  {
   "id": "7.1",
   "nome": "Regra: CH",
   "tipo": "regra",
   "regra": "CH",
   "novos": [
    "CH"
   ],
   "n": 8,
   "mundo": 7
  },
  {
   "id": "7.2",
   "nome": "Regra: LH e NH",
   "tipo": "regra",
   "regra": "LH_NH",
   "novos": [
    "LH",
    "NH"
   ],
   "n": 8,
   "mundo": 7
  },
  {
   "id": "7.3",
   "nome": "Regra: R forte e RR",
   "tipo": "regra",
   "regra": "R_FORTE",
   "novos": [
    "R_FORTE",
    "RR"
   ],
   "n": 8,
   "mundo": 7
  },
  {
   "id": "7.4",
   "nome": "Regra: Ç, SS e C com som de S",
   "tipo": "regra",
   "regra": "SOM_S",
   "novos": [
    "Ç",
    "C_SUAVE",
    "SS"
   ],
   "n": 8,
   "mundo": 7
  },
  {
   "id": "7.5",
   "nome": "Regra: QU e GU",
   "tipo": "regra",
   "regra": "QU_GU",
   "novos": [
    "QU",
    "GU"
   ],
   "n": 8,
   "mundo": 7
  },
  {
   "id": "7.6",
   "nome": "Regra: G com som de J",
   "tipo": "regra",
   "regra": "G_SUAVE",
   "novos": [
    "G_SUAVE"
   ],
   "n": 8,
   "mundo": 7
  },
  {
   "id": "7.7",
   "nome": "Regra: H mudo e X mágico",
   "tipo": "regra",
   "regra": "H_X",
   "novos": [
    "H",
    "X_VARIOS"
   ],
   "n": 6,
   "mundo": 7
  },
  {
   "id": "7.8",
   "nome": "Gêmeos do Castelo: S/Z e X/J",
   "tipo": "gemeos",
   "n": 8,
   "cfg": {
    "pares": [
     "S/Z",
     "X/J"
    ]
   },
   "mundo": 7
  },
  {
   "id": "7.9",
   "nome": "Letra Perdida das Regras",
   "tipo": "letraPerdida",
   "n": 8,
   "cfg": {
    "modo": "regra"
   },
   "mundo": 7
  },
  {
   "id": "7.10",
   "nome": "Ditado do Castelo",
   "tipo": "ditado",
   "n": 6,
   "mundo": 7
  },
  {
   "id": "7.11",
   "nome": "História: A Chave do Castelo",
   "tipo": "historia",
   "historia": "h7",
   "semDominio": true,
   "mundo": 7
  },
  {
   "id": "7.12",
   "nome": "Desafio do Guardião do Castelo",
   "tipo": "guardiao",
   "n": 10,
   "cfg": {
    "mix": [
     "escrita",
     "letraPerdida",
     "gemeos",
     "leiaEncontre",
     "trocaLetra"
    ]
   },
   "mundo": 7
  },
  {
   "id": "8.1",
   "nome": "Leitura de Frases",
   "tipo": "frase",
   "n": 6,
   "mundo": 8
  },
  {
   "id": "8.2",
   "nome": "História: O Robô que Queria Dançar",
   "tipo": "historia",
   "historia": "h8a",
   "semDominio": true,
   "mundo": 8
  },
  {
   "id": "8.3",
   "nome": "Microfone Mágico: Eu Leio!",
   "tipo": "microfone",
   "n": 5,
   "semDominio": true,
   "cfg": {
    "modo": "frase"
   },
   "mundo": 8
  },
  {
   "id": "8.4",
   "nome": "História: A Tartaruga Apressada",
   "tipo": "historia",
   "historia": "h8b",
   "semDominio": true,
   "mundo": 8
  },
  {
   "id": "8.5",
   "nome": "Todos os Gêmeos",
   "tipo": "gemeos",
   "n": 8,
   "cfg": {
    "pares": [
     "todos"
    ]
   },
   "mundo": 8
  },
  {
   "id": "8.6",
   "nome": "História: O Ninho no Telhado",
   "tipo": "historia",
   "historia": "h8c",
   "semDominio": true,
   "mundo": 8
  },
  {
   "id": "8.7",
   "nome": "Frases Divertidas",
   "tipo": "frase",
   "n": 6,
   "mundo": 8
  },
  {
   "id": "8.8",
   "nome": "História: Lili e a Biblioteca Encantada",
   "tipo": "historia",
   "historia": "h8d",
   "semDominio": true,
   "mundo": 8
  },
  {
   "id": "8.9",
   "nome": "Grande Ditado",
   "tipo": "ditado",
   "n": 6,
   "mundo": 8
  },
  {
   "id": "8.10",
   "nome": "Desafio Final do Guardião da Biblioteca",
   "tipo": "guardiao",
   "n": 10,
   "cfg": {
    "mix": [
     "frase",
     "escrita",
     "gemeos",
     "leiaEncontre",
     "trocaLetra",
     "letraPerdida"
    ]
   },
   "mundo": 8
  }
 ],
 "pares": [
  {
   "par": "P/B",
   "a": "POTE",
   "b": "BOTE"
  },
  {
   "par": "P/B",
   "a": "PICO",
   "b": "BICO"
  },
  {
   "par": "P/B",
   "a": "PAU",
   "b": "BAÚ"
  },
  {
   "par": "T/D",
   "a": "TIA",
   "b": "DIA"
  },
  {
   "par": "T/D",
   "a": "GATO",
   "b": "GADO"
  },
  {
   "par": "F/V",
   "a": "FACA",
   "b": "VACA"
  },
  {
   "par": "F/V",
   "a": "FOTO",
   "b": "VOTO"
  },
  {
   "par": "F/V",
   "a": "FILA",
   "b": "VILA"
  },
  {
   "par": "C/G",
   "a": "COLA",
   "b": "GOLA"
  },
  {
   "par": "C/G",
   "a": "CALO",
   "b": "GALO"
  },
  {
   "par": "S/Z",
   "a": "CAÇA",
   "b": "CASA"
  },
  {
   "par": "S/Z",
   "a": "ROÇA",
   "b": "ROSA"
  },
  {
   "par": "X/J",
   "a": "QUEIXO",
   "b": "QUEIJO"
  },
  {
   "par": "X/J",
   "a": "CHATO",
   "b": "JATO"
  }
 ],
 "parDe": {
  "P": "P/B",
  "B": "P/B",
  "T": "T/D",
  "D": "T/D",
  "F": "F/V",
  "V": "F/V",
  "C": "C/G",
  "G": "C/G",
  "S": "S/Z",
  "Z": "S/Z",
  "X": "X/J",
  "J": "X/J",
  "M": "M/N",
  "N": "M/N",
  "L": "L/R",
  "R": "L/R"
 },
 "parceiro": {
  "P": "B",
  "B": "P",
  "T": "D",
  "D": "T",
  "F": "V",
  "V": "F",
  "C": "G",
  "G": "C",
  "S": "Z",
  "Z": "S",
  "X": "J",
  "J": "X",
  "M": "N",
  "N": "M",
  "L": "R",
  "R": "L",
  "A": "Ã",
  "Ã": "A",
  "É": "Ê",
  "Ê": "É",
  "Ó": "Ô",
  "Ô": "Ó"
 },
 "dicasPares": {
  "P/B": "P é só um sopro, sem barulho na garganta. No B a garganta vibra. Põe a mão no pescoço e sente!",
  "T/D": "No T a língua bate atrás dos dentes e solta só um sopro. No D a garganta vibra. Mão no pescoço: no D ele treme!",
  "F/V": "No F sai só um ventinho: fff. No V a garganta vibra: vvv, parece um zumbido. Põe a mão no pescoço!",
  "C/G": "No C de CASA, o fundo da língua bate lá atrás e sai um sopro. No G de GATO, a garganta vibra.",
  "S/Z": "O S é uma cobrinha: sss, sem vibrar. O Z é uma abelha: zzz, a garganta vibra!",
  "X/J": "O X e o CH são o som do silêncio: xxx, sem vibrar. O J vibra a garganta: jjj.",
  "M/N": "No M os lábios ficam fechados: mmm. No N a boca fica aberta e a língua encosta atrás dos dentes: nnn.",
  "L/R": "No L a língua encosta e fica lá: lll. No R fraquinho a língua só dá uma batidinha rápida.",
  "A/Ã": "No Ã o som sai também pelo nariz. Tampe o nariz e sinta a diferença!",
  "É/Ê": "No É a boca abre bastante, como em CAFÉ. No Ê a boca abre menos, como em BEBÊ.",
  "Ó/Ô": "No Ó a boca fica redonda e bem aberta, como em VOVÓ. No Ô fica redondinha e mais fechada, como em VOVÔ."
 },
 "nomesLetras": {
  "A": "á",
  "B": "bê",
  "C": "cê",
  "D": "dê",
  "E": "é",
  "F": "éfe",
  "G": "gê",
  "H": "agá",
  "I": "i",
  "J": "jota",
  "L": "éle",
  "M": "ême",
  "N": "êne",
  "O": "ó",
  "P": "pê",
  "Q": "quê",
  "R": "érre",
  "S": "ésse",
  "T": "tê",
  "U": "u",
  "V": "vê",
  "X": "xis",
  "Z": "zê"
 },
 "fonemas": {
  "A": {
   "tipo": "vogal",
   "tts": "á",
   "ipa": "a"
  },
  "E": {
   "tipo": "vogal",
   "tts": "ê",
   "ipa": "e"
  },
  "É": {
   "tipo": "vogal",
   "tts": "é",
   "ipa": "ɛ"
  },
  "Ê": {
   "tipo": "vogal",
   "tts": "ê",
   "ipa": "e"
  },
  "I": {
   "tipo": "vogal",
   "tts": "í",
   "ipa": "i"
  },
  "O": {
   "tipo": "vogal",
   "tts": "ô",
   "ipa": "o"
  },
  "Ó": {
   "tipo": "vogal",
   "tts": "ó",
   "ipa": "ɔ"
  },
  "Ô": {
   "tipo": "vogal",
   "tts": "ô",
   "ipa": "o"
  },
  "U": {
   "tipo": "vogal",
   "tts": "ú",
   "ipa": "u"
  },
  "Ã": {
   "tipo": "vogal",
   "tts": "ã",
   "ipa": "ɐ̃"
  },
  "F": {
   "tipo": "continua",
   "apoio": "FA",
   "ipa": "f"
  },
  "V": {
   "tipo": "continua",
   "apoio": "VA",
   "ipa": "v"
  },
  "M": {
   "tipo": "continua",
   "apoio": "MA",
   "ipa": "m"
  },
  "N": {
   "tipo": "continua",
   "apoio": "NA",
   "ipa": "n"
  },
  "L": {
   "tipo": "continua",
   "apoio": "LA",
   "ipa": "l"
  },
  "S": {
   "tipo": "continua",
   "apoio": "SA",
   "ipa": "s"
  },
  "Z": {
   "tipo": "continua",
   "apoio": "ZA",
   "ipa": "z"
  },
  "J": {
   "tipo": "continua",
   "apoio": "JA",
   "ipa": "ʒ"
  },
  "X": {
   "tipo": "continua",
   "apoio": "XA",
   "ipa": "ʃ"
  },
  "NH": {
   "tipo": "continua",
   "apoio": "NHA",
   "ipa": "ɲ"
  },
  "LH": {
   "tipo": "continua",
   "apoio": "LHA",
   "ipa": "ʎ"
  },
  "P": {
   "tipo": "oclusiva",
   "apoio": "PA"
  },
  "B": {
   "tipo": "oclusiva",
   "apoio": "BA"
  },
  "T": {
   "tipo": "oclusiva",
   "apoio": "TA"
  },
  "D": {
   "tipo": "oclusiva",
   "apoio": "DA"
  },
  "C": {
   "tipo": "oclusiva",
   "apoio": "CA"
  },
  "G": {
   "tipo": "oclusiva",
   "apoio": "GA"
  }
 },
 "dicasFonema": {
  "A": "Abra bem a boca, como quem vai morder uma maçã: aaa!",
  "E": "Sorria um pouquinho e fale: êee. Abrindo mais a boca, vira É, como em CAFÉ.",
  "I": "Faça um sorriso bem grande: iii!",
  "O": "Faça a boca redondinha: ôoo. Abrindo mais, vira Ó, como em VOVÓ.",
  "U": "Faça biquinho, como quem vai mandar um beijo: uuu!",
  "Ã": "O Ã sai também pelo nariz! Tampe o nariz e sinta: ã.",
  "F": "Encoste os dentes de cima no lábio de baixo e sopre um ventinho: fff.",
  "V": "Igual ao F, mas com a garganta vibrando: vvv. Põe a mão no pescoço!",
  "M": "Feche os lábios e cantarole, como quando a comida está gostosa: mmm.",
  "N": "Encoste a língua atrás dos dentes de cima e cantarole: nnn.",
  "L": "Encoste a pontinha da língua atrás dos dentes de cima: lll.",
  "S": "Dentes quase fechados, sopre como uma cobrinha: sss.",
  "Z": "Como o S, mas com a garganta vibrando, igual a uma abelha: zzz.",
  "J": "Faça biquinho e vibre a garganta: jjj.",
  "X": "Faça biquinho e peça silêncio: xxx.",
  "P": "Feche os lábios e solte um soprinho, sem vibrar a garganta: PA!",
  "B": "Feche os lábios e solte com a garganta vibrando: BA! Põe a mão no pescoço.",
  "T": "A ponta da língua bate atrás dos dentes e solta um soprinho: TA!",
  "D": "A língua bate atrás dos dentes, com a garganta vibrando: DA!",
  "C": "O fundo da língua bate lá atrás, sem vibrar: CA, como em CASA.",
  "G": "O fundo da língua bate lá atrás, com a garganta vibrando: GA, como em GATO."
 },
 "exemplosSom": {
  "A": [
   "ABELHA",
   "AVIÃO",
   "ABACAXI"
  ],
  "E": [
   "ELEFANTE",
   "ERVILHA",
   "BEBÊ"
  ],
  "I": [
   "ILHA",
   "IGREJA",
   "ÍMÃ"
  ],
  "O": [
   "OVO",
   "OVELHA",
   "ÓCULOS"
  ],
  "U": [
   "UVA",
   "URSO",
   "UNICÓRNIO"
  ],
  "Ã": [
   "MAÇÃ",
   "ÍMÃ",
   "MAMÃE"
  ],
  "F": [
   "FACA",
   "FOCA",
   "FOGO"
  ],
  "V": [
   "VACA",
   "VELA",
   "VASO"
  ],
  "M": [
   "MACACO",
   "MALA",
   "MOTO"
  ],
  "N": [
   "NAVIO",
   "NEVE",
   "NUVEM"
  ],
  "L": [
   "LUA",
   "LUVA",
   "LEÃO"
  ],
  "S": [
   "SAPO",
   "SOL",
   "SINO"
  ],
  "Z": [
   "ZEBRA",
   "ZUMBI"
  ],
  "J": [
   "JANELA",
   "JACARÉ",
   "JAVALI"
  ],
  "X": [
   "LIXO",
   "PEIXE",
   "CAIXA"
  ],
  "P": [
   "PATO",
   "PIPA",
   "PERA"
  ],
  "B": [
   "BOLA",
   "BOTA",
   "BOLO"
  ],
  "T": [
   "TOMATE",
   "TIA",
   "TIJOLO"
  ],
  "D": [
   "DADO",
   "DEDO",
   "DENTE"
  ],
  "C": [
   "CASA",
   "COCO",
   "COPO"
  ],
  "G": [
   "GATO",
   "GALO",
   "GOTA"
  ]
 },
 "regras": {
  "S_Z": {
   "titulo": "S com som de Z",
   "tags": [
    "S_Z"
   ],
   "itens": [
    "somS",
    "leia"
   ],
   "explica": "Descoberta! Quando o S fica entre duas vogais, ele faz som de Z, como em CASA. No começo da palavra, ele faz som de S, como em SAPO.",
   "exemplos": [
    "CASA",
    "VASO",
    "CAMISA",
    "MÚSICA",
    "MEDUSA",
    "BESOURO",
    "TESOURA"
   ],
   "contra": [
    "SAPO",
    "SOFÁ",
    "SINO",
    "SUCO",
    "SOPA"
   ]
  },
  "R_FRACO": {
   "titulo": "R fraquinho",
   "tags": [
    "R_FRACO"
   ],
   "itens": [
    "perdida",
    "leia"
   ],
   "opcoesPerdida": [
    "R",
    "L"
   ],
   "explica": "Quando o R fica entre duas vogais, a língua só dá uma batidinha: é o R fraco, como em PERA e CORUJA.",
   "exemplos": [
    "PERA",
    "CORUJA",
    "BARATA",
    "PERU",
    "PIRULITO",
    "JACARÉ",
    "GORILA",
    "MÁSCARA"
   ],
   "contra": []
  },
  "CODA_S": {
   "titulo": "S e Z no fim da sílaba",
   "tags": [
    "CODA_S",
    "CODA_Z"
   ],
   "itens": [
    "escrita",
    "leia"
   ],
   "erros": [
    "semCoda",
    "trocaSZ"
   ],
   "explica": "O S também pode fechar a sílaba, no finalzinho: LÁ-PIS, ES-CO-LA, MOS-CA. E o Z aparece no fim de algumas palavras, como NA-RIZ.",
   "exemplos": [
    "LÁPIS",
    "ESCOLA",
    "MOSCA",
    "CESTA",
    "NARIZ",
    "ÔNIBUS",
    "ESCOVA",
    "TÊNIS",
    "ESCADA"
   ],
   "contra": [
    "LUPA",
    "BOTA"
   ]
  },
  "CODA_R": {
   "titulo": "R no fim da sílaba",
   "tags": [
    "CODA_R"
   ],
   "itens": [
    "escrita",
    "leia"
   ],
   "erros": [
    "semCoda"
   ],
   "explica": "O R pode fechar a sílaba: POR-TA, MAR, GAR-FO. Se a gente esquece o R, a palavra muda!",
   "exemplos": [
    "PORTA",
    "MAR",
    "GARFO",
    "PORCO",
    "CARTA",
    "URSO",
    "TORTA",
    "CORDA",
    "PERNA"
   ],
   "contra": [
    "POTE",
    "GATO"
   ]
  },
  "CODA_L": {
   "titulo": "L no fim da sílaba",
   "tags": [
    "CODA_L"
   ],
   "itens": [
    "escrita",
    "leia"
   ],
   "erros": [
    "LporU",
    "semCoda"
   ],
   "explica": "No fim da sílaba, o L soa parecido com U, mas escrevemos L: SOL, MEL, PAPEL. Que truque!",
   "exemplos": [
    "SOL",
    "MEL",
    "ANEL",
    "PAPEL",
    "BALDE",
    "POLVO",
    "BOLSA",
    "SAL",
    "GOL"
   ],
   "contra": [
    "BOLO",
    "MALA"
   ]
  },
  "NASAL": {
   "titulo": "M e N que deixam a vogal nasal",
   "tags": [
    "NASAL"
   ],
   "itens": [
    "escrita",
    "leia"
   ],
   "erros": [
    "semNasal",
    "trocaMN"
   ],
   "explica": "Quando o M ou o N fecham a sílaba, o som da vogal sai pelo nariz: PAN-DA, PEN-TE, PON-TE. Antes de P e de B, usamos sempre M: TAM-BOR, POM-BO.",
   "exemplos": [
    "PANDA",
    "PENTE",
    "PONTE",
    "MANGA",
    "TAMBOR",
    "POMBO",
    "LÂMPADA",
    "DENTE",
    "NUVEM",
    "TREM",
    "PIMENTA"
   ],
   "contra": [
    "PATO",
    "BODE"
   ]
  },
  "ÃO": {
   "titulo": "O som ÃO",
   "tags": [
    "ÃO"
   ],
   "itens": [
    "escrita",
    "leia"
   ],
   "erros": [
    "semTil",
    "AOporAM"
   ],
   "explica": "Quando o til fica em cima do A e vem o O, fazemos ÃO, como em PÃO, MÃO e LEÃO.",
   "exemplos": [
    "PÃO",
    "MÃO",
    "LEÃO",
    "BALÃO",
    "LIMÃO",
    "FEIJÃO",
    "BOTÃO",
    "AVIÃO",
    "MELÃO",
    "VULCÃO",
    "PAVÃO"
   ],
   "contra": [
    "MAÇÃ",
    "ÍMÃ"
   ]
  },
  "CCV": {
   "titulo": "Duas consoantes juntinhas",
   "tags": [
    "CCV"
   ],
   "itens": [
    "escrita",
    "leia"
   ],
   "erros": [
    "semCCV2",
    "metatese"
   ],
   "explica": "Às vezes duas consoantes ficam juntinhas antes da vogal: PRA-TO, FLOR, LI-VRO. Falamos as duas bem rapidinho!",
   "exemplos": [
    "PRATO",
    "FLOR",
    "LIVRO",
    "ZEBRA",
    "TIGRE",
    "GLOBO",
    "COBRA",
    "CLIPE",
    "PEDRA",
    "GRILO",
    "TREM",
    "PLANETA",
    "TRATOR"
   ],
   "contra": [
    "PATO",
    "FOGO"
   ]
  },
  "CH": {
   "titulo": "CH: o som do silêncio",
   "tags": [
    "CH"
   ],
   "itens": [
    "escrita",
    "leia"
   ],
   "erros": [
    "CHporX"
   ],
   "explica": "C e H juntinhos fazem um som novo: xxx, como em CHAVE e CHUVA. O X também faz esse som em LIXO e PEIXE. Para saber qual usar, a gente vai conhecendo as palavras!",
   "exemplos": [
    "CHAVE",
    "CHUVA",
    "CHAPÉU",
    "MOCHILA",
    "MACHADO",
    "CHÁ",
    "CONCHA",
    "CHOCOLATE"
   ],
   "contra": [
    "LIXO",
    "PEIXE",
    "CAIXA",
    "BRUXA"
   ]
  },
  "LH_NH": {
   "titulo": "LH e NH",
   "tags": [
    "LH",
    "NH"
   ],
   "itens": [
    "escrita",
    "leia"
   ],
   "erros": [
    "LHporLI",
    "NHporNI",
    "trocaLHNH"
   ],
   "explica": "L com H faz lhe, como em FOLHA. N com H faz nhe, como em NINHO. Não é LI nem NI!",
   "exemplos": [
    "FOLHA",
    "ABELHA",
    "MILHO",
    "OVELHA",
    "ESPELHO",
    "NINHO",
    "GALINHA",
    "ARANHA",
    "CASTANHA",
    "MONTANHA"
   ],
   "contra": [
    "FILA",
    "MENINO"
   ]
  },
  "R_FORTE": {
   "titulo": "R forte e RR",
   "tags": [
    "R_FORTE",
    "RR"
   ],
   "itens": [
    "escrita",
    "leia"
   ],
   "erros": [
    "RRporR",
    "RporRR"
   ],
   "explica": "No começo da palavra o R é forte: RATO, RODA. No meio, entre vogais, para ficar forte escrevemos dois R: CARRO, TERRA. Com um R só, fica fraquinho, como em PERA.",
   "exemplos": [
    "RATO",
    "RODA",
    "RIO",
    "REI",
    "CARRO",
    "TERRA",
    "BARRACA",
    "GARRAFA",
    "RAPOSA"
   ],
   "contra": [
    "PERA",
    "BARATA",
    "CORUJA"
   ]
  },
  "SOM_S": {
   "titulo": "Muitos jeitos de escrever o som de S",
   "tags": [
    "Ç",
    "C_SUAVE",
    "SS"
   ],
   "itens": [
    "escrita",
    "leia"
   ],
   "erros": [
    "ÇporSS",
    "SSporÇ",
    "SSporS",
    "CporS"
   ],
   "explica": "O som sss pode ser escrito com S, com SS, com Ç e com C antes de E e I: SOPA, OSSO, MAÇÃ, CEBOLA. Atenção: um S sozinho entre vogais vira Z, como em CASA!",
   "exemplos": [
    "MAÇÃ",
    "BRAÇO",
    "LAÇO",
    "ONÇA",
    "OSSO",
    "PÊSSEGO",
    "VASSOURA",
    "CEBOLA",
    "CEREJA",
    "CIRCO",
    "CENOURA"
   ],
   "contra": [
    "CASA",
    "VASO"
   ]
  },
  "QU_GU": {
   "titulo": "QU e GU",
   "tags": [
    "QU",
    "GU"
   ],
   "itens": [
    "escrita",
    "leia"
   ],
   "erros": [
    "QUporC",
    "QUporQ",
    "GUporG"
   ],
   "explica": "Para fazer o som de C antes de E e de I, usamos QU: QUEIJO, ESQUILO. Para o som de G antes de E e de I, usamos GU: FOGUETE. O U fica quietinho! Com A, o U aparece: QUADRO.",
   "exemplos": [
    "QUEIJO",
    "ESQUILO",
    "MOSQUITO",
    "PANQUECA",
    "QUADRO",
    "FOGUETE",
    "CARANGUEJO",
    "ROSQUINHA",
    "PREGUIÇA"
   ],
   "contra": [
    "CASA",
    "GATO"
   ]
  },
  "G_SUAVE": {
   "titulo": "G com som de J",
   "tags": [
    "G_SUAVE"
   ],
   "itens": [
    "escrita",
    "leia"
   ],
   "erros": [
    "GporJ"
   ],
   "explica": "Antes de E e de I, o G faz som de J: GELO, GIRAFA. Antes de A, O e U, faz o som de G: GATO, GOTA.",
   "exemplos": [
    "GELO",
    "GIRAFA",
    "GIRASSOL",
    "RELÓGIO",
    "GÊNIO",
    "IGREJA"
   ],
   "contra": [
    "GATO",
    "GOTA",
    "GOLA"
   ]
  },
  "H_X": {
   "titulo": "H mudo e X mágico",
   "tags": [
    "H",
    "X_VARIOS"
   ],
   "itens": [
    "escrita",
    "leia"
   ],
   "erros": [
    "semH",
    "XporCS"
   ],
   "explica": "O H no começo da palavra não faz som nenhum: HOSPITAL, HIPOPÓTAMO. E o X é um mágico: faz xxx em LIXO, faz ks em TÁXI, e ainda tem outros sons!",
   "exemplos": [
    "HOSPITAL",
    "HIPOPÓTAMO",
    "TÁXI",
    "LIXO",
    "PEIXE"
   ],
   "contra": [
    "OSSO",
    "OVO"
   ]
  }
 },
 "frequentes": [
  "NÃO",
  "UM",
  "COM",
  "QUE",
  "EM",
  "TEM",
  "SÃO",
  "ES-TÁ",
  "PA-RA",
  "A-QUI"
 ],
 "tirar": [
  {
   "de": "SA-PA-TO",
   "tira": "SA",
   "modo": "silaba",
   "fica": "PATO"
  },
  {
   "de": "ES-CO-LA",
   "tira": "ES",
   "modo": "silaba",
   "fica": "COLA"
  },
  {
   "de": "LI-MÃO",
   "tira": "LI",
   "modo": "silaba",
   "fica": "MÃO"
  },
  {
   "de": "LU-VA",
   "tira": "L",
   "modo": "som",
   "fica": "UVA"
  },
  {
   "de": "FO-CA",
   "tira": "F",
   "modo": "som",
   "fica": "OCA"
  },
  {
   "de": "CHA-VE",
   "tira": "X",
   "modo": "som",
   "fica": "AVE"
  },
  {
   "de": "NO-VO",
   "tira": "N",
   "modo": "som",
   "fica": "OVO"
  }
 ],
 "trocar": [
  {
   "de": "GA-TO",
   "troca": "GA",
   "por": "PA",
   "fica": "PATO"
  },
  {
   "de": "CA-SA",
   "troca": "SA",
   "por": "MA",
   "fica": "CAMA"
  },
  {
   "de": "VA-CA",
   "troca": "VA",
   "por": "FA",
   "fica": "FACA"
  },
  {
   "de": "BO-LO",
   "troca": "LO",
   "por": "LA",
   "fica": "BOLA"
  },
  {
   "de": "MA-LA",
   "troca": "MA",
   "por": "BA",
   "fica": "BALA"
  },
  {
   "de": "DA-DO",
   "troca": "DA",
   "por": "GA",
   "fica": "GADO"
  },
  {
   "de": "TI-A",
   "troca": "TI",
   "por": "DI",
   "fica": "DIA"
  },
  {
   "de": "FO-TO",
   "troca": "FO",
   "por": "VO",
   "fica": "VOTO"
  },
  {
   "de": "BO-TE",
   "troca": "BO",
   "por": "PO",
   "fica": "POTE"
  },
  {
   "de": "PA-TO",
   "troca": "TO",
   "por": "TA",
   "fica": "PATA"
  }
 ],
 "abertoFechado": [
  { "p": "CAFÉ", "v": "É" },
  { "p": "PÉ", "v": "É" },
  { "p": "BONÉ", "v": "É" },
  { "p": "JACARÉ", "v": "É" },
  { "p": "CHAPÉU", "v": "É" },
  { "p": "TROFÉU", "v": "É" },
  { "p": "BEBÊ", "v": "Ê" },
  { "p": "PÊSSEGO", "v": "Ê" },
  { "p": "TÊNIS", "v": "Ê" },
  { "p": "VOVÓ", "v": "Ó" },
  { "p": "TRENÓ", "v": "Ó" },
  { "p": "ÓCULOS", "v": "Ó" },
  { "p": "VOVÔ", "v": "Ô" },
  { "p": "ROBÔ", "v": "Ô" },
  { "p": "METRÔ", "v": "Ô" },
  { "p": "IOIÔ", "v": "Ô" }
 ],
 "frases": [
  {
   "m": 5,
   "t": "O GA-TO BE-BE LEI-TE.",
   "img": "🐱🥛",
   "d": [
    "🐶🥛",
    "🐱⚽"
   ]
  },
  {
   "m": 5,
   "t": "A VA-CA VÊ A BO-LA.",
   "img": "🐄⚽",
   "d": [
    "🐄🍎",
    "🐐⚽"
   ]
  },
  {
   "m": 5,
   "t": "O MA-CA-CO CO-ME BA-NA-NA.",
   "img": "🐒🍌",
   "d": [
    "🐒🍎",
    "🐸🍌"
   ]
  },
  {
   "m": 5,
   "t": "O SA-PO PU-LA NA CA-SA.",
   "img": "🐸🏠",
   "d": [
    "🐸🚗",
    "🐒🏠"
   ]
  },
  {
   "m": 5,
   "t": "A ME-NI-NA PE-GA A PI-PA.",
   "img": "👧🪁",
   "d": [
    "👦🪁",
    "👧⚽"
   ]
  },
  {
   "m": 5,
   "t": "O PA-TO VAI NO BO-TE.",
   "img": "🦆🛶",
   "d": [
    "🦆🏠",
    "🐓🛶"
   ]
  },
  {
   "m": 5,
   "t": "A VO-VÓ CO-ME BO-LO.",
   "img": "👵🎂",
   "d": [
    "👴🎂",
    "👵🍲"
   ]
  },
  {
   "m": 5,
   "t": "O BE-BÊ VÊ A LU-A.",
   "img": "👶🌙",
   "d": [
    "👶🌞",
    "👴🌙"
   ]
  },
  {
   "m": 8,
   "t": "O DRA-GÃO VO-A SO-BRE O CAS-TE-LO.",
   "img": "🐉🏰",
   "d": [
    "🐉🌊",
    "🐦🏰"
   ]
  },
  {
   "m": 8,
   "t": "A GA-LI-NHA CHO-CA TRÊS O-VOS.",
   "img": "🐔🥚🥚🥚",
   "d": [
    "🐔🥚",
    "🦆🥚🥚🥚"
   ]
  },
  {
   "m": 8,
   "t": "O PA-LHA-ÇO TEM UM NA-RIZ VER-ME-LHO.",
   "img": "🤡🔴",
   "d": [
    "🤡🔵",
    "👸🔴"
   ]
  },
  {
   "m": 8,
   "t": "A RA-I-NHA PER-DEU A CO-RO-A.",
   "img": "👸❓👑",
   "d": [
    "🤴👑",
    "👸🔑"
   ]
  },
  {
   "m": 8,
   "t": "O CA-CHOR-RO COR-RE A-TRÁS DA BO-LA.",
   "img": "🐶⚽",
   "d": [
    "🐱⚽",
    "🐶🦴"
   ]
  },
  {
   "m": 8,
   "t": "CHO-VE MUI-TO NA PRAI-A.",
   "img": "🌧️🏖️",
   "d": [
    "☀️🏖️",
    "🌧️🏰"
   ]
  },
  {
   "m": 8,
   "t": "O ES-QUI-LO GUAR-DA CAS-TA-NHAS.",
   "img": "🐿️🌰",
   "d": [
    "🐿️🍎",
    "🐭🌰"
   ]
  },
  {
   "m": 8,
   "t": "O GI-RAS-SOL O-LHA PA-RA O SOL.",
   "img": "🌻☀️",
   "d": [
    "🌻🌙",
    "🌹☀️"
   ]
  }
 ],
 "historias": [
  {
   "id": "h1",
   "mundo": 1,
   "oral": true,
   "titulo": "O Gato de Sapato",
   "cena": {
    "fundo": "🏝️",
    "cor": "#bfeaf7"
   },
   "intro": "Escute a história e me ajude a achar as rimas!",
   "frases": [
    {
     "t": "Na ilha mora um gato que usa sapato.",
     "img": "🐱👞"
    },
    {
     "t": "O gato de sapato tem um amigo: o pato!",
     "img": "🐱🦆",
     "rima": {
      "op": [
       "PATO",
       "CACHORRO",
       "SAPO"
      ],
      "antes": "O gato de sapato tem um amigo: o...",
      "com": "GATO"
     }
    },
    {
     "t": "O pato leva a bola para a escola.",
     "img": "🦆⚽🏫",
     "rima": {
      "op": [
       "ESCOLA",
       "ÁRVORE",
       "CARRO"
      ],
      "antes": "O pato leva a bola para a...",
      "com": "BOLA"
     }
    },
    {
     "t": "Na escola tem janela, e na janela tem uma vela.",
     "img": "🪟🕯️",
     "rima": {
      "op": [
       "VELA",
       "LUA",
       "BOLO"
      ],
      "antes": "Na escola tem janela, e na janela tem uma...",
      "com": "JANELA"
     }
    },
    {
     "t": "Lá vem o leão, tocando violão.",
     "img": "🦁🎸",
     "rima": {
      "op": [
       "VIOLÃO",
       "TAMBOR",
       "PIANO"
      ],
      "antes": "Lá vem o leão, tocando...",
      "com": "LEÃO"
     }
    },
    {
     "t": "Todo mundo dança na festa da ilha, até a ervilha!",
     "img": "🎉🫛",
     "rima": {
      "op": [
       "ERVILHA",
       "BANANA",
       "MAÇÃ"
      ],
      "antes": "Todo mundo dança na festa da ilha, até a...",
      "com": "ILHA"
     }
    },
    {
     "t": "Que festa animada! Fim.",
     "img": "🎶🌞"
    }
   ],
   "perguntas": [
    {
     "t": "Quem usa sapato?",
     "op": [
      "🐱",
      "🦆",
      "🦁"
     ],
     "c": 0
    },
    {
     "t": "Quem toca violão?",
     "op": [
      "🦁",
      "🐱",
      "🦆"
     ],
     "c": 0
    },
    {
     "t": "Como os bichos estavam na festa?",
     "op": [
      "😀",
      "😢",
      "😴"
     ],
     "c": 0,
     "inf": true
    }
   ]
  },
  {
   "id": "h2",
   "mundo": 2,
   "titulo": "Oi, Ioiô!",
   "cena": {
    "fundo": "🌼",
    "cor": "#e4f8d2"
   },
   "intro": "Dois pintinhos estão passeando no vale e encontram uma coisa redonda. Vamos ler o que eles falam!",
   "frases": [
    {
     "t": "OI!",
     "img": "🐤"
    },
    {
     "t": "OI, OI!",
     "img": "🐤🐥"
    },
    {
     "t": "Ô, É O I-O-I-Ô!",
     "img": "🐤🪀",
     "lac": { "p": "IOIÔ", "l": 1, "op": [ "O", "A" ] } }, { "t": "UI! AI, AI, AI!", "img": "🪀🐥", "lac": { "p": "UI", "l": 1, "op": [ "I", "U" ] } }, { "t": "U-AU!", "img": "🐤🐥✨", "lac": { "p": "UAU", "l": 1, "op": [ "A", "E" ] } }, { "t": "É O I-O-I-Ô! É!", "img": "🐤🪀🐥" } ], "perguntas": [ { "t": "O que os pintinhos encontraram?", "op": [ "🪀", "⚽", "🍎" ], "c": 0 }, { "t": "Como o pintinho ficou quando o ioiô bateu nele?", "op": [ "😣", "😀", "😴" ], "c": 0, "inf": true } ] },
  {
   "id": "h3",
   "mundo": 3,
   "titulo": "A Mala da Vovó",
   "cena": {
    "fundo": "🌳",
    "cor": "#dff3d6"
   },
   "intro": "A vovó vai fazer uma viagem. Vamos ler juntos!",
   "frases": [
    {
     "t": "A VO-VÓ VAI À VI-LA.",
     "img": "👵🏘️"
    },
    {
     "t": "E-LA LE-VA U-MA MA-LA.",
     "img": "👵🧳",
     "lac": { "p": "MALA", "s": 1, "op": [ "LA", "NA" ] } }, { "t": "NA MA-LA, A VO-VÓ LE-VA U-VA E O-VO.", "img": "🧳🍇🥚", "lac": { "p": "UVA", "l": 1, "op": [ "V", "F" ] } }, { "t": "O ME-NI-NO VÊ A MA-LA.", "img": "👦🧳" }, { "t": "A MA-LA SE ME-XE!", "img": "🧳❗", "lac": { "p": "MEXE", "s": 1, "op": [ "XE", "JE" ] } }, { "t": "É A LI-LI!", "img": "🦉🧳" }, { "t": "LI-LI VIU A U-VA NA MA-LA.", "img": "🦉🍇" }, { "t": "A VO-VÓ FA-LA: — LI-LI, SAI, SAI!", "img": "👵🦉" }, { "t": "LI-LI SAI E VAI À JA-NE-LA.", "img": "🦉🪟", "lac": { "p": "JANELA", "s": 0, "op": [ "JA", "XA" ] } }, { "t": "NA JA-NE-LA, LI-LI VÊ A LU-A.", "img": "🪟🦉🌙", "lac": { "p": "LUA", "s": 0, "op": [ "LU", "NU" ] } } ], "perguntas": [ { "t": "O que a vovó levou?", "op": [ "🧳", "🎒", "📦" ], "c": 0 }, { "t": "Quem fez a mala se mexer?", "op": [ "🦉", "🐱", "🐶" ], "c": 0, "inf": true }, { "t": "Para onde a Lili foi no final?", "op": [ "🪟", "🚪", "🌳" ], "c": 0 } ] },
  {
   "id": "h4",
   "mundo": 4,
   "titulo": "A Pipa do Macaco",
   "cena": {
    "fundo": "⛰️",
    "cor": "#e6ebff"
   },
   "intro": "Na montanha venta muito. O macaco tem uma pipa. Vamos ler!",
   "frases": [
    {
     "t": "O MA-CA-CO PE-GA A PI-PA.",
     "img": "🐒🪁",
     "lac": { "p": "PIPA", "s": 1, "op": [ "PA", "BA" ] } }, { "t": "A PI-PA É BO-NI-TA.", "img": "🪁✨" }, { "t": "A PI-PA SO-BE, SO-BE...", "img": "🪁☁️" }, { "t": "O PA-TO VÊ A PI-PA DO MA-CA-CO.", "img": "🦆🪁", "lac": { "p": "PATO", "l": 0, "op": [ "P", "B" ] } }, { "t": "— DÁ A PI-PA, MA-CA-CO!", "img": "🦆🐒" }, { "t": "O MA-CA-CO DÁ A PI-PA AO PA-TO.", "img": "🐒🪁🦆" }, { "t": "O-PA! A PI-PA CAI NO LA-GO.", "img": "🪁🏞️", "lac": { "p": "LAGO", "s": 1, "op": [ "GO", "CO" ] } }, { "t": "O BO-DE VÊ E PE-GA A PI-PA.", "img": "🐐🪁", "lac": { "p": "BODE", "s": 1, "op": [ "DE", "TE" ] } }, { "t": "VI-VA! A PI-PA VO-A DE NO-VO!", "img": "🪁🎉" } ], "perguntas": [ { "t": "Quem pegou a pipa primeiro?", "op": [ "🐒", "🦆", "🐐" ], "c": 0 }, { "t": "Onde a pipa caiu?", "op": [ "🏞️", "🌳", "🏠" ], "c": 0 }, { "t": "Quem ajudou a pipa a voar de novo?", "op": [ "🐐", "🐒", "🐄" ], "c": 0, "inf": true } ] },
  {
   "id": "h5",
   "mundo": 5,
   "titulo": "O Sapo na Sopa",
   "cena": {
    "fundo": "🏠",
    "cor": "#d6f6ff"
   },
   "intro": "Um sapo bem pulador entrou na casa da vovó. Vamos ler!",
   "frases": [
    {
     "t": "O SA-PO PU-LA NA CA-SA DA VO-VÓ.",
     "img": "🐸🏠",
     "lac": { "p": "CASA", "s": 1, "op": [ "SA", "ZA" ] } }, { "t": "A VO-VÓ NÃO VÊ O SA-PO.", "img": "👵🐸" }, { "t": "O SA-PO PU-LA NA ME-SA.", "img": "🐸🪑", "lac": { "p": "SAPO", "s": 1, "op": [ "PO", "BO" ] } }, { "t": "NA ME-SA, FI-CA A SO-PA.", "img": "🍲" }, { "t": "O-PA! O SA-PO CAI NA SO-PA!", "img": "🐸🍲💦", "lac": { "p": "SOPA", "s": 1, "op": [ "PA", "BA" ] } }, { "t": "A VO-VÓ VÊ O SA-PO: — QUE SA-PO MA-LU-CO!", "img": "👵😲🐸" }, { "t": "O SA-PO PU-LA DA SO-PA E SAI PE-LA JA-NE-LA.", "img": "🐸🪟" }, { "t": "A VO-VÓ FA-LA: — VAI, SA-PO, VAI!", "img": "👵👋🐸", "lac": { "p": "VAI", "l": 0, "op": [ "V", "F" ] } } ], "perguntas": [ { "t": "Onde o sapo caiu?", "op": [ "🍲", "🛁", "🏞️" ], "c": 0 }, { "t": "Quem não viu o sapo no começo?", "op": [ "👵", "🐱", "👦" ], "c": 0 }, { "t": "Como a vovó ficou quando viu o sapo na sopa?", "op": [ "😲", "😴", "😢" ], "c": 0, "inf": true } ] },
  {
   "id": "h6",
   "mundo": 6,
   "titulo": "O Dragão e a Flor",
   "cena": {
    "fundo": "⛰️",
    "cor": "#efe6ff"
   },
   "intro": "No alto do monte mora um dragão diferente. Vamos ler!",
   "frases": [
    {
     "t": "NO AL-TO DO MON-TE MO-RA UM DRA-GÃO.",
     "img": "⛰️🐉",
     "lac": { "p": "MONTE", "l": 2, "op": [ "N", "M" ] } }, { "t": "O DRA-GÃO SOL-TA FO-GO PE-LO NA-RIZ.", "img": "🐉🔥", "lac": { "p": "NARIZ", "l": 4, "op": [ "Z", "S" ] } }, { "t": "UM DI-A, O DRA-GÃO VÊ U-MA FLOR.", "img": "🐉🌸", "lac": { "p": "FLOR", "l": 1, "op": [ "L", "R" ] } }, { "t": "A FLOR É A-MA-RE-LA E TEM PER-FU-ME.", "img": "🌼" }, { "t": "O DRA-GÃO FA-LA: — QUE FLOR BO-NI-TA!", "img": "🐉😍🌼" }, { "t": "MAS O FO-GO PO-DE SE-CAR A FLOR.", "img": "🔥🥀" }, { "t": "EN-TÃO O DRA-GÃO TEM U-MA I-DEI-A.", "img": "🐉💡" }, { "t": "E-LE PE-GA Á-GUA NO BAL-DE.", "img": "🐉🪣💧", "lac": { "p": "BALDE", "s": 1, "op": [ "DE", "TE" ] } }, { "t": "O DRA-GÃO DÁ Á-GUA À FLOR.", "img": "🐉💧🌼" }, { "t": "A FLOR FI-CA LIN-DA E O DRA-GÃO FI-CA CON-TEN-TE.", "img": "🌼🐉😊" } ], "perguntas": [ { "t": "Onde mora o dragão?", "op": [ "⛰️", "🌊", "🏠" ], "c": 0 }, { "t": "O que o dragão deu para a flor?", "op": [ "💧", "🔥", "🍎" ], "c": 0 }, { "t": "Por que o dragão não soltou fogo na flor?", "op": [ "🥀", "🎂", "⚽" ], "c": 0, "inf": true, "explica": "Porque o fogo podia secar a flor." } ] },
  {
   "id": "h7",
   "mundo": 7,
   "titulo": "A Chave do Castelo",
   "cena": {
    "fundo": "🏰",
    "cor": "#fff0e6"
   },
   "intro": "No castelo, a rainha tem um problema. Vamos ler e descobrir!",
   "frases": [
    {
     "t": "NO CAS-TE-LO MO-RA A RA-I-NHA HE-LE-NA.",
     "img": "🏰👸",
     "lac": { "p": "RAINHA", "s": 2, "op": [ "NHA", "LHA" ] } }, { "t": "U-MA MA-NHÃ, A RA-I-NHA PER-DEU A CHA-VE.", "img": "👸❓🔑", "lac": { "p": "CHAVE", "s": 0, "op": [ "CHA", "JA" ] } }, { "t": "— QUEM PE-GOU MI-NHA CHA-VE?", "img": "👸😟" }, { "t": "O GA-TO O-LHOU NA JA-NE-LA.", "img": "🐱🪟" }, { "t": "O CA-CHOR-RO PRO-CU-ROU NO JAR-DIM.", "img": "🐶🌷", "lac": { "p": "CACHORRO", "s": 2, "op": [ "RO", "LO" ] } }, { "t": "A GA-LI-NHA A-CHOU A CHA-VE NO NI-NHO!", "img": "🐔🔑🪺", "lac": { "p": "NINHO", "s": 1, "op": [ "NHO", "LHO" ] } }, { "t": "A RA-I-NHA FI-COU MUI-TO FE-LIZ.", "img": "👸😄" }, { "t": "E-LA DEU U-MA FES-TA COM QUEI-JO E SU-CO.", "img": "🎉🧀🧃", "lac": { "p": "QUEIJO", "s": 1, "op": [ "JO", "XO" ] } }, { "t": "E A GA-LI-NHA GA-NHOU UM CHA-PÉU NO-VO!", "img": "🐔👒" } ], "perguntas": [ { "t": "O que a rainha perdeu?", "op": [ "🔑", "👑", "👒" ], "c": 0 }, { "t": "Quem achou a chave?", "op": [ "🐔", "🐱", "🐶" ], "c": 0 }, { "t": "Por que a galinha ganhou um chapéu?", "op": [ "🔑", "🌧️", "🎂" ], "c": 0, "inf": true, "explica": "Porque ela achou a chave da rainha." } ] },
  {
   "id": "h8a",
   "mundo": 8,
   "titulo": "O Robô que Queria Dançar",
   "cena": {
    "fundo": "🏭",
    "cor": "#fff6e0"
   },
   "intro": "Era uma vez um robô que tinha um sonho. Vamos ler!",
   "frases": [
    {
     "t": "NA FÁ-BRI-CA HA-VI-A UM RO-BÔ CHA-MA-DO TI-CO.",
     "img": "🏭🤖"
    },
    {
     "t": "TI-CO QUE-RI-A MUI-TO DAN-ÇAR.",
     "img": "🤖💃",
     "lac": { "p": "DANÇAR", "s": 1, "op": [ "ÇAR", "SSAR" ] } }, { "t": "MAS SEU PÉ FA-ZI-A UM BA-RU-LHÃO.", "img": "🤖🦶🔊" }, { "t": "A ME-NI-NA LU-Í-SA PAS-SOU Ó-LE-O NO PÉ DO RO-BÔ.", "img": "👧🛢️🤖", "lac": { "p": "LUÍSA", "s": 2, "op": [ "SA", "ÇA" ] } }, { "t": "A-GO-RA O PÉ NÃO FAZ BA-RU-LHO.", "img": "🤖🤫" }, { "t": "TI-CO DAN-ÇOU, PU-LOU E GI-ROU.", "img": "🤖🕺", "lac": { "p": "GIROU", "s": 0, "op": [ "GI", "JI" ] } }, { "t": "TO-DOS BA-TE-RAM PAL-MAS PA-RA O RO-BÔ.", "img": "👏🤖👏" }, { "t": "— O-BRI-GA-DO, LU-Í-SA! — DIS-SE TI-CO.", "img": "🤖❤️👧", "lac": { "p": "DISSE", "s": 1, "op": [ "SE", "CE" ] } } ], "perguntas": [ { "t": "O que o robô queria fazer?", "op": [ "💃", "😴", "🍽️" ], "c": 0 }, { "t": "Quem ajudou o robô?", "op": [ "👧", "👴", "🐶" ], "c": 0 }, { "t": "Por que o pé do robô fazia barulho?", "op": [ "🛢️", "🌧️", "🔥" ], "c": 0, "inf": true, "explica": "Faltava óleo no pé do robô." } ] },
  {
   "id": "h8b",
   "mundo": 8,
   "titulo": "A Tartaruga Apressada",
   "cena": {
    "fundo": "🌳",
    "cor": "#fff6e0"
   },
   "intro": "A tartaruga foi convidada para uma festa. Vamos ler!",
   "frases": [
    {
     "t": "A TAR-TA-RU-GA TE-CA QUE-RI-A CHE-GAR CE-DO NA FES-TA.",
     "img": "🐢🎉",
     "lac": { "p": "CEDO", "s": 0, "op": [ "CE", "SE" ] } }, { "t": "E-LA SA-IU DE CA-SA BEM CE-DI-NHO.", "img": "🐢🏠🌅" }, { "t": "NO CA-MI-NHO, E-LA VIU UM CO-E-LHO.", "img": "🐢🐰", "lac": { "p": "COELHO", "s": 2, "op": [ "LHO", "LIO" ] } }, { "t": "— VEM DE CAR-RO, TE-CA? — PER-GUN-TOU O CO-E-LHO.", "img": "🐰🚗" }, { "t": "— NÃO, VOU DE-VA-GAR E SEM PRES-SA.", "img": "🐢🙂", "lac": { "p": "PRESSA", "s": 1, "op": [ "SA", "ÇA" ] } }, { "t": "A TAR-TA-RU-GA AN-DOU, AN-DOU E AN-DOU.", "img": "🐢👣" }, { "t": "QUAN-DO CHE-GOU, A FES-TA JÁ TI-NHA A-CA-BA-DO...", "img": "🐢😮🎈" }, { "t": "MAS TO-DOS GUAR-DA-RAM UM PE-DA-ÇO DE BO-LO PA-RA E-LA!", "img": "🎂🐢😄", "lac": { "p": "PEDAÇO", "s": 2, "op": [ "ÇO", "SO" ] } } ], "perguntas": [ { "t": "Quem queria chegar cedo na festa?", "op": [ "🐢", "🐰", "🐱" ], "c": 0 }, { "t": "O que guardaram para a tartaruga?", "op": [ "🎂", "🍎", "🧃" ], "c": 0 }, { "t": "Como a tartaruga ficou no final?", "op": [ "😄", "😠", "😴" ], "c": 0, "inf": true } ] },
  {
   "id": "h8c",
   "mundo": 8,
   "titulo": "O Ninho no Telhado",
   "cena": {
    "fundo": "🏫",
    "cor": "#fff6e0"
   },
   "intro": "No telhado da escola aconteceu uma coisa especial. Vamos ler!",
   "frases": [
    {
     "t": "NO TE-LHA-DO DA ES-CO-LA HÁ UM NI-NHO.",
     "img": "🏫🪺",
     "lac": { "p": "TELHADO", "s": 1, "op": [ "LHA", "NHA" ] } }, { "t": "NO NI-NHO HÁ TRÊS O-VI-NHOS A-ZUIS.", "img": "🪺🥚🥚🥚" }, { "t": "A MA-MÃE PÁS-SA-RO CHO-CA OS O-VOS.", "img": "🐦🪺", "lac": { "p": "CHOCA", "s": 0, "op": [ "CHO", "JO" ] } }, { "t": "UM DI-A, UM O-VO RA-CHOU.", "img": "🥚⚡" }, { "t": "SA-IU UM FI-LHO-TE FE-I-NHO E SEM PE-NAS.", "img": "🐣" }, { "t": "AS CRI-AN-ÇAS O-LHA-RAM PE-LA JA-NE-LA.", "img": "👧👦🪟", "lac": { "p": "JANELA", "s": 0, "op": [ "JA", "GA" ] } }, { "t": "A MA-MÃE LE-VOU MI-NHO-CA PA-RA O FI-LHO-TE.", "img": "🐦🪱🐣" }, { "t": "LO-GO O FI-LHO-TE GA-NHOU PE-NAS E VO-OU!", "img": "🐤✨🕊️", "lac": { "p": "PENAS", "s": 0, "op": [ "PE", "BE" ] } } ], "perguntas": [ { "t": "Onde estava o ninho?", "op": [ "🏫", "🌳", "🚗" ], "c": 0 }, { "t": "O que a mamãe levou para o filhote?", "op": [ "🪱", "🍎", "🧀" ], "c": 0 }, { "t": "O que o filhote aprendeu a fazer no final?", "op": [ "🕊️", "🥚", "😴" ], "c": 0, "inf": true } ] },
  {
   "id": "h8d",
   "mundo": 8,
   "titulo": "Lili e a Biblioteca Encantada",
   "cena": {
    "fundo": "📚",
    "cor": "#fff6e0"
   },
   "intro": "Esta é a história da nossa amiga Lili. Vamos ler!",
   "frases": [
    {
     "t": "LI-LI É U-MA CO-RU-JI-NHA QUE A-DO-RA LER.",
     "img": "🦉📖"
    },
    {
     "t": "NA BI-BLI-O-TE-CA, OS LI-VROS FA-LAM!",
     "img": "📚🗣️",
     "lac": { "p": "LIVROS", "s": 1, "op": [ "VROS", "VOS" ] } }, { "t": "UM LI-VRO CON-TA HIS-TÓ-RI-A DE PI-RA-TA.", "img": "📖🏴" }, { "t": "OU-TRO LI-VRO CAN-TA U-MA CAN-ÇÃO.", "img": "📖🎵", "lac": { "p": "CANÇÃO", "s": 1, "op": [ "ÇÃO", "SÃO" ] } }, { "t": "O LI-VRO MAIS VE-LHO SE-GU-RA U-MA CHA-VE DOU-RA-DA.", "img": "📕🔑" }, { "t": "A CHA-VE A-BRE U-MA POR-TA MÁ-GI-CA.", "img": "🔑🚪✨", "lac": { "p": "MÁGICA", "s": 1, "op": [ "GI", "JI" ] } }, { "t": "A-TRÁS DA POR-TA HÁ MIL PA-LA-VRAS NO-VAS.", "img": "🚪🔤✨" }, { "t": "LI-LI LÊ TO-DAS E FI-CA SU-PER FE-LIZ!", "img": "🦉😄" }, { "t": "E VO-CÊ? QUAL PA-LA-VRA VAI LER HO-JE?", "img": "🦉❓📖", "lac": { "p": "PALAVRA", "s": 2, "op": [ "VRA", "VA" ] } } ], "perguntas": [ { "t": "Quem adora ler?", "op": [ "🦉", "🐱", "🐶" ], "c": 0 }, { "t": "O que a chave abre?", "op": [ "🚪", "📦", "🚗" ], "c": 0 }, { "t": "Como a Lili se sente quando lê?", "op": [ "😄", "😢", "😠" ], "c": 0, "inf": true } ] }
 ],
 "elogios": {
  "acerto": [
   "Isso!",
   "Muito bem!",
   "Mandou bem!",
   "Acertou!",
   "Boa!",
   "Show!",
   "Perfeito!",
   "Que legal!",
   "Certinho!",
   "É isso aí!",
   "Você conseguiu!",
   "Excelente!",
   "Uau, muito bom!",
   "Arrasou!",
   "Que orelha atenta!",
   "Você prestou atenção!",
   "Caprichou!",
   "Bem pensado!",
   "Olhou com cuidado, hein!",
   "Ótima escolha!"
  ],
  "sequencia3": [
   "Três seguidas! Você está esquentando!",
   "Três acertos! Que ritmo bom!",
   "Olha só, três de uma vez!",
   "Três em sequência, continue assim!",
   "Você está no embalo!",
   "Três seguidinhas, que atenção!",
   "Trio perfeito!",
   "Que foco! Três seguidas!",
   "Seu ouvido está afiado!",
   "Três! A Lili está batendo as asas!",
   "Lindo! Três certinhas!",
   "Seguiu firme: três acertos!",
   "Três estrelinhas brilhando!",
   "Que sequência bonita!",
   "Uma, duas, três! Demais!"
  ],
  "sequencia5": [
   "Cinco seguidas! Você está pegando fogo! 🔥",
   "Cinco acertos! Que treino caprichado!",
   "Cinco de cinco! Uau!",
   "Você está voando! Cinco seguidas!",
   "Cinco! A Lili até deu uma cambalhota!",
   "Que concentração! Cinco seguidas!",
   "Cinco acertos: seu esforço está aparecendo!",
   "Uma mão inteira de acertos!",
   "Cinco seguidas! Que ouvido de ouro!",
   "Você está mandando muito bem: cinco!",
   "Cinco! Você escuta com muita atenção!",
   "Que sequência incrível: cinco!",
   "Cinco acertos! Continue nesse ritmo!",
   "Cinco! Você está lendo cada vez melhor!",
   "Cinco seguidas, que orgulho!"
  ],
  "sequencia10": [
   "Dez seguidas! Isso é incrível!",
   "Dez acertos! Você é uma estrela da leitura!",
   "Dez! A Lili está dançando de alegria!",
   "Dez seguidas! Todo esse treino valeu a pena!",
   "Dez de uma vez! Que dedicação!",
   "Uau! Dez acertos seguidos!",
   "Dez! Você está virando um super leitor!",
   "Dez seguidas! Que atenção maravilhosa!",
   "As duas mãos cheias de acertos!",
   "Dez! Isso merece uma festa!",
   "Dez seguidas! Você não para de crescer!",
   "Dez! Cada som no lugar certo!",
   "Que sequência gigante: dez!",
   "Dez! Você trabalhou muito bem!",
   "Dez acertos! Pode comemorar!"
  ],
  "aposErro": [
   "Você tentou de novo e conseguiu! Isso é de quem não desiste!",
   "Errar faz parte. E você conseguiu!",
   "Viu só? Tentando de novo, deu certo!",
   "Você escutou de novo e acertou!",
   "Que persistência bonita!",
   "Você não desistiu, e olha só!",
   "Tentou, pensou e acertou!",
   "É assim que a gente aprende: tentando de novo!",
   "Você corrigiu sozinho o caminho!",
   "Muito bem! Você usou a dica direitinho!",
   "Que coragem de tentar outra vez!",
   "Acertou depois de pensar com calma!",
   "Isso! Prestou atenção na dica!",
   "Você aprendeu com o erro, que demais!",
   "Insistiu e conseguiu! Parabéns!"
  ],
  "somNovo": [
   "Primeira vez com esse som! Que conquista!",
   "Você aprendeu um som novo!",
   "Um som novo no seu tesouro!",
   "Olha só: som novo descoberto!",
   "Mais um som para a sua coleção!",
   "Você conheceu um amigo novo: um som!",
   "Esse som agora é seu!",
   "Que descoberta! Um som novinho!",
   "Seu ouvido aprendeu algo novo!",
   "Som novo desbloqueado!",
   "A Lili anotou: você já sabe esse som!",
   "Mais uma chave para abrir as palavras!",
   "Você está aprendendo os sons um por um!",
   "Agora você conhece mais um som!",
   "Que bom! Um som novo na mochila!"
  ],
  "fasePerfeita": [
   "Fase perfeita! Três estrelas!",
   "Nenhum erro! Que capricho!",
   "Fase completinha, sem errar!",
   "Três estrelas! Você caprichou muito!",
   "Perfeito do começo ao fim!",
   "Que fase linda! Tudo certo!",
   "Você mandou muito bem na fase toda!",
   "Fase perfeita! A Lili está orgulhosa!",
   "Brilhou do início ao fim!",
   "Todas certas! Que atenção!",
   "Fase de ouro!",
   "Três estrelas brilhantes para você!",
   "Você treinou e ficou craque nesta fase!",
   "Perfeito! Seu esforço deu resultado!",
   "Que demais! Fase sem nenhum erro!"
  ],
  "mundoConcluido": [
   "Você completou o mundo inteiro!",
   "Mundo conquistado! Parabéns!",
   "O Guardião ficou impressionado!",
   "Um mundo inteirinho! Que aventura!",
   "Você chegou ao fim deste mundo!",
   "Viva! Um mundo novo vai se abrir!",
   "Você é um verdadeiro explorador das letras!",
   "Mundo completo! Seu certificado está pronto!",
   "Que jornada! Mundo concluído!",
   "A Lili vai fazer uma festa para você!",
   "Mais um mundo no seu mapa!",
   "Você treinou muito e conseguiu!",
   "Mundo vencido com esforço e atenção!",
   "Que conquista enorme!",
   "Parabéns! O próximo mundo espera por você!"
  ]
 },
 "elogiosEspecificos": {
  "som": [
   [
    "Você ouviu o som",
    "{som}",
    "de",
    "{palavra}"
   ],
   [
    "Isso! Você encontrou o som",
    "{som}"
   ]
  ],
  "silaba": [
   [
    "Isso! É",
    "{silaba}",
    "de",
    "{palavra}"
   ],
   [
    "Você reconheceu a sílaba",
    "{silaba}"
   ]
  ],
  "leitura": [
   [
    "Você leu",
    "{palavra}",
    "juntando os sons!"
   ],
   [
    "Isso! Está escrito",
    "{palavra}"
   ]
  ],
  "escrita": [
   [
    "Você escreveu",
    "{palavra}",
    "letra por letra!"
   ]
  ],
  "juntar": [
   [
    "Você juntou as sílabas e formou",
    "{palavra}"
   ]
  ],
  "par": [
   [
    "Você ouviu a diferença: é",
    "{palavra}"
   ]
  ]
 },
 "falas": {
  "tocarParaComecar": "Toque para começar!",
  "boasVindas": "Oi! Eu sou a Lili, a corujinha. Vamos ler brincando?",
  "escolhaPerfil": "Toque na sua figura para começar.",
  "mapa": "Escolha uma fase no mapa. Toque na bolinha que está brilhando.",
  "euMostro": "Eu mostro!",
  "fazemosJuntos": "Agora vamos fazer juntos!",
  "agoraVoce": "Agora é você!",
  "nomeLetra": "O nome desta letra é",
  "masSom": "mas o som que ela faz é",
  "escuteSom": "Escute o som:",
  "exemplos": "Escute palavras com esse som:",
  "traceLetra": "Agora trace a letra com o dedo, seguindo as setas.",
  "toqueAqui": "É esta aqui. Toque nela.",
  "tenteNovo": "Quase! Vamos tentar de novo?",
  "escuteDevagar": "Escute de novo, bem devagar.",
  "jogoJuntoToque": "Vamos juntos: toque na que está brilhando.",
  "faseFim": "Fase concluída!",
  "faseLiberada": "Você liberou a próxima fase!",
  "treinarMais": "Vamos treinar mais um pouquinho esta fase? Você está quase lá!",
  "revisaoOferecida": "Que tal uma revisão rapidinha para ficar ainda melhor?",
  "pausa": "Você já brincou bastante! Que tal descansar os olhinhos e beber uma água?",
  "limiteDia": "Por hoje já está ótimo! Amanhã a gente brinca mais.",
  "bau": "Um presente para você! Volte outro dia para abrir outro baú.",
  "bauJaAberto": "O baú de hoje já foi aberto. Amanhã tem mais!",
  "novoNivel": "Você subiu de nível!",
  "medalha": "Você ganhou uma medalha!",
  "figurinha": "Figurinha nova no álbum!",
  "avaliacaoIntro": "Vamos brincar de descobrir o que você já sabe? Não tem certo nem errado, é só uma brincadeira.",
  "avaliacaoFim": "Pronto! Agora eu já sei por onde a gente começa.",
  "historiaLer": "Escute e acompanhe a leitura.",
  "historiaLacuna": "Escute a palavra. Qual pedacinho completa?",
  "historiaPergunta": "Agora me conta:",
  "historiaFim": "Fim da história! Que leitura bonita!",
  "euLeio": "Agora é a sua vez de ler. Toque no microfone.",
  "adultoConfirma": "Um adulto ouviu? Ele pode confirmar.",
  "microOuvi": "Ouvi você ler!",
  "microNaoEntendi": "Não consegui ouvir direitinho. Vamos tentar de novo?",
  "ouvirSuaVoz": "Escute a sua voz.",
  "modelo": "Escute como fica:",
  "pronto": "Pronto",
  "juntar": "Juntar",
  "nome": "nome",
  "som": "som",
  "sim": "sim",
  "naoSom": "não",
  "regraDescoberta": "Descoberta!",
  "exemplosRegra": "Veja estas palavras:",
  "contraRegra": "Agora veja estas, que são diferentes:",
  "freqIntro": "Estas são palavras mágicas. Elas aparecem muito nas histórias. Vamos aprender a reconhecer de uma vez!",
  "sobreSom": "O S aqui faz som de",
  "cobrinha": "cobrinha, sss",
  "abelha": "abelha, zzz",
  "nomeOuSom": "Isso foi o nome ou o som da letra?",
  "demo": "Olha como se joga!",
  "demoAgora": "Agora é com você!",
  "fale": "Fale",
  "sem": "sem o",
  "semSom": "sem o som",
  "troque": "Troque",
  "por": "por",
  "em": "em",
  "contePalmas": "Quantos pedacinhos tem",
  "comecaComo": "Qual começa igual a",
  "terminaComo": "Qual termina igual a",
  "rimaCom": "Qual rima com",
  "qualSom": "Qual figura começa com o som",
  "qualLetra": "Qual letra faz o som",
  "qualSilaba": "Toque na sílaba",
  "eaPalavra": "e a palavra",
  "boca": "A boca fica aberta ou fechada em",
  "escreva": "Escreva",
  "complete": "Complete",
  "qualPalavraOuviu": "Qual palavra você ouviu?",
  "bingoMarque": "Marque",
  "parabensBingo": "Bingo! Cartela completa!",
  "formaPalavra": "Que palavra se formou?",
  "leiaQual": "Leia e toque na figura certa.",
  "ouvirModelo": "Escute o modelo",
  "qualRimaCom": "Qual figura rima com",
  "escutePalavra": "Escute a palavra:",
  "comoFica": "Agora a frase inteira:",
  "silabaPorSilaba": "Vamos ler sílaba por sílaba.",
  "avaliacaoObrigado": "Obrigado!",
  "vamosVer": "Vamos ver o mapa!",
  "ouvirDeNovo": "Escute de novo.",
  "faltouPouco": "Faltou pouquinho!",
  "dicaVem": "Vou te dar uma dica.",
  "juntosVamos": "Vamos juntos!",
  "escrevaCopie": "Olhe o modelo e escreva igual.",
  "fatiasCertas": "Veja onde cortar.",
  "trancada": "Esta fase ainda está trancada. Termine a fase anterior primeiro.",
  "bingo": "Bingo!",
  "perguntaInferencia": "Pense bem:",
  "reduzindo": "Vou deixar mais fácil para você.",
  "bomTrabalho": "Bom trabalho!",
  "moedas": "Você ganhou moedas!"
 },
 "instrucoes": {
  "rima": "Escute a palavra. Toque na figura que rima com ela.",
  "palmas": "Escute a palavra. Toque no tambor uma vez para cada pedacinho. Depois toque em pronto.",
  "somInicialSilaba": "Escute a palavra. Qual figura começa com o mesmo pedacinho?",
  "somInicialSom": "Escute o som. Qual figura começa com esse som?",
  "somFinal": "Escute a palavra. Qual figura termina com o mesmo pedacinho?",
  "juntar": "Escute os pedacinhos e junte na cabeça. Qual figura é?",
  "tirar": "Vamos fazer mágica: tire um pedacinho da palavra. Qual figura sobrou?",
  "trocar": "Troque um pedacinho da palavra. Qual figura apareceu?",
  "memoria": "Vire as cartas e encontre os pares.",
  "memoriaRima": "Vire as cartas e encontre as figuras que rimam.",
  "cacaSomVogal": "Escute o som. Toque na letra que faz esse som.",
  "cacaSomSilaba": "Escute. Toque na sílaba que você ouviu.",
  "cacaSomLetra": "Escute o som. Qual letra faz esse som?",
  "abertoFechado": "Escute a palavra. A boca fica aberta ou mais fechada?",
  "tracado": "Passe o dedo seguindo as setas para escrever a letra.",
  "bingo": "Bingo! Escute e marque na sua cartela.",
  "nomeSom": "Escute. Isso foi o nome da letra ou o som da letra?",
  "leiaEncontre": "Leia a palavra. Se precisar, toque nos pedacinhos para ouvir. Qual é a figura?",
  "gemeos": "Escute com atenção. Qual destas palavras você ouviu?",
  "letraPerdida": "Escute a palavra. Qual letra está faltando?",
  "letraPerdidaRegra": "Escute a palavra. O que está faltando?",
  "somS": "Leia a palavra. O S faz som de cobrinha ou de abelha?",
  "escrita": "Escute a palavra. Qual é o jeito certo de escrever?",
  "fabrica": "Toque nas sílabas para ouvir. Junte e descubra a palavra.",
  "trem": "Coloque as sílabas nos vagões, na ordem certa, para formar a palavra.",
  "fatiador": "Corte a palavra em sílabas. Toque nos espaços entre as letras e depois em pronto.",
  "freq": "Escute a palavra mágica. Toque nela.",
  "ditado": "Escute a palavra e escreva com as letras.",
  "trocaLetra": "Troque a letra marcada pela letra nova. Que palavra virou?",
  "frase": "Leia a frase. Toque na figura que mostra a frase.",
  "microfone": "Leia em voz alta. Toque no microfone e fale.",
  "historia": "Vamos ler uma história juntos!",
  "guardiao": "O Guardião quer ver tudo o que você aprendeu. Vamos lá!",
  "licao": "Vamos conhecer um som novo!",
  "regra": "Vamos fazer uma descoberta!",
  "avaliacao": "Vamos brincar de descobrir o que você já sabe."
 },
 "dicasTipo": {
  "rima": "Escute o finalzinho. Palavras que rimam terminam igual.",
  "palmas": "Fale a palavra devagar e bata uma palma em cada pedacinho.",
  "somInicial": "Escute bem o comecinho da palavra.",
  "somFinal": "Escute bem o finalzinho da palavra.",
  "juntar": "Fale os pedacinhos bem juntinhos, mais rápido.",
  "tirar": "Fale a palavra sem aquele pedacinho, bem devagar.",
  "trocar": "Fale a palavra trocando o pedacinho.",
  "cacaSom": "Escute de novo, bem devagar, e olhe a boca da Lili.",
  "abertoFechado": "Repare se a boca abre muito ou pouco.",
  "nomeSom": "O nome é como a letra se chama. O som é o barulhinho que ela faz dentro da palavra.",
  "leiaEncontre": "Toque em cada sílaba para ouvir e depois junte os sons.",
  "gemeos": "As duas palavras são quase iguais. Escute só o primeiro som.",
  "letraPerdida": "Fale a palavra devagar e preste atenção no som que falta.",
  "somS": "Veja se o S está entre duas vogais.",
  "escrita": "Lembre da descoberta que a gente fez!",
  "fabrica": "Toque em cada sílaba e fale juntinho.",
  "trem": "Fale a palavra devagar: qual pedacinho vem primeiro?",
  "fatiador": "Bata palmas falando a palavra. Cada palma é um pedaço.",
  "freq": "Olhe a primeira letra e o tamanho da palavra.",
  "ditado": "Fale a palavra bem devagar e escute cada som.",
  "trocaLetra": "Troque só a letra marcada e leia de novo.",
  "frase": "Leia palavra por palavra. Toque nas sílabas se precisar.",
  "bingo": "Escute de novo e procure com calma.",
  "memoria": "Tente lembrar onde estava cada carta."
 },
 "niveis": [
  {
   "nome": "Semente",
   "xp": 0,
   "enfeite": "casca"
  },
  {
   "nome": "Broto",
   "xp": 150,
   "enfeite": "broto"
  },
  {
   "nome": "Florzinha",
   "xp": 400,
   "enfeite": "flor"
  },
  {
   "nome": "Explorador(a)",
   "xp": 800,
   "enfeite": "chapeuExplorador"
  },
  {
   "nome": "Aventureiro(a)",
   "xp": 1400,
   "enfeite": "mochila"
  },
  {
   "nome": "Detetive das Letras",
   "xp": 2200,
   "enfeite": "lupa"
  },
  {
   "nome": "Mestre das Sílabas",
   "xp": 3200,
   "enfeite": "capelo"
  },
  {
   "nome": "Super Leitor(a)",
   "xp": 4500,
   "enfeite": "capa"
  }
 ],
 "loja": [
  {
   "id": "laco",
   "nome": "Laço",
   "emoji": "🎀",
   "preco": 30,
   "tipo": "acessorio"
  },
  {
   "id": "oculos",
   "nome": "Óculos",
   "emoji": "👓",
   "preco": 40,
   "tipo": "acessorio"
  },
  {
   "id": "cachecol",
   "nome": "Cachecol",
   "emoji": "🧣",
   "preco": 50,
   "tipo": "acessorio"
  },
  {
   "id": "chapeu",
   "nome": "Chapéu",
   "emoji": "🎩",
   "preco": 60,
   "tipo": "acessorio"
  },
  {
   "id": "coroa",
   "nome": "Coroa",
   "emoji": "👑",
   "preco": 120,
   "tipo": "acessorio"
  },
  {
   "id": "corAzul",
   "nome": "Lili azul",
   "emoji": "💙",
   "preco": 50,
   "tipo": "cor",
   "valor": "#6fa8dc"
  },
  {
   "id": "corRosa",
   "nome": "Lili rosa",
   "emoji": "💗",
   "preco": 50,
   "tipo": "cor",
   "valor": "#f4a6c6"
  },
  {
   "id": "corVerde",
   "nome": "Lili verde",
   "emoji": "💚",
   "preco": 50,
   "tipo": "cor",
   "valor": "#93d38f"
  },
  {
   "id": "mapaPorDoSol",
   "nome": "Mapa pôr do sol",
   "emoji": "🌅",
   "preco": 40,
   "tipo": "mapa",
   "valor": "linear-gradient(160deg,#ffb88c,#ffd6a5)"
  },
  {
   "id": "mapaOceano",
   "nome": "Mapa oceano",
   "emoji": "🌊",
   "preco": 40,
   "tipo": "mapa",
   "valor": "linear-gradient(160deg,#4facfe,#a8edea)"
  },
  {
   "id": "mapaDoce",
   "nome": "Mapa doce",
   "emoji": "🍭",
   "preco": 40,
   "tipo": "mapa",
   "valor": "linear-gradient(160deg,#fbc2eb,#a6c1ee)"
  }
 ],
 "medalhas": [
  {
   "id": "ouvidoOuro",
   "nome": "Ouvido de Ouro",
   "emoji": "👂",
   "desc": "20 pares mínimos certos",
   "stat": "pares",
   "meta": 20
  },
  {
   "id": "contador",
   "nome": "Contador de Histórias",
   "emoji": "📚",
   "desc": "5 histórias lidas",
   "stat": "historias",
   "meta": 5
  },
  {
   "id": "persistente",
   "nome": "Não Desisto!",
   "emoji": "💪",
   "desc": "10 acertos depois de errar",
   "stat": "aposErro",
   "meta": 10
  },
  {
   "id": "escritor",
   "nome": "Escritor Mágico",
   "emoji": "✍️",
   "desc": "10 ditados certos",
   "stat": "ditados",
   "meta": 10
  },
  {
   "id": "leitor",
   "nome": "Olho de Leitor",
   "emoji": "👀",
   "desc": "20 palavras lidas sozinho",
   "stat": "leituras",
   "meta": 20
  },
  {
   "id": "estrelas",
   "nome": "Chuva de Estrelas",
   "emoji": "🌟",
   "desc": "10 fases com 3 estrelas",
   "stat": "tresEstrelas",
   "meta": 10
  },
  {
   "id": "colecionador",
   "nome": "Colecionador",
   "emoji": "📒",
   "desc": "30 figurinhas no álbum",
   "stat": "figurinhas",
   "meta": 30
  },
  {
   "id": "voz",
   "nome": "Voz de Leitor",
   "emoji": "🎤",
   "desc": "10 leituras em voz alta",
   "stat": "micro",
   "meta": 10
  },
  {
   "id": "tracos",
   "nome": "Mão Mágica",
   "emoji": "🪄",
   "desc": "10 letras traçadas",
   "stat": "tracos",
   "meta": 10
  },
  {
   "id": "mundo1",
   "nome": "Rei da Ilha",
   "emoji": "🏝️",
   "desc": "Concluir o Mundo 1",
   "stat": "mundos",
   "meta": 1
  },
  {
   "id": "mundo4",
   "nome": "Alpinista",
   "emoji": "🏔️",
   "desc": "Concluir 4 mundos",
   "stat": "mundos",
   "meta": 4
  },
  {
   "id": "superLeitor",
   "nome": "Super Leitor",
   "emoji": "🦸",
   "desc": "Concluir os 8 mundos",
   "stat": "mundos",
   "meta": 8
  }
 ],
 "avatares": [
  "🦊",
  "🐼",
  "🐯",
  "🐸",
  "🦄",
  "🐙",
  "🐵",
  "🐰",
  "🐻",
  "🐨",
  "🦁",
  "🐧"
 ],
 "creditos": [
  "Imagens: OpenMoji — o projeto de emojis de código aberto (https://openmoji.org), licença CC BY-SA 4.0. Emojis nativos do sistema são usados como alternativa.",
  "Fonte: Andika (SIL International), SIL Open Font License 1.1, via Google Fonts. Alternativa: fonte do sistema.",
  "Vozes do Banco de Áudio: vozes neurais Microsoft (pt-BR Francisca/Thalita/Antonio) geradas com a biblioteca livre edge-tts, ou Kokoro-82M (Apache-2.0) offline. Para uso comercial, gere com Azure Speech ou Kokoro.",
  "Imagens reserva: Twemoji (jdecked/twemoji), licença CC BY 4.0.",
  "Fontes: Baloo 2 e Andika, SIL Open Font License 1.1, via Google Fonts.",
  "Voz alternativa: Piper TTS (Rhasspy/Open Home Foundation, licença MIT) com o modelo pt_BR-faber-medium. Confira a licença do modelo baixado no arquivo .onnx.json/MODEL_CARD e registre aqui.",
  "Fonemas alternativos (opcional): gravações do Alfabeto Fonético Internacional no Wikimedia Commons — a atribuição de cada arquivo usado aparece no painel do Banco de Áudio (licenças variam por arquivo).",
  "Efeitos sonoros, música e confete: gerados pelo próprio jogo (Web Audio API e canvas), sem arquivos externos.",
  "Personagens, histórias e textos: originais, criados para este jogo."
 ],
 "changelog": [
  "1.2.0 — Sílabas nunca soletradas (grafia pronunciável + verificação automática no gerador), fala mais calma e sem cortes (margens de silêncio, Web Audio, respiro entre sons); telas de jogo sobre o cenário do mundo, opções centralizadas, nome embaixo das figuras (com proteção nas atividades de leitura), botão de ouvir no lugar de ícones soltos, imagens reserva Twemoji.",
  "1.1.0 — Cenários ilustrados, trilha sinuosa no mapa, botões 3D; vozes neurais (edge-tts/Kokoro), velocidade natural, frases inteiras e karaokê fluido.",
  "1.0.0 — Primeira versão: 8 mundos, 93 fases, 363 palavras, 11 histórias, 17 minijogos, Área dos Pais, autoteste V1–V12."
 ],
 "palavras": [
  { "p": "GATO", "s": [ "GA", "TO" ], "e": "🐱", "om": "1F431", "g": [ "G", "A", "T", "O" ], "padrao": [ "CV" ], "faseMin": 40, "mundo": 4, "rima": "ATO", "ini": "G", "rimas": [ "PATO", "RATO", "SAPATO", "PRATO", "JATO", "CHATO" ], "parMinimo": { "par": "T/D", "com": "GADO" } },
  { "p": "PATO", "s": [ "PA", "TO" ], "e": "🦆", "om": "1F986", "g": [ "P", "A", "T", "O" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "ATO", "ini": "P", "rimas": [ "GATO", "RATO", "SAPATO", "PRATO", "JATO", "CHATO" ], "parMinimo": null },
  { "p": "VACA", "s": [ "VA", "CA" ], "e": "🐄", "om": "1F404", "g": [ "V", "A", "C" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "ACA", "ini": "V", "rimas": [ "FACA", "BARRACA" ], "parMinimo": { "par": "F/V", "com": "FACA" } },
  { "p": "SAPO", "s": [ "SA", "PO" ], "e": "🐸", "om": "1F438", "g": [ "S", "A", "P", "O" ], "padrao": [ "CV" ], "faseMin": 35, "mundo": 4, "rima": "APO", "ini": "S", "rimas": [], "parMinimo": null },
  { "p": "MACACO", "s": [ "MA", "CA", "CO" ], "e": "🐒", "om": "1F412", "g": [ "M", "A", "C", "O" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "ACO", "ini": "M", "rimas": [], "parMinimo": null },
  { "p": "GALO", "s": [ "GA", "LO" ], "e": "🐓", "om": "1F413", "g": [ "G", "A", "L", "O" ], "padrao": [ "CV" ], "faseMin": 40, "mundo": 4, "rima": "ALO", "ini": "G", "rimas": [ "CAVALO", "CALO" ], "parMinimo": { "par": "C/G", "com": "CALO" } },
  { "p": "GALINHA", "s": [ "GA", "LI", "NHA" ], "e": "🐔", "om": "1F414", "g": [ "G", "A", "L", "I", "NH" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "INHA", "ini": "G", "rimas": [ "JOANINHA", "ROSQUINHA", "RAINHA" ], "parMinimo": null },
  { "p": "CAVALO", "s": [ "CA", "VA", "LO" ], "e": "🐴", "om": "1F434", "g": [ "C", "A", "V", "L", "O" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "ALO", "ini": "C", "rimas": [ "GALO", "CALO" ], "parMinimo": null },
  { "p": "CACHORRO", "s": [ "CA", "CHOR", "RO" ], "e": "🐶", "om": "1F436", "g": [ "C", "A", "RR", "CH", "O" ], "padrao": [ "dígrafo" ], "faseMin": 73, "mundo": 7, "rima": "ORRO", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "COELHO", "s": [ "CO", "E", "LHO" ], "e": "🐰", "om": "1F430", "g": [ "C", "O", "E", "LH" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "ELHO", "ini": "C", "rimas": [ "ESPELHO" ], "parMinimo": null },
  { "p": "LEÃO", "s": [ "LE", "ÃO" ], "e": "🦁", "om": "1F981", "g": [ "L", "E", "A", "Ã", "O", "ÃO" ], "padrao": [ "nasal" ], "faseMin": 64, "mundo": 6, "rima": "ÃO", "ini": "L", "rimas": [ "TUBARÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "PÃO", "FEIJÃO" ], "parMinimo": null },
  { "p": "PEIXE", "s": [ "PEI", "XE" ], "e": "🐟", "om": "1F41F", "g": [ "P", "E", "I", "X" ], "padrao": [ "CV" ], "faseMin": 35, "mundo": 4, "rima": "EIXE", "ini": "P", "rimas": [], "parMinimo": null },
  { "p": "ABELHA", "s": [ "A", "BE", "LHA" ], "e": "🐝", "om": "1F41D", "g": [ "A", "B", "E", "LH" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "ELHA", "ini": "A", "rimas": [ "OVELHA", "ORELHA" ], "parMinimo": null },
  { "p": "BORBOLETA", "s": [ "BOR", "BO", "LE", "TA" ], "e": "🦋", "om": "1F98B", "g": [ "B", "O", "CODA_R", "L", "E", "T", "A" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "ETA", "ini": "B", "rimas": [ "CANETA", "SETA", "BICICLETA", "PLANETA", "COMETA" ], "parMinimo": null },
  { "p": "COBRA", "s": [ "CO", "BRA" ], "e": "🐍", "om": "1F40D", "g": [ "C", "O", "CCV", "B", "R_FRACO", "A" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "OBRA", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "RATO", "s": [ "RA", "TO" ], "e": "🐭", "om": "1F42D", "g": [ "R_FORTE", "A", "T", "O" ], "padrao": [ "regra" ], "faseMin": 73, "mundo": 7, "rima": "ATO", "ini": "R_FORTE", "rimas": [ "GATO", "PATO", "SAPATO", "PRATO", "JATO", "CHATO" ], "parMinimo": null },
  { "p": "URSO", "s": [ "UR", "SO" ], "e": "🐻", "om": "1F43B", "g": [ "U", "CODA_R", "S", "O" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "URSO", "ini": "U", "rimas": [], "parMinimo": null },
  { "p": "PANDA", "s": [ "PAN", "DA" ], "e": "🐼", "om": "1F43C", "g": [ "P", "A", "NASAL", "D" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "ANDA", "ini": "P", "rimas": [], "parMinimo": null },
  { "p": "ZEBRA", "s": [ "ZE", "BRA" ], "e": "🦓", "om": "1F993", "g": [ "Z", "E", "CCV", "B", "R_FRACO", "A" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "EBRA", "ini": "Z", "rimas": [], "parMinimo": null },
  { "p": "GIRAFA", "s": [ "GI", "RA", "FA" ], "e": "🦒", "om": "1F992", "g": [ "G_SUAVE", "I", "R_FRACO", "A", "F" ], "padrao": [ "regra" ], "faseMin": 76, "mundo": 7, "rima": "AFA", "ini": "G_SUAVE", "rimas": [ "GARRAFA" ], "parMinimo": null },
  { "p": "ELEFANTE", "s": [ "E", "LE", "FAN", "TE" ], "e": "🐘", "om": "1F418", "g": [ "E", "L", "F", "A", "NASAL", "T" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "ANTE", "ini": "E", "rimas": [], "parMinimo": null },
  { "p": "TIGRE", "s": [ "TI", "GRE" ], "e": "🐯", "om": "1F42F", "g": [ "T", "I", "CCV", "G", "R_FRACO", "E" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "IGRE", "ini": "T", "rimas": [], "parMinimo": null },
  { "p": "LOBO", "s": [ "LO", "BO" ], "e": "🐺", "om": "1F43A", "g": [ "L", "O", "B" ], "padrao": [ "CV" ], "faseMin": 36, "mundo": 4, "rima": "OBO", "ini": "L", "rimas": [ "GLOBO" ], "parMinimo": null },
  { "p": "RAPOSA", "s": [ "RA", "PO", "SA" ], "e": "🦊", "om": "1F98A", "g": [ "R_FORTE", "A", "P", "O", "S_Z" ], "padrao": [ "regra" ], "faseMin": 73, "mundo": 7, "rima": "OSA", "ini": "R_FORTE", "rimas": [ "ROSA" ], "parMinimo": null },
  { "p": "CORUJA", "s": [ "CO", "RU", "JA" ], "e": "🦉", "om": "1F989", "g": [ "C", "O", "R_FRACO", "U", "J", "A" ], "padrao": [ "CV" ], "faseMin": 59, "mundo": 6, "rima": "UJA", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "POLVO", "s": [ "POL", "VO" ], "e": "🐙", "om": "1F419", "g": [ "P", "O", "CODA_L", "V" ], "padrao": [ "CVC" ], "faseMin": 62, "mundo": 6, "rima": "OLVO", "ini": "P", "rimas": [], "parMinimo": null },
  { "p": "LULA", "s": [ "LU", "LA" ], "e": "🦑", "om": "1F991", "g": [ "L", "U", "A" ], "padrao": [ "CV" ], "faseMin": 28, "mundo": 3, "rima": "ULA", "ini": "L", "rimas": [ "MULA" ], "parMinimo": null },
  { "p": "CARANGUEJO", "s": [ "CA", "RAN", "GUE", "JO" ], "e": "🦀", "om": "1F980", "g": [ "C", "A", "R_FRACO", "NASAL", "GU", "E", "J", "O" ], "padrao": [ "dígrafo", "nasal" ], "faseMin": 75, "mundo": 7, "rima": "EJO", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "BALEIA", "s": [ "BA", "LEI", "A" ], "e": "🐋", "om": "1F40B", "g": [ "B", "A", "L", "E", "I" ], "padrao": [ "CV" ], "faseMin": 36, "mundo": 4, "rima": "EIA", "ini": "B", "rimas": [ "MEIA", "SEREIA" ], "parMinimo": null },
  { "p": "GOLFINHO", "s": [ "GOL", "FI", "NHO" ], "e": "🐬", "om": "1F42C", "g": [ "G", "O", "CODA_L", "F", "I", "NH" ], "padrao": [ "dígrafo", "CVC" ], "faseMin": 72, "mundo": 7, "rima": "INHO", "ini": "G", "rimas": [ "PINTINHO", "NINHO" ], "parMinimo": null },
  { "p": "TUBARÃO", "s": [ "TU", "BA", "RÃO" ], "e": "🦈", "om": "1F988", "g": [ "T", "U", "B", "A", "R_FRACO", "Ã", "O", "ÃO" ], "padrao": [ "nasal" ], "faseMin": 64, "mundo": 6, "rima": "ÃO", "ini": "T", "rimas": [ "LEÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "PÃO", "FEIJÃO" ], "parMinimo": null },
  { "p": "TARTARUGA", "s": [ "TAR", "TA", "RU", "GA" ], "e": "🐢", "om": "1F422", "g": [ "T", "A", "CODA_R", "R_FRACO", "U", "G" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "UGA", "ini": "T", "rimas": [], "parMinimo": null },
  { "p": "JACARÉ", "s": [ "JA", "CA", "RÉ" ], "e": "🐊", "om": "1F40A", "g": [ "J", "A", "C", "R_FRACO", "E" ], "padrao": [ "CV" ], "faseMin": 59, "mundo": 6, "rima": "E", "ini": "J", "rimas": [ "CAFÉ", "BONÉ", "PÉ", "BEBÊ" ], "parMinimo": null },
  { "p": "CAMELO", "s": [ "CA", "ME", "LO" ], "e": "🐫", "om": "1F42B", "g": [ "C", "A", "M", "E", "L", "O" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "ELO", "ini": "C", "rimas": [ "COGUMELO", "GELO", "MARTELO", "NOVELO", "CASTELO", "CABELO" ], "parMinimo": null },
  { "p": "OVELHA", "s": [ "O", "VE", "LHA" ], "e": "🐑", "om": "1F411", "g": [ "O", "V", "E", "LH", "A" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "ELHA", "ini": "O", "rimas": [ "ABELHA", "ORELHA" ], "parMinimo": null },
  { "p": "PORCO", "s": [ "POR", "CO" ], "e": "🐷", "om": "1F437", "g": [ "P", "O", "CODA_R", "C" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "ORCO", "ini": "P", "rimas": [], "parMinimo": null },
  { "p": "BODE", "s": [ "BO", "DE" ], "e": "🐐", "om": "1F410", "g": [ "B", "O", "D", "E" ], "padrao": [ "CV" ], "faseMin": 38, "mundo": 4, "rima": "ODE", "ini": "B", "rimas": [], "parMinimo": null },
  { "p": "BOI", "s": [ "BOI" ], "e": "🐂", "om": "1F402", "g": [ "B", "O", "I" ], "padrao": [ "CV" ], "faseMin": 36, "mundo": 4, "rima": "OI", "ini": "B", "rimas": [], "parMinimo": null },
  { "p": "MULA", "s": [ "MU", "LA" ], "e": "🫏", "om": "1FACF", "g": [ "M", "U", "L", "A" ], "padrao": [ "CV" ], "faseMin": 28, "mundo": 3, "rima": "ULA", "ini": "M", "rimas": [ "LULA" ], "parMinimo": null },
  { "p": "PERU", "s": [ "PE", "RU" ], "e": "🦃", "om": "1F983", "g": [ "P", "E", "R_FRACO", "U" ], "padrao": [ "CV" ], "faseMin": 59, "mundo": 6, "rima": "U", "ini": "P", "rimas": [ "CANGURU", "BAÚ" ], "parMinimo": null },
  { "p": "POMBO", "s": [ "POM", "BO" ], "e": "🕊️", "om": "1F54A", "g": [ "P", "O", "NASAL", "B" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "OMBO", "ini": "P", "rimas": [], "parMinimo": null },
  { "p": "PAPAGAIO", "s": [ "PA", "PA", "GAI", "O" ], "e": "🦜", "om": "1F99C", "g": [ "P", "A", "G", "I", "O" ], "padrao": [ "CV" ], "faseMin": 40, "mundo": 4, "rima": "AIO", "ini": "P", "rimas": [ "RAIO" ], "parMinimo": null },
  { "p": "FORMIGA", "s": [ "FOR", "MI", "GA" ], "e": "🐜", "om": "1F41C", "g": [ "F", "O", "CODA_R", "M", "I", "G", "A" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "IGA", "ini": "F", "rimas": [], "parMinimo": null },
  { "p": "ARANHA", "s": [ "A", "RA", "NHA" ], "e": "🕷️", "om": "1F577", "g": [ "A", "R_FRACO", "NH" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "ANHA", "ini": "A", "rimas": [ "CASTANHA", "MONTANHA" ], "parMinimo": null },
  { "p": "MINHOCA", "s": [ "MI", "NHO", "CA" ], "e": "🪱", "om": "1FAB1", "g": [ "M", "I", "NH", "O", "C", "A" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "OCA", "ini": "M", "rimas": [ "FOCA", "PIPOCA", "OCA", "BOCA" ], "parMinimo": null },
  { "p": "CARACOL", "s": [ "CA", "RA", "COL" ], "e": "🐌", "om": "1F40C", "g": [ "C", "A", "R_FRACO", "O", "CODA_L" ], "padrao": [ "CVC" ], "faseMin": 62, "mundo": 6, "rima": "OL", "ini": "C", "rimas": [ "GOL", "SOL", "GIRASSOL" ], "parMinimo": null },
  { "p": "JOANINHA", "s": [ "JO", "A", "NI", "NHA" ], "e": "🐞", "om": "1F41E", "g": [ "J", "O", "A", "N", "I", "NH" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "INHA", "ini": "J", "rimas": [ "GALINHA", "ROSQUINHA", "RAINHA" ], "parMinimo": null },
  { "p": "GRILO", "s": [ "GRI", "LO" ], "e": "🦗", "om": "1F997", "g": [ "CCV", "G", "R_FRACO", "I", "L", "O" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "ILO", "ini": "G", "rimas": [ "ESQUILO" ], "parMinimo": null },
  { "p": "MOSCA", "s": [ "MOS", "CA" ], "e": "🪰", "om": "1FAB0", "g": [ "M", "O", "CODA_S", "C", "A" ], "padrao": [ "CVC" ], "faseMin": 60, "mundo": 6, "rima": "OSCA", "ini": "M", "rimas": [], "parMinimo": null },
  { "p": "MORCEGO", "s": [ "MOR", "CE", "GO" ], "e": "🦇", "om": "1F987", "g": [ "M", "O", "CODA_R", "C_SUAVE", "E", "G" ], "padrao": [ "CVC", "regra" ], "faseMin": 74, "mundo": 7, "rima": "EGO", "ini": "M", "rimas": [], "parMinimo": null },
  { "p": "ESQUILO", "s": [ "ES", "QUI", "LO" ], "e": "🐿️", "om": "1F43F", "g": [ "E", "CODA_S", "QU", "I", "L", "O" ], "padrao": [ "dígrafo", "CVC" ], "faseMin": 75, "mundo": 7, "rima": "ILO", "ini": null, "rimas": [ "GRILO" ], "parMinimo": null },
  { "p": "CANGURU", "s": [ "CAN", "GU", "RU" ], "e": "🦘", "om": "1F998", "g": [ "C", "A", "NASAL", "G", "U", "R_FRACO" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "U", "ini": "C", "rimas": [ "PERU", "BAÚ" ], "parMinimo": null },
  { "p": "GORILA", "s": [ "GO", "RI", "LA" ], "e": "🦍", "om": "1F98D", "g": [ "G", "O", "R_FRACO", "I", "L", "A" ], "padrao": [ "CV" ], "faseMin": 59, "mundo": 6, "rima": "ILA", "ini": "G", "rimas": [ "MOCHILA", "VILA", "FILA" ], "parMinimo": null },
  { "p": "CISNE", "s": [ "CIS", "NE" ], "e": "🦢", "om": "1F9A2", "g": [ "C_SUAVE", "I", "CODA_S", "N", "E" ], "padrao": [ "CVC", "regra" ], "faseMin": 74, "mundo": 7, "rima": "ISNE", "ini": "C_SUAVE", "rimas": [], "parMinimo": null },
  { "p": "PAVÃO", "s": [ "PA", "VÃO" ], "e": "🦚", "om": "1F99A", "g": [ "P", "A", "V", "Ã", "O", "ÃO" ], "padrao": [ "nasal" ], "faseMin": 64, "mundo": 6, "rima": "ÃO", "ini": "P", "rimas": [ "LEÃO", "TUBARÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "PÃO", "FEIJÃO" ], "parMinimo": null },
  { "p": "FOCA", "s": [ "FO", "CA" ], "e": "🦭", "om": "1F9AD", "g": [ "F", "O", "C", "A" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "OCA", "ini": "F", "rimas": [ "MINHOCA", "PIPOCA", "OCA", "BOCA" ], "parMinimo": null },
  { "p": "LAGARTO", "s": [ "LA", "GAR", "TO" ], "e": "🦎", "om": "1F98E", "g": [ "L", "A", "G", "CODA_R", "T", "O" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "ARTO", "ini": "L", "rimas": [], "parMinimo": null },
  { "p": "DINOSSAURO", "s": [ "DI", "NOS", "SAU", "RO" ], "e": "🦕", "om": "1F995", "g": [ "D", "I", "SS", "N", "O", "A", "U", "R_FRACO" ], "padrao": [ "dígrafo" ], "faseMin": 74, "mundo": 7, "rima": "AURO", "ini": "D", "rimas": [], "parMinimo": null },
  { "p": "PINTINHO", "s": [ "PIN", "TI", "NHO" ], "e": "🐤", "om": "1F424", "g": [ "P", "I", "NASAL", "T", "NH", "O" ], "padrao": [ "dígrafo", "nasal" ], "faseMin": 72, "mundo": 7, "rima": "INHO", "ini": "P", "rimas": [ "GOLFINHO", "NINHO" ], "parMinimo": null },
  { "p": "AVE", "s": [ "A", "VE" ], "e": "🐦", "om": "1F426", "g": [ "A", "V", "E" ], "padrao": [ "CV" ], "faseMin": 24, "mundo": 3, "rima": "AVE", "ini": "A", "rimas": [ "CHAVE" ], "parMinimo": null },
  { "p": "GANSO", "s": [ "GAN", "SO" ], "e": "🪿", "om": "1FABF", "g": [ "G", "A", "NASAL", "S", "O" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "ANSO", "ini": "G", "rimas": [], "parMinimo": null },
  { "p": "VEADO", "s": [ "VE", "A", "DO" ], "e": "🦌", "om": "1F98C", "g": [ "V", "E", "A", "D", "O" ], "padrao": [ "CV" ], "faseMin": 38, "mundo": 4, "rima": "ADO", "ini": "V", "rimas": [ "GADO", "DADO", "CADEADO", "TECLADO", "MACHADO" ], "parMinimo": null },
  { "p": "HIPOPÓTAMO", "s": [ "HI", "PO", "PÓ", "TA", "MO" ], "e": "🦛", "om": "1F99B", "g": [ "H", "I", "P", "O", "T", "A", "M" ], "padrao": [ "regra" ], "faseMin": 77, "mundo": 7, "rima": "OTAMO", "ini": "H", "rimas": [], "parMinimo": null },
  { "p": "RINOCERONTE", "s": [ "RI", "NO", "CE", "RON", "TE" ], "e": "🦏", "om": "1F98F", "g": [ "R_FORTE", "I", "N", "O", "C_SUAVE", "E", "R_FRACO", "NASAL", "T" ], "padrao": [ "nasal", "regra" ], "faseMin": 74, "mundo": 7, "rima": "ONTE", "ini": "R_FORTE", "rimas": [ "PONTE" ], "parMinimo": null },
  { "p": "MOSQUITO", "s": [ "MOS", "QUI", "TO" ], "e": "🦟", "om": "1F99F", "g": [ "M", "O", "CODA_S", "QU", "I", "T" ], "padrao": [ "dígrafo", "CVC" ], "faseMin": 75, "mundo": 7, "rima": "ITO", "ini": "M", "rimas": [ "PIRULITO" ], "parMinimo": null },
  { "p": "ESCORPIÃO", "s": [ "ES", "COR", "PI", "ÃO" ], "e": "🦂", "om": "1F982", "g": [ "E", "CODA_S", "C", "O", "CODA_R", "P", "I", "A", "Ã", "ÃO" ], "padrao": [ "CVC", "nasal" ], "faseMin": 64, "mundo": 6, "rima": "ÃO", "ini": null, "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "PÃO", "FEIJÃO" ], "parMinimo": null },
  { "p": "FLAMINGO", "s": [ "FLA", "MIN", "GO" ], "e": "🦩", "om": "1F9A9", "g": [ "CCV", "F", "L", "A", "M", "I", "NASAL", "G", "O" ], "padrao": [ "CCV", "nasal" ], "faseMin": 65, "mundo": 6, "rima": "INGO", "ini": "F", "rimas": [], "parMinimo": null },
  { "p": "LONTRA", "s": [ "LON", "TRA" ], "e": "🦦", "om": "1F9A6", "g": [ "L", "O", "NASAL", "CCV", "T", "R_FRACO", "A" ], "padrao": [ "CCV", "nasal" ], "faseMin": 65, "mundo": 6, "rima": "ONTRA", "ini": "L", "rimas": [], "parMinimo": null },
  { "p": "PREGUIÇA", "s": [ "PRE", "GUI", "ÇA" ], "e": "🦥", "om": "1F9A5", "g": [ "CCV", "P", "R_FRACO", "E", "GU", "I", "Ç", "A" ], "padrao": [ "dígrafo", "CCV", "regra" ], "faseMin": 75, "mundo": 7, "rima": "IÇA", "ini": "P", "rimas": [], "parMinimo": null },
  { "p": "MAMUTE", "s": [ "MA", "MU", "TE" ], "e": "🦣", "om": "1F9A3", "g": [ "M", "A", "U", "T", "E" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "UTE", "ini": "M", "rimas": [], "parMinimo": null },
  { "p": "OSTRA", "s": [ "OS", "TRA" ], "e": "🦪", "om": "1F9AA", "g": [ "O", "CODA_S", "CCV", "T", "R_FRACO", "A" ], "padrao": [ "CCV", "CVC" ], "faseMin": 65, "mundo": 6, "rima": "OSTRA", "ini": "O", "rimas": [], "parMinimo": null },
  { "p": "CAMARÃO", "s": [ "CA", "MA", "RÃO" ], "e": "🦐", "om": "1F990", "g": [ "C", "A", "M", "R_FRACO", "Ã", "O", "ÃO" ], "padrao": [ "nasal" ], "faseMin": 64, "mundo": 6, "rima": "ÃO", "ini": "C", "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "ESCORPIÃO", "DRAGÃO", "LIMÃO", "PÃO", "FEIJÃO" ], "parMinimo": null },
  { "p": "MEDUSA", "s": [ "ME", "DU", "SA" ], "e": "🪼", "om": "1FABC", "g": [ "M", "E", "D", "U", "S_Z", "A" ], "padrao": [ "regra" ], "faseMin": 47, "mundo": 5, "rima": "USA", "ini": "M", "rimas": [], "parMinimo": null },
  { "p": "BESOURO", "s": [ "BE", "SOU", "RO" ], "e": "🪲", "om": "1FAB2", "g": [ "B", "E", "S_Z", "O", "U", "R_FRACO" ], "padrao": [ "regra" ], "faseMin": 59, "mundo": 6, "rima": "OURO", "ini": "B", "rimas": [], "parMinimo": null },
  { "p": "BARATA", "s": [ "BA", "RA", "TA" ], "e": "🪳", "om": "1FAB3", "g": [ "B", "A", "R_FRACO", "T" ], "padrao": [ "CV" ], "faseMin": 59, "mundo": 6, "rima": "ATA", "ini": "B", "rimas": [ "BATATA", "PATA" ], "parMinimo": null },
  { "p": "CASTOR", "s": [ "CAS", "TOR" ], "e": "🦫", "om": "1F9AB", "g": [ "C", "A", "CODA_S", "T", "O", "CODA_R" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "OR", "ini": "C", "rimas": [ "TAMBOR", "COMPUTADOR", "TRATOR", "FLOR" ], "parMinimo": null },
  { "p": "GUAXINIM", "s": [ "GUA", "XI", "NIM" ], "e": "🦝", "om": "1F99D", "g": [ "G", "U", "A", "X", "I", "N", "NASAL" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "IM", "ini": "G", "rimas": [ "AMENDOIM", "PUDIM" ], "parMinimo": null },
  { "p": "COALA", "s": [ "CO", "A", "LA" ], "e": "🐨", "om": "1F428", "g": [ "C", "O", "A", "L" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "ALA", "ini": "C", "rimas": [ "BALA", "MALA" ], "parMinimo": null },
  { "p": "ONÇA", "s": [ "ON", "ÇA" ], "e": "🐆", "om": "1F406", "g": [ "O", "NASAL", "Ç", "A" ], "padrao": [ "nasal", "regra" ], "faseMin": 74, "mundo": 7, "rima": "ONÇA", "ini": null, "rimas": [], "parMinimo": null },
  { "p": "DRAGÃO", "s": [ "DRA", "GÃO" ], "e": "🐉", "om": "1F409", "g": [ "CCV", "D", "R_FRACO", "A", "G", "Ã", "O", "ÃO" ], "padrao": [ "CCV", "nasal" ], "faseMin": 65, "mundo": 6, "rima": "ÃO", "ini": "D", "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "LIMÃO", "PÃO", "FEIJÃO" ], "parMinimo": null },
  { "p": "UNICÓRNIO", "s": [ "U", "NI", "CÓR", "NIO" ], "e": "🦄", "om": "1F984", "g": [ "U", "N", "I", "C", "O", "CODA_R" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "ORNIO", "ini": "U", "rimas": [], "parMinimo": null },
  { "p": "JAVALI", "s": [ "JA", "VA", "LI" ], "e": "🐗", "om": "1F417", "g": [ "J", "A", "V", "L", "I" ], "padrao": [ "CV" ], "faseMin": 30, "mundo": 3, "rima": "I", "ini": "J", "rimas": [ "ABACAXI", "ZUMBI" ], "parMinimo": null },
  { "p": "GADO", "s": [ "GA", "DO" ], "e": "🐃", "om": "1F403", "g": [ "G", "A", "D", "O" ], "padrao": [ "CV" ], "faseMin": 40, "mundo": 4, "rima": "ADO", "ini": "G", "rimas": [ "VEADO", "DADO", "CADEADO", "TECLADO", "MACHADO" ], "parMinimo": { "par": "T/D", "com": "GATO" } },
  { "p": "BOLO", "s": [ "BO", "LO" ], "e": "🎂", "om": "1F382", "g": [ "B", "O", "L" ], "padrao": [ "CV" ], "faseMin": 36, "mundo": 4, "rima": "OLO", "ini": "B", "rimas": [ "TIJOLO" ], "parMinimo": null },
  { "p": "BOLA", "s": [ "BO", "LA" ], "e": "⚽", "om": "26BD", "g": [ "B", "O", "L", "A" ], "padrao": [ "CV" ], "faseMin": 36, "mundo": 4, "rima": "OLA", "ini": "B", "rimas": [ "CEBOLA", "COLA", "GOLA", "ESCOLA" ], "parMinimo": null },
  { "p": "UVA", "s": [ "U", "VA" ], "e": "🍇", "om": "1F347", "g": [ "U", "V", "A" ], "padrao": [ "CV" ], "faseMin": 24, "mundo": 3, "rima": "UVA", "ini": "U", "rimas": [ "LUVA", "CHUVA" ], "parMinimo": null },
  { "p": "MAÇÃ", "s": [ "MA", "ÇÃ" ], "e": "🍎", "om": "1F34E", "g": [ "M", "A", "Ç", "Ã" ], "padrao": [ "nasal", "regra" ], "faseMin": 74, "mundo": 7, "rima": "Ã", "ini": "M", "rimas": [], "parMinimo": null },
  { "p": "BANANA", "s": [ "BA", "NA", "NA" ], "e": "🍌", "om": "1F34C", "g": [ "B", "A", "N" ], "padrao": [ "CV" ], "faseMin": 36, "mundo": 4, "rima": "ANA", "ini": "B", "rimas": [], "parMinimo": null },
  { "p": "PERA", "s": [ "PE", "RA" ], "e": "🍐", "om": "1F350", "g": [ "P", "E", "R_FRACO", "A" ], "padrao": [ "CV" ], "faseMin": 59, "mundo": 6, "rima": "ERA", "ini": "P", "rimas": [], "parMinimo": null },
  { "p": "LIMÃO", "s": [ "LI", "MÃO" ], "e": "🍋", "om": "1F34B", "g": [ "L", "I", "M", "A", "Ã", "O", "ÃO" ], "padrao": [ "nasal" ], "faseMin": 64, "mundo": 6, "rima": "ÃO", "ini": "L", "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "PÃO", "FEIJÃO" ], "parMinimo": null },
  { "p": "LARANJA", "s": [ "LA", "RAN", "JA" ], "e": "🍊", "om": "1F34A", "g": [ "L", "A", "R_FRACO", "NASAL", "J" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "ANJA", "ini": "L", "rimas": [], "parMinimo": null },
  { "p": "MELANCIA", "s": [ "ME", "LAN", "CI", "A" ], "e": "🍉", "om": "1F349", "g": [ "M", "E", "L", "A", "NASAL", "C_SUAVE", "I" ], "padrao": [ "nasal", "regra" ], "faseMin": 74, "mundo": 7, "rima": "IA", "ini": "M", "rimas": [ "DIA", "TIA" ], "parMinimo": null },
  { "p": "MORANGO", "s": [ "MO", "RAN", "GO" ], "e": "🍓", "om": "1F353", "g": [ "M", "O", "R_FRACO", "A", "NASAL", "G" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "ANGO", "ini": "M", "rimas": [], "parMinimo": null },
  { "p": "ABACAXI", "s": [ "A", "BA", "CA", "XI" ], "e": "🍍", "om": "1F34D", "g": [ "A", "B", "C", "X", "I" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "I", "ini": "A", "rimas": [ "JAVALI", "ZUMBI" ], "parMinimo": null },
  { "p": "COCO", "s": [ "CO", "CO" ], "e": "🥥", "om": "1F965", "g": [ "C", "O" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "OCO", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "CEREJA", "s": [ "CE", "RE", "JA" ], "e": "🍒", "om": "1F352", "g": [ "C_SUAVE", "E", "R_FRACO", "J", "A" ], "padrao": [ "regra" ], "faseMin": 74, "mundo": 7, "rima": "EJA", "ini": "C_SUAVE", "rimas": [ "IGREJA" ], "parMinimo": null },
  { "p": "PÊSSEGO", "s": [ "PÊS", "SE", "GO" ], "e": "🍑", "om": "1F351", "g": [ "SS", "P", "E", "G", "O" ], "padrao": [ "dígrafo" ], "faseMin": 74, "mundo": 7, "rima": "ESSEGO", "ini": "P", "rimas": [], "parMinimo": null },
  { "p": "MANGA", "s": [ "MAN", "GA" ], "e": "🥭", "om": "1F96D", "g": [ "M", "A", "NASAL", "G" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "ANGA", "ini": "M", "rimas": [], "parMinimo": null },
  { "p": "ABACATE", "s": [ "A", "BA", "CA", "TE" ], "e": "🥑", "om": "1F951", "g": [ "A", "B", "C", "T", "E" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "ATE", "ini": "A", "rimas": [ "TOMATE", "CHOCOLATE" ], "parMinimo": null },
  { "p": "TOMATE", "s": [ "TO", "MA", "TE" ], "e": "🍅", "om": "1F345", "g": [ "T", "O", "M", "A", "E" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "ATE", "ini": "T", "rimas": [ "ABACATE", "CHOCOLATE" ], "parMinimo": null },
  { "p": "BATATA", "s": [ "BA", "TA", "TA" ], "e": "🥔", "om": "1F954", "g": [ "B", "A", "T" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "ATA", "ini": "B", "rimas": [ "BARATA", "PATA" ], "parMinimo": null },
  { "p": "CENOURA", "s": [ "CE", "NOU", "RA" ], "e": "🥕", "om": "1F955", "g": [ "C_SUAVE", "E", "N", "O", "U", "R_FRACO", "A" ], "padrao": [ "regra" ], "faseMin": 74, "mundo": 7, "rima": "OURA", "ini": "C_SUAVE", "rimas": [ "TESOURA", "VASSOURA" ], "parMinimo": null },
  { "p": "MILHO", "s": [ "MI", "LHO" ], "e": "🌽", "om": "1F33D", "g": [ "M", "I", "LH", "O" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "ILHO", "ini": "M", "rimas": [], "parMinimo": null },
  { "p": "PIMENTA", "s": [ "PI", "MEN", "TA" ], "e": "🌶️", "om": "1F336", "g": [ "P", "I", "M", "E", "NASAL", "T", "A" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "ENTA", "ini": "P", "rimas": [], "parMinimo": null },
  { "p": "PEPINO", "s": [ "PE", "PI", "NO" ], "e": "🥒", "om": "1F952", "g": [ "P", "E", "I", "N", "O" ], "padrao": [ "CV" ], "faseMin": 35, "mundo": 4, "rima": "INO", "ini": "P", "rimas": [ "SINO", "MENINO" ], "parMinimo": null },
  { "p": "ALHO", "s": [ "A", "LHO" ], "e": "🧄", "om": "1F9C4", "g": [ "A", "LH", "O" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "ALHO", "ini": "A", "rimas": [], "parMinimo": null },
  { "p": "CEBOLA", "s": [ "CE", "BO", "LA" ], "e": "🧅", "om": "1F9C5", "g": [ "C_SUAVE", "E", "B", "O", "L", "A" ], "padrao": [ "regra" ], "faseMin": 74, "mundo": 7, "rima": "OLA", "ini": "C_SUAVE", "rimas": [ "BOLA", "COLA", "GOLA", "ESCOLA" ], "parMinimo": null },
  { "p": "BRÓCOLIS", "s": [ "BRÓ", "CO", "LIS" ], "e": "🥦", "om": "1F966", "g": [ "CCV", "B", "R_FRACO", "O", "C", "L", "I", "CODA_S" ], "padrao": [ "CCV", "CVC" ], "faseMin": 65, "mundo": 6, "rima": "OCOLIS", "ini": "B", "rimas": [], "parMinimo": null },
  { "p": "COGUMELO", "s": [ "CO", "GU", "ME", "LO" ], "e": "🍄", "om": "1F344", "g": [ "C", "O", "G", "U", "M", "E", "L" ], "padrao": [ "CV" ], "faseMin": 40, "mundo": 4, "rima": "ELO", "ini": "C", "rimas": [ "CAMELO", "GELO", "MARTELO", "NOVELO", "CASTELO", "CABELO" ], "parMinimo": null },
  { "p": "PÃO", "s": [ "PÃO" ], "e": "🍞", "om": "1F35E", "g": [ "P", "A", "Ã", "O", "ÃO" ], "padrao": [ "nasal" ], "faseMin": 64, "mundo": 6, "rima": "ÃO", "ini": "P", "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "FEIJÃO" ], "parMinimo": null },
  { "p": "QUEIJO", "s": [ "QUEI", "JO" ], "e": "🧀", "om": "1F9C0", "g": [ "QU", "E", "I", "J", "O" ], "padrao": [ "dígrafo" ], "faseMin": 75, "mundo": 7, "rima": "EIJO", "ini": "QU", "rimas": [], "parMinimo": { "par": "X/J", "com": "QUEIXO" } },
  { "p": "OVO", "s": [ "O", "VO" ], "e": "🥚", "om": "1F95A", "g": [ "O", "V" ], "padrao": [ "CV" ], "faseMin": 24, "mundo": 3, "rima": "OVO", "ini": "O", "rimas": [], "parMinimo": null },
  { "p": "LEITE", "s": [ "LEI", "TE" ], "e": "🥛", "om": "1F95B", "g": [ "L", "E", "I", "T" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "EITE", "ini": "L", "rimas": [], "parMinimo": null },
  { "p": "MEL", "s": [ "MEL" ], "e": "🍯", "om": "1F36F", "g": [ "M", "E", "CODA_L" ], "padrao": [ "CVC" ], "faseMin": 62, "mundo": 6, "rima": "EL", "ini": "M", "rimas": [ "ANEL", "PAPEL" ], "parMinimo": null },
  { "p": "PIPOCA", "s": [ "PI", "PO", "CA" ], "e": "🍿", "om": "1F37F", "g": [ "P", "I", "O", "C", "A" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "OCA", "ini": "P", "rimas": [ "MINHOCA", "FOCA", "OCA", "BOCA" ], "parMinimo": null },
  { "p": "SUCO", "s": [ "SU", "CO" ], "e": "🧃", "om": "1F9C3", "g": [ "S", "U", "C", "O" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "UCO", "ini": "S", "rimas": [], "parMinimo": null },
  { "p": "CAFÉ", "s": [ "CA", "FÉ" ], "e": "☕", "om": "2615", "g": [ "C", "A", "F", "E" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "E", "ini": "C", "rimas": [ "JACARÉ", "BONÉ", "PÉ", "BEBÊ" ], "parMinimo": null },
  { "p": "CHÁ", "s": [ "CHÁ" ], "e": "🍵", "om": "1F375", "g": [ "CH", "A" ], "padrao": [ "dígrafo" ], "faseMin": 71, "mundo": 7, "rima": "A", "ini": "CH", "rimas": [ "SOFÁ" ], "parMinimo": null },
  { "p": "SOPA", "s": [ "SO", "PA" ], "e": "🍲", "om": "1F372", "g": [ "S", "O", "P", "A" ], "padrao": [ "CV" ], "faseMin": 35, "mundo": 4, "rima": "OPA", "ini": "S", "rimas": [], "parMinimo": null },
  { "p": "SALADA", "s": [ "SA", "LA", "DA" ], "e": "🥗", "om": "1F957", "g": [ "S", "A", "L", "D" ], "padrao": [ "CV" ], "faseMin": 38, "mundo": 4, "rima": "ADA", "ini": "S", "rimas": [ "ESCADA", "TOMADA", "ESPADA", "FADA" ], "parMinimo": null },
  { "p": "BISCOITO", "s": [ "BIS", "COI", "TO" ], "e": "🍪", "om": "1F36A", "g": [ "B", "I", "CODA_S", "C", "O", "T" ], "padrao": [ "CVC" ], "faseMin": 60, "mundo": 6, "rima": "OITO", "ini": "B", "rimas": [], "parMinimo": null },
  { "p": "BALA", "s": [ "BA", "LA" ], "e": "🍬", "om": "1F36C", "g": [ "B", "A", "L" ], "padrao": [ "CV" ], "faseMin": 36, "mundo": 4, "rima": "ALA", "ini": "B", "rimas": [ "COALA", "MALA" ], "parMinimo": null },
  { "p": "PIRULITO", "s": [ "PI", "RU", "LI", "TO" ], "e": "🍭", "om": "1F36D", "g": [ "P", "I", "R_FRACO", "U", "L", "T", "O" ], "padrao": [ "CV" ], "faseMin": 59, "mundo": 6, "rima": "ITO", "ini": "P", "rimas": [ "MOSQUITO" ], "parMinimo": null },
  { "p": "SORVETE", "s": [ "SOR", "VE", "TE" ], "e": "🍦", "om": "1F366", "g": [ "S", "O", "CODA_R", "V", "E", "T" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "ETE", "ini": "S", "rimas": [ "SABONETE", "TROMPETE", "FOGUETE", "PATINETE" ], "parMinimo": null },
  { "p": "CHOCOLATE", "s": [ "CHO", "CO", "LA", "TE" ], "e": "🍫", "om": "1F36B", "g": [ "CH", "O", "C", "L", "A", "T", "E" ], "padrao": [ "dígrafo" ], "faseMin": 71, "mundo": 7, "rima": "ATE", "ini": "CH", "rimas": [ "ABACATE", "TOMATE" ], "parMinimo": null },
  { "p": "ARROZ", "s": [ "AR", "ROZ" ], "e": "🍚", "om": "1F35A", "g": [ "RR", "A", "O", "CODA_Z" ], "padrao": [ "dígrafo", "CVC" ], "faseMin": 73, "mundo": 7, "rima": "OZ", "ini": "A", "rimas": [], "parMinimo": null },
  { "p": "FEIJÃO", "s": [ "FEI", "JÃO" ], "e": "🫘", "om": "1FAD8", "g": [ "F", "E", "I", "J", "A", "Ã", "O", "ÃO" ], "padrao": [ "nasal" ], "faseMin": 64, "mundo": 6, "rima": "ÃO", "ini": "F", "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "PÃO" ], "parMinimo": null },
  { "p": "MACARRÃO", "s": [ "MA", "CAR", "RÃO" ], "e": "🍝", "om": "1F35D", "g": [ "M", "A", "RR", "C", "Ã", "O", "ÃO" ], "padrao": [ "dígrafo", "nasal" ], "faseMin": 73, "mundo": 7, "rima": "ÃO", "ini": "M", "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "PÃO" ], "parMinimo": null },
  { "p": "SANDUÍCHE", "s": [ "SAN", "DU", "Í", "CHE" ], "e": "🥪", "om": "1F96A", "g": [ "S", "A", "NASAL", "D", "U", "I", "CH", "E" ], "padrao": [ "dígrafo", "nasal" ], "faseMin": 71, "mundo": 7, "rima": "ICHE", "ini": "S", "rimas": [], "parMinimo": null },
  { "p": "CARNE", "s": [ "CAR", "NE" ], "e": "🥩", "om": "1F969", "g": [ "C", "A", "CODA_R", "N", "E" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "ARNE", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "SAL", "s": [ "SAL" ], "e": "🧂", "om": "1F9C2", "g": [ "S", "A", "CODA_L" ], "padrao": [ "CVC" ], "faseMin": 62, "mundo": 6, "rima": "AL", "ini": "S", "rimas": [ "JORNAL", "HOSPITAL" ], "parMinimo": null },
  { "p": "PANQUECA", "s": [ "PAN", "QUE", "CA" ], "e": "🥞", "om": "1F95E", "g": [ "P", "A", "NASAL", "QU", "E", "C" ], "padrao": [ "dígrafo", "nasal" ], "faseMin": 75, "mundo": 7, "rima": "ECA", "ini": "P", "rimas": [ "BONECA", "PETECA" ], "parMinimo": null },
  { "p": "AZEITONA", "s": [ "A", "ZEI", "TO", "NA" ], "e": "🫒", "om": "1FAD2", "g": [ "A", "Z", "E", "I", "T", "O", "N" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "ONA", "ini": "A", "rimas": [], "parMinimo": null },
  { "p": "AMENDOIM", "s": [ "A", "MEN", "DO", "IM" ], "e": "🥜", "om": "1F95C", "g": [ "A", "M", "E", "NASAL", "D", "O", "I" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "IM", "ini": "A", "rimas": [ "GUAXINIM", "PUDIM" ], "parMinimo": null },
  { "p": "CASTANHA", "s": [ "CAS", "TA", "NHA" ], "e": "🌰", "om": "1F330", "g": [ "C", "A", "CODA_S", "T", "NH" ], "padrao": [ "dígrafo", "CVC" ], "faseMin": 72, "mundo": 7, "rima": "ANHA", "ini": "C", "rimas": [ "ARANHA", "MONTANHA" ], "parMinimo": null },
  { "p": "MELÃO", "s": [ "ME", "LÃO" ], "e": "🍈", "om": "1F348", "g": [ "M", "E", "L", "A", "Ã", "O", "ÃO" ], "padrao": [ "nasal" ], "faseMin": 64, "mundo": 6, "rima": "ÃO", "ini": "M", "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "PÃO" ], "parMinimo": null },
  { "p": "GELO", "s": [ "GE", "LO" ], "e": "🧊", "om": "1F9CA", "g": [ "G_SUAVE", "E", "L", "O" ], "padrao": [ "regra" ], "faseMin": 76, "mundo": 7, "rima": "ELO", "ini": "G_SUAVE", "rimas": [ "CAMELO", "COGUMELO", "MARTELO", "NOVELO", "CASTELO", "CABELO" ], "parMinimo": null },
  { "p": "ÁGUA", "s": [ "Á", "GUA" ], "e": "🚰", "om": "1F6B0", "g": [ "A", "G", "U" ], "padrao": [ "CV" ], "faseMin": 40, "mundo": 4, "rima": "AGUA", "ini": "A", "rimas": [], "parMinimo": null },
  { "p": "TORTA", "s": [ "TOR", "TA" ], "e": "🥧", "om": "1F967", "g": [ "T", "O", "CODA_R", "A" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "ORTA", "ini": "T", "rimas": [ "PORTA" ], "parMinimo": null },
  { "p": "PUDIM", "s": [ "PU", "DIM" ], "e": "🍮", "om": "1F36E", "g": [ "P", "U", "D", "I", "NASAL" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "IM", "ini": "P", "rimas": [ "GUAXINIM", "AMENDOIM" ], "parMinimo": null },
  { "p": "PIMENTÃO", "s": [ "PI", "MEN", "TÃO" ], "e": "🫑", "om": "1FAD1", "g": [ "P", "I", "M", "E", "NASAL", "T", "A", "Ã", "O", "ÃO" ], "padrao": [ "nasal" ], "faseMin": 64, "mundo": 6, "rima": "ÃO", "ini": "P", "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "PÃO" ], "parMinimo": null },
  { "p": "SALSICHA", "s": [ "SAL", "SI", "CHA" ], "e": "🌭", "om": "1F32D", "g": [ "S", "A", "CODA_L", "I", "CH" ], "padrao": [ "dígrafo", "CVC" ], "faseMin": 71, "mundo": 7, "rima": "ICHA", "ini": "S", "rimas": [], "parMinimo": null },
  { "p": "ROSQUINHA", "s": [ "ROS", "QUI", "NHA" ], "e": "🍩", "om": "1F369", "g": [ "R_FORTE", "O", "CODA_S", "QU", "I", "NH", "A" ], "padrao": [ "dígrafo", "CVC", "regra" ], "faseMin": 75, "mundo": 7, "rima": "INHA", "ini": "R_FORTE", "rimas": [ "GALINHA", "JOANINHA", "RAINHA" ], "parMinimo": null },
  { "p": "ERVILHA", "s": [ "ER", "VI", "LHA" ], "e": "🫛", "om": "1FADB", "g": [ "E", "CODA_R", "V", "I", "LH", "A" ], "padrao": [ "dígrafo", "CVC" ], "faseMin": 72, "mundo": 7, "rima": "ILHA", "ini": "E", "rimas": [ "PILHA", "ILHA" ], "parMinimo": null },
  { "p": "CASA", "s": [ "CA", "SA" ], "e": "🏠", "om": "1F3E0", "g": [ "C", "A", "S_Z" ], "padrao": [ "regra" ], "faseMin": 47, "mundo": 5, "rima": "ASA", "ini": "C", "rimas": [], "parMinimo": { "par": "S/Z", "com": "CAÇA" } },
  { "p": "CADEIRA", "s": [ "CA", "DEI", "RA" ], "e": "🪑", "om": "1FA91", "g": [ "C", "A", "D", "E", "I", "R_FRACO" ], "padrao": [ "CV" ], "faseMin": 59, "mundo": 6, "rima": "EIRA", "ini": "C", "rimas": [ "BANDEIRA", "PALMEIRA" ], "parMinimo": null },
  { "p": "CAMA", "s": [ "CA", "MA" ], "e": "🛏️", "om": "1F6CF", "g": [ "C", "A", "M" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "AMA", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "SOFÁ", "s": [ "SO", "FÁ" ], "e": "🛋️", "om": "1F6CB", "g": [ "S", "O", "F", "A" ], "padrao": [ "CV" ], "faseMin": 29, "mundo": 3, "rima": "A", "ini": "S", "rimas": [ "CHÁ" ], "parMinimo": null },
  { "p": "JANELA", "s": [ "JA", "NE", "LA" ], "e": "🪟", "om": "1FA9F", "g": [ "J", "A", "N", "E", "L" ], "padrao": [ "CV" ], "faseMin": 30, "mundo": 3, "rima": "ELA", "ini": "J", "rimas": [ "VELA", "PANELA", "ESTRELA" ], "parMinimo": null },
  { "p": "PORTA", "s": [ "POR", "TA" ], "e": "🚪", "om": "1F6AA", "g": [ "P", "O", "CODA_R", "T", "A" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "ORTA", "ini": "P", "rimas": [ "TORTA" ], "parMinimo": null },
  { "p": "CHAVE", "s": [ "CHA", "VE" ], "e": "🔑", "om": "1F511", "g": [ "CH", "A", "V", "E" ], "padrao": [ "dígrafo" ], "faseMin": 71, "mundo": 7, "rima": "AVE", "ini": "CH", "rimas": [ "AVE" ], "parMinimo": null },
  { "p": "VELA", "s": [ "VE", "LA" ], "e": "🕯️", "om": "1F56F", "g": [ "V", "E", "L", "A" ], "padrao": [ "CV" ], "faseMin": 28, "mundo": 3, "rima": "ELA", "ini": "V", "rimas": [ "JANELA", "PANELA", "ESTRELA" ], "parMinimo": null },
  { "p": "LÂMPADA", "s": [ "LÂM", "PA", "DA" ], "e": "💡", "om": "1F4A1", "g": [ "L", "A", "NASAL", "P", "D" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "AMPADA", "ini": "L", "rimas": [], "parMinimo": null },
  { "p": "RELÓGIO", "s": [ "RE", "LÓ", "GIO" ], "e": "⏰", "om": "23F0", "g": [ "R_FORTE", "E", "L", "O", "G_SUAVE", "I" ], "padrao": [ "regra" ], "faseMin": 76, "mundo": 7, "rima": "OGIO", "ini": "R_FORTE", "rimas": [], "parMinimo": null },
  { "p": "TELEFONE", "s": [ "TE", "LE", "FO", "NE" ], "e": "☎️", "om": "260E", "g": [ "T", "E", "L", "F", "O", "N" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "ONE", "ini": "T", "rimas": [], "parMinimo": null },
  { "p": "CELULAR", "s": [ "CE", "LU", "LAR" ], "e": "📱", "om": "1F4F1", "g": [ "C_SUAVE", "E", "L", "U", "A", "CODA_R" ], "padrao": [ "CVC", "regra" ], "faseMin": 74, "mundo": 7, "rima": "AR", "ini": "C_SUAVE", "rimas": [ "MAR" ], "parMinimo": null },
  { "p": "LIVRO", "s": [ "LI", "VRO" ], "e": "📖", "om": "1F4D6", "g": [ "L", "I", "CCV", "V", "R_FRACO", "O" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "IVRO", "ini": "L", "rimas": [], "parMinimo": null },
  { "p": "LÁPIS", "s": [ "LÁ", "PIS" ], "e": "✏️", "om": "270F", "g": [ "L", "A", "P", "I", "CODA_S" ], "padrao": [ "CVC" ], "faseMin": 60, "mundo": 6, "rima": "APIS", "ini": "L", "rimas": [], "parMinimo": null },
  { "p": "CANETA", "s": [ "CA", "NE", "TA" ], "e": "🖊️", "om": "1F58A", "g": [ "C", "A", "N", "E", "T" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "ETA", "ini": "C", "rimas": [ "BORBOLETA", "SETA", "BICICLETA", "PLANETA", "COMETA" ], "parMinimo": null },
  { "p": "TESOURA", "s": [ "TE", "SOU", "RA" ], "e": "✂️", "om": "2702", "g": [ "T", "E", "S_Z", "O", "U", "R_FRACO", "A" ], "padrao": [ "regra" ], "faseMin": 59, "mundo": 6, "rima": "OURA", "ini": "T", "rimas": [ "CENOURA", "VASSOURA" ], "parMinimo": null },
  { "p": "COLA", "s": [ "CO", "LA" ], "e": "🧴", "om": "1F9F4", "g": [ "C", "O", "L", "A" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "OLA", "ini": "C", "rimas": [ "BOLA", "CEBOLA", "GOLA", "ESCOLA" ], "parMinimo": { "par": "C/G", "com": "GOLA" } },
  { "p": "GOLA", "s": [ "GO", "LA" ], "e": "👔", "om": "1F454", "g": [ "G", "O", "L", "A" ], "padrao": [ "CV" ], "faseMin": 40, "mundo": 4, "rima": "OLA", "ini": "G", "rimas": [ "BOLA", "CEBOLA", "COLA", "ESCOLA" ], "parMinimo": { "par": "C/G", "com": "COLA" } },
  { "p": "BOTA", "s": [ "BO", "TA" ], "e": "👢", "om": "1F462", "g": [ "B", "O", "T", "A" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "OTA", "ini": "B", "rimas": [ "NOTA", "GOTA" ], "parMinimo": null },
  { "p": "SAPATO", "s": [ "SA", "PA", "TO" ], "e": "👞", "om": "1F45E", "g": [ "S", "A", "P", "T", "O" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "ATO", "ini": "S", "rimas": [ "GATO", "PATO", "RATO", "PRATO", "JATO", "CHATO" ], "parMinimo": null },
  { "p": "MEIA", "s": [ "MEI", "A" ], "e": "🧦", "om": "1F9E6", "g": [ "M", "E", "I", "A" ], "padrao": [ "CV" ], "faseMin": 25, "mundo": 3, "rima": "EIA", "ini": "M", "rimas": [ "BALEIA", "SEREIA" ], "parMinimo": null },
  { "p": "CHAPÉU", "s": [ "CHA", "PÉU" ], "e": "👒", "om": "1F452", "g": [ "CH", "A", "P", "E", "U" ], "padrao": [ "dígrafo" ], "faseMin": 71, "mundo": 7, "rima": "EU", "ini": "CH", "rimas": [ "TROFÉU" ], "parMinimo": null },
  { "p": "BONÉ", "s": [ "BO", "NÉ" ], "e": "🧢", "om": "1F9E2", "g": [ "B", "O", "N", "E" ], "padrao": [ "CV" ], "faseMin": 36, "mundo": 4, "rima": "E", "ini": "B", "rimas": [ "JACARÉ", "CAFÉ", "PÉ", "BEBÊ" ], "parMinimo": null },
  { "p": "LUVA", "s": [ "LU", "VA" ], "e": "🧤", "om": "1F9E4", "g": [ "L", "U", "V", "A" ], "padrao": [ "CV" ], "faseMin": 28, "mundo": 3, "rima": "UVA", "ini": "L", "rimas": [ "UVA", "CHUVA" ], "parMinimo": null },
  { "p": "CALÇA", "s": [ "CAL", "ÇA" ], "e": "👖", "om": "1F456", "g": [ "C", "A", "CODA_L", "Ç" ], "padrao": [ "CVC", "regra" ], "faseMin": 74, "mundo": 7, "rima": "ALÇA", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "VESTIDO", "s": [ "VES", "TI", "DO" ], "e": "👗", "om": "1F457", "g": [ "V", "E", "CODA_S", "T", "I", "D", "O" ], "padrao": [ "CVC" ], "faseMin": 60, "mundo": 6, "rima": "IDO", "ini": "V", "rimas": [], "parMinimo": null },
  { "p": "CAMISA", "s": [ "CA", "MI", "SA" ], "e": "👕", "om": "1F455", "g": [ "C", "A", "M", "I", "S_Z" ], "padrao": [ "regra" ], "faseMin": 47, "mundo": 5, "rima": "ISA", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "ÓCULOS", "s": [ "Ó", "CU", "LOS" ], "e": "👓", "om": "1F453", "g": [ "O", "C", "U", "L", "CODA_S" ], "padrao": [ "CVC" ], "faseMin": 60, "mundo": 6, "rima": "OCULOS", "ini": "Ó", "rimas": [], "parMinimo": null },
  { "p": "ANEL", "s": [ "A", "NEL" ], "e": "💍", "om": "1F48D", "g": [ "A", "N", "E", "CODA_L" ], "padrao": [ "CVC" ], "faseMin": 62, "mundo": 6, "rima": "EL", "ini": "A", "rimas": [ "MEL", "PAPEL" ], "parMinimo": null },
  { "p": "COROA", "s": [ "CO", "RO", "A" ], "e": "👑", "om": "1F451", "g": [ "C", "O", "R_FRACO", "A" ], "padrao": [ "CV" ], "faseMin": 59, "mundo": 6, "rima": "OA", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "BOLSA", "s": [ "BOL", "SA" ], "e": "👜", "om": "1F45C", "g": [ "B", "O", "CODA_L", "S", "A" ], "padrao": [ "CVC" ], "faseMin": 62, "mundo": 6, "rima": "OLSA", "ini": "B", "rimas": [], "parMinimo": null },
  { "p": "MALA", "s": [ "MA", "LA" ], "e": "🧳", "om": "1F9F3", "g": [ "M", "A", "L" ], "padrao": [ "CV" ], "faseMin": 28, "mundo": 3, "rima": "ALA", "ini": "M", "rimas": [ "COALA", "BALA" ], "parMinimo": null },
  { "p": "MOCHILA", "s": [ "MO", "CHI", "LA" ], "e": "🎒", "om": "1F392", "g": [ "M", "O", "CH", "I", "L", "A" ], "padrao": [ "dígrafo" ], "faseMin": 71, "mundo": 7, "rima": "ILA", "ini": "M", "rimas": [ "GORILA", "VILA", "FILA" ], "parMinimo": null },
  { "p": "PENTE", "s": [ "PEN", "TE" ], "e": "🪮", "om": "1FAAE", "g": [ "P", "E", "NASAL", "T" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "ENTE", "ini": "P", "rimas": [ "PRESENTE", "SEMENTE", "DENTE" ], "parMinimo": null },
  { "p": "ESCOVA", "s": [ "ES", "CO", "VA" ], "e": "🪥", "om": "1FAA5", "g": [ "E", "CODA_S", "C", "O", "V", "A" ], "padrao": [ "CVC" ], "faseMin": 60, "mundo": 6, "rima": "OVA", "ini": null, "rimas": [], "parMinimo": null },
  { "p": "SABONETE", "s": [ "SA", "BO", "NE", "TE" ], "e": "🧼", "om": "1F9FC", "g": [ "S", "A", "B", "O", "N", "E", "T" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "ETE", "ini": "S", "rimas": [ "SORVETE", "TROMPETE", "FOGUETE", "PATINETE" ], "parMinimo": null },
  { "p": "BALDE", "s": [ "BAL", "DE" ], "e": "🪣", "om": "1FAA3", "g": [ "B", "A", "CODA_L", "D", "E" ], "padrao": [ "CVC" ], "faseMin": 62, "mundo": 6, "rima": "ALDE", "ini": "B", "rimas": [], "parMinimo": null },
  { "p": "VASO", "s": [ "VA", "SO" ], "e": "🪴", "om": "1FAB4", "g": [ "V", "A", "S_Z", "O" ], "padrao": [ "regra" ], "faseMin": 47, "mundo": 5, "rima": "ASO", "ini": "V", "rimas": [], "parMinimo": null },
  { "p": "COPO", "s": [ "CO", "PO" ], "e": "🥤", "om": "1F964", "g": [ "C", "O", "P" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "OPO", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "BULE", "s": [ "BU", "LE" ], "e": "🫖", "om": "1FAD6", "g": [ "B", "U", "L", "E" ], "padrao": [ "CV" ], "faseMin": 36, "mundo": 4, "rima": "ULE", "ini": "B", "rimas": [], "parMinimo": null },
  { "p": "PANELA", "s": [ "PA", "NE", "LA" ], "e": "🍳", "om": "1F373", "g": [ "P", "A", "N", "E", "L" ], "padrao": [ "CV" ], "faseMin": 35, "mundo": 4, "rima": "ELA", "ini": "P", "rimas": [ "JANELA", "VELA", "ESTRELA" ], "parMinimo": null },
  { "p": "FACA", "s": [ "FA", "CA" ], "e": "🔪", "om": "1F52A", "g": [ "F", "A", "C" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "ACA", "ini": "F", "rimas": [ "VACA", "BARRACA" ], "parMinimo": { "par": "F/V", "com": "VACA" } },
  { "p": "GARFO", "s": [ "GAR", "FO" ], "e": "🍴", "om": "1F374", "g": [ "G", "A", "CODA_R", "F", "O" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "ARFO", "ini": "G", "rimas": [], "parMinimo": null },
  { "p": "COLHER", "s": [ "CO", "LHER" ], "e": "🥄", "om": "1F944", "g": [ "C", "O", "LH", "E", "CODA_R" ], "padrao": [ "dígrafo", "CVC" ], "faseMin": 72, "mundo": 7, "rima": "ER", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "PRATO", "s": [ "PRA", "TO" ], "e": "🍽️", "om": "1F37D", "g": [ "CCV", "P", "R_FRACO", "A", "T", "O" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "ATO", "ini": "P", "rimas": [ "GATO", "PATO", "RATO", "SAPATO", "JATO", "CHATO" ], "parMinimo": null },
  { "p": "GARRAFA", "s": [ "GAR", "RA", "FA" ], "e": "🍾", "om": "1F37E", "g": [ "RR", "G", "A", "F" ], "padrao": [ "dígrafo" ], "faseMin": 73, "mundo": 7, "rima": "AFA", "ini": "G", "rimas": [ "GIRAFA" ], "parMinimo": null },
  { "p": "CAIXA", "s": [ "CAI", "XA" ], "e": "📦", "om": "1F4E6", "g": [ "C", "A", "I", "X" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "AIXA", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "PRESENTE", "s": [ "PRE", "SEN", "TE" ], "e": "🎁", "om": "1F381", "g": [ "CCV", "P", "R_FRACO", "E", "S_Z", "NASAL", "T" ], "padrao": [ "CCV", "nasal", "regra" ], "faseMin": 65, "mundo": 6, "rima": "ENTE", "ini": "P", "rimas": [ "PENTE", "SEMENTE", "DENTE" ], "parMinimo": null },
  { "p": "BALÃO", "s": [ "BA", "LÃO" ], "e": "🎈", "om": "1F388", "g": [ "B", "A", "L", "Ã", "O", "ÃO" ], "padrao": [ "nasal" ], "faseMin": 64, "mundo": 6, "rima": "ÃO", "ini": "B", "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "PÃO" ], "parMinimo": null },
  { "p": "PIPA", "s": [ "PI", "PA" ], "e": "🪁", "om": "1FA81", "g": [ "P", "I", "A" ], "padrao": [ "CV" ], "faseMin": 35, "mundo": 4, "rima": "IPA", "ini": "P", "rimas": [ "TULIPA" ], "parMinimo": null },
  { "p": "BONECA", "s": [ "BO", "NE", "CA" ], "e": "🪆", "om": "1FA86", "g": [ "B", "O", "N", "E", "C", "A" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "ECA", "ini": "B", "rimas": [ "PANQUECA", "PETECA" ], "parMinimo": null },
  { "p": "DADO", "s": [ "DA", "DO" ], "e": "🎲", "om": "1F3B2", "g": [ "D", "A", "O" ], "padrao": [ "CV" ], "faseMin": 38, "mundo": 4, "rima": "ADO", "ini": "D", "rimas": [ "VEADO", "GADO", "CADEADO", "TECLADO", "MACHADO" ], "parMinimo": null },
  { "p": "IOIÔ", "s": [ "I", "O", "I", "Ô" ], "e": "🪀", "om": "1FA80", "g": [ "I", "O" ], "padrao": [ "CV" ], "faseMin": 14, "mundo": 2, "rima": "O", "ini": "I", "rimas": [ "ROBÔ", "METRÔ", "TRENÓ", "VOVÓ", "VOVÔ" ], "parMinimo": null },
  { "p": "ROBÔ", "s": [ "RO", "BÔ" ], "e": "🤖", "om": "1F916", "g": [ "R_FORTE", "O", "B" ], "padrao": [ "regra" ], "faseMin": 73, "mundo": 7, "rima": "O", "ini": "R_FORTE", "rimas": [ "IOIÔ", "METRÔ", "TRENÓ", "VOVÓ", "VOVÔ" ], "parMinimo": null },
  { "p": "TAMBOR", "s": [ "TAM", "BOR" ], "e": "🥁", "om": "1F941", "g": [ "T", "A", "NASAL", "B", "O", "CODA_R" ], "padrao": [ "CVC", "nasal" ], "faseMin": 63, "mundo": 6, "rima": "OR", "ini": "T", "rimas": [ "CASTOR", "COMPUTADOR", "TRATOR", "FLOR" ], "parMinimo": null },
  { "p": "VIOLÃO", "s": [ "VI", "O", "LÃO" ], "e": "🎸", "om": "1F3B8", "g": [ "V", "I", "O", "L", "A", "Ã", "ÃO" ], "padrao": [ "nasal" ], "faseMin": 64, "mundo": 6, "rima": "ÃO", "ini": "V", "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "PÃO" ], "parMinimo": null },
  { "p": "PIANO", "s": [ "PI", "A", "NO" ], "e": "🎹", "om": "1F3B9", "g": [ "P", "I", "A", "N", "O" ], "padrao": [ "CV" ], "faseMin": 35, "mundo": 4, "rima": "ANO", "ini": "P", "rimas": [], "parMinimo": null },
  { "p": "TROMPETE", "s": [ "TROM", "PE", "TE" ], "e": "🎺", "om": "1F3BA", "g": [ "CCV", "T", "R_FRACO", "O", "NASAL", "P", "E" ], "padrao": [ "CCV", "nasal" ], "faseMin": 65, "mundo": 6, "rima": "ETE", "ini": "T", "rimas": [ "SORVETE", "SABONETE", "FOGUETE", "PATINETE" ], "parMinimo": null },
  { "p": "SINO", "s": [ "SI", "NO" ], "e": "🔔", "om": "1F514", "g": [ "S", "I", "N", "O" ], "padrao": [ "CV" ], "faseMin": 29, "mundo": 3, "rima": "INO", "ini": "S", "rimas": [ "PEPINO", "MENINO" ], "parMinimo": null },
  { "p": "MARTELO", "s": [ "MAR", "TE", "LO" ], "e": "🔨", "om": "1F528", "g": [ "M", "A", "CODA_R", "T", "E", "L", "O" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "ELO", "ini": "M", "rimas": [ "CAMELO", "COGUMELO", "GELO", "NOVELO", "CASTELO", "CABELO" ], "parMinimo": null },
  { "p": "AGULHA", "s": [ "A", "GU", "LHA" ], "e": "🪡", "om": "1FAA1", "g": [ "A", "G", "U", "LH" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "ULHA", "ini": "A", "rimas": [], "parMinimo": null },
  { "p": "NOVELO", "s": [ "NO", "VE", "LO" ], "e": "🧶", "om": "1F9F6", "g": [ "N", "O", "V", "E", "L" ], "padrao": [ "CV" ], "faseMin": 28, "mundo": 3, "rima": "ELO", "ini": "N", "rimas": [ "CAMELO", "COGUMELO", "GELO", "MARTELO", "CASTELO", "CABELO" ], "parMinimo": null },
  { "p": "BOTÃO", "s": [ "BO", "TÃO" ], "e": "🔘", "om": "1F518", "g": [ "B", "O", "T", "A", "Ã", "ÃO" ], "padrao": [ "nasal" ], "faseMin": 64, "mundo": 6, "rima": "ÃO", "ini": "B", "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "PÃO" ], "parMinimo": null },
  { "p": "ÍMÃ", "s": [ "Í", "MÃ" ], "e": "🧲", "om": "1F9F2", "g": [ "I", "M", "A", "Ã" ], "padrao": [ "nasal" ], "faseMin": 25, "mundo": 3, "rima": "IMÃ", "ini": "I", "rimas": [], "parMinimo": null },
  { "p": "LUPA", "s": [ "LU", "PA" ], "e": "🔍", "om": "1F50D", "g": [ "L", "U", "P", "A" ], "padrao": [ "CV" ], "faseMin": 35, "mundo": 4, "rima": "UPA", "ini": "L", "rimas": [], "parMinimo": null },
  { "p": "MAPA", "s": [ "MA", "PA" ], "e": "🗺️", "om": "1F5FA", "g": [ "M", "A", "P" ], "padrao": [ "CV" ], "faseMin": 35, "mundo": 4, "rima": "APA", "ini": "M", "rimas": [], "parMinimo": null },
  { "p": "GLOBO", "s": [ "GLO", "BO" ], "e": "🌐", "om": "1F310", "g": [ "CCV", "G", "L", "O", "B" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "OBO", "ini": "G", "rimas": [ "LOBO" ], "parMinimo": null },
  { "p": "BÚSSOLA", "s": [ "BÚS", "SO", "LA" ], "e": "🧭", "om": "1F9ED", "g": [ "SS", "B", "U", "O", "L", "A" ], "padrao": [ "dígrafo" ], "faseMin": 74, "mundo": 7, "rima": "USSOLA", "ini": "B", "rimas": [], "parMinimo": null },
  { "p": "CADEADO", "s": [ "CA", "DE", "A", "DO" ], "e": "🔒", "om": "1F512", "g": [ "C", "A", "D", "E", "O" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "ADO", "ini": "C", "rimas": [ "VEADO", "GADO", "DADO", "TECLADO", "MACHADO" ], "parMinimo": null },
  { "p": "ENVELOPE", "s": [ "EN", "VE", "LO", "PE" ], "e": "✉️", "om": "2709", "g": [ "E", "NASAL", "V", "L", "O", "P" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "OPE", "ini": null, "rimas": [], "parMinimo": null },
  { "p": "CARTA", "s": [ "CAR", "TA" ], "e": "💌", "om": "1F48C", "g": [ "C", "A", "CODA_R", "T" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "ARTA", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "JORNAL", "s": [ "JOR", "NAL" ], "e": "📰", "om": "1F4F0", "g": [ "J", "O", "CODA_R", "N", "A", "CODA_L" ], "padrao": [ "CVC" ], "faseMin": 62, "mundo": 6, "rima": "AL", "ini": "J", "rimas": [ "SAL", "HOSPITAL" ], "parMinimo": null },
  { "p": "QUADRO", "s": [ "QUA", "DRO" ], "e": "🖼️", "om": "1F5BC", "g": [ "QU", "A", "CCV", "D", "R_FRACO", "O" ], "padrao": [ "dígrafo", "CCV" ], "faseMin": 75, "mundo": 7, "rima": "UADRO", "ini": "QU", "rimas": [], "parMinimo": null },
  { "p": "TELEVISÃO", "s": [ "TE", "LE", "VI", "SÃO" ], "e": "📺", "om": "1F4FA", "g": [ "T", "E", "L", "V", "I", "S_Z", "A", "Ã", "O", "ÃO" ], "padrao": [ "nasal", "regra" ], "faseMin": 64, "mundo": 6, "rima": "ÃO", "ini": "T", "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "PÃO" ], "parMinimo": null },
  { "p": "COMPUTADOR", "s": [ "COM", "PU", "TA", "DOR" ], "e": "💻", "om": "1F4BB", "g": [ "C", "O", "NASAL", "P", "U", "T", "A", "D", "CODA_R" ], "padrao": [ "CVC", "nasal" ], "faseMin": 63, "mundo": 6, "rima": "OR", "ini": "C", "rimas": [ "CASTOR", "TAMBOR", "TRATOR", "FLOR" ], "parMinimo": null },
  { "p": "TECLADO", "s": [ "TE", "CLA", "DO" ], "e": "⌨️", "om": "2328", "g": [ "T", "E", "CCV", "C", "L", "A", "D", "O" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "ADO", "ini": "T", "rimas": [ "VEADO", "GADO", "DADO", "CADEADO", "MACHADO" ], "parMinimo": null },
  { "p": "RÁDIO", "s": [ "RÁ", "DIO" ], "e": "📻", "om": "1F4FB", "g": [ "R_FORTE", "A", "D", "I", "O" ], "padrao": [ "regra" ], "faseMin": 73, "mundo": 7, "rima": "ADIO", "ini": "R_FORTE", "rimas": [], "parMinimo": null },
  { "p": "PILHA", "s": [ "PI", "LHA" ], "e": "🔋", "om": "1F50B", "g": [ "P", "I", "LH", "A" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "ILHA", "ini": "P", "rimas": [ "ERVILHA", "ILHA" ], "parMinimo": null },
  { "p": "ESCADA", "s": [ "ES", "CA", "DA" ], "e": "🪜", "om": "1FA9C", "g": [ "E", "CODA_S", "C", "A", "D" ], "padrao": [ "CVC" ], "faseMin": 60, "mundo": 6, "rima": "ADA", "ini": null, "rimas": [ "SALADA", "TOMADA", "ESPADA", "FADA" ], "parMinimo": null },
  { "p": "ESPELHO", "s": [ "ES", "PE", "LHO" ], "e": "🪞", "om": "1FA9E", "g": [ "E", "CODA_S", "P", "LH", "O" ], "padrao": [ "dígrafo", "CVC" ], "faseMin": 72, "mundo": 7, "rima": "ELHO", "ini": null, "rimas": [ "COELHO" ], "parMinimo": null },
  { "p": "PAPEL", "s": [ "PA", "PEL" ], "e": "📄", "om": "1F4C4", "g": [ "P", "A", "E", "CODA_L" ], "padrao": [ "CVC" ], "faseMin": 62, "mundo": 6, "rima": "EL", "ini": "P", "rimas": [ "MEL", "ANEL" ], "parMinimo": null },
  { "p": "RÉGUA", "s": [ "RÉ", "GUA" ], "e": "📏", "om": "1F4CF", "g": [ "R_FORTE", "E", "G", "U", "A" ], "padrao": [ "regra" ], "faseMin": 73, "mundo": 7, "rima": "EGUA", "ini": "R_FORTE", "rimas": [], "parMinimo": null },
  { "p": "CLIPE", "s": [ "CLI", "PE" ], "e": "📎", "om": "1F4CE", "g": [ "CCV", "C", "L", "I", "P", "E" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "IPE", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "MOEDA", "s": [ "MO", "E", "DA" ], "e": "🪙", "om": "1FA99", "g": [ "M", "O", "E", "D", "A" ], "padrao": [ "CV" ], "faseMin": 38, "mundo": 4, "rima": "EDA", "ini": "M", "rimas": [], "parMinimo": null },
  { "p": "TROFÉU", "s": [ "TRO", "FÉU" ], "e": "🏆", "om": "1F3C6", "g": [ "CCV", "T", "R_FRACO", "O", "F", "E", "U" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "EU", "ini": "T", "rimas": [ "CHAPÉU" ], "parMinimo": null },
  { "p": "MEDALHA", "s": [ "ME", "DA", "LHA" ], "e": "🏅", "om": "1F3C5", "g": [ "M", "E", "D", "A", "LH" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "ALHA", "ini": "M", "rimas": [], "parMinimo": null },
  { "p": "BANDEIRA", "s": [ "BAN", "DEI", "RA" ], "e": "🚩", "om": "1F6A9", "g": [ "B", "A", "NASAL", "D", "E", "I", "R_FRACO" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "EIRA", "ini": "B", "rimas": [ "CADEIRA", "PALMEIRA" ], "parMinimo": null },
  { "p": "VASSOURA", "s": [ "VAS", "SOU", "RA" ], "e": "🧹", "om": "1F9F9", "g": [ "SS", "V", "A", "O", "U", "R_FRACO" ], "padrao": [ "dígrafo" ], "faseMin": 74, "mundo": 7, "rima": "OURA", "ini": "V", "rimas": [ "CENOURA", "TESOURA" ], "parMinimo": null },
  { "p": "ESPONJA", "s": [ "ES", "PON", "JA" ], "e": "🧽", "om": "1F9FD", "g": [ "E", "CODA_S", "P", "O", "NASAL", "J", "A" ], "padrao": [ "CVC", "nasal" ], "faseMin": 63, "mundo": 6, "rima": "ONJA", "ini": null, "rimas": [], "parMinimo": null },
  { "p": "BALANÇA", "s": [ "BA", "LAN", "ÇA" ], "e": "⚖️", "om": "2696", "g": [ "B", "A", "L", "NASAL", "Ç" ], "padrao": [ "nasal", "regra" ], "faseMin": 74, "mundo": 7, "rima": "ANÇA", "ini": "B", "rimas": [], "parMinimo": null },
  { "p": "LANTERNA", "s": [ "LAN", "TER", "NA" ], "e": "🔦", "om": "1F526", "g": [ "L", "A", "NASAL", "T", "E", "CODA_R", "N" ], "padrao": [ "CVC", "nasal" ], "faseMin": 63, "mundo": 6, "rima": "ERNA", "ini": "L", "rimas": [ "PERNA" ], "parMinimo": null },
  { "p": "BARRACA", "s": [ "BAR", "RA", "CA" ], "e": "⛺", "om": "26FA", "g": [ "RR", "B", "A", "C" ], "padrao": [ "dígrafo" ], "faseMin": 73, "mundo": 7, "rima": "ACA", "ini": "B", "rimas": [ "VACA", "FACA" ], "parMinimo": null },
  { "p": "CESTA", "s": [ "CES", "TA" ], "e": "🧺", "om": "1F9FA", "g": [ "C_SUAVE", "E", "CODA_S", "T", "A" ], "padrao": [ "CVC", "regra" ], "faseMin": 74, "mundo": 7, "rima": "ESTA", "ini": "C_SUAVE", "rimas": [], "parMinimo": null },
  { "p": "MÁSCARA", "s": [ "MÁS", "CA", "RA" ], "e": "🎭", "om": "1F3AD", "g": [ "M", "A", "CODA_S", "C", "R_FRACO" ], "padrao": [ "CVC" ], "faseMin": 60, "mundo": 6, "rima": "ASCARA", "ini": "M", "rimas": [], "parMinimo": null },
  { "p": "TOMADA", "s": [ "TO", "MA", "DA" ], "e": "🔌", "om": "1F50C", "g": [ "T", "O", "M", "A", "D" ], "padrao": [ "CV" ], "faseMin": 38, "mundo": 4, "rima": "ADA", "ini": "T", "rimas": [ "SALADA", "ESCADA", "ESPADA", "FADA" ], "parMinimo": null },
  { "p": "FOTO", "s": [ "FO", "TO" ], "e": "📷", "om": "1F4F7", "g": [ "F", "O", "T" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "OTO", "ini": "F", "rimas": [ "VOTO", "MOTO" ], "parMinimo": { "par": "F/V", "com": "VOTO" } },
  { "p": "VOTO", "s": [ "VO", "TO" ], "e": "🗳️", "om": "1F5F3", "g": [ "V", "O", "T" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "OTO", "ini": "V", "rimas": [ "FOTO", "MOTO" ], "parMinimo": { "par": "F/V", "com": "FOTO" } },
  { "p": "TIJOLO", "s": [ "TI", "JO", "LO" ], "e": "🧱", "om": "1F9F1", "g": [ "T", "I", "J", "O", "L" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "OLO", "ini": "T", "rimas": [ "BOLO" ], "parMinimo": null },
  { "p": "LAÇO", "s": [ "LA", "ÇO" ], "e": "🎀", "om": "1F380", "g": [ "L", "A", "Ç", "O" ], "padrao": [ "regra" ], "faseMin": 74, "mundo": 7, "rima": "AÇO", "ini": "L", "rimas": [ "BRAÇO", "PALHAÇO" ], "parMinimo": null },
  { "p": "BOLHA", "s": [ "BO", "LHA" ], "e": "🫧", "om": "1FAE7", "g": [ "B", "O", "LH", "A" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "OLHA", "ini": "B", "rimas": [ "FOLHA" ], "parMinimo": null },
  { "p": "NINHO", "s": [ "NI", "NHO" ], "e": "🪺", "om": "1FABA", "g": [ "N", "I", "NH", "O" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "INHO", "ini": "N", "rimas": [ "GOLFINHO", "PINTINHO" ], "parMinimo": null },
  { "p": "PENA", "s": [ "PE", "NA" ], "e": "🪶", "om": "1FAB6", "g": [ "P", "E", "N", "A" ], "padrao": [ "CV" ], "faseMin": 35, "mundo": 4, "rima": "ENA", "ini": "P", "rimas": [], "parMinimo": null },
  { "p": "CORDA", "s": [ "COR", "DA" ], "e": "🪢", "om": "1FAA2", "g": [ "C", "O", "CODA_R", "D", "A" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "ORDA", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "RODA", "s": [ "RO", "DA" ], "e": "🛞", "om": "1F6DE", "g": [ "R_FORTE", "O", "D", "A" ], "padrao": [ "regra" ], "faseMin": 73, "mundo": 7, "rima": "ODA", "ini": "R_FORTE", "rimas": [], "parMinimo": null },
  { "p": "ESPADA", "s": [ "ES", "PA", "DA" ], "e": "🗡️", "om": "1F5E1", "g": [ "E", "CODA_S", "P", "A", "D" ], "padrao": [ "CVC" ], "faseMin": 60, "mundo": 6, "rima": "ADA", "ini": null, "rimas": [ "SALADA", "ESCADA", "TOMADA", "FADA" ], "parMinimo": null },
  { "p": "ESCUDO", "s": [ "ES", "CU", "DO" ], "e": "🛡️", "om": "1F6E1", "g": [ "E", "CODA_S", "C", "U", "D", "O" ], "padrao": [ "CVC" ], "faseMin": 60, "mundo": 6, "rima": "UDO", "ini": null, "rimas": [], "parMinimo": null },
  { "p": "MACHADO", "s": [ "MA", "CHA", "DO" ], "e": "🪓", "om": "1FA93", "g": [ "M", "A", "CH", "D", "O" ], "padrao": [ "dígrafo" ], "faseMin": 71, "mundo": 7, "rima": "ADO", "ini": "M", "rimas": [ "VEADO", "GADO", "DADO", "CADEADO", "TECLADO" ], "parMinimo": null },
  { "p": "LIXO", "s": [ "LI", "XO" ], "e": "🗑️", "om": "1F5D1", "g": [ "L", "I", "X", "O" ], "padrao": [ "CV" ], "faseMin": 30, "mundo": 3, "rima": "IXO", "ini": "L", "rimas": [], "parMinimo": null },
  { "p": "JOGO", "s": [ "JO", "GO" ], "e": "🎮", "om": "1F3AE", "g": [ "J", "O", "G" ], "padrao": [ "CV" ], "faseMin": 40, "mundo": 4, "rima": "OGO", "ini": "J", "rimas": [ "FOGO" ], "parMinimo": null },
  { "p": "GOL", "s": [ "GOL" ], "e": "🥅", "om": "1F945", "g": [ "G", "O", "CODA_L" ], "padrao": [ "CVC" ], "faseMin": 62, "mundo": 6, "rima": "OL", "ini": "G", "rimas": [ "CARACOL", "SOL", "GIRASSOL" ], "parMinimo": null },
  { "p": "TÊNIS", "s": [ "TÊ", "NIS" ], "e": "👟", "om": "1F45F", "g": [ "T", "E", "N", "I", "CODA_S" ], "padrao": [ "CVC" ], "faseMin": 60, "mundo": 6, "rima": "ENIS", "ini": "T", "rimas": [], "parMinimo": null },
  { "p": "PETECA", "s": [ "PE", "TE", "CA" ], "e": "🏸", "om": "1F3F8", "g": [ "P", "E", "T", "C", "A" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "ECA", "ini": "P", "rimas": [ "PANQUECA", "BONECA" ], "parMinimo": null },
  { "p": "NOTA", "s": [ "NO", "TA" ], "e": "🎵", "om": "1F3B5", "g": [ "N", "O", "T", "A" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "OTA", "ini": "N", "rimas": [ "BOTA", "GOTA" ], "parMinimo": null },
  { "p": "MÚSICA", "s": [ "MÚ", "SI", "CA" ], "e": "🎶", "om": "1F3B6", "g": [ "M", "U", "S_Z", "I", "C", "A" ], "padrao": [ "regra" ], "faseMin": 47, "mundo": 5, "rima": "USICA", "ini": "M", "rimas": [], "parMinimo": null },
  { "p": "SETA", "s": [ "SE", "TA" ], "e": "➡️", "om": "27A1", "g": [ "S", "E", "T", "A" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "ETA", "ini": "S", "rimas": [ "BORBOLETA", "CANETA", "BICICLETA", "PLANETA", "COMETA" ], "parMinimo": null },
  { "p": "POTE", "s": [ "PO", "TE" ], "e": "🫙", "om": "1FAD9", "g": [ "P", "O", "T", "E" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "OTE", "ini": "P", "rimas": [ "BOTE" ], "parMinimo": { "par": "P/B", "com": "BOTE" } },
  { "p": "BOTE", "s": [ "BO", "TE" ], "e": "🛶", "om": "1F6F6", "g": [ "B", "O", "T", "E" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "OTE", "ini": "B", "rimas": [ "POTE" ], "parMinimo": { "par": "P/B", "com": "POTE" } },
  { "p": "PAU", "s": [ "PAU" ], "e": "🪵", "om": "1FAB5", "g": [ "P", "A", "U" ], "padrao": [ "CV" ], "faseMin": 35, "mundo": 4, "rima": "AU", "ini": "P", "rimas": [], "parMinimo": { "par": "P/B", "com": "BAÚ" } },
  { "p": "BAÚ", "s": [ "BA", "Ú" ], "e": "🧰", "om": "1F9F0", "g": [ "B", "A", "U" ], "padrao": [ "CV" ], "faseMin": 36, "mundo": 4, "rima": "U", "ini": "B", "rimas": [ "PERU", "CANGURU" ], "parMinimo": { "par": "P/B", "com": "PAU" } },
  { "p": "PATA", "s": [ "PA", "TA" ], "e": "🐾", "om": "1F43E", "g": [ "P", "A", "T" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "ATA", "ini": "P", "rimas": [ "BARATA", "BATATA" ], "parMinimo": null },
  { "p": "CARRO", "s": [ "CAR", "RO" ], "e": "🚗", "om": "1F697", "g": [ "RR", "C", "A", "O" ], "padrao": [ "dígrafo" ], "faseMin": 73, "mundo": 7, "rima": "ARRO", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "MOTO", "s": [ "MO", "TO" ], "e": "🏍️", "om": "1F3CD", "g": [ "M", "O", "T" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "OTO", "ini": "M", "rimas": [ "FOTO", "VOTO" ], "parMinimo": null },
  { "p": "BICICLETA", "s": [ "BI", "CI", "CLE", "TA" ], "e": "🚲", "om": "1F6B2", "g": [ "B", "I", "C_SUAVE", "CCV", "C", "L", "E", "T", "A" ], "padrao": [ "CCV", "regra" ], "faseMin": 74, "mundo": 7, "rima": "ETA", "ini": "B", "rimas": [ "BORBOLETA", "CANETA", "SETA", "PLANETA", "COMETA" ], "parMinimo": null },
  { "p": "ÔNIBUS", "s": [ "Ô", "NI", "BUS" ], "e": "🚌", "om": "1F68C", "g": [ "O", "N", "I", "B", "U", "CODA_S" ], "padrao": [ "CVC" ], "faseMin": 60, "mundo": 6, "rima": "ONIBUS", "ini": null, "rimas": [], "parMinimo": null },
  { "p": "TREM", "s": [ "TREM" ], "e": "🚆", "om": "1F686", "g": [ "CCV", "T", "R_FRACO", "E", "NASAL" ], "padrao": [ "CCV", "nasal" ], "faseMin": 65, "mundo": 6, "rima": "EM", "ini": "T", "rimas": [], "parMinimo": null },
  { "p": "BARCO", "s": [ "BAR", "CO" ], "e": "⛵", "om": "26F5", "g": [ "B", "A", "CODA_R", "C", "O" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "ARCO", "ini": "B", "rimas": [], "parMinimo": null },
  { "p": "NAVIO", "s": [ "NA", "VI", "O" ], "e": "🚢", "om": "1F6A2", "g": [ "N", "A", "V", "I", "O" ], "padrao": [ "CV" ], "faseMin": 26, "mundo": 3, "rima": "IO", "ini": "N", "rimas": [ "RIO" ], "parMinimo": null },
  { "p": "FOGUETE", "s": [ "FO", "GUE", "TE" ], "e": "🚀", "om": "1F680", "g": [ "F", "O", "GU", "E", "T" ], "padrao": [ "dígrafo" ], "faseMin": 75, "mundo": 7, "rima": "ETE", "ini": "F", "rimas": [ "SORVETE", "SABONETE", "TROMPETE", "PATINETE" ], "parMinimo": null },
  { "p": "CAMINHÃO", "s": [ "CA", "MI", "NHÃO" ], "e": "🚚", "om": "1F69A", "g": [ "C", "A", "M", "I", "NH", "Ã", "O", "ÃO" ], "padrao": [ "dígrafo", "nasal" ], "faseMin": 72, "mundo": 7, "rima": "ÃO", "ini": "C", "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "PÃO" ], "parMinimo": null },
  { "p": "TÁXI", "s": [ "TÁ", "XI" ], "e": "🚕", "om": "1F695", "g": [ "T", "A", "X_VARIOS", "I" ], "padrao": [ "regra" ], "faseMin": 77, "mundo": 7, "rima": "AXI", "ini": "T", "rimas": [], "parMinimo": null },
  { "p": "TRATOR", "s": [ "TRA", "TOR" ], "e": "🚜", "om": "1F69C", "g": [ "CCV", "T", "R_FRACO", "A", "O", "CODA_R" ], "padrao": [ "CCV", "CVC" ], "faseMin": 65, "mundo": 6, "rima": "OR", "ini": "T", "rimas": [ "CASTOR", "TAMBOR", "COMPUTADOR", "FLOR" ], "parMinimo": null },
  { "p": "PATINETE", "s": [ "PA", "TI", "NE", "TE" ], "e": "🛴", "om": "1F6F4", "g": [ "P", "A", "T", "I", "N", "E" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "ETE", "ini": "P", "rimas": [ "SORVETE", "SABONETE", "TROMPETE", "FOGUETE" ], "parMinimo": null },
  { "p": "AMBULÂNCIA", "s": [ "AM", "BU", "LÂN", "CIA" ], "e": "🚑", "om": "1F691", "g": [ "A", "NASAL", "B", "U", "L", "C_SUAVE", "I" ], "padrao": [ "nasal", "regra" ], "faseMin": 74, "mundo": 7, "rima": "ANCIA", "ini": null, "rimas": [], "parMinimo": null },
  { "p": "JATO", "s": [ "JA", "TO" ], "e": "🛩️", "om": "1F6E9", "g": [ "J", "A", "T", "O" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "ATO", "ini": "J", "rimas": [ "GATO", "PATO", "RATO", "SAPATO", "PRATO", "CHATO" ], "parMinimo": { "par": "X/J", "com": "CHATO" } },
  { "p": "METRÔ", "s": [ "ME", "TRÔ" ], "e": "🚇", "om": "1F687", "g": [ "M", "E", "CCV", "T", "R_FRACO", "O" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "O", "ini": "M", "rimas": [ "IOIÔ", "ROBÔ", "TRENÓ", "VOVÓ", "VOVÔ" ], "parMinimo": null },
  { "p": "PATINS", "s": [ "PA", "TINS" ], "e": "🛼", "om": "1F6FC", "g": [ "P", "A", "T", "I", "NASAL", "CODA_S" ], "padrao": [ "CVC", "nasal" ], "faseMin": 63, "mundo": 6, "rima": "INS", "ini": "P", "rimas": [], "parMinimo": null },
  { "p": "TRENÓ", "s": [ "TRE", "NÓ" ], "e": "🛷", "om": "1F6F7", "g": [ "CCV", "T", "R_FRACO", "E", "N", "O" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "O", "ini": "T", "rimas": [ "IOIÔ", "ROBÔ", "METRÔ", "VOVÓ", "VOVÔ" ], "parMinimo": null },
  { "p": "AVIÃO", "s": [ "A", "VI", "ÃO" ], "e": "✈️", "om": "2708", "g": [ "A", "V", "I", "Ã", "O", "ÃO" ], "padrao": [ "nasal" ], "faseMin": 64, "mundo": 6, "rima": "ÃO", "ini": "A", "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "PÃO" ], "parMinimo": null },
  { "p": "SOL", "s": [ "SOL" ], "e": "☀️", "om": "2600", "g": [ "S", "O", "CODA_L" ], "padrao": [ "CVC" ], "faseMin": 62, "mundo": 6, "rima": "OL", "ini": "S", "rimas": [ "CARACOL", "GOL", "GIRASSOL" ], "parMinimo": null },
  { "p": "LUA", "s": [ "LU", "A" ], "e": "🌙", "om": "1F319", "g": [ "L", "U", "A" ], "padrao": [ "CV" ], "faseMin": 28, "mundo": 3, "rima": "UA", "ini": "L", "rimas": [], "parMinimo": null },
  { "p": "ESTRELA", "s": [ "ES", "TRE", "LA" ], "e": "⭐", "om": "2B50", "g": [ "E", "CODA_S", "CCV", "T", "R_FRACO", "L", "A" ], "padrao": [ "CCV", "CVC" ], "faseMin": 65, "mundo": 6, "rima": "ELA", "ini": null, "rimas": [ "JANELA", "VELA", "PANELA" ], "parMinimo": null },
  { "p": "NUVEM", "s": [ "NU", "VEM" ], "e": "☁️", "om": "2601", "g": [ "N", "U", "V", "E", "NASAL" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "UVEM", "ini": "N", "rimas": [], "parMinimo": null },
  { "p": "CHUVA", "s": [ "CHU", "VA" ], "e": "🌧️", "om": "1F327", "g": [ "CH", "U", "V", "A" ], "padrao": [ "dígrafo" ], "faseMin": 71, "mundo": 7, "rima": "UVA", "ini": "CH", "rimas": [ "UVA", "LUVA" ], "parMinimo": null },
  { "p": "NEVE", "s": [ "NE", "VE" ], "e": "❄️", "om": "2744", "g": [ "N", "E", "V" ], "padrao": [ "CV" ], "faseMin": 26, "mundo": 3, "rima": "EVE", "ini": "N", "rimas": [], "parMinimo": null },
  { "p": "RAIO", "s": [ "RAI", "O" ], "e": "⚡", "om": "26A1", "g": [ "R_FORTE", "A", "I", "O" ], "padrao": [ "regra" ], "faseMin": 73, "mundo": 7, "rima": "AIO", "ini": "R_FORTE", "rimas": [ "PAPAGAIO" ], "parMinimo": null },
  { "p": "FOGO", "s": [ "FO", "GO" ], "e": "🔥", "om": "1F525", "g": [ "F", "O", "G" ], "padrao": [ "CV" ], "faseMin": 40, "mundo": 4, "rima": "OGO", "ini": "F", "rimas": [ "JOGO" ], "parMinimo": null },
  { "p": "ÁRVORE", "s": [ "ÁR", "VO", "RE" ], "e": "🌳", "om": "1F333", "g": [ "A", "CODA_R", "V", "O", "R_FRACO", "E" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "ARVORE", "ini": "A", "rimas": [], "parMinimo": null },
  { "p": "FLOR", "s": [ "FLOR" ], "e": "🌸", "om": "1F338", "g": [ "CCV", "F", "L", "O", "CODA_R" ], "padrao": [ "CCV", "CVC" ], "faseMin": 65, "mundo": 6, "rima": "OR", "ini": "F", "rimas": [ "CASTOR", "TAMBOR", "COMPUTADOR", "TRATOR" ], "parMinimo": null },
  { "p": "ROSA", "s": [ "RO", "SA" ], "e": "🌹", "om": "1F339", "g": [ "R_FORTE", "O", "S_Z", "A" ], "padrao": [ "regra" ], "faseMin": 73, "mundo": 7, "rima": "OSA", "ini": "R_FORTE", "rimas": [ "RAPOSA" ], "parMinimo": { "par": "S/Z", "com": "ROÇA" } },
  { "p": "ROÇA", "s": [ "RO", "ÇA" ], "e": "🌾", "om": "1F33E", "g": [ "R_FORTE", "O", "Ç", "A" ], "padrao": [ "regra" ], "faseMin": 74, "mundo": 7, "rima": "OÇA", "ini": "R_FORTE", "rimas": [], "parMinimo": { "par": "S/Z", "com": "ROSA" } },
  { "p": "FOLHA", "s": [ "FO", "LHA" ], "e": "🍃", "om": "1F343", "g": [ "F", "O", "LH", "A" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "OLHA", "ini": "F", "rimas": [ "BOLHA" ], "parMinimo": null },
  { "p": "GIRASSOL", "s": [ "GI", "RAS", "SOL" ], "e": "🌻", "om": "1F33B", "g": [ "G_SUAVE", "I", "SS", "R_FRACO", "A", "O", "CODA_L" ], "padrao": [ "dígrafo", "CVC", "regra" ], "faseMin": 76, "mundo": 7, "rima": "OL", "ini": "G_SUAVE", "rimas": [ "CARACOL", "GOL", "SOL" ], "parMinimo": null },
  { "p": "TULIPA", "s": [ "TU", "LI", "PA" ], "e": "🌷", "om": "1F337", "g": [ "T", "U", "L", "I", "P", "A" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "IPA", "ini": "T", "rimas": [ "PIPA" ], "parMinimo": null },
  { "p": "PALMEIRA", "s": [ "PAL", "MEI", "RA" ], "e": "🌴", "om": "1F334", "g": [ "P", "A", "CODA_L", "M", "E", "I", "R_FRACO" ], "padrao": [ "CVC" ], "faseMin": 62, "mundo": 6, "rima": "EIRA", "ini": "P", "rimas": [ "CADEIRA", "BANDEIRA" ], "parMinimo": null },
  { "p": "PEDRA", "s": [ "PE", "DRA" ], "e": "🪨", "om": "1FAA8", "g": [ "P", "E", "CCV", "D", "R_FRACO", "A" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "EDRA", "ini": "P", "rimas": [], "parMinimo": null },
  { "p": "MONTANHA", "s": [ "MON", "TA", "NHA" ], "e": "⛰️", "om": "26F0", "g": [ "M", "O", "NASAL", "T", "A", "NH" ], "padrao": [ "dígrafo", "nasal" ], "faseMin": 72, "mundo": 7, "rima": "ANHA", "ini": "M", "rimas": [ "ARANHA", "CASTANHA" ], "parMinimo": null },
  { "p": "PICO", "s": [ "PI", "CO" ], "e": "🏔️", "om": "1F3D4", "g": [ "P", "I", "C", "O" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "ICO", "ini": "P", "rimas": [ "BICO" ], "parMinimo": { "par": "P/B", "com": "BICO" } },
  { "p": "VULCÃO", "s": [ "VUL", "CÃO" ], "e": "🌋", "om": "1F30B", "g": [ "V", "U", "CODA_L", "C", "A", "Ã", "O", "ÃO" ], "padrao": [ "CVC", "nasal" ], "faseMin": 64, "mundo": 6, "rima": "ÃO", "ini": "V", "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "PÃO" ], "parMinimo": null },
  { "p": "ILHA", "s": [ "I", "LHA" ], "e": "🏝️", "om": "1F3DD", "g": [ "I", "LH", "A" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "ILHA", "ini": "I", "rimas": [ "ERVILHA", "PILHA" ], "parMinimo": null },
  { "p": "PRAIA", "s": [ "PRAI", "A" ], "e": "🏖️", "om": "1F3D6", "g": [ "CCV", "P", "R_FRACO", "A", "I" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "AIA", "ini": "P", "rimas": [], "parMinimo": null },
  { "p": "MAR", "s": [ "MAR" ], "e": "🌊", "om": "1F30A", "g": [ "M", "A", "CODA_R" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "AR", "ini": "M", "rimas": [ "CELULAR" ], "parMinimo": null },
  { "p": "CONCHA", "s": [ "CON", "CHA" ], "e": "🐚", "om": "1F41A", "g": [ "C", "O", "NASAL", "CH", "A" ], "padrao": [ "dígrafo", "nasal" ], "faseMin": 71, "mundo": 7, "rima": "ONCHA", "ini": "C", "rimas": [], "parMinimo": null },
  { "p": "TERRA", "s": [ "TER", "RA" ], "e": "🌎", "om": "1F30E", "g": [ "RR", "T", "E", "A" ], "padrao": [ "dígrafo" ], "faseMin": 73, "mundo": 7, "rima": "ERRA", "ini": "T", "rimas": [], "parMinimo": null },
  { "p": "PLANETA", "s": [ "PLA", "NE", "TA" ], "e": "🪐", "om": "1FA90", "g": [ "CCV", "P", "L", "A", "N", "E", "T" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "ETA", "ini": "P", "rimas": [ "BORBOLETA", "CANETA", "SETA", "BICICLETA", "COMETA" ], "parMinimo": null },
  { "p": "COMETA", "s": [ "CO", "ME", "TA" ], "e": "☄️", "om": "2604", "g": [ "C", "O", "M", "E", "T", "A" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "ETA", "ini": "C", "rimas": [ "BORBOLETA", "CANETA", "SETA", "BICICLETA", "PLANETA" ], "parMinimo": null },
  { "p": "GOTA", "s": [ "GO", "TA" ], "e": "💧", "om": "1F4A7", "g": [ "G", "O", "T", "A" ], "padrao": [ "CV" ], "faseMin": 40, "mundo": 4, "rima": "OTA", "ini": "G", "rimas": [ "BOTA", "NOTA" ], "parMinimo": null },
  { "p": "SEMENTE", "s": [ "SE", "MEN", "TE" ], "e": "🌱", "om": "1F331", "g": [ "S", "E", "M", "NASAL", "T" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "ENTE", "ini": "S", "rimas": [ "PENTE", "PRESENTE", "DENTE" ], "parMinimo": null },
  { "p": "CASTELO", "s": [ "CAS", "TE", "LO" ], "e": "🏰", "om": "1F3F0", "g": [ "C", "A", "CODA_S", "T", "E", "L", "O" ], "padrao": [ "CVC" ], "faseMin": 60, "mundo": 6, "rima": "ELO", "ini": "C", "rimas": [ "CAMELO", "COGUMELO", "GELO", "MARTELO", "NOVELO", "CABELO" ], "parMinimo": null },
  { "p": "ESCOLA", "s": [ "ES", "CO", "LA" ], "e": "🏫", "om": "1F3EB", "g": [ "E", "CODA_S", "C", "O", "L", "A" ], "padrao": [ "CVC" ], "faseMin": 60, "mundo": 6, "rima": "OLA", "ini": null, "rimas": [ "BOLA", "CEBOLA", "COLA", "GOLA" ], "parMinimo": null },
  { "p": "HOSPITAL", "s": [ "HOS", "PI", "TAL" ], "e": "🏥", "om": "1F3E5", "g": [ "H", "O", "CODA_S", "P", "I", "T", "A", "CODA_L" ], "padrao": [ "CVC", "regra" ], "faseMin": 77, "mundo": 7, "rima": "AL", "ini": "H", "rimas": [ "SAL", "JORNAL" ], "parMinimo": null },
  { "p": "LOJA", "s": [ "LO", "JA" ], "e": "🏬", "om": "1F3EC", "g": [ "L", "O", "J", "A" ], "padrao": [ "CV" ], "faseMin": 30, "mundo": 3, "rima": "OJA", "ini": "L", "rimas": [], "parMinimo": null },
  { "p": "CIRCO", "s": [ "CIR", "CO" ], "e": "🎪", "om": "1F3AA", "g": [ "C_SUAVE", "I", "CODA_R", "C", "O" ], "padrao": [ "CVC", "regra" ], "faseMin": 74, "mundo": 7, "rima": "IRCO", "ini": "C_SUAVE", "rimas": [], "parMinimo": null },
  { "p": "PONTE", "s": [ "PON", "TE" ], "e": "🌉", "om": "1F309", "g": [ "P", "O", "NASAL", "T", "E" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "ONTE", "ini": "P", "rimas": [ "RINOCERONTE" ], "parMinimo": null },
  { "p": "FÁBRICA", "s": [ "FÁ", "BRI", "CA" ], "e": "🏭", "om": "1F3ED", "g": [ "F", "A", "CCV", "B", "R_FRACO", "I", "C" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "ABRICA", "ini": "F", "rimas": [], "parMinimo": null },
  { "p": "VILA", "s": [ "VI", "LA" ], "e": "🏘️", "om": "1F3D8", "g": [ "V", "I", "L", "A" ], "padrao": [ "CV" ], "faseMin": 28, "mundo": 3, "rima": "ILA", "ini": "V", "rimas": [ "GORILA", "MOCHILA", "FILA" ], "parMinimo": { "par": "F/V", "com": "FILA" } },
  { "p": "RIO", "s": [ "RI", "O" ], "e": "🏞️", "om": "1F3DE", "g": [ "R_FORTE", "I", "O" ], "padrao": [ "regra" ], "faseMin": 73, "mundo": 7, "rima": "IO", "ini": "R_FORTE", "rimas": [ "NAVIO" ], "parMinimo": null },
  { "p": "OCA", "s": [ "O", "CA" ], "e": "🛖", "om": "1F6D6", "g": [ "O", "C", "A" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "OCA", "ini": "O", "rimas": [ "MINHOCA", "FOCA", "PIPOCA", "BOCA" ], "parMinimo": null },
  { "p": "DIA", "s": [ "DI", "A" ], "e": "🌞", "om": "1F31E", "g": [ "D", "I", "A" ], "padrao": [ "CV" ], "faseMin": 38, "mundo": 4, "rima": "IA", "ini": "D", "rimas": [ "MELANCIA", "TIA" ], "parMinimo": { "par": "T/D", "com": "TIA" } },
  { "p": "FILA", "s": [ "FI", "LA" ], "e": "🧍", "om": "1F9CD", "g": [ "F", "I", "L", "A" ], "padrao": [ "CV" ], "faseMin": 28, "mundo": 3, "rima": "ILA", "ini": "F", "rimas": [ "GORILA", "MOCHILA", "VILA" ], "parMinimo": { "par": "F/V", "com": "VILA" } },
  { "p": "IGREJA", "s": [ "I", "GRE", "JA" ], "e": "⛪", "om": "26EA", "g": [ "I", "CCV", "G", "R_FRACO", "E", "J", "A" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "EJA", "ini": "I", "rimas": [ "CEREJA" ], "parMinimo": null },
  { "p": "MÃO", "s": [ "MÃO" ], "e": "✋", "om": "270B", "g": [ "M", "A", "Ã", "O", "ÃO" ], "padrao": [ "nasal" ], "faseMin": 64, "mundo": 6, "rima": "ÃO", "ini": "M", "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "PÃO" ], "parMinimo": null },
  { "p": "PÉ", "s": [ "PÉ" ], "e": "🦶", "om": "1F9B6", "g": [ "P", "E" ], "padrao": [ "CV" ], "faseMin": 35, "mundo": 4, "rima": "E", "ini": "P", "rimas": [ "JACARÉ", "CAFÉ", "BONÉ", "BEBÊ" ], "parMinimo": null },
  { "p": "OLHO", "s": [ "O", "LHO" ], "e": "👁️", "om": "1F441", "g": [ "O", "LH" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "OLHO", "ini": "O", "rimas": [], "parMinimo": null },
  { "p": "BOCA", "s": [ "BO", "CA" ], "e": "👄", "om": "1F444", "g": [ "B", "O", "C", "A" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "OCA", "ini": "B", "rimas": [ "MINHOCA", "FOCA", "PIPOCA", "OCA" ], "parMinimo": null },
  { "p": "NARIZ", "s": [ "NA", "RIZ" ], "e": "👃", "om": "1F443", "g": [ "N", "A", "R_FRACO", "I", "CODA_Z" ], "padrao": [ "CVC" ], "faseMin": 60, "mundo": 6, "rima": "IZ", "ini": "N", "rimas": [], "parMinimo": null },
  { "p": "DENTE", "s": [ "DEN", "TE" ], "e": "🦷", "om": "1F9B7", "g": [ "D", "E", "NASAL", "T" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "ENTE", "ini": "D", "rimas": [ "PENTE", "PRESENTE", "SEMENTE" ], "parMinimo": null },
  { "p": "ORELHA", "s": [ "O", "RE", "LHA" ], "e": "👂", "om": "1F442", "g": [ "O", "R_FRACO", "E", "LH", "A" ], "padrao": [ "dígrafo" ], "faseMin": 72, "mundo": 7, "rima": "ELHA", "ini": "O", "rimas": [ "ABELHA", "OVELHA" ], "parMinimo": null },
  { "p": "DEDO", "s": [ "DE", "DO" ], "e": "☝️", "om": "261D", "g": [ "D", "E", "O" ], "padrao": [ "CV" ], "faseMin": 38, "mundo": 4, "rima": "EDO", "ini": "D", "rimas": [], "parMinimo": null },
  { "p": "PERNA", "s": [ "PER", "NA" ], "e": "🦵", "om": "1F9B5", "g": [ "P", "E", "CODA_R", "N", "A" ], "padrao": [ "CVC" ], "faseMin": 61, "mundo": 6, "rima": "ERNA", "ini": "P", "rimas": [ "LANTERNA" ], "parMinimo": null },
  { "p": "BRAÇO", "s": [ "BRA", "ÇO" ], "e": "💪", "om": "1F4AA", "g": [ "CCV", "B", "R_FRACO", "A", "Ç", "O" ], "padrao": [ "CCV", "regra" ], "faseMin": 74, "mundo": 7, "rima": "AÇO", "ini": "B", "rimas": [ "LAÇO", "PALHAÇO" ], "parMinimo": null },
  { "p": "CABELO", "s": [ "CA", "BE", "LO" ], "e": "💇", "om": "1F487", "g": [ "C", "A", "B", "E", "L", "O" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "ELO", "ini": "C", "rimas": [ "CAMELO", "COGUMELO", "GELO", "MARTELO", "NOVELO", "CASTELO" ], "parMinimo": null },
  { "p": "CORAÇÃO", "s": [ "CO", "RA", "ÇÃO" ], "e": "❤️", "om": "2764", "g": [ "C", "O", "R_FRACO", "A", "Ç", "Ã", "ÃO" ], "padrao": [ "nasal", "regra" ], "faseMin": 74, "mundo": 7, "rima": "ÃO", "ini": "C", "rimas": [ "LEÃO", "TUBARÃO", "PAVÃO", "ESCORPIÃO", "CAMARÃO", "DRAGÃO", "LIMÃO", "PÃO" ], "parMinimo": null },
  { "p": "LÍNGUA", "s": [ "LÍN", "GUA" ], "e": "👅", "om": "1F445", "g": [ "L", "I", "NASAL", "G", "U", "A" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "INGUA", "ini": "L", "rimas": [], "parMinimo": null },
  { "p": "OSSO", "s": [ "OS", "SO" ], "e": "🦴", "om": "1F9B4", "g": [ "SS", "O" ], "padrao": [ "dígrafo" ], "faseMin": 74, "mundo": 7, "rima": "OSSO", "ini": "O", "rimas": [], "parMinimo": null },
  { "p": "BEBÊ", "s": [ "BE", "BÊ" ], "e": "👶", "om": "1F476", "g": [ "B", "E" ], "padrao": [ "CV" ], "faseMin": 36, "mundo": 4, "rima": "E", "ini": "B", "rimas": [ "JACARÉ", "CAFÉ", "BONÉ", "PÉ" ], "parMinimo": null },
  { "p": "MENINO", "s": [ "ME", "NI", "NO" ], "e": "👦", "om": "1F466", "g": [ "M", "E", "N", "I", "O" ], "padrao": [ "CV" ], "faseMin": 26, "mundo": 3, "rima": "INO", "ini": "M", "rimas": [ "PEPINO", "SINO" ], "parMinimo": null },
  { "p": "MENINA", "s": [ "ME", "NI", "NA" ], "e": "👧", "om": "1F467", "g": [ "M", "E", "N", "I", "A" ], "padrao": [ "CV" ], "faseMin": 26, "mundo": 3, "rima": "INA", "ini": "M", "rimas": [], "parMinimo": null },
  { "p": "MAMÃE", "s": [ "MA", "MÃE" ], "e": "🤱", "om": "1F931", "g": [ "M", "A", "Ã", "E" ], "padrao": [ "nasal" ], "faseMin": 25, "mundo": 3, "rima": "ÃE", "ini": "M", "rimas": [], "parMinimo": null },
  { "p": "PAPAI", "s": [ "PA", "PAI" ], "e": "👨", "om": "1F468", "g": [ "P", "A", "I" ], "padrao": [ "CV" ], "faseMin": 35, "mundo": 4, "rima": "AI", "ini": "P", "rimas": [], "parMinimo": null },
  { "p": "TIA", "s": [ "TI", "A" ], "e": "👩", "om": "1F469", "g": [ "T", "I", "A" ], "padrao": [ "CV" ], "faseMin": 37, "mundo": 4, "rima": "IA", "ini": "T", "rimas": [ "MELANCIA", "DIA" ], "parMinimo": { "par": "T/D", "com": "DIA" } },
  { "p": "VOVÓ", "s": [ "VO", "VÓ" ], "e": "👵", "om": "1F475", "g": [ "V", "O" ], "padrao": [ "CV" ], "faseMin": 24, "mundo": 3, "rima": "O", "ini": "V", "rimas": [ "IOIÔ", "ROBÔ", "METRÔ", "TRENÓ", "VOVÔ" ], "parMinimo": null },
  { "p": "VOVÔ", "s": [ "VO", "VÔ" ], "e": "👴", "om": "1F474", "g": [ "V", "O" ], "padrao": [ "CV" ], "faseMin": 24, "mundo": 3, "rima": "O", "ini": "V", "rimas": [ "IOIÔ", "ROBÔ", "METRÔ", "TRENÓ", "VOVÓ" ], "parMinimo": null },
  { "p": "FADA", "s": [ "FA", "DA" ], "e": "🧚", "om": "1F9DA", "g": [ "F", "A", "D" ], "padrao": [ "CV" ], "faseMin": 38, "mundo": 4, "rima": "ADA", "ini": "F", "rimas": [ "SALADA", "ESCADA", "TOMADA", "ESPADA" ], "parMinimo": null },
  { "p": "BRUXA", "s": [ "BRU", "XA" ], "e": "🧙", "om": "1F9D9", "g": [ "CCV", "B", "R_FRACO", "U", "X", "A" ], "padrao": [ "CCV" ], "faseMin": 65, "mundo": 6, "rima": "UXA", "ini": "B", "rimas": [], "parMinimo": null },
  { "p": "PALHAÇO", "s": [ "PA", "LHA", "ÇO" ], "e": "🤡", "om": "1F921", "g": [ "P", "A", "LH", "Ç", "O" ], "padrao": [ "dígrafo", "regra" ], "faseMin": 74, "mundo": 7, "rima": "AÇO", "ini": "P", "rimas": [ "LAÇO", "BRAÇO" ], "parMinimo": null },
  { "p": "REI", "s": [ "REI" ], "e": "🤴", "om": "1F934", "g": [ "R_FORTE", "E", "I" ], "padrao": [ "regra" ], "faseMin": 73, "mundo": 7, "rima": "EI", "ini": "R_FORTE", "rimas": [], "parMinimo": null },
  { "p": "RAINHA", "s": [ "RA", "I", "NHA" ], "e": "👸", "om": "1F478", "g": [ "R_FORTE", "A", "I", "NH" ], "padrao": [ "dígrafo", "regra" ], "faseMin": 73, "mundo": 7, "rima": "INHA", "ini": "R_FORTE", "rimas": [ "GALINHA", "JOANINHA", "ROSQUINHA" ], "parMinimo": null },
  { "p": "SEREIA", "s": [ "SE", "REI", "A" ], "e": "🧜", "om": "1F9DC", "g": [ "S", "E", "R_FRACO", "I", "A" ], "padrao": [ "CV" ], "faseMin": 59, "mundo": 6, "rima": "EIA", "ini": "S", "rimas": [ "BALEIA", "MEIA" ], "parMinimo": null },
  { "p": "FANTASMA", "s": [ "FAN", "TAS", "MA" ], "e": "👻", "om": "1F47B", "g": [ "F", "A", "NASAL", "T", "CODA_S", "M" ], "padrao": [ "CVC", "nasal" ], "faseMin": 63, "mundo": 6, "rima": "ASMA", "ini": "F", "rimas": [], "parMinimo": null },
  { "p": "ANJO", "s": [ "AN", "JO" ], "e": "👼", "om": "1F47C", "g": [ "A", "NASAL", "J", "O" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "ANJO", "ini": null, "rimas": [], "parMinimo": null },
  { "p": "NINJA", "s": [ "NIN", "JA" ], "e": "🥷", "om": "1F977", "g": [ "N", "I", "NASAL", "J", "A" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "INJA", "ini": "N", "rimas": [], "parMinimo": null },
  { "p": "ZUMBI", "s": [ "ZUM", "BI" ], "e": "🧟", "om": "1F9DF", "g": [ "Z", "U", "NASAL", "B", "I" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "I", "ini": "Z", "rimas": [ "JAVALI", "ABACAXI" ], "parMinimo": null },
  { "p": "VAMPIRO", "s": [ "VAM", "PI", "RO" ], "e": "🧛", "om": "1F9DB", "g": [ "V", "A", "NASAL", "P", "I", "R_FRACO", "O" ], "padrao": [ "nasal" ], "faseMin": 63, "mundo": 6, "rima": "IRO", "ini": "V", "rimas": [], "parMinimo": null },
  { "p": "GÊNIO", "s": [ "GÊ", "NIO" ], "e": "🧞", "om": "1F9DE", "g": [ "G_SUAVE", "E", "N", "I", "O" ], "padrao": [ "regra" ], "faseMin": 76, "mundo": 7, "rima": "ENIO", "ini": "G_SUAVE", "rimas": [], "parMinimo": null },
  { "p": "QUEIXO", "s": [ "QUEI", "XO" ], "e": "🧔", "om": "1F9D4", "g": [ "QU", "E", "I", "X", "O" ], "padrao": [ "dígrafo" ], "faseMin": 75, "mundo": 7, "rima": "EIXO", "ini": "QU", "rimas": [], "parMinimo": { "par": "X/J", "com": "QUEIJO" } },
  { "p": "CHATO", "s": [ "CHA", "TO" ], "e": "😒", "om": "1F612", "g": [ "CH", "A", "T", "O" ], "padrao": [ "dígrafo" ], "faseMin": 71, "mundo": 7, "rima": "ATO", "ini": "CH", "rimas": [ "GATO", "PATO", "RATO", "SAPATO", "PRATO", "JATO" ], "parMinimo": { "par": "X/J", "com": "JATO" } },
  { "p": "CAÇA", "s": [ "CA", "ÇA" ], "e": "🏹", "om": "1F3F9", "g": [ "C", "A", "Ç" ], "padrao": [ "regra" ], "faseMin": 74, "mundo": 7, "rima": "AÇA", "ini": "C", "rimas": [], "parMinimo": { "par": "S/Z", "com": "CASA" } },
  { "p": "CALO", "s": [ "CA", "LO" ], "e": "🩹", "om": "1FA79", "g": [ "C", "A", "L", "O" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "ALO", "ini": "C", "rimas": [ "GALO", "CAVALO" ], "parMinimo": { "par": "C/G", "com": "GALO" } },
  { "p": "BICO", "s": [ "BI", "CO" ], "e": "🐥", "om": "1F425", "g": [ "B", "I", "C", "O" ], "padrao": [ "CV" ], "faseMin": 39, "mundo": 4, "rima": "ICO", "ini": "B", "rimas": [ "PICO" ], "parMinimo": { "par": "P/B", "com": "PICO" } }
 ],
 "ordemEnsino": {
  "A": 11,
  "E": 12,
  "I": 13,
  "O": 14,
  "U": 15,
  "Ã": 18,
  "F": 23,
  "V": 24,
  "M": 25,
  "N": 26,
  "L": 28,
  "S": 29,
  "Z": 29,
  "J": 30,
  "X": 30,
  "P": 35,
  "B": 36,
  "T": 37,
  "D": 38,
  "C": 39,
  "G": 40,
  "S_Z": 47,
  "FREQ": 52,
  "R_FRACO": 59,
  "CODA_S": 60,
  "CODA_Z": 60,
  "CODA_R": 61,
  "CODA_L": 62,
  "NASAL": 63,
  "ÃO": 64,
  "CCV": 65,
  "CH": 71,
  "LH": 72,
  "NH": 72,
  "R_FORTE": 73,
  "RR": 73,
  "Ç": 74,
  "C_SUAVE": 74,
  "SS": 74,
  "QU": 75,
  "GU": 75,
  "G_SUAVE": 76,
  "H": 77,
  "X_VARIOS": 77
 },
 "geradoEm": "2026-10-11T12:11:08.548Z"
};
