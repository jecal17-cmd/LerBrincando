/* ==========================================================================
   Ler Brincando — config.js  (ajustes de negócio: edite aqui, sem mexer no código)
   ========================================================================== */
window.LB_CONFIG = {
  // ---- Nuvem (Supabase) — painel do professor, código de turma e estatísticas anônimas.
  // Deixe em branco para o jogo funcionar 100% offline, sem nada disso. Guia: docs/NUVEM.md
  // A chave "anon" é pública por natureza: o que protege os dados são as regras do banco (supabase/esquema.sql).
  supabaseUrl: '',
  supabaseAnon: '',

  // ---- Versão completa (paywall)
  // Mundos grátis: 1 e 2 (consciência fonológica e vogais). Do 3 ao 8, precisa da versão completa
  // (compra na Google Play ou licença da escola pelo código de turma).
  mundosGratis: 2,
  // Onde a versão completa é cobrada. iOS fica livre até existir a compra pela App Store (StoreKit).
  paywall: { android: true, web: true, ios: false },
  // Produtos cadastrados na Play Console (Monetizar → Produtos). Os IDs precisam ser exatamente estes.
  produtos: [
    { id: 'completo_vitalicio', tipo: 'inapp', nome: 'Compra única', detalhe: 'Pague uma vez e use para sempre, até 4 crianças.' },
    { id: 'completo_anual', tipo: 'subs', nome: 'Assinatura anual', detalhe: 'Com 7 dias grátis para experimentar. Cancele quando quiser na Google Play.' }
  ],
  // Preço mostrado quando a loja não responde (na Play, o preço oficial vem da própria loja)
  precoReferencia: { completo_vitalicio: 'R$ 39,90', completo_anual: 'R$ 89,90 por ano' },
  // Página do app na Google Play (para quem joga no navegador)
  linkPlay: 'https://play.google.com/store/apps/details?id=com.lerbrincando.app',
  // Contato para escolas e redes (aparece na tela da versão completa)
  contatoEscolas: '',

  // ---- Chave fixa de TESTE: digitada na tela "Versão completa", libera os mundos pagos neste aparelho sem compra.
  // Fica salva no aparelho (não precisa desinstalar o app para testar de novo). SÓ PARA TESTES:
  // o fluxo do App Android esvazia este campo quando há chave de upload (build da Play). Deixe '' para desligar.
  chaveTeste: 'LB-TESTE-7K4Q-92XM'
};
