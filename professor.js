/* ==========================================================================
   Ler Brincando — professor.js  (painel do professor, melhoria 5)
   Login por e-mail no Supabase Auth; turmas e alunos protegidos por Row Level Security.
   Sem bibliotecas externas: só fetch.
   ========================================================================== */
(function () {
  'use strict';
  const C = window.LB_CONFIG || {}; const D = window.DADOS || { mundos: [], fases: [] };
  const URL_SB = (C.supabaseUrl || '').replace(/\/$/, ''); const ANON = C.supabaseAnon || '';
  const app = document.getElementById('app');
  const CHAVE = 'lerBrincando.professor';
  const el = (tag, attrs, ...filhos) => {
    const e = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => { if (v === null || v === undefined || v === false) return; if (k === 'class') e.className = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? '' : v); });
    filhos.flat().forEach((f) => { if (f !== null && f !== undefined && f !== false) e.append(f.nodeType ? f : document.createTextNode(String(f))); });
    return e;
  };
  const tela = (...f) => { app.innerHTML = ''; f.forEach((x) => x && app.append(x)); window.scrollTo(0, 0); };
  const dataBR = (d) => (d ? new Date(d).toLocaleDateString('pt-BR') : '—');
  const hoje = () => new Date().toISOString().slice(0, 10);

  // ------------------------------------------------------------------ sessão e API
  let sessao = null; try { sessao = JSON.parse(localStorage.getItem(CHAVE)); } catch (e) { sessao = null; }
  const guardar = (s) => { sessao = s; if (s) localStorage.setItem(CHAVE, JSON.stringify(s)); else localStorage.removeItem(CHAVE); };
  async function auth(caminho, corpo) {
    const r = await fetch(`${URL_SB}/auth/v1/${caminho}`, { method: 'POST', headers: { apikey: ANON, 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(traduzir(j.msg || j.error_description || j.message || ('HTTP ' + r.status)));
    return j;
  }
  function traduzir(m) {
    if (/invalid login/i.test(m)) return 'E-mail ou senha incorretos.';
    if (/email not confirmed/i.test(m)) return 'Confirme o e-mail: abrimos um link na sua caixa de entrada.';
    if (/already registered|already exists/i.test(m)) return 'Este e-mail já tem conta. Use "Entrar".';
    if (/password should be/i.test(m)) return 'A senha precisa ter pelo menos 6 caracteres.';
    if (/rate limit/i.test(m)) return 'Muitas tentativas. Espere um minuto.';
    return m;
  }
  async function token() {
    if (!sessao) throw new Error('sem sessão');
    if (Date.now() / 1000 > (sessao.expires_at || 0) - 60) {
      try { const j = await auth('token?grant_type=refresh_token', { refresh_token: sessao.refresh_token }); guardar(j); } catch (e) { guardar(null); throw new Error('Sessão expirada. Entre de novo.'); }
    }
    return sessao.access_token;
  }
  async function api(metodo, caminho, corpo) {
    const r = await fetch(`${URL_SB}/rest/v1/${caminho}`, { method: metodo, headers: { apikey: ANON, Authorization: 'Bearer ' + await token(), 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: corpo ? JSON.stringify(corpo) : undefined });
    const txt = await r.text(); const j = txt ? JSON.parse(txt) : null;
    if (!r.ok) throw new Error((j && j.message) || ('HTTP ' + r.status));
    return j;
  }

  // ------------------------------------------------------------------ telas
  function telaLogin(msg) {
    document.getElementById('sair').hidden = true; document.getElementById('quem').textContent = '';
    if (!URL_SB || !ANON) { tela(el('div', { class: 'cartao' }, el('h2', null, 'Painel ainda não configurado'), el('p', null, 'Preencha supabaseUrl e supabaseAnon no arquivo config.js (veja docs/NUVEM.md).'))); return; }
    const email = el('input', { type: 'email', autocomplete: 'username', placeholder: 'professora@escola.com' });
    const senha = el('input', { type: 'password', autocomplete: 'current-password', placeholder: 'mínimo de 6 caracteres' });
    const aviso = el('div', { class: 'msg', hidden: !msg }, msg || '');
    const mostrar = (t, ok) => { aviso.hidden = false; aviso.className = 'msg' + (ok ? ' ok' : ''); aviso.textContent = t; };
    const entrar = async () => { try { const j = await auth('token?grant_type=password', { email: email.value.trim(), password: senha.value }); guardar(j); painel(); } catch (e) { mostrar(e.message); } };
    senha.addEventListener('keydown', (e) => { if (e.key === 'Enter') entrar(); });
    tela(el('div', { class: 'cartao', style: 'max-width:520px;margin:2rem auto' },
      el('h2', null, '👩‍🏫 Entrar'),
      el('p', null, 'Acompanhe a alfabetização de cada aluno: fases concluídas, sons com dificuldade, tempo de prática e fluência leitora.'),
      el('label', null, 'E-mail'), email, el('label', null, 'Senha'), senha, aviso,
      el('div', { class: 'linha' },
        el('button', { class: 'pri', onclick: entrar }, 'Entrar'),
        el('button', { onclick: async () => { try { await auth('signup', { email: email.value.trim(), password: senha.value }); mostrar('Conta criada! Confirme o e-mail pelo link que enviamos e depois toque em Entrar.', true); } catch (e) { mostrar(e.message); } } }, 'Criar conta'),
        el('button', { onclick: async () => { if (!email.value) return mostrar('Digite o e-mail primeiro.'); try { await auth('recover', { email: email.value.trim() }); mostrar('Enviamos um link para criar uma nova senha.', true); } catch (e) { mostrar(e.message); } } }, 'Esqueci a senha')),
      el('p', { class: 'pequeno' }, 'Os dados dos alunos ficam protegidos: só você vê as suas turmas. Use só o primeiro nome ou um apelido das crianças.')));
  }

  async function painel() {
    const sair = document.getElementById('sair'); sair.hidden = false;
    sair.onclick = async () => { try { await fetch(`${URL_SB}/auth/v1/logout`, { method: 'POST', headers: { apikey: ANON, Authorization: 'Bearer ' + sessao.access_token } }); } catch (e) { /* */ } guardar(null); telaLogin(); };
    document.getElementById('quem').textContent = (sessao.user && sessao.user.email) || '';
    tela(el('p', null, 'Carregando turmas…'));
    let turmas, contagem;
    try {
      turmas = await api('GET', 'turmas?select=*&order=criada_em.desc');
      const al = await api('GET', 'alunos?select=turma_id,atualizado_em');
      contagem = {}; al.forEach((a) => { const c = contagem[a.turma_id] = contagem[a.turma_id] || { n: 0, ativos: 0 }; c.n++; if (a.atualizado_em && Date.now() - new Date(a.atualizado_em) < 14 * 864e5) c.ativos++; });
    } catch (e) { if (!sessao) return telaLogin(e.message); return tela(el('div', { class: 'msg' }, 'Erro: ' + e.message)); }
    const nome = el('input', { placeholder: 'Ex.: 1º ano A — manhã', maxlength: 60 });
    const escola = el('input', { placeholder: 'Nome da escola (opcional)', maxlength: 80 });
    const criar = el('button', { class: 'pri' }, '➕ Criar turma');
    criar.onclick = async () => { if (!nome.value.trim()) return alert('Dê um nome à turma.'); criar.disabled = true; try { await api('POST', 'turmas', { nome: nome.value.trim(), escola: escola.value.trim() || null }); painel(); } catch (e) { alert('Erro: ' + e.message); criar.disabled = false; } };
    const grade = el('div', { class: 'grade' });
    turmas.forEach((t) => {
      const c = contagem[t.id] || { n: 0, ativos: 0 };
      grade.append(el('div', { class: 'cartao turma', onclick: () => turma(t) },
        el('h2', null, t.nome), t.escola ? el('div', { class: 'pequeno' }, t.escola) : null,
        el('div', { class: 'codigo' }, t.codigo),
        el('div', null, `${c.n} aluno(s) · ${c.ativos} ativo(s) em 14 dias`),
        el('div', null, selo(t))));
    });
    tela(el('div', { class: 'cartao' }, el('h2', null, 'Minhas turmas'), turmas.length ? grade : el('p', null, 'Você ainda não tem turmas. Crie a primeira abaixo.')),
      el('div', { class: 'cartao nao-imprimir' }, el('h2', null, 'Nova turma'), el('label', null, 'Nome da turma'), nome, el('label', null, 'Escola'), escola, el('div', { class: 'linha' }, criar),
        el('p', { class: 'pequeno' }, 'Cada turma recebe um código de 6 letras. No jogo, um adulto abre Área dos Pais → 🏫 Escola e digita o código. Com a licença da escola, a versão completa é liberada para os alunos.')));
  }
  function selo(t) {
    if (!t.licenca_ate) return el('span', { class: 'selo' }, 'Sem licença da escola (só acompanhamento)');
    return t.licenca_ate >= hoje() ? el('span', { class: 'selo ok' }, '⭐ Licença até ' + dataBR(t.licenca_ate + 'T12:00')) : el('span', { class: 'selo aviso' }, 'Licença vencida em ' + dataBR(t.licenca_ate + 'T12:00'));
  }

  async function turma(t) {
    tela(el('p', null, 'Carregando alunos…'));
    let alunos;
    try { alunos = await api('GET', `alunos?select=id,apelido,resumo,atualizado_em,criado_em&turma_id=eq.${t.id}&order=apelido.asc`); } catch (e) { return tela(el('div', { class: 'msg' }, 'Erro: ' + e.message)); }
    const R = (a) => a.resumo || {};
    const nMundo = (m) => (D.mundos[m - 1] ? `${m}. ${D.mundos[m - 1].nome}` : (m || '—'));
    // visão da turma
    const porMundo = {}; const difs = {}; let somaPcpm = 0, nPcpm = 0;
    alunos.forEach((a) => { const r = R(a); if (r.mundo) porMundo[r.mundo] = (porMundo[r.mundo] || 0) + 1; (r.dificuldade || []).forEach((s) => { difs[s] = (difs[s] || 0) + 1; }); const f = (r.fluencia || []).slice(-1)[0]; if (f) { somaPcpm += f.pcpm; nPcpm++; } });
    const topDif = Object.entries(difs).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const ativos = alunos.filter((a) => a.atualizado_em && Date.now() - new Date(a.atualizado_em) < 7 * 864e5).length;
    const resumo = el('div', { class: 'resumo-turma' },
      el('div', null, el('b', null, String(alunos.length)), 'alunos'),
      el('div', null, el('b', null, String(ativos)), 'jogaram nos últimos 7 dias'),
      el('div', null, el('b', null, nPcpm ? String(Math.round(somaPcpm / nPcpm)) : '—'), 'PCPM médio (último teste de fluência)'),
      el('div', null, el('b', null, Object.keys(porMundo).length ? Object.entries(porMundo).sort((a, b) => a[0] - b[0]).map(([m, n]) => `M${m}: ${n}`).join(' · ') : '—'), 'alunos por mundo'));
    const tabela = el('table', null, el('tr', null, ...['Aluno', 'Onde está', 'Fases', 'Min. (7 dias)', 'Fluência', 'Precisa de ajuda', 'Último envio'].map((h) => el('th', null, h))));
    alunos.forEach((a) => {
      const r = R(a); const f = (r.fluencia || []).slice(-1)[0];
      const linha = el('tr', { class: 'aluno', title: 'Clique para ver detalhes' },
        el('td', null, el('b', null, a.apelido)),
        el('td', null, r.mundo ? `${nMundo(r.mundo)}${r.fase ? ' · fase ' + r.fase : ''}` : 'ainda não jogou'),
        el('td', null, r.totalFases ? `${r.concluidas}/${r.totalFases}` : '—'),
        el('td', null, r.minutos14 ? barras(r.minutos14) : '', ' ', String(r.minutos7 || 0)),
        el('td', null, f ? `${f.pcpm} PCPM (${f.precisao}%)` : '—'),
        el('td', { class: (r.dificuldade || []).length ? 'ruim' : '' }, (r.dificuldade || []).slice(0, 3).join(', ') || '—'),
        el('td', null, dataBR(a.atualizado_em)));
      let aberta = null;
      linha.onclick = () => { if (aberta) { aberta.remove(); aberta = null; return; } aberta = detalhe(a, t); linha.after(aberta); };
      tabela.append(linha);
    });
    const voltar = el('button', { class: 'nao-imprimir', onclick: painel }, '⬅ Turmas');
    tela(el('div', { class: 'cartao' }, voltar,
      el('h2', null, `${t.nome}${t.escola ? ' · ' + t.escola : ''}`),
      el('p', null, 'Código da turma: ', el('span', { class: 'codigo' }, t.codigo), ' ', selo(t)),
      resumo,
      topDif.length ? el('p', null, el('b', null, 'Sons que mais precisam de reforço na turma: '), topDif.map(([s, n]) => `${s} (${n} aluno${n > 1 ? 's' : ''})`).join(' · ')) : null,
      alunos.length ? tabela : el('div', { class: 'msg' }, 'Nenhum aluno ainda. Passe o código para as famílias ou digite-o nos tablets da escola: Área dos Pais → 🏫 Escola.'),
      el('div', { class: 'linha nao-imprimir' },
        el('button', { onclick: () => csv(t, alunos) }, '⬇️ Exportar planilha (CSV)'),
        el('button', { onclick: () => window.print() }, '🖨️ Imprimir'),
        el('button', { onclick: () => bilhete(t) }, '✉️ Bilhete para as famílias'),
        el('button', { class: 'perigo', onclick: async () => { if (!confirm(`Excluir a turma ${t.nome} e os dados de todos os alunos? Não dá para desfazer.`)) return; try { await api('DELETE', `turmas?id=eq.${t.id}`); painel(); } catch (e) { alert(e.message); } } }, '🗑️ Excluir turma'))));
  }
  function barras(v) { const max = Math.max(10, ...v); return el('span', { class: 'mini-barras', title: 'minutos por dia (14 dias)' }, ...v.map((x) => { const i = el('i'); i.style.height = Math.max(2, x / max * 28) + 'px'; return i; })); }
  function detalhe(a, t) {
    const r = a.resumo || {};
    const flu = (r.fluencia || []);
    const td = el('td', { colspan: 7 },
      el('p', null, el('b', null, 'Já sabe bem: '), (r.domina || []).join(', ') || '—'),
      el('p', null, el('b', null, 'Está treinando: '), (r.treinando || []).join(', ') || '—'),
      el('p', null, el('b', { class: 'ruim' }, 'Precisa de ajuda: '), (r.dificuldade || []).join(', ') || '—'),
      el('p', null, el('b', null, 'Sons que mais confunde: '), (r.confusoes || []).join(', ') || '—'),
      el('p', null, el('b', null, 'Nível: '), r.nivel || '—', ' · ', el('b', null, 'Estrelas: '), String(r.estrelas || 0), ' · ', el('b', null, 'Avaliação inicial: '), r.avaliacao ? (r.avaliacao.pulada ? 'pulada' : `começou no Mundo ${r.avaliacao.mundoInicial}`) : '—'),
      el('p', null, el('b', null, 'Fluência: '), flu.length ? flu.map((f) => `${dataBR(f.data)}: ${f.pcpm} PCPM, ${f.precisao}%`).join(' → ') : 'nenhum teste ainda (Área dos Pais → 📈 Fluência)'),
      el('div', { class: 'linha nao-imprimir' }, el('button', { class: 'perigo', onclick: async () => { if (!confirm(`Remover ${a.apelido} da turma? Os dados serão apagados.`)) return; try { await api('DELETE', `alunos?id=eq.${a.id}`); turma(t); } catch (e) { alert(e.message); } } }, 'Remover aluno')));
    return el('tr', { class: 'detalhe' }, td);
  }
  function csv(t, alunos) {
    const q = (v) => `"${String(v === undefined || v === null ? '' : v).replace(/"/g, '""')}"`;
    const linhas = [['aluno', 'mundo', 'fase', 'fases_concluidas', 'total_fases', 'estrelas', 'minutos_7_dias', 'ultimo_pcpm', 'ultima_precisao', 'dificuldade', 'treinando', 'domina', 'ultimo_envio']];
    alunos.forEach((a) => { const r = a.resumo || {}; const f = (r.fluencia || []).slice(-1)[0] || {};
      linhas.push([a.apelido, r.mundo, r.fase, r.concluidas, r.totalFases, r.estrelas, r.minutos7, f.pcpm, f.precisao, (r.dificuldade || []).join('; '), (r.treinando || []).join('; '), (r.domina || []).join('; '), a.atualizado_em]); });
    const blob = new Blob(['﻿' + linhas.map((l) => l.map(q).join(';')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const lk = el('a', { href: URL.createObjectURL(blob), download: `ler-brincando-${t.codigo}-${hoje()}.csv` }); document.body.append(lk); lk.click(); lk.remove();
  }
  function bilhete(t) {
    const w = window.open('', '_blank'); if (!w) return alert('Permita janelas pop-up para imprimir.');
    const um = `<div style="border:2px dashed #999;border-radius:14px;padding:16px;margin:10px 0;font-family:Andika,sans-serif">
      <h2 style="margin:0">📚 Ler Brincando na turma ${t.nome.replace(/[<>&]/g, '')}</h2>
      <p>1. Instale o <b>Ler Brincando</b> (Google Play) ou abra a versão para navegador.<br>2. Crie o perfil com o primeiro nome da criança.<br>
      3. Toque em <b>Área dos Pais → 🏫 Escola</b> e digite o código: <b style="font-size:26px;letter-spacing:4px">${t.codigo}</b><br>
      4. Deixe a criança jogar 10 a 15 minutos, 4 ou 5 vezes por semana.</p>
      <p style="font-size:12px">A professora verá só o nome do perfil e o progresso no jogo (sem voz, foto ou localização). Para sair, use o mesmo menu: os dados são apagados.</p></div>`;
    w.document.write(`<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Bilhete ${t.codigo}</title></head><body>${um.repeat(3)}<script>setTimeout(function(){print()},400)<\/script></body></html>`); w.document.close();
  }

  // ------------------------------------------------------------------ início (trata o retorno do link de e-mail)
  const hash = new URLSearchParams(location.hash.slice(1));
  if (hash.get('access_token')) {
    guardar({ access_token: hash.get('access_token'), refresh_token: hash.get('refresh_token'), expires_at: Math.floor(Date.now() / 1000) + Number(hash.get('expires_in') || 3600), user: null });
    history.replaceState(null, '', location.pathname);
    if (hash.get('type') === 'recovery') {
      const nova = prompt('Digite a nova senha (mínimo de 6 caracteres):');
      if (nova) fetch(`${URL_SB}/auth/v1/user`, { method: 'PUT', headers: { apikey: ANON, Authorization: 'Bearer ' + sessao.access_token, 'Content-Type': 'application/json' }, body: JSON.stringify({ password: nova }) }).then((r) => alert(r.ok ? 'Senha alterada!' : 'Não deu para alterar a senha.'));
    }
  }
  if (sessao) painel(); else telaLogin();
})();
