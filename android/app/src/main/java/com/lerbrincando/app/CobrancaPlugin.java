package com.lerbrincando.app;

import androidx.annotation.NonNull;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Ler Brincando — compra da versão completa pela Google Play (Play Billing Library 8).
 * Usado pelo premium.js como window.Capacitor.Plugins.Cobranca:
 *   produtos({ lista: [{ id, tipo: 'inapp' | 'subs' }] }) → { produtos: [{ id, tipo, titulo, preco, testeGratis }] }
 *   comprar({ id })                                        → { ok, cancelada, jaPossui, codigo, compras: [...] }
 *   restaurar()                                            → { compras: [{ produtos, estado, token, data, renovacao }] }
 * As compras são reconhecidas (acknowledge) aqui; sem isso, a Play reembolsa em 3 dias.
 */
@CapacitorPlugin(name = "Cobranca")
public class CobrancaPlugin extends Plugin implements PurchasesUpdatedListener {

    private BillingClient cliente;
    private PluginCall chamadaCompra;
    private final Map<String, ProductDetails> detalhes = new HashMap<>();

    private interface Acao {
        void executar();
    }

    @Override
    public void load() {
        cliente = BillingClient.newBuilder(getContext())
                .setListener(this)
                .enablePendingPurchases(PendingPurchasesParams.newBuilder().enableOneTimeProducts().build())
                .build();
    }

    /** Garante a conexão com a Play antes de cada operação (ela cai sozinha de vez em quando). */
    private void conectar(PluginCall call, Acao acao) {
        if (cliente.isReady()) {
            acao.executar();
            return;
        }
        cliente.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(@NonNull BillingResult r) {
                if (r.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    acao.executar();
                } else {
                    call.reject("Google Play indisponível: " + r.getDebugMessage(), String.valueOf(r.getResponseCode()));
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                // a próxima chamada reconecta
            }
        });
    }

    @PluginMethod
    public void produtos(PluginCall call) {
        JSArray lista = call.getArray("lista");
        if (lista == null) {
            call.reject("Informe a lista de produtos");
            return;
        }
        conectar(call, () -> {
            List<QueryProductDetailsParams.Product> inapp = new ArrayList<>();
            List<QueryProductDetailsParams.Product> subs = new ArrayList<>();
            try {
                for (int i = 0; i < lista.length(); i++) {
                    JSONObject o = lista.getJSONObject(i);
                    boolean assinatura = "subs".equals(o.optString("tipo"));
                    QueryProductDetailsParams.Product p = QueryProductDetailsParams.Product.newBuilder()
                            .setProductId(o.getString("id"))
                            .setProductType(assinatura ? BillingClient.ProductType.SUBS : BillingClient.ProductType.INAPP)
                            .build();
                    if (assinatura) subs.add(p); else inapp.add(p);
                }
            } catch (JSONException e) {
                call.reject("Lista de produtos inválida");
                return;
            }
            // a Play não aceita tipos misturados numa mesma consulta: consulta um tipo, depois o outro
            JSArray saida = new JSArray();
            consultar(inapp, saida, () -> consultar(subs, saida, () -> {
                JSObject ret = new JSObject();
                ret.put("produtos", saida);
                call.resolve(ret);
            }));
        });
    }

    private void consultar(List<QueryProductDetailsParams.Product> produtos, JSArray saida, Acao depois) {
        if (produtos.isEmpty()) {
            depois.executar();
            return;
        }
        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder().setProductList(produtos).build();
        cliente.queryProductDetailsAsync(params, (resultado, consulta) -> {
            if (resultado.getResponseCode() == BillingClient.BillingResponseCode.OK && consulta != null) {
                for (ProductDetails d : consulta.getProductDetailsList()) {
                    detalhes.put(d.getProductId(), d);
                    saida.put(descrever(d));
                }
            }
            depois.executar();
        });
    }

    /** Prefere a oferta com período grátis (a Play só a devolve para quem ainda tem direito ao teste). */
    private ProductDetails.SubscriptionOfferDetails escolherOferta(List<ProductDetails.SubscriptionOfferDetails> ofertas) {
        if (ofertas == null || ofertas.isEmpty()) return null;
        for (ProductDetails.SubscriptionOfferDetails o : ofertas) {
            for (ProductDetails.PricingPhase f : o.getPricingPhases().getPricingPhaseList()) {
                if (f.getPriceAmountMicros() == 0) return o;
            }
        }
        return ofertas.get(0);
    }

    private JSObject descrever(ProductDetails d) {
        JSObject o = new JSObject();
        o.put("id", d.getProductId());
        o.put("titulo", d.getName());
        o.put("descricao", d.getDescription());
        if (BillingClient.ProductType.SUBS.equals(d.getProductType())) {
            o.put("tipo", "subs");
            ProductDetails.SubscriptionOfferDetails oferta = escolherOferta(d.getSubscriptionOfferDetails());
            if (oferta != null) {
                List<ProductDetails.PricingPhase> fases = oferta.getPricingPhases().getPricingPhaseList();
                boolean teste = false;
                for (ProductDetails.PricingPhase f : fases) {
                    if (f.getPriceAmountMicros() == 0) teste = true;
                }
                ProductDetails.PricingPhase ultima = fases.get(fases.size() - 1);
                o.put("preco", ultima.getFormattedPrice());
                o.put("periodo", ultima.getBillingPeriod());
                o.put("testeGratis", teste);
            }
        } else {
            o.put("tipo", "inapp");
            ProductDetails.OneTimePurchaseOfferDetails unica = d.getOneTimePurchaseOfferDetails();
            if (unica != null) o.put("preco", unica.getFormattedPrice());
        }
        return o;
    }

    @PluginMethod
    public void comprar(PluginCall call) {
        String id = call.getString("id");
        conectar(call, () -> {
            ProductDetails d = detalhes.get(id);
            if (d == null) {
                call.reject("Produto não carregado: " + id + " (chame produtos() antes)");
                return;
            }
            BillingFlowParams.ProductDetailsParams.Builder pb = BillingFlowParams.ProductDetailsParams.newBuilder().setProductDetails(d);
            if (BillingClient.ProductType.SUBS.equals(d.getProductType())) {
                ProductDetails.SubscriptionOfferDetails oferta = escolherOferta(d.getSubscriptionOfferDetails());
                if (oferta == null) {
                    call.reject("Assinatura sem oferta ativa na Play Console");
                    return;
                }
                pb.setOfferToken(oferta.getOfferToken());
            }
            BillingFlowParams params = BillingFlowParams.newBuilder()
                    .setProductDetailsParamsList(Collections.singletonList(pb.build()))
                    .build();
            if (chamadaCompra != null) chamadaCompra.reject("Outra compra foi iniciada");
            chamadaCompra = call;
            getActivity().runOnUiThread(() -> {
                BillingResult r = cliente.launchBillingFlow(getActivity(), params);
                if (r.getResponseCode() != BillingClient.BillingResponseCode.OK) terminarCompra(r, null);
            });
        });
    }

    @Override
    public void onPurchasesUpdated(@NonNull BillingResult r, List<Purchase> compras) {
        if (r.getResponseCode() == BillingClient.BillingResponseCode.OK && compras != null) {
            for (Purchase p : compras) reconhecer(p);
        }
        terminarCompra(r, compras);
    }

    private void terminarCompra(BillingResult r, List<Purchase> compras) {
        int cod = r.getResponseCode();
        JSObject ret = new JSObject();
        ret.put("codigo", cod);
        ret.put("ok", cod == BillingClient.BillingResponseCode.OK);
        ret.put("cancelada", cod == BillingClient.BillingResponseCode.USER_CANCELED);
        ret.put("jaPossui", cod == BillingClient.BillingResponseCode.ITEM_ALREADY_OWNED);
        ret.put("mensagem", r.getDebugMessage());
        ret.put("compras", listar(compras));
        PluginCall call = chamadaCompra;
        chamadaCompra = null;
        if (call != null) call.resolve(ret);
        else notifyListeners("compraAtualizada", ret); // compra concluída fora do fluxo (ex.: pagamento pendente aprovado)
    }

    @PluginMethod
    public void restaurar(PluginCall call) {
        conectar(call, () -> cliente.queryPurchasesAsync(
                QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.INAPP).build(),
                (r1, unicas) -> {
                    if (r1.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                        call.reject("Não foi possível consultar as compras", String.valueOf(r1.getResponseCode()));
                        return;
                    }
                    cliente.queryPurchasesAsync(
                            QueryPurchasesParams.newBuilder().setProductType(BillingClient.ProductType.SUBS).build(),
                            (r2, assinaturas) -> {
                                if (r2.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                                    call.reject("Não foi possível consultar as assinaturas", String.valueOf(r2.getResponseCode()));
                                    return;
                                }
                                List<Purchase> todas = new ArrayList<>(unicas);
                                todas.addAll(assinaturas);
                                for (Purchase p : todas) reconhecer(p);
                                JSObject ret = new JSObject();
                                ret.put("compras", listar(todas));
                                call.resolve(ret);
                            });
                }));
    }

    private void reconhecer(Purchase p) {
        if (p.getPurchaseState() != Purchase.PurchaseState.PURCHASED || p.isAcknowledged()) return;
        AcknowledgePurchaseParams params = AcknowledgePurchaseParams.newBuilder().setPurchaseToken(p.getPurchaseToken()).build();
        cliente.acknowledgePurchase(params, r -> { /* se falhar, a próxima restauração tenta de novo */ });
    }

    private JSArray listar(List<Purchase> compras) {
        JSArray a = new JSArray();
        if (compras == null) return a;
        for (Purchase p : compras) {
            JSObject o = new JSObject();
            JSArray ids = new JSArray();
            for (String id : p.getProducts()) ids.put(id);
            o.put("produtos", ids);
            int st = p.getPurchaseState();
            o.put("estado", st == Purchase.PurchaseState.PURCHASED ? "comprado" : st == Purchase.PurchaseState.PENDING ? "pendente" : "desconhecido");
            o.put("token", p.getPurchaseToken());
            o.put("data", p.getPurchaseTime());
            o.put("renovacao", p.isAutoRenewing());
            a.put(o);
        }
        return a;
    }
}
