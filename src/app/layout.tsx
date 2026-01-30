import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'GS Musical Trainer - Treinador de Notas',
  description: 'WebApp educacional para memorização das notas no braço da guitarra usando detecção de pitch em tempo real',
  keywords: ['guitar', 'music', 'training', 'pitch detection', 'web audio'],
  authors: [{ name: 'GS Musical Trainer' }],
  icons: {
    icon: '/icon.svg',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const RootLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
