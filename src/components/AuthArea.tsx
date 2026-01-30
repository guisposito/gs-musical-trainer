'use client';

import { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

const AuthArea = () => {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (result?.error) {
        setLoginError('Email ou senha incorretos');
        return;
      }
      if (result?.ok) {
        setShowLoginForm(false);
        setEmail('');
        setPassword('');
      }
    } catch {
      setLoginError('Erro ao entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-3 text-zinc-400 text-sm" aria-hidden>
        Carregando…
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <Link
          href="/conta"
          className="text-zinc-300 hover:text-white text-sm font-medium underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-brand-red rounded px-2 py-1"
          tabIndex={0}
          aria-label="Minha conta"
        >
          Minha conta
        </Link>
        <Link
          href="/maestria"
          className="text-zinc-300 hover:text-white text-sm font-medium underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-brand-red rounded px-2 py-1"
          tabIndex={0}
          aria-label="Ver minha maestria por corda"
        >
          📊 Maestria
        </Link>
        <div className="flex items-center gap-2 text-zinc-400 text-sm">
          {session.user.image && (
            <img
              src={session.user.image}
              alt=""
              className="w-8 h-8 rounded-full"
              width={32}
              height={32}
            />
          )}
          <span className="text-zinc-300 truncate max-w-[140px] sm:max-w-[200px]" title={session.user.email ?? undefined}>
            {session.user.name ?? session.user.email ?? 'Usuário'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          onKeyDown={(e) => e.key === 'Enter' && signOut()}
          aria-label="Sair da conta"
          tabIndex={0}
          className="px-4 py-2 text-sm font-medium text-zinc-300 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red"
        >
          Sair
        </button>
      </div>
    );
  }

  if (showLoginForm) {
    return (
      <div className="w-full max-w-xs mx-auto">
        <form onSubmit={handleCredentialsSubmit} className="space-y-3 p-4 bg-dark-800 border border-dark-600 rounded-xl">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-3 py-2 bg-dark-900 border border-dark-600 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
            autoComplete="email"
            aria-label="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
            className="w-full px-3 py-2 bg-dark-900 border border-dark-600 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red"
            autoComplete="current-password"
            aria-label="Senha"
          />
          {loginError && (
            <p className="text-red-400 text-sm" role="alert">
              {loginError}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 px-3 bg-brand-red hover:bg-brand-red-light text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red disabled:opacity-50"
              aria-label="Entrar"
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
            <button
              type="button"
              onClick={() => { setShowLoginForm(false); setLoginError(null); }}
              onKeyDown={(e) => e.key === 'Enter' && setShowLoginForm(false)}
              className="py-2 px-3 text-zinc-400 hover:text-white text-sm rounded-lg border border-dark-600 focus:outline-none focus:ring-2 focus:ring-brand-red"
              aria-label="Cancelar"
            >
              Cancelar
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-zinc-400 text-sm">
          Não tem conta?{' '}
          <Link href="/registro" className="text-brand-red hover:underline" tabIndex={0}>
            Criar conta
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => setShowLoginForm(true)}
        onKeyDown={(e) => e.key === 'Enter' && setShowLoginForm(true)}
        aria-label="Entrar com email e senha"
        tabIndex={0}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red"
      >
        Entrar com email
      </button>
      <Link
        href="/registro"
        className="px-4 py-2 text-sm font-medium text-zinc-300 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red inline-block"
        tabIndex={0}
      >
        Criar conta
      </Link>
    </div>
  );
};

export default AuthArea;
