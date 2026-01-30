import dynamic from 'next/dynamic';

const GuitarTrainer = dynamic(
  () => import('@/components/GuitarTrainer'),
  { ssr: false }
);

const HomePage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            🎸 Guitar String Trainer
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Treine a memorização das notas no braço da guitarra com detecção de pitch em tempo real
          </p>
        </header>
        
        <GuitarTrainer />
        
        <footer className="mt-16 text-center text-gray-400 text-sm">
          <p className="mb-2">
            💡 <strong>Dica:</strong> Toque as notas de forma sustentada para melhor detecção
          </p>
          <p>
            Desenvolvido com Web Audio API | Requer navegador com suporte a microfone
          </p>
        </footer>
      </div>
    </main>
  );
};

export default HomePage;
