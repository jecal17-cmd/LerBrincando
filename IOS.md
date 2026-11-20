# App iOS (iPhone e iPad)

O jogo usa o **Capacitor** também no iOS. O projeto Xcode **não fica no repositório**: o fluxo **App iOS**
(GitHub Actions, num Mac da nuvem) cria o projeto a cada execução, aplica nome, versão, ícone e permissões e compila.

## 1. Testar se compila (sem conta da Apple)

Aba **Actions → App iOS → Run workflow**. O fluxo também roda sozinho em Pull Requests que mudam o empacotamento do app.
O artefato `ler-brincando-ios-N` traz `ler-brincando-simulador-N.zip`: o app para o Simulador do Xcode
(descompacte e arraste para o Simulador aberto num Mac).

## 2. Publicar no TestFlight e na App Store

Você precisa do **Apple Developer Program** (US$ 99 por ano), em [developer.apple.com](https://developer.apple.com).

1. Em **Certificates, IDs & Profiles**:
   - **Identifiers** → crie o App ID `com.lerbrincando.app`;
   - **Certificates** → crie um **Apple Distribution** e exporte do Chaveiro do Mac como `.p12`, com senha;
   - **Profiles** → crie um perfil **App Store Connect** para `com.lerbrincando.app` com esse certificado.
2. Em [App Store Connect](https://appstoreconnect.apple.com): **Apps → +** → "Ler Brincando", pacote `com.lerbrincando.app`.
   Em **Users and Access → Integrations → App Store Connect API**, crie uma chave com o papel **App Manager** e baixe o `.p8`.
3. No GitHub, em **Settings → Secrets and variables → Actions**, cadastre:

| Secret | Valor |
|---|---|
| `IOS_CERT_P12_BASE64` | `base64 -i distribuicao.p12` |
| `IOS_CERT_PASSWORD` | senha do `.p12` |
| `IOS_PROFILE_BASE64` | `base64 -i LerBrincando_AppStore.mobileprovision` |
| `APPSTORE_API_KEY_BASE64` | `base64 -i AuthKey_XXXXXX.p8` |
| `APPSTORE_API_KEY_ID` | o Key ID (ex.: `XXXXXX`) |
| `APPSTORE_API_ISSUER_ID` | o Issuer ID mostrado na página das chaves |

4. Rode **App iOS** de novo: o fluxo gera o `.ipa` assinado e envia ao **TestFlight**.
   Em seguida, preencha a ficha da loja (textos em `loja/ficha-play.md`), a política de privacidade (`docs/privacidade.html`),
   a classificação **Kids** (faixa 6 a 8 anos) e envie para revisão.

> A parte assinada (passos 3 e 4) segue o caminho padrão da Apple, mas só pode ser validada com a sua conta.
> Se algo falhar, a mensagem do Xcode aparece no log do passo "Gera o .ipa e envia ao TestFlight".

## 3. Cobrança no iOS

No iOS, a Apple exige que conteúdo digital seja vendido pela compra dentro do app (StoreKit), e a categoria **Kids** proíbe links para fora.
Por isso, em `config.js`, `paywall.ios` está como `false`: **no iPhone e no iPad, todos os mundos ficam abertos**.
A licença da escola (código de turma) funciona normalmente.

Para cobrar no iOS no futuro: crie os mesmos produtos (`completo_vitalicio` e `completo_anual`) no App Store Connect,
implemente o plugin de StoreKit equivalente ao `CobrancaPlugin.java` e mude `paywall.ios` para `true`.

## 4. Compilar num Mac (opcional)

```bash
npm ci
npm install --no-save @capacitor/ios@8.6.0
node ferramentas/preparar_app.js && npx cap add ios && npx cap sync ios
npx cap open ios      # abre no Xcode
```
