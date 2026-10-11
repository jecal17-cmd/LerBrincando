#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ler Brincando — gerar_audios.py
Gera o Banco de Áudio (pasta audio/) com a voz neural brasileira Piper pt_BR-faber-medium,
100% offline depois de baixar o modelo uma única vez.

O que o script faz:
  1. Lê data.js (banco de palavras, sílabas, frases, histórias, instruções e elogios).
  2. Baixa (uma vez) o modelo pt_BR-faber-medium (.onnx + .onnx.json).
  3. Gera todos os áudios com nomes normalizados (palavra_macaco.mp3, silaba_ma.mp3, fonema_m.mp3 ...),
     com versão normal (length_scale ≈ 1,15) e versão lenta 🐢 (≈ 1,40) para palavras, sílabas e frases das histórias.
  4. Recorta os FONEMAS CONTÍNUOS das sílabas geradas (energia + taxa de cruzamento por zero),
     prolonga para ~800 ms sem mudar o tom e aplica fade de 30 ms. Oclusivas NUNCA são isoladas.
  5. Monta as frases das histórias juntando os áudios das palavras → tempos EXATOS de cada palavra
     (e de cada sílaba na versão lenta) para o karaokê.
  6. Normaliza o volume (meta −16 LUFS), exporta MP3 (ou WAV se não houver ffmpeg) e grava
     audio/manifest.json + audio/manifest.js (este último permite abrir o jogo com duplo clique).
  7. Faz a checagem de qualidade: ausentes, silenciosos (pico < −40 dBFS) e duração anormal.

Instalação (uma vez):
    python -m pip install piper-tts numpy soundfile
    (opcionais, recomendados) python -m pip install librosa pyloudnorm
    ffmpeg no PATH para exportar MP3 (sem ffmpeg o banco sai em WAV, que também funciona)

Uso:
    python gerar_audios.py                 # gera tudo (pula o que já existe)
    python gerar_audios.py --listar        # só lista o que seria gerado (não precisa do Piper)
    python gerar_audios.py --refazer       # regera tudo
    python gerar_audios.py --wikimedia     # usa gravações IPA do Wikimedia Commons SÓ para fonemas
                                           # cujo recorte não passar na checagem de qualidade
    python gerar_audios.py --qc            # só roda a checagem de qualidade do banco existente
"""
import argparse, json, os, re, shutil, subprocess, sys, time, unicodedata, urllib.request, urllib.parse, wave, io

RAIZ = os.path.dirname(os.path.abspath(__file__))
PASTA = os.path.join(RAIZ, 'audio')
MODELOS = os.path.join(RAIZ, 'modelos_piper')
VOZ = 'pt_BR-faber-medium'
URL_BASE = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/'
ESCALA_NORMAL, ESCALA_LENTA = 1.15, 1.40
META_LUFS = -16.0
CONTINUAS = {'F': 'FA', 'V': 'VA', 'M': 'MA', 'N': 'NA', 'L': 'LA', 'S': 'SA', 'Z': 'ZA', 'J': 'JA', 'X': 'XA', 'NH': 'NHA', 'LH': 'LHA'}
# termos de busca no Wikimedia Commons (camada 3, opcional)
WIKI_BUSCA = {'M': 'Bilabial nasal', 'N': 'Alveolar nasal', 'F': 'Voiceless labiodental fricative', 'V': 'Voiced labiodental fricative',
              'S': 'Voiceless alveolar sibilant', 'Z': 'Voiced alveolar sibilant', 'X': 'Voiceless postalveolar fricative',
              'J': 'Voiced postalveolar fricative', 'L': 'Alveolar lateral approximant', 'NH': 'Palatal nasal', 'LH': 'Palatal lateral approximant'}

# ----------------------------------------------------------------------------- utilidades (iguais ao nucleo.js)
MAPA = {'á': 'a1', 'â': 'a2', 'ã': 'a3', 'à': 'a4', 'é': 'e1', 'ê': 'e2', 'í': 'i1', 'ó': 'o1', 'ô': 'o2', 'õ': 'o3', 'ú': 'u1', 'ç': 'c1', 'ü': 'u2'}
def slug(texto):
    t = (texto or '').lower()
    s = ''.join(MAPA.get(ch, ch) for ch in t)
    s = re.sub(r'[^a-z0-9]+', '_', s).strip('_')
    if len(s) > 40:
        # djb2 sobre unidades UTF-16 (igual ao charCodeAt do JavaScript)
        h = 5381
        b = texto.encode('utf-16-le')
        for i in range(0, len(b), 2):
            h = ((h * 33) + (b[i] | (b[i + 1] << 8))) & 0xFFFFFFFF
        s = s[:30].rstrip('_') + '_' + format(h, 'x')
    return s or 'vazio'

def maiusc(t): return (t or '').upper()

TOKEN = re.compile(r"([A-ZÁÉÍÓÚÂÊÔÃÕÀÇa-záéíóúâêôãõàç]+(?:-[A-ZÁÉÍÓÚÂÊÔÃÕÀÇa-záéíóúâêôãõàç]+)*)|([^A-ZÁÉÍÓÚÂÊÔÃÕÀÇa-záéíóúâêôãõàç]+)")
def tokenizar(frase):
    out = []
    for m in TOKEN.finditer(frase):
        if m.group(1):
            sil = m.group(1).split('-'); out.append({'palavra': ''.join(sil), 'silabas': sil})
    return out

def ler_dados():
    with open(os.path.join(RAIZ, 'data.js'), encoding='utf-8') as f:
        txt = f.read()
    return json.loads(txt[txt.index('{'):txt.rindex('}') + 1])

# ----------------------------------------------------------------------------- lista de áudios (espelha validadores.js → listaAudios)
def lista_audios(D):
    itens = {}
    def add(tipo, texto, **extra):
        if not texto: return
        k = tipo + '_' + slug(texto)
        if k not in itens: itens[k] = dict(tipo=tipo, texto=texto, chave=k, **extra)
    def sil(lst):
        for s in lst: add('silaba', maiusc(s))
    for w in D['palavras']: add('palavra', w['p']); sil(w['s'])
    for f in D['frequentes']: add('palavra', f.replace('-', '')); sil(f.split('-'))
    for h in D['historias']:
        add('frase', h['intro']); add('frase', h['titulo'])
        for q in h['perguntas']:
            add('frase', q['t'])
            if q.get('explica'): add('frase', q['explica'])
        for i, fr in enumerate(h['frases']):
            if h.get('oral'):
                add('frase', fr['t'])
                if fr.get('rima'):
                    for p in fr['rima']['op']: add('palavra', p)
                    add('frase', fr['rima']['antes']); add('palavra', fr['rima']['com'])
                continue
            for tk in tokenizar(fr['t']): add('palavra', maiusc(tk['palavra'])); sil(tk['silabas'])
            add('hist', f"{h['id']}_{i}", frase=fr['t'], karaoke=True)
            if fr.get('lac'):
                for o in fr['lac']['op']:
                    add('silaba' if 's' in fr['lac'] else 'fonema', o)
    for i, fr in enumerate(D['frases']):
        for tk in tokenizar(fr['t']): add('palavra', maiusc(tk['palavra'])); sil(tk['silabas'])
        add('frasejogo', str(i), frase=fr['t'], karaoke=True)
    for m in D['tirar']:
        add('palavra', m['de'].replace('-', '')); add('palavra', m['fica'])
        if m['modo'] == 'silaba': add('silaba', m['tira'])
    for m in D['trocar']:
        add('palavra', m['de'].replace('-', '')); add('silaba', m['troca']); add('silaba', m['por'])
    for c in 'F V M N L S Z J X P B T D C G'.split():
        for v in 'AEIOU':
            if c in 'CG' and v in 'EI': continue
            add('silaba', c + v)
    for g, f in D['fonemas'].items():
        if f['tipo'] != 'oclusiva': add('fonema', g, continua=(f['tipo'] == 'continua'))
    for l, n in D['nomesLetras'].items(): add('nome', l, fala=n)
    frases = list(D['falas'].values()) + list(D['instrucoes'].values()) + list(D['dicasTipo'].values()) + list(D['dicasPares'].values()) + list(D['dicasFonema'].values())
    for r in D['regras'].values(): frases += [r['explica'], r['titulo']]
    for l in D['elogios'].values(): frases += l
    for l in D['elogiosEspecificos'].values():
        for t in l: frases += [p for p in t if not p.startswith('{')]
    frases += [f['nome'] for f in D['fases']] + [m['nome'] for m in D['mundos']] + [n['nome'] for n in D['niveis']] + [m['nome'] for m in D['medalhas']]
    for t in frases: add('frase', t)
    return list(itens.values())

# ----------------------------------------------------------------------------- Piper
def baixar_modelo():
    os.makedirs(MODELOS, exist_ok=True)
    for ext in ('.onnx', '.onnx.json'):
        destino = os.path.join(MODELOS, VOZ + ext)
        if os.path.exists(destino) and os.path.getsize(destino) > 1000: continue
        print('Baixando', VOZ + ext, '...'); urllib.request.urlretrieve(URL_BASE + VOZ + ext, destino)
    # registra a licença declarada no cartão do modelo, para a tela "Sobre"
    try:
        urllib.request.urlretrieve(URL_BASE + 'MODEL_CARD', os.path.join(MODELOS, 'MODEL_CARD'))
    except Exception:
        pass
    return os.path.join(MODELOS, VOZ + '.onnx')

class Sintetizador:
    def __init__(self, modelo):
        try:
            from piper import PiperVoice
        except ImportError:
            sys.exit('Instale o Piper:  python -m pip install piper-tts')
        self.voz = PiperVoice.load(modelo)
        self.taxa = self.voz.config.sample_rate
    def wav(self, texto, escala):
        """Devolve (amostras float32, taxa). Compatível com piper-tts 1.2 e 1.3+."""
        import numpy as np
        buf = io.BytesIO()
        with wave.open(buf, 'wb') as w:
            try:
                from piper import SynthesisConfig  # piper-tts >= 1.3
                self.voz.synthesize_wav(texto, w, syn_config=SynthesisConfig(length_scale=escala))
            except ImportError:
                w.setnchannels(1); w.setsampwidth(2); w.setframerate(self.taxa)
                self.voz.synthesize(texto, w, length_scale=escala)
        buf.seek(0)
        with wave.open(buf, 'rb') as r:
            dados = np.frombuffer(r.readframes(r.getnframes()), dtype=np.int16).astype('float32') / 32768.0
            return dados, r.getframerate()

# Como o Piper deve PRONUNCIAR cada tipo de item (minúsculas evitam leitura soletrada)
def texto_fala(item, D):
    t = item['texto']
    if item['tipo'] in ('palavra', 'silaba'): return t.lower()
    if item['tipo'] == 'nome': return item['fala']
    if item['tipo'] == 'fonema':
        f = D['fonemas'].get(t)
        if f and f['tipo'] == 'vogal': return f['tts']
        if f and f['tipo'] == 'continua': return f['apoio'].lower()
        return t.lower()
    return t

# ----------------------------------------------------------------------------- processamento de sinal
def aparar(x, taxa, limiar_db=-45):
    import numpy as np
    if not len(x): return x
    env = np.abs(x); lim = 10 ** (limiar_db / 20)
    idx = np.where(env > lim)[0]
    if not len(idx): return x
    a = max(0, idx[0] - int(0.01 * taxa)); b = min(len(x), idx[-1] + int(0.02 * taxa))
    return x[a:b]

def fade(x, taxa, ms=30):
    import numpy as np
    n = min(len(x) // 2, int(taxa * ms / 1000))
    if n > 0:
        x = x.copy(); r = np.linspace(0, 1, n); x[:n] *= r; x[-n:] *= r[::-1]
    return x

def recortar_consoante(x, taxa):
    """Acha a fronteira consoante→vogal: a vogal tem sinal periódico, muita energia e
    poucos cruzamentos por zero; S/F/X têm muita energia em alta frequência (ZCR alto);
    M/N/L são vozeados mas com menos energia que a vogal."""
    import numpy as np
    x = aparar(x, taxa)
    j = int(0.010 * taxa); h = j // 2
    quadros = [x[i:i + j] for i in range(0, max(1, len(x) - j), h)]
    if len(quadros) < 6: return None
    en = np.array([np.sqrt(np.mean(q ** 2) + 1e-12) for q in quadros])
    zcr = np.array([np.mean(np.abs(np.diff(np.sign(q)))) / 2 for q in quadros])
    en_n = en / (en.max() + 1e-9)
    # vogal = energia alta (≥ 55% do máximo) e ZCR baixo; a consoante termina no 1º quadro de vogal estável
    vogal = (en_n > 0.55) & (zcr < 0.12)
    for i in range(2, len(vogal) - 3):
        if vogal[i] and vogal[i + 1] and vogal[i + 2]:
            fim = max(int(0.04 * taxa), i * h - int(0.005 * taxa))
            return x[:fim]
    return None

def prolongar(seg, taxa, alvo_ms=800):
    """Prolonga o trecho estável sem alterar o tom (librosa) ou com loop + crossfade."""
    import numpy as np
    alvo = int(taxa * alvo_ms / 1000)
    if len(seg) >= alvo: return fade(seg[:alvo], taxa)
    try:
        import librosa
        r = len(seg) / alvo
        y = librosa.effects.time_stretch(seg.astype('float32'), rate=max(0.05, r))
        return fade(y[:alvo], taxa)
    except Exception:
        meio = seg[len(seg) // 4: 3 * len(seg) // 4] if len(seg) > 400 else seg
        cf = min(len(meio) // 3, int(0.012 * taxa)) or 1
        out = seg[:len(seg) // 4].copy()
        while len(out) < alvo:
            a = out[-cf:]; b = meio[:cf]; r = np.linspace(0, 1, cf)
            out = np.concatenate([out[:-cf], a * (1 - r) + b * r, meio[cf:]])
        return fade(out[:alvo], taxa)

def normalizar(x, taxa):
    import numpy as np
    try:
        import pyloudnorm as pyln
        if len(x) > taxa * 0.4:
            m = pyln.Meter(taxa); l = m.integrated_loudness(x)
            if np.isfinite(l): x = pyln.normalize.loudness(x, l, META_LUFS)
    except Exception:
        rms = np.sqrt(np.mean(x ** 2) + 1e-12); alvo = 10 ** ((META_LUFS - 3) / 20)  # aproximação por RMS
        x = x * (alvo / rms)
    pico = np.max(np.abs(x)) if len(x) else 0
    if pico > 0.98: x = x * (0.98 / pico)
    return x

def medir(x, taxa):
    import numpy as np
    pico = 20 * np.log10(np.max(np.abs(x)) + 1e-9) if len(x) else -120
    lufs = None
    try:
        import pyloudnorm as pyln
        if len(x) > taxa * 0.4: lufs = round(float(pyln.Meter(taxa).integrated_loudness(x)), 1)
    except Exception:
        rms = np.sqrt(np.mean(x ** 2) + 1e-12); lufs = round(float(20 * np.log10(rms) + 3), 1)
    return round(float(pico), 1), lufs

TEM_FFMPEG = shutil.which('ffmpeg') is not None
def salvar(x, taxa, nome_base):
    import numpy as np, soundfile as sf
    wav = os.path.join(PASTA, nome_base + '.wav')
    sf.write(wav, np.clip(x, -1, 1), taxa, subtype='PCM_16')
    if TEM_FFMPEG:
        mp3 = os.path.join(PASTA, nome_base + '.mp3')
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-b:a', '80k', mp3], check=True)
        os.remove(wav); return nome_base + '.mp3'
    return nome_base + '.wav'

# ----------------------------------------------------------------------------- Wikimedia (camada 3, opcional)
def wikimedia(fonema):
    termo = WIKI_BUSCA.get(fonema)
    if not termo: return None
    api = 'https://commons.wikimedia.org/w/api.php?'
    q = urllib.parse.urlencode({'action': 'query', 'list': 'search', 'srsearch': termo + ' ogg', 'srnamespace': 6, 'format': 'json', 'srlimit': 5})
    req = urllib.request.Request(api + q, headers={'User-Agent': 'LerBrincando/1.0 (jogo educativo)'})
    res = json.load(urllib.request.urlopen(req))
    for r in res.get('query', {}).get('search', []):
        titulo = r['title']
        if not titulo.lower().endswith('.ogg'): continue
        q2 = urllib.parse.urlencode({'action': 'query', 'titles': titulo, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata', 'format': 'json'})
        info = json.load(urllib.request.urlopen(urllib.request.Request(api + q2, headers={'User-Agent': 'LerBrincando/1.0'})))
        pg = next(iter(info['query']['pages'].values()))
        ii = pg['imageinfo'][0]; meta = ii.get('extmetadata', {})
        return {'url': ii['url'], 'arquivo': titulo, 'licenca': meta.get('LicenseShortName', {}).get('value', '?'),
                'autor': re.sub('<[^>]+>', '', meta.get('Artist', {}).get('value', '')), 'pagina': ii.get('descriptionurl', '')}
    return None

def carregar_audio_url(url):
    import numpy as np, soundfile as sf
    dados = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'LerBrincando/1.0'})).read()
    x, taxa = sf.read(io.BytesIO(dados), dtype='float32')
    if x.ndim > 1: x = x.mean(axis=1)
    # usa só o PRIMEIRO trecho sonoro (as gravações IPA costumam ter o som isolado e depois exemplos)
    env = np.abs(x); lim = 0.05 * env.max(); ativo = env > lim
    ini = int(np.argmax(ativo)); fim = ini
    silencio = int(0.12 * taxa); cont = 0
    for i in range(ini, len(x)):
        if ativo[i]: fim = i; cont = 0
        else:
            cont += 1
            if cont > silencio: break
    return x[ini:fim + 1], taxa

# ----------------------------------------------------------------------------- principal
def principal():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--listar', action='store_true'); ap.add_argument('--refazer', action='store_true')
    ap.add_argument('--wikimedia', action='store_true'); ap.add_argument('--qc', action='store_true')
    a = ap.parse_args()
    D = ler_dados(); itens = lista_audios(D)
    print(f'{len(itens)} itens de áudio necessários.')
    if a.listar:
        por = {}
        for it in itens: por[it['tipo']] = por.get(it['tipo'], 0) + 1
        print(json.dumps(por, ensure_ascii=False, indent=1)); return
    os.makedirs(PASTA, exist_ok=True)
    caminho_man = os.path.join(PASTA, 'manifest.json')
    man = json.load(open(caminho_man, encoding='utf-8')) if os.path.exists(caminho_man) and not a.refazer else {'itens': {}, 'atribuicoes': []}
    if a.qc: return qualidade(man, itens, D)
    import numpy as np
    synth = Sintetizador(baixar_modelo())
    cache = {}
    def gerar(texto, escala):
        k = (texto, escala)
        if k not in cache: x, taxa = synth.wav(texto, escala); cache[k] = (aparar(x, taxa), taxa)
        return cache[k]
    def registrar(chave, x, taxa, origem, extra=None):
        x = normalizar(x, taxa); pico, lufs = medir(x, taxa)
        arq = salvar(x, taxa, chave)
        man['itens'][chave] = dict(arquivo=arq, ms=int(len(x) / taxa * 1000), origem=origem, pico=pico, lufs=lufs, **(extra or {}))
    t0 = time.time()
    simples = [it for it in itens if it['tipo'] in ('palavra', 'silaba', 'nome', 'frase')]
    for n, it in enumerate(simples, 1):
        k = it['chave']
        if k in man['itens'] and os.path.exists(os.path.join(PASTA, man['itens'][k]['arquivo'])): continue
        x, taxa = gerar(texto_fala(it, D), ESCALA_NORMAL)
        registrar(k, fade(x, taxa, 10), taxa, 'piper')
        if it['tipo'] in ('palavra', 'silaba'):
            xl, _ = gerar(texto_fala(it, D), ESCALA_LENTA); registrar(k + '_lento', fade(xl, taxa, 10), taxa, 'piper')
        if n % 100 == 0: print(f'  {n}/{len(simples)}  ({time.time() - t0:.0f}s)')
    # ---- fonemas: vogais direto do Piper; contínuos por recorte (camada 2) ou Wikimedia (camada 3)
    for it in [x for x in itens if x['tipo'] == 'fonema']:
        k = it['chave']; g = it['texto']; f = D['fonemas'].get(g)
        if k in man['itens'] and not a.refazer: continue
        if f is None or f['tipo'] == 'vogal' or g not in CONTINUAS:
            x, taxa = gerar(texto_fala(it, D) if f else g.lower(), ESCALA_NORMAL); registrar(k, prolongar(x, taxa, 600) if f and f['tipo'] == 'vogal' else x, taxa, 'piper'); continue
        x, taxa = gerar(CONTINUAS[g].lower(), ESCALA_LENTA)
        seg = recortar_consoante(x, taxa)
        ok = seg is not None and len(seg) > 0.035 * taxa and medir(seg, taxa)[0] > -40
        if ok:
            registrar(k, prolongar(seg, taxa, 800), taxa, 'recorte', {'apoio': CONTINUAS[g]})
        elif a.wikimedia:
            info = wikimedia(g)
            if info:
                xw, tw = carregar_audio_url(info['url']); registrar(k, prolongar(xw, tw, 800), tw, 'wikimedia')
                man['atribuicoes'] = [z for z in man['atribuicoes'] if z['fonema'] != g] + [dict(fonema=g, arquivo=info['arquivo'], autor=info['autor'], licenca=info['licenca'], url=info['pagina'])]
            else: print('  ! sem gravação Wikimedia para', g)
        else:
            print(f'  ! recorte de /{g}/ não passou na checagem: rode com --wikimedia ou ajuste manualmente')
    # ---- frases das histórias e das fases: junção das palavras → tempos exatos para o karaokê
    pausa_ms = 140
    for it in [x for x in itens if x['tipo'] in ('hist', 'frasejogo')]:
        k = it['chave']
        if k in man['itens'] and not a.refazer: continue
        toks = tokenizar(it['frase'])
        for lento in (False, True):
            partes, pal, sils, t = [], [], [], 0
            taxa = synth.taxa
            for tk in toks:
                if lento:
                    ini = t; s_tempos = []
                    for s in tk['silabas']:
                        xs, taxa = gerar(s.lower(), ESCALA_LENTA)
                        s_tempos.append({'ini': t, 'fim': t + int(len(xs) / taxa * 1000)}); partes.append(xs); t += int(len(xs) / taxa * 1000)
                        z = np.zeros(int(taxa * 0.06), dtype='float32'); partes.append(z); t += 60
                    pal.append({'ini': ini, 'fim': t}); sils.append(s_tempos)
                else:
                    xw, taxa = gerar(tk['palavra'].lower(), ESCALA_NORMAL)
                    d = int(len(xw) / taxa * 1000); pal.append({'ini': t, 'fim': t + d})
                    # tempos estimados das sílabas (proporcionais ao número de letras) na versão normal
                    tot = sum(len(s) for s in tk['silabas']); acc = t; st = []
                    for s in tk['silabas']:
                        dd = int(d * len(s) / tot); st.append({'ini': acc, 'fim': acc + dd, 'estimado': True}); acc += dd
                    sils.append(st); partes.append(xw); t += d
                z = np.zeros(int(taxa * pausa_ms / 1000), dtype='float32'); partes.append(z); t += pausa_ms
            x = np.concatenate(partes) if partes else np.zeros(1, dtype='float32')
            x = normalizar(x, taxa); pico, lufs = medir(x, taxa)
            nome = k + ('_lento' if lento else '')
            arq = salvar(x, taxa, nome)
            man['itens'][nome] = dict(arquivo=arq, ms=int(len(x) / taxa * 1000), origem='piper', pico=pico, lufs=lufs, palavras=pal, silabas=sils)
    man['gerado'] = time.strftime('%Y-%m-%d %H:%M'); man['voz'] = VOZ
    licenca = '?'
    try:
        cfg = json.load(open(os.path.join(MODELOS, VOZ + '.onnx.json'), encoding='utf-8'))
        licenca = cfg.get('dataset', '') or licenca
        card = open(os.path.join(MODELOS, 'MODEL_CARD'), encoding='utf-8').read()
        m = re.search(r'[Ll]icen[sc]e[^\n]*', card); licenca = m.group(0).strip() if m else licenca
    except Exception:
        pass
    man['licencaVoz'] = licenca
    json.dump(man, open(caminho_man, 'w', encoding='utf-8'), ensure_ascii=False)
    with open(os.path.join(PASTA, 'manifest.js'), 'w', encoding='utf-8') as f:
        f.write('window.AUDIO_MANIFEST = ' + json.dumps(man, ensure_ascii=False) + ';\n')
    print(f'Banco gerado em {time.time() - t0:.0f}s. Licença declarada do modelo: {licenca}')
    qualidade(man, itens, D)

def qualidade(man, itens, D):
    ausentes = [it['chave'] for it in itens if it['chave'] not in man['itens']]
    silenciosos = [k for k, v in man['itens'].items() if v.get('pico', 0) < -40]
    fora = [k for k, v in man['itens'].items() if v.get('lufs') is not None and not (-18 <= v['lufs'] <= -14)]
    anormais = []
    for k, v in man['itens'].items():
        tipo = k.split('_')[0]
        lim = {'silaba': (120, 1800), 'palavra': (180, 3500), 'fonema': (300, 1500), 'nome': (150, 1500)}.get(tipo)
        if lim and not (lim[0] <= v['ms'] <= lim[1] * (1.6 if k.endswith('_lento') else 1)): anormais.append(f"{k} ({v['ms']} ms)")
    print('\n=== CHECAGEM DE QUALIDADE ===')
    print(f'Ausentes: {len(ausentes)}'); [print('  -', x) for x in ausentes[:30]]
    print(f'Silenciosos (pico < −40 dBFS): {len(silenciosos)}'); [print('  -', x) for x in silenciosos[:30]]
    print(f'Volume fora de −16 ±2 LUFS: {len(fora)}  (itens muito curtos podem medir fora da faixa)'); [print('  -', x) for x in fora[:15]]
    print(f'Duração anormal: {len(anormais)}'); [print('  -', x) for x in anormais[:30]]
    print('Escute 100% dos fonemas e sílabas (painel "Banco de Áudio" na Área dos Pais) antes do piloto.')

if __name__ == '__main__':
    principal()
