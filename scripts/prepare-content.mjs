import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, dirname, extname, join, resolve } from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const pdfParse = require('pdf-parse')

const root = resolve(process.cwd())
const docsDir = join(root, 'docs')
const extractedDir = join(root, 'src', 'data', 'extracted')
const outputFile = join(root, 'src', 'data', 'questions.json')

const normalizeText = text => text
  .replace(/\r\n/g, '\n')
  .replace(/[ \t]+/g, ' ')
  .replace(/\n{3,}/g, '\n\n')
  .trim()

const getExamNumber = filename => filename.match(/(?:^|[-_])(\d{2})(?:[-_]|\.|$)/)?.[1] ?? null

function extractAnswerKey(text) {
  const answers = new Map()
  const pattern = /(?:quest[aã]o\s*)?(\d{1,2})\s*[\-.)\:]\s*([A-E])\b/gi
  for (const match of text.matchAll(pattern)) answers.set(Number(match[1]), match[2].toUpperCase())
  return answers
}

function parseQuestions(text, examNumber, answerKey) {
  const questionBlocks = text.split(/(?=\n?\s*(?:QUEST(?:ÃO|AO)?\s*)?\d{1,2}\s*[\-.):])/i)
  const questions = []

  for (const block of questionBlocks) {
    const numberMatch = block.match(/(?:QUEST(?:ÃO|AO)?\s*)?(\d{1,2})\s*[\-.):]/i)
    if (!numberMatch) continue

    const number = Number(numberMatch[1])
    const options = []
    const optionPattern = /(?:^|\n)\s*([A-E])\s*[\).\-:]\s*(.*?)(?=\n\s*[A-E]\s*[\).\-:]|\s*$)/gis
    for (const match of block.matchAll(optionPattern)) options.push(match[2].replace(/\s+/g, ' ').trim())
    if (options.length < 2) continue

    const firstOption = block.search(/(?:^|\n)\s*A\s*[\).\-:]/i)
    const statement = (firstOption > -1 ? block.slice(0, firstOption) : block)
      .replace(/^(?:QUEST(?:ÃO|AO)?\s*)?\d{1,2}\s*[\-.):]\s*/i, '')
      .replace(/\s+/g, ' ')
      .trim()
    const answerLetter = answerKey.get(number) ?? null
    const answer = answerLetter ? answerLetter.charCodeAt(0) - 65 : null

    questions.push({
      id: `${examNumber}-${number}`,
      exam: examNumber,
      number,
      subject: 'Não classificada',
      question: statement,
      options,
      answer,
      answerLetter,
      explanation: 'Justificativa pendente de revisão editorial.'
    })
  }

  return questions
}

async function main() {
  const files = (await readdir(docsDir))
    .filter(file => extname(file).toLowerCase() === '.pdf')
    .sort()

  if (!files.length) throw new Error(`Nenhum PDF encontrado em ${docsDir}`)
  await mkdir(extractedDir, { recursive: true })

  const documents = new Map()
  for (const file of files) {
    const input = await readFile(join(docsDir, file))
    const parsed = await pdfParse(input)
    const text = normalizeText(parsed.text)
    documents.set(file, text)
    await writeFile(join(extractedDir, `${basename(file, '.pdf')}.txt`), `${text}\n`, 'utf8')
    console.log(`Extraído: ${file} (${parsed.numpages} páginas)`)
  }

  const questions = []
  for (const exam of ['45', '46', '47']) {
    const examFile = `${exam}-prova.pdf`
    const keyFile = `${exam}-gabarito.pdf`
    const examText = documents.get(examFile)
    const keyText = documents.get(keyFile)
    if (!examText || !keyText) {
      console.warn(`Par incompleto ignorado: ${exam}`)
      continue
    }
    questions.push(...parseQuestions(examText, exam, extractAnswerKey(keyText)))
  }

  await writeFile(outputFile, `${JSON.stringify({ questions }, null, 2)}\n`, 'utf8')
  console.log(`Gerado: ${outputFile} (${questions.length} questões)`)
  console.log(`Textos brutos: ${extractedDir}`)
}

main().catch(error => {
  console.error('Falha ao preparar conteúdo:', error.message)
  process.exitCode = 1
})
