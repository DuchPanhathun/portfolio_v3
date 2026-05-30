import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useKeyboard } from '../../hooks/useKeyboard'
import { useGameStore } from '../../stores/useGameStore'
import { HumanCharacter } from './HumanCharacter'
import { POD_POSITIONS } from '../../data/projects'
import * as THREE from 'three'

const SPEED           = 5
const GRAVITY         = -18
const JUMP_FORCE      = 8
const GROUND_Y        = 0
const STATION_RADIUS  = 13
const GALLERY_RADIUS  = 19
const PANEL_INTERACT_DIST = 3.5
const POD_INTERACT_DIST   = 3.0
const PORTAL_OPEN_DIST    = 4.0
const PORTAL_POS          = new THREE.Vector3(11.5, 0, 0)
const PORTAL_ENTER_X      = 11.2   // walk past this x to enter gallery

const PANELS: { id: 'about' | 'contact' | 'skills'; position: THREE.Vector3 }[] = [
  { id: 'about',   position: new THREE.Vector3(0,   1, -10) },
  { id: 'contact', position: new THREE.Vector3(0,   1,  10) },
  { id: 'skills',  position: new THREE.Vector3(-10, 1,   0) },
]

const POD_ENTRIES = Object.entries(POD_POSITIONS) as [string, [number, number, number]][]

export function CharacterController() {
  const charRef  = useRef<THREE.Group>(null!)
  const { camera } = useThree()
  const keys     = useKeyboard()

  const {
    activePanelId, setNearbyPanel, setActivePanel,
    galleryMode, enterGallery, exitGallery,
    setNearPortal,
    activeProjectId, setActiveProject, setNearbyProject,
    isTransitioning, setTransitioning,
  } = useGameStore()

  const camAngle         = useRef(0)
  const camDist          = useRef(6)
  const targetPos        = useRef(new THREE.Vector3(0, 0, 0))
  const interactConsumed = useRef(false)
  const escapeConsumed   = useRef(false)
  const jumpConsumed     = useRef(false)
  const velocityY        = useRef(0)
  const isGrounded       = useRef(true)
  const isMovingRef      = useRef(false)
  const prevGalleryMode  = useRef(false)
  const portalConsumed   = useRef(false)
  const exitConsumed     = useRef(false)

  useEffect(() => {
    let dragging = false
    let lastX = 0
    const onDown  = (e: MouseEvent) => { dragging = true; lastX = e.clientX }
    const onUp    = () => { dragging = false }
    const onMove  = (e: MouseEvent) => {
      if (!dragging || activePanelId || activeProjectId) return
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
  }, [activePanelId, activeProjectId])

  useFrame((_, delta) => {
    if (!charRef.current) return

    // ── Teleport on scene switch ──────────────────────────────────────────────
    if (galleryMode !== prevGalleryMode.current) {
      prevGalleryMode.current = galleryMode
      if (galleryMode) {
        charRef.current.position.set(0, 0, 15)
        camAngle.current = 0
      } else {
        charRef.current.position.set(9, 0, 0)
        camAngle.current = -Math.PI / 2
      }
      portalConsumed.current = true
      exitConsumed.current   = true
      return
    }

    // ── Escape ────────────────────────────────────────────────────────────────
    if (keys.current.escape && !escapeConsumed.current) {
      escapeConsumed.current = true
      if (activeProjectId) {
        setActiveProject(null)
      } else if (activePanelId) {
        setActivePanel(null)
      } else if (galleryMode && !isTransitioning) {
        setTransitioning(true)
        setTimeout(() => {
          exitGallery()
          setTimeout(() => setTransitioning(false), 500)
        }, 400)
      }
    }
    if (!keys.current.escape) escapeConsumed.current = false

    // Freeze while any overlay is open or transitioning
    if (activePanelId || activeProjectId || isTransitioning) return

    // ── Jump & gravity ─────────────────────────────────────────────────────────
    if (keys.current.jump && !jumpConsumed.current && isGrounded.current) {
      jumpConsumed.current = true
      velocityY.current    = JUMP_FORCE
      isGrounded.current   = false
    }
    if (!keys.current.jump) jumpConsumed.current = false

    velocityY.current         += GRAVITY * delta
    charRef.current.position.y += velocityY.current * delta
    if (charRef.current.position.y <= GROUND_Y) {
      charRef.current.position.y = GROUND_Y
      velocityY.current           = 0
      isGrounded.current          = true
    }

    // ── Horizontal movement ────────────────────────────────────────────────────
    const moveDir = new THREE.Vector3()
    if (keys.current.forward)  moveDir.z -= 1
    if (keys.current.backward) moveDir.z += 1
    if (keys.current.left)     moveDir.x -= 1
    if (keys.current.right)    moveDir.x += 1

    isMovingRef.current = moveDir.length() > 0

    if (moveDir.length() > 0) {
      moveDir.normalize().applyEuler(new THREE.Euler(0, camAngle.current, 0))
      const next = charRef.current.position.clone().addScaledVector(moveDir, SPEED * delta)
      next.y = charRef.current.position.y

      const radius = galleryMode ? GALLERY_RADIUS : STATION_RADIUS
      if (new THREE.Vector2(next.x, next.z).length() < radius) {
        charRef.current.position.copy(next)
        targetPos.current.copy(next)
      }

      const targetAngle = Math.atan2(moveDir.x, moveDir.z)
      charRef.current.rotation.y = THREE.MathUtils.lerp(
        charRef.current.rotation.y, targetAngle, 0.15,
      )
    }

    // ── Camera follow ──────────────────────────────────────────────────────────
    const angle = camAngle.current
    const cx = charRef.current.position.x + Math.sin(angle) * camDist.current
    const cz = charRef.current.position.z + Math.cos(angle) * camDist.current
    camera.position.lerp(new THREE.Vector3(cx, charRef.current.position.y + 3.5, cz), 0.1)
    camera.lookAt(charRef.current.position.x, charRef.current.position.y + 1, charRef.current.position.z)

    // ── Portal / exit detection ────────────────────────────────────────────────
    if (!galleryMode) {
      const distToPortal = new THREE.Vector2(
        charRef.current.position.x - PORTAL_POS.x,
        charRef.current.position.z - PORTAL_POS.z,
      ).length()
      const isNear = distToPortal < PORTAL_OPEN_DIST
      setNearPortal(isNear)

      // Enter gallery when walking through the portal wall
      if (isNear && charRef.current.position.x > PORTAL_ENTER_X && !portalConsumed.current) {
        portalConsumed.current = true
        setTransitioning(true)
        setTimeout(() => {
          enterGallery()
          setTimeout(() => setTransitioning(false), 500)
        }, 400)
      }
      if (charRef.current.position.x < PORTAL_ENTER_X - 1) portalConsumed.current = false

      // Station panel proximity
      const charPos2D = new THREE.Vector2(charRef.current.position.x, charRef.current.position.z)
      let nearest: typeof PANELS[0] | null = null
      let minDist = Infinity
      for (const panel of PANELS) {
        const d = charPos2D.distanceTo(new THREE.Vector2(panel.position.x, panel.position.z))
        if (d < PANEL_INTERACT_DIST && d < minDist) { minDist = d; nearest = panel }
      }
      setNearbyPanel(nearest?.id ?? null)

      if (keys.current.interact && !interactConsumed.current && nearest) {
        interactConsumed.current = true
        setActivePanel(nearest.id)
      }
      if (!keys.current.interact) interactConsumed.current = false

    } else {
      // ── Gallery mode ───────────────────────────────────────────────────────
      setNearPortal(false)
      setNearbyPanel(null)

      // Exit gallery through south wall (z > 18)
      if (charRef.current.position.z > 18 && !exitConsumed.current) {
        exitConsumed.current = true
        setTransitioning(true)
        setTimeout(() => {
          exitGallery()
          setTimeout(() => setTransitioning(false), 500)
        }, 400)
      }
      if (charRef.current.position.z < 17) exitConsumed.current = false

      // Project pod proximity
      const charPos2D = new THREE.Vector2(charRef.current.position.x, charRef.current.position.z)
      let nearestPod: string | null = null
      let minPodDist = Infinity
      for (const [id, pos] of POD_ENTRIES) {
        const d = charPos2D.distanceTo(new THREE.Vector2(pos[0], pos[2]))
        if (d < POD_INTERACT_DIST && d < minPodDist) { minPodDist = d; nearestPod = id }
      }
      setNearbyProject(nearestPod)

      if (keys.current.interact && !interactConsumed.current && nearestPod) {
        interactConsumed.current = true
        setActiveProject(nearestPod)
      }
      if (!keys.current.interact) interactConsumed.current = false
    }
  })

  return (
    <group ref={charRef} position={[0, 0, 4]}>
      <HumanCharacter isMovingRef={isMovingRef} />
    </group>
  )
}
