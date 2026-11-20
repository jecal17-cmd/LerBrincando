/* ==========================================================================
   Ler Brincando — nuvem.js
   Ligação opcional com o Supabase (configurada em config.js):
   - Analitica: estatísticas ANÔNIMAS de uso, só com a autorização do adulto
   - Turma: o aparelho entra numa turma pelo código do professor e envia um resumo do progresso
   Sem config, nada disso roda e o jogo continua 100% offline.
   ========================================================================== */
(function () {
  'use strict';
  const LB = window.LB; const C = window.LB_CONFIG || {};
  const { Store, Motor, D } = LB;
  const APP = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
  const plataforma = () => (APP ? (window.Capacitor.getPlatform ? window.Capacitor.getPlatform() : 'android') : 'web');
  const novoId = () => (window.crypto && crypto.randomUUID ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));

  // ----------------------------------------------------------------------
  // Chamadas ao Supabase (REST + funções RPC). Sem bibliotecas externas.
  // ----------------------------------------------------------------------
  const Nuvem = {
    get ativa() { return !!(C.supabaseUrl && C.supabaseAnon) && typeof fetch === 'function'; },
    async rpc(nome, args, opc = {}) {
      if (!this.ativa) throw new Error('nuvem-desligada');
      const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), opc.timeout || 12000);
      try {
        const r = await fetch(`${C.supabaseUrl.replace(/\/$/, '')}/rest/v1/rpc/${nome}`, {
          method: 'POST', signal: ctrl.signal, keepalive: !!opc.keepalive,
          headers: { apikey: C.supabaseAnon, Authorization: 'Bearer ' + C.supabaseAnon, 'Content-Type': 'application/json' },
          body: JSON.stringify(args || {})
        });
        const txt = await r.text(); let corpo = null; try { corpo = txt ? JSON.parse(txt) : null; } catch (e) { corpo = txt; }
        if (!r.ok) { const e = new Error((corpo && (corpo.message || corpo.hint)) || ('HTTP ' + r.status)); e.status = r.status; throw e; }
        return corpo;
      } finally { clearTimeout(t); }
    }
  };

  // Identificador aleatório DESTE aparelho (não identifica a pessoa; some ao zerar os dados)
  function instalacao() { if (!Store.dados.instalacao) { Store.dados.instalacao = novoId(); Store.salvar(); } return Store.dados.instalacao; }

  // ----------------------------------------------------------------------
  // ESTATÍSTICAS ANÔNIMAS (melhoria 4). Só com Store.cfg.estatisticas === true.
  // Nada de nomes, textos digitados, áudio ou localização: só nomes de eventos e números.
  // ----------------------------------------------------------------------
  const EVENTOS = ['app_aberto', 'perfil_criado', 'avaliacao_fim', 'fase_inicio', 'fase_fim', 'paywall_visto', 'compra_inicio', 'compra_ok',
    'compra_erro', 'compras_restauradas', 'turma_entrou', 'turma_saiu', 'fluencia_feita'];
  const Analitica = {
    get permitida() { return Store.cfg.estatisticas === true && Nuvem.ativa; },
    get perguntar() { return Nuvem.ativa && (Store.cfg.estatisticas === undefined || Store.cfg.estatisticas === null); },
    registrar(nome, dados) {
      if (!this.permitida || !EVENTOS.includes(nome)) return;
      const fila = Store.dados.filaEventos = Store.dados.filaEventos || [];
      const limpo = {}; Object.entries(dados || {}).forEach(([k, v]) => { if (typeof v === 'number' || typeof v === 'boolean' || (typeof v === 'string' && v.length <= 40)) limpo[k] = v; });
      fila.push({ nome, dados: limpo, em: new Date().toISOString() });
      while (fila.length > 300) fila.shift();
      Store.salvar();
      if (fila.length >= 15) this.enviar();
    },
    enviando: false,
    async enviar(keepalive) {
      if (!this.permitida || this.enviando) return;
      const fila = Store.dados.filaEventos || []; if (!fila.length) return;
      this.enviando = true;
      const lote = fila.slice(0, 50);
      try {
        await Nuvem.rpc('registrar_eventos', { p_instalacao: instalacao(), p_plataforma: plataforma(), p_versao: D.versao,
          p_premium: !!(window.Premium && window.Premium.ativo()), p_eventos: lote }, { keepalive });
        Store.dados.filaEventos = (Store.dados.filaEventos || []).slice(lote.length); Store.salvar();
      } catch (e) { /* sem internet: tenta depois */ } finally { this.enviando = false; }
    },
    definir(permitir) { Store.cfg.estatisticas = !!permitir; if (!permitir) Store.dados.filaEventos = []; Store.salvar(); }
  };

  // ----------------------------------------------------------------------
  // TURMA (melhoria 5): código do professor → cada criança do aparelho vira um aluno na nuvem
  // ----------------------------------------------------------------------
  const NOME_SOM = { CODA_S: 'S no fim da sílaba', CODA_Z: 'Z no fim', CODA_R: 'R no fim da sílaba', CODA_L: 'L no fim da sílaba', NASAL: 'M/N depois da vogal', CCV: 'duas consoantes juntas', R_FRACO: 'R fraco', R_FORTE: 'R forte', S_Z: 'S com som de Z', C_SUAVE: 'C com som de S', G_SUAVE: 'G com som de J', X_VARIOS: 'sons do X', 'ÃO': 'ÃO' };
  function proximaFase(p) { for (let i = 0; i < D.fases.length; i++) { const r = p.fases[D.fases[i].id]; if (Motor.faseLiberada(p, i) && !(r && r.dominada)) return i; } return D.fases.length - 1; }
  /** Resumo enviado ao professor: só números e nomes de sons — nada que a criança digitou ou falou */
  function montarResumo(p) {
    const dia = (k) => new Date(Motor.agora() - k * 864e5).toISOString().slice(0, 10);
    const minutos = []; for (let k = 13; k >= 0; k--) minutos.push(Math.round((p.tempo[dia(k)] || 0) / 60));
    const calor = Motor.mapaCalor(p); const nome = (u) => NOME_SOM[u.u] || u.u.replace('_', ' ');
    const iprox = proximaFase(p); const fprox = D.fases[iprox];
    const concl = Object.values(p.fases).filter((x) => x.dominada).length;
    return {
      v: 1, versaoJogo: D.versao, mundo: fprox.mundo, fase: fprox.id, faseNome: fprox.nome, concluidas: concl, totalFases: D.fases.length,
      estrelas: Object.values(p.fases).reduce((a, x) => a + x.estrelas, 0), nivel: D.niveis[Motor.nivel(p)].nome,
      minutos14: minutos, minutos7: minutos.slice(-7).reduce((a, b) => a + b, 0),
      domina: calor.filter((u) => u.estado === 'domina').map(nome), treinando: calor.filter((u) => u.estado === 'progresso').map(nome),
      dificuldade: calor.filter((u) => u.estado === 'dificuldade').map(nome),
      confusoes: Object.entries(p.confDir || {}).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k} (${v}×)`),
      avaliacao: p.avaliacao ? { mundoInicial: p.avaliacao.mundoInicial, pulada: !!p.avaliacao.pulada } : null,
      fluencia: (p.fluencia || []).slice(-10).map((f) => ({ data: f.data, texto: f.titulo, pcpm: f.pcpm, precisao: f.precisao, lidas: f.lidas, erros: f.erros, seg: f.seg })),
      ultimaFase: (p.historicoFases.slice(-1)[0] || {}).data || null
    };
  }
  const Turma = {
    get dados() { return Store.dados.turma || null; },
    vinculo(perfilId) { const t = this.dados; return t && t.alunos ? t.alunos[perfilId] || null : null; },
    /** premium por licença da escola: data limite enviada pelo servidor */
    get licencaAte() { const t = this.dados; return t && t.licencaAte ? t.licencaAte : null; },
    async entrar(codigo, perfisSel) {
      codigo = String(codigo || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (codigo.length < 5) throw new Error('Código incompleto.');
      const t = this.dados && this.dados.codigo === codigo ? this.dados : { codigo, alunos: {} };
      for (const p of perfisSel) {
        if (t.alunos[p.id]) continue;
        const r = await Nuvem.rpc('entrar_turma', { p_codigo: codigo, p_apelido: p.nome });
        const linha = Array.isArray(r) ? r[0] : r;
        if (!linha || !linha.aluno_id) throw new Error('Código não encontrado.');
        t.alunos[p.id] = { aluno: linha.aluno_id, token: linha.token };
        t.nome = linha.turma_nome; t.escola = linha.escola || ''; t.licencaAte = linha.licenca_ate || null;
      }
      Store.dados.turma = t; Store.salvar();
      Analitica.registrar('turma_entrou', { alunos: perfisSel.length });
      await this.sincronizar(true);
      return t;
    },
    async sair(perfilId) {
      const t = this.dados; if (!t) return;
      const ids = perfilId ? [perfilId] : Object.keys(t.alunos || {});
      for (const id of ids) {
        const v = t.alunos[id]; if (!v) continue;
        try { await Nuvem.rpc('sair_turma', { p_aluno: v.aluno, p_token: v.token }); } catch (e) { /* apaga localmente mesmo assim */ }
        delete t.alunos[id];
      }
      if (!Object.keys(t.alunos).length) Store.dados.turma = null;
      Store.salvar(); Analitica.registrar('turma_saiu', {});
    },
    sincronizando: false,
    /** Envia o resumo de cada criança vinculada (no máximo a cada 3 min, a menos que forçado) */
    async sincronizar(forcar) {
      const t = this.dados; if (!t || !Nuvem.ativa || this.sincronizando) return false;
      if (!forcar && t.ultimaSync && Date.now() - t.ultimaSync < 180000) return false;
      this.sincronizando = true; let algum = false;
      try {
        for (const [perfilId, v] of Object.entries(t.alunos || {})) {
          const p = Store.dados.perfis.find((x) => x.id === perfilId);
          if (!p) continue;
          try {
            const r = await Nuvem.rpc('enviar_progresso', { p_aluno: v.aluno, p_token: v.token, p_apelido: p.nome, p_resumo: montarResumo(p) });
            const linha = Array.isArray(r) ? r[0] : r;
            if (linha) { t.licencaAte = linha.licenca_ate || null; if (linha.turma_nome) t.nome = linha.turma_nome; }
            algum = true;
          } catch (e) {
            // o professor removeu o aluno: desfaz o vínculo deste aparelho
            if (e.status === 400 && /aluno/i.test(e.message)) delete t.alunos[perfilId];
          }
        }
        if (algum) t.ultimaSync = Date.now();
        if (!Object.keys(t.alunos || {}).length) Store.dados.turma = null;
        Store.salvar();
      } finally { this.sincronizando = false; }
      return algum;
    }
  };

  // envio em segundo plano: ao abrir, a cada 2 min e ao sair do app
  if (Nuvem.ativa) {
    setTimeout(() => { Analitica.registrar('app_aberto', {}); Analitica.enviar(); Turma.sincronizar(); }, 4000);
    setInterval(() => { if (document.visibilityState === 'visible') { Analitica.enviar(); Turma.sincronizar(); } }, 120000);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') { Analitica.enviar(true); Turma.sincronizar(); } });
  }

  window.Nuvem = Nuvem; window.Analitica = Analitica; window.Turma = Turma;
  Turma.montarResumo = montarResumo; Nuvem.plataforma = plataforma; Nuvem.APP = APP;
})();
