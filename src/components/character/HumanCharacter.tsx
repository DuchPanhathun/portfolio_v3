import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const SKIN    = '#f0c090'
const HAIR    = '#2a1508'
const JACKET  = '#1c3255'
const JACKET2 = '#25426e'
const PANTS   = '#252538'
const SHOE    = '#14141e'
const BELT    = '#5a3c1e'
const WHITE   = '#eef2f8'

// ─── Static body parts (don't need animation refs) ───────────────────────────

function Head() {
  return (
    <group position={[0, 1.75, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.21, 20, 20]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Hair cap */}
      <mesh position={[0, 0.1, -0.03]} scale={[1, 0.62, 1.1]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={HAIR} roughness={0.9} />
      </mesh>
      {/* Eye whites */}
      <mesh position={[-0.075, 0.03, 0.183]}><sphereGeometry args={[0.048, 8, 8]} /><meshStandardMaterial color={WHITE} roughness={0.5} /></mesh>
      <mesh position={[ 0.075, 0.03, 0.183]}><sphereGeometry args={[0.048, 8, 8]} /><meshStandardMaterial color={WHITE} roughness={0.5} /></mesh>
      {/* Irises */}
      <mesh position={[-0.075, 0.03, 0.185]}><sphereGeometry args={[0.030, 8, 8]} /><meshStandardMaterial color="#1a0800" /></mesh>
      <mesh position={[ 0.075, 0.03, 0.185]}><sphereGeometry args={[0.030, 8, 8]} /><meshStandardMaterial color="#1a0800" /></mesh>
      {/* Nose */}
      <mesh position={[0, -0.025, 0.205]}><sphereGeometry args={[0.028, 8, 8]} /><meshStandardMaterial color={SKIN} roughness={0.8} /></mesh>
      {/* Ears */}
      <mesh position={[-0.215, 0, 0]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color={SKIN} roughness={0.8} /></mesh>
      <mesh position={[ 0.215, 0, 0]}><sphereGeometry args={[0.04, 8, 8]} /><meshStandardMaterial color={SKIN} roughness={0.8} /></mesh>
    </group>
  )
}

function Torso() {
  return (
    <group position={[0, 1.2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.46, 0.54, 0.24]} />
        <meshStandardMaterial color={JACKET} roughness={0.7} />
      </mesh>
      {/* Chest detail */}
      <mesh position={[0, 0.06, 0.125]}>
        <boxGeometry args={[0.28, 0.22, 0.01]} />
        <meshStandardMaterial color={JACKET2} roughness={0.6} />
      </mesh>
      {/* Collar */}
      <mesh position={[0, 0.28, 0.06]}>
        <boxGeometry args={[0.22, 0.08, 0.14]} />
        <meshStandardMaterial color={WHITE} roughness={0.7} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.36, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.08, 0.18, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.8} />
      </mesh>
      {/* Shoulder seams */}
      {([-0.225, 0.225] as const).map((px, i) => (
        <mesh key={i} position={[px, 0.24, 0]}>
          <boxGeometry args={[0.01, 0.08, 0.24]} />
          <meshStandardMaterial color={JACKET2} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function Hips() {
  return (
    <group position={[0, 0.85, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.42, 0.22, 0.22]} />
        <meshStandardMaterial color={PANTS} roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.08, 0.12]}>
        <boxGeometry args={[0.38, 0.05, 0.01]} />
        <meshStandardMaterial color={BELT} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.08, 0.13]}>
        <boxGeometry args={[0.07, 0.06, 0.01]} />
        <meshStandardMaterial color="#c0a050" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  )
}

// ─── Animated limbs (pivot at joint origin) ───────────────────────────────────
// All child positions are RELATIVE to the pivot so rotation swings naturally.

// Leg pivot sits at the hip joint (top of thigh).
// Everything below is offset downward from [0,0,0].
function LegMesh({ side }: { side: -1 | 1 }) {
  const x = side * 0.115
  return (
    <>
      {/* Upper leg: center is 0.22 below pivot */}
      <mesh position={[x, -0.22, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.26, 6, 10]} />
        <meshStandardMaterial color={PANTS} roughness={0.75} />
      </mesh>
      {/* Knee */}
      <mesh position={[x, -0.44, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color={PANTS} roughness={0.7} />
      </mesh>
      {/* Lower leg */}
      <mesh position={[x, -0.64, 0]} castShadow>
        <capsuleGeometry args={[0.085, 0.24, 6, 10]} />
        <meshStandardMaterial color={PANTS} roughness={0.75} />
      </mesh>
      {/* Shoe: absolute y≈0.04 → relative y = 0.04 - 0.82 = -0.78 */}
      <mesh position={[x, -0.78, 0.04]} castShadow>
        <boxGeometry args={[0.13, 0.09, 0.24]} />
        <meshStandardMaterial color={SHOE} roughness={0.6} />
      </mesh>
    </>
  )
}

// Arm pivot sits at the shoulder (top-side of torso).
// Everything below is offset downward from [0,0,0].
function ArmMesh({ side }: { side: -1 | 1 }) {
  const x = side * 0.295
  return (
    <>
      {/* Upper arm: center 0.3 below shoulder pivot */}
      <mesh position={[x, -0.30, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.28, 6, 10]} />
        <meshStandardMaterial color={JACKET} roughness={0.7} />
      </mesh>
      {/* Elbow */}
      <mesh position={[x, -0.49, 0]}>
        <sphereGeometry args={[0.075, 8, 8]} />
        <meshStandardMaterial color={JACKET2} roughness={0.6} />
      </mesh>
      {/* Forearm */}
      <mesh position={[x, -0.67, 0]} castShadow>
        <capsuleGeometry args={[0.065, 0.22, 6, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.75} />
      </mesh>
      {/* Hand */}
      <mesh position={[x, -0.85, 0]} castShadow>
        <sphereGeometry args={[0.075, 10, 10]} />
        <meshStandardMaterial color={SKIN} roughness={0.75} />
      </mesh>
    </>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  isMovingRef: { current: boolean }
}

export function HumanCharacter({ isMovingRef }: Props) {
  // One pivot group per limb — we rotate these around X
  const leftLegRef  = useRef<THREE.Group>(null!)
  const rightLegRef = useRef<THREE.Group>(null!)
  const leftArmRef  = useRef<THREE.Group>(null!)
  const rightArmRef = useRef<THREE.Group>(null!)

  const walkPhase = useRef(0)

  useFrame((_, delta) => {
    const moving = isMovingRef.current

    // Advance phase while moving; freeze in place when stopped
    if (moving) walkPhase.current += delta * 7

    const swing = Math.sin(walkPhase.current)

    // Target rotations
    const legTarget = moving ? swing * 0.5  : 0
    const armTarget = moving ? swing * 0.38 : 0

    // Smooth lerp back to rest when stopped; snap during walk
    const f = moving ? 0.25 : 0.10

    if (leftLegRef.current)  leftLegRef.current.rotation.x  = THREE.MathUtils.lerp(leftLegRef.current.rotation.x,   legTarget, moving ? 1 : f)
    if (rightLegRef.current) rightLegRef.current.rotation.x = THREE.MathUtils.lerp(rightLegRef.current.rotation.x, -legTarget, moving ? 1 : f)
    // Arms swing opposite to same-side leg
    if (leftArmRef.current)  leftArmRef.current.rotation.x  = THREE.MathUtils.lerp(leftArmRef.current.rotation.x,  -armTarget, moving ? 1 : f)
    if (rightArmRef.current) rightArmRef.current.rotation.x = THREE.MathUtils.lerp(rightArmRef.current.rotation.x,  armTarget, moving ? 1 : f)
  })

  return (
    <>
      {/* Static parts */}
      <Head />
      <Torso />
      <Hips />

      {/* Leg pivot groups — positioned at hip joint height */}
      <group ref={leftLegRef}  position={[0, 0.82, 0]}><LegMesh side={-1} /></group>
      <group ref={rightLegRef} position={[0, 0.82, 0]}><LegMesh side={ 1} /></group>

      {/* Arm pivot groups — positioned at shoulder height */}
      <group ref={leftArmRef}  position={[0, 1.47, 0]}><ArmMesh side={-1} /></group>
      <group ref={rightArmRef} position={[0, 1.47, 0]}><ArmMesh side={ 1} /></group>
    </>
  )
}
