# 🎯 How It Works - Guitar String Trainer

Entenda como funciona o sistema de forma simples e visual.

## 🎸 Fluxo do Usuário

```
┌──────────────────────────────────────────────────────────────┐
│ 1️⃣  INÍCIO                                                    │
│                                                               │
│  Você: Clica "🎸 Iniciar Treino"                             │
│  App:  Pede permissão de microfone                           │
│  Você: Permite acesso                                         │
│  App:  Sorteia primeira nota (ex: "F# na Corda 5")          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ 2️⃣  TREINO ATIVO                                             │
│                                                               │
│  ┌────────────────────────────────────────────────┐          │
│  │          TELA MOSTRA:                          │          │
│  │                                                │          │
│  │              F#          ← Nota alvo           │          │
│  │          Corda 5         ← Corda alvo          │          │
│  │           Casa 2         ← Posição             │          │
│  │                                                │          │
│  │  Frequência: 185 Hz      ← Detectando você    │          │
│  │  Nota: F#                ← Em tempo real       │          │
│  │  Confiança: ████████░░ 80%                     │          │
│  └────────────────────────────────────────────────┘          │
│                                                               │
│  Você: Toca F# na corda 5, casa 2                           │
│  App:  Escuta e detecta em tempo real                        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ 3️⃣  VALIDAÇÃO                                                │
│                                                               │
│  Se ACERTOU:                    Se ERROU:                    │
│  ┌──────────────────────┐      ┌──────────────────────┐     │
│  │    ✓ Acertou!       │      │    ✗ Tente novamente │     │
│  │                      │      │                      │     │
│  │  [Fundo verde]       │      │  [Fundo vermelho]    │     │
│  │  Avançando...        │      │  Mesma nota          │     │
│  └──────────────────────┘      └──────────────────────┘     │
│           ↓                              ↓                   │
│    Nova nota sorteada             Tente de novo             │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

## 🔄 Como o App Detecta Sua Nota

### Passo a Passo Técnico Simplificado

```
Você toca a guitarra
        ↓
   Microfone capta o som
        ↓
   [SOM = ondas de áudio]
        ↓
┌─────────────────────────┐
│  Web Audio API          │
│  Converte som em dados  │
└─────────────────────────┘
        ↓
   [DADOS = números]
        ↓
┌─────────────────────────┐
│  Algoritmo              │
│  Encontra frequência    │
│  (ex: 440 Hz)           │
└─────────────────────────┘
        ↓
┌─────────────────────────┐
│  Conversor              │
│  Hz → Nota musical      │
│  440 Hz = A             │
└─────────────────────────┘
        ↓
┌─────────────────────────┐
│  Validador              │
│  Compara com nota alvo  │
│  A = A? ✓               │
└─────────────────────────┘
        ↓
   Mostra resultado na tela
```

## 🎼 Conversão de Frequência para Nota

### Como o app sabe qual nota você tocou?

Cada nota tem uma **frequência específica** em Hertz (Hz):

```
Nota    Frequência      Exemplo
─────────────────────────────────────────
C       ~261 Hz         Dó
C#      ~277 Hz         Dó sustenido
D       ~293 Hz         Ré
D#      ~311 Hz         Ré sustenido
E       ~329 Hz         Mi
F       ~349 Hz         Fá
F#      ~370 Hz         Fá sustenido
G       ~392 Hz         Sol
G#      ~415 Hz         Sol sustenido
A       440 Hz          Lá (referência!)
A#      ~466 Hz         Lá sustenido
B       ~493 Hz         Si
```

**Processo**:
1. Microfone capta: **370 Hz**
2. App calcula: "370 Hz está mais próximo de F#"
3. App converte: **370 Hz → F#**
4. App compara: F# = F#? ✓ Acertou!

### Fórmula Mágica 🎩

```
Frequência = 440 × 2^(semitons/12)

Exemplo: F# (3 semitons acima de Lá)
F# = 440 × 2^(3/12)
F# = 440 × 1.189
F# ≈ 523 Hz (na oitava mais alta)
```

## 🎯 Tolerância: Por que +/- 20 cents?

### O que são "cents"?

- **1 semitom** = 100 cents
- **20 cents** = 1/5 de semitom
- **Tolerância de ±20 cents** = pequena desafinação é aceita

### Visualização:

```
        A                 A#                 B
        │                 │                 │
        ├─────────────────┼─────────────────┤
     440 Hz            466 Hz            493 Hz
        
        │←─ 100 cents ─→│
        
Tolerância do app:
        ├──┤                              
         20c
         
Você toca: 445 Hz
Diferença: +19 cents
Resultado: ✓ Aceito! (dentro de ±20)

Você toca: 466 Hz (A#)
Diferença: +100 cents (1 semitom!)
Resultado: ✗ Errado! (fora de ±20)
```

## 🔬 Algoritmo de Autocorrelação

### O que faz?

Encontra o **padrão repetitivo** no som (= frequência fundamental)

### Analogia:

Imagine que você está ouvindo:
```
"LALALALALALALALALA..."

Pergunta: Qual o intervalo de repetição?

Resposta: "LA" se repete a cada 2 letras

No áudio:
- "LA" = um ciclo da onda sonora
- 2 letras = período
- Frequência = 1 / período
```

### Técnico:

```
Buffer de áudio: [0.1, 0.5, 0.3, -0.2, -0.5, -0.3, 0.1, 0.5, ...]
                  └───── padrão ──────┘ └───── repete! ──────┘
                  
Autocorrelação detecta: "Hey, isso se repete a cada 6 samples!"

Período: 6 samples
Taxa de amostragem: 44100 Hz
Frequência: 44100 / 6 = 7350 Hz (exemplo simplificado)
```

## 🎸 Mapa do Braço da Guitarra

### Como o app conhece todas as notas?

```
Corda 1 (E) ─┬─ Casa 0: E (329 Hz)
             ├─ Casa 1: F (349 Hz)
             ├─ Casa 2: F# (370 Hz)
             ├─ Casa 3: G (392 Hz)
             ├─ ... até casa 12
             
Corda 2 (B) ─┬─ Casa 0: B (246 Hz)
             ├─ Casa 1: C (261 Hz)
             ├─ ... até casa 12
             
... (total de 6 cordas × 13 casas = 78 posições)
```

### Geração Automática:

```javascript
// Para cada corda
for (let string = 1; string <= 6; string++) {
  const openFreq = TUNING[string]; // Ex: E = 329 Hz
  
  // Para cada casa
  for (let fret = 0; fret <= 12; fret++) {
    // Fórmula: cada casa = +1 semitom = × 2^(1/12)
    const frequency = openFreq × (2 ** (fret / 12));
    
    // Salva: { nota, frequência, corda, casa }
  }
}
```

## 🧠 Por que 3 Detecções Consecutivas?

### Problema sem contador:

```
Frame 1: Você tocou A# mas microfone captou ruído → Detecta A → ✗ Erro!
         Frustração: "Mas eu toquei certo!"
```

### Solução com 3 consecutivas:

```
Frame 1: Detecta A#  → contador = 1
Frame 2: Detecta A#  → contador = 2
Frame 3: Detecta A#  → contador = 3 → ✓ Confirma!

Se houver ruído:
Frame 1: Detecta A#  → contador = 1
Frame 2: Detecta A   → contador = 0 (reset)
Frame 3: Detecta A#  → contador = 1
Frame 4: Detecta A#  → contador = 2
Frame 5: Detecta A#  → contador = 3 → ✓ Confirma!
```

**Benefício**: Garante nota sustentada e filtrada de ruídos.

## ⚡ Performance: 60 FPS

### O que significa?

- **60 FPS** = 60 frames por segundo
- **1 frame** = 16.67 ms
- **Detecção** acontece 60 vezes por segundo
- **Latência** < 100ms (imperceptível!)

### Timeline:

```
0ms     Você toca a nota
        ↓
16ms    Frame 1: Primeira detecção
        ↓
32ms    Frame 2: Segunda detecção
        ↓
48ms    Frame 3: Terceira detecção → ✓ Confirma!
        ↓
50ms    Mostra feedback verde
        
Total: 50ms = praticamente instantâneo!
```

## 🎨 Interface Visual

### Estados Visuais:

```
┌──────────────────────────────┐
│ IDLE (Parado)                │
│ ┌────────────────────────┐   │
│ │  [Botão Verde Grande]  │   │
│ │   🎸 Iniciar Treino    │   │
│ └────────────────────────┘   │
└──────────────────────────────┘

┌──────────────────────────────┐
│ LISTENING (Ouvindo)          │
│ ┌────────────────────────┐   │
│ │      Nota: F#          │   │
│ │      Corda 5           │   │
│ │  [Ponto azul pulsando] │   │
│ │  Aguardando você...    │   │
│ └────────────────────────┘   │
└──────────────────────────────┘

┌──────────────────────────────┐
│ CORRECT (Acertou!)           │
│ ┌────────────────────────┐   │
│ │  [FUNDO VERDE BRILHA]  │   │
│ │         ✓              │   │
│ │      Acertou!          │   │
│ │   Avançando...         │   │
│ └────────────────────────┘   │
└──────────────────────────────┘

┌──────────────────────────────┐
│ INCORRECT (Errou)            │
│ ┌────────────────────────┐   │
│ │ [FUNDO VERMELHO BRILHA]│   │
│ │         ✗              │   │
│ │   Tente novamente      │   │
│ └────────────────────────┘   │
└──────────────────────────────┘
```

## 🔒 Privacidade

### O que o app faz com seu áudio?

```
Microfone → [Processamento LOCAL] → Frequência → Validação
                    ↓
            Nada é gravado!
            Nada é enviado!
            Nada é salvo!
```

**Garantias**:
- ✅ Processamento 100% no navegador
- ✅ Nenhum dado sai do seu computador
- ✅ Nenhum áudio é gravado
- ✅ Nenhum servidor externo
- ✅ Você controla o microfone

## 🎓 Conceitos Musicais

### Afinação Padrão da Guitarra:

```
Corda 1 (mais fina)  : E (Mi)  - 329 Hz
Corda 2              : B (Si)  - 246 Hz
Corda 3              : G (Sol) - 196 Hz
Corda 4              : D (Ré)  - 146 Hz
Corda 5              : A (Lá)  - 110 Hz
Corda 6 (mais grossa): E (Mi)  -  82 Hz
```

### Casas e Semitons:

```
Casa 0 = Corda solta
Casa 1 = +1 semitom
Casa 2 = +2 semitons
Casa 3 = +3 semitons
...
Casa 12 = +12 semitons = +1 oitava
```

### Exemplo: Corda 5 (A)

```
Casa 0: A   (110 Hz)
Casa 1: A#  (117 Hz)  ← +1 semitom
Casa 2: B   (123 Hz)  ← +2 semitons
Casa 3: C   (131 Hz)  ← +3 semitons
Casa 4: C#  (139 Hz)
Casa 5: D   (147 Hz)  ← +5 semitons
...
Casa 12: A  (220 Hz)  ← 1 oitava acima!
```

## 💡 Dicas para Melhor Detecção

### ✅ Boas Práticas:

1. **Toque sustentado**: Segure a nota por 1-2 segundos
2. **Volume adequado**: Médio-alto funciona melhor
3. **Silêncio**: Minimize ruídos de fundo
4. **Microfone próximo**: 15-30cm da guitarra
5. **Afine sua guitarra**: Afinação correta = detecção precisa

### ❌ Evite:

1. ❌ Tocar muito rápido (notas curtas)
2. ❌ Volume muito baixo
3. ❌ Ambiente barulhento
4. ❌ Microfone muito longe
5. ❌ Guitarra desafinada

## 🚀 Resumo do Funcionamento

```
1. VOCÊ CLICA "INICIAR"
   ↓
2. APP SORTEIA NOTA (ex: F# na Corda 5)
   ↓
3. VOCÊ TOCA A NOTA
   ↓
4. MICROFONE CAPTA O SOM
   ↓
5. APP DETECTA FREQUÊNCIA (ex: 370 Hz)
   ↓
6. APP CONVERTE → F#
   ↓
7. APP COMPARA: F# = F#?
   ↓
8. FEEDBACK: ✓ Verde (acerto) ou ✗ Vermelho (erro)
   ↓
9. SE ACERTOU: Nova nota automaticamente
   SE ERROU: Mesma nota, tente novamente
   ↓
10. REPETE! Treine quantas vezes quiser!
```

---

**Agora você sabe como funciona!** 🎸🎵

Para mais detalhes técnicos, veja [ARCHITECTURE.md](./ARCHITECTURE.md)
