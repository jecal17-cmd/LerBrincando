# Nuvem: painel do professor, código de turma e estatísticas (Supabase)

A nuvem é **opcional**. Sem ela, o jogo funciona 100% offline e a aba 🏫 Escola avisa que não está configurada.
Com ela, você ganha:

- **Painel do professor** (`professor.html`): o professor cria turmas e acompanha cada aluno.
- **Código de turma** no jogo (Área dos Pais → 🏫 Escola): o aparelho envia um resumo do progresso para o professor.
- **Licença da escola**: você define a validade da licença de uma turma e todos os alunos dela recebem a versão completa.
- **Estatísticas anônimas** (só com autorização do adulto): funil, retenção e fases difíceis, em `supabase/consultas.sql`.

Custo: o plano gratuito do Supabase atende o início (500 MB de banco, 50 mil usuários de login por mês).

## 1. Criar o projeto (10 minutos)

1. Crie uma conta em [supabase.com](https://supabase.com) → **New project**. Região: **South America (São Paulo)**. Guarde a senha do banco.
2. Abra **SQL Editor** → **New query**, cole todo o conteúdo de `supabase/esquema.sql` e clique em **Run**.
   O script pode ser rodado de novo sem problema, por exemplo depois de uma atualização do jogo.
3. Opcional, mas recomendado: em **Database → Extensions**, ative **pg_cron** e rode o `esquema.sql` de novo.
   Assim os eventos com mais de 13 meses são apagados sozinhos, como diz a política de privacidade.
4. Em **Project Settings → API**, copie a **Project URL** e a chave **anon public**.
5. Em `config.js`, preencha:

   ```js
   supabaseUrl: 'https://SEU-PROJETO.supabase.co',
   supabaseAnon: 'eyJhbGciOi...',
   ```

   A chave anon é pública por natureza: quem protege os dados são as regras do banco. **Nunca** coloque a chave `service_role` no jogo.
6. Em **Authentication → URL Configuration**, informe em **Site URL** o endereço do painel, por exemplo
   `https://jecal17-cmd.github.io/LerBrincando/professor.html`. Os links de confirmação de e-mail e de nova senha voltam para lá.
7. Publique: o GitHub Pages já serve o repositório. O painel fica em `.../LerBrincando/professor.html`.
   Gere também um app novo (Actions → App Android) para o `config.js` ir junto.

## 2. Como o professor usa

1. Abre `professor.html`, cria a conta com o e-mail e confirma pelo link recebido.
2. Cria a turma ("1º ano A") e recebe um código de 6 letras, como `K7M3QX`.
3. Imprime o **Bilhete para as famílias** (botão no painel) ou digita o código nos tablets da escola.
4. No jogo: Área dos Pais → 🏫 Escola → código → escolhe as crianças → autoriza → **Entrar na turma**.
5. O painel mostra, por aluno: onde está no mapa, fases concluídas, minutos de prática, sons com dificuldade,
   sons que confunde e testes de fluência. Também mostra a visão da turma e permite exportar uma planilha CSV.

O progresso é enviado ao terminar cada fase (no máximo a cada 3 minutos), ao abrir o jogo e ao sair dele. Sem internet, o jogo tenta de novo mais tarde.

## 3. Vender a licença para uma escola

No **SQL Editor**:

```sql
-- turmas específicas
update turmas set licenca_ate = '2027-12-31' where codigo in ('K7M3QX', 'P2W9RT');
-- todas as turmas de um professor
update turmas set licenca_ate = '2027-12-31'
 where professor_id = (select id from auth.users where email = 'professora@escola.com');
```

Os aparelhos recebem a licença na próxima sincronização. O professor vê o selo "⭐ Licença até ..." no painel.
O professor **não** consegue alterar a licença: a coluna é bloqueada para ele.

## 4. Métricas

Abra `supabase/consultas.sql` no SQL Editor e rode a consulta desejada:
aparelhos ativos por dia, retenção D1/D7/D30, funil da versão completa, compras por produto, fases mais difíceis,
onde as crianças param, fluência média por mês e uso por escola.

## 5. Segurança e LGPD (o que o esquema garante)

| Regra | Como |
|---|---|
| O app não lê nem altera tabelas | a chave anon só executa 4 funções: `entrar_turma`, `enviar_progresso`, `sair_turma`, `registrar_eventos` |
| Só o aparelho do aluno atualiza o progresso dele | cada aluno tem um token secreto, guardado só no aparelho |
| O professor só vê as próprias turmas e não vê o token | Row Level Security e permissão por coluna |
| A licença não pode ser alterada pelo professor | a coluna `licenca_ate` não tem permissão de escrita para ele |
| Estatísticas sem dados pessoais | só nomes de eventos conhecidos e números; o nome da criança nunca é enviado |
| Direito de exclusão | "Sair da turma" no jogo ou "Remover aluno" no painel apagam o aluno |
| Turma com limite | no máximo 45 alunos por turma (evita abuso do código) |

O esquema foi testado num PostgreSQL 16 com os papéis `anon` e `authenticated` do Supabase simulados.
Foram cobertos: criação de turma, tentativa de forjar licença, entrada com código válido e inválido, token errado,
isolamento entre professores, evento desconhecido descartado e exclusão ao sair da turma.
