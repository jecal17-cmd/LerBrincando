-- ============================================================================
-- Ler Brincando — consultas de métricas (cole no SQL Editor do Supabase)
-- Os dados vêm só de aparelhos cujo adulto autorizou as estatísticas anônimas.
-- ============================================================================

-- 1) Aparelhos ativos por dia (últimos 30 dias)
select date_trunc('day', em)::date as dia, count(distinct instalacao) as aparelhos
  from eventos where em > now() - interval '30 days'
 group by 1 order by 1;

-- 2) Retenção: dos aparelhos que apareceram pela 1ª vez em cada semana, quantos voltaram no D1, D7 e D30
with primeiro as (
  select instalacao, min(em)::date as d0 from eventos group by 1
), dias as (
  select distinct instalacao, em::date as d from eventos
)
select date_trunc('week', p.d0)::date as semana, count(*) as novos,
       round(100.0 * count(*) filter (where exists (select 1 from dias x where x.instalacao = p.instalacao and x.d = p.d0 + 1)) / count(*), 1) as d1_pct,
       round(100.0 * count(*) filter (where exists (select 1 from dias x where x.instalacao = p.instalacao and x.d between p.d0 + 6 and p.d0 + 8)) / count(*), 1) as d7_pct,
       round(100.0 * count(*) filter (where exists (select 1 from dias x where x.instalacao = p.instalacao and x.d between p.d0 + 28 and p.d0 + 32)) / count(*), 1) as d30_pct
  from primeiro p group by 1 order by 1 desc;

-- 3) Funil da versão completa (últimos 90 dias)
with base as (select * from eventos where em > now() - interval '90 days')
select
  (select count(distinct instalacao) from base) as aparelhos,
  (select count(distinct instalacao) from base where nome = 'fase_fim' and (dados->>'mundo')::int = 2) as chegaram_mundo2,
  (select count(distinct instalacao) from base where nome = 'paywall_visto') as viram_paywall,
  (select count(distinct instalacao) from base where nome = 'compra_inicio') as iniciaram_compra,
  (select count(distinct instalacao) from base where nome = 'compra_ok') as compraram;

-- 4) Compras por produto e por semana
select date_trunc('week', em)::date as semana, dados->>'produto' as produto, count(*) as compras
  from eventos where nome = 'compra_ok' group by 1, 2 order by 1 desc, 2;

-- 5) Fases mais difíceis (precisão média baixa) e onde as crianças param
select dados->>'fase' as fase, count(*) as jogadas, round(avg((dados->>'prec')::numeric), 2) as precisao_media,
       round(100.0 * avg(case when (dados->>'dominada')::boolean then 1 else 0 end), 1) as pct_dominada
  from eventos where nome = 'fase_fim' and em > now() - interval '90 days'
 group by 1 having count(*) >= 10 order by precisao_media asc limit 20;

-- 6) Última fase concluída por aparelho (onde o funil "vaza")
select ultima_fase, count(*) as aparelhos from (
  select distinct on (instalacao) instalacao, dados->>'fase' as ultima_fase
    from eventos where nome = 'fase_fim' order by instalacao, em desc
) t group by 1 order by 2 desc limit 30;

-- 7) Fluência: média de PCPM por mês
select date_trunc('month', em)::date as mes, count(*) as testes, round(avg((dados->>'pcpm')::numeric), 1) as pcpm_medio,
       round(avg((dados->>'precisao')::numeric), 1) as precisao_media
  from eventos where nome = 'fluencia_feita' group by 1 order by 1 desc;

-- 8) Escolas: turmas, alunos ativos (enviaram progresso nos últimos 14 dias) e licença
select t.escola, t.nome as turma, t.codigo, t.licenca_ate, count(a.id) as alunos,
       count(a.id) filter (where a.atualizado_em > now() - interval '14 days') as ativos_14d
  from turmas t left join alunos a on a.turma_id = t.id
 group by t.id order by t.escola nulls last, t.nome;

-- 9) Dar ou renovar a licença de uma escola (troque o código e a data)
-- update turmas set licenca_ate = '2027-12-31' where codigo in ('ABC234', 'XYZ789');
-- ou todas as turmas de um professor:
-- update turmas set licenca_ate = '2027-12-31' where professor_id = (select id from auth.users where email = 'professora@escola.com');
