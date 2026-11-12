"""Gera os ícones do app Android, as telas de abertura e os ícones da web a partir de uma imagem quadrada (a arte do ícone).

Uso:  python gerar_icones_arte.py ARTE.png PASTA_RES [--cor #RRGGBB] [--web SAIDA_192.png ...] [--loja SAIDA_512.png ...]
  ARTE.png   arte quadrada, sem moldura (de preferência 1024 x 1024 ou maior)
  PASTA_RES  android/app/src/main/res do projeto Capacitor
  --cor      cor de fundo do ícone adaptativo e da tela de abertura (sem ela, usa a média da borda da arte)
Precisa do Pillow (pip install pillow).
"""
import os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageStat

DENS = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}

def mascara(tam, forma):
    m = Image.new('L', (tam * 4, tam * 4), 0); d = ImageDraw.Draw(m)
    if forma == 'circulo': d.ellipse((0, 0, tam * 4 - 1, tam * 4 - 1), fill=255)
    else: d.rounded_rectangle((0, 0, tam * 4 - 1, tam * 4 - 1), radius=int(tam * 4 * .22), fill=255)
    return m.resize((tam, tam), Image.LANCZOS)

def recortada(arte, tam, forma):
    im = arte.resize((tam, tam), Image.LANCZOS).convert('RGBA'); im.putalpha(mascara(tam, forma)); return im

def cor_borda(arte):
    w, h = arte.size; f = max(4, w // 40)
    faixas = [arte.crop((0, 0, w, f)), arte.crop((0, h - f, w, h)), arte.crop((0, 0, f, h)), arte.crop((w - f, 0, w, h))]
    m = [sum(ImageStat.Stat(x).mean[c] for x in faixas) / 4 for c in range(3)]
    return tuple(int(v) for v in m)

def frente_adaptativa(arte, tam):
    # Ícone adaptativo: o Android mostra só o círculo central de 72 dp dos 108 dp.
    # A arte ocupa 84 dp no centro (só uma margem pequena dela fica escondida) e o resto é preenchido
    # com a própria arte ampliada e desfocada, para as animações do sistema não mostrarem bordas.
    fundo = arte.resize((tam, tam), Image.LANCZOS).filter(ImageFilter.GaussianBlur(tam / 18))
    a = int(tam * 84 / 108); fundo.paste(arte.resize((a, a), Image.LANCZOS), ((tam - a) // 2, (tam - a) // 2))
    return fundo

def main():
    arte = Image.open(sys.argv[1]).convert('RGB'); res = sys.argv[2]
    w, h = arte.size; s = min(w, h); arte = arte.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s))
    cor = cor_borda(arte)
    if '--cor' in sys.argv: h = sys.argv[sys.argv.index('--cor') + 1].lstrip('#'); cor = tuple(int(h[i:i + 2], 16) for i in (0, 2, 4)); del sys.argv[sys.argv.index('--cor'):sys.argv.index('--cor') + 2]
    hexa = '#%02X%02X%02X' % cor
    for d, k in DENS.items():
        pasta = os.path.join(res, 'mipmap-' + d); os.makedirs(pasta, exist_ok=True)
        frente_adaptativa(arte, int(108 * k)).save(os.path.join(pasta, 'ic_launcher_foreground.png'))
        recortada(arte, int(48 * k), 'arredondado').save(os.path.join(pasta, 'ic_launcher.png'))
        recortada(arte, int(48 * k), 'circulo').save(os.path.join(pasta, 'ic_launcher_round.png'))
    with open(os.path.join(res, 'values', 'ic_launcher_background.xml'), 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">%s</color>\n</resources>\n' % hexa)
    # telas de abertura: a arte arredondada no centro, sobre a cor da borda do ícone
    for pasta in sorted(os.listdir(res)):
        arq = os.path.join(res, pasta, 'splash.png')
        if not (pasta.startswith('drawable') and os.path.exists(arq)): continue
        sw, sh = Image.open(arq).size; t = int(min(sw, sh) * .62)
        tela = Image.new('RGBA', (sw, sh), cor + (255,)); ic = recortada(arte, t, 'arredondado')
        tela.alpha_composite(ic, ((sw - t) // 2, (sh - t) // 2)); tela.convert('RGB').save(arq)
    args = sys.argv[3:]; modo = None
    for x in args:
        if x in ('--web', '--loja'): modo = x; continue
        os.makedirs(os.path.dirname(x) or '.', exist_ok=True)
        if modo == '--loja': arte.resize((512, 512), Image.LANCZOS).save(x)               # a loja aplica o próprio arredondamento
        else:
            n = 512 if '512' in os.path.basename(x) else 192
            recortada(arte, n, 'arredondado').save(x)
    print('ícones gerados; cor de fundo', hexa)

if __name__ == '__main__': main()
