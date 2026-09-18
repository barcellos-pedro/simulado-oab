import { useState } from 'react'
export default function Search({ questions }) {
  const [term, setTerm] = useState('')
  const results = questions.filter(q => `${q.question} ${q.subject} ${q.explanation || ''}`.toLowerCase().includes(term.toLowerCase())).slice(0, 30)
  return <section><div className="page-heading"><div><div className="eyebrow">Banco de conteúdo</div><h1>Pesquisar questões</h1><p>Encontre assuntos, enunciados e explicações.</p></div></div><input className="search-input" value={term} onChange={e => setTerm(e.target.value)} placeholder="Busque por tema ou palavra-chave..." />{term && results.length ? <div className="results">{results.map(q => <article key={q.id}><span>{q.subject}</span><h3>{q.question}</h3><p>{q.explanation || 'Sem explicação cadastrada.'}</p></article>)}</div> : <div className="empty-state small"><span>⌕</span><h2>{questions.length ? 'Digite para pesquisar' : 'Conteúdo ainda não disponível'}</h2><p>O índice será preenchido junto com a integração dos dados dos PDFs.</p></div>}</section>
}
