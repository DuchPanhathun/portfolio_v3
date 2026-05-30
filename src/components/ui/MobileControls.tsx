import { useEffect, useRef, useState } from 'react'
import { mobileInput } from '../../hooks/useMobileInput'

const BASE_R = 52   // outer ring radius (px)
const KNOB_R = 24   // inner knob radius (px)
const MAX_TRAVEL = BASE_R - KNOB_R

export function MobileControls() {
  const [visible, setVisible]       = useState(false)
  const [knob, setKnob]             = useState({ x: 0, y: 0 })
  const [jumpPressed, setJumpPressed] = useState(false)

  const stickTouchId = useRef<number | null>(null)
  const stickCenter  = useRef({ x: 0, y: 0 })

  useEffect(() => {
    setVisible('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  if (!visible) return null

  // ── Joystick handlers ────────────────────────────────────────────────────

  const onStickStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const t = e.changedTouches[0]
    stickTouchId.current = t.identifier
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    stickCenter.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  }

  const onStickMove = (e: React.TouchEvent) => {
    e.preventDefault()
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i]
      if (t.identifier !== stickTouchId.current) continue

      const rawX = t.clientX - stickCenter.current.x
      const rawY = t.clientY - stickCenter.current.y
      const dist  = Math.sqrt(rawX * rawX + rawY * rawY)
      const scale = dist > MAX_TRAVEL ? MAX_TRAVEL / dist : 1

      const cx = rawX * scale
      const cy = rawY * scale

      setKnob({ x: cx, y: cy })
      mobileInput.dx = cx / MAX_TRAVEL
      mobileInput.dy = cy / MAX_TRAVEL
    }
  }

  const onStickEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === stickTouchId.current) {
        stickTouchId.current = null
        setKnob({ x: 0, y: 0 })
        mobileInput.dx = 0
        mobileInput.dy = 0
        break
      }
    }
  }

  // ── Jump handlers ─────────────────────────────────────────────────────────

  const onJumpStart = (e: React.TouchEvent) => {
    e.preventDefault()
    mobileInput.jump = true
    setJumpPressed(true)
  }

  const onJumpEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    mobileInput.jump = false
    setJumpPressed(false)
  }

  const returning = knob.x === 0 && knob.y === 0

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 50,
    }}>

      {/* ── Thumbstick ──────────────────────────────────────────────── */}
      <div
        onTouchStart={onStickStart}
        onTouchMove={onStickMove}
        onTouchEnd={onStickEnd}
        onTouchCancel={onStickEnd}
        style={{
          position: 'absolute',
          bottom: '60px',
          left:   '40px',
          width:  `${BASE_R * 2}px`,
          height: `${BASE_R * 2}px`,
          borderRadius: '50%',
          background: 'rgba(0,229,255,0.07)',
          border: '1.5px solid rgba(0,229,255,0.3)',
          boxShadow: '0 0 16px rgba(0,229,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {/* Cross hair guides */}
        <div style={{
          position: 'absolute',
          width: '1px',
          height: `${BASE_R * 2 - 20}px`,
          background: 'rgba(0,229,255,0.12)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          width: `${BASE_R * 2 - 20}px`,
          height: '1px',
          background: 'rgba(0,229,255,0.12)',
          pointerEvents: 'none',
        }} />

        {/* Knob */}
        <div style={{
          width:  `${KNOB_R * 2}px`,
          height: `${KNOB_R * 2}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(0,229,255,0.55), rgba(0,229,255,0.2))',
          border: '1.5px solid rgba(0,229,255,0.75)',
          boxShadow: '0 0 14px rgba(0,229,255,0.45)',
          transform: `translate(${knob.x}px, ${knob.y}px)`,
          transition: returning ? 'transform 0.12s ease-out' : 'none',
          pointerEvents: 'none',
          flexShrink: 0,
        }} />
      </div>

      {/* ── Jump button ──────────────────────────────────────────────── */}
      <div
        onTouchStart={onJumpStart}
        onTouchEnd={onJumpEnd}
        onTouchCancel={onJumpEnd}
        style={{
          position: 'absolute',
          bottom: '70px',
          right:  '44px',
          width:  '68px',
          height: '68px',
          borderRadius: '50%',
          background: jumpPressed
            ? 'rgba(0,229,255,0.28)'
            : 'rgba(0,229,255,0.08)',
          border: `1.5px solid rgba(0,229,255,${jumpPressed ? '0.95' : '0.4'})`,
          boxShadow: jumpPressed
            ? '0 0 24px rgba(0,229,255,0.55)'
            : '0 0 8px rgba(0,229,255,0.15)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          pointerEvents: 'auto',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          transition: 'all 0.08s ease',
        }}
      >
        {/* Up arrow icon */}
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
          <path d="M9 1L17 13H1L9 1Z" fill={`rgba(0,229,255,${jumpPressed ? '0.95' : '0.6'})`} />
        </svg>
        <span style={{
          color: `rgba(0,229,255,${jumpPressed ? '1' : '0.55'})`,
          fontFamily: 'monospace',
          fontSize: '9px',
          letterSpacing: '1.5px',
        }}>
          JUMP
        </span>
      </div>
    </div>
  )
}
