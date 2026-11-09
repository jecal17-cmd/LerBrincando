# Ler Brincando

Jogo de alfabetização em português do Brasil, pelo **método fônico**, para crianças de **5 a 7 anos**.
São 8 mundos, 93 fases, 363 palavras ilustradas, 11 histórias e uma Área dos Pais.
Funciona no navegador, no celular e offline (PWA). Não tem anúncios, compras nem rastreadores.

## Começar em 1 minuto

1. **Jogar agora:** abra `index.html` com duplo clique. O jogo já funciona e usa o Banco de Áudio da pasta `audio/`.
2. **Para o modo offline e o microfone**, sirva a pasta por `http`:
   ```bash
   python -m http.server 8000      # depois abra http://localhost:8000
   ```
3. Toque em **"Toque para começar"**. Um adulto digita o nome da criança, ela escolhe uma figura e faz a avaliação inicial lúdica (cerca de 5 minutos), que sugere o mundo por onde começar.
4. **Área dos Pais** (menu ☰ → 👪): progresso, mapa de calor dos sons, configurações de voz e tempo de tela, exportar e importar o progresso. Para entrar, é preciso resolver uma multiplicação.

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

Depois de mudar o conteúdo ou o código, rode o autoteste. Se algum validador reprovar, corrija antes de publicar.
Ao publicar uma versão nova, aumente `VERSAO` em `sw.js` para os aparelhos baixarem os arquivos novos.

O manual completo, com o plano pedagógico, as fases, o Banco de Áudio, os testes e as limitações, está em **[LEIAME.md](LEIAME.md)**.
