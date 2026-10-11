import threading, http.server, socketserver, functools, os, sys
from playwright.sync_api import sync_playwright
RAIZ=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
class S(socketserver.TCPServer): allow_reuse_address=True
PORTA=int(os.environ.get('PORTA','8810'))
srv=S(('127.0.0.1',PORTA),functools.partial(http.server.SimpleHTTPRequestHandler,directory=RAIZ)); threading.Thread(target=srv.serve_forever,daemon=True).start()
STUB="(() => { const ss = window.speechSynthesis; if (ss) { ss.speak = (u) => setTimeout(() => { u.onend && u.onend({}); }, 5); ss.cancel = () => {}; ss.getVoices = () => []; } })();"
err=[]; out='/home/claude/shots'; os.makedirs(out,exist_ok=True)
vp=[int(x) for x in sys.argv[1].split('x')] if len(sys.argv)>1 else [390,844]
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1208/chrome-linux64/chrome')
    pg=b.new_page(viewport={'width':vp[0],'height':vp[1]},reduced_motion='reduce'); pg.add_init_script(STUB)
    pg.on('pageerror',lambda e: err.append(str(e)))
    pg.route('**/cdn.jsdelivr.net/**',lambda r:r.abort()); pg.route('**/fonts.g*/**',lambda r:r.abort())
    pg.goto(f'http://127.0.0.1:{PORTA}/index.html'); pg.wait_for_timeout(500)
    tag=f'{vp[0]}'
    pg.screenshot(path=f'{out}/inicio_{tag}.png')
    pg.click('#comecar'); pg.wait_for_timeout(2600)
    pg.fill('input[type=text]','Ana'); pg.check('#pularAv'); pg.click('text=Criar'); pg.wait_for_timeout(600)
    pg.evaluate("(()=>{const P=LB.Store.perfil;['1.1','1.2','1.3'].forEach(id=>P.fases[id]={estrelas:3,dominada:true,jogos:1,melhor:1}); P.fases['1.4']={estrelas:2,dominada:true,jogos:1,melhor:.9}; LB.Store.salvar(); Cenas.mapa(1);})()")
    pg.wait_for_timeout(600); pg.screenshot(path=f'{out}/mapa1_{tag}.png')
    for m in (3,6,7,8):
        pg.evaluate(f"(()=>{{const P=LB.Store.perfil;for(const f of LB.D.fases){{if(!P.liberadas.includes(f.id))P.liberadas.push(f.id);}} Cenas.mapa({m});}})()"); pg.wait_for_timeout(500)
        pg.screenshot(path=f'{out}/mapa{m}_{tag}.png')
    pg.evaluate("void Cenas.jogarFase(LB.D.fases.findIndex(f=>f.id==='4.7'))"); pg.wait_for_timeout(2500)
    pg.screenshot(path=f'{out}/jogo_{tag}.png')
    pg.evaluate("LB.Som.parar(); void Cenas.jogarFase(LB.D.fases.findIndex(f=>f.id==='5.3'))"); pg.wait_for_timeout(2500)
    pg.screenshot(path=f'{out}/trem_{tag}.png')
    b.close()
srv.shutdown(); print('erros', err)
