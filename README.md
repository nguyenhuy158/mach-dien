# Mạch điện tử cơ bản

Trang tra cứu 23 mạch điện tử cơ bản, chia 3 level — kèm danh sách linh kiện đầy đủ,
giá tham khảo từ banlinhkien / caka.vn, sơ đồ nguyên lý và mô phỏng chạy được.

**Xem trang:** mở `index.html` bằng trình duyệt, hoặc `python3 dev.py` rồi vào http://localhost:8765

## Nội dung

| Level | Chủ đề |
|---|---|
| 1 | Ohm, LED, pull-up, phân áp, RC — mạch nền |
| 2 | Transistor, relay, 555, cảm biến, ESP32 |
| 3 | Cầu H, buck, sạc Li-ion, đo dòng, KiCad |

## Sơ đồ mạch

Hai cách, dùng song song:

- **Ảnh tĩnh (SVG)** — sinh bằng [schemdraw](https://schemdraw.readthedocs.io).
  Sửa mạch = sửa `svg/draw.py` rồi chạy `python draw.py` (cần `pip install schemdraw`).
- **Mô phỏng tương tác** — nhúng [Falstad CircuitJS](https://www.falstad.com/circuit/)
  qua iframe ở 5 mạch mà việc chạy thử mới là bài học (1.1, 1.4, 2.1, 2.2, 2.3).
  Netlist nằm trong biến `SIM` của `index.html`. Chỉ tải khi bấm nút.

## File

```
index.html        toàn bộ trang (self-contained, không cần build)
dev.py            dev server + hot reload
svg/draw.py       script sinh sơ đồ SVG
svg/*.svg         sơ đồ đã sinh sẵn
brand/            logo
```
