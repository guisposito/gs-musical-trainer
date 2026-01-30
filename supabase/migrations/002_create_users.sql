-- Table: users (for email/password login via NextAuth Credentials)
-- Used when Google login is not configured; password stored as bcrypt hash.

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

COMMENT ON TABLE users IS 'Users for email/password login (NextAuth Credentials provider)';
