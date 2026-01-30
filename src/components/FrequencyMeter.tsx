'use client';

import { useEffect, useState } from 'react';
import { frequencyToNoteName } from '@/lib/frequencyConverter';

interface FrequencyMeterProps {
  /** Current detected frequency in Hz */
  frequency: number | null;
  /** Whether detection is active */
  isListening: boolean;
  /** Confidence level (0-1) */
  confidence: number;
  /** Audio level (0-1) for visual feedback */
  audioLevel?: number;
}

/**
 * Component to display the detected frequency and note in real-time
 */
const FrequencyMeter = ({ frequency, isListening, confidence, audioLevel = 0 }: FrequencyMeterProps) => {
  const [displayFrequency, setDisplayFrequency] = useState<number | null>(null);
  const [displayNote, setDisplayNote] = useState<string>('--');

  useEffect(() => {
    if (frequency) {
      setDisplayFrequency(frequency);
      setDisplayNote(frequencyToNoteName(frequency));
    } else {
      setDisplayFrequency(null);
      setDisplayNote('--');
    }
  }, [frequency]);

  const confidencePercentage = Math.round(confidence * 100);
  const confidenceColor = confidence > 0.7 ? 'bg-success-500' : confidence > 0.4 ? 'bg-amber-500' : 'bg-brand-red';

  return (
    <div className="bg-dark-800/90 rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl border border-dark-600/50 ring-1 ring-white/5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs sm:text-sm font-semibold text-zinc-500 uppercase tracking-widest">
          Detecção em tempo real
        </h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-brand-red animate-pulse' : 'bg-dark-600'}`} />
          <span className="text-xs text-zinc-500">
            {isListening ? 'Ouvindo' : 'Pausado'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-dark-900/80 rounded-xl p-3 sm:p-4 border border-dark-600/40">
          <p className="text-xs text-zinc-500 mb-1">Frequência</p>
          <p className="text-xl sm:text-2xl font-bold text-white tabular-nums">
            {displayFrequency ? `${Math.round(displayFrequency)} Hz` : '-- Hz'}
          </p>
        </div>
        <div className="bg-dark-900/80 rounded-xl p-3 sm:p-4 border border-dark-600/40">
          <p className="text-xs text-zinc-500 mb-1">Nota detectada</p>
          <p className="text-xl sm:text-2xl font-bold text-brand-red tabular-nums">
            {displayNote}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-zinc-500">Confiança</p>
          <p className="text-xs text-zinc-400 tabular-nums">{confidencePercentage}%</p>
        </div>
        <div className="w-full bg-dark-900 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${confidenceColor} transition-all duration-300 ease-out rounded-full`}
            style={{ width: `${confidencePercentage}%` }}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-zinc-500">Nível de áudio</p>
          <p className="text-xs text-zinc-400 tabular-nums">{Math.round(audioLevel * 100)}%</p>
        </div>
        <div className="w-full bg-dark-900 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-100 rounded-full ${
              audioLevel > 0.5 ? 'bg-success-500' : audioLevel > 0.2 ? 'bg-amber-500' : 'bg-brand-red/80'
            }`}
            style={{ width: `${audioLevel * 100}%` }}
          />
        </div>
        {audioLevel < 0.05 && isListening && (
          <p className="text-xs text-brand-red/90 mt-2 text-center">
            Sinal fraco — toque mais forte ou aproxime o microfone
          </p>
        )}
      </div>

      {isListening && !frequency && audioLevel < 0.02 && (
        <p className="text-xs text-zinc-500 mt-4 text-center">
          Aguardando sinal de áudio...
        </p>
      )}
    </div>
  );
};

export default FrequencyMeter;
