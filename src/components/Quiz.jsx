import { useEffect, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function Quiz({ questions, saveAttempt }) {
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [done, setDone] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [startedAt, setStartedAt] = useLocalStorage('oab-timer-started-at', null)
  useEffect(() => {
    if (!startedAt) setStartedAt(Date.now())
  }, [startedAt, setStartedAt])
  const q = questions[index]
  if (!questions.length) return <section className="empty-state"><span>✦</span><h2>Banco de questões em preparação</h2><p>Adicione as questões extraídas dos PDFs em <code>src/data/questions.json</code> para começar o quiz.</p></section>
  const answer = (option) => { if (selected === null) setSelected(option) }
  const next = () => {
    const nextCorrect = correct + (selected === q.answer ? 1 : 0)
    if (index + 1 < questions.length) { setIndex(index + 1); setSelected(null) }
    else {
      const duration = startedAt ? Math.min(5 * 60 * 60, Math.max(0, Math.round((Date.now() - startedAt) / 1000))) : 0
      saveAttempt({ total: questions.length, correct: nextCorrect, errors: questions.length - nextCorrect, duration, date: new Date().toISOString() })
      setDone(true)
    }
    setCorrect(nextCorrect)
  }
  if (done) return <section className="empty-state"><span>✓</span><h2>Quiz concluído!</h2><p>Sua tentativa foi salva no desempenho.</p><button className="primary" onClick={() => {
    const now = Date.now()
    setStartedAt(now)
    const deadline = now + 5 * 60 * 60 * 1000
    localStorage.setItem('oab-timer-deadline', JSON.stringify(deadline))
    window.dispatchEvent(new CustomEvent('oab:timer-reset', { detail: { startedAt: now, deadline } }))
    setIndex(0)
    setSelected(null)
    setCorrect(0)
    setDone(false)
  }}>Refazer quiz</button></section>
  return <section className="quiz-card"><div className="eyebrow">Questão {index + 1} de {questions.length} · {q.subject}</div><h1>{q.question}</h1><div className="options">{q.options.map((option, i) => <button key={option} className={`option ${selected !== null ? (i === q.answer ? 'correct' : i === selected ? 'wrong' : '') : ''}`} onClick={() => answer(i)}><b>{String.fromCharCode(65 + i)}</b>{option}</button>)}</div><div className="quiz-actions">{selected !== null && <span>{selected === q.answer ? 'Resposta correta!' : 'Resposta incorreta'}</span>}<button className="primary" disabled={selected === null} onClick={next}>{index + 1 === questions.length ? 'Finalizar' : 'Próxima'} →</button></div></section>
}
