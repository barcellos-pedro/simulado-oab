# Estudos OAB Agent Guide

## Project overview

Estudos OAB is an installable, offline-friendly study app for the 45th, 46th,
and 47th Brazilian OAB exams. It is a small React 18 + Vite 5 project using
JavaScript/JSX and ESM. There is no backend, API, authentication, database, or
cross-device sync: questions, attempts, theme, and timer state are local.

The repository requires Node.js 18 or newer. `package-lock.json` is the source
of truth for dependency resolution. The current scripts use React, Vite,
Tailwind/PostCSS, `lucide-react`, `vite-plugin-pwa`, `pdf-parse`, and Prettier.

## Commands and validation

From the repository root, always run `npm install` before other npm commands in
a fresh environment. Use the committed lockfile; do not use Maven commands or
add a Maven setup (`mvn -B test` and `mvn -B verify` are unrelated workspace
tasks, and this repository has no `pom.xml`). The repository currently has no
test, lint, typecheck, or GitHub Actions scripts.

- `npm run build` is the primary automated validation. It must pass after code,
  configuration, or content changes. It creates `dist/`, including the PWA
  manifest/service worker and `dist/docs/pesquisa.pdf`.
- `npm run prepare:content` is conditional. Run it when a source PDF in
  `docs/` or `scripts/prepare-content.mjs` changes, or when generated content
  must be rebuilt. It reads every PDF, writes JSON files under
  `src/data/extracted/`, and replaces `src/data/questions.json`. The parser is
  heuristic: always inspect the diff for question text, options, answers, and
  explanations before accepting generated changes. Do not run it merely to
  validate an unrelated UI change.
- `npm run dev` starts the Vite development server for browser checks.
- `npm run preview` serves the last production build; run `npm run build` first.
- `npm run format` runs Prettier over the whole repository. Use it only when
  formatting is needed, then inspect the diff and run `npm run build` again.
  For a non-mutating check of one file, use `npx prettier --check <file>`;
  passing extra arguments to `npm run format` still invokes its `--write .`
  script and can rewrite unrelated files.

In the validated environment (Node 24.18.1, npm 11.16.0), `npm install`
completed successfully but reported three audit vulnerabilities and a pending
permission notice for the `esbuild` install script. `npm run prepare:content`
completed with non-fatal `pdf-parse` `TT: undefined function`/`invalid function`
warnings and generated 240 questions. These warnings are expected extraction
signals to review, not reasons to silently accept a content diff.

For UI or PWA changes, manually check the app in `dev` or `preview`: navigate
through home, quiz, dashboard, question search, and research; verify theme and
local persistence; and confirm that `/docs/pesquisa.pdf` opens. For PWA
confidence, install from `preview`, reload with network access disabled, and
confirm the app still loads. Stop long-running dev/preview processes after the
check. Record any command failure and workaround rather than treating an
unverified command as supported.

## Architecture and important paths

- `src/main.jsx` mounts `<App />` inside `React.StrictMode` and imports global
  styles.
- `src/App.jsx` owns state-based navigation (`home`, `quiz`, `dashboard`,
  `search`, `research`), lazy-loads screens, applies the theme class, loads
  question data, filters a selected exam to at most 80 questions, and persists
  completed attempts.
- `src/components/` contains `Layout` (navigation, theme, footer, timer),
  `Quiz`, `ExamSelection`, `Dashboard`, `Search`, `Research`, `Timer`,
  `ThemeToggle`, and `SplashScreen`. Add new screens to both `App.jsx` and the
  navigation array in `Layout.jsx`.
- `src/hooks/useLocalStorage.js` is the shared JSON localStorage helper.
  `src/utils/timer.js` owns the five-hour timer keys and reset event. Preserve
  its behavior across StrictMode remounts and page reloads.
- `scripts/prepare-content.mjs` uses `pdf-parse` to extract PDFs, associates
  answers from the `PROVA TIPO 1` section, converts A-E answers to numeric
  indexes, and emits generated JSON. Keep the question shape
  `{ questions: [...] }` and fields `id`, `exam`, `number`, `subject`,
  `question`, `options`, `answer`, and `answerLetter` compatible with consumers.
- `docs/` contains the seven source PDFs: exam and answer-key pairs for 45, 46,
  and 47, plus `pesquisa.pdf`. `src/data/extracted/` and
  `src/data/questions.json` are generated artifacts; review, do not casually
  hand-edit, generated content.
- `vite.config.js` configures React, the PWA plugin, and a custom dev/build
  handler for `docs/pesquisa.pdf`. Keep that file, path, and `public/favicon.svg`
  available when changing the research page or PWA.
- `src/styles.css` is the main Tailwind/CSS file; `src/accessibility.css` and
  `src/home.css` provide additional styles. Preserve established selectors and
  theme classes such as `primary`, `secondary`, `panel`, `stats`, `dark`, and
  `quiz-card`. There is no TypeScript or React Router.
- `package.json`, `postcss.config.js`, `tailwind.config.js`, and `index.html`
  contain the project scripts, CSS processing, Tailwind theme, and HTML/PWA
  metadata. `README.md` and `PLAN.md` provide product and workflow context.

## Working rules

Follow this guide and the existing README/instructions as the default source of
truth. Search the repository only when these instructions are incomplete or
contradicted by the files. Keep changes focused, avoid introducing a backend,
router, TypeScript, or new test framework without a clear requirement, and do
not commit changes. Before finishing, run the narrowest relevant validation and
then `npm run build`; report any validation that could not be run.
