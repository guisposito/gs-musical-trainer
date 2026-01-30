import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Guitar String Trainer - Treinador de Notas',
  description: 'WebApp educacional para memorização das notas no braço da guitarra usando detecção de pitch em tempo real',
  keywords: ['guitar', 'music', 'training', 'pitch detection', 'web audio'],
  authors: [{ name: 'Guitar String Trainer' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-900">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
