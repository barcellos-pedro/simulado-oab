# Estudos OAB

Aplicação web instalável (PWA) para praticar questões da OAB, desenvolvida com
React, Vite, Tailwind CSS e `lucide-react`. O conteúdo é carregado localmente,
sem backend ou necessidade de conexão depois que os recursos são armazenados
pelo service worker.

## Requisitos

- Node.js 18 ou superior
- npm

## Instalação e desenvolvimento

```bash
npm install
npm run prepare:content
npm run dev
```

O comando `npm run dev` inicia o servidor de desenvolvimento. Para gerar e
visualizar a versão de produção:

```bash
npm run build
npm run preview
```

Comandos disponíveis:

| Comando | Finalidade |
| --- | --- |
| `npm install` | Instala as dependências |
| `npm run prepare:content` | Extrai os PDFs e atualiza os JSONs de conteúdo |
| `npm run dev` | Inicia o Vite em modo de desenvolvimento |
| `npm run build` | Gera a build de produção e os artefatos PWA |
| `npm run preview` | Serve a build de produção localmente |

## Funcionalidades

- Seleção do exame antes de iniciar o simulado: 45º, 46º ou 47º Exame
  Unificado.
- Até 80 questões por sessão, filtradas pelo exame escolhido.
- Feedback imediato, bloqueio da alternativa após a resposta e indicação do
  gabarito.
- Controles durante o simulado para pausar/continuar, reiniciar ou sair.
- Cronômetro regressivo de 5 horas. O tempo pausado é congelado e compensado
  quando a sessão é retomada; minimizar ou ocultar o relógio não interrompe a
  contagem.
- Dashboard com total de questões, acertos, erros, percentual, duração e
  histórico das tentativas anteriores.
- Pesquisa no banco local de questões.
- Página dedicada à pesquisa das provas recentes, com acesso a
  `docs/pesquisa.pdf`.
- Tema claro, escuro ou baseado no sistema, persistido no navegador.
- Manifest, ícones e service worker gerados por `vite-plugin-pwa`.

O histórico de tentativas, o tema e o estado do cronômetro ficam salvos apenas no
navegador atual. Reiniciar descarta o progresso da sessão; sair retorna à
seleção de exames sem registrar uma tentativa incompleta.

## Integração dos PDFs

Os PDFs originais ficam em `docs/`. O script
`scripts/prepare-content.mjs` extrai os documentos e gera:

- `src/data/extracted/45-prova.json`
- `src/data/extracted/45-gabarito.json`
- `src/data/extracted/46-prova.json`
- `src/data/extracted/46-gabarito.json`
- `src/data/extracted/47-prova.json`
- `src/data/extracted/47-gabarito.json`
- `src/data/extracted/pesquisa.json`
- `src/data/questions.json`

O banco atual contém 240 questões, sendo 80 de cada exame. A extração e a
associação do gabarito são heurísticas; revise o conteúdo jurídico antes de
publicá-lo como material editorial definitivo. As explicações importadas que
ainda não passaram por revisão são identificadas no próprio JSON.

## Testar o PWA

Depois de executar `npm run build`, inicie o servidor de produção com:

```bash
npm run preview
```

Abra o endereço exibido pelo Vite em um navegador compatível. O navegador deve
exibir a opção de instalar o Estudos OAB na barra de endereço ou no menu de
compartilhamento. Depois da instalação, ative o modo offline nas ferramentas de
desenvolvedor e confirme que a aplicação continua acessível.

O build também copia o PDF de pesquisa para `dist/docs/pesquisa.pdf`; esse
recurso precisa ser mantido no deploy para que o link da página de pesquisa
continue funcionando.
