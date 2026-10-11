#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ler Brincando — gerar_audios.py  (v1.2)
Gera o Banco de Áudio (pasta audio/) que o jogo usa automaticamente.

NOVIDADES v1.2
  • Sílabas NUNCA soletradas: cada sílaba é escrita de forma pronunciável ("ve" → "vé", "nha" → "nhá",
    "pan" → "pân") e o script CONFERE o áudio: se detectar dois sons (sinal de "v, e"), tenta outras grafias.
    O que ainda falhar vai para audio/revisar.txt — corrija em ferramentas/pronuncias.json e rode de novo.
  • Fala mais calma (−15% na normal, −35% na lenta 🐢) e sem cortes: margem de silêncio antes e depois,
    corte de bordas relativo ao volume do próprio som (não come o "f", "s", "v" do começo/fim).
  • Bancos gerados pela v1.1 são atualizados automaticamente (sílabas, fonemas e margens).

MOTORES (--motor):  edge (padrão, vozes neurais Microsoft via edge-tts) · kokoro (offline, Apache-2.0) · piper (offline, robótico)

Uso:
  Windows: duplo clique em gerar_audios.bat
  python gerar_audios.py                         # gera/atualiza tudo
  python gerar_audios.py --amostra               # 16 sons de teste em audio_amostra/
  python gerar_audios.py --tipos silaba,fonema   # só esses tipos (palavra, silaba, fonema, nome, frase, hist, frasejogo)
  python gerar_audios.py --refazer               # regera tudo do zero
  python gerar_audios.py --voz pt-BR-ThalitaMultilingualNeural
  python gerar_audios.py --velocidade -20%       # ainda mais calmo (edge)
  python gerar_audios.py --listar | --qc | --wikimedia
"""
import argparse, asyncio, io, json, os, re, shutil, subprocess, sys, time, urllib.request, urllib.parse, wave

VERSAO_GERADOR = 3
RAIZ = os.path.dirname(os.path.abspath(__file__))
PASTA = os.path.join(RAIZ, 'audio')
META_LUFS = -16.0
MARGEM_INI_MS, MARGEM_FIM_MS = 70, 160      # silêncio acrescentado antes/depois (evita som "comido" no início)
CONTINUAS = {'F': 'FA', 'V': 'VA', 'M': 'MA', 'N': 'NA', 'L': 'LA', 'S': 'SA', 'Z': 'ZA', 'J': 'JA', 'X': 'XA', 'NH': 'NHA', 'LH': 'LHA'}
ALONGADO = {'M': 'mmmmmm', 'N': 'nnnnnn', 'L': 'llllll', 'F': 'ffffff', 'V': 'vvvvvv', 'S': 'ssssss', 'Z': 'zzzzzz', 'X': 'chhhhhh', 'J': 'jjjjjj', 'NH': 'nhhhhh', 'LH': 'lhhhhh'}
WIKI_BUSCA = {'M': 'Bilabial nasal', 'N': 'Alveolar nasal', 'F': 'Voiceless labiodental fricative', 'V': 'Voiced labiodental fricative',
              'S': 'Voiceless alveolar sibilant', 'Z': 'Voiced alveolar sibilant', 'X': 'Voiceless postalveolar fricative',
              'J': 'Voiced postalveolar fricative', 'L': 'Alveolar lateral approximant', 'NH': 'Palatal nasal', 'LH': 'Palatal lateral approximant'}
VEL = {'edge': ('-15%', '-35%'), 'kokoro': (0.88, 0.72), 'piper': (1.1, 1.4)}
VOGAL_TTS_ALT = {'Ã': ['ã', 'ãã', 'lã'], 'Á': ['á', 'aah'], 'Ê': ['ê', 'êê'], 'É': ['é', 'éé'], 'Í': ['í', 'ii'], 'Ô': ['ô', 'ôô'], 'Ó': ['ó', 'óó'], 'Ú': ['ú', 'uu']}

# ----------------------------------------------------------------------------- grafia pronunciável (igual ao nucleo.js → pronunciavel)
MONO_OK = {'SOL', 'MAR', 'MEL', 'SAL', 'GOL', 'PÃO', 'MÃO', 'PÉ', 'CHÁ', 'REI', 'BOI', 'PAU', 'BAÚ', 'TREM', 'FLOR', 'LUZ', 'PAZ', 'NÓS', 'VOZ', 'DOR', 'COR', 'MAL', 'MIL', 'SIM', 'NÃO', 'UM', 'COM', 'TEM', 'SÃO'}
VOG = 'AEIOUÁÉÍÓÚÂÊÔÃÕÀ'
AGUDO = {'A': 'Á', 'E': 'É', 'I': 'Í', 'O': 'Ó', 'U': 'Ú'}
CIRC = {'A': 'Â', 'E': 'Ê', 'O': 'Ô', 'I': 'Í', 'U': 'Ú'}
def pronunciavel(silaba, fechado=False):
    S = silaba.upper()
    if S in MONO_OK or re.search('[ÁÉÍÓÚÂÊÔÃÕÀ]', S): return S.lower()
    i = 0
    while i < len(S) and S[i] not in VOG: i += 1
    if i >= len(S): return S.lower()
    if i > 0 and S[i - 1:i + 1] in ('QU', 'GU') and i + 1 < len(S) and S[i + 1] in VOG: i += 1
    v = S[i]; v2 = S[i + 1] if i + 1 < len(S) else ''
    j = i; tab = CIRC if fechado else AGUDO
    if v + v2 in ('EI', 'EU', 'OU'): tab = CIRC
    elif v + v2 in ('AI', 'AU', 'OI', 'UI'): tab = AGUDO
    elif v in 'IU' and v2 and v2 in VOG: j = i + 1
    elif v2 in ('M', 'N') and not (i + 2 < len(S) and S[i + 2] in VOG): tab = CIRC
    return (S[:j] + tab.get(S[j], S[j]) + S[j + 1:]).lower()

def candidatos_silaba(s):
    """Grafias tentadas, em ordem, até o áudio sair como UM som só."""
    c = [pronunciavel(s), pronunciavel(s, True), s.lower() + '.', pronunciavel(s) + '!', s.lower()]
    return list(dict.fromkeys(c))

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

# ----------------------------------------------------------------------------- decodificação
def decodificar(dados):
    import numpy as np
    try:
        import soundfile as sf
        x, taxa = sf.read(io.BytesIO(dados), dtype='float32')
    except Exception:
        if shutil.which('ffmpeg'):
            r = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', 'pipe:0', '-f', 'wav', '-ac', '1', 'pipe:1'], input=dados, capture_output=True, check=True)
            import soundfile as sf
            x, taxa = sf.read(io.BytesIO(r.stdout), dtype='float32')
        else:
            import librosa, tempfile
            with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as f: f.write(dados); nome = f.name
            x, taxa = librosa.load(nome, sr=None, mono=True); os.remove(nome)
    if getattr(x, 'ndim', 1) > 1: x = x.mean(axis=1)
    return x.astype('float32'), taxa

# ----------------------------------------------------------------------------- verificação "falou ou soletrou?"
def nucleos(x, taxa):
    """Conta os blocos sonoros (núcleos de vogal) separados por silêncio/queda forte.
       Sílaba bem falada = 1. Soletrada ("v, e") = 2 ou mais."""
    import numpy as np
    if len(x) < taxa * 0.05: return 0
    h = int(taxa * 0.01); w = int(taxa * 0.025)
    env = np.array([np.sqrt(np.mean(x[i:i + w] ** 2) + 1e-12) for i in range(0, max(1, len(x) - w), h)])
    if len(env) > 3: env = np.convolve(env, np.ones(3) / 3, mode='same')
    m = env.max() or 1; alto = env > 0.35 * m; baixo = env < 0.10 * m
    blocos = 0; dentro = False; vale = 0
    for k in range(len(env)):
        if alto[k]:
            if not dentro and (blocos == 0 or vale >= 6): blocos += 1   # vale ≥ 60 ms separa sons
            dentro = True; vale = 0
        else:
            if baixo[k]: vale += 1
            dentro = False if baixo[k] else dentro
    return blocos

def silaba_ok(x, taxa):
    import numpy as np
    dur = len(x) / taxa
    return nucleos(x, taxa) == 1 and dur < 1.15

# ----------------------------------------------------------------------------- motores
class MotorEdge:
    nome = 'edge'
    def __init__(self, voz):
        try:
            import edge_tts  # noqa
        except ImportError:
            sys.exit('Instale:  python -m pip install edge-tts')
        self.voz = voz or 'pt-BR-FranciscaNeural'
    async def _um(self, texto, rate):
        import edge_tts
        try:
            com = edge_tts.Communicate(texto, self.voz, rate=rate, boundary='WordBoundary')
        except TypeError:
            com = edge_tts.Communicate(texto, self.voz, rate=rate)
        audio = bytearray(); palavras = []
        async for ch in com.stream():
            if ch['type'] == 'audio': audio.extend(ch['data'])
            elif ch['type'] == 'WordBoundary':
                palavras.append({'txt': ch['text'], 'ini': ch['offset'] / 1e4, 'fim': (ch['offset'] + ch['duration']) / 1e4})
        return bytes(audio), palavras
    async def lote(self, pedidos, paralelo=6):
        sem = asyncio.Semaphore(paralelo); res = {}
        async def tarefa(k, t, r):
            async with sem:
                for tent in range(4):
                    try:
                        a, pw = await self._um(t, r); x, taxa = decodificar(a); res[k] = (x, taxa, pw); return
                    except Exception as e:
                        if tent == 3: print('  ! falhou', k, e)
                        await asyncio.sleep(1.5 * (tent + 1))
        await asyncio.gather(*[tarefa(*p) for p in pedidos])
        return res
    def sintetizar(self, pedidos):
        return asyncio.run(self.lote(pedidos))

class MotorKokoro:
    nome = 'kokoro'
    def __init__(self, voz):
        try:
            from kokoro import KPipeline
        except ImportError:
            sys.exit('Instale:  python -m pip install kokoro soundfile')
        self.pipe = KPipeline(lang_code='p'); self.voz = voz or 'pf_dora'
    def sintetizar(self, pedidos):
        import numpy as np
        res = {}
        for k, t, vel in pedidos:
            partes = [a for _, _, a in self.pipe(t, voice=self.voz, speed=vel)]
            x = np.concatenate([np.asarray(p, dtype='float32') for p in partes]) if partes else np.zeros(1, 'float32')
            res[k] = (x, 24000, [])
        return res

class MotorPiper:
    nome = 'piper'
    URL = 'https://huggingface.co/rhasspy/piper-voices/resolve/main/pt/pt_BR/faber/medium/'
    def __init__(self, voz):
        try:
            from piper import PiperVoice
        except ImportError:
            sys.exit('Instale:  python -m pip install piper-tts')
        nome = voz or 'pt_BR-faber-medium'; pasta = os.path.join(RAIZ, 'modelos_piper'); os.makedirs(pasta, exist_ok=True)
        for ext in ('.onnx', '.onnx.json'):
            d = os.path.join(pasta, nome + ext)
            if not os.path.exists(d): print('Baixando', nome + ext); urllib.request.urlretrieve(self.URL + nome + ext, d)
        self.v = PiperVoice.load(os.path.join(pasta, nome + '.onnx')); self.voz = nome
    def sintetizar(self, pedidos):
        import numpy as np
        res = {}
        for k, t, escala in pedidos:
            buf = io.BytesIO()
            with wave.open(buf, 'wb') as w:
                try:
                    from piper import SynthesisConfig
                    self.v.synthesize_wav(t, w, syn_config=SynthesisConfig(length_scale=escala))
                except ImportError:
                    w.setnchannels(1); w.setsampwidth(2); w.setframerate(self.v.config.sample_rate); self.v.synthesize(t, w, length_scale=escala)
            buf.seek(0)
            with wave.open(buf, 'rb') as r:
                res[k] = (np.frombuffer(r.readframes(r.getnframes()), dtype=np.int16).astype('float32') / 32768, r.getframerate(), [])
        return res

def criar_motor(nome, voz):
    return {'edge': MotorEdge, 'kokoro': MotorKokoro, 'piper': MotorPiper}[nome](voz)

def carregar_pronuncias():
    p = os.path.join(RAIZ, 'ferramentas', 'pronuncias.json')
    if os.path.exists(p):
        d = json.load(open(p, encoding='utf-8')); return {k: v for k, v in d.items() if not k.startswith('_')}
    return {}

def texto_fala(item, D, PRON):
    if item['chave'] in PRON: return PRON[item['chave']]
    t = item['texto']; tp = item['tipo']
    if tp == 'palavra': return t.lower()
    if tp == 'silaba': return pronunciavel(t)
    if tp == 'nome': return item['fala']
    if tp == 'fonema':
        f = D['fonemas'].get(t)
        if f and f['tipo'] == 'vogal': return f['tts']
        if f and f['tipo'] == 'continua': return ALONGADO.get(t, pronunciavel(f['apoio']))
        return pronunciavel(t) if len(t) > 1 else t.lower()
    if tp in ('hist', 'frasejogo'):
        return ' '.join(tk['palavra'].lower() for tk in tokenizar(item['frase'])) + '.'
    return t

# ----------------------------------------------------------------------------- acabamento do som
def aparar_rel(x, taxa, abaixo_db=42):
    """Corta silêncio das bordas com limiar RELATIVO ao pico (preserva f/s/v fracos)."""
    import numpy as np
    if not len(x): return x
    pico = np.max(np.abs(x)) or 1; lim = pico * 10 ** (-abaixo_db / 20)
    w = max(1, int(taxa * 0.005)); env = np.convolve(np.abs(x), np.ones(w) / w, mode='same')
    idx = np.where(env > lim)[0]
    if not len(idx): return x
    a = max(0, idx[0] - int(0.03 * taxa)); b = min(len(x), idx[-1] + int(0.08 * taxa))
    return x[a:b]

def acabamento(x, taxa):
    import numpy as np
    x = aparar_rel(x, taxa)
    n = min(len(x) // 4, int(taxa * 0.006))
    if n > 0: x = x.copy(); r = np.linspace(0, 1, n); x[:n] *= r; x[-n:] *= r[::-1]
    return np.concatenate([np.zeros(int(taxa * MARGEM_INI_MS / 1000), 'float32'), x.astype('float32'), np.zeros(int(taxa * MARGEM_FIM_MS / 1000), 'float32')])

FORMATOS = None
def salvar(x, taxa, nome_base):
    import numpy as np, soundfile as sf
    global FORMATOS
    if FORMATOS is None: FORMATOS = sf.available_formats()
    for ext in ('.mp3', '.wav'):
        try: os.remove(os.path.join(PASTA, nome_base + ext))
        except OSError: pass
    x = np.clip(x, -1, 1)
    if 'MP3' in FORMATOS:
        sf.write(os.path.join(PASTA, nome_base + '.mp3'), x, taxa, format='MP3'); return nome_base + '.mp3'
    if shutil.which('ffmpeg'):
        wav = os.path.join(PASTA, nome_base + '.wav'); sf.write(wav, x, taxa, subtype='PCM_16')
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-b:a', '96k', os.path.join(PASTA, nome_base + '.mp3')], check=True)
        os.remove(wav); return nome_base + '.mp3'
    sf.write(os.path.join(PASTA, nome_base + '.wav'), x, taxa, subtype='PCM_16'); return nome_base + '.wav'

def tempos_silabas(tk, ini, fim):
    tot = sum(len(s) for s in tk['silabas']) or 1; acc = ini; out = []
    for s in tk['silabas']:
        d = (fim - ini) * len(s) / tot; out.append({'ini': int(acc), 'fim': int(acc + d), 'estimado': True}); acc += d
    return out

# ----------------------------------------------------------------------------- principal
def principal():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--motor', default='edge', choices=['edge', 'kokoro', 'piper'])
    ap.add_argument('--voz', default=None)
    ap.add_argument('--velocidade', default=None, help='edge: ex. -15%% (normal); a lenta fica 20 pontos abaixo')
    ap.add_argument('--tipos', default=None, help='lista separada por vírgula: palavra,silaba,fonema,nome,frase,hist,frasejogo')
    ap.add_argument('--listar', action='store_true'); ap.add_argument('--refazer', action='store_true')
    ap.add_argument('--wikimedia', action='store_true'); ap.add_argument('--qc', action='store_true')
    ap.add_argument('--amostra', action='store_true')
    a = ap.parse_args()
    D = ler_dados(); itens = lista_audios(D); PRON = carregar_pronuncias()
    print(f'{len(itens)} itens de áudio necessários.')
    if a.listar:
        por = {}
        for it in itens: por[it['tipo']] = por.get(it['tipo'], 0) + 1
        print(json.dumps(por, ensure_ascii=False, indent=1)); return
    global PASTA
    if a.amostra:
        PASTA = os.path.join(RAIZ, 'audio_amostra')
        alvo = {'palavra_macaco', 'palavra_borboleta', 'silaba_ma', 'silaba_ve', 'silaba_nha', 'silaba_que', 'silaba_pan', 'silaba_fu',
                'fonema_m', 'fonema_s', 'fonema_a', 'fonema_a3', 'nome_m', 'frase_' + slug(D['falas']['boasVindas']), 'frase_' + slug(D['elogios']['aposErro'][0]), 'hist_h3_1'}
        itens = [it for it in itens if it['chave'] in alvo]; a.refazer = True
    if a.tipos:
        tipos = set(a.tipos.split(',')); itens = [it for it in itens if it['tipo'] in tipos]
    os.makedirs(PASTA, exist_ok=True)
    caminho_man = os.path.join(PASTA, 'manifest.json')
    man = json.load(open(caminho_man, encoding='utf-8')) if os.path.exists(caminho_man) and not a.refazer else {'itens': {}, 'atribuicoes': []}
    if a.qc: return qualidade(man, itens, D)
    import numpy as np
    vn, vl = VEL[a.motor]
    if a.velocidade and a.motor == 'edge':
        vn = a.velocidade; vl = f"{int(a.velocidade.strip('%')) - 20}%"
    # banco antigo (v1.0/v1.1): refaz o que mudou
    velho = man.get('versaoGerador', 1) < VERSAO_GERADOR and man['itens']
    if velho:
        print('Banco de versão anterior detectado: atualizando sílabas, fonemas, margens e velocidade (pode levar alguns minutos).')
        man['itens'] = {}
    motor = criar_motor(a.motor, a.voz)
    if man.get('voz') and man.get('voz') != motor.voz and not a.refazer:
        print(f"Aviso: o banco existente usa a voz {man['voz']}. Use --refazer para trocar tudo pela voz {motor.voz}.")
    t0 = time.time(); revisar = []

    def registrar(chave, x, taxa, origem, extra=None, texto=None):
        x = normalizar(acabamento(x, taxa), taxa); pico, lufs = medir(x, taxa)
        arq = salvar(x, taxa, chave)
        man['itens'][chave] = dict(arquivo=arq, ms=int(len(x) / taxa * 1000), origem=origem, pico=pico, lufs=lufs, **({'texto': texto} if texto else {}), **(extra or {}))

    def existe(k):
        return k in man['itens'] and os.path.exists(os.path.join(PASTA, man['itens'][k]['arquivo']))

    # ---- 1) palavras, nomes, frases
    pend = []
    for it in itens:
        if it['tipo'] not in ('palavra', 'nome', 'frase'): continue
        k = it['chave']
        if existe(k): continue
        tx = texto_fala(it, D, PRON); pend.append((k, tx, vn))
        if it['tipo'] == 'palavra': pend.append((k + '_lento', tx, vl))
    print(f'Gerando {len(pend)} palavras/frases (motor {a.motor}, voz {motor.voz}, velocidade {vn})...')
    for i in range(0, len(pend), 60):
        res = motor.sintetizar(pend[i:i + 60])
        txt = {k: t for k, t, _ in pend[i:i + 60]}
        for k, (x, taxa, _) in res.items(): registrar(k, x, taxa, a.motor, texto=txt[k])
        print(f'  {min(i + 60, len(pend))}/{len(pend)}  ({time.time() - t0:.0f}s)')
        man['versaoGerador'] = VERSAO_GERADOR; json.dump(man, open(caminho_man, 'w', encoding='utf-8'), ensure_ascii=False)

    # ---- 2) sílabas: grafia pronunciável + verificação "um som só"
    sil = [it for it in itens if it['tipo'] == 'silaba' and not existe(it['chave'])]
    print(f'Gerando {len(sil)} sílabas com verificação anti-soletração...')
    for n, it in enumerate(sil, 1):
        k = it['chave']
        cands = [PRON[k]] if k in PRON else candidatos_silaba(it['texto'])
        escolhido = None
        for c in cands:
            r = motor.sintetizar([('n', c, vn), ('l', c, vl)])
            if 'n' not in r: continue
            xn, tn, _ = r['n']; xs = aparar_rel(xn, tn)
            if silaba_ok(xs, tn):
                escolhido = (c, r); break
            if escolhido is None: escolhido = (c, r, 'suspeito')
        c, r = escolhido[0], escolhido[1]
        if len(escolhido) == 3:
            revisar.append(f"{k}  (texto '{it['texto']}', tentativas: {', '.join(cands)})")
        registrar(k, r['n'][0], r['n'][1], a.motor, {'suspeito': True} if len(escolhido) == 3 else None, texto=c)
        if 'l' in r: registrar(k + '_lento', r['l'][0], r['l'][1], a.motor, texto=c)
        if n % 50 == 0:
            print(f'  {n}/{len(sil)}  ({time.time() - t0:.0f}s)'); json.dump(man, open(caminho_man, 'w', encoding='utf-8'), ensure_ascii=False)

    # ---- 3) fonemas
    for it in [x for x in itens if x['tipo'] == 'fonema']:
        k = it['chave']; g = it['texto']; f = D['fonemas'].get(g)
        if existe(k): continue
        if k in PRON or f is None or f['tipo'] != 'continua':
            cands = [PRON[k]] if k in PRON else ([texto_fala(it, D, PRON)] + VOGAL_TTS_ALT.get(f['tts'].upper() if f else '', []) if f else candidatos_silaba(g))
            ok = None
            for c in dict.fromkeys(cands):
                x, taxa, _ = motor.sintetizar([('x', c, vl)])['x']; xs = aparar_rel(x, taxa)
                if ok is None or silaba_ok(xs, taxa):
                    ok = (xs, taxa, c)
                    if silaba_ok(xs, taxa): break
            xs, taxa, c = ok
            if not silaba_ok(xs, taxa): revisar.append(f'{k}  (vogal/sílaba: tentativas {", ".join(dict.fromkeys(cands))})')
            if f and f['tipo'] == 'vogal' and len(xs) < taxa * 0.5: xs = prolongar(xs, taxa, 650)
            registrar(k, xs, taxa, a.motor, texto=c); continue
        cand = motor.sintetizar([('a', ALONGADO[g], vl), ('b', pronunciavel(CONTINUAS[g]), vl)])
        xa, ta, _ = cand['a']; xa = aparar_rel(xa, ta)
        seg = None
        if 0.35 * ta < len(xa) < 2.2 * ta:
            s2 = recortar_consoante(xa, ta)
            seg = xa if (s2 is None or len(s2) > 0.7 * len(xa)) else None
        if seg is not None:
            registrar(k, prolongar(seg, ta, 850), ta, a.motor + '-alongado', {'apoio': CONTINUAS[g]}); continue
        xb, tb, _ = cand['b']; seg = recortar_consoante(aparar_rel(xb, tb), tb)
        if seg is not None and len(seg) > 0.035 * tb and medir(seg, tb)[0] > -40:
            registrar(k, prolongar(seg, tb, 850), tb, 'recorte', {'apoio': CONTINUAS[g]}); continue
        if a.wikimedia:
            info = wikimedia(g)
            if info:
                xw, tw = carregar_audio_url(info['url']); registrar(k, prolongar(xw, tw, 850), tw, 'wikimedia')
                man['atribuicoes'] = [z for z in man['atribuicoes'] if z['fonema'] != g] + [dict(fonema=g, arquivo=info['arquivo'], autor=info['autor'], licenca=info['licenca'], url=info['pagina'])]
                continue
        revisar.append(f'{k}  (fonema contínuo /{g}/: rode com --wikimedia ou defina em pronuncias.json)')

    # ---- 4) frases das histórias e das fases (frase inteira + tempos das palavras, deslocados pela margem)
    for it in [x for x in itens if x['tipo'] in ('hist', 'frasejogo')]:
        k = it['chave']
        if existe(k) and existe(k + '_lento'): continue
        toks = tokenizar(it['frase']); tx = texto_fala(it, D, PRON)
        res = motor.sintetizar([(k, tx, vn), (k + '_lento', tx, vl)])
        for nome in (k, k + '_lento'):
            if nome not in res: continue
            x, taxa, pw = res[nome]
            if len(pw) == len(toks):
                pal = [{'ini': int(p['ini']), 'fim': int(p['fim'])} for p in pw]; xo = x
            else:
                partes, pal, t = [], [], 0
                wr = motor.sintetizar([(f'w{i}', tk['palavra'].lower(), vn if nome == k else vl) for i, tk in enumerate(toks)])
                for i, tk in enumerate(toks):
                    xw, taxa, _ = wr[f'w{i}']; xw = aparar_rel(xw, taxa); d = int(len(xw) / taxa * 1000)
                    pal.append({'ini': t, 'fim': t + d}); partes.append(xw); t += d
                    partes.append(np.zeros(int(taxa * 0.12), 'float32')); t += 120
                xo = np.concatenate(partes)
            # margem só no fim e no início (sem aparar o meio, para manter os tempos)
            ini = int(taxa * MARGEM_INI_MS / 1000)
            xo = np.concatenate([np.zeros(ini, 'float32'), xo.astype('float32'), np.zeros(int(taxa * MARGEM_FIM_MS / 1000), 'float32')])
            pal = [{'ini': p['ini'] + MARGEM_INI_MS, 'fim': p['fim'] + MARGEM_INI_MS} for p in pal]
            sils = [tempos_silabas(tk, p['ini'], p['fim']) for tk, p in zip(toks, pal)]
            xo = normalizar(xo, taxa); pico, lufs = medir(xo, taxa)
            man['itens'][nome] = dict(arquivo=salvar(xo, taxa, nome), ms=int(len(xo) / taxa * 1000), origem=a.motor, pico=pico, lufs=lufs, palavras=pal, silabas=sils)

    man['gerado'] = time.strftime('%Y-%m-%d %H:%M'); man['voz'] = motor.voz; man['motor'] = a.motor
    man['versaoGerador'] = VERSAO_GERADOR; man['margemIniMs'] = MARGEM_INI_MS
    json.dump(man, open(caminho_man, 'w', encoding='utf-8'), ensure_ascii=False)
    with open(os.path.join(PASTA, 'manifest.js'), 'w', encoding='utf-8') as f:
        f.write('window.AUDIO_MANIFEST = ' + json.dumps(man, ensure_ascii=False) + ';\n')
    with open(os.path.join(PASTA, 'revisar.txt'), 'w', encoding='utf-8') as f:
        f.write('Sons que a verificação automática considerou suspeitos (possível soletração ou corte).\n'
                'Escute em Área dos Pais → Banco de Áudio. Para corrigir, escreva a grafia desejada em\n'
                'ferramentas/pronuncias.json (ex.: "silaba_ve": "vê") e rode: python gerar_audios.py --tipos silaba,fonema\n\n')
        f.write('\n'.join(revisar) or '(nenhum)')
    print(f'Banco gerado em {time.time() - t0:.0f}s com a voz {motor.voz}. Suspeitos para revisar: {len(revisar)} (veja audio/revisar.txt)')
    if a.amostra: print('Escute os arquivos em audio_amostra/. Depois rode sem --amostra.')
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
