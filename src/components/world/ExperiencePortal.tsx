import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from '../../stores/useGameStore'

export function ExperiencePortal() {
  const nearPortal = useGameStore(s => s.nearPortal)
  const leftGroup  = useRef<THREE.Group>(null!)
  const rightGroup = useRef<THREE.Group>(null!)
  const glowLight  = useRef<THREE.PointLight>(null!)
  const openProg   = useRef(0)

  useFrame((_, delta) => {
    openProg.current = THREE.MathUtils.lerp(openProg.current, nearPortal ? 1 : 0, delta * 4)
    if (leftGroup.current)  leftGroup.current.position.x  = THREE.MathUtils.lerp(0, -1.1, openProg.current)
    if (rightGroup.current) rightGroup.current.position.x = THREE.MathUtils.lerp(0,  1.1, openProg.current)
    if (glowLight.current)  glowLight.current.intensity   = THREE.MathUtils.lerp(6, 50, openProg.current)
  })

  const glow = nearPortal ? 2.5 : 0.8
  const doorGlow = nearPortal ? 0.5 : 0.12

  // Portal sits at east wall x=11.5, rotation y=-PI/2 means local-X = world-Z (slide doors north/south)
  return (
    <group position={[11.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>

      {/* ── Outer frame ─────────────────────────────────────────────── */}
      {/* Top bar */}
      <mesh position={[0, 2.58, 0]}>
        <boxGeometry args={[2.24, 0.1, 0.18]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={glow} />
      </mesh>
      {/* Bottom threshold */}
      <mesh position={[0, 0.03, 0]}>
        <boxGeometry args={[2.24, 0.06, 0.18]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={glow * 0.7} />
      </mesh>
      {/* Left pillar */}
      <mesh position={[-1.1, 1.3, 0]}>
        <boxGeometry args={[0.08, 2.6, 0.18]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={glow} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[1.1, 1.3, 0]}>
        <boxGeometry args={[0.08, 2.6, 0.18]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={glow} />
      </mesh>
      {/* Corner brackets */}
      {([[-1.08, 2.55], [1.08, 2.55], [-1.08, 0.06], [1.08, 0.06]] as [number,number][]).map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]}>
          <boxGeometry args={[0.14, 0.14, 0.22]} />
          <meshStandardMaterial color="#ffffff" emissive="#00e5ff" emissiveIntensity={glow * 1.5} />
        </mesh>
      ))}

      {/* ── Left door panel ─────────────────────────────────────────── */}
      <group ref={leftGroup} position={[-0.52, 0, 0]}>
        <mesh position={[0, 1.3, 0]}>
          <boxGeometry args={[1.02, 2.56, 0.07]} />
          <meshStandardMaterial color="#020c1e" metalness={0.9} roughness={0.1} emissive="#0033aa" emissiveIntensity={doorGlow} />
        </mesh>
        {/* Accent stripe */}
        <mesh position={[0.45, 1.3, 0.05]}>
          <boxGeometry args={[0.03, 2.4, 0.02]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={glow} />
        </mesh>
        {/* Panel detail lines */}
        {[0.6, 1.0, 1.4, 1.8, 2.2].map((y, i) => (
          <mesh key={i} position={[0, y, 0.05]}>
            <boxGeometry args={[0.8, 0.015, 0.01]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={glow * 0.5} />
          </mesh>
        ))}
      </group>

      {/* ── Right door panel ────────────────────────────────────────── */}
      <group ref={rightGroup} position={[0.52, 0, 0]}>
        <mesh position={[0, 1.3, 0]}>
          <boxGeometry args={[1.02, 2.56, 0.07]} />
          <meshStandardMaterial color="#020c1e" metalness={0.9} roughness={0.1} emissive="#0033aa" emissiveIntensity={doorGlow} />
        </mesh>
        <mesh position={[-0.45, 1.3, 0.05]}>
          <boxGeometry args={[0.03, 2.4, 0.02]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={glow} />
        </mesh>
        {[0.6, 1.0, 1.4, 1.8, 2.2].map((y, i) => (
          <mesh key={i} position={[0, y, 0.05]}>
            <boxGeometry args={[0.8, 0.015, 0.01]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={glow * 0.5} />
          </mesh>
        ))}
      </group>

      {/* ── Glow light ──────────────────────────────────────────────── */}
      <pointLight ref={glowLight} color="#00e5ff" intensity={6} distance={12} position={[-0.5, 1.5, 0]} />

      {/* ── Label — always visible ───────────────────────────────────── */}
      <Html position={[0, 3.1, 0]} center distanceFactor={10}>
        <div style={{
          color: '#00e5ff',
          fontFamily: 'monospace',
          textAlign: 'center',
          pointerEvents: 'none',
          userSelect: 'none',
          textShadow: '0 0 12px #00e5ff',
          whiteSpace: 'nowrap',
        }}>
          <div style={{ fontSize: '8px', letterSpacing: '5px', opacity: 0.6, marginBottom: '3px' }}>█ SECTOR ACCESS █</div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '3px' }}>EXPERIENCE CENTER</div>
          <div style={{ fontSize: '9px', color: '#80cbc4', marginTop: '5px', letterSpacing: '1px' }}>→ WALK THROUGH TO ENTER</div>
        </div>
      </Html>
    </group>
  )
}
