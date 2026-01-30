'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

const ContaPage = () => {
  const { data: session, status, update: updateSession } = useSession();
  const [name, setName] = useState('');
  useEffect(() => {
    if (session?.user?.name !== undefined) setName(session.user.name ?? '');
    else if (session?.user?.email) setName('');
  }, [session?.user?.name, session?.user?.email]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error ?? 'Erro ao salvar' });
        return;
      }
      await updateSession({ ...session, user: { ...session?.user, name: name.trim() || null } });
      setMessage({ type: 'success', text: 'Nome atualizado.' });
    } catch {
      setMessage({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <main className="min-h-screen bg-[#0a0a0a] relative">
        <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a] pointer-events-none" aria-hidden />
        <div className="relative container mx-auto px-4 py-12 max-w-lg text-center">
          <p className="text-zinc-400">Carregando…</p>
        </div>
      </main>
    );
  }

  if (status !== 'authenticated') {
    return (
      <main className="min-h-screen bg-[#0a0a0a] relative">
        <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a] pointer-events-none" aria-hidden />
        <div className="relative container mx-auto px-4 py-12 max-w-lg text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Minha conta</h1>
          <p className="text-zinc-400 mb-6">Entre para acessar seu painel.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-white bg-brand-red hover:bg-brand-red-light rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red"
            tabIndex={0}
          >
            Ir para início e entrar
          </Link>
        </div>
      </main>
    );
  }

  const displayName = name || session.user?.email || 'Usuário';

  return (
    <main className="min-h-screen bg-[#0a0a0a] relative overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a] pointer-events-none" aria-hidden />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(225,29,72,0.12),transparent)] pointer-events-none" aria-hidden />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1c1c1c_1px,transparent_1px),linear-gradient(to_bottom,#1c1c1c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40" aria-hidden />

      <div className="relative container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-lg">
        <Link
          href="/"
          className="inline-block text-zinc-400 hover:text-white text-sm font-medium mb-6 focus:outline-none focus:ring-2 focus:ring-brand-red rounded"
          tabIndex={0}
        >
          ← Voltar ao treino
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Minha conta</h1>
        <p className="text-zinc-400 text-sm mb-8">Gerencie seu perfil e acesse suas estatísticas.</p>

        <div className="space-y-6">
          <section className="bg-dark-800 border border-dark-600 rounded-xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Perfil</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1">Email</label>
                <p className="text-zinc-300">{session.user?.email ?? '—'}</p>
                <p className="text-zinc-500 text-xs mt-1">O email não pode ser alterado aqui.</p>
              </div>
              <form onSubmit={handleSaveName} className="space-y-3">
                <div>
                  <label htmlFor="conta-name" className="block text-sm font-medium text-zinc-300 mb-1">
                    Nome exibido
                  </label>
                  <input
                    id="conta-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    className="w-full px-4 py-2 bg-dark-900 border border-dark-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-red"
                    placeholder={session.user?.email ?? 'Seu nome'}
                    aria-label="Nome"
                  />
                </div>
                {message && (
                  <p className={`text-sm ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`} role="alert">
                    {message.text}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-brand-red hover:bg-brand-red-light text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red disabled:opacity-50"
                  aria-label="Salvar nome"
                >
                  {saving ? 'Salvando…' : 'Salvar nome'}
                </button>
              </form>
            </div>
          </section>

          <section className="bg-dark-800 border border-dark-600 rounded-xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Atalhos</h2>
            <ul className="space-y-2" role="list">
              <li>
                <Link
                  href="/maestria"
                  className="flex items-center justify-between py-2 text-zinc-300 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red rounded"
                  tabIndex={0}
                >
                  <span>📊 Maestria por corda</span>
                  <span className="text-zinc-500">→</span>
                </Link>
              </li>
            </ul>
          </section>

          <section className="bg-dark-800 border border-dark-600 rounded-xl p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Sessão</h2>
            <p className="text-zinc-400 text-sm mb-4">
              Você está logado como <strong className="text-zinc-300">{displayName}</strong>.
            </p>
            <button
              type="button"
              onClick={() => signOut()}
              onKeyDown={(e) => e.key === 'Enter' && signOut()}
              className="px-4 py-2 text-sm font-medium text-zinc-300 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red"
              aria-label="Sair da conta"
            >
              Sair da conta
            </button>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ContaPage;
