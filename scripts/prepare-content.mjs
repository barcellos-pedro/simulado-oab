import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { basename, extname, join, resolve } from 'node:path'
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

const removePageHeader = value => value
  .replace(/\s+(?:\d{2}\s+o\s+)?EXAME\s+(?:DO|DE)\s+ORDEM\s+UNIFICADO\s+Tipo Branca\s+[–-]\s+Página\s+\d+\s*$/i, '')
  .trim()

function extractAnswerKey(text) {
  const answers = new Map()
  const lines = text.split('\n').map(line => line.trim())
  const typeOneStart = lines.findIndex(line => /PROVA TIPO 1/i.test(line))
  const typeTwoStart = lines.findIndex((line, index) => index > typeOneStart && /PROVA TIPO 2/i.test(line))
  const typeOneLines = lines.slice(typeOneStart, typeTwoStart > -1 ? typeTwoStart : undefined)

  for (let index = 0; index < typeOneLines.length - 1; index += 1) {
    const numbers = typeOneLines[index].split(/\s+/).map(Number)
    const letters = typeOneLines[index + 1].split(/\s+/)
    if (!numbers.length || numbers.some(number => !Number.isInteger(number)) || !letters.every(letter => /^[A-E]$/i.test(letter))) continue
    if (numbers.length !== letters.length || numbers.some(number => number < 1 || number > 80)) continue
    numbers.forEach((number, answerIndex) => answers.set(number, letters[answerIndex].toUpperCase()))
  }
  return answers
}

function parseQuestions(text, examNumber, answerKey) {
  const lines = text.split('\n').map(line => line.trim())
  const markers = []
  for (let index = 0; index < lines.length; index += 1) {
    if (/^(?:[1-9]|[1-7]\d|80)$/.test(lines[index])) {
      const number = Number(lines[index])
      const followingLines = lines.slice(index + 1, index + 8)
      const isPageHeader = followingLines.some(line => /^(?:Tipo Branca\b|EXAME\b|o$|SUA PROVA|TEMPO|INFORMAÇÕES GERAIS|NÃO SERÁ PERMITIDO)$/i.test(line))
      if (number >= 1 && number <= 80 && !isPageHeader) markers.push({ index, number })
    }
  }

  const firstQuestion = markers.findIndex((marker, index) => marker.number === 1 && markers[index + 1]?.number === 2)
  if (firstQuestion === -1) return []

  const questions = []
  for (let markerIndex = firstQuestion; markerIndex < markers.length; markerIndex += 1) {
    const marker = markers[markerIndex]
    if (marker.number > 80 || marker.number !== markerIndex - firstQuestion + 1) break
    const nextMarker = markers[markerIndex + 1]
    const block = lines
      .slice(marker.index + 1, nextMarker?.index ?? lines.length)
      .filter(line => !/^(?:\d{2}|o|EXAME DE ORDEM|EXAME DO ORDEM|Tipo Branca\b|SUA PROVA|TEMPO|INFORMAÇÕES GERAIS|NÃO SERÁ PERMITIDO)$/i.test(line))
    const optionStarts = []
    block.forEach((line, lineIndex) => {
      const match = line.match(/^\(([A-E])\)\s*(.*)$/i)
      if (match) optionStarts.push({ lineIndex, letter: match[1].toUpperCase(), text: match[2] })
    })
    if (optionStarts.length < 2) continue

    const statement = removePageHeader(block.slice(0, optionStarts[0].lineIndex).join(' ').replace(/\s+/g, ' '))
    const options = optionStarts.map((option, optionIndex) => {
      const end = optionStarts[optionIndex + 1]?.lineIndex ?? block.length
      return removePageHeader([option.text, ...block.slice(option.lineIndex + 1, end)]
        .join(' ')
        .replace(/\s+/g, ' '))
    })
    const answerLetter = answerKey.get(marker.number) ?? null
    const answer = answerLetter ? answerLetter.charCodeAt(0) - 65 : null

    questions.push({
      id: `${examNumber}-${marker.number}`,
      exam: examNumber,
      number: marker.number,
      subject: 'Não classificada',
      question: statement,
      options,
      answer,
      answerLetter
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
    documents.set(file, { text, pages: parsed.numpages })
    console.log(`Extraído: ${file} (${parsed.numpages} páginas)`)
  }

  const questions = []
  for (const exam of ['45', '46', '47']) {
    const examFile = `${exam}-prova.pdf`
    const keyFile = `${exam}-gabarito.pdf`
    const examDocument = documents.get(examFile)
    const keyDocument = documents.get(keyFile)
    if (!examDocument || !keyDocument) {
      console.warn(`Par incompleto ignorado: ${exam}`)
      continue
    }
    questions.push(...parseQuestions(examDocument.text, exam, extractAnswerKey(keyDocument.text)))
  }

  for (const file of files) {
    const document = documents.get(file)
    const exam = file.match(/^(\d{2})-/)?.[1] ?? null
    const baseName = basename(file, '.pdf')
    const structured = {
      source: `docs/${file}`,
      pages: document.pages,
      exam,
      documentType: baseName.endsWith('-prova') ? 'prova' : baseName.endsWith('-gabarito') ? 'gabarito' : 'pesquisa'
    }
    if (structured.documentType === 'prova') {
      const answerDocument = documents.get(`${exam}-gabarito.pdf`)
      structured.questions = parseQuestions(document.text, exam, answerDocument ? extractAnswerKey(answerDocument.text) : new Map())
    } else if (structured.documentType === 'gabarito') {
      structured.answers = Object.fromEntries(extractAnswerKey(document.text))
    } else {
      structured.sections = document.text.split(/\n{2,}/).map(section => section.trim()).filter(Boolean)
    }
    await writeFile(join(extractedDir, `${baseName}.json`), `${JSON.stringify(structured, null, 2)}\n`, 'utf8')
  }

  await writeFile(outputFile, `${JSON.stringify({ questions }, null, 2)}\n`, 'utf8')
  console.log(`Gerado: ${outputFile} (${questions.length} questões)`)
  console.log(`Dados estruturados: ${extractedDir}`)
}

main().catch(error => {
  console.error('Falha ao preparar conteúdo:', error.message)
  process.exitCode = 1
})
