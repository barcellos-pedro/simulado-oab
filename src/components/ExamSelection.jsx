export default function ExamSelection({ questions, onSelect }) {
  const exams = [...new Set(questions.map(question => question.exam))]
    .sort((a, b) => Number(a) - Number(b))
    .map(exam => ({
      exam,
      total: questions.filter(question => question.exam === exam).length
    }))

  return <section className="exam-selection">
    <div className="page-heading">
      <div className="eyebrow">Escolha seu simulado</div>
      <h1>Qual exame você deseja fazer?</h1>
      <p>Cada sessão tem no máximo 80 questões e usa o gabarito do exame selecionado.</p>
    </div>
    {exams.length ? <div className="exam-grid">
      {exams.map(({ exam, total }) => <button className="exam-card" key={exam} onClick={() => onSelect(exam)}>
        <span className="exam-card-number">{exam}º</span>
        <span className="exam-card-copy"><strong>Exame Unificado</strong><small>{Math.min(total, 80)} questões · 5 horas</small></span>
        <span className="exam-card-arrow">→</span>
      </button>)}
    </div> : <div className="empty-state"><span>✦</span><h2>Exames ainda não disponíveis</h2><p>Prepare o conteúdo dos PDFs para liberar os simulados.</p></div>}
  </section>
}
