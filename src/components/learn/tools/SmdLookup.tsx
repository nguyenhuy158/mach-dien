import { useState, useMemo } from 'react'
import { decodeSmd3, decodeSmd4 } from '../../../data/learn'
import { useI18n, Bilingual } from '../../../i18n'

export function SmdLookup() {
  const [code, setCode] = useState('472')
  const { mode, T, tvn } = useI18n()

  const decoded = useMemo(() => {
    const c = code.trim().toUpperCase()
    if (c.length === 0) return null
    if (c.length <= 3) return { ...decodeSmd3(c), type: mode === 'vn' ? '3 số' : '3-digit' }
    return { ...decodeSmd4(c), type: mode === 'vn' ? '4 số' : '4-digit' }
  }, [code, mode])

  return (
    <div className="card p-5 bg-[var(--color-card)] border border-[var(--color-border)]">
      <h3 className="text-lg font-bold tracking-tight mb-1">
        <Bilingual en={T.learnSmd} vn={tvn.learnSmd} />
      </h3>
      <p className="text-xs text-[var(--color-muted)] mb-4">
        <Bilingual en="Type the code on the SMD part → look up the value." vn="Gõ mã trên linh kiện SMD → tra giá trị." />
      </p>

      <input
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder={mode === 'vn' ? 'VD: 472, 103, 4R7, 1001' : 'e.g. 472, 103, 4R7, 1001'}
        maxLength={4}
        className="w-full text-center text-2xl font-mono font-bold tracking-wider rounded-lg px-3 py-3 border border-[var(--color-border)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-acc)_35%,transparent)] focus:outline-none bg-transparent uppercase"
      />

      {decoded && (
        <div className="mt-4 text-center">
          <div className="text-3xl font-bold tracking-tight text-[var(--color-acc)] font-mono">{decoded.formatted}</div>
          <div className="text-xs text-[var(--color-muted)] mt-1">
            {mode === 'vn' ? 'Mã' : 'Code'} {decoded.type}: {decoded.value}
          </div>
        </div>
      )}

      <div className="mt-4 p-3 rounded-lg bg-[color-mix(in_srgb,var(--color-acc)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-acc)_20%,transparent)] text-xs space-y-1">
        <div><b>{mode === 'vn' ? '3 chữ số:' : '3-digit:'}</b> {mode === 'vn' ? '2 số đầu = giá trị, số cuối = số mũ của 10. ' : 'first 2 digits = value, last = power of 10. '}<i>472 = 47×10² = 4.7kΩ</i></div>
        <div><b>{mode === 'vn' ? '4 chữ số:' : '4-digit:'}</b> {mode === 'vn' ? '3 số đầu = giá trị, số cuối = số mũ. ' : 'first 3 digits = value, last = power. '}<i>1001 = 100×10¹ = 1kΩ</i></div>
        <div><b>{mode === 'vn' ? 'Có R:' : 'With R:'}</b> {mode === 'vn' ? 'thay dấu thập phân. ' : 'replaces decimal. '}<i>4R7 = 4.7Ω, 1R00 = 1Ω</i></div>
        <div><b>EIA-96 (1%):</b> {mode === 'vn' ? '2 số + 1 chữ cái. Tra bảng online (chưa hỗ trợ ở đây).' : '2 digits + 1 letter. Look up online (not supported here).'}</div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <Example code="101" />
        <Example code="102" />
        <Example code="103" />
        <Example code="104" />
        <Example code="220" />
        <Example code="470" />
        <Example code="222" />
        <Example code="473" />
      </div>
    </div>
  )
}

function Example({ code }: { code: string }) {
  const r = decodeSmd3(code)
  return (
    <button
      onClick={() => navigator.clipboard?.writeText(code)}
      className="text-left px-2 py-1 rounded border border-[var(--color-border)] hover:border-[var(--color-acc)] transition"
    >
      <span className="font-mono font-bold">{code}</span> = <span className="text-[var(--color-acc)]">{r.formatted}</span>
    </button>
  )
}
