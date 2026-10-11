"""Capturas das telas de jogo + checagem de centralização (opções × referência)."""
import threading, http.server, socketserver, functools, os, sys, json
from playwright.sync_api import sync_playwright
RAIZ=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); http.server.SimpleHTTPRequestHandler.log_message=lambda *a:None
class S(socketserver.TCPServer): allow_reuse_address=True
PORTA=int(os.environ.get('PORTA','8830'))
srv=S(('127.0.0.1',PORTA),functools.partial(http.server.SimpleHTTPRequestHandler,directory=RAIZ)); threading.Thread(target=srv.serve_forever,daemon=True).start()
STUB="(() => { const ss = window.speechSynthesis; if (ss) { ss.speak = (u) => setTimeout(() => { u.onend && u.onend({}); }, 5); ss.cancel = () => {}; ss.getVoices = () => []; } })();"
SVG='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><circle cx="36" cy="36" r="28" fill="#ffb347" stroke="#333" stroke-width="3"/><circle cx="27" cy="31" r="4"/><circle cx="45" cy="31" r="4"/><path d="M24 44 q12 10 24 0" stroke="#333" stroke-width="3" fill="none"/></svg>'
vp=[int(x) for x in sys.argv[1].split('x')]; fases=sys.argv[2].split(',')
out='/home/claude/shots'; err=[]; rel={}
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1208/chrome-linux64/chrome')
    pg=b.new_page(viewport={'width':vp[0],'height':vp[1]},reduced_motion='reduce'); pg.add_init_script(STUB)
    pg.on('pageerror',lambda e: err.append(str(e)))
    pg.route('**/openmoji@*/**',lambda r:r.fulfill(status=200,content_type='image/svg+xml',body=SVG)); pg.route('**/fonts.g*/**',lambda r:r.abort())
    pg.goto(f'http://127.0.0.1:{PORTA}/index.html'); pg.wait_for_timeout(300)
    pg.click('#comecar'); pg.wait_for_timeout(2600)
    pg.fill('input[type=text]','Ana'); pg.check('#pularAv'); pg.click('text=Criar'); pg.wait_for_timeout(400)
    pg.evaluate("(()=>{const P=LB.Store.perfil; Object.keys(LB.Motor.G).forEach(t=>P.demos[t]=true); ['rima','palmas','somInicial','somFinal','juntar','tirar','trocar','memoria','cacaSom','leiaEncontre','gemeos','frase','fabrica','trocaLetra','letraPerdida','ditado','trem','fatiador','bingo'].forEach(t=>P.demos[t]=true); for(const f of LB.D.fases) P.liberadas.push(f.id);})()")
    for fid in fases:
        pg.evaluate(f"LB.Som.parar(); void Cenas.jogarFase(LB.D.fases.findIndex(f=>f.id==='{fid}'))")
        # avança até achar item 'escolha' não-guiado
        for _ in range(25):
            pg.wait_for_timeout(500)
            it=pg.evaluate("(()=>{const i=LB.estado.itemAtual; return i?{ui:i.ui,tipo:i.tipo,g:!!i.guiado}:null})()")
            if it and it['ui'] in ('escolha','palmas','historia') and not it['g'] and pg.query_selector('.opcao, .tambor'): break
            btn=pg.query_selector('text=Continuar')
            if btn: btn.click()
        pg.wait_for_timeout(700)
        m=pg.evaluate("""(()=>{const P=document.querySelector('.palco').getBoundingClientRect(); const v=document.querySelector('.visor, .cena-hist'); const o=[...document.querySelectorAll('.opcoes .opcao')].map(e=>e.getBoundingClientRect());
          if(!o.length) return null; const cx=r=>r.left+r.width/2; const L=Math.min(...o.map(r=>r.left)),R=Math.max(...o.map(r=>r.right));
          return {palco:Math.round(cx(P)), opcoes:Math.round((L+R)/2), visor:v?Math.round(cx(v.getBoundingClientRect())):null, n:o.length, rotulos:document.querySelectorAll('.opcoes .rotulo').length, rotulosOcultos:document.querySelectorAll('.opcoes .rotulo-depois:not(.visivel)').length};})()""")
        rel[fid]=m
        pg.screenshot(path=f'{out}/jogo_{fid}_{vp[0]}.png')
    b.close()
srv.shutdown(); print(json.dumps(rel)); print('erros', err)
