import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase-server';
import type { AttemptRecord } from '@/types';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  let body: AttemptRecord;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const { stringNumber, fret, noteName, isCorrect } = body;
  if (
    typeof stringNumber !== 'number' ||
    typeof fret !== 'number' ||
    typeof noteName !== 'string' ||
    typeof isCorrect !== 'boolean'
  ) {
    return NextResponse.json({ error: 'Campos inválidos' }, { status: 400 });
  }
  if (stringNumber < 1 || stringNumber > 6 || fret < 0 || fret > 12) {
    return NextResponse.json({ error: 'stringNumber ou fret fora do intervalo' }, { status: 400 });
  }

  const { error } = await supabaseServer.from('attempts').insert({
    user_id: session.user.id,
    string_number: stringNumber,
    fret,
    note_name: noteName,
    is_correct: isCorrect,
  });

  if (error) {
    console.error('Supabase insert error:', error);
    return NextResponse.json({ error: 'Erro ao salvar tentativa' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
