import { useEffect, useState, createContext, useContext } from 'react'

export type ThemeMode = 'light' | 'dark' | 'auto'
const TKEY = 'machdien.theme'

interface Ctx {
  mode: ThemeMode
  setMode: (m: ThemeMode) => void
  resolved: 'light' | 'dark'
}

const ThemeContext = createContext<Ctx>({ mode: 'auto', setMode: () => {}, resolved: 'light' })

function detectSystem(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const v = localStorage.getItem(TKEY)
    return v === 'light' || v === 'dark' || v === 'auto' ? v : 'auto'
  })
  const [resolved, setResolved] = useState<'light' | 'dark'>(() => {
    const v = localStorage.getItem(TKEY)
    if (v === 'light') return 'light'
    if (v === 'dark') return 'dark'
    return detectSystem()
  })

  useEffect(() => {
    localStorage.setItem(TKEY, mode)
    const apply = () => {
      const r = mode === 'auto' ? detectSystem() : mode
      setResolved(r)
      document.documentElement.dataset.theme = r
      // Update theme-color meta
      const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement | null
      if (meta) meta.content = r === 'dark' ? '#0f172a' : '#f59e0b'
    }
    apply()
    if (mode === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [mode])

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolved }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): Ctx => useContext(ThemeContext)
