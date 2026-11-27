"""Som das consoantes sem gravar voz (v1.4.9), escolhido por escuta em 27/11/2026.

Voz sintética não diz consoante isolada, e recortar e esticar a fala gera ruído. Aqui cada grupo é feito de um jeito:
  S F X        ruído filtrado (são só sopro, sem voz): filtros de referência para cada som
  M N L V      gravação humana do Wikimedia Commons (CC BY-SA 3.0), só o trecho da consoante, convertida para voz
               feminina com o vocoder WORLD (tom da Francisca, formantes ×1,12) e sustentada sem esticar
  Z J          consoante da própria Francisca congelada com o WORLD; a vibração da voz (que a voz sintética perde e
               faz o Z virar S) é recolocada abaixo de 1 kHz
  P B T D C G  família de sílabas da Francisca (PA-PE-PI-PO-PU; CA-CE-CI-CO-CU; GA-GE-GI-GO-GU): oclusiva não
               existe sozinha, então a criança ouve a consoante igual e a vogal mudando
O resultado vai para audio/fonema_<letra>.mp3 com origem "sintetico" (gerar_audios.py não sobrescreve esses itens)
e o crédito das gravações do Wikimedia vai para manifest.atribuicoes (aparece na Área dos Pais).

Fontes em ferramentas/fontes_sons/ (z/j_francisca = recorte "zzzá"/"jjjá" do fluxo Candidatos de fonemas;
*_humano_wikimedia = arquivos do Commons). Precisa de: pip install pyworld soundfile pyloudnorm scipy + ffmpeg.
Uso: python ferramentas/sons_sinteticos.py [--letras S,F,...]"""
import argparse, json, os, subprocess, zlib
import numpy as np, soundfile as sf, pyworld as pw, pyloudnorm as pyln
from scipy.signal import butter, sosfiltfilt, resample_poly

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO = os.path.join(RAIZ, 'audio')
FONTES = os.path.join(RAIZ, 'ferramentas', 'fontes_sons')
TAXA = 24000
F0_FRANCISCA = 193.5          # mediana do tom da Francisca nas consoantes sonoras (Hz)
MARGEM_INI, MARGEM_FIM = .07, .06

RUIDO = {  # faixas (Hz, Hz, peso) somadas
    'S': [(6500, 11500, 1.0), (4200, 6500, .35)],
    'X': [(2400, 4200, 1.0), (4200, 7500, .45), (1700, 2400, .25)],
    'F': [(1200, 11500, 1.0)],
}
HUMANO = {'M': (.06, .26), 'N': (.06, .31), 'L': (.06, .34), 'V': (.31, .51)}   # trecho da consoante na gravação (s)
WIKI = {'M': 'Bilabial_nasal.ogg', 'N': 'Alveolar_nasal.ogg', 'L': 'Alveolar_lateral_approximant.ogg',
        'V': 'Voiced_labiodental_fricative.ogg'}
FRANCISCA = ['Z', 'J']
FAMILIA = {'P': ['pa', 'pe', 'pi', 'po', 'pu'], 'B': ['ba', 'be', 'bi', 'bo', 'bu'], 'T': ['ta', 'te', 'ti', 'to', 'tu'],
           'D': ['da', 'de', 'di', 'do', 'du'], 'C': ['ca', 'ce', 'ci', 'co', 'cu'], 'G': ['ga', 'ge', 'gi', 'go', 'gu']}


def ler(caminho, taxa=TAXA):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', caminho, '-f', 'f32le', '-ac', '1', '-ar', str(taxa), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(out, 'float32').astype('float64')


def envelope(n, ataque=.06, soltura=.14):
    e = np.ones(n); a = int(ataque * TAXA); s = int(soltura * TAXA)
    e[:a] = np.sin(np.linspace(0, np.pi / 2, a)) ** 2
    e[-s:] = np.cos(np.linspace(0, np.pi / 2, s)) ** 2
    return e


def gravar(chave, x, man, extra):
    """Normaliza a −16 LUFS (pico ≤ −1,5 dBFS), põe as margens de silêncio do banco e grava o MP3."""
    ganho = 10 ** ((-16 - pyln.Meter(TAXA, block_size=.2).integrated_loudness(x)) / 20)
    x = x * ganho
    if np.abs(x).max() > .84: x *= .84 / np.abs(x).max()
    x = np.concatenate([np.zeros(int(MARGEM_INI * TAXA)), x, np.zeros(int(MARGEM_FIM * TAXA))])
    wav = os.path.join(AUDIO, chave + '.wav')
    sf.write(wav, x.astype('float32'), TAXA)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', wav, '-ar', str(TAXA), '-b:a', '64k', os.path.join(AUDIO, chave + '.mp3')], check=True)
    os.remove(wav)
    pico = round(20 * np.log10(np.abs(x).max()), 1)
    man['itens'][chave] = dict(arquivo=chave + '.mp3', ms=int(len(x) / TAXA * 1000), origem='sintetico', pico=pico, lufs=-16, **extra)


def world(x):
    f0, t = pw.harvest(x, TAXA, f0_floor=70, f0_ceil=500, frame_period=5)
    return f0, pw.cheaptrick(x, f0, t, TAXA), pw.d4c(x, f0, t, TAXA)


def sonorizar(sp, ap):
    fr = np.linspace(0, TAXA / 2, sp.shape[1])
    w = np.clip((fr - 1000) / 1000, 0, 1)
    ap = .03 * (1 - w) + ap * w
    alto = sp[:, (fr > 2500) & (fr < 9000)].mean(1, keepdims=True)
    return np.maximum(sp, alto * 9 * np.exp(-((fr - 250) / 300) ** 2)[None, :]), ap


def congelar(x, rng, ini, fim, f0_alvo=None, warp=1.0, sonora=False, dur=.8):
    """Sustenta o miolo da consoante: mistura lenta entre os quadros do miolo + entonação com leve queda."""
    f0, sp, ap = world(x)
    if sonora: sp, ap = sonorizar(sp, ap)
    a, b = int(len(f0) * ini), int(len(f0) * fim)
    sel = [i for i in range(a, b) if f0[i] > 0] or list(range(a, b))
    lsp, lap = np.log(sp[sel] + 1e-12), ap[sel]
    nq = int(dur * 1000 / 5)
    p = np.abs(np.array([np.convolve(rng.standard_normal(nq + 80), np.hanning(80), 'same')[40:40 + nq] for _ in sel])) + .3
    p /= p.sum(0)
    LS, AP = p.T @ lsp, p.T @ lap
    if warp != 1.0:
        fr = np.linspace(0, TAXA / 2, LS.shape[1])
        LS = np.array([np.interp(fr / warp, fr, q) for q in LS]); AP = np.array([np.interp(fr / warp, fr, q) for q in AP])
    v = f0[sel][f0[sel] > 0]
    base = f0_alvo or (float(np.median(v)) if len(v) > 3 else F0_FRANCISCA)
    tt = np.linspace(0, 1, nq)
    F0 = base * (1.03 - .06 * tt) * (1 + .004 * np.sin(2 * np.pi * 5.2 * tt * dur))
    y = pw.synthesize(np.ascontiguousarray(F0), np.ascontiguousarray(np.exp(LS)), np.ascontiguousarray(AP), TAXA, 5)
    return y * envelope(len(y), .07, .16)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--letras', default=None)
    a = ap.parse_args()
    todas = list(RUIDO) + list(HUMANO) + FRANCISCA + list(FAMILIA)
    letras = a.letras.upper().split(',') if a.letras else todas
    man = json.load(open(os.path.join(AUDIO, 'manifest.json'), encoding='utf-8'))
    for g in letras:
        k = 'fonema_' + g.lower()
        rng = np.random.default_rng(zlib.crc32(g.encode()))      # mesmo resultado a cada execução
        if g in RUIDO:
            n = int(.85 * TAXA); y = np.zeros(n)
            for lo, hi, peso in RUIDO[g]:
                y += peso * sosfiltfilt(butter(4, [lo, min(hi, TAXA / 2 - 200)], 'bandpass', fs=TAXA, output='sos'), rng.standard_normal(n))
            mod = 1 + .06 * 40 * np.convolve(rng.standard_normal(n), np.hanning(4000) / np.hanning(4000).sum(), 'same')
            gravar(k, y * mod * envelope(n), man, {'metodo': 'ruido'})
        elif g in HUMANO:
            hum = ler(os.path.join(FONTES, f'{g.lower()}_humano_wikimedia.mp3'), 44100)
            i, f = HUMANO[g]
            trecho = resample_poly(hum[int(i * 44100):int(f * 44100)], TAXA, 44100)
            y = congelar(trecho, rng, .2, .8, f0_alvo=F0_FRANCISCA, warp=1.12, sonora=g in 'VZJ')
            gravar(k, y, man, {'metodo': 'humano-world', 'fonte': 'File:' + WIKI[g].replace('_', ' ')})
            man['atribuicoes'] = [z for z in man.get('atribuicoes', []) if z.get('fonema') != g] + [dict(
                fonema=g, arquivo='File:' + WIKI[g].replace('_', ' '), autor='', licenca='CC BY-SA 3.0',
                url='https://commons.wikimedia.org/wiki/File:' + WIKI[g])]
        elif g in FRANCISCA:
            y = congelar(ler(os.path.join(FONTES, f'{g.lower()}_francisca.mp3')), rng, .3, .75, sonora=True)
            gravar(k, y, man, {'metodo': 'francisca-world'})
        elif g in FAMILIA:
            partes = []
            for s in FAMILIA[g]:
                it = man['itens'].get('silaba_' + s)
                if not it: continue
                x = ler(os.path.join(AUDIO, it['arquivo']))
                env = np.abs(x); vivo = np.where(env > .02 * env.max())[0]      # tira as margens de cada sílaba
                partes += [x[max(0, vivo[0] - 240):vivo[-1] + 480], np.zeros(int(.3 * TAXA))]
            gravar(k, np.concatenate(partes[:-1]), man, {'metodo': 'familia', 'familia': True,
                                                         'texto': '-'.join(s.upper() for s in FAMILIA[g])})
        print(k, man['itens'][k]['ms'], 'ms')
    json.dump(man, open(os.path.join(AUDIO, 'manifest.json'), 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
    with open(os.path.join(AUDIO, 'manifest.js'), 'w', encoding='utf-8') as fh:
        fh.write('window.AUDIO_MANIFEST = ' + json.dumps(man, ensure_ascii=False, separators=(',', ':')) + ';\n')


if __name__ == '__main__':
    main()
