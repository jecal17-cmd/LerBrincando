"""Reajusta o volume (−16 LUFS, com limitador de picos) dos sons do Banco de Áudio que ficaram fora de −16 ±2 LUFS,
sem chamar o sintetizador de novo. Atualiza pico e lufs no manifest.

Uso: python ferramentas/ajustar_volume.py            (só os sons fora da faixa)
     python ferramentas/ajustar_volume.py chave ...   (só estas chaves)"""
import json, os, subprocess, sys
import numpy as np
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, RAIZ)
import gerar_audios as G

PASTA = os.path.join(RAIZ, 'audio')
man = json.load(open(os.path.join(PASTA, 'manifest.json'), encoding='utf-8'))
chaves = sys.argv[1:] or [k for k, v in man['itens'].items()
                          if v.get('lufs') is not None and not (-18 <= v['lufs'] <= -14) and v.get('ms', 0) > 400]
TAXA = 24000
for k in chaves:
    it = man['itens'][k]; arq = os.path.join(PASTA, it['arquivo'])
    x = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'quiet', '-i', arq, '-f', 'f32le', '-ac', '1', '-ar', str(TAXA), '-'],
                                     capture_output=True, check=True).stdout, 'float32')
    y = G.normalizar(x, TAXA)
    tmp = arq + '.tmp.mp3'
    subprocess.run(['ffmpeg', '-v', 'quiet', '-y', '-f', 'f32le', '-ar', str(TAXA), '-ac', '1', '-i', '-', '-b:a', '96k', tmp],
                   input=np.clip(y, -1, 1).astype('float32').tobytes(), check=True)
    os.replace(tmp, arq)
    z = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'quiet', '-i', arq, '-f', 'f32le', '-ac', '1', '-ar', str(TAXA), '-'],
                                     capture_output=True, check=True).stdout, 'float32')
    antes = it.get('lufs'); it['pico'], it['lufs'] = G.medir(z, TAXA)
    print(f'{k}: {antes} → {it["lufs"]} LUFS (pico {it["pico"]} dBFS)')
json.dump(man, open(os.path.join(PASTA, 'manifest.json'), 'w', encoding='utf-8'), ensure_ascii=False, allow_nan=False)
with open(os.path.join(PASTA, 'manifest.js'), 'w', encoding='utf-8') as f:
    f.write('window.AUDIO_MANIFEST = ' + json.dumps(man, ensure_ascii=False) + ';\n')
print(f'{len(chaves)} sons ajustados.')
