import { lazy, Suspense, useEffect, useState } from "react";
import Layout from "./components/Layout";
import SplashScreen from "./components/SplashScreen";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { clearTimer } from "./utils/timer";
import "./home.css";

const Quiz = lazy(() => import("./components/Quiz"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Search = lazy(() => import("./components/Search"));
const Research = lazy(() => import("./components/Research"));
const ExamSelection = lazy(() => import("./components/ExamSelection"));

function PageLoading() {
  return (
    <section
      className="empty-state page-loading"
      role="status"
      aria-live="polite"
    >
      <span>...</span>
      <h2>Carregando conteúdo</h2>
    </section>
  );
}

function Home({ setPage }) {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-kicker">Preparação para a OAB, no seu ritmo</p>
          <h1>
            Pratique hoje.
            <br />
            <span>Chegue mais seguro.</span>
          </h1>
          <p className="home-intro">
            Questões da prova, feedback imediato e um histórico que mostra onde
            concentrar sua próxima sessão.
          </p>
          <div className="hero-actions">
            <button
              className="primary home-primary"
              onClick={() => setPage("quiz")}
            >
              Começar meu primeiro simulado <span>→</span>
            </button>
            <button className="secondary" onClick={() => setPage("dashboard")}>
              Ver meu desempenho
            </button>
          </div>
          <div className="home-proof" aria-label="Recursos disponíveis">
            <span>
              <b>240</b> questões
            </span>
            <span>
              <b>3</b> exames recentes
            </span>
            <span>
              <b>100%</b> no seu dispositivo
            </span>
          </div>
        </div>

        <div
          className="question-preview"
          aria-label="Prévia de uma questão do simulado"
        >
          <div className="preview-header">
            <span>
              <i /> 47º Exame Unificado
            </span>
            <span>
              Questão 01 <b>/ 80</b>
            </span>
          </div>
          <div className="preview-body">
            <p className="preview-label">Direito constitucional</p>
            <h2>O que você faria nesta questão?</h2>
            <p className="preview-question">
              A Constituição Federal assegura a liberdade de expressão como um
              direito fundamental...
            </p>
            <div className="preview-option is-selected">
              <b>A</b>
              <span>É um direito absoluto, sem exceções.</span>
              <em>✓</em>
            </div>
            <div className="preview-option">
              <b>B</b>
              <span>Encontra limites previstos na própria Constituição.</span>
            </div>
            <div className="preview-option">
              <b>C</b>
              <span>Depende de autorização prévia do Estado.</span>
            </div>
          </div>
          <div className="preview-footer">
            <span>Feedback na hora</span>
            <strong>
              62% de acerto <i />
            </strong>
          </div>
        </div>
      </section>

      <section className="home-benefits">
        <div className="section-intro">
          <p className="home-kicker">Um estudo que devolve direção</p>
          <h2>
            Menos ansiedade.
            <br />
            <span>Mais clareza para avançar.</span>
          </h2>
        </div>
        <div className="benefit-list">
          <article>
            <span className="benefit-mark">01</span>
            <h3>Pratique com a prova real</h3>
            <p>
              Escolha entre os exames recentes e responda no formato que você
              vai encontrar no dia.
            </p>
          </article>
          <article>
            <span className="benefit-mark">02</span>
            <h3>Entenda seus erros</h3>
            <p>
              Receba o gabarito e a explicação logo depois de responder, sem
              esperar a correção.
            </p>
          </article>
          <article>
            <span className="benefit-mark">03</span>
            <h3>Acompanhe seu ritmo</h3>
            <p>
              Seu histórico fica salvo neste dispositivo para você enxergar a
              evolução com calma.
            </p>
          </article>
        </div>
      </section>

      <section className="home-process">
        <div>
          <p className="home-kicker">Comece sem complicar</p>
          <h2>
            Da primeira questão
            <br />
            ao próximo passo.
          </h2>
        </div>
        <div className="process-steps">
          <div>
            <span>1</span>
            <p>
              <b>Escolha o exame</b>
              <br />
              Comece pelo conteúdo que faz sentido para sua fase.
            </p>
          </div>
          <div>
            <span>2</span>
            <p>
              <b>Responda com foco</b>
              <br />
              Avance questão por questão, com tempo e feedback.
            </p>
          </div>
          <div>
            <span>3</span>
            <p>
              <b>Revise seu caminho</b>
              <br />
              Use seu desempenho para decidir o que estudar depois.
            </p>
          </div>
        </div>
      </section>

      <section className="home-final-cta">
        <p className="home-kicker">Seu próximo estudo começa aqui</p>
        <h2>Uma questão de cada vez.</h2>
        <button
          className="primary home-primary"
          onClick={() => setPage("quiz")}
        >
          Começar meu primeiro simulado <span>→</span>
        </button>
      </section>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [theme, setTheme] = useLocalStorage("oab-theme", "system");
  const [attempts, setAttempts] = useLocalStorage("oab-attempts", []);
  const [selectedExam, setSelectedExam] = useState(null);
  const [quizPaused, setQuizPaused] = useState(false);
  const [questions, setQuestions] = useState(null);
  useEffect(() => {
    const dark =
      theme === "dark" ||
      (theme === "system" &&
        matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  }, [theme]);
  useEffect(() => {
    if (page !== "quiz" && page !== "search") return;
    let active = true;
    import("./data/questions.json").then((module) => {
      if (active) setQuestions(module.default.questions);
    });
    return () => {
      active = false;
    };
  }, [page]);
  const selectExam = (exam) => {
    clearTimer();
    setSelectedExam(exam);
    setQuizPaused(false);
  };
  const exitQuiz = () => {
    if (
      !window.confirm(
        "Sair do simulado? O progresso desta tentativa será perdido.",
      )
    )
      return;
    clearTimer();
    setSelectedExam(null);
    setQuizPaused(false);
    setPage("quiz");
  };
  const quizQuestions =
    selectedExam && questions
      ? questions
          .filter((question) => question.exam === selectedExam)
          .slice(0, 80)
      : [];
  const content =
    page === "home" ? (
      <Home setPage={setPage} />
    ) : page === "quiz" ? (
      !questions ? (
        <PageLoading />
      ) : selectedExam ? (
        <Quiz
          key={selectedExam}
          exam={selectedExam}
          questions={quizQuestions}
          paused={quizPaused}
          onTogglePause={() => setQuizPaused((value) => !value)}
          onRestart={() => setQuizPaused(false)}
          onExit={exitQuiz}
          saveAttempt={(a) => setAttempts((current) => [...current, a])}
        />
      ) : (
        <ExamSelection questions={questions} onSelect={selectExam} />
      )
    ) : page === "dashboard" ? (
      <Dashboard attempts={attempts} />
    ) : page === "research" ? (
      <Research />
    ) : !questions ? (
      <PageLoading />
    ) : (
      <Search questions={questions} />
    );
  return (
    <>
      <SplashScreen />
      <Layout
        {...{ page, setPage, theme, setTheme }}
        timerActive={page === "quiz" && Boolean(selectedExam)}
        timerPaused={quizPaused}
      >
        <Suspense fallback={<PageLoading />}>{content}</Suspense>
      </Layout>
    </>
  );
}
