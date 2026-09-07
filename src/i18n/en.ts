// English strings — primary for bilingual and EN-only modes
export const en = {
  // Header
  siteTitle: 'Basic Electronics',
  siteSubtitle: '23 circuits across 3 levels — with full component lists',
  tabMach: 'Circuits',
  tabHoc: 'Learn',
  tabGio: 'Cart',
  search: 'Search anything',
  searchPlaceholder: 'Search circuits, components, products, prices…',
  searchHintMach: 'Search circuits or components… (e.g. mosfet, 555, relay)',

  // Filter bar
  filterAll: 'All',
  filterNa: 'No source',
  filterLevel: (n: number) => `Level ${n}`,

  // Info bar
  infoNa: 'Red rows = not found at banlinhkien.com nor caka.vn (buy elsewhere: Hshop, Nshop, Icdayroi, Shopee…). Prices scraped from shop pages — click to open product. Hover to see exact product name.',

  // Footer
  footerPrice: 'Prices scraped from banlinhkien.com and caka.vn (updated 09/2026) — may change, double-check before ordering. ✕ = shop does not have it, — = not a retail part.',
  footerSim: 'Simulate before building: Falstad · Wokwi (Arduino/ESP32).',
  footerSafety: 'Safety: do not touch 220V mains without direct supervision.',

  // Common
  ok: 'OK',
  cancel: 'Cancel',
  print: 'Print / Export PDF',
  book: 'Bookmarked',
  unbook: 'Unbookmark',
  bookmark: 'Mark as learned',
  price: 'Price',
  qty: 'Qty',
  spec: 'Spec',
  name: 'Component',
  used: 'Used in',
  total: 'Total',
  image: 'Image',
  noSource: 'buy elsewhere',
  discount: 'Discount',
  formula: 'Formula',
  applications: 'Applications',
  notes: 'Notes',
  bookmarked: 'OWNED',
  cart: {
    forCircuit: 'Circuit components',
    csvExtra: 'Extra (CSV)',
    noSource: 'No source',
    owned: 'Owned',
    mustPay: 'To pay now',
    section1: '1. Components & modules by circuit',
    section1Desc: 'Qty = max needed in one circuit. Pack-sold items count as 1 pack. Merged rows = same product.',
    section2: '2. Extras — tools & supplies',
    section2Desc: 'From gio_hang_banlinhkien.csv, not tied to any circuit.',
    section2Use: 'Extras — not tied to any circuit (tools / consumables)',
    totalOrder: 'GRAND TOTAL (sections 1 + 2)',
    section3: '3. Test gear & tools — buy later',
    section3Desc: 'Items above 300k, not needed from Level 1. Not counted above.',
    section4: '4. Not at banlinhkien / caka',
    section4Desc: 'Buy at Hshop, Nshop, Icdayroi, Shopee… — not counted in total.',
  },

  // Cart row
  cartColHave: 'Owned',
  cartColNo: '#',
  cartColName: 'Component',
  cartColUse: 'Used in',
  cartColQty: 'Qty',
  cartColPrice: 'Unit',
  cartColLine: 'Line',
  cartColSrc: 'Source',
  cartColImg: 'Img',

  // Search
  searchTitle: 'Search anything',
  searchEmptyHint: 'Type to search: circuit names, components, IC part numbers, product names…',
  searchNoResults: 'No matches 🤷',
  searchFooter: '↑↓ select · ↵ open · Esc close',
  searchGroup: {
    mach: 'Circuits',
    part: 'Components',
    product: 'Shop products',
    csv: 'Extras (CSV)',
    learnCmp: 'Components (Learn)',
    learnFml: 'Formulas (Learn)',
    learnGloss: 'Glossary (Learn)',
  },

  // Learn
  learnTitle: 'Learn Electronics',
  learnSection: {
    components: 'Components',
    formulas: 'Formulas',
    glossary: 'Glossary',
    tools: 'Quick lookup',
    cheatsheet: 'Cheat Sheet',
  },
  learnProgress: 'Learning progress',
  learnComplete: '🎉 Completed!',
  learnCalculator: '🧮 Quick calc',
  learnResistor: 'Resistor color code (4-band)',
  learnResistorBand: (n: number) => `Band ${n}`,
  learnResistorMult: 'Multiplier',
  learnResistorTol: 'Tolerance',
  learnSmd: 'SMD code lookup',
  learnSmdCode: 'Code',
  learnSmdType: (n: number) => `${n}-digit code`,
  learnPrint: 'Print / Export PDF',

  // Settings
  settingsTitle: 'Toggle columns',
  settingsReset: 'Show all',
  settingsGroup: {
    cart: 'Cart table',
    card: 'Component table in circuit',
  },

  // Floating calc
  floatTitle: '⚡ Ohm: V = I·R',
  floatHint: 'V (V)', floatHint2: 'I (A)', floatHint3: 'R (Ω)',

  // Language toggle
  langTitle: 'Language',
  langBilingual: 'EN/VN',
  langEn: 'EN',
  langVn: 'VN',

  // Theme toggle
  themeTitle: 'Theme',
  themeAuto: 'Auto',
  themeLight: 'Light',
  themeDark: 'Dark',
}
