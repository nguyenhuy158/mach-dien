import { useState } from 'react'
import { Play, X } from 'lucide-react'

export function SimButton({ sim }: { sim: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="my-3">
      <button
        onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-[var(--color-border)] hover:border-[var(--color-acc)] transition"
      >
        {open ? <X className="size-3.5" /> : <Play className="size-3.5" />}
        {open ? 'Ẩn mô phỏng' : 'Chạy mô phỏng'}
      </button>
      {open && (
        <iframe
          loading="lazy"
          title="Mô phỏng Falstad"
          src={sim}
          className="mt-3 w-full aspect-[4/3] rounded-xl border border-[var(--color-border)] bg-white fade-in"
        />
      )}
    </div>
  )
}
