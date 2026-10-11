# Ler Brincando — jogo de alfabetização (português do Brasil) · v1.1

> **Novidades da v1.1**
> - **Visual:** cenário ilustrado e animado em cada um dos 8 mundos (praia, campo, floresta, montanha, rio com trem, caverna de cristais, castelo, biblioteca). O mapa virou uma trilha sinuosa com a Lili marcando a próxima fase. Também há botões "de brinquedo" com degrau 3D, cartões de resposta coloridos, a fonte Baloo 2 na interface (Andika continua nas letras) e uma barra de progresso animada.
> - **Áudio:** vozes neurais naturais (Microsoft Francisca/Thalita via `edge-tts`, ou Kokoro offline), fala em velocidade natural, frases inteiras e karaokê fluido. Veja a seção 4.

Jogo web completo para crianças de **5 a 7 anos** que já conhecem o nome e a forma das letras, mas ainda não ligam **som → letra** dentro das palavras. Usa o **método fônico sistemático e explícito** com **consciência fonológica** (sem método global e sem adivinhar pela imagem).

**Números desta versão:** 8 mundos · **93 fases** · **363 palavras** ilustradas (separação silábica manual) · **11 histórias** (1 oral + 10 decodificáveis) · **17 minijogos** da lista + 11 variações (lição explícita, regra, palavras mágicas etc.) · **15 a 20 elogios** por categoria (8 categorias) · Área dos Pais · autoteste V1–V12 · PWA offline.

---

## 1. Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | Abre o jogo (duplo clique funciona). |
| `styles.css` | Layout *mobile-first*, alto contraste, *reduced motion*. |
| `nucleo.js` | Análise de grafemas (CH, LH, NH, RR, SS, QU, GU, codas, nasais, CCV, R forte/fraco, S com som de Z...), tonicidade, rimas e `slug` dos áudios. |
| `data.js` / `data.json` | **Dados separados da lógica**: palavras, fases, histórias, elogios, falas, regras, loja e medalhas. Gerados por `ferramentas/construir_dados.js`. |
| `motor.js` | Motor pedagógico sem DOM: geradores de itens por fase, decodificabilidade, Leitner, domínio, adaptatividade, elogios, recompensas e avaliação inicial. |
| `validadores.js` | Autoteste V1–V12 (no jogo e no Node). |
| `visual.js` | Cenários SVG de cada mundo e trilha sinuosa do mapa (v1.1). |
| `gerar_audios.bat` / `.sh` | Gera o Banco de Áudio com um clique (Windows / macOS-Linux). |
| `game.js` | Armazenamento, áudio (Banco → voz do navegador), síntese de fonemas, efeitos, música, microfone, mascote, confete. |
| `minijogos.js` | Renderizadores dos minijogos, andaime de 3 níveis, karaokê. |
| `cenas.js` | Cenas: início, perfis, avaliação, mapa, executor de fases, resultado, loja, álbum, medalhas, certificado e Área dos Pais. |
| `sw.js`, `manifest.webmanifest`, `icones/` | PWA: instala na tela inicial e funciona offline. |
| `gerar_audios.py` | Gera o **Banco de Áudio** (Piper pt_BR-faber-medium) em `audio/`. |
| `docs/fichas_pedagogicas.html` | Fichas para imprimir: pré-teste (A), pós-teste equivalente (B), retenção (C), observação, diário, critérios e alertas. |
| `ferramentas/` | Fonte editável dos dados, construtor, testes no Node e robôs de teste no navegador. |

**Para editar o conteúdo:** altere `ferramentas/fonte_palavras.js` ou `ferramentas/fonte_dados.js`, rode `node ferramentas/construir_dados.js` e depois `node ferramentas/testar.js`. Se algum validador reprovar, corrija antes de publicar.

---

## 2. Resumo do plano

**Sequência de ensino (validada por V9):** A → E → I → O → U → Ã → F → V → M → N → L → S/Z → J/X → P → B → T → D → C → G → S entre vogais (=Z) → palavras mágicas → R fraco → S/Z no fim da sílaba → R no fim → L no fim → M/N nasais → ÃO → consoantes juntinhas (CCV) → CH → LH/NH → R forte/RR → Ç/SS/C suave → QU/GU → G suave → H inicial/X mágico.

**Decisões pedagógicas que valem registrar:**
- **S entre vogais (CASA)** soa /z/, então foi tratado como regra própria (5.1) antes de qualquer leitura de CASA, MESA ou VASO.
- **R fraco (PERA)** entra no Mundo 6 junto com as sílabas complexas, e o **R forte/RR** no Mundo 7. A sílaba "RA" isolada é pronunciada com R forte, então o R fraco é ensinado **só dentro de palavras**.
- **Pares S/Z e X/J com palavras** (CASA/CAÇA, QUEIXO/QUEIJO) aparecem no Mundo 7, porque exigem Ç e QU. No Mundo 3 esses contrastes são treinados **pelo som** (lições 3.7 e 3.8 com o parceiro como distrator).
- **Palavras com E inicial + S** (ESCOLA → "iscola") e vogais nasais iniciais (ANJO, ÔNIBUS) **não** são usadas para treinar o som das vogais.
- **Palavras frequentes** não decodificáveis (NÃO, QUE, TEM, COM, UM, EM, SÃO, ESTÁ, PARA, AQUI) são ensinadas explicitamente na fase 5.6, antes de aparecerem em histórias.

### Mundo 1 — Ilha dos Sons (praia)
Consciência fonológica (sem letras)

| Fase | Nome | Minijogo(s) | Unidades novas |
|---|---|---|---|
| 1.1 | Rima Maluca | Rima Maluca | — |
| 1.2 | Bate-Palmas | Bate-Palmas | — |
| 1.3 | Começa Igual | Qual som começa? | — |
| 1.4 | Termina Igual | Termina igual | — |
| 1.5 | Junta-Junta | Junta-Junta (síntese) | — |
| 1.6 | Bate-Palmas Gigante | Bate-Palmas | — |
| 1.7 | Some-Some | Some-Some (tirar sílaba/som) | — |
| 1.8 | Troca-Troca | Troca-Troca (oral) | — |
| 1.9 | Memória das Rimas | Memória Som-Imagem | — |
| 1.10 | História: O Gato de Sapato | História interativa (karaokê) | — |
| 1.11 | Desafio do Guardião da Ilha | Desafio do Guardião (revisão geral): Rima Maluca, Bate-Palmas, Qual som começa?, Termina igual, Junta-Junta (síntese), Some-Some (tirar sílaba/som), Troca-Troca (oral) | — |

### Mundo 2 — Vale das Vogais (campo florido)
Vogais A, E, I, O, U, abertas/fechadas e Ã

| Fase | Nome | Minijogo(s) | Unidades novas |
|---|---|---|---|
| 2.1 | O som do A | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | A |
| 2.2 | O som do E | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | E |
| 2.3 | O som do I | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | I |
| 2.4 | O som do O | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | O |
| 2.5 | O som do U | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | U |
| 2.6 | Caça às Vogais | Caça ao Som | — |
| 2.7 | Traçado Mágico das Vogais | Traçado Mágico | — |
| 2.8 | O som do Ã | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | Ã |
| 2.9 | Boca Aberta, Boca Fechada | Boca aberta/fechada (É/Ê, Ó/Ô) | — |
| 2.10 | Bingo das Vogais | Bingo de Sílabas | — |
| 2.11 | História: Oi, Ioiô! | História interativa (karaokê) | — |
| 2.12 | Desafio do Guardião do Vale | Desafio do Guardião (revisão geral): Caça ao Som, Qual som começa?, Boca aberta/fechada (É/Ê, Ó/Ô), Rima Maluca, Bate-Palmas | — |

### Mundo 3 — Floresta Sussurrante (floresta)
Consoantes contínuas F V M N L S Z J X + sílabas

| Fase | Nome | Minijogo(s) | Unidades novas |
|---|---|---|---|
| 3.1 | O som do F | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | F |
| 3.2 | O som do V | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | V |
| 3.3 | O som do M | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | M |
| 3.4 | O som do N | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | N |
| 3.5 | Nome ou Som? | Nome ou Som? | — |
| 3.6 | O som do L | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | L |
| 3.7 | Os sons do S e do Z | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | S, Z |
| 3.8 | Os sons do J e do X | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | J, X |
| 3.9 | Bingo de Sílabas | Bingo de Sílabas | — |
| 3.10 | Leia e Encontre | Leia e Encontre | — |
| 3.11 | História: A Mala da Vovó | História interativa (karaokê) | — |
| 3.12 | Desafio do Guardião da Floresta | Desafio do Guardião (revisão geral): Caça ao Som, Leia e Encontre, Qual som começa?, Nome ou Som? | — |

### Mundo 4 — Montanha dos Gêmeos (montanha)
Oclusivas P B T D C G + pares mínimos

| Fase | Nome | Minijogo(s) | Unidades novas |
|---|---|---|---|
| 4.1 | O som do P | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | P |
| 4.2 | O som do B | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | B |
| 4.3 | O som do T | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | T |
| 4.4 | O som do D | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | D |
| 4.5 | O som do C | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | C |
| 4.6 | O som do G | Lição explícita (Eu mostro → Fazemos juntos → Agora é você) + Caça ao Som + Qual som começa? + Traçado | G |
| 4.7 | Gêmeos Diferentes: P e B | Gêmeos Diferentes (P/B) | — |
| 4.8 | Gêmeos Diferentes: T e D | Gêmeos Diferentes (T/D) | — |
| 4.9 | Gêmeos Diferentes: F/V e C/G | Gêmeos Diferentes (F/V, C/G) | — |
| 4.10 | Letra Perdida | Letra Perdida | — |
| 4.11 | História: A Pipa do Macaco | História interativa (karaokê) | — |
| 4.12 | Desafio do Guardião da Montanha | Desafio do Guardião (revisão geral): Gêmeos Diferentes, Letra Perdida, Caça ao Som, Leia e Encontre | — |

### Mundo 5 — Rio das Palavras (rio com trem)
Palavras com sílabas simples (CV)

| Fase | Nome | Minijogo(s) | Unidades novas |
|---|---|---|---|
| 5.1 | Descoberta: S com som de Z | Descoberta da regra + escrita certa / Leia e Encontre | S_Z |
| 5.2 | Fábrica de Palavras | Fábrica de Palavras | — |
| 5.3 | Trem das Sílabas | Trem das Sílabas | — |
| 5.4 | Fatiador | Fatiador | — |
| 5.5 | Leia e Encontre | Leia e Encontre | — |
| 5.6 | Palavras Mágicas | Palavras mágicas (frequentes) | FREQ |
| 5.7 | Ditado Mágico | Ditado Mágico | — |
| 5.8 | Troca-Letra Mágica | Troca-Letra Mágica | — |
| 5.9 | Memória Som-Imagem | Memória Som-Imagem | — |
| 5.10 | Leitura de Frase | Leitura de Frase | — |
| 5.11 | História: O Sapo na Sopa | História interativa (karaokê) | — |
| 5.12 | Desafio do Guardião do Rio | Desafio do Guardião (revisão geral): Leia e Encontre, Fábrica de Palavras, Gêmeos Diferentes, Letra Perdida, Troca-Letra Mágica, Leitura de Frase | — |

### Mundo 6 — Caverna dos Cristais (caverna)
Sílabas complexas (CVC, CCV) e nasais

| Fase | Nome | Minijogo(s) | Unidades novas |
|---|---|---|---|
| 6.1 | Descoberta: R fraquinho | Descoberta da regra + escrita certa / Leia e Encontre | R_FRACO |
| 6.2 | Descoberta: S e Z no fim da sílaba | Descoberta da regra + escrita certa / Leia e Encontre | CODA_S, CODA_Z |
| 6.3 | Descoberta: R no fim da sílaba | Descoberta da regra + escrita certa / Leia e Encontre | CODA_R |
| 6.4 | Descoberta: L no fim da sílaba | Descoberta da regra + escrita certa / Leia e Encontre | CODA_L |
| 6.5 | Descoberta: M e N nasais | Descoberta da regra + escrita certa / Leia e Encontre | NASAL |
| 6.6 | Descoberta: o som ÃO | Descoberta da regra + escrita certa / Leia e Encontre | ÃO |
| 6.7 | Descoberta: consoantes juntinhas | Descoberta da regra + escrita certa / Leia e Encontre | CCV |
| 6.8 | Trem dos Cristais | Trem das Sílabas | — |
| 6.9 | Ditado dos Cristais | Ditado Mágico | — |
| 6.10 | Microfone Mágico | Microfone Mágico | — |
| 6.11 | História: O Dragão e a Flor | História interativa (karaokê) | — |
| 6.12 | Desafio do Guardião da Caverna | Desafio do Guardião (revisão geral): Leia e Encontre, escrita, Gêmeos Diferentes, Fatiador, Troca-Letra Mágica | — |

### Mundo 7 — Castelo das Regras (castelo)
Dígrafos e regras contextuais

| Fase | Nome | Minijogo(s) | Unidades novas |
|---|---|---|---|
| 7.1 | Regra: CH | Descoberta da regra + escrita certa / Leia e Encontre | CH |
| 7.2 | Regra: LH e NH | Descoberta da regra + escrita certa / Leia e Encontre | LH, NH |
| 7.3 | Regra: R forte e RR | Descoberta da regra + escrita certa / Leia e Encontre | R_FORTE, RR |
| 7.4 | Regra: Ç, SS e C com som de S | Descoberta da regra + escrita certa / Leia e Encontre | Ç, C_SUAVE, SS |
| 7.5 | Regra: QU e GU | Descoberta da regra + escrita certa / Leia e Encontre | QU, GU |
| 7.6 | Regra: G com som de J | Descoberta da regra + escrita certa / Leia e Encontre | G_SUAVE |
| 7.7 | Regra: H mudo e X mágico | Descoberta da regra + escrita certa / Leia e Encontre | H, X_VARIOS |
| 7.8 | Gêmeos do Castelo: S/Z e X/J | Gêmeos Diferentes (S/Z, X/J) | — |
| 7.9 | Letra Perdida das Regras | Letra Perdida | — |
| 7.10 | Ditado do Castelo | Ditado Mágico | — |
| 7.11 | História: A Chave do Castelo | História interativa (karaokê) | — |
| 7.12 | Desafio do Guardião do Castelo | Desafio do Guardião (revisão geral): escrita, Letra Perdida, Gêmeos Diferentes, Leia e Encontre, Troca-Letra Mágica | — |

### Mundo 8 — Biblioteca Encantada (biblioteca)
Histórias, fluência e compreensão

| Fase | Nome | Minijogo(s) | Unidades novas |
|---|---|---|---|
| 8.1 | Leitura de Frases | Leitura de Frase | — |
| 8.2 | História: O Robô que Queria Dançar | História interativa (karaokê) | — |
| 8.3 | Microfone Mágico: Eu Leio! | Microfone Mágico | — |
| 8.4 | História: A Tartaruga Apressada | História interativa (karaokê) | — |
| 8.5 | Todos os Gêmeos | Gêmeos Diferentes (todos) | — |
| 8.6 | História: O Ninho no Telhado | História interativa (karaokê) | — |
| 8.7 | Frases Divertidas | Leitura de Frase | — |
| 8.8 | História: Lili e a Biblioteca Encantada | História interativa (karaokê) | — |
| 8.9 | Grande Ditado | Ditado Mágico | — |
| 8.10 | Desafio Final do Guardião da Biblioteca | Desafio do Guardião (revisão geral): Leitura de Frase, escrita, Gêmeos Diferentes, Leia e Encontre, Troca-Letra Mágica, Letra Perdida | — |

### Histórias

| # | Mundo | Título | Frases | Lacunas | Perguntas (inferência) |
|---|---|---|---|---|---|
| 1 | 1 | O Gato de Sapato (oral, rimas) | 7 | 5 | 3 (1) |
| 2 | 2 | Oi, Ioiô! | 6 | 3 | 2 (1) |
| 3 | 3 | A Mala da Vovó | 10 | 5 | 3 (1) |
| 4 | 4 | A Pipa do Macaco | 9 | 4 | 3 (1) |
| 5 | 5 | O Sapo na Sopa | 8 | 4 | 3 (1) |
| 6 | 6 | O Dragão e a Flor | 10 | 4 | 3 (1) |
| 7 | 7 | A Chave do Castelo | 9 | 5 | 3 (1) |
| 8 | 8 | O Robô que Queria Dançar | 8 | 4 | 3 (1) |
| 9 | 8 | A Tartaruga Apressada | 8 | 4 | 3 (1) |
| 10 | 8 | O Ninho no Telhado | 8 | 4 | 3 (1) |
| 11 | 8 | Lili e a Biblioteca Encantada | 9 | 4 | 3 (1) |

---

## 3. Como usar

**Abrir no computador:** dê duplo clique em `index.html`. Funciona na hora, com a voz do navegador. Para o modo offline (Service Worker), o microfone e o carregamento automático do `manifest.json`, o jogo precisa estar em `http(s)`. Para isso, rode um servidor local:

```bash
cd ler-brincando
python -m http.server 8000      # abra http://localhost:8000
```

**Hospedar grátis:**
- **GitHub Pages:** crie um repositório, envie todos os arquivos (incluindo `audio/`, se gerado) e ative em *Settings → Pages → Deploy from branch → main / root*.
- **Netlify:** arraste a pasta em app.netlify.com/drop.

**Instalar como app no celular:**
- **Android (Chrome):** abra o endereço, toque em ⋮ e depois em **Adicionar à tela inicial**.
- **iPhone/iPad (Safari):** toque em **Compartilhar** e depois em **Adicionar à Tela de Início**.

Depois do primeiro acesso, o jogo funciona em modo avião (exceto o microfone).

**Primeiro uso:** toque em "Toque para começar" (isso desbloqueia o áudio no iOS). Em seguida, um adulto digita o nome da criança, a criança escolhe a figura, e a **avaliação inicial lúdica** (cerca de 5 minutos, 15 itens) posiciona a criança entre o Mundo 1 e o Mundo 4.

---

## 4. Banco de Áudio — vozes neurais naturais (v1.1)

O jogo **funciona sem o banco**, mas a qualidade da voz depende do navegador. Para o som **natural e igual em todos os aparelhos**, gere o banco uma vez:

**Windows (mais fácil):** dê duplo clique em `gerar_audios.bat`.
1. Ele cria um ambiente Python e instala `edge-tts`, `numpy`, `soundfile`, `librosa` e `pyloudnorm`.
2. Gera **12 sons de amostra** em `audio_amostra/` (palavras, sílabas, fonemas, uma frase e uma história). Escute-os.
3. Se gostar, confirme para gerar o banco completo (1.623 itens + versões lentas, de 10 a 20 minutos).

**macOS/Linux:** `./gerar_audios.sh`

| Motor | Comando | Qualidade | Observação |
|---|---|---|---|
| **edge** (padrão) | `python gerar_audios.py` | ★★★★★ voz neural Microsoft | Precisa de internet só durante a geração. Dá os tempos de cada palavra, então o karaokê fica exato com a frase falada de forma contínua. |
| edge, outra voz | `--voz pt-BR-ThalitaMultilingualNeural` ou `--voz pt-BR-AntonioNeural` | ★★★★★ | Rode antes `--amostra` para comparar. Use `--refazer` para trocar a voz de um banco já existente. |
| **kokoro** | `--motor kokoro` | ★★★★ | 100% offline, licença Apache-2.0 (`pip install kokoro`), voz `pf_dora`. |
| piper | `--motor piper` | ★★ | A voz da v1.0, a mais robótica. |

**Fonemas contínuos (M, S, F...):** o script pede à voz o som alongado ("mmmmmm", "ssssss") e verifica se não saiu uma vogal (sinal de que a voz soletrou). Se o som alongado falhar, recorta a consoante da sílaba de apoio ("ma"). Se o recorte também falhar, usa `--wikimedia`. As oclusivas (P, B, T, D, C, G) sempre tocam dentro da sílaba.

Ao final, copie ou mantenha a pasta `audio/` ao lado do `index.html` (ela inclui `manifest.js`, então funciona até com duplo clique). Escute 100% dos fonemas e das sílabas em **Área dos Pais → Banco de Áudio** antes do piloto.

**Licenças:** o `edge-tts` usa o serviço online de leitura em voz alta do Microsoft Edge. Para uso pessoal ou educativo, tudo bem. Para **publicar ou vender**, gere com **Azure Speech** (as mesmas vozes; a camada gratuita cobre 500 mil caracteres por mês) ou com **Kokoro** (Apache-2.0).

### Sem o banco: o que mudou na voz do navegador (v1.1)
- **Escolha automática da voz mais natural:** Edge "Francisca/Thalita Online (Natural)" → Google pt-BR → Luciana aprimorada (iOS). Vozes antigas como "Maria Desktop" ficam por último. O ⭐ marca a voz recomendada na Área dos Pais.
- **Velocidade natural (1,0):** antes era 0,85, o que deixava a fala arrastada. O modo 🐢 usa 0,8.
- **Frases faladas de uma vez só**, com entonação natural, em vez de picotar palavra por palavra.
- **Karaokê com a frase inteira:** destaque pelo evento `boundary` ou por estimativa de tempo. O modo antigo, palavra por palavra, continua disponível na Área dos Pais.
- **Fonemas:** som alongado ("mmmm") com vozes naturais e sílaba de apoio com vozes antigas. O zumbido sintético da v1.0 agora é opcional.
- Quando a voz do aparelho é robótica, a Área dos Pais mostra um aviso recomendando o Edge/Chrome ou o Banco de Áudio.

---

## 5. Autoteste

- Abra `index.html?debug=1` (o autoteste roda sozinho e aparece o botão 🐞) ou entre em **Área dos Pais → 🧪 Autoteste**.
- No computador: `node ferramentas/testar.js` (V1–V12) e `node ferramentas/testes_funcionais.js` (T09, T12, T14, T15, T16, T18 e adaptatividade).
- No navegador (robôs): `python ferramentas/teste_navegador.py 1.1,3.1,4.11` joga as fases pela interface respondendo certo. `python ferramentas/teste_avaliacao.py` testa a avaliação inicial. É preciso ter o Playwright instalado.
- **Simular data (T15):** Autoteste → "+1, +2, +4, +7 dias".

---

## 6. Lista de verificação de testes

### 6.1 O que já foi verificado nesta entrega
- **Node:** validadores V1–V10 aprovados. V11 e V12 ficam pendentes até gerar o banco; a lógica deles foi testada com um manifest sintético: aprova o banco completo e reprova corretamente quando falta um item ou há um áudio silencioso.
- **Node:** casos funcionais T09, T12, T14, T15, T16 e T18 aprovados, além do teste de adaptatividade (3 erros → de 4 para 3 opções).
- **Chromium headless (celular 390×844, tablet 820×1180, desktop 1280×800):** um robô jogou pela interface, respondendo certo, as fases **1.1, 1.2, 1.5, 1.7, 1.9, 1.10, 2.1, 2.7, 2.10, 3.1, 3.5, 3.9, 3.12, 4.7, 4.11, 5.1–5.10, 6.10 e 7.9**. Isso cobre todos os tipos de minijogo (incluindo traçado, trem, fatiador, ditado, memória, bingo, microfone com confirmação do adulto, história com karaokê e guardião) e a avaliação inicial. Resultado: **0 erros de JavaScript**.
- **Contraste (WCAG):** texto 14,3:1; texto secundário 7,3:1; branco sobre azul 4,7:1; branco sobre verde 5,0:1.
- **Limites do ambiente de teste:** não havia voz real (a fala foi simulada), fonte de emoji nem acesso ao CDN do OpenMoji. Por isso, **a voz, as imagens e o arrastar com o dedo precisam ser conferidos em aparelhos reais** (tabela abaixo).

### 6.2 Matriz de compatibilidade (preencher nos aparelhos)

| Ambiente | Voz pt-BR | Karaokê | Arrastar | Microfone | Offline/PWA | Salvamento |
|---|---|---|---|---|---|---|
| Windows – Chrome | ☐ | ☐ | ☐ (mouse) | ☐ | ☐ | ☐ |
| Windows – Edge (voz Natural) | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| macOS – Safari | ☐ | ☐ | ☐ | parcial ☐ | ☐ | ☐ |
| Android – Chrome (celular e tablet) | ☐ | ☐ (alternativa sem boundary) | ☐ (toque) | ☐ | ☐ | ☐ |
| iOS/iPadOS – Safari | ☐ (após toque) | ☐ (alternativa) | ☐ | parcial ☐ | ☐ | ☐ |
| Firefox | ☐ | ☐ | ☐ | oculto ☐ | ☐ | ☐ |

### 6.3 Casos T01–T18

| ID | Caso | Como o jogo atende | Status |
|---|---|---|---|
| T01 | 1º acesso no iOS | Tela "Toque para começar" fala/toca áudio **dentro do gesto** e cria o AudioContext | ☐ testar no iPhone |
| T02 | Sem voz pt-BR | Ordem de escolha: Natural/Neural → Google pt-BR → pt-BR → pt-PT, com aviso na Área dos Pais; o banco cobre os sons principais | ☐ aparelho |
| T03 | Falas longas | Fila de falas + divisão por pontuação + *timeout* de segurança | ☐ aparelho |
| T04 | Música + voz | *Ducking* automático (`Musica.abaixar`) | ☐ aparelho |
| T05 | Arrastar sílaba no celular | Pointer Events + `touch-action: none` + alternativa tocar→tocar (testada pelo robô) | ☐ aparelho (arraste) |
| T06 | Girar o aparelho | Layout fluido; o estado fica no executor (sem recarregar) | ☐ aparelho |
| T07 | Microfone negado/sem suporte | Microfone oculto; aparecem "Adulto confirma / Pular" | ✔ robô (sem microfone) |
| T08 | Reconhecimento erra 2× | Aparecem as opções do adulto; nunca bloqueia | ☐ aparelho |
| T09 | Fechar no meio da fase | Salva após cada item + `pagehide` | ✔ Node |
| T10 | Modo avião | Service Worker (núcleo + áudio + imagens já vistas) | ☐ aparelho |
| T11 | Exportar/importar JSON | Área dos Pais → Perfis e dados | ☐ manual |
| T12 | Vários perfis | Progresso por perfil (até 4) | ✔ Node |
| T13 | Banco presente/ausente | `manifest.js`/`manifest.json` → banco; senão voz do navegador + aviso | ✔ ausente / ☐ presente |
| T14 | Domínio < 85% | Próxima fase trancada + "Treinar de novo" e "Revisão" | ✔ Node |
| T15 | Revisão espaçada | +1/+2/+4/+7 dias: o item volta (caixas 1→4) | ✔ Node |
| T16 | Repetição de elogios | Janela de 5 sem repetição em 50 acertos | ✔ Node |
| T17 | Limite de tempo | Pausa sugerida (padrão 20 min) e limite diário (padrão 40 min) | ☐ manual |
| T18 | Acesso à Área dos Pais | Desafio de multiplicação 6–9 × 6–9 | ✔ |

**Regressão:** depois de qualquer alteração, rode `node ferramentas/testar.js` e repita T01, T05, T09 e T14.

---

## 7. Limitações conhecidas e como contornar

| Limitação | Contorno |
|---|---|
| O **Banco de Áudio não acompanha** o pacote (a IA não gera arquivos de áudio). | Rode `gerar_audios.py` (seção 4). Até lá, os fonemas contínuos usam **síntese Web Audio + sílaba de apoio**, que é uma aproximação. Gere o banco antes do piloto. |
| Recorte automático de fonema pode errar a fronteira. | Escuta humana obrigatória (seção 13.2a) + `--wikimedia` para os que falharem. |
| A voz do navegador varia por aparelho e pode ler sílabas soltas de forma estranha. | O banco resolve. No iOS, instale a voz "Luciana" (pt-BR) em Ajustes → Acessibilidade → Conteúdo Falado. |
| Abrindo por duplo clique (`file://`): sem offline, sem microfone e sem `fetch` do manifest. | Use `manifest.js` (gerado pelo script) ou hospede em `https`/`localhost`. |
| **OpenMoji** vem do CDN: a primeira visita precisa de internet. | O Service Worker guarda em cache. Sem internet, aparece o emoji nativo do sistema. |
| Emojis recentes (🪼 🫏 🪿 🫛 🪮) podem não existir em sistemas antigos. | O OpenMoji 16 cobre todos. A troca para emoji nativo só ocorre se o SVG falhar. |
| Reconhecimento de fala infantil é impreciso; Firefox não tem; Safari é parcial. | Desligado por padrão, com consentimento do adulto; nunca bloqueia (adulto confirma / pular). |
| O evento `boundary` falha no Android/Safari. | Padrão = uma fala por palavra encadeada por `onend`. Com o banco, o karaokê usa os tempos do manifest. |
| Variação regional (E/O átonos finais, L final, R final). | Regras explícitas (L no fim soa U, R no fim etc.). Palavras com "ES-" inicial não treinam o som do E. |
| Lighthouse não foi executado neste ambiente. | Rode no Chrome DevTools após hospedar (metas: Performance ≥ 85 e Acessibilidade ≥ 90). |
| O bot de 50% não passa da fase 1.1 (domínio < 85%), por desenho. | É o comportamento esperado: a criança recebe andaimes e revisão. Se uma criança real ficar presa, o adulto pode liberar fases manualmente. |

---

## 8. Rubrica metodológica preenchida (autoavaliação com evidências)

Pontos = nota ÷ 3 × peso. ★ = crítico (não pode ficar abaixo de 2).

| Critério | Nota | Peso | Pontos | Evidência (arquivo / função / fase) |
|---|---|---|---|---|
| A1 ★ Consciência fonológica | 3 | 6 | 6,0 | Mundo 1 sem letras: rima (1.1), contagem (1.2, 1.6), som inicial (1.3), som final (1.4), síntese (1.5), **manipulação** tirar sílaba/som (1.7) e trocar (1.8). Retomada: `misturarRevisao()` intercala fases anteriores; guardião 2.12 inclui rima e palmas. |
| A2 ★ Som→letra explícito | 3 | 8 | 8,0 | `G.licao()` (motor.js): `mostraSom` ("Eu mostro") → 2 itens `guiado` ("Fazemos juntos", resposta brilhando) → `marco` "Agora é você!" → itens independentes → traçado. Dica articulatória por fonema (`dicasFonema`) falada no "Eu mostro" e incluída no banco (`listaAudios`). Fases 2.1–2.5, 2.8, 3.1–3.8, 4.1–4.6. |
| A3 ★ Nome × som | 3 | 4 | 4,0 | Decodificação usa `S.fon()`; o nome só aparece em "O nome desta letra é… mas o som é…" (`MJ.mostra`). Minijogo específico **Nome ou Som?** (`G.nomeSom`, fase 3.5). |
| A4 ★ Pares mínimos | 3 | 7 | 7,0 | P/B, T/D, F/V, C/G com imagem e áudio (4.7–4.9); S/Z e X/J com palavras (7.8) e pelo som desde 3.7/3.8; todos em 8.5 e guardiões. Confusões por par e direção (`perfil.conf`, `confDir`), item extra adaptativo do par mais confundido (`misturarRevisao`, passo 3), painel "Pares mais confundidos". |
| A5 Variações de grafia | 3 | 4 | 4,0 | `D.regras` com **descoberta + exemplos + contraexemplos** (`MJ.regraMostra`): S/Z (5.1), codas, nasais e M antes de P/B (6.2–6.6), CH, LH/NH, R/RR, Ç/SS/C, QU/GU, G/J, H, X (7.1–7.7). Itens "escrita certa" com erros típicos (`TRANSF`). |
| A6 Tratamento técnico do fonema | **2** | 6 | 4,0 | Contínuas prolongadas (banco: recorte + *time-stretch*; sem banco: `Sintese.fonema` + sílaba de apoio); oclusivas sempre em sílaba (`tocarSeg`); nunca usa o nome no lugar do som. Pipeline completo (`gerar_audios.py`, manifest com tempos, painel de origem). **Nota 2 porque o banco precisa ser gerado pelo usuário e ainda não foi escutado.** |
| B1 ★ Sequência cumulativa | 3 | 7 | 7,0 | Ordem da seção 2.2 (`fases[].novos`); decodificabilidade **calculada** por `Nucleo.analisar`; validadores **V2 e V9 aprovados** (3.010 usos verificados). |
| B2 ★ Critério de domínio | 3 | 6 | 6,0 | `concluirFase`: libera só com ≥ 85% na fase **e** nas últimas 10 tentativas (`dominioHab`). Domínio por grafema (`perfil.graf`) e por tipo (`habTipo`) no **mapa de calor**. |
| B3 Revisão espaçada | **2** | 5 | 3,3 | Leitner 1-2-4-7 (`registrar`, `INTERVALOS`); cerca de 25% de revisão priorizando itens com mais erros (`misturarRevisao`). **Nota 2 porque memória, bingo, traçado, microfone e histórias não recebem itens de revisão intercalados.** |
| B4 Adaptatividade e andaimes | 3 | 4 | 4,0 | `perfil.ajuste[tipo]`: 3 erros → menos opções (`nOpc`) e, no nível 2, cada opção é lida em voz alta; 5 acertos fáceis → menos apoio. Ajuste **por minijogo**. |
| B5 Avaliação inicial | 3 | 3 | 3,0 | `itensAvaliacao` (15 itens, cerca de 5 min) + `posicionar` (Mundo 1 a 4); pode ser refeita; relatório no painel. |
| C1 ★ Decodificação | 3 | 5 | 5,0 | **Leia e Encontre** sem áudio da palavra (`semAudioPalavra`); só as sílabas tocam. Fábrica, Troca-Letra e Frase. Tempo de resposta por minijogo (`perfil.tr`) no painel. |
| C2 ★ Codificação | 3 | 5 | 5,0 | Ditado com teclado progressivo (`letrasTeclado`), Letra Perdida, Troca-Letra, escrita certa; **traçado com verificação de início, fim e forma** (`confereTraco`, detecta traço invertido). |
| C3 ★ Textos decodificáveis | 3 | 5 | 5,0 | 10 histórias escritas entre 96,2% e 100% decodificáveis; exceções só NÃO/QUE (ensinadas na fase 5.6); frases das fases ≥ 95%. **Relatório automático V3.** |
| C4 Fluência | 3 | 3 | 3,0 | Karaokê por palavra e **sílaba a sílaba** (`karaoke`, `silabaPorSilaba`), 🔊 reler, 🐢 lento, "Eu leio!" com destaque das palavras reconhecidas; "Ouça sua voz" (gravação local) no Microfone Mágico. |
| C5 Compreensão | 3 | 2 | 2,0 | 2 ou 3 perguntas com imagens por história, sendo **1 de inferência em cada uma** (`inf: true` + `explica`). |
| D1 ★ Feedback corretivo | 3 | 6 | 6,0 | Andaime: 1º erro → repete mais devagar; 2º → dica específica (`dicaEspecifica`: par mínimo, regra ou tipo) e elimina uma opção; 3º → destaca a resposta. Sem X vermelho nem vidas. O item errado volta na fase. |
| D2 Elogios | 3 | 4 | 4,0 | 15–20 por categoria, janela de 5 sem repetição (V6/T16), esforço/estratégia; elogios específicos citam som, sílaba ou palavra (`elogioEspecifico`). |
| D3 Evolução saudável | 3 | 4 | 4,0 | Estrelas, moedas (dadas pelo **domínio**), XP, 8 níveis, mascote que evolui, álbum (palavra certa 2×), 12 medalhas, certificado por mundo, baú diário sem sequência, pausa sugerida. |
| D4 ★ Autonomia sem leitura | 3 | 3 | 3,0 | Toda instrução é falada; 🔊 e 🐢 sempre visíveis; ícones; **demonstração com mãozinha animada** na 1ª vez de cada minijogo (`mostrarMao`). |
| D5 Carga cognitiva e acessibilidade | 3 | 3 | 3,0 | Até 4 opções; Andika; contraste AA medido; `prefers-reduced-motion`; alvos ≥ 56 px; modos **alto contraste** e **menos estímulos**. |
| **Total** | | **100** | **96,3 / 100** | **Aprovado: ≥ 85 e nenhum ★ abaixo de 2.** |

> Esta é uma autoavaliação. A seção 13.2a pede revisão independente por alfabetizador(a) ou fonoaudiólogo(a) antes do piloto.

---

## 9. Relatório dos validadores V1–V12

Gerado por `node ferramentas/testar.js`. **Resultado geral: APROVADO (com pendências de áudio).**

| ID | Validador | Status | Resumo |
|---|---|---|---|
| V1 | Integridade silábica | **APROVADO** | 363 palavras conferidas |
| V2 | Decodificabilidade das fases | **APROVADO** | 3010 usos de palavras escritas verificados em 4 gerações |
| V3 | Decodificabilidade das histórias e frases | **APROVADO** | h1 oral; h2 100%; h3 100%; h4 100%; h5 96.2%; h6 98.5%; h7 100%; h8a 100%; h8b 100%; h8c 100%; h8d 100% |
| V4 | Pares mínimos | **APROVADO** | 14 pares; P/B, T/D, F/V, C/G, S/Z, X/J |
| V5 | Imagens | **APROVADO** | 363 palavras com emoji e código OpenMoji; 0 emojis repetidos |
| V6 | Banco de elogios | **APROVADO** | acerto: 20 · sequencia3: 15 · sequencia5: 15 · sequencia10: 15 · aposErro: 15 · somNovo: 15 · fasePerfeita: 15 · mundoConcluido: 15 |
| V7 | Distratores | **APROVADO** | 2838 itens de escolha verificados |
| V8 | Volume de conteúdo | **APROVADO** | 363 palavras · 93 fases · 11 histórias · 17/17 minijogos da lista (+ somFinal, juntar, tirar, trocar, historia, licao, abertoFechado, nomeSom, regra, somS, freq, escrita, guardiao) |
| V9 | Sequência | **APROVADO** | ordem de ensino: A@2.1 E@2.2 I@2.3 O@2.4 U@2.5 Ã@2.8 F@3.1 V@3.2 M@3.3 N@3.4 L@3.6 S@3.7 Z@3.7 J@3.8 X@3.8 P@4.1 B@4.2 T@4.3 D@4.4 C@4.5 G@4.6 S_Z@5.1 FREQ@5.6 R_FRACO@6.1 CODA_S@6.2 CODA_Z@6.2 CODA_R@6.3 CODA_L@6.4 NASAL@6.5 ÃO@6.6 CCV@6.7 CH@7.1 LH@7.2 NH@7.2 R_FORTE@7.3 RR@7.3 Ç@7.4 C_SUAVE@7.4 SS@7.4 QU@7.5 GU@7.5 G_SUAVE@7.6 H@7.7 X_VARIOS@7.7 |
| V10 | Simulação de jogador | **APROVADO** | Bot 100%: concluiu 93/93 fases em 93 jogadas. Bot 90%: chegou à fase final (concluiu) em 135 jogadas (rejogando quando < 85%). Bot 50%: 34 andaimes, 4 reduções de dificuldade (nível máx. 2), máx. 4 tentativas por item, parou por domínio < 85% na fase 1.1 com a fase sempre rejogável e revisão oferecida (sem beco sem saída). |
| V11 | Cobertura do Banco de Áudio | **PENDENTE** | 1623 itens de áudio necessários |
| V12 | Tempos do karaokê | **PENDENTE** | Sem manifest: o karaokê usa a alternativa (uma fala por palavra/sílaba, encadeadas por onend). |

V11 e V12 ficam **PENDENTES** até a pasta `audio/` existir. A lógica deles foi testada com um manifest sintético: aprova o banco completo e reprova corretamente quando falta um item ou há um áudio silencioso.

**Casos funcionais (Node):**

- **T14 Domínio < 85%** — APROVADO: precisão 63% → fase 1.2 trancada = true; revisão rápida disponível a partir da fase 1.2 (6 itens gerados)
- **T15 Revisão espaçada (Leitner 1-2-4-7)** — APROVADO: +1d: vencido=true reapareceu=true caixa=1 | +3d: vencido=true reapareceu=true caixa=2 | +7d: vencido=true reapareceu=true caixa=3 | +14d: vencido=true reapareceu=true caixa=4
- **T16 Repetição de elogios** — APROVADO: 0 repetições em 50 acertos
- **T12 Vários perfis** — APROVADO: A: 10 XP / B: 0 XP
- **T09 Fechar no meio da fase** — APROVADO: Store.salvar() após cada item registrado + no pagehide/visibilitychange
- **T18 Acesso à Área dos Pais** — APROVADO: Multiplicação de 6–9 × 6–9 exigida para abrir o painel
- **B4 Adaptatividade (3 erros → menos opções)** — APROVADO: antes 4 opções → depois 3

---

## 10. Fichas impressas (seção 13.2)

Abra `docs/fichas_pedagogicas.html` e imprima. O arquivo contém:
- **Pré-teste (Forma A)** e **pós-teste (Forma B)** com itens diferentes e equivalentes: som inicial (10), pares mínimos (10), contagem de sílabas (5), leitura de sílabas CV (20), leitura de dissílabas (10) e ditado (5);
- **retenção (Forma C)**, versão curta, 7 dias depois;
- **ficha de observação** por sessão;
- **diário de monitoramento** de 28 dias;
- critérios de sucesso, sinais de alerta e tabela de cálculo do ganho e da retenção.

## 11. Privacidade e licenças
- Sem anúncios, compras ou rastreadores. O progresso fica no `localStorage` do aparelho; exportação e importação são manuais.
- O microfone vem desligado e exige consentimento do adulto. O aviso de privacidade fica na Área dos Pais.
- Créditos (OpenMoji CC BY-SA 4.0, Andika OFL, Piper MIT + licença do modelo, Wikimedia por arquivo) e registro de alterações ficam na tela **Sobre**.
