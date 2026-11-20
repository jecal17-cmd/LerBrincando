-- ============================================================================
-- Ler Brincando — banco na nuvem (Supabase / PostgreSQL)
-- Cole tudo no SQL Editor do Supabase e clique em Run. Pode rodar de novo: é idempotente.
-- Guia passo a passo: docs/NUVEM.md
--
-- Segurança (LGPD, dados de crianças):
-- * O app usa só a chave pública "anon" e NÃO lê nem grava tabelas diretamente: tudo passa
--   pelas funções abaixo (security definer), que validam código de turma e token do aluno.
-- * O professor (login por e-mail) só enxerga as próprias turmas e alunos (Row Level Security).
-- * A licença da escola (licenca_ate) só é alterada por você, no painel do Supabase.
-- * Guardamos o mínimo: apelido digitado no perfil + resumo numérico do progresso. Sem voz, foto,
--   localização, e-mail ou telefone de criança. Sair da turma apaga o aluno.
-- ============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- tabelas
create table if not exists public.turmas (
  id uuid primary key default gen_random_uuid(),
  professor_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome text not null check (char_length(nome) between 1 and 60),
  escola text check (char_length(escola) <= 80),
  codigo text not null unique,
  licenca_ate date,                       -- preenchido por você ao vender a licença da escola
  max_alunos int not null default 45,
  criada_em timestamptz not null default now()
);

create table if not exists public.alunos (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid not null references public.turmas (id) on delete cascade,
  apelido text not null check (char_length(apelido) between 1 and 20),
  token uuid not null default gen_random_uuid(),
  resumo jsonb not null default '{}'::jsonb,
  atualizado_em timestamptz,
  criado_em timestamptz not null default now()
);
create index if not exists alunos_turma_idx on public.alunos (turma_id);

create table if not exists public.eventos (
  id bigint generated always as identity primary key,
  instalacao uuid not null,
  nome text not null,
  dados jsonb not null default '{}'::jsonb,
  plataforma text,
  versao text,
  premium boolean,
  em timestamptz not null,
  recebido_em timestamptz not null default now()
);
create index if not exists eventos_nome_em_idx on public.eventos (nome, em);
create index if not exists eventos_instalacao_idx on public.eventos (instalacao, em);

-- ---------------------------------------------------------------- código da turma (6 caracteres fáceis de ditar)
create or replace function public.novo_codigo_turma() returns text
language plpgsql security definer set search_path = public as $$
declare
  letras constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';  -- sem I, L, O, 0, 1 (confundem)
  c text;
begin
  loop
    c := '';
    for i in 1..6 loop
      c := c || substr(letras, 1 + floor(random() * length(letras))::int, 1);
    end loop;
    exit when not exists (select 1 from public.turmas where codigo = c);
  end loop;
  return c;
end $$;

create or replace function public.turmas_antes_inserir() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.codigo := public.novo_codigo_turma();
  new.professor_id := auth.uid();
  new.licenca_ate := null;               -- licença nunca vem do professor
  new.max_alunos := 45;
  return new;
end $$;
drop trigger if exists turmas_antes_inserir on public.turmas;
create trigger turmas_antes_inserir before insert on public.turmas
  for each row execute function public.turmas_antes_inserir();

-- ---------------------------------------------------------------- permissões e RLS
alter table public.turmas enable row level security;
alter table public.alunos enable row level security;
alter table public.eventos enable row level security;

revoke all on public.turmas, public.alunos, public.eventos from anon, authenticated;
grant select, delete on public.turmas to authenticated;
grant insert (nome, escola) on public.turmas to authenticated;
grant update (nome, escola) on public.turmas to authenticated;
-- o professor nunca recebe o token secreto do aluno: SELECT só nas colunas abaixo
grant select (id, turma_id, apelido, resumo, atualizado_em, criado_em) on public.alunos to authenticated;
grant delete on public.alunos to authenticated;
grant update (apelido) on public.alunos to authenticated;

drop policy if exists turmas_do_professor on public.turmas;
create policy turmas_do_professor on public.turmas for all to authenticated
  using (professor_id = auth.uid()) with check (professor_id = auth.uid());

drop policy if exists alunos_do_professor on public.alunos;
create policy alunos_do_professor on public.alunos for all to authenticated
  using (exists (select 1 from public.turmas t where t.id = turma_id and t.professor_id = auth.uid()))
  with check (exists (select 1 from public.turmas t where t.id = turma_id and t.professor_id = auth.uid()));
-- eventos: nenhuma política = ninguém lê pela API; só você, no painel do Supabase.

-- ---------------------------------------------------------------- funções chamadas pelo app (chave anon)
-- Entrar na turma: devolve o id e o token secreto do aluno (guardados só no aparelho)
create or replace function public.entrar_turma(p_codigo text, p_apelido text)
returns table (aluno_id uuid, token uuid, turma_nome text, escola text, licenca_ate date)
language plpgsql security definer set search_path = public as $$
#variable_conflict use_column
declare
  t public.turmas%rowtype;
  a public.alunos%rowtype;
begin
  select * into t from public.turmas where codigo = upper(regexp_replace(coalesce(p_codigo, ''), '[^A-Za-z0-9]', '', 'g'));
  if not found then raise exception 'Código de turma não encontrado.' using errcode = '22023'; end if;
  if (select count(*) from public.alunos where turma_id = t.id) >= t.max_alunos then
    raise exception 'A turma já está cheia. Fale com o professor.' using errcode = '22023';
  end if;
  insert into public.alunos (turma_id, apelido)
    values (t.id, left(coalesce(nullif(trim(p_apelido), ''), 'Aluno'), 20))
    returning * into a;
  return query select a.id, a.token, t.nome, t.escola, t.licenca_ate;
end $$;

-- Enviar o resumo do progresso (o token prova que o aparelho é o do aluno)
create or replace function public.enviar_progresso(p_aluno uuid, p_token uuid, p_apelido text, p_resumo jsonb)
returns table (licenca_ate date, turma_nome text)
language plpgsql security definer set search_path = public as $$
#variable_conflict use_column
begin
  if octet_length(coalesce(p_resumo, '{}'::jsonb)::text) > 20000 then
    raise exception 'Resumo grande demais.' using errcode = '22023';
  end if;
  update public.alunos al set resumo = coalesce(p_resumo, '{}'::jsonb), atualizado_em = now(),
         apelido = left(coalesce(nullif(trim(p_apelido), ''), al.apelido), 20)
   where al.id = p_aluno and al.token = p_token;
  if not found then raise exception 'Aluno não encontrado (removido pelo professor).' using errcode = '22023'; end if;
  return query select t.licenca_ate, t.nome from public.turmas t join public.alunos al on al.turma_id = t.id where al.id = p_aluno;
end $$;

-- Sair da turma: apaga o aluno e o resumo (direito de exclusão da LGPD)
create or replace function public.sair_turma(p_aluno uuid, p_token uuid)
returns void language sql security definer set search_path = public as $$
  delete from public.alunos where id = p_aluno and token = p_token;
$$;

-- Estatísticas anônimas: até 50 eventos por chamada, só nomes conhecidos
create or replace function public.registrar_eventos(p_instalacao uuid, p_plataforma text, p_versao text, p_premium boolean, p_eventos jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  if jsonb_typeof(p_eventos) <> 'array' or jsonb_array_length(p_eventos) > 50 then
    raise exception 'Lote inválido.' using errcode = '22023';
  end if;
  insert into public.eventos (instalacao, nome, dados, plataforma, versao, premium, em)
  select p_instalacao, e->>'nome', coalesce(e->'dados', '{}'::jsonb), left(p_plataforma, 10), left(p_versao, 12), p_premium,
         least(now(), greatest(now() - interval '60 days', coalesce((e->>'em')::timestamptz, now())))
    from jsonb_array_elements(p_eventos) e
   where e->>'nome' in ('app_aberto', 'perfil_criado', 'avaliacao_fim', 'fase_inicio', 'fase_fim', 'paywall_visto', 'compra_inicio',
                        'compra_ok', 'compra_erro', 'compras_restauradas', 'turma_entrou', 'turma_saiu', 'fluencia_feita')
     and octet_length(coalesce(e->'dados', '{}'::jsonb)::text) <= 1000;
end $$;

revoke all on function public.entrar_turma(text, text), public.enviar_progresso(uuid, uuid, text, jsonb),
  public.sair_turma(uuid, uuid), public.registrar_eventos(uuid, text, text, boolean, jsonb), public.novo_codigo_turma() from public;
grant execute on function public.entrar_turma(text, text), public.enviar_progresso(uuid, uuid, text, jsonb),
  public.sair_turma(uuid, uuid), public.registrar_eventos(uuid, text, text, boolean, jsonb) to anon, authenticated;

-- ---------------------------------------------------------------- limpeza automática (política de privacidade: 13 meses)
-- Usa o pg_cron do Supabase (Database → Extensions). Se não estiver disponível, o script segue e avisa:
-- nesse caso, rode de vez em quando:  delete from public.eventos where em < now() - interval '13 months';
do $$
begin
  create extension if not exists pg_cron;
  perform cron.schedule('ler-brincando-limpar-eventos', '15 4 * * 0',
    $c$delete from public.eventos where em < now() - interval '13 months'$c$);
exception when others then
  raise notice 'pg_cron indisponível (%): faça a limpeza dos eventos manualmente.', sqlerrm;
end $$;
