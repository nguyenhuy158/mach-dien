"""Sinh so do mach (SVG) cho index.html — chay: python draw.py
Yeu cau: pip install schemdraw

Ghi chu ky thuat (da tra gia de biet):
  - svgconfig.text='text'  -> giu duoc dau tieng Viet (mac dinh convert sang path, mat dau)
  - elm.NFet().reverse()   -> gate ben TRAI, drain tren, source duoi (mac dinh gate ben phai)
  - d += elm.Dot().at(P)   -> con tro nhay ve P, dat sau cac lenh ve khac neu khong muon lech
"""
import pathlib
import schemdraw
import schemdraw.elements as elm

schemdraw.use('svg')
schemdraw.svgconfig.text = 'text'
schemdraw.config(color='#8b949e', lw=2, fontsize=13)

OUT = pathlib.Path(__file__).parent
draw = lambda name: schemdraw.Drawing(file=str(OUT / f'{name}.svg'), show=False)


# ═══════════════ LEVEL 1 ═══════════════

# 1.1 — LED + dien tro han dong
with draw('1-1') as d:
    d += elm.Ground()
    V = d.add(elm.SourceV().up().label('5V'))
    d += elm.Resistor().right().label('R 220Ω')
    d += elm.LED().down().label('LED đỏ\nVf 1.8V · 20mA')
    d += elm.Line().left().tox(V.start)

# 1.2 — LED song song: moi nhanh mot dien tro rieng
with draw('1-2') as d:
    TOP, BOT = 0, -4.5
    d += elm.Line().at((0, TOP)).to((5.5, TOP))
    d += elm.Line().at((0, BOT)).to((5.5, BOT))
    d += elm.SourceV().at((0, BOT)).to((0, TOP)).label('5V', loc='left')
    for x, ohm, name in ((2.8, '220Ω', 'LED đỏ'), (5.5, '100Ω', 'LED xanh')):
        d += elm.Resistor().at((x, TOP)).down().length(2.2).label(ohm, loc='left')
        d += elm.LED().down().length(2.3).label(name, loc='rgt')
        d += elm.Dot().at((x, TOP))
        d += elm.Dot().at((x, BOT))
    d += elm.Label().at((2.7, TOP + 1.1)).label('mỗi nhánh PHẢI có điện trở riêng')

# 1.3 — Nut nhan + dien tro keo len (pull-up)
with draw('1-3') as d:
    d += elm.Vdd().label('3.3V')
    d += elm.Resistor().down().label('10kΩ')
    d += elm.Dot()
    d.push()
    d += elm.Line().right().length(2.2)
    d += elm.Dot(open=True).label('ra\n(đọc mức)', loc='right')
    d.pop()
    d += elm.Button().down().label('nút nhấn', loc='left')
    d += elm.Line().down().length(0.6)
    d += elm.Ground()
    d += elm.Label().at((0, -8)).label('thả = HIGH · nhấn = LOW')

# 1.4 — Cau phan ap
with draw('1-4') as d:
    d += elm.Vdd().label('Vvào')
    d += elm.Resistor().down().label('R1')
    d += elm.Dot()
    d.push()
    d += elm.Line().right().length(2.2)
    d += elm.Dot(open=True).label('Vra', loc='right')
    d.pop()
    d += elm.Resistor().down().label('R2')
    d += elm.Line().down().length(0.6)
    d += elm.Ground()
    d += elm.Label().at((0, -8)).label('Vra = Vvào · R2 / (R1 + R2)')

# 1.5 — Den tu sang khi troi toi (LDR + NPN)
with draw('1-5') as d:
    Q = d.add(elm.BjtNpn(circle=True).at((4, -4)).anchor('base').right()
              .label('S8050', loc='rgt', ofst=(0.7, -0.3)))
    d += elm.Line().down().at(Q.emitter).length(0.6)
    d += elm.Ground()

    # cau phan ap LDR / bien tro -> chan B qua tro 1k
    d += elm.Resistor().left().at(Q.base).length(2.4).label('1kΩ')
    mid = d.here
    d += elm.Photoresistor().at(mid).up().length(2.6).label('LDR', loc='left', ofst=(-0.4, 0))
    d += elm.Line().up().length(0.7)
    d += elm.Vdd().label('+5V')
    d += elm.Potentiometer().at(mid).down().length(2.6).label('biến trở\n10kΩ', loc='left', ofst=(-0.4, 0))
    d += elm.Line().down().length(0.7)
    d += elm.Ground()
    d += elm.Dot().at(mid)

    # tai: +5V -> 220R -> LED -> cuc C
    d += elm.Line().up().at(Q.collector).length(0.6)
    d += elm.LED().up().length(2.2).label('LED', loc='rgt', ofst=(0.6, 0))
    d += elm.Resistor().up().length(2.2).label('220Ω', loc='rgt', ofst=(0.4, 0))
    d += elm.Line().up().length(0.7)
    d += elm.Vdd().label('+5V')

# 1.6 — Coi buzzer
with draw('1-6') as d:
    d += elm.Vdd().label('5V')
    d += elm.Button().down().label('nút nhấn', loc='left')
    d += elm.Resistor().down().label('100Ω\n(giảm âm)', loc='left', ofst=(-0.4, 0))
    d += elm.Line().down().length(1)
    sp = d.add(elm.Speaker().right().label('buzzer\nchủ động 5V', loc='rgt', ofst=(1.6, 0)))
    d += elm.Line().at(sp.in2).down().length(1.4)
    d += elm.Ground()


# ═══════════════ LEVEL 2 ═══════════════

# 2.1 — NPN lam cong tac
with draw('2-1') as d:
    Q = d.add(elm.BjtNpn(circle=True).anchor('base').right()
              .label('2N2222', loc='rgt', ofst=(0.7, -0.3)))
    d += elm.Line().down().at(Q.emitter).length(0.6)
    d += elm.Ground()
    d += elm.Resistor().left().at(Q.base).length(2.4).label('1kΩ')
    d += elm.Dot(open=True).label('MCU\nGPIO', loc='left')
    d += elm.Line().up().at(Q.collector).length(0.6)
    d += elm.Lamp().up().length(2.2).label('tải 12V', loc='rgt')
    d += elm.Line().up().length(0.8)
    d += elm.Vdd().label('+12V')
    d += elm.Label().at((1.4, -3.4)).label('IB = IC / hFE × 5')

# 2.2 — Relay + diode chong xung nguoc
with draw('2-2') as d:
    Q = d.add(elm.BjtNpn(circle=True).anchor('base').right()
              .label('S8050', loc='rgt', ofst=(0.7, -0.3)))
    d += elm.Line().down().at(Q.emitter).length(0.6)
    d += elm.Ground()
    d += elm.Resistor().left().at(Q.base).length(2.4).label('1kΩ')
    d += elm.Dot(open=True).label('MCU\nGPIO', loc='left')

    d += elm.Line().up().at(Q.collector).length(0.6)
    L = d.add(elm.Inductor2().up().length(2.6).label('cuộn relay\n5V · ~70mA'))
    d += elm.Line().up().at(L.end).length(0.8)
    d += elm.Vdd().label('+5V')

    xd = L.start[0] + 2
    bot, top = (xd, L.start[1]), (xd, L.end[1])
    d += elm.Line().at(L.start).to(bot)
    d += elm.Diode().at(bot).to(top).label('1N4007', loc='rgt')
    d += elm.Line().at(top).to(L.end)
    d += elm.Dot().at(L.start)
    d += elm.Dot().at(L.end)

# 2.3 — RC loc thong thap
with draw('2-3') as d:
    d += elm.Dot(open=True).label('Vvào', loc='left')
    d += elm.Resistor().right().label('R')
    d += elm.Dot()
    d.push()
    d += elm.Line().right().length(1.8)
    d += elm.Dot(open=True).label('Vra', loc='right')
    d.pop()
    d += elm.Capacitor().down().length(2.4).label('C', loc='rgt')
    d += elm.Ground()
    d += elm.Label().at((1.5, -4.4)).label('τ = R · C\nf_cắt = 1 / (2πRC)')

# 2.4 — IC 555 astable
with draw('2-4') as d:
    IC = d.add(elm.Ic(
        pins=[elm.IcPin(name='GND', side='left', pin='1'),
              elm.IcPin(name='TRIG', side='left', pin='2'),
              elm.IcPin(name='THR', side='left', pin='6'),
              elm.IcPin(name='DIS', side='left', pin='7'),
              elm.IcPin(name='OUT', side='right', pin='3'),
              elm.IcPin(name='RST', side='right', pin='4'),
              elm.IcPin(name='VCC', side='right', pin='8')],
        w=5.4, pinspacing=1.6, edgepadW=1.4, edgepadH=0.8).label('NE555', ofst=(-0.5, 1.5)))

    d += elm.Line().right().at(IC.VCC).length(1)
    d += elm.Vdd().label('+5V')
    d += elm.Line().right().at(IC.RST).length(1).dot()
    d += elm.Line().up().toy(IC.VCC[1])
    d += elm.Line().left().at(IC.GND).length(1)
    d += elm.Ground()

    x1 = IC.DIS[0] - 2.6          # cot dien tro R1/R2
    x2 = x1 - 2                   # cot noi chung TRIG/THR + tu C
    n7, n6 = (x1, IC.DIS[1]), (x1, IC.THR[1])
    nc = (x2, IC.TRIG[1])
    d += elm.Line().at(IC.DIS).to(n7)
    d += elm.Resistor().at(n7).up().length(2.4).label('R1')
    d += elm.Line().up().length(0.7)
    d += elm.Vdd().label('+5V')
    d += elm.Resistor().at(n7).to(n6).label('R2')
    d += elm.Line().at(IC.THR).to(n6)
    d += elm.Line().at(n6).to((x2, IC.THR[1]))
    d += elm.Line().at((x2, IC.THR[1])).to(nc)
    d += elm.Line().at(IC.TRIG).to(nc)
    d += elm.Capacitor(polar=True).at(nc).down().length(2.4).label('C', loc='left')
    d += elm.Line().down().length(0.7)
    d += elm.Ground()
    d += elm.Dot().at(n6)
    d += elm.Dot().at(n7)
    d += elm.Dot().at(nc)

    d += elm.Line().right().at(IC.OUT).length(1.2)
    d += elm.Resistor().right().label('220Ω')
    d += elm.LED().down().length(2).label('LED', loc='rgt')
    d += elm.Ground()
    d += elm.Label().at((IC.center[0] - 1, IC.center[1] - 5.4)).label('f ≈ 1.44 / ((R1 + 2·R2) · C)')

# 2.5 — LM358 comparator
with draw('2-5') as d:
    A = d.add(elm.Opamp(leads=True).label('LM358', loc='center', ofst=(-0.5, 0)))
    d += elm.Line().left().at(A.in2).length(4.2)
    d += elm.Dot(open=True).label('tín hiệu\ncảm biến', loc='left')
    d += elm.Line().left().at(A.in1).length(2.2)
    nref = d.here
    d += elm.Potentiometer().at(nref).up().length(2.4).label('ngưỡng\n10kΩ')
    d += elm.Line().up().length(0.8)
    d += elm.Vdd().label('+5V')
    d += elm.Line().at(nref).down().length(2.4)
    d += elm.Ground()
    d += elm.Dot().at(nref)
    d += elm.Line().right().at(A.out).length(1.2)
    d += elm.Resistor().right().label('220Ω')
    d += elm.LED().down().length(2).label('LED', loc='rgt')
    d += elm.Ground()
    d += elm.Label().at((A.center[0] - 1, A.center[1] - 4.4)).label('V+ lớn hơn V− thì ngõ ra HIGH')

# 2.6 — LDO 7805 + tu loc
with draw('2-6') as d:
    IC = d.add(elm.Ic(pins=[elm.IcPin(name='IN', side='left'),
                            elm.IcPin(name='GND', side='bottom'),
                            elm.IcPin(name='OUT', side='right')],
                      w=5.4, h=2.6, edgepadW=1.4).label('LM7805', ofst=(0, 0.7)))
    d += elm.Line().left().at(IC.IN).length(1.6)
    nin = d.here
    d += elm.Line().left().length(1.2)
    d += elm.Dot(open=True).label('12V', loc='left')
    d += elm.Capacitor(polar=True).at(nin).down().length(2.4).label('100µF', loc='left')
    d += elm.Ground()
    d += elm.Dot().at(nin)
    d += elm.Line().right().at(IC.OUT).length(1.6)
    nout = d.here
    d += elm.Line().right().length(1.2)
    d += elm.Dot(open=True).label('5V', loc='right')
    d += elm.Capacitor(polar=True).at(nout).down().length(2.4).label('10µF', loc='rgt')
    d += elm.Ground()
    d += elm.Dot().at(nout)
    d += elm.Line().down().at(IC.GND).length(0.8)
    d += elm.Ground()
    d += elm.Label().at((IC.center[0], IC.center[1] - 4.6)).label('P_nhiệt = (Vvào − Vra) × I')

# 2.8 — MOSFET lai dai LED 12V
with draw('2-8') as d:
    M = d.add(elm.NFet(bulk=False).reverse().at((3, -3)).anchor('gate')
              .label('IRLZ44N', loc='rgt', ofst=(1.6, 0.8)))
    d += elm.Line().down().at(M.source).length(0.8)
    d += elm.Ground()
    d += elm.Resistor().left().at(M.gate).length(2.2).label('100Ω')
    ng = d.here
    d.push()
    d += elm.Line().left().length(1.2)
    d += elm.Dot(open=True).label('MCU\nPWM', loc='left')
    d.pop()
    d += elm.Resistor().at(ng).down().length(2.4).label('10kΩ\npull-down', loc='left', ofst=(-0.4, 0))
    d += elm.Line().down().length(0.7)
    d += elm.Ground()
    d += elm.Dot().at(ng)
    d += elm.Line().up().at(M.drain).length(0.8)
    d += elm.Lamp().up().length(2.2).label('dải LED 12V', loc='rgt')
    d += elm.Line().up().length(0.8)
    d += elm.Vdd().label('+12V')


# ═══════════════ LEVEL 3 ═══════════════

# 3.1 — Cau H 4 MOSFET
with draw('3-1') as d:
    XL, XR, TOP, MID, BOT = 0, 9, 0, -2.6, -5.2
    d += elm.Line().at((XL, TOP)).to((XR, TOP))
    d += elm.Vdd().at((XL + 4.5, TOP)).label('+12V')
    d += elm.Line().at((XL, BOT)).to((XR, BOT))
    d += elm.Ground().at((XL + 4.5, BOT))

    fet = lambda: elm.NFet(bulk=False).theta(0)
    for x, rev, side in ((XL, True, -1), (XR, False, 1)):
        for y, nm in ((TOP, 'Q1' if side < 0 else 'Q2'), (MID, 'Q3' if side < 0 else 'Q4')):
            e = fet().reverse() if rev else fet()
            Q = d.add(e.at((x, y)).anchor('drain'))
            d += elm.Line().at(Q.gate).to((Q.gate[0] + side * 0.9, Q.gate[1]))
            d += elm.Dot(open=True).label(nm, loc='left' if side < 0 else 'right')
            d += elm.Line().at(Q.source).to((x, y - 2.6 if y == TOP else BOT))

    d += elm.Line().at((XL, MID)).to((XL + 3, MID))
    d += elm.Motor().at((XL + 3, MID)).to((XR - 3, MID)).label('motor DC')
    d += elm.Line().at((XR - 3, MID)).to((XR, MID))
    d += elm.Dot().at((XL, MID))
    d += elm.Dot().at((XR, MID))
    d += elm.Label().at((XL + 4.5, BOT - 1.6)).label('CẤM bật Q1+Q3 (hoặc Q2+Q4) cùng lúc — chập nguồn')

# 3.2 — Buck converter
with draw('3-2') as d:
    TOP, SW, GND = 0, -2.6, -5.4
    XQ = 5.5
    d += elm.Line().at((-1.6, TOP)).to((XQ, TOP))
    d += elm.Dot(open=True).at((-1.6, TOP)).label('Vvào', loc='left')
    d += elm.Capacitor().at((0.4, TOP)).down().length(2.2).label('Cvào', loc='left')
    d += elm.Line().down().length(0.7)
    d += elm.Ground()
    d += elm.Dot().at((0.4, TOP))

    Q = d.add(elm.NFet(bulk=False).theta(0).reverse().at((XQ, TOP)).anchor('drain'))
    d += elm.Line().at(Q.gate).to((Q.gate[0] - 1, Q.gate[1]))
    d += elm.Dot(open=True).label('PWM', loc='left')
    d += elm.Line().at((XQ, TOP - 1.5)).to((XQ, SW))
    d += elm.Diode().at((XQ, GND)).to((XQ, SW)).label('SS34', loc='left')
    d += elm.Line().at((XQ, GND)).down().length(0.7)
    d += elm.Ground()
    d += elm.Dot().at((XQ, SW))

    d += elm.Inductor2().at((XQ, SW)).right().length(3).label('L')
    nout = (XQ + 3, SW)
    d += elm.Capacitor().at(nout).down().length(2.2).label('Cra', loc='rgt')
    d += elm.Line().down().length(0.7)
    d += elm.Ground()
    d += elm.Line().at(nout).to((XQ + 4.6, SW))
    d += elm.Dot(open=True).label('Vra', loc='right')
    d += elm.Dot().at(nout)
    d += elm.Label().at((XQ, GND - 2)).label('D = Vra / Vvào')

# 3.3 — Level shifter BSS138 (2 chieu, cho I2C)
with draw('3-3') as d:
    M = d.add(elm.NFet(bulk=False).theta(0).reverse().at((0, 0)).anchor('gate')
              .label('BSS138', loc='left', ofst=(-1.6, -1.6)))
    # gate luon noi 3.3V
    d += elm.Line().at(M.gate).to((-1.6, 0))
    d += elm.Line().at((-1.6, 0)).to((-1.6, 2.6))
    d += elm.Vdd().label('3.3V')

    # phia 5V — cuc drain (tren)
    d += elm.Line().at(M.drain).to((5.5, M.drain[1]))
    d += elm.Resistor().at((5.5, M.drain[1])).up().length(2).label('10k', loc='rgt')
    d += elm.Line().up().length(0.7)
    d += elm.Vdd().label('5V')
    d += elm.Line().at((5.5, M.drain[1])).to((7.4, M.drain[1]))
    d += elm.Dot(open=True).label('SDA 5V', loc='right')
    d += elm.Dot().at((5.5, M.drain[1]))

    # phia 3.3V — cuc source (duoi)
    d += elm.Line().at(M.source).to((M.source[0], -3.4))
    d += elm.Line().at((M.source[0], -3.4)).to((3, -3.4))
    d += elm.Resistor().at((3, -3.4)).up().length(1.8).label('10k', loc='left')
    d += elm.Line().up().length(0.7)
    d += elm.Vdd().label('3.3V')
    d += elm.Line().at((3, -3.4)).to((7.4, -3.4))
    d += elm.Dot(open=True).label('SDA 3.3V', loc='right')
    d += elm.Dot().at((3, -3.4))

# 3.4 — Cach ly quang PC817
with draw('3-4') as d:
    O = d.add(elm.Optocoupler(box=True).label('PC817'))
    d += elm.Line().left().at(O.anode).length(1)
    d += elm.Resistor().left().label('220Ω')
    d += elm.Dot(open=True).label('MCU\nGPIO', loc='left')
    d += elm.Line().left().at(O.cathode).length(2.6)
    d += elm.Ground().label('GND 1')
    d += elm.Line().right().at(O.emitter).length(1.6)
    d += elm.Ground().label('GND 2')
    d += elm.Line().right().at(O.collector).length(1.6)
    nc = d.here
    d.push()
    d += elm.Line().right().length(1.4)
    d += elm.Dot(open=True).label('ra', loc='right')
    d.pop()
    d += elm.Resistor().at(nc).up().length(2.2).label('10k', loc='rgt')
    d += elm.Line().up().length(0.7)
    d += elm.Vdd().label('V2')
    d += elm.Dot().at(nc)
    d += elm.Label().at((O.anode[0] + 1, O.cathode[1] - 2.8)).label('hai nguồn, hai mass RIÊNG mới thật sự cách ly')

# 3.5 — Do dong bang shunt + INA219
with draw('3-5') as d:
    R = d.add(elm.Resistor().at((0, 0)).right().length(3.4).label('Rshunt 0.1Ω'))
    d += elm.Line().at(R.start).to((-1.6, 0))
    d += elm.Dot(open=True).label('V+', loc='left')
    d += elm.Line().at(R.end).to((5, 0))
    d += elm.Dot(open=True).label('tải', loc='right')
    IC = d.add(elm.Ic(pins=[elm.IcPin(name='IN+', side='top', anchorname='inp'),
                            elm.IcPin(name='IN−', side='top', anchorname='inn'),
                            elm.IcPin(name='SDA', side='bottom'),
                            elm.IcPin(name='SCL', side='bottom')],
                      w=4.4, h=2.4, pinspacing=2.4, edgepadW=1)
               .label('INA219').at((1.7, -4)).anchor('center'))
    d += elm.Line().at(IC.inp).up().toy(0).tox(R.start[0])
    d += elm.Line().at(IC.inn).up().toy(0).tox(R.end[0])
    d += elm.Dot().at(R.start)
    d += elm.Dot().at(R.end)
    d += elm.Line().at(IC.SDA).down().length(1).label('SDA', loc='bottom')
    d += elm.Line().at(IC.SCL).down().length(1).label('SCL', loc='bottom')
    d += elm.Label().at((1.7, -7.6)).label('Vshunt = I × Rshunt')

# 3.7 — Bus I2C nhieu thiet bi
with draw('3-7') as d:
    d += elm.Line().at((0, 0)).to((9.6, 0))       # SDA
    d += elm.Line().at((0, -1.2)).to((9.6, -1.2))  # SCL
    d += elm.Label().at((-0.8, 0)).label('SDA')
    d += elm.Label().at((-0.8, -1.2)).label('SCL')
    d += elm.Resistor().at((1, 0)).up().length(2.2).label('4.7k', loc='left', ofst=(-0.4, 0))
    d += elm.Line().up().length(0.7)
    d += elm.Vdd().label('3.3V')
    d += elm.Resistor().at((2.8, -1.2)).up().length(3.4).label('4.7k', loc='rgt', ofst=(0.4, 0))
    d += elm.Line().up().length(0.7)
    d += elm.Vdd().label('3.3V')
    d += elm.Dot().at((1, 0))
    d += elm.Dot().at((2.8, -1.2))
    for x, name, addr in [(5, 'SSD1306\n0x3C', ''), (7.2, 'MPU6050\n0x68', ''), (9.4, 'BME280\n0x76', '')]:
        d += elm.Line().at((x, 0)).to((x, -2.8))
        d += elm.Line().at((x - 0.5, -1.2)).to((x - 0.5, -2.8))
        d += elm.Line().at((x - 0.5, -2.8)).to((x, -2.8))
        d += elm.Dot().at((x, 0))
        d += elm.Dot().at((x - 0.5, -1.2))
        d += elm.Label().at((x - 0.25, -3.8)).label(name)
    d += elm.Label().at((4.6, -5.4)).label('CHỈ 1 cặp pull-up cho cả bus — module thừa phải tháo bớt')

# 3.8 — Bao ve duong nguon
with draw('3-8') as d:
    d += elm.Dot(open=True).at((0, 0)).label('DC vào', loc='left')
    d += elm.Diode().at((0, 0)).right().length(3).label('SS34\nchống cắm ngược')
    d += elm.Fuse().right().length(3).label('PPTC 0.5A', loc='bottom')
    n = d.here
    d.push()
    d += elm.Line().right().length(2)
    d += elm.Dot(open=True).label('tới mạch', loc='right')
    d.pop()
    d += elm.Diode().at(n).down().length(2.6).label('TVS\nSMAJ5.0A', loc='rgt', ofst=(0.5, 0)).reverse()
    d += elm.Ground()
    d += elm.Dot().at(n)

print('Da sinh xong SVG trong', OUT)
