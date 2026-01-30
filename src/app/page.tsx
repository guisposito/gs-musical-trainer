import dynamic from 'next/dynamic';

const GuitarTrainer = dynamic(
  () => import('@/components/GuitarTrainer'),
  { ssr: false }
);

const HomePage = () => {
  return (
    <main className="min-h-screen bg-[#0a0a0a] relative overflow-x-hidden">
      {/* Background gradient + subtle pattern */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#141414] to-[#0a0a0a] pointer-events-none" aria-hidden />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(225,29,72,0.15),transparent)] pointer-events-none" aria-hidden />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#1c1c1c_1px,transparent_1px),linear-gradient(to_bottom,#1c1c1c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-40" aria-hidden />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-4xl">
        <header className="text-center mb-8 sm:mb-10 lg:mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
            <span className="text-brand-red">GS</span> Musical Trainer
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Treine as notas no braço da guitarra com detecção de pitch em tempo real
          </p>
        </header>

        <GuitarTrainer />

        <footer className="mt-12 sm:mt-16 text-center text-zinc-500 text-sm px-2">
          <p className="mb-2">
            <span className="text-brand-red/80">💡</span> Toque as notas de forma sustentada para melhor detecção
          </p>
          <p>
            Web Audio API · Requer microfone
          </p>
        </footer>
      </div>
    </main>
  );
};

export default HomePage;
