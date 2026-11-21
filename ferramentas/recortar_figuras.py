#!/usr/bin/env python3
"""Recorta folhas de figuras (grades) em imagens WebP individuais com fundo transparente.

Uso:
    python ferramentas/recortar_figuras.py FOLHA.jpg LINHAS COLUNAS PASTA_SAIDA nome1 nome2 ...

Cada figura é atribuída à célula onde está o seu centro (assim enfeites que passam um pouco
da célula, como fitas de medalha ou brilhos, ficam com a figura certa). O fundo branco é
apagado a partir das bordas (preenchimento), para não furar áreas claras dentro da figura.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

LADO = 384          # tamanho final (quadrado) de cada figura
MARGEM = 0.06       # respiro em volta da figura
LIMIAR_FUNDO = 26   # distância máxima do branco para contar como fundo


def recortar(caminho, linhas, colunas, saida, nomes):
    im = Image.open(caminho).convert('RGB')
    a = np.asarray(im).astype(np.int16)
    dist = (255 - a).max(axis=2)                    # 0 = branco puro
    claro = dist < LIMIAR_FUNDO
    # fundo = região clara conectada à borda da folha ou aos vãos entre células
    rot, _ = ndimage.label(claro)
    bordas = set(np.unique(np.concatenate([rot[0], rot[-1], rot[:, 0], rot[:, -1]]))) - {0}
    fundo = np.isin(rot, list(bordas))
    figura = ~fundo
    figura = ndimage.binary_opening(figura, iterations=1)
    comp, n = ndimage.label(figura)
    H, W = figura.shape
    ch, cw = H / linhas, W / colunas
    caixas = {}
    for i, fatia in enumerate(ndimage.find_objects(comp), start=1):
        if fatia is None:
            continue
        area = (comp[fatia] == i).sum()
        if area < 60:                                 # poeira / ruído do JPEG
            continue
        cy = (fatia[0].start + fatia[0].stop) / 2
        cx = (fatia[1].start + fatia[1].stop) / 2
        cel = (min(int(cy // ch), linhas - 1), min(int(cx // cw), colunas - 1))
        b = caixas.get(cel, [H, W, 0, 0, []])
        b[0] = min(b[0], fatia[0].start); b[1] = min(b[1], fatia[1].start)
        b[2] = max(b[2], fatia[0].stop); b[3] = max(b[3], fatia[1].stop)
        b[4].append(i)
        caixas[cel] = b
    # alfa suave: borda levemente desfocada
    alfa_total = Image.fromarray((figura * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    rgba = im.copy(); rgba.putalpha(alfa_total)
    saida = Path(saida); saida.mkdir(parents=True, exist_ok=True)
    k = 0
    for r in range(linhas):
        for c in range(colunas):
            if k >= len(nomes):
                return
            nome = nomes[k]; k += 1
            if nome == '-' or (r, c) not in caixas:
                continue
            y0, x0, y1, x1, ids = caixas[(r, c)]
            mascara = np.isin(comp, ids)[y0:y1, x0:x1]
            pedaco = rgba.crop((x0, y0, x1, y1))
            al = np.asarray(pedaco.getchannel('A')).copy()
            al[~ndimage.binary_dilation(mascara, iterations=2)] = 0   # tira pedaços das vizinhas
            pedaco.putalpha(Image.fromarray(al))
            lado = int(max(x1 - x0, y1 - y0) * (1 + 2 * MARGEM))
            tela = Image.new('RGBA', (lado, lado), (255, 255, 255, 0))
            tela.paste(pedaco, ((lado - (x1 - x0)) // 2, (lado - (y1 - y0)) // 2))
            tela = tela.resize((LADO, LADO), Image.LANCZOS)
            tela.save(saida / f'{nome}.webp', 'WEBP', quality=88, method=6)
            print('ok', saida / f'{nome}.webp')


if __name__ == '__main__':
    f, l, c, s, *ns = sys.argv[1:]
    recortar(f, int(l), int(c), s, ns)
