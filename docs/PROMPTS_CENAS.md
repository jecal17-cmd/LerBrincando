# Prompts — figuras de cena (Nano Banana)

Gerado em 27/11/2026 (v1.4.10). São as **37 figuras** que ainda aparecem como emoji do aparelho nas histórias e frases, depois que o OpenMoji saiu do jogo. As palavras, os botões, as medalhas, a Lojinha, os avatares e os mundos já têm figura própria.

## Como usar

1. Abra uma conversa nova no Gemini (Nano Banana) e **anexe `docs/referencia_estilo_figuras.jpg`**: são 16 figuras do jogo, a referência de estilo.
2. Cole uma folha por mensagem (A, B e C). Cada folha gera **um único arquivo** em grade.
3. Se alguma célula sair errada, peça só ela: `Redo only cell 7, keep all the others identical.`
4. Envie as folhas ao Claude neste projeto. Ele recorta, inclui os códigos em `CENAS` de `figuras.js` e roda os testes.

Recorte manual, se precisar (as figuras vão para `figuras/cenas/`):

```
python ferramentas/recortar_figuras.py folha_A.png 4 4 figuras/cenas 1F600 1F604 1F642 1F60A 1F60D 1F622 1F61F 1F623 1F620 1F634 1F632 1F62E 1F92B 1F44B 1F44F 1F5E3
python ferramentas/recortar_figuras.py folha_B.png 4 4 figuras/cenas 2728 2753 2757 1F534 1F535 1F389 1F4A6 1F33C 1F940 1F305 1F463 1F4DA 1F4D5 1F524 1F3F4 1F6E2
python ferramentas/recortar_figuras.py folha_C.png 2 3 figuras/cenas 1F6C1 1F483 1F57A 1F423 1F425
node ferramentas/recursos_locais.js
node ferramentas/testar.js
```

Depois do recorte, acrescente os 37 códigos em `CENAS` (`figuras.js`).

## Folha A — rostos e gestos (4 × 4)

```
Match EXACTLY the art style of the attached reference sheet: cute glossy 3D cartoon icons for a children's reading app, chibi proportions, soft rounded shapes, thin slightly darker outline, bright saturated colors with soft gradients and small white specular highlights, pink blush on cheeks, friendly and calm. Faces use the same round glossy yellow ball as the reference face (top-left), with the same eyes, eyelids and blush. Hands use the same light peach skin tone and soft 3D look as the reference hands.

Create ONE single square image (1:1, highest resolution available) laid out as an invisible grid of 4 rows x 4 columns of EQUAL square cells separated by even white gaps. Pure white background (#FFFFFF), no shadows on the background, no frames, no borders, no text, no labels, no numbers. Exactly one illustration per cell, centered, filling about 80% of the cell, nothing touching the cell edges. Read left to right, top to bottom:

1. HAPPY: round yellow face with a big open-mouth smile and open happy eyes
2. LAUGHING: round yellow face laughing, eyes closed in happy upside-down arcs, wide open smile
3. SLIGHT SMILE: round yellow face with a small calm closed-mouth smile, open eyes
4. CONTENT: round yellow face with gently closed smiling eyes, soft smile and extra-rosy cheeks
5. IN LOVE: round yellow face smiling with two red heart-shaped eyes
6. SAD: round yellow face, sad eyebrows, small frown and one blue tear on the cheek
7. WORRIED: round yellow face with raised worried eyebrows and a small wavy mouth
8. OUCH: round yellow face with eyes squeezed shut (> <) and a tight grimacing mouth, as if something just bumped it
9. ANGRY: round face turning red-orange, frowning eyebrows and a pouting mouth, cute not scary
10. SLEEPING: round yellow face with closed eyes, relaxed mouth and three small blue floating letter Z shapes above it
11. ASTONISHED: round yellow face with very wide eyes, raised eyebrows and a large open O mouth
12. OH: round yellow face with round eyes and a small round o-shaped mouth, mildly surprised (clearly calmer than cell 11)
13. SHUSH: round yellow face with an index finger over closed lips, eyes looking sideways, saying "shh"
14. WAVING HAND: one open hand waving hello, tilted, with two small curved motion lines
15. CLAPPING: two hands clapping together, with small motion lines
16. TALKING: a colorful white speech balloon with a light blue outline, empty inside, with three small sound lines next to it
```

## Folha B — sinais e objetos (4 × 4)

```
Match EXACTLY the art style of the attached reference sheet: cute glossy 3D cartoon icons for a children's reading app, chibi proportions, soft rounded shapes, thin slightly darker outline, bright saturated colors with soft gradients and small white specular highlights, friendly and calm. Objects have NO faces.

Create ONE single square image (1:1, highest resolution available) laid out as an invisible grid of 4 rows x 4 columns of EQUAL square cells separated by even white gaps. Pure white background (#FFFFFF), no shadows on the background, no frames, no borders, no labels, no numbers, and no text except where a cell explicitly asks for letters. Exactly one illustration per cell, centered, filling about 80% of the cell, nothing touching the cell edges. Read left to right, top to bottom:

1. SPARKLES: a cluster of three golden four-pointed twinkling stars, one big and two small
2. QUESTION MARK: one big glossy blue 3D question mark
3. EXCLAMATION MARK: one big glossy red 3D exclamation mark
4. RED BALL: one shiny round red ball, like a clown nose, seen from the front
5. BLUE BALL: one shiny round blue ball, same size and shape as cell 4
6. PARTY POPPER: a party popper cone bursting with colorful confetti and streamers
7. WATER SPLASH: three blue water droplets splashing outwards, no face
8. YELLOW FLOWER: one yellow daisy-like flower with rounded yellow petals and an orange center, short green stem with two leaves (clearly not a sunflower)
9. WILTED FLOWER: the same yellow flower as cell 8 but wilted: drooping stem, petals dull brownish-yellow, one petal falling
10. SUNRISE: the sun rising behind green hills, orange and pink morning sky inside a rounded square scene
11. FOOTPRINTS: a short trail of four small bare footprints walking diagonally upward, light brown
12. BOOK STACK: a neat stack of three closed books (red, blue, green), spines facing the viewer, no writing
13. OLD RED BOOK: one thick closed old red book with golden metal corners and a golden clasp, no writing
14. LETTERS: three chunky glossy 3D block letters A, B and C in red, blue and yellow, slightly overlapping
15. PIRATE FLAG: a black pirate flag waving on a wooden pole, with a cute friendly white cartoon skull with crossed bones, not scary
16. OIL CAN: a small metal oil can with a long thin spout, dripping one golden oil drop
```

## Folha C — cenas com personagens (2 × 3)

```
Match EXACTLY the art style of the attached reference sheet: cute glossy 3D cartoon icons for a children's reading app, chibi proportions, soft rounded shapes, thin slightly darker outline, bright saturated colors with soft gradients and small white specular highlights, pink blush on cheeks, friendly and calm. Children look like the girl and boy in the reference (Brazilian kids, about 6 years old).

Create ONE single image laid out as an invisible grid of 2 rows x 3 columns of EQUAL square cells separated by even white gaps. Pure white background (#FFFFFF), no shadows on the background, no frames, no borders, no text, no labels, no numbers. Exactly one illustration per cell, centered, filling about 80% of the cell, nothing touching the cell edges. Read left to right, top to bottom:

1. BATHTUB: a white bathtub on little feet, full of soap bubbles, nobody inside
2. GIRL DANCING: a smiling girl about 6 years old dancing, one arm up, colorful skirt swirling, full body
3. BOY DANCING: a smiling boy about 6 years old dancing, arms out, one knee up, full body
4. HATCHING CHICK: a tiny yellow baby chick peeking out of a cracked white egg shell, top half of the shell on its head
5. BABY CHICK FRONT VIEW: a small pale-yellow baby chick facing the viewer, both little wings open as if saying hi, full body (different pose from a chick seen from the side)
6. (leave this cell completely empty, pure white)
```

## Onde cada figura aparece

| Código | Emoji | Onde aparece |
|---|---|---|
| 1F600 😀 · 1F622 😢 · 1F634 😴 | rostos | h1: "Como os bichos estavam na festa?" |
| 1F623 😣 | dor | h2: pintinho atingido pelo ioiô |
| 1F632 😲 · 1F62E 😮 | espanto | h5 (vovó vê o sapo), h8b (festa acabou) |
| 1F60D 😍 · 1F60A 😊 | carinho, contente | h6: dragão e a flor |
| 1F61F 😟 · 1F604 😄 | preocupada, feliz | h7 (rainha), h8b, h8d, perguntas |
| 1F642 🙂 · 1F620 😠 · 1F92B 🤫 | calma, bravo, silêncio | h8b, perguntas, h8a (robô) |
| 1F44B 👋 · 1F44F 👏 · 1F5E3 🗣️ | gestos | h5 (vovó), h8a (palmas), h8d (livros falam) |
| 2728 ✨ · 2753 ❓ · 2757 ❗ | sinais | h2, h3, h4, h7, h8c, h8d; frase da coroa |
| 1F534 🔴 · 1F535 🔵 | nariz do palhaço | frase "O palhaço tem um nariz vermelho" |
| 1F389 🎉 | festa | h1, h4, h7, h8b |
| 1F4A6 💦 · 1F6C1 🛁 | água | h5 (sapo cai na sopa; opção banheira) |
| 1F33C 🌼 · 1F940 🥀 | flor | fundo de h2, h6 |
| 1F305 🌅 · 1F463 👣 | manhã, passos | h8b (tartaruga) |
| 1F4DA 📚 · 1F4D5 📕 · 1F524 🔤 · 1F3F4 🏴 | biblioteca | h8d |
| 1F6E2 🛢️ · 1F483 💃 · 1F57A 🕺 | robô | h8a (óleo, dançar) |
| 1F423 🐣 · 1F425 🐥 | filhotes | h8c (ninho), h2 (pintinhos) |

🔊 (h8a, barulhão) reaproveita a figura do botão de ouvir (`APELIDO` em `figuras.js`).
