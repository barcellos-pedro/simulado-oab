export default function Dashboard({ attempts }) {
  const total = attempts.reduce((n, a) => n + a.total, 0), correct = attempts.reduce((n, a) => n + a.correct, 0)
  const averageDuration = attempts.length ? Math.round(attempts.reduce((n, a) => n + (a.duration || 0), 0) / attempts.length) : 0
  const formatDuration = seconds => `${Math.floor(seconds / 60)}min ${String(seconds % 60).padStart(2, '0')}s`
  const clearHistory = () => {
    if (!window.confirm('Limpar todo o histórico de tentativas deste dispositivo?')) return
    localStorage.removeItem('oab-attempts')
    window.location.reload()
  }
  return <section><div className="page-heading"><div><div className="eyebrow">Visão geral</div><h1>Seu desempenho</h1><p>Acompanhe seu ritmo e evolua a cada tentativa.</p></div></div><div className="stats"><div><span>Questões respondidas</span><strong>{total}</strong></div><div><span>Acertos x erros</span><strong>{correct} x {total - correct}</strong></div><div><span>Tempo médio</span><strong>{formatDuration(averageDuration)}</strong></div></div><div className="panel"><div className="panel-heading"><h2>Histórico de tentativas</h2>{attempts.length > 0 && <button className="secondary" onClick={clearHistory}>Limpar histórico</button>}</div>{attempts.length ? <div className="attempt-list">{attempts.slice().reverse().map((a, i) => <div className="attempt" key={i}><span>Exame {a.exam || '—'}<br /><small>{new Date(a.date).toLocaleString('pt-BR')} · {formatDuration(a.duration || 0)}</small></span><b>{a.correct}/{a.total}<br /><small>{a.errors ?? a.total - a.correct} erros</small></b></div>)}</div> : <p className="muted">Nenhuma tentativa registrada ainda. Faça um quiz para ver seu histórico aqui.</p>}</div></section>
}
