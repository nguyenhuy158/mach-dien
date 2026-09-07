import { useState, useRef } from 'react'
import { Mic, MicOff } from 'lucide-react'

interface Props {
  onResult: (transcript: string) => void
  className?: string
}

// Voice search button — uses Web Speech API where available, falls back
// to no-op gracefully on iOS Safari (no SpeechRecognition) and desktop Firefox.
export function VoiceSearchButton({ onResult, className = '' }: Props) {
  const [listening, setListening] = useState(false)
  const recRef = useRef<any>(null)

  const supported = typeof window !== 'undefined'
    && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  const start = () => {
    if (!supported) return
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const rec = new SR()
    rec.lang = 'vi-VN'
    rec.continuous = false
    rec.interimResults = false
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      onResult(text)
      setListening(false)
    }
    rec.onerror = () => setListening(false)
    rec.onend = () => setListening(false)
    rec.start()
    recRef.current = rec
    setListening(true)
  }

  const stop = () => {
    recRef.current?.stop()
    setListening(false)
  }

  if (!supported) return null

  return (
    <button
      onClick={listening ? stop : start}
      className={`p-2 rounded-full transition ${listening ? 'bg-[var(--color-na)] text-white animate-pulse' : 'text-[var(--color-muted)] hover:text-[var(--color-acc)]'} ${className}`}
      title={listening ? 'Stop listening' : 'Voice search'}
      aria-label={listening ? 'Stop voice search' : 'Start voice search'}
    >
      {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
    </button>
  )
}
