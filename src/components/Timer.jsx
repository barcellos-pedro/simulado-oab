import { useEffect, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const FIVE_HOURS = 5 * 60 * 60
export default function Timer({ active }) {
  const [deadline, setDeadline] = useLocalStorage('oab-timer-deadline', null)
  const [startedAt, setStartedAt] = useLocalStorage('oab-timer-started-at', null)
  const [remaining, setRemaining] = useState(FIVE_HOURS)
  const [minimized, setMinimized] = useState(false)
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    if (!active) {
      setDeadline(null)
      setStartedAt(null)
    } else if (!deadline) {
      const now = Date.now()
      setDeadline(now + FIVE_HOURS * 1000)
      setStartedAt(now)
    }
  }, [active, deadline, setDeadline, setStartedAt])
  useEffect(() => {
    if (!active || !deadline) return
    const update = () => setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [active, deadline])
  useEffect(() => {
    const reset = event => {
      setRemaining(FIVE_HOURS)
      setDeadline(event.detail.deadline)
    }
    window.addEventListener('oab:timer-reset', reset)
    return () => window.removeEventListener('oab:timer-reset', reset)
  }, [setDeadline])
  const time = `${String(Math.floor(remaining / 3600)).padStart(2, '0')}:${String(Math.floor((remaining % 3600) / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`
  if (!active) return null
  if (hidden) return <button className="timer-show" onClick={() => setHidden(false)} title="Mostrar cronômetro">Mostrar relógio</button>
  if (minimized) return <div className="timer timer-minimized"><strong>{time}</strong><button onClick={() => setMinimized(false)} title="Expandir cronômetro">+</button><button onClick={() => setHidden(true)} title="Esconder cronômetro">×</button></div>
  return <div className="timer" aria-label="Cronômetro de prova">
    <span className="timer-icon">⏱</span><strong>{time}</strong>
    <button onClick={() => setMinimized(true)} title="Minimizar">−</button>
    <button onClick={() => setHidden(true)} title="Esconder cronômetro">×</button>
  </div>
}
