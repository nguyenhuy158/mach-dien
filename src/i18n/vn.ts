// Vietnamese strings — primary source for VN-only and bilingual modes
export const vn = {
  // Header
  siteTitle: 'Mạch điện tử cơ bản',
  siteSubtitle: '23 mạch chia 3 level — kèm danh sách linh kiện đầy đủ',
  tabMach: 'Mạch điện',
  tabHoc: 'Học',
  tabGio: 'Giỏ hàng',
  search: 'Tìm mọi thứ',
  searchPlaceholder: 'Tìm mạch, linh kiện, sản phẩm, giá…',
  searchHintMach: 'Tìm mạch hoặc linh kiện… (vd: mosfet, 555, relay)',

  // Filter bar
  filterAll: 'Tất cả',
  filterNa: 'Thiếu nguồn',
  filterLevel: (n: number) => `Level ${n}`,

  // Info bar
  infoNa: 'Dòng tô đỏ = không tìm thấy ở cả banlinhkien.com và caka.vn (phải mua chỗ khác: Hshop, Nshop, Icdayroi, Shopee…). Giá lấy trực tiếp từ trang bán, bấm vào giá để mở sản phẩm. Rê chuột lên giá để xem đúng tên sản phẩm.',

  // Footer
  footerPrice: 'Giá lấy tự động từ banlinhkien.com và caka.vn (cập nhật 09/2026) — có thể đổi, kiểm tra lại khi đặt hàng. Ký hiệu ✕ = shop đó không có, — = không phải linh kiện mua lẻ.',
  footerSim: 'Mô phỏng trước khi ráp: Falstad · Wokwi (có Arduino/ESP32).',
  footerSafety: 'An toàn: không đụng vào điện 220V khi chưa có người hướng dẫn trực tiếp.',

  // Common
  ok: 'OK',
  cancel: 'Hủy',
  print: 'In / Xuất PDF',
  book: 'Đã đánh dấu',
  unbook: 'Bỏ đánh dấu',
  bookmark: 'Đánh dấu đã học',
  price: 'Giá',
  qty: 'SL',
  spec: 'Thông số',
  name: 'Linh kiện',
  used: 'Dùng cho mạch',
  total: 'Tổng',
  image: 'Ảnh',
  noSource: 'mua chỗ khác',
  discount: 'Giảm giá',
  share: 'Sao chép liên kết',
  formula: 'Công thức',
  applications: 'Ứng dụng',
  notes: 'Ghi chú',
  bookmarked: 'ĐÃ CÓ',
  cart: {
    forCircuit: 'Linh kiện cho mạch',
    csvExtra: 'Mua thêm (CSV)',
    noSource: 'Chưa có nguồn',
    owned: 'Đã có sẵn',
    mustPay: 'Cần trả ngay',
    section1: '1. Linh kiện & module theo mạch',
    section1Desc: 'SL = số lượng cần nhiều nhất trong 1 mạch. Món bán theo gói/vỉ chỉ tính 1 gói (đủ xài cho mọi mạch). Dòng gộp nhiều tên = cùng 1 sản phẩm.',
    section2: '2. Mua thêm — dụng cụ & vật tư',
    section2Desc: 'Lấy từ file gio_hang_banlinhkien.csv, không thuộc mạch nào.',
    section2Use: 'Mua thêm — không thuộc mạch nào (dụng cụ / vật tư chung)',
    totalOrder: 'TỔNG CẦN MUA (mục 1 + 2)',
    section3: '3. Thiết bị đo & máy — mua sau, khi cần',
    section3Desc: 'Món trên 300k, chưa cần từ Level 1. Không tính vào tổng ở trên.',
    section4: '4. Không có ở banlinhkien / caka',
    section4Desc: 'Phải mua Hshop, Nshop, Icdayroi, Shopee… — chưa tính vào tổng.',
  },

  // Cart row
  cartColHave: 'Có',
  cartColNo: '#',
  cartColName: 'Linh kiện',
  cartColUse: 'Dùng cho mạch',
  cartColQty: 'SL',
  cartColPrice: 'Đơn giá',
  cartColLine: 'Thành tiền',
  cartColSrc: 'Nguồn',
  cartColImg: 'Ảnh',

  // Search
  searchTitle: 'Tìm mọi thứ',
  searchEmptyHint: 'Gõ để tìm: tên mạch, linh kiện, mã IC, tên sản phẩm…',
  searchNoResults: 'Không thấy gì khớp 🤷',
  searchFooter: '↑↓ chọn · ↵ mở · Esc đóng',
  searchGroup: {
    mach: 'Mạch',
    part: 'Linh kiện',
    product: 'Sản phẩm ở shop',
    csv: 'Mua thêm (CSV)',
    learnCmp: 'Linh kiện (Học)',
    learnFml: 'Công thức (Học)',
    learnGloss: 'Thuật ngữ (Học)',
  },

  // Learn
  learnTitle: 'Học điện tử',
  learnSection: {
    components: 'Linh kiện',
    formulas: 'Công thức',
    glossary: 'Thuật ngữ',
    tools: 'Tra cứu nhanh',
    cheatsheet: 'Cheat Sheet',
  },
  learnProgress: 'Tiến độ học',
  learnComplete: '🎉 Hoàn thành!',
  learnCalculator: '🧮 Tính nhanh',
  learnResistor: 'Mã màu điện trở (4 vạch)',
  learnResistorBand: (n: number) => `Vạch ${n}`,
  learnResistorMult: 'Hệ số',
  learnResistorTol: 'Sai số',
  learnSmd: 'Tra cứu mã SMD',
  learnSmdCode: 'Mã',
  learnSmdType: (n: number) => `Mã ${n} số`,
  learnPrint: 'In / Xuất PDF',

  // Settings
  settingsTitle: 'Bật/tắt cột',
  settingsReset: 'Hiện lại tất cả',
  settingsSync: 'Sao lưu / đồng bộ',
  settingsExport: 'Xuất JSON',
  settingsImport: 'Nhập JSON',
  settingsGroup: {
    cart: 'Bảng giỏ hàng',
    card: 'Bảng linh kiện trong mạch',
  },

  // Floating calc
  floatTitle: '⚡ Ohm: V = I·R',
  floatHint: 'V (V)', floatHint2: 'I (A)', floatHint3: 'R (Ω)',

  // Language toggle
  langTitle: 'Ngôn ngữ',
  langBilingual: 'EN/VN',
  langEn: 'EN',
  langVn: 'VN',

  // Theme toggle
  themeTitle: 'Giao diện',
  themeAuto: 'Tự động',
  themeLight: 'Sáng',
  themeDark: 'Tối',
}
