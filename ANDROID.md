# Publicar o Ler Brincando na Google Play

O app Android é o próprio jogo empacotado com o [Capacitor](https://capacitorjs.com). Ele já leva **tudo dentro**
(sons, imagens e fontes), funciona **sem internet** e não pede nenhuma permissão especial (nem microfone).
A internet só entra na compra da versão completa (seção 8) e, se a nuvem estiver configurada, na turma e nas estatísticas (`docs/NUVEM.md`).
Para o iPhone e o iPad, veja [IOS.md](IOS.md).

| Item | Valor |
|---|---|
| Nome do pacote (`applicationId`) | `com.lerbrincando.app` (em `capacitor.config.json` e `android/app/build.gradle`) |
| Versão exibida (`versionName`) | a de `data.json` (hoje 1.4.0) |
| Código da versão (`versionCode`) | número da execução do GitHub Actions (aumenta sozinho) |
| Android mínimo / alvo | 7.0 (API 24) / API 36 |
| Tamanho aproximado | 30 MB |

> ⚠️ **O nome do pacote não pode mudar depois do primeiro envio à Play.** Se quiser outro (por exemplo, com o seu domínio),
> troque `com.lerbrincando.app` nos dois arquivos acima **antes** de enviar.

---

## 1. Testar no celular (sem conta na Play)

1. No GitHub, abra **Actions → App Android → Run workflow**.
2. Ao terminar (cerca de 10 minutos), abra a execução e baixe o artefato **ler-brincando-android-N**.
3. Copie o `ler-brincando-teste-N.apk` para o celular Android e abra. Pode ser preciso permitir "instalar apps desconhecidos".

## 2. Criar a chave de upload (uma vez só)

A Play exige que o pacote enviado seja assinado com uma **chave de upload**. Crie-a no seu computador (precisa do Java instalado):

```bash
keytool -genkeypair -v -keystore ler-brincando-upload.jks -alias upload \
  -keyalg RSA -keysize 2048 -validity 10000
```

Escolha uma senha forte e anote. **Guarde o arquivo `.jks` e a senha num lugar seguro e com cópia de segurança.**
Nunca coloque o `.jks` no repositório.

Depois, cadastre 4 *secrets* em **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Valor |
|---|---|
| `ANDROID_KEYSTORE_BASE64` | o conteúdo do `.jks` em base64: `base64 -w0 ler-brincando-upload.jks` (Linux), `base64 -i ler-brincando-upload.jks` (macOS) ou `[Convert]::ToBase64String([IO.File]::ReadAllBytes("ler-brincando-upload.jks"))` (PowerShell) |
| `ANDROID_KEYSTORE_PASSWORD` | a senha do arquivo |
| `ANDROID_KEY_ALIAS` | `upload` |
| `ANDROID_KEY_PASSWORD` | a senha da chave (a mesma, se você usou a mesma) |

Rode o fluxo **App Android** de novo: o artefato passa a trazer também `ler-brincando-play-N.aab`, que é o arquivo enviado à Play.

## 3. Google Play Console

1. Crie a conta de desenvolvedor em [play.google.com/console](https://play.google.com/console) (taxa única de US$ 25).
2. **Criar app** → nome "Ler Brincando", idioma Português (Brasil), **App**, **Gratuito** (o download é grátis; a versão completa é uma compra dentro do app, veja a seção 8).
3. Ative a **Assinatura de apps do Google Play** (padrão) e envie o `.aab` em **Testes → Teste interno**.
4. **Contas pessoais novas** precisam fazer um **teste fechado com pelo menos 12 testadores por 14 dias seguidos** antes de liberar a produção.
   Use a faixa "Teste fechado" e convide familiares e professores.
5. Preencha **Conteúdo do app** (respostas sugeridas em `loja/ficha-play.md`):
   - Política de privacidade: publique `docs/privacidade.html` (por exemplo, no GitHub Pages) e informe o endereço;
   - Anúncios: **não**; Acesso ao app: **todo o conteúdo disponível sem login** (a versão completa é compra, não login; para os revisores, informe que os Mundos 1 e 2 são grátis e que a compra de teste funciona com uma conta de teste de licença);
   - Público-alvo: **5 anos ou menos** e **6 a 8 anos** → o app entra no **Programa para Famílias**;
   - Segurança dos dados (v1.4): **coleta dados, opcionalmente**. Declare:
     - *Atividade no app → Interações no app*: coletado, **opcional**, para **Análise**, não compartilhado (estatísticas anônimas, só com autorização do adulto);
     - *Informações pessoais → Nome* e *Atividade no app → Outras ações*: coletados, **opcionais**, para **Funcionalidade do app** (só quando a criança entra numa turma; o professor vê o nome do perfil e o progresso);
     - *Informações financeiras → Histórico de compras*: coletado pela Google Play para a compra;
     - dados **criptografados em trânsito** (HTTPS) e **o usuário pode pedir a exclusão** (Sair da turma; desligar as estatísticas);
     - se a nuvem não estiver configurada em `config.js`, nada disso é enviado e a declaração antiga ("não coleta") continua válida;
   - Classificação de conteúdo: questionário IARC (categoria "Jogo" ou "Educação"), resultado esperado **Livre**.
6. **Página da loja**: textos em `loja/ficha-play.md`, ícone `loja/icone-512.png`, imagem de destaque `loja/destaque-1024x500.png`
   e capturas em `loja/capturas/` (celular e tablet).

## 4. Publicar uma versão nova

1. Altere o jogo, aumente `versao` em `ferramentas/fonte_dados.js`, rode `node ferramentas/construir_dados.js` e `node ferramentas/testar.js`.
2. Rode **Actions → App Android** (ou crie uma tag `v1.2.3`). O `versionCode` aumenta sozinho.
3. Envie o novo `.aab` na Play Console.

## 5. Compilar no próprio computador (opcional)

Precisa de Node 22+, JDK 21 e Android Studio.

```bash
npm install
npm run app:sync      # monta www/ e copia para android/
npm run app:abrir     # abre no Android Studio (Run ▶ para testar num celular ou emulador)
```

Para assinar localmente, crie `android/chave.properties` (já ignorado pelo git) com:

```
ANDROID_KEYSTORE_PATH=/caminho/ler-brincando-upload.jks
ANDROID_KEYSTORE_PASSWORD=...
ANDROID_KEY_ALIAS=upload
ANDROID_KEY_PASSWORD=...
```

e rode `cd android && ./gradlew bundleRelease`.

## 6. Arquivos de apoio

| Arquivo | Para que serve |
|---|---|
| `ferramentas/preparar_app.js` | Monta `www/` só com o necessário e confere que nada depende da internet. |
| `ferramentas/recursos_locais.js` | Refaz `figuras/lista.json` e copia as fontes usadas para `fontes/`. |
| `ferramentas/gerar_icones_android.js` | Gera ícones, tela de abertura, ícone 512 e imagem de destaque a partir de `icones/icone.svg`. |
| `ferramentas/capturas_loja.js` | Gera as capturas de tela da loja (celular 1080×1920 e tablet 1600×2560). |
| `.github/workflows/app-android.yml` | Compila o APK de teste e, com a chave, o AAB da Play (conferindo a licença das vozes). |
| `.github/workflows/banco-audio.yml` | Regera o Banco de Áudio com voz licenciada e abre um Pull Request. |
| `android/app/src/main/java/com/lerbrincando/app/CobrancaPlugin.java` | Compra da versão completa pela Google Play (Play Billing Library 8). |
| `config.js` | Mundos grátis, produtos e preços, link da Play e ligação com a nuvem. |
| `ferramentas/checar_licenca_audio.js` | Conta os sons sem licença para publicação (edge-tts). |

## 7. Licença das vozes

> Desde a v1.4.1, todo o Banco de Áudio é do Azure (licenciado). As instruções abaixo valem para regerar sons no futuro.

**Sílabas e fonemas** já foram gerados com o **Azure Speech** (licença para apps), com pronúncia fonética exata (IPA).
**Palavras, frases e histórias** ainda vêm do **edge-tts** (recurso "Ler em voz alta" do Microsoft Edge), cujos termos
**não autorizam** usar o áudio num app publicado. Antes da produção na Play, gere esses tipos com uma fonte que permita a publicação:

- **Pelo GitHub (recomendado):** cadastre os Secrets `AZURE_SPEECH_KEY` e `AZURE_SPEECH_REGION` (recurso "Speech" no portal do Azure, camada F0 grátis)
  e rode **Actions → Banco de Áudio (voz licenciada) → Run workflow** com o motor `azure`. O fluxo gera os sons com a mesma voz Francisca
  das sílabas, roda os testes e abre um Pull Request com o Banco de Áudio novo para você ouvir e aprovar. Sem conta no Azure, escolha o motor `kokoro`;
- **Azure Speech no computador**: `python gerar_audios.py --motor azure --tipos palavra,nome,frase,hist,frasejogo --regerar` com `AZURE_SPEECH_KEY` e `AZURE_SPEECH_REGION` definidas (a camada gratuita cobre o banco inteiro), ou
- **Kokoro** (`python gerar_audios.py --motor kokoro --refazer`, licença Apache-2.0, 100% offline), ou
- gravação humana.

Depois de regerar: `node ferramentas/sincronizar_manifest.js`, `python ferramentas/auditar_audios.py` e `node ferramentas/testar.js`.

**Trava de segurança:** `node ferramentas/checar_licenca_audio.js` conta os sons sem licença. No fluxo **App Android**, quando há chave de upload
(versão para a Play), a compilação **falha** se ainda houver sons do edge-tts. Para um teste interno antes de regerar,
crie a variável do repositório `PERMITIR_AUDIO_SEM_LICENCA` = `sim` (Settings → Secrets and variables → Actions → Variables) e apague-a depois.

## 8. Versão completa (compra na Google Play)

Os Mundos 1 e 2 são grátis; do 3 ao 8, a criança vê ⭐ e um convite para chamar um adulto. A compra só abre depois do desafio para adultos
(exigência do Programa para Famílias). O app usa o plugin próprio `CobrancaPlugin.java` (Play Billing Library 8) e o `premium.js`.

1. **Perfil de pagamentos:** na Play Console, em **Configuração → Perfil de pagamentos**, crie a conta de comerciante (dados bancários e fiscais).
2. Envie um `.aab` desta versão (1.4 ou mais nova) em qualquer faixa de teste: a Play só libera a criação de produtos depois de receber um app com a biblioteca de faturamento.
3. **Monetizar → Produtos → Produtos no app → Criar produto**: ID `completo_vitalicio`, nome "Ler Brincando completo", preço sugerido **R$ 39,90**. Ative.
4. **Monetizar → Produtos → Assinaturas → Criar assinatura**: ID `completo_anual`. Crie o plano básico **anual, com renovação automática** a **R$ 89,90**.
   Adicione uma **oferta** com **teste sem custo de 7 dias** para novos clientes. Ative o plano e a oferta.
5. **Teste:** em **Configuração → Teste de licença**, inclua os e-mails dos testadores. Eles compram sem cobrança real (cartão "sempre aprovado").
   Instale o app pela faixa de teste (não pelo APK avulso) para a compra funcionar.
6. Preços e textos ficam em `config.js` (`produtos`, `precoReferencia`, `mundosGratis`). Os IDs no `config.js` e na Play precisam ser iguais.

Restaurar compras: Área dos Pais → ⭐ Versão completa → **Restaurar compras**. O app também confere as compras sempre que abre,
e assim percebe reembolsos e assinaturas vencidas. As compras são reconhecidas (acknowledge) pelo próprio app; sem isso, a Play reembolsa em 3 dias.

Limite conhecido: a verificação da compra é feita no aparelho, sem servidor próprio. Para um volume grande de vendas,
o próximo passo é validar o token da compra numa Edge Function do Supabase com a Google Play Developer API.
