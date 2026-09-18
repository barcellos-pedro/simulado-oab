# Plano de implementação — Simulado OAB PWA

## Problema e abordagem

Criar uma aplicação React + Vite com Tailwind CSS, `lucide-react` e
`vite-plugin-pwa` para estudar para a OAB. As questões das provas 45, 46 e 47
serão extraídas dos PDFs em `docs/`, normalizadas em
`src/data/questions.json` e apresentadas em um banco único com seleção aleatória.

## Etapas

1. **Preparar o projeto**
   - Configurar React, Vite, Tailwind, PWA e estrutura modular.
   - Adicionar scripts de desenvolvimento, build, preview e preparação de conteúdo.
   - Definir o formato dos dados e do estado do quiz.

2. **Extrair e normalizar os dados**
   - Ler as provas e gabaritos das edições 45, 46 e 47.
   - Identificar enunciados, alternativas A–E e respostas oficiais.
   - Salvar textos intermediários em `src/data/extracted/`.
   - Gerar `src/data/questions.json`.
   - Revisar questões, alternativas e justificativas antes da publicação.

3. **Implementar o quiz**
   - Criar tela inicial com resumo e botão de início.
   - Exibir progresso, enunciado, alternativas, feedback imediato e justificativa.
   - Bloquear nova seleção após responder.
   - Criar tela de resultado com pontuação, percentual e opção de refazer.

4. **Criar página de pesquisa**
   - Usar `docs/pesquisa.pdf` como fonte da análise, sem misturá-lo às questões.
   - Exibir resumo executivo, tendências, temas recorrentes, metodologia e limitações.
   - Disponibilizar o PDF original para visualização/download.
   - Garantir funcionamento responsivo e offline.

5. **Criar dashboard de desempenho**
   - Salvar tentativas no `localStorage`, sem backend.
   - Registrar data, total, acertos, erros, percentual e duração.
   - Exibir cards de métricas, acertos x erros, evolução, melhor resultado,
     tempo médio e lista de tentativas.
   - Permitir novo simulado e limpeza confirmada do histórico.

6. **Adicionar temas**
   - Alternar entre claro, escuro e sistema.
   - Persistir a preferência no `localStorage`.
   - Fazer o modo sistema acompanhar `prefers-color-scheme`.
   - Aplicar o tema a todas as telas e ao PWA.

7. **Adicionar cronômetro**
   - Iniciar cronômetro regressivo de 5 horas ao começar o simulado.
   - Manter o relógio discreto, minimizável e ocultável.
   - Continuar contando quando minimizado ou escondido.
   - Encerrar ao concluir, registrar a duração e tratar o término do prazo sem
     perder as respostas.
   - Persistir referências de tempo para evitar deriva e suportar recarregamento.

8. **Configurar PWA/offline**
   - Gerar manifest, ícones/placeholder e service worker.
   - Implementar cache offline dos assets e dados locais.
   - Oferecer instalação via `beforeinstallprompt` quando suportada.

9. **Documentar e validar**
   - Documentar `npm install`, `npm run prepare:content`, `npm run dev`,
     `npm run build` e `npm run preview`.
   - Documentar pesquisa, histórico local, temas, cronômetro e teste offline.
   - Executar validação dos dados e build de produção quando o ambiente permitir.

## Decisões

- O banco reúne as provas 45, 46 e 47 e pode selecionar questões aleatoriamente.
- Justificativas são resumos informativos, não pareceres jurídicos.
- A pesquisa é informativa e não prevê com garantia cobranças futuras.
- O histórico e a preferência de tema ficam somente no navegador atual.
- O cronômetro tem duração máxima de 5 horas e não pausa ao ser minimizado/ocultado.
- A aplicação funciona sem backend e sem chamadas de rede para carregar o quiz.
- `docs/pesquisa.pdf` é fonte da página de pesquisa, não do banco de questões.
