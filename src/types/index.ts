/**
 * Core types for the Guitar String Trainer application
 */

/**
 * Musical note representation
 */
export interface Note {
  /** Note name (e.g., "A", "A#", "B") */
  name: string;
  /** Frequency in Hz */
  frequency: number;
  /** Guitar string number (1-6, where 1 is highest) */
  string: number;
  /** Fret number (0-12) */
  fret: number;
  /** Full display name (e.g., "A# on String 5") */
  displayName: string;
}

/**
 * Pitch detection result
 */
export interface PitchDetectionResult {
  /** Detected frequency in Hz, null if no pitch detected */
  frequency: number | null;
  /** Detected note name, null if no pitch detected */
  noteName: string | null;
  /** Confidence level (0-1) */
  confidence: number;
  /** Timestamp of detection */
  timestamp: number;
}

/**
 * Note validation result
 */
export interface ValidationResult {
  /** Whether the detected note matches the target */
  isCorrect: boolean;
  /** Target note */
  targetNote: Note;
  /** Detected note name */
  detectedNote: string | null;
  /** Detected frequency */
  detectedFrequency: number | null;
  /** Difference in cents (null if no detection) */
  centsDifference: number | null;
}

/**
 * Training session state
 */
export type TrainingState = 'idle' | 'ready' | 'listening' | 'correct' | 'incorrect';

/**
 * Audio processing configuration
 */
export interface AudioConfig {
  /** FFT size for analysis */
  fftSize: number;
  /** Sample rate */
  sampleRate: number;
  /** Buffer size */
  bufferSize: number;
  /** Minimum frequency to detect (Hz) */
  minFrequency: number;
  /** Maximum frequency to detect (Hz) */
  maxFrequency: number;
  /** Detection threshold (0-1) */
  threshold: number;
}

/**
 * Guitar tuning configuration
 */
export interface GuitarTuning {
  /** String number (1-6) */
  string: number;
  /** Open string note name */
  note: string;
  /** Open string frequency in Hz */
  frequency: number;
}

/**
 * Attempt record for persistence (API payload)
 */
export interface AttemptRecord {
  stringNumber: number;
  fret: number;
  noteName: string;
  isCorrect: boolean;
}

/**
 * Stats per string for mastery chart
 */
export interface StatsByString {
  [stringNumber: number]: { correct: number; total: number };
}
