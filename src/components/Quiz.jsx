import { useEffect, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function Quiz({ questions, saveAttempt, exam, paused, onTogglePause, onRestart, onExit }) {
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
  const restart = () => {
    if (!window.confirm('Reiniciar o simulado? O progresso atual será perdido.')) return
    const now = Date.now()
    setStartedAt(now)
    const deadline = now + 5 * 60 * 60 * 1000
    localStorage.setItem('oab-timer-deadline', JSON.stringify(deadline))
    localStorage.removeItem('oab-timer-paused-at')
    window.dispatchEvent(new CustomEvent('oab:timer-reset', { detail: { startedAt: now, deadline } }))
    setIndex(0)
    setSelected(null)
    setCorrect(0)
    onRestart()
  }
  const next = () => {
    const nextCorrect = correct + (selected === q.answer ? 1 : 0)
    if (index + 1 < questions.length) { setIndex(index + 1); setSelected(null) }
    else {
      const duration = startedAt ? Math.min(5 * 60 * 60, Math.max(0, Math.round((Date.now() - startedAt) / 1000))) : 0
      saveAttempt({ exam, total: questions.length, correct: nextCorrect, errors: questions.length - nextCorrect, duration, date: new Date().toISOString() })
      setDone(true)
    }
    setCorrect(nextCorrect)
  }
  const isCorrect = selected === q.answer
  const correctLetter = q.answerLetter || String.fromCharCode(65 + q.answer)
  const selectedLetter = selected !== null ? String.fromCharCode(65 + selected) : null
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
  return <section className={`quiz-card ${paused ? 'quiz-paused' : ''}`}><div className="quiz-toolbar"><span className="eyebrow">Exame {exam} · Questão {index + 1} de {questions.length} · {q.subject}</span><div className="quiz-controls"><button className="secondary" onClick={onTogglePause}>{paused ? 'Continuar' : 'Pausar'}</button><button className="secondary" onClick={restart}>Reiniciar</button><button className="secondary danger" onClick={onExit}>Sair</button></div></div><h1>{q.question}</h1><div className="options">{q.options.map((option, i) => <button key={option} disabled={paused} className={`option ${selected !== null ? (i === q.answer ? 'correct' : i === selected ? 'wrong' : '') : ''}`} onClick={() => answer(i)}><b>{String.fromCharCode(65 + i)}</b>{option}</button>)}</div>{selected !== null && <div className={`answer-feedback ${isCorrect ? 'correct' : 'wrong'}`} role="status"><strong>{isCorrect ? 'Resposta correta!' : 'Resposta incorreta.'}</strong>{!isCorrect && <span> A alternativa correta é <b>{correctLetter}</b>.</span>}<br /><span>{q.explanation || 'A explicação desta questão ainda não foi revisada editorialmente.'}</span></div>}<div className="quiz-actions">{selected !== null && <span>{selected === q.answer ? 'Resposta correta!' : `Sua resposta: ${selectedLetter}.`}</span>}<button className="primary" disabled={paused || selected === null} onClick={next}>{index + 1 === questions.length ? 'Finalizar' : 'Próxima'} →</button></div>{paused && <div className="pause-notice" role="status">Simulado pausado. Seu tempo está congelado.</div>}</section>
}
