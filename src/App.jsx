import { useEffect, useState } from 'react'
import Layout from './components/Layout'
import Quiz from './components/Quiz'
import Dashboard from './components/Dashboard'
import Search from './components/Search'
import Research from './components/Research'
import ExamSelection from './components/ExamSelection'
import { useLocalStorage } from './hooks/useLocalStorage'
import data from './data/questions.json'

export default function App() {
  const [page, setPage] = useState('home')
  const [theme, setTheme] = useLocalStorage('oab-theme', 'system')
  const [attempts, setAttempts] = useLocalStorage('oab-attempts', [])
  const [selectedExam, setSelectedExam] = useState(null)
  const [quizPaused, setQuizPaused] = useState(false)
  const [questions] = useState(data.questions)
  useEffect(() => {
    const dark = theme === 'dark' || (theme === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
  }, [theme])
  const selectExam = exam => {
    localStorage.removeItem('oab-timer-deadline')
    localStorage.removeItem('oab-timer-started-at')
    localStorage.removeItem('oab-timer-paused-at')
    setSelectedExam(exam)
    setQuizPaused(false)
  }
  const exitQuiz = () => {
    if (!window.confirm('Sair do simulado? O progresso desta tentativa será perdido.')) return
    localStorage.removeItem('oab-timer-deadline')
    localStorage.removeItem('oab-timer-started-at')
    localStorage.removeItem('oab-timer-paused-at')
    setSelectedExam(null)
    setQuizPaused(false)
    setPage('quiz')
  }
  const home = <section className="hero"><div className="hero-copy"><div className="eyebrow">Preparação inteligente para a OAB</div><h1>Estude com clareza.<br /><em>Avance com confiança.</em></h1><p>Um espaço simples para praticar questões, acompanhar seu desempenho e manter o foco na aprovação.</p><div className="hero-actions"><button className="primary" onClick={() => { setSelectedExam(null); setQuizPaused(false); setPage('quiz') }}>Começar um quiz <span>→</span></button><button className="secondary" onClick={() => setPage('dashboard')}>Ver desempenho</button></div></div><div className="hero-card"><div className="card-top"><span className="status-dot" /> Sua jornada</div><strong>Consistência vence<br />a ansiedade.</strong><div className="progress"><i /></div><small>Seu histórico fica salvo neste dispositivo.</small></div></section>
  const quizQuestions = selectedExam ? questions.filter(question => question.exam === selectedExam).slice(0, 80) : []
  return <Layout {...{ page, setPage, theme, setTheme }} timerActive={page === 'quiz' && Boolean(selectedExam)} timerPaused={quizPaused}>{page === 'home' ? home : page === 'quiz' ? selectedExam ? <Quiz key={selectedExam} exam={selectedExam} questions={quizQuestions} paused={quizPaused} onTogglePause={() => setQuizPaused(value => !value)} onRestart={() => setQuizPaused(false)} onExit={exitQuiz} saveAttempt={a => setAttempts(current => [...current, a])} /> : <ExamSelection questions={questions} onSelect={selectExam} /> : page === 'dashboard' ? <Dashboard attempts={attempts} /> : page === 'research' ? <Research /> : <Search questions={questions} />}</Layout>
}
