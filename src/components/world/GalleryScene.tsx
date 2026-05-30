import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Grid, Html, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../stores/useGameStore'
import { projects, POD_POSITIONS, SECTOR_CONFIG, type Project } from '../../data/projects'

// ─────────────────────────────────────────────────────────────────────────────
// Gallery room geometry
// ─────────────────────────────────────────────────────────────────────────────

function GalleryFloor() {
  return (
    <group>
      {/* Main floor disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
        <circleGeometry args={[21, 64]} />
        <meshStandardMaterial color="#030d1e" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Grid overlay */}
      <Grid
        position={[0, 0.01, 0]}
        args={[42, 42]}
        cellSize={1}
        cellThickness={0.3}
        cellColor="#00264d"
        sectionSize={5}
        sectionThickness={0.6}
        sectionColor="#004477"
        fadeDistance={30}
        fadeStrength={1.2}
        followCamera={false}
        infiniteGrid={false}
      />
      {/* Sector dividers — 4 glowing lines from center */}
      {([0, Math.PI / 2, Math.PI, -Math.PI / 2] as number[]).map((angle, i) => (
        <mesh
          key={i}
          position={[Math.sin(angle) * 10, 0.02, -Math.cos(angle) * 10]}
          rotation={[-Math.PI / 2, 0, -angle]}
        >
          <planeGeometry args={[20, 0.04]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={1.2}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      {/* Center glow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <circleGeometry args={[1.5, 32]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.4} transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

function GalleryWalls() {
  const segments = 12
  const radius   = 21
  const height   = 6

  return (
    <group>
      {/* Outer cylinder hull */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, radius, height, segments, 1, true]} />
        <meshStandardMaterial color="#040e20" metalness={0.8} roughness={0.3} side={THREE.BackSide} />
      </mesh>
      {/* Neon accent ring at ceiling */}
      <mesh position={[0, height - 0.05, 0]}>
        <torusGeometry args={[radius, 0.06, 8, segments]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2} />
      </mesh>
      {/* Neon accent ring at floor */}
      <mesh position={[0, 0.1, 0]}>
        <torusGeometry args={[radius, 0.04, 8, segments]} />
        <meshStandardMaterial color="#0044aa" emissive="#0044aa" emissiveIntensity={1.5} />
      </mesh>
      {/* Mid-wall ring */}
      <mesh position={[0, height * 0.5, 0]}>
        <torusGeometry args={[radius, 0.03, 6, segments]} />
        <meshStandardMaterial color="#005599" emissive="#005599" emissiveIntensity={1} />
      </mesh>
      {/* Vertical ribs */}
      {Array.from({ length: segments }).map((_, i) => {
        const angle = (i / segments) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.sin(angle) * (radius - 0.1), height / 2, Math.cos(angle) * (radius - 0.1)]}>
            <boxGeometry args={[0.08, height, 0.08]} />
            <meshStandardMaterial color="#0a1628" metalness={0.9} roughness={0.2} />
          </mesh>
        )
      })}
    </group>
  )
}

function GalleryCeiling() {
  const lightPanelAngles = [0, Math.PI / 2, Math.PI, -Math.PI / 2]
  return (
    <group position={[0, 6, 0]}>
      {/* Ceiling disc */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[21, 64]} />
        <meshStandardMaterial color="#040e20" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Large ceiling light panels */}
      {lightPanelAngles.map((angle, i) => (
        <mesh key={i} position={[Math.sin(angle) * 12, -0.05, Math.cos(angle) * 12]} rotation={[Math.PI / 2, angle, 0]}>
          <planeGeometry args={[4, 1.5]} />
          <meshStandardMaterial color="#c8e8ff" emissive="#a0d0ff" emissiveIntensity={1.2} />
        </mesh>
      ))}
      {/* Central emitter ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.08, 8, 32]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2.5} />
      </mesh>
      {/* Energy beam down */}
      <mesh position={[0, -3, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 6, 6]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={3} transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

function CentralDisplay() {
  const outerRef = useRef<THREE.Mesh>(null!)
  const innerRef = useRef<THREE.Mesh>(null!)
  const ring1Ref = useRef<THREE.Mesh>(null!)
  const ring2Ref = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    if (outerRef.current) outerRef.current.rotation.y += delta * 0.4
    if (innerRef.current) { innerRef.current.rotation.y += delta * 0.8; innerRef.current.rotation.x += delta * 0.3 }
    if (ring1Ref.current) ring1Ref.current.rotation.y += delta * 0.25
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.2
  })

  return (
    <group position={[0, 2.5, 0]}>
      {/* Orbit rings */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.2, 0.025, 6, 64]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.5} transparent opacity={0.7} />
      </mesh>
      <mesh ref={ring2Ref} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.2, 0.018, 6, 64]} />
        <meshStandardMaterial color="#ce93d8" emissive="#ce93d8" emissiveIntensity={1.2} transparent opacity={0.6} />
      </mesh>
      {/* Outer sphere */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.4} wireframe transparent opacity={0.6} />
      </mesh>
      {/* Inner sphere */}
      <mesh ref={innerRef} scale={0.6}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#4fc3f7" emissive="#4fc3f7" emissiveIntensity={1.5} />
      </mesh>
      {/* Pedestal */}
      <mesh position={[0, -2.1, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 0.4, 8]} />
        <meshStandardMaterial color="#0a1628" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -2.5, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.15, 8]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1} />
      </mesh>
      {/* Label */}
      <Html position={[0, 1.8, 0]} center distanceFactor={12}>
        <div style={{
          color: '#00e5ff',
          fontFamily: 'monospace',
          fontSize: '11px',
          letterSpacing: '3px',
          textShadow: '0 0 8px #00e5ff',
          pointerEvents: 'none',
          userSelect: 'none',
          textAlign: 'center',
        }}>
          EXPERIENCE CENTER
        </div>
      </Html>
      <pointLight color="#00e5ff" intensity={30} distance={8} />
    </group>
  )
}

function SectorLabel({ sector }: { sector: keyof typeof SECTOR_CONFIG }) {
  const cfg = SECTOR_CONFIG[sector]
  const positions: Record<string, [number, number, number]> = {
    ai:         [0, 3.5, -17],
    business:   [17, 3.5, 0],
    research:   [0, 3.5, 17],
    innovation: [-17, 3.5, 0],
  }
  const pos = positions[sector]
  return (
    <Html position={pos} center distanceFactor={14}>
      <div style={{
        color: cfg.color,
        fontFamily: 'monospace',
        textAlign: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
        textShadow: `0 0 10px ${cfg.color}`,
      }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '3px' }}>{cfg.label}</div>
        <div style={{ fontSize: '8px', opacity: 0.6, marginTop: '3px', letterSpacing: '1px' }}>{cfg.description}</div>
      </div>
    </Html>
  )
}

function ExitPortal() {
  const nearExit = useRef(false)
  const { exitGallery, setTransitioning } = useGameStore()
  const leftRef  = useRef<THREE.Group>(null!)
  const rightRef = useRef<THREE.Group>(null!)
  const openP    = useRef(0)

  useFrame((_, delta) => {
    openP.current = THREE.MathUtils.lerp(openP.current, nearExit.current ? 1 : 0, delta * 4)
    if (leftRef.current)  leftRef.current.position.x  = THREE.MathUtils.lerp(0, -1.1, openP.current)
    if (rightRef.current) rightRef.current.position.x = THREE.MathUtils.lerp(0,  1.1, openP.current)
  })

  const handleExit = () => {
    if (nearExit.current) return
    nearExit.current = true
    setTransitioning(true)
    setTimeout(() => {
      exitGallery()
      setTimeout(() => setTransitioning(false), 500)
    }, 400)
  }

  return (
    <group position={[0, 0, 20]} rotation={[0, Math.PI, 0]}>
      {/* Frame */}
      <mesh position={[0, 2.58, 0]}>
        <boxGeometry args={[2.24, 0.1, 0.18]} />
        <meshStandardMaterial color="#ff6b6b" emissive="#ff4444" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[2.24, 0.06, 0.18]} />
        <meshStandardMaterial color="#ff6b6b" emissive="#ff4444" emissiveIntensity={1} />
      </mesh>
      <mesh position={[-1.1, 1.3, 0]}>
        <boxGeometry args={[0.08, 2.6, 0.18]} />
        <meshStandardMaterial color="#ff6b6b" emissive="#ff4444" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[1.1, 1.3, 0]}>
        <boxGeometry args={[0.08, 2.6, 0.18]} />
        <meshStandardMaterial color="#ff6b6b" emissive="#ff4444" emissiveIntensity={1.5} />
      </mesh>
      {/* Door panels */}
      <group ref={leftRef} position={[-0.52, 0, 0]}>
        <mesh position={[0, 1.3, 0]}>
          <boxGeometry args={[1.02, 2.56, 0.07]} />
          <meshStandardMaterial color="#1a0505" metalness={0.9} roughness={0.1} emissive="#440000" emissiveIntensity={0.3} />
        </mesh>
      </group>
      <group ref={rightRef} position={[0.52, 0, 0]}>
        <mesh position={[0, 1.3, 0]}>
          <boxGeometry args={[1.02, 2.56, 0.07]} />
          <meshStandardMaterial color="#1a0505" metalness={0.9} roughness={0.1} emissive="#440000" emissiveIntensity={0.3} />
        </mesh>
      </group>
      <pointLight color="#ff4444" intensity={10} distance={10} position={[0, 1.5, -0.5]} />
      <Html position={[0, 3.1, 0]} center distanceFactor={10}>
        <div
          onClick={handleExit}
          style={{
            color: '#ff8888',
            fontFamily: 'monospace',
            textAlign: 'center',
            pointerEvents: 'auto',
            cursor: 'pointer',
            textShadow: '0 0 10px #ff4444',
            userSelect: 'none',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 'bold', letterSpacing: '3px' }}>EXIT GALLERY</div>
          <div style={{ fontSize: '9px', color: '#ff9999', marginTop: '4px' }}>→ RETURN TO STATION</div>
        </div>
      </Html>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Project Pod
// ─────────────────────────────────────────────────────────────────────────────

function ProjectPod({ project }: { project: Project }) {
  const pos   = POD_POSITIONS[project.id]
  const { nearbyProjectId } = useGameStore()
  const isNearby = nearbyProjectId === project.id
  const meshRef  = useRef<THREE.Group>(null!)
  const bobPhase = useRef(Math.random() * Math.PI * 2)
  const scaleRef = useRef(1)

  useFrame((_, delta) => {
    bobPhase.current += delta * 0.8
    if (meshRef.current) {
      meshRef.current.position.y = pos[1] + Math.sin(bobPhase.current) * 0.12
      meshRef.current.rotation.y += delta * 0.3
    }
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, isNearby ? 1.12 : 1, delta * 5)
    if (meshRef.current) meshRef.current.scale.setScalar(scaleRef.current)
  })

  const color = project.color

  return (
    <group position={[pos[0], 0, pos[2]]}>
      <group ref={meshRef} position={[0, pos[1], 0]}>
        {/* Main pod body */}
        <mesh castShadow>
          <boxGeometry args={[1.4, 1.0, 0.08]} />
          <meshStandardMaterial
            color="#060f20"
            metalness={0.8}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={isNearby ? 0.25 : 0.08}
          />
        </mesh>
        {/* Top border */}
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[1.4, 0.04, 0.1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isNearby ? 2.5 : 1.2} />
        </mesh>
        {/* Bottom border */}
        <mesh position={[0, -0.52, 0]}>
          <boxGeometry args={[1.4, 0.04, 0.1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={isNearby ? 2 : 0.8} />
        </mesh>
        {/* Corner dots */}
        {([[-0.65, 0.5], [0.65, 0.5], [-0.65, -0.5], [0.65, -0.5]] as [number,number][]).map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.06]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={isNearby ? 4 : 1.5} />
          </mesh>
        ))}
        {/* Tech stack dots */}
        {project.techStack.slice(0, 5).map((_, i) => (
          <mesh key={i} position={[-0.55 + i * 0.28, -0.35, 0.05]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
          </mesh>
        ))}
        {/* Status indicator */}
        <mesh position={[0.58, 0.35, 0.05]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshStandardMaterial
            color={project.status === 'completed' ? '#00ff88' : '#ffcc00'}
            emissive={project.status === 'completed' ? '#00ff88' : '#ffcc00'}
            emissiveIntensity={2}
          />
        </mesh>
        {/* Point light glow */}
        <pointLight color={color} intensity={isNearby ? 8 : 2} distance={4} />
        {/* HTML label */}
        <Html position={[0, 0, 0.1]} center distanceFactor={6}>
          <div style={{
            color: '#ffffff',
            fontFamily: 'monospace',
            textAlign: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
            width: '120px',
          }}>
            <div style={{ fontSize: '9px', color: color, letterSpacing: '2px', textShadow: `0 0 8px ${color}`, marginBottom: '2px' }}>
              {project.sector.toUpperCase()}
            </div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#e0f4ff', lineHeight: 1.2 }}>
              {project.title}
            </div>
            <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
              {project.date}
            </div>
            {isNearby && (
              <>
                <style>{`@keyframes podPulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
                <div style={{
                  marginTop: '6px',
                  fontSize: '9px',
                  color: color,
                  letterSpacing: '1px',
                  animation: 'podPulse 1s infinite',
                  textShadow: `0 0 6px ${color}`,
                }}>
                  [E] EXPLORE
                </div>
              </>
            )}
          </div>
        </Html>
      </group>

      {/* Beam down to floor */}
      <mesh position={[0, pos[1] / 2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, pos[1], 4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.4} />
      </mesh>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Gallery lighting
// ─────────────────────────────────────────────────────────────────────────────

function GalleryLighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#8ab4cc" />
      {/* Main overhead */}
      <pointLight position={[0, 5.5, 0]} intensity={80} color="#c8deff" />
      {/* Sector accent lights */}
      <pointLight position={[0,  4, -16]} intensity={40} color="#00e5ff" />
      <pointLight position={[16, 4,   0]} intensity={40} color="#ce93d8" />
      <pointLight position={[0,  4,  16]} intensity={40} color="#80cbc4" />
      <pointLight position={[-16,4,   0]} intensity={40} color="#ffcc80" />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

export function GalleryScene() {
  return (
    <>
      <Stars radius={300} depth={60} count={5000} factor={4} fade speed={0.5} />
      <GalleryLighting />
      <GalleryFloor />
      <GalleryWalls />
      <GalleryCeiling />
      <CentralDisplay />
      <ExitPortal />
      {(['ai', 'business', 'research', 'innovation'] as const).map(s => (
        <SectorLabel key={s} sector={s} />
      ))}
      {projects.map(p => (
        <ProjectPod key={p.id} project={p} />
      ))}
    </>
  )
}
