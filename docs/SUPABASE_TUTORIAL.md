# Tutorial Supabase – GS Musical Trainer

Passo a passo para configurar o Supabase e usar **login por email/senha** (e opcionalmente Google) e **maestria por corda** (estatísticas salvas).

---

## 1. Criar conta e projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login (ou crie uma conta).
2. Clique em **New Project**.
3. Preencha:
   - **Name**: por exemplo `gs-musical-trainer`.
   - **Database Password**: crie uma senha forte e **guarde** (você usa se precisar conectar direto ao banco).
   - **Region**: escolha a mais próxima (ex.: South America – São Paulo).
4. Clique em **Create new project** e espere o projeto ficar pronto (alguns segundos).

---

## 2. Anotar URL e chaves da API

1. No menu lateral, vá em **Project Settings** (ícone de engrenagem).
2. Clique em **API** na barra lateral.
3. Anote:
   - **Project URL**  
     Exemplo: `https://xxxxxxxxxxxx.supabase.co`  
     → use como `NEXT_PUBLIC_SUPABASE_URL` no `.env.local`.
   - **Project API keys**:
     - **anon public** – não use no backend do Next.js para a tabela `attempts`.
     - **service_role** – clique em **Reveal** e copie.  
       → use como `SUPABASE_SERVICE_ROLE_KEY` no `.env.local`.  
       **Não exponha essa chave no front-end**; ela só deve existir no servidor (API routes).

---

## 3. Criar a tabela `attempts`

1. No menu lateral do Supabase, vá em **SQL Editor**.
2. Clique em **New query**.
3. Cole o SQL abaixo (é o mesmo do arquivo `supabase/migrations/001_create_attempts.sql` do projeto):

```sql
-- Tabela de tentativas por usuário (para maestria por corda)
CREATE TABLE IF NOT EXISTS attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  string_number smallint NOT NULL CHECK (string_number >= 1 AND string_number <= 6),
  fret smallint NOT NULL CHECK (fret >= 0 AND fret <= 12),
  note_name text NOT NULL,
  is_correct boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_attempts_user_string ON attempts (user_id, string_number);
CREATE INDEX IF NOT EXISTS idx_attempts_user_created ON attempts (user_id, created_at);

COMMENT ON TABLE attempts IS 'Note attempts per user for mastery-by-string stats (NextAuth user_id)';
```

4. Clique em **Run** (ou Ctrl+Enter).
5. Deve aparecer algo como “Success. No rows returned”. A tabela `attempts` foi criada.

---

## 3b. Criar a tabela `users` (login por email)

Para permitir **entrar com email e senha** e **criar conta**, crie também a tabela de usuários:

1. No **SQL Editor**, clique em **New query** de novo.
2. Cole o SQL abaixo (igual ao arquivo `supabase/migrations/002_create_users.sql`):

```sql
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
```

3. Clique em **Run**. A tabela `users` será criada.

---

## 4. Conferir as tabelas (opcional)

1. No menu lateral, vá em **Table Editor**.
2. Você deve ver as tabelas **attempts** e **users**.
3. **attempts**: colunas `id`, `user_id`, `string_number`, `fret`, `note_name`, `is_correct`, `created_at`. Fica preenchida quando usuários logados treinam.
4. **users**: colunas `id`, `email`, `password_hash`, `name`, `created_at`. Fica preenchida quando alguém cria conta em “Criar conta”.

---

## 5. Variáveis de ambiente no seu projeto

No seu projeto (e na Vercel), use:

| Variável | Onde achar no Supabase | Uso |
|----------|------------------------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → **Project URL** | URL do projeto (pode ser usada no client). |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API → **service_role** (Reveal) | Chave usada só no servidor (API routes). |

- No **local**: coloque em `.env.local` (não commitar).
- Na **Vercel**: **Project → Settings → Environment Variables** e adicione as duas variáveis para **Production** (e Preview se quiser).

---

## 6. Resumo do fluxo

- **Login**: feito pelo **NextAuth** com **email e senha** (Credentials) ou, se configurado, **Google**. Os usuários de email ficam na tabela `users`; o `user_id` em `attempts` é o `id` do usuário (uuid do `users` ou ID do Google).
- **Gravação**: quando o usuário está logado e treina, o app chama `POST /api/attempts`. A API route usa a **service_role** para inserir em `attempts` com o `user_id` da sessão NextAuth.
- **Maestria**: a página `/maestria` chama `GET /api/attempts/stats`, que usa a mesma chave para ler apenas os dados do usuário logado e montar as estatísticas por corda.

Não é necessário configurar Auth (Email, Google, etc.) no Supabase para este projeto; o Supabase é usado só como banco (Postgres).

---

## 7. Troubleshooting

- **“relation \"attempts\" does not exist”**  
  A tabela ainda não foi criada. Rode o SQL do passo 3 no **SQL Editor**.

- **“Invalid API key” ou 401 nas API routes**  
  Confira se `SUPABASE_SERVICE_ROLE_KEY` está correta e sem espaços, e se está definida no ambiente onde a API roda (local ou Vercel).

- **Dados não aparecem na Maestria**  
  Confirme que você está logado (Google) e que treinou pelo menos uma vez depois de logar. As tentativas só são salvas quando há sessão ativa.

Se quiser, na próxima etapa podemos detalhar só a parte de **variáveis na Vercel** ou **Google OAuth** para o NextAuth.
