"""Capturas das telas principais (mapa, história em andamento, Área dos Pais, autoteste)."""
import threading, http.server, socketserver, functools, os, time, sys
from playwright.sync_api import sync_playwright
RAIZ=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
class S(socketserver.TCPServer): allow_reuse_address=True
PORTA=int(os.environ.get('PORTA','8790'))
srv=S(('127.0.0.1',PORTA),functools.partial(http.server.SimpleHTTPRequestHandler,directory=RAIZ)); threading.Thread(target=srv.serve_forever,daemon=True).start()
STUB="(() => { const ss = window.speechSynthesis; if (ss) { ss.speak = (u) => setTimeout(() => { u.onend && u.onend({}); }, 5); ss.cancel = () => {}; ss.getVoices = () => []; } })();"
err=[]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1208/chrome-linux64/chrome')
    pg=b.new_page(viewport={'width':390,'height':844},reduced_motion='reduce'); pg.add_init_script(STUB)
    pg.on('pageerror',lambda e: err.append(str(e)))
    pg.route('**/cdn.jsdelivr.net/**',lambda r:r.abort()); pg.route('**/fonts.g*/**',lambda r:r.abort())
    pg.goto(f'http://127.0.0.1:{PORTA}/index.html'); pg.wait_for_timeout(300)
    pg.click('#comecar'); pg.wait_for_timeout(2600)
    pg.fill('input[type=text]','Ana'); pg.check('#pularAv'); pg.click('text=Criar'); pg.wait_for_timeout(500)
    pg.screenshot(path=os.path.join(RAIZ,'ferramentas','tela_mapa.png'))
    pg.evaluate("(()=>{const P=LB.Store.perfil;for(const f of LB.D.fases){P.liberadas.push(f.id); if(f.id==='4.11')break;} Cenas.jogarFase(LB.D.fases.findIndex(f=>f.id==='4.11'));})()")
    pg.wait_for_timeout(2500)
    pg.screenshot(path=os.path.join(RAIZ,'ferramentas','tela_historia.png'))
    pg.evaluate("Cenas.painelPais('progresso')"); pg.wait_for_timeout(500)
    pg.screenshot(path=os.path.join(RAIZ,'ferramentas','tela_pais.png'), full_page=False)
    pg.evaluate("Cenas.painelPais('autoteste')"); pg.wait_for_timeout(300)
    pg.click('text=Rodar validadores'); pg.wait_for_timeout(9000)
    pg.screenshot(path=os.path.join(RAIZ,'ferramentas','tela_autoteste.png'), full_page=True)
    print(pg.inner_text('.painel h3')[:200])
    b.close()
srv.shutdown(); print('erros', err)
