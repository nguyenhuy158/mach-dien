import { useState } from 'react'
import { ChevronDown, ExternalLink, BookOpen, Cpu } from 'lucide-react'
import { useI18n, Bilingual, tStr } from '../i18n'

interface Props {
  partNames: string[]
  className?: string
}

const WOKWI_BASE = 'https://wokwi.com/projects/new?template=arduino'
const DATASHEET_SEARCH = 'https://www.alldatasheet.com/view.jsp?Searchword='
const GOOGLE_SEARCH = 'https://www.google.com/search?q='
const ARDUINO_REFERENCE = 'https://docs.arduino.cc/language-reference/'

export function ResourcesPanel({ partNames, className = '' }: Props) {
  const [open, setOpen] = useState(false)
  const { mode, T, tvn } = useI18n()
  if (partNames.length === 0) return null

  // Pick the first "interesting" component (IC, sensor, MCU) for the Wokwi / datasheet links
  const isInteresting = (n: string) => /esp32|atmega|arduino|raspberry|stm32|raspi|mega|nano|uno/i.test(n)
    || /ic |mcu|module|cảm biến|sensor|ic[0-9]|lm\d|tp|mp|ne\d|nrf|bme|mpu|dht|hc-|ssd/i.test(n)
  const pick = partNames.find(isInteresting) || partNames[0]

  return (
    <div className={`mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] ${className} print:hidden`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium hover:bg-[color-mix(in_srgb,var(--color-acc)_8%,transparent)] transition rounded-lg"
      >
        <span className="flex items-center gap-2">
          <BookOpen className="size-3.5" />
          <Bilingual en="Resources & links" vn="Tài liệu & liên kết" />
        </span>
        <ChevronDown className={`size-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-1.5 text-sm">
          <ResourceLink
            href={WOKWI_BASE}
            icon={<Cpu className="size-3.5" />}
            en="Open in Wokwi simulator"
            vn="Mở trong Wokwi"
            external
          />
          <ResourceLink
            href={DATASHEET_SEARCH + encodeURIComponent(pick)}
            icon={<BookOpen className="size-3.5" />}
            en={`Search datasheet for "${pick}"`}
            vn={`Tìm datasheet cho "${pick}"`}
            external
          />
          <ResourceLink
            href={GOOGLE_SEARCH + encodeURIComponent(pick + ' datasheet pdf')}
            icon={<ExternalLink className="size-3.5" />}
            en={`Google: ${pick} datasheet PDF`}
            vn={`Google: ${pick} datasheet PDF`}
            external
          />
          {/esp32|arduino|atmega|stm32/i.test(pick) && (
            <ResourceLink
              href={ARDUINO_REFERENCE}
              icon={<BookOpen className="size-3.5" />}
              en="Arduino language reference"
              vn="Tài liệu Arduino"
              external
            />
          )}
          <p className="text-[10px] text-[var(--color-muted)] pt-1">
            <Bilingual
              en="Links open external sites. No tracking, no ads."
              vn="Liên kết mở trang ngoài. Không theo dõi, không quảng cáo."
            />
          </p>
        </div>
      )}
    </div>
  )
}

function ResourceLink({ href, icon, en, vn, external }: { href: string; icon: React.ReactNode; en: string; vn: string; external?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[color-mix(in_srgb,var(--color-acc)_10%,transparent)] transition text-[var(--color-fg)] hover:text-[var(--color-acc)]"
    >
      {icon}
      <span className="flex-1"><Bilingual en={en} vn={vn} /></span>
      {external && <ExternalLink className="size-3 opacity-50" />}
    </a>
  )
}
