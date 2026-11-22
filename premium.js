/* ==========================================================================
   Ler Brincando — premium.js  (versão completa: Mundos 3 a 8)
   Formas de liberar:
   1) compra na Google Play (plugin nativo "Cobranca", só no app Android);
   2) licença da escola (código de turma com licença ativa — ver nuvem.js);
   3) plataforma sem cobrança (config.js → paywall), hoje o iOS.
   A compra é sempre feita por um adulto, depois do desafio para adultos (regra do Programa para Famílias).
   ========================================================================== */
(function () {
  'use strict';
  const LB = window.LB; const C = window.LB_CONFIG || {};
  const { Store, Som, D, el, tela, toast, modal, mascote } = LB;
  const APP = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  const plataforma = () => (APP ? (window.Capacitor.getPlatform ? window.Capacitor.getPlatform() : 'android') : 'web');
  const Cob = () => (APP && window.Capacitor.Plugins && window.Capacitor.Plugins.Cobranca) || null;
  const IDS = (C.produtos || []).map((p) => p.id);
  const A = () => window.Analitica || { registrar() {} };
  const hojeISO = () => new Date().toISOString().slice(0, 10);

  const Premium = {
    produtosLoja: null,
    get estado() { return Store.dados.premium || (Store.dados.premium = { compra: null }); },
    cobraAqui() { const pw = C.paywall || {}; return pw[plataforma()] !== false && (C.mundosGratis || 0) < D.mundos.length; },
    /** Chave fixa de teste (config.js → chaveTeste): libera a versão completa sem compra, só se estiver configurada */
    testeAtivo() { return !!(C.chaveTeste && this.estado.teste === C.chaveTeste); },
    ativarTeste(codigo) { const k = String(codigo || '').trim().toUpperCase(); if (!C.chaveTeste || k !== C.chaveTeste.toUpperCase()) return false; this.estado.teste = C.chaveTeste; Store.salvar(); return true; },
    desativarTeste() { delete this.estado.teste; Store.salvar(); },
    compraAtiva() { const c = this.estado.compra; return !!(c && c.produto); },
    escolaAtiva() { const ate = window.Turma && window.Turma.licencaAte; return !!(ate && ate >= hojeISO()); },
    ativo() { return !this.cobraAqui() || this.compraAtiva() || this.escolaAtiva() || this.testeAtivo(); },
    origem() { return this.compraAtiva() ? 'compra' : this.escolaAtiva() ? 'escola' : this.testeAtivo() ? 'teste' : !this.cobraAqui() ? 'livre' : null; },
    mundoPago(mundo) { return mundo > (C.mundosGratis || 0); },
    faseBloqueada(idx) { const f = D.fases[idx]; return !!f && this.mundoPago(f.mundo) && !this.ativo(); },

    /** Confere na Google Play o que este aparelho já comprou (ao abrir o app e ao tocar em "Restaurar") */
    async verificar(avisar) {
      const cob = Cob(); if (!cob) return null;
      try {
        const r = await cob.restaurar();
        const valida = (r.compras || []).find((c) => c.estado === 'comprado' && (c.produtos || []).some((id) => IDS.includes(id)));
        if (valida) this.estado.compra = { produto: valida.produtos[0], token: valida.token, desde: valida.data, verificado: Date.now() };
        else this.estado.compra = null;   // reembolsada ou assinatura vencida
        Store.salvar();
        if (avisar) toast(valida ? '✅ Compra encontrada: versão completa liberada!' : 'Nenhuma compra encontrada nesta conta Google.');
        if (avisar) A().registrar('compras_restauradas', { achou: !!valida });
        return !!valida;
      } catch (e) { if (avisar) toast('Não deu para falar com a Google Play agora. Confira a internet.'); return null; }
    },
    async carregarProdutos() {
      const cob = Cob(); if (!cob) return [];
      try { const r = await cob.produtos({ lista: (C.produtos || []).map((p) => ({ id: p.id, tipo: p.tipo })) }); this.produtosLoja = r.produtos || []; } catch (e) { this.produtosLoja = []; }
      return this.produtosLoja;
    },
    async comprar(prod) {
      const cob = Cob(); if (!cob) return false;
      A().registrar('compra_inicio', { produto: prod.id });
      try {
        const r = await cob.comprar({ id: prod.id });
        const ok = (r.compras || []).find((c) => c.estado === 'comprado' && (c.produtos || []).includes(prod.id));
        if (ok || r.jaPossui) {
          if (ok) this.estado.compra = { produto: prod.id, token: ok.token, desde: ok.data, verificado: Date.now() }; else await this.verificar();
          Store.salvar(); A().registrar('compra_ok', { produto: prod.id }); return true;
        }
        if ((r.compras || []).some((c) => c.estado === 'pendente')) toast('Pagamento pendente: a versão completa abre assim que a Google Play confirmar.', 5000);
        else if (!r.cancelada) { toast('A compra não foi concluída. Tente de novo.'); A().registrar('compra_erro', { codigo: r.codigo || -1 }); }
        return false;
      } catch (e) { toast('Não deu para abrir a loja: ' + (e.message || e)); A().registrar('compra_erro', { codigo: -2 }); return false; }
    },

    // ------------------------------------------------------------------ TELAS
    /** Criança tocou num mundo/fase da versão completa: convite simples, que chama um adulto */
    async avisoCrianca(idx) {
      const f = D.fases[idx];
      A().registrar('paywall_visto', { origem: 'crianca', mundo: f ? f.mundo : 0 });
      Som.parar();
      falar('Essa aventura é da versão completa. Chame um adulto!');
      const adulto = await modal((fechar) => [mascote({ humor: 'feliz', anim: 'pula' }), el('h2', null, '⭐ Versão completa'),
        el('p', null, 'Os Mundos 3 a 8 fazem parte da versão completa. Chame um adulto!'),
        el('div', { class: 'acoes' }, el('button', { class: 'btn', type: 'button', onclick: () => fechar(false) }, '🗺️ Voltar'), el('button', { class: 'btn pri', type: 'button', onclick: () => fechar(true) }, '👪 Sou adulto'))]);
      if (!adulto) return;
      const ok = await window.Cenas.pedirAdulto('⭐ Versão completa');
      if (ok) this.tela({ voltar: () => window.Cenas.mapa() });
    },
    /** Tela para o adulto: o que tem na versão completa, preços da loja, restaurar e código da escola */
    async tela(opc = {}) {
      Som.parar();
      const voltar = opc.voltar || (() => window.Cenas.mapa());
      A().registrar('paywall_visto', { origem: opc.origem || 'adulto' });
      const pagos = D.mundos.filter((m) => this.mundoPago(m.id));
      const nFases = D.fases.filter((f) => this.mundoPago(f.mundo)).length;
      const nHist = D.historias.filter((h) => this.mundoPago(h.mundo)).length;
      const corpo = el('div', { class: 'painel paywall' });
      const desenhar = async () => {
        corpo.innerHTML = '';
        corpo.append(el('div', { class: 'hud cab-painel' }, el('h2', { style: { margin: 0 } }, '⭐ Versão completa'), el('span', { class: 'esp' }), el('button', { class: 'btn mini', type: 'button', onclick: voltar }, '✖ Fechar')));
        if (this.ativo()) {
          const o = this.origem();
          corpo.append(el('div', { class: 'cartao-resumo bom' }, el('span', { class: 'fig' }, '✅'), el('div', null, el('b', null, 'Versão completa liberada'),
            el('p', null, o === 'compra' ? 'Obrigado pela compra! Todos os mundos estão abertos.' : o === 'teste' ? 'Chave de teste ativa neste aparelho: todos os mundos estão abertos.' : o === 'escola' ? `Licença da escola${window.Turma && window.Turma.dados && window.Turma.dados.nome ? ' (turma ' + window.Turma.dados.nome + ')' : ''} válida até ${new Date(window.Turma.licencaAte + 'T12:00').toLocaleDateString('pt-BR')}.` : 'Nesta plataforma todos os mundos estão abertos.'))));
          if (o === 'teste') corpo.append(el('button', { class: 'btn mini', type: 'button', onclick: () => { this.desativarTeste(); toast('Chave de teste desativada.'); desenhar(); } }, '🧪 Desativar chave de teste'));
          return;
        }
        corpo.append(el('p', null, `A versão grátis traz os Mundos 1 e 2 (sons, rimas e vogais). A versão completa abre mais ${pagos.length} mundos, das primeiras sílabas à leitura de histórias:`),
          el('ul', { class: 'lista-premium' }, ...pagos.map((m) => el('li', null, el('b', null, `${m.id}. ${m.nome}`), ' — ', m.conteudo))),
          el('p', null, `São ${nFases} fases e ${nHist} histórias a mais. Continua sem anúncios e sem rastreadores, para até 4 crianças no mesmo aparelho.`));
        const planos = el('div', { class: 'planos' });
        if (Cob()) {
          planos.append(el('p', null, '⏳ Consultando a Google Play...'));
          corpo.append(planos);
          const lista = this.produtosLoja && this.produtosLoja.length ? this.produtosLoja : await this.carregarProdutos();
          planos.innerHTML = '';
          if (!lista.length) planos.append(el('p', { class: 'aviso' }, 'A loja não respondeu. Confira a internet e tente de novo.'), el('button', { class: 'btn', type: 'button', onclick: () => { this.produtosLoja = null; desenhar(); } }, '🔁 Tentar de novo'));
          (C.produtos || []).forEach((cp) => {
            const lp = lista.find((x) => x.id === cp.id); if (!lp) return;
            const b = el('button', { class: 'plano', type: 'button' }, el('b', null, cp.nome), el('span', { class: 'preco' }, lp.preco || C.precoReferencia[cp.id] || ''),
              lp.testeGratis ? el('span', { class: 'selo' }, '7 dias grátis') : null, el('small', null, cp.detalhe));
            b.onclick = async () => { b.disabled = true; const ok = await this.comprar(Object.assign({}, cp, lp)); b.disabled = false; if (ok) { toast('🎉 Versão completa liberada!'); LB.Confete.lancar(120); desenhar(); } };
            planos.append(b);
          });
          corpo.append(el('div', { class: 'acoes' }, el('button', { class: 'btn mini', type: 'button', onclick: async () => { await this.verificar(true); desenhar(); } }, '🔁 Restaurar compras')));
        } else if (plataforma() === 'web') {
          planos.append(el('div', { class: 'plano estatico' }, el('b', null, 'No celular Android'), el('span', { class: 'preco' }, C.precoReferencia.completo_vitalicio || ''), el('small', null, 'Instale o app pela Google Play e libere a versão completa por lá.'),
            el('a', { class: 'btn pri', href: C.linkPlay, target: '_blank', rel: 'noopener' }, '▶ Abrir a Google Play')));
          corpo.append(planos);
        }
        // licença da escola
        const escola = el('div', { class: 'cartao-sugestao' }, el('b', null, '🏫 É de escola ou rede de ensino?'),
          el('span', null, 'Com a licença da escola, o código de turma libera a versão completa e o professor acompanha cada aluno.'),
          el('button', { class: 'btn', type: 'button', onclick: () => window.Cenas.painelPais('escola') }, '🔑 Tenho um código de turma'),
          C.contatoEscolas ? el('small', null, 'Licenças para escolas: ', C.contatoEscolas) : null);
        corpo.append(escola);
        if (C.chaveTeste) {
          const cod = el('input', { type: 'text', placeholder: 'Chave de teste', 'aria-label': 'chave de teste', autocapitalize: 'characters', autocomplete: 'off' });
          const ok = el('button', { class: 'btn mini', type: 'button' }, '🧪 Aplicar');
          ok.onclick = () => { if (this.ativarTeste(cod.value)) { toast('🧪 Chave de teste aplicada: versão completa liberada.'); desenhar(); } else toast('Chave de teste incorreta.'); };
          corpo.append(el('div', { class: 'cartao-sugestao' }, el('b', null, '🧪 Chave de teste'), el('label', { class: 'linha' }, cod, ok)));
        }
      };
      tela(corpo); await desenhar();
    }
  };
  function falar(t) { Som.falar([{ k: 'frase', t }]); }

  // Ao abrir o app, confere as compras (pega reembolsos e assinaturas vencidas)
  if (Cob()) setTimeout(() => Premium.verificar(false), 2500);
  window.Premium = Premium;
})();
