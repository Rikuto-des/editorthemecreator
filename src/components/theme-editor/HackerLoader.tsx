import { useEffect, useRef, useState, useMemo } from 'react'

const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01#$%&@'
const HEX_CHARS = '0123456789ABCDEF'
const PHASES = [
  '> Initializing neural theme engine...',
  '> Analyzing color spectrum...',
  '> Generating syntax tokens...',
  '> Compiling palette matrix...',
  '> Optimizing contrast ratios...',
  '> Assembling final theme...',
]

function randomHex() {
  let hex = '#'
  for (let i = 0; i < 6; i++) hex += HEX_CHARS[Math.floor(Math.random() * 16)]
  return hex
}

function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -50)

    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(10, 10, 11, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
        const brightness = Math.random()
        if (brightness > 0.95) {
          ctx.fillStyle = '#a78bfa'
        } else if (brightness > 0.8) {
          ctx.fillStyle = 'rgba(167, 139, 250, 0.8)'
        } else {
          ctx.fillStyle = 'rgba(167, 139, 250, 0.3)'
        }
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
          drops[i] = 0
        }
        drops[i] += 0.5 + Math.random() * 0.5
      }
    }, 50)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
}

function ScrambleHex({ count = 6 }: { count?: number }) {
  const [hexes, setHexes] = useState<string[]>(() => Array(count).fill(0).map(randomHex))

  useEffect(() => {
    const interval = setInterval(() => {
      setHexes(prev => prev.map(() => randomHex()))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex gap-2">
      {hexes.map((hex, i) => (
        <div key={i} className="flex items-center gap-1.5 font-mono text-xs">
          <div
            className="h-3 w-3 rounded-sm transition-colors"
            style={{ backgroundColor: hex }}
          />
          <span className="text-green-400/70">{hex}</span>
        </div>
      ))}
    </div>
  )
}

function TerminalLog() {
  const [lines, setLines] = useState<string[]>([])
  const [currentPhase, setCurrentPhase] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const shuffledPhases = useMemo(() => {
    const copy = [...PHASES]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
  }, [])

  useEffect(() => {
    if (currentPhase >= shuffledPhases.length) {
      const timer = setTimeout(() => setCurrentPhase(0), 1000)
      return () => clearTimeout(timer)
    }

    const delay = 800 + Math.random() * 1200
    const timer = setTimeout(() => {
      setLines(prev => {
        const next = [...prev, shuffledPhases[currentPhase]]
        return next.length > 6 ? next.slice(-6) : next
      })
      setCurrentPhase(p => p + 1)
    }, delay)

    return () => clearTimeout(timer)
  }, [currentPhase, shuffledPhases])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [lines])

  return (
    <div ref={containerRef} className="h-[120px] overflow-hidden font-mono text-xs leading-relaxed">
      {lines.map((line, i) => (
        <div
          key={`${i}-${line}`}
          className="animate-[fadeSlideIn_0.3s_ease-out]"
          style={{ opacity: i === lines.length - 1 ? 1 : 0.4 }}
        >
          <span className="text-green-400">{line}</span>
          {i === lines.length - 1 && (
            <span className="ml-1 inline-block h-3.5 w-1.5 animate-[blink_1s_step-end_infinite] bg-green-400" />
          )}
        </div>
      ))}
    </div>
  )
}

export function HackerLoader() {
  return (
    <div className="absolute inset-0 z-50 overflow-hidden bg-[#0a0a0b]/95">
      <MatrixRain />

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-6 px-8">
        {/* Terminal window */}
        <div className="w-full max-w-md rounded-lg border border-green-500/20 bg-[#0a0a0b]/90 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-green-500/20 px-4 py-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
            <span className="ml-2 font-mono text-[10px] text-green-400/50">themeleon://generate-theme</span>
          </div>

          {/* Terminal body */}
          <div className="p-4">
            <TerminalLog />
          </div>
        </div>

        {/* Color scramble */}
        <ScrambleHex count={6} />

        {/* Glitch title */}
        <div className="relative select-none">
          <p className="font-mono text-sm font-bold tracking-widest text-green-400/90">
            GENERATING THEME
          </p>
          <div className="mt-2 h-0.5 w-full overflow-hidden rounded bg-green-500/20">
            <div className="h-full animate-[indeterminate_1.5s_ease-in-out_infinite] rounded bg-green-400" />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        @keyframes indeterminate {
          0% { width: 0%; margin-left: 0; }
          50% { width: 60%; margin-left: 20%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}
