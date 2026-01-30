# Criar tabelas no Supabase (GS Musical Trainer)

O app precisa de **duas tabelas** no Supabase: `attempts` (estatísticas de treino) e `users` (login por email). Siga os passos abaixo.

---

## 1. Abrir o SQL Editor no Supabase

1. Acesse [supabase.com](https://supabase.com) e entre no seu projeto.
2. No menu lateral esquerdo, clique em **SQL Editor**.
3. Clique em **New query** (nova consulta).

---

## 2. Criar a tabela `users` (obrigatória para Criar conta / Entrar)

Cole o SQL abaixo no editor e clique em **Run** (ou Ctrl+Enter):

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

Deve aparecer **Success**. A tabela `users` foi criada.

---

## 3. Criar a tabela `attempts` (para salvar maestria por corda)

Na mesma tela (ou em **New query** de novo), cole o SQL abaixo e clique em **Run**:

```sql
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
```

Deve aparecer **Success**. A tabela `attempts` foi criada.

---

## 4. Conferir (opcional)

No menu lateral, vá em **Table Editor**. Você deve ver as tabelas **users** e **attempts**. No início elas ficam vazias; os dados aparecem quando alguém cria conta e usa o treino.

---

Depois disso, tente **Criar conta** de novo no app; o erro “Could not find the table 'public.users'” deve sumir.
