# 🚀 Setup Guide - Guitar String Trainer

Guia completo de configuração e instalação do Guitar String Trainer.

## 📋 Pré-requisitos

### Software Necessário

- **Node.js**: versão 18.0.0 ou superior
  - [Download Node.js](https://nodejs.org/)
  - Verifique: `node --version`

- **npm**: versão 9.0.0 ou superior (vem com Node.js)
  - Verifique: `npm --version`

- **Git**: para controle de versão (opcional)
  - [Download Git](https://git-scm.com/)

### Hardware Necessário

- **Microfone**: Built-in ou externo
  - Para melhores resultados, use um microfone de qualidade
  - Microfones USB ou interfaces de áudio são ideais para guitarristas

- **Navegador Moderno**: com suporte a Web Audio API
  - ✅ Google Chrome 90+ (recomendado)
  - ✅ Microsoft Edge 90+
  - ✅ Firefox 88+
  - ✅ Safari 14.1+

## 🛠️ Instalação

### 1. Clone ou Download do Projeto

```bash
# Se você tem o repositório git
git clone [url-do-repositorio]
cd "GS musical trainer"

# OU simplesmente navegue até a pasta do projeto se já tem os arquivos
cd "GS musical trainer"
```

### 2. Instale as Dependências

```bash
npm install
```

Este comando irá instalar:
- Next.js 14+
- React 18+
- TypeScript
- TailwindCSS
- E todas as dependências necessárias

**Tempo estimado**: 2-3 minutos (depende da velocidade da internet)

### 3. Verifique a Instalação

```bash
npm run type-check
```

Se não houver erros, a instalação foi bem-sucedida! ✅

## 🎮 Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

- Abre servidor em: `http://localhost:3000`
- Hot reload automático (mudanças no código atualizam automaticamente)
- Console mostra erros e warnings
- Ideal para desenvolvimento

### Modo Produção

```bash
# 1. Build do projeto
npm run build

# 2. Inicia servidor de produção
npm start
```

- Otimizado para performance
- Código minificado
- Ideal para deploy

## 🔧 Configuração

### Login e Maestria (opcional)

Para usar **login com Google** e **maestria por corda** (estatísticas salvas):

1. **Crie um projeto no [Supabase](https://supabase.com)** e anote a URL e a chave "service_role" (Settings → API).
2. **Crie credenciais OAuth no [Google Cloud Console](https://console.cloud.google.com/)** (APIs & Services → Credentials → Create OAuth 2.0 Client ID, tipo "Web application", redirect URI: `http://localhost:3000/api/auth/callback/google`).
3. **Copie `.env.example` para `.env.local`** e preencha:
   - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
4. **Crie a tabela no Supabase**: execute o SQL em `supabase/migrations/001_create_attempts.sql` no SQL Editor do Supabase (Dashboard → SQL Editor).

Depois disso, o botão "Entrar com Google" e a página **Maestria** (`/maestria`) passam a funcionar; as tentativas são salvas quando você está logado.

### Permissões do Navegador

Ao acessar pela primeira vez, o navegador solicitará permissão de microfone:

1. Clique em "Iniciar Treino"
2. Navegador mostra popup de permissão
3. Clique em "Permitir" ou "Allow"
4. Se negou acidentalmente:
   - Chrome/Edge: Clique no ícone de cadeado na barra de endereço → Permissões
   - Firefox: Clique no ícone de microfone na barra de endereço
   - Safari: Preferências → Sites → Microfone

### Configurações de Áudio

Para melhor detecção:

1. **Qualidade do Microfone**:
   - Use microfone externo se possível
   - Interfaces de áudio são ideais
   - Evite microfones de laptop em ambientes barulhentos

2. **Posicionamento**:
   - Microfone próximo ao instrumento (15-30cm)
   - Evite tocar muito próximo ao microfone (distorção)
   - Minimize ruídos de fundo

3. **Guitarra**:
   - Guitarras elétricas: pode conectar direto na interface
   - Guitarras acústicas: microfone externo funciona melhor
   - Volume médio-alto funciona melhor que baixo

### Ajustes Finos (Opcional)

Se a detecção não estiver precisa, você pode ajustar:

**Tolerância (em cents)**:

Edite `src/lib/frequencyConverter.ts`:
```typescript
export const CENT_TOLERANCE = 20; // Aumente para ser mais tolerante
```

**Threshold de Detecção**:

Edite `src/lib/pitchDetector.ts`:
```typescript
threshold: 0.2, // Diminua se notas não são detectadas (ex: 0.1)
                // Aumente se há muitos falsos positivos (ex: 0.3)
```

## 🧪 Testando

### Teste Básico

1. Acesse `http://localhost:3000`
2. Clique em "Iniciar Treino"
3. Permita acesso ao microfone
4. O app deve mostrar uma nota alvo
5. Toque qualquer corda e verifique se aparece frequência detectada

### Teste de Precisão

1. Use um afinador de guitarra para tocar a nota correta
2. Verifique se o app detecta corretamente
3. Teste em diferentes cordas e casas

### Troubleshooting

**"Não foi possível acessar o microfone"**:
- Verifique permissões do navegador
- Teste em outro navegador
- Verifique se microfone funciona em outros apps

**"Nenhuma frequência detectada"**:
- Aumente volume da guitarra
- Toque notas mais longas (sustentadas)
- Diminua threshold no código
- Verifique se microfone está captando (veja medidor de confiança)

**"Detecção imprecisa"**:
- Afine sua guitarra
- Reduza ruído ambiente
- Toque mais próximo ao microfone
- Use microfone de melhor qualidade

**"App muito lento"**:
- Feche outras abas do navegador
- Use modo produção (`npm run build` + `npm start`)
- Verifique uso de CPU (outras apps podem estar competindo)

## 🚢 Deploy (Produção)

### Vercel (Recomendado)

1. Crie conta em [vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Deploy automático!

### Netlify

1. Crie conta em [netlify.com](https://netlify.com)
2. Conecte repositório
3. Build command: `npm run build`
4. Publish directory: `.next`

### Server Próprio

```bash
# Build
npm run build

# Copie toda a pasta para seu servidor

# No servidor, instale dependências
npm install --production

# Inicie
npm start
```

## 📊 Estrutura do Projeto

```
GS musical trainer/
├── .cursor/                  # Cursor AI rules
├── public/                   # Assets estáticos
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── globals.css       # Estilos globais
│   │   ├── layout.tsx        # Layout principal
│   │   └── page.tsx          # Página inicial
│   ├── components/           # Componentes React
│   │   ├── GuitarTrainer.tsx # Componente principal
│   │   ├── NoteDisplay.tsx   # Display de nota
│   │   ├── FrequencyMeter.tsx# Medidor de frequência
│   │   └── FeedbackDisplay.tsx# Feedback visual
│   ├── lib/                  # Utilitários
│   │   ├── pitchDetector.ts  # Detecção de pitch
│   │   ├── frequencyConverter.ts# Conversão Hz→Nota
│   │   └── guitarNotes.ts    # Mapeamento do braço
│   └── types/
│       └── index.ts          # Tipos TypeScript
├── package.json              # Dependências
├── tsconfig.json             # Config TypeScript
├── tailwind.config.ts        # Config Tailwind
├── next.config.js            # Config Next.js
└── README.md                 # Documentação
```

## 🎓 Próximos Passos

Após configurar:

1. Leia o [README.md](./README.md) para entender funcionalidades
2. Explore o código em `src/components/`
3. Veja as regras do projeto em `.cursor/rules/project-rules.md`
4. Experimente modificar cores em `tailwind.config.ts`
5. Ajuste parâmetros de detecção conforme necessário

## 💡 Dicas

- **Primeiro Uso**: Teste com notas que você conhece bem
- **Afinação**: Mantenha guitarra afinada para melhores resultados
- **Ambiente**: Use fones para evitar feedback do speaker
- **Prática**: Quanto mais usar, melhor vai ficar!

## 🆘 Precisa de Ajuda?

- Abra uma issue no GitHub
- Consulte o [CONTRIBUTING.md](./CONTRIBUTING.md)
- Leia a documentação completa no [README.md](./README.md)

---

**Pronto para começar?** Execute `npm run dev` e bom treino! 🎸🎵
