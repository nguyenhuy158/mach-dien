import { useState, useEffect } from 'react'
import { Hammer, Plus, Trash2, Star } from 'lucide-react'
import { useI18n, Bilingual, tStr } from '../../i18n'
import { haptic } from '../../utils/ux'

const STORAGE = 'machdien.builds'

interface Build {
  id: string
  name: string
  notes: string
  createdAt: number
  starred: boolean
}

function loadBuilds(): Build[] {
  try { return JSON.parse(localStorage.getItem(STORAGE) || '[]') } catch { return [] }
}
function saveBuilds(b: Build[]) { localStorage.setItem(STORAGE, JSON.stringify(b)) }

export function MyBuilds() {
  const { mode, T, tvn } = useI18n()
  const [builds, setBuilds] = useState<Build[]>(loadBuilds)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => saveBuilds(builds), [builds])

  const add = () => {
    if (!name.trim()) return
    const b: Build = { id: crypto.randomUUID(), name: name.trim(), notes, createdAt: Date.now(), starred: false }
    setBuilds([b, ...builds])
    haptic(15)
    setName(''); setNotes('')
  }
  const remove = (id: string) => {
    setBuilds(builds.filter(b => b.id !== id))
    haptic(20)
  }
  const star = (id: string) => {
    setBuilds(builds.map(b => b.id === id ? { ...b, starred: !b.starred } : b))
    haptic(8)
  }

  return (
    <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]">
      <button
        onClick={() => { haptic(8); setOpen(o => !o) }}
        className="w-full flex items-center justify-between"
      >
        <span className="flex items-center gap-2 font-semibold">
          <Hammer className="size-4 text-[var(--color-acc)]" />
          <Bilingual en="My builds" vn="Project của tôi" />
          {builds.length > 0 && <span className="text-xs text-[var(--color-muted)]">({builds.length})</span>}
        </span>
        <span className="text-xs text-[var(--color-muted)]">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="mt-3 space-y-3">
          <div className="space-y-2">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={tStr('Project name...', 'Tên project...', mode)}
              className="w-full rounded-md px-2 py-1.5 text-sm border border-[var(--color-border)] bg-[var(--color-bg)]"
            />
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={tStr('Notes...', 'Ghi chú...', mode)}
              rows={2}
              className="w-full rounded-md px-2 py-1.5 text-xs border border-[var(--color-border)] bg-[var(--color-bg)] resize-none"
            />
            <button
              onClick={add}
              disabled={!name.trim()}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-[var(--color-acc)] text-[var(--color-bg)] disabled:opacity-50 transition"
            >
              <Plus className="size-3.5" /> <Bilingual en="Add build" vn="Thêm project" />
            </button>
          </div>
          {builds.length === 0 ? (
            <p className="text-xs text-[var(--color-muted)] text-center py-2">
              <Bilingual en="No builds yet. Add one above to track your projects." vn="Chưa có project nào. Thêm ở trên để theo dõi." />
            </p>
          ) : (
            <ul className="space-y-1.5">
              {builds.map(b => (
                <li key={b.id} className="flex items-start gap-2 px-2.5 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]">
                  <button onClick={() => star(b.id)} className={`mt-0.5 ${b.starred ? 'text-[var(--color-acc)]' : 'text-[var(--color-muted)]'}`}>
                    <Star className={`size-3.5 ${b.starred ? 'fill-current' : ''}`} />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate">{b.name}</div>
                    {b.notes && <div className="text-xs text-[var(--color-muted)] mt-0.5 line-clamp-2">{b.notes}</div>}
                    <div className="text-[10px] text-[var(--color-muted)] mt-0.5">{new Date(b.createdAt).toLocaleDateString()}</div>
                  </div>
                  <button onClick={() => remove(b.id)} className="text-[var(--color-muted)] hover:text-[var(--color-na)]">
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
