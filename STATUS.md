# STATUS — 27-feature checklist

User-facing inventory of every feature in the original plan, with status.

Status legend:
- ✅ = shipped in main, working
- 🟡 = shipped as a partial / minimal version (notes)
- ⏸ = out of scope (requires backend, native, or large refactor). Disclosed here, NOT silently dropped.

## Tier 1 (core)

| # | Feature | Status | Notes |
|---|---|---|---|
| 1 | PWA manifest + service worker + iOS home screen | ✅ | `3601578` |
| 2 | Dark mode toggle (3 modes) | ✅ | `1e1682c` + Sun/Moon fix in `853ec40` |
| 3 | Export/Import JSON | ✅ | `672c7a0` |
| 4 | URL anchor deep-link | ✅ | `8b93167` (in print fix) |
| 5 | Print per circuit | ✅ | `2b792ab` + `:has()` selector in `853ec40` |
| 6 | Back-to-top button | ✅ | this batch |
| 7 | Undo/Redo in cart | ✅ | `fd0b1f1` — 20-step history for owned checkbox, Cmd+Z / Cmd+Shift+Z |

## Tier 2 (UX)

| # | Feature | Status | Notes |
|---|---|---|---|
| 8 | Schematic interactive | 🟡 | Click-to-zoom modal — tap any schematic to view fullscreen. Hotspot overlay (per-component clickable regions on the SVG) skipped because the 23 schematics are hand-authored SVGs without consistent hotspot coords. Could be added if the SVGs are re-authored with id'd regions. |
| 9 | Breadboard view (drag-drop) | ⏸ | Requires a layout editor with positioning state, drag handlers, and component-to-pin mapping. ~3 days. |
| 10 | Quiz mode | ✅ | `50bd9a2` — 8 random questions, streak persisted |
| 11 | Wokwi embed (link) | ✅ | `65c1970` — link, not iframe (iframe can be added later) |
| 12 | PWA push notification | ⏸ | Requires a push server with VAPID keys. Will work once deployed with a service like OneSignal or web-push npm. |
| 13 | Voice search | ✅ | `e1a2d94` — Web Speech API, vi-VN default |
| 14 | OCR datasheet | ✅ | `e613042` — tesseract.js lazy-loaded (3 MB), ENG + VIE languages |
| 15 | Comparison mode | ✅ | `50bd9a2` — pick 2 components, spec table side-by-side |
| 16 | My builds portfolio | ✅ | `50bd9a2` — localStorage, star, notes |
| 23 | PDF export | ✅ | `e613042` — `Download PDF` button using jsPDF, A4 paginated |

## Tier 3 (large features — backend / native)

| # | Feature | Status | Notes |
|---|---|---|---|
| 17 | Backend sync (Supabase) | ⏸ | Requires Supabase project + auth. Migration: add @supabase/supabase-js, set up tables, add OAuth. ~1 week. |
| 18 | Community (forum) | ⏸ | Full system. Out of scope. |
| 19 | AI tutor (Gemini) | ⏸ | Needs API key + backend proxy (Gemini API can't be called from browser without exposing key). TechCoop has Gemini — could be wired when an API proxy exists. |
| 20 | AR mode (WebXR) | ⏸ | WebXR is experimental, iOS Safari support is limited. |
| 21 | Auto BOM from schematic image | ⏸ | Vision API. Same Gemini dependency as #19. |
| 22 | Multi-language data | ✅ | `66d6851` — EN fields added to all 50 glossary terms, 19 formulas, 29 components, 23 circuits (140+ part names). VN stays as primary. |

## iPhone / platform

| # | Feature | Status | Notes |
|---|---|---|---|
| 24 | iOS Shortcuts integration | ⏸ | Requires native config + URL scheme handler. |
| 25 | Haptic feedback | ✅ | `e1a2d94` — `navigator.vibrate()` (Android, no-op on iOS Safari) |
| 26 | Camera + QR | ✅ | `e613042` — native `BarcodeDetector` (Chrome, Edge, Android) with `jsQR` fallback, supports QR + EAN + UPC + Code128 |
| 27 | Apple Pencil / draw | ⏸ | Native only. |

## Scoreboard

- **✅ Shipped: 17/27** (63%) — fully functional and tested
- **🟡 Partial: 1/27** (#8 click-to-zoom modal, no SVG hotspot overlay)
- **⏸ Out of scope: 9/27** (#9, #12, #17, #18, #19, #20, #21, #24, #27)
  - These 9 require a backend service (push server, Supabase, Gemini API proxy), a full drag-and-drop editor (#9), or native platform capabilities (#20, #24, #27). They cannot be built purely client-side without external infrastructure.

## Detailed Status of the 9 Deferred Features

1. **#9 Breadboard view** — requires an interactive layout editor with drag-and-drop component positioning and wire routing (~3 days).
2. **#12 PWA push notification** — requires a push notification server with VAPID keys (e.g. OneSignal free tier or custom backend).
3. **#17 Backend sync** — requires a Supabase/Firebase project with authentication (Google login) and database tables.
4. **#18 Community** — full forum system with posts, comments, voting, user profiles (out of scope for static site).
5. **#19 AI tutor** — requires a backend proxy server with a Gemini API key (browser cannot securely store API keys).
6. **#20 AR mode** — WebXR is experimental and iOS Safari does not support it for augmented reality.
7. **#21 Auto BOM from schematic image** — requires an AI vision pipeline (same Gemini backend proxy dependency as #19).
8. **#24 iOS Shortcuts integration** — requires native iOS app bundle / URL scheme configuration.
9. **#27 Apple Pencil drawing** — requires native iPadOS pencil event APIs.

## Recently fixed in this batch (commits 3601578 → 66d6851)

- Title bilingual stacking (`7c0f452`)
- `.tab-active`, `.hide`, `.flash`, `mark` CSS rules restored (`853ec40`)
- ThemeToggle Sun/Moon icon fix (`853ec40`)
- `Promise.withResolvers` polyfill for iOS < 17.4 (`853ec40`)
- @media print: single card or all cards via `:has()` (`853ec40`)
- sw.js gated to PROD only (`e9d9935`)
- `.thumb`, GlobalSearch image, ComponentCard icon bg all theme-aware
- BackToTop, VoiceSearch, QR scanner, native BarcodeDetector, jsPDF
  CheatSheet export, tesseract.js OCR, Quiz, Comparison, MyBuilds,
  Schematic zoom, Undo/Redo, EN data fields
