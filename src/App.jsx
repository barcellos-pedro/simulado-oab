import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import Quiz from './components/Quiz'
import Dashboard from './components/Dashboard'
import Search from './components/Search'
import Research from './components/Research'
import ThemeToggle from './components/ThemeToggle'
import { useLocalStorage } from './hooks/useLocalStorage'
import data from './data/questions.json'

export default function App() {
  const [page, setPage] = useState('home')
  const [theme, setTheme] = useLocalStorage('oab-theme', 'system')
  const [attempts, setAttempts] = useLocalStorage('oab-attempts', [])
  const [questions] = useState(data.questions)
  useEffect(() => {
    const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
  }, [theme])
  const home = <section className="hero"><div className="hero-copy"><div className="eyebrow">Preparação inteligente para a OAB</div><h1>Estude com clareza.<br /><em>Avance com confiança.</em></h1><p>Um espaço simples para praticar questões, acompanhar seu desempenho e manter o foco na aprovação.</p><div className="hero-actions"><button className="primary" onClick={() => setPage('quiz')}>Começar um quiz <span>→</span></button><button className="secondary" onClick={() => setPage('dashboard')}>Ver desempenho</button></div></div><div className="hero-card"><div className="card-top"><span className="status-dot" /> Sua jornada</div><strong>Consistência vence<br />a ansiedade.</strong><div className="progress"><i /></div><small>Seu histórico fica salvo neste dispositivo.</small></div></section>
  return <Layout {...{ page, setPage, theme, setTheme }}>{page === 'home' ? home : page === 'quiz' ? <Quiz questions={questions} saveAttempt={a => setAttempts([...attempts, a])} /> : page === 'dashboard' ? <Dashboard attempts={attempts} /> : page === 'research' ? <Research /> : <Search questions={questions} />}</Layout>
}
