"""Gera várias versões do SOM de cada consoante contínua para escolha por escuta (pasta candidatos/).

Por que: voz sintética não sabe dizer uma consoante sozinha; recortar e esticar a consoante gera ruído.
Aqui cada letra ganha versões feitas de formas diferentes, e o responsável escolhe pelo ouvido:
  a_silaba_longa   Francisca diz a sílaba com a consoante bem comprida ("mmmmá"), fala natural, sem processamento
  b_so_consoante   a mesma fala, cortada logo antes da vogal (só "mmmm"), com saída suave; nada é repetido nem esticado
  c_texto          Francisca lê o texto alongado ("mmmmmm", "ssssss")
  d_humano         gravação humana do som do Alfabeto Fonético Internacional (Wikimedia Commons, licença no índice)
  e_atual          o som que o jogo usa hoje

Uso (precisa de AZURE_SPEECH_KEY): python ferramentas/candidatos_fonemas.py"""
import json, os, shutil, sys
import numpy as np
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, RAIZ); sys.path.insert(0, os.path.join(RAIZ, 'ferramentas'))
import gerar_audios as G
import consoantes as C

IPA = {'F': 'f', 'V': 'v', 'M': 'm', 'N': 'n', 'L': 'l', 'S': 's', 'Z': 'z', 'J': 'ʒ', 'X': 'ʃ', 'NH': 'ɲ', 'LH': 'ʎ'}
SAIDA = os.path.join(RAIZ, 'candidatos')
shutil.rmtree(SAIDA, ignore_errors=True); os.makedirs(SAIDA)
G.PASTA = SAIDA
motor = G.MotorAzure('pt-BR-FranciscaNeural')
indice = {'voz': motor.voz, 'letras': {}}

def salva(nome, x, taxa):
    x = G.normalizar(G.acabamento(np.asarray(x, 'float32'), taxa), taxa)
    return G.salvar(x, taxa, nome)

def so_consoante(x, taxa, g):
    """Do começo da fala até o início da vogal (primeiro quadro periódico, forte e sem chiado, depois da consoante)."""
    x = G.aparar_rel(x, taxa)
    rn, per, h, hop = C.curvas(x, taxa)
    vog = C._vogal(rn, per, h)
    if g in C.SOANTES:
        # nasal/lateral: a vogal começa quando a energia acima de 500 Hz sobe
        fr = int(.02 * taxa)
        gr = np.array([C._grave(x[i * hop:i * hop + fr], taxa) if len(x[i * hop:i * hop + fr]) == fr else 0 for i in range(len(rn))])
        ativo = np.where(rn > 0.04)[0]
        if not len(ativo): return None
        ini = ativo[0]; fim = next((i for i in range(ini + 8, len(gr)) if gr[i] < C.GRAVE_MIN[g] - .1 and rn[i] > .1), None)
    else:
        ativo = np.where(rn > 0.02)[0]
        if not len(ativo): return None
        ini = ativo[0]; fim = next((i for i in range(ini + 6, len(vog)) if vog[i]), None)
    if fim is None or fim - ini < 8: return None
    y = x[:fim * hop].copy()
    b = min(len(y) // 3, int(.08 * taxa)); y[-b:] *= np.linspace(1, 0, b) ** 1.5
    return y

for g, ipa in IPA.items():
    k = g.lower(); L = indice['letras'][g] = []
    pedidos = [('a', f"ipa:ˈ{ipa}ːːa|{G.pronunciavel(G.CONTINUAS[g])}", '-40%'),
               ('a2', f"ipa:ˈ{ipa}ːa|{G.pronunciavel(G.CONTINUAS[g])}", '-55%'),
               ('c', G.ALONGADO[g], '-20%')]
    r = motor.sintetizar(pedidos)
    if 'a' in r and float(np.abs(r['a'][0]).max()) < .15 and 'a2' in r: r['a'] = r['a2']   # "ːː" recusado: usa "ː" bem devagar
    if 'a' in r:
        x, t, _ = r['a']; L.append({'tipo': 'a_silaba_longa', 'arquivo': salva(f'{k}_a_silaba_longa', G.aparar_rel(x, t), t)})
        y = so_consoante(x, t, g)
        if y is not None and len(y) > .12 * t:
            L.append({'tipo': 'b_so_consoante', 'arquivo': salva(f'{k}_b_so_consoante', y, t)})
    if 'c' in r and float(np.abs(r['c'][0]).max()) >= .15:
        x, t, _ = r['c']; L.append({'tipo': 'c_texto', 'arquivo': salva(f'{k}_c_texto', G.aparar_rel(x, t), t)})
    try:
        info = G.wikimedia(g)
        if info:
            xw, tw = G.carregar_audio_url(info['url'])
            L.append({'tipo': 'd_humano', 'arquivo': salva(f'{k}_d_humano', xw, tw),
                      'credito': f"{info['arquivo']} — {info['autor']} — {info['licenca']}", 'url': info['pagina']})
    except Exception as e:
        print('  wikimedia falhou', g, e)
    atual = os.path.join(RAIZ, 'audio', f'fonema_{k}.mp3')
    if os.path.exists(atual):
        shutil.copy(atual, os.path.join(SAIDA, f'{k}_e_atual.mp3')); L.append({'tipo': 'e_atual', 'arquivo': f'{k}_e_atual.mp3'})
    print(g, [c['tipo'] for c in L])

json.dump(indice, open(os.path.join(SAIDA, 'indice.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
