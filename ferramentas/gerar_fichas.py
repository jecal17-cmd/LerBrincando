# Gera docs/fichas_pedagogicas.html (fichas imprimíveis: pré/pós-teste equivalentes, retenção, observação, diário)
F = {
 'A': dict(nome='PRÉ-TESTE (Forma A) — Dia 0',
  inicial=['BOLA','FACA','MALA','SAPO','VACA','LUA','NAVIO','PATO','DEDO','GATO'],
  pares=[('faca','vaca'),('pote','pote'),('tia','dia'),('gola','cola'),('bico','pico'),('fila','fila'),('dado','dado'),('chato','jato'),('voto','foto'),('casa','caça')],
  contar=[('MAR',1),('CASA',2),('JANELA',3),('ABACAXI',4),('PIPOCA',3)],
  silabas='MA PE LI FO VU NA SE ZI JO XU PA BE TI DO CU GA LE MO FU VI'.split(),
  palavras='BOLA CASA PATO MALA SAPO DEDO LUVA GATO VELA FOCA'.split(), ditado='BOLO FADA MULA PIPA CAMA'.split()),
 'B': dict(nome='PÓS-TESTE (Forma B, equivalente) — Dia final',
  inicial=['BOTA','FOGO','MOTO','SINO','VASO','LOBO','NEVE','PIPA','DADO','GOTA'],
  pares=[('foto','voto'),('bote','bote'),('dia','tia'),('galo','calo'),('pico','bico'),('vila','vila'),('gato','gato'),('jato','chato'),('faca','vaca'),('roça','rosa')],
  contar=[('PÃO',1),('BOLO',2),('BONECA',3),('TARTARUGA',4),('MACACO',3)],
  silabas='FA VE MI NO LU SA ZE JI XO MU PO BI TA DU CO GO LA NE VO JU'.split(),
  palavras='BOTA COPO PIPA LUPA SUCO DADO NAVE FOGO MOLA VACA'.split(), ditado='BOTA FOCA LUVA PATO DEDO'.split()),
 'C': dict(nome='RETENÇÃO (Forma C, curta) — 7 dias após o pós-teste, sem jogar no intervalo',
  inicial=['MESA','FITA','LATA','SOFÁ','VELA'], pares=[('pato','bato'),('tela','tela'),('foca','voca'),('gota','cota'),('jogo','xogo')],
  contar=[('SOL',1),('PERA',2),('TOMATE',3)], silabas='ME FI LO SU VA PI BO TE DA GU'.split(),
  palavras='MOLE FILA TOCA BULE GOLA'.split(), ditado='MATO VIDA LOBO'.split())
}
def tabela(cab, linhas):
    h = '<table><tr>' + ''.join(f'<th>{c}</th>' for c in cab) + '</tr>'
    for l in linhas: h += '<tr>' + ''.join(f'<td>{c}</td>' for c in l) + '</tr>'
    return h + '</table>'
caixa = '☐'
partes = []
for k, f in F.items():
    som = {'BOLA':'/b/','FACA':'/f/','MALA':'/m/','SAPO':'/s/','VACA':'/v/','LUA':'/l/','NAVIO':'/n/','PATO':'/p/','DEDO':'/d/','GATO':'/g/','BOTA':'/b/','FOGO':'/f/','MOTO':'/m/','SINO':'/s/','VASO':'/v/','LOBO':'/l/','NEVE':'/n/','PIPA':'/p/','DADO':'/d/','GOTA':'/g/','MESA':'/m/','FITA':'/f/','LATA':'/l/','SOFÁ':'/s/','VELA':'/v/'}
    h = f'<section class="pg"><h2>{f["nome"]}</h2><p>Criança: ____________________ Idade: ____ Data: ___/___/_____ Aplicador: ____________________</p>'
    h += '<h3>1. Som inicial</h3><p class="i">O adulto fala a palavra (sem mostrar escrita): “Qual é o primeiro SOM de ...?” Aceite o som, não o nome da letra.</p>'
    h += tabela(['#','Palavra','Esperado','Resposta','Certo'], [[i+1, w, som.get(w,''), '', caixa] for i, w in enumerate(f['inicial'])])
    h += '<h3>2. Discriminação de pares mínimos</h3><p class="i">“Vou falar duas palavras. Elas são IGUAIS ou DIFERENTES?” Fale de costas ou cobrindo a boca.</p>'
    h += tabela(['#','Par falado','Esperado','Resposta','Certo'], [[i+1, f'{a} – {b}', 'igual' if a == b else 'diferente', '', caixa] for i, (a, b) in enumerate(f['pares'])])
    h += '<h3>3. Contagem de sílabas</h3><p class="i">“Bata uma palma para cada pedacinho da palavra.”</p>'
    h += tabela(['#','Palavra','Esperado','Palmas','Certo'], [[i+1, w, n, '', caixa] for i, (w, n) in enumerate(f['contar'])])
    h += '<h3>4. Leitura de sílabas CV</h3><p class="i">Mostre o cartão abaixo (recorte). Anote o tempo total e marque as lidas corretamente.</p>'
    h += '<div class="cartao">' + ' '.join(f'<span>{s}</span>' for s in f['silabas']) + '</div>'
    h += f'<p>Corretas: ____ / {len(f["silabas"])} &nbsp;&nbsp; Tempo total: ____ s &nbsp;&nbsp; Sílabas trocadas (anote): ________________________________</p>'
    h += '<h3>5. Leitura de palavras dissílabas</h3><div class="cartao">' + ' '.join(f'<span>{s}</span>' for s in f['palavras']) + '</div>'
    h += f'<p>Corretas: ____ / {len(f["palavras"])} &nbsp;&nbsp; Tempo total: ____ s &nbsp;&nbsp; Leu soletrando? ☐ sim ☐ não &nbsp;&nbsp; Adivinhou pela 1ª letra? ☐ sim ☐ não</p>'
    h += '<h3>6. Ditado</h3><p class="i">Fale cada palavra duas vezes, naturalmente. A criança escreve em letra bastão.</p>'
    h += tabela(['#','Palavra ditada','Escrita da criança','Certo'], [[i+1, w, '', caixa] for i, w in enumerate(f['ditado'])])
    h += '<p class="tot">TOTAL — Som inicial ___ · Pares ___ · Sílabas (palmas) ___ · Leitura CV ___ · Palavras ___ · Ditado ___</p></section>'
    partes.append(h)
obs = '<section class="pg"><h2>FICHA DE OBSERVAÇÃO DA SESSÃO (1 por sessão)</h2><p>Criança: ____________ Data: ___/___ Início: ___:___ Fim: ___:___ Mundo/fases jogadas: ____________</p>'
obs += tabela(['Pergunta','Registro'], [
 ['A criança entendeu a instrução sem ajuda?', '☐ sempre ☐ às vezes ☐ raramente — em quais minijogos? ______________'],
 ['Ficou frustrada? Em qual item?', '☐ não ☐ sim: ______________________________'],
 ['Escolheu respostas ao acaso (toques rápidos)?', '☐ não ☐ sim — em: ______________________'],
 ['Pediu para continuar?', '☐ sim ☐ não'],
 ['Quais sons confundiu?', '☐ P/B ☐ T/D ☐ F/V ☐ C/G ☐ S/Z ☐ X/J ☐ M/N ☐ outros: ________'],
 ['Humor percebido', '😀 ☐ &nbsp;&nbsp; 😐 ☐ &nbsp;&nbsp; 😟 ☐'],
 ['Pediu para jogar hoje (por iniciativa própria)?', '☐ sim ☐ não'],
 ['Dicas usadas (painel dos pais)', '______'],
 ['Observações livres', '<br><br>']])
obs += '</section>'
diario = '<section class="pg"><h2>DIÁRIO DE MONITORAMENTO (2 a 4 semanas)</h2><p class="i">Copie os números do painel “Área dos Pais → Progresso”.</p>'
diario += tabela(['Dia','Data','Min. jogados','Fases concluídas','Grafemas em 🟥','Par mais confundido','Tempo médio (s)','Pediu p/ jogar?','Humor'], [[d, '', '', '', '', '', '', '☐S ☐N', '😀😐😟'] for d in range(1, 29)])
diario += '</section>'
crit = '''<section class="pg"><h2>CRITÉRIOS DE SUCESSO E SINAIS DE ALERTA</h2>
<h3>Critérios de sucesso pedagógico</h3><ul>
<li>Ganho ≥ 30 pontos percentuais em discriminação de pares mínimos e em leitura de sílabas (pós − pré).</li>
<li>≥ 80% de acerto no ditado de palavras CV ao final do Mundo 5.</li>
<li>Retenção ≥ 90% do ganho após 7 dias sem jogar (Forma C).</li>
<li>Queda do tempo médio de resposta nas sílabas já dominadas (painel → “Tempo médio de resposta”).</li>
<li>Checkpoint: Desafio do Guardião de cada mundo com ≥ 85% de acerto.</li></ul>
<h3>Sinais de alerta → o que fazer</h3>'''
crit += tabela(['Sinal','Ação'], [
 ['Acerto < 60% em 3 sessões seguidas na mesma habilidade','Revisar o item e o áudio e voltar ao conteúdo anterior (Área dos Pais → liberar/rejogar fase anterior).'],
 ['Escolhas ao acaso frequentes','Reduzir opções (o jogo já reduz após 3 erros), pausar e mostrar a demonstração.'],
 ['Confusão persistente de um par mínimo','Reforçar com o fonema prolongado do Banco de Áudio, a versão lenta 🐢 e a dica articulatória diante do espelho. Se continuar, considerar avaliação fonoaudiológica.'],
 ['Perda de interesse','Verificar a duração das fases, variar as recompensas (lojinha, álbum) e alternar os tipos de minijogo.']])
crit += '''<h3>Cálculo do ganho</h3><p>Ganho (p.p.) = (% pós-teste) − (% pré-teste). Retenção = (% retenção − % pré) ÷ (% pós − % pré) × 100.</p>
<table><tr><th>Habilidade</th><th>Pré (A)</th><th>Pós (B)</th><th>Ganho p.p.</th><th>Retenção (C)</th><th>% retido</th></tr>
<tr><td>Som inicial</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Pares mínimos</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Contagem de sílabas</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Leitura de sílabas CV</td><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>Leitura de palavras</td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Ditado</td><td></td><td></td><td></td><td></td><td></td></tr></table></section>'''
html = '''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Ler Brincando — Fichas pedagógicas</title><style>
body{font-family:Andika,Arial,sans-serif;margin:0;color:#1f2a44}.pg{padding:18mm 14mm;page-break-after:always}h1{text-align:center}h2{border-bottom:3px solid #2f6fde;padding-bottom:4px}
h3{margin:14px 0 4px}.i{font-style:italic;color:#4a5675;margin:2px 0 6px}table{border-collapse:collapse;width:100%;font-size:12pt}th,td{border:1px solid #999;padding:4px 6px;text-align:left}
th{background:#eef3ff}.cartao{border:2px dashed #999;padding:10px;font-size:26pt;font-weight:700;letter-spacing:.06em;line-height:1.7;margin:6px 0}.cartao span{display:inline-block;min-width:3.2em}
.tot{font-weight:700;background:#fff7d6;padding:6px}@media print{.noprint{display:none}}</style></head><body>
<div class="pg noprint"><h1>Ler Brincando — Fichas pedagógicas para impressão</h1><p>Seção 13.2: pré-teste (Forma A), pós-teste com itens diferentes e equivalentes (Forma B), retenção após 7 dias (Forma C), ficha de observação por sessão, diário de monitoramento, critérios de sucesso e sinais de alerta. Use Ctrl+P / Imprimir. As formas A e B têm o mesmo número de itens, os mesmos padrões silábicos e os mesmos contrastes.</p></div>
''' + ''.join(partes) + obs + diario + crit + '</body></html>'
open('docs/fichas_pedagogicas.html', 'w', encoding='utf-8').write(html)
print('ok')
