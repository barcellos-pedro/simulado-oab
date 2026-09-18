import ThemeToggle from "./ThemeToggle";
import Timer from "./Timer";

export default function Layout({
  page,
  setPage,
  theme,
  setTheme,
  children,
  timerActive,
  timerPaused,
}) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="logo" onClick={() => setPage("home")}>
          <span>◈</span> Estudos OAB
        </button>
        <nav>
          {[
            ["home", "Início"],
            ["quiz", "Quiz"],
            ["dashboard", "Desempenho"],
            ["search", "Pesquisar"],
            ["research", "Pesquisa"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={page === id ? "nav-active" : ""}
              onClick={() => setPage(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <ThemeToggle theme={theme} onChange={setTheme} />
      </header>
      <Timer active={timerActive} paused={timerPaused} />
      <main className={page === "quiz" ? "main-with-timer" : ""}>
        {children}
      </main>
      <footer>
        <span>© {new Date().getFullYear()} Estudos OAB</span>
        <span> · Feito com 💙 por </span>
        <a href="https://pedroreis.dev/" target="_blank" rel="noreferrer">
          Pedro Barcellos
        </a>
        <span> · </span>
        <a
          href="https://github.com/barcellos-pedro/simulado-oab"
          target="_blank"
          rel="noreferrer"
        >
          Repositório
        </a>
      </footer>
    </div>
  );
}
