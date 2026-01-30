import { NOTE_NAMES } from './guitarNotes';

/**
 * Reference frequency for A4 (MIDI note 69)
 */
const A4_FREQUENCY = 440;

/**
 * MIDI note number for A4
 */
const A4_MIDI = 69;

/**
 * Tolerância em cents para considerar acerto (bem generosa para detecção imprecisa)
 * 1 semitom = 100 cents | 150 cents ≈ 1,5 semitons
 */
export const CENT_TOLERANCE = 150;

/**
 * Tolerância em Hz (detecção pode errar em graves; aceita diferença maior)
 */
export const HZ_TOLERANCE = 50;

/**
 * Convert frequency in Hz to MIDI note number
 * Formula: n = 12 × log₂(f/440) + 69
 * @param frequency - Frequency in Hz
 * @returns MIDI note number (float)
 */
export const frequencyToMidi = (frequency: number): number => {
  return 12 * Math.log2(frequency / A4_FREQUENCY) + A4_MIDI;
};

/**
 * Convert MIDI note number to frequency in Hz
 * Formula: f = 440 × 2^((n-69)/12)
 * @param midiNote - MIDI note number
 * @returns Frequency in Hz
 */
export const midiToFrequency = (midiNote: number): number => {
  return A4_FREQUENCY * Math.pow(2, (midiNote - A4_MIDI) / 12);
};

/**
 * Convert frequency to note name (without octave)
 * @param frequency - Frequency in Hz
 * @returns Note name (e.g., "A", "A#", "B")
 */
export const frequencyToNoteName = (frequency: number): string => {
  const midiNote = frequencyToMidi(frequency);
  const noteNumber = Math.round(midiNote) % 12;
  return NOTE_NAMES[noteNumber];
};

/**
 * Convert frequency to note name with octave
 * @param frequency - Frequency in Hz
 * @returns Note name with octave (e.g., "A4", "C#5")
 */
export const frequencyToNoteWithOctave = (frequency: number): string => {
  const midiNote = frequencyToMidi(frequency);
  const roundedMidi = Math.round(midiNote);
  const noteNumber = roundedMidi % 12;
  const octave = Math.floor(roundedMidi / 12) - 1;
  return `${NOTE_NAMES[noteNumber]}${octave}`;
};

/**
 * Calculate the difference in cents between two frequencies
 * Formula: cents = 1200 × log₂(f1/f2)
 * @param frequency1 - First frequency in Hz
 * @param frequency2 - Second frequency in Hz
 * @returns Difference in cents
 */
export const calculateCentsDifference = (
  frequency1: number,
  frequency2: number
): number => {
  return 1200 * Math.log2(frequency1 / frequency2);
};

/**
 * Check if two frequencies match within tolerance.
 * Aceita se estiver dentro de X cents OU dentro de Y Hz (para notas graves).
 * @param targetFrequency - Target frequency in Hz
 * @param detectedFrequency - Detected frequency in Hz
 * @param toleranceCents - Tolerance in cents (default: CENT_TOLERANCE)
 * @returns True if frequencies match within tolerance
 */
export const isFrequencyMatch = (
  targetFrequency: number,
  detectedFrequency: number,
  toleranceCents: number = CENT_TOLERANCE
): boolean => {
  const centsDiff = Math.abs(calculateCentsDifference(detectedFrequency, targetFrequency));
  const hzDiff = Math.abs(detectedFrequency - targetFrequency);
  // Aceita por cents (preciso em qualquer oitava) OU por Hz (ajuda em graves)
  return centsDiff <= toleranceCents || hzDiff <= HZ_TOLERANCE;
};

/**
 * Default percentage tolerance for frequency match (20% up/down).
 * Use 0.1 for 10%, 0.2 for 20%.
 */
export const FREQUENCY_PERCENT_TOLERANCE = 0.2;

/**
 * Check if detected frequency is within a percentage of the target frequency.
 * E.g. 0.2 = 20% tolerance (accept 80%–120% of target).
 * @param targetFrequency - Expected frequency in Hz
 * @param detectedFrequency - Detected frequency in Hz
 * @param percentTolerance - Tolerance as decimal (0.1 = 10%, 0.2 = 20%)
 * @returns True if detected is within range
 */
export const isFrequencyMatchWithinPercent = (
  targetFrequency: number,
  detectedFrequency: number,
  percentTolerance: number = FREQUENCY_PERCENT_TOLERANCE
): boolean => {
  if (targetFrequency <= 0) return false;
  const low = targetFrequency * (1 - percentTolerance);
  const high = targetFrequency * (1 + percentTolerance);
  return detectedFrequency >= low && detectedFrequency <= high;
};

/**
 * Remove octave number from note name (e.g. "F#5" -> "F#", "A4" -> "A")
 * Garante que o match seja só pelo nome da nota, sem o número da oitava.
 */
export const normalizeNoteName = (noteName: string): string => {
  return noteName.replace(/\d+$/, '').trim();
};

/**
 * Check if two note names match (só pelo nome, ignora oitava se vier tipo "F#5")
 * @param targetNote - Target note name (e.g., "A#")
 * @param detectedNote - Detected note name (e.g., "A#" or "A#5")
 * @returns True if notes match
 */
export const isNoteMatch = (targetNote: string, detectedNote: string): boolean => {
  const target = normalizeNoteName(targetNote);
  const detected = normalizeNoteName(detectedNote);
  return target === detected;
};

/**
 * Get the expected frequency for a note name
 * Uses the closest octave to 440Hz (A4) as reference
 * @param noteName - Note name (e.g., "A", "C#")
 * @returns Frequency in Hz
 */
export const getNoteFrequency = (noteName: string): number => {
  const noteIndex = NOTE_NAMES.indexOf(noteName);
  if (noteIndex === -1) {
    throw new Error(`Invalid note name: ${noteName}`);
  }
  
  // Calculate semitones from A4
  const semitonesFromA4 = noteIndex - NOTE_NAMES.indexOf('A');
  
  // Use octave 4 as reference (around guitar range)
  const midiNote = A4_MIDI + semitonesFromA4;
  
  return midiToFrequency(midiNote);
};

/**
 * Format cents difference for display
 * @param cents - Cents difference
 * @returns Formatted string (e.g., "+15¢", "-8¢")
 */
export const formatCents = (cents: number): string => {
  const sign = cents >= 0 ? '+' : '';
  return `${sign}${Math.round(cents)}¢`;
};

/**
 * Check if a frequency is in the valid guitar range
 * @param frequency - Frequency in Hz
 * @returns True if frequency is in range (80-1400 Hz)
 */
export const isValidGuitarFrequency = (frequency: number): boolean => {
  return frequency >= 80 && frequency <= 1400;
};
