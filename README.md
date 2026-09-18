<div align="center">

  <img src="public/favicon.svg" alt="" width="72" />

# Estudos OAB

**Simulados, revisão e acompanhamento para a prova da OAB.**

[![React](https://img.shields.io/badge/React-18-149eca?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![PWA](https://img.shields.io/badge/PWA-instalável-335cff?style=flat-square)](https://web.dev/progressive-web-apps/)

[Recursos](#recursos) · [Início rápido](#início-rápido) · [Comandos](#comandos) · [Conteúdo](#conteúdo) · [PWA e offline](#pwa-e-offline)
</div>

<img src="public/preview.jpg" alt="Prévia da aplicação Estudos OAB" width="100%" />

Estudos OAB é uma aplicação web instalável para praticar as questões dos 45º,
46º e 47º Exames Unificados. O quiz, as explicações, o histórico e o estado do
cronômetro são carregados e armazenados localmente: não há backend, conta ou
sincronização entre dispositivos.

> [!NOTE]
> O projeto é uma ferramenta de estudo. As explicações são resumos informativos
> e a página de pesquisa apresenta tendências históricas, não previsões ou
> orientação jurídica.

## Recursos

- **240 questões locais:** 80 questões de cada um dos três exames disponíveis.
- **Simulado por exame:** escolha a prova e avance por uma sessão de até 80 questões.
- **Feedback imediato:** a resposta é bloqueada após a seleção e o gabarito é exibido com a explicação disponível.
- **Cronômetro de prova:** cinco horas, com pausa, reinício, minimização e ocultação sem perder o estado ao recarregar a página.
- **Desempenho:** acompanhe questões respondidas, acertos, erros, duração média e histórico das tentativas.
- **Pesquisa:** encontre questões por enunciado, disciplina ou explicação no banco local.
- **Pesquisa documental:** consulte a análise das provas recentes e o PDF original em `docs/pesquisa.pdf`.
- **Experiência instalável:** tema claro, escuro ou do sistema, manifest e service worker gerados pelo `vite-plugin-pwa`.

## Início rápido

### Requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- npm

### Instalar e executar

```bash
npm install
npm run prepare:content
npm run dev
```

Abra o endereço local exibido pelo Vite. O comando `prepare:content` só é
necessário quando os PDFs em `docs/` forem alterados ou quando o conteúdo
gerado precisar ser reconstruído.

## Comandos

| Comando                   | Finalidade                                         |
| ------------------------- | -------------------------------------------------- |
| `npm install`             | Instala as dependências do projeto.                |
| `npm run prepare:content` | Extrai os PDFs e atualiza os JSONs em `src/data/`. |
| `npm run dev`             | Inicia o servidor de desenvolvimento do Vite.      |
| `npm run build`           | Gera a build de produção e os artefatos do PWA.    |
| `npm run preview`         | Serve localmente a build de produção.              |
| `npm run format`          | Formata os arquivos com Prettier.                  |

Para conferir a versão de produção:

```bash
npm run build
npm run preview
```

## Conteúdo

Os PDFs-fonte ficam em `docs/`. O script `scripts/prepare-content.mjs` usa
`pdf-parse` para:

1. extrair o texto dos PDFs de prova, gabarito e pesquisa;
2. associar as respostas da seção `PROVA TIPO 1` às questões numeradas;
3. gravar os documentos intermediários em `src/data/extracted/`;
4. gerar `src/data/questions.json` no formato consumido pelo quiz.

Os arquivos gerados incluem `45-prova.json`, `45-gabarito.json`,
`46-prova.json`, `46-gabarito.json`, `47-prova.json`, `47-gabarito.json`,
`pesquisa.json` e o banco consolidado `questions.json`.

> [!IMPORTANT]
> A extração e a associação do gabarito são heurísticas. Depois de executar
> `npm run prepare:content`, revise o diff das questões, alternativas, respostas
> e explicações antes de publicar uma nova versão do conteúdo.

## Arquitetura

- `src/main.jsx` monta a aplicação React.
- `src/App.jsx` controla a navegação por estado entre início, quiz, desempenho, pesquisa de questões e pesquisa documental.
- `src/components/` contém as telas e controles, incluindo `Quiz`, `Dashboard`, `Search`, `Research`, `Timer` e seleção de exame.
- `src/hooks/useLocalStorage.js` centraliza a persistência local em JSON.
- `src/utils/timer.js` mantém deadline, início e pausa do cronômetro.
- `vite.config.js` configura o React, o PWA e a entrega de `docs/pesquisa.pdf` no desenvolvimento e no build.

## PWA e offline

O build copia o PDF de pesquisa para `dist/docs/pesquisa.pdf` e gera o manifest
e o service worker. Para validar a instalação e o carregamento offline:

```bash
npm run build
npm run preview
```

Abra a URL exibida pelo Vite em um navegador compatível, instale o aplicativo e
confirme o carregamento após habilitar o modo offline nas ferramentas de
desenvolvedor. Ao publicar a aplicação, mantenha o caminho
`/docs/pesquisa.pdf` disponível.

### Dados locais

As tentativas, o tema e as referências do cronômetro ficam no `localStorage` do
navegador atual. Limpar os dados do site remove esse estado; iniciar em outro
navegador ou dispositivo não recupera o histórico. Reiniciar ou abandonar um
simulado descarta a tentativa incompleta.
