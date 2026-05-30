import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Billboard } from '@react-three/drei'
import { useGameStore } from '../../stores/useGameStore'
import type { PanelId } from '../../stores/useGameStore'
import * as THREE from 'three'

const PANEL_META: Record<NonNullable<PanelId>, { label: string; icon: string; color: string }> = {
  about:    { label: 'About Me',   icon: '👤', color: '#4fc3f7' },
  projects: { label: 'Experience',  icon: '💼', color: '#ce93d8' },
  contact:  { label: 'Contact',    icon: '📡', color: '#80cbc4' },
  skills:   { label: 'Skills',     icon: '⚡', color: '#ffcc80' },
}

interface PanelProps {
  id: NonNullable<PanelId>
  position: [number, number, number]
  rotation?: [number, number, number]
}

export function HolographicPanel({ id, position, rotation = [0, 0, 0] }: PanelProps) {
  const frameRef = useRef<THREE.Mesh>(null!)
  const glowRef  = useRef<THREE.Mesh>(null!)
  const { nearbyPanelId, activePanelId } = useGameStore()

  const meta = PANEL_META[id]
  const isNearby = nearbyPanelId === id
  const isActive = activePanelId === id

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = (isNearby || isActive)
        ? 2 + Math.sin(t * 4) * 0.5
        : 0.8 + Math.sin(t * 1.5) * 0.3
      glowRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.02)
    }
    if (frameRef.current) {
      frameRef.current.rotation.z = Math.sin(t * 0.8) * 0.008
    }
  })

  const color = new THREE.Color(meta.color)

  return (
    <group position={position} rotation={rotation}>
      {/* Glow plane */}
      <mesh ref={glowRef} position={[0, 0, -0.05]}>
        <planeGeometry args={[2.4, 1.6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Panel frame */}
      <mesh ref={frameRef}>
        <boxGeometry args={[2.2, 1.4, 0.04]} />
        <meshStandardMaterial
          color="#071020"
          emissive={color}
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Corner brackets */}
      {[[-1, -0.65], [-1, 0.65], [1, -0.65], [1, 0.65]].map(([cx, cy], i) => (
        <mesh key={i} position={[cx, cy, 0.03]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshStandardMaterial color={meta.color} emissive={meta.color} emissiveIntensity={3} />
        </mesh>
      ))}

      {/* Border strips */}
      <mesh position={[0, 0.71, 0.03]}>
        <boxGeometry args={[2.2, 0.04, 0.01]} />
        <meshStandardMaterial color={meta.color} emissive={meta.color} emissiveIntensity={2} />
      </mesh>
      <mesh position={[0, -0.71, 0.03]}>
        <boxGeometry args={[2.2, 0.04, 0.01]} />
        <meshStandardMaterial color={meta.color} emissive={meta.color} emissiveIntensity={2} />
      </mesh>

      {/* HTML label — hidden while any panel overlay is open */}
      {!activePanelId && (
        <Html
          position={[0, 0, 0.08]}
          center
          style={{ pointerEvents: 'none', userSelect: 'none' }}
          distanceFactor={6}
        >
          <div style={{
            color: meta.color,
            fontFamily: "'Courier New', monospace",
            textAlign: 'center',
            textShadow: `0 0 10px ${meta.color}`,
            width: '180px',
          }}>
            <div style={{ fontSize: '28px', lineHeight: 1 }}>{meta.icon}</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px', marginTop: '4px' }}>
              {meta.label.toUpperCase()}
            </div>
            {isNearby && (
              <div style={{
                fontSize: '11px',
                marginTop: '8px',
                color: '#fff',
                opacity: 0.8,
                animation: 'pulse 1s infinite',
              }}>
                [ PRESS E ]
              </div>
            )}
          </div>
        </Html>
      )}

      {/* Floating interact ring — only when nearby and no panel open */}
      {isNearby && !activePanelId && (
        <Billboard>
          <mesh position={[0, 1.2, 0]}>
            <torusGeometry args={[0.2, 0.02, 8, 32]} />
            <meshStandardMaterial color={meta.color} emissive={meta.color} emissiveIntensity={4} />
          </mesh>
        </Billboard>
      )}
    </group>
  )
}
