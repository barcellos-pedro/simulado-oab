# Instruções para Copilot

## Contexto do projeto

Estudos OAB é uma PWA em React 18 + Vite para praticar as questões dos 45º,
46º e 47º Exames Unificados da OAB. O conteúdo, o histórico e o estado do
cronômetro são locais: não há backend, API ou sincronização entre dispositivos.
O código usa ESM (`"type": "module"`), JavaScript/JSX e componentes funcionais;
não há TypeScript.

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
npm run format           # formata os arquivos com Prettier
```

Não há scripts de teste ou lint configurados, nem runner para executar um teste
individual. Use `npm run format` somente quando a alteração exigir formatação;
antes de finalizar, a validação padrão é `npm run build`. Para mudanças no
conteúdo, execute `npm run prepare:content` e revise o diff de
`src/data/questions.json` e de `src/data/extracted/`, pois a extração é
heurística. Para validar o comportamento instalável/offline, execute `npm run
build`, depois `npm run preview`, e teste a instalação e o carregamento sem rede
no navegador.

Consulte o [README](../README.md) para o fluxo de uso e os detalhes
documentais; consulte o [PLAN](../PLAN.md) para decisões e escopo do produto.
Não replique esses documentos nesta instrução quando apenas um link for
suficiente.

## Arquitetura

- `src/main.jsx` monta o React e importa o CSS global.
- `src/App.jsx` é o controlador de navegação da aplicação. A navegação é
  baseada em estado (`home`, `quiz`, `dashboard`, `search` e `research`), não
  em React Router. Novas páginas devem ser conectadas nesse estado e também ao
  array de navegação em `src/components/Layout.jsx`.
- `Layout` fornece cabeçalho, navegação, seletor de tema, cronômetro e rodapé.
  O cronômetro só é ativo quando a página atual é `quiz`.
- `ExamSelection` deriva os exames disponíveis de `data.questions`; `App`
  filtra o exame selecionado e limita cada sessão às primeiras 80 questões.
- `Quiz` recebe essa lista filtrada, controla a questão atual, bloqueia a
  alternativa após a seleção, calcula acertos e chama `saveAttempt` ao concluir.
  `App` persiste as tentativas na chave `oab-attempts`.
- `Dashboard` lê as tentativas já persistidas e calcula totais, acertos, erros,
  duração média e histórico. O armazenamento é local ao navegador; não existe
  backend ou sincronização.
- `Search` pesquisa o banco local por enunciado, disciplina e explicação.
  `Research` é uma página separada para a análise de `docs/pesquisa.pdf`; ela
  não deve ser usada como fonte das questões.
- `src/hooks/useLocalStorage.js` é o helper compartilhado para ler/gravar JSON
  em `localStorage`, retornando o valor inicial quando os dados são inválidos
  ou o armazenamento não está disponível.
- `Timer` usa um deadline persistido (`oab-timer-deadline`) e `startedAt`
  (`oab-timer-started-at`) e um marcador de pausa (`oab-timer-paused-at`) para
  contar cinco horas sem depender de renderizações. Minimizar ou esconder muda
  somente a apresentação. O reset de uma nova tentativa usa o evento local
  `oab:timer-reset`.
- `src/data/questions.json` é importado em build e precisa manter o formato
  `{ questions: [...] }`. Preserve os campos consumidos pelos componentes,
  incluindo `id`, `exam`, `number`, `subject`, `question`, `options`, `answer` e
  `answerLetter`.

## Preparação dos PDFs

Os arquivos fonte ficam em `docs/`. O script
`scripts/prepare-content.mjs` usa `pdf-parse`, extrai todos os PDFs para
arquivos JSON estruturados em `src/data/extracted/` e tenta montar questões para os pares
`45/46/47-prova.pdf` e `45/46/47-gabarito.pdf`. O parser é uma etapa
heurística: revise enunciados, alternativas, gabaritos e justificativas antes
de considerar o banco pronto. `docs/pesquisa.pdf` alimenta a página de pesquisa,
não o banco de questões.

O script percorre todos os PDFs de `docs/`, grava metadados e textos
estruturados em `src/data/extracted/` e substitui `src/data/questions.json`
com `{ questions: [...] }`. A associação de respostas procura a seção `PROVA
TIPO 1` do gabarito e converte A–E para índices numéricos; questões sem
gabarito recebem `answer: null`. Ao alterar o formato dos dados, atualize
simultaneamente o script de preparação, `src/data/questions.json`, `Quiz`,
`Search` e a documentação do README. Não substitua dados revisados por uma
nova extração heurística sem verificar o diff.

## PWA e assets

- `vite.config.js` configura `vite-plugin-pwa` e emite o PDF de pesquisa em
  `docs/pesquisa.pdf` no build. O plugin local `serve-research-pdf` também
  atende esse arquivo em `/docs/pesquisa.pdf` no modo dev; preserve esse
  caminho ao alterar a página `Research`.
- O manifest usa `public/favicon.svg`; mantenha esse asset disponível ao
  alterar os metadados do PWA.
- O teste manual do PWA deve usar `npm run build` e `npm run preview`, abrir a
  aplicação em navegador compatível, instalar e verificar o carregamento offline.
- Não remova `docs/pesquisa.pdf` nem o caminho `/docs/pesquisa.pdf`: o arquivo é
  emitido pelo `researchPdfPlugin` no build e servido por ele durante o dev.

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
- O CSS combina diretivas Tailwind com CSS próprio em um único arquivo; o
  projeto não usa utilitários Tailwind diretamente nos componentes. Preserve os
  seletores existentes (`primary`, `secondary`, `panel`, `stats`, `dark`,
  `quiz-card` etc.) ao ajustar a UI.
- O projeto usa `React.StrictMode` em `src/main.jsx`; efeitos que inicializam
  persistência, timers ou listeners devem ser seguros para a montagem de
  desenvolvimento repetida.

## Fluxo de alteração

- Antes de editar uma tela, siga o estado de navegação em `src/App.jsx` e a
  entrada correspondente em `src/components/Layout.jsx`.
- Prefira os componentes, hooks e classes CSS existentes; não introduza React
  Router, TypeScript ou um backend para resolver necessidades locais.
- Após editar código, execute `npm run build`. Após editar PDFs ou o parser,
  execute `npm run prepare:content`, revise os artefatos gerados e então rode o
  build. Não sobrescreva conteúdo revisado sem inspecionar o diff.
- Não faça commit nem altere arquivos gerados ou PDFs sem que a tarefa peça
  explicitamente.
