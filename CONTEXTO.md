# Contexto do projeto (para retomar o trabalho)

Atualizado em 12/11/2026.

- **O que é:** jogo de alfabetização em português pelo método fônico, para crianças de 5 a 7 anos. Sem anúncios, compras nem rastreadores. Funciona no navegador, offline (PWA) e como app Android (Capacitor). O manual completo está no `LEIAME.md`.
- **Versão atual:** 1.3.1.
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
  - O relatório da avaliação está no repositório `feira-viva`, em `docs/avaliacoes/avaliacao-ler-brincando.docx`.
- **Testes:** `node ferramentas/testar.js` (validadores V1–V12) e `node ferramentas/testes_funcionais.js`. Rode depois de qualquer mudança de conteúdo ou código.
- **Dados:** edite `ferramentas/fonte_palavras.js` ou `ferramentas/fonte_dados.js` e rode `node ferramentas/construir_dados.js`. Ao publicar, aumente `versao` em `fonte_dados.js` e `VERSAO` em `sw.js`.
- **Ícone:** a arte está em `icones/arte-icone.png`. Para gerar todos os tamanhos:

  ```bash
  python ferramentas/gerar_icones_arte.py icones/arte-icone.png android/app/src/main/res --cor '#7FD6F5' --web icones/icone-192.png icones/icone-512.png --loja loja/icone-512.png
  ```

  O antigo `gerar_icones_android.js` agora só gera a imagem de destaque da loja.
- **APK:** aba **Actions → App Android → Run workflow** (não roda sozinho a cada push). O guia da Play Store está no `ANDROID.md`.
- **Pendências:**
  - As etiquetas de instrução e a tela "Conheça o mapa" são só visuais: para a Lili falar esses textos, inclua-os no Banco de Áudio e rode `gerar_audios`.
  - Antes de publicar, refazer o Banco de Áudio com voz licenciada (`--motor azure` ou Kokoro), como avisa a Área técnica.
  - Nada foi testado com crianças nem em celular real nesta rodada.
