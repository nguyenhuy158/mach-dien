import { SHOP, IMG } from '../data/circuits'

interface ShopEntry {
  t: string
  u: string
  p: string
}

export function PriceCell({ entry, fallback }: { entry?: ShopEntry; fallback?: 'na' | 'nn' }) {
  if (fallback === 'nn') return <span className="nn">—</span>
  if (!entry) return <span className="no">✕</span>
  return (
    <a href={entry.u} target="_blank" rel="noopener" title={entry.t} className="hover:underline">
      {entry.p}
    </a>
  )
}

export function Thumb({ url, alt }: { url?: string; alt?: string }) {
  const src = url ? IMG[url] : undefined
  if (!src) return <div className="ph">?</div>
  return (
    <a href={url} target="_blank" rel="noopener">
      <img loading="lazy" src={src} alt={alt || ''} className="thumb" />
    </a>
  )
}
