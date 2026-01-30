import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { supabaseServer } from '@/lib/supabase-server';

const MIN_PASSWORD_LENGTH = 6;

export async function POST(request: Request) {
  let body: { email?: string; password?: string; name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres` },
      { status: 400 }
    );
  }

  const password_hash = await hash(password, 10);

  const { data: existing } = await supabaseServer
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    return NextResponse.json({ error: 'Este email já está em uso' }, { status: 409 });
  }

  const { error } = await supabaseServer.from('users').insert({
    email,
    password_hash,
    name: name || null,
  });

  if (error) {
    console.error('Register error:', error.code, error.message);
    if (error.code === '42P01' || error.message?.includes('does not exist')) {
      return NextResponse.json(
        { error: 'Tabela "users" não existe no Supabase. Execute o SQL em supabase/migrations/002_create_users.sql no SQL Editor do Supabase.' },
        { status: 500 }
      );
    }
    if (error.message?.includes('Invalid') || error.message?.includes('JWT') || error.message?.includes('API')) {
      return NextResponse.json(
        { error: 'Configuração do Supabase incorreta. Verifique NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local.' },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'Erro ao criar conta' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
