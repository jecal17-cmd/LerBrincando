"""Ilustrações próprias das palavras (substituem o emoji OpenMoji da palavra).

1) Recortar grades 3x3 geradas pela IA de imagens e/ou imagens avulsas:
   python3 ferramentas/ilustracoes.py recortar grade_01.png GALO,GALINHA,CAVALO,... [outra.png NOMES ...]
   python3 ferramentas/ilustracoes.py avulsa gato.png GATO
   Cada figura vira ilustracoes/<palavra>.webp (384x384, fundo transparente).
2) Atualizar a lista que o jogo lê (rode sempre depois de acrescentar ou apagar figuras):
   python3 ferramentas/ilustracoes.py lista
Requer: numpy, scipy, pillow.
"""
import sys, os, json, unicodedata
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PASTA = os.path.join(RAIZ, 'ilustracoes')
LIMIAR = 232; LADO = 384

def nome_arquivo(palavra):
    s = unicodedata.normalize('NFD', palavra.lower())
    return ''.join(c for c in s if unicodedata.category(c) != 'Mn')

def _divisoes(perfil, total):
    import numpy as np
    r = []
    for k in (1, 2):
        lo, hi = int(total * k / 3) - 90, int(total * k / 3) + 90
        seg = np.convolve(perfil[lo:hi], np.ones(9) / 9, 'same')
        r.append(lo + int(np.argmin(seg)))
    return [0] + r + [total]

def celulas(arr):
    """Acha os 'corredores' brancos entre as figuras (não corta no terço exato)."""
    cheio = arr.min(axis=2) < LIMIAR
    H, W = cheio.shape
    xs = _divisoes(cheio.sum(0), W)
    ys_col = [_divisoes(cheio[:, xs[c]:xs[c + 1]].sum(1), H) for c in range(3)]
    return [(xs[c], ys_col[c][r], xs[c + 1], ys_col[c][r + 1]) for r in range(3) for c in range(3)]

def salvar(img, palavra):
    import numpy as np
    from PIL import Image
    from scipy import ndimage
    a = np.asarray(img.convert('RGB')).astype(np.int16)
    branco = a.min(axis=2) >= LIMIAR
    rot, _ = ndimage.label(branco)
    borda = set(np.unique(np.concatenate([rot[0], rot[-1], rot[:, 0], rot[:, -1]]))) - {0}
    fundo = np.isin(rot, list(borda))           # só o branco ligado à borda vira transparente
    alfa = np.where(fundo, 0, 255).astype(np.float32)
    perto = ndimage.binary_dilation(fundo, iterations=2) & ~fundo
    lum = a.mean(axis=2)
    alfa[perto] = np.clip((255 - lum[perto]) / (255 - LIMIAR) * 255, 60, 255)
    im = Image.fromarray(np.dstack([a.astype(np.uint8), alfa.astype(np.uint8)]), 'RGBA')
    im = im.crop(im.getchannel('A').point(lambda v: 255 if v > 20 else 0).getbbox())
    w, h = im.size; s = int(max(w, h) * 1.08)
    tela = Image.new('RGBA', (s, s), (255, 255, 255, 0)); tela.paste(im, ((s - w) // 2, (s - h) // 2))
    os.makedirs(PASTA, exist_ok=True)
    destino = os.path.join(PASTA, nome_arquivo(palavra) + '.webp')
    tela.resize((LADO, LADO), Image.LANCZOS).save(destino, 'WEBP', quality=82, method=6)
    print('ok', palavra, '->', os.path.relpath(destino, RAIZ))

def recortar(pares):
    import numpy as np
    from PIL import Image
    for i in range(0, len(pares), 2):
        arr = np.asarray(Image.open(pares[i]).convert('RGB'))
        nomes = [n.strip() for n in pares[i + 1].split(',')]
        for (x0, y0, x1, y1), n in zip(celulas(arr), nomes):
            if n: salvar(Image.fromarray(arr[y0:y1, x0:x1]), n)

def lista():
    dados = json.load(open(os.path.join(RAIZ, 'data.json'), encoding='utf-8'))
    existentes = {f[:-5] for f in os.listdir(PASTA) if f.endswith('.webp')}
    mapa, sobra = {}, set(existentes)
    for p in dados['palavras']:
        n = nome_arquivo(p['p'])
        if n in existentes and p.get('om'):
            mapa[p['om']] = n; sobra.discard(n)
    js = ('/* Gerado por ferramentas/ilustracoes.py lista — código OpenMoji do emoji -> ilustracoes/<arquivo>.webp */\n'
          'window.ILUSTRACOES = ' + json.dumps(dict(sorted(mapa.items())), ensure_ascii=False) + ';\n')
    open(os.path.join(PASTA, 'lista.js'), 'w', encoding='utf-8').write(js)
    print(f'{len(mapa)} ilustrações na lista.' + (f' Sem palavra correspondente: {sorted(sobra)}' if sobra else ''))

if __name__ == '__main__':
    cmd, args = sys.argv[1], sys.argv[2:]
    if cmd == 'recortar': recortar(args)
    elif cmd == 'avulsa': salvar(__import__('PIL.Image', fromlist=['Image']).open(args[0]), args[1])
    elif cmd == 'lista': lista()
    else: print(__doc__)
