// Inline SVG schematic symbols for circuit/component cards.
// These are decorative — use aria-hidden in consuming components.

export function SchematicGlyph({ kind }: { kind: string }) {
  switch (kind) {
    case 'resistor':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20" aria-hidden="true">
          <line x1="0" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 12 L14 4 L22 20 L30 4 L38 20 L46 4 L50 12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="50" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'capacitor':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20" aria-hidden="true">
          <line x1="0" y1="12" x2="26" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="26" y1="4" x2="26" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="34" y1="4" x2="34" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="34" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'inductor':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20" aria-hidden="true">
          <line x1="0" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 12 Q12 4, 18 4 Q24 4, 24 12 Q24 4, 30 4 Q36 4, 36 12 Q36 4, 42 4 Q48 4, 48 12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="48" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'diode':
    case 'zener':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20" aria-hidden="true">
          <line x1="0" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="22" y1="4" x2="22" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="30" y1="4" x2="30" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="30" y1="12" x2="22" y2="4" stroke="currentColor" strokeWidth="1.5" />
          <line x1="30" y1="12" x2="22" y2="20" stroke="currentColor" strokeWidth="1.5" />
          <line x1="30" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="40" y1="6" x2="40" y2="18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'led':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20" aria-hidden="true">
          <line x1="0" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="22" y1="4" x2="22" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="30" y1="4" x2="30" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="30" y1="12" x2="22" y2="4" stroke="currentColor" strokeWidth="1.5" />
          <line x1="30" y1="12" x2="22" y2="20" stroke="currentColor" strokeWidth="1.5" />
          <line x1="30" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="34" y1="6" x2="44" y2="2" stroke="currentColor" strokeWidth="1.5" />
          <line x1="36" y1="10" x2="46" y2="6" stroke="currentColor" strokeWidth="1.5" />
          <line x1="38" y1="14" x2="48" y2="10" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'npn':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20" aria-hidden="true">
          <circle cx="30" cy="12" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="22" y1="12" x2="22" y2="20" stroke="currentColor" strokeWidth="1.5" />
          <line x1="22" y1="12" x2="38" y2="2" stroke="currentColor" strokeWidth="1.5" />
          <line x1="22" y1="12" x2="40" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="40" y1="6" x2="40" y2="18" stroke="currentColor" strokeWidth="1.5" />
          <line x1="40" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'mosfet-n':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20" aria-hidden="true">
          <line x1="0" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="22" y1="4" x2="22" y2="20" stroke="currentColor" strokeWidth="2" />
          <line x1="26" y1="4" x2="26" y2="20" stroke="currentColor" strokeWidth="1.5" />
          <line x1="26" y1="12" x2="40" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="40" y1="6" x2="40" y2="18" stroke="currentColor" strokeWidth="1.5" />
          <line x1="40" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'relay':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20" aria-hidden="true">
          <rect x="8" y="6" width="20" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="6" x2="8" y2="6" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="18" x2="8" y2="18" stroke="currentColor" strokeWidth="1.5" />
          <line x1="28" y1="4" x2="36" y2="20" stroke="currentColor" strokeWidth="1.5" />
          <line x1="36" y1="6" x2="50" y2="6" stroke="currentColor" strokeWidth="1.5" />
          <line x1="50" y1="18" x2="36" y2="18" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    case 'opamp':
    case 'ic-555':
    case 'ic-rect':
      return (
        <svg viewBox="0 0 60 24" width="50" height="20" aria-hidden="true">
          <polygon points="6,4 6,20 36,12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="8" x2="6" y2="8" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="16" x2="6" y2="16" stroke="currentColor" strokeWidth="1.5" />
          <line x1="36" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 60 24" width="50" height="20" aria-hidden="true">
          <rect x="20" y="4" width="20" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <line x1="0" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" />
          <line x1="40" y1="12" x2="60" y2="12" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
  }
}
