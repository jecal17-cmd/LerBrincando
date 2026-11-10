# Publicar o Ler Brincando na Google Play

O app Android é o próprio jogo empacotado com o [Capacitor](https://capacitorjs.com). Ele já leva **tudo dentro**
(sons, imagens e fontes), funciona **sem internet** e não pede nenhuma permissão especial (nem microfone).

| Item | Valor |
|---|---|
| Nome do pacote (`applicationId`) | `com.lerbrincando.app` (em `capacitor.config.json` e `android/app/build.gradle`) |
| Versão exibida (`versionName`) | a de `data.json` (hoje 1.2.2) |
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
2. **Criar app** → nome "Ler Brincando", idioma Português (Brasil), **App**, **Gratuito**.
3. Ative a **Assinatura de apps do Google Play** (padrão) e envie o `.aab` em **Testes → Teste interno**.
4. **Contas pessoais novas** precisam fazer um **teste fechado com pelo menos 12 testadores por 14 dias seguidos** antes de liberar a produção.
   Use a faixa "Teste fechado" e convide familiares e professores.
5. Preencha **Conteúdo do app** (respostas sugeridas em `loja/ficha-play.md`):
   - Política de privacidade: publique `docs/privacidade.html` (por exemplo, no GitHub Pages) e informe o endereço;
   - Anúncios: **não**; Acesso ao app: **todo o conteúdo disponível sem login**;
   - Público-alvo: **5 anos ou menos** e **6 a 8 anos** → o app entra no **Programa para Famílias**;
   - Segurança dos dados: **não coleta nem compartilha dados**;
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
| `ferramentas/recursos_locais.js` | Copia as imagens OpenMoji e as fontes usadas para `imagens/` e `fontes/`. |
| `ferramentas/gerar_icones_android.js` | Gera ícones, tela de abertura, ícone 512 e imagem de destaque a partir de `icones/icone.svg`. |
| `ferramentas/capturas_loja.js` | Gera as capturas de tela da loja (celular 1080×1920 e tablet 1600×2560). |
| `.github/workflows/app-android.yml` | Compila o APK de teste e, com a chave, o AAB da Play. |

## 7. Atenção: licença das vozes

**Sílabas e fonemas** já foram gerados com o **Azure Speech** (licença para apps), com pronúncia fonética exata (IPA).
**Palavras, frases e histórias** ainda vêm do **edge-tts** (recurso "Ler em voz alta" do Microsoft Edge), cujos termos
**não autorizam** usar o áudio num app publicado. Antes da produção na Play, gere esses tipos com uma fonte que permita a publicação:

- **Azure Speech**: `python gerar_audios.py --motor azure --tipos palavra,nome,frase,hist,frasejogo --regerar` com `AZURE_SPEECH_KEY` e `AZURE_SPEECH_REGION` definidas (a camada gratuita cobre o banco inteiro), ou
- **Kokoro** (`python gerar_audios.py --motor kokoro --refazer`, licença Apache-2.0, 100% offline), ou
- gravação humana.

Depois de regerar: `node ferramentas/sincronizar_manifest.js`, `python ferramentas/auditar_audios.py` e `node ferramentas/testar.js`.
