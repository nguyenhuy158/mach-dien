import { useState, useEffect } from 'react'
import { ScanText, X, Loader2 } from 'lucide-react'
import { useI18n, Bilingual } from '../i18n'
import { haptic } from '../utils/ux'

interface Props {
  onResult: (text: string) => void
  className?: string
}

// OCR scanner using tesseract.js. Lazily loads the worker (~3MB
// downloaded once, cached by browser). Best for reading part
// numbers, datasheet snippets, shop labels.
export function OcrButton({ onResult, className = '' }: Props) {
  const { mode, T, tvn } = useI18n()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.style.display = 'none'
    input.onchange = () => {
      const f = input.files?.[0]
      if (f) runOCR(f)
    }
    document.body.appendChild(input)
    return () => { input.remove() }
  }, [open])

  const runOCR = async (file: File) => {
    setBusy(true); setError(null); setProgress(0)
    try {
      // Lazy-load tesseract.js — 3MB worker, only fetched on first OCR use.
      // (Static import would bloat the initial bundle by 3MB.)
      const tesseract = await import('tesseract.js')
      const worker = await tesseract.createWorker(['eng', 'vie'], { logger: (m: { status: string; progress: number }) => { if (m.status === 'recognizing text') setProgress(m.progress) } } as any)
      const { data } = await worker.recognize(file)
      await worker.terminate()
      haptic(20)
      onResult(data.text.trim().replace(/\s+/g, ' '))
      setOpen(false)
    } catch (e: any) {
      setError(e?.message || 'OCR failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <button
        onClick={() => { haptic(8); setOpen(true) }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border border-[var(--color-border)] hover:border-[var(--color-acc)] transition ${className}`}
        title="Scan text (OCR)"
      >
        <ScanText className="size-3.5" /> <Bilingual en="OCR" vn="OCR" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => !busy && setOpen(false)}>
          <div className="bg-[var(--color-card)] rounded-2xl p-4 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <ScanText className="size-4" /> <Bilingual en="Scan text" vn="Quét văn bản" />
              </h3>
              <button
                onClick={() => setOpen(false)}
                disabled={busy}
                className="size-7 rounded-full hover:bg-[var(--color-border)] flex items-center justify-center disabled:opacity-30"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <p className="text-sm text-[var(--color-muted)] mb-3">
              <Bilingual
                en="Take a photo of a part label, datasheet, or shop name — we'll extract the text and search it."
                vn="Chụp ảnh nhãn linh kiện, datasheet, hoặc tên shop — chúng tôi trích xuất văn bản và tìm kiếm."
              />
            </p>
            {busy ? (
              <div className="text-center py-6">
                <Loader2 className="size-8 mx-auto animate-spin text-[var(--color-acc)]" />
                <p className="text-xs text-[var(--color-muted)] mt-2 font-mono">
                  {Math.round(progress * 100)}%
                </p>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  <Bilingual en="Reading image…" vn="Đang đọc ảnh…" />
                </p>
              </div>
            ) : (
              <button
                onClick={() => {
                  const input = document.querySelector<HTMLInputElement>('input[type="file"][style*="display: none"]')
                  input?.click()
                }}
                className="w-full px-3 py-3 rounded-md border border-[var(--color-border)] hover:border-[var(--color-acc)] text-sm font-medium transition"
              >
                <Bilingual en="Take / pick photo" vn="Chụp / chọn ảnh" />
              </button>
            )}
            {error && <p className="text-sm text-[var(--color-na)] mt-2">{error}</p>}
            <p className="text-[10px] text-[var(--color-muted)] mt-3 text-center">
              <Bilingual en="First scan downloads ~3MB OCR engine, cached after." vn="Lần quét đầu tải ~3MB engine, lưu cache sau." />
            </p>
          </div>
        </div>
      )}
    </>
  )
}
