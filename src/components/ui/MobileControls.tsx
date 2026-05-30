import { useEffect, useRef, useState } from 'react'
import { mobileInput } from '../../hooks/useMobileInput'
import { useGameStore } from '../../stores/useGameStore'

const BASE_R     = 52
const KNOB_R     = 24
const MAX_TRAVEL = BASE_R - KNOB_R

export function MobileControls() {
  const [visible,        setVisible]        = useState(false)
  const [knob,           setKnob]           = useState({ x: 0, y: 0 })
  const [jumpPressed,    setJumpPressed]    = useState(false)
  const [interactPressed, setInteractPressed] = useState(false)

  const { nearbyPanelId, nearbyProjectId } = useGameStore()
  const hasNearby = !!(nearbyPanelId || nearbyProjectId)

  const stickTouchId = useRef<number | null>(null)
  const stickCenter  = useRef({ x: 0, y: 0 })

  useEffect(() => {
    setVisible('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  if (!visible) return null

  // ── Joystick ──────────────────────────────────────────────────────────────

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

  // ── Jump ──────────────────────────────────────────────────────────────────

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

  // ── Interact ──────────────────────────────────────────────────────────────

  const onInteractStart = (e: React.TouchEvent) => {
    e.preventDefault()
    mobileInput.interact = true
    setInteractPressed(true)
  }
  const onInteractEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    mobileInput.interact = false
    setInteractPressed(false)
  }

  const returning = knob.x === 0 && knob.y === 0

  // Interact button glows cyan when nearby something, dim otherwise
  const interactColor = hasNearby ? '0,229,255' : '100,150,180'
  const interactAlpha = hasNearby ? (interactPressed ? '0.95' : '0.6') : '0.3'

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }}>

      {/* ── Thumbstick (bottom-left) ──────────────────────────────── */}
      <div
        onTouchStart={onStickStart}
        onTouchMove={onStickMove}
        onTouchEnd={onStickEnd}
        onTouchCancel={onStickEnd}
        style={{
          position: 'absolute',
          bottom: '60px', left: '40px',
          width: `${BASE_R * 2}px`, height: `${BASE_R * 2}px`,
          borderRadius: '50%',
          background: 'rgba(0,229,255,0.07)',
          border: '1.5px solid rgba(0,229,255,0.3)',
          boxShadow: '0 0 16px rgba(0,229,255,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'auto', touchAction: 'none',
          userSelect: 'none', WebkitUserSelect: 'none',
        }}
      >
        <div style={{ position: 'absolute', width: '1px', height: `${BASE_R * 2 - 20}px`, background: 'rgba(0,229,255,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: `${BASE_R * 2 - 20}px`, height: '1px', background: 'rgba(0,229,255,0.12)', pointerEvents: 'none' }} />
        <div style={{
          width: `${KNOB_R * 2}px`, height: `${KNOB_R * 2}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(0,229,255,0.55), rgba(0,229,255,0.2))',
          border: '1.5px solid rgba(0,229,255,0.75)',
          boxShadow: '0 0 14px rgba(0,229,255,0.45)',
          transform: `translate(${knob.x}px, ${knob.y}px)`,
          transition: returning ? 'transform 0.12s ease-out' : 'none',
          pointerEvents: 'none', flexShrink: 0,
        }} />
      </div>

      {/* ── Interact button (bottom-right, upper) ─────────────────── */}
      <div
        onTouchStart={onInteractStart}
        onTouchEnd={onInteractEnd}
        onTouchCancel={onInteractEnd}
        style={{
          position: 'absolute',
          bottom: '158px', right: '44px',
          width: '62px', height: '62px',
          borderRadius: '50%',
          background: interactPressed
            ? `rgba(${interactColor},0.3)`
            : `rgba(${interactColor},0.08)`,
          border: `1.5px solid rgba(${interactColor},${interactAlpha})`,
          boxShadow: hasNearby
            ? `0 0 ${interactPressed ? '28px' : '12px'} rgba(${interactColor},${interactPressed ? '0.6' : '0.3'})`
            : 'none',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '2px',
          pointerEvents: 'auto', touchAction: 'none',
          userSelect: 'none', WebkitUserSelect: 'none',
          transition: 'all 0.08s ease',
        }}
      >
        <span style={{
          color: `rgba(${interactColor},${interactAlpha})`,
          fontFamily: 'monospace',
          fontSize: '18px',
          fontWeight: 'bold',
          lineHeight: 1,
        }}>E</span>
        <span style={{
          color: `rgba(${interactColor},${parseFloat(interactAlpha) * 0.7})`,
          fontFamily: 'monospace',
          fontSize: '8px',
          letterSpacing: '1px',
        }}>
          {hasNearby ? 'OPEN' : 'INTERACT'}
        </span>
        {/* Pulse ring when nearby */}
        {hasNearby && !interactPressed && (
          <div style={{
            position: 'absolute',
            width: '100%', height: '100%',
            borderRadius: '50%',
            border: `1px solid rgba(${interactColor},0.4)`,
            animation: 'interactPulse 1.2s ease-out infinite',
            pointerEvents: 'none',
          }} />
        )}
      </div>

      {/* ── Jump button (bottom-right, lower) ─────────────────────── */}
      <div
        onTouchStart={onJumpStart}
        onTouchEnd={onJumpEnd}
        onTouchCancel={onJumpEnd}
        style={{
          position: 'absolute',
          bottom: '70px', right: '44px',
          width: '68px', height: '68px',
          borderRadius: '50%',
          background: jumpPressed ? 'rgba(0,229,255,0.28)' : 'rgba(0,229,255,0.08)',
          border: `1.5px solid rgba(0,229,255,${jumpPressed ? '0.95' : '0.4'})`,
          boxShadow: jumpPressed ? '0 0 24px rgba(0,229,255,0.55)' : '0 0 8px rgba(0,229,255,0.15)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '2px',
          pointerEvents: 'auto', touchAction: 'none',
          userSelect: 'none', WebkitUserSelect: 'none',
          transition: 'all 0.08s ease',
        }}
      >
        <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
          <path d="M9 1L17 13H1L9 1Z" fill={`rgba(0,229,255,${jumpPressed ? '0.95' : '0.6'})`} />
        </svg>
        <span style={{
          color: `rgba(0,229,255,${jumpPressed ? '1' : '0.55'})`,
          fontFamily: 'monospace', fontSize: '9px', letterSpacing: '1.5px',
        }}>JUMP</span>
      </div>

      <style>{`
        @keyframes interactPulse {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
