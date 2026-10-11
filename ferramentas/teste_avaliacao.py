import threading, http.server, socketserver, functools, os, time
from playwright.sync_api import sync_playwright
RAIZ=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
class S(socketserver.TCPServer): allow_reuse_address=True
PORTA=int(os.environ.get('PORTA','8795'))
srv=S(('127.0.0.1',PORTA),functools.partial(http.server.SimpleHTTPRequestHandler,directory=RAIZ)); threading.Thread(target=srv.serve_forever,daemon=True).start()
STUB="(() => { const ss = window.speechSynthesis; if (ss) { ss.speak = (u) => setTimeout(() => { u.onend && u.onend({}); }, 5); ss.cancel = () => {}; ss.getVoices = () => []; } })();"
err=[]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1208/chrome-linux64/chrome')
    pg=b.new_page(viewport={'width':820,'height':1180},reduced_motion='reduce'); pg.add_init_script(STUB)
    pg.on('pageerror',lambda e: err.append(str(e)))
    pg.route('**/cdn.jsdelivr.net/**',lambda r:r.abort()); pg.route('**/fonts.g*/**',lambda r:r.abort())
    pg.goto(f'http://127.0.0.1:{PORTA}/index.html'); pg.wait_for_timeout(300)
    pg.click('#comecar'); pg.wait_for_timeout(2600)
    pg.fill('input[type=text]','Bia'); pg.click('text=Criar'); pg.wait_for_timeout(1200)
    t0=time.time(); n=0
    while time.time()-t0<60:
        if pg.query_selector('text=Mapa'): break
        # responde certo nos 2 primeiros blocos e erra nas sílabas (para testar o posicionamento)
        pal=pg.query_selector('.tambor')
        if pal:
            c=pg.evaluate("document.querySelector('.tambor') && LB.Motor ? null : null")
        esp=pg.evaluate("LB.estado.esperado")
        if pg.query_selector('.tambor'):
            # palmas: conta pelo visor (não exposto) → erra de propósito? Não: usa 2 toques
            for _ in range(2): pg.click('.tambor')
            pg.click('text=Pronto'); pg.wait_for_timeout(700); continue
        if esp:
            ops=pg.query_selector_all('.opcao')
            alvo=[o for o in ops if o.get_attribute('data-id')==esp]
            if alvo: alvo[0].click(); n+=1; pg.wait_for_timeout(500); continue
        pg.wait_for_timeout(200)
    pg.wait_for_timeout(500)
    print('itens respondidos', n, 'avaliacao:', pg.evaluate("JSON.stringify(LB.Store.perfil.avaliacao)"))
    pg.screenshot(path=os.path.join(RAIZ,'ferramentas','tela_avaliacao_fim.png'))
    b.close()
srv.shutdown(); print('erros', err)
