import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import { SpaceStation }      from './components/world/SpaceStation'
import { SpaceEnvironment }  from './components/world/Environment'
import { HolographicPanel }  from './components/world/HolographicPanel'
import { CharacterController } from './components/character/CharacterController'
import { PanelOverlay }      from './components/ui/PanelOverlay'
import { HUD }               from './components/ui/HUD'

const PANELS: { id: 'about' | 'projects' | 'contact' | 'skills'; position: [number, number, number]; rotation: [number, number, number] }[] = [
  { id: 'about',    position: [0, 1.2,  -11.5], rotation: [0, 0, 0] },
  { id: 'projects', position: [11.5, 1.2, 0],   rotation: [0, -Math.PI / 2, 0] },
  { id: 'contact',  position: [0, 1.2,   11.5], rotation: [0, Math.PI, 0] },
  { id: 'skills',   position: [-11.5, 1.2, 0],  rotation: [0, Math.PI / 2, 0] },
]

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#020b18', overflow: 'hidden' }}>
      <Canvas
        shadows
        camera={{ position: [0, 4, 12], fov: 60, near: 0.1, far: 500 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.8 }}
      >
        <Suspense fallback={null}>
          <SpaceEnvironment />
          <SpaceStation />
          {PANELS.map((p) => (
            <HolographicPanel key={p.id} id={p.id} position={p.position} rotation={p.rotation} />
          ))}
          <CharacterController />
        </Suspense>
      </Canvas>

      <PanelOverlay />
      <HUD />
    </div>
  )
}
