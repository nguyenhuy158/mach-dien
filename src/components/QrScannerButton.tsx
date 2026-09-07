import { useState, useRef, useEffect } from 'react'
import { QrCode, X } from 'lucide-react'
import jsQR from 'jsqr'

// Dev-time guard: if jsQR was tree-shaken or removed, iOS users get
// silent failure because BarcodeDetector is undefined on iOS Safari.
// This block runs once at module load. The whole jsQR library is
// ~50KB; keeping the import here is the cost of iPhone support.
if (typeof jsQR !== 'function' && import.meta.env.DEV) {
  console.warn('[QrScanner] jsQR missing — iOS Safari scan will be broken')
}
import { useI18n, Bilingual } from '../i18n'
import { haptic } from '../utils/ux'

interface Props {
  onScan: (text: string) => void
  className?: string
}

// Camera + QR/barcode scan.
// Path 1: native BarcodeDetector (Chrome 83+, Edge, Android WebView).
// Path 2: jsQR — the ONLY path that works on iOS Safari, which does not
//          implement BarcodeDetector as of 2026. Feature-detect
//          (`if (Native)` is false on iOS Safari) makes jsQR the fallback.
//          Do not remove jsQR. Path 3: file picker (desktop / no camera).
export function QrScannerButton({ onScan, className = '' }: Props) {
  const { mode, T, tvn } = useI18n()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingNative, setUsingNative] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const nativeDetectorRef = useRef<any>(null)

  useEffect(() => {
    if (!open) return
    let raf = 0
    let stopped = false
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        // Try native BarcodeDetector first
        const Native = (window as any).BarcodeDetector
        if (Native) {
          try {
            const detector = new Native({ formats: ['qr_code', 'ean_13', 'code_128', 'upc_a'] })
            nativeDetectorRef.current = detector
            setUsingNative(true)
            const tick = async () => {
              if (stopped || !videoRef.current) return
              try {
                const codes = await detector.detect(videoRef.current)
                if (codes && codes[0]?.rawValue) {
                  haptic(30)
                  onScan(codes[0].rawValue)
                  cleanup()
                  return
                }
              } catch { /* frame error, try next */ }
              raf = requestAnimationFrame(tick)
            }
            raf = requestAnimationFrame(tick)
            return
          } catch { /* fall through to jsQR */ }
        }
        // Fallback: jsQR
        const tick = () => {
          if (stopped) return
          const v = videoRef.current
          if (v && v.readyState === v.HAVE_ENOUGH_DATA) {
            const c = document.createElement('canvas')
            c.width = v.videoWidth
            c.height = v.videoHeight
            const ctx = c.getContext('2d')
            if (ctx) {
              ctx.drawImage(v, 0, 0)
              const img = ctx.getImageData(0, 0, c.width, c.height)
              const code = jsQR(img.data, c.width, c.height)
              if (code && code.data) {
                haptic(30)
                onScan(code.data)
                cleanup()
                return
              }
            }
          }
          raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      } catch (e: any) {
        setError(e?.message || 'Camera unavailable')
      }
    }
    start()
    return cleanup
    function cleanup() {
      stopped = true
      cancelAnimationFrame(raf)
      streamRef.current?.getTracks().forEach(t => t.stop())
      streamRef.current = null
      if (videoRef.current) videoRef.current.srcObject = null
    }
  }, [open, onScan])

  const handleFile = async (file: File) => {
    const Native = (window as any).BarcodeDetector
    const reader = new FileReader()
    reader.onload = async () => {
      const img = new Image()
      img.onload = async () => {
        const c = document.createElement('canvas')
        c.width = img.width
        c.height = img.height
        const ctx = c.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0)
        // Try native first
        if (Native) {
          try {
            const detector = new Native({ formats: ['qr_code', 'ean_13', 'code_128', 'upc_a'] })
            const codes = await detector.detect(c)
            if (codes?.[0]?.rawValue) { haptic(30); onScan(codes[0].rawValue); return }
          } catch { /* fall through */ }
        }
        // Fallback jsQR
        const data = ctx.getImageData(0, 0, c.width, c.height)
        const code = jsQR(data.data, c.width, c.height)
        if (code?.data) { haptic(30); onScan(code.data) }
        else { setError('No barcode detected in image') }
      }
      img.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <>
      <button
        onClick={() => { haptic(8); setOpen(true); setError(null) }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border border-[var(--color-border)] hover:border-[var(--color-acc)] transition ${className}`}
        title="Scan QR / barcode"
      >
        <QrCode className="size-3.5" /> <Bilingual en="QR" vn="QR" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-[var(--color-card)] rounded-2xl p-4 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2">
                <QrCode className="size-4" /> <Bilingual en="Scan QR / barcode" vn="Quét QR / barcode" />
                {usingNative && <span className="text-[10px] text-[var(--color-ok)]">native</span>}
              </h3>
              <button onClick={() => setOpen(false)} className="size-7 rounded-full hover:bg-[var(--color-border)] flex items-center justify-center" aria-label="Close">
                <X className="size-4" />
              </button>
            </div>
            {error ? (
              <p className="text-sm text-[var(--color-na)] mb-2">{error}</p>
            ) : (
              <video ref={videoRef} className="w-full aspect-square object-cover rounded-lg bg-black" playsInline muted />
            )}
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex-1 px-3 py-2 rounded-md text-sm border border-[var(--color-border)] hover:border-[var(--color-acc)] transition"
              >
                <Bilingual en="Pick from gallery" vn="Chọn từ thư viện" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
                className="hidden"
              />
            </div>
            <p className="text-xs text-[var(--color-muted)] mt-2 text-center">
              <Bilingual en="Point camera at a QR / barcode" vn="Hướng camera vào QR / barcode" />
            </p>
          </div>
        </div>
      )}
    </>
  )
}
