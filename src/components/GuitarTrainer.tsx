'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Note, TrainingState, PitchDetectionResult, ValidationResult } from '@/types';
import { getRandomNote } from '@/lib/guitarNotes';
import { 
  initializeAudio, 
  setupAudioWithScriptProcessor, 
  detectPitch,
  DEFAULT_AUDIO_CONFIG 
} from '@/lib/pitchDetector';
import { 
  isNoteMatch, 
  isFrequencyMatchWithinPercent,
  calculateCentsDifference,
  normalizeNoteName 
} from '@/lib/frequencyConverter';
import NoteDisplay from './NoteDisplay';
import FrequencyMeter from './FrequencyMeter';
import FeedbackDisplay from './FeedbackDisplay';

/**
 * Main component for the Guitar String Trainer application
 * Handles audio capture, pitch detection, and training flow
 */
const GuitarTrainer = () => {
  // State management
  const [trainingState, setTrainingState] = useState<TrainingState>('idle');
  const [targetNote, setTargetNote] = useState<Note | null>(null);
  const [currentPitch, setCurrentPitch] = useState<PitchDetectionResult | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  
  // Refs for audio processing
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const consecutiveCorrectRef = useRef<number>(0);
  const audioBufferRef = useRef<Float32Array | null>(null);
  const disconnectAudioRef = useRef<(() => void) | null>(null);
  const trainingStateRef = useRef<TrainingState>('idle');
  const targetNoteRef = useRef<Note | null>(null);

  // Mantém o ref em sync com o state para o loop de detecção sempre ver a nota atual
  useEffect(() => {
    targetNoteRef.current = targetNote;
  }, [targetNote]);

  /**
   * Initialize audio system and start training
   */
  const handleStart = useCallback(async () => {
    try {
      setError(null);
      trainingStateRef.current = 'ready';
      setTrainingState('ready');

      const { audioContext, stream } = await initializeAudio();
      audioContextRef.current = audioContext;
      streamRef.current = stream;

      const disconnect = setupAudioWithScriptProcessor(audioContext, stream, audioBufferRef);
      disconnectAudioRef.current = disconnect;

      const firstNote = getRandomNote();
      targetNoteRef.current = firstNote;
      setTargetNote(firstNote);
      trainingStateRef.current = 'listening';
      setTrainingState('listening');

      startPitchDetection();
    } catch (err) {
      console.error('Error initializing audio:', err);
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes('Permission') || message.includes('permission') || message.includes('NotAllowed')) {
        setError('Permissão de microfone negada. Clique no ícone de cadeado e permita o microfone.');
      } else if (message.includes('AudioContext') || message.includes('suspended')) {
        setError('O áudio não pôde iniciar. Recarregue a página e clique em "Iniciar Treino" novamente.');
      } else {
        setError(`Erro ao conectar microfone: ${message}`);
      }
      trainingStateRef.current = 'idle';
      setTrainingState('idle');
    }
  }, []);

  /**
   * Stop training and cleanup audio resources
   */
  const handleStop = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (disconnectAudioRef.current) {
      disconnectAudioRef.current();
      disconnectAudioRef.current = null;
    }
    audioBufferRef.current = null;

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    trainingStateRef.current = 'idle';
    setTrainingState('idle');
    targetNoteRef.current = null;
    setTargetNote(null);
    setCurrentPitch(null);
    setValidationResult(null);
    setAudioLevel(0);
    consecutiveCorrectRef.current = 0;
  }, []);

  /**
   * Start the pitch detection loop
   */
  const startPitchDetection = useCallback(() => {
    if (!audioContextRef.current || !audioBufferRef.current) {
      return;
    }

    const bufferLength = audioBufferRef.current.length;
    const buffer = new Float32Array(bufferLength);
    const sampleRate = audioContextRef.current.sampleRate;

    const detect = () => {
      if (trainingStateRef.current === 'idle') {
        return;
      }

      // Se o contexto foi suspenso (ex.: aba em segundo plano), tenta retomar
      const ctx = audioContextRef.current;
      if (ctx?.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      const latest = audioBufferRef.current;
      if (latest && latest.length > 0) {
        buffer.set(latest);

        // Calculate audio level (RMS)
        let sumSquares = 0;
        for (let i = 0; i < buffer.length; i++) {
          sumSquares += buffer[i] * buffer[i];
        }
        const rms = Math.sqrt(sumSquares / buffer.length);
        const level = Math.min(rms * 30, 1);
        
        setAudioLevel(level);

        // Detect pitch
        const result = detectPitch(buffer, sampleRate);
        setCurrentPitch(result);

        // Só valida com som mais forte e detecção confiante (evita acerto/erro por ruído ambiente)
        const minLevelToValidate = 0.18;
        const minConfidenceToValidate = 0.55;
        const currentTarget = targetNoteRef.current;
        if (
          trainingStateRef.current === 'listening' &&
          level >= minLevelToValidate &&
          result.confidence >= minConfidenceToValidate &&
          currentTarget &&
          result.frequency != null &&
          result.noteName != null
        ) {
          validateNote(result, currentTarget);
        }
      }

      animationFrameRef.current = requestAnimationFrame(detect);
    };

    detect();
  }, []);

  /**
   * Validate detected note against target note
   * @param noteToValidate - Nota alvo atual (vinda do ref no loop para evitar closure desatualizada)
   */
  const validateNote = useCallback((detection: PitchDetectionResult, noteToValidate: Note) => {
    if (detection.frequency == null || detection.noteName == null) {
      return;
    }

    // Acerto: nome da nota bate OU frequência está dentro da tolerância (ex.: ±20%)
    const isCorrectNote = isNoteMatch(noteToValidate.name, detection.noteName);
    const isCorrectFrequency = isFrequencyMatchWithinPercent(
      noteToValidate.frequency,
      detection.frequency,
      0.2 // 20% up / 20% down; use 0.1 para 10%
    );
    const centsDiff = calculateCentsDifference(
      detection.frequency,
      noteToValidate.frequency
    );

    const isCorrect = isCorrectNote || isCorrectFrequency;

    const result: ValidationResult = {
      isCorrect,
      targetNote: noteToValidate,
      detectedNote: normalizeNoteName(detection.noteName),
      detectedFrequency: detection.frequency,
      centsDifference: centsDiff,
    };

    setValidationResult(result);

    if (isCorrect) {
      handleCorrectNote();
    } else {
      // Mostra erro só com confiança alta (evita piscar por ruído)
      if (detection.confidence >= 0.6 && trainingStateRef.current === 'listening') {
        trainingStateRef.current = 'incorrect';
        setTrainingState('incorrect');
        setTimeout(() => {
          trainingStateRef.current = 'listening';
          setTrainingState('listening');
        }, 1000);
      }
    }
  }, [targetNote]);

  /**
   * Handle correct note detection
   */
  const handleCorrectNote = useCallback(() => {
    if (trainingStateRef.current !== 'listening' && trainingStateRef.current !== 'incorrect') {
      return;
    }
    trainingStateRef.current = 'correct';
    setTrainingState('correct');
    setCorrectCount(prev => prev + 1);
    consecutiveCorrectRef.current = 0;

    setTimeout(() => {
      const nextNote = getRandomNote();
      setTargetNote(nextNote);
      trainingStateRef.current = 'listening';
      setTrainingState('listening');
      setValidationResult(null);
    }, 1500);
  }, []);

  /**
   * Pular para a próxima nota (quando a detecção não valida mas você acertou)
   */
  const handleSkipToNext = useCallback(() => {
    if (trainingStateRef.current !== 'listening' && trainingStateRef.current !== 'incorrect') {
      return;
    }
    trainingStateRef.current = 'listening';
    setValidationResult(null);
    const nextNote = getRandomNote();
    setTargetNote(nextNote);
    setTrainingState('listening');
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      handleStop();
    };
  }, [handleStop]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Error Message */}
      {error && (
        <div className="bg-red-500 text-white rounded-lg p-4 mb-6 animate-fade-in">
          <p className="font-semibold">⚠️ Erro</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex justify-center gap-4 mb-8">
        {trainingState === 'idle' ? (
          <button
            onClick={handleStart}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            aria-label="Iniciar treino de guitarra"
            tabIndex={0}
            className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            🎸 Iniciar Treino
          </button>
        ) : (
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={handleStop}
              onKeyDown={(e) => e.key === 'Enter' && handleStop()}
              aria-label="Parar treino de guitarra"
              tabIndex={0}
              className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              ⏹️ Parar Treino
            </button>
            <button
              onClick={handleSkipToNext}
              onKeyDown={(e) => e.key === 'Enter' && handleSkipToNext()}
              aria-label="Pular para próxima nota"
              tabIndex={0}
              className="px-6 py-4 bg-gray-600 hover:bg-gray-500 text-white text-base font-medium rounded-xl border border-gray-500"
            >
              Próxima nota →
            </button>
          </div>
        )}
      </div>

      {/* Score Counter */}
      {trainingState !== 'idle' && (
        <div className="text-center mb-6">
          <p className="text-gray-400 text-sm mb-2">Notas corretas</p>
          <p className="text-5xl font-bold text-white">{correctCount}</p>
        </div>
      )}

      {/* Note Display */}
      <div className="mb-6">
        <NoteDisplay
          targetNote={targetNote}
          isActive={trainingState === 'listening' || trainingState === 'correct' || trainingState === 'incorrect'}
        />
      </div>

      {/* Feedback Display */}
      {validationResult && (
        <div className="mb-6">
          <FeedbackDisplay
            state={trainingState}
            centsDifference={validationResult.centsDifference}
          />
        </div>
      )}

      {/* Frequency Meter */}
      {trainingState !== 'idle' && (
        <div className="mb-6">
          <FrequencyMeter
            frequency={currentPitch?.frequency || null}
            isListening={trainingState === 'listening' || trainingState === 'correct' || trainingState === 'incorrect'}
            confidence={currentPitch?.confidence || 0}
            audioLevel={audioLevel}
          />
        </div>
      )}

      {/* Instructions */}
      {trainingState === 'idle' && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 animate-fade-in">
          <h3 className="text-xl font-semibold text-white mb-4">
            📖 Como usar:
          </h3>
          <ol className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                1
              </span>
              <span>Clique em "Iniciar Treino" e permita acesso ao microfone</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                2
              </span>
              <span>O app sorteará uma nota e uma corda para você tocar</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                3
              </span>
              <span>Toque a nota correspondente na guitarra de forma sustentada</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                4
              </span>
              <span>Se acertar, avança automaticamente. Se errar, tente novamente!</span>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default GuitarTrainer;
