import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { supabaseServer } from '@/lib/supabase-server';

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  let body: { name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (name.length > 100) {
    return NextResponse.json({ error: 'Nome muito longo' }, { status: 400 });
  }

  const { error } = await supabaseServer
    .from('users')
    .update({ name: name || null })
    .eq('id', session.user.id);

  if (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Erro ao atualizar perfil' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
