import { useEffect, useRef } from 'react'

export interface Keys {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  interact: boolean
  escape: boolean
  jump: boolean
}

export function useKeyboard() {
  const keys = useRef<Keys>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    interact: false,
    escape: false,
    jump: false,
  })

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat) return
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    keys.current.forward   = true; break
        case 'KeyS': case 'ArrowDown':  keys.current.backward  = true; break
        case 'KeyA': case 'ArrowLeft':  keys.current.left      = true; break
        case 'KeyD': case 'ArrowRight': keys.current.right     = true; break
        case 'KeyE': keys.current.interact = true; break
        case 'Escape': keys.current.escape = true; break
        case 'Space': keys.current.jump = true; break
      }
    }
    const up = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp':    keys.current.forward   = false; break
        case 'KeyS': case 'ArrowDown':  keys.current.backward  = false; break
        case 'KeyA': case 'ArrowLeft':  keys.current.left      = false; break
        case 'KeyD': case 'ArrowRight': keys.current.right     = false; break
        case 'KeyE': keys.current.interact = false; break
        case 'Escape': keys.current.escape = false; break
        case 'Space': keys.current.jump = false; break
      }
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  return keys
}
