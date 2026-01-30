'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MIN_PASSWORD_LENGTH = 6;

const RegistroPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`A senha deve ter no mínimo ${MIN_PASSWORD_LENGTH} caracteres`);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password, name: name.trim() || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? 'Erro ao criar conta');
        return;
      }
      router.push('/?registrado=1');
    } catch {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] relative">
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a] pointer-events-none" aria-hidden />
      <div className="relative container mx-auto px-4 py-12 max-w-md">
        <Link
          href="/"
          className="inline-block text-zinc-400 hover:text-white text-sm font-medium mb-6 focus:outline-none focus:ring-2 focus:ring-brand-red rounded"
          tabIndex={0}
        >
          ← Voltar
        </Link>
        <h1 className="text-2xl font-bold text-white mb-2">Criar conta</h1>
        <p className="text-zinc-400 text-sm mb-6">
          Use seu email e senha para entrar no app e salvar sua maestria.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="registro-name" className="block text-sm font-medium text-zinc-300 mb-1">
              Nome (opcional)
            </label>
            <input
              id="registro-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-red"
              placeholder="Seu nome"
              autoComplete="name"
              aria-label="Nome"
            />
          </div>
          <div>
            <label htmlFor="registro-email" className="block text-sm font-medium text-zinc-300 mb-1">
              Email
            </label>
            <input
              id="registro-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-red"
              placeholder="seu@email.com"
              autoComplete="email"
              aria-label="Email"
            />
          </div>
          <div>
            <label htmlFor="registro-password" className="block text-sm font-medium text-zinc-300 mb-1">
              Senha (mín. {MIN_PASSWORD_LENGTH} caracteres)
            </label>
            <input
              id="registro-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={MIN_PASSWORD_LENGTH}
              className="w-full px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-red"
              placeholder="••••••••"
              autoComplete="new-password"
              aria-label="Senha"
            />
          </div>
          <div>
            <label htmlFor="registro-confirm" className="block text-sm font-medium text-zinc-300 mb-1">
              Confirmar senha
            </label>
            <input
              id="registro-confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={MIN_PASSWORD_LENGTH}
              className="w-full px-4 py-2 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-red"
              placeholder="••••••••"
              autoComplete="new-password"
              aria-label="Confirmar senha"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-brand-red hover:bg-brand-red-light text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red disabled:opacity-50"
            aria-label="Criar conta"
          >
            {loading ? 'Criando…' : 'Criar conta'}
          </button>
        </form>
        <p className="mt-6 text-center text-zinc-400 text-sm">
          Já tem conta?{' '}
          <Link href="/" className="text-brand-red hover:underline" tabIndex={0}>
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegistroPage;
