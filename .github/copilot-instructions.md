# Instruções para Copilot

## Comandos do projeto

Instale as dependências antes de executar os comandos:

```bash
npm install
```

Comandos disponíveis em `package.json`:

```bash
npm run prepare:content  # extrai os PDFs de docs/ e gera os dados do quiz
npm run dev              # servidor Vite de desenvolvimento
npm run build            # build de produção e artefatos PWA
npm run preview          # serve o build de produção localmente
```

O repositório não possui scripts de teste ou lint configurados. Não há teste
unitário individual disponível; para validar uma mudança, use `npm run build` e,
quando a mudança envolver conteúdo, `npm run prepare:content` seguido de uma
revisão de `src/data/questions.json`.

## Arquitetura

- `src/main.jsx` monta o React e importa o CSS global.
- `src/App.jsx` é o controlador de navegação da aplicação. A navegação é
  baseada em estado (`home`, `quiz`, `dashboard`, `search` e `research`), não
  em React Router. Novas páginas devem ser conectadas nesse estado e também ao
  array de navegação em `src/components/Layout.jsx`.
- `Layout` fornece cabeçalho, navegação, seletor de tema, cronômetro e rodapé.
  O cronômetro só é ativo quando a página atual é `quiz`.
- `Quiz` consome `data.questions`, controla a questão atual, bloqueia a
  alternativa após a seleção, calcula acertos e chama `saveAttempt` ao concluir.
  `App` persiste as tentativas na chave `oab-attempts`.
- `Dashboard` lê as tentativas já persistidas e calcula totais, acertos, erros,
  duração média e histórico. O armazenamento é local ao navegador; não existe
  backend ou sincronização.
- `Search` pesquisa o banco local por enunciado, disciplina e explicação.
  `Research` é uma página separada para a análise de `docs/pesquisa.pdf`; ela
  não deve ser usada como fonte das questões.
- `src/hooks/useLocalStorage.js` é o helper compartilhado para ler/gravar JSON
  em `localStorage`, tolerando armazenamento indisponível ou dados inválidos.
- `Timer` usa um deadline persistido (`oab-timer-deadline`) e `startedAt`
  (`oab-timer-started-at`) para contar cinco horas sem depender de renderizações.
  Minimizar ou esconder muda somente a apresentação. O reset de uma nova
  tentativa usa o evento local `oab:timer-reset`.
- `src/data/questions.json` é importado em build e precisa manter o formato
  `{ questions: [...] }`. Cada questão deve possuir `id`, `subject`, `question`,
  `options`, `answer` (índice numérico) e `explanation`.

## Preparação dos PDFs

Os arquivos fonte ficam em `docs/`. O script
`scripts/prepare-content.mjs` usa `pdf-parse`, extrai todos os PDFs para
`src/data/extracted/*.txt` e tenta montar questões para os pares
`45/46/47-prova.pdf` e `45/46/47-gabarito.pdf`. O parser é uma etapa
heurística: revise enunciados, alternativas, gabaritos e justificativas antes
de considerar o banco pronto. `docs/pesquisa.pdf` alimenta a página de pesquisa,
não o banco de questões.

Ao alterar o formato dos dados, atualize simultaneamente o script de preparação,
o placeholder/arquivo `src/data/questions.json`, `Quiz`, `Search` e a
documentação do README. Não substitua dados revisados por uma nova extração
heurística sem verificar o diff.

## PWA e assets

- `vite.config.js` configura `vite-plugin-pwa` e emite o PDF de pesquisa em
  `docs/pesquisa.pdf` no build. O plugin também serve esse PDF no modo dev.
- O manifest usa `public/favicon.svg`; mantenha esse asset disponível ao
  alterar os metadados do PWA.
- O teste manual do PWA deve usar `npm run build` e `npm run preview`, abrir a
  aplicação em navegador compatível, instalar e verificar o carregamento offline.

## Convenções específicas

- O projeto usa ESM (`"type": "module"`), React funcional e JSX sem TypeScript.
- O estilo principal está centralizado em `src/styles.css`, combinando
  diretivas Tailwind com classes CSS próprias como `primary`, `panel`, `stats` e
  `dark`. Preserve essas classes e os tokens visuais ao criar componentes.
- O tema é representado por `light`, `dark` ou `system` na chave `oab-theme`;
  a classe `dark` é aplicada em `document.documentElement`.
- Datas são armazenadas em ISO e exibidas em `pt-BR`. Durações de tentativas
  são armazenadas em segundos.
- A interface é deliberadamente simples e responsiva, com controles compactos
  para navegação, tema e cronômetro. Componentes novos devem funcionar em telas
  estreitas sem exigir dependências de backend.
