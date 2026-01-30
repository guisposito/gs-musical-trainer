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
      <div className="bg-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl border border-gray-700">
        <div className="text-center">
          <p className="text-gray-400 text-lg">
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
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 shadow-2xl border border-gray-700 animate-slide-up">
      <div className="text-center">
        <p className="text-gray-400 text-sm md:text-base uppercase tracking-wider mb-4">
          Toque a nota:
        </p>
        
        <div className="mb-6">
          <div className={`text-7xl md:text-9xl font-bold mb-4 transition-all duration-300 ${
            isActive ? 'text-white scale-100' : 'text-gray-600 scale-95'
          }`}>
            {targetNote.name}
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1" />
            <p className="text-2xl md:text-3xl text-gray-300 font-semibold">
              Corda {targetNote.string}
              <span className="text-gray-500 text-base font-normal ml-2">
                {targetNote.string === 1 ? '(mais aguda)' : targetNote.string === 6 ? '(mais grave)' : ''}
              </span>
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1" />
          </div>
        </div>
        
        {/* Casa: oculta por padrão, botão discreto para mostrar */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleToggleFret}
            onKeyDown={(e) => e.key === 'Enter' && handleToggleFret()}
            aria-label={showFret ? 'Ocultar número da casa' : 'Mostrar número da casa'}
            tabIndex={0}
            className="text-gray-500 hover:text-gray-400 text-xs underline focus:outline-none focus:ring-1 focus:ring-gray-500 rounded px-1"
          >
            {showFret ? 'Ocultar casa' : 'Mostrar casa'}
          </button>
          {showFret && (
            <div className="bg-gray-900 rounded-lg p-3 inline-block mt-2">
              <p className="text-xs text-gray-400">Casa</p>
              <p className="text-2xl font-bold text-white">{targetNote.fret}</p>
            </div>
          )}
        </div>
        
        <p className="text-gray-500 text-sm mt-6">
          Frequência esperada: {Math.round(targetNote.frequency)} Hz
        </p>
      </div>
    </div>
  );
};

export default NoteDisplay;
