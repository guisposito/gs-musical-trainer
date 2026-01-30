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
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-center gap-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          <p className="text-gray-300 text-lg">
            Aguardando você tocar...
          </p>
        </div>
      </div>
    );
  }

  if (state === 'correct') {
    return (
      <div className="bg-green-500 rounded-xl p-6 border-4 border-green-400 shadow-lg shadow-green-500/50 animate-pulse-success">
        <div className="text-center">
          <div className="text-6xl mb-3">✓</div>
          <p className="text-white text-2xl font-bold mb-2">
            Acertou!
          </p>
          <p className="text-green-100 text-sm">
            Avançando para próxima nota...
          </p>
          {centsDifference !== null && (
            <p className="text-green-200 text-xs mt-2">
              Precisão: {Math.abs(Math.round(centsDifference))}¢ de diferença
            </p>
          )}
        </div>
      </div>
    );
  }

  if (state === 'incorrect') {
    return (
      <div className="bg-red-500 rounded-xl p-6 border-4 border-red-400 shadow-lg shadow-red-500/50 animate-pulse-error">
        <div className="text-center">
          <div className="text-6xl mb-3">✗</div>
          <p className="text-white text-2xl font-bold mb-2">
            Tente novamente
          </p>
          <p className="text-red-100 text-sm">
            Essa não é a nota correta
          </p>
          {centsDifference !== null && (
            <p className="text-red-200 text-xs mt-2">
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
