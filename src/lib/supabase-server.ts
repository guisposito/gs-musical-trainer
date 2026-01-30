import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

/**
 * Server-side Supabase client (API routes only).
 * Uses service role key; never expose to client.
 */
export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);

export interface AttemptRow {
  id: string;
  user_id: string;
  string_number: number;
  fret: number;
  note_name: string;
  is_correct: boolean;
  created_at: string;
}
