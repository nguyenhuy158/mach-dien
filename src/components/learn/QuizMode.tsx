import { useState, useMemo } from 'react'
import { Brain, Check, X, RotateCcw } from 'lucide-react'
import { GLOSSARY, FORMULAS } from '../../data/learn'
import { useI18n, Bilingual } from '../../i18n'
import { haptic } from '../../utils/ux'

const SK = 'machdien.quiz'

interface QuizState {
  bestStreak: number
  lastStreak: number
  answered: number
  correct: number
}
function loadState(): QuizState {
  try { return JSON.parse(localStorage.getItem(SK) || '{}') } catch { return { bestStreak: 0, lastStreak: 0, answered: 0, correct: 0 } }
}
function saveState(s: QuizState) { localStorage.setItem(SK, JSON.stringify(s)) }

type Question = {
  q: string
  options: string[]
  answer: number
  source: 'glossary' | 'formula'
}

function makeQuestions(): Question[] {
  const qs: Question[] = []
  // Glossary questions: pick 1 term, 3 random decoys from same category
  const allTerms = GLOSSARY.slice(0, 30)
  for (let i = 0; i < 5; i++) {
    const term = allTerms[Math.floor(Math.random() * allTerms.length)]
    const decoys = allTerms.filter(t => t.term !== term.term).sort(() => Math.random() - 0.5).slice(0, 3)
    const options = [term, ...decoys].sort(() => Math.random() - 0.5)
    qs.push({ q: term.term, options: options.map(o => o.definition), answer: options.indexOf(term), source: 'glossary' })
  }
  // Formula questions: which formula matches this expression?
  const fs = FORMULAS.slice(0, 12)
  for (let i = 0; i < 3; i++) {
    const f = fs[Math.floor(Math.random() * fs.length)]
    const decoys = fs.filter(x => x.id !== f.id).sort(() => Math.random() - 0.5).slice(0, 3)
    const options = [f, ...decoys].sort(() => Math.random() - 0.5)
    qs.push({ q: f.expression, options: options.map(o => o.name), answer: options.indexOf(f), source: 'formula' })
  }
  return qs.sort(() => Math.random() - 0.5)
}

export function QuizMode() {
  const { T, tvn } = useI18n()
  const [open, setOpen] = useState(false)
  const [started, setStarted] = useState(false)
  const [qs, setQs] = useState<Question[]>([])
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [streak, setStreak] = useState(0)
  const [state, setState] = useState<QuizState>(loadState)
  const [done, setDone] = useState(false)

  const start = () => {
    setQs(makeQuestions()); setI(0); setPicked(null); setStreak(0); setStarted(true); setDone(false); haptic(15)
  }
  const pick = (n: number) => {
    if (picked !== null) return
    setPicked(n)
    const correct = n === qs[i].answer
    if (correct) haptic(20); else haptic(50)
    const newStreak = correct ? streak + 1 : 0
    setStreak(newStreak)
    setState(s => {
      const next = { ...s, answered: s.answered + 1, correct: s.correct + (correct ? 1 : 0), lastStreak: newStreak, bestStreak: Math.max(s.bestStreak, newStreak) }
      saveState(next)
      return next
    })
  }
  const next = () => {
    if (i + 1 >= qs.length) setDone(true)
    else { setI(i + 1); setPicked(null) }
  }

  return (
    <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <button
        onClick={() => { haptic(8); setOpen(o => !o) }}
        className="w-full flex items-center justify-between"
      >
        <span className="flex items-center gap-2 font-semibold">
          <Brain className="size-4 text-[var(--color-acc)]" />
          <Bilingual en="Quick quiz" vn="Quiz nhanh" />
          {state.answered > 0 && (
            <span className="text-xs text-[var(--color-muted)] font-mono">
              {state.correct}/{state.answered} 🔥{state.bestStreak}
            </span>
          )}
        </span>
        <span className="text-xs text-[var(--color-muted)]">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="mt-3 space-y-3">
          {!started && (
            <div className="text-center py-4">
              <p className="text-sm text-[var(--color-muted)] mb-3">
                <Bilingual en="8 random questions from glossary + formulas. Test your knowledge." vn="8 câu ngẫu nhiên từ thuật ngữ + công thức. Kiểm tra kiến thức." />
              </p>
              <button onClick={start} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--color-acc)] text-[var(--color-bg)] font-semibold text-sm">
                <Brain className="size-4" /> <Bilingual en="Start" vn="Bắt đầu" />
              </button>
            </div>
          )}
          {started && !done && qs[i] && (
            <div>
              <div className="flex items-center justify-between text-xs text-[var(--color-muted)] mb-2">
                <span>{i + 1}/{qs.length}</span>
                <span className="font-mono">streak: {streak} 🔥</span>
              </div>
              <div className={`p-3 rounded-lg text-sm font-semibold ${qs[i].source === 'glossary' ? 'bg-[color-mix(in_srgb,var(--color-b1)_15%,transparent)]' : 'bg-[color-mix(in_srgb,var(--color-b2)_15%,transparent)]'}`}>
                {qs[i].q}
              </div>
              <div className="mt-2 space-y-1.5">
                {qs[i].options.map((opt, j) => {
                  const isPicked = picked === j
                  const isCorrect = picked !== null && j === qs[i].answer
                  const isWrong = isPicked && j !== qs[i].answer
                  return (
                    <button
                      key={j}
                      onClick={() => pick(j)}
                      disabled={picked !== null}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm border transition flex items-center gap-2 ${
                        isCorrect ? 'bg-[color-mix(in_srgb,var(--color-ok)_25%,transparent)] border-[var(--color-ok)]'
                        : isWrong ? 'bg-[color-mix(in_srgb,var(--color-na)_25%,transparent)] border-[var(--color-na)]'
                        : picked !== null ? 'opacity-50 border-[var(--color-border)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-acc)]'
                      }`}
                    >
                      {isCorrect ? <Check className="size-3.5 text-[var(--color-ok)]" /> : isWrong ? <X className="size-3.5 text-[var(--color-na)]" /> : <span className="size-3.5" />}
                      {opt}
                    </button>
                  )
                })}
              </div>
              {picked !== null && (
                <button onClick={next} className="mt-3 w-full px-3 py-2 rounded-md bg-[var(--color-acc)] text-[var(--color-bg)] text-sm font-semibold">
                  {i + 1 >= qs.length ? <Bilingual en="See results" vn="Xem kết quả" /> : <Bilingual en="Next" vn="Tiếp" />}
                </button>
              )}
            </div>
          )}
          {done && (
            <div className="text-center py-4 space-y-2">
              <div className="text-3xl font-bold text-[var(--color-acc)]">{state.correct}/{state.answered}</div>
              <p className="text-sm text-[var(--color-muted)]">
                <Bilingual en={`Best streak: ${state.bestStreak}`} vn={`Streak tốt nhất: ${state.bestStreak}`} />
              </p>
              <button onClick={start} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--color-acc)] text-[var(--color-bg)] font-semibold text-sm">
                <RotateCcw className="size-4" /> <Bilingual en="Play again" vn="Chơi lại" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
