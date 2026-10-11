"""Teste de fumaça no Chromium: um robô joga as fases pela interface (respondendo certo)."""
import sys, time, json, threading, http.server, socketserver, os, functools
from playwright.sync_api import sync_playwright
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORTA = int(os.environ.get('PORTA', '8765'))
http.server.SimpleHTTPRequestHandler.log_message = lambda *a: None
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=RAIZ)
class S(socketserver.TCPServer): allow_reuse_address = True
srv = S(('127.0.0.1', PORTA), H); threading.Thread(target=srv.serve_forever, daemon=True).start()
H.log_message = lambda *a: None
fases = sys.argv[1].split(',') if len(sys.argv) > 1 else ['1.1']
STUB = """
(() => { const ss = window.speechSynthesis; if (ss) { ss.speak = (u) => setTimeout(() => { u.onend && u.onend({}); }, 5); ss.cancel = () => {}; ss.getVoices = () => []; } })();
"""
erros = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1208/chrome-linux64/chrome', args=['--autoplay-policy=no-user-gesture-required'])
    vp = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {'width': 390, 'height': 844}
    pg = b.new_page(viewport=vp, has_touch=True, reduced_motion='reduce')
    pg.add_init_script(STUB)
    pg.on('console', lambda m: erros.append('console.' + m.type + ': ' + m.text) if m.type == 'error' and 'openmoji' not in m.text and 'fonts.g' not in m.text and 'ERR_' not in m.text and 'Failed to load resource' not in m.text else None)
    pg.on('pageerror', lambda e: erros.append('PAGEERROR: ' + str(e)))
    pg.route('**/cdn.jsdelivr.net/**', lambda r: r.abort()); pg.route('**/fonts.g*/**', lambda r: r.abort())
    pg.goto(f'http://127.0.0.1:{PORTA}/index.html'); pg.wait_for_timeout(300)
    pg.click('#comecar'); pg.wait_for_timeout(2700)
    pg.fill('input[type=text]', 'Teste'); pg.check('#pularAv'); pg.click('text=Criar'); pg.wait_for_timeout(400)
    pg.screenshot(path=os.path.join(RAIZ, 'ferramentas', 'shot_mapa.png'))
    def ev(js): return pg.evaluate(js)
    for fid in fases:
        pg.wait_for_timeout(200)
        ev(f"""(() => {{ LB.Som.parar(); const P = LB.Store.perfil; const i = LB.D.fases.findIndex(f => f.id === '{fid}'); for (let k=0;k<=i;k++) if(!P.liberadas.includes(LB.D.fases[k].id)) P.liberadas.push(LB.D.fases[k].id); Cenas.jogarFase(i); }})()""")
        pg.wait_for_timeout(300)
        t0 = time.time(); ultimo = None; repet = 0; shot = False; t_acao = 0
        while time.time() - t0 < 120:
            if pg.query_selector('.resultado .estrelas'): break
            md = pg.query_selector('.modal button:last-child')
            if md:
                try: md.click(timeout=1000)
                except Exception: pass
            info = ev("""(() => { const it = LB.estado.itemAtual; return it ? { seq: LB.estado.itemSeq, ui: it.ui, certo: it.certo, esp: LB.estado.esperado, pal: it.palavra, sil: it.silabas, cortes: it.cortes, letra: it.letra } : null; })()""")
            if not info: pg.wait_for_timeout(100); continue
            ui = info['ui']
            if ui not in ('historia', 'bingo', 'memoria') and info['seq'] == ultimo and time.time() - t_acao < 6:
                pg.wait_for_timeout(150); continue
            ultimo = info['seq']; t_acao = time.time()
            if not shot and ui not in ('mostra','regraMostra','freqMostra','marco'):
                pg.screenshot(path=os.path.join(RAIZ, 'ferramentas', f'shot_{fid}.png')); shot = True
            try:
                if ui in ('escolha',):
                    esp = info['esp'] or info['certo']
                    sel = f'.opcao[data-id="{esp}"]'
                    pg.wait_for_selector(sel, timeout=4000); pg.click(sel, timeout=3000)
                elif ui in ('mostra', 'regraMostra', 'freqMostra'):
                    pg.click('text=Continuar', timeout=8000)
                elif ui == 'marco': pg.wait_for_timeout(200)
                elif ui == 'palmas':
                    pg.wait_for_selector('.tambor'); pg.click('button[aria-label=apagar]')
                    for _ in range(info['certo']): pg.click('.tambor')
                    pg.click('text=Pronto')
                elif ui == 'trem':
                    pg.wait_for_selector('.peca')
                    for k, s in enumerate(info['sil']):
                        pecas = pg.query_selector_all('.pecas .peca')
                        alvo = [x for x in pecas if x.inner_text().strip().upper() == s][0]
                        alvo.click(); pg.query_selector_all('.vagao:not(.loco)')[k].click()
                elif ui == 'fatiar':
                    pg.wait_for_selector('.corte')
                    for c0 in pg.query_selector_all('.corte.on'): c0.click()
                    for c in info['cortes']: pg.click(f'.corte[data-pos="{c}"]')
                    pg.click('text=Pronto')
                elif ui == 'ditado':
                    pg.wait_for_selector('.tecla')
                    for _ in range(12): pg.click('.tecla[aria-label=apagar]')
                    for ch in info['pal']:
                        pg.click(f'.tecla:text-is("{ch}")')
                    pg.click('.tecla[aria-label=pronto]')
                elif ui == 'memoria':
                    pg.wait_for_selector('.carta')
                    pares = ev("LB.estado.itemAtual.cartas.map(c => c.par)")
                    cartas = pg.query_selector_all('.carta')
                    for par in sorted(set(pares)):
                        idx = [i for i, x in enumerate(pares) if x == par]
                        cartas[idx[0]].click(); pg.wait_for_timeout(80); cartas[idx[1]].click(); pg.wait_for_timeout(450)
                elif ui == 'bingo':
                    pg.wait_for_selector('.cel'); esp = info['esp']
                    if esp: pg.click(f'.cel[aria-label="casa {esp}"]', timeout=3000)
                elif ui == 'micro':
                    pg.click('text=Um adulto ouviu e confirma', timeout=8000)
                elif ui == 'tracado':
                    pg.wait_for_selector('.tracado-wrap canvas'); pg.wait_for_timeout(300)
                    box = pg.query_selector('.tracado-wrap canvas').bounding_box()
                    tr = ev(f"MJ.TRACOS['{info['letra']}']")
                    for st in tr:
                        pts = st
                        pg.mouse.move(box['x'] + pts[0][0]/100*box['width'], box['y'] + pts[0][1]/100*box['height']); pg.mouse.down()
                        for a, bb in zip(pts, pts[1:]):
                            for k in range(1, 5):
                                x = a[0] + (bb[0]-a[0])*k/4; y = a[1] + (bb[1]-a[1])*k/4
                                pg.mouse.move(box['x'] + x/100*box['width'], box['y'] + y/100*box['height'])
                        pg.mouse.up(); pg.wait_for_timeout(120)
                elif ui == 'historia':
                    esp = info['esp']
                    btns = pg.query_selector_all('.opcoes .opcao')
                    if btns and esp is not None:
                        # opções de história: texto (sílaba) ou imagem (índice)
                        clic = False
                        for bt in btns:
                            if bt.inner_text().strip().upper() == str(esp).upper(): bt.click(); clic = True; break
                        if not clic:
                            ordem = ev("""(() => { const h = LB.D.historias.find(x => x.id === LB.estado.itemAtual.historia); return null; })()""")
                            # perguntas: id = índice original; botões embaralhados → usa o gancho do texto alternativo
                            pg.evaluate("""(esp) => { const bs=[...document.querySelectorAll('.opcoes .opcao')]; }""", esp)
                            # tenta todos até acertar (o andaime aceita)
                            for bt in btns:
                                if pg.query_selector('.opcoes .opcao.certa'): break
                                try: bt.click(timeout=500)
                                except Exception: pass
                                pg.wait_for_timeout(150)
                    else:
                        prox = pg.query_selector('button[aria-label="próxima"]')
                        if prox: prox.click()
                pg.wait_for_timeout(250)
            except Exception as e:
                repet += 1
                if repet > 40: erros.append(f'{fid}: travou em {ui}: {e}'); break
                pg.wait_for_timeout(300)
        else:
            erros.append(f'{fid}: tempo esgotado')
        res = pg.query_selector('.resultado .estrelas')
        print(fid, 'OK' if res else 'SEM RESULTADO', res.get_attribute('aria-label') if res else '', flush=True)
        pg.screenshot(path=os.path.join(RAIZ, 'ferramentas', f'shot_{fid}_fim.png'))
    b.close()
srv.shutdown()
print('ERROS:', len(erros)); [print(' -', e) for e in erros[:30]]
