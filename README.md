# Estudos OAB

Aplicação PWA em React + Vite + Tailwind para praticar questões da OAB.

## Rodando localmente

```bash
npm install
npm run prepare:content
npm run dev
```

O comando `npm run prepare:content` lê todos os PDFs em `docs/`, salva o texto
extraído em `src/data/extracted/` e gera `src/data/questions.json` a partir dos
pares `45/46/47-prova.pdf` e `45/46/47-gabarito.pdf`. A identificação automática
é uma etapa inicial: revise os blocos, alternativas e justificativas antes de
publicar o banco de questões.

Para validar uma build de produção: `npm run build`.

## Funcionalidades

- Quiz com feedback imediato e registro de tentativas.
- Dashboard com questões, acertos, aproveitamento e histórico.
- Pesquisa no banco de questões.
- Página dedicada de pesquisa com acesso ao documento `docs/pesquisa.pdf`.
- Tema claro, escuro ou seguindo o sistema, persistido em `localStorage`.
- Cronômetro regressivo discreto de 5 horas, minimizável ou ocultável sem pausar a contagem, com duração registrada na tentativa.
- Manifest e service worker via `vite-plugin-pwa`.

O histórico de tentativas e a preferência de tema ficam salvos apenas no navegador
atual. O cronômetro é reiniciado ao iniciar uma nova visita ao quiz; minimizar ou
esconder o relógio não interrompe a contagem.

## Integração dos PDFs

Os PDFs originais ficam em `docs/`. A extração ainda não foi realizada. Para integrar os dados, preencha `src/data/questions.json` com:

```json
{"questions":[{"id":"45-1","subject":"Ética","question":"Enunciado","options":["A","B"],"answer":0,"explanation":"Comentário"}]}
```

O arquivo atual é um placeholder válido e a interface exibe uma mensagem clara enquanto o banco estiver vazio.

## Testar o PWA

Depois de executar `npm run build`, inicie o servidor de produção com:

```bash
npm run preview
```

Abra o endereço exibido pelo Vite em um navegador compatível, use a opção
“Instalar Estudos OAB” na barra de endereço e, em seguida, teste o modo offline
pelas ferramentas de desenvolvedor. O PDF de pesquisa deve ser mantido no caminho
`docs/pesquisa.pdf` quando o projeto for publicado.
