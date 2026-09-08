import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX, Play, Square, Activity, Radio } from 'lucide-react'
import { useI18n, Bilingual } from '../../../i18n'
import { haptic } from '../../../utils/ux'

type WaveformType = 'square' | 'sine' | 'triangle' | 'sawtooth'

export function AudioGenerator() {
  const { mode } = useI18n()
  const [isPlaying, setIsPlaying] = useState(false)
  const [freq, setFreq] = useState(440) // A4
  const [wave, setWave] = useState<WaveformType>('square')
  const [volume, setVolume] = useState(0.15) // Safe volume default
  const [activePreset, setActivePreset] = useState<string | null>(null)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const rafRef = useRef<number | null>(null)

  // Initialize or resume AudioContext
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      audioCtxRef.current = new AudioCtx()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }

  const startTone = (frequency = freq, waveform = wave) => {
    try {
      const ctx = getAudioContext()
      stopTone()

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const analyser = ctx.createAnalyser()

      analyser.fftSize = 256
      osc.type = waveform
      osc.frequency.setValueAtTime(frequency, ctx.currentTime)

      // Soft attack to prevent pop
      gain.gain.setValueAtTime(0.001, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume), ctx.currentTime + 0.05)

      osc.connect(gain)
      gain.connect(analyser)
      analyser.connect(ctx.destination)

      osc.start()

      oscRef.current = osc
      gainRef.current = gain
      analyserRef.current = analyser
      setIsPlaying(true)
      haptic(10)
    } catch (e) {
      console.warn('AudioContext error:', e)
    }
  }

  const stopTone = () => {
    if (oscRef.current) {
      try {
        const ctx = audioCtxRef.current
        if (ctx && gainRef.current) {
          gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, ctx.currentTime)
          gainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05)
          setTimeout(() => {
            try { oscRef.current?.stop(); oscRef.current?.disconnect() } catch {}
            oscRef.current = null
          }, 60)
        } else {
          oscRef.current.stop()
          oscRef.current.disconnect()
          oscRef.current = null
        }
      } catch {}
    }
    setIsPlaying(false)
    setActivePreset(null)
  }

  // Update frequency live while playing
  useEffect(() => {
    if (oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime)
    }
  }, [freq])

  // Update waveform live
  useEffect(() => {
    if (oscRef.current) {
      oscRef.current.type = wave
    }
  }, [wave])

  // Update volume live
  useEffect(() => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setValueAtTime(Math.max(0.0001, volume), audioCtxRef.current.currentTime)
    }
  }, [volume])

  // Real-time Oscilloscope animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // Center grid line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(0, h / 2)
      ctx.lineTo(w, h / 2)
      ctx.stroke()

      if (analyserRef.current && isPlaying) {
        const bufferLen = analyserRef.current.frequencyBinCount
        const data = new Uint8Array(bufferLen)
        analyserRef.current.getByteTimeDomainData(data)

        ctx.lineWidth = 2
        ctx.strokeStyle = '#f59e0b' // Amber accent
        ctx.beginPath()

        const sliceWidth = w / bufferLen
        let x = 0

        for (let i = 0; i < bufferLen; i++) {
          const v = data[i] / 128.0
          const y = (v * h) / 2
          if (i === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
          x += sliceWidth
        }

        ctx.lineTo(w, h / 2)
        ctx.stroke()
      } else {
        // Idle flat line
        ctx.strokeStyle = '#f59e0b'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(0, h / 2)
        ctx.lineTo(w, h / 2)
        ctx.stroke()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isPlaying])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTone()
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {})
      }
    }
  }, [])

  // Presets
  const playPreset = (name: string, f: number, w: WaveformType) => {
    setActivePreset(name)
    setFreq(f)
    setWave(w)
    startTone(f, w)
  }

  // Play realistic relay click sound using synthesized impulse
  const playRelayClick = () => {
    try {
      const ctx = getAudioContext()
      stopTone()
      setActivePreset('relay')

      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      // High frequency click + rapid decay to simulate mechanical contact
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.03)

      gain.gain.setValueAtTime(0.4, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.04)
      haptic(25)
      setTimeout(() => setActivePreset(null), 300)
    } catch {}
  }

  return (
    <div className="card p-5 bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="size-5 text-[var(--color-acc)]" />
          <h3 className="text-lg font-bold tracking-tight">
            <Bilingual en="Audio & PWM Tone Generator" vn="Phát âm thanh tần số & PWM" />
          </h3>
        </div>

        <button
          onClick={isPlaying ? stopTone : () => startTone()}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition shadow-sm ${
            isPlaying
              ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-[var(--color-acc)] hover:opacity-90 text-[var(--color-bg)]'
          }`}
        >
          {isPlaying ? <Square className="size-3.5 fill-current" /> : <Play className="size-3.5 fill-current" />}
          {isPlaying ? <Bilingual en="Stop" vn="Dừng" /> : <Bilingual en="Play Sound" vn="Phát âm thanh" />}
        </button>
      </div>

      {/* Visual Oscilloscope Screen */}
      <div className="mb-4 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 p-2 relative shadow-inner">
        <canvas ref={canvasRef} width={400} height={90} className="w-full h-20 block" />
        <div className="absolute top-2 right-3 text-[10px] font-mono text-amber-500/80 flex items-center gap-2">
          <span>{wave.toUpperCase()}</span>
          <span>{freq} Hz</span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="mb-4">
        <div className="text-xs text-[var(--color-muted)] font-medium mb-1.5">
          <Bilingual en="Realistic electronics sound presets" vn="Âm thanh linh kiện thực tế" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <PresetButton
            active={activePreset === 'buzzer'}
            onClick={() => playPreset('buzzer', 2400, 'square')}
            label="Còi chip 5V (2.4kHz)"
          />
          <PresetButton
            active={activePreset === '555'}
            onClick={() => playPreset('555', 1000, 'square')}
            label="Xung vuông 555 (1kHz)"
          />
          <PresetButton
            active={activePreset === 'pwm'}
            onClick={() => playPreset('pwm', 490, 'square')}
            label="Arduino PWM (490Hz)"
          />
          <PresetButton
            active={activePreset === 'hum'}
            onClick={() => playPreset('hum', 50, 'sine')}
            label="Nhiễu điện AC 50Hz"
          />
          <PresetButton
            active={activePreset === 'relay'}
            onClick={playRelayClick}
            label="Tiếng cạch Relay 5V"
          />
        </div>
      </div>

      {/* Frequency Slider */}
      <div className="space-y-3 pt-2 border-t border-[var(--color-border)]">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--color-muted)] font-medium">
              <Bilingual en="Frequency" vn="Tần số" />
            </span>
            <span className="font-mono font-bold text-[var(--color-acc)]">{freq} Hz</span>
          </div>
          <input
            type="range"
            min={20}
            max={5000}
            step={5}
            value={freq}
            onChange={e => setFreq(parseInt(e.target.value))}
            className="w-full accent-[var(--color-acc)] cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[var(--color-muted)] font-mono">
            <span>20 Hz (Trầm)</span>
            <span>440 Hz (Nốt La)</span>
            <span>1 kHz</span>
            <span>5 kHz (Bổng)</span>
          </div>
        </div>

        {/* Waveform Selector */}
        <div>
          <div className="text-xs text-[var(--color-muted)] font-medium mb-1.5">
            <Bilingual en="Waveform" vn="Dạng sóng" />
          </div>
          <div className="grid grid-cols-4 gap-1.5 text-xs font-semibold">
            <WaveButton active={wave === 'square'} onClick={() => setWave('square')} label="Vuông (PWM)" />
            <WaveButton active={wave === 'sine'} onClick={() => setWave('sine')} label="Sin (Analog)" />
            <WaveButton active={wave === 'triangle'} onClick={() => setWave('triangle')} label="Tam giác" />
            <WaveButton active={wave === 'sawtooth'} onClick={() => setWave('sawtooth')} label="Răng cưa" />
          </div>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 pt-1">
          {volume === 0 ? <VolumeX className="size-4 text-[var(--color-muted)]" /> : <Volume2 className="size-4 text-[var(--color-muted)]" />}
          <input
            type="range"
            min={0}
            max={0.4}
            step={0.01}
            value={volume}
            onChange={e => setVolume(parseFloat(e.target.value))}
            className="flex-1 accent-[var(--color-acc)] cursor-pointer"
            title="Âm lượng"
          />
          <span className="text-xs font-mono text-[var(--color-muted)] w-10 text-right">
            {Math.round(volume * 250)}%
          </span>
        </div>
      </div>

      <div className="mt-3 p-2.5 rounded-lg bg-[color-mix(in_srgb,var(--color-acc)_8%,transparent)] border border-[color-mix(in_srgb,var(--color-acc)_20%,transparent)] text-xs text-[var(--color-muted)]">
        💡 <b>Mẹo học:</b> Xung vuông (`Square`) tạo ra âm thanh gắt đặc trưng của vi điều khiển (Arduino PWM) và IC 555. Sóng Sin (`Sine`) là dạng sóng mượt mà của điện xoay chiều.
      </div>
    </div>
  )
}

function PresetButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-xs font-medium border transition ${
        active
          ? 'bg-[var(--color-acc)] text-[var(--color-bg)] border-[var(--color-acc)]'
          : 'border-[var(--color-border)] text-[var(--color-fg)] hover:border-[var(--color-acc)]'
      }`}
    >
      {label}
    </button>
  )
}

function WaveButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={() => { haptic(5); onClick() }}
      className={`py-1.5 px-2 rounded-lg text-center border transition ${
        active
          ? 'bg-[var(--color-acc)] text-[var(--color-bg)] border-[var(--color-acc)]'
          : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-acc)]'
      }`}
    >
      {label}
    </button>
  )
}
