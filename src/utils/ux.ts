// Tiny utilities for low-effort UX enhancements

// Vibrate if available (Android devices, some iOS PWAs in standalone mode).
// On unsupported devices, this is a silent no-op so safe to call anywhere.
export function haptic(ms = 10) {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(ms) } catch { /* noop */ }
  }
}

// Diacritic + case insensitive substring matching
import { nrm } from '../data/circuits'
export function tokenScore(haystack: string, tokens: string[]): number {
  const h = nrm(haystack)
  let score = 0
  for (const t of tokens) if (t && h.includes(t)) score++
  return score
}
