import type { Note, GuitarTuning } from '@/types';

/**
 * Afinação padrão da guitarra (E-A-D-G-B-E).
 * Corda 1 = mais aguda (Mi alto, E4) | Corda 6 = mais grave (Mi baixo, E2).
 * Contagem: corda 1 é a mais fina (perto do chão ao segurar o instrumento).
 */
export const STANDARD_TUNING: GuitarTuning[] = [
  { string: 6, note: 'E', frequency: 82.41 },   // E2 - mais grave (corda mais grossa)
  { string: 5, note: 'A', frequency: 110.00 }, // A2
  { string: 4, note: 'D', frequency: 146.83 }, // D3
  { string: 3, note: 'G', frequency: 196.00 }, // G3
  { string: 2, note: 'B', frequency: 246.94 }, // B3
  { string: 1, note: 'E', frequency: 329.63 }, // E4 - mais aguda (corda mais fina)
];

/**
 * All note names in chromatic order
 */
export const NOTE_NAMES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
];

/**
 * Generate all possible notes on the guitar fretboard up to fret 12
 * @returns Array of all notes with their positions and frequencies
 */
export const generateGuitarNotes = (): Note[] => {
  const notes: Note[] = [];
  
  STANDARD_TUNING.forEach((tuning) => {
    const openStringFreq = tuning.frequency;
    const openStringNoteIndex = NOTE_NAMES.indexOf(tuning.note);
    
    // Generate notes for frets 0-12
    for (let fret = 0; fret <= 12; fret++) {
      // Calculate frequency: f = f0 * 2^(n/12) where n is semitones above open string
      const frequency = openStringFreq * Math.pow(2, fret / 12);
      
      // Calculate note name
      const noteIndex = (openStringNoteIndex + fret) % 12;
      const noteName = NOTE_NAMES[noteIndex];
      
      notes.push({
        name: noteName,
        frequency,
        string: tuning.string,
        fret,
        displayName: `${noteName} na Corda ${tuning.string}`,
      });
    }
  });
  
  return notes;
};

/**
 * Nota da corda solta (casa 0) para uma corda
 */
const getOpenStringNoteName = (stringNumber: number): string => {
  const tuning = STANDARD_TUNING.find((t) => t.string === stringNumber);
  return tuning?.note ?? '';
};

/**
 * Lista de notas que o treino pode pedir: exclui casa 12 quando é a mesma nota da corda solta,
 * para sempre priorizar "corda solta" (casa 0) em vez de casa 12 (ex.: E na corda 6 = casa 0, nunca casa 12).
 */
export const getTrainableNotes = (): Note[] => {
  const allNotes = generateGuitarNotes();
  return allNotes.filter((note) => {
    if (note.fret !== 12) return true;
    const openNote = getOpenStringNoteName(note.string);
    return note.name !== openNote;
  });
};

/**
 * Get a random note from the available guitar notes.
 * Nunca retorna casa 12 quando a nota é a mesma da corda solta (sempre pede casa 0).
 * @returns Random note from the fretboard
 */
export const getRandomNote = (): Note => {
  const notes = getTrainableNotes();
  const randomIndex = Math.floor(Math.random() * notes.length);
  return notes[randomIndex];
};

/**
 * Find the closest note on the fretboard for a given frequency
 * @param frequency - Frequency in Hz
 * @returns Closest note or null if frequency is out of range
 */
export const findClosestNote = (frequency: number): Note | null => {
  if (frequency < 80 || frequency > 1400) {
    return null;
  }
  
  const allNotes = generateGuitarNotes();
  
  let closestNote = allNotes[0];
  let minDifference = Math.abs(frequency - closestNote.frequency);
  
  for (const note of allNotes) {
    const difference = Math.abs(frequency - note.frequency);
    if (difference < minDifference) {
      minDifference = difference;
      closestNote = note;
    }
  }
  
  return closestNote;
};

/**
 * Get all notes for a specific string
 * @param stringNumber - String number (1-6)
 * @returns Array of notes on that string
 */
export const getNotesForString = (stringNumber: number): Note[] => {
  const allNotes = generateGuitarNotes();
  return allNotes.filter(note => note.string === stringNumber);
};

/**
 * Get the note at a specific position
 * @param stringNumber - String number (1-6)
 * @param fret - Fret number (0-12)
 * @returns Note at that position or null if invalid
 */
export const getNoteAt = (stringNumber: number, fret: number): Note | null => {
  if (stringNumber < 1 || stringNumber > 6 || fret < 0 || fret > 12) {
    return null;
  }
  
  const allNotes = generateGuitarNotes();
  return allNotes.find(note => note.string === stringNumber && note.fret === fret) || null;
};
