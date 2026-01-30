'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import MaestriaChart from '@/components/MaestriaChart';
import type { StatsByString } from '@/types';

const STRING_LABELS: Record<number, string> = {
  1: 'Corda 1 (Mi agudo)',
  2: 'Corda 2 (Si)',
  3: 'Corda 3 (Sol)',
  4: 'Corda 4 (Ré)',
  5: 'Corda 5 (Lá)',
  6: 'Corda 6 (Mi grave)',
};

const MaestriaPage = () => {
  const { status } = useSession();
  const [byString, setByString] = useState<StatsByString | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') {
      setLoading(false);
      return;
    }
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/attempts/stats');
        if (!res.ok) throw new Error('Erro ao carregar estatísticas');
        const data = await res.json();
        setByString(data.byString ?? {});
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao carregar');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [status]);

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] relative">
        <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a] pointer-events-none" aria-hidden />
        <div className="relative container mx-auto px-4 py-12 max-w-4xl text-center">
          <p className="text-zinc-400">Carregando maestria…</p>
        </div>
      </main>
    );
  }

  if (status !== 'authenticated') {
    return (
      <main className="min-h-screen bg-[#0a0a0a] relative">
        <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a] pointer-events-none" aria-hidden />
        <div className="relative container mx-auto px-4 py-12 max-w-4xl text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Maestria por corda</h1>
          <p className="text-zinc-400 mb-6">
            Entre com sua conta para ver sua maestria e quantas notas você acertou em cada corda.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-white bg-brand-red hover:bg-brand-red-light rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red"
            tabIndex={0}
            aria-label="Ir para a página inicial e entrar"
          >
            Ir para início e entrar
          </Link>
        </div>
      </main>
    );
  }

  const fullByString: StatsByString = {};
  for (let s = 1; s <= 6; s++) {
    fullByString[s] = byString?.[s] ?? { correct: 0, total: 0 };
  }

  const totalAttempts = Object.values(fullByString).reduce((acc, { total }) => acc + total, 0);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetch('/api/attempts/stats')
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao carregar estatísticas');
        return res.json();
      })
      .then((data) => {
        setByString(data.byString ?? {});
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Erro ao carregar'))
      .finally(() => setLoading(false));
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] relative overflow-x-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a] pointer-events-none" aria-hidden />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(225,29,72,0.15),transparent)] pointer-events-none" aria-hidden />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1c1c1c_1px,transparent_1px),linear-gradient(to_bottom,#1c1c1c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40" aria-hidden />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-4xl">
        <header className="mb-8">
          <Link
            href="/"
            className="inline-block text-zinc-400 hover:text-white text-sm font-medium mb-4 focus:outline-none focus:ring-2 focus:ring-brand-red rounded"
            tabIndex={0}
          >
            ← Voltar ao treino
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Maestria por corda
          </h1>
          <p className="text-zinc-400">
            Quantas notas você acertou em cada corda do braço.
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              onKeyDown={(e) => e.key === 'Enter' && handleRetry()}
              className="text-brand-red hover:underline font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-red rounded px-2 py-1"
              aria-label="Tentar novamente"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {totalAttempts === 0 && !error && (
          <p className="mb-6 text-zinc-500 text-sm">
            Ainda não há tentativas salvas. Treine na página inicial para acumular estatísticas — o gráfico abaixo mostra como ficará.
          </p>
        )}

        <div className="bg-dark-800 border border-dark-600 rounded-xl p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Gráfico de acertos</h2>
          <MaestriaChart byString={fullByString} />
        </div>
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Detalhes por corda</h2>
          <ul className="space-y-3" role="list">
            {[1, 2, 3, 4, 5, 6].map((stringNum) => {
              const { correct, total } = fullByString[stringNum];
              const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
              return (
                <li
                  key={stringNum}
                  className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-dark-600 last:border-0"
                >
                  <span className="text-zinc-300 font-medium">
                    {STRING_LABELS[stringNum]}
                  </span>
                  <span className="text-zinc-400 text-sm">
                    {correct} acertos de {total} tentativas ({pct}%)
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {totalAttempts === 0 && (
          <p className="mt-6 text-center">
            <Link
              href="/"
              className="text-brand-red hover:underline font-medium text-sm"
              tabIndex={0}
            >
              Ir para o treino →
            </Link>
          </p>
        )}
      </div>
    </main>
  );
};

export default MaestriaPage;
