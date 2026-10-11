"""Verifica o andaime de 3 níveis num item de 2 opções (Gêmeos): erra 2 vezes e confere dica e destaque."""
import threading, http.server, socketserver, functools, os
from playwright.sync_api import sync_playwright
RAIZ=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
class S(socketserver.TCPServer): allow_reuse_address=True
PORTA=int(os.environ.get('PORTA','8797'))
srv=S(('127.0.0.1',PORTA),functools.partial(http.server.SimpleHTTPRequestHandler,directory=RAIZ)); threading.Thread(target=srv.serve_forever,daemon=True).start()
STUB="(() => { window.__falas=[]; const ss = window.speechSynthesis; if (ss) { ss.speak = (u) => { window.__falas.push(u.text); setTimeout(() => { u.onend && u.onend({}); }, 5); }; ss.cancel = () => {}; ss.getVoices = () => []; } })();"
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1208/chrome-linux64/chrome')
    pg=b.new_page(viewport={'width':390,'height':844},reduced_motion='reduce'); pg.add_init_script(STUB)
    pg.route('**/cdn.jsdelivr.net/**',lambda r:r.abort()); pg.route('**/fonts.g*/**',lambda r:r.abort())
    pg.goto(f'http://127.0.0.1:{PORTA}/index.html'); pg.click('#comecar'); pg.wait_for_timeout(2600)
    pg.fill('input[type=text]','X'); pg.check('#pularAv'); pg.click('text=Criar'); pg.wait_for_timeout(300)
    pg.evaluate("(()=>{const P=LB.Store.perfil;P.demos.gemeos=true;for(const f of LB.D.fases){P.liberadas.push(f.id);if(f.id==='4.7')break;} Cenas.jogarFase(LB.D.fases.findIndex(f=>f.id==='4.7'));})()")
    pg.wait_for_timeout(1500)
    while pg.evaluate("LB.estado.itemAtual.ui")!='escolha' or pg.evaluate("LB.estado.itemAtual.tipo")!='gemeos': pg.wait_for_timeout(200); pg.click(f'.opcao[data-id="{pg.evaluate("LB.estado.esperado")}"]'); pg.wait_for_timeout(600)
    certo=pg.evaluate("LB.estado.esperado"); errado=[o.get_attribute('data-id') for o in pg.query_selector_all('.opcao') if o.get_attribute('data-id')!=certo][0]
    pg.evaluate("window.__falas=[]")
    pg.click(f'.opcao[data-id="{errado}"]'); pg.wait_for_timeout(1500); n1=list(pg.evaluate("window.__falas")); pg.evaluate("window.__falas=[]")
    pg.click(f'.opcao[data-id="{errado}"]'); pg.wait_for_timeout(1500); n2=list(pg.evaluate("window.__falas")); pg.evaluate("window.__falas=[]")
    pg.click(f'.opcao[data-id="{errado}"]'); pg.wait_for_timeout(1500); n3=list(pg.evaluate("window.__falas"))
    dest=pg.query_selector(f'.opcao[data-id="{certo}"]').get_attribute('class')
    print('nivel1:', n1[:3]); print('nivel2:', n2[:3]); print('nivel3:', n3[:2], '| classe da certa:', dest)
    b.close()
srv.shutdown()
