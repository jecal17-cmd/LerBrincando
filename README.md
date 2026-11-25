# Ler Brincando

Jogo de alfabetização em português do Brasil, pelo **método fônico**, para crianças de **5 a 7 anos**.
São 8 mundos, 93 fases, 363 palavras ilustradas, 11 histórias e uma Área dos Pais.
Funciona no navegador, no celular, offline (PWA) e como app Android e iOS. Não tem anúncios nem rastreadores.
Os Mundos 1 e 2 são grátis; a versão completa sai pela Google Play ou pela licença da escola. Há medidor de fluência leitora,
código de turma e painel do professor (`professor.html`).

## Começar em 1 minuto

1. **Jogar agora:** abra `index.html` com duplo clique. O jogo já funciona e usa o Banco de Áudio da pasta `audio/`.
2. **Para o modo offline e o microfone**, sirva a pasta por `http`:
   ```bash
   python -m http.server 8000      # depois abra http://localhost:8000
   ```
3. Toque em **"Toque para começar"**. Um adulto digita o nome da criança, ela escolhe uma figura e faz a avaliação inicial lúdica (cerca de 5 minutos), que sugere o mundo por onde começar.
4. **Área dos Pais** (menu ☰ → 👪): progresso, 📈 fluência, ⭐ versão completa, 🏫 escola, configurações de voz e tempo de tela, exportar e importar o progresso. Para entrar, é preciso responder a uma pergunta para adultos.

**Instalar no celular:** no Android (Chrome), use ⋮ → *Adicionar à tela inicial*. No iPhone (Safari), use *Compartilhar* → *Adicionar à Tela de Início*.

## Para quem mantém o projeto

| Tarefa | Comando |
|---|---|
| Editar palavras, fases e histórias | edite `ferramentas/fonte_palavras.js` ou `ferramentas/fonte_dados.js` e rode `node ferramentas/construir_dados.js` |
| Autoteste do conteúdo (V1–V12) | `node ferramentas/testar.js` |
| Testes funcionais | `node ferramentas/testes_funcionais.js` |
| Gerar ou atualizar o Banco de Áudio | `gerar_audios.bat` (Windows) ou `./gerar_audios.sh` (macOS/Linux) |
| Consertar os manifests de áudio após uma geração interrompida | `node ferramentas/sincronizar_manifest.js` |
| Robô que joga pela interface (Playwright para Python) | `python ferramentas/teste_navegador.py 1.1,3.1,4.11` |
| Auditar o Banco de Áudio | `python ferramentas/auditar_audios.py` |
| Gerar o app Android (APK de teste e AAB da Play) | GitHub → Actions → **App Android** → Run workflow (guia em [ANDROID.md](ANDROID.md)) |
| Gerar o app iOS (Simulador; TestFlight com os Secrets da Apple) | GitHub → Actions → **App iOS** → Run workflow (guia em [IOS.md](IOS.md)) |
| Regerar o Banco de Áudio com voz licenciada | GitHub → Actions → **Banco de Áudio (voz licenciada)** (guia em [ANDROID.md](ANDROID.md), seção 7) |
| Conferir a licença das vozes | `node ferramentas/checar_licenca_audio.js` |
| Lista de pronúncias da palavra silabada (para revisão) | `python ferramentas/relatorio_silabado.py` → `docs/pronuncia_silabada.md` |
| Preços, mundos grátis e ligação com a nuvem | edite `config.js` (guia da nuvem em [docs/NUVEM.md](docs/NUVEM.md)) |
| Teste no navegador das funções da v1.4 | `python ferramentas/teste_monetizacao.py` |

Depois de mudar o conteúdo ou o código, rode o autoteste. Se algum validador reprovar, corrija antes de publicar.
Ao publicar uma versão nova, aumente `VERSAO` em `sw.js` para os aparelhos baixarem os arquivos novos.

O manual completo, com o plano pedagógico, as fases, o Banco de Áudio, os testes e as limitações, está em **[LEIAME.md](LEIAME.md)**.

## Marca e divulgação

Guia de identidade visual (Markdown e PDF) e plano de marketing em `marca/`. Peças de Instagram no repositório `feira-viva`, em `docs/marketing/instagram/ler-brincando/` e `bentevi-apps/`.
