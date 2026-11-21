"""Pronúncia de cada sílaba DENTRO da palavra (IPA), para a "palavra silabada" do Banco de Áudio.

O som isolado de uma sílaba (silaba_ra = "RÁ", com R forte e tônica) não serve para todas as palavras:
em PE-RA o R é fraco, em CA-SA o S soa Z, em GA-TO o O final soa U e em PE-RA o E é fechado.
Aqui cada sílaba recebe a pronúncia que ela tem naquela palavra; só a sílaba tônica leva acento (ˈ).
Regras do português do Brasil + tabela manual (ferramentas/pronuncia_palavras.json) para o que a escrita não diz
(E/O abertos ou fechados na tônica, tônica irregular, X com som de KS)."""
import json, os, re, unicodedata

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOGAIS = 'aeiouáéíóúâêôãõàü'
ACENTO = 'áéíóúâêô'
_ONSET = ['ch', 'lh', 'nh', 'qu', 'gu', 'br', 'bl', 'cr', 'cl', 'dr', 'fr', 'fl', 'gr', 'gl', 'pr', 'pl', 'tr', 'tl', 'vr',
          'b', 'c', 'ç', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z']
_ACENTUADA = {'á': 'a', 'à': 'a', 'â': 'ɐ', 'é': 'ɛ', 'ê': 'e', 'í': 'i', 'ó': 'ɔ', 'ô': 'o', 'ú': 'u', 'ã': 'ɐ̃', 'õ': 'õ', 'ü': 'u'}
_NASAL = {'a': 'ɐ̃', 'ɐ': 'ɐ̃', 'ɛ': 'ẽ', 'e': 'ẽ', 'i': 'ĩ', 'ɔ': 'õ', 'o': 'õ', 'u': 'ũ'}
_TAB = {'é': 'ɛ', 'ê': 'e', 'ó': 'ɔ', 'ô': 'o'}

def carregar_tabela():
    p = os.path.join(RAIZ, 'ferramentas', 'pronuncia_palavras.json')
    if not os.path.exists(p): return {'vogal': {}, 'palavras': {}}
    d = json.load(open(p, encoding='utf-8')); d.setdefault('vogal', {}); d.setdefault('palavras', {}); return d

def tonica(silabas):
    """Igual ao Nucleo.tonica do jogo."""
    S = [s.upper() for s in silabas]
    for i, s in enumerate(S):
        if re.search('[ÁÉÍÓÚÂÊÔ]', s): return i
    for i, s in enumerate(S):
        if re.search('[ÃÕ]', s): return i
    if len(S) == 1: return 0
    if re.search('(A|E|O|AS|ES|OS|AM|EM|ENS)$', ''.join(S)): return len(S) - 2
    return len(S) - 1

def _termina_vogal(s):
    return bool(s) and s[-1] in VOGAIS

def ipa_silaba_na_palavra(silabas, i, t, qual_tonica=None):
    s = silabas[i].lower(); prev = silabas[i - 1].lower() if i > 0 else ''; nxt = silabas[i + 1].lower() if i + 1 < len(silabas) else ''
    tonica_ = (i == t); final = (i == len(silabas) - 1); pos = i > t
    on = next((o for o in _ONSET if s.startswith(o) and len(s) > len(o) and (o not in ('qu', 'gu') or s[len(o)] in VOGAIS)), '')
    r = s[len(on):]
    if not r or r[0] not in VOGAIS: return None
    # ---- vogal (núcleo)
    v = r[0]; resto = r[1:]; v_escrita = v   # C/G antes de E/I (CIA, GIA): decide pela letra escrita, antes do ditongo
    # ditongos crescentes do tipo "ia", "ua" (GUA já tratado pelo onset)
    pre = ''
    if v in 'iu' and resto[:1] and resto[0] in VOGAIS and not (resto[0] in 'iu'):
        pre = 'j' if v == 'i' else 'w'; v = resto[0]; resto = resto[1:]
    if v in _ACENTUADA and v not in 'aeiou': nuc = _ACENTUADA[v]
    elif tonica_:
        nuc = {'a': 'a', 'i': 'i', 'u': 'u'}.get(v) or _TAB.get(qual_tonica or '', 'e' if v == 'e' else 'o')
    elif pos and final and resto in ('', 's'):   # átona final aberta: A → ɐ, E → i, O → u (GA-TO = "ga-tu")
        nuc = {'a': 'ɐ', 'e': 'i', 'o': 'u', 'i': 'i', 'u': 'u'}[v]
    elif i == 0 and v == 'e' and on == '' and resto in ('s', 'x'):   # ES-CO-LA, ES-PE-LHO: "is"
        nuc = 'i'
    else:                 # pretônica (ou átona no meio): vogais fechadas
        nuc = {'a': 'a', 'e': 'e', 'o': 'o', 'i': 'i', 'u': 'u'}[v]
    # ---- ditongo decrescente e coda
    glide = ''
    if resto[:1] in ('i', 'u') and (len(resto) == 1 or resto[1] in 'smnrlz'):
        glide = 'j' if resto[0] == 'i' else 'w'; resto = resto[1:]
        if nuc == 'o' and glide == 'w': glide = ''   # OU → ô (como se fala: "pegô" → "pegou" com O fechado)
    if resto[:1] == 'o' and nuc == 'ɐ̃': glide = 'w̃'; resto = resto[1:]          # ÃO
    if resto[:1] == 'e' and nuc in ('ɐ̃', 'õ'): glide = 'j̃'; resto = resto[1:]     # ÃE, ÕE
    coda = ''
    if resto in ('m', 'n', 'ms', 'ns'):
        if nuc in ('e', 'ɛ') and resto.startswith('m') and final: nuc, glide = 'ẽ', 'j̃'
        elif nuc in ('a', 'ɐ') and resto.startswith('m') and final and not tonica_: nuc, glide = 'ɐ̃', 'w̃'   # -AM átono: "bateram"
        else: nuc = _NASAL.get(nuc, nuc)
        coda = 's' if resto.endswith('s') else ''
        resto = ''
    for ch in resto:
        if ch in 'sz':
            if not (nxt[:1] == 's'): coda += 's'        # OS-SO: o S dobrado soa uma vez só
        elif ch == 'r':
            if not (nxt[:1] == 'r'): coda += 'ɾ'        # CA-CHOR-RO: o RR soa uma vez só
        elif ch == 'l': coda += 'w'
        elif ch == 'x': coda += 'ks'
        else: return None
    # ---- consoante inicial (depende da vizinhança)
    antes_i = nuc in ('i', 'ĩ') and not pre
    ant_c = prev[-1:] if prev else ''
    if on == 'r':
        oi = 'ʁ' if (i == 0 or (ant_c and ant_c not in VOGAIS)) else 'ɾ'        # R fraco só entre vogais
    elif on == 's':
        oi = 'z' if (i > 0 and _termina_vogal(prev)) else 's'                    # S entre vogais = Z
    elif on in ('qu', 'gu'):
        oi = ('k' if on == 'qu' else 'g') + ('' if v in 'eéêií' else 'w')
    elif len(on) == 2 and on[1] in 'rl' and on not in ('lh', 'nh', 'ch'):
        oi = {'b': 'b', 'c': 'k', 'd': 'd', 'f': 'f', 'g': 'g', 'p': 'p', 't': 't', 'v': 'v'}[on[0]] + ('ɾ' if on[1] == 'r' else 'l')
    else:
        dur = v_escrita in 'eiéêí'
        oi = {'b': 'b', 'c': 's' if dur else 'k', 'ç': 's', 'd': 'dʒ' if antes_i else 'd', 'f': 'f', 'g': 'ʒ' if dur else 'g',
              'h': '', 'j': 'ʒ', 'k': 'k', 'l': 'l', 'm': 'm', 'n': 'n', 'p': 'p', 't': 'tʃ' if antes_i else 't', 'v': 'v',
              'w': 'w', 'x': 'ʃ', 'y': 'j', 'z': 'z', 'ch': 'ʃ', 'lh': 'ʎ', 'nh': 'ɲ', '': ''}[on]
    return ('ˈ' if tonica_ else '') + oi + pre + nuc + glide + coda

def ipa_palavra(palavra, silabas, tab=None):
    tab = tab or carregar_tabela(); P = palavra.upper()
    esp = tab['palavras'].get(P, {})
    if esp.get('ipa'): return list(esp['ipa'])
    t = esp.get('tonica', tonica(silabas))
    q = tab['vogal'].get(P)
    out = []
    for i in range(len(silabas)):
        x = ipa_silaba_na_palavra(silabas, i, t, q if i == t else None)
        if x is None: return None
        out.append(x)
    return out

LEITURA = {'tʃ': 'tch', 'dʒ': 'dj', 'ɐ̃': 'ã', 'w̃': 'u', 'j̃': 'i', 'ɾ': 'r', 'ʁ': 'rr', 'ʃ': 'ch', 'ʒ': 'j', 'ɲ': 'nh', 'ʎ': 'lh',
           'ɛ': 'é', 'ɔ': 'ó', 'e': 'ê', 'o': 'ô', 'ɐ': 'a', 'k': 'c', 'j': 'i', 'w': 'u', 'ˈ': ''}
_RX = re.compile('|'.join(sorted(map(re.escape, LEITURA), key=len, reverse=True)))
def leitura(ipa):
    """Grafia aproximada para revisão humana: ɾa → 'ra' (R fraco), ʁa → 'rra', zɐ → 'za'. Tônica em MAIÚSCULAS."""
    t = _RX.sub(lambda m: LEITURA[m.group(0)], unicodedata.normalize('NFC', ipa))
    return t.upper() if ipa.startswith('ˈ') else t

# ----------------------------------------------------------------------------- recorte da palavra silabada nas pausas
def dividir(x, taxa, n, pausa_min_ms=110):
    """Divide a fala "pê … ra" (sílabas separadas por pausas) em n pedaços, cortando no meio das n-1 maiores pausas.
    Devolve a lista de trechos ou None se não achar pausas suficientes."""
    import numpy as np
    if n == 1: return [x]
    hop = int(.01 * taxa)
    rms = np.array([np.sqrt(np.mean(x[i:i + hop] ** 2) + 1e-12) for i in range(0, len(x) - hop, hop)])
    lim = rms.max() * 10 ** (-38 / 20)
    som = rms > lim
    idx = np.where(som)[0]
    if len(idx) < 2: return None
    a0, a1 = idx[0], idx[-1]
    pausas = []; i = a0
    while i < a1:
        if not som[i]:
            j = i
            while j < a1 and not som[j]: j += 1
            if (j - i) * 10 >= pausa_min_ms: pausas.append((j - i, i, j))
            i = j
        else: i += 1
    if len(pausas) < n - 1: return None
    cortes = sorted((i + j) // 2 for _, i, j in sorted(pausas, reverse=True)[:n - 1])
    lim_amostra = [0] + [c * hop for c in cortes] + [len(x)]
    partes = [x[lim_amostra[k]:lim_amostra[k + 1]] for k in range(n)]
    for p in partes:
        r = np.array([np.sqrt(np.mean(p[i:i + hop] ** 2) + 1e-12) for i in range(0, max(1, len(p) - hop), hop)])
        if (r > lim).sum() * 10 < 50: return None   # pedaço sem som: corte errado
    return partes

def ssml_silabado(ipas, grafias, pausa_ms=450):
    """Corpo SSML para o Azure: cada sílaba com a pronúncia exata, separadas por pausa."""
    from xml.sax.saxutils import escape
    partes = []
    for k, (ipa, g) in enumerate(zip(ipas, grafias)):
        ipa = unicodedata.normalize('NFD', ipa).replace('ɡ', 'g')   # o Azure só aceita o til combinante e o 'g' comum
        if k: partes.append(f"<break time='{pausa_ms}ms'/>")
        partes.append(f"<phoneme alphabet='ipa' ph='{escape(ipa)}'>{escape(g.lower())}</phoneme>")
    return ''.join(partes)
