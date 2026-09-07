import { useEffect, useState, createContext, useContext } from 'react'
import { en } from './en'
import { vn } from './vn'

export type LangMode = 'bilingual' | 'en' | 'vn'

const LKEY = 'machdien.lang'

interface Ctx {
  mode: LangMode
  setMode: (m: LangMode) => void
  T: typeof en
  tvn: typeof vn
}

const I18nContext = createContext<Ctx>({
  mode: 'bilingual',
  setMode: () => {},
  T: en,
  tvn: vn,
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<LangMode>(() => {
    const v = localStorage.getItem(LKEY)
    return (v === 'en' || v === 'vn' || v === 'bilingual') ? v : 'bilingual'
  })

  useEffect(() => {
    localStorage.setItem(LKEY, mode)
  }, [mode])

  return (
    <I18nContext.Provider value={{ mode, setMode, T: en, tvn: vn }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = (): Ctx => useContext(I18nContext)

// Bilingual display: EN primary (larger), VN below (smaller, dimmer)
export function Bilingual({
  en: enText,
  vn: vnText,
  as: As = 'span',
  enClass = '',
  vnClass = 'block text-[0.85em] text-[var(--color-muted)] mt-0.5',
}: {
  en: React.ReactNode
  vn: React.ReactNode
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'td' | 'th' | 'button' | 'small' | 'label'
  enClass?: string
  vnClass?: string
}) {
  const { mode } = useI18n()
  if (mode === 'en') return <As className={enClass}>{enText}</As>
  if (mode === 'vn') return <As className={enClass}>{vnText}</As>
  return (
    <As className={enClass}>
      {enText}
      <span className={vnClass}>{vnText}</span>
    </As>
  )
}

// Get plain text in current mode (for t() calls where you want a single string)
export function tStr(en: string, vn: string, mode: LangMode): string {
  if (mode === 'vn') return vn
  return en
}

// Pick the right lang object based on mode (for nested access like T.searchGroup.mach)
export function pickLang(mode: LangMode, enObj: typeof en, vnObj: typeof vn): typeof en {
  return mode === 'vn' ? (vnObj as unknown as typeof en) : enObj
}

export { en, vn }
