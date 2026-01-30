import type { AudioConfig, PitchDetectionResult } from '@/types';
import { frequencyToNoteName, isValidGuitarFrequency } from './frequencyConverter';

/**
 * Default audio configuration for pitch detection
 */
export const DEFAULT_AUDIO_CONFIG: AudioConfig = {
  fftSize: 4096,       // Increased for better low frequency detection
  sampleRate: 44100,
  bufferSize: 4096,    // Increased buffer size
  minFrequency: 80,    // E2 (6th string)
  maxFrequency: 1400,  // ~E6 (1st string, 12th fret + harmonics)
  threshold: 0.02,     // Menor sensibilidade a ruído (só detecta com sinal mais claro)
};

/**
 * Autocorrelation pitch detection algorithm
 * Finds the fundamental frequency by detecting periodicity in the signal
 * 
 * @param buffer - Audio samples buffer
 * @param sampleRate - Sample rate in Hz
 * @returns Detected frequency in Hz or null if no pitch detected
 */
export const detectPitchAutocorrelation = (
  buffer: Float32Array,
  sampleRate: number
): number | null => {
  const bufferSize = buffer.length;
  
  // Calculate RMS (Root Mean Square) to check if signal is strong enough
  let sumSquares = 0;
  for (let i = 0; i < bufferSize; i++) {
    sumSquares += buffer[i] * buffer[i];
  }
  const rms = Math.sqrt(sumSquares / bufferSize);
  
  // If signal is too weak, return null
  if (rms < DEFAULT_AUDIO_CONFIG.threshold) {
    return null;
  }
  
  // Normalize buffer for better detection
  const maxAmplitude = Math.max(...Array.from(buffer).map(Math.abs));
  if (maxAmplitude > 0) {
    for (let i = 0; i < bufferSize; i++) {
      buffer[i] = buffer[i] / maxAmplitude;
    }
  }
  
  // Autocorrelation calculation
  // We're looking for the lag (delay) where the signal correlates best with itself
  const minPeriod = Math.floor(sampleRate / DEFAULT_AUDIO_CONFIG.maxFrequency);
  const maxPeriod = Math.floor(sampleRate / DEFAULT_AUDIO_CONFIG.minFrequency);
  
  let bestCorrelation = 0;
  let bestOffset = -1;
  
  // For each possible period (lag)
  for (let offset = minPeriod; offset <= maxPeriod; offset++) {
    let correlation = 0;
    
    // Calculate correlation at this offset
    for (let i = 0; i < bufferSize - offset; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }
    
    // Normalize by the number of samples
    correlation = 1 - correlation / (bufferSize - offset);
    
    // Track the best correlation
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }
  
  // Tolerância menor para a nota aparecer mais na UI (0.15 = aceita mais detecções)
  if (bestCorrelation < 0.15 || bestOffset === -1) {
    return null;
  }
  
  // Convert period (samples) to frequency (Hz)
  const frequency = sampleRate / bestOffset;
  
  // Validate frequency is in expected range
  if (!isValidGuitarFrequency(frequency)) {
    return null;
  }
  
  return frequency;
};

/**
 * Parabolic interpolation to refine pitch detection accuracy
 * Takes three points and fits a parabola to find the peak more precisely
 * 
 * @param left - Correlation value at offset-1
 * @param center - Correlation value at offset
 * @param right - Correlation value at offset+1
 * @param offset - The offset where center is located
 * @returns Refined offset (float)
 */
const parabolicInterpolation = (
  left: number,
  center: number,
  right: number,
  offset: number
): number => {
  const a = (left - 2 * center + right) / 2;
  const b = (right - left) / 2;
  
  if (a === 0) {
    return offset;
  }
  
  return offset - b / (2 * a);
};

/**
 * Enhanced autocorrelation with parabolic interpolation for better accuracy
 * 
 * @param buffer - Audio samples buffer
 * @param sampleRate - Sample rate in Hz
 * @returns Detected frequency in Hz or null if no pitch detected
 */
export const detectPitchEnhanced = (
  buffer: Float32Array,
  sampleRate: number
): number | null => {
  const bufferSize = buffer.length;
  
  // Check signal strength
  let sumSquares = 0;
  for (let i = 0; i < bufferSize; i++) {
    sumSquares += buffer[i] * buffer[i];
  }
  const rms = Math.sqrt(sumSquares / bufferSize);
  
  if (rms < DEFAULT_AUDIO_CONFIG.threshold) {
    return null;
  }
  
  const minPeriod = Math.floor(sampleRate / DEFAULT_AUDIO_CONFIG.maxFrequency);
  const maxPeriod = Math.floor(sampleRate / DEFAULT_AUDIO_CONFIG.minFrequency);
  
  const correlations: number[] = [];
  
  // Calculate autocorrelation for all offsets
  for (let offset = minPeriod; offset <= maxPeriod; offset++) {
    let correlation = 0;
    
    for (let i = 0; i < bufferSize - offset; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }
    
    correlation = 1 - correlation / (bufferSize - offset);
    correlations.push(correlation);
  }
  
  // Find the peak
  let bestIndex = 0;
  let bestCorrelation = correlations[0];
  
  for (let i = 1; i < correlations.length; i++) {
    if (correlations[i] > bestCorrelation) {
      bestCorrelation = correlations[i];
      bestIndex = i;
    }
  }
  
  if (bestCorrelation < 0.5) {
    return null;
  }
  
  // Apply parabolic interpolation if we have neighbors
  let refinedOffset = minPeriod + bestIndex;
  
  if (bestIndex > 0 && bestIndex < correlations.length - 1) {
    refinedOffset = parabolicInterpolation(
      correlations[bestIndex - 1],
      correlations[bestIndex],
      correlations[bestIndex + 1],
      minPeriod + bestIndex
    );
  }
  
  const frequency = sampleRate / refinedOffset;
  
  if (!isValidGuitarFrequency(frequency)) {
    return null;
  }
  
  return frequency;
};

/**
 * Main pitch detection function with full result object
 * 
 * @param buffer - Audio samples buffer
 * @param sampleRate - Sample rate in Hz
 * @param useEnhanced - Whether to use enhanced detection (default: true)
 * @returns Pitch detection result with frequency, note, and confidence
 */
export const detectPitch = (
  buffer: Float32Array,
  sampleRate: number,
  useEnhanced: boolean = true
): PitchDetectionResult => {
  const frequency = useEnhanced
    ? detectPitchEnhanced(buffer, sampleRate)
    : detectPitchAutocorrelation(buffer, sampleRate);
  
  const noteName = frequency ? frequencyToNoteName(frequency) : null;
  
  // Calculate confidence based on RMS and correlation
  let sumSquares = 0;
  for (let i = 0; i < buffer.length; i++) {
    sumSquares += buffer[i] * buffer[i];
  }
  const rms = Math.sqrt(sumSquares / buffer.length);
  // Adjust confidence calculation for lower threshold
  const confidence = Math.min(rms / 0.05, 1);
  
  return {
    frequency,
    noteName,
    confidence,
    timestamp: Date.now(),
  };
};

/**
 * Initialize audio context and get microphone access.
 * AudioContext is created FIRST (sync) so it's in the same user gesture as the click.
 */
export const initializeAudio = async (): Promise<{
  audioContext: AudioContext;
  stream: MediaStream;
}> => {
  // Create AudioContext IMMEDIATELY (same sync turn as user click) - critical for Chrome
  const audioContext = new AudioContext();
  
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: true,
      channelCount: 1,
    },
  });
  
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
  
  if (audioContext.state !== 'running') {
    throw new Error(
      `AudioContext não iniciou (estado: ${audioContext.state}). ` +
      'Recarregue a página e clique em "Iniciar Treino" novamente.'
    );
  }
  
  return { audioContext, stream };
};

/**
 * Setup audio analysis pipeline using AnalyserNode
 */
export const setupAudioAnalysis = (
  audioContext: AudioContext,
  stream: MediaStream
): AnalyserNode => {
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  
  analyser.fftSize = DEFAULT_AUDIO_CONFIG.fftSize;
  analyser.smoothingTimeConstant = 0.3;
  analyser.minDecibels = -90;
  analyser.maxDecibels = -10;
  
  source.connect(analyser);
  
  return analyser;
};

/**
 * Shared buffer updated by ScriptProcessor - used when Analyser path fails
 */
export type AudioBufferRef = { current: Float32Array | null };

/**
 * Setup audio capture using ScriptProcessorNode.
 * Also connects source -> gain(0) -> destination so Chrome actually runs the graph.
 */
export const setupAudioWithScriptProcessor = (
  audioContext: AudioContext,
  stream: MediaStream,
  bufferRef: { current: Float32Array | null }
): (() => void) => {
  const bufferSize = 2048;
  bufferRef.current = new Float32Array(bufferSize);

  const source = audioContext.createMediaStreamSource(stream);
  const processor = audioContext.createScriptProcessor(bufferSize, 1, 1);
  
  processor.onaudioprocess = (event: AudioProcessingEvent) => {
    const input = event.inputBuffer.getChannelData(0);
    if (bufferRef.current && input.length <= bufferRef.current.length) {
      bufferRef.current.set(input.subarray(0, bufferRef.current.length));
    }
  };
  
  const silentGain = audioContext.createGain();
  silentGain.gain.value = 0;
  
  source.connect(processor);
  processor.connect(silentGain);
  silentGain.connect(audioContext.destination);
  
  const disconnect = () => {
    try {
      source.disconnect();
      processor.disconnect();
      silentGain.disconnect();
    } catch (_) {}
  };
  
  return disconnect;
};
