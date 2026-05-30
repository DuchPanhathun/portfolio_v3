import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Grid } from '@react-three/drei'
import * as THREE from 'three'

// ─── Materials ─────────────────────────────────────────────────────────────

const HULL_DARK  = { color: '#1a2435', metalness: 0.9, roughness: 0.25 }
const HULL_MID   = { color: '#2a3a55', metalness: 0.8, roughness: 0.3  }
const HULL_LIGHT = { color: '#3d5070', metalness: 0.7, roughness: 0.4  }
const TRIM_CYAN  = { color: '#00e5ff', emissive: '#00e5ff', emissiveIntensity: 4 }
const TRIM_BLUE  = { color: '#4488ff', emissive: '#4488ff', emissiveIntensity: 3 }
const TRIM_WARN  = { color: '#ffaa00', emissive: '#ffaa00', emissiveIntensity: 3 }

// ─── Hull Wall Panel ────────────────────────────────────────────────────────

function HullWall({ angle, radius = 13.5 }: { angle: number; radius?: number }) {
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius

  return (
    <group position={[x, 0, z]} rotation={[0, -angle, 0]}>
      {/* Main hull plate */}
      <mesh position={[0, 2.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[7, 6.5, 0.35]} />
        <meshStandardMaterial {...HULL_DARK} />
      </mesh>

      {/* Inset panel recesses — 2 columns × 2 rows */}
      {[-1.6, 1.6].map((px, ci) =>
        [0.8, 2.8].map((py, ri) => (
          <mesh key={`${ci}-${ri}`} position={[px, py, 0.19]}>
            <boxGeometry args={[2.6, 1.6, 0.05]} />
            <meshStandardMaterial {...HULL_MID} />
          </mesh>
        ))
      )}

      {/* Horizontal panel seam stripes */}
      {[0, 1.8, 3.6, 5.0].map((y, i) => (
        <mesh key={i} position={[0, y, 0.2]}>
          <boxGeometry args={[7, 0.06, 0.02]} />
          <meshStandardMaterial {...HULL_LIGHT} />
        </mesh>
      ))}

      {/* Top cyan accent strip (ceiling light bleed) */}
      <mesh position={[0, 5.18, 0.15]}>
        <boxGeometry args={[6.8, 0.12, 0.04]} />
        <meshStandardMaterial {...TRIM_CYAN} />
      </mesh>

      {/* Bottom floor accent strip */}
      <mesh position={[0, -0.18, 0.15]}>
        <boxGeometry args={[6.8, 0.08, 0.04]} />
        <meshStandardMaterial {...TRIM_BLUE} />
      </mesh>

      {/* Side vertical trim rails */}
      {[-3.4, 3.4].map((px, i) => (
        <mesh key={i} position={[px, 2.5, 0.18]}>
          <boxGeometry args={[0.08, 6.5, 0.02]} />
          <meshStandardMaterial {...TRIM_BLUE} />
        </mesh>
      ))}

      {/* Warning stripes on alternating walls */}
      {angle % (Math.PI / 2) < 0.01 && (
        <mesh position={[0, 2.5, 0.21]}>
          <boxGeometry args={[0.15, 5.5, 0.01]} />
          <meshStandardMaterial {...TRIM_WARN} />
        </mesh>
      )}
    </group>
  )
}

// ─── Ceiling ────────────────────────────────────────────────────────────────

function Ceiling() {
  return (
    <group position={[0, 5.2, 0]}>
      {/* Main ceiling disc */}
      <mesh receiveShadow>
        <cylinderGeometry args={[14, 14, 0.35, 32]} />
        <meshStandardMaterial {...HULL_DARK} />
      </mesh>

      {/* Structural ribs — radial beams */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI * 2) / 8
        return (
          <mesh key={i} rotation={[0, a, 0]} position={[0, -0.2, 0]}>
            <boxGeometry args={[0.2, 0.12, 26]} />
            <meshStandardMaterial {...HULL_MID} />
          </mesh>
        )
      })}

      {/* Ceiling light panels — 4 bright rectangular panels */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a, i) => {
        const px = Math.sin(a) * 6
        const pz = Math.cos(a) * 6
        return (
          <group key={i} position={[px, -0.19, pz]}>
            <mesh>
              <boxGeometry args={[3.5, 0.04, 1.2]} />
              <meshStandardMaterial color="#ffffff" emissive="#cce8ff" emissiveIntensity={5} />
            </mesh>
            {/* Glow border */}
            <mesh>
              <boxGeometry args={[3.7, 0.03, 1.4]} />
              <meshStandardMaterial {...TRIM_CYAN} />
            </mesh>
          </group>
        )
      })}

      {/* Central ceiling hub ring */}
      <mesh position={[0, -0.2, 0]}>
        <torusGeometry args={[2.5, 0.15, 8, 64]} />
        <meshStandardMaterial {...TRIM_CYAN} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[2.2, 2.2, 0.08, 32]} />
        <meshStandardMaterial color="#e8f4ff" emissive="#aaddff" emissiveIntensity={3} />
      </mesh>

      {/* Outer rim */}
      <mesh position={[0, -0.12, 0]}>
        <torusGeometry args={[13.5, 0.12, 8, 64]} />
        <meshStandardMaterial {...TRIM_BLUE} />
      </mesh>
    </group>
  )
}

// ─── Floor ──────────────────────────────────────────────────────────────────

function Floor() {
  return (
    <>
      {/* Floor plate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[14, 32]} />
        <meshStandardMaterial color="#1c2d45" metalness={0.6} roughness={0.5} />
      </mesh>

      {/* Grid overlay */}
      <Grid
        position={[0, 0.01, 0]}
        cellSize={1}
        cellThickness={0.4}
        cellColor="#2a4a7a"
        sectionSize={5}
        sectionThickness={1.2}
        sectionColor="#00c8ff"
        fadeDistance={22}
        fadeStrength={1.5}
        infiniteGrid={false}
      />

      {/* Hex center glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[0.3, 2.2, 6]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={1.5} transparent opacity={0.4} />
      </mesh>

      {/* Cardinal floor directional arrows */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a, i) => {
        const px = Math.sin(a) * 6
        const pz = Math.cos(a) * 6
        return (
          <mesh key={i} rotation={[-Math.PI / 2, 0, a]} position={[px, 0.02, pz]}>
            <planeGeometry args={[0.3, 1.5]} />
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2} transparent opacity={0.5} />
          </mesh>
        )
      })}

      {/* Floor edge trim ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[13.3, 13.6, 32]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2} transparent opacity={0.6} />
      </mesh>
    </>
  )
}

// ─── Structural Pillars ──────────────────────────────────────────────────────

function Pillars() {
  const angles = [45, 135, 225, 315].map((a) => (a * Math.PI) / 180)
  return (
    <>
      {angles.map((a, i) => {
        const x = Math.sin(a) * 10
        const z = Math.cos(a) * 10
        return (
          <group key={i} position={[x, 0, z]}>
            {/* Main pillar */}
            <mesh position={[0, 2.6, 0]} castShadow>
              <boxGeometry args={[0.6, 5.5, 0.6]} />
              <meshStandardMaterial {...HULL_MID} />
            </mesh>
            {/* Inset channel */}
            <mesh position={[0, 2.6, 0.31]}>
              <boxGeometry args={[0.2, 5.3, 0.04]} />
              <meshStandardMaterial {...HULL_DARK} />
            </mesh>
            {/* Cyan glow strip in channel */}
            <mesh position={[0, 2.6, 0.33]}>
              <boxGeometry args={[0.06, 5, 0.02]} />
              <meshStandardMaterial {...TRIM_CYAN} />
            </mesh>
            {/* Base cap */}
            <mesh position={[0, 0.12, 0]}>
              <boxGeometry args={[0.8, 0.24, 0.8]} />
              <meshStandardMaterial {...HULL_LIGHT} />
            </mesh>
            {/* Top cap */}
            <mesh position={[0, 5.3, 0]}>
              <boxGeometry args={[0.8, 0.24, 0.8]} />
              <meshStandardMaterial {...HULL_LIGHT} />
            </mesh>
            {/* Warn stripe at base */}
            <mesh position={[0, 0.4, 0.32]}>
              <boxGeometry args={[0.6, 0.12, 0.01]} />
              <meshStandardMaterial {...TRIM_WARN} />
            </mesh>
          </group>
        )
      })}
    </>
  )
}

// ─── Pipe Conduits along walls ───────────────────────────────────────────────

function PipeConduits() {
  const angles = Array.from({ length: 8 }, (_, i) => (i * Math.PI * 2) / 8)
  return (
    <>
      {angles.map((a, i) => {
        const r = 12.8
        const x = Math.sin(a) * r
        const z = Math.cos(a) * r
        return (
          <group key={i} position={[x, 4.5, z]} rotation={[0, -a, 0]}>
            {/* Horizontal pipe */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 5, 8]} />
              <meshStandardMaterial color="#3a5070" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Pipe joint */}
            <mesh>
              <sphereGeometry args={[0.11, 8, 8]} />
              <meshStandardMaterial {...TRIM_BLUE} />
            </mesh>
          </group>
        )
      })}
    </>
  )
}

// ─── Central Hologram ────────────────────────────────────────────────────────

function CentralHologram() {
  const outerRef = useRef<THREE.Mesh>(null!)
  const innerRef = useRef<THREE.Mesh>(null!)
  const ringRef  = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (outerRef.current) outerRef.current.rotation.y = t * 0.3
    if (innerRef.current) { innerRef.current.rotation.y = -t * 0.5; innerRef.current.rotation.x = t * 0.2 }
    if (ringRef.current)  ringRef.current.rotation.z = t * 0.15
  })

  return (
    <group position={[0, 1.8, 0]}>
      {/* Outer frame octahedron */}
      <mesh ref={outerRef}>
        <octahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={2} wireframe transparent opacity={0.5} />
      </mesh>
      {/* Inner solid */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#4488ff" emissive="#2255cc" emissiveIntensity={3} transparent opacity={0.85} />
      </mesh>
      {/* Orbit ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.2, 0.025, 8, 64]} />
        <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={4} />
      </mesh>
      {/* Base pedestal */}
      <mesh position={[0, -1.4, 0]}>
        <cylinderGeometry args={[0.5, 0.7, 0.3, 8]} />
        <meshStandardMaterial {...HULL_MID} />
      </mesh>
      <mesh position={[0, -1.27, 0]}>
        <torusGeometry args={[0.55, 0.04, 8, 32]} />
        <meshStandardMaterial {...TRIM_CYAN} />
      </mesh>
    </group>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function SpaceStation() {
  const wallAngles = Array.from({ length: 8 }, (_, i) => (i * Math.PI * 2) / 8)

  return (
    <group>
      <Floor />
      <Ceiling />
      <Pillars />
      <PipeConduits />
      <CentralHologram />
      {wallAngles.map((a, i) => <HullWall key={i} angle={a} />)}
    </group>
  )
}
