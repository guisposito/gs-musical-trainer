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
  const confidenceColor = confidence > 0.7 ? 'bg-green-500' : confidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Detecção em Tempo Real
        </h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
          <span className="text-xs text-gray-400">
            {isListening ? 'Ouvindo' : 'Pausado'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Frequency Display */}
        <div className="bg-gray-900 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-2">Frequência</p>
          <p className="text-2xl font-bold text-white">
            {displayFrequency ? `${Math.round(displayFrequency)} Hz` : '-- Hz'}
          </p>
        </div>

        {/* Note Display */}
        <div className="bg-gray-900 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-2">Nota Detectada</p>
          <p className="text-2xl font-bold text-white">
            {displayNote}
          </p>
        </div>
      </div>

      {/* Confidence Meter */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500">Confiança</p>
          <p className="text-xs text-gray-400">{confidencePercentage}%</p>
        </div>
        <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full ${confidenceColor} transition-all duration-300 ease-out`}
            style={{ width: `${confidencePercentage}%` }}
          />
        </div>
      </div>

      {/* Audio Level Indicator */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500">Nível de Áudio (Volume)</p>
          <p className="text-xs text-gray-400">{Math.round(audioLevel * 100)}%</p>
        </div>
        <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${
              audioLevel > 0.5 ? 'bg-green-500' : audioLevel > 0.2 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${audioLevel * 100}%` }}
          />
        </div>
        {audioLevel < 0.05 && isListening && (
          <p className="text-xs text-red-400 mt-2 text-center">
            ⚠️ Sinal muito fraco! Toque mais forte ou aproxime o microfone
          </p>
        )}
      </div>

      {/* Instructions */}
      {isListening && !frequency && audioLevel < 0.02 && (
        <p className="text-xs text-gray-500 mt-4 text-center">
          Aguardando sinal de áudio...
        </p>
      )}
    </div>
  );
};

export default FrequencyMeter;
