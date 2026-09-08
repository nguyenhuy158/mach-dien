import { useState } from 'react'
import { CIRCUITS, LEVELS } from '../data/circuits'
import { Compass, X } from 'lucide-react'

interface Props {
  onJump: (id: string) => void
  flashId?: string | null
}

export function QuickNav({ onJump, flashId }: Props) {
  const [open, setOpen] = useState(false)

  const handleJump = (l: number, n: number) => {
    onJump(`m-${l}-${n}`)
  }

  return (
    <>
      {/* Inline Quick Jump Bar on Top of Circuit List */}
      <div className="max-w-6xl mx-auto px-6 pt-2 pb-1 print:hidden">
        <div className="p-2.5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xs">
          <div className="flex items-center gap-2 mb-1.5 px-1">
            <Compass className="size-3.5 text-[var(--color-acc)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
              Cuộn nhanh 23 mạch:
            </span>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto pb-1 text-xs no-scrollbar">
            {LEVELS.map(L => {
              const levelCircuits = CIRCUITS.filter(c => c.l === L.n)
              return (
                <div key={L.n} className="flex items-center gap-1 shrink-0">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${L.cls}`}>
                    L{L.n}
                  </span>
                  <div className="flex gap-1">
                    {levelCircuits.map(c => {
                      const id = `m-${c.l}-${c.n}`
                      const isActive = flashId === id
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => handleJump(c.l, c.n)}
                          title={`${c.l}.${c.n}: ${c.name}`}
                          className={`px-2 py-0.5 rounded-full font-mono text-[11px] border transition shrink-0 ${
                            isActive
                              ? 'bg-[var(--color-acc)] text-[var(--color-bg)] border-[var(--color-acc)] font-bold'
                              : 'border-[var(--color-border)] hover:border-[var(--color-acc)] bg-[var(--color-bg)] text-[var(--color-fg)]'
                          }`}
                        >
                          {c.l}.{c.n}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Floating TOC Button (Bottom Left) */}
      <div className="fixed bottom-6 left-6 z-30 print:hidden">
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--color-card)] text-[var(--color-fg)] border border-[var(--color-border)] shadow-xl hover:border-[var(--color-acc)] transition hover:scale-105"
            title="Mục lục 23 mạch"
          >
            <Compass className="size-4 text-[var(--color-acc)]" />
            <span className="text-xs font-bold hidden sm:inline">Mục lục 23 mạch</span>
            <span className="text-xs font-bold sm:hidden">Mục lục</span>
          </button>
        ) : (
          <div className="w-80 max-h-[80vh] overflow-y-auto rounded-2xl bg-[var(--color-card)] border-2 border-[var(--color-acc)] shadow-2xl p-4 animate-in fade-in">
            <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Compass className="size-4 text-[var(--color-acc)]" />
                <span>Mục lục 23 mạch điện</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="size-7 rounded-full hover:bg-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)]"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-4">
              {LEVELS.map(L => {
                const levelCircuits = CIRCUITS.filter(c => c.l === L.n)
                return (
                  <div key={L.n} className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${L.cls}`}>
                        LEVEL {L.n}
                      </span>
                      <span className="text-xs font-semibold">{L.t}</span>
                    </div>
                    <div className="space-y-1 pl-2 border-l-2 border-[var(--color-border)]">
                      {levelCircuits.map(c => (
                        <button
                          key={`${c.l}-${c.n}`}
                          type="button"
                          onClick={() => {
                            handleJump(c.l, c.n)
                            setOpen(false)
                          }}
                          className="w-full text-left p-1.5 rounded text-xs hover:bg-[var(--color-bg)] hover:text-[var(--color-acc)] transition flex items-start gap-2"
                        >
                          <span className="font-mono text-[10px] text-[var(--color-muted)] font-bold shrink-0 mt-0.5">
                            {c.l}.{c.n}
                          </span>
                          <span className="truncate">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
