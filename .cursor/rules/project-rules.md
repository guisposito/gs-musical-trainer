# Guitar String Trainer - Project Rules

## 🎯 Project Overview

Educational web application for guitar fretboard note memorization using real-time pitch detection with Web Audio API.

## 🏗️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: TailwindCSS
- **Audio**: Web Audio API
- **State Management**: React Hooks (useState, useEffect, useRef)

## 📋 Code Standards

### TypeScript Rules

- Always use TypeScript with strict mode enabled
- Define explicit types for all functions and variables
- Use interfaces for object shapes, types for unions/intersections
- Avoid `any` type - use `unknown` when type is truly unknown
- Export types from `src/types/index.ts`

Example:
```typescript
interface Note {
  name: string;
  frequency: number;
  string: number;
  fret: number;
}

const detectPitch = (buffer: Float32Array): number | null => {
  // Implementation
};
```

### React/Next.js Rules

- Use functional components with hooks
- Prefer `const` arrow functions over `function` declarations
- Use early returns for conditional rendering
- Name event handlers with `handle` prefix: `handleClick`, `handleStart`
- Use `use client` directive for client-side components
- Keep components focused and single-responsibility

Example:
```typescript
'use client';

const GuitarTrainer = () => {
  const handleStart = () => {
    // Implementation
  };

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <div className="container">
      {/* Content */}
    </div>
  );
};
```

### TailwindCSS Rules

- Always use Tailwind utility classes - NO inline styles or CSS modules
- Use semantic class grouping: layout → spacing → colors → typography → effects
- Use Tailwind's responsive prefixes: `md:`, `lg:`, `xl:`
- Use custom colors defined in `tailwind.config.ts`
- Use consistent spacing scale (4, 8, 12, 16, 24, 32, etc.)

Example:
```tsx
<div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-900">
  <h1 className="text-4xl font-bold text-white mb-8">
    Guitar Trainer
  </h1>
  <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
    Start
  </button>
</div>
```

### Accessibility Rules

- Add `aria-label` to interactive elements without text
- Use semantic HTML: `<button>`, `<nav>`, `<main>`, `<header>`
- Add `tabindex="0"` for custom interactive elements
- Implement keyboard navigation: `onKeyDown` handlers
- Use sufficient color contrast (WCAG AA minimum)

Example:
```tsx
<button
  onClick={handleStart}
  onKeyDown={(e) => e.key === 'Enter' && handleStart()}
  aria-label="Start guitar training session"
  tabIndex={0}
  className="px-6 py-3 bg-green-500 text-white rounded-lg"
>
  Start Training
</button>
```

## 🎸 Domain-Specific Rules

### Audio Processing

- Always request microphone permission before audio processing
- Use `getUserMedia()` with proper error handling
- Clean up audio context and streams on component unmount
- Use `AudioContext` in suspended state until user interaction
- Buffer size: 2048 samples (good balance between latency and accuracy)

Example:
```typescript
useEffect(() => {
  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  
  const cleanup = () => {
    if (audioContext) {
      audioContext.close();
    }
  };
  
  return cleanup;
}, []);
```

### Pitch Detection

- Use autocorrelation algorithm for pitch detection
- Minimum frequency: 82 Hz (E2 - 6th string)
- Maximum frequency: 1320 Hz (E6 - 1st string, 12th fret)
- Apply threshold to avoid detecting noise
- Update detection every 100ms (10 FPS is sufficient)

### Note Validation

- Tolerance: ±20 cents (configurable)
- 1 semitone = 100 cents
- Formula: `cents = 1200 × log₂(f1/f2)`
- Require 3 consecutive correct detections to confirm note
- Reset counter on incorrect detection

### Guitar Fretboard

- Standard tuning: E-A-D-G-B-E (low to high)
- 6 strings, 13 frets each (0-12)
- Total: 78 note positions
- Store as array of objects with: `{ note, frequency, string, fret }`

## 📁 File Organization

### Component Structure

```typescript
// src/components/ComponentName.tsx
'use client';

import { useState, useEffect } from 'react';
import type { ComponentProps } from '@/types';

interface ComponentNameProps {
  // Props interface
}

const ComponentName = ({ prop1, prop2 }: ComponentNameProps) => {
  // Hooks
  const [state, setState] = useState();
  
  // Event handlers
  const handleEvent = () => {
    // Implementation
  };
  
  // Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // Early returns
  if (!ready) {
    return <LoadingState />;
  }
  
  // Main render
  return (
    <div className="container">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### Utility Functions

```typescript
// src/lib/utilityName.ts
/**
 * Brief description of what this utility does
 * @param param1 - Description
 * @returns Description
 */
export const functionName = (param1: Type): ReturnType => {
  // Implementation
};
```

## 🎨 Design System

### Colors

- **Background**: `bg-gray-900` (dark), `bg-gray-50` (light)
- **Success**: `bg-green-500`, `text-green-500`
- **Error**: `bg-red-500`, `text-red-500`
- **Primary**: `bg-blue-500`, `text-blue-500`
- **Text**: `text-white` (on dark), `text-gray-900` (on light)

### Typography

- **Headings**: `text-4xl font-bold` (h1), `text-2xl font-semibold` (h2)
- **Body**: `text-base` or `text-lg`
- **Small**: `text-sm`
- **Font**: System font stack (default)

### Spacing

- Use multiples of 4: `p-4`, `m-8`, `gap-6`
- Container padding: `p-8` on mobile, `p-12` on desktop

### Animations

- Use `transition-colors`, `transition-transform`
- Duration: `duration-200` or `duration-300`
- Easing: Default (ease-in-out)

## 🧪 Testing Considerations

- Test with different microphone qualities
- Test in different browsers (Chrome, Firefox, Edge)
- Test with different guitar types (electric, acoustic)
- Test with background noise
- Test on mobile devices

## 🚀 Performance

- Debounce pitch detection updates
- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers passed to children
- Avoid re-renders: split state logically
- Clean up intervals and event listeners

## 📝 Comments

- Add JSDoc comments to all exported functions
- Explain complex algorithms (especially autocorrelation)
- Document magic numbers with constants
- Add TODO comments for future improvements

Example:
```typescript
/**
 * Converts frequency in Hz to musical note name
 * @param frequency - Frequency in Hz (e.g., 440)
 * @returns Note name with octave (e.g., "A4")
 */
export const frequencyToNote = (frequency: number): string => {
  const A4 = 440;
  const C0 = A4 * Math.pow(2, -4.75);
  // ... implementation
};
```

## 🔒 Security & Privacy

- Request microphone permission explicitly
- Show clear indicator when microphone is active
- Don't record or store audio data
- Process audio only in-browser (no server transmission)
- Explain privacy in UI

## ✅ Definition of Done

A feature is complete when:
- [ ] Code follows all rules above
- [ ] TypeScript has no errors
- [ ] Component is fully typed
- [ ] Accessibility attributes are present
- [ ] TailwindCSS is used exclusively
- [ ] Error handling is implemented
- [ ] Cleanup functions are present
- [ ] Comments explain complex logic
- [ ] Tested in browser
- [ ] No console errors

## 🎯 Core Principles

1. **User First**: Prioritize user experience over code elegance
2. **Performance**: Audio processing must be real-time (<100ms latency)
3. **Accuracy**: Pitch detection must be reliable (>95% accuracy)
4. **Simplicity**: Keep UI minimal and focused
5. **Accessibility**: Everyone should be able to use it
6. **Maintainability**: Code should be easy to understand and modify

---

**Remember**: This is an educational tool. Prioritize clarity and user experience over complexity.
