import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useKeyboard } from '../../hooks/useKeyboard'
import { useGameStore } from '../../stores/useGameStore'
import * as THREE from 'three'

const SPEED = 5
const GRAVITY = -18
const JUMP_FORCE = 8
const GROUND_Y = 0
const STATION_RADIUS = 13
const PANEL_INTERACT_DIST = 3.5

const PANELS: { id: 'about' | 'projects' | 'contact' | 'skills'; position: THREE.Vector3 }[] = [
  { id: 'about',    position: new THREE.Vector3(0,   1,  -10) },
  { id: 'projects', position: new THREE.Vector3(10,  1,   0)  },
  { id: 'contact',  position: new THREE.Vector3(0,   1,   10) },
  { id: 'skills',   position: new THREE.Vector3(-10, 1,   0)  },
]

export function CharacterController() {
  const charRef = useRef<THREE.Group>(null!)
  const { camera } = useThree()
  const keys = useKeyboard()
  const { activePanelId, setNearbyPanel, setActivePanel } = useGameStore()

  const camAngle = useRef(0)
  const camDist = useRef(6)
  const targetPos = useRef(new THREE.Vector3(0, 0, 0))
  const interactConsumed = useRef(false)
  const escapeConsumed = useRef(false)
  const jumpConsumed = useRef(false)
  const velocityY = useRef(0)
  const isGrounded = useRef(true)

  // Mouse drag to rotate camera
  useEffect(() => {
    let dragging = false
    let lastX = 0
    const onDown = (e: MouseEvent) => { dragging = true; lastX = e.clientX }
    const onUp   = () => { dragging = false }
    const onMove = (e: MouseEvent) => {
      if (!dragging || activePanelId) return
      camAngle.current -= (e.clientX - lastX) * 0.005
      lastX = e.clientX
    }
    const onWheel = (e: WheelEvent) => {
      camDist.current = THREE.MathUtils.clamp(camDist.current + e.deltaY * 0.01, 3, 12)
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('wheel', onWheel)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('wheel', onWheel)
    }
  }, [activePanelId])

  useFrame((_, delta) => {
    if (!charRef.current) return

    // Escape to close panel
    if (keys.current.escape && !escapeConsumed.current) {
      escapeConsumed.current = true
      setActivePanel(null)
    }
    if (!keys.current.escape) escapeConsumed.current = false

    if (activePanelId) return // freeze movement while panel open

    // ── Jump & gravity ──────────────────────────────────────────────────
    if (keys.current.jump && !jumpConsumed.current && isGrounded.current) {
      jumpConsumed.current = true
      velocityY.current = JUMP_FORCE
      isGrounded.current = false
    }
    if (!keys.current.jump) jumpConsumed.current = false

    // Apply gravity
    velocityY.current += GRAVITY * delta
    charRef.current.position.y += velocityY.current * delta

    // Ground collision
    if (charRef.current.position.y <= GROUND_Y) {
      charRef.current.position.y = GROUND_Y
      velocityY.current = 0
      isGrounded.current = true
    }

    // ── Horizontal movement ─────────────────────────────────────────────
    const moveDir = new THREE.Vector3()
    if (keys.current.forward)  moveDir.z -= 1
    if (keys.current.backward) moveDir.z += 1
    if (keys.current.left)     moveDir.x -= 1
    if (keys.current.right)    moveDir.x += 1

    if (moveDir.length() > 0) {
      moveDir.normalize()
      moveDir.applyEuler(new THREE.Euler(0, camAngle.current, 0))

      const next = charRef.current.position.clone().addScaledVector(moveDir, SPEED * delta)
      next.y = charRef.current.position.y // preserve vertical from physics
      if (new THREE.Vector2(next.x, next.z).length() < STATION_RADIUS) {
        charRef.current.position.copy(next)
        targetPos.current.copy(next)
      }

      const targetAngle = Math.atan2(moveDir.x, moveDir.z)
      charRef.current.rotation.y = THREE.MathUtils.lerp(
        charRef.current.rotation.y,
        targetAngle,
        0.15
      )
    }

    // Camera follow
    const angle = camAngle.current
    const cx = charRef.current.position.x + Math.sin(angle) * camDist.current
    const cz = charRef.current.position.z + Math.cos(angle) * camDist.current
    camera.position.lerp(new THREE.Vector3(cx, charRef.current.position.y + 3.5, cz), 0.1)
    camera.lookAt(charRef.current.position.x, charRef.current.position.y + 1, charRef.current.position.z)

    // Proximity check for panels
    const charPos2D = new THREE.Vector2(charRef.current.position.x, charRef.current.position.z)
    let nearest: typeof PANELS[0] | null = null
    let minDist = Infinity
    for (const panel of PANELS) {
      const d = charPos2D.distanceTo(new THREE.Vector2(panel.position.x, panel.position.z))
      if (d < PANEL_INTERACT_DIST && d < minDist) { minDist = d; nearest = panel }
    }
    setNearbyPanel(nearest?.id ?? null)

    // E to interact
    if (keys.current.interact && !interactConsumed.current && nearest) {
      interactConsumed.current = true
      setActivePanel(nearest.id)
    }
    if (!keys.current.interact) interactConsumed.current = false
  })

  return (
    <group ref={charRef} position={[0, 0, 4]}>
      {/* Space suit torso */}
      <mesh position={[0, 0.95, 0]} castShadow>
        <capsuleGeometry args={[0.3, 1, 8, 16]} />
        <meshStandardMaterial color="#cdd8e8" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Suit chest plate */}
      <mesh position={[0, 1.05, 0.27]} castShadow>
        <boxGeometry args={[0.42, 0.5, 0.08]} />
        <meshStandardMaterial color="#e0eaf8" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Chest light */}
      <mesh position={[0, 1.1, 0.32]}>
        <boxGeometry args={[0.12, 0.06, 0.02]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={5} />
      </mesh>
      {/* Helmet */}
      <mesh position={[0, 1.82, 0]} castShadow>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color="#dde8f5" metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Visor */}
      <mesh position={[0, 1.84, 0.17]} rotation={[0.25, 0, 0]}>
        <boxGeometry args={[0.3, 0.14, 0.06]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00c0ff" emissiveIntensity={2} transparent opacity={0.75} />
      </mesh>
      {/* Shoulder pads */}
      {([-0.35, 0.35] as const).map((px, i) => (
        <mesh key={i} position={[px, 1.25, 0]} castShadow>
          <sphereGeometry args={[0.16, 10, 10]} />
          <meshStandardMaterial color="#b8cce0" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      {/* Backpack / life support */}
      <mesh position={[0, 0.95, -0.32]} castShadow>
        <boxGeometry args={[0.3, 0.5, 0.12]} />
        <meshStandardMaterial color="#a0b4cc" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  )
}
