export default function Research() {
  return <section>
    <div className="page-heading">
      <div className="eyebrow">Análise das provas recentes</div>
      <h1>Pesquisa OAB</h1>
      <p>Resumo informativo baseado no documento de pesquisa disponibilizado com este projeto.</p>
    </div>
    <div className="stats">
      <div><span>Fonte analisada</span><strong>45ª–47ª</strong></div>
      <div><span>Formato</span><strong>80 questões</strong></div>
      <div><span>Leitura</span><strong>Qualitativa</strong></div>
    </div>
    <div className="panel research-panel">
      <h2>Como interpretar esta pesquisa</h2>
      <p className="muted">O documento reúne observações sobre as últimas provas e serve como apoio para organizar os estudos. Os padrões apresentados são tendências históricas, não uma garantia de cobrança futura.</p>
      <h2>Documento original</h2>
      <p className="muted">Consulte a fonte completa para conhecer a metodologia, os recortes e as limitações da análise.</p>
      <a className="primary research-link" href="/docs/pesquisa.pdf" target="_blank" rel="noreferrer">Abrir pesquisa em PDF ↗</a>
    </div>
  </section>
}
