export interface TroubleshootingItem {
  id: string
  title: string
  checks: string[]
  commonMistake: string
}

export const TROUBLESHOOTING: Record<string, TroubleshootingItem> = {
  '1-1': {
    id: '1-1',
    title: 'LED + Điện trở hạn dòng',
    checks: [
      'Cắm ngược cực LED? Chân dài hơn là Anode (+), nối về phía nguồn dương; chân ngắn hơn (mặt vát ở viền nhựa) là Cathode (-), nối về GND.',
      'Điện trở quá lớn? Nếu lỡ dùng trở > 10kΩ với nguồn 5V, dòng dưới 0.3mA LED sẽ tối mờ hoặc mắt thường không nhìn thấy.',
      'Đo điện áp nguồn Vcc bằng đồng hồ VOM xem có đủ 5V (hoặc 3.3V) không.',
      'Chân cắm breadboard có bị lỏng hoặc cắm nhầm hàng ray nguồn (thanh đỏ/xanh) không?'
    ],
    commonMistake: 'Quên lắp điện trở hạn dòng khiến LED sáng lóe lên rồi cháy đứt (chết hở mạch) ngay tức khắc.'
  },
  '1-2': {
    id: '1-2',
    title: 'LED nối tiếp vs song song',
    checks: [
      'Khi mắc nối tiếp: Tổng Vf của các LED có vượt quá nguồn cấp không? (Ví dụ 3 LED xanh dương 3.2V × 3 = 9.6V > 5V nên không sáng được).',
      'Khi mắc song song: Các LED có dùng chung 1 điện trở không? LED có Vf thấp hơn sẽ hút hết dòng điện, khiến LED kia mờ hoặc tắt hẳn. Mỗi nhánh song song PHẢI có điện trở riêng.',
      'Kiểm tra lại xem có con LED nào trong chuỗi nối tiếp bị cắm ngược cực không (chỉ cần 1 con ngược là cả chuỗi tắt).'
    ],
    commonMistake: 'Mắc nhiều LED song song nhưng chỉ dùng 1 con trở chung để tiết kiệm linh kiện — dòng chia không đều dễ làm cháy LED.'
  },
  '1-3': {
    id: '1-3',
    title: 'Nút nhấn + Điện trở kéo (Pull-up)',
    checks: [
      'Xác định chân nút nhấn 4 chân: 2 chân cùng một bên thường đã nối tắt ngầm bên trong. Đã cắm chéo 2 góc đối diện chưa?',
      'Đã nối điện trở kéo 10kΩ lên VCC (pull-up) hoặc xuống GND (pull-down) chưa? Chân INPUT của MCU nếu để hở sẽ bị "lơ lửng" (floating) nhảy mức loạn xạ do nhiễu môi trường.',
      'Dùng đồng hồ VOM thang đo Ohm (hoặc thông mạch) bấm thử nút nhấn xem tiếp điểm có đóng mở dứt khoát không.'
    ],
    commonMistake: 'Cắm nhầm 2 chân vốn đã thông nhau của nút bấm khiến mạch luôn ở trạng thái đóng (luôn bị kích).'
  },
  '1-4': {
    id: '1-4',
    title: 'Cầu phân áp + Biến trở',
    checks: [
      'Tải mắc vào Vout có kéo dòng không? Nếu trở kháng tải quá nhỏ (nhỏ hơn 10× R2), điện áp Vout sẽ bị sụt mạnh so với công thức lý thuyết.',
      'Điện áp Vout đo bằng VOM có vượt quá ngưỡng chịu đựng của chân vi điều khiển không? (ESP32 chỉ nhận tối đa 3.3V, cấp 5V sẽ hỏng chân ADC).',
      'Biến trở 3 chân: Đã nối chân giữa (Wiper) làm ngõ ra Vout và 2 chân bìa vào VCC/GND chưa? Nếu nối nhầm chân giữa với chân bìa thành biến trở 2 chân.'
    ],
    commonMistake: 'Dùng cầu phân áp điện trở để hạ nguồn cấp cho động cơ hoặc module ESP32 — cầu phân áp chỉ dùng làm mẫu điện áp tín hiệu, không cấp dòng tải được!'
  },
  '1-5': {
    id: '1-5',
    title: 'Đèn tự sáng khi trời tối (LDR)',
    checks: [
      'Đo điện trở quang trở (LDR): Lúc chiếu sáng mạnh thường đạt 1kΩ - 5kΩ, lúc che tối đạt 50kΩ - 500kΩ. Trở phân áp cố định nên chọn trong khoảng 10kΩ.',
      'Đảo ngược logic sáng/tối: Nếu muốn điện áp tăng khi trời tối thì đặt LDR ở nhánh trên (nối VCC) hay nhánh dưới (nối GND)? Thử hoán đổi vị trí LDR và trở cố định.',
      'Chân biến trở chỉnh ngưỡng (nếu có) đã xoay đúng dải nhạy sáng mong muốn chưa?'
    ],
    commonMistake: 'Chọn điện trở phân áp quá nhỏ (ví dụ 100Ω) so với dải trở của LDR (hàng chục kΩ) làm biên độ sụt áp quá hẹp, vi điều khiển không nhận diện được.'
  },
  '1-6': {
    id: '1-6',
    title: 'Còi buzzer',
    checks: [
      'Phân biệt còi chủ động (Active) vs thụ động (Passive): Còi active chỉ cần cấp nguồn DC là tự kêu; còi passive bắt buộc phải cấp xung PWM (vài kHz) mới phát ra tiếng.',
      'Cực tính của buzzer: Cực dương (+) thường có chân dài hơn hoặc dấu cộng in trên nắp bảo vệ.',
      'Bóc lớp tem decal bảo vệ dán trên lỗ phát âm thanh của còi ra chưa? Tem này để chống nước khi hàn mạch.'
    ],
    commonMistake: 'Lấy còi passive cắm trực tiếp vào nguồn 5V DC rồi tưởng còi hỏng vì chỉ nghe thấy tiếng "tách" một cái rồi im lặng.'
  },
  '2-1': {
    id: '2-1',
    title: 'Transistor NPN làm công tắc',
    checks: [
      'Chung mass (GND): GND của vi điều khiển và GND của nguồn tải 12V ĐÃ NỐI CHUNG CHƯA? Nếu không chung GND, dòng Base không có đường khép mạch về vi điều khiển.',
      'Thứ tự chân B-C-E: Transistor C1815 (TO-92) chân nhìn từ mặt vát là E-C-B, trong khi 2N2222 hay SS8050 có thể là E-B-C. Tra datasheet đúng mã linh kiện.',
      'Điện trở Base (Rb): Đã lắp trở hạn dòng Base (thường 1kΩ - 4.7kΩ) chưa? Nối thẳng chân MCU vào cực Base sẽ làm chập chân MCU và nổ mối nối B-E (Vbe = 0.7V).'
    ],
    commonMistake: 'Quên nối chung GND giữa mạch điều khiển (ESP32 3.3V) và mạch công suất (12V).'
  },
  '2-2': {
    id: '2-2',
    title: 'Relay + Diode chống xung ngược (Flyback)',
    checks: [
      'Diode dập xung (1N4007): Vạch trắng (Cathode) PHẢI nối lên nguồn dương (+) của cuộn dây relay, Anode nối cực C transistor. Mắc ngược cực diode sẽ chập nguồn làm nổ transistor!',
      'Dòng cuộn hút: Cuộn relay 5V ngốn 70mA - 100mA, chân MCU không cấp nổi trực tiếp mà bắt buộc phải qua BJT hoặc MOSFET.',
      'Nghe thử relay có kêu "tách" dứt khoát không khi kích mức HIGH vào Base transistor.'
    ],
    commonMistake: 'Không lắp diode flyback song song ngược với cuộn hút relay — điện áp cảm ứng hàng trăm Volt khi ngắt cuộn dây sẽ đánh thủng transistor ngay sau vài lần bật tắt.'
  },
  '2-3': {
    id: '2-3',
    title: 'RC lọc + Tụ Decoupling',
    checks: [
      'Cực tính tụ hóa: Vạch sọc màu sáng có dấu trừ (-) là cực âm, phải nối xuống GND. Cắm ngược cực tụ hóa khi cấp điện sẽ bị phù đầu hoặc phát nổ.',
      'Vị trí tụ decoupling (100nF): Phải đặt càng gần chân cấp nguồn VCC và GND của IC càng tốt (dưới 1cm trên breadboard/PCB).',
      'Giá trị điện trở và tụ: Tần số cắt fc = 1 / (2πRC). Đảm bảo tần số tín hiệu nằm dưới tần số cắt đối với mạch lọc thông thấp (Low-pass).'
    ],
    commonMistake: 'Đặt tụ lọc xa chân IC hàng chục cm qua dây cắm breadboard dài ngoằng — điện cảm của dây làm mất hoàn toàn tác dụng chống nhiễu cao tần.'
  },
  '2-4': {
    id: '2-4',
    title: 'IC 555 — Mạch dao động (Astable)',
    checks: [
      'Chân 4 (RESET): Đã kéo lên VCC chưa? Nếu thả nổi chân 4, IC 555 sẽ tự kích ngắt hoặc dao động chập chờn.',
      'Chân 5 (CONTROL): Đã có tụ gốm 10nF xuống GND để khử nhiễu kích sai cho bộ so sánh nội bộ chưa?',
      'Chân 8 nối VCC (4.5V - 15V), chân 1 nối GND. Chân 2 (TRIG) và chân 6 (THRESH) đã nối tắt với nhau chưa?',
      'Tần số dao động: f = 1.44 / ((R1 + 2*R2) * C). Nếu tần số quá cao (>100kHz), LED ở ngõ ra chân 3 sẽ sáng mờ liên tục vì mắt không kịp nhận biết.'
    ],
    commonMistake: 'Thả nổi chân 4 (Reset) hoặc quên nối tắt chân 2 với chân 6 trong cấu hình mạch dao động đa hài.'
  },
  '2-5': {
    id: '2-5',
    title: 'Op-amp LM358 — Buffer & Comparator',
    checks: [
      'Điện áp Common-Mode ngõ vào: LM358 nhận được tín hiệu chạm sát GND (0V), nhưng ngõ ra chỉ lên tối đa VCC - 1.5V (nguồn 5V ngõ ra cao nhất khoảng 3.5V).',
      'Chân op-amp thừa không dùng: Nếu chỉ dùng 1 kênh trong IC kép LM358, kênh còn lại phải đấu thành Buffer (nối Out về In-) và In+ nối về điện áp giữa (hoặc GND) để tránh tự kích dao động hao nguồn.',
      'Mạch so sánh (Comparator): Đã có một chút hồi tiếp dương (histeresis) chưa nếu tín hiệu vào biến thiên chậm, để tránh ngõ ra bị rung chuyển trạng thái liên tục.'
    ],
    commonMistake: 'Tưởng ngõ ra LM358 lên được đủ 5V khi cấp nguồn 5V — LM358 không phải Rail-to-Rail output!'
  },
  '2-6': {
    id: '2-6',
    title: 'Mạch nguồn — LDO và Buck',
    checks: [
      'Độ sụt áp Dropout của LM7805: Cần chênh áp Vin tối thiểu 2V - 2.5V. Cấp nguồn 6V vào LM7805 thì ngõ ra sẽ không đủ 5V ổn định!',
      'Tản nhiệt cho LDO: Công suất tỏa nhiệt P = (Vin - Vout) × I. Nếu Vin=12V, Vout=5V, dòng 0.5A thì P = 7V × 0.5A = 3.5W! IC sẽ bỏng tay và ngắt nhiệt bảo vệ nếu không có nhôm tản nhiệt.',
      'Tụ lọc ngõ vào/ra: LM7805 bắt buộc phải có tụ 0.33µF ở In và 0.1µF ở Out sát chân để chống tự kích dao động.'
    ],
    commonMistake: 'Dùng LM7805 hạ áp từ 12V xuống 5V để nuôi tải 1A (tỏa nhiệt 7W!) mà không gắn tản nhiệt to, IC ngắt sau vài giây.'
  },
  '2-7': {
    id: '2-7',
    title: 'ESP32 đọc ADC + Xuất PWM',
    checks: [
      'Điện áp ngõ vào ADC: Tuyệt đối không vượt quá 3.3V! Chân ADC của ESP32 không chịu được 5V.',
      'ADC2 và WiFi: Các chân ADC2 (GPIO 0, 2, 4, 12, 13, 14, 15, 25, 26, 27) không dùng được khi bật WiFi. Luôn ưu tiên dùng các chân thuộc ADC1 (GPIO 32 - 39).',
      'Đặc tuyến phi tuyến của ADC ESP32: Vùng < 0.1V và > 3.1V bị bão hòa (chết điểm). Cần căn chỉnh hoặc dùng hàm calib.'
    ],
    commonMistake: 'Dùng các chân GPIO 34-39 làm OUTPUT — các chân này trên ESP32 chỉ là INPUT ONLY, không thể xuất PWM hay digitalWrite.'
  },
  '2-8': {
    id: '2-8',
    title: 'MOSFET lái dải LED / Quạt 12V',
    checks: [
      'Trở xả cực Gate (Pull-down): Bắt buộc có trở 10kΩ - 100kΩ từ chân Gate xuống Source (GND). Nếu không có, điện dung ký sinh Cgs giữ áp làm MOSFET tiếp tục dẫn dù ngắt MCU.',
      'Điện áp mở Gate Vgs: MOSFET thường như IRFZ44N cần Vgs = 10V mới mở hoàn toàn (Rdson nhỏ). Kích bằng 3.3V từ ESP32 sẽ khiến MOSFET rơi vào vùng tuyến tính, nóng dữ dội và sụt áp. Phải dùng loại Logic-Level (IRLZ44N, AO3400).',
      'Đúng cực Drain và Source: Kênh N nối tải ở cực Drain, cực Source nối thẳng GND.'
    ],
    commonMistake: 'Dùng MOSFET công suất chuẩn (cần 10V Gate) kích bằng tín hiệu 3.3V từ ESP32 — MOSFET không mở hết, điện trở cao làm cháy MOSFET.'
  },
  '3-1': {
    id: '3-1',
    title: 'Cầu H — Đảo chiều động cơ',
    checks: [
      'Dead-time chống chập nguồn (Shoot-through): Khi đảo chiều quay, phải ngắt nhánh cũ trước khi bật nhánh mới ít nhất vài micro-giây. Nếu 2 van trên và dưới cùng dẫn đồng thời, nguồn cấp sẽ bị ngắn mạch!',
      'Diode hồi tiếp bánh đà (Freewheeling): Nếu dùng MOSFET rời làm cầu H, phải có diode xung bảo vệ dập sức điện động cảm ứng từ cuộn dây động cơ.',
      'Tụ lọc nguồn motor: Đặt tụ hóa dung lượng lớn (470µF - 1000µF) ngay tại chân nguồn của cầu H để gánh dòng khởi động (inrush current).'
    ],
    commonMistake: 'Đảo chiều motor đột ngột bằng code không có thời gian trễ (dead-time) làm nổ cặp MOSFET cầu H.'
  },
  '3-2': {
    id: '3-2',
    title: 'Buck converter tự thiết kế',
    checks: [
      'Đường loop dòng xung cao tần (Hot Loop): Vòng nối giữa tụ In, Switch, Diode và GND phải đi ngắn và diện tích nhỏ nhất có thể.',
      'Diode Schottky: Bắt buộc dùng diode xung nhanh Schottky (SS34, 1N5822), tuyệt đối không dùng diode chỉnh lưu 1N4007 vì thời gian phục hồi quá chậm làm chết mạch.',
      'Cuộn cảm bão hòa: Chọn cuộn cảm có dòng bão hòa (Isat) lớn hơn dòng đỉnh của mạch ít nhất 30%.'
    ],
    commonMistake: 'Đường hồi tiếp (Feedback pin) đi ngang qua cuộn cảm bị nhiễm sóng điện từ làm áp ngõ ra dao động bất ổn.'
  },
  '3-3': {
    id: '3-3',
    title: 'Level Shifter 5V ↔ 3.3V',
    checks: [
      'Nối chung GND: Đã nối GND của nguồn 3.3V và GND của nguồn 5V vào chân GND của mạch chuyển đổi chưa?',
      'Cấp đúng nguồn 2 phía: Phía LV cấp 3.3V, phía HV cấp 5V. Cắm ngược sẽ làm hỏng linh kiện phía 3.3V.',
      'Trở kéo Pull-up: Bus I2C bắt buộc cần điện trở kéo lên nguồn ở cả 2 phía LV và HV (thường module đã tích hợp sẵn trở 10kΩ).'
    ],
    commonMistake: 'Dùng mạch level shifter chia áp đơn hướng cho bus 2 chiều như SDA của I2C — I2C bắt buộc phải dùng mạch 2 chiều MOSFET.'
  },
  '3-4': {
    id: '3-4',
    title: 'Cách ly quang (Optocoupler) & SSR',
    checks: [
      'Tách rời 2 miền GND: Mục đích của opto là cách ly hoàn toàn. Nếu nối chung GND của bên sơ cấp và thứ cấp thì mất hết tác dụng cách ly chống nhiễu sét/xung công nghiệp!',
      'Điện trở hạn dòng LED ngõ vào: Bên trong opto là 1 con LED hồng ngoại (Vf ≈ 1.2V). Phải có trở hạn dòng (thường 220Ω - 1kΩ) ở chân điều khiển.',
      'Tốc độ đáp ứng: Opto thông dụng như PC817 có tốc độ chuyển mạch khá chậm (vài kHz), không dùng được cho bus SPI hoặc PWM tần số cao (hàng chục kHz).'
    ],
    commonMistake: 'Nối chung mass GND của hai bên mạch cách ly quang, vô hiệu hóa hoàn toàn hàng rào bảo vệ an toàn.'
  },
  '3-5': {
    id: '3-5',
    title: 'Đo dòng và công suất (Shunt / INA219)',
    checks: [
      'Mắc đúng chiều Shunt: Điện trở Shunt phải mắc NỐI TIẾP trên đường nguồn (High-side) hoặc đường GND (Low-side). Mắc song song Shunt với nguồn sẽ gây chập nổ nguồn!',
      'Địa chỉ I2C của module INA219: Mặc định là 0x40. Kiểm tra bằng code I2C scanner nếu vi điều khiển báo không tìm thấy thiết bị.',
      'Dải điện áp đo tối đa: INA219 đo được tối đa 26V. Không cấp nguồn đo vượt quá ngưỡng này.'
    ],
    commonMistake: 'Mắc nối tiếp đồng hồ đo dòng nhưng quên chuyển que đo trên đồng hồ hoặc cắm que đo dòng đo song song vào 2 cực ắc quy.'
  },
  '3-6': {
    id: '3-6',
    title: 'Sạc Li-ion + Boost 5V (TP4056)',
    checks: [
      'Phân cực pin: TUYỆT ĐỐI không cắm ngược cực B+ và B- của pin 18650. Module TP4056 không có diode chống cắm ngược sẽ bốc khói nổ IC ngay lập tức!',
      'Dòng sạc phù hợp: Điện trở Rprog mặc định 1.2kΩ cho dòng sạc 1A. Với pin dung lượng nhỏ (<1000mAh), cần thay Rprog lớn hơn để dòng sạc không vượt quá 1C (tránh phồng nổ pin).',
      'Mạch bảo vệ quá xả: Nên dùng loại module TP4056 có tích hợp IC bảo vệ DW01 + FS8205 (có thêm 2 chân OUT+ và OUT-) để tự ngắt khi pin xuống dưới 2.5V.'
    ],
    commonMistake: 'Lắp ngược cực pin Li-ion vào module sạc TP4056.'
  },
  '3-7': {
    id: '3-7',
    title: 'Bus I2C / SPI nhiều thiết bị',
    checks: [
      'Xung đột địa chỉ I2C: Đảm bảo các cảm biến trên cùng đường I2C không trùng địa chỉ hex (ví dụ cả 2 cùng là 0x68). Đổi địa chỉ qua chân AD0/ADDR nếu cần.',
      'Trở kéo Pull-up trên bus I2C: Toàn bộ bus chỉ nên có 1 cặp trở pull-up 4.7kΩ hoặc 10kΩ. Nếu cắm 5 module mà module nào cũng có trở pull-up 4.7kΩ gắn sẵn, tổng trở kháng song song sẽ tụt xuống dưới 1kΩ khiến chân vi điều khiển không kéo nổi mức LOW!',
      'Chiều dài dây nối: I2C chỉ thiết kế cho khoảng cách ngắn dưới 30cm. Dây dài sẽ bị điện dung ký sinh làm méo dạng sóng xung vuông.'
    ],
    commonMistake: 'Dây nối I2C quá dài và đi song song sát cạnh dây nguồn động cơ tạo xung nhiễu làm treo toàn bộ bus I2C (I2C Bus Lockup).'
  },
  '3-8': {
    id: '3-8',
    title: 'Chống nhiễu, ESD và bảo vệ',
    checks: [
      'Diode TVS / Zener dập gai áp: Đặt ngay cửa ngõ tiếp xúc từ bên ngoài (cổng USB, nút bấm vỏ máy) xuống vỏ kim loại hoặc GND.',
      'Mặt phẳng mass (Ground Plane): Trên PCB, mặt mass rộng và liên tục giúp giảm thiểu diện tích vòng lặp và tản nhiễu tốt nhất.',
      'Cuộn cảm Lọc Common-Mode trên đường nguồn hoặc đường tín hiệu vi sai (D+/D-).'
    ],
    commonMistake: 'Để đường mạch tín hiệu Reset vi điều khiển chạy dài ngoằng không có tụ lọc hoặc bọc mass, máy hoạt động chập chờn mỗi khi có thiết bị khác bật tắt.'
  },
  '3-9': {
    id: '3-9',
    title: 'Vẽ PCB trong KiCad → Đặt sản xuất',
    checks: [
      'Kiểm tra DRC (Design Rule Check): Đã chạy kiểm tra khoảng cách an toàn (clearance), độ rộng nét dây (trace width) theo chuẩn của nhà sản xuất (ví dụ JLCPCB 6mil/6mil) chưa?',
      'Độ rộng đường nguồn vs tín hiệu: Đường cấp nguồn và mass phải to hơn (tối thiểu 0.5mm - 1mm hoặc đổ đồng GND) để chịu dòng và giảm sụt áp.',
      'Kích thước chân linh kiện (Footprint): Đã in bản mạch 1:1 ra giấy A4 rồi ướm thử linh kiện thật lên lỗ chân chưa trước khi bấm nút đặt sản xuất?'
    ],
    commonMistake: 'Lấy nhầm footprint linh kiện (ví dụ chân cắm 2.0mm thay vì 2.54mm, hoặc chân IC SOIC hẹp thay vì rộng) khiến board làm về không cắm vừa linh kiện.'
  }
}
