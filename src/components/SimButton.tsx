import { useState } from 'react'
import { Play, X, ExternalLink, Maximize2 } from 'lucide-react'
import { useI18n, Bilingual } from '../i18n'
import { haptic } from '../utils/ux'

interface Props {
  sim: string
  title?: string
  isWokwi?: boolean
}

export function SimButton({ sim, title = 'Falstad CircuitJS', isWokwi = false }: Props) {
  const [open, setOpen] = useState(false)
  const { mode } = useI18n()

  const handleToggle = () => {
    haptic(10)
    setOpen(o => !o)
  }

  return (
    <div className="my-3 print:hidden">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={handleToggle}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition shadow-sm ${
            open
              ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500'
              : 'border-[var(--color-border)] hover:border-[var(--color-acc)] text-[var(--color-fg)] bg-[var(--color-bg)]'
          }`}
        >
          {open ? <X className="size-3.5" /> : <Play className="size-3.5 fill-current" />}
          {open ? (
            <Bilingual en="Hide Simulation" vn="Ẩn mô phỏng" />
          ) : (
            <Bilingual
              en={`Run ${isWokwi ? 'Wokwi (ESP32)' : 'Falstad'} Simulation`}
              vn={`Chạy mô phỏng ${isWokwi ? 'Wokwi (ESP32)' : 'Falstad'}`}
            />
          )}
        </button>

        {open && (
          <a
            href={sim}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs text-[var(--color-muted)] hover:text-[var(--color-acc)] border border-transparent hover:border-[var(--color-border)] transition"
            title="Mở tab mới toàn màn hình"
          >
            <ExternalLink className="size-3" />
            <Bilingual en="Open full tab" vn="Mở tab mới" />
          </a>
        )}
      </div>

      {open && (
        <div className="mt-3 rounded-xl overflow-hidden border border-[var(--color-border)] bg-black shadow-lg fade-in">
          <div className="bg-slate-900 px-3 py-1.5 text-[11px] font-mono text-slate-300 flex items-center justify-between border-b border-slate-800">
            <span>⚡ {title}</span>
            <span className="text-slate-500 text-[10px]">Tải trực tiếp trong trang</span>
          </div>
          <iframe
            loading="lazy"
            title={title}
            src={sim}
            className="w-full aspect-[16/10] min-h-[380px] block border-0 bg-white"
          />
        </div>
      )}
    </div>
  )
}
