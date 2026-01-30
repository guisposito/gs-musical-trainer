# Contributing to Guitar String Trainer

Obrigado por considerar contribuir com o Guitar String Trainer! 🎸

## Como Contribuir

### Reportando Bugs

Se você encontrou um bug, por favor abra uma issue com:
- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Informações do navegador e sistema operacional

### Sugerindo Melhorias

Adoraríamos ouvir suas ideias! Abra uma issue com:
- Descrição detalhada da funcionalidade
- Por que seria útil
- Exemplos de uso

### Pull Requests

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova funcionalidade'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Padrões de Código

- Siga as regras definidas em `.cursor/rules/project-rules.md`
- Use TypeScript com strict mode
- Use TailwindCSS para estilos (sem CSS inline)
- Mantenha componentes pequenos e focados
- Adicione comentários JSDoc em funções exportadas
- Teste suas mudanças em diferentes navegadores

### Estrutura de Commits

Use prefixos semânticos:
- `Add:` - Nova funcionalidade
- `Fix:` - Correção de bug
- `Update:` - Melhoria em funcionalidade existente
- `Refactor:` - Refatoração de código
- `Docs:` - Alterações em documentação
- `Style:` - Formatação, sem mudança de lógica
- `Test:` - Adição ou correção de testes

Exemplo:
```
Add: implementa suporte para afinações alternativas
Fix: corrige detecção de pitch em frequências baixas
Update: melhora UI do medidor de frequência
```

## Desenvolvimento Local

```bash
# Clone o repositório
git clone [url-do-repo]
cd "GS musical trainer"

# Instale dependências
npm install

# Rode em desenvolvimento
npm run dev

# Acesse http://localhost:3000
```

## Áreas que Precisam de Ajuda

- [ ] Suporte para afinações alternativas
- [ ] Modo de treino progressivo (dificuldade crescente)
- [ ] Sistema de pontuação e estatísticas
- [ ] Suporte para outros instrumentos (baixo, ukulele)
- [ ] Modo dark/light theme
- [ ] Internacionalização (i18n)
- [ ] Progressive Web App (PWA)
- [ ] Testes automatizados

## Código de Conduta

- Seja respeitoso e inclusivo
- Aceite críticas construtivas
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

## Dúvidas?

Sinta-se livre para abrir uma issue com sua dúvida ou entrar em contato!

Obrigado por contribuir! 🎉
