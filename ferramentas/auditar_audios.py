#!/usr/bin/env python3
"""Auditoria do Banco de Áudio (audio/): ouve cada arquivo e aponta o que merece correção.

Confere em TODOS os sons do manifest:
  - arquivo ausente ou que não decodifica;
  - silêncio ou volume muito baixo (pico < -30 dBFS);
  - distorção (amostras saturadas);
  - som "comido" no início ou no fim (começa/termina já com volume alto, sem margem);
  - duração real muito diferente da registrada no manifest (karaokê fora de sincronia);
  - sílabas e fonemas com mais de um "núcleo" de som (sinal de soletração: "v, e");
  - duração fora do esperado para o tipo (sílaba, palavra, fonema...);
  - itens marcados como "legado" ou "suspeito".

Só precisa de numpy e do ffmpeg (não usa a internet).
Uso:  python ferramentas/auditar_audios.py [pasta_audio]
Gera: audio/auditoria.json (completo) e audio/revisar.txt (lista para escutar e regerar).
"""
import json, os, subprocess, sys
from concurrent.futures import ThreadPoolExecutor

import numpy as np

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, RAIZ)
from gerar_audios import nucleos  # mesma detecção de soletração usada na geração

TAXA = 24000
LIM_MS = {'silaba': (120, 1800), 'palavra': (180, 3500), 'fonema': (300, 1600), 'nome': (150, 1500)}


def decodificar(caminho):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', caminho, '-f', 'f32le', '-ac', '1', '-ar', str(TAXA), '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(out, dtype='<f4')


def db(v):
    return float(20 * np.log10(max(v, 1e-9)))


def analisar(pasta, chave, item):
    tipo = chave.split('_')[0]
    lento = chave.endswith('_lento')
    prob = []
    caminho = os.path.join(pasta, item['arquivo'])
    if not os.path.exists(caminho):
        return chave, {'problemas': ['arquivo ausente']}
    try:
        x = decodificar(caminho)
    except subprocess.CalledProcessError:
        return chave, {'problemas': ['arquivo não decodifica']}
    ms = int(len(x) / TAXA * 1000)
    pico = db(float(np.abs(x).max()) if len(x) else 0)
    info = {'ms_real': ms, 'pico': round(pico, 1)}
    if pico < -30:
        prob.append(f'volume muito baixo/silencioso (pico {pico:.0f} dBFS)')
    sat = int(np.sum(np.abs(x) > 0.999))
    if sat > 20:
        prob.append(f'distorção ({sat} amostras saturadas)')
    # margens: os primeiros e últimos 15 ms devem estar quase em silêncio
    borda = int(TAXA * 0.015)
    if len(x) > 4 * borda and pico > -30:
        ref = float(np.abs(x).max())
        ini = float(np.sqrt(np.mean(x[:borda] ** 2))) / ref
        fim = float(np.sqrt(np.mean(x[-borda:] ** 2))) / ref
        if ini > 0.08:
            prob.append('começa cortado (sem silêncio no início)')
        if fim > 0.08:
            prob.append('termina cortado (sem silêncio no fim)')
    if abs(ms - item.get('ms', ms)) > 250:
        prob.append(f"duração no manifest ({item.get('ms')} ms) diferente da real ({ms} ms)")
    lim = LIM_MS.get(tipo)
    if lim and not (lim[0] <= ms <= lim[1] * (1.6 if lento else 1) + 400):
        prob.append(f'duração fora do esperado para {tipo} ({ms} ms)')
    if tipo in ('silaba',) or (tipo == 'fonema' and item.get('origem', '').startswith('edge') and 'apoio' not in item):
        # corta o silêncio das bordas antes de contar os núcleos
        env = np.abs(x)
        vivo = np.where(env > 0.05 * (env.max() or 1))[0]
        trecho = x[vivo[0]:vivo[-1] + 1] if len(vivo) else x
        n = nucleos(trecho, TAXA)
        info['nucleos'] = n
        if n >= 2:
            prob.append(f'possível soletração ({n} sons separados)')
    if item.get('suspeito'):
        prob.append('marcado como suspeito na geração')
    if item.get('legado'):
        info['legado'] = True
    info['problemas'] = prob
    return chave, info


def main():
    pasta = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, 'audio'))
    man = json.load(open(os.path.join(pasta, 'manifest.json'), encoding='utf-8'))
    itens = man['itens']
    with ThreadPoolExecutor(max_workers=os.cpu_count() or 4) as ex:
        res = dict(ex.map(lambda kv: analisar(pasta, *kv), itens.items()))
    com = {k: v for k, v in res.items() if v['problemas']}
    legado = sorted(k for k, v in res.items() if v.get('legado'))
    resumo = {}
    for v in com.values():
        for p in v['problemas']:
            chave = p.split(' (')[0]
            resumo[chave] = resumo.get(chave, 0) + 1
    json.dump({'total': len(itens), 'com_problema': len(com), 'resumo': resumo, 'legado': len(legado), 'itens': res},
              open(os.path.join(pasta, 'auditoria.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    with open(os.path.join(pasta, 'revisar.txt'), 'w', encoding='utf-8') as f:
        f.write('Auditoria automática do Banco de Áudio (ferramentas/auditar_audios.py).\n'
                'Escute estes sons em Área dos Pais → Banco de Áudio. Para corrigir uma pronúncia, escreva a grafia\n'
                'desejada em ferramentas/pronuncias.json (ex.: "silaba_ve": "vê") e rode: python gerar_audios.py --tipos silaba,fonema\n\n')
        f.write(f'Total: {len(itens)} sons · com algum alerta: {len(com)} · legado (v1.1, serão refeitos): {len(legado)}\n\n')
        for k in sorted(com):
            f.write(f"{k}: {'; '.join(com[k]['problemas'])}\n")
    print(f'Sons conferidos: {len(itens)} · com alerta: {len(com)} · legado: {len(legado)}')
    for p, n in sorted(resumo.items(), key=lambda x: -x[1]):
        print(f'  {n:5d}  {p}')


if __name__ == '__main__':
    main()
