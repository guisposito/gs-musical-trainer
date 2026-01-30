import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase-server';
import type { StatsByString } from '@/types';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { data, error } = await supabaseServer
    .from('attempts')
    .select('string_number, is_correct')
    .eq('user_id', session.user.id);

  if (error) {
    console.error('Supabase stats error:', error);
    return NextResponse.json({ error: 'Erro ao buscar estatísticas' }, { status: 500 });
  }

  const byString: StatsByString = {};
  for (let s = 1; s <= 6; s++) {
    byString[s] = { correct: 0, total: 0 };
  }

  for (const row of data ?? []) {
    const s = row.string_number as number;
    if (s >= 1 && s <= 6) {
      byString[s].total += 1;
      if (row.is_correct) byString[s].correct += 1;
    }
  }

  return NextResponse.json({ byString });
}
