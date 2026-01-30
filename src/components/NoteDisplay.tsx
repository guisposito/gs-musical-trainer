'use client';

import { useState } from 'react';
import type { Note } from '@/types';

interface NoteDisplayProps {
  /** Current target note to display */
  targetNote: Note | null;
  /** Whether the training is active */
  isActive: boolean;
}

/**
 * Component to display the target note and string that the user should play
 */
const NoteDisplay = ({ targetNote, isActive }: NoteDisplayProps) => {
  const [showFret, setShowFret] = useState(false);

  if (!targetNote) {
    return (
      <div className="bg-dark-800/90 rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl border border-dark-600/50">
        <div className="text-center">
          <p className="text-zinc-500 text-base sm:text-lg">
            Aguardando início...
          </p>
        </div>
      </div>
    );
  }

  const handleToggleFret = () => {
    setShowFret((prev) => !prev);
  };

  return (
    <div className="bg-dark-800/90 rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-xl border border-dark-600/50 animate-slide-up ring-1 ring-white/5">
      <div className="text-center">
        <p className="text-zinc-500 text-xs sm:text-sm uppercase tracking-widest mb-4">
          Toque a nota
        </p>

        <div className="mb-5 sm:mb-6">
          <div className={`text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-3 sm:mb-4 transition-all duration-300 ${
            isActive ? 'text-brand-red drop-shadow-[0_0_30px_rgba(225,29,72,0.4)]' : 'text-zinc-600 scale-95'
          }`}>
            {targetNote.name}
          </div>

          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <div className="h-px bg-gradient-to-r from-transparent via-brand-red/40 to-transparent flex-1 min-w-[2rem]" />
            <p className="text-xl sm:text-2xl md:text-3xl text-zinc-300 font-semibold">
              Corda {targetNote.string}
              <span className="text-zinc-500 text-sm sm:text-base font-normal ml-2">
                {targetNote.string === 1 ? '(mais aguda)' : targetNote.string === 6 ? '(mais grave)' : ''}
              </span>
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-brand-red/40 to-transparent flex-1 min-w-[2rem]" />
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleToggleFret}
            onKeyDown={(e) => e.key === 'Enter' && handleToggleFret()}
            aria-label={showFret ? 'Ocultar número da casa' : 'Mostrar número da casa'}
            tabIndex={0}
            className="text-zinc-500 hover:text-brand-red/90 text-xs underline focus:outline-none focus:ring-1 focus:ring-brand-red/50 rounded px-1 transition-colors"
          >
            {showFret ? 'Ocultar casa' : 'Mostrar casa'}
          </button>
          {showFret && (
            <div className="bg-dark-900 rounded-xl p-3 inline-block mt-2 border border-dark-600/50">
              <p className="text-xs text-zinc-500 uppercase tracking-wider">Casa</p>
              <p className="text-2xl font-bold text-brand-red tabular-nums">{targetNote.fret}</p>
            </div>
          )}
        </div>

        <p className="text-zinc-500 text-xs sm:text-sm mt-5 sm:mt-6">
          Frequência esperada: <span className="text-zinc-400 font-medium tabular-nums">{Math.round(targetNote.frequency)} Hz</span>
        </p>
      </div>
    </div>
  );
};

export default NoteDisplay;
