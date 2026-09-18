import ThemeToggle from './ThemeToggle'
import Timer from './Timer'

export default function Layout({ page, setPage, theme, setTheme, children }) {
  return <div className="app-shell">
    <header className="topbar">
      <button className="logo" onClick={() => setPage('home')}><span>◈</span> Estudos OAB</button>
      <nav>{[['home', 'Início'], ['quiz', 'Quiz'], ['dashboard', 'Desempenho'], ['search', 'Pesquisar'], ['research', 'Pesquisa']].map(([id, label]) =>
        <button key={id} className={page === id ? 'nav-active' : ''} onClick={() => setPage(id)}>{label}</button>)}</nav>
      <ThemeToggle theme={theme} onChange={setTheme} />
    </header>
    <Timer active={page === 'quiz'} />
    <main>{children}</main>
    <footer>Estudos OAB · organize seus estudos com consistência</footer>
  </div>
}
