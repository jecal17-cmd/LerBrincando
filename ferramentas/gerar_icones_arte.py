"""Gera os ícones do app Android, as telas de abertura e os ícones da web a partir da arte do ícone,
sem cortar nenhum detalhe dela.

A arte pode vir com a própria moldura (o quadrado arredondado desenhado) sobre um fundo liso (branco,
escuro etc.). O script apaga esse fundo de fora da moldura e encaixa a arte INTEIRA em cada formato:
nenhum pedaço da moldura, das letras ou das frutas que saem dela fica de fora.

Uso:  python gerar_icones_arte.py ARTE.png PASTA_RES [--cor #RRGGBB] [--web SAIDA_192.png ...] [--loja SAIDA_512.png ...]
  ARTE.png   arte quadrada (de preferência 1024 x 1024 ou maior)
  PASTA_RES  android/app/src/main/res do projeto Capacitor (use "-" para só gerar --web e --loja)
  --cor      cor de fundo do ícone adaptativo, da loja e da tela de abertura (sem ela, usa a cor da borda da moldura)
Precisa do Pillow (pip install pillow).
"""
import math, os, sys
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageStat

DENS = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}
MAGENTA = (255, 0, 255)

def recorte(arte, tol=34):
    """Devolve a arte em RGBA com o fundo de fora da moldura transparente, recortada na área desenhada."""
    b = max(3, arte.width // 200); arte = arte.crop((b, b, arte.width - b, arte.height - b))   # tira o fio de borda da imagem
    w, h = arte.size; m = arte.copy()
    for p in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)]:
        if m.getpixel(p) != MAGENTA: ImageDraw.floodfill(m, p, MAGENTA, thresh=tol)
    fundo = ImageChops.difference(m, Image.new('RGB', m.size, MAGENTA)).convert('L').point(lambda v: 0 if v else 255)
    # fecha frestas estreitas por onde o fundo vazou (ex.: o vão escuro entre o aro e o painel da moldura)
    cresce = lambda m: m.resize((w, h), Image.BILINEAR).point(lambda v: 255 if v > 127 else 0)
    p = fundo.resize((512, 512), Image.BILINEAR).point(lambda v: 255 if v > 127 else 0)
    p = p.filter(ImageFilter.MinFilter(13)).filter(ImageFilter.MaxFilter(13))   # fechamento da parte desenhada
    fundo = ImageChops.multiply(fundo, cresce(p))
    # fica só a peça principal (a que contém o centro): some com respingos soltos do fundo antigo
    q = ImageChops.invert(p); ImageDraw.floodfill(q, (256, 256), 128)
    principal = q.point(lambda v: 255 if v == 128 else 0).filter(ImageFilter.MaxFilter(5))
    fundo = ImageChops.lighter(fundo, ImageChops.invert(cresce(principal)))
    # come 2 px da borda (tira o halo do fundo antigo) e suaviza o contorno
    k = max(3, w // 300) | 1
    alfa = fundo.filter(ImageFilter.MaxFilter(k)).point(lambda v: 255 - v).filter(ImageFilter.GaussianBlur(w / 1400))
    im = arte.convert('RGBA'); im.putalpha(alfa)
    caixa = alfa.point(lambda v: 255 if v > 8 else 0).getbbox() or (0, 0, w, h)
    im = im.crop(caixa); s = max(im.size)
    q = Image.new('RGBA', (s, s), (0, 0, 0, 0)); q.paste(im, ((s - im.width) // 2, (s - im.height) // 2)); return q

def raio_max(rgba):
    """Maior distância do centro até um pixel visível, em fração do lado (0,5 = encosta no meio da borda)."""
    a = rgba.getchannel('A').resize((256, 256)); px = a.load(); r = 0
    for y in range(256):
        for x in range(256):
            if px[x, y] > 24: r = max(r, math.hypot(x + .5 - 128, y + .5 - 128))
    return r / 256

def cor_moldura(rgba):
    a = rgba.getchannel('A'); w = rgba.width; f = max(6, w // 25)
    anel = Image.new('L', a.size, 0); d = ImageDraw.Draw(anel); d.rectangle((0, 0, w, w), fill=255)
    d.rectangle((f * 2, f * 2, w - f * 2, w - f * 2), fill=0)
    anel = ImageChops.multiply(anel, a.point(lambda v: 255 if v > 250 else 0))
    return tuple(int(v) for v in ImageStat.Stat(rgba.convert('RGB'), anel).mean)

def encaixe(rgba, tam, lado, fundo=None, forma=None, raio=None):
    """Põe a arte inteira (lado px) no centro de uma tela tam x tam; fundo opcional na forma pedida."""
    tela = Image.new('RGBA', (tam, tam), (0, 0, 0, 0))
    if fundo:
        g = Image.new('L', (tam * 4, tam * 4), 0); d = ImageDraw.Draw(g)
        if forma == 'circulo': d.ellipse((0, 0, tam * 4 - 1, tam * 4 - 1), fill=255)
        elif forma == 'arredondado': d.rounded_rectangle((0, 0, tam * 4 - 1, tam * 4 - 1), radius=int(tam * 4 * .22), fill=255)
        else: g.paste(255, (0, 0, tam * 4, tam * 4))
        tela.paste(Image.new('RGBA', (tam, tam), fundo + (255,)), mask=g.resize((tam, tam), Image.LANCZOS))
    lado = max(1, int(round(lado))); a = rgba.resize((lado, lado), Image.LANCZOS)
    tela.alpha_composite(a, ((tam - lado) // 2, (tam - lado) // 2)); return tela

def main():
    args = sys.argv[1:]; cor = None
    if '--cor' in args:
        i = args.index('--cor'); hx = args[i + 1].lstrip('#'); cor = tuple(int(hx[j:j + 2], 16) for j in (0, 2, 4)); del args[i:i + 2]
    arte = Image.open(args[0]).convert('RGB'); res = args[1]
    w, h = arte.size; s = min(w, h); arte = arte.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s))
    if s < 1024: arte = arte.resize((1024, 1024), Image.LANCZOS)
    tile = recorte(arte); r = raio_max(tile)
    cor = cor or cor_moldura(tile); hexa = '#%02X%02X%02X' % cor
    # Lado da arte para caber num círculo de raio R (em px): lado * r <= R
    cabe = lambda R: R / r
    if res != '-':
        for d, k in DENS.items():
            pasta = os.path.join(res, 'mipmap-' + d); os.makedirs(pasta, exist_ok=True)
            t = int(108 * k)   # adaptativo: a zona segura é o círculo de 66 dp no meio dos 108 dp
            encaixe(tile, t, cabe(33 * k)).save(os.path.join(pasta, 'ic_launcher_foreground.png'))
            t = int(48 * k)    # ícones antigos (Android 7 ou anterior)
            encaixe(tile, t, t * .96).save(os.path.join(pasta, 'ic_launcher.png'))
            encaixe(tile, t, cabe(t * .48), cor, 'circulo').save(os.path.join(pasta, 'ic_launcher_round.png'))
        os.makedirs(os.path.join(res, 'values'), exist_ok=True)
        with open(os.path.join(res, 'values', 'ic_launcher_background.xml'), 'w', encoding='utf-8') as f:
            f.write('<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">%s</color>\n</resources>\n' % hexa)
        # telas de abertura: a arte inteira no centro, sobre a cor de fundo
        for pasta in sorted(os.listdir(res)):
            arq = os.path.join(res, pasta, 'splash.png')
            if not (pasta.startswith('drawable') and os.path.exists(arq)): continue
            sw, sh = Image.open(arq).size; t = int(min(sw, sh) * .62)
            tela = Image.new('RGBA', (sw, sh), cor + (255,)); tela.alpha_composite(encaixe(tile, t, t), ((sw - t) // 2, (sh - t) // 2))
            tela.convert('RGB').save(arq)
    modo = None
    for x in args[2:]:
        if x in ('--web', '--loja'): modo = x; continue
        os.makedirs(os.path.dirname(x) or '.', exist_ok=True)
        n = 512 if '512' in os.path.basename(x) else 192
        if modo == '--loja':
            # a Play Store pede quadrado cheio e arredonda os cantos (raio de 20%): a arte fica num quadrado
            # arredondado de 20% de raio e sobra margem para a máscara não cortar nada
            encaixe(tile, 512, 512 * .9, cor).convert('RGB').save(x)
        else:
            encaixe(tile, n, n * .96).save(x)   # web: a própria moldura da arte, cantos transparentes
    print('ícones gerados; cor de fundo', hexa, '; raio da arte %.3f' % r)

if __name__ == '__main__': main()
