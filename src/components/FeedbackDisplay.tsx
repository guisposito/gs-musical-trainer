'use client';

import type { TrainingState } from '@/types';

interface FeedbackDisplayProps {
  /** Current training state */
  state: TrainingState;
  /** Cents difference from target (null if not applicable) */
  centsDifference: number | null;
}

/**
 * Component to display visual feedback for correct/incorrect notes
 */
const FeedbackDisplay = ({ state, centsDifference }: FeedbackDisplayProps) => {
  if (state === 'idle' || state === 'ready') {
    return null;
  }

  if (state === 'listening') {
    return (
      <div className="bg-dark-800/90 rounded-2xl p-4 sm:p-6 border border-dark-600/50 ring-1 ring-white/5">
        <div className="flex items-center justify-center gap-3">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-brand-red rounded-full animate-pulse" />
          <p className="text-zinc-400 text-base sm:text-lg">
            Aguardando você tocar...
          </p>
        </div>
      </div>
    );
  }

  if (state === 'correct') {
    return (
      <div className="bg-success-500/95 rounded-2xl p-5 sm:p-6 border-2 border-success-600 shadow-lg shadow-success-500/30 animate-pulse-success">
        <div className="text-center">
          <div className="text-5xl sm:text-6xl mb-2 sm:mb-3 text-white">✓</div>
          <p className="text-white text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
            Acertou!
          </p>
          <p className="text-white/90 text-sm">
            Avançando para próxima nota...
          </p>
          {centsDifference !== null && (
            <p className="text-white/80 text-xs mt-2 tabular-nums">
              Precisão: {Math.abs(Math.round(centsDifference))}¢ de diferença
            </p>
          )}
        </div>
      </div>
    );
  }

  if (state === 'incorrect') {
    return (
      <div className="bg-brand-red/95 rounded-2xl p-5 sm:p-6 border-2 border-brand-red-dark shadow-lg shadow-brand-red/30 animate-pulse-error">
        <div className="text-center">
          <div className="text-5xl sm:text-6xl mb-2 sm:mb-3 text-white">✗</div>
          <p className="text-white text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
            Tente novamente
          </p>
          <p className="text-white/90 text-sm">
            Essa não é a nota correta
          </p>
          {centsDifference !== null && (
            <p className="text-white/80 text-xs mt-2 tabular-nums">
              {Math.abs(Math.round(centsDifference))}¢ de diferença
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default FeedbackDisplay;
