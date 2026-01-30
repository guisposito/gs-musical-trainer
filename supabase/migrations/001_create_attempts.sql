-- Table: attempts
-- Stores each note attempt (correct/incorrect) per user for mastery stats.
-- user_id comes from NextAuth session (Google OAuth), not Supabase Auth.
-- Access is only via API routes with server-side session check; no RLS by auth.uid().

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
