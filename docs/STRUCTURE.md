# 📂 Project Structure - Guitar String Trainer

Estrutura visual completa do projeto.

## 🌳 File Tree

```
GS musical trainer/
│
├── 📄 README.md                 → Índice principal do projeto
│
├── 📁 docs/                     → 📚 TODA A DOCUMENTAÇÃO
│   ├── 📄 00_START_HERE.md      ⭐ COMECE AQUI!
│   ├── 📄 INDEX.md              📚 Índice de toda documentação
│   ├── 📄 README.md             → Documentação completa do projeto
│   ├── 📄 QUICK_START.md        → Início rápido (3 minutos)
│   ├── 📄 SETUP.md              → Guia detalhado de instalação
│   ├── 📄 HOW_IT_WORKS.md       → Explicação visual do sistema
│   ├── 📄 ARCHITECTURE.md       → Arquitetura técnica detalhada
│   ├── 📄 PROJECT_SUMMARY.md    → Resumo executivo do projeto
│   ├── 📄 CONTRIBUTING.md       → Guia para contribuidores
│   └── 📄 STRUCTURE.md          → Este arquivo (estrutura visual)
│
├── ⚙️ CONFIGURATION (8 files)
│   ├── 📄 package.json          → Dependências e scripts npm
│   ├── 📄 tsconfig.json         → Configuração TypeScript
│   ├── 📄 tailwind.config.ts    → Configuração TailwindCSS
│   ├── 📄 next.config.js        → Configuração Next.js
│   ├── 📄 postcss.config.js     → Configuração PostCSS
│   ├── 📄 .gitignore            → Arquivos ignorados pelo Git
│   ├── 📄 .env.example          → Template de variáveis de ambiente
│   └── 📄 LICENSE               → MIT License
│
├── 🤖 CURSOR AI (1 folder)
│   └── 📁 .cursor/
│       └── 📁 rules/
│           └── 📄 project-rules.md  → Regras completas do projeto para Cursor AI
│
└── 💻 SOURCE CODE (12 files)
    └── 📁 src/
        │
        ├── 📁 app/                  → Next.js App Router
        │   ├── 📄 layout.tsx        → Layout principal com metadata
        │   ├── 📄 page.tsx          → Página inicial (home)
        │   └── 📄 globals.css       → Estilos globais e animações
        │
        ├── 📁 components/           → Componentes React
        │   ├── 📄 GuitarTrainer.tsx     → 🎯 Componente principal (440 linhas)
        │   │                            Gerencia estado, áudio, validação
        │   │
        │   ├── 📄 NoteDisplay.tsx       → 🎵 Exibição da nota alvo
        │   │                            Mostra nota, corda, casa
        │   │
        │   ├── 📄 FrequencyMeter.tsx    → 📊 Medidor em tempo real
        │   │                            Mostra Hz, nota, confiança
        │   │
        │   └── 📄 FeedbackDisplay.tsx   → 💚❤️ Feedback visual
        │                                Verde/vermelho, acerto/erro
        │
        ├── 📁 lib/                  → Lógica de negócio e utilitários
        │   ├── 📄 pitchDetector.ts      → 🎤 Detecção de pitch (300+ linhas)
        │   │                            - Autocorrelação
        │   │                            - Inicialização áudio
        │   │                            - Setup análise
        │   │
        │   ├── 📄 frequencyConverter.ts → 🔄 Conversão Hz ↔ Nota (200+ linhas)
        │   │                            - Hz → MIDI → Nota
        │   │                            - Cálculo de cents
        │   │                            - Validação de match
        │   │
        │   └── 📄 guitarNotes.ts        → 🎸 Mapeamento do braço (150+ linhas)
        │                                - Geração de 78 posições
        │                                - Sorteio aleatório
        │                                - Busca de notas
        │
        └── 📁 types/               → Tipos TypeScript
            └── 📄 index.ts              → 📋 Todas as interfaces e types
                                         - Note, PitchDetectionResult
                                         - ValidationResult, TrainingState
                                         - AudioConfig, GuitarTuning
```

## 📊 Métricas por Categoria

### 📚 Documentação (10 arquivos em docs/)
```
docs/README.md           (~400 linhas)  - Documentação principal
docs/00_START_HERE.md    (~300 linhas)  - Comece aqui
docs/QUICK_START.md      (~50 linhas)   - Início rápido
docs/SETUP.md            (~450 linhas)  - Instalação detalhada
docs/HOW_IT_WORKS.md     (~600 linhas)  - Explicação didática
docs/ARCHITECTURE.md     (~750 linhas)  - Arquitetura técnica
docs/PROJECT_SUMMARY.md  (~500 linhas)  - Resumo executivo
docs/CONTRIBUTING.md     (~200 linhas)  - Guia de contribuição
docs/STRUCTURE.md        (~400 linhas)  - Estrutura do projeto
docs/INDEX.md            (~350 linhas)  - Índice navegável
───────────────────────────────────────────────────────
TOTAL:                   ~4000 linhas de documentação
```

### 💻 Source Code (12 arquivos)
```
Components (4 arquivos):
├── GuitarTrainer.tsx       (~440 linhas)  - Orquestrador principal
├── NoteDisplay.tsx         (~70 linhas)   - Display de nota
├── FrequencyMeter.tsx      (~90 linhas)   - Medidor de freq
└── FeedbackDisplay.tsx     (~80 linhas)   - Feedback visual

Library (3 arquivos):
├── pitchDetector.ts        (~330 linhas)  - Detecção de pitch
├── frequencyConverter.ts   (~220 linhas)  - Conversões
└── guitarNotes.ts          (~180 linhas)  - Mapeamento

App (3 arquivos):
├── layout.tsx              (~25 linhas)   - Layout
├── page.tsx                (~30 linhas)   - Home page
└── globals.css             (~50 linhas)   - Estilos

Types (1 arquivo):
└── index.ts                (~80 linhas)   - TypeScript types

Config (1 arquivo):
└── tailwind.config.ts      (~50 linhas)   - Tailwind config
───────────────────────────────────────────────────────
TOTAL:                      ~1645 linhas de código
```

### ⚙️ Configuration (7 arquivos)
```
package.json          (~30 linhas)   - Dependencies
tsconfig.json         (~35 linhas)   - TypeScript
next.config.js        (~10 linhas)   - Next.js
postcss.config.js     (~5 linhas)    - PostCSS
.gitignore            (~40 linhas)   - Git ignore
.env.example          (~5 linhas)    - Env template
LICENSE               (~20 linhas)   - MIT License
───────────────────────────────────────────────────────
TOTAL:                ~145 linhas
```

### 🤖 Cursor AI (1 arquivo)
```
project-rules.md      (~650 linhas)  - Regras completas
```

## 📈 Estatísticas Totais

```
┌─────────────────────────────────────────┐
│  TOTAL DE ARQUIVOS:       27            │
│  TOTAL DE LINHAS:         ~5700+        │
│                                         │
│  Documentação:            ~3300 (58%)   │
│  Código TypeScript:       ~1645 (29%)   │
│  Configuração:            ~145 (2.5%)   │
│  Cursor Rules:            ~650 (11%)    │
└─────────────────────────────────────────┘
```

## 🎯 Componentes por Responsabilidade

### 🎯 Orquestração
```
GuitarTrainer.tsx
├── Gerencia estado global
├── Controla ciclo de vida do áudio
├── Executa loop de detecção
├── Valida notas detectadas
└── Coordena todos os outros componentes
```

### 🎨 Apresentação (UI)
```
NoteDisplay.tsx
├── Mostra nota alvo
├── Mostra corda e casa
└── Animações de transição

FrequencyMeter.tsx
├── Exibe frequência em tempo real
├── Exibe nota detectada
├── Barra de confiança
└── Status (listening/paused)

FeedbackDisplay.tsx
├── Feedback verde (acerto)
├── Feedback vermelho (erro)
├── Diferença em cents
└── Animações de pulso
```

### 🧠 Lógica de Negócio
```
pitchDetector.ts
├── Algoritmo de autocorrelação
├── Inicialização do AudioContext
├── Setup do AnalyserNode
└── Cálculo de confiança

frequencyConverter.ts
├── Conversão Hz → MIDI
├── Conversão MIDI → Nota
├── Cálculo de cents
├── Validação de match
└── Helpers de formatação

guitarNotes.ts
├── Afinação padrão (E-A-D-G-B-E)
├── Geração de 78 notas
├── Sorteio aleatório
├── Busca por frequência
└── Queries específicas
```

### 📋 Tipos
```
types/index.ts
├── Note
├── PitchDetectionResult
├── ValidationResult
├── TrainingState
├── AudioConfig
└── GuitarTuning
```

## 🔄 Fluxo de Dados

```
User Action (Start)
        ↓
┌───────────────────┐
│  GuitarTrainer    │ ← Componente Principal
│  (Orchestrator)   │
└─────┬─────────────┘
      │
      ├─→ initializeAudio() ────→ pitchDetector.ts
      │                          (Web Audio API)
      │
      ├─→ getRandomNote() ──────→ guitarNotes.ts
      │                          (Sorteio)
      │
      ├─→ detectPitch() ────────→ pitchDetector.ts
      │                          (Autocorrelation)
      │
      ├─→ frequencyToNote() ────→ frequencyConverter.ts
      │                          (Hz → Nota)
      │
      └─→ validateNote() ───────→ frequencyConverter.ts
                                 (Comparação)
      ↓
┌─────────────────────────────────────────┐
│  UI Components (Presentation)           │
├─────────────────────────────────────────┤
│  NoteDisplay      → Mostra alvo         │
│  FrequencyMeter   → Mostra detecção     │
│  FeedbackDisplay  → Mostra resultado    │
└─────────────────────────────────────────┘
```

## 📦 Dependências

### Production Dependencies
```json
{
  "next": "^14.2.0",           // Framework
  "react": "^18.3.0",          // UI Library
  "react-dom": "^18.3.0"       // React DOM
}
```

### Development Dependencies
```json
{
  "@types/node": "^20.14.0",
  "@types/react": "^18.3.0",
  "@types/react-dom": "^18.3.0",
  "autoprefixer": "^10.4.19",
  "postcss": "^8.4.38",
  "tailwindcss": "^3.4.3",
  "typescript": "^5.4.5"
}
```

**Total**: 10 pacotes npm

## 🎨 Design Tokens (TailwindCSS)

### Cores
```css
gray-900     → Background escuro
gray-800     → Cards
gray-700     → Borders
gray-300     → Text secundário
white        → Text primário

green-500    → Success
red-500      → Error
blue-500     → Primary
```

### Espaçamento
```css
p-4, p-6, p-8     → Padding
m-4, m-6, m-8     → Margin
gap-4, gap-6      → Grid/Flex gap
```

### Tipografia
```css
text-sm       → 0.875rem (14px)
text-base     → 1rem (16px)
text-lg       → 1.125rem (18px)
text-2xl      → 1.5rem (24px)
text-4xl      → 2.25rem (36px)
```

## 🧩 Patterns Utilizados

### Component Patterns
- ✅ **Functional Components** (com hooks)
- ✅ **Props Interface** (TypeScript)
- ✅ **Early Returns** (conditional rendering)
- ✅ **Event Handler Prefix** (`handle*`)
- ✅ **Controlled Components**

### State Management
- ✅ **useState** para estado local
- ✅ **useEffect** para side effects
- ✅ **useRef** para valores mutáveis
- ✅ **useCallback** para memoização

### Code Organization
- ✅ **Separation of Concerns** (UI vs Logic)
- ✅ **Single Responsibility** (cada arquivo uma responsabilidade)
- ✅ **DRY** (Don't Repeat Yourself)
- ✅ **Modular** (imports/exports claros)

## 🔍 Como Navegar

### Quero entender...

**...a estrutura geral?**
→ Você está no lugar certo! (docs/STRUCTURE.md)

**...como começar?**
→ [00_START_HERE.md](./00_START_HERE.md)

**...toda a documentação?**
→ [INDEX.md](./INDEX.md)

**...como funciona o sistema?**
→ [HOW_IT_WORKS.md](./HOW_IT_WORKS.md)

**...a arquitetura técnica?**
→ [ARCHITECTURE.md](./ARCHITECTURE.md)

**...o código principal?**
→ `../src/components/GuitarTrainer.tsx`

**...os algoritmos?**
→ `../src/lib/pitchDetector.ts` e `frequencyConverter.ts`

## 📊 Complexidade do Código

### Por Arquivo (linhas de código):
```
Mais complexos:
├── GuitarTrainer.tsx         440 linhas  ⭐⭐⭐⭐⭐
├── pitchDetector.ts          330 linhas  ⭐⭐⭐⭐⭐
├── frequencyConverter.ts     220 linhas  ⭐⭐⭐⭐
├── guitarNotes.ts            180 linhas  ⭐⭐⭐

Médios:
├── FrequencyMeter.tsx        90 linhas   ⭐⭐⭐
├── FeedbackDisplay.tsx       80 linhas   ⭐⭐
├── NoteDisplay.tsx           70 linhas   ⭐⭐

Simples:
├── layout.tsx                25 linhas   ⭐
├── page.tsx                  30 linhas   ⭐
└── globals.css               50 linhas   ⭐
```

## 🎯 Entry Points

### Para Executar:
```bash
npm run dev          # Desenvolvimento (hot reload)
npm run build        # Build para produção
npm start            # Servidor de produção
npm run lint         # Linter
npm run type-check   # Verificar tipos
```

### Arquivos de Entrada:
```
Browser → http://localhost:3000
              ↓
        src/app/layout.tsx (wraps everything)
              ↓
        src/app/page.tsx (home page)
              ↓
        <GuitarTrainer /> (main component)
```

## 📚 Documentação por Público

### 🎸 Músicos/Usuários:
```
00_START_HERE.md → QUICK_START.md → README.md
```

### 👨‍💻 Desenvolvedores:
```
00_START_HERE.md → ARCHITECTURE.md → src/
```

### 🎨 Designers:
```
README.md → HOW_IT_WORKS.md → src/components/
```

### 🤝 Contribuidores:
```
CONTRIBUTING.md → PROJECT_SUMMARY.md → .cursor/rules/
```

---

**Estrutura completa, organizada e documentada!** 📂✨
