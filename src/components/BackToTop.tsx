import { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!show) return null
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      title="Back to top"
      aria-label="Back to top"
      className="fixed bottom-24 right-6 z-30 size-11 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-fg)] shadow-lg flex items-center justify-center hover:border-[var(--color-acc)] hover:text-[var(--color-acc)] transition print:hidden"
    >
      <ArrowUp className="size-4" />
    </button>
  )
}
