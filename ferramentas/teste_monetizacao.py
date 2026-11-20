"""Teste no Chromium das funções da v1.4: versão completa (paywall), compra simulada na Google Play,
código de turma, estatísticas anônimas e medidor de fluência.
A nuvem e a loja são SIMULADAS dentro do navegador (page.route e um Capacitor falso): nada sai da máquina.
Uso: python ferramentas/teste_monetizacao.py   (capturas em ferramentas/capturas/)"""
import os, json, threading, http.server, socketserver, functools, re
from playwright.sync_api import sync_playwright

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAPT = os.environ.get('CAPTURAS', os.path.join(RAIZ, 'ferramentas', 'capturas')); os.makedirs(CAPT, exist_ok=True)
PORTA = int(os.environ.get('PORTA', '8766'))
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=RAIZ)
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
class S(socketserver.TCPServer): allow_reuse_address = True
srv = S(('127.0.0.1', PORTA), H); threading.Thread(target=srv.serve_forever, daemon=True).start()
BASE = f'http://127.0.0.1:{PORTA}/index.html'
SB = 'https://exemplo-teste.supabase.co'

FALA = """(() => { const ss = window.speechSynthesis; if (ss) { ss.speak = (u) => setTimeout(() => { u.onend && u.onend({}); }, 5); ss.cancel = () => {}; ss.getVoices = () => []; } })();"""
CAPACITOR = """(() => {
  window.__compras = [];
  const lista = [{ id: 'completo_vitalicio', tipo: 'inapp', titulo: 'Completo', preco: 'R$ 39,90' }, { id: 'completo_anual', tipo: 'subs', titulo: 'Anual', preco: 'R$ 89,90', testeGratis: true }];
  window.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'android', Plugins: {
    App: { addListener() {}, minimizeApp() {} },
    Cobranca: {
      produtos: async () => ({ produtos: lista }),
      comprar: async ({ id }) => { const c = { produtos: [id], estado: 'comprado', token: 'tok-' + id, data: Date.now() }; window.__compras.push(c); return { ok: true, codigo: 0, compras: [c] }; },
      restaurar: async () => ({ compras: window.__compras })
    } } };
})();"""

resultados = []; erros = []
def ok(nome, cond, det=''):
    resultados.append((('APROVADO' if cond else 'REPROVADO'), nome, det))

def nova_pagina(b, nuvem=False, android=False):
    pg = b.new_page(viewport={'width': 390, 'height': 844}, has_touch=True, reduced_motion='reduce')
    pg.add_init_script(FALA)
    if android: pg.add_init_script(CAPACITOR)
    pg.on('pageerror', lambda e: erros.append('PAGEERROR: ' + str(e)))
    pg.route('**/cdn.jsdelivr.net/**', lambda r: r.abort())
    chamadas = []
    if nuvem:
        def cfg(route):
            txt = open(os.path.join(RAIZ, 'config.js'), encoding='utf-8').read()
            txt = txt.replace("supabaseUrl: ''", f"supabaseUrl: '{SB}'").replace("supabaseAnon: ''", "supabaseAnon: 'chave-anon-teste'")
            route.fulfill(status=200, content_type='application/javascript', body=txt)
        pg.route('**/config.js', cfg)
        def rpc(route):
            fn = route.request.url.rsplit('/', 1)[-1]; corpo = json.loads(route.request.post_data or '{}'); chamadas.append((fn, corpo))
            resp = {'entrar_turma': [{'aluno_id': '00000000-0000-4000-8000-000000000001', 'token': '00000000-0000-4000-8000-0000000000aa', 'turma_nome': '1º ano A', 'escola': 'EM Teste', 'licenca_ate': '2099-12-31'}],
                    'enviar_progresso': [{'licenca_ate': '2099-12-31', 'turma_nome': '1º ano A'}]}.get(fn)
            route.fulfill(status=200, content_type='application/json', body=json.dumps(resp))
        pg.route(SB + '/rest/v1/rpc/*', rpc)
    pg.goto(BASE); pg.wait_for_timeout(300)
    return pg, chamadas

def comecar(pg, nome='Ana', consentir=None):
    pg.click('#comecar'); pg.wait_for_timeout(2700)
    pg.fill('input[type=text]', nome); pg.check('#pularAv'); pg.click('text=Criar'); pg.wait_for_timeout(500)
    if consentir is not None:
        pg.click('text=' + ('Sim, pode enviar' if consentir else 'Não, obrigado')); pg.wait_for_timeout(400)
    if pg.query_selector('text=Entendi'): pg.click('text=Entendi'); pg.wait_for_timeout(200)

def liberar_ate(pg, fid):
    pg.evaluate(f"""(() => {{ const P = LB.Store.perfil; const i = LB.D.fases.findIndex(f => f.id === '{fid}'); for (let k=0;k<=i;k++) if(!P.liberadas.includes(LB.D.fases[k].id)) P.liberadas.push(LB.D.fases[k].id); LB.Store.salvar(); }})()""")

def responder_portao(pg):
    pg.wait_for_selector('.modal input[type=number]'); r = pg.evaluate('LB.estado.respostaPortao')
    pg.fill('.modal input[type=number]', str(r)); pg.click('.modal >> text=Entrar'); pg.wait_for_timeout(400)

with sync_playwright() as p:
    b = p.chromium.launch(**({'executable_path': os.environ['CHROMIUM']} if os.environ.get('CHROMIUM') else {}), args=['--autoplay-policy=no-user-gesture-required'])

    # 1) Navegador, sem nuvem: Mundo 3 pede a versão completa; o adulto vê o caminho da Google Play
    pg, _ = nova_pagina(b)
    comecar(pg)
    liberar_ate(pg, '3.1'); pg.evaluate("Cenas.mapa(3)"); pg.wait_for_timeout(400)
    aba3 = pg.inner_text('.aba-mundo.pago') if pg.query_selector('.aba-mundo.pago') else ''
    pg.screenshot(path=os.path.join(CAPT, 'v14_mapa_mundo3.png'))
    pg.click('.no-fase >> nth=0'); pg.wait_for_timeout(500)
    aviso = pg.query_selector('.modal >> text=Chame um adulto') is not None
    pg.screenshot(path=os.path.join(CAPT, 'v14_aviso_crianca.png'))
    pg.click('text=Sou adulto'); responder_portao(pg)
    tela_ok = pg.query_selector('.paywall >> text=Abrir a Google Play') is not None and pg.query_selector('.paywall >> text=Tenho um código de turma') is not None
    pg.screenshot(path=os.path.join(CAPT, 'v14_paywall_web.png'), full_page=True)
    livre = pg.evaluate("(() => { const i = LB.D.fases.findIndex(f => f.id === '2.1'); return !Premium.faseBloqueada(i) && Premium.faseBloqueada(i + 12); })()")
    ok('Paywall no navegador', '⭐' in aba3 and aviso and tela_ok and livre, f'aba "{aba3}", aviso infantil={aviso}, tela do adulto={tela_ok}, Mundo 2 livre e Mundo 3 bloqueado={livre}')

    # 2) Medidor de fluência (Área dos Pais → 📈 Fluência)
    pg.evaluate("Cenas.painelPais('fluencia')"); pg.wait_for_timeout(300)
    pg.click('text=Começar o teste'); pg.click('text=Entendi'); pg.wait_for_timeout(200)
    pg.click('.teste-fluencia >> text=Começar'); pg.wait_for_timeout(2900)
    pgs = pg.query_selector_all('.texto-fluencia .pal')
    for k in (1, 4, 6): pgs[k].click()
    pgs[4].click()   # autocorreção: desfaz
    pg.screenshot(path=os.path.join(CAPT, 'v14_fluencia_teste.png'))
    pg.wait_for_timeout(1200); pg.click('text=Terminou'); pg.wait_for_timeout(200)
    pgs[19].click(); pg.wait_for_timeout(400)
    pg.screenshot(path=os.path.join(CAPT, 'v14_fluencia_resultado.png'))
    reg = pg.evaluate("LB.Store.perfil.fluencia.slice(-1)[0]")
    pg.click('.modal >> text=OK'); pg.wait_for_timeout(300)
    hist = pg.query_selector('text=Resultados anteriores') is not None
    ok('Medidor de fluência', reg['lidas'] == 20 and reg['erros'] == 2 and reg['pcpm'] > 0 and hist, f"lidas={reg['lidas']} erros={reg['erros']} seg={reg['seg']} PCPM={reg['pcpm']} precisão={reg['precisao']}%")

    # 3) Aba Escola sem nuvem configurada
    pg.evaluate("Cenas.painelPais('escola')"); pg.wait_for_timeout(200)
    ok('Escola sem nuvem', pg.query_selector('text=não está configurada') is not None)
    pg.close()

    # 4) Com nuvem: consentimento, código de turma, licença da escola libera o Mundo 3, estatísticas vão em lote
    pg, chamadas = nova_pagina(b, nuvem=True)
    comecar(pg, 'Bia', consentir=True)
    pg.evaluate("Cenas.painelPais('escola')"); pg.wait_for_timeout(200)
    pg.fill('input[aria-label="código da turma"]', 'k7m-3qx'); pg.click('text=Sou o responsável'); pg.click('text=Entrar na turma'); pg.wait_for_timeout(800)
    pg.screenshot(path=os.path.join(CAPT, 'v14_escola.png'), full_page=True)
    entrou = [c for c in chamadas if c[0] == 'entrar_turma']; env = [c for c in chamadas if c[0] == 'enviar_progresso']
    resumo = env[-1][1]['p_resumo'] if env else {}
    liberar_ate(pg, '3.1'); i31 = pg.evaluate("LB.D.fases.findIndex(f => f.id === '3.1')")
    pg.evaluate(f"Cenas.introFase({i31})"); pg.wait_for_timeout(400)
    abriu = pg.query_selector('text=Começar') is not None and pg.query_selector('.modal >> text=Chame um adulto') is None
    pg.evaluate("Analitica.enviar()"); pg.wait_for_timeout(500)
    ev = [c for c in chamadas if c[0] == 'registrar_eventos']
    nomes = [e['nome'] for c in ev for e in c[1]['p_eventos']]
    sem_nome = all('Bia' not in json.dumps(c[1]) for c in ev)
    ok('Turma da escola', len(entrou) == 1 and entrou[0][1]['p_codigo'] == 'K7M3QX' and resumo.get('totalFases') == 93 and 'minutos14' in resumo and abriu,
       f"código enviado={entrou[0][1]['p_codigo'] if entrou else None}; resumo com {len(resumo)} campos; Mundo 3 aberto pela licença={abriu}")
    ok('Estatísticas anônimas', 'perfil_criado' in nomes and 'turma_entrou' in nomes and sem_nome, f"eventos={sorted(set(nomes))}; sem o nome da criança={sem_nome}")
    # sair da turma apaga o vínculo e volta o paywall
    pg.evaluate("Cenas.painelPais('escola')"); pg.wait_for_timeout(200)
    pg.on('dialog', lambda d: d.accept())
    pg.click('.figurinha >> text=Sair'); pg.wait_for_timeout(500)
    saiu = [c for c in chamadas if c[0] == 'sair_turma']
    ok('Sair da turma', len(saiu) == 1 and pg.evaluate("!LB.Store.dados.turma && !Premium.ativo()"), 'vínculo apagado e versão completa bloqueada de novo')
    pg.close()

    # 5) App Android simulado: preços da loja, compra e restauração
    pg, _ = nova_pagina(b, android=True)
    comecar(pg, 'Caio')
    pg.evaluate("Cenas.painelPais('premium')"); pg.wait_for_timeout(200)
    pg.click('text=Ver planos'); pg.wait_for_timeout(600)
    precos = pg.inner_text('.planos')
    pg.screenshot(path=os.path.join(CAPT, 'v14_paywall_android.png'), full_page=True)
    pg.click('.plano >> nth=0'); pg.wait_for_timeout(600)
    comprou = pg.evaluate("Premium.ativo() && Premium.origem() === 'compra'")
    pg.evaluate("LB.Store.dados.premium = { compra: null }"); pg.evaluate("Premium.verificar(false)"); pg.wait_for_timeout(300)
    restaurou = pg.evaluate("Premium.compraAtiva()")
    ok('Compra na Google Play (simulada)', 'R$ 39,90' in precos and '7 dias grátis' in precos and comprou and restaurou, f'compra liberou={comprou}, restauração={restaurou}')
    pg.close(); b.close()

srv.shutdown()
for st, n, d in resultados: print(f'[{st}] {n}: {d}')
for e in erros: print(e)
if erros or any(st != 'APROVADO' for st, _, _ in resultados): raise SystemExit(1)
