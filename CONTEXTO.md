# Contexto do projeto (para retomar o trabalho)

Atualizado em 20/11/2026.

- **O que é:** jogo de alfabetização em português pelo método fônico, para crianças de 5 a 7 anos. Sem anúncios nem rastreadores. Mundos 1 e 2 grátis; versão completa pela Google Play ou pela licença da escola. Funciona no navegador, offline (PWA) e como app Android e iOS (Capacitor). O manual completo está no `LEIAME.md`; a estratégia de monetização, no `ESTRATEGIA.md` do projeto.
- **Versão atual:** 1.4.0.
  - **v1.4.0 (monetização):**
    - versão completa: `premium.js` + plugin `CobrancaPlugin.java` (Play Billing 8); produtos `completo_vitalicio` e `completo_anual`; ajustes em `config.js`; guia em `ANDROID.md` §8;
    - medidor de fluência (`fluencia.js`, Área dos Pais → 📈);
    - nuvem opcional no Supabase (`nuvem.js`, `supabase/esquema.sql`, `supabase/consultas.sql`): código de turma, licença da escola, estatísticas anônimas com consentimento; painel `professor.html`; guia em `docs/NUVEM.md`;
    - fluxos do GitHub: **Banco de Áudio (voz licenciada)**, **App iOS** (guia em `IOS.md`) e trava de licença das vozes no **App Android**;
    - teste `python ferramentas/teste_monetizacao.py`.
  - **v1.3.0:** onze melhorias vindas de uma avaliação como usuário novo:
    - etiqueta da tarefa na tela;
    - nomes nos ícones do mapa;
    - convite ao teste para pular fases;
    - adiantar a fala (⏩);
    - revisão no fim da fase;
    - bolinhas de progresso;
    - ajuda (🛟);
    - Área técnica separada;
    - Sobre revisado;
    - resumo do progresso para os pais;
    - portão dos pais com perguntas sorteadas.
  - **v1.3.1:** ícone novo (a Lili dourada com letras).
  - **v1.3.2:** ícone sem cortes (coruja inteira com a moldura) e a Lili das telas redesenhada para lembrar o ícone: dourada e brilhante, orelhas pontudas, olhos grandes com íris castanha, bico em losango, barriga creme com penas em escamas e asas laterais. As cores da Lojinha continuam valendo (os tons claros e escuros saem da cor escolhida).
  - O relatório da avaliação está no repositório `feira-viva`, em `docs/avaliacoes/avaliacao-ler-brincando.docx`.
- **Testes:** `node ferramentas/testar.js` (validadores V1–V12), `node ferramentas/testes_funcionais.js` (inclui F1 fluência e P1 paywall) e `python ferramentas/teste_monetizacao.py` (navegador). Rode depois de qualquer mudança de conteúdo ou código.
- **Dados:** edite `ferramentas/fonte_palavras.js` ou `ferramentas/fonte_dados.js` e rode `node ferramentas/construir_dados.js`. Ao publicar, aumente `versao` em `fonte_dados.js` e `VERSAO` em `sw.js`.
- **Ícone:** a arte está em `icones/arte-icone.png`. Para gerar todos os tamanhos:

  ```bash
  python ferramentas/gerar_icones_arte.py icones/arte-icone.png android/app/src/main/res --cor '#7FD6F5' --web icones/icone-192.png icones/icone-512.png --loja loja/icone-512.png
  ```

  A arte traz a própria moldura sobre um fundo escuro; o script apaga esse fundo e encaixa a coruja inteira em cada formato, sem cortes (no ícone adaptativo, dentro do círculo seguro de 66 dp).
  O antigo `gerar_icones_android.js` agora só gera a imagem de destaque da loja.
- **APK:** aba **Actions → App Android → Run workflow** (não roda sozinho a cada push). O guia da Play Store está no `ANDROID.md`.
- **Pendências:**
  - Criar o projeto Supabase e preencher `config.js` (sem isso, turma e estatísticas ficam desligadas).
  - Rodar o fluxo **Banco de Áudio (voz licenciada)** com os Secrets do Azure; a versão assinada para a Play falha enquanto houver sons do edge-tts.
  - Criar o perfil de pagamentos e os produtos na Play Console (`ANDROID.md` §8) e testar a compra com conta de teste de licença.
  - iOS: conta Apple Developer e Secrets para o TestFlight; cobrança no iOS ainda não existe (StoreKit), por isso `paywall.ios` é `false`.
  - As etiquetas de instrução e a tela "Conheça o mapa" são só visuais: para a Lili falar esses textos, inclua-os no Banco de Áudio e rode `gerar_audios`.
  - Nada foi testado com crianças nem em celular real nesta rodada.
