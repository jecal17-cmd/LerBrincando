"""Gera docs/pronuncia_silabada.md: como cada palavra será dita sílaba por sílaba (para revisão por alfabetizador/a).
Uso: python ferramentas/relatorio_silabado.py"""
import os, sys
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, RAIZ); sys.path.insert(0, os.path.join(RAIZ, 'ferramentas'))
sys.argv = sys.argv[:1]
import gerar_audios as G, silabado as S

def principal():
    D = G.ler_dados(); tab = S.carregar_tabela()
    itens = [it for it in G.lista_audios(D) if it['tipo'] == 'silabado']
    linhas = []; muda = 0
    for it in sorted(itens, key=lambda x: x['texto']):
        ipas = S.ipa_palavra(it['texto'], it['silabas'], tab) or []
        isol = [G.ipa_silaba(s) or '' for s in it['silabas']]
        dif = [k for k, (a, b) in enumerate(zip(ipas, isol)) if a.replace('ˈ', '') != b.replace('ˈ', '')]
        muda += bool(dif)
        leit = '-'.join(('**' + S.leitura(x) + '**') if k in dif else S.leitura(x) for k, x in enumerate(ipas))
        linhas.append(f"| {'-'.join(it['silabas'])} | {leit} | {' · '.join(ipas)} |")
    with open(os.path.join(RAIZ, 'docs', 'pronuncia_silabada.md'), 'w', encoding='utf-8') as f:
        f.write('# Pronúncia da palavra silabada\n\n'
                'Como o jogo diz cada palavra sílaba por sílaba (Junta-Junta, Bate-Palmas, Trem, Fábrica e leitura sílaba a sílaba).\n'
                'Cada sílaba soa como NAQUELA palavra: R fraco entre vogais (PE-ra), S com som de Z (CA-za), vogal final átona\n'
                '(GA-tu, LEI-tchi), E e O abertos ou fechados na sílaba forte (BÓ-la, BÔ-lo). A sílaba forte está em MAIÚSCULAS e,\n'
                'em **negrito**, as sílabas que soam diferente da sílaba isolada do jogo.\n\n'
                f'{len(itens)} palavras; {muda} têm pelo menos uma sílaba diferente da versão isolada.\n\n'
                '**Para corrigir:** em `ferramentas/pronuncia_palavras.json`, mude a vogal da tônica (`"vogal": {"BOLA": "ó"}`), a sílaba tônica\n'
                '(`"palavras": {"SUPER": {"tonica": 0}}`) ou a pronúncia inteira (`"palavras": {"TÁXI": {"ipa": ["ˈta", "ksi"]}}`).\n'
                'Depois rode o fluxo **Banco de Áudio (voz licenciada)** com o tipo `silabado`.\n\n'
                '| Palavra | Leitura aproximada | IPA |\n|---|---|---|\n' + '\n'.join(linhas) + '\n')
    print(f'{len(itens)} palavras ({muda} com diferença) → docs/pronuncia_silabada.md')

if __name__ == '__main__': principal()
