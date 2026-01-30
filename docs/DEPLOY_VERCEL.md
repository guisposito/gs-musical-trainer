# Deploy na Vercel

## Erro "DEFAULT_AUDIO_CONFIG is declared but its value is never read"

Esse erro aparece quando o **GuitarTrainer.tsx** ainda importa `DEFAULT_AUDIO_CONFIG` do `pitchDetector` sem usar. A versão atual do projeto **já remove esse import**.

**O que fazer:**

1. **Confirme que está usando o código mais recente**
   - No seu repositório, o arquivo `src/components/GuitarTrainer.tsx` não deve ter `DEFAULT_AUDIO_CONFIG` na linha de import do `@/lib/pitchDetector`.
   - A importação deve estar assim:
   ```ts
   import {
     initializeAudio,
     setupAudioWithScriptProcessor,
     detectPitch,
   } from '@/lib/pitchDetector';
   ```

2. **Faça commit e push das alterações**
   ```bash
   git add .
   git commit -m "fix: remove unused DEFAULT_AUDIO_CONFIG import for Vercel build"
   git push origin main
   ```

3. **Na Vercel**
   - O deploy deve rodar de novo automaticamente após o push.
   - Se não rodar, em **Deployments** clique em **Redeploy** no último deployment.

Depois do push do código correto, o `npm run build` (e o deploy) deve passar.
