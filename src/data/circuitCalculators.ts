export interface CircuitCalcOption {
  kind: string
  label: string
}

export const CIRCUIT_CALCULATORS: Record<string, CircuitCalcOption[]> = {
  '1-1': [
    { kind: 'led', label: 'Tính trở LED (R & E24 & P)' },
    { kind: 'ohm', label: 'Định luật Ohm (V = I·R)' },
  ],
  '1-2': [
    { kind: 'r-series', label: 'Điện trở nối tiếp (R = R1 + R2)' },
    { kind: 'r-parallel', label: 'Điện trở song song (1/R = 1/R1 + 1/R2)' },
  ],
  '1-4': [
    { kind: 'divider', label: 'Cầu phân áp (V_out & cặp trở E24)' },
  ],
  '1-5': [
    { kind: 'divider', label: 'Phân áp quang trở LDR' },
  ],
  '2-1': [
    { kind: 'bjt', label: 'Tính trở cực Base transistor (R_B)' },
  ],
  '2-3': [
    { kind: 'rc-fc', label: 'Tần số cắt RC (fc = 1/2πRC)' },
    { kind: 'rc-tau', label: 'Hằng số thời gian RC (τ = R·C)' },
  ],
  '2-4': [
    { kind: '555', label: 'Dao động NE555 (Astable f & duty)' },
    { kind: '555-mono', label: 'Đơn ổn NE555 (Pulse width)' },
  ],
  '2-5': [
    { kind: 'opamp', label: 'Khuếch đại Op-Amp LM358' },
  ],
  '2-6': [
    { kind: 'ldo', label: 'Tản nhiệt nguồn LDO (P = (Vin-Vout)·I)' },
    { kind: 'power', label: 'Công suất điện (P = V·I)' },
  ],
  '2-8': [
    { kind: 'power', label: 'Công suất MOSFET (P = I²·Rds)' },
  ],
  '3-2': [
    { kind: 'power', label: 'Công suất & hiệu suất Buck' },
  ],
  '3-6': [
    { kind: 'battery', label: 'Thời lượng pin Li-ion (mAh / mA)' },
  ],
}
