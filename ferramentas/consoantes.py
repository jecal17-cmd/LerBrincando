"""Som das consoantes contínuas (F V M N L S Z J X NH LH) para o Banco de Áudio.

Pedir ao sintetizador uma consoante solta ("fː", "ʒː") gera chiado sem sentido (o J saía como ruído branco, sem voz).
Aqui a consoante é RECORTADA de uma fala natural (a voz diz "aˈʒːa" ou a sílaba "já") e depois SUSTENTADA:
- fricativas surdas (F S X): grãos de 40 ms tirados ao acaso do miolo e sobrepostos → chiado contínuo e natural;
- vozeadas (M N L NH LH V Z J): grãos de 2 períodos alinhados ao período da voz (PSOLA simples) → som estável, sem o
  timbre metálico do esticamento por vocoder.
O resultado passa por uma conferência automática (voz/sem voz e faixa de frequência esperadas para cada som).
v1.4.3 — soantes (M N NH L LH): o murmúrio nasal é periódico e forte, por isso era confundido com vogal e o recorte
pegava a transição (o M saía como ruído). Agora o trecho escolhido é o de energia concentrada no grave (abaixo de
500 Hz), sustentado pela repetição de um único grão de 2 períodos (zumbido limpo, sem aspereza), e a conferência
exige essa concentração no grave.
Só usa numpy e scipy."""
import numpy as np
from scipy.signal import butter, sosfilt

SURDAS = {'F', 'S', 'X'}
VOZEADAS = {'V', 'Z', 'J', 'M', 'N', 'L', 'NH', 'LH'}
SOANTES = {'M', 'N', 'NH', 'L', 'LH'}
# fração mínima de energia abaixo de 500 Hz (murmúrio nasal ~0,8; vogal /a/ ~0,3–0,5)
GRAVE_MIN = {'M': .65, 'N': .65, 'NH': .55, 'L': .50, 'LH': .45}
# conferência: (vozeado mínimo, vozeado máximo, alta frequência mínima, alta frequência máxima)
ESPERADO = {'F': (0, .25, .30, 1), 'S': (0, .25, .80, 1), 'X': (0, .25, .60, 1),
            'V': (.45, 1, 0, .60), 'Z': (.45, 1, .25, 1), 'J': (.45, 1, .20, 1),
            'M': (.70, 1, 0, .10), 'N': (.70, 1, 0, .10), 'L': (.70, 1, 0, .15), 'NH': (.70, 1, 0, .15), 'LH': (.70, 1, 0, .15)}
# IPA para o Azure: consoante entre duas vogais, alongada (entre vogais a voz mantém o vozeamento do Z, J e V)
IPA_VCV = {'F': 'aˈfːa', 'V': 'aˈvːa', 'M': 'aˈmːa', 'N': 'aˈnːa', 'L': 'aˈlːa', 'S': 'aˈsːa', 'Z': 'aˈzːa',
           'J': 'aˈʒːa', 'X': 'aˈʃːa', 'NH': 'aˈɲːa', 'LH': 'aˈʎːa'}

def _quadros(x, fr, hop):
    return [x[i:i + fr] for i in range(0, max(1, len(x) - fr), hop)]

def _periodo(q, taxa):
    q = q - q.mean(); n = len(q)
    if n < 8 or not np.any(q): return 0.0, 0
    ac = np.correlate(q, q, 'full')[n - 1:]; ac = ac / (ac[0] + 1e-12)
    lo, hi = int(taxa / 400), min(n - 1, int(taxa / 70))
    if hi <= lo: return 0.0, 0
    i = int(np.argmax(ac[lo:hi])) + lo
    return float(ac[i]), i

def _alta_freq(q, taxa):
    s = np.abs(np.fft.rfft(q * np.hanning(len(q)))) ** 2; f = np.fft.rfftfreq(len(q), 1 / taxa)
    return float(s[f > 3000].sum() / (s.sum() + 1e-12))

def _grave(q, taxa):
    s = np.abs(np.fft.rfft(q * np.hanning(len(q)))) ** 2; f = np.fft.rfftfreq(len(q), 1 / taxa)
    return float(s[f < 500].sum() / (s.sum() + 1e-12))

def recortar_soante(x, taxa, g):
    """Murmúrio do M/N/NH/L/LH: maior bloco periódico com energia concentrada no grave (acima do limiar do som)."""
    rn, per, h, hop = curvas(x, taxa); fr = int(.02 * taxa)
    gr = np.array([_grave(x[i * hop:i * hop + fr], taxa) if len(x[i * hop:i * hop + fr]) == fr else 0 for i in range(len(rn))])
    cand = (rn > 0.04) & (per > 0.5) & (gr >= GRAVE_MIN[g])
    melhor = (0, 0, 0); i = 0
    while i < len(cand):
        if cand[i]:
            j = i
            while j < len(cand) and cand[j]: j += 1
            if j - i > melhor[0]: melhor = (j - i, i, j)
            i = j
        else: i += 1
    n, a, b = melhor
    if n < 6: return None   # menos de ~45 ms
    return x[a * hop + int(.01 * taxa): b * hop + int(.01 * taxa)]

def sustentar_periodico(seg, taxa, alvo):
    """Repete um grão de 2 períodos do centro do murmúrio (sobreposição a cada período): zumbido estável e limpo."""
    meio = seg[int(len(seg) * .25):int(len(seg) * .75)]
    if len(meio) < int(.02 * taxa): meio = seg
    lp = butter(6, 900, 'low', fs=taxa, output='sos')
    _, T = _periodo(sosfilt(lp, meio)[:int(.05 * taxa)], taxa)
    if T <= 0 or len(meio) < 2 * T + 2: return None
    c = len(meio) // 2; grao = meio[c - T:c + T] * np.hanning(2 * T)
    out = np.zeros(alvo + 2 * T)
    for p in range(0, alvo, T): out[p:p + 2 * T] += grao
    return out[:alvo]

def curvas(x, taxa):
    """Energia (0–1), periodicidade abaixo de 900 Hz e fração de energia acima de 3 kHz, em quadros de 20 ms."""
    lp = butter(6, 900, 'low', fs=taxa, output='sos'); fr, hop = int(.02 * taxa), int(.005 * taxa)
    Q = _quadros(x, fr, hop); QL = _quadros(sosfilt(lp, x), fr, hop)
    rms = np.array([np.sqrt(np.mean(q ** 2)) for q in Q]); rn = rms / (rms.max() + 1e-12)
    per = np.array([_periodo(q, taxa)[0] if np.sqrt(np.mean(q ** 2)) > 1e-4 else 0.0 for q in QL])
    h = np.array([_alta_freq(q, taxa) for q in Q])
    return rn, per, h, hop

def _vogal(rn, per, h):
    sc = np.convolve(np.clip(per, 0, 1) * rn * (1 - h), np.ones(3) / 3, 'same')
    return sc > 0.45 * (sc.max() + 1e-12)

def recortar(x, taxa, g=None):
    """Trecho da consoante. Chiantes (F S X Z J): o maior bloco com chiado (energia acima de 3 kHz);
    demais: o maior bloco com som que não é vogal (vogal = periódica, forte e sem chiado)."""
    rn, per, h, hop = curvas(x, taxa)
    ativo = rn > 0.01
    if g in ('F', 'S', 'X', 'Z', 'J'):
        cons = ativo & (h > (0.25 if g == 'F' else 0.35))
    else:
        cons = (rn > 0.03) & ~_vogal(rn, per, h)
    melhor = (0, 0, 0); i = 0
    while i < len(cons):
        if cons[i]:
            j = i
            while j < len(cons) and cons[j]: j += 1
            if j - i > melhor[0]: melhor = (j - i, i, j)
            i = j
        else: i += 1
    n, a, b = melhor
    if n < 4: return None
    return x[a * hop + int(.01 * taxa): b * hop + int(.01 * taxa)]

def _sustentar_ruido(miolo, taxa, alvo, semente=7):
    rng = np.random.default_rng(semente); g = int(.04 * taxa); hop = g // 2; w = np.hanning(g)
    if len(miolo) < g + 2: miolo = np.tile(miolo, g // max(1, len(miolo)) + 2)
    out = np.zeros(alvo + g)
    for p in range(0, alvo, hop):
        i = int(rng.integers(0, len(miolo) - g)); out[p:p + g] += miolo[i:i + g] * w
    return out[:alvo]

def _sustentar_voz(miolo, taxa, alvo, semente=7):
    rng = np.random.default_rng(semente)
    lp = butter(6, 900, 'low', fs=taxa, output='sos'); ml = sosfilt(lp, miolo)
    trecho = ml[:int(.05 * taxa)] if len(ml) > int(.05 * taxa) else ml
    _, T = _periodo(trecho, taxa)
    if T <= 0: T = int(taxa / 200)
    g = 2 * T; w = np.hanning(g)
    if len(miolo) < g + 2: miolo = np.tile(miolo, g // max(1, len(miolo)) + 2)
    marcas = list(range(0, len(miolo) - g, T)) or [0]
    out = np.zeros(alvo + g)
    for p in range(0, alvo, T):
        i = marcas[int(rng.integers(0, len(marcas)))]; out[p:p + g] += miolo[i:i + g] * w
    return out[:alvo]

def sustentar(seg, g, taxa, alvo_ms=650):
    """Prolonga a consoante recortada até alvo_ms, com entrada suave e saída mais longa."""
    n = len(seg); miolo = seg[int(n * .2):int(n * .85)] if n > int(.06 * taxa) else seg
    alvo = int(alvo_ms * taxa / 1000)
    y = sustentar_periodico(seg, taxa, alvo) if g in SOANTES else None
    if y is None: y = _sustentar_voz(miolo, taxa, alvo) if g in VOZEADAS else _sustentar_ruido(miolo, taxa, alvo)
    a = int(.05 * taxa); b = int(.14 * taxa)
    y[:a] *= np.linspace(0, 1, a) ** 1.5; y[-b:] *= np.linspace(1, 0, b) ** 1.5
    return (y / (np.abs(y).max() + 1e-12) * 0.9).astype('float32')

def medir(y, taxa):
    """(fração vozeada, fração de energia acima de 3 kHz)."""
    rn, per, h, _ = curvas(y, taxa)
    at = rn > 0.2
    return (float(np.mean(per[at] > 0.5)) if at.any() else 0.0, float(np.median(h[at])) if at.any() else 0.0)

def grave(y, taxa):
    """Fração de energia abaixo de 500 Hz no trecho forte do som."""
    m = y[int(len(y) * .2):int(len(y) * .8)]
    return _grave(m, taxa) if len(m) > 64 else 0.0

def confere(y, g, taxa):
    vz, hf = medir(y, taxa); a, b, c, d = ESPERADO[g]
    ok = a <= vz <= b and c <= hf <= d
    if g in SOANTES: ok = ok and grave(y, taxa) >= GRAVE_MIN[g]
    return ok, vz, hf

def zumbido(x, taxa, alvo):
    """Voz grave (abaixo de 450 Hz) tirada da vogal da própria fala: é o "zumbido" que diferencia Z de S, J de X e V de F."""
    rn, per, h, hop = curvas(x, taxa)
    vog = _vogal(rn, per, h); idx = np.where(vog)[0]
    if len(idx) < 4: return None
    v = x[idx[0] * hop: idx[-1] * hop + int(.02 * taxa)]
    v = sosfilt(butter(4, 450, 'low', fs=taxa, output='sos'), v)
    meio = v[int(len(v) * .35):int(len(v) * .65)]
    _, T = _periodo(meio[:int(.05 * taxa)], taxa)
    if T <= 0 or len(meio) < 2 * T: return None
    # um único grão de 2 períodos repetido a cada período: voz grave estável e perfeitamente periódica
    grao = meio[len(meio) // 2 - T: len(meio) // 2 + T] * np.hanning(2 * T)
    out = np.zeros(alvo + 2 * T)
    for p in range(0, alvo, T): out[p:p + 2 * T] += grao
    return out[:alvo]

def fonema(x, g, taxa, alvo_ms=650):
    """Da fala natural x → som sustentado da consoante g. Devolve (som, ok, vozeado, alta_freq) ou None.
    V, Z e J sintéticos costumam sair quase sem voz (o Z soa como S): nesse caso a voz grave da vogal vizinha é somada."""
    seg = recortar_soante(x, taxa, g) if g in SOANTES else recortar(x, taxa, g)
    if seg is None or len(seg) < int(.035 * taxa): return None
    y = sustentar(seg, g, taxa, alvo_ms)
    ok, vz, hf = confere(y, g, taxa)
    if not ok and g in ('V', 'Z', 'J') and vz < ESPERADO[g][0]:
        z = zumbido(x, taxa, len(y))
        if z is not None:
            a = int(.05 * taxa); b = int(.14 * taxa)
            z[:a] *= np.linspace(0, 1, a) ** 1.5; z[-b:] *= np.linspace(1, 0, b) ** 1.5
            atrito = sosfilt(butter(4, 1500, 'high', fs=taxa, output='sos'), y) if g != 'V' else y
            m = atrito / (np.abs(atrito).max() + 1e-12) + 0.8 * z / (np.abs(z).max() + 1e-12)
            y2 = (m / (np.abs(m).max() + 1e-12) * 0.9).astype('float32')
            ok2, vz2, hf2 = confere(y2, g, taxa)
            if ok2 or vz2 > vz: y, ok, vz, hf = y2, ok2, vz2, hf2
    return y, ok, vz, hf
