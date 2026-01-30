'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import type { Note, TrainingState, PitchDetectionResult, ValidationResult, AttemptRecord } from '@/types';
import { getRandomNote } from '@/lib/guitarNotes';
import { 
  initializeAudio, 
  setupAudioWithScriptProcessor, 
  detectPitch,
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

  const { data: session, status: sessionStatus } = useSession();
  const sessionRef = useRef(session);
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  // Mantém o ref em sync com o state para o loop de detecção sempre ver a nota atual
  useEffect(() => {
    targetNoteRef.current = targetNote;
  }, [targetNote]);

  /** Fire-and-forget: record attempt when user is logged in */
  const recordAttempt = useCallback((payload: AttemptRecord) => {
    if (sessionStatus !== 'authenticated' || !sessionRef.current?.user) return;
    fetch('/api/attempts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  }, [sessionStatus]);

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

    recordAttempt({
      stringNumber: noteToValidate.string,
      fret: noteToValidate.fret,
      noteName: noteToValidate.name,
      isCorrect: result.isCorrect,
    });

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
  }, [recordAttempt]);

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
    <div className="w-full max-w-2xl mx-auto">
      {/* Error Message */}
      {error && (
        <div className="bg-brand-red/90 text-white rounded-xl p-4 sm:p-5 mb-6 animate-fade-in shadow-brand border border-brand-red-dark/50">
          <p className="font-semibold">⚠️ Erro</p>
          <p className="text-sm mt-1 opacity-95">{error}</p>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        {trainingState === 'idle' ? (
          <button
            onClick={handleStart}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            aria-label="Iniciar treino de guitarra"
            tabIndex={0}
            className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-brand-red hover:bg-brand-red-light text-white text-base sm:text-lg font-semibold rounded-xl shadow-brand hover:shadow-brand-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-brand-red-dark/50"
          >
            🎸 Iniciar Treino
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleStop}
              onKeyDown={(e) => e.key === 'Enter' && handleStop()}
              aria-label="Parar treino de guitarra"
              tabIndex={0}
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-dark-800 hover:bg-dark-700 text-white text-base font-semibold rounded-xl border border-dark-600 transition-all duration-200 hover:border-brand-red/50"
            >
              ⏹ Parar Treino
            </button>
            <button
              onClick={handleSkipToNext}
              onKeyDown={(e) => e.key === 'Enter' && handleSkipToNext()}
              aria-label="Pular para próxima nota"
              tabIndex={0}
              className="px-5 sm:px-6 py-3.5 sm:py-4 bg-dark-700 hover:bg-dark-600 text-zinc-300 text-base font-medium rounded-xl border border-dark-600 hover:border-brand-red/30 transition-all duration-200"
            >
              Próxima nota →
            </button>
          </div>
        )}
      </div>

      {/* Score Counter */}
      {trainingState !== 'idle' && (
        <div className="text-center mb-5 sm:mb-6 py-3 px-4 rounded-xl bg-dark-800/80 border border-dark-600/50 inline-block mx-auto w-full sm:w-auto min-w-[120px]">
          <p className="text-zinc-500 text-xs sm:text-sm uppercase tracking-wider mb-1">Notas corretas</p>
          <p className="text-4xl sm:text-5xl font-bold text-brand-red tabular-nums">{correctCount}</p>
        </div>
      )}

      {/* Note Display */}
      <div className="mb-5 sm:mb-6">
        <NoteDisplay
          targetNote={targetNote}
          isActive={trainingState === 'listening' || trainingState === 'correct' || trainingState === 'incorrect'}
        />
      </div>

      {/* Feedback Display */}
      {validationResult && (
        <div className="mb-5 sm:mb-6">
          <FeedbackDisplay
            state={trainingState}
            centsDifference={validationResult.centsDifference}
          />
        </div>
      )}

      {/* Frequency Meter */}
      {trainingState !== 'idle' && (
        <div className="mb-5 sm:mb-6">
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
        <div className="bg-dark-800/80 rounded-2xl p-5 sm:p-6 border border-dark-600/50 animate-fade-in">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-brand-red">📖</span> Como usar
          </h3>
          <ol className="space-y-3 text-zinc-400 text-sm sm:text-base">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-brand-red rounded-lg flex items-center justify-center text-white text-sm font-bold">
                1
              </span>
              <span>Clique em &quot;Iniciar Treino&quot; e permita o microfone</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-brand-red rounded-lg flex items-center justify-center text-white text-sm font-bold">
                2
              </span>
              <span>O app sorteia uma nota e corda para você tocar</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-brand-red rounded-lg flex items-center justify-center text-white text-sm font-bold">
                3
              </span>
              <span>Toque a nota de forma sustentada na guitarra</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-brand-red rounded-lg flex items-center justify-center text-white text-sm font-bold">
                4
              </span>
              <span>Acertou? Avança sozinho. Errou? Tente de novo!</span>
            </li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default GuitarTrainer;
